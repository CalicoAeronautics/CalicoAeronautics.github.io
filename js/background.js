/* ==========================================================================
   Sky background: Night shows stars + shooting stars, Day shows a sun and
   drifting clouds. Both modes get an occasional small aircraft silhouette
   crossing the sky, trailing a contrail. Switches live with the theme
   toggle - no page reload needed. Respects prefers-reduced-motion.
   ========================================================================== */
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'starfield';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let stars = [], clouds = [], shooting = [], planes = [];
  let w, h;

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'day' ? 'day' : 'night';
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    const starCount = Math.floor((w * h) / 9000);
    stars = new Array(starCount).fill(0).map(() => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      baseAlpha: Math.random() * 0.6 + 0.3,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.03,
      driftY: (Math.random() - 0.5) * 0.015,
    }));

    const cloudCount = Math.max(4, Math.floor(w / 260));
    clouds = new Array(cloudCount).fill(0).map(() => ({
      x: Math.random() * w, y: Math.random() * h * 0.55,
      scale: Math.random() * 0.7 + 0.6,
      speed: Math.random() * 0.06 + 0.02,
      opacity: Math.random() * 0.25 + 0.35,
    }));
  }

  function spawnShootingStar() {
    const startX = Math.random() * w * 0.6 + w * 0.1;
    const startY = Math.random() * h * 0.3;
    const angle = Math.PI / 4 + (Math.random() * 0.3 - 0.15);
    const speed = Math.random() * 6 + 9;
    shooting.push({ x: startX, y: startY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, trail: [] });
  }

  function scheduleShootingStar() {
    const delay = (15 + Math.random() * 5) * 1000;
    setTimeout(() => {
      if (!reduceMotion && currentTheme() === 'night') spawnShootingStar();
      scheduleShootingStar();
    }, delay);
  }

  function spawnPlane() {
    const y = h * (0.12 + Math.random() * 0.35);
    const dir = Math.random() < 0.5 ? 1 : -1;
    planes.push({
      x: dir === 1 ? -40 : w + 40, y,
      dir, speed: (1.1 + Math.random() * 0.6) * dir,
      trail: [],
    });
  }

  function schedulePlane() {
    const delay = (20 + Math.random() * 20) * 1000;
    setTimeout(() => {
      if (!reduceMotion) spawnPlane();
      schedulePlane();
    }, delay);
  }

  function drawCloud(c) {
    const s = c.scale;
    ctx.fillStyle = `rgba(255,255,255,${c.opacity})`;
    [[0, 0, 26], [22, -6, 20], [-22, -4, 20], [10, 8, 22], [-10, 8, 20]].forEach(([dx, dy, r]) => {
      ctx.beginPath();
      ctx.arc(c.x + dx * s, c.y + dy * s, r * s, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawPlane(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    if (p.dir < 0) ctx.scale(-1, 1);
    ctx.fillStyle = '#E29B3F';
    ctx.beginPath();
    ctx.moveTo(10, 0); ctx.lineTo(-8, -3); ctx.lineTo(-4, 0); ctx.lineTo(-8, 3);
    ctx.closePath(); ctx.fill();
    ctx.restore();

    ctx.strokeStyle = 'rgba(226,155,63,0.25)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    p.trail.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
    ctx.stroke();
  }

  function draw() {
    const theme = currentTheme();
    ctx.clearRect(0, 0, w, h);

    if (theme === 'day') {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#BEE3F8');
      grad.addColorStop(1, '#E3F3FC');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const sunX = w * 0.82, sunY = h * 0.14;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 90);
      sunGlow.addColorStop(0, 'rgba(255,229,153,0.9)');
      sunGlow.addColorStop(1, 'rgba(255,229,153,0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath(); ctx.arc(sunX, sunY, 90, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FFE28F';
      ctx.beginPath(); ctx.arc(sunX, sunY, 34, 0, Math.PI * 2); ctx.fill();

      clouds.forEach(c => {
        if (!reduceMotion) {
          c.x += c.speed;
          if (c.x > w + 80) c.x = -80;
        }
        drawCloud(c);
      });
    } else {
      for (const s of stars) {
        if (!reduceMotion) {
          s.x += s.driftX; s.y += s.driftY;
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

      shooting = shooting.filter(s => s.life > 0);
      for (const s of shooting) {
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 18) s.trail.shift();
        s.x += s.vx; s.y += s.vy; s.life -= 0.012;
        for (let i = 0; i < s.trail.length; i++) {
          const p = s.trail[i];
          const a = (i / s.trail.length) * s.life * 0.8;
          ctx.beginPath();
          ctx.fillStyle = `rgba(243,237,224,${a})`;
          ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    planes = planes.filter(p => p.dir > 0 ? p.x < w + 60 : p.x > -60);
    for (const p of planes) {
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 40) p.trail.shift();
      if (!reduceMotion) p.x += p.speed;
      drawPlane(p);
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
  scheduleShootingStar();
  schedulePlane();
})();
