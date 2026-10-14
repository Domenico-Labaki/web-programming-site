// QUESTIONS
const questions = [
  {
    question: "Which company publishes the Need for Speed franchise?",
    choices: ["Ubisoft", "Electronic Arts", "Nintendo", "Activision"],
    answer: 1,
    explanation: "Electronic Arts (EA) publishes the Need for Speed franchise.",
  },
  {
    question: "In which year was the first Need for Speed game released?",
    choices: ["1990", "1998", "2001", "1994"],
    answer: 3,
    explanation: "The first game, The Need for Speed, was released in 1994.",
  },
  {
    question: "What is the main genre of the Need for Speed games?",
    choices: ["Racing", "Role-playing", "Platforming", "Strategy"],
    answer: 0,
    explanation: "Need for Speed is a racing franchise focused on driving cars.",
  },
  {
    question: "What does using nitrous typically do in a Need for Speed race?",
    choices: [
      "Repairs the car",
      "Changes the car's paint",
      "Provides a temporary speed boost",
      "Makes the car invisible",
    ],
    answer: 2,
    explanation: "Nitrous provides a temporary boost to help the car accelerate.",
  },
  {
    question: "Which Need for Speed game introduced the Underground subseries?",
    choices: [
      "Need for Speed: Carbon",
      "Need for Speed: Underground",
      "Need for Speed: ProStreet",
      "Need for Speed: The Run",
    ],
    answer: 1,
    explanation:
      "Need for Speed: Underground began the subseries in 2003, emphasizing street racing and car customization.",
  },
  {
    question: "In which fictional city is Need for Speed: Most Wanted (2005) set?",
    choices: ["Palm City", "Bayview", "Rockport", "Lakeshore"],
    answer: 2,
    explanation: "The 2005 version of Need for Speed: Most Wanted is set in Rockport.",
  },
  {
    question:
      "Which car is famous for its blue-and-silver livery in Need for Speed: Most Wanted (2005)?",
    choices: [
      "Nissan Skyline GT-R",
      "Toyota Supra",
      "Ford Mustang GT",
      "BMW M3 GTR",
    ],
    answer: 3,
    explanation:
      "The BMW M3 GTR with its blue-and-silver livery is an iconic car from Most Wanted (2005).",
  },
  {
    question: "Which type of race is a signature feature of Need for Speed: Carbon?",
    choices: ["Canyon races", "Boat races", "Kart races", "Off-road motorcycle races"],
    answer: 0,
    explanation:
      "Need for Speed: Carbon features canyon races on narrow, winding mountain roads.",
  },
  {
    question:
      "In Need for Speed: Hot Pursuit (2010), which two roles can players take?",
    choices: [
      "Mechanics and team managers",
      "Police officers and racers",
      "Pilots and passengers",
      "Taxi drivers and pedestrians",
    ],
    answer: 1,
    explanation:
      "Hot Pursuit (2010) lets players race as racers or chase them as police officers.",
  },
  {
    question: "In which fictional city is Need for Speed Heat set?",
    choices: ["Rockport", "Olympic City", "Palm City", "Bayview"],
    answer: 2,
    explanation:
      "Need for Speed Heat is set in Palm City, a fictional city inspired by Miami.",
  },
];


// APPLICATION STATE
let currentQuestion = 0;
const userAnswers = new Array(questions.length);


// SAVE AN ANSWER
function saveAnswer(choiceIndex) {
  //   Save the user's answer for the current question.
  userAnswers[currentQuestion] = choiceIndex;
}


// NAVIGATION
function goNext() {
  //   Move to the next question if not at the last question.
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  }
}

function goPrevious() {
  //   Move to the previous question if not at the first question.
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

function goFirst() {
  //   Move to the first question.
  currentQuestion = 0;
  renderQuestion();
}
function goLast() {
  //   Move to the last question.
  currentQuestion = questions.length - 1;
  renderQuestion();
}


// CALCULATE SCORE
function calculateScore() {
  //   Calculate the user's score based on their answers.
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].answer) {
      score++;
    }
  }
  return score;
}


// CALCULATE PERCENTAGE
function calculatePercentage(score) {
  //   Calculate the percentage score based on the total number of questions.
  const percentage = (score / questions.length) * 100;
  return Number(percentage.toFixed(0));
}


// PERFORMANCE MESSAGE
function getPerformanceMessage(percentage) {
  //   Return a performance message based on the percentage score.
  if (percentage >= 80) {
    return "Excellent";
  } else if (percentage >= 60) {
    return "Good";
  } else if (percentage >= 50) {
    return "Pass";
  } else {
    return "Needs improvement";
  }
}


// BUILD CORRECTION
function buildCorrection() {
  let correction = "";

  //   Build a correction string that includes the question, the user's answer,
  //   the correct answer, and an explanation for each question.

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    let userAnswer = "Not Answered";
    let result = "Incorrect";

    if (userAnswers[i] !== undefined) {
      userAnswer = q.choices[userAnswers[i]];
    }
    if (userAnswers[i] === q.answer) {
      result = "Correct";
    }

    correction += `Question ${i + 1}: ${q.question}\n\n`;
    correction += `Your answer: ${userAnswer}\n`;
    correction += `Correct answer: ${q.choices[q.answer]}\n`;
    correction += `Result: ${result}\n`;
    correction += `Explanation: ${q.explanation}\n\n`;
  }

  return correction;
}


// PROVIDED INTERFACE CODE
//
// DOM manipulation and events will be studied later.

// SUBMIT QUIZ
function submitQuiz() {
  const score = calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = buildCorrection();
  showResults(score, percentage, message, correction);
}

function renderQuestion() {
  const q = questions[currentQuestion];

  
  // QUESTION NUMBER
  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  
  // QUESTION
  document.getElementById("questionText").textContent = q.question;

  
  // CHOICES
  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  for (let i = 0; i < q.choices.length; i++) {
    const label = document.createElement("label");
    label.className = "choice";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = i;
    // Restore an answer previously selected
    // by the user.
    if (userAnswers[currentQuestion] === i) {
      radio.checked = true;
    }
    // When the user selects this answer,
    // save its index.
    radio.onclick = function () {
      saveAnswer(i);
    };
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + q.choices[i]));
    choicesContainer.appendChild(label);
  }

  
  // NAVIGATION BUTTONS
  document.getElementById("firstBtn").disabled = currentQuestion === 0;
  document.getElementById("previousBtn").disabled = currentQuestion === 0;
  document.getElementById("nextBtn").disabled =
    currentQuestion === questions.length - 1;
  document.getElementById("lastBtn").disabled =
    currentQuestion === questions.length - 1;
}


// DISPLAY RESULTS
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${questions.length}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}


// START APPLICATION
renderQuestion();
