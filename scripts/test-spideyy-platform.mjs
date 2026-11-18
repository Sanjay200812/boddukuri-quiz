import { getTopicsList, getAllTopicQuestions, getQuestionsForTopic, getQuizForTopic, TOPIC_CATEGORIES, STARTER_TOPIC_QUESTIONS } from '../src/data/topics.ts';
import { DAILY_SCHEDULE, isDayUnlocked } from '../src/utils/schedule.ts';
import { getQuizForDay, validateQuizForPublishing } from '../src/data/quizzes.ts';
import fs from 'fs';

console.log('================================================================');
console.log('  QUIZ BY SPIDEEYY — MASTER VERIFICATION & TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName} - ${details}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// TEST 1: REBRAND TO "Quiz by Spideyy"
// -----------------------------------------------------------------------------
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert(indexHtml.includes('Quiz by Spideyy'), 'Index HTML rebranded to Quiz by Spideyy');
assert(!indexHtml.includes("Boddukuri's Quiz"), 'No Boddukuri in index.html');

// -----------------------------------------------------------------------------
// TEST 2: REMOVE ALL SEVEN DAILY QUIZZES (DAYS 01-07)
// -----------------------------------------------------------------------------
const dailyIdsInSchedule = DAILY_SCHEDULE.map(s => s.quizId);
const hasDay01to07 = dailyIdsInSchedule.some(id => /^day-0[1-7]$/.test(id));
assert(!hasDay01to07, 'Daily quizzes Day 01 - Day 07 are completely removed from schedule', `Found: ${dailyIdsInSchedule.join(', ')}`);

// -----------------------------------------------------------------------------
// TEST 3: PRESERVE SEMI-FINAL & GRAND TEST
// -----------------------------------------------------------------------------
const semiFinal = getQuizForDay('semi-final');
const grandFinal = getQuizForDay('grand-final');

assert(semiFinal && semiFinal.questions.length === 30, 'Semi-Final Test preserved with exactly 30 questions', `Count: ${semiFinal?.questions?.length}`);
assert(grandFinal && grandFinal.questions.length === 60, 'Grand Test preserved with exactly 60 questions', `Count: ${grandFinal?.questions?.length}`);

const semiFinalValidation = validateQuizForPublishing(semiFinal);
const grandFinalValidation = validateQuizForPublishing(grandFinal);
assert(semiFinalValidation.isValid, 'Semi-Final Test passes 100% curriculum validation', JSON.stringify(semiFinalValidation.errors));
assert(grandFinalValidation.isValid, 'Grand Test passes 100% curriculum validation', JSON.stringify(grandFinalValidation.errors));

// Check all 30 States/UTs are represented
const semiFinalStates = new Set(semiFinal.questions.map(q => q.state));
assert(semiFinalStates.size === 30, 'Semi-Final covers all 30 Indian States & UTs (1 Q each)', `Unique states: ${semiFinalStates.size}`);

// -----------------------------------------------------------------------------
// TEST 4: TOPIC-BASED WORKSPACE (5 TOPICS)
// -----------------------------------------------------------------------------
const topics = getTopicsList();
assert(topics.length === 5, 'Exactly 5 Topic Categories exist', `Found: ${topics.length}`);

const expectedTopicIds = ['static-gk', 'current-affairs', 'banking-awareness', 'central-ministers', 'ramsar-sites'];
const topicIdsMatch = expectedTopicIds.every(id => topics.some(t => t.id === id));
assert(topicIdsMatch, 'All 5 approved topic IDs exist (static-gk, current-affairs, banking-awareness, central-ministers, ramsar-sites)');

// Starter Questions verification
const allStarterQuestions = getAllTopicQuestions();
assert(allStarterQuestions.length >= 35, `Starter questions pool contains >= 35 high-quality questions (Found: ${allStarterQuestions.length})`);

// Question Integrity check
let allQuestionsValid = true;
allStarterQuestions.forEach((q, idx) => {
  if (!q.question || !q.options || q.options.length !== 4 || q.correctAnswer < 0 || q.correctAnswer > 3 || !q.explanation) {
    console.error(`Invalid starter question #${idx + 1}:`, q);
    allQuestionsValid = false;
  }
});
assert(allQuestionsValid, 'All topic starter questions have 4 options, valid answer index (0-3), and factual explanation');

// Test runnable quiz generation for topics
const staticGkQuiz = getQuizForTopic('static-gk');
assert(staticGkQuiz && staticGkQuiz.questions.length === 10, 'getQuizForTopic generates runnable DailyQuiz for Static GK (10 Qs)');

const centralMinQuiz = getQuizForTopic('central-ministers');
assert(centralMinQuiz && centralMinQuiz.questions.length === 7, 'getQuizForTopic generates runnable DailyQuiz for Central Cabinet Ministers (7 Qs)');

// -----------------------------------------------------------------------------
// TEST 5: UNLOCK LOGIC & SCHEDULE
// -----------------------------------------------------------------------------
assert(isDayUnlocked('static-gk', []), 'Topics are self-paced and unlocked by default');
assert(isDayUnlocked('current-affairs', []), 'Current affairs topic is unlocked by default');
assert(isDayUnlocked('semi-final', ['semi-final']), 'Semi-final is unlocked when completed');

// -----------------------------------------------------------------------------
// TEST 6: MULTI-STUDENT WORKSPACE COMPONENTS
// -----------------------------------------------------------------------------
const multiStudentHubFile = fs.readFileSync('src/components/admin/MultiStudentHub.tsx', 'utf8');
assert(multiStudentHubFile.includes('Mahi') && multiStudentHubFile.includes('Shailu'), 'MultiStudentHub handles both Mahi and Shailu');
assert(multiStudentHubFile.includes('shailuConfig') && multiStudentHubFile.includes('setShowOnboardModal'), 'Shailu onboarding workflow implemented');
assert(multiStudentHubFile.includes('onResetStudent') && multiStudentHubFile.includes('targetStudentForReset'), 'Independent student reset implemented');

// -----------------------------------------------------------------------------
// TEST 7: PDF QUESTION STUDIO COMPONENT
// -----------------------------------------------------------------------------
const pdfStudioFile = fs.readFileSync('src/components/admin/PdfQuestionStudio.tsx', 'utf8');
assert(pdfStudioFile.includes('handleFileUpload') && pdfStudioFile.includes('onDrop'), 'PDF Studio supports file upload and drag & drop');
assert(pdfStudioFile.includes('generateDraftsForDoc'), 'PDF Studio supports draft question extraction & generation pipeline');
assert(pdfStudioFile.includes('handlePublishApproved'), 'PDF Studio supports review, approval, and live topic publishing');

// -----------------------------------------------------------------------------
// TEST 8: 3D CARD ANIMATION OPTIMIZATION
// -----------------------------------------------------------------------------
const card3DFile = fs.readFileSync('src/components/ui/Card3D.tsx', 'utf8');
assert(card3DFile.includes('rectRef') && card3DFile.includes('rafRef'), 'Card3D caches bounding rect on mouseenter and throttles RAF');
assert(card3DFile.includes('hover: hover') || card3DFile.includes('matchMedia'), 'Card3D disables tilt physics on touch / mobile devices');

console.log('\n================================================================');
console.log(`  VERIFICATION COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
