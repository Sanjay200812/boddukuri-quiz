import assert from 'node:assert';
import {
  TOPIC_CATEGORIES,
  getTopicsList,
  getTopicById,
  getQuizzesForTopic,
  getQuizById,
  getQuestionsForTopic,
  getQuestionsForQuiz,
  getAllTopicQuestions,
  calculateTopicProgress,
  createDraftQuiz,
  publishQuiz,
  unpublishQuiz,
  resolveQuizId,
  moveQuestionToQuiz
} from '../src/data/topics.ts';

console.log('================================================================');
console.log('SPIDEYY QUIZ: TOPIC-WISE MULTIPLE QUIZ SYSTEM VERIFICATION');
console.log('================================================================');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] Test ${totalTests}: ${name}`);
    console.error(`         Error: ${err.message}`);
  }
}

// -----------------------------------------------------------------------------
// TEST 1: All 9 Core Topics Preserved
// -----------------------------------------------------------------------------
runTest('All 9 core curriculum topics exist and are published', () => {
  const topics = getTopicsList();
  const publishedTopics = topics.filter(t => t.isPublished);
  assert.strictEqual(publishedTopics.length, 9, `Expected 9 published topics, got ${publishedTopics.length}`);

  const expectedIds = [
    'static-gk',
    'current-affairs-pib',
    'banking-awareness-fa',
    'central-ministers',
    'ramsar-sites-2026',
    'unesco-2026',
    'unesco-tentative-2026',
    'dance-forms',
    'sixth-schedule'
  ];

  for (const id of expectedIds) {
    const found = getTopicById(id);
    assert.ok(found, `Topic ${id} must exist`);
    assert.strictEqual(found.isPublished, true, `Topic ${id} must be published`);
  }
});

// -----------------------------------------------------------------------------
// TEST 2: Static GK Multiple Quizzes (4 Quizzes)
// -----------------------------------------------------------------------------
runTest('Static GK contains 4 independent published quizzes with 10–12 questions each', () => {
  const staticQuizzes = getQuizzesForTopic('static-gk', false);
  assert.strictEqual(staticQuizzes.length, 4, `Expected 4 quizzes for Static GK, got ${staticQuizzes.length}`);

  assert.strictEqual(staticQuizzes[0].id, 'static-gk-quiz-01');
  assert.strictEqual(staticQuizzes[1].id, 'static-gk-quiz-02');
  assert.strictEqual(staticQuizzes[2].id, 'static-gk-quiz-03');
  assert.strictEqual(staticQuizzes[3].id, 'static-gk-quiz-04');

  const q1 = getQuestionsForQuiz('static-gk-quiz-01');
  const q2 = getQuestionsForQuiz('static-gk-quiz-02');
  const q3 = getQuestionsForQuiz('static-gk-quiz-03');
  const q4 = getQuestionsForQuiz('static-gk-quiz-04');

  assert.strictEqual(q1.length, 10, 'Quiz 1 must have 10 questions');
  assert.strictEqual(q2.length, 12, 'Quiz 2 must have 12 questions');
  assert.strictEqual(q3.length, 12, 'Quiz 3 must have 12 questions');
  assert.strictEqual(q4.length, 12, 'Quiz 4 must have 12 questions');
});

// -----------------------------------------------------------------------------
// TEST 3: Zero Duplicate Questions across Quizzes
// -----------------------------------------------------------------------------
runTest('No duplicate questions between Static GK Quizzes 1, 2, 3, and 4', () => {
  const q1 = getQuestionsForQuiz('static-gk-quiz-01');
  const q2 = getQuestionsForQuiz('static-gk-quiz-02');
  const q3 = getQuestionsForQuiz('static-gk-quiz-03');
  const q4 = getQuestionsForQuiz('static-gk-quiz-04');

  const allIds = [...q1.map(q => q.id), ...q2.map(q => q.id), ...q3.map(q => q.id), ...q4.map(q => q.id)];
  const uniqueIds = new Set(allIds);
  assert.strictEqual(allIds.length, uniqueIds.size, `Duplicate question ID detected! Total: ${allIds.length}, Unique: ${uniqueIds.size}`);

  // Check across entire database
  const allQuestions = getAllTopicQuestions();
  const globalIdSet = new Set();
  for (const q of allQuestions) {
    assert.ok(!globalIdSet.has(q.id), `Global duplicate question ID found: ${q.id}`);
    globalIdSet.add(q.id);
  }
  assert.strictEqual(allQuestions.length, 222, `Expected exactly 222 questions across all topics, got ${allQuestions.length}`);
});

// -----------------------------------------------------------------------------
// TEST 4: Runnable DailyQuiz Construction via getQuizById
// -----------------------------------------------------------------------------
runTest('getQuizById builds complete, runnable DailyQuiz objects', () => {
  const quizObj = getQuizById('static-gk-quiz-02');
  assert.ok(quizObj, 'getQuizById must return a valid object');
  assert.strictEqual(quizObj.id, 'static-gk-quiz-02');
  assert.strictEqual(quizObj.questions.length, 12);
  assert.strictEqual(quizObj.statusLabel, 'Available');
  assert.strictEqual(quizObj.questions[0].options.length, 4);
  assert.strictEqual(typeof quizObj.questions[0].correctAnswer, 'number');
});

// -----------------------------------------------------------------------------
// TEST 5: Legacy ID Backward Compatibility
// -----------------------------------------------------------------------------
runTest('Legacy single-topic IDs map backward-compatibly to Quiz 01', () => {
  assert.strictEqual(resolveQuizId('static-gk'), 'static-gk-quiz-01');
  assert.strictEqual(resolveQuizId('current-affairs'), 'current-affairs-pib-quiz-01');
  assert.strictEqual(resolveQuizId('banking-awareness'), 'banking-awareness-fa-quiz-01');
  assert.strictEqual(resolveQuizId('central-ministers'), 'central-ministers-quiz-01');
  assert.strictEqual(resolveQuizId('ramsar-sites'), 'ramsar-sites-2026-quiz-01');
  assert.strictEqual(resolveQuizId('dance-forms'), 'dance-forms-quiz-01');
  assert.strictEqual(resolveQuizId('sixth-schedule'), 'sixth-schedule-quiz-01');

  // getQuizById must resolve legacy ID seamlessly
  const legacyQuiz = getQuizById('static-gk');
  assert.ok(legacyQuiz, 'getQuizById("static-gk") must resolve');
  assert.strictEqual(legacyQuiz.id, 'static-gk-quiz-01');
});

// -----------------------------------------------------------------------------
// TEST 6: Independent Quiz Completion & Retakes
// -----------------------------------------------------------------------------
runTest('Independent quiz completion: completing Quiz 1 preserves Quiz 2 as unattempted', () => {
  const attempts = [
    {
      id: 'att-1',
      quizId: 'static-gk-quiz-01',
      dayNumber: 1,
      percentage: 90,
      totalQuestions: 10,
      correctCount: 9,
      formattedDate: '24 Nov 2026',
      timestamp: '2026-11-24T06:00:00Z'
    }
  ];
  const completedDayIds = ['static-gk-quiz-01'];

  const progress = calculateTopicProgress('static-gk', attempts, completedDayIds);

  assert.strictEqual(progress.completedQuizzes, 1, 'Exactly 1 quiz completed');
  assert.strictEqual(progress.publishedQuizzes, 4, '4 published quizzes total');
  assert.strictEqual(progress.completionPercentage, 25, 'Completion % must be 25%');

  assert.strictEqual(progress.quizzesMetrics['static-gk-quiz-01'].isCompleted, true);
  assert.strictEqual(progress.quizzesMetrics['static-gk-quiz-02'].isCompleted, false);
  assert.strictEqual(progress.quizzesMetrics['static-gk-quiz-03'].isCompleted, false);
  assert.strictEqual(progress.quizzesMetrics['static-gk-quiz-04'].isCompleted, false);
});

// -----------------------------------------------------------------------------
// TEST 7: Weighted Question-Level Accuracy Calculation (Safety Correction #3)
// -----------------------------------------------------------------------------
runTest('Topic Accuracy is weighted: (Total Correct / Total Attempted) * 100', () => {
  // Attempt 1 on Quiz 1: 10 questions, 10 correct = 100%
  // Attempt 2 on Quiz 2: 12 questions, 6 correct = 50%
  // Simple percentage average would be (100 + 50) / 2 = 75%
  // True weighted accuracy: (10 + 6) / (10 + 12) = 16 / 22 = 72.7% -> 73%
  const attempts = [
    {
      id: 'att-q1',
      quizId: 'static-gk-quiz-01',
      dayNumber: 1,
      percentage: 100,
      totalQuestions: 10,
      correctCount: 10,
      formattedDate: '24 Nov 2026',
      timestamp: '2026-11-24T06:00:00Z'
    },
    {
      id: 'att-q2',
      quizId: 'static-gk-quiz-02',
      dayNumber: 2,
      percentage: 50,
      totalQuestions: 12,
      correctCount: 6,
      formattedDate: '24 Nov 2026',
      timestamp: '2026-11-24T06:10:00Z'
    }
  ];
  const completed = ['static-gk-quiz-01', 'static-gk-quiz-02'];

  const progress = calculateTopicProgress('static-gk', attempts, completed);

  assert.strictEqual(progress.totalQuestionsAttempted, 22);
  assert.strictEqual(progress.totalCorrectAnswers, 16);
  assert.strictEqual(progress.accuracyPercentage, 73, `Weighted accuracy must be 73%, got ${progress.accuracyPercentage}%`);
  assert.strictEqual(progress.completionPercentage, 50, 'Completion must be 50%');
});

// -----------------------------------------------------------------------------
// TEST 8: Admin Draft-by-Default (Safety Correction #4)
// -----------------------------------------------------------------------------
runTest('Admin newly created quiz defaults to draft status and is hidden from students', () => {
  const draftQuiz = createDraftQuiz('static-gk', 'Quiz 5 – Test Himalayan Sanctuaries', 10);
  assert.strictEqual(draftQuiz.status, 'draft', 'Must be status = draft');
  assert.strictEqual(draftQuiz.isPublished, false, 'Must be isPublished = false');

  // Student view must NOT include draft quiz
  const studentQuizzes = getQuizzesForTopic('static-gk', false);
  const foundInStudentView = studentQuizzes.some(q => q.id === draftQuiz.id);
  assert.strictEqual(foundInStudentView, false, 'Draft quiz must not appear in student view');

  // Admin view MUST include draft quiz
  const adminQuizzes = getQuizzesForTopic('static-gk', true);
  const foundInAdminView = adminQuizzes.some(q => q.id === draftQuiz.id);
  assert.strictEqual(foundInAdminView, true, 'Draft quiz must appear in admin view');

  // Publish toggle
  publishQuiz(draftQuiz.id);
  const afterPublish = getQuizzesForTopic('static-gk', false);
  assert.ok(afterPublish.some(q => q.id === draftQuiz.id), 'Published quiz must now appear in student view');

  // Unpublish toggle
  unpublishQuiz(draftQuiz.id);
  const afterUnpublish = getQuizzesForTopic('static-gk', false);
  assert.strictEqual(afterUnpublish.some(q => q.id === draftQuiz.id), false, 'Unpublished quiz must return to draft');
});

// -----------------------------------------------------------------------------
// TEST 9: Sixth Schedule & Dance Forms Curriculum Integration
// -----------------------------------------------------------------------------
runTest('Sixth Schedule and Dance Forms quizzes contain verified questions with citations', () => {
  const danceQuiz = getQuizById('dance-forms-quiz-01');
  assert.ok(danceQuiz, 'Dance forms quiz must exist');
  assert.strictEqual(danceQuiz.questions.length, 10);

  const sixthSchedQuiz = getQuizById('sixth-schedule-quiz-01');
  assert.ok(sixthSchedQuiz, 'Sixth Schedule quiz must exist');
  assert.strictEqual(sixthSchedQuiz.questions.length, 10);

  // Check citations
  const sixthQuestions = getQuestionsForQuiz('sixth-schedule-quiz-01');
  for (const q of sixthQuestions) {
    assert.ok(q.source, `Question ${q.id} must have a verified source citation`);
    assert.strictEqual(q.lastVerifiedDate, '2026-11-24');
  }
});

// -----------------------------------------------------------------------------
// TEST 10: Multi-Student Progress Segregation (Mahi vs Shailu)
// -----------------------------------------------------------------------------
runTest('Multi-student segregation: Mahi progress and Shailu progress remain isolated', () => {
  const mahiAttempts = [
    {
      id: 'mahi-att-1',
      studentId: '61758bc8-51bd-4cf9-b276-a7d6a796b6da',
      quizId: 'static-gk-quiz-01',
      percentage: 100,
      totalQuestions: 10,
      correctCount: 10
    }
  ];
  const mahiCompleted = ['static-gk-quiz-01'];

  const shailuAttempts = []; // Zero progress initially
  const shailuCompleted = [];

  const mahiMetrics = calculateTopicProgress('static-gk', mahiAttempts, mahiCompleted);
  const shailuMetrics = calculateTopicProgress('static-gk', shailuAttempts, shailuCompleted);

  assert.strictEqual(mahiMetrics.completionPercentage, 25);
  assert.strictEqual(mahiMetrics.accuracyPercentage, 100);

  assert.strictEqual(shailuMetrics.completionPercentage, 0);
  assert.strictEqual(shailuMetrics.accuracyPercentage, 0);
  assert.strictEqual(shailuMetrics.totalAttemptsCount, 0);
});

console.log('----------------------------------------------------------------');
console.log(`SUMMARY: ${passedTests} / ${totalTests} tests passed cleanly.`);
console.log('================================================================');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
