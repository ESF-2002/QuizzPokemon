document.addEventListener('deviceready', onDeviceReady, false);

let currentQuestion = 0;
let score = 0;
let correctName = "";
let startTime;
let elapsedTimeInterval;

function onDeviceReady() {
  startTime = Date.now();
  loadNextQuestion();
  document.getElementById('submitAnswer').addEventListener('click', checkAnswer);

  // Timer live
  elapsedTimeInterval = setInterval(updateElapsedTime, 1000);
}

function updateElapsedTime() {
  const elapsed = Math.round((Date.now() - startTime) / 1000);
  document.getElementById('timer').textContent = `Temps écoulé : ${elapsed}s`;
}

function checkAnswer() {
  const answerInput = document.getElementById('answerInput');
  const submitBtn = document.getElementById('submitAnswer');
  const feedback = document.getElementById('feedback');

  const answer = answerInput.value.trim().toLowerCase();

  // Bloquer input et bouton
  answerInput.disabled = true;
  submitBtn.disabled = true;

  if (answer === correctName.toLowerCase()) {
    score++;
    feedback.textContent = "✅ Correct !";
    feedback.className = "feedback success";
  } else {
    feedback.textContent = `❌ Faux. La réponse était : ${correctName}`;
    feedback.className = "feedback error";
  }

  // Attendre 5 secondes avant de passer à la question suivante
  setTimeout(() => {
    feedback.textContent = "";
    answerInput.disabled = false;
    answerInput.value = "";
    submitBtn.disabled = false;

    currentQuestion++;
    if (currentQuestion < 10) {
      loadNextQuestion();
    } else {
      finishQuiz();
    }
  }, 5000); // 5 secondes
}

async function loadNextQuestion() {
  document.getElementById('questionCounter').textContent = `Question ${currentQuestion + 1}/10`;
  const id = Math.floor(Math.random() * 1025) + 1;
  try {
    const res = await fetch(`https://tyradex.vercel.app/api/v1/pokemon/${id}`);
    const data = await res.json();
    correctName = data.name.fr;

    const img = document.getElementById('pokemonImage');
    img.src = data.sprites.regular;
    img.style.filter = 'grayscale(100%)';
  } catch (err) {
    console.error("Erreur API Pokémon", err);
  }
}

function finishQuiz() {
  clearInterval(elapsedTimeInterval);
  const totalTime = Math.round((Date.now() - startTime) / 1000);

  // Stocker temporairement le score et le temps pour la page result.html
  localStorage.setItem('quizScore', score);
  localStorage.setItem('quizTime', totalTime);

  // Redirection vers la page résultat
  location.href = "result.html";
}
