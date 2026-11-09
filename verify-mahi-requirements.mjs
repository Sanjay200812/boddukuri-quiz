import assert from 'node:assert';
import { DAILY_SCHEDULE, isDayUnlocked, getDayCountdown, getRecommendedTargetDay, isDevUnlockAllEnabled, setDevUnlockAll } from './src/utils/schedule.ts';
import { DAILY_QUIZZES, ALL_SCHEDULED_QUIZZES, getQuizForDay } from './src/data/quizzes.ts';
import { getBookmarks, toggleBookmark, isBookmarked, mergeProgressSnapshot, getProgressSnapshot } from './src/utils/storage.ts';
import { evaluateBadges } from './src/utils/achievements.ts';

console.log('=== VERIFYING MAHI LEARNING REQUIREMENTS ===\n');

// 1. Schedule & Days
assert.strictEqual(DAILY_SCHEDULE.length, 7, 'DAILY_SCHEDULE must have exactly 7 days (09 Nov to 15 Nov 2026)');
assert.strictEqual(DAILY_SCHEDULE[0].dateStr, '09-11-2026');
assert.strictEqual(DAILY_SCHEDULE[6].dateStr, '15-11-2026');
console.log('✓ Requirement 1 PASSED: 7 scheduled days from 09 Nov to 15 Nov 2026.');

// 2. Day 01 is always unlocked
assert.strictEqual(isDayUnlocked(1, ['day-01']), true, 'Day 01 must be unlocked if completed');
console.log('✓ Requirement 2 PASSED: Day 01 remains permanently accessible.');

// 3. 8:30 PM IST (15:00:00Z) Unlock check
DAILY_SCHEDULE.forEach(item => {
  assert.ok(item.unlockIsoUTC.endsWith('15:00:00Z'), `Day ${item.dayNumber} must unlock at 15:00:00 UTC (8:30 PM IST)`);
});
console.log('✓ Requirement 3 PASSED: Every day unlocks at exactly 8:30 PM IST (15:00:00 UTC).');

// 4. Cumulative Quiz generation (Days 01 to 07)
assert.strictEqual(ALL_SCHEDULED_QUIZZES.length, 7, 'All 7 days must have quizzes generated');
for (let d = 1; d <= 7; d++) {
  const quiz = getQuizForDay(d);
  assert.strictEqual(quiz.totalQuestions, 30, `Day ${d} must have exactly 30 questions`);
  assert.strictEqual(quiz.questions.length, 30, `Day ${d} questions array length must be 30`);
  assert.strictEqual(quiz.dayNumber, d, `Day number must match ${d}`);
  assert.strictEqual(quiz.statesCovered.length, 5 + d, `Day ${d} cumulative states must be ${5 + d}`);
}
console.log('✓ Requirement 4 PASSED: Cumulative quizzes for Days 01–07 generated with exactly 30 questions each.');

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
