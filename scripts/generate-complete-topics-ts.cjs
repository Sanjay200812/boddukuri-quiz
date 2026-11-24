const fs = require('fs');

// Read existing starter questions from topics.ts
const existingContent = fs.readFileSync('src/data/topics.ts', 'utf8');

// We can load the starter questions by evaluating in Node or parsing
// Let's create a builder that assembles everything cleanly.

const {
  STATIC_GK_QUIZ_2_QUESTIONS,
  STATIC_GK_QUIZ_3_QUESTIONS,
  STATIC_GK_QUIZ_4_QUESTIONS,
  SIXTH_SCHEDULE_QUIZ_1_QUESTIONS
} = require('./build-topic-quizzes.cjs');

// Read starter questions from existing file
// We extract the array content between 'export const STARTER_TOPIC_QUESTIONS: TopicQuestion[] = [' and '];'
const startIdx = existingContent.indexOf('export const STARTER_TOPIC_QUESTIONS: TopicQuestion[] = [');
const endIdx = existingContent.indexOf('];\n\nexport function getAllTopicQuestions()');
if (startIdx === -1 || endIdx === -1) {
  console.error('Failed to locate STARTER_TOPIC_QUESTIONS boundaries');
  process.exit(1);
}

const rawStarterArrayStr = existingContent.substring(
  startIdx + 'export const STARTER_TOPIC_QUESTIONS: TopicQuestion[] = ['.length,
  endIdx
);

// We evaluate the existing starter questions in a sandboxed module
const existingQuestions = eval('[' + rawStarterArrayStr + ']');
console.log('Successfully parsed existing questions:', existingQuestions.length);

// Map quizId and orderInQuiz onto existing 80 questions
const mappedExistingQuestions = existingQuestions.map((q, idx) => {
  let quizId = '';
  let normTopic = q.topicId;
  if (normTopic === 'static-gk') quizId = 'static-gk-quiz-01';
  else if (normTopic === 'current-affairs-pib' || normTopic === 'current-affairs') quizId = 'current-affairs-pib-quiz-01';
  else if (normTopic === 'banking-awareness-fa' || normTopic === 'banking-awareness') quizId = 'banking-awareness-fa-quiz-01';
  else if (normTopic === 'central-ministers') quizId = 'central-ministers-quiz-01';
  else if (normTopic === 'ramsar-sites-2026' || normTopic === 'ramsar-sites') quizId = 'ramsar-sites-2026-quiz-01';
  else if (normTopic === 'unesco-2026') quizId = 'unesco-2026-quiz-01';
  else if (normTopic === 'unesco-tentative-2026') quizId = 'unesco-tentative-2026-quiz-01';
  else if (normTopic === 'other-important-gk' || normTopic === 'dance-forms') {
    quizId = 'dance-forms-quiz-01';
    normTopic = 'dance-forms';
  }

  // Calculate orderInQuiz (1 to 10 for each quiz)
  const orderInQuiz = (idx % 10) + 1;

  return {
    ...q,
    topicId: normTopic,
    quizId,
    orderInQuiz,
    status: q.status || 'published'
  };
});

// Combine all questions
const ALL_TOPIC_QUESTIONS = [
  ...mappedExistingQuestions,
  ...STATIC_GK_QUIZ_2_QUESTIONS,
  ...STATIC_GK_QUIZ_3_QUESTIONS,
  ...STATIC_GK_QUIZ_4_QUESTIONS,
  ...SIXTH_SCHEDULE_QUIZ_1_QUESTIONS
];

console.log('Total aggregated questions:', ALL_TOPIC_QUESTIONS.length);

// Verify zero duplicate question IDs
const seenIds = new Set();
const seenTexts = new Set();
for (const q of ALL_TOPIC_QUESTIONS) {
  if (seenIds.has(q.id)) {
    console.error('Duplicate ID detected:', q.id);
    process.exit(1);
  }
  seenIds.add(q.id);

  const key = q.question.trim().toLowerCase();
  if (seenTexts.has(key)) {
    console.warn('Duplicate question text detected:', q.question);
  }
  seenTexts.add(key);
}
console.log('Zero duplicate question IDs confirmed across all', ALL_TOPIC_QUESTIONS.length, 'questions.');

