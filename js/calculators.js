/* ==========================================================================
   Calculators: core mechanics/thermo calculators plus the calculators that
   actually matter for flight - lift, drag, stall speed, Mach number,
   Reynolds number, glide performance, load factor, wing geometry.
   Nothing electromagnetic, quantum, relativistic, or optical - trimmed to
   what's relevant to aeronautics and aerospace.
   ========================================================================== */

const G = 6.6743e-11;
const g0 = 9.80665;

function showResult(id, html, isError = false) {
  const box = document.getElementById(id);
  box.innerHTML = html;
  box.classList.add('shown');
  box.classList.toggle('result-error', isError);
}
function num(id) { return parseFloat(document.getElementById(id).value); }
function fmt(x, digits = 4) {
  if (!isFinite(x)) return 'undefined';
  if (Math.abs(x) >= 1e5 || (Math.abs(x) < 1e-3 && x !== 0)) return x.toExponential(3);
  return Number(x.toPrecision(digits)).toString();
}

/* ---- Escape velocity ---- */
function calcEscapeVelocity() {
  const M = num('ev-mass'), r = num('ev-radius');
  if (!(M > 0) || !(r > 0)) return showResult('ev-result', 'Enter a positive mass and radius.', true);
  const v = Math.sqrt((2 * G * M) / r);
  showResult('ev-result', `Escape velocity: <strong>${fmt(v / 1000)} km/s</strong> (${fmt(v)} m/s)`);
}

/* ---- Orbital period ---- */
function calcOrbitalPeriod() {
  const M = num('op-mass'), r = num('op-radius');
  if (!(M > 0) || !(r > 0)) return showResult('op-result', 'Enter a positive central mass and orbital radius.', true);
  const T = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / (G * M));
  showResult('op-result', `Orbital period: <strong>${fmt(T)} s</strong><br>= ${fmt(T / 3600)} hours &middot; ${fmt(T / 86400)} days`);
}

/* ---- Projectile motion ---- */
function calcProjectile() {
  const v0 = num('pm-speed'), angleDeg = num('pm-angle'), g = num('pm-gravity') || 9.8;
  if (!(v0 > 0) || !(angleDeg >= 0 && angleDeg <= 90)) return showResult('pm-result', 'Enter a positive speed and an angle between 0 and 90 degrees.', true);
  const theta = (angleDeg * Math.PI) / 180;
  const vy = v0 * Math.sin(theta), vx = v0 * Math.cos(theta);
  const tFlight = (2 * vy) / g;
  const maxHeight = (vy * vy) / (2 * g);
  const range = vx * tFlight;
  showResult('pm-result', `Max height: <strong>${fmt(maxHeight)} m</strong><br>Time of flight: <strong>${fmt(tFlight)} s</strong><br>Range: <strong>${fmt(range)} m</strong>`);
}

/* ---- Ideal gas law (atm/L) ---- */
function calcIdealGas() {
  const R_GAS = 0.0820573;
  const target = document.getElementById('ig-target').value;
  const P = num('ig-pressure'), V = num('ig-volume'), n = num('ig-moles'), T = num('ig-temp');
  try {
    let result, label, unit;
    if (target === 'P') { if (!(V > 0) || !(n > 0) || !(T > 0)) throw 0; result = (n * R_GAS * T) / V; label = 'Pressure'; unit = 'atm'; }
    else if (target === 'V') { if (!(P > 0) || !(n > 0) || !(T > 0)) throw 0; result = (n * R_GAS * T) / P; label = 'Volume'; unit = 'L'; }
    else if (target === 'n') { if (!(P > 0) || !(V > 0) || !(T > 0)) throw 0; result = (P * V) / (R_GAS * T); label = 'Moles'; unit = 'mol'; }
    else { if (!(P > 0) || !(V > 0) || !(n > 0)) throw 0; result = (P * V) / (n * R_GAS); label = 'Temperature'; unit = 'K'; }
    showResult('ig-result', `${label}: <strong>${fmt(result)} ${unit}</strong>`);
  } catch (e) {
    showResult('ig-result', 'Fill in the other three fields with positive values.', true);
  }
}

/* ---- Rocket equation ---- */
function calcRocket() {
  const isp = num('re-isp'), m0 = num('re-m0'), mf = num('re-mf');
  if (!(isp > 0) || !(m0 > 0) || !(mf > 0) || mf >= m0) return showResult('re-result', 'Enter a positive specific impulse, and a final mass smaller than the initial mass.', true);
  const ve = isp * g0;
  const dv = ve * Math.log(m0 / mf);
  showResult('re-result', `Exhaust velocity: <strong>${fmt(ve)} m/s</strong><br>&Delta;v: <strong>${fmt(dv)} m/s</strong> (${fmt(dv / 1000)} km/s)`);
}

