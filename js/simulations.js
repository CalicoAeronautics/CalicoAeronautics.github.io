/* ==========================================================================
   Ten real simulations - semi-implicit Euler integration, actual vector
   rendering (force/velocity arrows), and drag interactions where they add
   value. No canned/parametric fake motion - every sim integrates its own
   equations of motion frame by frame.
   ========================================================================== */

function bindSlider(id, onChange) {
  const el = document.getElementById(id);
  if (!el) return;
  const labelVal = document.getElementById(id + '-val');
  const update = () => {
    if (labelVal) labelVal.textContent = el.value;
    onChange(parseFloat(el.value));
  };
  el.addEventListener('input', update);
  update();
}

function drawArrow(ctx, x0, y0, x1, y1, color, width) {
  width = width || 2;
  const dx = x1 - x0, dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  if (len < 1) return;
  const headLen = Math.min(9, len * 0.35);
  const angle = Math.atan2(dy, dx);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 - headLen * Math.cos(angle - Math.PI / 7), y1 - headLen * Math.sin(angle - Math.PI / 7));
  ctx.lineTo(x1 - headLen * Math.cos(angle + Math.PI / 7), y1 - headLen * Math.sin(angle + Math.PI / 7));
  ctx.closePath();
  ctx.fill();
}

function clampDt(dt) { return Math.min(Math.max(dt, 0), 0.033); }

/* ==========================================================================
   1. GRAVITY & ORBITAL MECHANICS - Newton's Law of Gravitation
   ========================================================================== */
