/* ==========================================================================
   Countdown to the next competition. Change TARGET_DATE below to whatever
   date is actually next - it's the one thing in this file you need to edit.
   ========================================================================== */

const TARGET_DATE = new Date('2027-04-15T09:00:00');

function updateCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  const now = new Date();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    el.innerHTML = '<p style="color:var(--text-dim);">The countdown has ended - update TARGET_DATE in js/countdown.js with the next date.</p>';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  el.innerHTML = `
    <div class="unit"><span class="num">${days}</span><span class="lbl">Days</span></div>
    <div class="unit"><span class="num">${hours}</span><span class="lbl">Hours</span></div>
    <div class="unit"><span class="num">${mins}</span><span class="lbl">Min</span></div>
    <div class="unit"><span class="num">${secs}</span><span class="lbl">Sec</span></div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  setInterval(updateCountdown, 1000);
});
