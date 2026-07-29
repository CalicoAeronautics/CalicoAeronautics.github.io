/* ==========================================================================
   Physics calculators. Each function reads its own form, computes, and
   writes into its own result box. No shared state between calculators.
   ========================================================================== */

const G = 6.6743e-11;      // gravitational constant, m^3 kg^-1 s^-2
const C = 2.99792458e8;    // speed of light, m/s
const SIGMA = 5.670374e-8; // Stefan-Boltzmann constant, W m^-2 K^-4
const WIEN_B = 2.8977719e-3; // Wien's displacement constant, m*K
const R_GAS = 0.0820573;   // ideal gas constant, L*atm / (mol*K)
const g0 = 9.80665;        // standard gravity, m/s^2

function showResult(id, html, isError = false) {
  const box = document.getElementById(id);
  box.innerHTML = html;
  box.classList.add('shown');
  box.classList.toggle('result-error', isError);
}

function num(id) {
  const v = parseFloat(document.getElementById(id).value);
  return v;
}

function fmt(x, digits = 4) {
  if (!isFinite(x)) return 'undefined';
  if (Math.abs(x) >= 1e5 || (Math.abs(x) < 1e-3 && x !== 0)) return x.toExponential(3);
  return Number(x.toPrecision(digits)).toString();
}

/* ---- 1. Escape velocity: v = sqrt(2GM/r) ---- */
function calcEscapeVelocity() {
  const M = num('ev-mass');
  const r = num('ev-radius');
  if (!(M > 0) || !(r > 0)) return showResult('ev-result', 'Enter a positive mass and radius.', true);
  const v = Math.sqrt((2 * G * M) / r);
  showResult('ev-result', `Escape velocity: <strong>${fmt(v / 1000)} km/s</strong> (${fmt(v)} m/s)`);
}

/* ---- 2. Orbital period: T = 2*pi*sqrt(r^3 / GM) ---- */
function calcOrbitalPeriod() {
  const M = num('op-mass');
  const r = num('op-radius');
  if (!(M > 0) || !(r > 0)) return showResult('op-result', 'Enter a positive central mass and orbital radius.', true);
  const T = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / (G * M));
  showResult('op-result',
    `Orbital period: <strong>${fmt(T)} s</strong><br>` +
    `= ${fmt(T / 3600)} hours &middot; ${fmt(T / 86400)} days`
  );
}

/* ---- 3. Time dilation: t' = t / sqrt(1 - v^2/c^2) ---- */
function calcTimeDilation() {
  const t = num('td-time');
  const beta = num('td-velocity'); // fraction of c, 0-0.999999
  if (!(t >= 0) || !(beta >= 0) || beta >= 1) {
    return showResult('td-result', 'Enter a non-negative time and a velocity between 0 and 1 (as a fraction of c).', true);
  }
  const gamma = 1 / Math.sqrt(1 - beta * beta);
  const tPrime = t * gamma;
  showResult('td-result',
    `Lorentz factor &gamma; = <strong>${fmt(gamma)}</strong><br>` +
    `Dilated time: <strong>${fmt(tPrime)} s</strong> (proper time was ${fmt(t)} s)`
  );
}

/* ---- 4. Projectile motion ---- */
function calcProjectile() {
  const v0 = num('pm-speed');
  const angleDeg = num('pm-angle');
  const g = num('pm-gravity') || 9.8;
  if (!(v0 > 0) || !(angleDeg >= 0 && angleDeg <= 90)) {
    return showResult('pm-result', 'Enter a positive speed and an angle between 0 and 90 degrees.', true);
  }
  const theta = (angleDeg * Math.PI) / 180;
  const vy = v0 * Math.sin(theta);
  const vx = v0 * Math.cos(theta);
  const tFlight = (2 * vy) / g;
  const maxHeight = (vy * vy) / (2 * g);
  const range = vx * tFlight;
  showResult('pm-result',
    `Max height: <strong>${fmt(maxHeight)} m</strong><br>` +
    `Time of flight: <strong>${fmt(tFlight)} s</strong><br>` +
    `Range: <strong>${fmt(range)} m</strong>`
  );
}