(function gravitySim() {
  const canvas = document.getElementById('sim-gravity');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const G_SIM = 4000;
  let starMass = 800;
  let planet = { x: cx + 150, y: cy, vx: 0, vy: 95 };
  let trail = [];
  let lastT = null;

  function reset(speed, radius) {
    planet = { x: cx + radius, y: cy, vx: 0, vy: speed };
    trail = [];
  }

  function step(ts) {
    if (lastT === null) lastT = ts;
    const dt = clampDt((ts - lastT) / 1000) * 2.2;
    lastT = ts;

    const dx = cx - planet.x, dy = cy - planet.y;
    const r2 = dx * dx + dy * dy;
    const r = Math.sqrt(r2) || 1;
    const accel = (G_SIM * starMass) / r2;
    const ax = accel * (dx / r), ay = accel * (dy / r);

    planet.vx += ax * dt;
    planet.vy += ay * dt;
    planet.x += planet.vx * dt;
    planet.y += planet.vy * dt;

    trail.push({ x: planet.x, y: planet.y });
    if (trail.length > 220) trail.shift();

    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(139,143,199,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    trail.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();

    ctx.fillStyle = '#F2C14E';
    ctx.beginPath(); ctx.arc(cx, cy, 5 + Math.sqrt(starMass) * 0.35, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#8B8FC7';
    ctx.beginPath(); ctx.arc(planet.x, planet.y, 7, 0, Math.PI * 2); ctx.fill();

    const vScale = 0.4, aScale = 4000;
    drawArrow(ctx, planet.x, planet.y, planet.x + planet.vx * vScale, planet.y + planet.vy * vScale, '#5FA8D3');
    drawArrow(ctx, planet.x, planet.y, planet.x + ax * aScale, planet.y + ay * aScale, '#E29B3F');

    const readout = document.getElementById('gravity-readout');
    if (readout) {
      readout.innerHTML = `speed = <strong>${Math.hypot(planet.vx, planet.vy).toFixed(1)}</strong> px/s &middot; distance = <strong>${r.toFixed(0)}</strong> px`;
    }

    requestAnimationFrame(step);
  }

  bindSlider('gr-mass', v => { starMass = v; });
  let currentSpeed = 95, currentRadius = 150;
  bindSlider('gr-speed', v => { currentSpeed = v; });
  bindSlider('gr-radius', v => { currentRadius = v; });
  document.getElementById('gr-reset')?.addEventListener('click', () => reset(currentSpeed, currentRadius));

  reset(currentSpeed, currentRadius);
  requestAnimationFrame(step);
})();

/* ==========================================================================
   2. PROJECTILE MOTION WITH DRAG - 2D kinematics, quadratic air resistance
   ========================================================================== */
(function projectileDragSim() {
  const canvas = document.getElementById('sim-projectile');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const groundY = H - 24, originX = 30;
  const g = 9.8;
  let speed = 30, angleDeg = 45, dragCoef = 0.02;
  let state = null;
  let trail = [], idealTrail = [];
  let lastT = null;

  function launch() {
    const theta = (angleDeg * Math.PI) / 180;
    state = { x: originX, y: groundY, vx: speed * Math.cos(theta), vy: -speed * Math.sin(theta), t: 0 };
    trail = [{ x: state.x, y: state.y }];
    idealTrail = computeIdealPath(speed, theta);
    lastT = null;
  }

  function computeIdealPath(v0, theta) {
    const vx = v0 * Math.cos(theta), vy0 = v0 * Math.sin(theta);
    const tFlight = (2 * vy0) / g;
    const pts = [];
    for (let t = 0; t <= tFlight; t += tFlight / 60) {
      pts.push({ x: originX + vx * t * 6, y: groundY - (vy0 * t - 0.5 * g * t * t) * 6 });
    }
    return pts;
  }

  function step(ts) {
    if (state) {
      if (lastT === null) lastT = ts;
      const dt = clampDt((ts - lastT) / 1000);
      lastT = ts;

      const speedNow = Math.hypot(state.vx, state.vy);
      const dragAx = -dragCoef * speedNow * state.vx;
      const dragAy = -dragCoef * speedNow * state.vy;

      state.vx += dragAx * dt;
      state.vy += (g + dragAy) * dt;
      state.x += state.vx * dt * 6;
      state.y += state.vy * dt * 6;
      state.t += dt;

      trail.push({ x: state.x, y: state.y });
      if (state.y >= groundY) { state.y = groundY; state = null; }
    }

    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(243,237,224,0.15)';
    ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();

    ctx.strokeStyle = 'rgba(139,143,199,0.4)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    idealTrail.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#E29B3F';
    ctx.lineWidth = 2;
    ctx.beginPath();
    trail.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();

    if (state) {
      ctx.fillStyle = '#F0B968';
      ctx.beginPath(); ctx.arc(state.x, state.y, 6, 0, Math.PI * 2); ctx.fill();
      drawArrow(ctx, state.x, state.y, state.x + state.vx * 0.5, state.y + state.vy * 0.5, '#5FA8D3');
    } else if (trail.length) {
      const last = trail[trail.length - 1];
      ctx.fillStyle = '#F0B968';
      ctx.beginPath(); ctx.arc(last.x, last.y, 6, 0, Math.PI * 2); ctx.fill();
    }

    requestAnimationFrame(step);
  }

  bindSlider('pm-speed', v => { speed = v; });
  bindSlider('pm-angle', v => { angleDeg = v; });
  bindSlider('pm-drag', v => { dragCoef = v; });
  document.getElementById('pm-launch')?.addEventListener('click', launch);

  launch();
  requestAnimationFrame(step);
})();

/* ==========================================================================
   3. SPRING-MASS SYSTEM - damped SHM, drag to stretch and release
   ========================================================================== */
(function springSim() {
  const canvas = document.getElementById('sim-spring');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const anchorX = 40, midY = H / 2, restX = W / 2, mass = 1;
  let k = 6, damping = 0.3;
  let x = 80, v = 0;
  let dragging = false;
  let lastT = null;

  function toCanvasX(displacement) { return restX + displacement; }

  function step(ts) {
    if (!dragging) {
      if (lastT === null) lastT = ts;
      const dt = clampDt((ts - lastT) / 1000);
      lastT = ts;
      const a = (-k * x - damping * v) / mass;
      v += a * dt;
      x += v * dt * 60;
    } else {
      lastT = ts;
    }

    ctx.clearRect(0, 0, W, H);
    const bobX = toCanvasX(x);

    ctx.strokeStyle = 'rgba(243,237,224,0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(anchorX, midY);
    const coils = 14;
    const segLen = (bobX - anchorX) / coils;
    for (let i = 0; i <= coils; i++) {
      const px = anchorX + segLen * i;
      const py = midY + (i % 2 === 0 ? -10 : 10) * (i > 0 && i < coils ? 1 : 0);
      ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.fillStyle = '#2A2118';
    ctx.fillRect(anchorX - 6, midY - 30, 6, 60);

    ctx.fillStyle = '#E29B3F';
    ctx.beginPath(); ctx.arc(bobX, midY, 14, 0, Math.PI * 2); ctx.fill();

    const springForce = -k * x;
    drawArrow(ctx, bobX, midY, bobX + springForce * 2, midY, '#8B8FC7');

    const readout = document.getElementById('spring-readout');
    if (readout) readout.innerHTML = `displacement = <strong>${(x / 40).toFixed(2)}</strong> m &middot; F = <strong>${springForce.toFixed(1)}</strong> N`;

    requestAnimationFrame(step);
  }

  canvas.classList.add('draggable');
  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    if (Math.abs(mx - toCanvasX(x)) < 22) { dragging = true; v = 0; }
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    x = Math.max(-150, Math.min(300, mx - restX));
  });
  window.addEventListener('mouseup', () => { dragging = false; lastT = null; });

  bindSlider('sp-k', v => { k = v; });
  bindSlider('sp-damping', v => { damping = v; });

  requestAnimationFrame(step);
})();

/* ==========================================================================
   4. PENDULUM - full nonlinear equation, damping + periodic driving force
   ========================================================================== */
(function pendulumSim() {
  const canvas = document.getElementById('sim-pendulum');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const pivotX = W / 2, pivotY = 30;
  let length = 130, damping = 0.5, driveAmp = 0, driveFreq = 1;
  let theta = Math.PI / 3, omega = 0, simTime = 0;
  let trail = [];
  let lastT = null;

  function step(ts) {
    if (lastT === null) lastT = ts;
    const dt = clampDt((ts - lastT) / 1000);
    lastT = ts;
    simTime += dt;

    const g = 9.8;
    const Lm = length / 100;
    const alpha = (-g / Lm) * Math.sin(theta) - damping * omega + driveAmp * Math.cos(driveFreq * simTime);
    omega += alpha * dt;
    theta += omega * dt;

    const bobX = pivotX + length * Math.sin(theta);
    const bobY = pivotY + length * Math.cos(theta);
    trail.push({ x: bobX, y: bobY });
    if (trail.length > 80) trail.shift();

    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(139,143,199,0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    trail.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();

    ctx.strokeStyle = 'rgba(243,237,224,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(bobX, bobY); ctx.stroke();
    ctx.fillStyle = '#8B8FC7';
    ctx.beginPath(); ctx.arc(pivotX, pivotY, 4, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#E29B3F';
    ctx.beginPath(); ctx.arc(bobX, bobY, 12, 0, Math.PI * 2); ctx.fill();

    const gVecScale = 6;
    drawArrow(ctx, bobX, bobY, bobX, bobY + 9.8 * gVecScale, '#5FA8D3');
    const tangAngle = theta + Math.PI / 2;
    const restoring = -g * Math.sin(theta) * gVecScale;
    drawArrow(ctx, bobX, bobY, bobX + restoring * Math.cos(tangAngle), bobY + restoring * Math.sin(tangAngle), '#F2C14E');

    requestAnimationFrame(step);
  }

  bindSlider('pd-length', v => { length = v; });
  bindSlider('pd-damping', v => { damping = v; });
  bindSlider('pd-drive-amp', v => { driveAmp = v; });
  bindSlider('pd-drive-freq', v => { driveFreq = v; });
  document.getElementById('pd-reset')?.addEventListener('click', () => { theta = Math.PI / 3; omega = 0; simTime = 0; trail = []; });

  requestAnimationFrame(step);
})();

/* ==========================================================================
   5. ELECTRIC FIELD & COULOMB FORCE - draggable charges, live field + force vectors
   ========================================================================== */
(function eFieldSim() {
  const canvas = document.getElementById('sim-efield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let charges = [
    { x: W * 0.35, y: H * 0.5, q: 1 },
    { x: W * 0.65, y: H * 0.5, q: -1 },
  ];
  let dragIdx = -1;

  function fieldAt(x, y, excludeIdx) {
    let ex = 0, ey = 0;
    charges.forEach((c, i) => {
      if (i === excludeIdx) return;
      const dx = x - c.x, dy = y - c.y;
      const r2 = dx * dx + dy * dy + 60;
      const r = Math.sqrt(r2);
      const f = c.q / r2;
      ex += (f * dx) / r; ey += (f * dy) / r;
    });
    return [ex, ey];
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const spacing = 32;
    for (let y = spacing / 2; y < H; y += spacing) {
      for (let x = spacing / 2; x < W; x += spacing) {
        const [ex, ey] = fieldAt(x, y, -1);
        const mag = Math.hypot(ex, ey);
        const len = Math.min(mag * 260, 13);
        const nx = ex / (mag || 1), ny = ey / (mag || 1);
        ctx.strokeStyle = `rgba(226,155,63,${Math.min(0.2 + mag * 30, 0.85)})`;
        ctx.lineWidth = 1.3;
        drawArrow(ctx, x - nx * len / 2, y - ny * len / 2, x + nx * len / 2, y + ny * len / 2, ctx.strokeStyle, 1.3);
      }
    }

    if (charges.length === 2) {
      const [a, b] = charges;
      const dx = b.x - a.x, dy = b.y - a.y;
      const r = Math.hypot(dx, dy) || 1;
      const K = 8.99e9 * 1e-12;
      const F = (K * a.q * b.q) / (r * r / 3000) * 900;
      const nx = dx / r, ny = dy / r;
      const scale = Math.min(Math.abs(F), 60) * Math.sign(F || 1);
      drawArrow(ctx, a.x, a.y, a.x - nx * scale, a.y - ny * scale, '#6fd6d6', 2.5);
      drawArrow(ctx, b.x, b.y, b.x + nx * scale, b.y + ny * scale, '#6fd6d6', 2.5);
      const readout = document.getElementById('efield-readout');
      if (readout) readout.innerHTML = `separation = <strong>${(r / 30).toFixed(2)}</strong> (arb. units) &middot; force is ${a.q * b.q > 0 ? '<strong>repulsive</strong>' : '<strong>attractive</strong>'}`;
    }

    charges.forEach(c => {
      ctx.fillStyle = c.q > 0 ? '#E29B3F' : '#8B8FC7';
      ctx.beginPath(); ctx.arc(c.x, c.y, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0B0D1A';
      ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(c.q > 0 ? '+' : '\u2212', c.x, c.y);
    });

    requestAnimationFrame(draw);
  }

  function canvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) * (W / rect.width), y: (e.clientY - rect.top) * (H / rect.height) };
  }

  canvas.classList.add('draggable');
  canvas.addEventListener('mousedown', (e) => {
    const { x, y } = canvasCoords(e);
    dragIdx = charges.findIndex(c => Math.hypot(c.x - x, c.y - y) < 16);
  });
  window.addEventListener('mousemove', (e) => {
    if (dragIdx === -1) return;
    const { x, y } = canvasCoords(e);
    charges[dragIdx].x = Math.max(10, Math.min(W - 10, x));
    charges[dragIdx].y = Math.max(10, Math.min(H - 10, y));
  });
  window.addEventListener('mouseup', () => { dragIdx = -1; });

  document.getElementById('ef-add-pos')?.addEventListener('click', () => {
    if (charges.length < 4) charges.push({ x: Math.random() * W, y: Math.random() * H, q: 1 });
  });
  document.getElementById('ef-add-neg')?.addEventListener('click', () => {
    if (charges.length < 4) charges.push({ x: Math.random() * W, y: Math.random() * H, q: -1 });
  });
  document.getElementById('ef-clear')?.addEventListener('click', () => {
    charges = [{ x: W * 0.35, y: H * 0.5, q: 1 }, { x: W * 0.65, y: H * 0.5, q: -1 }];
  });

  requestAnimationFrame(draw);
})();

/* ==========================================================================
   6. WAVE INTERFERENCE - double-slit ripple pattern + screen intensity graph
   ========================================================================== */
(function waveSim() {
  const canvas = document.getElementById('sim-waves');
  const screenCanvas = document.getElementById('sim-waves-screen');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let wavelength = 24, slitSeparation = 70;
  let t = 0;

  function draw() {
    const img = ctx.createImageData(W, H);
    const s1 = { x: W / 2 - slitSeparation / 2, y: H * 0.15 };
    const s2 = { x: W / 2 + slitSeparation / 2, y: H * 0.15 };
    const k = (2 * Math.PI) / wavelength;
    const step = 3;
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const d1 = Math.hypot(x - s1.x, y - s1.y);
        const d2 = Math.hypot(x - s2.x, y - s2.y);
        const val = Math.sin(k * d1 - t) + Math.sin(k * d2 - t);
        const intensity = Math.floor(((val + 2) / 4) * 255);
        for (let dy = 0; dy < step; dy++) for (let dx = 0; dx < step; dx++) {
          const px = x + dx, py = y + dy;
          if (px >= W || py >= H) continue;
          const idx = (py * W + px) * 4;
          img.data[idx] = 20 + intensity * 0.3;
          img.data[idx + 1] = 15 + intensity * 0.2;
          img.data[idx + 2] = intensity;
          img.data[idx + 3] = 255;
        }
      }
    }
    ctx.putImageData(img, 0, 0);
    ctx.fillStyle = '#F3EDE0';
    [s1, s2].forEach(s => { ctx.beginPath(); ctx.arc(s.x, s.y, 3, 0, Math.PI * 2); ctx.fill(); });
    t += 0.22;

    if (screenCanvas) drawScreenPattern();
    requestAnimationFrame(draw);
  }

  function drawScreenPattern() {
    const sctx = screenCanvas.getContext('2d');
    const sw = screenCanvas.width, sh = screenCanvas.height;
    sctx.clearRect(0, 0, sw, sh);
    const L = 300, d = slitSeparation;
    sctx.strokeStyle = '#F0B968';
    sctx.lineWidth = 2;
    sctx.beginPath();
    for (let px = 0; px < sw; px++) {
      const yPos = px - sw / 2;
      const pathDiff = (d * yPos) / L;
      const intensity = Math.pow(Math.cos((Math.PI * pathDiff) / wavelength), 2);
      const barH = intensity * (sh - 10);
      if (px === 0) sctx.moveTo(px, sh - barH); else sctx.lineTo(px, sh - barH);
    }
    sctx.stroke();
  }

  bindSlider('wv-wavelength', v => { wavelength = v; });
  bindSlider('wv-slitsep', v => { slitSeparation = v; });
  requestAnimationFrame(draw);
})();

