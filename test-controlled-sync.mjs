import assert from 'node:assert';
import { 
  getAllAttempts, 
  getCompletedDayIds, 
  saveQuizAttempt, 
  resetAllData, 
  getInboxNotifications, 
  calculateCurrentStreak, 
  getOverallProgress 
} from './src/utils/storage.ts';
import { DAILY_QUIZZES } from './src/data/quizzes.ts';

console.log('======================================================================');
console.log('RUNNING CONTROLLED SYNC, DEDUPLICATION & DATABASE RESET TEST SUITE');
console.log('======================================================================\n');

// Mock localStorage for Node environment if needed
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}

// STEP 1: INITIAL CLEAN STATE VERIFICATION
resetAllData();
const initialAttempts = getAllAttempts();
const initialCompleted = getCompletedDayIds();
const initialNotifs = getInboxNotifications('admin');
const initialStreak = calculateCurrentStreak(initialAttempts);
const initialOverall = getOverallProgress(DAILY_QUIZZES);

assert.strictEqual(initialAttempts.length, 0, 'Initial attempts must be 0');
assert.strictEqual(initialCompleted.length, 0, 'Initial completed days must be 0 (0/7)');
assert.strictEqual(initialNotifs.length, 0, 'Initial inbox alerts must be 0');
assert.strictEqual(initialStreak, 0, 'Initial learning streak must be 0 Days');
assert.strictEqual(initialOverall.overallMarks, 0, 'Initial overall marks must be 0');
assert.strictEqual(initialOverall.overallAccuracy, 0, 'Initial overall accuracy must be 0%');

console.log('✓ STEP 1 PASSED: Initial clean state verified:');
console.log('  - Completed Days: 0/7');
console.log('  - Top Score: 0%');
console.log('  - Learning Streak: 0 Days');
console.log('  - Inbox Alerts: 0 Unread');
console.log('  - Total Submissions: 0');
console.log('  - Average Score: 0%');

// STEP 2: CONTROLLED FIRST SUBMISSION (DAY 01)
const now = new Date();
const firstAttempt = {
  id: 'test-attempt-day01-1',
  quizId: 'day-01',
  dayNumber: 1,
  studentId: '00000000-0000-0000-0000-000000002002',
  studentName: 'Mahi',
  studentEmail: 'mahi@boddukuri.quiz',
  statesCovered: DAILY_QUIZZES[0].statesCovered,
  timestamp: now.toISOString(),
  formattedDate: '09 November 2026',
  quizDate: '2026-11-09',
  displayDate: '09 November 2026',
  answers: { 'd1-q01': 0 },
  totalQuestions: 30,
  correctCount: 28,
  incorrectCount: 2,
  unansweredCount: 0,
  marksObtained: 28,
  maxMarks: 30,
  percentage: 93,
  accuracy: 93,
  timeTakenSeconds: 140,
  performanceTier: 'excellent',
  performanceMessage: 'Excellent work!',
  quote: {
    quote: 'Knowledge is power.',
    personalNote: 'Great job!'
  },
  sectionBreakdown: {
    previous: { total: 0, correct: 0, incorrect: 0, unanswered: 0, percentage: 0 },
    new: { total: 30, correct: 28, incorrect: 2, unanswered: 0, percentage: 93 }
  }
};

saveQuizAttempt(firstAttempt);

const postSubmit1Attempts = getAllAttempts();
const postSubmit1Completed = getCompletedDayIds();
const postSubmit1Streak = calculateCurrentStreak(postSubmit1Attempts);
const postSubmit1Notifs = getInboxNotifications('admin');

assert.strictEqual(postSubmit1Attempts.length, 1, 'Attempts should now be 1');
assert.strictEqual(postSubmit1Completed.length, 1, 'Completed days must be 1 (1/7)');
assert.strictEqual(postSubmit1Completed[0], 'day-01', 'Completed day must be day-01');
assert.strictEqual(postSubmit1Streak, 1, 'Current streak should be 1');
assert.strictEqual(postSubmit1Notifs.length, 1, 'Admin inbox must receive 1 notification');
assert.strictEqual(postSubmit1Notifs[0].quizId, 'day-01', 'Notification quizId must match');
assert.strictEqual(postSubmit1Notifs[0].percentage, 93, 'Notification percentage must match');

console.log('\n✓ STEP 2 PASSED: Controlled Day 01 submission verified:');
console.log(`  - Completed Days: ${postSubmit1Completed.length}/7`);
console.log(`  - Submissions: ${postSubmit1Attempts.length}`);
console.log(`  - Top Score: ${postSubmit1Attempts[0].percentage}%`);
console.log(`  - Streak: ${postSubmit1Streak} Day`);
console.log(`  - Admin Inbox Notifications: ${postSubmit1Notifs.length}`);

// STEP 3: CONTROLLED REATTEMPT (DAY 01 RE-SUBMISSION - NO DUPLICATION)
const secondAttempt = {
  ...firstAttempt,
  id: 'test-attempt-day01-2',
  timestamp: new Date(now.getTime() + 60000).toISOString(),
  marksObtained: 30,
  correctCount: 30,
  incorrectCount: 0,
  percentage: 100,
  accuracy: 100,
  timeTakenSeconds: 110,
  performanceTier: 'outstanding',
  performanceMessage: 'Outstanding!'
};

saveQuizAttempt(secondAttempt);

const postSubmit2Attempts = getAllAttempts();
const postSubmit2Completed = getCompletedDayIds();
const postSubmit2Notifs = getInboxNotifications('admin');

assert.strictEqual(postSubmit2Attempts.length, 2, 'Total submissions should now be 2');
assert.strictEqual(postSubmit2Completed.length, 1, 'Completed days MUST REMAIN 1/7 (no duplicate count)');
assert.strictEqual(postSubmit2Notifs.length, 2, 'Admin inbox should have 2 notifications');

console.log('\n✓ STEP 3 PASSED: Day 01 Reattempt deduplication verified:');
console.log(`  - Total Submissions: ${postSubmit2Attempts.length}`);
console.log(`  - Distinct Completed Days: ${postSubmit2Completed.length}/7 (strictly deduplicated)`);
console.log(`  - Peak Score: ${Math.max(...postSubmit2Attempts.map(a => a.percentage))}%`);

// STEP 4: FINAL PRISTINE CLEANUP RESET
resetAllData();
const finalAttempts = getAllAttempts();
const finalCompleted = getCompletedDayIds();
const finalNotifs = getInboxNotifications('admin');
const finalStreak = calculateCurrentStreak(finalAttempts);

assert.strictEqual(finalAttempts.length, 0, 'Attempts must be 0 after cleanup');
assert.strictEqual(finalCompleted.length, 0, 'Completed days must be 0 after cleanup');
assert.strictEqual(finalNotifs.length, 0, 'Inbox notifications must be 0 after cleanup');
assert.strictEqual(finalStreak, 0, 'Streak must be 0 after cleanup');

console.log('\n✓ STEP 4 PASSED: Final cleanup verified:');
console.log('  - Production state restored to pristine 0/7 completed days, 0 attempts, 0 notifications, 0 streak.');

console.log('\n======================================================================');
console.log('ALL CONTROLLED RESET & REALTIME DATA TESTS COMPLETED SUCCESSFULLY! 🎉');
console.log('======================================================================\n');