/* ---- 5. Ideal gas law: PV = nRT (solve for chosen variable) ---- */
function calcIdealGas() {
  const target = document.getElementById('ig-target').value;
  const P = num('ig-pressure');   // atm
  const V = num('ig-volume');     // L
  const n = num('ig-moles');      // mol
  const T = num('ig-temp');       // K

  try {
    let result, label, unit;
    if (target === 'P') {
      if (!(V > 0) || !(n > 0) || !(T > 0)) throw 0;
      result = (n * R_GAS * T) / V; label = 'Pressure'; unit = 'atm';
    } else if (target === 'V') {
      if (!(P > 0) || !(n > 0) || !(T > 0)) throw 0;
      result = (n * R_GAS * T) / P; label = 'Volume'; unit = 'L';
    } else if (target === 'n') {
      if (!(P > 0) || !(V > 0) || !(T > 0)) throw 0;
      result = (P * V) / (R_GAS * T); label = 'Moles'; unit = 'mol';
    } else {
      if (!(P > 0) || !(V > 0) || !(n > 0)) throw 0;
      result = (P * V) / (n * R_GAS); label = 'Temperature'; unit = 'K';
    }
    showResult('ig-result', `${label}: <strong>${fmt(result)} ${unit}</strong>`);
  } catch (e) {
    showResult('ig-result', 'Fill in the other three fields with positive values (leave the one you\u2019re solving for blank or ignore it).', true);
  }
}

/* ---- 6. Blackbody radiation: Stefan-Boltzmann + Wien's law ---- */
function calcBlackbody() {
  const T = num('bb-temp');
  const area = num('bb-area'); // optional, m^2
  if (!(T > 0)) return showResult('bb-result', 'Enter a positive temperature in kelvin.', true);
  const flux = SIGMA * Math.pow(T, 4);
  const peakWavelength = (WIEN_B / T) * 1e9; // nm
  let html =
    `Radiant emittance: <strong>${fmt(flux)} W/m&sup2;</strong><br>` +
    `Peak wavelength (Wien's law): <strong>${fmt(peakWavelength)} nm</strong>`;
  if (area > 0) {
    html += `<br>Total radiated power: <strong>${fmt(flux * area)} W</strong>`;
  }
  showResult('bb-result', html);
}

/* ---- 7. Rocket equation (Tsiolkovsky): dv = Isp * g0 * ln(m0/mf) ---- */
function calcRocket() {
  const isp = num('re-isp');
  const m0 = num('re-m0');
  const mf = num('re-mf');
  if (!(isp > 0) || !(m0 > 0) || !(mf > 0) || mf >= m0) {
    return showResult('re-result', 'Enter a positive specific impulse, and a final mass smaller than the initial mass.', true);
  }
  const ve = isp * g0;
  const dv = ve * Math.log(m0 / mf);
  showResult('re-result',
    `Exhaust velocity: <strong>${fmt(ve)} m/s</strong><br>` +
    `&Delta;v: <strong>${fmt(dv)} m/s</strong> (${fmt(dv / 1000)} km/s)`
  );
}

/* ---- 8. Quadratic Kinematics (time of flight): solve at^2+bt+c=0 ---- */
function calcQuadratic() {
  const a = num('qf-a'), b = num('qf-b'), c = num('qf-c');
  if (!(a !== 0) || isNaN(b) || isNaN(c)) return showResult('qf-result', 'Enter a, b, and c (a cannot be 0).', true);
  const disc = b * b - 4 * a * c;
  if (disc < 0) return showResult('qf-result', 'No real solution (negative discriminant).', true);
  const t1 = (-b + Math.sqrt(disc)) / (2 * a);
  const t2 = (-b - Math.sqrt(disc)) / (2 * a);
  showResult('qf-result', `t = ${fmt(t1)} or t = ${fmt(t2)}<br>(use whichever is positive/physical)`);
}

/* ---- 9. Sine/Cosine/Tangent of any angle ---- */
function calcTrig() {
  const deg = num('tg-angle');
  if (isNaN(deg)) return showResult('tg-result', 'Enter an angle in degrees.', true);
  const rad = (deg * Math.PI) / 180;
  showResult('tg-result',
    `sin = ${fmt(Math.sin(rad))} &middot; cos = ${fmt(Math.cos(rad))} &middot; tan = ${fmt(Math.tan(rad))}`
  );
}

/* ---- 10. Inverse Sine/Cosine/Tangent ---- */
function calcInverseTrig() {
  const fn = document.getElementById('itg-fn').value;
  const val = num('itg-value');
  if (isNaN(val)) return showResult('itg-result', 'Enter a value.', true);
  let rad;
  if (fn === 'asin') { if (val < -1 || val > 1) return showResult('itg-result', 'Value must be between -1 and 1.', true); rad = Math.asin(val); }
  else if (fn === 'acos') { if (val < -1 || val > 1) return showResult('itg-result', 'Value must be between -1 and 1.', true); rad = Math.acos(val); }
  else { rad = Math.atan(val); }
  showResult('itg-result', `Angle = <strong>${fmt((rad * 180) / Math.PI)}&deg;</strong>`);
}

