/* ==========================================================================
   Deep Space Encyclopedia: 9 entries, real explanations, real photos fetched
   live from Wikipedia (same proven pattern used across the site).
   ========================================================================== */

const DEEP_SPACE_ENTRIES = [
  { id: 'black-holes', name: 'Black Holes', wikiTitle: 'Black hole',
    text: 'A region of spacetime where gravity is so strong that nothing, not even light, can escape once it crosses the event horizon. They form when massive stars collapse, or grow at the centers of most galaxies.' },
  { id: 'neutron-stars', name: 'Neutron Stars', wikiTitle: 'Neutron star',
    text: 'The collapsed core left behind after a massive star\u2019s supernova, so dense that a teaspoon of its material would weigh billions of tons. Made almost entirely of tightly packed neutrons.' },
  { id: 'pulsars', name: 'Pulsars', wikiTitle: 'Pulsar',
    text: 'A rapidly rotating neutron star that beams radiation from its magnetic poles. As it spins, the beam sweeps past Earth like a lighthouse, producing extremely regular pulses of radio waves.' },
  { id: 'quasars', name: 'Quasars', wikiTitle: 'Quasar',
    text: 'An extremely luminous galactic core powered by a supermassive black hole devouring surrounding gas and dust. Quasars can outshine their entire host galaxy and are visible across billions of light-years.' },
  { id: 'supernovae', name: 'Supernovae', wikiTitle: 'Supernova',
    text: 'The explosive death of a star, briefly outshining its entire host galaxy. Supernovae forge and scatter heavy elements into space, the raw material for future stars, planets, and life.' },
  { id: 'white-dwarfs', name: 'White Dwarfs', wikiTitle: 'White dwarf',
    text: 'The dense, Earth-sized remnant left behind after a Sun-like star sheds its outer layers. No longer fusing fuel, it slowly cools over billions of years, supported against collapse by electron degeneracy pressure.' },
  { id: 'dark-matter', name: 'Dark Matter', wikiTitle: 'Dark matter',
    text: 'An invisible form of matter that doesn\u2019t emit or absorb light, inferred from its gravitational effects on galaxies and galaxy clusters. It makes up roughly 27% of the universe\u2019s total mass-energy, and its exact nature is still unknown.' },
  { id: 'dark-energy', name: 'Dark Energy', wikiTitle: 'Dark energy',
    text: 'A mysterious force causing the expansion of the universe to accelerate rather than slow down. It makes up roughly 68% of the universe\u2019s total mass-energy content, and remains one of the biggest open questions in physics.' },
  { id: 'gravitational-waves', name: 'Gravitational Waves', wikiTitle: 'Gravitational wave',
    text: 'Ripples in spacetime itself, produced by violent events like colliding black holes or neutron stars. Predicted by Einstein in 1916, they were not directly detected until LIGO\u2019s observation in 2015.' },
];

function renderDeepSpace() {
  const grid = document.getElementById('deepspace-grid');
  if (!grid) return;
  grid.innerHTML = DEEP_SPACE_ENTRIES.map((e, i) => `
    <div class="card">
      <img id="ds-img-${i}" alt="${e.name}" style="width:100%; aspect-ratio:16/9; object-fit:cover; background:var(--void-soft); margin-bottom:14px;">
      <h3>${e.name}</h3>
      <p class="excerpt">${e.text}</p>
    </div>
  `).join('');

  DEEP_SPACE_ENTRIES.forEach(async (e, i) => {
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(e.wikiTitle)}`);
      if (!res.ok) return;
      const data = await res.json();
      const url = data.thumbnail && data.thumbnail.source;
      const el = document.getElementById(`ds-img-${i}`);
      if (url && el) el.src = url;
    } catch (err) { /* leave placeholder */ }
  });
}

document.addEventListener('DOMContentLoaded', renderDeepSpace);
