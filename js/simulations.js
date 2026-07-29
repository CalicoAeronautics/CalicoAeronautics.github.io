/* ==========================================================================
   Eight small, self-contained simulations. Each reads its own sliders and
   draws to its own canvas. No shared state between them.
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

/* ---------------- 1. Projectile Motion ---------------- */
(function projectileSim() {
  const canvas = document.getElementById('sim-projectile');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let speed = 25, angle = 40;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const g = 9.8;
    const theta = (angle * Math.PI) / 180;
    const vx = speed * Math.cos(theta), vy = speed * Math.sin(theta);
    const tFlight = (2 * vy) / g;
    const scale = (W - 40) / Math.max(vx * tFlight, 1);

    ctx.strokeStyle = 'rgba(243,237,224,0.15)';
    ctx.beginPath(); ctx.moveTo(20, H - 20); ctx.lineTo(W - 20, H - 20); ctx.stroke();

    ctx.strokeStyle = '#E29B3F';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let t = 0; t <= tFlight; t += tFlight / 100) {
      const x = 20 + vx * t * scale;
      const y = H - 20 - (vy * t - 0.5 * g * t * t) * scale;
      if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  bindSlider('pm-sim-speed', v => { speed = v; draw(); });
  bindSlider('pm-sim-angle', v => { angle = v; draw(); });
  draw();
})();