/* ---- 11. Square Root utility ---- */
function calcSquareRoot() {
  const x = num('sq-value');
  if (!(x >= 0)) return showResult('sq-result', 'Enter a non-negative number.', true);
  showResult('sq-result', `&radic;${fmt(x)} = <strong>${fmt(Math.sqrt(x))}</strong>`);
}

/* ---- 12. Gravitational Force (two masses) ---- */
function calcGravForce() {
  const m1 = num('gf-m1'), m2 = num('gf-m2'), r = num('gf-r');
  if (!(m1 > 0) || !(m2 > 0) || !(r > 0)) return showResult('gf-result', 'Enter positive masses and separation.', true);
  const F = (G * m1 * m2) / (r * r);
  showResult('gf-result', `F = <strong>${fmt(F)} N</strong>`);
}

/* ---- 13. Coulomb Force ---- */
function calcCoulombForce() {
  const K_COULOMB = 8.99e9;
  const q1 = num('cf-q1'), q2 = num('cf-q2'), r = num('cf-r');
  if (isNaN(q1) || isNaN(q2) || !(r > 0)) return showResult('cf-result', 'Enter both charges and a positive separation.', true);
  const F = (K_COULOMB * q1 * q2) / (r * r);
  showResult('cf-result', `F = <strong>${fmt(F)} N</strong> (${F >= 0 ? 'repulsive' : 'attractive'})`);
}

/* ---- 14. Electric Field Magnitude ---- */
function calcEFieldMag() {
  const K_COULOMB = 8.99e9;
  const Q = num('efc-q'), r = num('efc-r');
  if (isNaN(Q) || !(r > 0)) return showResult('efc-result', 'Enter a charge and a positive distance.', true);
  const E = (K_COULOMB * Q) / (r * r);
  showResult('efc-result', `E = <strong>${fmt(E)} N/C</strong>`);
}

/* ---- 15. Magnetic Force on a Moving Charge ---- */
function calcMagForceCharge() {
  const q = num('mfc-q'), v = num('mfc-v'), B = num('mfc-b'), theta = num('mfc-theta') || 90;
  if (isNaN(q) || !(v >= 0) || isNaN(B)) return showResult('mfc-result', 'Enter charge, speed, and field.', true);
  const F = Math.abs(q) * v * B * Math.sin((theta * Math.PI) / 180);
  showResult('mfc-result', `F = <strong>${fmt(F)} N</strong>`);
}

/* ---- 16. Magnetic Force on a Current-Carrying Wire ---- */
function calcMagForceWire() {
  const B = num('mfw-b'), I = num('mfw-i'), L = num('mfw-l'), theta = num('mfw-theta') || 90;
  if (isNaN(B) || isNaN(I) || !(L >= 0)) return showResult('mfw-result', 'Enter field, current, and length.', true);
  const F = B * I * L * Math.sin((theta * Math.PI) / 180);
  showResult('mfw-result', `F = <strong>${fmt(F)} N</strong>`);
}

/* ---- 17. Snell's Law (solve for refraction angle) ---- */
function calcSnell() {
  const n1 = num('sn-n1'), theta1 = num('sn-theta1'), n2 = num('sn-n2');
  if (!(n1 > 0) || !(n2 > 0) || isNaN(theta1)) return showResult('sn-result', 'Enter both indices and the incidence angle.', true);
  const sinTheta2 = (n1 * Math.sin((theta1 * Math.PI) / 180)) / n2;
  if (Math.abs(sinTheta2) > 1) return showResult('sn-result', 'Total internal reflection - no refracted ray (sin > 1).', true);
  const theta2 = (Math.asin(sinTheta2) * 180) / Math.PI;
  showResult('sn-result', `&theta;\u2082 = <strong>${fmt(theta2)}&deg;</strong>`);
}

