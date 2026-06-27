// ============================================================
// AURO AI — 3D Avatar System: Original Superhero Archetypes
//
// IMPORTANT: These are original character designs inspired by
// general superhero ARCHETYPES (armored inventor, agile acrobat,
// trickster, clawed brawler, storm warrior, shielded guardian,
// masked wisecracker). They are NOT Iron Man, Spider-Man, Loki,
// Wolverine, Thor, Captain America, or Deadpool — those are
// Marvel/Disney-owned trademarked characters and cannot be
// reproduced. Each character here has its own original name,
// palette, and design so the portfolio stays fully clear of any
// IP/copyright issues.
//
// 7 characters auto-rotate every 15 minutes; visitors can also
// pick one manually via the selector UI.
// ============================================================

(function () {
  const canvas = document.getElementById('avatar-canvas');
  const stage = canvas.parentElement;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, stage.clientWidth / stage.clientHeight, 0.1, 100);
  camera.position.set(0, 0.15, 6.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(stage.clientWidth, stage.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ---------- Lighting ----------
  const keyLight = new THREE.DirectionalLight(0xfff4dd, 1.4);
  keyLight.position.set(2.5, 3, 4);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x4fc3f7, 0.9);
  rimLight.position.set(-3, 1, -2);
  scene.add(rimLight);

  const fillLight = new THREE.AmbientLight(0x2a2a3a, 0.7);
  scene.add(fillLight);

  const accentPoint = new THREE.PointLight(0xd4af37, 0.6, 8);
  accentPoint.position.set(0, -1, 3);
  scene.add(accentPoint);

  // ============================================================
  // CHARACTER DEFINITIONS — 7 original archetypes
  // Each is built procedurally from primitives, no external assets.
  // ============================================================

  const CHARACTERS = [
    {
      id: 'forgewright',
      name: 'Forgewright',
      tag: 'Armored Tech Inventor',
      colors: { primary: 0xB5121B, secondary: 0xD4AF37, glow: 0xFFA940, visor: 0x4FC3F7 },
      build: buildArmoredInventor
    },
    {
      id: 'tendril',
      name: 'Tendril',
      tag: 'Agile Acrobat',
      colors: { primary: 0x1B1B2A, secondary: 0xC0392B, glow: 0x4FC3F7, visor: 0xF5F1E8 },
      build: buildAcrobat
    },
    {
      id: 'mischa',
      name: 'Mischa',
      tag: 'Trickster Mage',
      colors: { primary: 0x2E7D32, secondary: 0xD4AF37, glow: 0x66BB6A, visor: 0x1A1A1A },
      build: buildTrickster
    },
    {
      id: 'ferren',
      name: 'Ferren',
      tag: 'Clawed Brawler',
      colors: { primary: 0xFFC857, secondary: 0x2B2B2B, glow: 0xFFD54F, visor: 0x1A1A1A },
      build: buildBrawler
    },
    {
      id: 'tempestra',
      name: 'Tempestra',
      tag: 'Storm Warrior',
      colors: { primary: 0xC62828, secondary: 0x90A4AE, glow: 0x4FC3F7, visor: 0xECEFF1 },
      build: buildStormWarrior
    },
    {
      id: 'aegis',
      name: 'Aegis',
      tag: 'Shielded Guardian',
      colors: { primary: 0x1565C0, secondary: 0xD4AF37, glow: 0xD4AF37, visor: 0xF5F1E8 },
      build: buildGuardian
    },
    {
      id: 'quip',
      name: 'Quip',
      tag: 'Masked Wisecracker',
      colors: { primary: 0x6A1B9A, secondary: 0x1A1A1A, glow: 0xAB47BC, visor: 0xF5F1E8 },
      build: buildWisecracker
    }
  ];

  // ---------- Shared helper builders ----------

  function makeMat(color, opts = {}) {
    return new THREE.MeshStandardMaterial({ color, roughness: opts.roughness ?? 0.45, metalness: opts.metalness ?? 0.25, ...opts.extra });
  }

  function baseBody(group, primaryMat, secondaryMat) {
    // Shared torso/neck/shoulder base so all characters feel proportionally consistent
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 1.22, 1.4, 32), primaryMat);
    torso.position.y = -1.05;
    group.add(torso);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.35, 24), primaryMat);
    neck.position.y = 0.05;
    group.add(neck);

    const chestAccent = new THREE.Mesh(new THREE.CircleGeometry(0.28, 32), secondaryMat);
    chestAccent.position.set(0, -0.7, 1.18);
    group.add(chestAccent);

    return { torso, neck, chestAccent };
  }

  function baseHead(group, skinOrShellMat) {
    const head = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), skinOrShellMat);
    head.scale.set(0.92, 1.0, 0.95);
    head.position.y = 0.9;
    group.add(head);
    return head;
  }

  // ---------- 1. Forgewright — Armored Tech Inventor ----------
  function buildArmoredInventor(colors) {
    const g = new THREE.Group();
    const primary = makeMat(colors.primary, { metalness: 0.7, roughness: 0.3 });
    const secondary = makeMat(colors.secondary, { metalness: 0.8, roughness: 0.2 });
    const glow = new THREE.MeshBasicMaterial({ color: colors.glow });

    baseBody(g, primary, secondary);

    // full helmet (no visible face — classic armored helm)
    const helmet = baseHead(g, primary);
    const faceplate = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), secondary);
    faceplate.scale.set(0.85, 0.95, 0.6);
    faceplate.position.set(0, 0.82, 0.45);
    g.add(faceplate);

    [-1, 1].forEach(side => {
      const eyeSlit = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.05), glow);
      eyeSlit.position.set(side * 0.25, 0.92, 0.92);
      g.add(eyeSlit);
    });

    // chest core glow (signature detail)
    const core = new THREE.Mesh(new THREE.CircleGeometry(0.22, 32), glow);
    core.position.set(0, -0.7, 1.19);
    g.add(core);

    // shoulder plating
    [-1, 1].forEach(side => {
      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), secondary);
      shoulder.position.set(side * 1.05, -0.35, 0.1);
      g.add(shoulder);
    });

    return { group: g, glowMeshes: [core, ...g.children.filter(c => c.material === glow)] };
  }

  // ---------- 2. Tendril — Agile Acrobat ----------
  function buildAcrobat(colors) {
    const g = new THREE.Group();
    const primary = makeMat(colors.primary, { roughness: 0.55, metalness: 0.1 });
    const secondary = makeMat(colors.secondary, { roughness: 0.5 });
    const visorMat = makeMat(colors.visor, { roughness: 0.15, metalness: 0.4 });

    baseBody(g, primary, secondary);
    baseHead(g, primary);

    // full mask with large angular visor lenses
    [-1, 1].forEach(side => {
      const lens = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), visorMat);
      lens.scale.set(1, 1.3, 0.5);
      lens.position.set(side * 0.32, 0.95, 0.85);
      g.add(lens);
    });

    // web-like accent lines on head (thin secondary-color stripes)
    for (let i = 0; i < 5; i++) {
      const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.012, 6, 24, Math.PI * 0.4), secondary);
      stripe.position.y = 0.9;
      stripe.rotation.set(Math.PI / 2, 0, (i / 5) * Math.PI * 2);
      g.add(stripe);
    }

    return { group: g };
  }

  // ---------- 3. Mischa — Trickster Mage ----------
  function buildTrickster(colors) {
    const g = new THREE.Group();
    const primary = makeMat(colors.primary, { roughness: 0.4, metalness: 0.3 });
    const secondary = makeMat(colors.secondary, { roughness: 0.3, metalness: 0.6 });
    const skin = makeMat(0xC68A5E);
    const glow = new THREE.MeshBasicMaterial({ color: colors.glow });

    baseBody(g, primary, secondary);
    baseHead(g, skin);

    // angular crown/horns motif (original, not Loki's helmet)
    [-1, 1].forEach(side => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.55, 12), secondary);
      horn.position.set(side * 0.5, 1.55, -0.1);
      horn.rotation.z = side * 0.35;
      g.add(horn);
    });

    // sly half-lidded eyes
    [-1, 1].forEach(side => {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.05), new THREE.MeshStandardMaterial({ color: colors.glow, emissive: colors.glow, emissiveIntensity: 0.6 }));
      eye.position.set(side * 0.3, 0.98, 0.88);
      g.add(eye);
    });

    // floating rune ring near hand height (decorative magic motif)
    const rune = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.02, 8, 32), glow);
    rune.position.set(1.3, -0.6, 0.4);
    g.add(rune);

    return { group: g, glowMeshes: [rune] };
  }

  // ---------- 4. Ferren — Clawed Brawler ----------
  function buildBrawler(colors) {
    const g = new THREE.Group();
    const primary = makeMat(colors.primary, { roughness: 0.6 });
    const secondary = makeMat(colors.secondary, { roughness: 0.5 });
    const skin = makeMat(0xB97A56);

    const { torso } = baseBody(g, primary, secondary);
    torso.scale.set(1.15, 1.05, 1.15); // broader build

    baseHead(g, skin);

    // short spiked hair silhouette
    for (let i = -2; i <= 2; i++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.32, 8), secondary);
      spike.position.set(i * 0.18, 1.55, -0.05 + Math.abs(i) * -0.05);
      spike.rotation.z = i * -0.12;
      g.add(spike);
    }

    // claw motif on knuckle area (small accent, not a direct copy of any specific design)
    [-1, 1].forEach(side => {
      for (let i = 0; i < 3; i++) {
        const claw = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.18, 6), secondary);
        claw.position.set(side * 1.1, -1.55, 0.3 + i * 0.12);
        claw.rotation.x = Math.PI / 2.3;
        g.add(claw);
      }
    });

    return { group: g };
  }

  // ---------- 5. Tempestra — Storm Warrior ----------
  function buildStormWarrior(colors) {
    const g = new THREE.Group();
    const primary = makeMat(colors.primary, { roughness: 0.5, metalness: 0.2 });
    const secondary = makeMat(colors.secondary, { roughness: 0.3, metalness: 0.7 });
    const skin = makeMat(0xE0A878);
    const glow = new THREE.MeshBasicMaterial({ color: colors.glow });

    baseBody(g, primary, secondary);
    baseHead(g, skin);

    // winged helm motif (original geometric wings, not a copied design)
    [-1, 1].forEach(side => {
      const wing = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 4), secondary);
      wing.position.set(side * 0.55, 1.5, -0.15);
      wing.rotation.set(0, 0, side * 0.5);
      wing.scale.set(1, 1, 0.3);
      g.add(wing);
    });

    // braided hair suggestion (simple cylinder accents)
    const hair = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5), makeMat(0xD4AF37, { roughness: 0.4 }));
    hair.position.y = 0.92;
    g.add(hair);

    // small electric arcs near shoulders (storm motif, ties into halo ring theme)
    [-1, 1].forEach(side => {
      const arc = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.02, 6, 16, Math.PI), glow);
      arc.position.set(side * 1.0, -0.3, 0.3);
      arc.rotation.z = Math.PI / 2;
      g.add(arc);
    });

    return { group: g };
  }

  // ---------- 6. Aegis — Shielded Guardian ----------
  function buildGuardian(colors) {
    const g = new THREE.Group();
    const primary = makeMat(colors.primary, { roughness: 0.4, metalness: 0.3 });
    const secondary = makeMat(colors.secondary, { roughness: 0.3, metalness: 0.6 });
    const skin = makeMat(0xC68A5E);

    baseBody(g, primary, secondary);
    baseHead(g, skin);

    // simple domed cowl (original, distinct silhouette)
    const cowl = new THREE.Mesh(new THREE.SphereGeometry(1.02, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55), primary);
    cowl.position.y = 0.92;
    g.add(cowl);

    // star-shaped chest emblem substitute: simple original geometric badge
    const badge = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), secondary);
    badge.position.set(0, -0.7, 1.2);
    g.add(badge);

    // round shield prop, held at the side (original design, plain geometric pattern)
    const shieldGroup = new THREE.Group();
    const shieldBase = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.08, 32), secondary);
    shieldBase.rotation.x = Math.PI / 2;
    const shieldRing = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.05, 8, 32), primary);
    shieldRing.rotation.x = Math.PI / 2;
    shieldGroup.add(shieldBase, shieldRing);
    shieldGroup.position.set(-1.5, -0.8, 0.2);
    shieldGroup.rotation.y = 0.3;
    g.add(shieldGroup);

    return { group: g };
  }

  // ---------- 7. Quip — Masked Wisecracker ----------
  function buildWisecracker(colors) {
    const g = new THREE.Group();
    const primary = makeMat(colors.primary, { roughness: 0.45, metalness: 0.15 });
    const secondary = makeMat(colors.secondary, { roughness: 0.4 });
    const visorMat = new THREE.MeshStandardMaterial({ color: colors.visor, roughness: 0.2, emissive: colors.visor, emissiveIntensity: 0.25 });

    baseBody(g, primary, secondary);

    // Head: split into a dark lower mask + bright primary upper mask for contrast,
    // so it never reads as a single flat-colored sphere
    const headLower = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), secondary);
    headLower.scale.set(0.92, 1.0, 0.95);
    headLower.position.y = 0.9;
    g.add(headLower);

    const headUpper = new THREE.Mesh(
      new THREE.SphereGeometry(1.01, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.55),
      primary
    );
    headUpper.scale.set(0.92, 1.0, 0.95);
    headUpper.position.y = 0.9;
    g.add(headUpper);

    // diagonal secondary-color stripe across the mask (clear graphic break-up)
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.22, 1.0), primary);
    stripe.position.set(0, 0.78, 0.3);
    stripe.rotation.z = 0.25;
    g.add(stripe);

    // large, bright, clearly-visible diamond eyes (sized up + emissive so they read at a glance)
    [-1, 1].forEach(side => {
      const eye = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.3, 4), visorMat);
      eye.rotation.z = Math.PI / 4;
      eye.position.set(side * 0.34, 0.98, 0.93);
      g.add(eye);
    });

    // patchwork accent patches on the suit (kept off the face so the face stays readable)
    const patchPositions = [
      [-0.65, -1.3, 0.85], [0.7, -0.9, 0.9], [-0.4, -0.6, 1.05], [0.5, -1.5, 0.7]
    ];
    patchPositions.forEach((pos, i) => {
      const patch = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.02), i % 2 === 0 ? secondary : primary);
      patch.position.set(...pos);
      patch.rotation.z = (i % 2 === 0 ? 1 : -1) * 0.3;
      g.add(patch);
    });

    return { group: g };
  }

  // ============================================================
  // Character mounting / switching system
  // ============================================================

  let currentGroup = null;
  let currentGlowMeshes = [];
  let currentIndex = 0;

  function mountCharacter(index) {
    if (currentGroup) {
      scene.remove(currentGroup);
    }
    const def = CHARACTERS[index];
    const built = def.build(def.colors);
    currentGroup = built.group;
    currentGlowMeshes = built.glowMeshes || [];
    currentGroup.position.y = -0.3;
    scene.add(currentGroup);
    currentIndex = index;
    updateLabel(def);
    return def;
  }

  function updateLabel(def) {
    const nameEl = document.querySelector('.avatar-name');
    const tagEl = document.querySelector('.avatar-status .char-tag');
    if (nameEl) nameEl.textContent = def.name;
    if (tagEl) tagEl.textContent = def.tag;
  }

  // ---------- Signature element: voice-reactive halo ring (kept consistent across all characters) ----------
  const ringGroup = new THREE.Group();
  ringGroup.position.y = 0.9;

  const haloRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.55, 0.018, 8, 96),
    new THREE.MeshBasicMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.55 })
  );
  haloRing.rotation.x = Math.PI / 2;
  ringGroup.add(haloRing);

  const arcCount = 24;
  const arcs = [];
  for (let i = 0; i < arcCount; i++) {
    const arcGeo = new THREE.TorusGeometry(1.55, 0.022, 6, 8, (Math.PI * 2) / arcCount * 0.6);
    const arcMat = new THREE.MeshBasicMaterial({ color: 0x4FC3F7, transparent: true, opacity: 0 });
    const arc = new THREE.Mesh(arcGeo, arcMat);
    arc.rotation.x = Math.PI / 2;
    arc.rotation.z = (Math.PI * 2 / arcCount) * i;
    ringGroup.add(arc);
    arcs.push(arc);
  }
  scene.add(ringGroup);

  // ---------- Resize handling ----------
  function onResize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // ---------- Drag-to-rotate ----------
  let isDragging = false, prevX = 0, targetRotY = 0, currentRotY = 0;
  canvas.addEventListener('pointerdown', e => { isDragging = true; prevX = e.clientX; });
  window.addEventListener('pointerup', () => { isDragging = false; });
  window.addEventListener('pointermove', e => {
    if (!isDragging) return;
    const dx = e.clientX - prevX;
    targetRotY += dx * 0.005;
    prevX = e.clientX;
  });

  // ---------- Public API ----------
  let speakingAmplitude = 0;
  window.AuroAvatar = {
    setSpeaking(amplitude) { speakingAmplitude = amplitude; },
    setListening(active) {
      haloRing.material.color.set(active ? 0x4FC3F7 : 0xD4AF37);
    },
    switchTo(index) {
      mountCharacter(((index % CHARACTERS.length) + CHARACTERS.length) % CHARACTERS.length);
    },
    next() {
      mountCharacter((currentIndex + 1) % CHARACTERS.length);
    },
    getCharacters() { return CHARACTERS.map(c => ({ id: c.id, name: c.name, tag: c.tag })); },
    getCurrentIndex() { return currentIndex; }
  };

  // ---------- Auto-rotation every 15 minutes ----------
  const FIFTEEN_MIN = 15 * 60 * 1000;
  setInterval(() => window.AuroAvatar.next(), FIFTEEN_MIN);

  // ---------- Boot with first character ----------
  mountCharacter(0);

  // ---------- Animation loop ----------
  let clock = new THREE.Clock();
  let idlePhase = 0;

  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    idlePhase += dt;

    if (currentGroup) {
      currentGroup.position.y = -0.3 + Math.sin(idlePhase * 1.1) * 0.025;
      currentRotY += (targetRotY - currentRotY) * 0.08;
      currentGroup.rotation.y = 0.15 * Math.sin(idlePhase * 0.3) + currentRotY;

      // glow pulsing for any character-specific emissive accents
      currentGlowMeshes.forEach(m => {
        const pulse = 0.6 + Math.sin(idlePhase * 2) * 0.4;
        if (m.material && 'opacity' in m.material) m.material.opacity = pulse;
      });
    }

    ringGroup.rotation.z += dt * 0.08;

    arcs.forEach((arc, i) => {
      const wave = Math.sin(idlePhase * 6 + i * 0.5) * 0.5 + 0.5;
      const target = speakingAmplitude > 0.02 ? speakingAmplitude * wave : 0;
      arc.material.opacity += (target - arc.material.opacity) * 0.25;
      const s = 1 + target * 0.12;
      arc.scale.set(s, s, s);
    });

    haloRing.material.opacity = 0.4 + speakingAmplitude * 0.4;
    const ringScale = 1 + speakingAmplitude * 0.06;
    ringGroup.scale.set(ringScale, ringScale, ringScale);

    renderer.render(scene, camera);
  }
  animate();
})();
