/* ==========================================================================
   Iconic Aircraft: click a plane -> real photo (fetched live from Wikipedia)
   + a full fact sheet. Same interaction pattern the old planet explorer used.
   ========================================================================== */

const AIRCRAFT = [
  { id: 'wright-flyer', name: 'Wright Flyer', wikiTitle: 'Wright Flyer',
    year: '1903', role: 'First powered aircraft', topSpeed: '48 km/h', wingspan: '12.3 m', crew: '1',
    fact: 'Made the first powered, controlled, sustained flight in history on December 17, 1903, covering 37 meters in 12 seconds.' },
  { id: 'spirit-of-st-louis', name: 'Spirit of St. Louis', wikiTitle: 'Spirit of St. Louis',
    year: '1927', role: 'Transatlantic record aircraft', topSpeed: '210 km/h', wingspan: '14 m', crew: '1',
    fact: 'Flown solo, non-stop by Charles Lindbergh from New York to Paris in 33.5 hours, the first solo transatlantic flight.' },
  { id: 'dc-3', name: 'Douglas DC-3', wikiTitle: 'Douglas DC-3',
    year: '1935', role: 'Commercial airliner', topSpeed: '333 km/h', wingspan: '29 m', crew: '2-3',
    fact: 'Revolutionized commercial air travel by being the first airliner profitable on passenger revenue alone. Many are still flying today.' },
  { id: 'spitfire', name: 'Supermarine Spitfire', wikiTitle: 'Supermarine Spitfire',
    year: '1938', role: 'Fighter aircraft', topSpeed: '594 km/h', wingspan: '11.2 m', crew: '1',
    fact: 'The iconic British fighter of the Battle of Britain, known for its elliptical wing and exceptional maneuverability.' },
  { id: 'p51-mustang', name: 'North American P-51 Mustang', wikiTitle: 'North American P-51 Mustang',
    year: '1940', role: 'Long-range escort fighter', topSpeed: '703 km/h', wingspan: '11.3 m', crew: '1',
    fact: 'Its long range let it escort bombers deep into enemy territory in WWII, something no earlier fighter could do.' },
  { id: 'boeing-707', name: 'Boeing 707', wikiTitle: 'Boeing 707',
    year: '1958', role: 'Commercial jet airliner', topSpeed: '1010 km/h', wingspan: '39.9 m', crew: '3-4',
    fact: 'Launched the jet age of mass commercial air travel, cutting transatlantic flight times roughly in half compared to propeller airliners.' },
  { id: 'sr-71', name: 'Lockheed SR-71 Blackbird', wikiTitle: 'Lockheed SR-71 Blackbird',
    year: '1966', role: 'Strategic reconnaissance aircraft', topSpeed: '3540 km/h (Mach 3.3)', wingspan: '16.9 m', crew: '2',
    fact: 'Still the fastest air-breathing manned aircraft ever built. It could outrun missiles fired at it by simply accelerating.' },
  { id: 'boeing-747', name: 'Boeing 747', wikiTitle: 'Boeing 747',
    year: '1970', role: 'Wide-body airliner', topSpeed: '988 km/h', wingspan: '68.4 m', crew: '2-3',
    fact: 'The original "Jumbo Jet" - its hump-backed design became one of the most recognizable aircraft silhouettes ever built.' },
  { id: 'concorde', name: 'Concorde', wikiTitle: 'Concorde',
    year: '1969', role: 'Supersonic airliner', topSpeed: '2180 km/h (Mach 2.04)', wingspan: '25.6 m', crew: '3',
    fact: 'The only supersonic airliner to see sustained commercial service, cutting New York-London flights to under 3.5 hours.' },
  { id: 'f16', name: 'F-16 Fighting Falcon', wikiTitle: 'General Dynamics F-16 Fighting Falcon',
    year: '1974', role: 'Multirole fighter', topSpeed: '2120 km/h (Mach 2)', wingspan: '9.96 m', crew: '1',
    fact: 'One of the most produced and widely used fighter jets in history, flown by more than 25 countries.' },
  { id: 'a380', name: 'Airbus A380', wikiTitle: 'Airbus A380',
    year: '2005', role: 'Wide-body airliner', topSpeed: '945 km/h', wingspan: '79.8 m', crew: '2 (flight deck)',
    fact: 'The largest passenger airliner ever built, capable of carrying over 800 passengers in an all-economy configuration.' },
  { id: 'rutan-voyager', name: 'Rutan Voyager', wikiTitle: 'Rutan Voyager',
    year: '1986', role: 'Experimental long-range aircraft', topSpeed: '196 km/h', wingspan: '33.8 m', crew: '2',
    fact: 'Completed the first non-stop, non-refueled flight around the world, taking just over 9 days.' },
];

function renderAircraftRow() {
  const row = document.getElementById('aircraft-row');
  if (!row) return;
  row.innerHTML = AIRCRAFT.map(a => `
    <button class="planet-btn" data-id="${a.id}">
      <span class="orb" style="width:22px; height:22px; background:var(--amber); border-radius:4px;"></span>
      <span class="p-label">${a.name}</span>
    </button>
  `).join('');
  row.querySelectorAll('.planet-btn').forEach(btn => {
    btn.addEventListener('click', () => showAircraft(btn.dataset.id));
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
  } catch (e) { /* leave placeholder */ }
}

function showAircraft(id) {
  const a = AIRCRAFT.find(x => x.id === id);
  if (!a) return;
  document.querySelectorAll('.planet-btn').forEach(b => b.classList.toggle('active', b.dataset.id === id));

  const detail = document.getElementById('aircraft-detail');
  detail.classList.add('shown');
  detail.innerHTML = `
    <div style="display:flex; gap:24px; flex-wrap:wrap; align-items:flex-start;">
      <img id="aircraft-photo" alt="${a.name}" style="width:220px; height:150px; object-fit:cover; background:var(--void-soft); flex-shrink:0;">
      <div style="flex:1; min-width:240px;">
        <h3 style="font-size:1.6rem; margin:0 0 4px;">${a.name}</h3>
        <p style="color:var(--cream-dim); margin:0;">${a.role} &middot; First flight ${a.year}</p>
      </div>
    </div>
    <div class="planet-facts">
      <div class="fact"><div class="k">First Flight</div><div class="v">${a.year}</div></div>
      <div class="fact"><div class="k">Role</div><div class="v">${a.role}</div></div>
      <div class="fact"><div class="k">Top Speed</div><div class="v">${a.topSpeed}</div></div>
      <div class="fact"><div class="k">Wingspan</div><div class="v">${a.wingspan}</div></div>
      <div class="fact"><div class="k">Crew</div><div class="v">${a.crew}</div></div>
    </div>
    <div class="sim-readout" style="font-family:var(--font-body); font-size:0.92rem;">
      <strong>Why it matters:</strong> ${a.fact}
    </div>
  `;
  fetchWikiPhoto(a.wikiTitle, 'aircraft-photo');
  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.addEventListener('DOMContentLoaded', () => {
  renderAircraftRow();
  if (document.getElementById('aircraft-row')) showAircraft('wright-flyer');
});
