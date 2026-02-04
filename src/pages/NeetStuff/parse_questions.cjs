const fs = require('fs');
const path = require('path');

const rawFile = './raw_questions.txt';
const destFile = './MockTest2Data.js';

const content = fs.readFileSync(rawFile, 'utf8');

const questions = {
    physics: [],
    chemistry: [],
    biology: []
};

let currentSubject = null;
let currentQuestion = null;
let mode = 'questions'; // 'questions' or 'answers'
const answersMap = {}; // {id: 'A'|'B'|'C'|'D'}

const lines = content.split(/\r?\n/);

// Helper to save current question
function saveQuestion() {
    if (currentQuestion && currentSubject) {
        // Clean options
        currentQuestion.options = currentQuestion.options.map(o => o.trim());
        questions[currentSubject].push(currentQuestion);
    }
}

// Regex patterns
const sectionRegex = /^SECTION ([A-C]):\s*(\w+)/i; // Matches SECTION A: PHYSICS
const questionRegex = /^Q\.(\d+)\.\s*(?:\((.*?)\))?/; // Matches Q.1. (Topic) or Q.1.
const optionRegex = /^([A-D])\)\s+(.*)/; // Matches A) Option text
const answerSectionRegex = /^ANSWER KEY/i;
const answerKeyRegex = /^(\d+)\.\s+([A-D])/;

// Initial processing loop
for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    if (line.match(answerSectionRegex)) {
        saveQuestion(); // Save last question
        currentQuestion = null;
        mode = 'answers';
        console.log('Switched to Answer Key mode');
        continue;
    }

    if (mode === 'questions') {
        // Check for section
        const sectionMatch = line.match(sectionRegex);
        if (sectionMatch) {
            saveQuestion();
            currentQuestion = null;
            const sub = sectionMatch[2].toLowerCase();
            if (sub.includes('physics')) currentSubject = 'physics';
            else if (sub.includes('chemistry')) currentSubject = 'chemistry';
            else if (sub.includes('biology')) currentSubject = 'biology';
            console.log(`Switched subject to ${currentSubject}`);
            continue;
        }

        // Check for zoology subsection (part of biology)
        if (line.includes('ZOOLOGY')) {
            // It's still biology, just continue
            continue;
        }

        // Check for BOTANY (part of biology)
        if (line.includes('BOTANY')) {
            continue;
        }

        // Check new question
        const qMatch = line.match(questionRegex);
        if (qMatch) {
            saveQuestion();
            const id = parseInt(qMatch[1]);
            const topic = qMatch[2] ? `(${qMatch[2]})` : '';
            let qText = line.replace(questionRegex, '').trim();
            if (topic) qText = topic + ' ' + qText;

            // Determine subject by ID
            let subj = 'physics';
            if (id >= 46 && id <= 90) subj = 'chemistry';
            else if (id >= 91 && id <= 180) subj = 'biology';

            currentSubject = subj; // Force update subject based on ID

            currentQuestion = {
                id: id,
                section: 'A',
                question: qText,
                options: [],
                correct: -1,
                subject: subj.charAt(0).toUpperCase() + subj.slice(1)
            };
            continue;
        }

        // Check option
        const optMatch = line.match(optionRegex);
        if (optMatch && currentQuestion) {
            currentQuestion.options.push(optMatch[2]);
            continue;
        }

        // Ensure we capture multi-line question text
        if (currentQuestion && currentQuestion.options.length === 0 && !line.match(sectionRegex)) {
            // Append to question text
            currentQuestion.question += '\n' + line;
        }

    } else if (mode === 'answers') {
        // Parse answer keys. Format: 1. B
        // Sometimes multiple on one line? The text file has one per line based on my copy-paste.

        // Handle lines with multiple answers if they exist (unlikely in this raw dump but possible)
        // My raw dump has "1. B" on separate lines.

        const ansMatch = line.match(answerKeyRegex);
        if (ansMatch) {
            answersMap[parseInt(ansMatch[1])] = ansMatch[2];
        }
    }
}
// Save very last question/state? No, answers mode handles end.

// Now apply answers to questions
const mapLetterToIndex = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };

['physics', 'chemistry', 'biology'].forEach(subj => {
    questions[subj].forEach(q => {
        const ansLetter = answersMap[q.id];
        if (ansLetter) {
            q.correct = mapLetterToIndex[ansLetter];
        } else {
            console.warn(`No answer found for Q${q.id}`);
        }
    });
});

// Generate Output content
const jsContent = `export const questions = ${JSON.stringify(questions, null, 2)};`;

fs.writeFileSync(destFile, jsContent);
console.log('Successfully generated MockTest2Data.js');
console.log(`Physics: ${questions.physics.length}`);
console.log(`Chemistry: ${questions.chemistry.length}`);
console.log(`Biology: ${questions.biology.length}`);