/* ---- Quadratic kinematics ---- */
function calcQuadratic() {
  const a = num('qf-a'), b = num('qf-b'), c = num('qf-c');
  if (!(a !== 0) || isNaN(b) || isNaN(c)) return showResult('qf-result', 'Enter a, b, and c (a cannot be 0).', true);
  const disc = b * b - 4 * a * c;
  if (disc < 0) return showResult('qf-result', 'No real solution (negative discriminant).', true);
  const t1 = (-b + Math.sqrt(disc)) / (2 * a), t2 = (-b - Math.sqrt(disc)) / (2 * a);
  showResult('qf-result', `t = ${fmt(t1)} or t = ${fmt(t2)}<br>(use whichever is positive/physical)`);
}

/* ---- Trig ---- */
function calcTrig() {
  const deg = num('tg-angle');
  if (isNaN(deg)) return showResult('tg-result', 'Enter an angle in degrees.', true);
  const rad = (deg * Math.PI) / 180;
  showResult('tg-result', `sin = ${fmt(Math.sin(rad))} &middot; cos = ${fmt(Math.cos(rad))} &middot; tan = ${fmt(Math.tan(rad))}`);
}

/* ---- Inverse trig ---- */
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

/* ---- Square root ---- */
function calcSquareRoot() {
  const x = num('sq-value');
  if (!(x >= 0)) return showResult('sq-result', 'Enter a non-negative number.', true);
  showResult('sq-result', `&radic;${fmt(x)} = <strong>${fmt(Math.sqrt(x))}</strong>`);
}

/* ---- Gravitational force ---- */
function calcGravForce() {
  const m1 = num('gf-m1'), m2 = num('gf-m2'), r = num('gf-r');
  if (!(m1 > 0) || !(m2 > 0) || !(r > 0)) return showResult('gf-result', 'Enter positive masses and separation.', true);
  const F = (G * m1 * m2) / (r * r);
  showResult('gf-result', `F = <strong>${fmt(F)} N</strong>`);
}

/* ---- Specific heat ---- */
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

/* ---- Latent heat ---- */
function calcLatentHeat() {
  const m = num('lh-m'), L = num('lh-l');
  if (!(m > 0) || !(L > 0)) return showResult('lh-result', 'Enter a positive mass and latent heat.', true);
  showResult('lh-result', `Q = <strong>${fmt(m * L)} J</strong>`);
}

/* ---- Ideal gas SI ---- */
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

/* ---- Doppler (sound) ---- */
function calcDopplerGeneral() {
  const f = num('dp2-f'), v = num('dp2-v'), vo = num('dp2-vo') || 0, vs = num('dp2-vs') || 0;
  if (!(f > 0) || !(v > 0)) return showResult('dp2-result', 'Enter a positive frequency and wave speed.', true);
  const fPrime = f * ((v + vo) / (v - vs));
  showResult('dp2-result', `f' = <strong>${fmt(fPrime)} Hz</strong><br><span style="color:var(--text-dim); font-size:0.8rem;">Positive v\u2092/v\u209b = moving toward; negative = moving away.</span>`);
}

/* ---- Decibel ---- */
function calcDecibel() {
  const I0 = 1e-12;
  const I = num('db-i');
  if (!(I > 0)) return showResult('db-result', 'Enter a positive intensity in W/m\u00b2.', true);
  const beta = 10 * Math.log10(I / I0);
  showResult('db-result', `&beta; = <strong>${fmt(beta)} dB</strong>`);
}

/* ---- Lift ---- */
function calcLift() {
  const rho = num('lf-rho'), v = num('lf-v'), S = num('lf-s'), CL = num('lf-cl');
  if (!(rho > 0) || !(v >= 0) || !(S > 0) || isNaN(CL)) return showResult('lf-result', 'Enter positive density, airspeed, and wing area, plus a lift coefficient.', true);
  const L = 0.5 * rho * v * v * S * CL;
  showResult('lf-result', `Lift = <strong>${fmt(L)} N</strong> (${fmt(L / 9.8)} kg-force)`);
}

/* ---- Drag ---- */
function calcDrag() {
  const rho = num('dg-rho'), v = num('dg-v'), S = num('dg-s'), CD = num('dg-cd');
  if (!(rho > 0) || !(v >= 0) || !(S > 0) || isNaN(CD)) return showResult('dg-result', 'Enter positive density, airspeed, and wing area, plus a drag coefficient.', true);
  const D = 0.5 * rho * v * v * S * CD;
  showResult('dg-result', `Drag = <strong>${fmt(D)} N</strong>`);
}

/* ---- Stall speed ---- */
function calcStallSpeed() {
  const W = num('ss-w'), rho = num('ss-rho'), S = num('ss-s'), CLmax = num('ss-clmax');
  if (!(W > 0) || !(rho > 0) || !(S > 0) || !(CLmax > 0)) return showResult('ss-result', 'Enter positive weight, density, wing area, and max lift coefficient.', true);
  const vStall = Math.sqrt((2 * W) / (rho * S * CLmax));
  showResult('ss-result', `Stall speed = <strong>${fmt(vStall)} m/s</strong> (${fmt(vStall * 1.944)} kts, ${fmt(vStall * 3.6)} km/h)`);
}

