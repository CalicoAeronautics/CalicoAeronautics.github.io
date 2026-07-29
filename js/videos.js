/* ==========================================================================
   Video Lessons: reads /videos/videos-manifest.json. Leave videoId empty and it
   shows a clean placeholder instead of a broken embed - fill in a real
   YouTube video ID (the part after "v=" in the URL) to make it go live.
   ========================================================================== */

async function loadVideos() {
  const grid = document.getElementById('video-grid');
  if (!grid) return;
  try {
    const res = await fetch('videos/videos-manifest.json');
    const videos = await res.json();
    grid.innerHTML = videos.map(v => `
      <div class="card">
        <span class="cat-tag">${v.topic}</span>
        <h3>${v.title}</h3>
        ${v.videoId
          ? `<div style="aspect-ratio:16/9; margin-top:12px;">
               <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${v.videoId}"
                 title="${v.title}" frameborder="0"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 allowfullscreen style="border-radius: var(--radius-sm);"></iframe>
             </div>`
          : `<div class="placeholder-block" style="padding:24px; margin-top:12px;">
               <p style="margin:0; font-size:0.85rem;">No video linked yet - add a YouTube video ID to this entry in videos/videos-manifest.json.</p>
             </div>`}
      </div>
    `).join('');
  } catch (e) {
    grid.innerHTML = '<p style="color:var(--cream-dim);">Videos couldn\u2019t be loaded right now.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadVideos);
