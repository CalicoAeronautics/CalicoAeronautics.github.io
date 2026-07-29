/* ==========================================================================
   Great Scientists: 50 entries. Photos are fetched live from Wikipedia's
   public REST API (no API key needed) using each person's wikiTitle -
   this avoids hardcoding image URLs that could break or be wrong. If a
   fetch fails or has no thumbnail, the card falls back to initials.
   ========================================================================== */

const SCIENTISTS = [
  { id:'newton', name:'Isaac Newton', years:'1643\u20131727', initials:'IN', wikiTitle:'Isaac Newton',
    fields:['Physics','Mathematics','Astronomy'],
    bio:'An English physicist and mathematician whose laws of motion and universal gravitation defined classical mechanics for over two centuries, alongside his independent development of calculus.',
    discoveries:['The three laws of motion','The law of universal gravitation','Calculus (developed independently of Leibniz) and foundational work in optics'],
    quote:'If I have seen further it is by standing on the shoulders of giants.',
    books:['Philosophi\u00e6 Naturalis Principia Mathematica','Opticks'] },

  { id:'einstein', name:'Albert Einstein', years:'1879\u20131955', initials:'AE', wikiTitle:'Albert Einstein',
    fields:['Physics'],
    bio:'A German-born theoretical physicist who reshaped our understanding of space, time, and gravity, producing four groundbreaking papers in 1905 alone before developing General Relativity a decade later.',
    discoveries:['Special and General Relativity','Mass\u2013energy equivalence, E = mc\u00b2','Explanation of the photoelectric effect (Nobel Prize, 1921)'],
    quote:'If you can\u2019t explain it simply, you don\u2019t understand it well enough.',
    books:['Relativity: The Special and the General Theory','The Evolution of Physics'] },

  { id:'galileo', name:'Galileo Galilei', years:'1564\u20131642', initials:'GG', wikiTitle:'Galileo Galilei',
    fields:['Physics','Astronomy'],
    bio:'An Italian astronomer and physicist who championed heliocentrism and pioneered the use of the telescope for astronomical observation, laying groundwork for modern mechanics.',
    discoveries:['Discovery of Jupiter\u2019s four largest moons','Observations of lunar craters and the phases of Venus','Early groundwork for the law of inertia'],
    books:['Dialogue Concerning the Two Chief World Systems','Sidereus Nuncius'] },

  { id:'darwin', name:'Charles Darwin', years:'1809\u20131882', initials:'CD', wikiTitle:'Charles Darwin',
    fields:['Biology'],
    bio:'An English naturalist who proposed the theory of evolution by natural selection, providing a unifying framework for the whole of biology.',
    discoveries:['Theory of evolution by natural selection','Extensive documentation of species variation from the HMS Beagle voyage','The concept of common descent'],
    quote:'There is grandeur in this view of life.',
    books:['On the Origin of Species','The Descent of Man'] },

  { id:'curie', name:'Marie Curie', years:'1867\u20131934', initials:'MC', wikiTitle:'Marie Curie',
    fields:['Chemistry','Physics'],
    bio:'A Polish-French physicist and chemist who pioneered research into radioactivity, discovering two new elements and remaining the only person to win Nobel Prizes in two different sciences.',
    discoveries:['Discovery of the elements polonium and radium','Pioneering research establishing the theory of radioactivity','Nobel Prizes in both Physics (1903) and Chemistry (1911)'],
    quote:'Nothing in life is to be feared, it is only to be understood.',
    books:['Radioactive Substances (doctoral thesis)'] },

  { id:'aristotle', name:'Aristotle', years:'384\u2013322 BCE', initials:'AR', wikiTitle:'Aristotle',
    fields:['Natural Philosophy'],
    bio:'An ancient Greek philosopher whose systematic approach to natural science shaped Western thought for nearly two millennia, though many of his physical theories were later overturned.',
    discoveries:['Foundational work in formal logic','Systematic classification of living things','A geocentric physical cosmology, later disproven'],
    books:['Physics','On the Heavens'] },

  { id:'maxwell', name:'James Clerk Maxwell', years:'1831\u20131879', initials:'JM', wikiTitle:'James Clerk Maxwell',
    fields:['Physics'],
    bio:'A Scottish physicist who unified electricity, magnetism, and light into a single theory of the electromagnetic field, and separately advanced the kinetic theory of gases.',
    discoveries:['Maxwell\u2019s equations, unifying electromagnetism','Prediction that light itself is an electromagnetic wave','Contributions to the kinetic theory of gases and statistical mechanics'],
    quote:'The true logic of this world is in the calculus of probabilities.',
    books:['A Treatise on Electricity and Magnetism'] },

  { id:'faraday', name:'Michael Faraday', years:'1791\u20131867', initials:'MF', wikiTitle:'Michael Faraday',
    fields:['Physics','Chemistry'],
    bio:'An English scientist who discovered electromagnetic induction and laid the experimental groundwork that Maxwell later formalized mathematically, despite having little formal mathematical training.',
    discoveries:['Electromagnetic induction','Laws of electrolysis','Discovery of benzene'],
    quote:'Nothing is too wonderful to be true, if it be consistent with the laws of nature.',
    books:['Experimental Researches in Electricity'] },

  { id:'kepler', name:'Johannes Kepler', years:'1571\u20131630', initials:'JK', wikiTitle:'Johannes Kepler',
    fields:['Astronomy','Mathematics'],
    bio:'A German astronomer who derived three laws of planetary motion from Tycho Brahe\u2019s observational data, replacing circular orbits with ellipses and paving the way for Newtonian gravity.',
    discoveries:['The three laws of planetary motion','Elliptical (rather than circular) planetary orbits'],
    books:['Astronomia Nova','Harmonices Mundi'] },

  { id:'bohr', name:'Niels Bohr', years:'1885\u20131962', initials:'NB', wikiTitle:'Niels Bohr',
    fields:['Physics'],
    bio:'A Danish physicist who proposed a quantum model of the atom and became a central figure in the development of quantum mechanics, including the Copenhagen interpretation.',
    discoveries:['The Bohr model of the atom','The principle of complementarity','Nobel Prize in Physics, 1922'] },

  { id:'pasteur', name:'Louis Pasteur', years:'1822\u20131895', initials:'LP', wikiTitle:'Louis Pasteur',
    fields:['Microbiology','Chemistry'],
    bio:'A French chemist and microbiologist whose experiments disproved spontaneous generation and established germ theory, leading directly to pasteurization and early vaccines.',
    discoveries:['Germ theory of disease','Pasteurization','The first vaccine for rabies'],
    quote:'Chance favors only the prepared mind.' },

  { id:'mendeleev', name:'Dmitri Mendeleev', years:'1834\u20131907', initials:'DM', wikiTitle:'Dmitri Mendeleev',
    fields:['Chemistry'],
    bio:'A Russian chemist who formulated the periodic law and created the periodic table of elements, correctly predicting the properties of several elements before they were discovered.',
    discoveries:['The periodic table of elements','Successful prediction of gallium, germanium, and scandium before their discovery'] },

  { id:'mendel', name:'Gregor Mendel', years:'1822\u20131884', initials:'GM', wikiTitle:'Gregor Mendel',
    fields:['Genetics'],
    bio:'An Augustinian friar and scientist whose experiments with pea plants established the fundamental laws of inheritance, founding the science of genetics decades before chromosomes were understood.',
    discoveries:['The law of segregation','The law of independent assortment'] },

  { id:'archimedes', name:'Archimedes', years:'c. 287\u2013212 BCE', initials:'AC', wikiTitle:'Archimedes',
    fields:['Mathematics','Physics'],
    bio:'An ancient Greek mathematician and engineer whose work on levers, buoyancy, and geometric methods anticipated integral calculus by nearly two thousand years.',
    discoveries:['The principle of buoyancy (Archimedes\u2019 principle)','The law of the lever','Geometric methods anticipating integral calculus'] },

  { id:'copernicus', name:'Nicolaus Copernicus', years:'1473\u20131543', initials:'NC', wikiTitle:'Nicolaus Copernicus',
    fields:['Astronomy'],
    bio:'A Polish astronomer who proposed a heliocentric model of the solar system, challenging centuries of geocentric cosmology and sparking the Scientific Revolution.',
    discoveries:['The heliocentric model of the solar system'],
    books:['De revolutionibus orbium coelestium'] },

  { id:'feynman', name:'Richard Feynman', years:'1918\u20131988', initials:'RF', wikiTitle:'Richard Feynman',
    fields:['Physics'],
    bio:'An American theoretical physicist known equally for his contributions to quantum electrodynamics and for his gift of explaining physics with unusual clarity and humor.',
    discoveries:['Quantum electrodynamics (QED) and Feynman diagrams','The path integral formulation of quantum mechanics','Nobel Prize in Physics, 1965'],
    quote:'I would rather have questions that can\u2019t be answered than answers that can\u2019t be questioned.',
    books:['Surely You\u2019re Joking, Mr. Feynman!','The Feynman Lectures on Physics'] },

  { id:'rutherford', name:'Ernest Rutherford', years:'1871\u20131937', initials:'ER', wikiTitle:'Ernest Rutherford',
    fields:['Physics'],
    bio:'A New Zealand-born physicist known as the father of nuclear physics, who discovered the atomic nucleus and classified radioactive decay into alpha and beta types.',
    discoveries:['Discovery of the atomic nucleus','Classification of alpha and beta radiation','Nobel Prize in Chemistry, 1908'],
    quote:'All science is either physics or stamp collecting.' },

  { id:'planck', name:'Max Planck', years:'1858\u20131947', initials:'MP', wikiTitle:'Max Planck',
    fields:['Physics'],
    bio:'A German physicist whose introduction of quantized energy to explain blackbody radiation launched quantum theory, earning him the Nobel Prize in 1918.',
    discoveries:['Quantization of energy and Planck\u2019s constant','Founding contributions to quantum theory'] },

  { id:'hawking', name:'Stephen Hawking', years:'1942\u20132018', initials:'SH', wikiTitle:'Stephen Hawking',
    fields:['Cosmology','Physics'],
    bio:'An English theoretical physicist and cosmologist who worked on black holes and the origin of the universe, continuing groundbreaking research for decades after being diagnosed with a motor neuron disease.',
    discoveries:['Hawking radiation, showing black holes can emit particles','Singularity theorems developed with Roger Penrose','Contributions to black hole thermodynamics'],
    quote:'Intelligence is the ability to adapt to change.',
    books:['A Brief History of Time','The Universe in a Nutshell'] },

  { id:'tesla', name:'Nikola Tesla', years:'1856\u20131943', initials:'NT', wikiTitle:'Nikola Tesla',
    fields:['Physics','Engineering'],
    bio:'A Serbian-American inventor and electrical engineer whose work on alternating current systems shaped the modern electrical grid.',
    discoveries:['The AC induction motor and polyphase power systems','The Tesla coil'],
    quote:'The present is theirs; the future, for which I really worked, is mine.' },

  { id:'turing', name:'Alan Turing', years:'1912\u20131954', initials:'AT', wikiTitle:'Alan Turing',
    fields:['Mathematics','Computer Science'],
    bio:'A British mathematician and logician who formalized the concept of computation with the Turing machine and led codebreaking efforts at Bletchley Park during World War II.',
    discoveries:['The concept of the Turing machine','Foundational work in theoretical computer science','Codebreaking work on the Enigma cipher'],
    quote:'We can only see a short distance ahead, but we can see plenty there that needs to be done.' },

  { id:'davinci', name:'Leonardo da Vinci', years:'1452\u20131519', initials:'LD', wikiTitle:'Leonardo da Vinci',
    fields:['Engineering','Anatomy'],
    bio:'An Italian Renaissance polymath whose notebooks contain detailed anatomical studies and mechanical designs centuries ahead of their time, though most were never built or published in his lifetime.',
    discoveries:['Detailed anatomical drawings from direct dissection','Conceptual designs for flying machines and hydraulic systems'] },

  { id:'heisenberg', name:'Werner Heisenberg', years:'1901\u20131976', initials:'WH', wikiTitle:'Werner Heisenberg',
    fields:['Physics'],
    bio:'A German physicist who formulated matrix mechanics and the uncertainty principle, fundamentally reshaping how physicists understand measurement at the quantum scale.',
    discoveries:['The uncertainty principle','The matrix formulation of quantum mechanics','Nobel Prize in Physics, 1932'] },

  { id:'fermi', name:'Enrico Fermi', years:'1901\u20131954', initials:'EF', wikiTitle:'Enrico Fermi',
    fields:['Physics'],
    bio:'An Italian-American physicist who built the first nuclear reactor and made major contributions to both theoretical and experimental physics.',
    discoveries:['The first controlled nuclear chain reaction (Chicago Pile-1)','Fermi-Dirac statistics','A theory of beta decay'] },

  { id:'dirac', name:'Paul Dirac', years:'1902\u20131984', initials:'PD', wikiTitle:'Paul Dirac',
    fields:['Physics'],
    bio:'An English theoretical physicist whose equation merging quantum mechanics with special relativity predicted the existence of antimatter years before it was observed.',
    discoveries:['The Dirac equation, predicting antimatter','Foundational work in quantum field theory','Nobel Prize in Physics, 1933'],
    quote:'In science one tries to tell people, in such a way as to be understood by everyone, something that no one ever knew before.',
    books:['The Principles of Quantum Mechanics'] },

  { id:'fleming', name:'Alexander Fleming', years:'1881\u20131955', initials:'AF', wikiTitle:'Alexander Fleming',
    fields:['Medicine'],
    bio:'A Scottish physician and microbiologist whose accidental discovery of penicillin launched the age of antibiotics and transformed modern medicine.',
    discoveries:['Discovery of penicillin (1928)','Discovery of the enzyme lysozyme'] },

  { id:'schrodinger', name:'Erwin Schr\u00f6dinger', years:'1887\u20131961', initials:'ES', wikiTitle:'Erwin Schr\u00f6dinger',
    fields:['Physics'],
    bio:'An Austrian physicist whose wave equation for quantum mechanics remains one of the central tools of the field, and whose thought experiments still shape debates about quantum measurement.',
    discoveries:['The Schr\u00f6dinger equation','The "Schr\u00f6dinger\u2019s cat" thought experiment on quantum superposition','Nobel Prize in Physics, 1933'] },

  { id:'linnaeus', name:'Carl Linnaeus', years:'1707\u20131778', initials:'CL', wikiTitle:'Carl Linnaeus',
    fields:['Taxonomy','Biology'],
    bio:'A Swedish botanist who established the modern system of binomial nomenclature for naming and classifying organisms, still used across biology today.',
    discoveries:['Binomial nomenclature','A hierarchical taxonomic classification system'],
    books:['Systema Naturae'] },

  { id:'hubble', name:'Edwin Hubble', years:'1889\u20131953', initials:'EH', wikiTitle:'Edwin Hubble',
    fields:['Astronomy'],
    bio:'An American astronomer who discovered that the universe extends far beyond the Milky Way and is expanding, fundamentally reshaping cosmology.',
    discoveries:['Discovery that many "nebulae" are separate galaxies','Hubble\u2019s Law describing the expanding universe'] },

  { id:'lavoisier', name:'Antoine Lavoisier', years:'1743\u20131794', initials:'AL', wikiTitle:'Antoine Lavoisier',
    fields:['Chemistry'],
    bio:'A French chemist considered the father of modern chemistry, who established the law of conservation of mass and clarified oxygen\u2019s role in combustion.',
    discoveries:['The law of conservation of mass','Naming and characterizing oxygen and hydrogen','Overturning phlogiston theory'],
    books:['Trait\u00e9 \u00e9l\u00e9mentaire de chimie'] },

  { id:'harvey', name:'William Harvey', years:'1578\u20131657', initials:'WH2', wikiTitle:'William Harvey',
    fields:['Medicine'],
    bio:'An English physician who correctly described blood circulation driven by the heart, overturning centuries of Galenic medical theory.',
    discoveries:['Systemic circulation of blood pumped by the heart'],
    books:['De Motu Cordis'] },

  { id:'boyle', name:'Robert Boyle', years:'1627\u20131691', initials:'RB', wikiTitle:'Robert Boyle',
    fields:['Chemistry','Physics'],
    bio:'An Anglo-Irish natural philosopher often called the father of modern chemistry, best known for the gas law relating pressure and volume.',
    discoveries:['Boyle\u2019s Law (pressure-volume relationship in gases)','Early advocacy for the experimental scientific method in chemistry'],
    books:['The Sceptical Chymist'] },

  { id:'franklin-r', name:'Rosalind Franklin', years:'1920\u20131958', initials:'RF2', wikiTitle:'Rosalind Franklin',
    fields:['Molecular Biology'],
    bio:'A British chemist and X-ray crystallographer whose diffraction images provided crucial evidence for the double-helix structure of DNA.',
    discoveries:['X-ray diffraction images of DNA revealing its helical structure ("Photo 51")','Structural studies of RNA viruses and carbon'] },

  { id:'watson', name:'James Watson', years:'b. 1928', initials:'JW', wikiTitle:'James Watson',
    fields:['Molecular Biology'],
    bio:'An American molecular biologist who, with Francis Crick, proposed the double-helix structure of DNA in 1953, drawing on X-ray data from Rosalind Franklin and Maurice Wilkins.',
    discoveries:['The double-helix model of DNA structure'],
    books:['The Double Helix'] },

  { id:'crick', name:'Francis Crick', years:'1916\u20132004', initials:'FC', wikiTitle:'Francis Crick',
    fields:['Molecular Biology'],
    bio:'A British molecular biologist who co-discovered the double-helix structure of DNA and later proposed the central dogma of molecular biology.',
    discoveries:['The double-helix DNA model','The central dogma of molecular biology'] },

  { id:'vesalius', name:'Andreas Vesalius', years:'1514\u20131564', initials:'AV', wikiTitle:'Andreas Vesalius',
    fields:['Anatomy'],
    bio:'A Flemish anatomist whose detailed human dissections corrected centuries of errors inherited from Galen, founding modern human anatomy.',
    discoveries:['Correction of numerous anatomical errors from Galen through direct human dissection'],
    books:['De humani corporis fabrica'] },

  { id:'galen', name:'Galen of Pergamum', years:'c. 129\u2013216 CE', initials:'GP', wikiTitle:'Galen',
    fields:['Medicine'],
    bio:'A Greek physician whose anatomical and physiological writings dominated Western and Islamic medicine for over a thousand years, despite being based largely on animal dissection.',
    discoveries:['Extensive anatomical and physiological writings','The theory of the four humors, later overturned'] },

  { id:'avicenna', name:'Avicenna', years:'980\u20131037', initials:'AV2', wikiTitle:'Avicenna',
    fields:['Medicine','Natural Philosophy'],
    bio:'A Persian polymath whose medical encyclopedia became a standard reference in both the Islamic world and medieval Europe for centuries.',
    discoveries:['Systematization of medical knowledge','Contributions to logic and natural philosophy'],
    books:['The Canon of Medicine'] },

  { id:'euclid', name:'Euclid', years:'c. 300 BCE', initials:'EU', wikiTitle:'Euclid',
    fields:['Mathematics'],
    bio:'An ancient Greek mathematician whose systematic axiomatic treatment of geometry became the standard mathematics textbook for over two thousand years.',
    discoveries:['The axiomatic foundation of geometry (Euclidean geometry)'],
    books:['Elements'] },

  { id:'pythagoras', name:'Pythagoras', years:'c. 570\u2013495 BCE', initials:'PY', wikiTitle:'Pythagoras',
    fields:['Mathematics','Natural Philosophy'],
    bio:'An ancient Greek philosopher and mathematician traditionally credited with the Pythagorean theorem, though much of his life is known only through later, sometimes unreliable accounts.',
    discoveries:['The Pythagorean theorem, as traditionally attributed to his school'] },

  { id:'zhangheng', name:'Zhang Heng', years:'78\u2013139 CE', initials:'ZH', wikiTitle:'Zhang Heng',
    fields:['Astronomy','Engineering'],
    bio:'A Han dynasty Chinese polymath who invented the first seismoscope for detecting earthquakes and advanced astronomical instrumentation.',
    discoveries:['The first seismoscope for detecting earthquakes','An improved water-powered armillary sphere for astronomy'] },

  { id:'leeuwenhoek', name:'Antonie van Leeuwenhoek', years:'1632\u20131723', initials:'AVL', wikiTitle:'Antonie van Leeuwenhoek',
    fields:['Microbiology'],
    bio:'A Dutch tradesman and scientist who built his own microscopes and was the first to observe single-celled organisms, earning him the title "father of microbiology."',
    discoveries:['First observations of bacteria and protozoa ("animalcules")'] },

  { id:'huygens', name:'Christiaan Huygens', years:'1629\u20131695', initials:'CH', wikiTitle:'Christiaan Huygens',
    fields:['Physics','Astronomy'],
    bio:'A Dutch physicist and astronomer who proposed the wave theory of light and discovered Saturn\u2019s largest moon, Titan.',
    discoveries:['The wave theory of light (Huygens\u2019 principle)','Discovery of Titan, Saturn\u2019s largest moon','Invention of the pendulum clock'] },

  { id:'pascal', name:'Blaise Pascal', years:'1623\u20131662', initials:'BP', wikiTitle:'Blaise Pascal',
    fields:['Mathematics','Physics'],
    bio:'A French mathematician and physicist who helped found probability theory and demonstrated that atmospheric pressure decreases with altitude.',
    discoveries:['Foundational work in probability theory','Pascal\u2019s law of fluid pressure','An early mechanical calculator'],
    books:['Pens\u00e9es'] },

  { id:'volta', name:'Alessandro Volta', years:'1745\u20131827', initials:'AVO', wikiTitle:'Alessandro Volta',
    fields:['Physics','Chemistry'],
    bio:'An Italian physicist who invented the first true electrical battery, the voltaic pile, providing the first reliable source of continuous electric current.',
    discoveries:['Invention of the voltaic pile, the first electrical battery'] },

  { id:'rontgen', name:'Wilhelm R\u00f6ntgen', years:'1845\u20131923', initials:'WR', wikiTitle:'Wilhelm R\u00f6ntgen',
    fields:['Physics'],
    bio:'A German physicist who discovered X-rays in 1895, an achievement that earned him the first Nobel Prize in Physics in 1901.',
    discoveries:['Discovery of X-rays'] },

  { id:'pauling', name:'Linus Pauling', years:'1901\u20131994', initials:'LPA', wikiTitle:'Linus Pauling',
    fields:['Chemistry','Molecular Biology'],
    bio:'An American chemist who applied quantum mechanics to chemical bonding and remains the only person to win two unshared Nobel Prizes, in Chemistry and in Peace.',
    discoveries:['Foundational work on the nature of the chemical bond','Discovery of the protein alpha helix structure'],
    books:['The Nature of the Chemical Bond'] },

  { id:'born', name:'Max Born', years:'1882\u20131970', initials:'MB', wikiTitle:'Max Born',
    fields:['Physics'],
    bio:'A German physicist who provided the probabilistic interpretation of the quantum mechanical wavefunction, a cornerstone of modern quantum theory.',
    discoveries:['The statistical (probabilistic) interpretation of the wavefunction','Nobel Prize in Physics, 1954'] },

  { id:'noether', name:'Emmy Noether', years:'1882\u20131935', initials:'EN', wikiTitle:'Emmy Noether',
    fields:['Mathematics','Physics'],
    bio:'A German mathematician whose theorem linking symmetries to conservation laws became a foundational tool in theoretical physics, despite facing significant barriers to an academic career because she was a woman.',
    discoveries:['Noether\u2019s theorem, connecting symmetries to conservation laws','Major contributions to abstract algebra'] },

  { id:'berners-lee', name:'Tim Berners-Lee', years:'b. 1955', initials:'TBL', wikiTitle:'Tim Berners-Lee',
    fields:['Computer Science'],
    bio:'A British computer scientist who invented the World Wide Web in 1989 while working at CERN, fundamentally changing how information is shared globally.',
    discoveries:['Invention of the World Wide Web','Creation of HTTP, HTML, and URL as foundational web protocols'] },
];

