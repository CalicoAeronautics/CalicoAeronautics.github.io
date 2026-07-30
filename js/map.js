/* ==========================================================================
   Discovery Map: a real Leaflet map (OpenStreetMap/CARTO dark tiles, no API
   key needed) with ~26 real discovery locations. Toggle between Map View
   and List View. Click a marker or list item for full details in a modal.
   ========================================================================== */

const DISCOVERIES = [
  { city: 'Cambridge, England', lat: 52.205, lon: 0.121, year: '1687', discovery: 'Newton\u2019s Laws of Motion & Universal Gravitation', person: 'Isaac Newton' },
  { city: 'London, England', lat: 51.507, lon: -0.128, year: '1831', discovery: 'Electromagnetic Induction', person: 'Michael Faraday' },
  { city: 'London, England', lat: 51.507, lon: -0.128, year: '1859', discovery: 'On the Origin of Species published', person: 'Charles Darwin' },
  { city: 'London, England', lat: 51.507, lon: -0.128, year: '1928', discovery: 'Penicillin', person: 'Alexander Fleming' },
  { city: 'Berlin, Germany', lat: 52.520, lon: 13.405, year: '1915', discovery: 'General Relativity', person: 'Albert Einstein' },
  { city: 'Berlin, Germany', lat: 52.520, lon: 13.405, year: '1900', discovery: 'Quantum Theory of Blackbody Radiation', person: 'Max Planck' },
  { city: 'G\u00f6ttingen, Germany', lat: 51.534, lon: 9.935, year: '1918', discovery: 'Noether\u2019s Theorem', person: 'Emmy Noether' },
  { city: 'Bern, Switzerland', lat: 46.948, lon: 7.447, year: '1905', discovery: 'The "Miracle Year" Papers (Special Relativity, Photoelectric Effect)', person: 'Albert Einstein' },
  { city: 'Warsaw, Poland', lat: 52.229, lon: 21.012, year: '1867', discovery: 'Birthplace of Marie Curie', person: 'Marie Curie' },
  { city: 'Paris, France', lat: 48.857, lon: 2.352, year: '1898', discovery: 'Discovery of Polonium & Radium', person: 'Marie & Pierre Curie' },
  { city: 'Paris, France', lat: 48.857, lon: 2.352, year: '1789', discovery: 'Law of Conservation of Mass', person: 'Antoine Lavoisier' },
  { city: 'Pisa, Italy', lat: 43.716, lon: 10.400, year: '1589', discovery: 'Experiments on Falling Bodies', person: 'Galileo Galilei' },
  { city: 'Padua, Italy', lat: 45.406, lon: 11.877, year: '1543', discovery: 'De Humani Corporis Fabrica (Modern Anatomy)', person: 'Andreas Vesalius' },
  { city: 'Syracuse, Sicily', lat: 37.075, lon: 15.287, year: 'c. 250 BCE', discovery: 'Principle of Buoyancy', person: 'Archimedes' },
  { city: 'Princeton, USA', lat: 40.348, lon: -74.659, year: '1933\u20131955', discovery: 'Einstein\u2019s later career at the Institute for Advanced Study', person: 'Albert Einstein' },
  { city: 'Los Alamos, USA', lat: 35.884, lon: -106.304, year: '1945', discovery: 'First Controlled Nuclear Chain Reaction Applications', person: 'Manhattan Project team' },
  { city: 'Cambridge, USA', lat: 42.361, lon: -71.092, year: '1948', discovery: 'Quantum Electrodynamics (QED)', person: 'Richard Feynman' },
  { city: 'Copenhagen, Denmark', lat: 55.676, lon: 12.568, year: '1913', discovery: 'The Bohr Model of the Atom', person: 'Niels Bohr' },
  { city: 'Delft, Netherlands', lat: 52.012, lon: 4.359, year: '1674', discovery: 'First Observations of Bacteria', person: 'Antonie van Leeuwenhoek' },
  { city: 'The Hague, Netherlands', lat: 52.079, lon: 4.309, year: '1655', discovery: 'Discovery of Titan, Saturn\u2019s Largest Moon', person: 'Christiaan Huygens' },
  { city: 'Uppsala, Sweden', lat: 59.858, lon: 17.638, year: '1735', discovery: 'Systema Naturae (Binomial Nomenclature)', person: 'Carl Linnaeus' },
  { city: 'Saint Petersburg, Russia', lat: 59.934, lon: 30.335, year: '1869', discovery: 'The Periodic Table of Elements', person: 'Dmitri Mendeleev' },
  { city: 'Athens, Greece', lat: 37.984, lon: 23.728, year: 'c. 350 BCE', discovery: 'Foundational Works in Logic & Natural Philosophy', person: 'Aristotle' },
  { city: 'Alexandria, Egypt', lat: 31.200, lon: 29.918, year: '240 BCE', discovery: 'Earth\u2019s Circumference Measured', person: 'Eratosthenes' },
  { city: 'Alexandria, Egypt', lat: 31.200, lon: 29.918, year: 'c. 300 BCE', discovery: 'Elements (Foundations of Geometry)', person: 'Euclid' },
  { city: 'Nanyang, China', lat: 33.000, lon: 112.528, year: '132 CE', discovery: 'The First Seismoscope', person: 'Zhang Heng' },
  { city: 'Vienna, Austria', lat: 48.208, lon: 16.373, year: '1926', discovery: 'The Schr\u00f6dinger Equation', person: 'Erwin Schr\u00f6dinger' },
  { city: 'Dublin, Ireland', lat: 53.349, lon: -6.260, year: '1662', discovery: 'Boyle\u2019s Law', person: 'Robert Boyle' },
  { city: 'Patna, India', lat: 25.612, lon: 85.141, year: 'c. 499 CE', discovery: 'Aryabhatiya (Astronomy & the Value of Pi)', person: 'Aryabhata' },
  { city: 'Tokyo, Japan', lat: 35.682, lon: 139.759, year: '1935', discovery: 'Meson Theory of Nuclear Forces', person: 'Hideki Yukawa' },
  { city: 'Bukhara (historic Persia)', lat: 39.768, lon: 64.421, year: 'c. 1025', discovery: 'The Canon of Medicine', person: 'Avicenna' },
];

