/* ==========================================================================
   Formula Quick Reference: 100 formulas, rendered with KaTeX (loaded via CDN
   on formulas.html). Each entry: [name, LaTeX string, one-line variable legend].
   ========================================================================== */

const QUICKREF_FORMULAS = [
["Newton's Second Law","F = ma","F = net force (N), m = mass (kg), a = acceleration (m/s\u00b2)"],
["Weight","W = mg","W = weight (N), m = mass (kg), g = gravitational acceleration (m/s\u00b2)"],
["Friction Force","f = \\mu N","f = friction force (N), \\mu = coefficient of friction, N = normal force (N)"],
["Work","W = Fd\\cos\\theta","W = work (J), F = force (N), d = displacement (m), \\theta = angle between F and d"],
["Kinetic Energy","KE = \\tfrac{1}{2}mv^2","KE = kinetic energy (J), m = mass (kg), v = speed (m/s)"],
["Gravitational Potential Energy","PE = mgh","PE = potential energy (J), m = mass (kg), g = gravity (m/s\u00b2), h = height (m)"],
["Power","P = \\frac{W}{t}","P = power (W), W = work (J), t = time (s)"],
["Momentum","p = mv","p = momentum (kg\\cdot m/s), m = mass (kg), v = velocity (m/s)"],
["Impulse","J = F\\Delta t = \\Delta p","J = impulse (N\\cdot s), F = force (N), \\Delta t = time interval (s)"],
["Kinematic: v = v\u2080 + at","v = v_0 + at","v = final velocity, v_0 = initial velocity, a = acceleration, t = time"],
["Kinematic: x = x\u2080 + v\u2080t + \u00bdat\u00b2","x = x_0 + v_0 t + \\tfrac{1}{2}at^2","x = position, x_0 = initial position, v_0 = initial velocity, a = acceleration, t = time"],
["Kinematic: v\u00b2 = v\u2080\u00b2 + 2a\u0394x","v^2 = v_0^2 + 2a\\Delta x","v = final velocity, v_0 = initial velocity, a = acceleration, \\Delta x = displacement"],
["Centripetal Acceleration","a_c = \\frac{v^2}{r}","a_c = centripetal acceleration (m/s\u00b2), v = speed (m/s), r = radius (m)"],
["Centripetal Force","F_c = \\frac{mv^2}{r}","F_c = centripetal force (N), m = mass (kg), v = speed (m/s), r = radius (m)"],
["Angular Velocity","\\omega = \\frac{\\Delta\\theta}{\\Delta t}","\\omega = angular velocity (rad/s), \\Delta\\theta = angle change (rad), \\Delta t = time (s)"],
["Angular Acceleration","\\alpha = \\frac{\\Delta\\omega}{\\Delta t}","\\alpha = angular acceleration (rad/s\u00b2), \\Delta\\omega = change in angular velocity, \\Delta t = time"],
["Torque","\\tau = rF\\sin\\theta","\\tau = torque (N\\cdot m), r = lever arm (m), F = force (N), \\theta = angle between r and F"],
["Moment of Inertia","I = \\sum m_i r_i^2","I = moment of inertia (kg\\cdot m\u00b2), m_i = mass of each particle, r_i = distance from axis"],
["Rotational Kinetic Energy","KE_{rot} = \\tfrac{1}{2}I\\omega^2","KE_{rot} = rotational KE (J), I = moment of inertia, \\omega = angular velocity"],
["Angular Momentum","L = I\\omega","L = angular momentum (kg\\cdot m\u00b2/s), I = moment of inertia, \\omega = angular velocity"],
["Hooke's Law","F = -kx","F = restoring force (N), k = spring constant (N/m), x = displacement from equilibrium (m)"],
["SHM Period (Spring)","T = 2\\pi\\sqrt{\\frac{m}{k}}","T = period (s), m = mass (kg), k = spring constant (N/m)"],
["Simple Pendulum Period","T = 2\\pi\\sqrt{\\frac{L}{g}}","T = period (s), L = pendulum length (m), g = gravitational acceleration (m/s\u00b2)"],
["Gravitational Force (Universal)","F = \\frac{Gm_1 m_2}{r^2}","F = force (N), G = gravitational constant, m_1, m_2 = masses (kg), r = separation (m)"],
["Gravitational Field Strength","g = \\frac{GM}{r^2}","g = field strength (m/s\u00b2), G = gravitational constant, M = mass of body (kg), r = distance (m)"],
["Orbital Velocity","v = \\sqrt{\\frac{GM}{r}}","v = orbital speed (m/s), G = gravitational constant, M = central mass (kg), r = orbital radius (m)"],
["Kepler's Third Law","T^2 = \\frac{4\\pi^2}{GM}r^3","T = orbital period, G = gravitational constant, M = central mass, r = orbital radius"],
["Coulomb's Law","F = \\frac{kq_1 q_2}{r^2}","F = electric force (N), k = Coulomb's constant, q_1, q_2 = charges (C), r = separation (m)"],
["Electric Field","E = \\frac{kQ}{r^2}","E = electric field (N/C), k = Coulomb's constant, Q = source charge (C), r = distance (m)"],
["Electric Force","F = qE","F = force on charge (N), q = charge (C), E = electric field (N/C)"],
["Electric Potential","V = \\frac{kQ}{r}","V = electric potential (V), k = Coulomb's constant, Q = source charge (C), r = distance (m)"],
["Potential Difference","\\Delta V = \\frac{W}{q}","\\Delta V = potential difference (V), W = work done (J), q = charge moved (C)"],
["Capacitance","C = \\frac{Q}{V}","C = capacitance (F), Q = stored charge (C), V = voltage across plates (V)"],
["Capacitor Energy","U = \\tfrac{1}{2}CV^2","U = stored energy (J), C = capacitance (F), V = voltage (V)"],
["Ohm's Law","V = IR","V = voltage (V), I = current (A), R = resistance (\\Omega)"],
["Electrical Power","P = IV","P = power (W), I = current (A), V = voltage (V)"],
["Electrical Energy","E = Pt","E = energy (J), P = power (W), t = time (s)"],
["Resistance (Temperature Dependence)","R = R_0[1+\\alpha(T-T_0)]","R = resistance at T, R_0 = resistance at T_0, \\alpha = temperature coefficient"],
["Resistors in Series","R_{eq} = R_1+R_2+\\cdots","R_{eq} = equivalent resistance, R_1, R_2... = individual resistances"],
["Resistors in Parallel","\\frac{1}{R_{eq}} = \\frac{1}{R_1}+\\frac{1}{R_2}+\\cdots","R_{eq} = equivalent resistance, R_1, R_2... = individual resistances"],
["Capacitors in Series","\\frac{1}{C_{eq}} = \\frac{1}{C_1}+\\frac{1}{C_2}+\\cdots","C_{eq} = equivalent capacitance, C_1, C_2... = individual capacitances"],
["Capacitors in Parallel","C_{eq}=C_1+C_2+\\cdots","C_{eq} = equivalent capacitance, C_1, C_2... = individual capacitances"],
["Magnetic Force on Moving Charge","F = qvB\\sin\\theta","F = magnetic force (N), q = charge (C), v = speed (m/s), B = field (T), \\theta = angle"],
["Magnetic Force on Current-Carrying Wire","F = BIL\\sin\\theta","F = force (N), B = field (T), I = current (A), L = wire length (m), \\theta = angle"],
["Magnetic Field (Straight Wire)","B = \\frac{\\mu_0 I}{2\\pi r}","B = magnetic field (T), \\mu_0 = permeability of free space, I = current (A), r = distance (m)"],
["Magnetic Field (Solenoid)","B = \\mu_0 n I","B = field inside solenoid (T), \\mu_0 = permeability constant, n = turns per length, I = current"],
["Magnetic Flux","\\Phi_B = BA\\cos\\theta","\\Phi_B = magnetic flux (Wb), B = field (T), A = area (m\u00b2), \\theta = angle to normal"],
["Faraday's Law of Induction","\\varepsilon = -\\frac{d\\Phi_B}{dt}","\\varepsilon = induced EMF (V), \\Phi_B = magnetic flux, t = time"],
["Lenz's Law","\\varepsilon = -N\\frac{d\\Phi_B}{dt}","The minus sign: induced EMF opposes the change in flux that produced it; N = number of turns"],
["Motional EMF","\\varepsilon = BLv","\\varepsilon = induced EMF (V), B = field (T), L = rod length (m), v = velocity (m/s)"],
["Transformer Equation","\\frac{V_s}{V_p} = \\frac{N_s}{N_p}","V_s, V_p = secondary/primary voltage, N_s, N_p = secondary/primary turns"],
["Maxwell's Equations (Gauss for E)","\\nabla\\cdot E = \\frac{\\rho}{\\varepsilon_0}","E = electric field, \\rho = charge density, \\varepsilon_0 = permittivity of free space"],
["Maxwell's Equations (Gauss for M)","\\nabla\\cdot B = 0","B = magnetic field - no magnetic monopoles exist"],
["Maxwell's Equations (Faraday)","\\nabla\\times E = -\\frac{\\partial B}{\\partial t}","A changing magnetic field induces a circulating electric field"],
["Maxwell's Equations (Ampere-Maxwell)","\\nabla\\times B = \\mu_0 J + \\mu_0\\varepsilon_0\\frac{\\partial E}{\\partial t}","J = current density; currents and changing E fields both induce B fields"],
["Speed of Light","c = \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}}","c \\approx 3\\times10^8 m/s, \\mu_0 = permeability, \\varepsilon_0 = permittivity of free space"],
["Snell's Law","n_1\\sin\\theta_1 = n_2\\sin\\theta_2","n_1, n_2 = refractive indices, \\theta_1, \\theta_2 = angles of incidence/refraction"],
["Critical Angle","\\theta_c = \\sin^{-1}\\left(\\frac{n_2}{n_1}\\right)","\\theta_c = critical angle, n_1, n_2 = refractive indices (n_1 > n_2)"],
["Lensmaker's Equation","\\frac{1}{f} = (n-1)\\left(\\frac{1}{R_1}-\\frac{1}{R_2}\\right)","f = focal length, n = refractive index, R_1, R_2 = surface curvature radii"],
["Thin Lens Equation","\\frac{1}{f} = \\frac{1}{d_o}+\\frac{1}{d_i}","f = focal length, d_o = object distance, d_i = image distance"],
["Magnification","m = -\\frac{d_i}{d_o}","m = magnification, d_i = image distance, d_o = object distance"],
["Wave Speed","v = f\\lambda","v = wave speed (m/s), f = frequency (Hz), \\lambda = wavelength (m)"],
["Wave Number","k = \\frac{2\\pi}{\\lambda}","k = wave number (rad/m), \\lambda = wavelength (m)"],
["Angular Frequency","\\omega = 2\\pi f","\\omega = angular frequency (rad/s), f = frequency (Hz)"],
["Wave Equation (General)","y(x,t) = A\\sin(kx-\\omega t)","y = displacement, A = amplitude, k = wave number, \\omega = angular frequency"],
["Wavelength-Frequency Relation","\\lambda = \\frac{v}{f}","\\lambda = wavelength (m), v = wave speed (m/s), f = frequency (Hz)"],
["Doppler Effect (Sound)","f' = f\\left(\\frac{v\\pm v_o}{v\\mp v_s}\\right)","f' = observed frequency, v = speed of sound, v_o = observer speed, v_s = source speed"],
["Doppler Effect (Light)","\\frac{\\Delta\\lambda}{\\lambda} \\approx \\frac{v}{c}","\\Delta\\lambda = wavelength shift, v = relative velocity, c = speed of light"],
["Intensity (Wave)","I = \\frac{P}{A}","I = intensity (W/m\u00b2), P = power (W), A = area (m\u00b2)"],
["Intensity Level (Decibels)","\\beta = 10\\log_{10}\\left(\\frac{I}{I_0}\\right)","\\beta = sound level (dB), I = intensity, I_0 = reference intensity (10^{-12} W/m\u00b2)"],
["Standing Wave Frequency (String)","f_n = \\frac{nv}{2L}","f_n = nth harmonic frequency, v = wave speed, L = string length, n = 1,2,3..."],
["Standing Wave Frequency (Pipe - Open)","f_n = \\frac{nv}{2L}","f_n = nth harmonic, v = speed of sound, L = pipe length, n = 1,2,3... (both ends open)"],
["Standing Wave Frequency (Pipe - Closed)","f_n = \\frac{nv}{4L}","f_n = nth harmonic, v = speed of sound, L = pipe length, n = 1,3,5... (one end closed)"],
["First Law of Thermodynamics","\\Delta U = Q - W","\\Delta U = change in internal energy, Q = heat added, W = work done by system"],
["Ideal Gas Law","PV = nRT","P = pressure, V = volume, n = moles, R = gas constant, T = temperature (K)"],
["Work (Thermodynamics)","W = P\\Delta V","W = work done by gas (J), P = pressure (Pa), \\Delta V = volume change (m\u00b3), at constant P"],
["Internal Energy (Monatomic Gas)","U = \\tfrac{3}{2}nRT","U = internal energy (J), n = moles, R = gas constant, T = temperature (K)"],
["Heat Capacity","Q = C\\Delta T","Q = heat added (J), C = heat capacity (J/K), \\Delta T = temperature change (K)"],
["Specific Heat","Q = mc\\Delta T","Q = heat (J), m = mass (kg), c = specific heat (J/(kg\\cdot K)), \\Delta T = temperature change"],
["Latent Heat","Q = mL","Q = heat for phase change (J), m = mass (kg), L = latent heat (J/kg)"],
["Entropy Change","\\Delta S = \\frac{Q}{T}","\\Delta S = entropy change (J/K), Q = heat transferred (J), T = temperature (K), reversible process"],
["Efficiency (Heat Engine)","e = 1-\\frac{Q_c}{Q_h}","e = efficiency, Q_c = heat exhausted (cold), Q_h = heat absorbed (hot)"],
["Coefficient of Performance (Refrigerator)","COP = \\frac{Q_c}{W}","COP = coefficient of performance, Q_c = heat removed, W = work input"],
["Maxwell-Boltzmann Distribution","f(v) = 4\\pi n\\left(\\frac{m}{2\\pi k_BT}\\right)^{3/2}v^2e^{-\\frac{mv^2}{2k_BT}}","f(v) = speed distribution, m = molecule mass, k_B = Boltzmann constant, T = temperature"],
["Stefan-Boltzmann Law","j = \\sigma T^4","j = radiant emittance (W/m\u00b2), \\sigma = Stefan-Boltzmann constant, T = temperature (K)"],
["Wien's Displacement Law","\\lambda_{max} = \\frac{b}{T}","\\lambda_{max} = peak wavelength, b = Wien's constant, T = temperature (K)"],
["Blackbody Radiation (Total Power)","P = \\sigma A T^4","P = total radiated power (W), \\sigma = Stefan-Boltzmann constant, A = surface area, T = temperature"],
["Photoelectric Effect (Energy)","KE_{max} = hf - \\phi","KE_{max} = max electron KE, h = Planck's constant, f = light frequency, \\phi = work function"],
["Photoelectric Effect (Threshold)","f_0 = \\frac{\\phi}{h}","f_0 = threshold frequency, \\phi = work function, h = Planck's constant"],
["de Broglie Wavelength","\\lambda = \\frac{h}{p}","\\lambda = matter wavelength, h = Planck's constant, p = momentum"],
["Heisenberg Uncertainty Principle","\\Delta x\\,\\Delta p \\geq \\frac{\\hbar}{2}","\\Delta x = position uncertainty, \\Delta p = momentum uncertainty, \\hbar = reduced Planck constant"],
["Schr\u00f6dinger Equation (Time-Independent)","-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2}+V\\psi = E\\psi","\\psi = wavefunction, m = particle mass, V = potential energy, E = total energy"],
["Energy of a Photon","E = hf","E = photon energy (J), h = Planck's constant, f = frequency (Hz)"],
["Momentum of a Photon","p = \\frac{h}{\\lambda}","p = photon momentum, h = Planck's constant, \\lambda = wavelength"],
["Mass-Energy Equivalence","E = mc^2","E = energy (J), m = mass (kg), c = speed of light (m/s)"],
["Relativistic Time Dilation","t' = \\frac{t}{\\sqrt{1-v^2/c^2}}","t' = dilated time, t = proper time, v = relative velocity, c = speed of light"],
["Relativistic Length Contraction","L = L_0\\sqrt{1-v^2/c^2}","L = contracted length, L_0 = proper length, v = relative velocity, c = speed of light"],
["Relativistic Momentum","p = \\gamma m v","p = relativistic momentum, \\gamma = Lorentz factor, m = rest mass, v = velocity"],
["Relativistic Energy","E = \\gamma mc^2","E = total energy, \\gamma = Lorentz factor, m = rest mass, c = speed of light"],
["Cosmological Redshift","z = \\frac{\\lambda_{obs}-\\lambda_{emit}}{\\lambda_{emit}}","z = redshift, \\lambda_{obs} = observed wavelength, \\lambda_{emit} = emitted wavelength"],
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
