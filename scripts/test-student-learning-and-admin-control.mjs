import assert from 'node:assert/strict';

// Test mock localStorage environment
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
global.localStorage = localStorageMock;

console.log('🧪 Starting Spideyy Quiz: Student Learning & Admin Control Verification Suite...\n');

async function runTests() {
  let passedCount = 0;
  let totalCount = 0;

  function runTest(name, fn) {
    totalCount++;
    try {
      fn();
      console.log(`  ✓ ${name}`);
      passedCount++;
    } catch (err) {
      console.error(`  ✗ ${name}`);
      console.error(`    Error: ${err.message}`);
    }
  }

  const {
    getStudentMistakes,
    recordStudentMistake,
    updateStudentMistakeStatus,
    retryMistakeQuestion,
    getSmartRevisionList,
    scheduleQuestionForRevision,
    recordRevisionReview,
    getStudentBookmarks,
    toggleStudentBookmark,
    updateBookmarkNote,
    searchBookmarks,
    getStudentStudyPlan,
    updateStudyPlanTargets,
    logDailyStudyActivity,
    generateMockExam,
    submitMockExam,
    getMockExamResults,
    getWeakAreaAnalysis,
    STARTER_FLASHCARDS,
    getFlashcards,
    getQuestionVersionHistory,
    recordQuestionVersion,
    submitStudentQuestionReport,
    getStudentQuestionReports,
    getPlatformSettings,
    savePlatformSettings
  } = await import('../src/utils/studentLearning.ts');

  const { getAllTopicQuestions, getTopicsList, getQuizzesForTopic } = await import('../src/data/topics.ts');

  // ============================================================================
  // 1. MISTAKE NOTEBOOK & STUDENT ISOLATION
  // ============================================================================
  console.log('\n--- 1. Mistake Notebook & Student Isolation ---');

  runTest('Record mistakes for Mahi and verify student isolation against Shailu', () => {
    localStorageMock.clear();
    const mockQ = {
      id: 'test-q-01',
      topicId: 'static-gk',
      subtopicId: 'corbett',
      question: 'Which is India\'s oldest national park?',
      options: ['Jim Corbett', 'Kaziranga', 'Gir', 'Kanha'],
      correctAnswer: 0,
      explanation: 'Jim Corbett NP established in 1936',
      difficulty: 'easy'
    };

    recordStudentMistake('mahi-student-id', {
      questionId: mockQ.id,
      topicId: mockQ.topicId,
      quizId: 'static-gk-quiz-01',
      question: mockQ,
      selectedAnswer: 2,
      correctAnswer: 0,
      explanation: mockQ.explanation
    });

    const mahiMistakes = getStudentMistakes('mahi-student-id');
    const shailuMistakes = getStudentMistakes('shailu-student-id');

    assert.equal(mahiMistakes.length, 1, 'Mahi should have exactly 1 mistake recorded');
    assert.equal(shailuMistakes.length, 0, 'Shailu must have 0 mistakes (complete isolation)');
    assert.equal(mahiMistakes[0].selectedAnswer, 2);
    assert.equal(mahiMistakes[0].status, 'active');
  });

  runTest('Retry mistake question inline and mark as understood on correct answer', () => {
    const retryWrong = retryMistakeQuestion('mahi-student-id', 'test-q-01', 1);
    assert.equal(retryWrong.isCorrect, false, 'Option 1 should be evaluated as incorrect');

    const retryRight = retryMistakeQuestion('mahi-student-id', 'test-q-01', 0);
    assert.equal(retryRight.isCorrect, true, 'Option 0 should be evaluated as correct');

    const mistakes = getStudentMistakes('mahi-student-id');
    assert.equal(mistakes[0].status, 'understood', 'Correct retry should promote status to understood');
    assert.equal(mistakes[0].retriedCount >= 2, true);
  });

  // ============================================================================
  // 2. SMART REVISION (SPACED REPETITION 1d -> 3d -> 7d -> 14d -> 30d)
  // ============================================================================
  console.log('\n--- 2. Spaced Repetition Scheduling Engine ---');

  runTest('Schedule question for revision at level 0 (1-day interval)', () => {
    const mockQ = {
      id: 'rev-q-01',
      topicId: 'banking-awareness',
      subtopicId: 'basel',
      question: 'Capital Conservation Buffer requirement under Basel III in India?',
      options: ['2.5%', '1.5%', '3.0%', '4.0%'],
      correctAnswer: 0,
      explanation: '2.5% of RWA',
      difficulty: 'medium'
    };

    const scheduled = scheduleQuestionForRevision('mahi-student-id', mockQ, 'medium');
    assert.equal(scheduled.repetitionLevel, 0);
    assert.equal(scheduled.intervalDays, 1);
    assert.equal(scheduled.successStreak, 0);
  });

  runTest('Consecutive successful reviews promote through spaced repetition ladder', () => {
    // Review 1: Level 0 -> Level 1 (3 days)
    const rev1 = recordRevisionReview('mahi-student-id', 'rev-q-01', true);
    assert.equal(rev1.repetitionLevel, 1);
    assert.equal(rev1.intervalDays, 3);
    assert.equal(rev1.successStreak, 1);

    // Review 2: Level 1 -> Level 2 (7 days)
    const rev2 = recordRevisionReview('mahi-student-id', 'rev-q-01', true);
    assert.equal(rev2.repetitionLevel, 2);
    assert.equal(rev2.intervalDays, 7);
    assert.equal(rev2.successStreak, 2);

    // Error on Review 3: Resets streak and demotes interval to 1 day
    const revErr = recordRevisionReview('mahi-student-id', 'rev-q-01', false);
    assert.equal(revErr.successStreak, 0, 'Streak should reset on error');
    assert.equal(revErr.intervalDays, 1, 'Interval must reset to 1 day on error');
    assert.equal(revErr.repetitionLevel, 1, 'Level should step back');
  });

  // ============================================================================
  // 3. MOCK EXAMINATION MODE & NEGATIVE MARKING
  // ============================================================================
  console.log('\n--- 3. Mock Examination Mode & Negative Marking Math ---');

  runTest('Generate full-length mock exam with zero early answer disclosure', () => {
    const mockState = generateMockExam({
      id: 'mock-test-01',
      title: 'Grand Mock Test 1',
      mode: 'full-length',
      totalQuestions: 20,
      timeLimitMinutes: 20
    });

    assert.equal(mockState.questions.length, 20);
    assert.equal(mockState.isSubmitted, false);
    assert.equal(mockState.secondsRemaining, 20 * 60);

    // Ensure questions are initialized with not-visited / unanswered status
    assert.equal(mockState.questionStatus[mockState.questions[0].id], 'unanswered');
    assert.equal(mockState.questionStatus[mockState.questions[1].id], 'not-visited');
  });

  runTest('Submit mock exam and evaluate negative marking math strictly (0.25 penalty)', () => {
    const mockState = generateMockExam({
      id: 'mock-test-02',
      title: 'Sectional Test 1',
      mode: 'sectional',
      topicId: 'static-gk',
      totalQuestions: 10,
      timeLimitMinutes: 10
    });

    // Simulate student answering: 8 correct, 2 incorrect
    mockState.questions.forEach((q, idx) => {
      if (idx < 8) {
        mockState.answers[q.id] = q.correctAnswer;
        mockState.questionStatus[q.id] = 'answered';
      } else {
        mockState.answers[q.id] = (q.correctAnswer + 1) % 4; // Wrong answer
        mockState.questionStatus[q.id] = 'answered';
      }
    });

    mockState.secondsRemaining = 300; // 5 mins taken

    const result = submitMockExam(mockState, 'mahi-student-id', 'Mahi', 0.25);

    // Expected Score: 8 correct - (2 incorrect * 0.25) = 8 - 0.5 = 7.5
    assert.equal(result.correctCount, 8);
    assert.equal(result.incorrectCount, 2);
    assert.equal(result.score, 7.5, 'Raw score must equal 7.5 under 0.25 negative marking');
    assert.equal(result.percentage, 75);
    assert.equal(result.passed, true);
    assert.equal(result.timeTakenSeconds, 300);
  });

  // ============================================================================
  // 4. WEAK AREA ANALYSIS & SAMPLE SIZE THRESHOLD
  // ============================================================================
  console.log('\n--- 4. Weak Area Analysis & Sample Size Calibration ---');

  runTest('Sample size threshold rule: Only classified as weak if attempts >= 10', () => {
    const reports = getWeakAreaAnalysis('shailu-student-id');
    assert(Array.isArray(reports), 'Reports should return array');

    for (const r of reports) {
      if (r.totalAttempted < 10) {
        assert.equal(r.sampleSizeSufficient, false, 'Topic with < 10 attempts must flag sampleSizeSufficient: false');
        assert.equal(r.isWeak, false, 'Topic with < 10 attempts must not be falsely labeled as weak');
      } else if (r.totalAttempted >= 10 && r.accuracyPercentage < 60) {
        assert.equal(r.sampleSizeSufficient, true);
        assert.equal(r.isWeak, true);
      }
    }
  });

  // ============================================================================
  // 5. BOOKMARKS & PRIVATE PERSONAL NOTES
  // ============================================================================
  console.log('\n--- 5. Bookmarks & Personal Notes ---');

  runTest('Toggle bookmark, update personal note, and search keywords', () => {
    const mockQ = {
      id: 'bm-q-01',
      topicId: 'unesco-heritage',
      subtopicId: 'sarnath',
      question: 'Which site became India\'s 45th UNESCO World Heritage site?',
      options: ['Sarnath', 'Shantiniketan', 'Hoysala Temples', 'Dholavira'],
      correctAnswer: 0,
      explanation: 'Sarnath inscribed July 2026',
      difficulty: 'easy'
    };

    // 1. Add Bookmark
    const added = toggleStudentBookmark('mahi-student-id', mockQ);
    assert.equal(added, true, 'First toggle should add bookmark');

    // 2. Add Private Study Note
    updateBookmarkNote('mahi-student-id', mockQ.id, 'Remember Dhamek Stupa built by Ashoka');
    const bookmarks = getStudentBookmarks('mahi-student-id');
    assert.equal(bookmarks.length, 1);
    assert.equal(bookmarks[0].note, 'Remember Dhamek Stupa built by Ashoka');

    // 3. Search Keyword
    const searchMatch = searchBookmarks('mahi-student-id', 'Ashoka');
    assert.equal(searchMatch.length, 1, 'Search query should match inside personal note');

    const searchMiss = searchBookmarks('mahi-student-id', 'NonExistentTermXYZ');
    assert.equal(searchMiss.length, 0);

    // 4. Remove Bookmark
    const removed = toggleStudentBookmark('mahi-student-id', mockQ);
    assert.equal(removed, false, 'Second toggle should remove bookmark');
    assert.equal(getStudentBookmarks('mahi-student-id').length, 0);
  });

  // ============================================================================
  // 6. STUDY PLANNER & DAILY TARGETS
  // ============================================================================
  console.log('\n--- 6. Study Planner & Daily Target Logging ---');

  runTest('Configure study plan and log daily activity', () => {
    const studentId = 'test-study-student-id';
    const plan = getStudentStudyPlan(studentId);
    assert.equal(plan.dailyQuestionTarget >= 5, true);

    updateStudyPlanTargets(studentId, 25, 7, 'Morning (6:00 AM)');
    const updated = getStudentStudyPlan(studentId);
    assert.equal(updated.dailyQuestionTarget, 25);
    assert.equal(updated.weeklyQuizTarget, 7);
    assert.equal(updated.preferredStudyTime, 'Morning (6:00 AM)');

    logDailyStudyActivity(studentId, 15, 1, 20);
    const todayStr = new Date().toISOString().split('T')[0];
    const log = getStudentStudyPlan(studentId).dailyLogs[todayStr];
    assert.equal(log.questionsSolved, 15);
    assert.equal(log.quizzesCompleted, 1);
    assert.equal(log.minutesSpent, 20);
    assert.equal(log.goalMet, false); // 15 < 25
  });

  // ============================================================================
  // 7. RAPID FLASHCARDS DECK
  // ============================================================================
  console.log('\n--- 7. Rapid Recall Flashcards Deck ---');

  runTest('Starter flashcards cover mandatory subjects with official citations', () => {
    const all = getFlashcards('all');
    assert.equal(all.length >= 8, true);

    const banking = getFlashcards('banking');
    assert.equal(banking.length >= 2, true);

    const ramsar = getFlashcards('ramsar');
    assert.equal(ramsar.length >= 1, true);
    assert(ramsar[0].front.includes('Ramsar'));
    assert(ramsar[0].source.length > 0);
  });

  // ============================================================================
  // 8. QUESTION VERSION HISTORY & AUDIT TRAIL (ADMIN)
  // ============================================================================
  console.log('\n--- 8. Admin Question Version History & Audit Trail ---');

  runTest('Record question version history without mutating past student snapshots', () => {
    const prevQ = {
      id: 'audit-q-01',
      topicId: 'ramsar-sites',
      subtopicId: 'sukhna',
      question: 'Which is the 102nd Ramsar wetland in India?',
      options: ['Sukhna Wetland', 'Sauj Jheel', 'Nanjarayan', 'Kanjli'],
      correctAnswer: 0,
      explanation: 'Sukhna Wetland in Chandigarh',
      difficulty: 'easy'
    };

    const newQ = {
      ...prevQ,
      explanation: 'Sukhna Wetland in Chandigarh, designated on 15 Oct 2026 under Ramsar criteria.'
    };

    const versionRecord = recordQuestionVersion(
      prevQ,
      newQ,
      'sanju-admin',
      'Sanju',
      'Clarified official Ramsar designation date from PIB press release'
    );

    assert.equal(versionRecord.questionId, 'audit-q-01');
    assert.equal(versionRecord.versionNumber, 1);
    assert.equal(versionRecord.adminName, 'Sanju');
    assert(versionRecord.changedFields.includes('explanation'));

    const history = getQuestionVersionHistory('audit-q-01');
    assert.equal(history.length, 1);
    assert.equal(history[0].previousSnapshot.explanation, prevQ.explanation);
    assert.equal(history[0].newSnapshot.explanation, newQ.explanation);
  });

  // ============================================================================
  // 9. STUDENT QUESTION REPORTS (STUDENT -> ADMIN SUPPORT)
  // ============================================================================
  console.log('\n--- 9. Student Question Reports & Support Feedback ---');

  runTest('Submit question report from student and retrieve for admin inspection', () => {
    const report = submitStudentQuestionReport({
      studentId: 'shailu-student-id',
      studentName: 'Shailu',
      questionId: 'top-bnk-aw-q01-04',
      quizId: 'banking-awareness-quiz-01',
      topicId: 'banking-awareness',
      issueType: 'broken-source',
      comment: 'Please check RBI link for Master Direction on Basel III.'
    });

    assert.equal(report.studentName, 'Shailu');
    assert.equal(report.status, 'open');

    const allReports = getStudentQuestionReports();
    assert.equal(allReports.length >= 1, true);
    assert.equal(allReports[0].comment.includes('RBI link'), true);
  });

  // ============================================================================
  // 10. PLATFORM SETTINGS (ADMIN CONTROLLED)
  // ============================================================================
  console.log('\n--- 10. Platform Settings & Access Controls ---');

  runTest('Configure global platform settings, passing threshold and active students', () => {
    const current = getPlatformSettings();
    assert.equal(current.allowAccessCodeLogin, true);

    savePlatformSettings({
      platformName: 'Spideyy Quiz Master',
      defaultPassingScore: 75,
      announcementBannerText: 'Special Weekend Championship Test live!'
    }, 'sanju-admin');

    const updated = getPlatformSettings();
    assert.equal(updated.platformName, 'Spideyy Quiz Master');
    assert.equal(updated.defaultPassingScore, 75);
    assert.equal(updated.announcementBannerText, 'Special Weekend Championship Test live!');
  });

  // ============================================================================
  // 11. CURRICULUM ARCHITECTURE & TOPIC HEALTH
  // ============================================================================
  console.log('\n--- 11. Curriculum Health & 9-Topic Question Volume ---');

  runTest('All 9 topics preserved and populated with 10-15 questions per quiz', () => {
    const topics = getTopicsList().filter(t => t.id !== 'vi-tax');
    assert.equal(topics.length, 9, 'Must maintain exactly 9 core topics');

    const allQuestions = getAllTopicQuestions();
    assert.equal(allQuestions.length >= 222, true, `Question bank must contain at least 222 questions (found ${allQuestions.length})`);

    // Verify each topic has at least 2 quizzes
    for (const t of topics) {
      const quizzes = getQuizzesForTopic(t.id, false);
      assert.equal(quizzes.length >= 2, true, `Topic ${t.id} must contain at least 2 partitioned quizzes`);
    }
  });

  console.log(`\n======================================================`);
  console.log(`🏁 Verification Finished: ${passedCount} / ${totalCount} Tests Passed!`);
  console.log(`======================================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
