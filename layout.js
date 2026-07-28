/* ==========================================================================
   Shared header/footer injection so every page stays in sync from one file.
   Also owns: theme switching (persisted), mobile nav toggle, active-link
   highlighting, and the "More" dropdown.
   ========================================================================== */

const CAT_MARK_SVG = `
<svg class="brand-mark" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 16 L14 6 L19 15 Z" fill="var(--charcoal)"/>
  <path d="M38 16 L34 6 L29 15 Z" fill="var(--amber)"/>
  <ellipse cx="24" cy="26" rx="16" ry="14" fill="var(--cream)"/>
  <path d="M9 22a15 14 0 0 1 8-10 10 8 0 0 0-3 10z" fill="var(--amber)"/>
  <path d="M39 24a15 14 0 0 0-7-11 10 9 0 0 1 2 11z" fill="var(--charcoal)"/>
  <circle cx="18" cy="25" r="2.4" fill="var(--void)"/>
  <circle cx="30" cy="25" r="2.4" fill="var(--void)"/>
  <path d="M22 30q2 2 4 0" stroke="var(--void)" stroke-width="1.4" fill="none" stroke-linecap="round"/>
</svg>`;

const NAV_PRIMARY = [
  { href: 'index.html', label: 'Home' },
  { href: 'articles.html', label: 'Articles' },
  { href: 'olympiad.html', label: 'Olympiad Hub' },
  { href: 'space-explorer.html', label: 'Space Explorer' },
  { href: 'resources.html', label: 'Resources' },
  { href: 'about.html', label: 'About' },
];

const NAV_MORE = [
  { href: 'problem-of-week.html', label: 'Problem of the Week' },
  { href: 'news.html', label: 'News' },
  { href: 'calculators.html', label: 'Calculators' },
  { href: 'formulas.html', label: 'Formula Library' },
  { href: 'simulations.html', label: 'Simulations' },
  { href: 'timeline.html', label: 'Timeline' },
  { href: 'map.html', label: 'Discovery Map' },
  { href: 'scientists.html', label: 'Great Scientists' },
  { href: 'iphyc.html', label: 'IPhyC' },
  { href: 'contact.html', label: 'Contact' },
];

const THEMES = [
  { id: 'dark-space', label: 'Dark Space' },
  { id: 'nebula-blue', label: 'Nebula Blue' },
  { id: 'deep-purple', label: 'Deep Purple' },
  { id: 'solar-gold', label: 'Solar Gold' },
];

function currentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return path;
}

function renderHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  const page = currentPage();

  const primaryLinks = NAV_PRIMARY.map(l =>
    `<a href="${l.href}" class="${l.href === page ? 'active' : ''}">${l.label}</a>`
  ).join('');

  const moreLinks = NAV_MORE.map(l =>
    `<a href="${l.href}" class="${l.href === page ? 'active' : ''}">${l.label}</a>`
  ).join('');

  el.innerHTML = `
    <div class="container nav-inner">
      <a href="index.html" class="brand">${CAT_MARK_SVG}<span>Calico Physics</span></a>
      <nav class="nav-links" id="nav-links">
        ${primaryLinks}
        <div class="nav-item-more" id="more-toggle">
          <a href="#" id="more-trigger">More &#9662;</a>
          <div class="more-menu">${moreLinks}</div>
        </div>
      </nav>
      <div class="nav-controls">
        <select id="theme-toggle" aria-label="Theme">
          ${THEMES.map(t => `<option value="${t.id}">${t.label}</option>`).join('')}
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
  const savedTheme = localStorage.getItem('calico-theme') || 'dark-space';
  themeSelect.value = savedTheme;
  applyTheme(savedTheme);
  themeSelect.addEventListener('change', (e) => {
    applyTheme(e.target.value);
    localStorage.setItem('calico-theme', e.target.value);
  });
}

function applyTheme(id) {
  if (id === 'dark-space') {
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
        <div class="brand" style="margin-bottom:10px;">${CAT_MARK_SVG}<span>Calico Physics</span></div>
        <p>Physics and mathematics explained the way a curious cat would explore them - patiently, playfully, one idea at a time.</p>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h4>Learn</h4>
          <a href="articles.html">Articles</a>
          <a href="formulas.html">Formula Library</a>
          <a href="calculators.html">Calculators</a>
          <a href="simulations.html">Simulations</a>
          <a href="timeline.html">Timeline</a>
          <a href="scientists.html">Great Scientists</a>
        </div>
        <div class="footer-col">
          <h4>Explore</h4>
          <a href="space-explorer.html">Space Explorer</a>
          <a href="news.html">News</a>
          <a href="map.html">Discovery Map</a>
          <a href="resources.html">Resources</a>
        </div>
        <div class="footer-col">
          <h4>Compete</h4>
          <a href="olympiad.html">Olympiad Hub</a>
          <a href="problem-of-week.html">Problem of the Week</a>
          <a href="iphyc.html">IPhyC</a>
        </div>
        <div class="footer-col">
          <h4>Connect</h4>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
        </div>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>&copy; ${new Date().getFullYear()} Calico Physics</span>
      <span>Built with curiosity, not textbooks.</span>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
});
