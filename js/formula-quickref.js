/* ==========================================================================
   Formula Quick Reference: core mechanics, waves, and thermodynamics that
   actually underlie flight - not a general physics formula dump. Rendered
   with KaTeX (already loaded on formulas.html).
   ========================================================================== */

const QUICKREF_FORMULAS = [
["Newton's Second Law","F = ma","F = net force (N), m = mass (kg), a = acceleration (m/s\u00b2)"],
["Weight","W = mg","W = weight (N), m = mass (kg), g = gravitational acceleration (m/s\u00b2)"],
["Friction Force","f = \\mu N","f = friction force (N), \\mu = coefficient of friction, N = normal force (N) - governs takeoff/landing ground roll"],
["Work","W = Fd\\cos\\theta","W = work (J), F = force (N), d = displacement (m), \\theta = angle between F and d"],
["Kinetic Energy","KE = \\tfrac{1}{2}mv^2","KE = kinetic energy (J), m = mass (kg), v = speed (m/s)"],
["Gravitational Potential Energy","PE = mgh","PE = potential energy (J), m = mass (kg), g = gravity (m/s\u00b2), h = altitude (m)"],
["Power","P = \\frac{W}{t}","P = power (W), W = work (J), t = time (s)"],
["Momentum","p = mv","p = momentum (kg\\cdot m/s), m = mass (kg), v = velocity (m/s)"],
["Impulse","J = F\\Delta t = \\Delta p","J = impulse (N\\cdot s), F = force (N), \\Delta t = time interval (s)"],
["Kinematic: v = v\u2080 + at","v = v_0 + at","v = final velocity, v_0 = initial velocity, a = acceleration, t = time"],
["Kinematic: x = x\u2080 + v\u2080t + \u00bdat\u00b2","x = x_0 + v_0 t + \\tfrac{1}{2}at^2","x = position, x_0 = initial position, v_0 = initial velocity, a = acceleration, t = time"],
["Kinematic: v\u00b2 = v\u2080\u00b2 + 2a\u0394x","v^2 = v_0^2 + 2a\\Delta x","v = final velocity, v_0 = initial velocity, a = acceleration, \\Delta x = displacement - used for takeoff/landing distance"],
["Centripetal Acceleration","a_c = \\frac{v^2}{r}","a_c = centripetal acceleration (m/s\u00b2), v = speed (m/s), r = turn radius (m)"],
["Centripetal Force","F_c = \\frac{mv^2}{r}","F_c = centripetal force (N), m = mass (kg), v = speed (m/s), r = turn radius (m) - governs banked turns"],
["Angular Velocity","\\omega = \\frac{\\Delta\\theta}{\\Delta t}","\\omega = angular velocity (rad/s) - propeller and turbine shaft speed"],
["Angular Acceleration","\\alpha = \\frac{\\Delta\\omega}{\\Delta t}","\\alpha = angular acceleration (rad/s\u00b2), \\Delta\\omega = change in angular velocity, \\Delta t = time"],
["Torque","\\tau = rF\\sin\\theta","\\tau = torque (N\\cdot m), r = lever arm (m), F = force (N), \\theta = angle - engine and control-surface torque"],
["Moment of Inertia","I = \\sum m_i r_i^2","I = moment of inertia (kg\\cdot m\\u00b2) - governs how an aircraft resists rolling, pitching, and yawing"],
["Rotational Kinetic Energy","KE_{rot} = \\tfrac{1}{2}I\\omega^2","KE_{rot} = rotational KE (J), I = moment of inertia, \\omega = angular velocity"],
["Angular Momentum","L = I\\omega","L = angular momentum (kg\\cdot m\\u00b2/s) - the source of gyroscopic effects in propellers and turbines"],
["Hooke's Law","F = -kx","F = restoring force (N), k = spring constant (N/m), x = displacement - relevant to landing gear shock struts"],
["Gravitational Force (Universal)","F = \\frac{Gm_1 m_2}{r^2}","F = force (N), G = gravitational constant, m_1, m_2 = masses (kg), r = separation (m)"],
["Gravitational Field Strength","g = \\frac{GM}{r^2}","g = field strength (m/s\u00b2), G = gravitational constant, M = mass of body (kg), r = distance (m)"],
["Orbital Velocity","v = \\sqrt{\\frac{GM}{r}}","v = orbital speed (m/s) - the speed needed to stay in a circular orbit, relevant once flight becomes spaceflight"],
["Kepler's Third Law","T^2 = \\frac{4\\pi^2}{GM}r^3","T = orbital period, G = gravitational constant, M = central mass, r = orbital radius"],
["Wave Speed","v = f\\lambda","v = wave speed (m/s), f = frequency (Hz), \\lambda = wavelength (m) - governs the speed of sound in air"],
["Wave Number","k = \\frac{2\\pi}{\\lambda}","k = wave number (rad/m), \\lambda = wavelength (m)"],
["Angular Frequency","\\omega = 2\\pi f","\\omega = angular frequency (rad/s), f = frequency (Hz)"],
["Wave Equation (General)","y(x,t) = A\\sin(kx-\\omega t)","y = displacement, A = amplitude, k = wave number, \\omega = angular frequency"],
["Wavelength-Frequency Relation","\\lambda = \\frac{v}{f}","\\lambda = wavelength (m), v = wave speed (m/s), f = frequency (Hz)"],
["Doppler Effect (Sound)","f' = f\\left(\\frac{v\\pm v_o}{v\\mp v_s}\\right)","f' = observed frequency - explains the pitch shift of aircraft engine noise as a plane passes overhead"],
["Sound Intensity","I = \\frac{P}{A}","I = intensity (W/m\u00b2), P = power (W), A = area (m\u00b2)"],
["Sound Intensity Level (Decibels)","\\beta = 10\\log_{10}\\left(\\frac{I}{I_0}\\right)","\\beta = sound level (dB) - how aircraft and airport noise limits are actually measured"],
["First Law of Thermodynamics","\\Delta U = Q - W","\\Delta U = change in internal energy, Q = heat added, W = work done by system - governs jet engine thermodynamic cycles"],
["Ideal Gas Law","PV = nRT","P = pressure, V = volume, n = moles, R = gas constant, T = temperature (K) - describes the atmosphere an aircraft flies through"],
["Work (Thermodynamics)","W = P\\Delta V","W = work done by gas (J), P = pressure (Pa), \\Delta V = volume change (m\\u00b3), at constant P"],
["Internal Energy (Monatomic Gas)","U = \\tfrac{3}{2}nRT","U = internal energy (J), n = moles, R = gas constant, T = temperature (K)"],
["Heat Capacity","Q = C\\Delta T","Q = heat added (J), C = heat capacity (J/K), \\Delta T = temperature change (K)"],
["Specific Heat","Q = mc\\Delta T","Q = heat (J), m = mass (kg), c = specific heat (J/(kg\\cdot K)), \\Delta T = temperature change"],
["Latent Heat","Q = mL","Q = heat for phase change (J), m = mass (kg), L = latent heat (J/kg) - relevant to airframe icing"],
["Entropy Change","\\Delta S = \\frac{Q}{T}","\\Delta S = entropy change (J/K), Q = heat transferred (J), T = temperature (K) - bounds jet engine cycle efficiency"],
["Efficiency (Heat Engine)","e = 1-\\frac{Q_c}{Q_h}","e = efficiency, Q_c = heat exhausted (cold), Q_h = heat absorbed (hot) - the theoretical ceiling on jet engine efficiency"],
];

function renderQuickRefFormulas() {
  const grid = document.getElementById('quickref-grid');
  if (!grid) return;
  grid.innerHTML = QUICKREF_FORMULAS.map((_, i) => `
    <div class="card">
      <span class="cat-tag">#${i + 1}</span>
      <h3 style="font-size:1.05rem;">${QUICKREF_FORMULAS[i][0]}</h3>
      <div class="formula-display" id="qr-formula-${i}" style="white-space:normal; font-size:1.05rem;"></div>
      <p class="excerpt">${QUICKREF_FORMULAS[i][2]}</p>
    </div>
  `).join('');

  QUICKREF_FORMULAS.forEach((item, i) => {
    const el = document.getElementById(`qr-formula-${i}`);
    if (el && window.katex) {
      try {
        katex.render(item[1], el, { throwOnError: false });
      } catch (e) {
        el.textContent = item[1];
      }
    } else if (el) {
      el.textContent = item[1];
    }
  });
}

document.addEventListener('DOMContentLoaded', renderQuickRefFormulas);