/* ==========================================================================
   7. COLLISION PHYSICS - 2D elastic/inelastic collisions in a bounded box
   ========================================================================== */
(function collisionSim() {
  const canvas = document.getElementById('sim-collision');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let restitution = 1.0;
  let balls = [];

  function initBalls() {
    balls = [
      { x: W * 0.3, y: H * 0.4, vx: 90, vy: 40, r: 18, m: 2, color: '#E29B3F' },
      { x: W * 0.7, y: H * 0.6, vx: -70, vy: -20, r: 14, m: 1, color: '#8B8FC7' },
    ];
  }
  initBalls();
  let lastT = null;

  function resolveCollision(a, b) {
    const dx = b.x - a.x, dy = b.y - a.y;
    const dist = Math.hypot(dx, dy);
    if (dist === 0 || dist > a.r + b.r) return;
    const nx = dx / dist, ny = dy / dist;
    const overlap = a.r + b.r - dist;
    a.x -= nx * overlap / 2; a.y -= ny * overlap / 2;
    b.x += nx * overlap / 2; b.y += ny * overlap / 2;

    const rvx = b.vx - a.vx, rvy = b.vy - a.vy;
    const velAlongNormal = rvx * nx + rvy * ny;
    if (velAlongNormal > 0) return;

    const e = restitution;
    const j = -(1 + e) * velAlongNormal / (1 / a.m + 1 / b.m);
    const ix = j * nx, iy = j * ny;
    a.vx -= ix / a.m; a.vy -= iy / a.m;
    b.vx += ix / b.m; b.vy += iy / b.m;
  }

  function step(ts) {
    if (lastT === null) lastT = ts;
    const dt = clampDt((ts - lastT) / 1000);
    lastT = ts;

    balls.forEach(b => {
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.x - b.r < 0) { b.x = b.r; b.vx *= -1; }
      if (b.x + b.r > W) { b.x = W - b.r; b.vx *= -1; }
      if (b.y - b.r < 0) { b.y = b.r; b.vy *= -1; }
      if (b.y + b.r > H) { b.y = H - b.r; b.vy *= -1; }
    });
    resolveCollision(balls[0], balls[1]);

    ctx.clearRect(0, 0, W, H);
    balls.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
      drawArrow(ctx, b.x, b.y, b.x + b.vx * 0.3, b.y + b.vy * 0.3, '#5FA8D3');
    });

    const totalPx = balls[0].m * balls[0].vx + balls[1].m * balls[1].vx;
    const totalPy = balls[0].m * balls[0].vy + balls[1].m * balls[1].vy;
    const totalKE = balls.reduce((sum, b) => sum + 0.5 * b.m * (b.vx * b.vx + b.vy * b.vy), 0);
    const readout = document.getElementById('collision-readout');
    if (readout) readout.innerHTML = `total momentum = <strong>(${totalPx.toFixed(0)}, ${totalPy.toFixed(0)})</strong> &middot; total KE = <strong>${totalKE.toFixed(0)}</strong> J`;

    requestAnimationFrame(step);
  }

  bindSlider('cl-restitution', v => { restitution = v; });
  document.getElementById('cl-reset')?.addEventListener('click', () => { initBalls(); lastT = null; });

  requestAnimationFrame(step);
})();