/* ---- 18. Thin Lens Equation (solve for f, do, or di) ---- */
function calcThinLens() {
  const target = document.getElementById('ln-target').value;
  const f = num('ln-f'), do_ = num('ln-do'), di = num('ln-di');
  try {
    let result, label;
    if (target === 'f') { if (!(do_ > 0) || !(di !== 0)) throw 0; result = 1 / (1 / do_ + 1 / di); label = 'Focal length f'; }
    else if (target === 'do') { if (!(f > 0) || !(di !== 0)) throw 0; result = 1 / (1 / f - 1 / di); label = 'Object distance d\u2092'; }
    else { if (!(f > 0) || !(do_ > 0)) throw 0; result = 1 / (1 / f - 1 / do_); label = 'Image distance d\u1d62'; }
    showResult('ln-result', `${label} = <strong>${fmt(result)}</strong> (same length unit as your inputs)`);
  } catch (e) {
    showResult('ln-result', 'Fill in the other two values with valid (non-zero) numbers.', true);
  }
}

/* ---- 19. Mirror/Lens Magnification ---- */
function calcMagnification() {
  const do_ = num('mg2-do'), di = num('mg2-di'), ho = num('mg2-ho');
  if (!(do_ !== 0) || isNaN(di)) return showResult('mg2-result', 'Enter object and image distance.', true);
  const m = -di / do_;
  let html = `m = <strong>${fmt(m)}</strong> (${m < 0 ? 'inverted' : 'upright'}, ${Math.abs(m) > 1 ? 'enlarged' : 'reduced'})`;
  if (!isNaN(ho)) html += `<br>Image height h\u1d62 = <strong>${fmt(m * ho)}</strong>`;
  showResult('mg2-result', html);
}

/* ---- 20. Specific Heat with Mixed Units (cal <-> J) ---- */
function calcSpecificHeatMixed() {
  const m = num('sh2-m'), c = num('sh2-c'), dT = num('sh2-dt');
  const unit = document.getElementById('sh2-unit').value;
  if (!(m > 0) || isNaN(c) || isNaN(dT)) return showResult('sh2-result', 'Enter mass, specific heat, and temperature change.', true);
  const Q_native = m * c * dT;
  const CAL_TO_J = 4.184;
  const Q_J = unit === 'cal' ? Q_native * CAL_TO_J : Q_native;
  const Q_cal = unit === 'cal' ? Q_native : Q_native / CAL_TO_J;
  showResult('sh2-result', `Q = <strong>${fmt(Q_J)} J</strong> (${fmt(Q_cal)} cal)`);
}

/* ---- 21. Latent Heat ---- */
function calcLatentHeat() {
  const m = num('lh-m'), L = num('lh-l');
  if (!(m > 0) || !(L > 0)) return showResult('lh-result', 'Enter a positive mass and latent heat.', true);
  showResult('lh-result', `Q = <strong>${fmt(m * L)} J</strong>`);
}

/* ---- 22. Ideal Gas Law in SI units (Pa, m^3, mol, K) ---- */
function calcIdealGasSI() {
  const R_SI = 8.314;
  const target = document.getElementById('ig2-target').value;
  const P = num('ig2-p'), V = num('ig2-v'), n = num('ig2-n'), T = num('ig2-t');
  try {
    let result, label, unit;
    if (target === 'P') { if (!(V > 0) || !(n > 0) || !(T > 0)) throw 0; result = (n * R_SI * T) / V; label = 'Pressure'; unit = 'Pa'; }
    else if (target === 'V') { if (!(P > 0) || !(n > 0) || !(T > 0)) throw 0; result = (n * R_SI * T) / P; label = 'Volume'; unit = 'm\u00b3'; }
    else if (target === 'n') { if (!(P > 0) || !(V > 0) || !(T > 0)) throw 0; result = (P * V) / (R_SI * T); label = 'Moles'; unit = 'mol'; }
    else { if (!(P > 0) || !(V > 0) || !(n > 0)) throw 0; result = (P * V) / (n * R_SI); label = 'Temperature'; unit = 'K'; }
    showResult('ig2-result', `${label}: <strong>${fmt(result)} ${unit}</strong>`);
  } catch (e) {
    showResult('ig2-result', 'Fill in the other three fields with positive values.', true);
  }
}

/* ---- 23. Doppler Effect (moving source or observer, signed) ---- */
function calcDopplerGeneral() {
  const f = num('dp2-f'), v = num('dp2-v'), vo = num('dp2-vo') || 0, vs = num('dp2-vs') || 0;
  if (!(f > 0) || !(v > 0)) return showResult('dp2-result', 'Enter a positive frequency and wave speed.', true);
  const fPrime = f * ((v + vo) / (v - vs));
  showResult('dp2-result', `f' = <strong>${fmt(fPrime)} Hz</strong><br><span style="color:var(--cream-dim); font-size:0.8rem;">Positive v\u2092/v\u209b = moving toward; negative = moving away.</span>`);
}

