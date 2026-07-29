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

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ev-calc')?.addEventListener('click', calcEscapeVelocity);
  document.getElementById('op-calc')?.addEventListener('click', calcOrbitalPeriod);
  document.getElementById('td-calc')?.addEventListener('click', calcTimeDilation);
  document.getElementById('pm-calc')?.addEventListener('click', calcProjectile);
  document.getElementById('ig-calc')?.addEventListener('click', calcIdealGas);
  document.getElementById('bb-calc')?.addEventListener('click', calcBlackbody);
  document.getElementById('re-calc')?.addEventListener('click', calcRocket);
});