/* ==========================================================================
   8. FLUID DYNAMICS - Bernoulli (Venturi), buoyancy, viscosity (Stokes' law)
   ========================================================================== */
(function fluidSims() {
  // 8a. Bernoulli / Venturi
  const bCanvas = document.getElementById('sim-bernoulli');
  if (bCanvas) {
    const ctx = bCanvas.getContext('2d');
    const W = bCanvas.width, H = bCanvas.height;
    let flowRate = 40;
    let particles = Array.from({ length: 24 }, () => ({ x: Math.random() * W, y: 0 }));

    function pipeHalfWidth(x) {
      const narrowCenter = W / 2, narrowWidth = 60;
      const t = Math.max(0, 1 - Math.abs(x - narrowCenter) / narrowWidth);
      return H * 0.4 - t * H * 0.22;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(243,237,224,0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 4) { const hw = pipeHalfWidth(x); if (x === 0) ctx.moveTo(x, H / 2 - hw); else ctx.lineTo(x, H / 2 - hw); }
      for (let x = W; x >= 0; x -= 4) { const hw = pipeHalfWidth(x); ctx.lineTo(x, H / 2 + hw); }
      ctx.closePath(); ctx.stroke();

      particles.forEach(p => {
        const hw = pipeHalfWidth(p.x);
        const speed = (flowRate / hw) * 8;
        p.x += speed * 0.15;
        if (p.x > W) { p.x = 0; p.y = (Math.random() - 0.5) * hw * 1.6; }
        const py = H / 2 + p.y * (hw / (H * 0.4));
        const hue = Math.min(255, speed * 20);
        ctx.fillStyle = `rgb(${226}, ${Math.max(80, 200 - hue)}, 63)`;
        ctx.beginPath(); ctx.arc(p.x, py, 3, 0, Math.PI * 2); ctx.fill();
      });

      const readout = document.getElementById('bernoulli-readout');
      if (readout) {
        const wideHw = pipeHalfWidth(20), narrowHw = pipeHalfWidth(W / 2);
        readout.innerHTML = `narrow section is <strong>${(wideHw / narrowHw).toFixed(1)}&times;</strong> faster, pressure drops there (Bernoulli)`;
      }
      requestAnimationFrame(draw);
    }
    bindSlider('bn-flow', v => { flowRate = v; });
    requestAnimationFrame(draw);
  }

  // 8b. Buoyancy
  const buCanvas = document.getElementById('sim-buoyancy');
  if (buCanvas) {
    const ctx = buCanvas.getContext('2d');
    const W = buCanvas.width, H = buCanvas.height;
    const fluidY = H * 0.35;
    let objDensity = 0.6;
    const fluidDensity = 1.0;
    let y = fluidY, vy = 0;

    function step() {
      const boxH = 40;
      const submergedFrac = Math.min(1, Math.max(0, (y + boxH / 2 - fluidY) / boxH));
      const buoyancy = fluidDensity * submergedFrac * 9.8 * 40;
      const weight = objDensity * 9.8 * 40;
      const netA = (buoyancy - weight) * 0.02;
      vy += netA * 0.15;
      vy *= 0.9;
      y += vy;
      y = Math.max(fluidY - boxH, Math.min(H - boxH / 2 - 6, y));

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(95,168,211,0.18)';
      ctx.fillRect(0, fluidY, W, H - fluidY);
      ctx.strokeStyle = 'rgba(95,168,211,0.5)';
      ctx.beginPath(); ctx.moveTo(0, fluidY); ctx.lineTo(W, fluidY); ctx.stroke();

      ctx.fillStyle = '#E29B3F';
      ctx.fillRect(W / 2 - 20, y - boxH / 2, 40, boxH);

      drawArrow(ctx, W / 2, y, W / 2, y + weight * 0.3, '#d3695f');
      drawArrow(ctx, W / 2, y, W / 2, y - buoyancy * 0.3, '#5FA8D3');

      requestAnimationFrame(step);
    }
    bindSlider('bu-density', v => { objDensity = v; });
    requestAnimationFrame(step);
  }

  // 8c. Viscosity / terminal velocity
  const vCanvas = document.getElementById('sim-viscosity');
  if (vCanvas) {
    const ctx = vCanvas.getContext('2d');
    const W = vCanvas.width, H = vCanvas.height;
    let viscosity = 1.0, sphereRadius = 8;
    let y = 20, vy = 0;

    function step() {
      const m = sphereRadius * sphereRadius * 0.05;
      const gForce = m * 9.8 * 8;
      const drag = 6 * Math.PI * viscosity * sphereRadius * vy * 0.6;
      const a = (gForce - drag) / m;
      vy += a * 0.01;
      y += vy * 0.15;
      if (y > H - 15) { y = 20; vy = 0; }

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(139,143,199,0.1)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#F0B968';
      ctx.beginPath(); ctx.arc(W / 2, y, sphereRadius, 0, Math.PI * 2); ctx.fill();
      drawArrow(ctx, W / 2, y, W / 2, y + vy * 3, '#5FA8D3');

      const readout = document.getElementById('viscosity-readout');
      if (readout) readout.innerHTML = `v = <strong>${vy.toFixed(2)}</strong> (approaching terminal velocity)`;

      requestAnimationFrame(step);
    }
    bindSlider('vi-viscosity', v => { viscosity = v; });
    bindSlider('vi-radius', v => { sphereRadius = v; });
    requestAnimationFrame(step);
  }
})();

