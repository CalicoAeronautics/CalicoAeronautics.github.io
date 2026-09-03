/* ==========================================================================
   History of Aeronautics: from early flight concepts to modern aviation.
   ========================================================================== */

const TIMELINE_DATA = [
["Early Concepts","c. 400 BCE","Kite flight demonstrates lift and control in China","Chinese inventors"],
["Early Concepts","1485","Detailed sketches of an ornithopter and other flying machines","Leonardo da Vinci"],
["Early Concepts","1670","Proposes a vacuum airship concept (never built)","Francesco Lana de Terzi"],
["Lighter Than Air","1783","First untethered human flight, in a hot air balloon","Montgolfier brothers"],
["Lighter Than Air","1783","First hydrogen-filled balloon flight","Jacques Charles"],
["The Birth of Aerodynamics","1799","Identifies the four forces of flight: lift, weight, thrust, drag","Sir George Cayley"],
["The Birth of Aerodynamics","1804","First successful heavier-than-air glider model","Sir George Cayley"],
["The Birth of Aerodynamics","1849","First recorded human glider flight (a young boy)","Sir George Cayley"],
["The Birth of Aerodynamics","1853","First adult glider flight, across a valley","Sir George Cayley"],
["The Birth of Aerodynamics","1871","First wind tunnel built for aerodynamic testing","Francis Herbert Wenham"],
["Gliding Pioneers","1891-1896","Over 2,000 documented glider flights; publishes foundational aerodynamic data","Otto Lilienthal"],
["Powered Flight","1899-1902","Systematic glider tests at Kitty Hawk, building on Lilienthal's data","Wright Brothers"],
["Powered Flight","1903","First powered, controlled, sustained heavier-than-air flight","Wright Brothers"],
["Powered Flight","1909","First flight across the English Channel","Louis Bl\u00e9riot"],
["Powered Flight","1914","First scheduled commercial airline flight","St. Petersburg-Tampa Airboat Line"],
["World War I Era","1915-1918","Rapid fighter and biplane development driven by wartime demand","Various"],
["Crossing Oceans","1919","First non-stop transatlantic flight","Alcock and Brown"],
["Modern Aerodynamics","1904-1920s","Develops boundary layer theory, foundational to modern aerodynamics","Ludwig Prandtl"],
["Crossing Oceans","1927","First solo non-stop transatlantic flight","Charles Lindbergh"],
["Breaking Barriers","1932","First solo transatlantic flight by a woman","Amelia Earhart"],
["The Jet Age Begins","1930s","Independently develops the turbojet engine","Frank Whittle and Hans von Ohain"],
["The Jet Age Begins","1939","First flight of a jet-powered aircraft, the Heinkel He 178","Hans von Ohain's engine"],
["Breaking Barriers","1947","First aircraft to break the sound barrier in level flight","Chuck Yeager, Bell X-1"],
["Commercial Aviation","1952","First commercial jet airliner enters service","de Havilland Comet"],
["Commercial Aviation","1958","Boeing 707 begins the jet age of mass commercial air travel","Boeing"],
["Supersonic Travel","1969","First flight of the Concorde supersonic airliner","Concorde"],
["Commercial Aviation","1970","The first jumbo jet enters service","Boeing 747"],
["Supersonic Travel","1976","Concorde begins commercial supersonic passenger service","British Airways / Air France"],
["Reusable Spacecraft","1981","First flight of the reusable Space Shuttle","Space Shuttle Columbia"],
["Endurance Records","1986","First non-stop, non-refueled flight around the world","Rutan Voyager"],
["Supersonic Travel","2003","Concorde retires from commercial service","Concorde"],
["Private Spaceflight","2004","First privately funded crewed spacecraft to reach space","SpaceShipOne"],
["Sustainable Flight","2015-2016","First round-the-world flight powered entirely by solar energy","Solar Impulse 2"],
["Electric Aviation","2020s","Rapid development of electric and hybrid-electric aircraft, and eVTOL urban air mobility prototypes","Various manufacturers"],
];

function renderTimeline() {
  const el = document.getElementById('timeline-list');
  if (!el) return;
  let lastEra = null;
  el.innerHTML = TIMELINE_DATA.map(([era, year, discovery, figures]) => {
    const eraMarker = era !== lastEra
      ? `<div class="timeline-era-marker">${era}</div>`
      : '';
    lastEra = era;
    return `${eraMarker}
      <div class="timeline-item">
        <div class="era">${year}</div>
        <h3>${discovery}</h3>
        <p>${figures}</p>
      </div>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', renderTimeline);
