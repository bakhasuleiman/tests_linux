const fs = require('fs');

const input = fs.readFileSync('Тестирование.txt', 'utf-8');

const moduleRegex = /Модуль (\d+)\)/g;
const questionRegex = /Вопрос: ([^\n]+)\n([\s\S]*?)(?=Вопрос:|Модуль|$)/g;

const correctAnswers = [
    // Модуль 1
    [1,2,2,2,1,2,4,1,1,3,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2],
    // Модуль 2
    [2,1,3,1,2,1,3,3,1,3,2,3,3,3,2,1,3,1,2,3,2,1,3,3,2],
    // Модуль 3
    [2,4,2,4,3,3,2,1,2,2,1,4,4,4,2,2,2,2,2,2,2,2,2,2,2],
    // Модуль 4
    [4,2,2,4,1,2,4,1,2,1,4,2,2,4,1,1,2,4,1,2,2,4,2,2,1],
    // Модуль 5
    [2,1,4,1,2,2,2,4,2,1,3,2,2,1,3,2,1,2,2,2,2,2,2,2,2],
    // Модуль 6
    [3,2,1,2,2,2,3,2,3,3,2,2,2,2,2,2,2,2,2,2],
    // Модуль 7
    [3,4,2,1,2,4,4,4,1,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    // Модуль 8
    [2,3,3,4,3,3,2,2,3,3,3,3,3,3,3,3,3,3,3,3],
    // Модуль 9
    [2,2,1,4,3,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2],
    // Модуль 10
    [1,4,1,2,3,3,2,4,2,2,1,4,1,1,2,2,2,2,2,2,2,2,2,2,2],
    // Модуль 11
    [2,2,4,1,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    // Модуль 12
    [1,3,3,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

const modules = [];
let moduleMatch;
let lastIndex = 0;
let moduleIndex = 0;

while ((moduleMatch = moduleRegex.exec(input)) !== null) {
    const moduleNumber = parseInt(moduleMatch[1], 10);
    const start = moduleMatch.index;
    const end = moduleRegex.exec(input)?.index || input.length;
    const moduleText = input.slice(start, end);
    
    const questions = [];
    let qMatch;
    let qIndex = 0;
    while ((qMatch = questionRegex.exec(moduleText)) !== null) {
        const question = qMatch[1].trim();
        const answers = qMatch[2].split('\n').map(a => a.trim()).filter(Boolean);
        const correct = correctAnswers[moduleIndex] && correctAnswers[moduleIndex][qIndex] ? correctAnswers[moduleIndex][qIndex] - 1 : 0;
        questions.push({
            question,
            answers,
            correct
        });
        qIndex++;
    }
    modules.push({
        module: moduleNumber,
        questions
    });
    moduleIndex++;
}

fs.writeFileSync('tests.json', JSON.stringify(modules, null, 2), 'utf-8');
console.log('Тесты успешно сгенерированы в tests.json'); 