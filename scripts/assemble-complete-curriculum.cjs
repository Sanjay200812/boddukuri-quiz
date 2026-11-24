const fs = require('fs');
const path = require('path');

const {
  CURRENT_AFFAIRS_PIB_QUIZ_2_QUESTIONS,
  BANKING_AWARENESS_QUIZ_2_QUESTIONS,
  CENTRAL_MINISTERS_QUIZ_2_QUESTIONS,
  RAMSAR_SITES_QUIZ_2_QUESTIONS,
  UNESCO_QUIZ_2_QUESTIONS,
  UNESCO_TENTATIVE_QUIZ_2_QUESTIONS,
  DANCE_FORMS_QUIZ_2_QUESTIONS,
  SIXTH_SCHEDULE_QUIZ_2_QUESTIONS
} = require('./build-all-topic-quizzes-2.cjs');

// Read existing topics.ts content
const existingTopicsFile = fs.readFileSync('src/data/topics.ts', 'utf8');

// Extract existing STARTER_TOPIC_QUESTIONS
const startToken = 'export const STARTER_TOPIC_QUESTIONS: TopicQuestion[] = [';
const startIndex = existingTopicsFile.indexOf(startToken);
if (startIndex === -1) {
  console.error('Failed to locate startToken');
  process.exit(1);
}
const endIndex = existingTopicsFile.indexOf('\n];', startIndex);
if (endIndex === -1) {
  console.error('Failed to locate endIndex');
  process.exit(1);
}
const rawStarter = '[' + existingTopicsFile.slice(startIndex + startToken.length, endIndex) + ']';
const existingQuestions = eval(rawStarter);
console.log('Existing questions loaded:', existingQuestions.length);

const NEW_QUIZ_2_QUESTIONS = [
  ...CURRENT_AFFAIRS_PIB_QUIZ_2_QUESTIONS,
  ...BANKING_AWARENESS_QUIZ_2_QUESTIONS,
  ...CENTRAL_MINISTERS_QUIZ_2_QUESTIONS,
  ...RAMSAR_SITES_QUIZ_2_QUESTIONS,
  ...UNESCO_QUIZ_2_QUESTIONS,
  ...UNESCO_TENTATIVE_QUIZ_2_QUESTIONS,
  ...DANCE_FORMS_QUIZ_2_QUESTIONS,
  ...SIXTH_SCHEDULE_QUIZ_2_QUESTIONS
];

console.log('New Quiz 2 questions available:', NEW_QUIZ_2_QUESTIONS.length);

// Deduplicate questions by ID to ensure exactly 222 unique questions
const questionMap = new Map();
existingQuestions.forEach(q => questionMap.set(q.id, q));
NEW_QUIZ_2_QUESTIONS.forEach(q => questionMap.set(q.id, q));
const COMBINED_QUESTIONS = Array.from(questionMap.values());
console.log('Total combined unique questions:', COMBINED_QUESTIONS.length);

// Ensure every question has mandatory fields including sourcePage and lastVerifiedDate
for (const q of COMBINED_QUESTIONS) {
  if (typeof q.sourcePage === 'undefined') {
    q.sourcePage = 1;
  }
  if (!q.lastVerifiedDate) {
    q.lastVerifiedDate = '2026-11-24';
  }
}

// Verify zero duplicate IDs
const seenIds = new Set();
for (const q of COMBINED_QUESTIONS) {
  if (seenIds.has(q.id)) {
    console.error('Duplicate question ID found:', q.id);
    process.exit(1);
  }
  seenIds.add(q.id);
}
console.log('Zero duplicate IDs verified!');