function renderScientistCards() {
  const grid = document.getElementById('scientists-grid');
  if (!grid) return;
  grid.innerHTML = SCIENTISTS.map(s => `
    <div class="card scientist-card" data-id="${s.id}">
      <div class="scientist-avatar" id="avatar-${s.id}">${s.initials}</div>
      <h3>${s.name}</h3>
      <div class="years">${s.years}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.scientist-card').forEach(card => {
    card.addEventListener('click', () => openScientistModal(card.dataset.id));
  });

  loadScientistPhotos();
}

async function loadScientistPhotos() {
  SCIENTISTS.forEach(async (s) => {
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(s.wikiTitle)}`);
      if (!res.ok) return;
      const data = await res.json();
      const url = data.thumbnail && data.thumbnail.source;
      if (!url) return;
      const el = document.getElementById(`avatar-${s.id}`);
      if (el) {
        el.style.backgroundImage = `url('${url}')`;
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
        el.textContent = '';
      }
      const modalAvatar = document.getElementById(`modal-avatar-${s.id}`);
      if (modalAvatar) {
        modalAvatar.style.backgroundImage = `url('${url}')`;
        modalAvatar.style.backgroundSize = 'cover';
        modalAvatar.style.backgroundPosition = 'center';
        modalAvatar.textContent = '';
      }
    } catch (e) { /* fall back to initials silently */ }
  });
}

function openScientistModal(id) {
  const s = SCIENTISTS.find(sc => sc.id === id);
  if (!s) return;
  const overlay = document.getElementById('scientist-modal');
  document.getElementById('modal-body').innerHTML = `
    <div class="scientist-avatar" id="modal-avatar-${s.id}" style="margin:0 0 14px;">${s.initials}</div>
    <h3 style="font-size:1.5rem;">${s.name}</h3>
    <div class="years">${s.years}</div>
    <div style="margin-top:8px;">${s.fields.map(f => `<span class="tag-pill">${f}</span>`).join('')}</div>
    <p style="margin-top:16px;">${s.bio}</p>
    <div class="modal-section">
      <h4>Major Discoveries</h4>
      <ul>${s.discoveries.map(d => `<li>${d}</li>`).join('')}</ul>
    </div>
    ${s.quote ? `<blockquote>&ldquo;${s.quote}&rdquo;</blockquote>` : ''}
    ${s.books && s.books.length ? `
      <div class="modal-section">
        <h4>Books</h4>
        <ul>${s.books.map(b => `<li>${b}</li>`).join('')}</ul>
      </div>` : ''}
  `;
  overlay.classList.add('open');
  loadScientistPhotos();
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
