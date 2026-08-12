/* ==========================================================================
   Articles are plain Markdown files. To publish: drop a .md file in
   /articles, add one entry to /articles/articles-manifest.json, push to GitHub.
   No build step, no CMS.
   ========================================================================== */

let ALL_ARTICLES = [];
let activeTag = null;

async function loadManifest() {
  const res = await fetch('articles/articles-manifest.json');
  ALL_ARTICLES = await res.json();
  return ALL_ARTICLES;
}

function cardTemplate(a, idx) {
  return `
    <a class="card" href="article.html?slug=${a.slug}" style="display:block;">
      <img id="article-img-${idx}" alt="${a.title}" style="width:100%; aspect-ratio:16/9; object-fit:cover; background:var(--void-soft); margin-bottom:14px;">
      <span class="cat-tag">${a.category}</span>
      <h3>${a.title}</h3>
      <p class="excerpt">${a.excerpt}</p>
      <div class="meta">
        <span>${a.readTime} min read</span>
        <span>${new Date(a.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
      </div>
      <div style="margin-top:12px;">
        ${a.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
      </div>
    </a>
  `;
}

async function loadArticleImages(list) {
  list.forEach(async (a, i) => {
    if (!a.wikiImage) return;
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(a.wikiImage)}`);
      if (!res.ok) return;
      const data = await res.json();
      const url = data.thumbnail && data.thumbnail.source;
      const el = document.getElementById(`article-img-${i}`);
      if (url && el) el.src = url;
    } catch (e) { /* leave placeholder background if it fails */ }
  });
}

function renderArticleList() {
  const grid = document.getElementById('articles-grid');
  const searchInput = document.getElementById('article-search');
  if (!grid) return;

  const query = (searchInput?.value || '').toLowerCase().trim();

  const filtered = ALL_ARTICLES.filter(a => {
    const matchesQuery = !query ||
      a.title.toLowerCase().includes(query) ||
      a.excerpt.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query) ||
      a.tags.some(t => t.toLowerCase().includes(query));
    const matchesTag = !activeTag || a.tags.includes(activeTag);
    return matchesQuery && matchesTag;
  });

  grid.innerHTML = filtered.length
    ? filtered.map(cardTemplate).join('')
    : `<p style="color:var(--cream-dim);">No articles match yet - try a different search or tag.</p>`;

  loadArticleImages(filtered);
}

function renderTagCloud() {
  const el = document.getElementById('tag-cloud');
  if (!el) return;
  const tags = [...new Set(ALL_ARTICLES.flatMap(a => a.tags))].sort();
  el.innerHTML = tags.map(t =>
    `<span class="tag-pill" data-tag="${t}">${t}</span>`
  ).join('');
  el.querySelectorAll('.tag-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const tag = pill.dataset.tag;
      activeTag = activeTag === tag ? null : tag;
      el.querySelectorAll('.tag-pill').forEach(p =>
        p.classList.toggle('active', p.dataset.tag === activeTag)
      );
      renderArticleList();
    });
  });
}

async function initArticlesPage() {
  await loadManifest();
  renderTagCloud();
  renderArticleList();
  document.getElementById('article-search')?.addEventListener('input', renderArticleList);
}

async function initSingleArticlePage() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const container = document.getElementById('article-content');
  if (!container) return;

  await loadManifest();
  const meta = ALL_ARTICLES.find(a => a.slug === slug);
  if (!meta) {
    container.innerHTML = `<p>Article not found. <a href="articles.html">Back to Articles</a></p>`;
    return;
  }

  document.title = `${meta.title} - Calico Aeronautics`;

  const heroImg = document.getElementById('article-hero-img');
  if (heroImg && meta.wikiImage) {
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(meta.wikiImage)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        const url = data && data.thumbnail && data.thumbnail.source;
        if (url) heroImg.src = url;
        else heroImg.style.display = 'none';
      })
      .catch(() => { heroImg.style.display = 'none'; });
  } else if (heroImg) {
    heroImg.style.display = 'none';
  }

  const res = await fetch(meta.file);
  const md = await res.text();
  container.innerHTML = window.marked ? window.marked.parse(md) : `<pre>${md}</pre>`;

  const tagsEl = document.getElementById('article-tags');
  if (tagsEl) {
    tagsEl.innerHTML = meta.tags.map(t => `<span class="tag-pill">${t}</span>`).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('articles-grid')) initArticlesPage();
  if (document.getElementById('article-content')) initSingleArticlePage();
});
