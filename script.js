let testsData = [];
let currentModule = null;
let currentQuestion = 0;
let userAnswers = [];
let showResultMode = false;

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
    showResultMode = false;
    document.querySelector('.container').classList.add('hidden');
    document.getElementById('test-container').classList.remove('hidden');
    document.getElementById('results-container').classList.add('hidden');
    document.getElementById('test-title').textContent = `Модуль ${moduleNum}`;
    document.getElementById('total-questions').textContent = currentModule.questions.length;
    showQuestion();
}

function showQuestion() {
    const q = currentModule.questions[currentQuestion];
    const questionText = document.getElementById('question-text');
    const answersDiv = document.getElementById('answers-container');
    questionText.style.opacity = 0;
    answersDiv.style.opacity = 0;
    setTimeout(() => {
        questionText.textContent = q.question;
        answersDiv.innerHTML = '';
        q.answers.forEach((ans, idx) => {
            const btn = document.createElement('div');
            let classes = 'answer-option';
            if (userAnswers[currentQuestion] === idx) classes += ' selected';
            if (showResultMode && userAnswers[currentQuestion] !== null) {
                if (idx === q.correct) classes += ' correct';
                else if (userAnswers[currentQuestion] === idx) classes += ' incorrect';
            }
            btn.className = classes;
            btn.textContent = ans;
            btn.onclick = () => {
                if (!showResultMode) {
                    userAnswers[currentQuestion] = idx;
                    showQuestion();
                }
            };
            answersDiv.appendChild(btn);
        });
        questionText.style.opacity = 1;
        answersDiv.style.opacity = 1;
    }, 120);
    document.getElementById('current-question').textContent = currentQuestion + 1;
    updateProgress();
    document.getElementById('prev-btn').disabled = currentQuestion === 0;
    document.getElementById('next-btn').classList.toggle('hidden', currentQuestion === currentModule.questions.length - 1);
    document.getElementById('finish-btn').classList.toggle('hidden', currentQuestion !== currentModule.questions.length - 1);
}

function updateProgress() {
    const percent = ((currentQuestion + 1) / currentModule.questions.length) * 100;
    document.querySelector('.progress-fill').style.width = percent + '%';
    let percentDiv = document.querySelector('.progress-percent');
    if (!percentDiv) {
        percentDiv = document.createElement('div');
        percentDiv.className = 'progress-percent';
        document.querySelector('.progress-bar').appendChild(percentDiv);
    }
    percentDiv.textContent = Math.round(percent) + '%';
}

document.getElementById('prev-btn').innerHTML = '<span class="btn-icon">⏪</span>Назад';
document.getElementById('next-btn').innerHTML = 'Далее<span class="btn-icon">⏩</span>';
document.getElementById('finish-btn').innerHTML = '<span class="btn-icon">🏁</span>Завершить';
document.getElementById('retry-btn').innerHTML = '<span class="btn-icon">🔄</span>Пройти заново';
document.getElementById('back-to-modules-btn').innerHTML = '<span class="btn-icon">🏠</span>К модулям';

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
    showResultMode = true;
    showQuestion();
    setTimeout(showResults, 1200);
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