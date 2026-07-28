/* ==========================================================================
   Timeline: each .timeline-item fades/slides in the first time it enters
   the viewport. Respects prefers-reduced-motion (shows everything at once).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.timeline-item');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(i => i.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

  items.forEach(i => observer.observe(i));
});