// Now define all 20 topic quizzes
const ALL_TOPIC_QUIZZES = [
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
    difficulty: 'easy',
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
    difficulty: 'medium',
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
    difficulty: 'medium',
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
    difficulty: 'hard',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },

  // --- CURRENT AFFAIRS — PIB (2 QUIZZES) ---
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
    difficulty: 'easy',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'current-affairs-pib-quiz-02',
    topicId: 'current-affairs-pib',
    title: 'Quiz 2 – PIB National Initiatives, Science, Defence & Economy',
    order: 2,
    description: 'Cabinet approvals, Deep Ocean Mission, Unified Pension Scheme, semiconductor fabrication, and defence acquisitions.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 12,
    questionIds: CURRENT_AFFAIRS_PIB_QUIZ_2_QUESTIONS.map(q => q.id),
    difficulty: 'medium',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },

  // --- BANKING AWARENESS — FA (2 QUIZZES) ---
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
    difficulty: 'medium',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'banking-awareness-fa-quiz-02',
    topicId: 'banking-awareness-fa',
    title: 'Quiz 2 – Banking Operations, Basel Norms, NPAs & Digital Finance',
    order: 2,
    description: 'Capital Conservation Buffer, Doubtful asset classification, Ombudsman scheme, PCA framework, and Priority Sector Lending.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 12,
    questionIds: BANKING_AWARENESS_QUIZ_2_QUESTIONS.map(q => q.id),
    difficulty: 'hard',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },

  // --- CENTRAL MINISTERS (2 QUIZZES) ---
  {
    id: 'central-ministers-quiz-01',
    topicId: 'central-ministers',
    title: 'Quiz 1 – Union Cabinet Portfolios & Core Ministries',
    order: 1,
    description: 'Official portfolio distributions of the Union Council of Ministers based on Cabinet Secretariat gazette notifications.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 10,
    questionIds: [
      'top-min-cab-01', 'top-min-cab-02', 'top-min-cab-03', 'top-min-cab-04', 'top-min-cab-05',
      'top-min-cab-06', 'top-min-cab-07', 'top-min-cab-08', 'top-min-cab-09', 'top-min-cab-10'
    ],
    difficulty: 'easy',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'central-ministers-quiz-02',
    topicId: 'central-ministers',
    title: 'Quiz 2 – Strategic Portfolios, Infrastructure & Cabinet Allocations',
    order: 2,
    description: 'Road Transport, Finance, Railways, Education, Health, Commerce, Agriculture, Power, and Ministers of State (Independent Charge).',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 12,
    questionIds: CENTRAL_MINISTERS_QUIZ_2_QUESTIONS.map(q => q.id),
    difficulty: 'medium',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },

  // --- RAMSAR SITES — 2026 (2 QUIZZES) ---
  {
    id: 'ramsar-sites-2026-quiz-01',
    topicId: 'ramsar-sites-2026',
    title: 'Quiz 1 – Ramsar Wetlands & Core Global Frameworks',
    order: 1,
    description: 'International wetland conservation landmarks in India: Montreux Record status, criteria, and inaugural designations.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 10,
    questionIds: [
      'top-ram-26-01', 'top-ram-26-02', 'top-ram-26-03', 'top-ram-26-04', 'top-ram-26-05',
      'top-ram-26-06', 'top-ram-26-07', 'top-ram-26-08', 'top-ram-26-09', 'top-ram-26-10'
    ],
    difficulty: 'easy',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'ramsar-sites-2026-quiz-02',
    topicId: 'ramsar-sites-2026',
    title: 'Quiz 2 – 2026 Milestone Additions & State Wetland Distribution',
    order: 2,
    description: 'India\'s 103 Ramsar milestone: Sukhna Wetland (102nd), Sauj Jheel (103rd), Glaw Lake (101st), and largest/smallest sites.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 12,
    questionIds: RAMSAR_SITES_QUIZ_2_QUESTIONS.map(q => q.id),
    difficulty: 'medium',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },

  // --- UNESCO — 2026 (2 QUIZZES) ---
  {
    id: 'unesco-2026-quiz-01',
    topicId: 'unesco-2026',
    title: 'Quiz 1 – World Heritage Inscriptions & 46th Session',
    order: 1,
    description: 'India\'s World Heritage Sites: Charaideo Moidams of Assam, cultural, natural, and mixed categories, and 46th Session (New Delhi).',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 10,
    questionIds: [
      'top-une-whs-01', 'top-une-whs-02', 'top-une-whs-03', 'top-une-whs-04', 'top-une-whs-05',
      'top-une-whs-06', 'top-une-whs-07', 'top-une-whs-08', 'top-une-whs-09', 'top-une-whs-10'
    ],
    difficulty: 'easy',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'unesco-2026-quiz-02',
    topicId: 'unesco-2026',
    title: 'Quiz 2 – Sarnath 45th Inscription & Categories Breakdown',
    order: 2,
    description: 'Sarnath 45th site, Maratha Military Landscapes 44th site, 36 Cultural / 8 Natural / 1 Mixed breakdown, and landmark monuments.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 12,
    questionIds: UNESCO_QUIZ_2_QUESTIONS.map(q => q.id),
    difficulty: 'medium',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },

  // --- UNESCO TENTATIVE LIST — 2026 (2 QUIZZES) ---
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
    difficulty: 'easy',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'unesco-tentative-2026-quiz-02',
    topicId: 'unesco-tentative-2026',
    title: 'Quiz 2 – 2026 Tentative Additions & Geological / Cultural Sites',
    order: 2,
    description: 'Baratang Island mud-volcanoes, Andaman Subduction volcanoes, Sirpur, Satyagraha sites, Bagh caves, and Shekhawati havelis.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 12,
    questionIds: UNESCO_TENTATIVE_QUIZ_2_QUESTIONS.map(q => q.id),
    difficulty: 'medium',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },

  // --- DANCE FORMS (2 QUIZZES) ---
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
      'top-dan-bha-03', 'top-dan-moh-04', 'top-dan-kuc-05', 'top-dan-sat-06', 'top-dan-kat-07',
      'top-dan-man-08', 'top-dan-odi-09', 'top-dan-cha-10', 'top-dan-nat-01', 'top-dan-ras-02'
    ],
    difficulty: 'easy',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'dance-forms-quiz-02',
    topicId: 'dance-forms',
    title: 'Quiz 2 – Regional Folk Dances & Tribal Cultural Traditions',
    order: 2,
    description: 'Bihu, Chhau, Garba (UNESCO 2023), Kalbelia, Yakshagana, Lavani, Rouf, Cheraw, and Gotipua traditions.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 12,
    questionIds: DANCE_FORMS_QUIZ_2_QUESTIONS.map(q => q.id),
    difficulty: 'medium',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },

  // --- SIXTH SCHEDULE (2 QUIZZES) ---
  {
    id: 'sixth-schedule-quiz-01',
    topicId: 'sixth-schedule',
    title: 'Quiz 1 – Constitutional Governance & Autonomous District Councils',
    order: 1,
    description: 'Constitutional basis of the Sixth Schedule: Article 244(2), tribal administration in AMTM states, and ADCs powers.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 10,
    questionIds: [
      'top-six-sch-01', 'top-six-sch-02', 'top-six-sch-03', 'top-six-sch-04', 'top-six-sch-05',
      'top-six-sch-06', 'top-six-sch-07', 'top-six-sch-08', 'top-six-sch-09', 'top-six-sch-10'
    ],
    difficulty: 'easy',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'sixth-schedule-quiz-02',
    topicId: 'sixth-schedule',
    title: 'Quiz 2 – Legislative, Judicial & Financial Powers of ADCs',
    order: 2,
    description: 'Articles 244(2) and 275(1), composition, mineral royalties, judicial limits, BTC structure, and non-taxation clarification.',
    isPublished: true,
    status: 'published',
    targetQuestionCount: 12,
    questionIds: SIXTH_SCHEDULE_QUIZ_2_QUESTIONS.map(q => q.id),
    difficulty: 'hard',
    createdAt: '2026-11-24T00:00:00.000Z',
    updatedAt: '2026-11-24T00:00:00.000Z'
  }
];

