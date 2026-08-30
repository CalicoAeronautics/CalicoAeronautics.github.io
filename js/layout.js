/* ==========================================================================
   Shared header/footer injection so every page stays in sync from one file.
   Also owns: theme switching, sound toggle wiring, language switching,
   mobile nav toggle, active-link highlighting, and the "More" dropdown.

   Translation lookup uses a global t(key) function defined in js/i18n.js
   (loaded on every page). If i18n.js isn't present for some reason, this
   file still works fine and just shows the English defaults below.
   ========================================================================== */

const CAT_MARK_SVG = `
<svg class="brand-mark" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 16 L14 6 L19 15 Z" fill="var(--bg-panel)"/>
  <path d="M38 16 L34 6 L29 15 Z" fill="var(--accent)"/>
  <ellipse cx="24" cy="26" rx="16" ry="14" fill="var(--text)"/>
  <path d="M9 22a15 14 0 0 1 8-10 10 8 0 0 0-3 10z" fill="var(--accent)"/>
  <path d="M39 24a15 14 0 0 0-7-11 10 9 0 0 1 2 11z" fill="var(--bg-panel)"/>
  <circle cx="18" cy="25" r="2.4" fill="var(--bg)"/>
  <circle cx="30" cy="25" r="2.4" fill="var(--bg)"/>
  <path d="M22 30q2 2 4 0" stroke="var(--bg)" stroke-width="1.4" fill="none" stroke-linecap="round"/>
</svg>`;

const NAV_PRIMARY = [
  { href: 'index.html', key: 'home', label: 'Home' },
  { href: 'news.html', key: 'news', label: 'News' },
  { href: 'competitions.html', key: 'competitions', label: 'Competitions' },
  { href: 'iconic-aircraft.html', key: 'iconicAircraft', label: 'Iconic Aircraft' },
  { href: 'resources.html', key: 'resources', label: 'Resources' },
  { href: 'about.html', key: 'about', label: 'About' },
];

const NAV_MORE = [
  { href: 'calculators.html', key: 'calculators', label: 'Calculators' },
  { href: 'formulas.html', key: 'formulas', label: 'Formula Library' },
  { href: 'simulations.html', key: 'simulations', label: 'Simulations' },
  { href: 'timeline.html', key: 'timeline', label: 'History of Aeronautics' },
  { href: 'map.html', key: 'map', label: 'Aviation Map' },
  { href: 'scientists.html', key: 'scientists', label: 'Aviation Pioneers' },
  { href: 'periodic-table.html', key: 'periodicTable', label: 'Periodic Table' },
  { href: 'si-units.html', key: 'siUnits', label: 'SI Units' },
  { href: 'quizzes.html', key: 'quizzes', label: 'Quizzes & Flashcards' },
  { href: 'astronomy-tools.html', key: 'astroTools', label: 'Astronomy Tools' },
  { href: 'aircraft-anatomy.html', key: 'aircraftAnatomy', label: 'Aircraft Anatomy' },
  { href: 'aircraft-database.html', key: 'aircraftDb', label: 'Aircraft Database' },
  { href: 'iphyc.html', key: 'iphyc', label: 'IPhyC' },
  { href: 'socials.html', key: 'socials', label: 'Socials' },
];

const THEMES = [
  { id: 'night', label: 'Night' },
  { id: 'day', label: 'Day' },
];

const LANGUAGES = [
  { id: 'en', label: 'EN' },
  { id: 'tr', label: 'TR' },
  { id: 'fr', label: 'FR' },
];

function tr(key, fallback) {
  // wraps the global t() from i18n.js if available, else falls back to English
  if (typeof t === 'function') {
    const val = t(key);
    if (val) return val;
  }
  return fallback;
}

function currentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return path;
}

function renderHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  const page = currentPage();

  const primaryLinks = NAV_PRIMARY.map(l =>
    `<a href="${l.href}" class="${l.href === page ? 'active' : ''}">${tr('nav.' + l.key, l.label)}</a>`
  ).join('');

  const moreLinks = NAV_MORE.map(l =>
    `<a href="${l.href}" class="${l.href === page ? 'active' : ''}">${tr('nav.' + l.key, l.label)}</a>`
  ).join('');

  el.innerHTML = `
    <div class="container nav-inner">
      <a href="index.html" class="brand">${CAT_MARK_SVG}<span>Calico Aeronautics</span></a>
      <nav class="nav-links" id="nav-links">
        ${primaryLinks}
        <div class="nav-item-more" id="more-toggle">
          <a href="#" id="more-trigger">${tr('nav.more', 'More')} &#9662;</a>
          <div class="more-menu">${moreLinks}</div>
        </div>
      </nav>
      <div class="nav-controls">
        <select id="lang-toggle" aria-label="Language">
          ${LANGUAGES.map(l => `<option value="${l.id}">${l.label}</option>`).join('')}
        </select>
        <select id="theme-toggle" aria-label="Theme">
          ${THEMES.map(th => `<option value="${th.id}">${th.label}</option>`).join('')}
        </select>
        <button id="nav-toggle" aria-label="Toggle menu">&#9776;</button>
      </div>
    </div>
  `;

  document.getElementById('nav-toggle').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('open');
  });

  const moreToggle = document.getElementById('more-toggle');
  document.getElementById('more-trigger').addEventListener('click', (e) => {
    e.preventDefault();
    moreToggle.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!moreToggle.contains(e.target)) moreToggle.classList.remove('open');
  });

  const themeSelect = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('calico-theme') || 'night';
  themeSelect.value = savedTheme;
  applyTheme(savedTheme);
  themeSelect.addEventListener('change', (e) => {
    applyTheme(e.target.value);
    localStorage.setItem('calico-theme', e.target.value);
  });

  const langSelect = document.getElementById('lang-toggle');
  const savedLang = localStorage.getItem('calico-lang') || 'en';
  langSelect.value = savedLang;
  document.documentElement.lang = savedLang;
  langSelect.addEventListener('change', (e) => {
    localStorage.setItem('calico-lang', e.target.value);
    document.documentElement.lang = e.target.value;
    renderHeader();
    renderFooter();
    if (typeof applyPageTranslations === 'function') applyPageTranslations();
  });
}

function applyTheme(id) {
  if (id === 'night') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', id);
  }
}

function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
    <div class="container footer-inner">
      <div class="footer-brand">
        <div class="brand" style="margin-bottom:10px;">${CAT_MARK_SVG}<span>Calico Aeronautics</span></div>
        <p>${tr('footer.tagline', 'Just a calico cat explaining flying things.')}</p>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h4>${tr('footer.learn', 'Learn')}</h4>
          <a href="formulas.html">${tr('nav.formulas', 'Formula Library')}</a>
          <a href="calculators.html">${tr('nav.calculators', 'Calculators')}</a>
          <a href="simulations.html">${tr('nav.simulations', 'Simulations')}</a>
          <a href="timeline.html">${tr('nav.timeline', 'History of Aeronautics')}</a>
          <a href="scientists.html">${tr('nav.scientists', 'Aviation Pioneers')}</a>
          <a href="aircraft-anatomy.html">${tr('nav.aircraftAnatomy', 'Aircraft Anatomy')}</a>
        </div>
        <div class="footer-col">
          <h4>${tr('footer.explore', 'Explore')}</h4>
          <a href="iconic-aircraft.html">${tr('nav.iconicAircraft', 'Iconic Aircraft')}</a>
          <a href="aircraft-database.html">${tr('nav.aircraftDb', 'Aircraft Database')}</a>
          <a href="news.html">${tr('nav.news', 'News')}</a>
          <a href="map.html">${tr('nav.map', 'Aviation Map')}</a>
          <a href="resources.html">${tr('nav.resources', 'Resources')}</a>
        </div>
        <div class="footer-col">
          <h4>${tr('footer.compete', 'Compete')}</h4>
          <a href="competitions.html">${tr('nav.competitions', 'Competitions')}</a>
          <a href="iphyc.html">${tr('nav.iphyc', 'IPhyC')}</a>
        </div>
        <div class="footer-col">
          <h4>${tr('footer.connect', 'Connect')}</h4>
          <a href="about.html">${tr('nav.about', 'About')}</a>
          <a href="socials.html">${tr('nav.socials', 'Socials')}</a>
        </div>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>&copy; ${new Date().getFullYear()} Calico Aeronautics</span>
      <span>${tr('footer.builtWith', 'Built with curiosity, not textbooks.')}</span>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  if (typeof applyPageTranslations === 'function') applyPageTranslations();
});
