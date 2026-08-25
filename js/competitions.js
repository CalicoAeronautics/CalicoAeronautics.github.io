/* ==========================================================================
   Competitions: fetches a real photo for each competition/organization card
   live from Wikipedia.
   ========================================================================== */

const COMPETITION_IMAGES = {
  'comp-aiaa': 'American Institute of Aeronautics and Astronautics',
  'comp-nasa': 'NASA',
};

document.addEventListener('DOMContentLoaded', () => {
  Object.entries(COMPETITION_IMAGES).forEach(async ([elId, wikiTitle]) => {
    const el = document.getElementById(elId);
    if (!el) return;
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`);
      if (!res.ok) return;
      const data = await res.json();
      const url = data.thumbnail && data.thumbnail.source;
      if (url) el.src = url;
    } catch (e) { /* leave placeholder */ }
  });
});