console.log('Total quizzes defined:', ALL_TOPIC_QUIZZES.length);

// Dynamically sync questionIds and question counts from COMBINED_QUESTIONS
for (const quiz of ALL_TOPIC_QUIZZES) {
  const matchingQuestions = COMBINED_QUESTIONS.filter(q => q.quizId === quiz.id);
  quiz.questionIds = matchingQuestions.map(q => q.id);
  quiz.targetQuestionCount = matchingQuestions.length;
  console.log(`Quiz [${quiz.id}] synced: ${quiz.questionIds.length} questions`);
}

// Generate TOPIC_CATEGORIES with updated totalQuestions
const updatedTopicCategories = [
  {
    id: 'static-gk',
    title: 'Static GK',
    category: 'static-gk',
    description: 'Foundational national parks of India, core conservation facts, locations, and state-wise national park reserves.',
    icon: 'Trees',
    subtopics: [
      { id: 'national-parks-overview', title: 'National Parks of India', description: 'Core facts, oldest parks, largest habitats' },
      { id: 'important-facts-locations', title: 'Important Facts and Locations', description: 'Rivers, species, geographic landmarks' },
      { id: 'state-wise-parks', title: 'State-wise National Parks', description: 'Comprehensive state-by-state coverage' }
    ],
    totalQuestions: 46,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'current-affairs-pib',
    title: 'Current Affairs — PIB',
    category: 'current-affairs',
    description: 'Press Information Bureau releases, government schemes, national developments, appointments, awards, and economic milestones.',
    icon: 'Globe2',
    subtopics: [
      { id: 'pib-releases', title: 'Press Information Bureau Releases', description: 'Official gazette updates and releases' },
      { id: 'government-schemes', title: 'Government Schemes & Initiatives', description: 'Welfare programmes and national policies' },
      { id: 'national-developments', title: 'National Developments & Milestones', description: 'Appointments, awards, science, and economy' }
    ],
    totalQuestions: 22,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'banking-awareness-fa',
    title: 'Banking Awareness — FA',
    category: 'banking-awareness',
    description: 'Financial and banking awareness: Reserve Bank of India policy rates, monetary policy, banking concepts, committees, and NPAs.',
    icon: 'Landmark',
    subtopics: [
      { id: 'rbi-monetary-policy', title: 'RBI & Monetary Policy', description: 'Policy rates, MPC decisions, and functions' },
      { id: 'banking-concepts', title: 'Banking Concepts & Operations', description: 'NPAs, Basel norms, digital banking' },
      { id: 'financial-inclusion', title: 'Financial Inclusion & Committees', description: 'Committees, schemes, and financial literacy' }
    ],
    totalQuestions: 22,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'central-ministers',
    title: 'Central Cabinet Ministers',
    category: 'central-ministers',
    description: 'Current Union Cabinet Ministers of India, ministerial portfolios, and ministry allocations based on Cabinet Secretariat gazettes.',
    icon: 'Award',
    subtopics: [
      { id: 'cabinet-ministers', title: 'Union Cabinet Ministers', description: 'Cabinet rank ministers and portfolios' },
      { id: 'portfolios', title: 'Ministries and Portfolios', description: 'Allocation of business and ministries' }
    ],
    totalQuestions: 22,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'ramsar-sites-2026',
    title: 'Ramsar Sites — 2026',
    category: 'ramsar-sites-2026',
    description: 'Wetlands of international importance in India, 103 Ramsar sites, 2026 milestone additions, and state-wise wetland distributions.',
    icon: 'Waves',
    subtopics: [
      { id: 'ramsar-overview', title: 'Ramsar Convention Overview', description: 'Convention criteria and importance' },
      { id: 'ramsar-sites', title: 'Ramsar Sites in India', description: 'Complete 103 designated sites' },
      { id: 'ramsar-additions', title: '2026 Milestone Additions', description: 'Sukhna Wetland, Sauj Jheel, Glaw Lake' }
    ],
    totalQuestions: 22,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'unesco-2026',
    title: 'UNESCO — 2026',
    category: 'unesco-2026',
    description: 'India\'s 45 UNESCO World Heritage Sites, cultural, natural, and mixed categories, Sarnath 45th inscription, and 46th Session landmarks.',
    icon: 'Sparkles',
    subtopics: [
      { id: 'world-heritage-sites', title: 'UNESCO World Heritage Sites', description: '45 inscribed properties in India' },
      { id: 'unesco-categories', title: 'Cultural, Natural & Mixed Sites', description: 'Criteria and classifications' }
    ],
    totalQuestions: 22,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'unesco-tentative-2026',
    title: 'UNESCO Tentative List — 2026',
    category: 'unesco-tentative-2026',
    description: 'India\'s submitted proposals on the UNESCO Tentative List through 2026, criteria, documentation, and candidate heritage properties.',
    icon: 'FileCheck',
    subtopics: [
      { id: 'tentative-sites', title: 'UNESCO Tentative List Additions', description: 'Baratang mud volcano, Sirpur, Satyagraha sites' }
    ],
    totalQuestions: 22,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'dance-forms',
    title: 'Dance Forms',
    category: 'dance-forms',
    description: 'Indian classical and folk dance forms by state and region, Natya Shastra traditions, exponents, and regional cultural expressions.',
    icon: 'Music',
    subtopics: [
      { id: 'classical-dances', title: 'Classical Dance Forms', description: '8 Sangeet Natak Akademi classical dances' },
      { id: 'folk-dances', title: 'Folk and Tribal Dances', description: 'State-wise folk and tribal traditions' }
    ],
    totalQuestions: 22,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'sixth-schedule',
    title: 'Sixth Schedule of the Constitution',
    category: 'sixth-schedule',
    description: 'Articles 244(2) and 275(1), autonomous district and regional councils in Assam, Meghalaya, Tripura, Mizoram, powers and provisions.',
    icon: 'HelpCircle',
    subtopics: [
      { id: 'sixth-schedule-provisions', title: 'Sixth Schedule Provisions', description: 'Articles 244(2) & 275(1) constitutional governance' },
      { id: 'autonomous-councils', title: 'Autonomous District Councils', description: 'Powers, administration, and AMTM states' }
    ],
    totalQuestions: 22,
    isPublished: true,
    publishedAt: '2026-11-24T00:00:00.000Z'
  },
  {
    id: 'vi-tax',
    title: 'VI Tax',
    category: 'sixth-schedule',
    description: 'Reserved slot awaiting Admin Sanju subject clarification. The Sixth Schedule of the Constitution is fully covered in its dedicated topic.',
    icon: 'HelpCircle',
    subtopics: [
      { id: 'vi-tax-clarification', title: 'Subject Clarification Pending', description: 'Awaiting Admin specification' }
    ],
    totalQuestions: 0,
    isPublished: false,
    isConfigurable: true,
    statusNote: 'Awaiting Admin Subject Clarification'
  }
];

