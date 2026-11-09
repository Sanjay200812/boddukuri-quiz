import assert from 'node:assert';
import { DAILY_SCHEDULE, isDayUnlocked, getDayCountdown, getRecommendedTargetDay, isDevUnlockAllEnabled, setDevUnlockAll } from './src/utils/schedule.ts';
import { DAILY_QUIZZES, ALL_SCHEDULED_QUIZZES, getQuizForDay } from './src/data/quizzes.ts';
import { getBookmarks, toggleBookmark, isBookmarked, mergeProgressSnapshot, getProgressSnapshot } from './src/utils/storage.ts';
import { evaluateBadges } from './src/utils/achievements.ts';

console.log('=== VERIFYING MAHI LEARNING REQUIREMENTS ===\n');

// 1. Schedule & Days (Days 01-07 + Semi-Final + Grand Final)
assert.ok(DAILY_SCHEDULE.length >= 7, 'DAILY_SCHEDULE must cover at least 7 learning days');
assert.strictEqual(DAILY_SCHEDULE[0].dateStr, '09-11-2026');
assert.strictEqual(DAILY_SCHEDULE[6].dateStr, '15-11-2026');
console.log('✓ Requirement 1 PASSED: 7 scheduled days from 09 Nov to 15 Nov 2026.');

// 2. Day 01 is always published/unlocked; Days 02-07 are locked until published
assert.strictEqual(DAILY_SCHEDULE[0].isPublished, true, 'Day 01 must be published today');
assert.strictEqual(DAILY_SCHEDULE[1].isPublished, false, 'Day 02 must be locked until published');
assert.strictEqual(DAILY_SCHEDULE[6].isPublished, false, 'Day 07 must be locked until published');
assert.strictEqual(isDayUnlocked(1, ['day-01']), true, 'Day 01 must be unlocked if completed');
console.log('✓ Requirement 2 PASSED: Day 01 is published & accessible; Days 02–07 locked until explicitly published.');

// 3. 8:29 PM IST (14:59:00Z) Unlock check
DAILY_SCHEDULE.forEach(item => {
  assert.ok(item.unlockIsoUTC.endsWith('14:59:00Z'), `Day ${item.dayNumber} must unlock at 14:59:00 UTC (8:29 PM IST)`);
});
console.log('✓ Requirement 3 PASSED: Every day unlocks at exactly 8:29 PM IST (14:59:00 UTC).');

// 4. Approved 7-Day National Parks Study Plan & Question counts
const expectedCounts = {
  1: 30, // Foundational 6 states (5 Qs per state)
  2: 11, // Western India (Maharashtra [6], Gujarat [4], Goa [1])
  3: 10, // Desert & Southern Coasts (Rajasthan [5], Tamil Nadu [5])
  4: 18, // Northern Himalayas (Uttarakhand [6], Himachal [5], J&K & Ladakh [5], Haryana [2])
  5: 14, // Eastern Plains & Heartland (WB [6], Odisha [2], CG [3], UP [1], Bihar [1], Jharkhand [1])
  6: 12, // North-East & Sikkim (Arunachal [2], Meghalaya [2], Manipur [2], Mizoram [2], Nagaland [1], Tripura [2], Sikkim [1])
  7: 9   // Island Archipelago (Andaman & Nicobar Islands [9])
};

assert.ok(ALL_SCHEDULED_QUIZZES.length >= 7, 'All scheduled quizzes must be generated');
const allParksInSyllabus = new Set();

for (let d = 1; d <= 7; d++) {
  const quiz = getQuizForDay(d);
  const expectedTotal = expectedCounts[d];
  assert.strictEqual(quiz.totalQuestions, expectedTotal, `Day ${d} must have exactly ${expectedTotal} questions`);
  assert.strictEqual(quiz.questions.length, expectedTotal, `Day ${d} questions array length must be ${expectedTotal}`);
  assert.strictEqual(quiz.dayNumber, d, `Day number must match ${d}`);

  // Verify all questions follow simple format: "In which state is [Park Name] located?"
  quiz.questions.forEach(q => {
    assert.ok(q.question.startsWith('In which state is ') && q.question.endsWith(' located?'),
      `Question format must be 'In which state is [Park Name] located?': ${q.question}`);
    assert.strictEqual(q.options.length, 4, 'Question must have 4 options');
    assert.ok(q.correctAnswer >= 0 && q.correctAnswer <= 3, 'Valid correctAnswer index');
    assert.ok(q.explanation.includes('is located in'), 'Valid explanation');
    if (d > 1) {
      assert.ok(!allParksInSyllabus.has(q.parkName), `Park ${q.parkName} must be covered only once in syllabus`);
    }
    allParksInSyllabus.add(q.parkName);
  });
}
console.log(`✓ Requirement 4 PASSED: Approved 7-Day study plan verified (Total ${allParksInSyllabus.size} unique parks covered in simple format).`);

// 4b. Special Tests (Semi-Final & Grand Final)
const semiFinal = getQuizForDay(8);
assert.strictEqual(semiFinal.totalQuestions, 40, 'Semi-Final test must have 40 questions');
assert.strictEqual(semiFinal.statesCovered.length, 29, 'Semi-Final covers all 29 states & UTs');

const grandFinal = getQuizForDay(9);
assert.strictEqual(grandFinal.totalQuestions, 50, 'Grand Final test must have 50 questions');
assert.strictEqual(grandFinal.statesCovered.length, 29, 'Grand Final covers all 29 states & UTs');
console.log('✓ Requirement 4b PASSED: Semi-Final (40 Qs) & Grand Final (50 Qs) tests verified.');

// 5. Day 01 Preservation
assert.strictEqual(DAILY_QUIZZES.length, 1, 'DAILY_QUIZZES export must contain Day 01 only');
const day01 = DAILY_QUIZZES[0];
assert.strictEqual(day01.totalQuestions, 30);
assert.strictEqual(day01.statesCovered.length, 6);
assert.strictEqual(day01.quizDate, '09-11-2026');
console.log('✓ Requirement 5 PASSED: Day 01 data, 30 questions, and 6 states 100% preserved.');

// 6. Target Day Recommendation
assert.strictEqual(getRecommendedTargetDay([]), 1, 'When nothing is completed, recommended target must be Day 1');
assert.strictEqual(getRecommendedTargetDay(['day-01']), 2, 'When Day 01 is completed, recommended target should be Day 2');
console.log('✓ Requirement 6 PASSED: Auto-target day selection operates correctly.');

// 7. Achievement Badges Catalog
const badges = evaluateBadges([], 0);
assert.strictEqual(badges.length, 10, '10 achievement badges in catalog');
console.log('✓ Requirement 7 PASSED: Achievement Badges catalog intact.');

console.log('\n=== ALL MAHI LEARNING SPECIFICATIONS VERIFIED SUCCESSFULLY! 🎉 ===\n');