/* ---- Mach number ---- */
function calcMach() {
  const v = num('mc-v'), T = num('mc-t');
  if (!(v >= 0) || !(T > 0)) return showResult('mc-result', 'Enter a non-negative speed and a positive temperature in Kelvin.', true);
  const a = Math.sqrt(1.4 * 287 * T);
  const M = v / a;
  showResult('mc-result', `Speed of sound = <strong>${fmt(a)} m/s</strong><br>Mach number = <strong>${fmt(M)}</strong>`);
}

/* ---- Reynolds number (prefix 'ren-' to avoid colliding with the Rocket Equation's 're-') ---- */
function calcReynolds() {
  const rho = num('ren-rho'), v = num('ren-v'), L = num('ren-l'), mu = num('ren-mu');
  if (!(rho > 0) || !(v >= 0) || !(L > 0) || !(mu > 0)) return showResult('ren-result', 'Enter positive density, velocity, length, and viscosity.', true);
  const Re = (rho * v * L) / mu;
  showResult('ren-result', `Re = <strong>${fmt(Re)}</strong> ${Re > 500000 ? '(likely turbulent)' : '(likely laminar)'}`);
}

/* ---- Glide ratio & sink rate ---- */
function calcGlide() {
  const LD = num('gl-ld'), v = num('gl-v');
  if (!(LD > 0) || !(v >= 0)) return showResult('gl-result', 'Enter a positive L/D ratio and airspeed.', true);
  const sinkRate = v / LD;
  showResult('gl-result', `Glide ratio = <strong>${fmt(LD)}:1</strong><br>Sink rate &asymp; <strong>${fmt(sinkRate)} m/s</strong> at that airspeed`);
}

/* ---- Load factor ---- */
function calcLoadFactor() {
  const bankDeg = num('nf-bank');
  if (isNaN(bankDeg) || bankDeg < 0 || bankDeg >= 90) return showResult('nf-result', 'Enter a bank angle between 0 and 89 degrees.', true);
  const n = 1 / Math.cos((bankDeg * Math.PI) / 180);
  showResult('nf-result', `Load factor = <strong>${fmt(n)} g</strong>`);
}

/* ---- Wing geometry ---- */
function calcWingGeometry() {
  const W = num('wg-w'), S = num('wg-s'), b = num('wg-b');
  if (!(W > 0) || !(S > 0) || !(b > 0)) return showResult('wg-result', 'Enter positive weight, wing area, and wingspan.', true);
  const wingLoading = W / S;
  const AR = (b * b) / S;
  showResult('wg-result', `Wing loading = <strong>${fmt(wingLoading)} N/m\u00b2</strong><br>Aspect ratio = <strong>${fmt(AR)}</strong>`);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ev-calc')?.addEventListener('click', calcEscapeVelocity);
  document.getElementById('op-calc')?.addEventListener('click', calcOrbitalPeriod);
  document.getElementById('pm-calc')?.addEventListener('click', calcProjectile);
  document.getElementById('ig-calc')?.addEventListener('click', calcIdealGas);
  document.getElementById('re-calc')?.addEventListener('click', calcRocket);
  document.getElementById('qf-calc')?.addEventListener('click', calcQuadratic);
  document.getElementById('tg-calc')?.addEventListener('click', calcTrig);
  document.getElementById('itg-calc')?.addEventListener('click', calcInverseTrig);
  document.getElementById('sq-calc')?.addEventListener('click', calcSquareRoot);
  document.getElementById('gf-calc')?.addEventListener('click', calcGravForce);
  document.getElementById('sh2-calc')?.addEventListener('click', calcSpecificHeatMixed);
  document.getElementById('lh-calc')?.addEventListener('click', calcLatentHeat);
  document.getElementById('ig2-calc')?.addEventListener('click', calcIdealGasSI);
  document.getElementById('dp2-calc')?.addEventListener('click', calcDopplerGeneral);
  document.getElementById('db-calc')?.addEventListener('click', calcDecibel);
  document.getElementById('lf-calc')?.addEventListener('click', calcLift);
  document.getElementById('dg-calc')?.addEventListener('click', calcDrag);
  document.getElementById('ss-calc')?.addEventListener('click', calcStallSpeed);
  document.getElementById('mc-calc')?.addEventListener('click', calcMach);
  document.getElementById('ren-calc')?.addEventListener('click', calcReynolds);
  document.getElementById('gl-calc')?.addEventListener('click', calcGlide);
  document.getElementById('nf-calc')?.addEventListener('click', calcLoadFactor);
  document.getElementById('wg-calc')?.addEventListener('click', calcWingGeometry);
});