/* ==========================================================================
   9. HEAT TRANSFER - conduction (1D finite difference), convection, radiation
   ========================================================================== */
(function heatSims() {
  // 9a. Conduction
  const cCanvas = document.getElementById('sim-conduction');
  if (cCanvas) {
    const ctx = cCanvas.getContext('2d');
    const W = cCanvas.width, H = cCanvas.height;
    const N = 60;
    let temps = new Array(N).fill(20);
    let alpha = 0.4;

    function step() {
      temps[0] = 95;
      const next = temps.slice();
      for (let i = 1; i < N - 1; i++) {
        next[i] = temps[i] + alpha * 0.15 * (temps[i - 1] - 2 * temps[i] + temps[i + 1]);
      }
      temps = next;

      ctx.clearRect(0, 0, W, H);
      const segW = W / N;
      for (let i = 0; i < N; i++) {
        const frac = Math.min(1, Math.max(0, (temps[i] - 20) / 75));
        const r = Math.floor(95 + frac * 160);
        const g = Math.floor(120 - frac * 90);
        const b = Math.floor(210 - frac * 180);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(i * segW, H * 0.3, segW + 1, H * 0.4);
      }
      requestAnimationFrame(step);
    }
    bindSlider('ht-alpha', v => { alpha = v; });
    requestAnimationFrame(step);
  }

  // 9b. Convection (stylized circulating cell)
  const vcCanvas = document.getElementById('sim-convection');
  if (vcCanvas) {
    const ctx = vcCanvas.getContext('2d');
    const W = vcCanvas.width, H = vcCanvas.height;
    let particles = Array.from({ length: 30 }, (_, i) => ({ a: (i / 30) * Math.PI * 2, r: 20 + Math.random() * 40 }));
    let speedMul = 1;

    function step() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(226,155,63,0.15)';
      ctx.fillRect(0, H - 14, W, 14);
      ctx.fillStyle = '#E29B3F'; ctx.font = '10px monospace'; ctx.fillText('heat source', 8, H - 4);

      const cx = W / 2, cy = H / 2;
      particles.forEach(p => {
        p.a += 0.02 * speedMul;
        const x = cx + Math.cos(p.a) * p.r;
        const y = cy + Math.sin(p.a) * p.r * 0.7;
        const heatFrac = 1 - (y / H);
        ctx.fillStyle = `rgba(226,155,63,${0.3 + heatFrac * 0.5})`;
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
      });
      requestAnimationFrame(step);
    }
    bindSlider('cv-speed', v => { speedMul = v; });
    requestAnimationFrame(step);
  }

  // 9c. Radiation (Stefan-Boltzmann glow)
  const rCanvas = document.getElementById('sim-radiation');
  if (rCanvas) {
    const ctx = rCanvas.getContext('2d');
    const W = rCanvas.width, H = rCanvas.height;
    let temp = 800;
    const SIGMA = 5.670374e-8;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const frac = Math.min(1, temp / 3000);
      const r = Math.floor(120 + frac * 135);
      const g = Math.floor(30 + frac * 180);
      const b = Math.floor(20 + frac * 140);
      const glowR = 20 + frac * 20;
      const grad = ctx.createRadialGradient(W / 2, H / 2, 4, W / 2, H / 2, glowR * 1.8);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.9)`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(W / 2, H / 2, glowR * 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.beginPath(); ctx.arc(W / 2, H / 2, glowR, 0, Math.PI * 2); ctx.fill();

      const power = SIGMA * Math.pow(temp, 4);
      const readout = document.getElementById('radiation-readout');
      if (readout) readout.innerHTML = `radiant emittance = <strong>${power.toExponential(2)}</strong> W/m&sup2; (&sigma;T&#8308;)`;

      requestAnimationFrame(draw);
    }
    bindSlider('rd-temp', v => { temp = v; });
    requestAnimationFrame(draw);
  }
})();

