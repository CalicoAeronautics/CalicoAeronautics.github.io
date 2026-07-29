/* ==========================================================================
   Easter egg: the calico cat shows up uninvited. Sometimes it walks across
   the bottom of the screen, sometimes it just naps in a corner for a while.
   ========================================================================== */

const CAT_WALK_SVG = `
<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="30" cy="24" rx="20" ry="9" fill="var(--cream)"/>
  <path d="M12 20a10 8 0 0 1 6-9 7 6 0 0 0-2 9z" fill="var(--amber)"/>
  <path d="M48 22a12 9 0 0 0-6-11 7 6 0 0 1 2 11z" fill="var(--charcoal)"/>
  <path d="M6 18 L11 10 L15 18Z" fill="var(--charcoal)"/>
  <path d="M50 18 L46 9 L42 18Z" fill="var(--amber)"/>
  <circle cx="20" cy="21" r="1.6" fill="var(--void)"/>
  <circle cx="28" cy="21" r="1.6" fill="var(--void)"/>
  <path d="M50 24c6 0 10-6 10-6" stroke="var(--charcoal)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <rect x="10" y="30" width="3" height="8" rx="1.4" fill="var(--cream)"/>
  <rect x="20" y="31" width="3" height="7" rx="1.4" fill="var(--amber)"/>
  <rect x="34" y="31" width="3" height="7" rx="1.4" fill="var(--cream)"/>
  <rect x="44" y="30" width="3" height="8" rx="1.4" fill="var(--charcoal)"/>
</svg>`;

const CAT_NAP_SVG = `
<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="28" rx="26" ry="10" fill="var(--cream)"/>
  <path d="M14 26a10 8 0 0 1 5-10 7 6 0 0 0-1 10z" fill="var(--amber)"/>
  <path d="M50 27a12 9 0 0 0-6-12 7 6 0 0 1 2 12z" fill="var(--charcoal)"/>
  <path d="M20 26q3 3 6 0" stroke="var(--void)" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <path d="M54 26c5-1 7-6 7-6" stroke="var(--charcoal)" stroke-width="2.2" fill="none" stroke-linecap="round"/>
</svg>`;

function spawnWalkingCat() {
  const cat = document.createElement('div');
  cat.id = 'wandering-cat';
  cat.innerHTML = CAT_WALK_SVG;
  document.body.appendChild(cat);
  const duration = 14 + Math.random() * 10;
  cat.style.animationDuration = `${duration}s`;
  cat.classList.add('walking');
  setTimeout(() => cat.remove(), duration * 1000 + 200);
}

function spawnNappingCat() {
  const cat = document.createElement('div');
  cat.id = 'wandering-cat';
  cat.style.left = 'auto';
  const corners = [
    { right: '24px', bottom: '24px' },
    { left: '24px', bottom: '24px' },
  ];
  const c = corners[Math.floor(Math.random() * corners.length)];
  Object.assign(cat.style, c, { opacity: 1, position: 'fixed', zIndex: 50 });
  cat.innerHTML = CAT_NAP_SVG;
  document.body.appendChild(cat);
  const stay = 8000 + Math.random() * 6000;
  setTimeout(() => cat.remove(), stay);
}

function scheduleCatAppearance() {
  const delay = 20000 + Math.random() * 30000; // every ~20-50s
  setTimeout(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (Math.random() < 0.5 || reduceMotion) {
      spawnNappingCat();
    } else {
      spawnWalkingCat();
    }
    scheduleCatAppearance();
  }, delay);
}

document.addEventListener('DOMContentLoaded', scheduleCatAppearance);
