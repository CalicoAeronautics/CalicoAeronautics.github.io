/* ==========================================================================
   Tiny sounds: a very soft synthesized click on buttons/links/tags.
   No audio files needed - generated with the Web Audio API.
   Off by default; toggled from the nav, persisted in localStorage.
   ========================================================================== */

let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playClick() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 720;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) { /* audio not available - fail silently */ }
}

function soundsEnabled() {
  return localStorage.getItem('calico-sound') === 'on';
}

function updateSoundToggleLabel() {
  const btn = document.getElementById('sound-toggle');
  if (btn) btn.textContent = soundsEnabled() ? '\uD83D\uDD0A' : '\uD83D\uDD07';
}

document.addEventListener('DOMContentLoaded', () => {
  updateSoundToggleLabel();

  document.addEventListener('click', (e) => {
    if (e.target.id === 'sound-toggle') {
      const next = soundsEnabled() ? 'off' : 'on';
      localStorage.setItem('calico-sound', next);
      updateSoundToggleLabel();
      if (next === 'on') playClick();
      return;
    }
    if (!soundsEnabled()) return;
    if (e.target.closest('.btn, .card, .tag-pill, .nav-links a, .planet-btn, .map-pin')) {
      playClick();
    }
  });
});
