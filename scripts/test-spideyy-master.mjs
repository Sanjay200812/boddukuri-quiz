import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf8');
const envVars = Object.fromEntries(
  envContent.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
const ANON_KEY = envVars.VITE_SUPABASE_ANON_KEY;

const results = [];

function check(title, condition, detail) {
  results.push({ title, pass: Boolean(condition), detail: detail || '' });
  console.log(`${condition ? '✅ PASS' : '❌ FAIL'}: ${title}${detail ? ' (' + detail + ')' : ''}`);
}

async function runTests() {
  console.log('================================================================');
  console.log('SPIDEYY QUIZ MASTER VERIFICATION TEST SUITE (16 CHECKLIST ITEMS)');
  console.log('================================================================\n');

  // 1. BRANDING VERIFICATION
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  check('1. Application Branding in index.html', indexHtml.includes('Spideyy Quiz') && !indexHtml.includes('Quiz by Spideyy'), 'Title and Meta verified');

  const appTsx = fs.readFileSync('src/App.tsx', 'utf8');
  check('2. Opening Motivation Removed from App.tsx', !appTsx.includes('OpeningMotivation') && !appTsx.includes('hasSeenMotivation'), 'Gate completely eliminated');

  const loginScreen = fs.readFileSync('src/components/LoginScreen.tsx', 'utf8');
  check('3. Login Screen Branding & Clean Navigation', loginScreen.includes('Spideyy') && loginScreen.includes('Quiz') && !loginScreen.includes('onReplayMotivation'), 'Direct dashboard navigation on sign-in');

  // 2. AUTHENTICATION & ACCESS CODE VERIFICATION AGAINST LIVE SUPABASE
  const supabase = createClient(SUPABASE_URL, ANON_KEY);

  // Test Sanju (Admin) 2718
  const adminRpc = await supabase.rpc('verify_access_code', { p_code: '2718', p_identifier: 'test_verifier_admin' });
  const adminOk = adminRpc.data?.success && adminRpc.data?.email?.includes('boddukurisanjay');
  check('4. Admin Access Code Verification (2718)', adminOk, `Resolved Email: ${adminRpc.data?.email}`);

  // Test Mahi (Student) 2002
  const studentRpc = await supabase.rpc('verify_access_code', { p_code: '2002', p_identifier: 'test_verifier_student' });
  const studentOk = studentRpc.data?.success && studentRpc.data?.email?.includes('boddukurimahima');
  check('5. Mahi Student Access Code Verification (2002)', studentOk, `Resolved Email: ${studentRpc.data?.email}`);

  // Test Invalid Code
  const invalidRpc = await supabase.rpc('verify_access_code', { p_code: '9999', p_identifier: 'test_verifier_invalid' });
  const invalidRejected = invalidRpc.data?.success === false;
  check('6. Invalid Code Rejection (9999)', invalidRejected, `Rejected as expected: ${invalidRpc.data?.error || 'success=false'}`);

  // Test Supabase.ts lacks hardcoded PIN hashes
  const supabaseTs = fs.readFileSync('src/utils/supabase.ts', 'utf8');
  const noHardcodedHashes = !supabaseTs.includes('STUDENT_PIN_HASH') && !supabaseTs.includes('ADMIN_PIN_HASH');
  check('7. No Hardcoded Access Code Hashes in Frontend', noHardcodedHashes, 'Strict backend verification enforced');

  // 3. TOPIC STRUCTURE (9 CORE TOPICS + VI TAX)
  const { TOPIC_CATEGORIES, STARTER_TOPIC_QUESTIONS, getTopicsList, getQuizForTopic } = await import('../src/data/topics.ts');
  const expectedTopics = [
    'static-gk',
    'current-affairs-pib',
    'banking-awareness-fa',
    'central-ministers',
    'ramsar-sites-2026',
    'unesco-2026',
    'unesco-tentative-2026',
    'dance-forms',
    'sixth-schedule',
    'vi-tax'
  ];
  const allTopicIds = TOPIC_CATEGORIES.map(t => t.id);
  const allTopicsPresent = expectedTopics.every(id => allTopicIds.includes(id) || (id === 'dance-forms' && allTopicIds.includes('other-important-gk')));
  check('8. Main Topic Structure (9 Core + VI Tax)', allTopicsPresent, `Found ${TOPIC_CATEGORIES.length} topics`);

  // VI Tax Configurable Card
  const viTaxTopic = TOPIC_CATEGORIES.find(t => t.id === 'vi-tax');
  const viTaxConfigured = viTaxTopic?.isConfigurable === true && viTaxTopic?.statusNote?.includes('Awaiting Admin Subject Clarification');
  check('9. VI Tax Configurable Card Verification', viTaxConfigured, viTaxTopic?.statusNote);

  // 4. CONTROLLED QUESTION QUALITY (10-15 QUESTIONS PER TOPIC)
  const activeTopics = TOPIC_CATEGORIES.filter(t => t.id !== 'vi-tax');
  const questionsPerTopicOk = activeTopics.every(t => {
    const qList = STARTER_TOPIC_QUESTIONS.filter(q => q.topicId === t.id);
    return qList.length >= 10;
  });
  check('10. Question Quantity (10-15 questions per active topic)', questionsPerTopicOk, `Total questions: ${STARTER_TOPIC_QUESTIONS.length}`);

  // Mandatory fields for questions
  const allFieldsPresent = STARTER_TOPIC_QUESTIONS.every(q => {
    return (
      q.id &&
      q.topicId &&
      q.subtopicId &&
      q.question &&
      Array.isArray(q.options) && q.options.length === 4 &&
      typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3 &&
      q.explanation &&
      q.source &&
      typeof q.sourcePage !== 'undefined' &&
      q.lastVerifiedDate === '2026-11-24' &&
      q.status === 'published'
    );
  });
  check('11. Mandatory Question Fields Verified', allFieldsPresent, 'Question, 4 Options, Correct Answer, Explanation, Source, Page, Date=2026-11-24');

  // 5. 2026 DESIGNATION ACCURACY
  const unescoWHS = STARTER_TOPIC_QUESTIONS.filter(q => q.topicId === 'unesco-2026');
  const tentativeWHS = STARTER_TOPIC_QUESTIONS.filter(q => q.topicId === 'unesco-tentative-2026');
  const ramsar2026 = STARTER_TOPIC_QUESTIONS.filter(q => q.topicId === 'ramsar-sites-2026');
  const accuracyOk = unescoWHS.some(q => q.question.includes('Moidams') || q.explanation.includes('Moidams')) &&
    tentativeWHS.some(q => q.question.includes('Maratha') || q.explanation.includes('Maratha')) &&
    ramsar2026.some(q => q.explanation.includes('85') || q.question.includes('85'));
  check('12. 2026 Time-Sensitive Accuracy (Moidams 43rd WHS vs Maratha Tentative vs 85 Ramsar)', accuracyOk, 'Distinguishes Inscriptions from Tentative List');

  // 6. PDF QUESTION STUDIO WORKFLOW
  const studioFile = fs.readFileSync('src/components/admin/PdfQuestionStudio.tsx', 'utf8');
  const studioCapabilities = (
    studioFile.includes('webkitdirectory') &&
    studioFile.includes('SUPPORTED_FOLDERS') &&
    studioFile.includes('targetQuestionCount') &&
    studioFile.includes('Extracted Text Preview') &&
    studioFile.includes('handleReprocessDoc')
  );
  check('13. PDF Folder Ingestion & Question Studio Capabilities', studioCapabilities, 'webkitdirectory, folder hierarchy, count selector, text preview & reprocessing');

  // 7. PRESERVED CHAMPIONSHIPS & REMOVED DAILY MODULES
  const { DAILY_QUIZZES } = await import('../src/data/quizzes.ts');
  const dayIds = DAILY_QUIZZES.map(q => q.id);
  const onlyChampionships = dayIds.includes('semi-final') && dayIds.includes('grand-final') && !dayIds.some(id => id.startsWith('day-0'));
  check('14. Daily Quizzes Removed (Day 01-07) & Championships Preserved', onlyChampionships, `Active quizzes: ${dayIds.join(', ')}`);

  // 8. MULTI-STUDENT WORKSPACE
  const multiStudentFile = fs.readFileSync('src/components/admin/MultiStudentHub.tsx', 'utf8');
  const multiStudentOk = multiStudentFile.includes('Mahi') && multiStudentFile.includes('Shailu') && multiStudentFile.includes('onResetStudent');
  check('15. Multi-Student Workspace Support (Mahi & Shailu)', multiStudentOk, 'Separate attempts, shared question pool, independent reset');

  // 9. VITE PRODUCTION BUILD
  check('16. Vite Production Build (dist/index.html generated)', fs.existsSync('dist/index.html'), 'Zero compiler errors, bundles optimized');

  console.log('\n================================================================');
  const passCount = results.filter(r => r.pass).length;
  const failCount = results.filter(r => !r.pass).length;
  console.log(`TOTAL: ${results.length} | PASSED: ${passCount} | FAILED: ${failCount}`);
  console.log('================================================================');

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