/* ---------------- 2. Pendulum ---------------- */
(function pendulumSim() {
  const canvas = document.getElementById('sim-pendulum');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const pivotX = W / 2, pivotY = 30;
  let length = 120, theta = Math.PI / 4, omega = 0;

  function step() {
    const g = 9.8, dt = 0.02;
    const alpha = (-g / (length / 100)) * Math.sin(theta);
    omega += alpha * dt;
    omega *= 0.999; // slight damping
    theta += omega * dt;

    ctx.clearRect(0, 0, W, H);
    const bobX = pivotX + length * Math.sin(theta);
    const bobY = pivotY + length * Math.cos(theta);

    ctx.strokeStyle = 'rgba(243,237,224,0.3)';
    ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(bobX, bobY); ctx.stroke();

    ctx.fillStyle = '#8B8FC7';
    ctx.beginPath(); ctx.arc(pivotX, pivotY, 4, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#E29B3F';
    ctx.beginPath(); ctx.arc(bobX, bobY, 12, 0, Math.PI * 2); ctx.fill();

    requestAnimationFrame(step);
  }

  bindSlider('pd-sim-length', v => { length = v; });
  document.getElementById('pd-sim-reset')?.addEventListener('click', () => {
    theta = Math.PI / 4; omega = 0;
  });
  step();
})();

/* ---------------- 3. Wave Interference ---------------- */
(function waveSim() {
  const canvas = document.getElementById('sim-waves');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let wavelength = 26;
  let t = 0;

  function draw() {
    const img = ctx.createImageData(W, H);
    const s1 = { x: W * 0.35, y: H / 2 };
    const s2 = { x: W * 0.65, y: H / 2 };
    const k = (2 * Math.PI) / wavelength;
    const step = 3;
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const d1 = Math.hypot(x - s1.x, y - s1.y);
        const d2 = Math.hypot(x - s2.x, y - s2.y);
        const val = Math.sin(k * d1 - t) + Math.sin(k * d2 - t);
        const intensity = Math.floor(((val + 2) / 4) * 255);
        for (let dy = 0; dy < step; dy++) {
          for (let dx = 0; dx < step; dx++) {
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
    }
    ctx.putImageData(img, 0, 0);
    t += 0.25;
    requestAnimationFrame(draw);
  }

  bindSlider('wv-sim-wavelength', v => { wavelength = v; });
  draw();
})();

/* ---------------- 4. Electric Field ---------------- */
(function eFieldSim() {
  const canvas = document.getElementById('sim-efield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let q1 = 1, q2 = -1;
  const p1 = { x: W * 0.35, y: H / 2 };
  const p2 = { x: W * 0.65, y: H / 2 };

  function fieldAt(x, y) {
    let ex = 0, ey = 0;
    [[p1, q1], [p2, q2]].forEach(([p, q]) => {
      const dx = x - p.x, dy = y - p.y;
      const r2 = dx * dx + dy * dy + 40;
      const r = Math.sqrt(r2);
      const f = q / r2;
      ex += (f * dx) / r;
      ey += (f * dy) / r;
    });
    return [ex, ey];
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const spacing = 34;
    for (let y = spacing / 2; y < H; y += spacing) {
      for (let x = spacing / 2; x < W; x += spacing) {
        const [ex, ey] = fieldAt(x, y);
        const mag = Math.hypot(ex, ey);
        const len = Math.min(mag * 300, 14);
        const nx = ex / (mag || 1), ny = ey / (mag || 1);
        ctx.strokeStyle = `rgba(226,155,63,${Math.min(0.25 + mag * 40, 0.9)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x - nx * len / 2, y - ny * len / 2);
        ctx.lineTo(x + nx * len / 2, y + ny * len / 2);
        ctx.stroke();
      }
    }
    [[p1, q1], [p2, q2]].forEach(([p, q]) => {
      ctx.fillStyle = q > 0 ? '#E29B3F' : '#8B8FC7';
      ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0B0D1A';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(q > 0 ? '+' : '-', p.x, p.y);
    });
  }

  bindSlider('ef-sim-q1', v => { q1 = v; draw(); });
  bindSlider('ef-sim-q2', v => { q2 = v; draw(); });
  draw();
})();

/* ---------------- 5. Magnetic Field (straight current-carrying wire) ---------------- */
(function bFieldSim() {
  const canvas = document.getElementById('sim-bfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  let current = 5;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#E29B3F';
    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = current >= 0 ? '#F3EDE0' : 'transparent';
    ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    const rings = 6;
    for (let i = 1; i <= rings; i++) {
      const r = i * 22;
      ctx.strokeStyle = `rgba(139,143,199,${0.55 - i * 0.06})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

      const dir = current >= 0 ? 1 : -1;
      const arrowAngle = (-Math.PI / 2) + dir * 0.35;
      const ax = cx + r * Math.cos(arrowAngle);
      const ay = cy + r * Math.sin(arrowAngle);
      const tangent = arrowAngle + (dir * Math.PI) / 2;
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(tangent);
      ctx.fillStyle = '#8B8FC7';
      ctx.beginPath();
      ctx.moveTo(6, 0); ctx.lineTo(-4, 4); ctx.lineTo(-4, -4); ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  bindSlider('bf-sim-current', v => { current = v; draw(); });
  draw();
})();

/* ---------------- 6. Planetary Motion ---------------- */
(function orbitSim() {
  const canvas = document.getElementById('sim-orbit');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  let ecc = 0.3, speedMul = 1, t = 0;
  const a = W * 0.38;

  function step() {
    ctx.clearRect(0, 0, W, H);
    const b = a * Math.sqrt(1 - ecc * ecc);

    ctx.strokeStyle = 'rgba(243,237,224,0.15)';
    ctx.beginPath(); ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2); ctx.stroke();

    ctx.fillStyle = '#F2C14E';
    ctx.beginPath(); ctx.arc(cx - a * ecc, cy, 10, 0, Math.PI * 2); ctx.fill();

    t += 0.012 * speedMul;
    const px = cx + a * Math.cos(t) - a * ecc;
    const py = cy + b * Math.sin(t);
    ctx.fillStyle = '#8B8FC7';
    ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill();

    requestAnimationFrame(step);
  }

  bindSlider('or-sim-ecc', v => { ecc = v; });
  bindSlider('or-sim-speed', v => { speedMul = v; });
  step();
})();

/* ---------------- 7. Special Relativity (length contraction) ---------------- */
(function relativitySim() {
  const canvas = document.getElementById('sim-relativity');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let beta = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const L0 = W * 0.6;
    const gamma = 1 / Math.sqrt(1 - beta * beta);
    const L = L0 / gamma;

    ctx.strokeStyle = 'rgba(243,237,224,0.2)';
    ctx.strokeRect(W / 2 - L0 / 2, H * 0.28, L0, 28);
    ctx.fillStyle = 'rgba(243,237,224,0.5)';
    ctx.font = '11px monospace'; ctx.textAlign = 'center';
    ctx.fillText('rest length', W / 2, H * 0.24);

    ctx.fillStyle = '#E29B3F';
    ctx.fillRect(W / 2 - L / 2, H * 0.58, L, 28);
    ctx.fillStyle = '#F0B968';
    ctx.fillText(`moving at ${(beta).toFixed(2)}c \u2014 \u03b3 = ${gamma.toFixed(2)}`, W / 2, H * 0.9);
  }

  bindSlider('rl-sim-velocity', v => { beta = v; draw(); });
  draw();
})();

/* ---------------- 8. Black Hole (Schwarzschild radius) ---------------- */
(function blackHoleSim() {
  const canvas = document.getElementById('sim-blackhole');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  let massSolar = 5;
  let t = 0;

  function schwarzschildPx(mSolar) {
    // scaled illustratively, not to real physical pixel-scale
    return 10 + Math.sqrt(mSolar) * 9;
  }

  function step() {
    ctx.clearRect(0, 0, W, H);
    const rs = schwarzschildPx(massSolar);

    // accretion disk
    ctx.strokeStyle = 'rgba(226,155,63,0.35)';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.ellipse(cx, cy, rs * 2.6, rs * 0.9, 0, 0, Math.PI * 2); ctx.stroke();

    // photon sphere ring, faint
    ctx.strokeStyle = 'rgba(139,143,199,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, rs * 1.5, 0, Math.PI * 2); ctx.stroke();

    // orbiting photon dot
    t += 0.03;
    const px = cx + rs * 1.5 * Math.cos(t);
    const py = cy + rs * 1.5 * Math.sin(t) * 0.4;
    ctx.fillStyle = '#F3EDE0';
    ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();

    // event horizon (solid black)
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(cx, cy, rs, 0, Math.PI * 2); ctx.fill();

    requestAnimationFrame(step);
  }

  bindSlider('bh-sim-mass', v => { massSolar = v; });
  step();
})();
