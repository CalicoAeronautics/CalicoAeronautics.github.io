/* ==========================================================================
   Astronomy Tools: calculators specific to astrophysics, complementing the
   general physics calculators on the Calculators page.
   ========================================================================== */

const C_LIGHT = 299792458;
const LY_IN_M = 9.4607e15;
const AU_IN_M = 1.496e11;
const PARSEC_IN_LY = 3.26156;

function bindSlider2(id, onChange) {
  const el = document.getElementById(id);
  if (!el) return;
  const labelVal = document.getElementById(id + '-val');
  const update = () => { if (labelVal) labelVal.textContent = el.value; onChange(parseFloat(el.value)); };
  el.addEventListener('input', update);
  update();
}
function num2(id) { return parseFloat(document.getElementById(id).value); }
function show2(id, html, isError) {
  const box = document.getElementById(id);
  box.innerHTML = html;
  box.classList.add('shown');
  box.classList.toggle('result-error', !!isError);
}
function fmt2(x) {
  if (!isFinite(x)) return 'undefined';
  if (Math.abs(x) >= 1e5 || (Math.abs(x) < 1e-3 && x !== 0)) return x.toExponential(3);
  return Number(x.toPrecision(5)).toString();
}

/* ---- Light-Year Converter ---- */
function calcLightYear() {
  const value = num2('ly-value');
  const unit = document.getElementById('ly-unit').value;
  if (isNaN(value) || value < 0) return show2('ly-result', 'Enter a non-negative distance.', true);
  let meters;
  if (unit === 'ly') meters = value * LY_IN_M;
  else if (unit === 'au') meters = value * AU_IN_M;
  else if (unit === 'pc') meters = value * PARSEC_IN_LY * LY_IN_M;
  else meters = value * 1000;
  show2('ly-result',
    `${fmt2(meters)} m<br>${fmt2(meters / LY_IN_M)} light-years<br>${fmt2(meters / AU_IN_M)} AU<br>${fmt2(meters / (PARSEC_IN_LY * LY_IN_M))} parsecs`
  );
}

/* ---- Redshift Calculator ---- */
function calcRedshift() {
  const lambdaEmit = num2('rs-emit');
  const lambdaObs = num2('rs-obs');
  if (!(lambdaEmit > 0) || !(lambdaObs > 0)) return show2('rs-result', 'Enter positive wavelengths.', true);
  const z = (lambdaObs - lambdaEmit) / lambdaEmit;
  const v = z * C_LIGHT;
  show2('rs-result', `z = <strong>${fmt2(z)}</strong><br>Recession velocity &asymp; <strong>${fmt2(v / 1000)} km/s</strong> (for z &lt;&lt; 1)`);
}

/* ---- Telescope Magnification ---- */
function calcTelescopeMag() {
  const fScope = num2('tm-focal-scope');
  const fEyepiece = num2('tm-focal-eyepiece');
  if (!(fScope > 0) || !(fEyepiece > 0)) return show2('tm-result', 'Enter positive focal lengths.', true);
  show2('tm-result', `Magnification = <strong>${fmt2(fScope / fEyepiece)}&times;</strong>`);
}

/* ---- Angular Size Calculator ---- */
function calcAngularSize() {
  const diameter = num2('as-diameter');
  const distance = num2('as-distance');
  if (!(diameter > 0) || !(distance > 0)) return show2('as-result', 'Enter a positive diameter and distance (same units).', true);
  const angleRad = 2 * Math.atan(diameter / (2 * distance));
  const angleDeg = (angleRad * 180) / Math.PI;
  const angleArcmin = angleDeg * 60;
  show2('as-result', `Angular size = <strong>${fmt2(angleDeg)}&deg;</strong> (${fmt2(angleArcmin)} arcmin)`);
}

/* ---- Star Distance via Parallax ---- */
function calcParallaxDistance() {
  const parallaxArcsec = num2('pd-parallax');
  if (!(parallaxArcsec > 0)) return show2('pd-result', 'Enter a positive parallax angle in arcseconds.', true);
  const distancePc = 1 / parallaxArcsec;
  show2('pd-result', `Distance = <strong>${fmt2(distancePc)} parsecs</strong> (${fmt2(distancePc * PARSEC_IN_LY)} light-years)`);
}

/* ---- Planet Weight Calculator ---- */
const PLANET_GRAVITY = {
  mercury: 3.7, venus: 8.87, earth: 9.8, mars: 3.71,
  jupiter: 24.79, saturn: 10.44, uranus: 8.69, neptune: 11.15, moon: 1.62,
};
function calcPlanetWeight() {
  const massKg = num2('pw-mass');
  const body = document.getElementById('pw-body').value;
  if (!(massKg > 0)) return show2('pw-result', 'Enter a positive mass in kg.', true);
  const gEarth = 9.8;
  const weightEarth = massKg * gEarth;
  const weightOther = massKg * PLANET_GRAVITY[body];
  show2('pw-result', `Weight on Earth: <strong>${fmt2(weightEarth)} N</strong><br>Weight on ${body[0].toUpperCase() + body.slice(1)}: <strong>${fmt2(weightOther)} N</strong> (${fmt2(weightOther / weightEarth)}&times; Earth weight)`);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ly-calc')?.addEventListener('click', calcLightYear);
  document.getElementById('rs-calc')?.addEventListener('click', calcRedshift);
  document.getElementById('tm-calc')?.addEventListener('click', calcTelescopeMag);
  document.getElementById('as-calc')?.addEventListener('click', calcAngularSize);
  document.getElementById('pd-calc')?.addEventListener('click', calcParallaxDistance);
  document.getElementById('pw-calc')?.addEventListener('click', calcPlanetWeight);
});
