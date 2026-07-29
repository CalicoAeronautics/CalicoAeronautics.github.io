/* ==========================================================================
   Great Scientists: card grid -> click a card -> modal with bio, discoveries,
   a quote, and recommended books. Data lives in this one array.
   ========================================================================== */

const SCIENTISTS = [
  {
    id: 'einstein',
    name: 'Albert Einstein',
    years: '1879\u20131955',
    initials: 'AE',
    bio: 'A German-born theoretical physicist who reshaped our understanding of space, time, and gravity. Working largely outside the academic mainstream in his early career, he produced four groundbreaking papers in 1905 alone before going on to develop General Relativity a decade later.',
    discoveries: [
      'Special and General Relativity',
      'Mass\u2013energy equivalence, E = mc\u00b2',
      'Explanation of the photoelectric effect (Nobel Prize, 1921)',
    ],
    quote: 'If you can\u2019t explain it simply, you don\u2019t understand it well enough.',
    books: ['Relativity: The Special and the General Theory', 'The Evolution of Physics'],
  },
  {
    id: 'feynman',
    name: 'Richard Feynman',
    years: '1918\u20131988',
    initials: 'RF',
    bio: 'An American theoretical physicist known equally for his contributions to quantum electrodynamics and for his gift of explaining physics with unusual clarity and humor.',
    discoveries: [
      'Quantum electrodynamics (QED) and Feynman diagrams',
      'The path integral formulation of quantum mechanics',
      'Nobel Prize in Physics, 1965',
    ],
    quote: 'I would rather have questions that can\u2019t be answered than answers that can\u2019t be questioned.',
    books: ['Surely You\u2019re Joking, Mr. Feynman!', 'The Feynman Lectures on Physics'],
  },
  {
    id: 'dirac',
    name: 'Paul Dirac',
    years: '1902\u20131984',
    initials: 'PD',
    bio: 'An English theoretical physicist whose equation merging quantum mechanics with special relativity predicted the existence of antimatter years before it was observed.',
    discoveries: [
      'The Dirac equation, predicting antimatter',
      'Foundational work in quantum field theory',
      'Nobel Prize in Physics, 1933',
    ],
    quote: 'In science one tries to tell people, in such a way as to be understood by everyone, something that no one ever knew before.',
    books: ['The Principles of Quantum Mechanics'],
  },
  {
    id: 'curie',
    name: 'Marie Curie',
    years: '1867\u20131934',
    initials: 'MC',
    bio: 'A Polish-French physicist and chemist who pioneered research into radioactivity, discovering two new elements and remaining the only person to win Nobel Prizes in two different sciences.',
    discoveries: [
      'Discovery of the elements polonium and radium',
      'Pioneering research establishing the theory of radioactivity',
      'Nobel Prizes in both Physics (1903) and Chemistry (1911)',
    ],
    quote: 'Nothing in life is to be feared, it is only to be understood.',
    books: ['Radioactive Substances (doctoral thesis)'],
  },
  {
    id: 'newton',
    name: 'Isaac Newton',
    years: '1643\u20131727',
    initials: 'IN',
    bio: 'An English physicist and mathematician whose laws of motion and universal gravitation defined classical mechanics for over two centuries, alongside his independent development of calculus.',
    discoveries: [
      'The three laws of motion',
      'The law of universal gravitation',
      'Calculus (developed independently of Leibniz) and foundational work in optics',
    ],
    quote: 'If I have seen further it is by standing on the shoulders of giants.',
    books: ['Philosophi\u00e6 Naturalis Principia Mathematica', 'Opticks'],
  },
  {
    id: 'maxwell',
    name: 'James Clerk Maxwell',
    years: '1831\u20131879',
    initials: 'JM',
    bio: 'A Scottish physicist who unified electricity, magnetism, and light into a single theory of the electromagnetic field, and separately advanced the kinetic theory of gases.',
    discoveries: [
      'Maxwell\u2019s equations, unifying electromagnetism',
      'Prediction that light itself is an electromagnetic wave',
      'Contributions to the kinetic theory of gases and statistical mechanics',
    ],
    quote: 'The true logic of this world is in the calculus of probabilities.',
    books: ['A Treatise on Electricity and Magnetism'],
  },
  {
    id: 'hawking',
    name: 'Stephen Hawking',
    years: '1942\u20132018',
    initials: 'SH',
    bio: 'An English theoretical physicist and cosmologist who worked on black holes and the origin of the universe, continuing groundbreaking research for decades after being diagnosed with a motor neuron disease.',
    discoveries: [
      'Hawking radiation, showing black holes can emit particles',
      'Singularity theorems developed with Roger Penrose',
      'Contributions to black hole thermodynamics',
    ],
    quote: 'Intelligence is the ability to adapt to change.',
    books: ['A Brief History of Time', 'The Universe in a Nutshell'],
  },
];

function renderScientistCards() {
  const grid = document.getElementById('scientists-grid');
  if (!grid) return;
  grid.innerHTML = SCIENTISTS.map(s => `
    <div class="card scientist-card" data-id="${s.id}">
      <div class="scientist-avatar">${s.initials}</div>
      <h3>${s.name}</h3>
      <div class="years">${s.years}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.scientist-card').forEach(card => {
    card.addEventListener('click', () => openScientistModal(card.dataset.id));
  });
}

function openScientistModal(id) {
  const s = SCIENTISTS.find(sc => sc.id === id);
  if (!s) return;
  const overlay = document.getElementById('scientist-modal');
  document.getElementById('modal-body').innerHTML = `
    <div class="scientist-avatar" style="margin:0 0 14px;">${s.initials}</div>
    <h3 style="font-size:1.5rem;">${s.name}</h3>
    <div class="years">${s.years}</div>
    <p style="margin-top:16px;">${s.bio}</p>
    <div class="modal-section">
      <h4>Major Discoveries</h4>
      <ul>${s.discoveries.map(d => `<li>${d}</li>`).join('')}</ul>
    </div>
    <blockquote>&ldquo;${s.quote}&rdquo;</blockquote>
    <div class="modal-section">
      <h4>Books</h4>
      <ul>${s.books.map(b => `<li>${b}</li>`).join('')}</ul>
    </div>
  `;
  overlay.classList.add('open');
}

function closeScientistModal() {
  document.getElementById('scientist-modal').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  renderScientistCards();
  document.getElementById('modal-close')?.addEventListener('click', closeScientistModal);
  document.getElementById('scientist-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'scientist-modal') closeScientistModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeScientistModal();
  });
});
