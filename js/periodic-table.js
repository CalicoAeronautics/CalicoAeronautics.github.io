/* ==========================================================================
   Interactive Periodic Table. Standard reference data (atomic number,
   symbol, name, category, standard atomic weight). Elements 95+ use the
   mass number of their most stable known isotope, shown in brackets, per
   standard convention for elements without a stable isotope.
   ========================================================================== */

const ELEMENTS = [
 [1,'H','Hydrogen','nonmetal',1,1.008],[2,'He','Helium','noble',18,4.003],
 [3,'Li','Lithium','alkali',1,6.94],
 [4,'Be','Beryllium','alkaline',2,9.012],[5,'B','Boron','metalloid',13,10.81],
 [6,'C','Carbon','nonmetal',14,12.011],[7,'N','Nitrogen','nonmetal',15,14.007],
 [8,'O','Oxygen','nonmetal',16,15.999],[9,'F','Fluorine','halogen',17,18.998],
 [10,'Ne','Neon','noble',18,20.180],[11,'Na','Sodium','alkali',1,22.990],
 [12,'Mg','Magnesium','alkaline',2,24.305],[13,'Al','Aluminium','posttransition',13,26.982],
 [14,'Si','Silicon','metalloid',14,28.085],[15,'P','Phosphorus','nonmetal',15,30.974],
 [16,'S','Sulfur','nonmetal',16,32.06],[17,'Cl','Chlorine','halogen',17,35.45],
 [18,'Ar','Argon','noble',18,39.948],[19,'K','Potassium','alkali',1,39.098],
 [20,'Ca','Calcium','alkaline',2,40.078],[21,'Sc','Scandium','transition',3,44.956],
 [22,'Ti','Titanium','transition',4,47.867],[23,'V','Vanadium','transition',5,50.942],
 [24,'Cr','Chromium','transition',6,51.996],[25,'Mn','Manganese','transition',7,54.938],
 [26,'Fe','Iron','transition',8,55.845],[27,'Co','Cobalt','transition',9,58.933],
 [28,'Ni','Nickel','transition',10,58.693],[29,'Cu','Copper','transition',11,63.546],
 [30,'Zn','Zinc','transition',12,65.38],[31,'Ga','Gallium','posttransition',13,69.723],
 [32,'Ge','Germanium','metalloid',14,72.630],[33,'As','Arsenic','metalloid',15,74.922],
 [34,'Se','Selenium','nonmetal',16,78.971],[35,'Br','Bromine','halogen',17,79.904],
 [36,'Kr','Krypton','noble',18,83.798],[37,'Rb','Rubidium','alkali',1,85.468],
 [38,'Sr','Strontium','alkaline',2,87.62],[39,'Y','Yttrium','transition',3,88.906],
 [40,'Zr','Zirconium','transition',4,91.224],[41,'Nb','Niobium','transition',5,92.906],
 [42,'Mo','Molybdenum','transition',6,95.95],[43,'Tc','Technetium','transition',7,98],
 [44,'Ru','Ruthenium','transition',8,101.07],[45,'Rh','Rhodium','transition',9,102.906],
 [46,'Pd','Palladium','transition',10,106.42],[47,'Ag','Silver','transition',11,107.868],
 [48,'Cd','Cadmium','transition',12,112.414],[49,'In','Indium','posttransition',13,114.818],
 [50,'Sn','Tin','posttransition',14,118.710],[51,'Sb','Antimony','metalloid',15,121.760],
 [52,'Te','Tellurium','metalloid',16,127.60],[53,'I','Iodine','halogen',17,126.904],
 [54,'Xe','Xenon','noble',18,131.293],[55,'Cs','Caesium','alkali',1,132.905],
 [56,'Ba','Barium','alkaline',2,137.327],
 [57,'La','Lanthanum','lanthanide',0,138.905],[58,'Ce','Cerium','lanthanide',0,140.116],
 [59,'Pr','Praseodymium','lanthanide',0,140.908],[60,'Nd','Neodymium','lanthanide',0,144.242],
 [61,'Pm','Promethium','lanthanide',0,145],[62,'Sm','Samarium','lanthanide',0,150.36],
 [63,'Eu','Europium','lanthanide',0,151.964],[64,'Gd','Gadolinium','lanthanide',0,157.25],
 [65,'Tb','Terbium','lanthanide',0,158.925],[66,'Dy','Dysprosium','lanthanide',0,162.500],
 [67,'Ho','Holmium','lanthanide',0,164.930],[68,'Er','Erbium','lanthanide',0,167.259],
 [69,'Tm','Thulium','lanthanide',0,168.934],[70,'Yb','Ytterbium','lanthanide',0,173.045],
 [71,'Lu','Lutetium','lanthanide',0,174.967],
 [72,'Hf','Hafnium','transition',4,178.49],[73,'Ta','Tantalum','transition',5,180.948],
 [74,'W','Tungsten','transition',6,183.84],[75,'Re','Rhenium','transition',7,186.207],
 [76,'Os','Osmium','transition',8,190.23],[77,'Ir','Iridium','transition',9,192.217],
 [78,'Pt','Platinum','transition',10,195.085],[79,'Au','Gold','transition',11,196.967],
 [80,'Hg','Mercury','transition',12,200.592],[81,'Tl','Thallium','posttransition',13,204.38],
 [82,'Pb','Lead','posttransition',14,207.2],[83,'Bi','Bismuth','posttransition',15,208.980],
 [84,'Po','Polonium','posttransition',16,209],[85,'At','Astatine','halogen',17,210],
 [86,'Rn','Radon','noble',18,222],[87,'Fr','Francium','alkali',1,223],
 [88,'Ra','Radium','alkaline',2,226],
 [89,'Ac','Actinium','actinide',0,227],[90,'Th','Thorium','actinide',0,232.038],
 [91,'Pa','Protactinium','actinide',0,231.036],[92,'U','Uranium','actinide',0,238.029],
 [93,'Np','Neptunium','actinide',0,237],[94,'Pu','Plutonium','actinide',0,244],
 [95,'Am','Americium','actinide',0,243],[96,'Cm','Curium','actinide',0,247],
 [97,'Bk','Berkelium','actinide',0,247],[98,'Cf','Californium','actinide',0,251],
 [99,'Es','Einsteinium','actinide',0,252],[100,'Fm','Fermium','actinide',0,257],
 [101,'Md','Mendelevium','actinide',0,258],[102,'No','Nobelium','actinide',0,259],
 [103,'Lr','Lawrencium','actinide',0,266],
 [104,'Rf','Rutherfordium','transition',4,267],[105,'Db','Dubnium','transition',5,268],
 [106,'Sg','Seaborgium','transition',6,269],[107,'Bh','Bohrium','transition',7,270],
 [108,'Hs','Hassium','transition',8,269],[109,'Mt','Meitnerium','transition',9,278],
 [110,'Ds','Darmstadtium','transition',10,281],[111,'Rg','Roentgenium','transition',11,282],
 [112,'Cn','Copernicium','transition',12,285],[113,'Nh','Nihonium','posttransition',13,286],
 [114,'Fl','Flerovium','posttransition',14,289],[115,'Mc','Moscovium','posttransition',15,290],
 [116,'Lv','Livermorium','posttransition',16,293],[117,'Ts','Tennessine','halogen',17,294],
 [118,'Og','Oganesson','noble',18,294],
].filter((e, i, arr) => arr.findIndex(x => x[0] === e[0] && x[1] === e[1]) === i); // de-dupe safety

