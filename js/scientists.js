/* ==========================================================================
   Aviation & Aerospace Pioneers. Newton and Bernoulli stay because their
   work (F=ma, Bernoulli's principle) is directly foundational to flight -
   everyone else here worked directly in aeronautics or aerospace. Photos
   fetched live from Wikipedia (no hardcoded image URLs).
   ========================================================================== */

const SCIENTISTS = [
  { id:'newton', name:'Isaac Newton', years:'1643\u20131727', initials:'IN', wikiTitle:'Isaac Newton',
    fields:['Foundational Physics'],
    bio:'His three laws of motion, F = ma above all, are the mathematical foundation every aircraft is designed against - thrust, drag, lift, and weight are all just forces obeying Newton\u2019s laws.',
    discoveries:['The three laws of motion','The law of universal gravitation','Calculus, the mathematical language aerodynamics is written in'],
    quote:'If I have seen further it is by standing on the shoulders of giants.' },

  { id:'bernoulli', name:'Daniel Bernoulli', years:'1700\u20131782', initials:'DB', wikiTitle:'Daniel Bernoulli',
    fields:['Foundational Physics'],
    bio:'A Swiss mathematician whose principle relating pressure and velocity in a fluid is one of the two classic explanations for how a wing generates lift.',
    discoveries:['Bernoulli\u2019s principle, relating fluid pressure and speed','Foundational work in fluid dynamics'] },

  { id:'cayley', name:'Sir George Cayley', years:'1773\u20131857', initials:'GC', wikiTitle:'George Cayley',
    fields:['Aeronautics'],
    bio:'An English engineer called the father of aerodynamics, who identified the four forces of flight decades before anyone built a powered aircraft.',
    discoveries:['Identification of lift, weight, thrust, and drag as the four forces of flight','The first glider to carry a human being aloft (1853)'] },

  { id:'lilienthal', name:'Otto Lilienthal', years:'1848\u20131896', initials:'OL', wikiTitle:'Otto Lilienthal',
    fields:['Aeronautics'],
    bio:'A German aviation pioneer whose more than 2,000 documented glider flights produced the aerodynamic data that directly informed the Wright Brothers.',
    discoveries:['Over 2,000 documented, controlled glider flights','Published aerodynamic data used by nearly every aviation pioneer that followed'] },

  { id:'wright-brothers', name:'The Wright Brothers', years:'1867\u20131948', initials:'WB', wikiTitle:'Wright brothers',
    fields:['Aeronautics'],
    bio:'Orville and Wilbur Wright achieved the first powered, controlled, sustained flight of a heavier-than-air aircraft in 1903, building on Lilienthal\u2019s glider data.',
    discoveries:['First powered, controlled, sustained flight (1903)','A workable three-axis control system for fixed-wing aircraft'] },

  { id:'santos-dumont', name:'Alberto Santos-Dumont', years:'1873\u20131932', initials:'ASD', wikiTitle:'Alberto Santos-Dumont',
    fields:['Aeronautics'],
    bio:'A Brazilian aviation pioneer based in France, widely credited in Europe with the first publicly witnessed powered flight of a heavier-than-air aircraft, the 14-bis, in 1906.',
    discoveries:['First publicly observed powered flight in Europe (1906)','Pioneering dirigible (airship) designs'] },

  { id:'curtiss', name:'Glenn Curtiss', years:'1878\u20131930', initials:'GLC', wikiTitle:'Glenn Curtiss',
    fields:['Aeronautics'],
    bio:'An American aviation pioneer and early rival of the Wright Brothers, whose company became one of the most important early American aircraft manufacturers.',
    discoveries:['Pioneering work on ailerons for roll control','Founded one of the first successful American aircraft manufacturing companies'] },

  { id:'prandtl', name:'Ludwig Prandtl', years:'1875\u20131953', initials:'LPR', wikiTitle:'Ludwig Prandtl',
    fields:['Aeronautics','Physics'],
    bio:'A German physicist and engineer whose boundary layer theory became foundational to modern aerodynamics and wing design.',
    discoveries:['Boundary layer theory','Foundational contributions to modern wing theory and aerodynamics'] },

  { id:'von-karman', name:'Theodore von K\u00e1rm\u00e1n', years:'1881\u20131963', initials:'TVK', wikiTitle:'Theodore von K\u00e1rm\u00e1n',
    fields:['Aeronautics'],
    bio:'A Hungarian-American engineer whose work on supersonic aerodynamics helped found modern aeronautics and astronautics; co-founded what became NASA\u2019s Jet Propulsion Laboratory.',
    discoveries:['Foundational work on supersonic and hypersonic aerodynamics','The K\u00e1rm\u00e1n vortex street phenomenon','Co-founded the Jet Propulsion Laboratory'] },

  { id:'whittle', name:'Sir Frank Whittle', years:'1907\u20131996', initials:'FW', wikiTitle:'Frank Whittle',
    fields:['Aeronautics'],
    bio:'A British Royal Air Force engineer who independently invented the turbojet engine, patenting the design years before it was built.',
    discoveries:['Invention of the turbojet engine'] },

  { id:'von-ohain', name:'Hans von Ohain', years:'1911\u20131998', initials:'HVO', wikiTitle:'Hans von Ohain',
    fields:['Aeronautics'],
    bio:'A German engineer who independently developed a turbojet engine and, in 1939, powered the Heinkel He 178, the first jet aircraft to actually fly.',
    discoveries:['Design of the engine that powered the first jet-propelled flight (1939)'] },

  { id:'sikorsky', name:'Igor Sikorsky', years:'1889\u20131972', initials:'IS', wikiTitle:'Igor Sikorsky',
    fields:['Aeronautics'],
    bio:'A Russian-American aviation pioneer who built some of the earliest multi-engine fixed-wing aircraft, then created the first mass-produced helicopter.',
    discoveries:['Design of the first successful mass-produced helicopter (VS-300 and successors)','Early pioneering multi-engine aircraft designs'] },

  { id:'earhart', name:'Amelia Earhart', years:'1897\u20131937', initials:'AEA', wikiTitle:'Amelia Earhart',
    fields:['Aeronautics'],
    bio:'An American aviator who became the first woman to fly solo across the Atlantic Ocean, and disappeared in 1937 while attempting to fly around the world.',
    discoveries:['First woman to fly solo across the Atlantic Ocean','Multiple aviation distance and speed records'],
    quote:'The most difficult thing is the decision to act, the rest is merely tenacity.' },

  { id:'lindbergh', name:'Charles Lindbergh', years:'1902\u20131974', initials:'CL', wikiTitle:'Charles Lindbergh',
    fields:['Aeronautics'],
    bio:'An American aviator who made the first solo, non-stop transatlantic flight in 1927, flying the Spirit of St. Louis from New York to Paris.',
    discoveries:['First solo non-stop transatlantic flight (1927)'] },

  { id:'cochran', name:'Jacqueline Cochran', years:'1906\u20131980', initials:'JC', wikiTitle:'Jacqueline Cochran',
    fields:['Aeronautics'],
    bio:'An American aviator who held more speed, altitude, and distance records than any pilot of her era, and became the first woman to break the sound barrier.',
    discoveries:['First woman to break the sound barrier (1953)','Founded and led the WASP (Women Airforce Service Pilots) program in WWII'] },

  { id:'yeager', name:'Chuck Yeager', years:'1923\u20132020', initials:'CY', wikiTitle:'Chuck Yeager',
    fields:['Aeronautics'],
    bio:'An American test pilot who became the first person confirmed to break the sound barrier in level, controlled flight, in the Bell X-1 in 1947.',
    discoveries:['First confirmed supersonic flight in controlled, level conditions (1947)'] },

  { id:'goddard', name:'Robert Goddard', years:'1882\u20131945', initials:'RG', wikiTitle:'Robert H. Goddard',
    fields:['Aerospace'],
    bio:'An American engineer who built and flew the world\u2019s first liquid-fueled rocket in 1926, laying groundwork later used throughout the aerospace industry.',
    discoveries:['First liquid-fueled rocket flight (1926)','Foundational patents in rocket propulsion'] },

  { id:'von-braun', name:'Wernher von Braun', years:'1912\u20131977', initials:'WVB', wikiTitle:'Wernher von Braun',
    fields:['Aerospace'],
    bio:'A German-American aerospace engineer who led development of the Saturn V rocket that carried the first astronauts to the Moon.',
    discoveries:['Chief architect of the Saturn V rocket used in the Apollo program'] },

  { id:'kelly-johnson', name:'Clarence "Kelly" Johnson', years:'1910\u20131990', initials:'KJ', wikiTitle:'Kelly Johnson (engineer)',
    fields:['Aeronautics'],
    bio:'An American aeronautical engineer who led Lockheed\u2019s Skunk Works, designing the U-2 and the SR-71 Blackbird, still the fastest air-breathing manned aircraft ever built.',
    discoveries:['Design leadership on the SR-71 Blackbird and U-2 spy plane','Pioneered fast, secretive aircraft development practices still used today'] },

  { id:'rutan', name:'Burt Rutan', years:'b. 1943', initials:'BR', wikiTitle:'Burt Rutan',
    fields:['Aeronautics'],
    bio:'An American aerospace engineer known for unconventional, highly efficient aircraft designs, including the first plane to fly around the world without refueling.',
    discoveries:['Designed the Rutan Voyager, first non-stop unrefueled flight around the world (1986)','Designed SpaceShipOne, the first privately funded crewed spacecraft (2004)'] },

  { id:'de-la-cierva', name:'Juan de la Cierva', years:'1895\u20131936', initials:'JDLC', wikiTitle:'Juan de la Cierva',
    fields:['Aeronautics'],
    bio:'A Spanish engineer who invented the autogyro, developing the articulated rotor concept that later became essential to modern helicopter design.',
    discoveries:['Invention of the autogyro','The articulated rotor blade, later essential to helicopter design'] },

  { id:'de-havilland', name:'Geoffrey de Havilland', years:'1882\u20131965', initials:'GDH', wikiTitle:'Geoffrey de Havilland',
    fields:['Aeronautics'],
    bio:'A British aviation pioneer and aircraft designer whose company built the Comet, the world\u2019s first commercial jet airliner.',
    discoveries:['Founded an aircraft company responsible for the first commercial jet airliner (Comet)'] },

  { id:'coleman', name:'Bessie Coleman', years:'1892\u20131926', initials:'BC', wikiTitle:'Bessie Coleman',
    fields:['Aeronautics'],
    bio:'The first African American and first Native American woman to hold a pilot\u2019s license, earned in France in 1921 after being refused training in the United States.',
    discoveries:['First African American and Native American woman to earn a pilot\u2019s license (1921)'] },

  { id:'armstrong', name:'Neil Armstrong', years:'1930\u20132012', initials:'NA', wikiTitle:'Neil Armstrong',
    fields:['Aerospace'],
    bio:'A former test pilot and NASA astronaut who became the first person to walk on the Moon during the Apollo 11 mission in 1969.',
    discoveries:['First person to walk on the Moon (1969)','Test pilot on early experimental high-speed aircraft including the X-15'],
    quote:'That\u2019s one small step for man, one giant leap for mankind.' },
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
      <h4>Major Contributions</h4>
      <ul>${s.discoveries.map(d => `<li>${d}</li>`).join('')}</ul>
    </div>
    ${s.quote ? `<blockquote>&ldquo;${s.quote}&rdquo;</blockquote>` : ''}
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