// Prepare TypeScript file content
const fileHeader = `import type { Topic, TopicQuestion, DailyQuiz, QuizQuestion, TopicQuiz, TopicProgressMetrics } from '../types/quiz';

/**
 * SPIDEYY QUIZ — 4-TIER CURRICULUM ARCHITECTURE
 * Subject / Exam Preparation -> Topic -> Multiple Quizzes -> Questions
 *
 * All 9 core topics preserved with multiple independent quizzes.
 * Draft-by-default for new quizzes, question-level accuracy math,
 * and backward-compatible mapping for all legacy single-topic IDs.
 */

export const DEFAULT_TOPIC_QUIZZES: TopicQuiz[] = [
  // --- STATIC GK (4 QUIZZES) ---
  {
    id: 'static-gk-quiz-01',
    topicId: 'static-gk',
    title: 'Quiz 1 – National Parks Part 1 (Core Foundations & World Heritage)',
    order: 1,
    description: 'Foundational national parks of India: oldest reserves, largest protected landscapes, and UNESCO World Heritage conservation biomes.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 10,
    questionIds: [
      'top-sgk-np-01', 'top-sgk-np-02', 'top-sgk-np-03', 'top-sgk-np-04', 'top-sgk-np-05',
      'top-sgk-np-06', 'top-sgk-np-07', 'top-sgk-np-08', 'top-sgk-np-09', 'top-sgk-np-10'
    ],
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'static-gk-quiz-02',
    topicId: 'static-gk',
    title: 'Quiz 2 – National Parks Part 2 (Northern & Western Himalayan Reserves)',
    order: 2,
    description: 'Alpine sanctuaries, Trans-Himalayan biomes, and desert reserves across Jammu & Kashmir, Ladakh, Himachal Pradesh, Uttarakhand, Rajasthan, and Gujarat.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 12,
    questionIds: [
      'top-sgk-np-q02-01', 'top-sgk-np-q02-02', 'top-sgk-np-q02-03', 'top-sgk-np-q02-04',
      'top-sgk-np-q02-05', 'top-sgk-np-q02-06', 'top-sgk-np-q02-07', 'top-sgk-np-q02-08',
      'top-sgk-np-q02-09', 'top-sgk-np-q02-10', 'top-sgk-np-q02-11', 'top-sgk-np-q02-12'
    ],
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'static-gk-quiz-03',
    topicId: 'static-gk',
    title: 'Quiz 3 – National Parks Part 3 (Central & Eastern Heartland Reserves)',
    order: 3,
    description: 'Tiger reserves, Project Cheetah habitats, limestone caves, and coastal delta mangrove networks across Madhya Pradesh, Maharashtra, Chhattisgarh, Odisha, and West Bengal.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 12,
    questionIds: [
      'top-sgk-np-q03-01', 'top-sgk-np-q03-02', 'top-sgk-np-q03-03', 'top-sgk-np-q03-04',
      'top-sgk-np-q03-05', 'top-sgk-np-q03-06', 'top-sgk-np-q03-07', 'top-sgk-np-q03-08',
      'top-sgk-np-q03-09', 'top-sgk-np-q03-10', 'top-sgk-np-q03-11', 'top-sgk-np-q03-12'
    ],
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'static-gk-quiz-04',
    topicId: 'static-gk',
    title: 'Quiz 4 – National Parks Part 4 (Southern Biomes & North-East Jewels)',
    order: 4,
    description: 'Biodiversity hotspots, Western Ghats montane sholas, river islands, marine biomes, and island rainforests in Assam, Arunachal Pradesh, Manipur, Kerala, Tamil Nadu, and Andaman & Nicobar.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 12,
    questionIds: [
      'top-sgk-np-q04-01', 'top-sgk-np-q04-02', 'top-sgk-np-q04-03', 'top-sgk-np-q04-04',
      'top-sgk-np-q04-05', 'top-sgk-np-q04-06', 'top-sgk-np-q04-07', 'top-sgk-np-q04-08',
      'top-sgk-np-q04-09', 'top-sgk-np-q04-10', 'top-sgk-np-q04-11', 'top-sgk-np-q04-12'
    ],
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },

  // --- CURRENT AFFAIRS — PIB ---
  {
    id: 'current-affairs-pib-quiz-01',
    topicId: 'current-affairs-pib',
    title: 'Quiz 1 – PIB Flagship Schemes & National Developments',
    order: 1,
    description: 'Official Press Information Bureau notifications, strategic infrastructure milestones, semiconductor missions, and welfare initiatives.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 10,
    questionIds: [
      'top-cap-pib-01', 'top-cap-pib-02', 'top-cap-pib-03', 'top-cap-pib-04', 'top-cap-pib-05',
      'top-cap-pib-06', 'top-cap-pib-07', 'top-cap-pib-08', 'top-cap-pib-09', 'top-cap-pib-10'
    ],
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },

  // --- BANKING AWARENESS — FA ---
  {
    id: 'banking-awareness-fa-quiz-01',
    topicId: 'banking-awareness-fa',
    title: 'Quiz 1 – RBI Monetary Policy & Financial Frameworks',
    order: 1,
    description: 'Reserve Bank of India policy rates, NPA prudential guidelines, Basel III capital adequacy, DICGC ceilings, and CBDC digital rupee pilots.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 10,
    questionIds: [
      'top-bfa-rbi-01', 'top-bfa-rbi-02', 'top-bfa-rbi-03', 'top-bfa-rbi-04', 'top-bfa-rbi-05',
      'top-bfa-rbi-06', 'top-bfa-rbi-07', 'top-bfa-rbi-08', 'top-bfa-rbi-09', 'top-bfa-rbi-10'
    ],
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },

  // --- CENTRAL MINISTERS ---
  {
    id: 'central-ministers-quiz-01',
    topicId: 'central-ministers',
    title: 'Quiz 1 – Union Cabinet Portfolios & Allocation',
    order: 1,
    description: 'Official portfolio distributions of the Union Council of Ministers based on Cabinet Secretariat gazette notifications.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 10,
    questionIds: [
      'top-min-cab-01', 'top-min-cab-02', 'top-min-cab-03', 'top-min-cab-04', 'top-min-cab-05',
      'top-min-cab-06', 'top-min-cab-07', 'top-min-cab-08', 'top-min-cab-09', 'top-min-cab-10'
    ],
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },

  // --- RAMSAR SITES — 2026 ---
  {
    id: 'ramsar-sites-2026-quiz-01',
    topicId: 'ramsar-sites-2026',
    title: 'Quiz 1 – Ramsar Wetlands & 2026 Milestone Additions',
    order: 1,
    description: 'International wetland conservation landmarks in India: newly declared 2026 sites, Montreux Record status, and state distribution.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 10,
    questionIds: [
      'top-ram-26-01', 'top-ram-26-02', 'top-ram-26-03', 'top-ram-26-04', 'top-ram-26-05',
      'top-ram-26-06', 'top-ram-26-07', 'top-ram-26-08', 'top-ram-26-09', 'top-ram-26-10'
    ],
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },

  // --- UNESCO — 2026 ---
  {
    id: 'unesco-2026-quiz-01',
    topicId: 'unesco-2026',
    title: 'Quiz 1 – World Heritage Inscriptions & 46th Session',
    order: 1,
    description: 'India\\'s 43 World Heritage Sites: Charaideo Moidams of Assam, cultural, natural, and mixed categories, and 46th Session (New Delhi).',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 10,
    questionIds: [
      'top-une-whs-01', 'top-une-whs-02', 'top-une-whs-03', 'top-une-whs-04', 'top-une-whs-05',
      'top-une-whs-06', 'top-une-whs-07', 'top-une-whs-08', 'top-une-whs-09', 'top-une-whs-10'
    ],
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },

  // --- UNESCO TENTATIVE LIST — 2026 ---
  {
    id: 'unesco-tentative-2026-quiz-01',
    topicId: 'unesco-tentative-2026',
    title: 'Quiz 1 – UNESCO Tentative Nominations & Criteria',
    order: 1,
    description: 'Heritage properties submitted by the Archaeological Survey of India (ASI) to the UNESCO Tentative List through 2026.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 10,
    questionIds: [
      'top-unt-26-01', 'top-unt-26-02', 'top-unt-26-03', 'top-unt-26-04', 'top-unt-26-05',
      'top-unt-26-06', 'top-unt-26-07', 'top-unt-26-08', 'top-unt-26-09', 'top-unt-26-10'
    ],
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },

  // --- DANCE FORMS (INDIAN CLASSICAL & FOLK DANCES) ---
  {
    id: 'dance-forms-quiz-01',
    topicId: 'dance-forms',
    title: 'Quiz 1 – Classical Traditions, Natya Shastra & Exponents',
    order: 1,
    description: 'The 8 Sangeet Natak Akademi classical dances, Natya Shastra treatise, regional folk traditions, and legendary master exponents.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 10,
    questionIds: [
      'top-dan-cls-01', 'top-dan-sat-02', 'top-dan-nat-03', 'top-dan-kat-04', 'top-dan-bha-05',
      'top-dan-odi-06', 'top-dan-kuc-07', 'top-dan-bir-08', 'top-dan-gar-09', 'top-dan-kal-10'
    ],
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },

  // --- SIXTH SCHEDULE OF THE CONSTITUTION ---
  {
    id: 'sixth-schedule-quiz-01',
    topicId: 'sixth-schedule',
    title: 'Quiz 1 – Constitutional Governance & Autonomous District Councils',
    order: 1,
    description: 'Articles 244(2) & 275(1), the Bordoloi Sub-Committee, 10 Autonomous District Councils across Assam, Meghalaya, Tripura, Mizoram, and tribal autonomy.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 10,
    questionIds: [
      'top-6th-sched-01', 'top-6th-sched-02', 'top-6th-sched-03', 'top-6th-sched-04', 'top-6th-sched-05',
      'top-6th-sched-06', 'top-6th-sched-07', 'top-6th-sched-08', 'top-6th-sched-09', 'top-6th-sched-10'
    ],
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  }
];

export const TOPIC_CATEGORIES: Topic[] = [
  {
    id: 'static-gk',
    title: 'Static GK',
    category: 'static-gk',
    description: 'Core foundational general knowledge: National Parks of India across 4 comprehensive multi-part quizzes covering all biogeographic zones.',
    icon: 'Trees',
    subtopics: [
      { id: 'national-parks', title: 'National Parks Part 1 (Core Foundations)', description: 'Oldest, largest, floating, and UNESCO World Heritage parks.', questionCount: 10 },
      { id: 'important-facts', title: 'National Parks Part 2 (Northern & Western Reserves)', description: 'Alpine and desert biomes across J&K, Ladakh, HP, Uttarakhand, Rajasthan, and Gujarat.', questionCount: 12 },
      { id: 'state-wise-parks', title: 'National Parks Part 3 (Central & Eastern Heartland)', description: 'Heartland tiger reserves and deltas: MP, Maharashtra, Chhattisgarh, Odisha, and West Bengal.', questionCount: 12 },
      { id: 'southern-northeast', title: 'National Parks Part 4 (Southern Biomes & North-East)', description: 'Shola-grasslands, river islands, and marine biomes: Assam, Arunachal, Manipur, Kerala, TN, and A&N.', questionCount: 12 }
    ],
    totalQuestions: 46,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'current-affairs-pib',
    title: 'Current Affairs — PIB',
    category: 'current-affairs-pib',
    description: 'Press Information Bureau (PIB) releases, flagship government schemes, national developments, major appointments, and indexed reports.',
    icon: 'Globe2',
    subtopics: [
      { id: 'pib-releases', title: 'PIB Releases & Announcements', description: 'Official government notifications, high-level policy briefings, and summits.', questionCount: 2 },
      { id: 'gov-schemes', title: 'Government Schemes & Initiatives', description: 'Flagship welfare, clean energy, infrastructure, and financial programs.', questionCount: 3 },
      { id: 'national-developments', title: 'National Developments & Infrastructure', description: 'Strategic tunnels, space missions, rail bridges, and national milestones.', questionCount: 2 },
      { id: 'appointments-awards', title: 'Appointments, Awards & Honours', description: 'Constitutional appointments, civilian honors, and literary recognitions.', questionCount: 2 },
      { id: 'reports-indexes', title: 'Reports and Indexes', description: 'National and international indices, rankings, and multilateral assessments.', questionCount: 1 }
    ],
    totalQuestions: 10,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'banking-awareness-fa',
    title: 'Banking Awareness — FA',
    category: 'banking-awareness-fa',
    description: 'Financial Awareness (FA), RBI monetary policy frameworks, banking terminology, prudential norms, and apex financial institutions.',
    icon: 'Landmark',
    subtopics: [
      { id: 'rbi-monetary-policy', title: 'RBI & Monetary Policy', description: 'Policy Repo Rate, SDF, MSF, MPC composition, and inflation targeting framework.', questionCount: 2 },
      { id: 'banking-terminology', title: 'Banking Terminology & Norms', description: 'NPA classification, SMA categories, CRR, SLR, CASA, and Basel III capital rules.', questionCount: 3 },
      { id: 'financial-institutions', title: 'Financial Institutions & Apex Bodies', description: 'Statutory development institutions: NABARD, SIDBI, EXIM, NHB, and DICGC.', questionCount: 2 },
      { id: 'banking-schemes', title: 'Banking Schemes & Inclusion', description: 'PMJDY, Stand-Up India, Mudra Yojana, and Priority Sector Lending (PSL).', questionCount: 2 },
      { id: 'financial-developments', title: 'Important Financial Developments', description: 'Digital Rupee (CBDC), Unified Payments Interface (UPI), Account Aggregator.', questionCount: 1 }
    ],
    totalQuestions: 10,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'central-ministers',
    title: 'Central Cabinet Ministers',
    category: 'central-ministers',
    description: 'Verified portfolios and responsibilities of the Union Council of Ministers of India based on official Cabinet Secretariat gazette notifications.',
    icon: 'Award',
    subtopics: [
      { id: 'union-cabinet', title: 'Union Cabinet Ministers', description: 'Key senior portfolios: Defence, Home, Finance, External Affairs, Health, Road.', questionCount: 5 },
      { id: 'ministries-portfolios', title: 'Ministry & Portfolio Mapping', description: 'Railways, Electronics & IT, Education, Heavy Industries, Steel, and Agriculture.', questionCount: 4 },
      { id: 'appointments-changes', title: 'Appointments & Changes', description: 'Ministerial portfolio reallocations and new Union ministries.', questionCount: 1 }
    ],
    totalQuestions: 10,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'ramsar-sites-2026',
    title: 'Ramsar Sites — 2026',
    category: 'ramsar-sites-2026',
    description: 'Comprehensive study of Wetlands of International Importance in India under the 1971 Ramsar Convention, emphasizing newly declared 2026 sites.',
    icon: 'Waves',
    subtopics: [
      { id: 'ramsar-2026-new', title: 'Ramsar Sites Declared in India (2026)', description: 'India\\'s newly declared Ramsar sites, bringing the national total to 85 wetlands.', questionCount: 3 },
      { id: 'names-states-locations', title: 'Names, States and Locations', description: 'State-wise distribution (Tamil Nadu leading with 16 sites, UP with 10).', questionCount: 3 },
      { id: 'designation-ecological', title: 'Designation Dates & Ecological Significance', description: 'Wetland criteria, Central Asian Flyway stopovers, and ecological services.', questionCount: 2 },
      { id: 'montreux-wetland-facts', title: 'Wetland Facts & Montreux Record', description: 'Montreux Record status (Keoladeo & Loktak), largest (Sundarbans), smallest (Renuka).', questionCount: 2 }
    ],
    totalQuestions: 10,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'unesco-2026',
    title: 'UNESCO — 2026',
    category: 'unesco-2026',
    description: 'UNESCO World Heritage Sites added in 2024–2026: cultural, natural, and mixed categories, historical significance, and inscription details.',
    icon: 'Sparkles',
    subtopics: [
      { id: 'whs-2026-additions', title: 'World Heritage Sites Added in 2026', description: 'Inscriptions from the 46th World Heritage Committee session (New Delhi).', questionCount: 3 },
      { id: 'whs-categories', title: 'Categories: Cultural, Natural, Mixed', description: 'Classification of 43 World Heritage Sites (35 Cultural, 7 Natural, 1 Mixed).', questionCount: 3 },
      { id: 'designation-history', title: 'Historical Significance & Designation', description: 'Outstanding Universal Value (OUV) criteria, conservation safeguards, and dossiers.', questionCount: 2 },
      { id: 'site-facts', title: 'Important Facts About New Sites', description: 'Architectural, spiritual, and funerary uniqueness of freshly inscribed heritage.', questionCount: 2 }
    ],
    totalQuestions: 10,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'unesco-tentative-2026',
    title: 'UNESCO Tentative List — 2026',
    category: 'unesco-tentative-2026',
    description: 'Sites added to India\\'s Tentative List during 2026: names, states, cultural significance, and distinction from final World Heritage inscription.',
    icon: 'FileCheck',
    subtopics: [
      { id: 'tentative-2026-additions', title: "Added to India's Tentative List (2026)", description: 'Maratha Military Landscapes, Gwalior Fort, Khooni Bhandara, Sun Temple Modhera.', questionCount: 4 },
      { id: 'tentative-states-importance', title: 'Names, States & Cultural Importance', description: 'State-wise heritage submissions and historical/architectural merits.', questionCount: 2 },
      { id: 'nomination-reasons', title: 'Reason for Nomination & Heritage Criteria', description: 'Evaluation against UNESCO Criteria (I to X) by the Archaeological Survey of India.', questionCount: 2 },
      { id: 'tentative-vs-whs', title: 'Tentative List vs Final Inscription', description: 'Operational guidelines: mandatory 1-year Tentative List period before final dossier.', questionCount: 2 }
    ],
    totalQuestions: 10,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'dance-forms',
    title: 'Dance Forms',
    category: 'dance-forms',
    description: 'Indian classical dance forms, regional folk dance traditions, state-wise cultural distribution, famous exponents, and exam-tested facts.',
    icon: 'Music',
    subtopics: [
      { id: 'classical-dance', title: 'Indian Classical Dance Forms', description: '8 Classical dances recognized by Sangeet Natak Akademi and Natya Shastra roots.', questionCount: 4 },
      { id: 'folk-dance', title: 'Indian Folk Dance Forms', description: 'Bihu, Garba, Rouff, Lavani, Kalbelia, Cheraw, and Chhau cultural heritage.', questionCount: 3 },
      { id: 'cultural-distribution', title: 'State-wise Cultural Distribution', description: 'State-by-state origin mapping and celebratory agricultural/seasonal contexts.', questionCount: 1 },
      { id: 'exponents-facts', title: 'Important Dancers, Origins & Exam Facts', description: 'Legendary masters: Birju Maharaj, Rukmini Devi, Kelucharan Mohapatra, Sankardev.', questionCount: 2 }
    ],
    totalQuestions: 10,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'sixth-schedule',
    title: 'Sixth Schedule of the Constitution',
    category: 'sixth-schedule',
    description: 'Articles 244(2) & 275(1), the Bordoloi Sub-Committee, 10 Autonomous District Councils in Assam, Meghalaya, Tripura, and Mizoram, and customary judicial powers.',
    icon: 'FileText',
    subtopics: [
      { id: 'constitutional-provisions', title: 'Constitutional Provisions (Arts. 244 & 275)', description: 'AMTM states, Bordoloi Committee recommendations, and financial grants.', questionCount: 4 },
      { id: 'autonomous-district-councils', title: 'Autonomous District Councils (ADCs)', description: '10 ADCs, 30-member composition, 26 elected / 4 nominated, Bodoland structure.', questionCount: 3 },
      { id: 'powers-governance', title: 'Powers, Assent & Judicial Governance', description: 'Governor assent, village customary courts, and comparison with Fifth Schedule.', questionCount: 3 }
    ],
    totalQuestions: 10,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'vi-tax',
    title: 'VI Tax',
    category: 'vi-tax',
    description: 'Awaiting Admin Subject Clarification. This configurable module is reserved for upcoming competitive examination tax syllabus updates once clarified by Admin.',
    icon: 'HelpCircle',
    isConfigurable: true,
    statusNote: 'Awaiting Admin Subject Clarification',
    subtopics: [
      { id: 'vi-tax-pending', title: 'Curriculum Specification Pending', description: 'Reserved module awaiting Admin definition of syllabus parameters.', questionCount: 0 }
    ],
    totalQuestions: 0,
    isPublished: false,
    publishedAt: '2026-11-24T00:00:00.000Z'
  }
];

export const STARTER_TOPIC_QUESTIONS: TopicQuestion[] = ${JSON.stringify(ALL_TOPIC_QUESTIONS, null, 2)};

// -----------------------------------------------------------------------------
// DYNAMIC & PERSISTENT QUIZ MANAGEMENT (ADMIN STUDIO & DRAFT SYSTEM)
// -----------------------------------------------------------------------------

const STORAGE_KEYS = {
  TOPIC_QUIZZES: 'spideyy_topic_quizzes_v2',
  CUSTOM_QUESTIONS: 'spideyy_published_topic_questions'
};

export function getAllQuizzesRegistry(): TopicQuiz[] {
  let customQuizzes: TopicQuiz[] = [];
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOPIC_QUIZZES);
      if (saved) {
        customQuizzes = JSON.parse(saved);
      }
    } catch {
      // ignore
    }
  }

  // Merge default topic quizzes with any admin customizations
  const quizMap = new Map<string, TopicQuiz>();
  DEFAULT_TOPIC_QUIZZES.forEach(q => quizMap.set(q.id, { ...q }));
  customQuizzes.forEach(q => quizMap.set(q.id, { ...q }));

  return Array.from(quizMap.values());
}

export function saveQuizzesRegistry(quizzes: TopicQuiz[]): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.TOPIC_QUIZZES, JSON.stringify(quizzes));
    } catch (e) {
      console.warn('Failed to save topic quizzes registry:', e);
    }
  }
}

export function getAllTopicQuestions(): TopicQuestion[] {
  let custom: TopicQuestion[] = [];
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
      if (saved) custom = JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return [...STARTER_TOPIC_QUESTIONS, ...custom];
}

export function addPublishedTopicQuestions(newQuestions: TopicQuestion[]): void {
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
      const current: TopicQuestion[] = saved ? JSON.parse(saved) : [];
      const existingTexts = new Set([...STARTER_TOPIC_QUESTIONS, ...current].map(q => q.question.trim().toLowerCase()));
      const uniqueNew = newQuestions.filter(q => !existingTexts.has(q.question.trim().toLowerCase()));
      const updated = [...current, ...uniqueNew];
      localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}

// -----------------------------------------------------------------------------
// TOPIC & QUIZ RESOLUTION HELPERS (BACKWARD-COMPATIBLE)
// -----------------------------------------------------------------------------

export function normalizeTopicId(topicId: string): string {
  if (topicId === 'current-affairs') return 'current-affairs-pib';
  if (topicId === 'banking-awareness') return 'banking-awareness-fa';
  if (topicId === 'ramsar-sites') return 'ramsar-sites-2026';
  if (topicId === 'other-important-gk') return 'dance-forms';
  return topicId;
}

/**
 * Resolves any quiz or legacy topic identifier to a concrete quiz ID.
 * Preserves all legacy single-topic attempts and paths backward-compatibly.
 */
export function resolveQuizId(quizOrTopicId: string): string {
  if (!quizOrTopicId) return 'static-gk-quiz-01';
  const norm = normalizeTopicId(quizOrTopicId);

  // If already a quiz ID, return it
  if (norm.includes('-quiz-')) return norm;

  // Map legacy topic IDs to their primary Quiz 1
  switch (norm) {
    case 'static-gk': return 'static-gk-quiz-01';
    case 'current-affairs-pib': return 'current-affairs-pib-quiz-01';
    case 'banking-awareness-fa': return 'banking-awareness-fa-quiz-01';
    case 'central-ministers': return 'central-ministers-quiz-01';
    case 'ramsar-sites-2026': return 'ramsar-sites-2026-quiz-01';
    case 'unesco-2026': return 'unesco-2026-quiz-01';
    case 'unesco-tentative-2026': return 'unesco-tentative-2026-quiz-01';
    case 'dance-forms': return 'dance-forms-quiz-01';
    case 'sixth-schedule': return 'sixth-schedule-quiz-01';
    default: return norm;
  }
}

/**
 * Returns all quizzes belonging to a topic.
 * By default, returns only published quizzes for students.
 * Pass includeDrafts = true for Admin Studio views.
 */
export function getQuizzesForTopic(topicId: string, includeDrafts = false): TopicQuiz[] {
  const normId = normalizeTopicId(topicId);
  const allQuizzes = getAllQuizzesRegistry();
  return allQuizzes
    .filter(q => {
      const qNormTopic = normalizeTopicId(q.topicId);
      if (qNormTopic !== normId && q.topicId !== topicId) return false;
      if (!includeDrafts && (!q.isPublished || q.status === 'draft' || q.status === 'archived')) {
        return false;
      }
      return true;
    })
    .sort((a, b) => a.order - b.order);
}

/**
 * Returns the topic that owns the specified quiz ID.
 */
export function getTopicForQuiz(quizId: string): Topic | undefined {
  const allQuizzes = getAllQuizzesRegistry();
  const foundQuiz = allQuizzes.find(q => q.id === quizId);
  if (foundQuiz) {
    return getTopicById(foundQuiz.topicId);
  }
  // Try resolving as legacy topic ID
  return getTopicById(quizId);
}

export function getTopicsList(): Topic[] {
  const allQs = getAllTopicQuestions();
  const allQuizzes = getAllQuizzesRegistry();

  return TOPIC_CATEGORIES.map(t => {
    const topicNorm = normalizeTopicId(t.id);
    const questionsCount = allQs.filter(q => normalizeTopicId(q.topicId) === topicNorm).length;
    const topicQuizzes = allQuizzes.filter(q => normalizeTopicId(q.topicId) === topicNorm);

    return {
      ...t,
      quizzes: topicQuizzes,
      totalQuestions: questionsCount,
      subtopics: t.subtopics.map(st => {
        const subCount = allQs.filter(
          q => normalizeTopicId(q.topicId) === topicNorm && q.subtopicId === st.id
        ).length;
        return {
          ...st,
          questionCount: subCount || st.questionCount
        };
      })
    };
  });
}

export function getTopicById(topicId: string): Topic | undefined {
  const normId = normalizeTopicId(topicId);
  return getTopicsList().find(t => t.id === normId || t.id === topicId || (normId === 'dance-forms' && t.id === 'other-important-gk'));
}

export function getQuestionsForTopic(topicId: string, subtopicId?: string): TopicQuestion[] {
  const normId = normalizeTopicId(topicId);
  return getAllTopicQuestions().filter(q => {
    const qNorm = normalizeTopicId(q.topicId);
    if (qNorm !== normId && q.topicId !== topicId) return false;
    if (subtopicId && q.subtopicId !== subtopicId) return false;
    return true;
  });
}

/**
 * Retrieves all questions belonging to a specific quiz.
 * Checks both the quiz's questionIds and questions assigned quizId.
 */
export function getQuestionsForQuiz(quizId: string): TopicQuestion[] {
  const normQuizId = resolveQuizId(quizId);
  const allQuizzes = getAllQuizzesRegistry();
  const quizDef = allQuizzes.find(q => q.id === normQuizId || q.id === quizId);
  const allQuestions = getAllTopicQuestions();

  if (quizDef && quizDef.questionIds && quizDef.questionIds.length > 0) {
    const qMap = new Map<string, TopicQuestion>();
    allQuestions.forEach(q => qMap.set(q.id, q));
    const matched: TopicQuestion[] = [];
    quizDef.questionIds.forEach(qid => {
      const found = qMap.get(qid);
      if (found) matched.push(found);
    });
    if (matched.length > 0) return matched;
  }

  // Fallback: match by q.quizId
  const byQuizId = allQuestions.filter(q => q.quizId === normQuizId || q.quizId === quizId);
  if (byQuizId.length > 0) return byQuizId;

  // Fallback for single topic fallback
  const topic = getTopicForQuiz(quizId);
  if (topic) {
    return getQuestionsForTopic(topic.id);
  }

  return [];
}

/**
 * Builds a runnable DailyQuiz object for a given quiz ID or legacy topic ID.
 * Seamlessly consumed by QuizRunner, ResultDashboard, and AnswerSheet.
 */
export function getQuizById(quizId: string): DailyQuiz | null {
  const resolvedId = resolveQuizId(quizId);
  const allQuizzes = getAllQuizzesRegistry();
  const quizDef = allQuizzes.find(q => q.id === resolvedId || q.id === quizId);
  const topic = getTopicForQuiz(resolvedId) || (quizDef ? getTopicById(quizDef.topicId) : undefined);

  if (!quizDef && !topic) return null;

  const title = quizDef?.title || topic?.title || 'Spideyy Quiz Assessment';
  const questions = getQuestionsForQuiz(resolvedId);

  const quizQuestions: QuizQuestion[] = questions.map((q, idx) => ({
    id: q.id,
    quizId: resolvedId,
    order: q.orderInQuiz || idx + 1,
    section: 'new',
    state: topic?.title || 'General Knowledge',
    parkName: q.subtopicId,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    difficulty: q.difficulty,
    explanation: q.explanation,
    status: 'published'
  }));

  return {
    id: resolvedId,
    dayNumber: quizDef?.order || 1,
    title,
    quizDate: '24-11-2026',
    displayDate: title,
    statusLabel: quizDef?.isPublished ? 'Available' : 'Draft',
    statesCovered: [topic?.title || 'General Knowledge'],
    newStatesIntroduced: [topic?.title || 'General Knowledge'],
    previousStates: [],
    stateInfoList: [],
    questions: quizQuestions,
    totalQuestions: quizQuestions.length
  };
}

/**
 * Backward compatibility: builds a runnable DailyQuiz object for a topic ID.
 */
export function getQuizForTopic(topicId: string): DailyQuiz {
  const resolved = resolveQuizId(topicId);
  const quiz = getQuizById(resolved);
  if (quiz) return quiz;

  // Fallback
  return {
    id: topicId,
    dayNumber: 1,
    title: topicId,
    quizDate: '24-11-2026',
    displayDate: topicId,
    statusLabel: 'Available',
    statesCovered: [topicId],
    newStatesIntroduced: [topicId],
    previousStates: [],
    stateInfoList: [],
    questions: [],
    totalQuestions: 0
  };
}

// -----------------------------------------------------------------------------
// TOPIC ACCURACY & PROGRESS CALCULATION (SAFETY CORRECTION #3)
// -----------------------------------------------------------------------------

/**
 * Calculates topic progress and accuracy metrics:
 * Topic Accuracy % = (Total Correct Answers in topic) / (Total Questions Attempted in topic) * 100
 * Topic Completion % = (Completed Published Quizzes) / (Total Published Quizzes) * 100
 */
export function calculateTopicProgress(
  topicId: string,
  attempts: any[], // QuizAttempt[]
  completedQuizIds: string[]
): TopicProgressMetrics {
  const normTopic = normalizeTopicId(topicId);
  const topic = getTopicById(normTopic);
  const quizzes = getQuizzesForTopic(normTopic, false); // Published quizzes

  let totalQuestionsAttempted = 0;
  let totalCorrectAnswers = 0;
  let totalAttemptsCount = 0;
  let bestScoreOverall = 0;
  let latestScore = 0;

  const quizzesMetrics: TopicProgressMetrics['quizzesMetrics'] = {};

  // For each published quiz in topic
  quizzes.forEach(quiz => {
    // Match attempts for this quiz (matching exact quiz.id OR legacy topic.id for Quiz 1)
    const quizAttempts = attempts.filter(att => {
      if (att.quizId === quiz.id) return true;
      if (quiz.order === 1 && (att.quizId === normTopic || att.quizId === topicId)) return true;
      return false;
    });

    const attemptsCount = quizAttempts.length;
    const bestScore = attemptsCount > 0 ? Math.max(...quizAttempts.map(a => a.percentage || 0)) : 0;
    const latest = quizAttempts[0] || null;
    const isCompleted =
      completedQuizIds.includes(quiz.id) ||
      (quiz.order === 1 && (completedQuizIds.includes(normTopic) || completedQuizIds.includes(topicId))) ||
      bestScore >= 70;

    // Accumulate total questions attempted and correct answers for question-level accuracy
    quizAttempts.forEach(att => {
      totalQuestionsAttempted += (att.totalQuestions || 0);
      totalCorrectAnswers += (att.correctCount || 0);
    });

    totalAttemptsCount += attemptsCount;
    if (bestScore > bestScoreOverall) bestScoreOverall = bestScore;
    if (latest && !latestScore) latestScore = latest.percentage || 0;

    quizzesMetrics[quiz.id] = {
      quizId: quiz.id,
      title: quiz.title,
      questionCount: quiz.questionIds.length || (quiz.targetQuestionCount || 10),
      attemptsCount,
      bestScore,
      latestScore: latest ? latest.percentage : 0,
      isCompleted,
      lastAttemptDate: latest?.formattedDate || latest?.timestamp
    };
  });

  const completedQuizzesCount = quizzes.filter(q => quizzesMetrics[q.id]?.isCompleted).length;
  const publishedQuizzesCount = quizzes.length;
  const completionPercentage =
    publishedQuizzesCount > 0 ? Math.round((completedQuizzesCount / publishedQuizzesCount) * 100) : 0;

  const accuracyPercentage =
    totalQuestionsAttempted > 0
      ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100)
      : 0;

  return {
    topicId: normTopic,
    totalQuizzes: publishedQuizzesCount,
    publishedQuizzes: publishedQuizzesCount,
    completedQuizzes: completedQuizzesCount,
    completionPercentage,
    totalQuestionsAttempted,
    totalCorrectAnswers,
    accuracyPercentage,
    totalAttemptsCount,
    bestScoreOverall,
    latestScore,
    quizzesMetrics
  };
}

// -----------------------------------------------------------------------------
// ADMIN QUIZ MANAGEMENT ACTIONS (DRAFT BY DEFAULT — SAFETY CORRECTION #4)
// -----------------------------------------------------------------------------

/**
 * Creates a new quiz under a topic.
 * Always defaults to draft status: isPublished = false, status = 'draft'.
 */
export function createDraftQuiz(
  topicId: string,
  title?: string,
  targetQuestionCount = 10
): TopicQuiz {
  const normTopic = normalizeTopicId(topicId);
  const topic = getTopicById(normTopic);
  const existing = getQuizzesForTopic(normTopic, true);
  const nextOrder = existing.length + 1;
  const newQuizId = \`\${normTopic}-quiz-\${String(nextOrder).padStart(2, '0')}\`;

  const newQuiz: TopicQuiz = {
    id: newQuizId,
    topicId: normTopic,
    title: title || \`Quiz \${nextOrder} – \${topic?.title || 'Topic'} Part \${nextOrder}\`,
    order: nextOrder,
    description: \`Manageable quiz for \${topic?.title || 'Topic'} with \${targetQuestionCount} target questions.\`,
    isPublished: false, // DRAFT BY DEFAULT
    status: 'draft',    // DRAFT BY DEFAULT
    targetQuestionCount,
    questionIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const registry = getAllQuizzesRegistry();
  registry.push(newQuiz);
  saveQuizzesRegistry(registry);
  return newQuiz;
}

export function publishQuiz(quizId: string): boolean {
  const registry = getAllQuizzesRegistry();
  const quiz = registry.find(q => q.id === quizId);
  if (!quiz) return false;
  quiz.isPublished = true;
  quiz.status = 'published';
  quiz.updatedAt = new Date().toISOString();
  saveQuizzesRegistry(registry);
  return true;
}

export function unpublishQuiz(quizId: string): boolean {
  const registry = getAllQuizzesRegistry();
  const quiz = registry.find(q => q.id === quizId);
  if (!quiz) return false;
  quiz.isPublished = false;
  quiz.status = 'draft';
  quiz.updatedAt = new Date().toISOString();
  saveQuizzesRegistry(registry);
  return true;
}

export function updateQuizDetails(quizId: string, updates: Partial<TopicQuiz>): boolean {
  const registry = getAllQuizzesRegistry();
  const quiz = registry.find(q => q.id === quizId);
  if (!quiz) return false;
  Object.assign(quiz, updates, { updatedAt: new Date().toISOString() });
  saveQuizzesRegistry(registry);
  return true;
}

export function moveQuestionToQuiz(questionId: string, targetQuizId: string): boolean {
  const registry = getAllQuizzesRegistry();
  const targetQuiz = registry.find(q => q.id === targetQuizId);
  if (!targetQuiz) return false;

  // Remove from old quiz
  registry.forEach(q => {
    if (q.questionIds) {
      q.questionIds = q.questionIds.filter(id => id !== questionId);
    }
  });

  // Add to target quiz
  if (!targetQuiz.questionIds.includes(questionId)) {
    targetQuiz.questionIds.push(questionId);
  }

  saveQuizzesRegistry(registry);
  return true;
}
`;

fs.writeFileSync('src/data/topics.ts', fileHeader, 'utf8');
console.log('Successfully written updated src/data/topics.ts!');