function categoryClass(cat) {
  const map = {
    alkali: 'cat-alkali', alkaline: 'cat-alkaline', transition: 'cat-transition',
    posttransition: 'cat-posttransition', metalloid: 'cat-metalloid', nonmetal: 'cat-nonmetal',
    halogen: 'cat-halogen', noble: 'cat-noble', lanthanide: 'cat-lanthanide', actinide: 'cat-actinide',
  };
  return map[cat] || '';
}

function renderPeriodicTable() {
  const grid = document.getElementById('periodic-grid');
  if (!grid) return;

  // Manually map atomic numbers to (row, col) using standard periodic table geometry.
  const grid_pos = {
    1:[1,1],2:[1,18],
    3:[2,1],4:[2,2],5:[2,13],6:[2,14],7:[2,15],8:[2,16],9:[2,17],10:[2,18],
    11:[3,1],12:[3,2],13:[3,13],14:[3,14],15:[3,15],16:[3,16],17:[3,17],18:[3,18],
  };
  for (let n = 19; n <= 36; n++) grid_pos[n] = [4, n - 18];
  for (let n = 37; n <= 54; n++) grid_pos[n] = [5, n - 36];
  // period 6: Cs(55)-Ba(56) cols 1-2, La(57) placeholder col3 marked separately, Hf(72)-Rn(86) cols 4-18
  grid_pos[55] = [6,1]; grid_pos[56] = [6,2];
  for (let n = 72; n <= 86; n++) grid_pos[n] = [6, n - 68];
  grid_pos[57] = [9, 4]; // La starts lanthanide row (offset row 9, col 4 to align under group 3)
  for (let n = 58; n <= 71; n++) grid_pos[n] = [9, n - 54];
  grid_pos[87] = [7,1]; grid_pos[88] = [7,2];
  for (let n = 104; n <= 118; n++) grid_pos[n] = [7, n - 100];
  grid_pos[89] = [10, 4];
  for (let n = 90; n <= 103; n++) grid_pos[n] = [10, n - 86];

  const maxRow = 10;
  grid.style.gridTemplateRows = `repeat(${maxRow}, minmax(0,1fr))`;

  const cells = ELEMENTS.map(([num, sym, name, cat]) => {
    const pos = grid_pos[num];
    if (!pos) return '';
    return `<div class="pt-cell ${categoryClass(cat)}" style="grid-row:${pos[0]}; grid-column:${pos[1]};" data-num="${num}">
      <span class="num">${num}</span><span class="sym">${sym}</span>
    </div>`;
  }).join('');

  grid.innerHTML = cells;

  grid.querySelectorAll('.pt-cell').forEach(cell => {
    cell.addEventListener('click', () => openElementModal(parseInt(cell.dataset.num)));
  });
}

function openElementModal(num) {
  const el = ELEMENTS.find(e => e[0] === num);
  if (!el) return;
  const [n, sym, name, cat, group, weight] = el;
  document.getElementById('pt-modal-body').innerHTML = `
    <h3 style="font-size:1.6rem;">${name} (${sym})</h3>
    <div class="planet-facts">
      <div class="fact"><div class="k">Atomic Number</div><div class="v">${n}</div></div>
      <div class="fact"><div class="k">Category</div><div class="v">${cat.replace(/([A-Z])/g,' $1')}</div></div>
      <div class="fact"><div class="k">Standard Atomic Weight</div><div class="v">${weight}${n >= 95 ? ' (mass no. of most stable isotope)' : ''}</div></div>
    </div>
  `;
  document.getElementById('pt-modal').classList.add('open');
}

document.addEventListener('DOMContentLoaded', () => {
  renderPeriodicTable();
  document.getElementById('pt-modal-close')?.addEventListener('click', () => {
    document.getElementById('pt-modal').classList.remove('open');
  });
  document.getElementById('pt-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'pt-modal') document.getElementById('pt-modal').classList.remove('open');
  });
});
