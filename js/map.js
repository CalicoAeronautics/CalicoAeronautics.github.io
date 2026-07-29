/* ==========================================================================
   Discovery Map: click a pin, see which scientists worked from that country.
   Positions are stylized (percentage-based), not a precise projection.
   ========================================================================== */

const MAP_PINS = [
  { id: 'germany', label: 'Germany', top: '32%', left: '52%',
    scientists: ['Albert Einstein', 'Max Planck', 'Carl Friedrich Gauss'],
    note: 'Birthplace of quantum theory (Planck) and home to Einstein for much of his early career.' },
  { id: 'england', label: 'England', top: '24%', left: '46%',
    scientists: ['Isaac Newton', 'James Clerk Maxwell', 'Paul Dirac', 'Stephen Hawking'],
    note: 'From the Principia to Hawking radiation, three centuries of foundational physics.' },
  { id: 'poland-france', label: 'Poland / France', top: '30%', left: '50%',
    scientists: ['Marie Curie'],
    note: 'Born in Warsaw, did her Nobel Prize-winning work in Paris.' },
  { id: 'italy', label: 'Italy', top: '40%', left: '53%',
    scientists: ['Galileo Galilei'],
    note: 'Pioneered the experimental method that modern physics is built on.' },
  { id: 'usa', label: 'United States', top: '30%', left: '20%',
    scientists: ['Richard Feynman', 'J. Robert Oppenheimer'],
    note: 'Home to Los Alamos, Caltech, and much of 20th-century American physics.' },
];

function renderMapPins() {
  const panel = document.getElementById('map-panel');
  if (!panel) return;
  panel.innerHTML = MAP_PINS.map(p => `
    <button class="map-pin" style="top:${p.top}; left:${p.left};" data-id="${p.id}">
      <span class="dot"></span>
      <span class="label">${p.label}</span>
    </button>
  `).join('');

  panel.querySelectorAll('.map-pin').forEach(pin => {
    pin.addEventListener('click', () => openMapModal(pin.dataset.id));
  });
}

function openMapModal(id) {
  const p = MAP_PINS.find(m => m.id === id);
  if (!p) return;
  document.getElementById('map-modal-body').innerHTML = `
    <h3 style="font-size:1.4rem;">${p.label}</h3>
    <p style="margin-top:10px; color:var(--cream-dim);">${p.note}</p>
    <div class="modal-section">
      <h4>Scientists</h4>
      <ul>${p.scientists.map(s => `<li>${s}</li>`).join('')}</ul>
    </div>
  `;
  document.getElementById('map-modal').classList.add('open');
}

document.addEventListener('DOMContentLoaded', () => {
  renderMapPins();
  document.getElementById('map-modal-close')?.addEventListener('click', () => {
    document.getElementById('map-modal').classList.remove('open');
  });
  document.getElementById('map-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'map-modal') document.getElementById('map-modal').classList.remove('open');
  });
});
