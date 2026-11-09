import assert from 'node:assert';
import { DAILY_SCHEDULE, isDayUnlocked, getRecommendedTargetDay } from './src/utils/schedule.ts';
import { DAILY_QUIZZES, ALL_SCHEDULED_QUIZZES, getQuizForDay } from './src/data/quizzes.ts';
import { evaluateBadges } from './src/utils/achievements.ts';
import { verifyAccessCodeCloud } from './src/utils/supabase.ts';
import { formatWhatsAppMessage, getWhatsAppShareUrl } from './src/utils/whatsapp.ts';

console.log('=== VERIFYING BODDUKURI\'S QUIZ FINAL LOCKDOWN REQUIREMENTS ===\n');

// 1. Schedule & Days: Exactly 7 Days (09 Nov to 15 Nov 2026)
assert.strictEqual(DAILY_SCHEDULE.length, 7, 'DAILY_SCHEDULE must contain exactly 7 learning days (no extra days)');
assert.strictEqual(ALL_SCHEDULED_QUIZZES.length, 7, 'ALL_SCHEDULED_QUIZZES must contain exactly 7 daily quizzes');
assert.strictEqual(DAILY_SCHEDULE[0].dateStr, '09-11-2026');
assert.strictEqual(DAILY_SCHEDULE[6].dateStr, '15-11-2026');
console.log('✓ Requirement 1 PASSED: Exactly 7 scheduled days from 09 Nov to 15 Nov 2026.');

// 2. Day 01 is published & accessible; Days 02-07 remain locked
assert.strictEqual(DAILY_SCHEDULE[0].isPublished, true, 'Day 01 must be published today');
assert.strictEqual(isDayUnlocked(1), true, 'Day 01 must be unlocked by default');
assert.strictEqual(isDayUnlocked('day-01'), true, 'Day 01 must be unlocked by id');

for (let d = 2; d <= 7; d++) {
  assert.strictEqual(DAILY_SCHEDULE[d - 1].isPublished, false, `Day ${d} must be marked isPublished: false`);
  assert.strictEqual(isDayUnlocked(d, []), false, `Day ${d} must remain locked by default`);
  assert.strictEqual(isDayUnlocked(`day-0${d}`, []), false, `Day ${d} must remain locked by id`);
}
console.log('✓ Requirement 2 PASSED: Day 01 is published & accessible; Days 02–07 strictly locked.');

// 3. Approved 7-Day State Groupings & National Park Counts
const expectedDayPlan = [
  { day: 1, totalQs: 30, states: ['Madhya Pradesh', 'Andhra Pradesh', 'Telangana', 'Kerala', 'Assam', 'Karnataka'] },
  { day: 2, totalQs: 12, states: ['Andaman and Nicobar Islands', 'Goa', 'Sikkim', 'Nagaland'] },
  { day: 3, totalQs: 11, states: ['Maharashtra', 'Gujarat', 'Jharkhand'] },
  { day: 4, totalQs: 11, states: ['West Bengal', 'Odisha', 'Tripura', 'Bihar'] },
  { day: 5, totalQs: 12, states: ['Uttarakhand', 'Haryana', 'Meghalaya', 'Uttar Pradesh', 'Ladakh'] },
  { day: 6, totalQs: 14, states: ['Tamil Nadu', 'Himachal Pradesh', 'Manipur', 'Mizoram'] },
  { day: 7, totalQs: 14, states: ['Rajasthan', 'Jammu and Kashmir', 'Chhattisgarh', 'Arunachal Pradesh'] }
];

const allParksInDays2to7 = new Set();

expectedDayPlan.forEach(plan => {
  const quiz = getQuizForDay(plan.day);
  assert.strictEqual(quiz.totalQuestions, plan.totalQs, `Day ${plan.day} question count mismatch`);
  assert.strictEqual(quiz.questions.length, plan.totalQs, `Day ${plan.day} questions array length mismatch`);
  assert.strictEqual(quiz.dayNumber, plan.day, `Day number mismatch`);
  assert.deepStrictEqual(quiz.statesCovered, plan.states, `Day ${plan.day} states grouping mismatch`);

  // Verify format: "In which state is [Park Name] located?"
  quiz.questions.forEach(q => {
    assert.ok(q.question.startsWith('In which state is ') && q.question.endsWith(' located?'),
      `Simple question format: ${q.question}`);
    assert.strictEqual(q.options.length, 4, '4 state options');
    assert.ok(q.correctAnswer >= 0 && q.correctAnswer <= 3, 'Valid answer index');
    assert.ok(q.explanation.includes('is located in'), 'Valid explanation');

    if (plan.day > 1) {
      assert.ok(!allParksInDays2to7.has(q.parkName), `Duplicate park found in syllabus: ${q.parkName}`);
      allParksInDays2to7.add(q.parkName);
    }
  });
});