/* ==========================================================================
   10. ELECTROMAGNETIC FIELDS - dipole field lines (traced), Faraday induction
   ========================================================================== */
(function emFieldSims() {
  // 10a. Magnetic dipole field lines (numerically traced)
  const dCanvas = document.getElementById('sim-dipole');
  if (dCanvas) {
    const ctx = dCanvas.getContext('2d');
    const W = dCanvas.width, H = dCanvas.height;
    const cx = W / 2, cy = H / 2;
    let strength = 1;

    function fieldAt(x, y) {
      const dx = x - cx, dy = y - cy;
      const r = Math.hypot(dx, dy) || 1;
      const m = strength;
      const bx = (m * (3 * dx * dy)) / Math.pow(r, 5);
      const by = (m * (3 * dy * dy - r * r)) / Math.pow(r, 5);
      return [bx * 1e6, by * 1e6];
    }

    function traceLine(startX, startY, dir) {
      const pts = [{ x: startX, y: startY }];
      let x = startX, y = startY;
      for (let i = 0; i < 200; i++) {
        const [bx, by] = fieldAt(x, y);
        const mag = Math.hypot(bx, by) || 1;
        x += (bx / mag) * 4 * dir;
        y += (by / mag) * 4 * dir;
        if (Math.hypot(x - cx, y - cy) < 12 || x < 0 || x > W || y < 0 || y > H) break;
        pts.push({ x, y });
      }
      return pts;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const seeds = 12;
      for (let i = 0; i < seeds; i++) {
        const angle = (i / seeds) * Math.PI * 2;
        const sx = cx + Math.cos(angle) * 16, sy = cy + Math.sin(angle) * 16;
        [1, -1].forEach(dir => {
          const line = traceLine(sx, sy, dir);
          ctx.strokeStyle = 'rgba(139,143,199,0.4)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          line.forEach((p, idx) => (idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
          ctx.stroke();
        });
      }
      ctx.fillStyle = '#E29B3F'; ctx.fillRect(cx - 22, cy - 6, 20, 12);
      ctx.fillStyle = '#2A2118'; ctx.fillRect(cx + 2, cy - 6, 20, 12);
      ctx.fillStyle = '#F3EDE0'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('N', cx - 12, cy + 4);
      ctx.fillText('S', cx + 12, cy + 4);
    }
    bindSlider('dp-strength', v => { strength = v; draw(); });
    draw();
  }

  // 10b. Faraday induction - magnet moving through a coil
  const fCanvas = document.getElementById('sim-faraday');
  if (fCanvas) {
    const ctx = fCanvas.getContext('2d');
    const W = fCanvas.width, H = fCanvas.height;
    const coilX = W * 0.65;
    let magnetX = 20, magnetVx = 60, autoPlay = true;
    let lastFlux = null, needleAngle = 0;
    let lastT = null;

    function step(ts) {
      if (lastT === null) lastT = ts;
      const dt = clampDt((ts - lastT) / 1000);
      lastT = ts;

      if (autoPlay) {
        magnetX += magnetVx * dt * 30;
        if (magnetX > W + 30 || magnetX < -30) magnetVx *= -1;
      }

      const dist = Math.abs(coilX - magnetX);
      const flux = 8000 / (dist * dist + 200);
      const dPhiDt = lastFlux === null ? 0 : (flux - lastFlux) / dt;
      lastFlux = flux;
      const emf = -dPhiDt * 0.00025;
      needleAngle += (Math.max(-1, Math.min(1, emf)) * 0.9 - needleAngle) * 0.15;

      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(139,143,199,0.5)';
      ctx.lineWidth = 3;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath(); ctx.ellipse(coilX, H / 2, 16, 32, 0, 0, Math.PI * 2); ctx.stroke();
      }

      ctx.fillStyle = '#E29B3F'; ctx.fillRect(magnetX - 18, H / 2 - 8, 18, 16);
      ctx.fillStyle = '#2A2118'; ctx.fillRect(magnetX, H / 2 - 8, 18, 16);

      const gx = W * 0.15, gy = H * 0.82, gr = 22;
      ctx.strokeStyle = 'rgba(243,237,224,0.4)';
      ctx.beginPath(); ctx.arc(gx, gy, gr, Math.PI, Math.PI * 2); ctx.stroke();
      const needleX = gx + Math.cos(Math.PI + Math.PI / 2 + needleAngle) * gr;
      const needleY = gy + Math.sin(Math.PI + Math.PI / 2 + needleAngle) * gr;
      drawArrow(ctx, gx, gy, needleX, needleY, '#F0B968', 2.5);
      ctx.fillStyle = 'rgba(243,237,224,0.5)'; ctx.font = '9px monospace'; ctx.textAlign = 'center';
      ctx.fillText('galvanometer', gx, gy + 14);

      const readout = document.getElementById('faraday-readout');
      if (readout) readout.innerHTML = `induced EMF &prop; <strong>${(-dPhiDt).toFixed(0)}</strong> (rate of flux change)`;

      requestAnimationFrame(step);
    }

    document.getElementById('fd-toggle')?.addEventListener('click', () => { autoPlay = !autoPlay; });
    requestAnimationFrame(step);
  }
})();

