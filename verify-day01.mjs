import assert from 'node:assert';
import { DAILY_QUIZZES, DAILY_CONFIGS, buildCumulativeQuizzes } from './src/data/quizzes.ts';
import { DEFAULT_SANJU_WHATSAPP_NUMBER, formatWhatsAppMessage, getWhatsAppShareUrl } from './src/utils/whatsapp.ts';
import { STATE_REPOSITORIES } from './src/data/stateRepositories.ts';

console.log('--- RUNNING FINAL CORRECTION VERIFICATIONS FOR DAY 01 ---');

// 1. Only Day 01 exists
assert.strictEqual(DAILY_QUIZZES.length, 1, 'DAILY_QUIZZES must contain ONLY Day 01');
assert.strictEqual(DAILY_CONFIGS.length, 1, 'DAILY_CONFIGS must contain ONLY Day 01');
console.log('✓ Requirement 1 PASSED: Only Day 01 is active and generated.');

// 2. Day 01 details
const day01 = DAILY_QUIZZES[0];
assert.strictEqual(day01.dayNumber, 1, 'Day number must be 1');
assert.strictEqual(day01.title, 'Day 01', 'Title must be "Day 01"');
assert.strictEqual(day01.quizDate, '09-11-2026', 'Quiz Date must be 09-11-2026');
assert.strictEqual(day01.displayDate, '09 November 2026', 'Display Date must be 09 November 2026');
assert.strictEqual(day01.statusLabel, 'Available', 'Status must be Available');
console.log('✓ Requirement 2 PASSED: Day 01 Details (09-11-2026 / 09 November 2026 / Available).');

// 3. Exactly six states covered
const EXPECTED_STATES = [
  'Madhya Pradesh',
  'Andhra Pradesh',
  'Telangana',
  'Kerala',
  'Assam',
  'Karnataka'
];
assert.deepStrictEqual(day01.statesCovered, EXPECTED_STATES, 'States covered must exactly match the six requested states');
console.log('✓ Requirement 3 PASSED: Exactly 6 states covered: MP, AP, TS, Kerala, Assam, Karnataka.');

// 4. Exactly 30 questions, 5 questions per state
assert.strictEqual(day01.totalQuestions, 30, 'Total questions must be exactly 30');
assert.strictEqual(day01.questions.length, 30, 'Questions array length must be exactly 30');

const stateCounts = {};
day01.questions.forEach((q, idx) => {
  stateCounts[q.state] = (stateCounts[q.state] || 0) + 1;
  assert.ok(q.question && q.question.length > 5, `Question ${idx + 1} must have valid text`);
  assert.strictEqual(q.options.length, 4, `Question ${idx + 1} must have 4 options`);
  assert.ok(q.correctAnswer >= 0 && q.correctAnswer <= 3, `Question ${idx + 1} correctAnswer must be 0..3`);
  assert.ok(q.explanation && q.explanation.length > 5, `Question ${idx + 1} must have explanation`);
});

for (const state of EXPECTED_STATES) {
  assert.strictEqual(stateCounts[state], 5, `${state} must have exactly 5 questions`);
}
console.log('✓ Requirement 4 PASSED: Exactly 30 questions, balanced with 5 questions per state:');
console.log(' ', stateCounts);

// 5. WhatsApp configuration & recipient number
assert.strictEqual(DEFAULT_SANJU_WHATSAPP_NUMBER, '917075920852', 'WhatsApp recipient must be 917075920852');

const mockAttempt = {
  id: 'att_123',
  quizId: 'day-01',
  dayNumber: 1,
  statesCovered: day01.statesCovered,
  timestamp: new Date().toISOString(),
  formattedDate: '09 Nov 2026, 02:30 pm',
  answers: {},
  totalQuestions: 30,
  correctCount: 26,
  incorrectCount: 4,
  unansweredCount: 0,
  marksObtained: 26,
  maxMarks: 30,
  percentage: 87,
  accuracy: 87,
  timeTakenSeconds: 340,
  sectionBreakdown: {
    previous: { total: 0, correct: 0, incorrect: 0, unanswered: 0, percentage: 0 },
    new: { total: 30, correct: 26, incorrect: 4, unanswered: 0, percentage: 87 }
  },
  performanceTier: 'excellent',
  performanceMessage: 'Excellent work!',
  quote: {
    quote: 'Success is the sum of small efforts repeated day in and day out.',
    personalNote: 'Keep going Mahi!'
  }
};

const waMessage = formatWhatsAppMessage(mockAttempt);
console.log('✓ Requirement 5 PASSED: Sample WhatsApp message:\n');
console.log(waMessage);

assert.ok(waMessage.includes("🌿 BODDUKURI'S QUIZ"), 'Message must contain brand');
assert.ok(waMessage.includes('#Mahi – Day 01 Completed!'), 'Message must contain day header');
assert.ok(waMessage.includes('Madhya Pradesh, Andhra Pradesh, Telangana, Kerala, Assam and Karnataka.'), 'States formatted');
assert.ok(waMessage.includes('Marks: 26/30'), 'Marks formatted');
assert.ok(waMessage.includes('Correct: 26'), 'Correct formatted');
assert.ok(waMessage.includes('Incorrect: 4'), 'Incorrect formatted');
assert.ok(waMessage.includes('Percentage: 87%'), 'Percentage formatted');
assert.ok(waMessage.includes('🏆 Performance: Excellent work!'), 'Performance formatted');
assert.ok(waMessage.includes('Keep learning, Mahi! 💚'), 'Closing formatted');

const waUrl = getWhatsAppShareUrl(mockAttempt);
assert.ok(waUrl.startsWith('https://wa.me/917075920852?text='), 'WhatsApp share URL must target 917075920852');
console.log('\n✓ Requirement 6 PASSED: Target URL generated -> https://wa.me/917075920852?text=...');

console.log('\n==========================================');
console.log('ALL DAY 01 VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉');
console.log('==========================================\n');
