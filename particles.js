// ============================================================
// AURO AI — Ambient particle background
// A quiet field of gold/blue motes drifting behind the UI.
// Pure decoration — kept subtle so it never competes with the avatar.
// ============================================================

(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const COUNT = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 18000));

  function makeParticle() {
    const isGold = Math.random() > 0.55;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      alpha: Math.random() * 0.5 + 0.15,
      color: isGold ? '212,175,55' : '79,195,247',
      pulseSpeed: Math.random() * 0.015 + 0.005,
      pulsePhase: Math.random() * Math.PI * 2
    };
  }

  for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, w, h);

    // very faint vignette to seat particles in the black
    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 1.2);
    grad.addColorStop(0, 'rgba(22,36,58,0.25)');
    grad.addColorStop(1, 'rgba(7,7,10,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    particles.forEach(p => {
      if (!prefersReducedMotion) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }
      const pulse = Math.sin(t * p.pulseSpeed + p.pulsePhase) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha * pulse})`;
      ctx.fill();
    });

    t++;
    requestAnimationFrame(draw);
  }

  draw();
})();