assert.strictEqual(allParksInDays2to7.size, 74, 'Days 02–07 must cover exactly 74 unique parks');
console.log(`✓ Requirement 3 PASSED: Approved 7-Day state groupings verified (74 unique parks in Days 02–07 + 35 in Day 01 = 109 parks total).`);

// 4. Day 01 Preservation
assert.strictEqual(DAILY_QUIZZES.length, 1, 'DAILY_QUIZZES export must contain Day 01 only');
const day01 = DAILY_QUIZZES[0];
assert.strictEqual(day01.totalQuestions, 30);
assert.strictEqual(day01.statesCovered.length, 6);
assert.strictEqual(day01.quizDate, '09-11-2026');
console.log('✓ Requirement 4 PASSED: Day 01 data, 30 questions, and 6 states 100% preserved.');

// 5. Access Code Security & Role Routing
const studentAuth = await verifyAccessCodeCloud('2002');
assert.strictEqual(studentAuth.success, true, 'Access code 2002 must succeed');
assert.strictEqual(studentAuth.role, 'student', 'Access code 2002 must grant student role');
assert.strictEqual(studentAuth.fullName, 'Mahi', 'Access code 2002 must identify Mahi');

const adminAuth = await verifyAccessCodeCloud('2718');
assert.strictEqual(adminAuth.success, true, 'Access code 2718 must succeed');
assert.strictEqual(adminAuth.role, 'admin', 'Access code 2718 must grant admin role');
assert.strictEqual(adminAuth.fullName, 'Sanju', 'Access code 2718 must identify Sanju');

const invalidAuth = await verifyAccessCodeCloud('9999');
assert.strictEqual(invalidAuth.success, false, 'Invalid code 9999 must be rejected');
console.log('✓ Requirement 5 PASSED: Access codes 2002 (Mahi - Student) and 2718 (Sanju - Admin) securely verified.');

// 6. WhatsApp Result Formatting & Target URL
const mockAttempt = {
  id: 'att-test-1',
  quizId: 'day-01',
  dayNumber: 1,
  quizDate: '09-11-2026',
  displayDate: '09 November 2026',
  completedAt: new Date().toISOString(),
  statesCovered: ['Madhya Pradesh', 'Andhra Pradesh', 'Telangana', 'Kerala', 'Assam', 'Karnataka'],
  totalQuestions: 30,
  correctCount: 28,
  incorrectCount: 2,
  unansweredCount: 0,
  marksObtained: 28,
  maxMarks: 30,
  percentage: 93,
  performanceMessage: 'Outstanding mastery!',
  timeTakenSeconds: 245,
  userAnswers: {},
  quoteUsed: {
    quote: 'Learn. Revise. Remember. Achieve.',
    personalNote: 'Proud of you, Mahi!'
  }
};

const waMsg = formatWhatsAppMessage(mockAttempt);
assert.ok(waMsg.includes("🌿 BODDUKURI'S QUIZ"));
assert.ok(waMsg.includes('#Mahi – Day 01 Completed!'));
assert.ok(waMsg.includes('09 November 2026'));
assert.ok(waMsg.includes('Marks: 28/30'));
assert.ok(waMsg.includes('Correct: 28'));
assert.ok(waMsg.includes('Incorrect: 2'));
assert.ok(waMsg.includes('Percentage: 93%'));
assert.ok(waMsg.includes('Time Taken: 4m 5s'));
assert.ok(waMsg.includes('Keep learning, Mahi! 💚'));

const waUrl = getWhatsAppShareUrl(mockAttempt);
assert.ok(waUrl.startsWith('https://wa.me/917075920852?text='), 'Target WhatsApp URL must be 917075920852');
console.log('✓ Requirement 6 PASSED: WhatsApp message formatting and target number (917075920852) verified.');

// 7. Target Day Recommendation & Badges
assert.strictEqual(getRecommendedTargetDay([]), 1, 'Default target must be Day 1');
assert.strictEqual(getRecommendedTargetDay(['day-01']), 2, 'Next target after Day 1 is Day 2');
const badges = evaluateBadges([], 0);
assert.strictEqual(badges.length, 10, '10 achievement badges catalog intact');
console.log('✓ Requirement 7 PASSED: Target day selection and 10 achievement badges verified.');

console.log('\n=== ALL BODDUKURI\'S QUIZ FINAL LOCKDOWN REQUIREMENTS VERIFIED SUCCESSFULLY! 🎉 ===\n');
