/* ==========================================================================
   Aeronautics Formulas: real equations used in flight mechanics and aircraft
   design, rendered with KaTeX (already loaded on formulas.html).
   ========================================================================== */

const AERO_FORMULAS = [
["Lift Equation","L = \\tfrac{1}{2}\\rho v^2 S C_L","L = lift (N), \\rho = air density (kg/m\\u00b3), v = airspeed (m/s), S = wing area (m\\u00b2), C_L = lift coefficient"],
["Drag Equation","D = \\tfrac{1}{2}\\rho v^2 S C_D","D = drag (N), \\rho = air density, v = airspeed, S = wing area, C_D = drag coefficient"],
["Dynamic Pressure","q = \\tfrac{1}{2}\\rho v^2","q = dynamic pressure (Pa), \\rho = air density, v = airspeed"],
["Thrust (Momentum Theory)","T = \\dot{m}(V_e - V_0)","T = thrust (N), \\dot{m} = mass flow rate of air/exhaust, V_e = exhaust velocity, V_0 = inlet (flight) velocity"],
["Bernoulli's Equation (Aviation Form)","P + \\tfrac{1}{2}\\rho v^2 + \\rho gh = \\text{constant}","P = static pressure, \\rho = air density, v = airspeed, h = altitude - explains lift over a curved wing surface"],
["Reynolds Number","Re = \\frac{\\rho v L}{\\mu}","Re = Reynolds number (dimensionless), \\rho = density, v = velocity, L = characteristic length, \\mu = dynamic viscosity"],
["Mach Number","M = \\frac{v}{a}","M = Mach number, v = airspeed, a = local speed of sound"],
["Speed of Sound (in air)","a = \\sqrt{\\gamma R T}","a = speed of sound, \\gamma = ratio of specific heats (1.4 for air), R = specific gas constant, T = absolute temperature"],
["Stall Speed","V_{stall} = \\sqrt{\\frac{2W}{\\rho S C_{L,max}}}","V_{stall} = stall speed, W = weight, \\rho = air density, S = wing area, C_{L,max} = maximum lift coefficient"],
["Aspect Ratio","AR = \\frac{b^2}{S}","AR = aspect ratio, b = wingspan, S = wing area - higher AR generally means better glide efficiency"],
["Wing Loading","\\frac{W}{S}","W = aircraft weight, S = wing area - determines stall speed and maneuverability"],
["Lift-to-Drag Ratio","\\frac{L}{D} = \\frac{C_L}{C_D}","The single most important measure of aerodynamic efficiency - higher L/D means less thrust needed to sustain flight"],
["Load Factor","n = \\frac{L}{W}","n = load factor (in g's), L = lift, W = weight - in a level turn, n = 1/\\cos(\\text{bank angle})"],
["Glide Ratio","\\text{Glide Ratio} = \\frac{L}{D} = \\frac{\\text{horizontal distance}}{\\text{altitude lost}}","With engines off, an aircraft's glide ratio equals its lift-to-drag ratio"],
["Induced Drag Coefficient","C_{D,i} = \\frac{C_L^2}{\\pi e \\, AR}","C_{D,i} = induced drag coefficient, e = Oswald efficiency factor, AR = aspect ratio - drag created as a byproduct of generating lift"],
["Total Drag Coefficient","C_D = C_{D,0} + C_{D,i}","C_{D,0} = parasite (zero-lift) drag coefficient, C_{D,i} = induced drag coefficient"],
["Rate of Climb","ROC = \\frac{(T-D)V}{W}","ROC = rate of climb, T = thrust, D = drag, V = airspeed, W = weight - climb rate depends on excess power, not excess thrust alone"],
["Power Required for Level Flight","P_{req} = DV","P_{req} = power required (W), D = drag (N), V = airspeed (m/s)"],
["Breguet Range Equation (Propeller Aircraft)","R = \\frac{\\eta}{c}\\cdot\\frac{L}{D}\\cdot\\ln\\!\\left(\\frac{W_i}{W_f}\\right)","R = range, \\eta = propeller efficiency, c = specific fuel consumption, W_i, W_f = initial and final aircraft weight"],
["Angle of Attack - Lift Coefficient Relation","C_L = C_{L,0} + a\\alpha","C_L = lift coefficient, C_{L,0} = lift coefficient at zero angle of attack, a = lift-curve slope, \\alpha = angle of attack"],
["Center of Pressure Condition","\\sum M_{cg} = 0","For trimmed, stable flight, the sum of moments about the center of gravity must balance - governs where the center of pressure needs to sit relative to the CG"],
["Critical Mach Number (concept)","M_{crit} < 1","The freestream Mach number at which airflow first reaches Mach 1 somewhere on the aircraft, even though the aircraft itself is still flying below the speed of sound"],
["Takeoff Ground Roll (simplified)","s = \\frac{V_{LO}^2}{2a}","s = ground roll distance, V_{LO} = liftoff speed, a = average acceleration during the roll"],
];

function renderAeroFormulas() {
  const grid = document.getElementById('aero-formula-grid');
  if (!grid) return;
  grid.innerHTML = AERO_FORMULAS.map((_, i) => `
    <div class="card">
      <span class="cat-tag">Aeronautics #${i + 1}</span>
      <h3 style="font-size:1.05rem;">${AERO_FORMULAS[i][0]}</h3>
      <div class="formula-display" id="aero-formula-${i}" style="white-space:normal; font-size:1.05rem;"></div>
      <p class="excerpt">${AERO_FORMULAS[i][2]}</p>
    </div>
  `).join('');

  AERO_FORMULAS.forEach((item, i) => {
    const el = document.getElementById(`aero-formula-${i}`);
    if (el && window.katex) {
      try { katex.render(item[1], el, { throwOnError: false }); }
      catch (e) { el.textContent = item[1]; }
    } else if (el) {
      el.textContent = item[1];
    }
  });
}

document.addEventListener('DOMContentLoaded', renderAeroFormulas);