/* ==========================================================================
   11. MOON PHASES - real Sun-Earth-Moon geometry drives the illuminated phase
   ========================================================================== */
(function moonPhaseSim() {
  const orbitCanvas = document.getElementById('sim-moon-orbit');
  const phaseCanvas = document.getElementById('sim-moon-phase');
  if (!orbitCanvas || !phaseCanvas) return;
  const octx = orbitCanvas.getContext('2d');
  const pctx = phaseCanvas.getContext('2d');
  const OW = orbitCanvas.width, OH = orbitCanvas.height;
  const PW = phaseCanvas.width, PH = phaseCanvas.height;
  let angle = 0; // moon's orbital angle, 0 = new moon (between Earth and Sun)

  function draw() {
    // Orbit diagram: Sun off to the left (implied direction), Earth at center, Moon orbiting
    octx.clearRect(0, 0, OW, OH);
    const cx = OW / 2, cy = OH / 2, r = Math.min(OW, OH) * 0.32;

    octx.strokeStyle = 'rgba(243,237,224,0.15)';
    octx.beginPath(); octx.arc(cx, cy, r, 0, Math.PI * 2); octx.stroke();

    octx.fillStyle = 'rgba(243,237,224,0.4)';
    octx.font = '10px monospace'; octx.textAlign = 'center';
    octx.fillText('sunlight from the left \u2192', cx, 16);
    for (let x = 10; x < OW - 10; x += 16) {
      octx.strokeStyle = 'rgba(242,193,78,0.15)';
      octx.beginPath(); octx.moveTo(x, 26); octx.lineTo(x + 8, 26); octx.stroke();
    }

    octx.fillStyle = '#5FA8D3';
    octx.beginPath(); octx.arc(cx, cy, 14, 0, Math.PI * 2); octx.fill();

    const mx = cx + r * Math.cos(angle), my = cy + r * Math.sin(angle);
    // Moon: lit half always faces angle=180 (toward the left, the Sun's direction)
    octx.save();
    octx.beginPath(); octx.arc(mx, my, 8, 0, Math.PI * 2); octx.clip();
    octx.fillStyle = '#2A2118'; octx.fillRect(mx - 10, my - 10, 20, 20);
    octx.fillStyle = '#F3EDE0';
    octx.beginPath(); octx.arc(mx - 8, my, 8, -Math.PI / 2, Math.PI / 2); octx.fill();
    octx.restore();

    requestAnimationFrame(() => {});
  }

  function drawPhase() {
    pctx.clearRect(0, 0, PW, PH);
    const cx = PW / 2, cy = PH / 2, r = Math.min(PW, PH) * 0.35;

    // illuminated fraction: 0 at new moon (angle=0), 1 at full moon (angle=PI)
    const k = (1 - Math.cos(angle)) / 2;
    pctx.fillStyle = '#2A2118';
    pctx.beginPath(); pctx.arc(cx, cy, r, 0, Math.PI * 2); pctx.fill();

    pctx.save();
    pctx.beginPath(); pctx.arc(cx, cy, r, 0, Math.PI * 2); pctx.clip();
    pctx.fillStyle = '#F3EDE0';
    const waxing = Math.sin(angle) < 0; // simplified waxing/waning based on angle direction
    const ellipseW = Math.abs(Math.cos(angle)) * r;
    pctx.beginPath();
    if (k <= 0.5) {
      // crescent to half
      pctx.arc(cx, cy, r, Math.PI/2, -Math.PI/2, waxing);
      pctx.ellipse(cx, cy, ellipseW, r, 0, -Math.PI/2, Math.PI/2, !waxing);
    } else {
      pctx.arc(cx, cy, r, -Math.PI/2, Math.PI/2, !waxing);
      pctx.ellipse(cx, cy, ellipseW, r, 0, Math.PI/2, -Math.PI/2, waxing);
    }
    pctx.fill();
    pctx.restore();

    const names = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    const idx = Math.round(((angle % (2*Math.PI)) / (2*Math.PI)) * 8) % 8;
    const label = document.getElementById('moon-phase-name');
    if (label) label.textContent = names[idx];
  }

  bindSlider('mp-angle', v => {
    angle = (v * Math.PI) / 180;
    draw();
    drawPhase();
  });
  draw();
  drawPhase();
})();

