/* ==========================================================================
   Aircraft Database: fastest and most-produced aircraft in history, plus a
   real interactive Speed vs. Service Ceiling chart (same pattern as the old
   Hertzsprung-Russell diagram, adapted to aviation).
   ========================================================================== */

const FASTEST_AIRCRAFT = [
  ['North American X-15', '7,274 km/h (Mach 6.7)', 'Experimental rocket plane, 1967 record'],
  ['Lockheed YF-12', '3,661 km/h', 'Interceptor prototype'],
  ['Lockheed SR-71 Blackbird', '3,540 km/h (Mach 3.3)', 'Fastest air-breathing manned aircraft'],
  ['MiG-25 Foxbat', '3,494 km/h (Mach 3.2)', 'Soviet interceptor'],
  ['XB-70 Valkyrie', '3,309 km/h', 'Experimental Mach 3 bomber'],
  ['MiG-31', '3,000 km/h (Mach 2.83)', 'Interceptor'],
  ['F-15 Eagle', '2,655 km/h (Mach 2.5)', 'Air superiority fighter'],
  ['F-22 Raptor', '2,414 km/h (Mach 2.25)', 'Stealth fighter'],
  ['Tupolev Tu-144', '2,200 km/h', 'Soviet supersonic airliner'],
  ['Concorde', '2,180 km/h (Mach 2.04)', 'Supersonic airliner'],
];

const MOST_PRODUCED_AIRCRAFT = [
  ['Cessna 172', '44,000+ built', 'Most-produced aircraft in history'],
  ['Ilyushin Il-2', '~36,000 built', 'WWII ground-attack aircraft'],
  ['Messerschmitt Bf 109', '~34,000 built', 'WWII fighter'],
  ['Piper PA-28 Cherokee family', '32,000+ built', 'General aviation trainer/tourer'],
  ['Antonov An-2', '~18,000 built', 'Biplane utility aircraft'],
  ['Yakovlev Yak-9', '~16,700 built', 'WWII fighter'],
  ['Douglas DC-3', '~16,000 built', 'Includes military C-47 variant'],
  ['Supermarine Spitfire', '~20,300 built', 'WWII fighter'],
  ['Mikoyan MiG-21', '11,000+ built', 'Cold War-era fighter'],
  ['Boeing 737', '11,000+ built', 'Best-selling commercial jet airliner'],
];

const PERFORMANCE_DATA = [
  ['X-15', 7274, 107960, 'Experimental'],
  ['SR-71 Blackbird', 3540, 25900, 'Reconnaissance'],
  ['YF-12', 3661, 24400, 'Reconnaissance'],
  ['MiG-25', 3494, 20700, 'Interceptor'],
  ['U-2', 850, 21000, 'Reconnaissance'],
  ['F-22 Raptor', 2414, 19800, 'Fighter'],
  ['Concorde', 2180, 18300, 'Airliner'],
  ['F-16', 2120, 15240, 'Fighter'],
  ['P-51 Mustang', 703, 12800, 'Fighter (WWII)'],
  ['Airbus A380', 945, 13100, 'Airliner'],
  ['Boeing 747', 988, 13700, 'Airliner'],
  ['Spitfire', 594, 11300, 'Fighter (WWII)'],
  ['Douglas DC-3', 333, 7100, 'Airliner'],
  ['Cessna 172', 302, 4100, 'General Aviation'],
  ['Wright Flyer', 48, 3, 'Pioneer'],
];

function renderAircraftTables() {
  const fastEl = document.getElementById('fastest-aircraft');
  if (fastEl) {
    fastEl.innerHTML = FASTEST_AIRCRAFT.map(([name, speed, note]) => `
      <div class="mission-card"><span class="yr">${note}</span><h3 style="font-size:1rem; margin:4px 0;">${name}</h3>
      <p style="color:var(--text-dim); font-size:0.85rem; margin:0;">${speed}</p></div>
    `).join('');
  }
  const prodEl = document.getElementById('most-produced-aircraft');
  if (prodEl) {
    prodEl.innerHTML = MOST_PRODUCED_AIRCRAFT.map(([name, count, note]) => `
      <div class="mission-card"><span class="yr">${note}</span><h3 style="font-size:1rem; margin:4px 0;">${name}</h3>
      <p style="color:var(--text-dim); font-size:0.85rem; margin:0;">${count}</p></div>
    `).join('');
  }
}

function catColor(cat) {
  if (cat.includes('Experimental')) return '#E28FD0';
  if (cat.includes('Reconnaissance')) return '#8B8FC7';
  if (cat.includes('Interceptor')) return '#C1440E';
  if (cat.includes('Fighter')) return '#E29B3F';
  if (cat.includes('Airliner')) return '#5FA8D3';
  if (cat.includes('General')) return '#6fbf73';
  if (cat.includes('Pioneer')) return '#F3EDE0';
  return '#F2C14E';
}

function renderPerformanceChart() {
  const canvas = document.getElementById('performance-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const marginL = 65, marginB = 40, marginT = 20, marginR = 20;
  const plotW = W - marginL - marginR, plotH = H - marginT - marginB;

  const speedMax = 8000, ceilingMax = 110000;

  function xPos(speed) { return marginL + (speed / speedMax) * plotW; }
  function yPos(ceiling) {
    const frac = Math.log10(ceiling + 10) / Math.log10(ceilingMax);
    return marginT + (1 - frac) * plotH;
  }

  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(243,237,224,0.15)';
  ctx.beginPath();
  ctx.moveTo(marginL, marginT); ctx.lineTo(marginL, H - marginB); ctx.lineTo(W - marginR, H - marginB);
  ctx.stroke();

  ctx.fillStyle = 'rgba(243,237,224,0.5)';
  ctx.font = '10px monospace'; ctx.textAlign = 'center';
  ctx.fillText('Top Speed (km/h)', W / 2, H - 8);
  ctx.save();
  ctx.translate(14, H / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Service Ceiling (m, log scale)', 0, 0);
  ctx.restore();

  PERFORMANCE_DATA.forEach(([name, speed, ceiling, cat]) => {
    const x = xPos(speed), y = yPos(ceiling);
    ctx.fillStyle = catColor(cat);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top) * (H / rect.height);
    let closest = null, closestDist = 14;
    PERFORMANCE_DATA.forEach(([name, speed, ceiling, cat]) => {
      const x = xPos(speed), y = yPos(ceiling);
      const d = Math.hypot(mx - x, my - y);
      if (d < closestDist) { closestDist = d; closest = { name, speed, ceiling, cat }; }
    });
    const label = document.getElementById('perf-label');
    if (label) {
      label.textContent = closest
        ? `${closest.name} - ${closest.cat}, ${closest.speed} km/h, ${closest.ceiling.toLocaleString()} m ceiling`
        : 'Hover over a point';
    }
  };
}

document.addEventListener('DOMContentLoaded', () => {
  renderAircraftTables();
  renderPerformanceChart();
});
