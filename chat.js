// ============================================================
// AURO AI — Chat logic, intent matching, and voice (TTS/STT)
// ============================================================

(function () {
  const messagesEl = document.getElementById('messages');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const micBtn = document.getElementById('mic-btn');
  const voiceToggle = document.getElementById('voice-toggle');
  const suggestionsEl = document.getElementById('suggestions');

  let voiceRepliesOn = true;
  voiceToggle.classList.add('active');

  // ---------- Message rendering ----------
  function addMessage(role, text) {
    const wrap = document.createElement('div');
    wrap.className = `msg ${role}`;

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = role === 'auro' ? 'Auro' : 'You';

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;

    wrap.appendChild(label);
    wrap.appendChild(bubble);
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  let typingEl = null;
  function showTyping() {
    typingEl = document.createElement('div');
    typingEl.className = 'msg auro';
    typingEl.innerHTML = `<div class="label">Auro</div><div class="bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function hideTyping() {
    if (typingEl) { typingEl.remove(); typingEl = null; }
  }

  function renderSuggestions(list) {
    suggestionsEl.innerHTML = '';
    list.forEach(text => {
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.textContent = text;
      chip.addEventListener('click', () => handleUserMessage(text));
      suggestionsEl.appendChild(chip);
    });
  }

  const STARTER_SUGGESTIONS = [
    "What does he do at SMIFS?",
    "What are his skills?",
    "Tell me about his projects",
    "How can I contact him?"
  ];

  // ---------- Intent matching (simple keyword scoring) ----------
  function matchIntent(query) {
    const q = query.toLowerCase();
    let best = null, bestScore = 0;
    AURO_INTENTS.forEach(intent => {
      let score = 0;
      intent.patterns.forEach(p => { if (q.includes(p)) score += p.length; });
      if (score > bestScore) { bestScore = score; best = intent; }
    });
    return bestScore > 0 ? best : null;
  }

  function fallbackResponse() {
    return `I don't have a specific answer for that yet, but I can tell you about ${AURO_KNOWLEDGE.person.name}'s experience, skills, education, projects, or how to get in touch. What would you like to know?`;
  }

  // ---------- Speaking simulation for the avatar halo ----------
  // (Drives the visual amplitude when no real audio analyser is available,
  // e.g. before TTS fires or if speech synthesis is unsupported.)
  function simulateSpeakingFor(durationMs) {
    const start = performance.now();
    function tick() {
      const elapsed = performance.now() - start;
      if (elapsed > durationMs) {
        window.AuroAvatar.setSpeaking(0);
        return;
      }
      const amp = 0.4 + Math.random() * 0.6;
      window.AuroAvatar.setSpeaking(amp);
      requestAnimationFrame(tick);
    }
    tick();
  }

  // ---------- Text-to-speech ----------
  let voicesReady = false;
  let preferredVoice = null;

  function pickVoice() {
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return;

    // Explicitly prefer a male-sounding English voice.
    // Common male voice names across Chrome/Edge/Safari engines.
    const maleNameHints = /male|david|daniel|alex|fred|aaron|guy|ryan|matthew|james|mark|rishi|arnav|prabhat/i;
    const femaleNameHints = /female|zira|samantha|susan|karen|victoria|fiona|moira|tessa|veena|heera/i;

    const candidates = voices.filter(v => /en/i.test(v.lang));

    preferredVoice =
      candidates.find(v => /en-IN/i.test(v.lang) && maleNameHints.test(v.name)) ||
      candidates.find(v => maleNameHints.test(v.name)) ||
      candidates.find(v => /en-IN/i.test(v.lang) && !femaleNameHints.test(v.name)) ||
      candidates.find(v => /en-GB/i.test(v.lang) && !femaleNameHints.test(v.name)) ||
      candidates.find(v => !femaleNameHints.test(v.name)) ||
      voices[0];

    voicesReady = true;
  }
  if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = pickVoice;
    pickVoice();
  }

  function speak(text) {
    if (!voiceRepliesOn || !('speechSynthesis' in window)) {
      simulateSpeakingFor(Math.min(text.length * 35, 4000));
      return;
    }
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    if (preferredVoice) utter.voice = preferredVoice;
    utter.rate = 0.98;
    utter.pitch = 0.85;

    utter.onstart = () => {
      const approxDuration = Math.max(1200, text.length * 55);
      simulateSpeakingFor(approxDuration);
    };
    utter.onend = () => window.AuroAvatar.setSpeaking(0);
    utter.onerror = () => window.AuroAvatar.setSpeaking(0);

    speechSynthesis.speak(utter);
  }

  voiceToggle.addEventListener('click', () => {
    voiceRepliesOn = !voiceRepliesOn;
    voiceToggle.classList.toggle('active', voiceRepliesOn);
    if (!voiceRepliesOn && 'speechSynthesis' in window) speechSynthesis.cancel();
  });

  // ---------- Speech-to-text (mic input) ----------
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognizer = null;
  let listening = false;

  if (SpeechRecognition) {
    recognizer = new SpeechRecognition();
    recognizer.continuous = false;
    recognizer.interimResults = false;
    recognizer.lang = 'en-IN';

    recognizer.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      inputEl.value = transcript;
      handleUserMessage(transcript);
    };
    recognizer.onend = () => {
      listening = false;
      micBtn.classList.remove('active');
      window.AuroAvatar.setListening(false);
    };
    recognizer.onerror = () => {
      listening = false;
      micBtn.classList.remove('active');
      window.AuroAvatar.setListening(false);
    };
  } else {
    micBtn.title = 'Voice input not supported in this browser';
    micBtn.style.opacity = '0.4';
  }

  micBtn.addEventListener('click', () => {
    if (!recognizer) return;
    if (listening) {
      recognizer.stop();
      return;
    }
    listening = true;
    micBtn.classList.add('active');
    window.AuroAvatar.setListening(true);
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    try { recognizer.start(); } catch (e) { /* already started guard */ }
  });

  // ---------- Core send/respond flow ----------
  function handleUserMessage(text) {
    text = text.trim();
    if (!text) return;

    addMessage('user', text);
    inputEl.value = '';
    suggestionsEl.innerHTML = '';

    const intent = matchIntent(text);
    const reply = intent ? intent.respond() : fallbackResponse();

    showTyping();
    const thinkTime = 350 + Math.random() * 350;
    setTimeout(() => {
      hideTyping();
      addMessage('auro', reply);
      speak(reply);
      renderSuggestions(STARTER_SUGGESTIONS.filter(s => s.toLowerCase() !== text.toLowerCase()).slice(0, 4));
    }, thinkTime);
  }

  sendBtn.addEventListener('click', () => handleUserMessage(inputEl.value));
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleUserMessage(inputEl.value);
  });

  // ---------- Boot ----------
  const greeting = `Hi, I'm Auro — ${AURO_KNOWLEDGE.person.name}'s AI assistant. Ask me anything about his work, skills, or background.`;
  addMessage('auro', greeting);
  renderSuggestions(STARTER_SUGGESTIONS);
  setTimeout(() => speak(greeting), 500);
})();