let leafletMap = null;

function initLeafletMap() {
  const el = document.getElementById('leaflet-map');
  if (!el || leafletMap || typeof L === 'undefined') return;

  leafletMap = L.map('leaflet-map', { scrollWheelZoom: false }).setView([30, 15], 2);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 18,
  }).addTo(leafletMap);

  const amberIcon = L.divIcon({
    className: '',
    html: '<div style="width:12px;height:12px;border-radius:50%;background:#E29B3F;box-shadow:0 0 0 5px rgba(226,155,63,0.2);"></div>',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

  DISCOVERIES.forEach((d, i) => {
    const marker = L.marker([d.lat, d.lon], { icon: amberIcon }).addTo(leafletMap);
    marker.on('click', () => openDiscoveryModal(i));
  });
}

function renderListView() {
  const el = document.getElementById('discovery-list-view');
  if (!el) return;
  el.innerHTML = DISCOVERIES.map((d, i) => `
    <div class="card" data-idx="${i}" style="cursor:pointer;">
      <span class="cat-tag">${d.year}</span>
      <h3 style="font-size:1.05rem;">${d.discovery}</h3>
      <p class="excerpt">${d.person} &middot; ${d.city}</p>
    </div>
  `).join('');
  el.querySelectorAll('[data-idx]').forEach(card => {
    card.addEventListener('click', () => openDiscoveryModal(parseInt(card.dataset.idx)));
  });
}

function openDiscoveryModal(i) {
  const d = DISCOVERIES[i];
  document.getElementById('map-modal-body').innerHTML = `
    <span class="cat-tag">${d.year}</span>
    <h3 style="font-size:1.4rem; margin-top:8px;">${d.discovery}</h3>
    <p style="color:var(--cream-dim); margin-top:10px;">${d.person} &middot; ${d.city}</p>
  `;
  document.getElementById('map-modal').classList.add('open');
}

function setView(mode) {
  const mapEl = document.getElementById('leaflet-map');
  const listEl = document.getElementById('discovery-list-view');
  const mapBtn = document.getElementById('view-map-btn');
  const listBtn = document.getElementById('view-list-btn');
  if (mode === 'map') {
    mapEl.style.display = 'block';
    listEl.style.display = 'none';
    mapBtn.classList.add('active');
    listBtn.classList.remove('active');
    initLeafletMap();
    setTimeout(() => leafletMap && leafletMap.invalidateSize(), 50);
  } else {
    mapEl.style.display = 'none';
    listEl.style.display = 'grid';
    mapBtn.classList.remove('active');
    listBtn.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('leaflet-map')) return;
  renderListView();
  setView('map');
  document.getElementById('view-map-btn')?.addEventListener('click', () => setView('map'));
  document.getElementById('view-list-btn')?.addEventListener('click', () => setView('list'));
  document.getElementById('map-modal-close')?.addEventListener('click', () => {
    document.getElementById('map-modal').classList.remove('open');
  });
  document.getElementById('map-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'map-modal') document.getElementById('map-modal').classList.remove('open');
  });
});
