/* ==========================================================================
   Aviation Map: a real Leaflet map (OpenStreetMap/CARTO dark tiles, no API
   key needed) with real aviation history locations. Toggle between Map View
   and List View. Click a marker or list item for full details in a modal.
   ========================================================================== */

const DISCOVERIES = [
  { city: 'Kitty Hawk, North Carolina, USA', lat: 36.013, lon: -75.672, year: '1903', discovery: 'First powered, controlled, sustained flight', person: 'Wright Brothers', wikiTitle: 'Wright Flyer' },
  { city: 'Dayton, Ohio, USA', lat: 39.759, lon: -84.192, year: '1899-1905', discovery: 'Wright Brothers\u2019 bicycle shop and early glider development', person: 'Wright Brothers', wikiTitle: 'Wright brothers' },
  { city: 'Lichterfelde, Berlin, Germany', lat: 52.434, lon: 13.322, year: '1891-1896', discovery: 'Over 2,000 documented glider flights', person: 'Otto Lilienthal', wikiTitle: 'Otto Lilienthal' },
  { city: 'Bagatelle, Paris, France', lat: 48.869, lon: 2.248, year: '1906', discovery: 'First publicly witnessed powered flight in Europe', person: 'Alberto Santos-Dumont', wikiTitle: 'Alberto Santos-Dumont' },
  { city: 'Le Bourget, Paris, France', lat: 48.969, lon: 2.441, year: '1927', discovery: 'Landing site after the first solo transatlantic flight', person: 'Charles Lindbergh', wikiTitle: 'Spirit of St. Louis' },
  { city: 'Seattle, Washington, USA', lat: 47.606, lon: -122.332, year: '1916', discovery: 'William Boeing founds what became the Boeing Company', person: 'William Boeing', wikiTitle: 'Boeing' },
  { city: 'Edwards Air Force Base, California, USA', lat: 34.905, lon: -117.884, year: '1947', discovery: 'First aircraft to break the sound barrier in level flight', person: 'Chuck Yeager, Bell X-1', wikiTitle: 'Bell X-1' },
  { city: 'Burbank, California, USA', lat: 34.181, lon: -118.309, year: '1943-1990s', discovery: 'Lockheed\u2019s Skunk Works, birthplace of the U-2 and SR-71', person: 'Kelly Johnson', wikiTitle: 'Lockheed SR-71 Blackbird' },
  { city: 'Toulouse, France', lat: 43.605, lon: 1.444, year: '1970-present', discovery: 'Airbus headquarters and final assembly for the A380 and other airliners', person: 'Airbus', wikiTitle: 'Airbus A380' },
  { city: 'Melun-Villaroche, France', lat: 48.600, lon: 2.670, year: '1969', discovery: 'First test flight of the Concorde supersonic airliner', person: 'Concorde', wikiTitle: 'Concorde' },
  { city: 'Mojave, California, USA', lat: 35.059, lon: -118.152, year: '1986', discovery: 'Home base for the first non-stop, unrefueled flight around the world', person: 'Rutan Voyager', wikiTitle: 'Rutan Voyager' },
  { city: 'Biggin Hill, England', lat: 51.331, lon: 0.033, year: '1940', discovery: 'A key Royal Air Force fighter base during the Battle of Britain', person: 'RAF Fighter Command', wikiTitle: 'Supermarine Spitfire' },
  { city: 'Farnborough, England', lat: 51.290, lon: -0.760, year: '1930s-present', discovery: 'Historic center of British aviation research and home of the Farnborough Airshow', person: 'Royal Aircraft Establishment', wikiTitle: 'Farnborough Airshow' },
  { city: 'Hawthorne, California, USA', lat: 33.923, lon: -118.326, year: '2004-present', discovery: 'Development site for privately funded crewed spacecraft that grew out of the aerospace industry', person: 'Scaled Composites / SpaceX', wikiTitle: 'SpaceShipOne' },
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
      <img id="disc-img-${i}" alt="${d.city}" style="width:100%; aspect-ratio:16/9; object-fit:cover; background:var(--void-soft); margin-bottom:14px;">
      <span class="cat-tag">${d.year}</span>
      <h3 style="font-size:1.05rem;">${d.discovery}</h3>
      <p class="excerpt">${d.person} &middot; ${d.city}</p>
    </div>
  `).join('');
  el.querySelectorAll('[data-idx]').forEach(card => {
    card.addEventListener('click', () => openDiscoveryModal(parseInt(card.dataset.idx)));
  });
  loadDiscoveryImages();
}

async function loadDiscoveryImages() {
  DISCOVERIES.forEach(async (d, i) => {
    const el = document.getElementById(`disc-img-${i}`);
    const modalEl = document.getElementById(`disc-modal-img-${i}`);
    if (!el && !modalEl) return;
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(d.wikiTitle)}`);
      if (!res.ok) return;
      const data = await res.json();
      const url = data.thumbnail && data.thumbnail.source;
      if (url && el) el.src = url;
      if (url && modalEl) modalEl.src = url;
    } catch (e) { /* leave placeholder */ }
  });
}

function openDiscoveryModal(i) {
  const d = DISCOVERIES[i];
  document.getElementById('map-modal-body').innerHTML = `
    <img id="disc-modal-img-${i}" alt="${d.city}" style="width:100%; aspect-ratio:16/9; object-fit:cover; background:var(--void-soft); margin-bottom:16px;">
    <span class="cat-tag">${d.year}</span>
    <h3 style="font-size:1.4rem; margin-top:8px;">${d.discovery}</h3>
    <p style="color:var(--cream-dim); margin-top:10px;">${d.person} &middot; ${d.city}</p>
  `;
  document.getElementById('map-modal').classList.add('open');
  loadDiscoveryImages();
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