/* ---- 24. RC Circuit Time Constant ---- */
function calcRCCircuit() {
  const R = num('rc-r'), C = num('rc-c'), t = num('rc-t'), V0 = num('rc-v0');
  if (!(R > 0) || !(C > 0)) return showResult('rc-result', 'Enter a positive resistance and capacitance.', true);
  const tau = R * C;
  let html = `&tau; = RC = <strong>${fmt(tau)} s</strong>`;
  if (!isNaN(t) && !isNaN(V0)) {
    const Vt = V0 * Math.exp(-t / tau);
    html += `<br>V(t) = <strong>${fmt(Vt)} V</strong> at t = ${fmt(t)} s`;
  }
  showResult('rc-result', html);
}

/* ---- 25. Half-Life Decay ---- */
function calcHalfLife() {
  const N0 = num('hl-n0'), halfLife = num('hl-half'), t = num('hl-t');
  if (!(N0 > 0) || !(halfLife > 0) || !(t >= 0)) return showResult('hl-result', 'Enter positive initial amount, half-life, and time.', true);
  const N = N0 * Math.pow(0.5, t / halfLife);
  showResult('hl-result', `Remaining: <strong>${fmt(N)}</strong> (${fmt((N / N0) * 100)}% of original)`);
}

/* ---- 26. Decibel Intensity Level ---- */
function calcDecibel() {
  const I0 = 1e-12;
  const I = num('db-i');
  if (!(I > 0)) return showResult('db-result', 'Enter a positive intensity in W/m\u00b2.', true);
  const beta = 10 * Math.log10(I / I0);
  showResult('db-result', `&beta; = <strong>${fmt(beta)} dB</strong>`);
}

/* ---- 27. Photon Energy ---- */
function calcPhotonEnergy() {
  const H_PLANCK = 6.63e-34;
  const C_LIGHT = 3e8;
  const mode = document.getElementById('ph-mode').value;
  const val = num('ph-value');
  if (isNaN(val) || val <= 0) return showResult('ph-result', 'Enter a positive frequency or wavelength.', true);
  const f = mode === 'freq' ? val : C_LIGHT / val;
  const E = H_PLANCK * f;
  showResult('ph-result', `E = <strong>${fmt(E)} J</strong> (using f = ${fmt(f)} Hz)`);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ev-calc')?.addEventListener('click', calcEscapeVelocity);
  document.getElementById('op-calc')?.addEventListener('click', calcOrbitalPeriod);
  document.getElementById('td-calc')?.addEventListener('click', calcTimeDilation);
  document.getElementById('pm-calc')?.addEventListener('click', calcProjectile);
  document.getElementById('ig-calc')?.addEventListener('click', calcIdealGas);
  document.getElementById('bb-calc')?.addEventListener('click', calcBlackbody);
  document.getElementById('re-calc')?.addEventListener('click', calcRocket);
  document.getElementById('qf-calc')?.addEventListener('click', calcQuadratic);
  document.getElementById('tg-calc')?.addEventListener('click', calcTrig);
  document.getElementById('itg-calc')?.addEventListener('click', calcInverseTrig);
  document.getElementById('sq-calc')?.addEventListener('click', calcSquareRoot);
  document.getElementById('gf-calc')?.addEventListener('click', calcGravForce);
  document.getElementById('cf-calc')?.addEventListener('click', calcCoulombForce);
  document.getElementById('efc-calc')?.addEventListener('click', calcEFieldMag);
  document.getElementById('mfc-calc')?.addEventListener('click', calcMagForceCharge);
  document.getElementById('mfw-calc')?.addEventListener('click', calcMagForceWire);
  document.getElementById('sn-calc')?.addEventListener('click', calcSnell);
  document.getElementById('ln-calc')?.addEventListener('click', calcThinLens);
  document.getElementById('mg2-calc')?.addEventListener('click', calcMagnification);
  document.getElementById('sh2-calc')?.addEventListener('click', calcSpecificHeatMixed);
  document.getElementById('lh-calc')?.addEventListener('click', calcLatentHeat);
  document.getElementById('ig2-calc')?.addEventListener('click', calcIdealGasSI);
  document.getElementById('dp2-calc')?.addEventListener('click', calcDopplerGeneral);
  document.getElementById('rc-calc')?.addEventListener('click', calcRCCircuit);
  document.getElementById('hl-calc')?.addEventListener('click', calcHalfLife);
  document.getElementById('db-calc')?.addEventListener('click', calcDecibel);
  document.getElementById('ph-calc')?.addEventListener('click', calcPhotonEnergy);
});
