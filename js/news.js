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
    grid.innerHTML = items.map(n => `
      <div class="card">
        <span class="cat-tag">${n.category}</span>
        <h3>${n.title}</h3>
        <p class="excerpt">${n.summary}</p>
        <div class="meta">
          <span>${new Date(n.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <a href="${n.link}" target="_blank" rel="noopener" class="btn btn-ghost" style="margin-top:14px;">Read more</a>
      </div>
    `).join('');
  } catch (e) {
    grid.innerHTML = '<p style="color:var(--cream-dim);">News couldn\u2019t be loaded right now.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadNews);
