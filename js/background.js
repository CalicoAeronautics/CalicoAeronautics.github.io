/* ==========================================================================
   Starfield: slow-drifting stars + a shooting star every 15-20s.
   Respects prefers-reduced-motion by freezing to a static field.
   ========================================================================== */
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'starfield';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let stars = [];
  let shooting = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.floor((w * h) / 9000);
    stars = new Array(count).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      baseAlpha: Math.random() * 0.6 + 0.3,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.03,
      driftY: (Math.random() - 0.5) * 0.015,
    }));
  }

  function spawnShootingStar() {
    const startX = Math.random() * w * 0.6 + w * 0.1;
    const startY = Math.random() * h * 0.3;
    const angle = Math.PI / 4 + (Math.random() * 0.3 - 0.15);
    const speed = Math.random() * 6 + 9;
    shooting.push({
      x: startX, y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      trail: [],
    });
  }

  function scheduleShootingStar() {
    const delay = (15 + Math.random() * 5) * 1000; // 15-20s
    setTimeout(() => {
      if (!reduceMotion) spawnShootingStar();
      scheduleShootingStar();
    }, delay);
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);

    // stars
    for (const s of stars) {
      if (!reduceMotion) {
        s.x += s.driftX;
        s.y += s.driftY;
        if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;
        s.phase += s.twinkleSpeed;
      }
      const alpha = reduceMotion ? s.baseAlpha : s.baseAlpha + Math.sin(s.phase) * 0.25;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, alpha))})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // shooting stars
    shooting = shooting.filter(s => s.life > 0);
    for (const s of shooting) {
      s.trail.push({ x: s.x, y: s.y });
      if (s.trail.length > 18) s.trail.shift();
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.012;

      for (let i = 0; i < s.trail.length; i++) {
        const p = s.trail[i];
        const a = (i / s.trail.length) * s.life * 0.8;
        ctx.beginPath();
        ctx.fillStyle = `rgba(243,237,224,${a})`;
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
  scheduleShootingStar();
})();
