/* ==========================================================================
   Space Explorer: click a planet -> real photo (fetched live from Wikipedia,
   same pattern as the Great Scientists page) + a full fact sheet -> click a
   moon for its own photo and facts.
   ========================================================================== */

const PLANETS = [
  { id: 'mercury', name: 'Mercury', color: '#B8ABA2', size: 14, wikiTitle: 'Mercury (planet)',
    diameter: '4,879 km', distance: '57.9 million km', orbitalPeriod: '88 days', dayLength: '59 Earth days',
    mass: '3.30\u00d710\u00b2\u00b3 kg (0.055 Earth)', gravity: '3.7 m/s\u00b2', moonCount: '0',
    atmosphere: 'Essentially none (trace exosphere)', meanTemp: '-173\u00b0C to 427\u00b0C (extreme swing)',
    escapeVelocity: '4.3 km/s',
    funFact: 'Mercury\u2019s day (59 Earth days) is two-thirds of its year (88 Earth days) - a 3:2 spin-orbit resonance unique among the planets.',
    moons: [] },

  { id: 'venus', name: 'Venus', color: '#E8C99B', size: 18, wikiTitle: 'Venus',
    diameter: '12,104 km', distance: '108.2 million km', orbitalPeriod: '225 days', dayLength: '243 Earth days (retrograde)',
    mass: '4.87\u00d710\u00b2\u2074 kg (0.815 Earth)', gravity: '8.87 m/s\u00b2', moonCount: '0',
    atmosphere: '96% CO\u2082, ~92\u00d7 Earth\u2019s surface pressure', meanTemp: '~464\u00b0C (hottest planet)',
    escapeVelocity: '10.36 km/s',
    funFact: 'Venus rotates backwards, and so slowly that a single day on Venus is longer than its entire year.',
    moons: [] },

  { id: 'earth', name: 'Earth', color: '#5FA8D3', size: 19, wikiTitle: 'Earth',
    diameter: '12,742 km', distance: '149.6 million km', orbitalPeriod: '365.25 days', dayLength: '24 hours',
    mass: '5.97\u00d710\u00b2\u2074 kg (1 Earth mass)', gravity: '9.8 m/s\u00b2', moonCount: '1',
    atmosphere: '78% nitrogen, 21% oxygen', meanTemp: '~15\u00b0C',
    escapeVelocity: '11.2 km/s',
    funFact: 'Earth is the only known world with both plate tectonics and stable liquid surface water at the same time.',
    moons: [
      { id: 'moon', name: 'The Moon', wikiTitle: 'Moon', diameter: '3,474 km', distance: '384,400 km from Earth', orbitalPeriod: '27.3 days',
        fact: 'Likely formed from debris after a Mars-sized body struck the early Earth.' },
    ] },

  { id: 'mars', name: 'Mars', color: '#C1440E', size: 16, wikiTitle: 'Mars',
    diameter: '6,779 km', distance: '227.9 million km', orbitalPeriod: '687 days', dayLength: '24h 37m',
    mass: '6.42\u00d710\u00b2\u00b3 kg (0.107 Earth)', gravity: '3.71 m/s\u00b2', moonCount: '2',
    atmosphere: '95% CO\u2082, very thin (~0.6% of Earth\u2019s pressure)', meanTemp: '~-65\u00b0C',
    escapeVelocity: '5.03 km/s',
    funFact: 'Mars hosts Olympus Mons, the tallest volcano in the solar system at roughly 21.9 km high.',
    moons: [
      { id: 'phobos', name: 'Phobos', wikiTitle: 'Phobos (moon)', diameter: '22.4 km', distance: '9,376 km from Mars', orbitalPeriod: '7.7 hours',
        fact: 'Orbits Mars faster than Mars rotates, so it rises in the west and sets in the east.' },
      { id: 'deimos', name: 'Deimos', wikiTitle: 'Deimos (moon)', diameter: '12.4 km', distance: '23,463 km from Mars', orbitalPeriod: '30.3 hours',
        fact: 'The smaller and outer of Mars\u2019s two moons, likely a captured asteroid.' },
    ] },

  { id: 'jupiter', name: 'Jupiter', color: '#E0B98F', size: 34, wikiTitle: 'Jupiter',
    diameter: '139,820 km', distance: '778.5 million km', orbitalPeriod: '11.9 years', dayLength: '~9h 56m (fastest rotation)',
    mass: '1.898\u00d710\u00b2\u2077 kg (317.8 Earth)', gravity: '24.79 m/s\u00b2', moonCount: '90+',
    atmosphere: 'Mostly hydrogen and helium', meanTemp: '~-110\u00b0C (cloud tops)',
    escapeVelocity: '59.5 km/s',
    funFact: 'The Great Red Spot is a giant storm that has raged for at least 350 years - wider than Earth.',
    moons: [
      { id: 'io', name: 'Io', wikiTitle: 'Io (moon)', diameter: '3,643 km', distance: '421,700 km from Jupiter', orbitalPeriod: '1.8 days',
        fact: 'The most volcanically active body in the solar system.' },
      { id: 'europa', name: 'Europa', wikiTitle: 'Europa (moon)', diameter: '3,122 km', distance: '671,100 km from Jupiter', orbitalPeriod: '3.6 days',
        fact: 'Its icy shell likely covers a liquid water ocean - a top target in the search for life.' },
      { id: 'ganymede', name: 'Ganymede', wikiTitle: 'Ganymede (moon)', diameter: '5,268 km', distance: '1,070,400 km from Jupiter', orbitalPeriod: '7.2 days',
        fact: 'The largest moon in the solar system - bigger than the planet Mercury.' },
    ] },

  { id: 'saturn', name: 'Saturn', color: '#F2D399', size: 30, wikiTitle: 'Saturn',
    diameter: '116,460 km', distance: '1.43 billion km', orbitalPeriod: '29.5 years', dayLength: '~10h 33m',
    mass: '5.68\u00d710\u00b2\u2076 kg (95.2 Earth)', gravity: '10.44 m/s\u00b2', moonCount: '140+',
    atmosphere: 'Mostly hydrogen and helium', meanTemp: '~-140\u00b0C',
    escapeVelocity: '35.5 km/s',
    funFact: 'Saturn is the least dense planet in the solar system - it would float in a bathtub big enough to hold it.',
    moons: [
      { id: 'titan', name: 'Titan', wikiTitle: 'Titan (moon)', diameter: '5,150 km', distance: '1,221,900 km from Saturn', orbitalPeriod: '15.9 days',
        fact: 'The only moon with a substantial atmosphere, plus lakes of liquid methane on its surface.' },
      { id: 'enceladus', name: 'Enceladus', wikiTitle: 'Enceladus', diameter: '504 km', distance: '238,000 km from Saturn', orbitalPeriod: '1.4 days',
        fact: 'Geysers at its south pole spray water ice into space from a hidden subsurface ocean.' },
    ] },

  { id: 'uranus', name: 'Uranus', color: '#9FD9DB', size: 24, wikiTitle: 'Uranus',
    diameter: '50,724 km', distance: '2.87 billion km', orbitalPeriod: '84 years', dayLength: '~17h 14m (retrograde)',
    mass: '8.68\u00d710\u00b2\u2075 kg (14.5 Earth)', gravity: '8.69 m/s\u00b2', moonCount: '27',
    atmosphere: 'Hydrogen, helium, methane (gives its blue-green color)', meanTemp: '~-195\u00b0C',
    escapeVelocity: '21.3 km/s',
    funFact: 'Uranus rotates almost exactly on its side (98\u00b0 axial tilt), likely from an ancient collision.',
    moons: [] },

  { id: 'neptune', name: 'Neptune', color: '#4E6FDE', size: 23, wikiTitle: 'Neptune',
    diameter: '49,244 km', distance: '4.5 billion km', orbitalPeriod: '165 years', dayLength: '~16h 6m',
    mass: '1.02\u00d710\u00b2\u2076 kg (17.1 Earth)', gravity: '11.15 m/s\u00b2', moonCount: '14',
    atmosphere: 'Hydrogen, helium, methane', meanTemp: '~-200\u00b0C',
    escapeVelocity: '23.5 km/s',
    funFact: 'Neptune has the fastest winds in the solar system, reaching over 2,100 km/h.',
    moons: [
      { id: 'triton', name: 'Triton', wikiTitle: 'Triton (moon)', diameter: '2,707 km', distance: '354,800 km from Neptune', orbitalPeriod: '5.9 days (retrograde)',
        fact: 'Orbits Neptune backwards - likely a captured Kuiper Belt object slowly spiraling inward.' },
    ] },
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

async function fetchWikiPhoto(wikiTitle, imgElId) {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`);
    if (!res.ok) return;
    const data = await res.json();
    const url = data.thumbnail && data.thumbnail.source;
    const el = document.getElementById(imgElId);
    if (url && el) el.src = url;
  } catch (e) { /* leave placeholder if it fails */ }
}

function showPlanet(id) {
  const p = PLANETS.find(pl => pl.id === id);
  if (!p) return;
  document.querySelectorAll('.planet-btn').forEach(b => b.classList.toggle('active', b.dataset.id === id));

  const detail = document.getElementById('planet-detail');
  detail.classList.add('shown');
  detail.innerHTML = `
    <div style="display:flex; gap:24px; flex-wrap:wrap; align-items:flex-start;">
      <img id="planet-photo" alt="${p.name}" style="width:180px; height:180px; object-fit:cover; border-radius:var(--radius-md); background:${p.color}; flex-shrink:0;">
      <div style="flex:1; min-width:240px;">
        <h3 style="font-size:1.7rem; margin:0 0 4px;">${p.name}</h3>
        <p style="color:var(--cream-dim); margin:0;">Solar System &rarr; ${p.name}</p>
      </div>
    </div>
    <div class="planet-facts">
      <div class="fact"><div class="k">Diameter</div><div class="v">${p.diameter}</div></div>
      <div class="fact"><div class="k">Distance from Sun</div><div class="v">${p.distance}</div></div>
      <div class="fact"><div class="k">Orbital Period</div><div class="v">${p.orbitalPeriod}</div></div>
      <div class="fact"><div class="k">Day Length</div><div class="v">${p.dayLength}</div></div>
      <div class="fact"><div class="k">Mass</div><div class="v">${p.mass}</div></div>
      <div class="fact"><div class="k">Surface Gravity</div><div class="v">${p.gravity}</div></div>
      <div class="fact"><div class="k">Known Moons</div><div class="v">${p.moonCount}</div></div>
      <div class="fact"><div class="k">Escape Velocity</div><div class="v">${p.escapeVelocity}</div></div>
      <div class="fact"><div class="k">Mean Temperature</div><div class="v">${p.meanTemp}</div></div>
      <div class="fact" style="grid-column: 1 / -1;"><div class="k">Atmosphere</div><div class="v">${p.atmosphere}</div></div>
    </div>
    <div class="sim-readout" style="font-family:var(--font-body); font-size:0.92rem;">
      <strong>Fun fact:</strong> ${p.funFact}
    </div>
    ${p.moons.length ? `
      <div style="margin-top:18px;">Moons - click one</div>
      <div class="moon-list" id="moon-list">
        ${p.moons.map(m => `<button class="tag-pill" data-moon="${m.id}">${m.name}</button>`).join('')}
      </div>
      <div id="moon-detail" style="margin-top:16px;"></div>
    ` : `<p style="color:var(--cream-dim); margin-top:16px;">${p.name} has no known moons.</p>`}
  `;

  fetchWikiPhoto(p.wikiTitle, 'planet-photo');

  detail.querySelectorAll('[data-moon]').forEach(btn => {
    btn.addEventListener('click', () => {
      const moon = p.moons.find(m => m.id === btn.dataset.moon);
      detail.querySelectorAll('[data-moon]').forEach(b => b.classList.toggle('active', b === btn));
      document.getElementById('moon-detail').innerHTML = `
        <div style="display:flex; gap:20px; flex-wrap:wrap; align-items:flex-start;">
          <img id="moon-photo" alt="${moon.name}" style="width:120px; height:120px; object-fit:cover; border-radius:var(--radius-sm); background:var(--void-soft); flex-shrink:0;">
          <div style="flex:1; min-width:200px;">
            <h4 style="margin:0 0 10px; font-size:1.1rem; color:var(--cream);">${moon.name}</h4>
            <div class="planet-facts" style="margin:0;">
              <div class="fact"><div class="k">Diameter</div><div class="v">${moon.diameter}</div></div>
              <div class="fact"><div class="k">Orbit</div><div class="v">${moon.distance}</div></div>
              <div class="fact"><div class="k">Orbital Period</div><div class="v">${moon.orbitalPeriod}</div></div>
            </div>
            <p style="color:var(--cream-dim); font-size:0.9rem; margin-top:10px;">${moon.fact}</p>
          </div>
        </div>
      `;
      fetchWikiPhoto(moon.wikiTitle, 'moon-photo');
    });
  });

  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.addEventListener('DOMContentLoaded', () => {
  renderPlanetRow();
  if (document.getElementById('planet-row')) showPlanet('earth');
});
