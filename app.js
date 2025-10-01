let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;

async function fetchQuestions() {
  const url = "https://opentdb.com/api.php?amount=5&type=multiple";
  const res = await fetch(url);
  const data = await res.json();
  questions = data.results.map(q => {
    const allOptions = [...q.incorrect_answers, q.correct_answer];
    return {
      question: q.question,
      options: shuffle(allOptions),
      correct: q.correct_answer
    };
  });
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startQuiz() {
  document.getElementById("quiz").classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");
  score = 0;
  currentQuestionIndex = 0;
  fetchQuestions().then(() => {
    showQuestion();
  });
}

function showQuestion() {
  clearInterval(timer);
  timeLeft = 30;
  document.getElementById("timer").textContent = timeLeft;
  timer = setInterval(updateTimer, 1000);

  const q = questions[currentQuestionIndex];
  document.getElementById("question").innerHTML = q.question;
  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("next-btn").disabled = true;

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.innerHTML = option;
    btn.onclick = () => selectAnswer(btn, q.correct);
    optionsContainer.appendChild(btn);
  });
}

function selectAnswer(btn, correct) {
  clearInterval(timer);
  const options = document.querySelectorAll(".option-btn");
  options.forEach(b => {
    b.disabled = true;
    if (b.innerHTML === correct) {
      b.classList.add("correct");
    }
  });

  if (btn.innerHTML === correct) {
    score++;
    document.getElementById("feedback").textContent = "✅ Correct!";
  } else {
    btn.classList.add("wrong");
    document.getElementById("feedback").textContent = "❌ Wrong!";
  }

  document.getElementById("next-btn").disabled = false;
}

function updateTimer() {
  timeLeft--;
  document.getElementById("timer").textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    document.getElementById("feedback").textContent = "⏰ Time's up!";
    document.querySelectorAll(".option-btn").forEach(b => b.disabled = true);
    document.getElementById("next-btn").disabled = false;
  }
}

document.getElementById("next-btn").addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("score").textContent = `${score}/${questions.length}`;
}
startQuiz();
