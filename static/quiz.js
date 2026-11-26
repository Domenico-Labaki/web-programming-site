import {
    firstButton, lastButton, nextButton, previousButton, questionHeading,
    renderQuizQuestion, showQuizResults, submitButton, updateQuizControls
} from './quiz_ui.js';

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

let currentQuestion = 0;
const answers = [];

function goToQuestion(index, moveFocus = true) {
    currentQuestion = index;
    renderQuizQuestion(questions[index], index, questions.length, answers);
    updateQuizControls(index, questions.length);
    if (moveFocus) questionHeading.focus();
}

firstButton.addEventListener('click', () => goToQuestion(0));
previousButton.addEventListener('click', () => goToQuestion(currentQuestion - 1));
nextButton.addEventListener('click', () => goToQuestion(currentQuestion + 1));
lastButton.addEventListener('click', () => goToQuestion(questions.length - 1));
submitButton.addEventListener('click', () => showQuizResults(questions, answers));
goToQuestion(0, false);
