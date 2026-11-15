import assert from 'node:assert';
import { createClient } from '@supabase/supabase-js';
import { DAILY_SCHEDULE, isDayUnlocked, setDayAdminOverride, getScheduleOverrides } from './src/utils/schedule.ts';
import { ALL_30_STATES } from './src/data/states.ts';
import { ALL_SCHEDULED_QUIZZES, getQuizForDay, validateQuizForPublishing } from './src/data/quizzes.ts';
import { STATE_REPOSITORIES } from './src/data/stateRepositories.ts';

const SUPABASE_URL = 'https://oohxmqohiaspgawsqacv.supabase.co';
const SUPABASE_ANON = 'sb_publishable_OdIzjhP5naAmjuG5q5MpMA_GopYbTye';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

async function runTestSuite() {
  console.log('\n===============================================================');
  console.log("  BODDUKURI'S QUIZ — FULL PRODUCTION & DATA VERIFICATION SUITE");
  console.log('===============================================================\n');

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  [PASS] Test ${total}: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] Test ${total}: ${name}`);
      console.error('         ' + err.message);
    }
  }

  async function asyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  [PASS] Test ${total}: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] Test ${total}: ${name}`);
      console.error('         ' + err.message);
    }
  }

  // TEST 1: Curriculum Module Count
  test('Curriculum must contain exactly 9 modules (7 Days + Semi-Final + Grand Test)', () => {
    assert.strictEqual(DAILY_SCHEDULE.length, 9);
    assert.strictEqual(ALL_SCHEDULED_QUIZZES.length, 9);
  });

  // TEST 2: Daily Quizzes Question Quotas (Exactly 30 for Days 01-07)
  test('Daily Quizzes 01 through 07 must have EXACTLY 30 questions each', () => {
    for (let day = 1; day <= 7; day++) {
      const q = getQuizForDay(day);
      assert.strictEqual(q.totalQuestions, 30, `Day ${day} must have 30 questions, found ${q.totalQuestions}`);
      assert.strictEqual(q.questions.length, 30, `Day ${day} questions array length must be 30, found ${q.questions.length}`);
      const sched = DAILY_SCHEDULE.find(s => s.dayNumber === day);
      assert.strictEqual(sched.totalQuestions, 30, `Day ${day} schedule quota must be 30`);
    }
  });

  // TEST 3: Special Test Quotas (Semi-Final = 30, Grand Test = 60)
  test('Semi-Final must have exactly 30 questions and Grand Test must have 60 questions (All 30 States Represented)', () => {
    const semi = getQuizForDay(8);
    assert.strictEqual(semi.totalQuestions, 30, `Semi-Final totalQuestions must be 30, found ${semi.totalQuestions}`);
    assert.strictEqual(semi.questions.length, 30, `Semi-Final questions array length must be 30`);

    const grand = getQuizForDay(9);
    assert.strictEqual(grand.totalQuestions, 60, `Grand Test totalQuestions must be 60, found ${grand.totalQuestions}`);
    assert.strictEqual(grand.questions.length, 60, `Grand Test questions array length must be 60`);
  });

  // TEST 4: Cumulative Revision Split
  test('Days 02 to 07 must contain 20 questions from new states and 10 revision questions', () => {
    for (let day = 2; day <= 7; day++) {
      const q = getQuizForDay(day);
      const newQs = q.questions.filter(qu => qu.section === 'new');
      const revQs = q.questions.filter(qu => qu.section === 'previous');
      assert.strictEqual(newQs.length, 20, `Day ${day} must have 20 new questions, found ${newQs.length}`);
      assert.strictEqual(revQs.length, 10, `Day ${day} must have 10 revision questions, found ${revQs.length}`);
      assert.strictEqual(newQs.length + revQs.length, 30, `Day ${day} total must equal 30`);
    }
  });

  // TEST 5: Total Unique National Parks Mapped
  test('Curriculum must cover exactly 109 unique National Parks across 30 States/UTs', () => {
    assert.strictEqual(ALL_30_STATES.length, 30, `Must have 30 States/UTs, found ${ALL_30_STATES.length}`);
    const uniqueParks = new Set();
    ALL_30_STATES.forEach(st => {
      const repo = STATE_REPOSITORIES[st];
      assert.ok(repo, `State repository must exist for ${st}`);
      assert.ok(repo.stateInfo.parks.length > 0, `${st} must have at least 1 park`);
      assert.ok(repo.questions.length >= 5, `${st} must have at least 5 questions, found ${repo.questions.length}`);
      repo.stateInfo.parks.forEach(p => uniqueParks.add(p.name));
    });
    assert.strictEqual(uniqueParks.size, 109, `Must have exactly 109 unique national parks, found ${uniqueParks.size}`);
  });

  // TEST 6: Total System Curriculum Questions
  test('Total curriculum question bank across 9 modules must equal exactly 300 (210 daily + 30 semi + 60 grand)', () => {
    const totalQCount = DAILY_SCHEDULE.reduce((acc, s) => acc + s.totalQuestions, 0);
    assert.strictEqual(totalQCount, 300, `Total questions must be 300, found ${totalQCount}`);
  });

  // TEST 7: Day 01 Question IDs backward compatibility
  test('Day 01 question IDs must preserve historical format (d1-[state]-q[1-5])', () => {
    const day1 = getQuizForDay(1);
    day1.questions.forEach(q => {
      assert.match(q.id, /^d1-[a-z0-9-]+-q[1-5]$/, `Day 1 question ID ${q.id} must match format`);
    });
  });

  // TEST 8: Day Unlocking Rules
  test('Day 01 must be unlocked; Days 02-07 must be locked by default', () => {
    assert.strictEqual(isDayUnlocked(1, []), true, 'Day 01 must be unlocked');
    assert.strictEqual(isDayUnlocked('day-01', []), true, 'Day 01 by id must be unlocked');

    for (let day = 2; day <= 7; day++) {
      assert.strictEqual(isDayUnlocked(day, []), false, `Day ${day} must be locked by default`);
    }
    assert.strictEqual(isDayUnlocked(8, []), false, 'Semi-Final must be locked by default');
    assert.strictEqual(isDayUnlocked(9, []), false, 'Grand Final must be locked by default');
  });

  // TEST 9: Completed Day is always accessible for review
  test('Completed days are always unlocked for student review', () => {
    assert.strictEqual(isDayUnlocked(2, ['day-02']), true, 'Day 2 must be unlocked if completed');
    assert.strictEqual(isDayUnlocked('semi-final', ['semi-final']), true, 'Semi-Final must be unlocked if completed');
  });

  // TEST 10: Authentication Sign-in Validation
  let mahiClient;
  let sanjuClient;
  await asyncTest('Authentication via access codes 2002 (Mahi) and 2718 (Sanju) must authenticate cleanly', async () => {
    // Test Mahi login with 2002
    const mahiRes = await supabase.auth.signInWithPassword({
      email: 'boddukurimahima1234@gmail.com',
      password: '2002'
    });
    assert.ifError(mahiRes.error);
    assert.strictEqual(mahiRes.data.user.id, '61758bc8-51bd-4cf9-b276-a7d6a796b6da', 'Mahi user ID must match');
    mahiClient = createClient(SUPABASE_URL, SUPABASE_ANON, {
      global: { headers: { Authorization: `Bearer ${mahiRes.data.session.access_token}` } }
    });

    // Test Sanju login with 2718
    const sanjuRes = await supabase.auth.signInWithPassword({
      email: 'boddukurisanjay@gmail.com',
      password: '2718'
    });
    assert.ifError(sanjuRes.error);
    assert.strictEqual(sanjuRes.data.user.id, '81545df0-2a05-4257-a0f0-2c3342eb9e34', 'Sanju user ID must match');
    sanjuClient = createClient(SUPABASE_URL, SUPABASE_ANON, {
      global: { headers: { Authorization: `Bearer ${sanjuRes.data.session.access_token}` } }
    });
  });

  // TEST 11: Supabase Cloud Fresh-Start State Verification (Phase 6)
  await asyncTest("Supabase quiz_progress must be in a clean fresh-start state for Mahi (0 attempts, 0 completed days)", async () => {
    const MAHI_UUID = '61758bc8-51bd-4cf9-b276-a7d6a796b6da';
    const { data, error } = await mahiClient
      .from('quiz_progress')
      .select('payload')
      .eq('user_id', MAHI_UUID)
      .single();

    assert.ifError(error);
    assert.ok(data && data.payload, 'Mahi progress payload must exist');
    const attempts = data.payload.attempts || [];
    assert.strictEqual(attempts.length, 0, `Mahi must have 0 attempts on fresh start, found ${attempts.length}`);
    const completedDays = data.payload.completedDays || [];
    assert.strictEqual(completedDays.length, 0, `Mahi must have 0 completed days on fresh start, found ${completedDays.length}`);
    const notifications = data.payload.notifications || [];
    assert.strictEqual(notifications.length, 0, `Mahi must have 0 notifications on fresh start, found ${notifications.length}`);
    assert.ok(data.payload.settings, 'Mahi settings must be preserved');
    assert.strictEqual(data.payload.settings.studentName, 'Mahi', 'Student name must be Mahi');
  });

  // TEST 12: Supabase Cloud Data Verification - Sanju Admin Access to Student Progress
  await asyncTest("Supabase quiz_progress must synchronize with Sanju Admin account in clean state", async () => {
    const MAHI_UUID = '61758bc8-51bd-4cf9-b276-a7d6a796b6da';
    const { data, error } = await sanjuClient
      .from('quiz_progress')
      .select('user_id, payload, updated_at');

    assert.ifError(error);
    assert.ok(data && data.length >= 1, `Sanju must see student progress records, found ${data?.length}`);
    const mahiRecord = data.find(r => r.user_id === MAHI_UUID);
    assert.ok(mahiRecord, 'Sanju must be able to view Mahi student progress');
    const mahiAttempts = mahiRecord.payload.attempts || [];
    assert.strictEqual(mahiAttempts.length, 0, `Mahi must have 0 attempts, found ${mahiAttempts.length}`);
  });

  // TEST 13: Question Validation Engine (Phase 5)
  test('Question Validation Engine must approve all 9 production quizzes without errors', () => {
    ALL_SCHEDULED_QUIZZES.forEach(quiz => {
      const res = validateQuizForPublishing(quiz);
      assert.strictEqual(res.isValid, true, `Quiz ${quiz.title} must pass validation: ${res.errors.join('; ')}`);
      assert.strictEqual(res.errors.length, 0, `Quiz ${quiz.title} must have 0 validation errors`);
    });
  });

  // TEST 14: Cloud Quiz Storage Service (Phase 2 & 3)
  await asyncTest('Cloud Quiz Storage Service must validate and support versioned storage in Supabase', async () => {
    // Verify Day 01 quiz validation
    const day1Quiz = getQuizForDay(1);
    const validRes = validateQuizForPublishing(day1Quiz);
    assert.strictEqual(validRes.isValid, true, 'Day 01 must be valid for cloud publishing');

    // Test saving an immutable version snapshot via sanjuClient
    const testSnapshotKey = 'quiz_version:test-quiz:v1';
    const { error: upsertErr } = await sanjuClient
      .from('admin_schedule_config')
      .upsert({
        key: testSnapshotKey,
        payload: {
          quizId: 'test-quiz',
          version: 1,
          test: true,
          timestamp: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      });
    assert.ifError(upsertErr, 'Admin must be able to write immutable version snapshot');

    // Test anon reading the immutable version snapshot
    const { data: readData, error: readErr } = await supabase
      .from('admin_schedule_config')
      .select('payload')
      .eq('key', testSnapshotKey)
      .single();
    assert.ifError(readErr, 'Anon client must be able to read immutable version snapshot');
    assert.strictEqual(readData.payload.version, 1);

    // Clean up test key
    await sanjuClient.from('admin_schedule_config').delete().eq('key', testSnapshotKey);
  });

  // TEST 15: Full Admin -> Supabase -> Student End-to-End Workflow & Isolated Test
  await asyncTest('Full Admin -> Supabase -> Student Workflow (Publish -> Retrieve -> Submit -> Score -> Inspect -> Cleanup)', async () => {
    const MAHI_UUID = '61758bc8-51bd-4cf9-b276-a7d6a796b6da';
    const day1 = getQuizForDay(1);

    // 1. Admin publishes test quiz version
    const testQuizKey = 'quiz:test-e2e-workflow';
    const { error: pubErr } = await sanjuClient
      .from('admin_schedule_config')
      .upsert({
        key: testQuizKey,
        payload: {
          quiz: { ...day1, id: 'test-e2e-workflow', title: 'Test E2E Workflow' },
          questions: day1.questions,
          version: 1,
          status: 'published',
          publishedAt: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      });
    assert.ifError(pubErr, 'Admin publishing must succeed');

    // 2. Student retrieves published quiz from Supabase
    const { data: studentQuizData, error: fetchErr } = await mahiClient
      .from('admin_schedule_config')
      .select('payload')
      .eq('key', testQuizKey)
      .single();
    assert.ifError(fetchErr, 'Student must retrieve published quiz');
    assert.strictEqual(studentQuizData.payload.status, 'published');
    assert.strictEqual(studentQuizData.payload.questions.length, 30);

    // 3. Student submits test attempt with answers and snapshot
    const testAnswers = {};
    day1.questions.forEach((q, idx) => {
      testAnswers[q.id] = idx % 2 === 0 ? q.correctAnswer : (q.correctAnswer + 1) % 4; // 15 correct, 15 wrong
    });

    const testAttempt = {
      id: 'attempt-isolated-test-01',
      quizId: 'test-e2e-workflow',
      quizVersion: 1,
      dayNumber: 1,
      studentId: MAHI_UUID,
      studentName: 'Mahi',
      statesCovered: day1.statesCovered,
      timestamp: new Date().toISOString(),
      formattedDate: '15 November 2026, 05:25 pm',
      answers: testAnswers,
      questionsSnapshot: day1.questions,
      totalQuestions: 30,
      correctCount: 15,
      incorrectCount: 15,
      unansweredCount: 0,
      marksObtained: 15,
      maxMarks: 30,
      percentage: 50,
      timeTakenSeconds: 120,
      status: 'completed'
    };

    // Save attempt in Mahi's progress
    const { data: mahiCurrent } = await mahiClient.from('quiz_progress').select('payload').eq('user_id', MAHI_UUID).single();
    const updatedPayload = {
      ...mahiCurrent.payload,
      attempts: [testAttempt],
      completedDays: ['test-e2e-workflow']
    };

    const { error: submitErr } = await mahiClient
      .from('quiz_progress')
      .upsert({ user_id: MAHI_UUID, payload: updatedPayload, updated_at: new Date().toISOString() });
    assert.ifError(submitErr, 'Student submission must succeed');

    // 4. Admin inspects the student attempt
    const { data: adminInspectData } = await sanjuClient.from('quiz_progress').select('payload').eq('user_id', MAHI_UUID).single();
    const adminSeenAttempt = adminInspectData.payload.attempts.find(a => a.id === 'attempt-isolated-test-01');
    assert.ok(adminSeenAttempt, 'Admin must see student attempt');
    assert.strictEqual(adminSeenAttempt.marksObtained, 15);
    assert.strictEqual(adminSeenAttempt.percentage, 50);
    assert.strictEqual(adminSeenAttempt.questionsSnapshot.length, 30);

    // 5. Cleanup test records: restore Mahi progress back to 100% clean fresh-start state
    const cleanPayload = {
      ...mahiCurrent.payload,
      attempts: [],
      completedDays: []
    };
    await mahiClient.from('quiz_progress').upsert({ user_id: MAHI_UUID, payload: cleanPayload, updated_at: new Date().toISOString() });
    await sanjuClient.from('admin_schedule_config').delete().eq('key', testQuizKey);

    // Verify cleanup
    const { data: verifyClean } = await mahiClient.from('quiz_progress').select('payload').eq('user_id', MAHI_UUID).single();
    assert.strictEqual(verifyClean.payload.attempts.length, 0, 'Must be 0 attempts after cleanup');
    assert.strictEqual(verifyClean.payload.completedDays.length, 0, 'Must be 0 completed days after cleanup');
  });

  console.log('\n===============================================================');
  console.log(`  TEST RESULTS: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('===============================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