/* ==========================================================================
   12. EXOPLANET TRANSIT - a planet crossing its star dims the light curve
   ========================================================================== */
(function transitSim() {
  const starCanvas = document.getElementById('sim-transit-star');
  const curveCanvas = document.getElementById('sim-transit-curve');
  if (!starCanvas || !curveCanvas) return;
  const sctx = starCanvas.getContext('2d');
  const cctx = curveCanvas.getContext('2d');
  const SW = starCanvas.width, SH = starCanvas.height;
  const CW = curveCanvas.width, CH = curveCanvas.height;
  let planetRadiusFrac = 0.12, speed = 1;
  let t = -1.3;
  let history = [];

  function step() {
    const starR = 60;
    const planetR = starR * planetRadiusFrac;
    const cx = SW / 2, cy = SH / 2;
    const px = cx + t * (SW * 0.42);

    sctx.clearRect(0, 0, SW, SH);
    sctx.fillStyle = '#F2C14E';
    sctx.beginPath(); sctx.arc(cx, cy, starR, 0, Math.PI * 2); sctx.fill();
    sctx.fillStyle = '#0B0D1A';
    sctx.beginPath(); sctx.arc(px, cy, planetR, 0, Math.PI * 2); sctx.fill();

    // compute overlap area (simplified circle-circle intersection) for brightness dip
    const d = Math.abs(px - cx);
    let overlapFrac = 0;
    if (d < starR + planetR) {
      const overlapEstimate = Math.max(0, Math.min(1, (starR + planetR - d) / (2 * planetR)));
      overlapFrac = overlapEstimate * (planetR * planetR) / (starR * starR);
    }
    const brightness = 1 - Math.min(overlapFrac, (planetR * planetR) / (starR * starR));

    t += 0.006 * speed;
    if (t > 1.3) { t = -1.3; history = []; }
    history.push(brightness);
    if (history.length > 300) history.shift();

    cctx.clearRect(0, 0, CW, CH);
    cctx.strokeStyle = 'rgba(243,237,224,0.15)';
    cctx.beginPath(); cctx.moveTo(0, CH * 0.15); cctx.lineTo(CW, CH * 0.15); cctx.stroke();
    cctx.strokeStyle = '#5FA8D3';
    cctx.lineWidth = 2;
    cctx.beginPath();
    history.forEach((b, i) => {
      const x = (i / 300) * CW;
      const y = CH * 0.15 + (1 - b) * CH * 3.5;
      if (i === 0) cctx.moveTo(x, y); else cctx.lineTo(x, y);
    });
    cctx.stroke();

    const readout = document.getElementById('transit-readout');
    if (readout) readout.innerHTML = `relative brightness = <strong>${(brightness * 100).toFixed(2)}%</strong>`;

    requestAnimationFrame(step);
  }

  bindSlider('tr-radius', v => { planetRadiusFrac = v; });
  bindSlider('tr-speed', v => { speed = v; });
  requestAnimationFrame(step);
})();
