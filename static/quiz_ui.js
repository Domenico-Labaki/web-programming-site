export const questionHeading = document.getElementById('questionText');
export const firstButton = document.getElementById('firstBtn');
export const previousButton = document.getElementById('previousBtn');
export const nextButton = document.getElementById('nextBtn');
export const lastButton = document.getElementById('lastBtn');
export const submitButton = document.getElementById('quiz-submit');

const questionPanel = document.getElementById('quiz-question');
const choices = document.getElementById('choices');
const progress = document.getElementById('progress');

export function updateQuizControls(index, total, busy = false) {
    const hasQuestion = index >= 0;
    firstButton.disabled = previousButton.disabled = busy || index <= 0;
    nextButton.disabled = lastButton.disabled = busy || !hasQuestion || index >= total - 1;
    submitButton.disabled = choices.disabled = busy || !hasQuestion;
}

export function renderQuizQuestion(question, index, total, answers) {
    progress.textContent = `Question ${index + 1} of ${total}`;
    questionHeading.textContent = question.question;
    choices.replaceChildren();

    question.choices.forEach((choice, choiceIndex) => {
        const label = document.createElement('label');
        const radio = document.createElement('input');
        radio.id = `answer-${index}-${choiceIndex}`;
        radio.type = 'radio';
        radio.name = 'answer';
        radio.value = choiceIndex;
        radio.checked = answers[index] === choiceIndex;
        radio.addEventListener('change', () => {
            if (radio.checked) answers[index] = choiceIndex;
        });
        label.className = 'choice';
        label.htmlFor = radio.id;
        label.append(radio, choice);
        choices.append(label);
    });

    questionPanel.hidden = false;
}

function performanceMessage(percentage) {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 50) return 'Pass';
    return 'Needs improvement';
}

export function showQuizResults(questions, answers) {
    let score = 0;
    const correction = questions.map((question, index) => {
        const correct = answers[index] === question.answer;
        if (correct) score++;
        return [
            `Question ${index + 1}: ${question.question}\n`,
            `Your answer: ${question.choices[answers[index]] ?? 'Not Answered'}`,
            `Correct answer: ${question.choices[question.answer]}`,
            `Result: ${correct ? 'Correct' : 'Incorrect'}`,
            `Explanation: ${question.explanation}`
        ].join('\n');
    });
    const percentage = Math.round(score / questions.length * 100);
    const scoreText = `Score: ${score} / ${questions.length}`;

    document.getElementById('scoreText').textContent = scoreText;
    document.getElementById('percentageText').textContent = `Percentage: ${percentage}%`;
    document.getElementById('performanceText').textContent = performanceMessage(percentage);
    document.getElementById('correction').textContent = correction.join('\n\n');
    document.getElementById('quizPanel').hidden = true;
    document.getElementById('resultsPanel').hidden = false;
    document.getElementById('results-heading').focus();
    document.getElementById('quiz-completion').textContent = `Quiz complete. ${scoreText} (${percentage}%).`;
}
