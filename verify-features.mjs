import assert from 'node:assert';
import { DAILY_QUIZZES } from './src/data/quizzes.ts';
import { evaluateBadges } from './src/utils/achievements.ts';
import { calculateCurrentStreak, calculateBestStreak, getWeeklyStreakDays } from './src/utils/storage.ts';

console.log('--- VERIFYING SPECIAL FEATURES ---');

// 1. Day 01 Quiz integrity
assert.strictEqual(DAILY_QUIZZES.length, 1, 'Only Day 01 quiz should be active');
const day01 = DAILY_QUIZZES[0];
assert.strictEqual(day01.totalQuestions, 30, 'Day 01 must have exactly 30 questions');
assert.strictEqual(day01.quizDate, '09-11-2026', 'Quiz date must remain 09-11-2026');
assert.strictEqual(day01.displayDate, '09 November 2026', 'Display date must remain 09 November 2026');
assert.strictEqual(day01.statesCovered.length, 6, 'Must cover exactly 6 states');
console.log('✓ 1. Day 01 quiz integrity preserved (30 questions, 6 states, 09 November 2026).');

// 2. Badges evaluation
const emptyBadges = evaluateBadges([], 0);
assert.strictEqual(emptyBadges.length, 10, 'Catalog should contain 10 achievement badges');

const firstQuizBadge = emptyBadges.find(b => b.id === 'first_quiz');
const perfectScoreBadge = emptyBadges.find(b => b.id === 'perfect_score');
const streak7Badge = emptyBadges.find(b => b.id === 'streak_7');

assert.ok(firstQuizBadge, 'Badge "First Quiz" must exist');
assert.ok(perfectScoreBadge, 'Badge "Perfect Score" must exist');
assert.ok(streak7Badge, 'Badge "7-Day Streak" must exist');
assert.strictEqual(firstQuizBadge.unlocked, false, 'First Quiz badge locked with 0 attempts');
console.log('✓ 2. Achievement Badges catalog verified (First Quiz, Perfect Score, 7-Day Streak, etc.).');

// Mock an attempt
const mockAttempt = {
  id: 'att_test',
  quizId: 'day-01',
  dayNumber: 1,
  statesCovered: day01.statesCovered,
  timestamp: new Date().toISOString(),
  formattedDate: '09 Nov 2026',
  answers: { [day01.questions[0].id]: day01.questions[0].correctAnswer },
  totalQuestions: 30,
  correctCount: 30,
  incorrectCount: 0,
  unansweredCount: 0,
  marksObtained: 30,
  maxMarks: 30,
  percentage: 100,
  accuracy: 100,
  timeTakenSeconds: 240,
  sectionBreakdown: {
    previous: { total: 0, correct: 0, incorrect: 0, unanswered: 0, percentage: 0 },
    new: { total: 30, correct: 30, incorrect: 0, unanswered: 0, percentage: 100 }
  },
  stateBreakdown: [
    { stateName: 'Madhya Pradesh', total: 5, correct: 5, percentage: 100 },
    { stateName: 'Assam', total: 5, correct: 5, percentage: 100 }
  ],
  performanceTier: 'outstanding',
  performanceMessage: 'Outstanding!'
};

const unlockedBadges = evaluateBadges([mockAttempt], 7);
const firstQuizUnlocked = unlockedBadges.find(b => b.id === 'first_quiz');
const perfectScoreUnlocked = unlockedBadges.find(b => b.id === 'perfect_score');
const streak7Unlocked = unlockedBadges.find(b => b.id === 'streak_7');

assert.strictEqual(firstQuizUnlocked.unlocked, true, 'First Quiz badge must unlock after 1 attempt');
assert.strictEqual(perfectScoreUnlocked.unlocked, true, 'Perfect Score badge must unlock with 100%');
assert.strictEqual(streak7Unlocked.unlocked, true, '7-Day Streak badge must unlock with streak >= 7');
console.log('✓ 3. Badges dynamic unlocking evaluated correctly.');

// 3. Streak tracker functions
const weekDays = getWeeklyStreakDays([mockAttempt]);
assert.strictEqual(weekDays.length, 7, 'Weekly streak tracker must have 7 days');
const todayItem = weekDays.find(d => d.isToday);
assert.ok(todayItem, 'Today must be present in weekly strip');
assert.strictEqual(todayItem.completed, true, 'Today must be marked completed since mock attempt is today');

const currentStreak = calculateCurrentStreak([mockAttempt]);
assert.strictEqual(currentStreak, 1, 'Current streak should be 1 with today\'s attempt');
console.log('✓ 4. Daily learning streaks and weekly calendar strip verified.');

console.log('\nALL FEATURE VERIFICATION TESTS PASSED! 🎉\n');

