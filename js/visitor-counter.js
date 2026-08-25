/* ==========================================================================
   Visitor counter: a classic nostalgic touch. Increments a number stored
   in localStorage each time the page loads, purely for fun.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('visitor-count');
  if (!el) return;
  let count = parseInt(localStorage.getItem('calico-visitor-count') || '4213', 10);
  count += 1;
  localStorage.setItem('calico-visitor-count', count);
  el.textContent = String(count).padStart(6, '0');
});
