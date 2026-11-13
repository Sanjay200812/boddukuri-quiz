import assert from 'node:assert';
import { createClient } from '@supabase/supabase-js';
import { DAILY_SCHEDULE, isDayUnlocked, setDayAdminOverride, getScheduleOverrides, ALL_30_STATES } from './src/utils/schedule.ts';
import { ALL_SCHEDULED_QUIZZES, getQuizForDay } from './src/data/quizzes.ts';
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

  // TEST 3: Special Test Quotas (Semi-Final = 55, Grand Test = 54)
  test('Semi-Final must have exactly 55 questions and Grand Test must have 54 questions (Total 109 Park Questions)', () => {
    const semi = getQuizForDay(8);
    assert.strictEqual(semi.totalQuestions, 55, `Semi-Final totalQuestions must be 55, found ${semi.totalQuestions}`);
    assert.strictEqual(semi.questions.length, 55, `Semi-Final questions array length must be 55`);

    const grand = getQuizForDay(9);
    assert.strictEqual(grand.totalQuestions, 54, `Grand Test totalQuestions must be 54, found ${grand.totalQuestions}`);
    assert.strictEqual(grand.questions.length, 54, `Grand Test questions array length must be 54`);
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
  test('Total curriculum question bank across 9 modules must equal exactly 319 (210 daily + 109 special)', () => {
    const totalQCount = DAILY_SCHEDULE.reduce((acc, s) => acc + s.totalQuestions, 0);
    assert.strictEqual(totalQCount, 319, `Total questions must be 319, found ${totalQCount}`);
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

  // TEST 11: Supabase Cloud Data Verification - Mahi's Authentic Historical 30/30 Attempt
  await asyncTest("Supabase quiz_progress must store Mahi's authentic Day 01 attempt (30/30, 100%, 86s)", async () => {
    const MAHI_UUID = '61758bc8-51bd-4cf9-b276-a7d6a796b6da';
    const { data, error } = await mahiClient
      .from('quiz_progress')
      .select('payload')
      .eq('user_id', MAHI_UUID)
      .single();

    assert.ifError(error);
    assert.ok(data && data.payload, 'Mahi progress payload must exist');
    const attempts = data.payload.attempts || [];
    assert.ok(attempts.length >= 1, `Must have at least 1 attempt, found ${attempts.length}`);

    const mahiAttempt = attempts.find(a => a.id === 'attempt-mahi-day01-100');
    assert.ok(mahiAttempt, 'Must contain authentic attempt-mahi-day01-100');
    assert.strictEqual(mahiAttempt.marksObtained, 30, 'Must have 30 marks');
    assert.strictEqual(mahiAttempt.maxMarks, 30, 'Must have 30 max marks');
    assert.strictEqual(mahiAttempt.totalQuestions, 30, 'Must have 30 total questions');
    assert.strictEqual(mahiAttempt.percentage, 100, 'Must have 100%');
    assert.strictEqual(mahiAttempt.timeTakenSeconds, 86, 'Must be 86 seconds (1m 26s)');
    assert.strictEqual(mahiAttempt.formattedDate, '09 November 2026', 'Must be 09 November 2026');

    // Verify all 30 question answers are present and match 100%
    const answers = mahiAttempt.answers || {};
    const answerKeys = Object.keys(answers);
    assert.strictEqual(answerKeys.length, 30, `Must have all 30 answers recorded, found ${answerKeys.length}`);
    const day1Quiz = getQuizForDay(1);
    day1Quiz.questions.forEach(q => {
      assert.strictEqual(answers[q.id], q.correctAnswer, `Question ${q.id} must be answered with correct answer`);
    });
  });

  // TEST 12: Supabase Cloud Data Verification - Sanju Admin Progress
  await asyncTest("Supabase quiz_progress must synchronize with Sanju Admin account", async () => {
    const SANJU_UUID = '81545df0-2a05-4257-a0f0-2c3342eb9e34';
    const { data, error } = await sanjuClient
      .from('quiz_progress')
      .select('payload')
      .eq('user_id', SANJU_UUID)
      .single();

    assert.ifError(error);
    assert.ok(data && data.payload, 'Sanju progress payload must exist');
    const attempts = data.payload.attempts || [];
    assert.ok(attempts.length >= 1, `Sanju must see at least 1 attempt, found ${attempts.length}`);
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
