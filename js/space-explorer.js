/* ==========================================================================
   Space Explorer: click a planet -> see facts + orbit info -> click a moon
   (if it has one) -> see moon facts. All from one data object.
   ========================================================================== */

const PLANETS = [
  { id: 'mercury', name: 'Mercury', color: '#B8ABA2', size: 14,
    diameter: '4,879 km', distance: '57.9 million km', orbitalPeriod: '88 days', moons: [] },
  { id: 'venus', name: 'Venus', color: '#E8C99B', size: 18,
    diameter: '12,104 km', distance: '108.2 million km', orbitalPeriod: '225 days', moons: [] },
  { id: 'earth', name: 'Earth', color: '#5FA8D3', size: 19,
    diameter: '12,742 km', distance: '149.6 million km', orbitalPeriod: '365.25 days',
    moons: [{ name: 'The Moon', diameter: '3,474 km', distance: '384,400 km from Earth', orbitalPeriod: '27.3 days' }] },
  { id: 'mars', name: 'Mars', color: '#C1440E', size: 16,
    diameter: '6,779 km', distance: '227.9 million km', orbitalPeriod: '687 days',
    moons: [
      { name: 'Phobos', diameter: '22.4 km', distance: '9,376 km from Mars', orbitalPeriod: '7.7 hours' },
      { name: 'Deimos', diameter: '12.4 km', distance: '23,463 km from Mars', orbitalPeriod: '30.3 hours' },
    ] },
  { id: 'jupiter', name: 'Jupiter', color: '#E0B98F', size: 34,
    diameter: '139,820 km', distance: '778.5 million km', orbitalPeriod: '11.9 years',
    moons: [
      { name: 'Io', diameter: '3,643 km', distance: '421,700 km from Jupiter', orbitalPeriod: '1.8 days' },
      { name: 'Europa', diameter: '3,122 km', distance: '671,100 km from Jupiter', orbitalPeriod: '3.6 days' },
      { name: 'Ganymede', diameter: '5,268 km', distance: '1,070,400 km from Jupiter', orbitalPeriod: '7.2 days' },
    ] },
  { id: 'saturn', name: 'Saturn', color: '#F2D399', size: 30,
    diameter: '116,460 km', distance: '1.43 billion km', orbitalPeriod: '29.5 years',
    moons: [{ name: 'Titan', diameter: '5,150 km', distance: '1,221,900 km from Saturn', orbitalPeriod: '15.9 days' }] },
  { id: 'uranus', name: 'Uranus', color: '#9FD9DB', size: 24,
    diameter: '50,724 km', distance: '2.87 billion km', orbitalPeriod: '84 years', moons: [] },
  { id: 'neptune', name: 'Neptune', color: '#4E6FDE', size: 23,
    diameter: '49,244 km', distance: '4.5 billion km', orbitalPeriod: '165 years', moons: [] },
];

function renderPlanetRow() {
  const row = document.getElementById('planet-row');
  if (!row) return;
  row.innerHTML = PLANETS.map(p => `
    <button class="planet-btn" data-id="${p.id}">
      <span class="orb" style="width:${p.size}px; height:${p.size}px; background:${p.color};"></span>
      <span class="p-label">${p.name}</span>
    </button>
  `).join('');
  row.querySelectorAll('.planet-btn').forEach(btn => {
    btn.addEventListener('click', () => showPlanet(btn.dataset.id));
  });
}

function showPlanet(id) {
  const p = PLANETS.find(pl => pl.id === id);
  if (!p) return;
  document.querySelectorAll('.planet-btn').forEach(b => b.classList.toggle('active', b.dataset.id === id));

  const detail = document.getElementById('planet-detail');
  detail.classList.add('shown');
  detail.innerHTML = `
    <div class="eyebrow">Solar System &rarr; ${p.name}</div>
    <h3 style="font-size:1.6rem; margin-top:10px;">${p.name}</h3>
    <div class="planet-facts">
      <div class="fact"><div class="k">Diameter</div><div class="v">${p.diameter}</div></div>
      <div class="fact"><div class="k">Distance from Sun</div><div class="v">${p.distance}</div></div>
      <div class="fact"><div class="k">Orbital Period</div><div class="v">${p.orbitalPeriod}</div></div>
    </div>
    ${p.moons.length ? `
      <div class="eyebrow" style="margin-top:6px;">Moons - click one</div>
      <div class="moon-list" id="moon-list">
        ${p.moons.map(m => `<button class="tag-pill" data-moon="${m.name}">${m.name}</button>`).join('')}
      </div>
      <div id="moon-detail" style="margin-top:16px;"></div>
    ` : `<p style="color:var(--cream-dim); margin-top:6px;">${p.name} has no known moons.</p>`}
  `;

  detail.querySelectorAll('[data-moon]').forEach(btn => {
    btn.addEventListener('click', () => {
      const moon = p.moons.find(m => m.name === btn.dataset.moon);
      detail.querySelectorAll('[data-moon]').forEach(b => b.classList.toggle('active', b === btn));
      document.getElementById('moon-detail').innerHTML = `
        <div class="planet-facts">
          <div class="fact"><div class="k">Diameter</div><div class="v">${moon.diameter}</div></div>
          <div class="fact"><div class="k">Orbit</div><div class="v">${moon.distance}</div></div>
          <div class="fact"><div class="k">Orbital Period</div><div class="v">${moon.orbitalPeriod}</div></div>
        </div>
      `;
    });
  });

  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.addEventListener('DOMContentLoaded', () => {
  renderPlanetRow();
  if (document.getElementById('planet-row')) showPlanet('earth');
});
