document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-reveal-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.revealTarget);
      if (target) target.classList.toggle('shown');
    });
  });
});
