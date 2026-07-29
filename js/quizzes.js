/* ==========================================================================
   Quizzes & Flashcards. Data lives in these two arrays - add more questions
   or cards here, no HTML changes needed.
   ========================================================================== */

const QUIZ_QUESTIONS = [
  {
    q: 'What is the SI unit of force?',
    options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    correct: 1,
    explain: 'A newton is defined as the force needed to accelerate 1 kg at 1 m/s\u00b2.',
  },
  {
    q: 'Which of these has the greatest mass?',
    options: ['An electron', 'A proton', 'A neutron', 'A neutrino'],
    correct: 2,
    explain: 'Neutrons are very slightly more massive than protons; both dwarf the electron and neutrino.',
  },
  {
    q: 'What does E = mc\u00b2 actually say?',
    options: [
      'Energy causes mass',
      'Mass and energy are equivalent, related by the speed of light squared',
      'Light has infinite energy',
      'Mass increases with speed',
    ],
    correct: 1,
    explain: 'Mass and energy are two forms of the same thing - a small amount of mass corresponds to an enormous amount of energy.',
  },
];

function renderQuiz() {
  const container = document.getElementById('quiz-container');
  if (!container) return;
  container.innerHTML = QUIZ_QUESTIONS.map((item, qi) => `
    <div class="quiz-card">
      <h3>${qi + 1}. ${item.q}</h3>
      <div class="quiz-options" data-qi="${qi}">
        ${item.options.map((opt, oi) => `<button class="quiz-option" data-oi="${oi}">${opt}</button>`).join('')}
      </div>
      <div class="quiz-feedback" id="quiz-feedback-${qi}"></div>
    </div>
  `).join('');

  container.querySelectorAll('.quiz-options').forEach(group => {
    const qi = parseInt(group.dataset.qi);
    const item = QUIZ_QUESTIONS[qi];
    group.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const oi = parseInt(btn.dataset.oi);
        const feedback = document.getElementById(`quiz-feedback-${qi}`);
        group.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);
        if (oi === item.correct) {
          btn.classList.add('correct');
          feedback.innerHTML = `<span style="color:#6fbf73;">Correct.</span> ${item.explain}`;
        } else {
          btn.classList.add('incorrect');
          group.children[item.correct].classList.add('correct');
          feedback.innerHTML = `<span style="color:#d3695f;">Not quite.</span> ${item.explain}`;
        }
      });
    });
  });
}

const FLASHCARDS = [
  { front: 'What is Newton\u2019s First Law?', back: 'An object at rest stays at rest, and an object in motion stays in motion, unless acted on by a net external force.' },
  { front: 'What is the speed of light in a vacuum?', back: '299,792,458 m/s (often rounded to 3 \u00d7 10\u2078 m/s).' },
  { front: 'What is entropy, in one line?', back: 'A measure of the number of ways a system\u2019s particles can be arranged while looking the same at the macroscopic level.' },
  { front: 'What does a negative slope mean on a velocity-time graph?', back: 'The object is decelerating (if moving forward) or accelerating in the negative direction.' },
];

function renderFlashcards() {
  const container = document.getElementById('flashcard-deck');
  if (!container) return;
  container.innerHTML = FLASHCARDS.map((c, i) => `
    <div class="flashcard" data-i="${i}">
      <div class="flashcard-inner">
        <div class="flashcard-face front"><p>${c.front}</p></div>
        <div class="flashcard-face back"><p>${c.back}</p></div>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('.flashcard').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderQuiz();
  renderFlashcards();
});