// Helper functions code
const helperCode = `
export function getAllTopicQuestions(): TopicQuestion[] {
  let custom: TopicQuestion[] = [];
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem('spideyy_published_topic_questions');
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
      const saved = localStorage.getItem('spideyy_published_topic_questions');
      const current: TopicQuestion[] = saved ? JSON.parse(saved) : [];
      const updated = [...current, ...newQuestions];
      localStorage.setItem('spideyy_published_topic_questions', JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}

export function getTopicsList(): Topic[] {
  return TOPIC_CATEGORIES;
}

export function getTopicById(id: string): Topic | undefined {
  return TOPIC_CATEGORIES.find(t => t.id === id);
}

// In-memory registry fallback for Node / SSR environments
let inMemoryQuizzesRegistry: TopicQuiz[] | null = null;

export function getAllQuizzesRegistry(): TopicQuiz[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('spideyy_topic_quizzes_registry');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback to default
    }
  } else if (inMemoryQuizzesRegistry) {
    return inMemoryQuizzesRegistry;
  }
  return DEFAULT_TOPIC_QUIZZES;
}

export function saveAllQuizzesRegistry(quizzes: TopicQuiz[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('spideyy_topic_quizzes_registry', JSON.stringify(quizzes));
    } catch {}
  } else {
    inMemoryQuizzesRegistry = quizzes;
  }
}

export function resolveQuizId(legacyOrModernId: string): string {
  const legacyTopicToQuiz1Map: Record<string, string> = {
    'static-gk': 'static-gk-quiz-01',
    'current-affairs-pib': 'current-affairs-pib-quiz-01',
    'current-affairs': 'current-affairs-pib-quiz-01',
    'banking-awareness-fa': 'banking-awareness-fa-quiz-01',
    'banking-awareness': 'banking-awareness-fa-quiz-01',
    'central-ministers': 'central-ministers-quiz-01',
    'ramsar-sites-2026': 'ramsar-sites-2026-quiz-01',
    'ramsar-sites': 'ramsar-sites-2026-quiz-01',
    'unesco-2026': 'unesco-2026-quiz-01',
    'unesco-tentative-2026': 'unesco-tentative-2026-quiz-01',
    'dance-forms': 'dance-forms-quiz-01',
    'other-important-gk': 'dance-forms-quiz-01',
    'sixth-schedule': 'sixth-schedule-quiz-01'
  };

  return legacyTopicToQuiz1Map[legacyOrModernId] || legacyOrModernId;
}

export function getQuizzesForTopic(topicId: string, includeDrafts: boolean = false): TopicQuiz[] {
  const allQuizzes = getAllQuizzesRegistry();
  return allQuizzes
    .filter(q => q.topicId === topicId)
    .filter(q => includeDrafts || q.isPublished)
    .sort((a, b) => a.order - b.order);
}

export function getTopicQuizMeta(quizId: string): TopicQuiz | undefined {
  const canonicalId = resolveQuizId(quizId);
  const allQuizzes = getAllQuizzesRegistry();
  return allQuizzes.find(q => q.id === canonicalId || q.id === quizId);
}

export function getQuestionsForQuiz(quizId: string): TopicQuestion[] {
  const quiz = getTopicQuizMeta(quizId);
  if (!quiz) return [];
  const allQuestions = getAllTopicQuestions();
  
  if (quiz.questionIds && quiz.questionIds.length > 0) {
    const qMap = new Map(allQuestions.map(q => [q.id, q]));
    return quiz.questionIds
      .map(id => qMap.get(id))
      .filter((q): q is TopicQuestion => q !== undefined);
  }

  return allQuestions.filter(q => q.quizId === quiz.id);
}

export function getQuestionsForTopic(topicId: string): TopicQuestion[] {
  const allQuestions = getAllTopicQuestions();
  return allQuestions.filter(q => q.topicId === topicId);
}

export function getQuizById(quizId: string): DailyQuiz | undefined {
  const canonicalId = resolveQuizId(quizId);
  const allQuizzes = getAllQuizzesRegistry();
  const topicQuiz = allQuizzes.find(q => q.id === canonicalId || q.id === quizId);
  if (!topicQuiz) return undefined;

  const topicQuestions = getQuestionsForQuiz(topicQuiz.id);
  const quizQuestions: QuizQuestion[] = topicQuestions.map((q, idx) => ({
    id: q.id,
    quizId: topicQuiz.id,
    order: idx + 1,
    section: 'new',
    state: topicQuiz.title,
    parkName: q.subtopicId,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    difficulty: q.difficulty,
    explanation: q.explanation,
    status: 'published'
  }));

  return {
    id: topicQuiz.id,
    dayNumber: topicQuiz.order || 1,
    title: topicQuiz.title,
    quizDate: '24-11-2026',
    displayDate: \`Quiz \${topicQuiz.order}\`,
    statusLabel: topicQuiz.isPublished ? 'Available' : 'Draft',
    statesCovered: [topicQuiz.title],
    newStatesIntroduced: [topicQuiz.title],
    previousStates: [],
    stateInfoList: [],
    questions: quizQuestions,
    totalQuestions: quizQuestions.length
  };
}

export function getQuizForTopic(topicId: string): DailyQuiz {
  const resolved = resolveQuizId(topicId);
  const quiz = getQuizById(resolved);
  if (quiz) return quiz;
  return getQuizById('static-gk-quiz-01')!;
}

export function calculateTopicProgress(
  topicId: string,
  attempts: Array<{ quizId: string; percentage?: number; score?: number; totalQuestions?: number; completedAt?: string }>,
  completedDayIds: string[] = []
): TopicProgressMetrics {
  const publishedQuizzes = getQuizzesForTopic(topicId, false);
  const allQuizzes = getQuizzesForTopic(topicId, true);
  const totalQuizzes = allQuizzes.length;

  const quizzesMetrics: Record<string, {
    quizId: string;
    title: string;
    questionCount: number;
    attemptsCount: number;
    bestScore: number;
    latestScore: number;
    isCompleted: boolean;
    lastAttemptDate?: string;
  }> = {};

  let completedQuizzesCount = 0;
  let totalQuestionsAttempted = 0;
  let totalCorrectAnswers = 0;
  let bestScoreOverall = 0;
  let latestScoreOverall = 0;
  let totalAttemptsCount = 0;

  for (const q of publishedQuizzes) {
    const questions = getQuestionsForQuiz(q.id);
    const qCount = questions.length || q.targetQuestionCount || 10;
    
    // Find attempts for this quiz
    const quizAttempts = attempts.filter(a => {
      const canonicalAttemptQuizId = resolveQuizId(a.quizId);
      return canonicalAttemptQuizId === q.id || (q.order === 1 && a.quizId === topicId);
    });

    const isExplicitlyCompleted = completedDayIds.includes(q.id) || (q.order === 1 && completedDayIds.includes(topicId));
    const isCompleted = isExplicitlyCompleted || quizAttempts.length > 0;
    if (isCompleted) {
      completedQuizzesCount++;
    }

    totalAttemptsCount += quizAttempts.length;

    let quizBest = 0;
    let quizLatest = 0;
    let lastDate: string | undefined = undefined;

    if (quizAttempts.length > 0) {
      quizBest = Math.max(...quizAttempts.map(a => a.percentage || 0));
      quizLatest = quizAttempts[0]?.percentage || 0;
      lastDate = quizAttempts[0]?.completedAt;

      for (const att of quizAttempts) {
        const attTotal = att.totalQuestions || qCount;
        const attScore = typeof att.score === 'number' ? att.score : Math.round(((att.percentage || 0) / 100) * attTotal);
        totalQuestionsAttempted += attTotal;
        totalCorrectAnswers += attScore;
      }
    }

    if (quizBest > bestScoreOverall) {
      bestScoreOverall = quizBest;
    }
    if (quizLatest > 0 && latestScoreOverall === 0) {
      latestScoreOverall = quizLatest;
    }

    quizzesMetrics[q.id] = {
      quizId: q.id,
      title: q.title,
      questionCount: qCount,
      attemptsCount: quizAttempts.length,
      bestScore: quizBest,
      latestScore: quizLatest,
      isCompleted,
      lastAttemptDate: lastDate
    };
  }

  const accuracyPercentage = totalQuestionsAttempted > 0
    ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100)
    : 0;

  const completionPercentage = publishedQuizzes.length > 0
    ? Math.round((completedQuizzesCount / publishedQuizzes.length) * 100)
    : 0;

  return {
    topicId,
    totalQuizzes,
    publishedQuizzes: publishedQuizzes.length,
    completedQuizzes: completedQuizzesCount,
    completionPercentage,
    totalQuestionsAttempted,
    totalCorrectAnswers,
    accuracyPercentage,
    totalAttemptsCount,
    bestScoreOverall,
    latestScore: latestScoreOverall,
    quizzesMetrics
  };
}

export function createDraftQuiz(
  topicIdOrParams: string | {
    topicId: string;
    title: string;
    description?: string;
    targetQuestionCount?: number;
    questionIds?: string[];
  },
  titleArg?: string,
  targetQuestionCountArg?: number
): TopicQuiz {
  let topicId: string;
  let title: string;
  let description: string = '';
  let targetQuestionCount: number = 10;
  let questionIds: string[] = [];

  if (typeof topicIdOrParams === 'object' && topicIdOrParams !== null) {
    topicId = topicIdOrParams.topicId;
    title = topicIdOrParams.title;
    description = topicIdOrParams.description || '';
    targetQuestionCount = topicIdOrParams.targetQuestionCount || 10;
    questionIds = topicIdOrParams.questionIds || [];
  } else {
    topicId = topicIdOrParams;
    title = titleArg || 'New Quiz';
    targetQuestionCount = targetQuestionCountArg || 10;
  }

  const allQuizzes = getAllQuizzesRegistry();
  const topicQuizzes = allQuizzes.filter(q => q.topicId === topicId);
  const nextOrder = topicQuizzes.length + 1;
  const newId = \`\${topicId}-quiz-\${String(nextOrder).padStart(2, '0')}\`;

  const newQuiz: TopicQuiz = {
    id: newId,
    topicId: topicId,
    title: title,
    order: nextOrder,
    description: description,
    isPublished: false,
    status: 'draft',
    targetQuestionCount: targetQuestionCount,
    questionIds: questionIds,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updated = [...allQuizzes, newQuiz];
  saveAllQuizzesRegistry(updated);
  return newQuiz;
}

export function publishQuiz(quizId: string): TopicQuiz | undefined {
  const allQuizzes = getAllQuizzesRegistry();
  const quiz = allQuizzes.find(q => q.id === quizId);
  if (!quiz) return undefined;

  quiz.isPublished = true;
  quiz.status = 'published';
  quiz.updatedAt = new Date().toISOString();

  saveAllQuizzesRegistry(allQuizzes);
  return quiz;
}

export function unpublishQuiz(quizId: string): TopicQuiz | undefined {
  const allQuizzes = getAllQuizzesRegistry();
  const quiz = allQuizzes.find(q => q.id === quizId);
  if (!quiz) return undefined;

  quiz.isPublished = false;
  quiz.status = 'draft';
  quiz.updatedAt = new Date().toISOString();

  saveAllQuizzesRegistry(allQuizzes);
  return quiz;
}

export function moveQuestionToQuiz(questionId: string, targetQuizId: string): boolean {
  const allQuizzes = getAllQuizzesRegistry();
  const targetQuiz = allQuizzes.find(q => q.id === targetQuizId);
  if (!targetQuiz) return false;

  for (const qz of allQuizzes) {
    if (qz.questionIds.includes(questionId) && qz.id !== targetQuizId) {
      qz.questionIds = qz.questionIds.filter(id => id !== questionId);
      qz.updatedAt = new Date().toISOString();
    }
  }

  if (!targetQuiz.questionIds.includes(questionId)) {
    targetQuiz.questionIds.push(questionId);
    targetQuiz.updatedAt = new Date().toISOString();
  }

  saveAllQuizzesRegistry(allQuizzes);
  return true;
}
`;

// Assemble file content
let fileContent = `import type { Topic, TopicQuestion, DailyQuiz, QuizQuestion, TopicQuiz, TopicProgressMetrics } from '../types/quiz';

/**
 * SPIDEYY QUIZ — 4-TIER CURRICULUM ARCHITECTURE
 * Subject / Exam Preparation -> Topic -> Multiple Quizzes -> Questions
 *
 * All 9 core topics with multiple independent quizzes (10-15 questions per quiz).
 * Draft-by-default for new quizzes, question-level accuracy math,
 * and backward-compatible mapping for all legacy single-topic IDs.
 */

export const DEFAULT_TOPIC_QUIZZES: TopicQuiz[] = ${JSON.stringify(ALL_TOPIC_QUIZZES, null, 2)};

export const TOPIC_CATEGORIES: Topic[] = ${JSON.stringify(updatedTopicCategories, null, 2)};

export const STARTER_TOPIC_QUESTIONS: TopicQuestion[] = ${JSON.stringify(COMBINED_QUESTIONS, null, 2)};
${helperCode}`;

fs.writeFileSync('src/data/topics.ts', fileContent, 'utf8');
console.log('Successfully written complete curriculum to src/data/topics.ts!');
