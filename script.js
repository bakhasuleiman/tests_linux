let testsData = [];
let currentModule = null;
let currentQuestion = 0;
let userAnswers = [];

// Загрузка тестов
fetch('tests.json')
    .then(res => res.json())
    .then(data => {
        testsData = data;
        initModules();
    });

function initModules() {
    document.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', () => {
            const moduleNum = parseInt(card.getAttribute('data-module'));
            startTest(moduleNum);
        });
    });
}

function startTest(moduleNum) {
    currentModule = testsData.find(m => m.module === moduleNum);
    currentQuestion = 0;
    userAnswers = Array(currentModule.questions.length).fill(null);
    document.querySelector('.container').classList.add('hidden');
    document.getElementById('test-container').classList.remove('hidden');
    document.getElementById('results-container').classList.add('hidden');
    document.getElementById('test-title').textContent = `Модуль ${moduleNum}`;
    document.getElementById('total-questions').textContent = currentModule.questions.length;
    showQuestion();
}

function showQuestion() {
    const q = currentModule.questions[currentQuestion];
    document.getElementById('question-text').textContent = q.question;
    const answersDiv = document.getElementById('answers-container');
    answersDiv.innerHTML = '';
    q.answers.forEach((ans, idx) => {
        const btn = document.createElement('div');
        btn.className = 'answer-option' + (userAnswers[currentQuestion] === idx ? ' selected' : '');
        btn.textContent = ans;
        btn.onclick = () => {
            userAnswers[currentQuestion] = idx;
            showQuestion();
        };
        answersDiv.appendChild(btn);
    });
    document.getElementById('current-question').textContent = currentQuestion + 1;
    updateProgress();
    document.getElementById('prev-btn').disabled = currentQuestion === 0;
    document.getElementById('next-btn').classList.toggle('hidden', currentQuestion === currentModule.questions.length - 1);
    document.getElementById('finish-btn').classList.toggle('hidden', currentQuestion !== currentModule.questions.length - 1);
}

function updateProgress() {
    const percent = ((currentQuestion + 1) / currentModule.questions.length) * 100;
    document.querySelector('.progress-fill').style.width = percent + '%';
}

document.getElementById('prev-btn').onclick = () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
};
document.getElementById('next-btn').onclick = () => {
    if (currentQuestion < currentModule.questions.length - 1) {
        currentQuestion++;
        showQuestion();
    }
};
document.getElementById('finish-btn').onclick = () => {
    showResults();
};
document.getElementById('retry-btn').onclick = () => {
    startTest(currentModule.module);
};
document.getElementById('back-to-modules-btn').onclick = () => {
    document.getElementById('test-container').classList.add('hidden');
    document.getElementById('results-container').classList.add('hidden');
    document.querySelector('.container').classList.remove('hidden');
};

function showResults() {
    let correct = 0;
    currentModule.questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correct) correct++;
    });
    const percent = Math.round((correct / currentModule.questions.length) * 100);
    document.getElementById('score-percentage').textContent = percent + '%';
    document.getElementById('correct-answers').textContent = correct;
    document.getElementById('total-answers').textContent = currentModule.questions.length;
    document.getElementById('test-container').classList.add('hidden');
    document.getElementById('results-container').classList.remove('hidden');
} 