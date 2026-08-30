/* ==========================================================================
   News: short summaries only, never full articles. To update, edit
   /news/news-manifest.json - no code changes needed.
   ========================================================================== */

async function loadNews() {
  const grid = document.getElementById('news-grid');
  if (!grid) return;
  try {
    const res = await fetch('news/news-manifest.json');
    const items = await res.json();
    grid.innerHTML = items.map((n, i) => `
      <div class="card">
        <img id="news-img-${i}" alt="${n.title}" style="width:100%; aspect-ratio:16/9; object-fit:cover; background:var(--bg-panel); margin-bottom:14px;">
        <span class="cat-tag">${n.category}</span>
        <h3>${n.title}</h3>
        <p class="excerpt">${n.summary}</p>
        <div class="meta">
          <span>${new Date(n.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <a href="${n.link}" target="_blank" rel="noopener" class="btn btn-ghost" style="margin-top:14px;">Read more</a>
      </div>
    `).join('');

    items.forEach(async (n, i) => {
      if (!n.wikiImage) return;
      try {
        const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(n.wikiImage)}`);
        if (!r.ok) return;
        const data = await r.json();
        const url = data.thumbnail && data.thumbnail.source;
        const el = document.getElementById(`news-img-${i}`);
        if (url && el) el.src = url;
      } catch (e) { /* leave placeholder */ }
    });
  } catch (e) {
    grid.innerHTML = '<p style="color:var(--text-dim);">News couldn\u2019t be loaded right now.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadNews);
