/* ==========================================================================
   Live data, fetched straight from the visitor's browser (no backend).

   NASA_API_KEY defaults to DEMO_KEY, which is real but rate-limited
   (30 requests/hour, 50/day, shared by everyone using DEMO_KEY). Get a
   free personal key in seconds at https://api.nasa.gov and paste it below
   before this gets real traffic.
   ========================================================================== */

const NASA_API_KEY = 'DEMO_KEY';

/* ---- 1. Astronomy Picture of the Day ---- */
async function loadAPOD() {
  const el = document.getElementById('apod-panel');
  if (!el) return;
  try {
    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
    if (!res.ok) throw new Error('APOD request failed');
    const data = await res.json();
    el.innerHTML = `
      <h3>${data.title}</h3>
      ${data.media_type === 'image'
        ? `<img src="${data.url}" alt="${data.title}">`
        : `<p class="loading">Today's feature is a video - <a href="${data.url}" target="_blank" rel="noopener">watch it here</a>.</p>`}
      <p class="excerpt">${(data.explanation || '').slice(0, 220)}${data.explanation && data.explanation.length > 220 ? '...' : ''}</p>
    `;
  } catch (e) {
    el.innerHTML = `<h3>Astronomy Picture of the Day</h3><p class="loading">Couldn't load right now - NASA's API may be rate-limited. Try again shortly.</p>`;
  }
}

/* ---- 2. ISS current position ---- */
async function loadISS() {
  const el = document.getElementById('iss-panel');
  const dot = document.getElementById('iss-dot');
  const coordsEl = document.getElementById('iss-coords');
  if (!el) return;
  try {
    const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    if (!res.ok) throw new Error('ISS request failed');
    const data = await res.json();
    const leftPct = ((data.longitude + 180) / 360) * 100;
    const topPct = ((90 - data.latitude) / 180) * 100;
    dot.style.left = leftPct + '%';
    dot.style.top = topPct + '%';
    coordsEl.textContent = `Lat ${data.latitude.toFixed(2)}, Lon ${data.longitude.toFixed(2)} - altitude ${Math.round(data.altitude)} km, speed ${Math.round(data.velocity)} km/h`;
  } catch (e) {
    coordsEl.textContent = "Couldn't load the ISS position right now.";
  }
}

/* ---- 3. Near-Earth asteroids (today) ---- */
async function loadAsteroids() {
  const el = document.getElementById('neo-list');
  if (!el) return;
  const today = new Date().toISOString().slice(0, 10);
  try {
    const res = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`);
    if (!res.ok) throw new Error('NEO request failed');
    const data = await res.json();
    const list = (data.near_earth_objects && data.near_earth_objects[today]) || [];
    if (!list.length) {
      el.innerHTML = '<li>No tracked close approaches for today.</li>';
      return;
    }
    el.innerHTML = list.slice(0, 6).map(neo => {
      const approach = neo.close_approach_data[0];
      const distKm = Math.round(parseFloat(approach.miss_distance.kilometers)).toLocaleString();
      const diamKm = neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2);
      return `<li><strong>${neo.name}</strong> &ndash; ~${diamKm} km wide, passing at ${distKm} km${neo.is_potentially_hazardous_asteroid ? ' &ndash; flagged potentially hazardous' : ''}</li>`;
    }).join('');
  } catch (e) {
    el.innerHTML = "<li>Couldn't load today's asteroid data right now.</li>";
  }
}

/* ---- 4. JWST image gallery (NASA image search, no key required) ---- */
async function loadJWSTGallery() {
  const el = document.getElementById('jwst-grid');
  if (!el) return;
  try {
    const res = await fetch('https://images-api.nasa.gov/search?q=james%20webb%20space%20telescope&media_type=image');
    if (!res.ok) throw new Error('Image search failed');
    const data = await res.json();
    const items = (data.collection && data.collection.items) || [];
    el.innerHTML = items.slice(0, 6).map(item => {
      const link = item.links && item.links[0] && item.links[0].href;
      const title = item.data && item.data[0] && item.data[0].title;
      return link ? `<img src="${link}" alt="${title || 'JWST image'}" loading="lazy">` : '';
    }).join('');
  } catch (e) {
    el.innerHTML = '<p class="loading">Couldn\u2019t load the gallery right now.</p>';
  }
}

/* ---- 5. Aurora forecast (NOAA Kp index, free, no key) ---- */
async function loadAurora() {
  const el = document.getElementById('aurora-readout');
  if (!el) return;
  try {
    const res = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
    if (!res.ok) throw new Error('Aurora request failed');
    const data = await res.json();
    const latest = data[data.length - 1];
    const kp = parseFloat(latest[1]);
    let level = 'Quiet';
    if (kp >= 7) level = 'Strong storm - aurora visible far from the poles';
    else if (kp >= 5) level = 'Minor to moderate storm - aurora possible at high latitudes';
    else if (kp >= 4) level = 'Unsettled - slight chance at very high latitudes';
    el.innerHTML = `Current Kp index: <strong>${kp}</strong><br>${level}`;
  } catch (e) {
    el.innerHTML = 'Couldn\u2019t load the aurora forecast right now.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadAPOD();
  loadISS();
  loadAsteroids();
  loadJWSTGallery();
  loadAurora();
});
