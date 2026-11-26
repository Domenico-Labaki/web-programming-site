import {
    firstButton, lastButton, nextButton, previousButton, questionHeading,
    renderQuizQuestion, showQuizResults, submitButton, updateQuizControls
} from './quiz_ui.js';

const status = document.getElementById('quiz-status');
const errorMessage = document.getElementById('quiz-error');
const retryButton = document.getElementById('quiz-retry');
const cache = new Map();
const answers = [];
let total = 0;
let currentQuestion = -1;
let busy = false;
let failedAction;

async function getJson(url) {
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

async function getQuestion(index) {
    if (!cache.has(index)) {
        const question = await getJson(`/api/question/${index}`);
        if (typeof question.question !== 'string' || !Array.isArray(question.choices) ||
            question.choices.length === 0 || !question.choices.every((choice) => typeof choice === 'string') ||
            !Number.isInteger(question.answer) || !(question.answer in question.choices) ||
            typeof question.explanation !== 'string') {
            throw new Error('Invalid question');
        }
        cache.set(index, question);
    }
    return cache.get(index);
}

// Each operation owns the controls until it finishes. Retry runs that same operation.
async function runAction(action, moveFocus = true) {
    if (busy) return;
    busy = true;
    failedAction = undefined;
    status.textContent = action.loading;
    if (moveFocus) status.focus();
    errorMessage.textContent = '';
    retryButton.hidden = true;
    updateQuizControls(currentQuestion, total, true);

    try {
        const nextFocus = await action.run();
        if (document.activeElement === status) nextFocus?.focus();
    } catch {
        failedAction = action;
        errorMessage.textContent = action.error;
        retryButton.hidden = false;
        if (document.activeElement === status) retryButton.focus();
    } finally {
        busy = false;
        updateQuizControls(currentQuestion, total);
        status.textContent = '';
    }
}

async function displayQuestion(index, count) {
    const question = await getQuestion(index);
    renderQuizQuestion(question, index, count, answers);
    currentQuestion = index;
    total = count;
    return questionHeading;
}

function goToQuestion(index) {
    runAction({
        loading: `Loading question ${index + 1}…`,
        error: `Question ${index + 1} could not be loaded. Retry to open it. Your answers are saved in this quiz.`,
        run: () => displayQuestion(index, total)
    });
}

const startQuiz = {
    loading: 'Loading quiz…',
    error: 'The quiz could not start. Retry to load the questions.',
    async run() {
        const { count } = await getJson('/api/questions/count');
        if (!Number.isInteger(count) || count < 1) throw new Error('No questions');
        return displayQuestion(0, count);
    }
};

const scoreQuiz = {
    loading: 'Scoring your answers…',
    error: 'Your answers could not be scored. Retry to get your results. Your answers are saved in this quiz.',
    async run() {
        const questions = [];
        for (let index = 0; index < total; index++) {
            questions.push(await getQuestion(index));
        }
        showQuizResults(questions, answers);
    }
};

firstButton.addEventListener('click', () => goToQuestion(0));
previousButton.addEventListener('click', () => goToQuestion(currentQuestion - 1));
nextButton.addEventListener('click', () => goToQuestion(currentQuestion + 1));
lastButton.addEventListener('click', () => goToQuestion(total - 1));
submitButton.addEventListener('click', () => runAction(scoreQuiz));
retryButton.addEventListener('click', () => {
    if (failedAction) runAction(failedAction);
});
runAction(startQuiz, false);
