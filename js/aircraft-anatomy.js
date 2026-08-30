/* ==========================================================================
   Aircraft Anatomy: the major parts of a fixed-wing aircraft, explained,
   with real photos fetched live from Wikipedia.
   ========================================================================== */

const AIRCRAFT_PARTS = [
  { id: 'wings', name: 'Wings', wikiTitle: 'Wing',
    text: 'The primary lift-generating surface. Their shape (airfoil cross-section), area, and aspect ratio determine how efficiently an aircraft can fly, and directly set its stall speed.' },
  { id: 'fuselage', name: 'Fuselage', wikiTitle: 'Fuselage',
    text: 'The main body of the aircraft, housing the crew, passengers, and cargo. It also carries the structural loads that connect the wings, tail, and landing gear together.' },
  { id: 'empennage', name: 'Empennage (Tail Assembly)', wikiTitle: 'Empennage',
    text: 'The tail section, made up of the horizontal and vertical stabilizers. It provides stability and houses the elevator and rudder control surfaces.' },
  { id: 'powerplant', name: 'Powerplant', wikiTitle: 'Aircraft engine',
    text: 'The engine and everything needed to generate thrust - whether a piston engine and propeller, a turbojet, or a high-bypass turbofan.' },
  { id: 'landing-gear', name: 'Landing Gear', wikiTitle: 'Landing gear',
    text: 'The wheels, struts, and shock absorbers that support the aircraft on the ground and absorb the impact of landing.' },
  { id: 'cockpit', name: 'Cockpit &amp; Avionics', wikiTitle: 'Cockpit',
    text: 'Where the flight crew controls the aircraft, surrounded by instruments and avionics for navigation, communication, and monitoring aircraft systems.' },
  { id: 'ailerons', name: 'Ailerons', wikiTitle: 'Aileron',
    text: 'Hinged control surfaces near the wingtips that move in opposite directions to roll the aircraft left or right around its longitudinal axis.' },
  { id: 'elevator', name: 'Elevator', wikiTitle: 'Elevator (aeronautics)',
    text: 'A hinged surface on the horizontal stabilizer that controls pitch, raising or lowering the aircraft\u2019s nose.' },
  { id: 'rudder', name: 'Rudder', wikiTitle: 'Rudder',
    text: 'A hinged surface on the vertical stabilizer that controls yaw, turning the aircraft\u2019s nose left or right.' },
  { id: 'flaps', name: 'Flaps &amp; Slats', wikiTitle: 'Flap (aeronautics)',
    text: 'Deployable surfaces on the wing\u2019s trailing (flaps) and leading (slats) edges that increase lift and drag at low speeds, allowing slower takeoffs and landings.' },
];

function renderAircraftParts() {
  const grid = document.getElementById('anatomy-grid');
  if (!grid) return;
  grid.innerHTML = AIRCRAFT_PARTS.map((p, i) => `
    <div class="card">
      <img id="ap-img-${i}" alt="${p.name}" style="width:100%; aspect-ratio:16/9; object-fit:cover; background:var(--bg-panel); margin-bottom:14px;">
      <h3>${p.name}</h3>
      <p class="excerpt">${p.text}</p>
    </div>
  `).join('');

  AIRCRAFT_PARTS.forEach(async (p, i) => {
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(p.wikiTitle)}`);
      if (!res.ok) return;
      const data = await res.json();
      const url = data.thumbnail && data.thumbnail.source;
      const el = document.getElementById(`ap-img-${i}`);
      if (url && el) el.src = url;
    } catch (e) { /* leave placeholder */ }
  });
}

document.addEventListener('DOMContentLoaded', renderAircraftParts);
