/* ==========================================================================
   Star Database: real reference data for brightest/nearest stars, plus a
   genuine interactive H-R diagram (temperature vs luminosity, log scale).
   ========================================================================== */

const BRIGHTEST_STARS = [
  ['Sirius', -1.46, '8.6 ly', 'A1V'],
  ['Canopus', -0.74, '310 ly', 'A9II'],
  ['Alpha Centauri', -0.27, '4.37 ly', 'G2V + K1V'],
  ['Arcturus', -0.05, '37 ly', 'K0III'],
  ['Vega', 0.03, '25 ly', 'A0V'],
  ['Capella', 0.08, '43 ly', 'G3III'],
  ['Rigel', 0.13, '860 ly', 'B8Ia'],
  ['Procyon', 0.34, '11.5 ly', 'F5IV'],
  ['Betelgeuse', 0.50, '640 ly', 'M1Ia (variable)'],
  ['Achernar', 0.46, '139 ly', 'B6V'],
];

const NEAREST_STARS = [
  ['Proxima Centauri', '4.24 ly', 'M5.5V (red dwarf)'],
  ['Alpha Centauri A', '4.37 ly', 'G2V'],
  ['Alpha Centauri B', '4.37 ly', 'K1V'],
  ['Barnard\u2019s Star', '5.96 ly', 'M4V'],
  ['Wolf 359', '7.86 ly', 'M6V'],
  ['Lalande 21185', '8.31 ly', 'M2V'],
  ['Sirius A', '8.6 ly', 'A1V'],
  ['Sirius B', '8.6 ly', 'White dwarf (DA2)'],
  ['Luyten 726-8 (UV Ceti)', '8.7 ly', 'M5.5V'],
  ['Ross 154', '9.7 ly', 'M3.5V'],
];

const HR_STARS = [
  ['Sun', 5778, 1, 'Main Sequence G'],
  ['Sirius A', 9940, 25.4, 'Main Sequence A'],
  ['Rigel', 12100, 120000, 'Supergiant B'],
  ['Betelgeuse', 3500, 126000, 'Supergiant M'],
  ['Proxima Centauri', 3042, 0.0017, 'Red Dwarf M'],
  ['Vega', 9602, 40, 'Main Sequence A'],
  ['Arcturus', 4286, 170, 'Giant K'],
  ['Aldebaran', 3910, 518, 'Giant K'],
  ['Sirius B', 25000, 0.056, 'White Dwarf'],
  ['Polaris', 6015, 2500, 'Supergiant F'],
  ['Barnard\u2019s Star', 3134, 0.0035, 'Red Dwarf M'],
  ['Antares', 3660, 75900, 'Supergiant M'],
  ['Pollux', 4666, 43, 'Giant K'],
  ['Altair', 7550, 10.6, 'Main Sequence A'],
  ['Procyon A', 6530, 6.9, 'Main Sequence F'],
];

function renderStarTables() {
  const brightEl = document.getElementById('brightest-stars');
  if (brightEl) {
    brightEl.innerHTML = BRIGHTEST_STARS.map(([name, mag, dist, type]) => `
      <div class="mission-card"><span class="yr">${type}</span><h3 style="font-size:1rem; margin:4px 0;">${name}</h3>
      <p style="color:var(--cream-dim); font-size:0.85rem; margin:0;">Magnitude ${mag} &middot; ${dist}</p></div>
    `).join('');
  }
  const nearEl = document.getElementById('nearest-stars');
  if (nearEl) {
    nearEl.innerHTML = NEAREST_STARS.map(([name, dist, type]) => `
      <div class="mission-card"><span class="yr">${type}</span><h3 style="font-size:1rem; margin:4px 0;">${name}</h3>
      <p style="color:var(--cream-dim); font-size:0.85rem; margin:0;">${dist} from Earth</p></div>
    `).join('');
  }
}

function specColor(type) {
  if (type.includes('B')) return '#9FD9DB';
  if (type.includes('A')) return '#F3EDE0';
  if (type.includes('F')) return '#F5F0C8';
  if (type.includes('G')) return '#F2C14E';
  if (type.includes('K')) return '#E29B3F';
  if (type.includes('M') || type.includes('Red')) return '#C1440E';
  return '#8B8FC7';
}

function renderHRDiagram() {
  const canvas = document.getElementById('hr-diagram');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const marginL = 60, marginB = 40, marginT = 20, marginR = 20;
  const plotW = W - marginL - marginR, plotH = H - marginT - marginB;

  const tMin = 2500, tMax = 30000;
  const lMin = 0.0001, lMax = 200000;

  function xPos(temp) {
    const frac = (Math.log10(tMax) - Math.log10(temp)) / (Math.log10(tMax) - Math.log10(tMin));
    return marginL + frac * plotW;
  }
  function yPos(lum) {
    const frac = (Math.log10(lMax) - Math.log10(lum)) / (Math.log10(lMax) - Math.log10(lMin));
    return marginT + frac * plotH;
  }

  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(243,237,224,0.15)';
  ctx.beginPath();
  ctx.moveTo(marginL, marginT); ctx.lineTo(marginL, H - marginB); ctx.lineTo(W - marginR, H - marginB);
  ctx.stroke();

  ctx.fillStyle = 'rgba(243,237,224,0.5)';
  ctx.font = '10px monospace'; ctx.textAlign = 'center';
  ctx.fillText('Hotter \u2190  Temperature (K)  \u2192 Cooler', W / 2, H - 8);
  ctx.save();
  ctx.translate(14, H / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Luminosity (Sun = 1, log scale)', 0, 0);
  ctx.restore();

  HR_STARS.forEach(([name, temp, lum, type]) => {
    const x = xPos(temp), y = yPos(lum);
    ctx.fillStyle = specColor(type);
    ctx.beginPath();
    const r = Math.max(3, Math.min(10, 3 + Math.log10(lum + 1)));
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });

  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top) * (H / rect.height);
    let closest = null, closestDist = 14;
    HR_STARS.forEach(([name, temp, lum, type]) => {
      const x = xPos(temp), y = yPos(lum);
      const d = Math.hypot(mx - x, my - y);
      if (d < closestDist) { closestDist = d; closest = { name, temp, lum, type }; }
    });
    const label = document.getElementById('hr-label');
    if (label) {
      label.textContent = closest
        ? `${closest.name} - ${closest.type}, ${closest.temp} K, ${closest.lum} L\u2609`
        : 'Hover over a point';
    }
  };
}

document.addEventListener('DOMContentLoaded', () => {
  renderStarTables();
  renderHRDiagram();
});
