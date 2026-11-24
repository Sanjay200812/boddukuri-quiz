import type { Topic, TopicQuestion, DailyQuiz, QuizQuestion, TopicQuiz, TopicProgressMetrics } from '../types/quiz';

/**
 * SPIDEYY QUIZ — 4-TIER CURRICULUM ARCHITECTURE
 * Subject / Exam Preparation -> Topic -> Multiple Quizzes -> Questions
 *
 * All 9 core topics with multiple independent quizzes (10-15 questions per quiz).
 * Draft-by-default for new quizzes, question-level accuracy math,
 * and backward-compatible mapping for all legacy single-topic IDs.
 */

export const DEFAULT_TOPIC_QUIZZES: TopicQuiz[] = [
  {
    "id": "static-gk-quiz-01",
    "topicId": "static-gk",
    "title": "Quiz 1 – National Parks Part 1 (Core Foundations & World Heritage)",
    "order": 1,
    "description": "Foundational national parks of India: oldest reserves, largest protected landscapes, and UNESCO World Heritage conservation biomes.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 10,
    "questionIds": [
      "top-sgk-np-01",
      "top-sgk-np-02",
      "top-sgk-np-03",
      "top-sgk-np-04",
      "top-sgk-np-05",
      "top-sgk-np-06",
      "top-sgk-np-07",
      "top-sgk-np-08",
      "top-sgk-np-09",
      "top-sgk-np-10"
    ],
    "difficulty": "easy",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "static-gk-quiz-02",
    "topicId": "static-gk",
    "title": "Quiz 2 – National Parks Part 2 (Northern & Western Himalayan Reserves)",
    "order": 2,
    "description": "Alpine sanctuaries, Trans-Himalayan biomes, and desert reserves across Jammu & Kashmir, Ladakh, Himachal Pradesh, Uttarakhand, Rajasthan, and Gujarat.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 12,
    "questionIds": [
      "top-sgk-np-q02-01",
      "top-sgk-np-q02-02",
      "top-sgk-np-q02-03",
      "top-sgk-np-q02-04",
      "top-sgk-np-q02-05",
      "top-sgk-np-q02-06",
      "top-sgk-np-q02-07",
      "top-sgk-np-q02-08",
      "top-sgk-np-q02-09",
      "top-sgk-np-q02-10",
      "top-sgk-np-q02-11",
      "top-sgk-np-q02-12"
    ],
    "difficulty": "medium",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "static-gk-quiz-03",
    "topicId": "static-gk",
    "title": "Quiz 3 – National Parks Part 3 (Central & Eastern Heartland Reserves)",
    "order": 3,
    "description": "Tiger reserves, Project Cheetah habitats, limestone caves, and coastal delta mangrove networks across Madhya Pradesh, Maharashtra, Chhattisgarh, Odisha, and West Bengal.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 12,
    "questionIds": [
      "top-sgk-np-q03-01",
      "top-sgk-np-q03-02",
      "top-sgk-np-q03-03",
      "top-sgk-np-q03-04",
      "top-sgk-np-q03-05",
      "top-sgk-np-q03-06",
      "top-sgk-np-q03-07",
      "top-sgk-np-q03-08",
      "top-sgk-np-q03-09",
      "top-sgk-np-q03-10",
      "top-sgk-np-q03-11",
      "top-sgk-np-q03-12"
    ],
    "difficulty": "medium",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "static-gk-quiz-04",
    "topicId": "static-gk",
    "title": "Quiz 4 – National Parks Part 4 (Southern Biomes & North-East Jewels)",
    "order": 4,
    "description": "Biodiversity hotspots, Western Ghats montane sholas, river islands, marine biomes, and island rainforests in Assam, Arunachal Pradesh, Manipur, Kerala, Tamil Nadu, and Andaman & Nicobar.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 12,
    "questionIds": [
      "top-sgk-np-q04-01",
      "top-sgk-np-q04-02",
      "top-sgk-np-q04-03",
      "top-sgk-np-q04-04",
      "top-sgk-np-q04-05",
      "top-sgk-np-q04-06",
      "top-sgk-np-q04-07",
      "top-sgk-np-q04-08",
      "top-sgk-np-q04-09",
      "top-sgk-np-q04-10",
      "top-sgk-np-q04-11",
      "top-sgk-np-q04-12"
    ],
    "difficulty": "hard",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "current-affairs-pib-quiz-01",
    "topicId": "current-affairs-pib",
    "title": "Quiz 1 – PIB Flagship Schemes & National Developments",
    "order": 1,
    "description": "Official Press Information Bureau notifications, strategic infrastructure milestones, semiconductor missions, and welfare initiatives.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 10,
    "questionIds": [
      "top-ca-nat-01",
      "top-ca-nat-02",
      "top-ca-sch-01",
      "top-ca-sch-02",
      "top-ca-sch-03",
      "top-ca-awd-01",
      "top-ca-awd-02",
      "top-ca-pib-01",
      "top-ca-pib-02",
      "top-ca-rep-01"
    ],
    "difficulty": "easy",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "current-affairs-pib-quiz-02",
    "topicId": "current-affairs-pib",
    "title": "Quiz 2 – PIB National Initiatives, Science, Defence & Economy",
    "order": 2,
    "description": "Cabinet approvals, Deep Ocean Mission, Unified Pension Scheme, semiconductor fabrication, and defence acquisitions.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 12,
    "questionIds": [
      "top-cap-pib-q02-01",
      "top-cap-pib-q02-02",
      "top-cap-pib-q02-03",
      "top-cap-pib-q02-04",
      "top-cap-pib-q02-05",
      "top-cap-pib-q02-06",
      "top-cap-pib-q02-07",
      "top-cap-pib-q02-08",
      "top-cap-pib-q02-09",
      "top-cap-pib-q02-10",
      "top-cap-pib-q02-11",
      "top-cap-pib-q02-12"
    ],
    "difficulty": "medium",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "banking-awareness-fa-quiz-01",
    "topicId": "banking-awareness-fa",
    "title": "Quiz 1 – RBI Monetary Policy & Financial Frameworks",
    "order": 1,
    "description": "Reserve Bank of India policy rates, NPA prudential guidelines, Basel III capital adequacy, DICGC ceilings, and CBDC digital rupee pilots.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 10,
    "questionIds": [
      "top-ba-mp-01",
      "top-ba-mp-02",
      "top-ba-term-01",
      "top-ba-term-02",
      "top-ba-term-03",
      "top-ba-inst-01",
      "top-ba-inst-02",
      "top-ba-sch-01",
      "top-ba-sch-02",
      "top-ba-dev-01"
    ],
    "difficulty": "medium",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "banking-awareness-fa-quiz-02",
    "topicId": "banking-awareness-fa",
    "title": "Quiz 2 – Banking Operations, Basel Norms, NPAs & Digital Finance",
    "order": 2,
    "description": "Capital Conservation Buffer, Doubtful asset classification, Ombudsman scheme, PCA framework, and Priority Sector Lending.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 12,
    "questionIds": [
      "top-bfa-rbi-q02-01",
      "top-bfa-rbi-q02-02",
      "top-bfa-rbi-q02-03",
      "top-bfa-rbi-q02-04",
      "top-bfa-rbi-q02-05",
      "top-bfa-rbi-q02-06",
      "top-bfa-rbi-q02-07",
      "top-bfa-rbi-q02-08",
      "top-bfa-rbi-q02-09",
      "top-bfa-rbi-q02-10",
      "top-bfa-rbi-q02-11",
      "top-bfa-rbi-q02-12"
    ],
    "difficulty": "hard",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "central-ministers-quiz-01",
    "topicId": "central-ministers",
    "title": "Quiz 1 – Union Cabinet Portfolios & Core Ministries",
    "order": 1,
    "description": "Official portfolio distributions of the Union Council of Ministers based on Cabinet Secretariat gazette notifications.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 10,
    "questionIds": [
      "top-ccm-def-01",
      "top-ccm-hom-01",
      "top-ccm-fin-01",
      "top-ccm-ext-01",
      "top-ccm-rdt-01",
      "top-ccm-rlw-01",
      "top-ccm-edu-01",
      "top-ccm-hlt-01",
      "top-ccm-agr-01",
      "top-ccm-ind-01"
    ],
    "difficulty": "easy",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "central-ministers-quiz-02",
    "topicId": "central-ministers",
    "title": "Quiz 2 – Strategic Portfolios, Infrastructure & Cabinet Allocations",
    "order": 2,
    "description": "Road Transport, Finance, Railways, Education, Health, Commerce, Agriculture, Power, and Ministers of State (Independent Charge).",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 12,
    "questionIds": [
      "top-min-cab-q02-01",
      "top-min-cab-q02-02",
      "top-min-cab-q02-03",
      "top-min-cab-q02-04",
      "top-min-cab-q02-05",
      "top-min-cab-q02-06",
      "top-min-cab-q02-07",
      "top-min-cab-q02-08",
      "top-min-cab-q02-09",
      "top-min-cab-q02-10",
      "top-min-cab-q02-11",
      "top-min-cab-q02-12"
    ],
    "difficulty": "medium",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "ramsar-sites-2026-quiz-01",
    "topicId": "ramsar-sites-2026",
    "title": "Quiz 1 – Ramsar Wetlands & Core Global Frameworks",
    "order": 1,
    "description": "International wetland conservation landmarks in India: Montreux Record status, criteria, and inaugural designations.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 10,
    "questionIds": [
      "top-ram-org-01",
      "top-ram-tot-01",
      "top-ram-new-01",
      "top-ram-sta-01",
      "top-ram-sta-02",
      "top-ram-sta-03",
      "top-ram-fst-01",
      "top-ram-lrg-01",
      "top-ram-sml-01",
      "top-ram-mon-01"
    ],
    "difficulty": "easy",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "ramsar-sites-2026-quiz-02",
    "topicId": "ramsar-sites-2026",
    "title": "Quiz 2 – 2026 Milestone Additions & State Wetland Distribution",
    "order": 2,
    "description": "India's 103 Ramsar milestone: Sukhna Wetland (102nd), Sauj Jheel (103rd), Glaw Lake (101st), and largest/smallest sites.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 12,
    "questionIds": [
      "top-ram-26-q02-01",
      "top-ram-26-q02-02",
      "top-ram-26-q02-03",
      "top-ram-26-q02-04",
      "top-ram-26-q02-05",
      "top-ram-26-q02-06",
      "top-ram-26-q02-07",
      "top-ram-26-q02-08",
      "top-ram-26-q02-09",
      "top-ram-26-q02-10",
      "top-ram-26-q02-11",
      "top-ram-26-q02-12"
    ],
    "difficulty": "medium",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "unesco-2026-quiz-01",
    "topicId": "unesco-2026",
    "title": "Quiz 1 – World Heritage Inscriptions & 46th Session",
    "order": 1,
    "description": "India's World Heritage Sites: Charaideo Moidams of Assam, cultural, natural, and mixed categories, and 46th Session (New Delhi).",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 10,
    "questionIds": [
      "top-unesco-46-01",
      "top-unesco-moi-02",
      "top-unesco-tot-03",
      "top-unesco-san-04",
      "top-unesco-hoy-05",
      "top-unesco-mix-06",
      "top-unesco-dho-07",
      "top-unesco-ram-08",
      "top-unesco-nat-09",
      "top-unesco-hst-10"
    ],
    "difficulty": "easy",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "unesco-2026-quiz-02",
    "topicId": "unesco-2026",
    "title": "Quiz 2 – Sarnath 45th Inscription & Categories Breakdown",
    "order": 2,
    "description": "Sarnath 45th site, Maratha Military Landscapes 44th site, 36 Cultural / 8 Natural / 1 Mixed breakdown, and landmark monuments.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 12,
    "questionIds": [
      "top-une-whs-q02-01",
      "top-une-whs-q02-02",
      "top-une-whs-q02-03",
      "top-une-whs-q02-04",
      "top-une-whs-q02-05",
      "top-une-whs-q02-06",
      "top-une-whs-q02-07",
      "top-une-whs-q02-08",
      "top-une-whs-q02-09",
      "top-une-whs-q02-10",
      "top-une-whs-q02-11",
      "top-une-whs-q02-12"
    ],
    "difficulty": "medium",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "unesco-tentative-2026-quiz-01",
    "topicId": "unesco-tentative-2026",
    "title": "Quiz 1 – UNESCO Tentative Nominations & Criteria",
    "order": 1,
    "description": "Heritage properties submitted by the Archaeological Survey of India (ASI) to the UNESCO Tentative List through 2026.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 10,
    "questionIds": [
      "top-tent-mar-01",
      "top-tent-rul-02",
      "top-tent-gwa-03",
      "top-tent-bur-04",
      "top-tent-mod-05",
      "top-tent-vad-06",
      "top-tent-kon-07",
      "top-tent-cri-08",
      "top-tent-dif-09",
      "top-tent-asi-10"
    ],
    "difficulty": "easy",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "unesco-tentative-2026-quiz-02",
    "topicId": "unesco-tentative-2026",
    "title": "Quiz 2 – 2026 Tentative Additions & Geological / Cultural Sites",
    "order": 2,
    "description": "Baratang Island mud-volcanoes, Andaman Subduction volcanoes, Sirpur, Satyagraha sites, Bagh caves, and Shekhawati havelis.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 12,
    "questionIds": [
      "top-unt-26-q02-01",
      "top-une-whs-q02-02-volc",
      "top-unt-26-q02-03",
      "top-unt-26-q02-04",
      "top-unt-26-q02-05",
      "top-unt-26-q02-06",
      "top-unt-26-q02-07",
      "top-unt-26-q02-08",
      "top-unt-26-q02-09",
      "top-unt-26-q02-10",
      "top-unt-26-q02-11",
      "top-unt-26-q02-12"
    ],
    "difficulty": "medium",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "dance-forms-quiz-01",
    "topicId": "dance-forms",
    "title": "Quiz 1 – Classical Traditions, Natya Shastra & Exponents",
    "order": 1,
    "description": "The 8 Sangeet Natak Akademi classical dances, Natya Shastra treatise, regional folk traditions, and legendary master exponents.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 10,
    "questionIds": [
      "top-dan-cls-01",
      "top-dan-sat-02",
      "top-dan-bha-03",
      "top-dan-moh-04",
      "top-dan-kth-05",
      "top-dan-odi-06",
      "top-dan-bih-07",
      "top-dan-gar-08",
      "top-dan-che-09",
      "top-dan-kal-10"
    ],
    "difficulty": "easy",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "dance-forms-quiz-02",
    "topicId": "dance-forms",
    "title": "Quiz 2 – Regional Folk Dances & Tribal Cultural Traditions",
    "order": 2,
    "description": "Bihu, Chhau, Garba (UNESCO 2023), Kalbelia, Yakshagana, Lavani, Rouf, Cheraw, and Gotipua traditions.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 12,
    "questionIds": [
      "top-dan-flk-q02-01",
      "top-dan-flk-q02-02",
      "top-dan-flk-q02-03",
      "top-dan-flk-q02-04",
      "top-dan-flk-q02-05",
      "top-dan-flk-q02-06",
      "top-dan-flk-q02-07",
      "top-dan-flk-q02-08",
      "top-dan-flk-q02-09",
      "top-dan-flk-q02-10",
      "top-dan-flk-q02-11",
      "top-dan-flk-q02-12"
    ],
    "difficulty": "medium",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "sixth-schedule-quiz-01",
    "topicId": "sixth-schedule",
    "title": "Quiz 1 – Constitutional Governance & Autonomous District Councils",
    "order": 1,
    "description": "Constitutional basis of the Sixth Schedule: Article 244(2), tribal administration in AMTM states, and ADCs powers.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 10,
    "questionIds": [
      "top-6th-sched-01",
      "top-6th-sched-02",
      "top-6th-sched-03",
      "top-6th-sched-04",
      "top-6th-sched-05",
      "top-6th-sched-06",
      "top-6th-sched-07",
      "top-6th-sched-08",
      "top-6th-sched-09",
      "top-6th-sched-10"
    ],
    "difficulty": "easy",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "sixth-schedule-quiz-02",
    "topicId": "sixth-schedule",
    "title": "Quiz 2 – Legislative, Judicial & Financial Powers of ADCs",
    "order": 2,
    "description": "Articles 244(2) and 275(1), composition, mineral royalties, judicial limits, BTC structure, and non-taxation clarification.",
    "isPublished": true,
    "status": "published",
    "targetQuestionCount": 12,
    "questionIds": [
      "top-six-sch-q02-01",
      "top-six-sch-q02-02",
      "top-six-sch-q02-03",
      "top-six-sch-q02-04",
      "top-six-sch-q02-05",
      "top-six-sch-q02-06",
      "top-six-sch-q02-07",
      "top-six-sch-q02-08",
      "top-six-sch-q02-09",
      "top-six-sch-q02-10",
      "top-six-sch-q02-11",
      "top-six-sch-q02-12"
    ],
    "difficulty": "hard",
    "createdAt": "2026-11-24T00:00:00.000Z",
    "updatedAt": "2026-11-24T00:00:00.000Z"
  }
];

export const TOPIC_CATEGORIES: Topic[] = [
  {
    "id": "static-gk",
    "title": "Static GK",
    "category": "static-gk",
    "description": "Foundational national parks of India, core conservation facts, locations, and state-wise national park reserves.",
    "icon": "Trees",
    "subtopics": [
      {
        "id": "national-parks-overview",
        "title": "National Parks of India",
        "description": "Core facts, oldest parks, largest habitats"
      },
      {
        "id": "important-facts-locations",
        "title": "Important Facts and Locations",
        "description": "Rivers, species, geographic landmarks"
      },
      {
        "id": "state-wise-parks",
        "title": "State-wise National Parks",
        "description": "Comprehensive state-by-state coverage"
      }
    ],
    "totalQuestions": 46,
    "isPublished": true,
    "publishedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "current-affairs-pib",
    "title": "Current Affairs — PIB",
    "category": "current-affairs",
    "description": "Press Information Bureau releases, government schemes, national developments, appointments, awards, and economic milestones.",
    "icon": "Globe2",
    "subtopics": [
      {
        "id": "pib-releases",
        "title": "Press Information Bureau Releases",
        "description": "Official gazette updates and releases"
      },
      {
        "id": "government-schemes",
        "title": "Government Schemes & Initiatives",
        "description": "Welfare programmes and national policies"
      },
      {
        "id": "national-developments",
        "title": "National Developments & Milestones",
        "description": "Appointments, awards, science, and economy"
      }
    ],
    "totalQuestions": 22,
    "isPublished": true,
    "publishedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "banking-awareness-fa",
    "title": "Banking Awareness — FA",
    "category": "banking-awareness",
    "description": "Financial and banking awareness: Reserve Bank of India policy rates, monetary policy, banking concepts, committees, and NPAs.",
    "icon": "Landmark",
    "subtopics": [
      {
        "id": "rbi-monetary-policy",
        "title": "RBI & Monetary Policy",
        "description": "Policy rates, MPC decisions, and functions"
      },
      {
        "id": "banking-concepts",
        "title": "Banking Concepts & Operations",
        "description": "NPAs, Basel norms, digital banking"
      },
      {
        "id": "financial-inclusion",
        "title": "Financial Inclusion & Committees",
        "description": "Committees, schemes, and financial literacy"
      }
    ],
    "totalQuestions": 22,
    "isPublished": true,
    "publishedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "central-ministers",
    "title": "Central Cabinet Ministers",
    "category": "central-ministers",
    "description": "Current Union Cabinet Ministers of India, ministerial portfolios, and ministry allocations based on Cabinet Secretariat gazettes.",
    "icon": "Award",
    "subtopics": [
      {
        "id": "cabinet-ministers",
        "title": "Union Cabinet Ministers",
        "description": "Cabinet rank ministers and portfolios"
      },
      {
        "id": "portfolios",
        "title": "Ministries and Portfolios",
        "description": "Allocation of business and ministries"
      }
    ],
    "totalQuestions": 22,
    "isPublished": true,
    "publishedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "ramsar-sites-2026",
    "title": "Ramsar Sites — 2026",
    "category": "ramsar-sites-2026",
    "description": "Wetlands of international importance in India, 103 Ramsar sites, 2026 milestone additions, and state-wise wetland distributions.",
    "icon": "Waves",
    "subtopics": [
      {
        "id": "ramsar-overview",
        "title": "Ramsar Convention Overview",
        "description": "Convention criteria and importance"
      },
      {
        "id": "ramsar-sites",
        "title": "Ramsar Sites in India",
        "description": "Complete 103 designated sites"
      },
      {
        "id": "ramsar-additions",
        "title": "2026 Milestone Additions",
        "description": "Sukhna Wetland, Sauj Jheel, Glaw Lake"
      }
    ],
    "totalQuestions": 22,
    "isPublished": true,
    "publishedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "unesco-2026",
    "title": "UNESCO — 2026",
    "category": "unesco-2026",
    "description": "India's 45 UNESCO World Heritage Sites, cultural, natural, and mixed categories, Sarnath 45th inscription, and 46th Session landmarks.",
    "icon": "Sparkles",
    "subtopics": [
      {
        "id": "world-heritage-sites",
        "title": "UNESCO World Heritage Sites",
        "description": "45 inscribed properties in India"
      },
      {
        "id": "unesco-categories",
        "title": "Cultural, Natural & Mixed Sites",
        "description": "Criteria and classifications"
      }
    ],
    "totalQuestions": 22,
    "isPublished": true,
    "publishedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "unesco-tentative-2026",
    "title": "UNESCO Tentative List — 2026",
    "category": "unesco-tentative-2026",
    "description": "India's submitted proposals on the UNESCO Tentative List through 2026, criteria, documentation, and candidate heritage properties.",
    "icon": "FileCheck",
    "subtopics": [
      {
        "id": "tentative-sites",
        "title": "UNESCO Tentative List Additions",
        "description": "Baratang mud volcano, Sirpur, Satyagraha sites"
      }
    ],
    "totalQuestions": 22,
    "isPublished": true,
    "publishedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "dance-forms",
    "title": "Dance Forms",
    "category": "dance-forms",
    "description": "Indian classical and folk dance forms by state and region, Natya Shastra traditions, exponents, and regional cultural expressions.",
    "icon": "Music",
    "subtopics": [
      {
        "id": "classical-dances",
        "title": "Classical Dance Forms",
        "description": "8 Sangeet Natak Akademi classical dances"
      },
      {
        "id": "folk-dances",
        "title": "Folk and Tribal Dances",
        "description": "State-wise folk and tribal traditions"
      }
    ],
    "totalQuestions": 22,
    "isPublished": true,
    "publishedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "sixth-schedule",
    "title": "Sixth Schedule of the Constitution",
    "category": "sixth-schedule",
    "description": "Articles 244(2) and 275(1), autonomous district and regional councils in Assam, Meghalaya, Tripura, Mizoram, powers and provisions.",
    "icon": "HelpCircle",
    "subtopics": [
      {
        "id": "sixth-schedule-provisions",
        "title": "Sixth Schedule Provisions",
        "description": "Articles 244(2) & 275(1) constitutional governance"
      },
      {
        "id": "autonomous-councils",
        "title": "Autonomous District Councils",
        "description": "Powers, administration, and AMTM states"
      }
    ],
    "totalQuestions": 22,
    "isPublished": true,
    "publishedAt": "2026-11-24T00:00:00.000Z"
  },
  {
    "id": "vi-tax",
    "title": "VI Tax",
    "category": "sixth-schedule",
    "description": "Reserved slot awaiting Admin Sanju subject clarification. The Sixth Schedule of the Constitution is fully covered in its dedicated topic.",
    "icon": "HelpCircle",
    "subtopics": [
      {
        "id": "vi-tax-clarification",
        "title": "Subject Clarification Pending",
        "description": "Awaiting Admin specification"
      }
    ],
    "totalQuestions": 0,
    "isPublished": false,
    "isConfigurable": true,
    "statusNote": "Awaiting Admin Subject Clarification"
  }
];

export const STARTER_TOPIC_QUESTIONS: TopicQuestion[] = [
  {
    "id": "top-sgk-np-01",
    "topicId": "static-gk",
    "subtopicId": "national-parks",
    "question": "Which is the oldest National Park in India, originally established in 1936 as Hailey National Park?",
    "options": [
      "Jim Corbett National Park (Uttarakhand)",
      "Kaziranga National Park (Assam)",
      "Kanha National Park (Madhya Pradesh)",
      "Gir National Park (Gujarat)"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Jim Corbett National Park in Nainital/Pauri Garhwal district of Uttarakhand was established in 1936 as Hailey National Park. It was India's first national park and the inaugural site of Project Tiger in 1973.",
    "source": "National_Parks_Handbook_2026.pdf",
    "sourcePage": 4,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "static-gk-quiz-01",
    "orderInQuiz": 1
  },
  {
    "id": "top-sgk-np-02",
    "topicId": "static-gk",
    "subtopicId": "national-parks",
    "question": "Which UNESCO World Heritage National Park in Assam holds the world's largest population of the Great Indian One-Horned Rhinoceros?",
    "options": [
      "Manas National Park",
      "Kaziranga National Park",
      "Dibru-Saikhowa National Park",
      "Orang National Park"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Kaziranga National Park in Assam, located on the fertile floodplains of the Brahmaputra River, hosts roughly two-thirds of the world's Great Indian One-Horned Rhinoceros population.",
    "source": "National_Parks_Handbook_2026.pdf",
    "sourcePage": 12,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "static-gk-quiz-01",
    "orderInQuiz": 2
  },
  {
    "id": "top-sgk-np-03",
    "topicId": "static-gk",
    "subtopicId": "national-parks",
    "question": "Keibul Lamjao National Park, famous as the world's only floating national park and home to the endangered Sangai (dancing deer), is situated on which water body?",
    "options": [
      "Wular Lake",
      "Loktak Lake (Manipur)",
      "Chilika Lake",
      "Kolleru Lake"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Keibul Lamjao National Park is situated on Loktak Lake in Bishnupur district, Manipur. It is characterized by floating decomposed plant matter known locally as phumdis.",
    "source": "National_Parks_Handbook_2026.pdf",
    "sourcePage": 19,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "static-gk-quiz-01",
    "orderInQuiz": 3
  },
  {
    "id": "top-sgk-np-04",
    "topicId": "static-gk",
    "subtopicId": "national-parks",
    "question": "Which is the largest National Park in India by geographical area, globally renowned as a prime habitat for the elusive Snow Leopard?",
    "options": [
      "Desert National Park (Rajasthan)",
      "Hemis National Park (Ladakh)",
      "Gangotri National Park (Uttarakhand)",
      "Namdapha National Park (Arunachal Pradesh)"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Hemis National Park in eastern Ladakh spans approximately 4,400 sq km, making it India's largest national park. It sits in the high-altitude Trans-Himalayas and is famous for high snow leopard density.",
    "source": "National_Parks_Handbook_2026.pdf",
    "sourcePage": 23,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "static-gk-quiz-01",
    "orderInQuiz": 4
  },
  {
    "id": "top-sgk-np-05",
    "topicId": "static-gk",
    "subtopicId": "national-parks",
    "question": "Gir National Park in Gujarat is the only natural wild sanctuary in the world for which apex predator?",
    "options": [
      "Bengal Tiger",
      "Asiatic Cheetah",
      "Asiatic Lion",
      "Snow Leopard"
    ],
    "correctAnswer": 2,
    "difficulty": "easy",
    "explanation": "Gir National Park and Wildlife Sanctuary in Saurashtra, Gujarat, is the sole remaining natural wild habitat of the Asiatic Lion (Panthera leo persica).",
    "source": "National_Parks_Handbook_2026.pdf",
    "sourcePage": 28,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "static-gk-quiz-01",
    "orderInQuiz": 5
  },
  {
    "id": "top-sgk-np-06",
    "topicId": "static-gk",
    "subtopicId": "national-parks",
    "question": "Sundarbans National Park in West Bengal is formed by the confluence of which major river delta systems?",
    "options": [
      "Ganga, Brahmaputra, and Meghna",
      "Mahanadi and Baitarani",
      "Godavari and Krishna",
      "Indus and Sutlej"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Sundarbans is the world's largest mangrove delta formed by the sediment of the Ganga, Brahmaputra, and Meghna rivers, famous for tidal Royal Bengal Tigers and estuarine saltwater crocodiles.",
    "source": "National_Parks_Handbook_2026.pdf",
    "sourcePage": 34,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "static-gk-quiz-01",
    "orderInQuiz": 6
  },
  {
    "id": "top-sgk-np-07",
    "topicId": "static-gk",
    "subtopicId": "national-parks",
    "question": "Which national park in Madhya Pradesh is famous for saving the hard-ground swamp deer (Barasingha) and introducing \"Bhoorsingh the Barasingha\" as its official mascot?",
    "options": [
      "Bandhavgarh National Park",
      "Kanha National Park",
      "Pench National Park",
      "Panna National Park"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Kanha National Park saved the hard-ground swamp deer (Rucervus duvaucelii branderi) from near extinction and became the first tiger reserve in India to introduce an official mascot, Bhoorsingh.",
    "source": "National_Parks_Handbook_2026.pdf",
    "sourcePage": 40,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "static-gk-quiz-01",
    "orderInQuiz": 7
  },
  {
    "id": "top-sgk-np-08",
    "topicId": "static-gk",
    "subtopicId": "national-parks",
    "question": "Silent Valley National Park in the Nilgiri Hills of Kerala is nourished by which river and famous for which endangered primate?",
    "options": [
      "Kunthipuzha River & Lion-Tailed Macaque",
      "Periyar River & Nilgiri Tahr",
      "Pamba River & Indian Pangolin",
      "Chaliyar River & Slender Loris"
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "explanation": "Silent Valley National Park in Palakkad district, Kerala, is drained by the pristine Kunthipuzha River and protects the largest viable wild population of the endangered Lion-tailed Macaque.",
    "source": "National_Parks_Handbook_2026.pdf",
    "sourcePage": 47,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "static-gk-quiz-01",
    "orderInQuiz": 8
  },
  {
    "id": "top-sgk-np-09",
    "topicId": "static-gk",
    "subtopicId": "national-parks",
    "question": "Which national park in Sikkim was inscribed in 2016 as India's first and only UNESCO \"Mixed\" World Heritage Site (for both natural and cultural significance)?",
    "options": [
      "Singalila National Park",
      "Khangchendzonga (Kanchenjunga) National Park",
      "Neora Valley National Park",
      "Nanda Devi National Park"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Khangchendzonga National Park covers the third highest peak on Earth (Mt. Kanchenjunga) and sacred Buddhist Beyul cultural sites, making it India's unique UNESCO Mixed World Heritage Site.",
    "source": "National_Parks_Handbook_2026.pdf",
    "sourcePage": 52,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "static-gk-quiz-01",
    "orderInQuiz": 9
  },
  {
    "id": "top-sgk-np-10",
    "topicId": "static-gk",
    "subtopicId": "national-parks",
    "question": "Which is the smallest National Park in India by land area, measuring approximately 0.03 square kilometers (3 hectares)?",
    "options": [
      "Middle Button Island National Park",
      "South Button Island National Park (Andaman & Nicobar Islands)",
      "North Button Island National Park",
      "Guindy National Park (Tamil Nadu)"
    ],
    "correctAnswer": 1,
    "difficulty": "hard",
    "explanation": "South Button Island National Park in the Andaman and Nicobar Islands is India's smallest national park with an area of about 0.03 sq km, famed for pristine shallow-water coral reefs.",
    "source": "National_Parks_Handbook_2026.pdf",
    "sourcePage": 58,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "static-gk-quiz-01",
    "orderInQuiz": 10
  },
  {
    "id": "top-ca-nat-01",
    "topicId": "current-affairs-pib",
    "subtopicId": "national-developments",
    "question": "What is the name of the strategic 14.15-kilometer twin-tube all-weather road tunnel connecting Srinagar and Leh, constructed beneath the Zojila Pass?",
    "options": [
      "Atal Tunnel",
      "Zojila Tunnel",
      "Sela Tunnel",
      "Shinku La Tunnel"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "The Zojila Tunnel beneath the Zojila Pass (at 11,578 ft elevation) links Baltal and Minamarg on NH-1, cutting travel time across the pass from over 3 hours to approximately 15–20 minutes with year-round military and civilian transit.",
    "source": "PIB_Releases_Gazette_2026.pdf",
    "sourcePage": 3,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "current-affairs-pib-quiz-01",
    "orderInQuiz": 1
  },
  {
    "id": "top-ca-nat-02",
    "topicId": "current-affairs-pib",
    "subtopicId": "national-developments",
    "question": "Which launch vehicle of ISRO successfully launched Chandrayaan-3 into translunar orbit prior to its historic soft landing near the lunar south pole?",
    "options": [
      "PSLV-C56",
      "LVM3-M4",
      "GSLV-F12",
      "SSLV-D2"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "ISRO's heavy-lift LVM3-M4 (Launch Vehicle Mark-3, nicknamed 'Fat Boy') launched Chandrayaan-3 from SDSC SHAR Sriharikota on July 14, 2023, preceding the Vikram lander's touchdown on August 23, 2023.",
    "source": "PIB_Releases_Gazette_2026.pdf",
    "sourcePage": 7,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "current-affairs-pib-quiz-01",
    "orderInQuiz": 2
  },
  {
    "id": "top-ca-sch-01",
    "topicId": "current-affairs-pib",
    "subtopicId": "gov-schemes",
    "question": "Under the PM-Surya Ghar: Muft Bijli Yojana, how many households are targeted to receive rooftop solar systems offering up to 300 units of free power each month?",
    "options": [
      "25 Lakh households",
      "50 Lakh households",
      "1 Crore (10 Million) households",
      "3 Crore households"
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "explanation": "The Union Cabinet approved the PM-Surya Ghar: Muft Bijli Yojana with an outlay of ₹75,021 crore to install rooftop solar panels for 1 crore households, giving up to 300 units of free electricity every month.",
    "source": "PIB_Releases_Gazette_2026.pdf",
    "sourcePage": 11,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "current-affairs-pib-quiz-01",
    "orderInQuiz": 3
  },
  {
    "id": "top-ca-sch-02",
    "topicId": "current-affairs-pib",
    "subtopicId": "gov-schemes",
    "question": "Under the PM-eBus Sewa initiative approved by the Union Cabinet, how many electric buses will be deployed across Indian cities on a Public-Private Partnership (PPP) model?",
    "options": [
      "5,000 electric buses",
      "10,000 electric buses",
      "20,000 electric buses",
      "50,000 electric buses"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "PM-eBus Sewa aims to augment green city bus operations by deploying 10,000 electric buses across cities with populations of 3 to 40 lakh, supported by central government subsidies for 10 years.",
    "source": "PIB_Releases_Gazette_2026.pdf",
    "sourcePage": 15,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "current-affairs-pib-quiz-01",
    "orderInQuiz": 4
  },
  {
    "id": "top-ca-sch-03",
    "topicId": "current-affairs-pib",
    "subtopicId": "gov-schemes",
    "question": "The PM Vishwakarma Scheme provides holistic end-to-end support, subsidized credit of up to ₹3 lakh, and modern toolkit incentives for traditional artisans across how many recognized trades?",
    "options": [
      "12 traditional trades",
      "18 traditional trades",
      "24 traditional trades",
      "32 traditional trades"
    ],
    "correctAnswer": 1,
    "difficulty": "hard",
    "explanation": "The PM Vishwakarma scheme covers 18 traditional family-based crafts (including carpenters, blacksmiths, potters, sculptors, and cobblers) with ₹13,000 crore budgetary allocation.",
    "source": "PIB_Releases_Gazette_2026.pdf",
    "sourcePage": 18,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "current-affairs-pib-quiz-01",
    "orderInQuiz": 5
  },
  {
    "id": "top-ca-awd-01",
    "topicId": "current-affairs-pib",
    "subtopicId": "appointments-awards",
    "question": "Who were jointly conferred the prestigious 58th Jnanpith Award for exceptional lifelong literary excellence?",
    "options": [
      "Damodar Mauzo and Nilmani Phookan",
      "Jagadguru Rambhadracharya (Sanskrit) and Gulzar (Urdu)",
      "Amitav Ghosh and Vikram Seth",
      "Akkitham Achuthan Namboothiri and Krishna Sobti"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "The 58th Jnanpith Award Selection Board awarded Sanskrit polymath and spiritual guru Jagadguru Rambhadracharya alongside eminent poet and filmmaker Gulzar (Sampooran Singh Kalra).",
    "source": "PIB_Releases_Gazette_2026.pdf",
    "sourcePage": 22,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "current-affairs-pib-quiz-01",
    "orderInQuiz": 6
  },
  {
    "id": "top-ca-awd-02",
    "topicId": "current-affairs-pib",
    "subtopicId": "appointments-awards",
    "question": "Who serves as the Chief of Defence Staff (CDS) of India, functioning as the Permanent Chairman of the Chiefs of Staff Committee?",
    "options": [
      "General Manoj Pande",
      "General Anil Chauhan",
      "Admiral Dinesh K. Tripathi",
      "Air Chief Marshal Amar Preet Singh"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "General Anil Chauhan serves as India's second Chief of Defence Staff (CDS), heading the Department of Military Affairs (DMA) under the Ministry of Defence.",
    "source": "PIB_Releases_Gazette_2026.pdf",
    "sourcePage": 25,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "current-affairs-pib-quiz-01",
    "orderInQuiz": 7
  },
  {
    "id": "top-ca-pib-01",
    "topicId": "current-affairs-pib",
    "subtopicId": "pib-releases",
    "question": "The world's highest railway arch bridge, rising 359 meters above the river bed on the Udhampur-Srinagar-Baramulla Rail Link (USBRL), spans across which river?",
    "options": [
      "Jhelum River",
      "Chenab River",
      "Ravi River",
      "Indus River"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "The Chenab Rail Bridge in Reasi district of Jammu and Kashmir stands at an elevation of 359 meters above the Chenab riverbed (35 meters taller than the Eiffel Tower).",
    "source": "PIB_Releases_Gazette_2026.pdf",
    "sourcePage": 29,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "current-affairs-pib-quiz-01",
    "orderInQuiz": 8
  },
  {
    "id": "top-ca-pib-02",
    "topicId": "current-affairs-pib",
    "subtopicId": "pib-releases",
    "question": "India's indigenously developed semiconductor fabrication plant approved under the India Semiconductor Mission (ISM) is being established in which state by Tata Electronics in partnership with Powerchip (PSMC)?",
    "options": [
      "Karnataka (Bengaluru)",
      "Gujarat (Dholera)",
      "Tamil Nadu (Sriperumbudur)",
      "Telangana (Hyderabad)"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "The Union Cabinet approved India's first commercial semiconductor fabrication unit in Dholera, Gujarat, spearheaded by Tata Electronics and Taiwan's PSMC with a ₹91,000 crore investment.",
    "source": "PIB_Releases_Gazette_2026.pdf",
    "sourcePage": 33,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "current-affairs-pib-quiz-01",
    "orderInQuiz": 9
  },
  {
    "id": "top-ca-rep-01",
    "topicId": "current-affairs-pib",
    "subtopicId": "reports-indexes",
    "question": "In the Global Innovation Index (GII) published annually by the World Intellectual Property Organization (WIPO), India's ranking has ascended into which tier?",
    "options": [
      "Top 20",
      "Top 40 (ranked 39th)",
      "Top 60",
      "Top 80"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "India rose to 39th position out of 133 economies in the Global Innovation Index (GII), retaining its top position in Central and Southern Asia and among lower-middle-income economies.",
    "source": "PIB_Releases_Gazette_2026.pdf",
    "sourcePage": 38,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "current-affairs-pib-quiz-01",
    "orderInQuiz": 10
  },
  {
    "id": "top-ba-mp-01",
    "topicId": "banking-awareness-fa",
    "subtopicId": "rbi-monetary-policy",
    "question": "Under Section 45ZB of the Reserve Bank of India Act 1934, how many members comprise the Monetary Policy Committee (MPC) of India?",
    "options": [
      "5 members (all from RBI)",
      "6 members (3 from RBI and 3 appointed by Central Government)",
      "7 members (4 from RBI and 3 from Finance Ministry)",
      "9 members (chaired by the Union Finance Minister)"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "The MPC consists of six members: three internal RBI officials (the Governor as ex-officio Chairperson, the Deputy Governor in charge of monetary policy, and one officer) and three external economists appointed by the Central Government.",
    "source": "RBI_Financial_Awareness_2026.pdf",
    "sourcePage": 5,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "banking-awareness-fa-quiz-01",
    "orderInQuiz": 1
  },
  {
    "id": "top-ba-mp-02",
    "topicId": "banking-awareness-fa",
    "subtopicId": "rbi-monetary-policy",
    "question": "Under the Flexible Inflation Targeting (FIT) framework established between the Government of India and the RBI, what is the mandated target headline Consumer Price Index (CPI) inflation rate?",
    "options": [
      "3% with a tolerance band of +/- 1%",
      "4% with a tolerance band of +/- 2% (2% to 6%)",
      "5% with a tolerance band of +/- 2%",
      "6% fixed ceiling without tolerance band"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Under Section 45ZA of the RBI Act, the Central Government, in consultation with the Reserve Bank, determined the inflation target of 4% with upper tolerance level of 6% and lower tolerance level of 2%.",
    "source": "RBI_Financial_Awareness_2026.pdf",
    "sourcePage": 9,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "banking-awareness-fa-quiz-01",
    "orderInQuiz": 2
  },
  {
    "id": "top-ba-term-01",
    "topicId": "banking-awareness-fa",
    "subtopicId": "banking-terminology",
    "question": "Under RBI's Master Circular on Prudential Norms, a term loan account is classified as a Non-Performing Asset (NPA) if interest or principal instalment remains overdue for a period exceeding:",
    "options": [
      "30 days",
      "60 days",
      "90 days",
      "180 days"
    ],
    "correctAnswer": 2,
    "difficulty": "easy",
    "explanation": "An asset becomes non-performing when it ceases to generate income. A loan account is classified as an NPA if interest and/or principal instalment remains overdue for a period exceeding 90 days in respect of a term loan.",
    "source": "RBI_Financial_Awareness_2026.pdf",
    "sourcePage": 14,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "banking-awareness-fa-quiz-01",
    "orderInQuiz": 3
  },
  {
    "id": "top-ba-term-02",
    "topicId": "banking-awareness-fa",
    "subtopicId": "banking-terminology",
    "question": "Which statutory reserve requirement mandates commercial banks to maintain a specified percentage of their Net Demand and Time Liabilities (NDTL) as cash balance deposited directly with the RBI without earning interest?",
    "options": [
      "Cash Reserve Ratio (CRR)",
      "Statutory Liquidity Ratio (SLR)",
      "Marginal Standing Facility (MSF)",
      "Capital Adequacy Ratio (CAR)"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Under Section 42(1) of the RBI Act 1934, banks are required to maintain Cash Reserve Ratio (CRR) with the RBI. No interest is paid by the RBI on the CRR balances held by commercial banks.",
    "source": "RBI_Financial_Awareness_2026.pdf",
    "sourcePage": 18,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "banking-awareness-fa-quiz-01",
    "orderInQuiz": 4
  },
  {
    "id": "top-ba-term-03",
    "topicId": "banking-awareness-fa",
    "subtopicId": "banking-terminology",
    "question": "Under RBI's framework for revitalizing stressed assets, a Special Mention Account (SMA) where principal or interest payment is overdue between 61 to 90 days is classified as:",
    "options": [
      "SMA-0",
      "SMA-1",
      "SMA-2",
      "Substandard Asset"
    ],
    "correctAnswer": 2,
    "difficulty": "hard",
    "explanation": "SMA-0 represents 1-30 days overdue; SMA-1 represents 31-60 days overdue; and SMA-2 represents 61-90 days overdue. Beyond 90 days, the asset is formally downgraded to NPA (Substandard).",
    "source": "RBI_Financial_Awareness_2026.pdf",
    "sourcePage": 23,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "banking-awareness-fa-quiz-01",
    "orderInQuiz": 5
  },
  {
    "id": "top-ba-inst-01",
    "topicId": "banking-awareness-fa",
    "subtopicId": "financial-institutions",
    "question": "Which apex statutory development financial institution was established in 1982 on the recommendations of the B. Sivaraman Committee to foster agriculture and rural credit?",
    "options": [
      "Small Industries Development Bank of India (SIDBI)",
      "National Bank for Agriculture and Rural Development (NABARD)",
      "Export-Import Bank of India (EXIM Bank)",
      "National Housing Bank (NHB)"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "NABARD was set up on 12 July 1982 under the NABARD Act 1981, following the recommendations of the CRAFICARD Committee headed by B. Sivaraman, transferring the agricultural credit functions of the RBI.",
    "source": "RBI_Financial_Awareness_2026.pdf",
    "sourcePage": 27,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "banking-awareness-fa-quiz-01",
    "orderInQuiz": 6
  },
  {
    "id": "top-ba-inst-02",
    "topicId": "banking-awareness-fa",
    "subtopicId": "financial-institutions",
    "question": "The Deposit Insurance and Credit Guarantee Corporation (DICGC), a wholly owned subsidiary of the RBI, currently insures each depositor in an insured commercial or cooperative bank up to a ceiling of:",
    "options": [
      "₹1,00,000",
      "₹2,00,000",
      "₹5,00,000",
      "₹10,00,000"
    ],
    "correctAnswer": 2,
    "difficulty": "easy",
    "explanation": "Under the DICGC (Amendment) Act, each depositor is insured up to a maximum of ₹5,00,000 (Rupees Five Lakh) for both principal and interest amount held in the same right and capacity in an insured bank.",
    "source": "RBI_Financial_Awareness_2026.pdf",
    "sourcePage": 31,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "banking-awareness-fa-quiz-01",
    "orderInQuiz": 7
  },
  {
    "id": "top-ba-sch-01",
    "topicId": "banking-awareness-fa",
    "subtopicId": "banking-schemes",
    "question": "What is the mandated Priority Sector Lending (PSL) target for Domestic Scheduled Commercial Banks (excluding RRBs & Small Finance Banks) as a percentage of Adjusted Net Bank Credit (ANBC)?",
    "options": [
      "25%",
      "32%",
      "40%",
      "50%"
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "explanation": "Domestic scheduled commercial banks are mandated to allocate 40% of their Adjusted Net Bank Credit (ANBC) or Credit Equivalent of Off-Balance Sheet Exposure (CEOBE) to Priority Sector Lending.",
    "source": "RBI_Financial_Awareness_2026.pdf",
    "sourcePage": 36,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "banking-awareness-fa-quiz-01",
    "orderInQuiz": 8
  },
  {
    "id": "top-ba-sch-02",
    "topicId": "banking-awareness-fa",
    "subtopicId": "banking-schemes",
    "question": "Under the Stand-Up India Scheme, bank loans between ₹10 lakh and ₹1 crore are extended to facilitate greenfield enterprises for which category of borrowers?",
    "options": [
      "Any woman or SC/ST entrepreneur",
      "MSMEs in rural districts only",
      "Farmer Producer Organizations (FPOs)",
      "Ex-servicemen only"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Stand-Up India facilitates bank loans between ₹10 lakh and ₹1 crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch for setting up greenfield ventures.",
    "source": "RBI_Financial_Awareness_2026.pdf",
    "sourcePage": 41,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "banking-awareness-fa-quiz-01",
    "orderInQuiz": 9
  },
  {
    "id": "top-ba-dev-01",
    "topicId": "banking-awareness-fa",
    "subtopicId": "financial-developments",
    "question": "What is the sovereign legal tender digital currency issued in pilot phases by the Reserve Bank of India, functioning as a direct liability on the central bank's balance sheet?",
    "options": [
      "BitRupee",
      "Central Bank Digital Currency (CBDC) / Digital Rupee (e₹)",
      "Unified Digital Payment (UDP)",
      "Sovereign Crypto Token (SCT)"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "The Digital Rupee (e₹) or CBDC is the digital form of currency notes issued by the Reserve Bank of India, launched in Wholesale (e₹-W) and Retail (e₹-R) pilot segments.",
    "source": "RBI_Financial_Awareness_2026.pdf",
    "sourcePage": 46,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "banking-awareness-fa-quiz-01",
    "orderInQuiz": 10
  },
  {
    "id": "top-ccm-def-01",
    "topicId": "central-ministers",
    "subtopicId": "union-cabinet",
    "question": "Who serves as the Union Minister of Defence in the Union Council of Ministers of India?",
    "options": [
      "Amit Shah",
      "Rajnath Singh",
      "Nitin Gadkari",
      "Dr. S. Jaishankar"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Rajnath Singh is the Union Minister of Defence, responsible for the Department of Defence, Department of Military Affairs, and the Armed Forces of India.",
    "source": "Union_Council_Ministers_2026.pdf",
    "sourcePage": 2,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "central-ministers-quiz-01",
    "orderInQuiz": 1
  },
  {
    "id": "top-ccm-hom-01",
    "topicId": "central-ministers",
    "subtopicId": "union-cabinet",
    "question": "Who holds the dual portfolios of Union Minister of Home Affairs and Union Minister of Cooperation in the Central Cabinet?",
    "options": [
      "Amit Shah",
      "J.P. Nadda",
      "Kiren Rijiju",
      "Piyush Goyal"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Amit Shah holds the portfolios of Union Minister of Home Affairs and Union Minister of Cooperation in the Central Cabinet.",
    "source": "Union_Council_Ministers_2026.pdf",
    "sourcePage": 3,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "central-ministers-quiz-01",
    "orderInQuiz": 2
  },
  {
    "id": "top-ccm-fin-01",
    "topicId": "central-ministers",
    "subtopicId": "union-cabinet",
    "question": "Who serves as the Union Minister of Finance and Union Minister of Corporate Affairs?",
    "options": [
      "Smriti Irani",
      "Nirmala Sitharaman",
      "Annapurna Devi",
      "Nirmala Joshi"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Nirmala Sitharaman serves as the Union Minister of Finance and Corporate Affairs, presenting consecutive Union Budgets in Parliament.",
    "source": "Union_Council_Ministers_2026.pdf",
    "sourcePage": 4,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "central-ministers-quiz-01",
    "orderInQuiz": 3
  },
  {
    "id": "top-ccm-ext-01",
    "topicId": "central-ministers",
    "subtopicId": "union-cabinet",
    "question": "Who serves as the Union Minister of External Affairs, leading India's diplomatic relations and foreign policy globally?",
    "options": [
      "Hardeep Singh Puri",
      "Dr. Subrahmanyam Jaishankar (S. Jaishankar)",
      "Mansukh Mandaviya",
      "Jyotiraditya Scindia"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Dr. S. Jaishankar, former Foreign Secretary and career diplomat, serves as the Union Minister of External Affairs of India.",
    "source": "Union_Council_Ministers_2026.pdf",
    "sourcePage": 5,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "central-ministers-quiz-01",
    "orderInQuiz": 4
  },
  {
    "id": "top-ccm-rdt-01",
    "topicId": "central-ministers",
    "subtopicId": "union-cabinet",
    "question": "Who serves as the Union Minister of Road Transport and Highways, renowned for national expressways and corridor connectivity?",
    "options": [
      "Nitin Gadkari",
      "Giriraj Singh",
      "Gajendra Singh Shekhawat",
      "Sarbananda Sonowal"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Nitin Jairam Gadkari serves as the Union Minister for Road Transport and Highways.",
    "source": "Union_Council_Ministers_2026.pdf",
    "sourcePage": 6,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "central-ministers-quiz-01",
    "orderInQuiz": 5
  },
  {
    "id": "top-ccm-rlw-01",
    "topicId": "central-ministers",
    "subtopicId": "ministries-portfolios",
    "question": "Which Union Minister holds the key portfolios of Ministry of Railways, Ministry of Information & Broadcasting, and Ministry of Electronics & IT (MeitY)?",
    "options": [
      "Ashwini Vaishnaw",
      "Piyush Goyal",
      "Anurag Thakur",
      "Dharmendra Pradhan"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Ashwini Vaishnaw holds Cabinet portfolios for Railways, Information & Broadcasting, and Electronics & Information Technology.",
    "source": "Union_Council_Ministers_2026.pdf",
    "sourcePage": 8,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "central-ministers-quiz-01",
    "orderInQuiz": 6
  },
  {
    "id": "top-ccm-edu-01",
    "topicId": "central-ministers",
    "subtopicId": "ministries-portfolios",
    "question": "Who serves as the Union Minister of Education in the Government of India, steering the National Education Policy (NEP 2020)?",
    "options": [
      "Ramesh Pokhriyal Nishank",
      "Dharmendra Pradhan",
      "Rajeev Chandrasekhar",
      "Chirag Paswan"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Dharmendra Pradhan serves as the Union Minister of Education, guiding primary, secondary, and higher education along with skilling initiatives.",
    "source": "Union_Council_Ministers_2026.pdf",
    "sourcePage": 10,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "central-ministers-quiz-01",
    "orderInQuiz": 7
  },
  {
    "id": "top-ccm-hlt-01",
    "topicId": "central-ministers",
    "subtopicId": "ministries-portfolios",
    "question": "Who serves as the Union Minister of Health & Family Welfare as well as Minister of Chemicals and Fertilizers?",
    "options": [
      "Mansukh Mandaviya",
      "Jagat Prakash Nadda (J.P. Nadda)",
      "Bhupender Yadav",
      "G. Kishan Reddy"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Jagat Prakash Nadda holds the portfolios of Union Minister of Health and Family Welfare and Minister of Chemicals and Fertilizers in the Union Cabinet.",
    "source": "Union_Council_Ministers_2026.pdf",
    "sourcePage": 12,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "central-ministers-quiz-01",
    "orderInQuiz": 8
  },
  {
    "id": "top-ccm-agr-01",
    "topicId": "central-ministers",
    "subtopicId": "ministries-portfolios",
    "question": "Who serves as the Union Minister of Agriculture and Farmers Welfare and Union Minister of Rural Development in the Union Cabinet?",
    "options": [
      "Narendra Singh Tomar",
      "Shivraj Singh Chouhan",
      "Giriraj Singh",
      "Arjun Munda"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Shivraj Singh Chouhan serves as the Union Minister of Agriculture & Farmers Welfare and Minister of Rural Development.",
    "source": "Union_Council_Ministers_2026.pdf",
    "sourcePage": 14,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "central-ministers-quiz-01",
    "orderInQuiz": 9
  },
  {
    "id": "top-ccm-ind-01",
    "topicId": "central-ministers",
    "subtopicId": "appointments-changes",
    "question": "Who serves as the Union Minister of Heavy Industries and Union Minister of Steel in the Union Cabinet?",
    "options": [
      "Jyotiraditya Scindia",
      "H.D. Kumaraswamy",
      "Pashupati Kumar Paras",
      "Kinjarapu Ram Mohan Naidu"
    ],
    "correctAnswer": 1,
    "difficulty": "hard",
    "explanation": "H.D. Kumaraswamy (former Chief Minister of Karnataka) holds the Union Cabinet portfolios for Heavy Industries and Steel.",
    "source": "Union_Council_Ministers_2026.pdf",
    "sourcePage": 16,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "central-ministers-quiz-01",
    "orderInQuiz": 10
  },
  {
    "id": "top-ram-org-01",
    "topicId": "ramsar-sites-2026",
    "subtopicId": "ramsar-2026-new",
    "question": "The intergovernmental convention on wetlands of international importance was signed on 2 February 1971 in which city, commemorated annually as World Wetlands Day?",
    "options": [
      "Geneva, Switzerland",
      "Ramsar, Iran",
      "Bonn, Germany",
      "Stockholm, Sweden"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "The Convention on Wetlands of International Importance was adopted in the Iranian coastal city of Ramsar on 2 February 1971. February 2 is celebrated globally as World Wetlands Day.",
    "source": "Ramsar_Sites_India_2026.pdf",
    "sourcePage": 2,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "ramsar-sites-2026-quiz-01",
    "orderInQuiz": 1
  },
  {
    "id": "top-ram-tot-01",
    "topicId": "ramsar-sites-2026",
    "subtopicId": "ramsar-2026-new",
    "question": "With the addition of newly designated wetland reserves across Tamil Nadu, Karnataka, and Madhya Pradesh, what is the total number of Ramsar sites in India?",
    "options": [
      "75 sites",
      "80 sites",
      "85 sites",
      "92 sites"
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "explanation": "India currently boasts 85 designated Ramsar Sites spanning over 1.35 million hectares, the largest network of Ramsar sites in South Asia.",
    "source": "Ramsar_Sites_India_2026.pdf",
    "sourcePage": 4,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "ramsar-sites-2026-quiz-01",
    "orderInQuiz": 2
  },
  {
    "id": "top-ram-new-01",
    "topicId": "ramsar-sites-2026",
    "subtopicId": "ramsar-2026-new",
    "question": "Which newly added Ramsar site in Tamil Nadu is a vital stopover on the Central Asian Flyway and home to thousands of migratory waterbirds including the Bar-headed Goose?",
    "options": [
      "Nanjarayan Bird Sanctuary (Tiruppur)",
      "Sundarbans",
      "Vembanad",
      "Loktak"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Nanjarayan Bird Sanctuary (also known as Sarkar Periyapalayam Reservoir) in Tiruppur, Tamil Nadu, was designated as a Ramsar site alongside Kazhuveli Bird Sanctuary in Villupuram.",
    "source": "Ramsar_Sites_India_2026.pdf",
    "sourcePage": 7,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "ramsar-sites-2026-quiz-01",
    "orderInQuiz": 3
  },
  {
    "id": "top-ram-sta-01",
    "topicId": "ramsar-sites-2026",
    "subtopicId": "names-states-locations",
    "question": "Which Indian State possesses the highest number of Ramsar-designated wetlands in the country (with 16 designated sites)?",
    "options": [
      "Uttar Pradesh",
      "Tamil Nadu",
      "Kerala",
      "Gujarat"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Tamil Nadu leads India with 16 designated Ramsar sites (including Point Calimere, Vedanthangal, Pichavaram, and Nanjarayan), followed by Uttar Pradesh with 10 sites.",
    "source": "Ramsar_Sites_India_2026.pdf",
    "sourcePage": 11,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "ramsar-sites-2026-quiz-01",
    "orderInQuiz": 4
  },
  {
    "id": "top-ram-sta-02",
    "topicId": "ramsar-sites-2026",
    "subtopicId": "names-states-locations",
    "question": "Aghanashini Estuary and Magadi Kere Conservation Reserve, both newly designated Ramsar sites, are located in which Indian State?",
    "options": [
      "Andhra Pradesh",
      "Karnataka",
      "Maharashtra",
      "Goa"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Aghanashini Estuary (in Uttara Kannada) and Magadi Kere Conservation Reserve (in Gadag) are located in Karnataka, significantly expanding the state's Ramsar footprint.",
    "source": "Ramsar_Sites_India_2026.pdf",
    "sourcePage": 15,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "ramsar-sites-2026-quiz-01",
    "orderInQuiz": 5
  },
  {
    "id": "top-ram-sta-03",
    "topicId": "ramsar-sites-2026",
    "subtopicId": "names-states-locations",
    "question": "Tawa Reservoir, created by the damming of the Tawa River inside Satpura Tiger Reserve, was declared a Ramsar wetland site in which state?",
    "options": [
      "Madhya Pradesh",
      "Chhattisgarh",
      "Rajasthan",
      "Odisha"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Tawa Reservoir in Hoshangabad (Narmadapuram) district of Madhya Pradesh was designated as a Ramsar site, recognized for supporting crucial aquatic fauna and migratory waterfowl.",
    "source": "Ramsar_Sites_India_2026.pdf",
    "sourcePage": 19,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "ramsar-sites-2026-quiz-01",
    "orderInQuiz": 6
  },
  {
    "id": "top-ram-fst-01",
    "topicId": "ramsar-sites-2026",
    "subtopicId": "designation-ecological",
    "question": "Which two wetlands were designated in October 1981 as the very first Ramsar sites in India?",
    "options": [
      "Wular Lake (J&K) and Loktak Lake (Manipur)",
      "Chilika Lake (Odisha) and Keoladeo National Park (Rajasthan)",
      "Sundarbans (West Bengal) and Sambhar Lake (Rajasthan)",
      "Vembanad-Kol (Kerala) and Kolleru Lake (Andhra Pradesh)"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Chilika Lake in Odisha and Keoladeo Ghana National Park in Bharatpur, Rajasthan, were designated together as India's first two Ramsar Sites on 1 October 1981.",
    "source": "Ramsar_Sites_India_2026.pdf",
    "sourcePage": 23,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "ramsar-sites-2026-quiz-01",
    "orderInQuiz": 7
  },
  {
    "id": "top-ram-lrg-01",
    "topicId": "ramsar-sites-2026",
    "subtopicId": "montreux-wetland-facts",
    "question": "Which is the largest Ramsar site by geographical surface area in India, spanning over 4,200 square kilometers?",
    "options": [
      "Vembanad-Kol Wetland (Kerala)",
      "Sundarban Wetland (West Bengal)",
      "Chilika Lake (Odisha)",
      "Kolleru Lake (Andhra Pradesh)"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Sundarban Wetland in West Bengal covers approximately 4,230 square kilometers, making it the largest Ramsar site in India, supporting immense estuarine and mangrove biodiversity.",
    "source": "Ramsar_Sites_India_2026.pdf",
    "sourcePage": 28,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "ramsar-sites-2026-quiz-01",
    "orderInQuiz": 8
  },
  {
    "id": "top-ram-sml-01",
    "topicId": "ramsar-sites-2026",
    "subtopicId": "montreux-wetland-facts",
    "question": "Which is the smallest Ramsar wetland site in India by surface area, covering roughly 20 hectares (0.2 sq km) in the Sirmaur district of Himachal Pradesh?",
    "options": [
      "Chandertal Wetland",
      "Renuka Wetland",
      "Pong Dam Lake",
      "Hokera Wetland"
    ],
    "correctAnswer": 1,
    "difficulty": "hard",
    "explanation": "Renuka Wetland in Sirmaur district of Himachal Pradesh is India's smallest Ramsar site, measuring about 20 hectares (0.2 sq km), recognized as a sacred freshwater wetland with subterranean springs.",
    "source": "Ramsar_Sites_India_2026.pdf",
    "sourcePage": 32,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "ramsar-sites-2026-quiz-01",
    "orderInQuiz": 9
  },
  {
    "id": "top-ram-mon-01",
    "topicId": "ramsar-sites-2026",
    "subtopicId": "montreux-wetland-facts",
    "question": "Which two Indian wetland sites are currently listed on the \"Montreux Record\" (the register of Ramsar wetland sites where ecological changes have occurred or are likely to occur)?",
    "options": [
      "Chilika Lake (Odisha) and Wular Lake (J&K)",
      "Keoladeo National Park (Rajasthan) and Loktak Lake (Manipur)",
      "Sundarbans (West Bengal) and Harike Lake (Punjab)",
      "Deepor Beel (Assam) and Rudrasagar Lake (Tripura)"
    ],
    "correctAnswer": 1,
    "difficulty": "hard",
    "explanation": "Keoladeo National Park (facing water scarcity and invasive growth) and Loktak Lake (facing siltation and deforestation) are the two Indian sites on the Montreux Record. Chilika Lake was placed on it in 1993 but removed in 2002 after successful ecological restoration.",
    "source": "Ramsar_Sites_India_2026.pdf",
    "sourcePage": 37,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "ramsar-sites-2026-quiz-01",
    "orderInQuiz": 10
  },
  {
    "id": "top-unesco-46-01",
    "topicId": "unesco-2026",
    "subtopicId": "whs-2026-additions",
    "question": "Which landmark historic property from Assam was officially inscribed as India's 43rd UNESCO World Heritage Site during the 46th session of the World Heritage Committee held in New Delhi?",
    "options": [
      "Rang Ghar (Sivasagar)",
      "Moidams – the Mound-Burial System of the Ahom Dynasty (Charaideo)",
      "Talatal Ghar",
      "Kamakhya Temple Complex"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "The \"Moidams – the Mound-Burial System of the Ahom Dynasty\" at Charaideo, Assam, was inscribed on the UNESCO World Heritage List under the cultural category during the 46th WHC session in New Delhi.",
    "source": "UNESCO_World_Heritage_India_2026.pdf",
    "sourcePage": 3,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-2026-quiz-01",
    "orderInQuiz": 1
  },
  {
    "id": "top-unesco-moi-02",
    "topicId": "unesco-2026",
    "subtopicId": "whs-2026-additions",
    "question": "The Charaideo Moidams of Assam are vaulted mound burial chambers constructed for monarchs and nobility of which six-century-long ruling dynasty?",
    "options": [
      "Pala Dynasty",
      "Ahom Dynasty (1228–1826 CE)",
      "Varman Dynasty",
      "Koch Dynasty"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Charaideo was the first capital established by Chaolung Sukaphaa in 1253 CE. The Moidams served as the sacred royal necropolis of the Tai-Ahom dynasty for over 600 years.",
    "source": "UNESCO_World_Heritage_India_2026.pdf",
    "sourcePage": 6,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-2026-quiz-01",
    "orderInQuiz": 2
  },
  {
    "id": "top-unesco-tot-03",
    "topicId": "unesco-2026",
    "subtopicId": "whs-categories",
    "question": "What is the current distribution of India's 43 UNESCO World Heritage Sites across Cultural, Natural, and Mixed categories?",
    "options": [
      "30 Cultural, 10 Natural, 3 Mixed",
      "35 Cultural, 7 Natural, 1 Mixed",
      "32 Cultural, 9 Natural, 2 Mixed",
      "36 Cultural, 6 Natural, 1 Mixed"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "India possesses 43 World Heritage Sites: 35 Cultural sites, 7 Natural sites, and 1 Mixed site (Khangchendzonga National Park). India ranks 6th globally for the total number of heritage sites.",
    "source": "UNESCO_World_Heritage_India_2026.pdf",
    "sourcePage": 10,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-2026-quiz-01",
    "orderInQuiz": 3
  },
  {
    "id": "top-unesco-san-04",
    "topicId": "unesco-2026",
    "subtopicId": "whs-2026-additions",
    "question": "Which university town established by Rabindranath Tagore in Birbhum district of West Bengal was inscribed as India's 41st World Heritage Site in September 2023?",
    "options": [
      "Dakshineswar",
      "Santiniketan (Visva-Bharati)",
      "Mayapur",
      "Bishnupur"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Santiniketan was founded in 1901 by Nobel laureate Rabindranath Tagore as an ashram and open-air education center that evolved into Visva-Bharati University, inscribed at the 45th WHC session in Riyadh.",
    "source": "UNESCO_World_Heritage_India_2026.pdf",
    "sourcePage": 14,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-2026-quiz-01",
    "orderInQuiz": 4
  },
  {
    "id": "top-unesco-hoy-05",
    "topicId": "unesco-2026",
    "subtopicId": "whs-categories",
    "question": "The \"Sacred Ensembles of the Hoysalas\", inscribed as India's 42nd World Heritage Site, consists of 12th–13th century temples in which three locations of Karnataka?",
    "options": [
      "Hampi, Badami, and Pattadakal",
      "Belur (Chennakeshava), Halebidu (Hoysaleswara), and Somnathapura (Keshava)",
      "Aihole, Sravanabelagola, and Gokarna",
      "Bijapur, Bidar, and Gulbarga"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "The Hoysala ensembles encompass the Chennakeshava Temple at Belur, Hoysaleswara Temple at Halebidu, and Keshava Temple at Somanathapura in Karnataka, famous for chloritic schist soapstone sculptures.",
    "source": "UNESCO_World_Heritage_India_2026.pdf",
    "sourcePage": 18,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-2026-quiz-01",
    "orderInQuiz": 5
  },
  {
    "id": "top-unesco-mix-06",
    "topicId": "unesco-2026",
    "subtopicId": "whs-categories",
    "question": "Which is India's sole UNESCO Mixed World Heritage Site, recognized under both natural criteria (biodiversity) and cultural criteria (sacred Buddhist Beyul traditions)?",
    "options": [
      "Western Ghats",
      "Khangchendzonga National Park (Sikkim)",
      "Nanda Devi and Valley of Flowers National Parks",
      "Manas Wildlife Sanctuary"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Khangchendzonga National Park in Sikkim remains India's only Mixed World Heritage Site, inscribed in 2016 for Mt. Kanchenjunga's ecological grandeur and indigenous Tibetan Buddhist cultural reverence.",
    "source": "UNESCO_World_Heritage_India_2026.pdf",
    "sourcePage": 22,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-2026-quiz-01",
    "orderInQuiz": 6
  },
  {
    "id": "top-unesco-dho-07",
    "topicId": "unesco-2026",
    "subtopicId": "designation-history",
    "question": "Which ancient Harappan city in Khadir Bet island, Kutch district of Gujarat, famous for sophisticated water reservoirs and town planning, was inscribed in 2021 as a World Heritage Site?",
    "options": [
      "Lothal",
      "Dholavira",
      "Rakhigarhi",
      "Kalibangan"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Dholavira: a Harappan City, located on Khadir Bet in the Great Rann of Kutch, Gujarat, was inscribed as India's 40th World Heritage Site in 2021.",
    "source": "UNESCO_World_Heritage_India_2026.pdf",
    "sourcePage": 27,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-2026-quiz-01",
    "orderInQuiz": 7
  },
  {
    "id": "top-unesco-ram-08",
    "topicId": "unesco-2026",
    "subtopicId": "designation-history",
    "question": "Kakatiya Rudreshwara (Ramappa) Temple, constructed in 1213 CE during the Kakatiya period using floating bricks and sandbox foundation technology, is located in which state?",
    "options": [
      "Andhra Pradesh",
      "Telangana (Mulugu district)",
      "Karnataka",
      "Tamil Nadu"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Ramappa Temple at Palampet in Mulugu district of Telangana was inscribed as India's 39th World Heritage Site in 2021, celebrated for carved granite/dolerite pillars and floating lightweight bricks.",
    "source": "UNESCO_World_Heritage_India_2026.pdf",
    "sourcePage": 31,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-2026-quiz-01",
    "orderInQuiz": 8
  },
  {
    "id": "top-unesco-nat-09",
    "topicId": "unesco-2026",
    "subtopicId": "site-facts",
    "question": "Which of the following national conservation areas is NOT listed as a UNESCO Natural World Heritage Site in India?",
    "options": [
      "Kaziranga National Park",
      "Sundarbans National Park",
      "Jim Corbett National Park",
      "Great Himalayan National Park Conservation Area"
    ],
    "correctAnswer": 2,
    "difficulty": "hard",
    "explanation": "Jim Corbett National Park is not a UNESCO Natural World Heritage Site. The 7 Natural sites in India are: Kaziranga, Manas, Keoladeo, Sundarbans, Nanda Devi & Valley of Flowers, Western Ghats, and Great Himalayan National Park.",
    "source": "UNESCO_World_Heritage_India_2026.pdf",
    "sourcePage": 36,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-2026-quiz-01",
    "orderInQuiz": 9
  },
  {
    "id": "top-unesco-hst-10",
    "topicId": "unesco-2026",
    "subtopicId": "site-facts",
    "question": "Where is the headquarters of the United Nations Educational, Scientific and Cultural Organization (UNESCO) located?",
    "options": [
      "Geneva, Switzerland",
      "Paris, France",
      "New York, USA",
      "Vienna, Austria"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "UNESCO was founded in 1945 and its permanent international headquarters is located in Place de Fontenoy, Paris, France.",
    "source": "UNESCO_World_Heritage_India_2026.pdf",
    "sourcePage": 40,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-2026-quiz-01",
    "orderInQuiz": 10
  },
  {
    "id": "top-tent-mar-01",
    "topicId": "unesco-tentative-2026",
    "subtopicId": "tentative-2026-additions",
    "question": "What is India's official nomination dossier for the 2024–2025 cycle from its UNESCO Tentative List, showcasing forts such as Raigad, Shivneri, and Sindhudurg?",
    "options": [
      "Forts of Rajasthan (Hill Forts)",
      "Maratha Military Landscapes of India (Maharashtra & Tamil Nadu)",
      "Monuments of Vijayanagara",
      "Deccan Sultanate Fortresses"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "India nominated the \"Maratha Military Landscapes of India\" (12 components across Maharashtra and Gingee in Tamil Nadu) developed between the 17th and 19th centuries under Chhatrapati Shivaji Maharaj and successors.",
    "source": "UNESCO_Tentative_List_India_2026.pdf",
    "sourcePage": 3,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-tentative-2026-quiz-01",
    "orderInQuiz": 1
  },
  {
    "id": "top-tent-rul-02",
    "topicId": "unesco-tentative-2026",
    "subtopicId": "tentative-vs-whs",
    "question": "According to the Operational Guidelines for the Implementation of the World Heritage Convention, a State Party can submit a nomination for World Heritage inscription only if the site has been on its Tentative List for at least:",
    "options": [
      "3 months",
      "6 months",
      "1 year (12 months)",
      "5 years"
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "explanation": "Paragraph 65 of the UNESCO Operational Guidelines mandates that a property must be included on the State Party's official Tentative List for at least one year before submitting the formal nomination dossier.",
    "source": "UNESCO_Tentative_List_India_2026.pdf",
    "sourcePage": 7,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-tentative-2026-quiz-01",
    "orderInQuiz": 2
  },
  {
    "id": "top-tent-gwa-03",
    "topicId": "unesco-tentative-2026",
    "subtopicId": "tentative-2026-additions",
    "question": "Which hilltop fortress in Madhya Pradesh, referred to by Mughal Emperor Babur as \"the pearl among gems of the fortresses of Hind\", is on India's UNESCO Tentative List?",
    "options": [
      "Gwalior Fort",
      "Orchha Fort Complex",
      "Mandu Fort",
      "Asirgarh Fort"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Gwalior Fort, constructed upon an isolated sandstone hill with the famous Man Mandir Palace and turquoise glazed tile architecture, is on India's Tentative List.",
    "source": "UNESCO_Tentative_List_India_2026.pdf",
    "sourcePage": 12,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-tentative-2026-quiz-01",
    "orderInQuiz": 3
  },
  {
    "id": "top-tent-bur-04",
    "topicId": "unesco-tentative-2026",
    "subtopicId": "tentative-2026-additions",
    "question": "Khooni Bhandara, a unique underground qanat water management system constructed in the 17th century by Abdul Rahim Khan-i-Khana, submitted to the Tentative List, is located in which city of Madhya Pradesh?",
    "options": [
      "Ujjain",
      "Burhanpur",
      "Chanderi",
      "Maheshwar"
    ],
    "correctAnswer": 1,
    "difficulty": "hard",
    "explanation": "Khooni Bhandara in Burhanpur, MP, is a sophisticated subterranean Persian qanat water supply network drawing underground spring water through gravity pipelines without mechanical pumps.",
    "source": "UNESCO_Tentative_List_India_2026.pdf",
    "sourcePage": 17,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-tentative-2026-quiz-01",
    "orderInQuiz": 4
  },
  {
    "id": "top-tent-mod-05",
    "topicId": "unesco-tentative-2026",
    "subtopicId": "tentative-states-importance",
    "question": "The 11th-century Sun Temple at Modhera on the banks of River Pushpavati, built during the reign of King Bhima I of the Chaulukya/Solanki dynasty, is located in which district of Gujarat?",
    "options": [
      "Patan district",
      "Mehsana district",
      "Kheda district",
      "Banaskantha district"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "The Sun Temple at Modhera in Mehsana district of Gujarat, with its ornate Surya Kund (stepped reservoir) and Sabha Mandap, is submitted on India's Tentative List.",
    "source": "UNESCO_Tentative_List_India_2026.pdf",
    "sourcePage": 22,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-tentative-2026-quiz-01",
    "orderInQuiz": 5
  },
  {
    "id": "top-tent-vad-06",
    "topicId": "unesco-tentative-2026",
    "subtopicId": "tentative-states-importance",
    "question": "Vadnagar in Mehsana district of Gujarat, submitted to the Tentative List as a multi-layered historic town, is globally significant for continuous urban habitation dating back to:",
    "options": [
      "12th Century CE",
      "8th Century BCE (over 2,700 years of continuous habitation)",
      "15th Century CE",
      "Indus Valley Harappan period exclusively"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Excavations by ASI reveal Vadnagar as a rare fortified living historic town with continuous settlement across Mauryan, Indo-Greek, Kshatrapa, Solanki, and Sultanate periods spanning over 2,700 years.",
    "source": "UNESCO_Tentative_List_India_2026.pdf",
    "sourcePage": 26,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-tentative-2026-quiz-01",
    "orderInQuiz": 6
  },
  {
    "id": "top-tent-kon-07",
    "topicId": "unesco-tentative-2026",
    "subtopicId": "nomination-reasons",
    "question": "Prehistoric laterite plateaus in the Konkan region containing thousands of open-air rock petroglyphs depicting animals, humans, and geometric patterns are on the Tentative List across which two states?",
    "options": [
      "Maharashtra and Goa",
      "Gujarat and Rajasthan",
      "Kerala and Tamil Nadu",
      "Odisha and West Bengal"
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "explanation": "The \"Geoglyphs of Konkan Region\" spanning Ratnagiri/Sindhudurg in Maharashtra and neighbouring Goa represent remarkable Mesolithic rock engravings carved into laterite plateaus.",
    "source": "UNESCO_Tentative_List_India_2026.pdf",
    "sourcePage": 30,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-tentative-2026-quiz-01",
    "orderInQuiz": 7
  },
  {
    "id": "top-tent-cri-08",
    "topicId": "unesco-tentative-2026",
    "subtopicId": "nomination-reasons",
    "question": "Under UNESCO nomination criteria, what does Criterion (i) represent for a cultural property nominated to the Tentative and World Heritage List?",
    "options": [
      "Masterpiece of human creative genius",
      "Important interchange of human values over a span of time",
      "Exceptional testimony to a cultural tradition",
      "Outstanding example of a traditional human settlement"
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "explanation": "UNESCO Criterion (i) requires a property to \"represent a masterpiece of human creative genius\". There are 6 cultural criteria (i–vi) and 4 natural criteria (vii–x).",
    "source": "UNESCO_Tentative_List_India_2026.pdf",
    "sourcePage": 35,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-tentative-2026-quiz-01",
    "orderInQuiz": 8
  },
  {
    "id": "top-tent-dif-09",
    "topicId": "unesco-tentative-2026",
    "subtopicId": "tentative-vs-whs",
    "question": "What is the fundamental legal distinction between a site on a country's UNESCO Tentative List versus an inscribed World Heritage Site?",
    "options": [
      "Tentative List sites already have international treaty protection",
      "Tentative List is an inventory of prospective sites; only inscribed sites have official World Heritage status",
      "Tentative List sites receive direct funding from the UN",
      "Tentative List sites cannot be visited by the public"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "A Tentative List is an inventory of heritage properties that a State Party intends to consider for nomination in subsequent years. Inclusion on the Tentative List does not confer World Heritage status or legal protection under the 1972 Convention until formally inscribed by the Committee.",
    "source": "UNESCO_Tentative_List_India_2026.pdf",
    "sourcePage": 39,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-tentative-2026-quiz-01",
    "orderInQuiz": 9
  },
  {
    "id": "top-tent-asi-10",
    "topicId": "unesco-tentative-2026",
    "subtopicId": "tentative-vs-whs",
    "question": "Which nodal government organization in India is responsible for preparing and submitting nomination dossiers and managing India's UNESCO Tentative List submissions?",
    "options": [
      "Indian National Trust for Art and Cultural Heritage (INTACH)",
      "Archaeological Survey of India (ASI), Ministry of Culture",
      "Sangeet Natak Akademi",
      "National Museum Institute"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "The Archaeological Survey of India (ASI) under the Ministry of Culture serves as the nodal agency of the Government of India for all matters relating to the UNESCO World Heritage Convention.",
    "source": "UNESCO_Tentative_List_India_2026.pdf",
    "sourcePage": 43,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "unesco-tentative-2026-quiz-01",
    "orderInQuiz": 10
  },
  {
    "id": "top-dan-cls-01",
    "topicId": "dance-forms",
    "subtopicId": "classical-dance",
    "question": "How many classical dance forms are officially recognized by the Sangeet Natak Akademi, India's national academy of music, dance, and drama?",
    "options": [
      "6 classical dance forms",
      "8 classical dance forms",
      "10 classical dance forms",
      "12 classical dance forms"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "The Sangeet Natak Akademi recognizes 8 Indian Classical Dance forms: Bharatanatyam (TN), Kathak (UP), Kathakali (Kerala), Mohiniyattam (Kerala), Odissi (Odisha), Manipuri (Manipur), Kuchipudi (AP), and Sattriya (Assam).",
    "source": "Indian_Art_and_Culture_Dance_2026.pdf",
    "sourcePage": 2,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "dance-forms-quiz-01",
    "orderInQuiz": 1
  },
  {
    "id": "top-dan-sat-02",
    "topicId": "dance-forms",
    "subtopicId": "classical-dance",
    "question": "Sattriya classical dance, originating in the Sattras (monasteries) of Assam, was introduced in the 15th century by which revered Bhakti saint and reformer?",
    "options": [
      "Chaitanya Mahaprabhu",
      "Mahapurusha Srimanta Sankardev",
      "Madhavdev",
      "Aniruddhadev"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Sattriya was introduced in Assam by the great 15th-century Vaishnavite saint-reformer Mahapurusha Srimanta Sankardev as a sacred theatrical devotional medium in monastic Sattras, recognized as classical by SNA in 2000.",
    "source": "Indian_Art_and_Culture_Dance_2026.pdf",
    "sourcePage": 7,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "dance-forms-quiz-01",
    "orderInQuiz": 2
  },
  {
    "id": "top-dan-bha-03",
    "topicId": "dance-forms",
    "subtopicId": "classical-dance",
    "question": "Bharatanatyam, historically performed in temples by Devadasis under names like Sadir Attam and Dasi Attam, originated in which southern state?",
    "options": [
      "Andhra Pradesh",
      "Tamil Nadu",
      "Kerala",
      "Karnataka"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Bharatanatyam is the oldest classical dance tradition of Tamil Nadu, codified in Bharata's Natya Shastra and revived in the modern era by Rukmini Devi Arundale and E. Krishna Iyer.",
    "source": "Indian_Art_and_Culture_Dance_2026.pdf",
    "sourcePage": 12,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "dance-forms-quiz-01",
    "orderInQuiz": 3
  },
  {
    "id": "top-dan-moh-04",
    "topicId": "dance-forms",
    "subtopicId": "classical-dance",
    "question": "Which graceful classical dance of Kerala, known as the \"Dance of the Enchantress\", is performed solo by women wearing white or cream kasavu sarees with gold borders?",
    "options": [
      "Kathakali",
      "Mohiniyattam",
      "Koodiyattam",
      "Ottamthullal"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Mohiniyattam is characterized by delicate Lasya movements, swaying torso rhythms, and white/cream gold-bordered kasavu costumes, drawing from the mythological enchantress avatar of Lord Vishnu (Mohini).",
    "source": "Indian_Art_and_Culture_Dance_2026.pdf",
    "sourcePage": 17,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "dance-forms-quiz-01",
    "orderInQuiz": 4
  },
  {
    "id": "top-dan-kth-05",
    "topicId": "dance-forms",
    "subtopicId": "exponents-facts",
    "question": "Pandit Birju Maharaj, who passed away in 2022, was a legendary doyen and torchbearer of which gharana of Kathak classical dance?",
    "options": [
      "Jaipur Gharana",
      "Lucknow (Kalka-Bindadin) Gharana",
      "Banaras Gharana",
      "Raigarh Gharana"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Pandit Birju Maharaj belonged to the illustrious Kalka-Bindadin family of Lucknow Gharana, renowned for sublime abhinaya (expression), lightning footwork (tatkar), and chakkars (spins).",
    "source": "Indian_Art_and_Culture_Dance_2026.pdf",
    "sourcePage": 23,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "dance-forms-quiz-01",
    "orderInQuiz": 5
  },
  {
    "id": "top-dan-odi-06",
    "topicId": "dance-forms",
    "subtopicId": "exponents-facts",
    "question": "Which distinguished master is universally celebrated for reviving, systematizing, and internationally popularizing Odissi classical dance in the 20th century?",
    "options": [
      "Guru Bipin Singh",
      "Guru Kelucharan Mohapatra",
      "Guru Vempati Chinna Satyam",
      "Uday Shankar"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Guru Kelucharan Mohapatra, the first recipient of the Padma Vibhushan from Odisha, revived the Gotipua and Mahari traditions to establish Odissi on global concert stages.",
    "source": "Indian_Art_and_Culture_Dance_2026.pdf",
    "sourcePage": 28,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "dance-forms-quiz-01",
    "orderInQuiz": 6
  },
  {
    "id": "top-dan-bih-07",
    "topicId": "dance-forms",
    "subtopicId": "folk-dance",
    "question": "Bihu, characterized by energetic brisk steps and rapid hand movements performed to the rhythmic beats of the dhol, pepa, and toka, is the quintessential folk dance of which state?",
    "options": [
      "Manipur",
      "Assam",
      "Tripura",
      "Nagaland"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Bihu is the most popular folk dance of Assam, performed during Bohag Bihu (Rongali Bihu) in mid-April to celebrate the Assamese New Year and sowing season.",
    "source": "Indian_Art_and_Culture_Dance_2026.pdf",
    "sourcePage": 33,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "dance-forms-quiz-01",
    "orderInQuiz": 7
  },
  {
    "id": "top-dan-gar-08",
    "topicId": "dance-forms",
    "subtopicId": "folk-dance",
    "question": "Which traditional folk dance form of Gujarat, performed in concentric circles around a clay lantern during the nine nights of Navratri, was inscribed in 2023 on UNESCO's Representative List of Intangible Cultural Heritage?",
    "options": [
      "Bhavai",
      "Garba",
      "Tippani",
      "Dangi Nritya"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Garba of Gujarat was inscribed on the UNESCO Representative List of the Intangible Cultural Heritage of Humanity in December 2023 at the 18th session of the Intergovernmental Committee in Botswana.",
    "source": "Indian_Art_and_Culture_Dance_2026.pdf",
    "sourcePage": 38,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "dance-forms-quiz-01",
    "orderInQuiz": 8
  },
  {
    "id": "top-dan-che-09",
    "topicId": "dance-forms",
    "subtopicId": "folk-dance",
    "question": "Cheraw, commonly known as the \"Bamboo Dance\" where male dancers rhythmically clap bamboo staves on the ground while female dancers step in and out of the grids, belongs to which state?",
    "options": [
      "Meghalaya",
      "Mizoram",
      "Arunachal Pradesh",
      "Sikkim"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Cheraw is the traditional bamboo dance of Mizoram, performed during festivals like Chapchar Kut, involving intricate coordination and timing between dancers and bamboo holders.",
    "source": "Indian_Art_and_Culture_Dance_2026.pdf",
    "sourcePage": 43,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "dance-forms-quiz-01",
    "orderInQuiz": 9
  },
  {
    "id": "top-dan-kal-10",
    "topicId": "dance-forms",
    "subtopicId": "cultural-distribution",
    "question": "Kalbelia folk songs and dances, celebrated for serpentine swirling movements to the poongi/been by women of the nomadic snake-charmer community, belongs to which Indian state?",
    "options": [
      "Punjab",
      "Rajasthan",
      "Haryana",
      "Madhya Pradesh"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Kalbelia is a folk dance of Rajasthan performed by the Kalbelia community, recognized by UNESCO on the Representative List of the Intangible Cultural Heritage of Humanity.",
    "source": "Indian_Art_and_Culture_Dance_2026.pdf",
    "sourcePage": 48,
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "quizId": "dance-forms-quiz-01",
    "orderInQuiz": 10
  },
  {
    "id": "top-sgk-np-q02-01",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-02",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 1,
    "question": "Dachigam National Park near Srinagar in Jammu & Kashmir is the last surviving natural stronghold for which critically endangered deer species?",
    "options": [
      "Hangul (Kashmir Stag)",
      "Hardground Barasingha",
      "Sangai (Dancing Deer)",
      "Musk Deer"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Dachigam National Park protects the critically endangered Hangul or Kashmir Stag (Cervus hanglu hanglu), the only surviving species of red deer in India, along the Dagwan River.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 14,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q02-02",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-02",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 2,
    "question": "Which high-altitude national park in Jammu and Kashmir is situated in the Chenab River basin, bounded by the Rinnay and Kibar rivers?",
    "options": [
      "Kazinag National Park",
      "Kishtwar National Park",
      "Salim Ali National Park",
      "Dachigam National Park"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Kishtwar National Park in Kishtwar district of Jammu & Kashmir lies in the Central Himalayan alpine zone between the Rinnay and Kibar rivers, famous for the Himalayan Snowcock and Brown Bear.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 15,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q02-03",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-02",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 3,
    "question": "Kazinag National Park along the Line of Control in Baramulla district of Jammu & Kashmir was specifically established to conserve which rare wild goat with spiral corkscrew horns?",
    "options": [
      "Nilgiri Tahr",
      "Himalayan Ibex",
      "Markhor (Capra falconeri)",
      "Bharal (Blue Sheep)"
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "explanation": "Kazinag National Park on the north bank of the Jhelum River was notified in 2007 to protect the endangered Markhor, the largest wild goat in the world famous for its magnificent flared spiral horns.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 16,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q02-04",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-02",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 4,
    "question": "Which river forms the northern boundary of the high-altitude Hemis National Park in Ladakh, India's largest national park?",
    "options": [
      "Zanskar River",
      "Shyok River",
      "Indus River",
      "Nubra River"
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "explanation": "Hemis National Park is bounded on the north by the Indus River and spans 4,400 sq km of Trans-Himalayan high plateau, hosting Hemis Gompa and the world's highest density of Snow Leopards.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 17,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q02-05",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-02",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 5,
    "question": "Great Himalayan National Park (GHNP), inscribed as a UNESCO World Heritage Site in 2014 for its Outstanding Universal Value in biodiversity, is located in which district of Himachal Pradesh?",
    "options": [
      "Kangra",
      "Kullu",
      "Kinnaur",
      "Lahaul and Spiti"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Great Himalayan National Park is located in Kullu district of Himachal Pradesh, protecting the catchments of the Tirthan, Sainj, Jiwa Nal, and Parvati rivers.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 18,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q02-06",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-02",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 6,
    "question": "Pin Valley National Park in Himachal Pradesh preserves the unique high-altitude cold desert flora and fauna of which valley?",
    "options": [
      "Kullu Valley",
      "Kangra Valley",
      "Spiti Valley",
      "Chamba Valley"
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "explanation": "Pin Valley National Park lies entirely within the Spiti subdivision of Lahaul & Spiti district in the Trans-Himalayan Cold Desert Biosphere Reserve, home to the Siberian Ibex and Snow Leopard.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 19,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q02-07",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-02",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 7,
    "question": "Which rapid alpine stream, an upstream tributary of the Bhyundar Ganga, drains the enchanting UNESCO World Heritage meadows of Valley of Flowers National Park in Uttarakhand?",
    "options": [
      "Alaknanda River",
      "Pushpawati River",
      "Mandakini River",
      "Bhagirathi River"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Valley of Flowers National Park in Chamoli district is drained by the Pushpawati River, discovered by British mountaineer Frank S. Smythe in 1931 and famed for over 500 species of alpine flora.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 20,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q02-08",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-02",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 8,
    "question": "Nanda Devi National Park surrounds India's second highest mountain peak (7,816 m). Through which formidable glacial gorge does its only drainage escape?",
    "options": [
      "Dhauli Ganga Gorge",
      "Pindar Gorge",
      "Rishi Ganga Gorge",
      "Goriganga Gorge"
    ],
    "correctAnswer": 2,
    "difficulty": "hard",
    "explanation": "The Nanda Devi Sanctuary is enclosed by a ring of 6,000-meter peaks, with its glacial waters draining solely through the impassable Rishi Ganga Gorge into the Dhauli Ganga.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 21,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q02-09",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-02",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 9,
    "question": "Rajaji National Park in the Shivalik foothills of Uttarakhand was created in 1983 by amalgamating Chilla, Motichur, and which other historic sanctuary?",
    "options": [
      "Govind Sanctuary",
      "Rajaji Sanctuary",
      "Askot Sanctuary",
      "Binsar Sanctuary"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Rajaji National Park was formed by merging Rajaji Sanctuary, Motichur Sanctuary, and Chilla Sanctuary, named after freedom fighter C. Rajagopalachari (Rajaji). It is a vital Asian Elephant habitat.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 22,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q02-10",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-02",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 10,
    "question": "Which historic 10th-century UNESCO World Heritage hill fort overlooks the lakes and tiger territory of Ranthambore National Park in Rajasthan?",
    "options": [
      "Kumbhalgarh Fort",
      "Ranthambore Fort",
      "Chittorgarh Fort",
      "Mehrangarh Fort"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Ranthambore Fort sits atop a 700-foot hill inside Ranthambore National Park in Sawai Madhopur, bounded by the Banas and Chambal rivers and famous for diurnal tiger viewing.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 23,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q02-11",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-02",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 11,
    "question": "Desert National Park in Jaisalmer and Barmer districts of Rajasthan is the most crucial sanctuary for which critically endangered avian species, known locally as Godawan?",
    "options": [
      "Lesser Florican",
      "Great Indian Bustard (Ardeotis nigriceps)",
      "Bengal Florican",
      "Sarus Crane"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Desert National Park covers ~3,162 sq km of Thar sand dunes and scrubland, providing the last major breeding habitat for the Great Indian Bustard (Rajasthan's state bird).",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 24,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q02-12",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-02",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 12,
    "question": "Which was India's first notified Marine National Park, established in 1982 to protect coral reefs, mangroves, and 42 islands in Gujarat?",
    "options": [
      "Mahatma Gandhi Marine National Park",
      "Marine National Park, Gulf of Kutch",
      "Gulf of Mannar Marine National Park",
      "Malvan Marine Sanctuary"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Marine National Park in the Gulf of Kutch (Jamnagar district, Gujarat) was declared in 1982 as India's first marine national park, protecting 162 sq km of coral reefs and mangrove islands like Pirotan.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 25,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q03-01",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-03",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 1,
    "question": "Kanha National Park in Madhya Pradesh achieved international acclaim for saving which subspecies of deer from the brink of extinction, introducing \"Bhoorsingh the Barasingha\" as its official mascot?",
    "options": [
      "Swamp Deer (Hardground Barasingha)",
      "Hog Deer",
      "Mouse Deer",
      "Spotted Deer (Chital)"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Kanha National Park saved the central Indian Hardground Barasingha (Rucervus duvaucelii branderi) from fewer than 66 individuals in 1970 to over 800 today, becoming the first reserve in India to introduce an official mascot.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 26,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q03-02",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-03",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 2,
    "question": "Which national park in Umaria district of Madhya Pradesh is celebrated for the highest recorded density of Bengal Tigers in India and the historic origin of the white tiger Mohan?",
    "options": [
      "Pench National Park",
      "Bandhavgarh National Park",
      "Panna National Park",
      "Satpura National Park"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Bandhavgarh National Park has the highest tiger density in India, centered around ancient Bandhavgarh hill and the 2000-year-old fort gifted by Lord Rama to brother Lakshmana.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 27,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q03-03",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-03",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 3,
    "question": "Which pristine river flows through the heart of Panna National Park in Madhya Pradesh, creating spectacular gorges and waterfalls like Pandav Falls?",
    "options": [
      "Betwa River",
      "Ken River",
      "Son River",
      "Chambal River"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "The Ken River flows northwards through Panna National Park, supporting gharials, muggers, and vulture nesting cliffs, and is the focal point of the Ken-Betwa river linking project.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 28,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q03-04",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-03",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 4,
    "question": "Satpura National Park forms the core wilderness of which UNESCO Biosphere Reserve, featuring Mount Dhoopgarh, the highest point in Madhya Pradesh?",
    "options": [
      "Achanakmar-Amarkantak Biosphere",
      "Pachmarhi Biosphere Reserve",
      "Panna Biosphere Reserve",
      "Simlipal Biosphere Reserve"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Satpura National Park in Narmadapuram is part of the Pachmarhi Biosphere Reserve. Dhoopgarh peak (1,350 m) provides dramatic sandstone ravines and Malabar Giant Squirrel habitat.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 29,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q03-05",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-03",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 5,
    "question": "Under Project Cheetah, Southeast African cheetahs were reintroduced to which National Park in the Sheopur district of Madhya Pradesh in September 2022?",
    "options": [
      "Madhav National Park",
      "Kuno National Park",
      "Van Vihar National Park",
      "Sanjay National Park"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Kuno National Park along the Kuno River was chosen for the reintroduction of cheetahs 70 years after their extinction in India due to its expansive open grasslands and abundant prey base.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 30,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q03-06",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-03",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 6,
    "question": "Notified in 1955 in Chandrapur district, which is Maharashtra's oldest and largest National Park, famously referred to as \"The Jewel of Vidarbha\"?",
    "options": [
      "Navegaon National Park",
      "Tadoba National Park",
      "Gugamal National Park",
      "Chandoli National Park"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Tadoba National Park (combined with Andhari Wildlife Sanctuary to form Tadoba-Andhari Tiger Reserve) is the oldest national park in Maharashtra, taking its name from the local deity Taru.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 31,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q03-07",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-03",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 7,
    "question": "Which national park, situated within Mumbai's suburban metropolis, houses the ancient 1st-century BCE rock-cut Kanheri Buddhist Caves?",
    "options": [
      "Gugamal National Park",
      "Sanjay Gandhi National Park (Borivali)",
      "Navegaon National Park",
      "Chandoli National Park"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Sanjay Gandhi National Park in Borivali, Mumbai, is one of the few national parks situated within a mega-city metropolis, housing 109 basalt rock-cut Kanheri Caves and Vihar & Tulsi lakes.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 32,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q03-08",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-03",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 8,
    "question": "Indravati (Kutru) National Park in Bijapur district of Chhattisgarh provides the primary state haven for which endangered animal, the state animal of Chhattisgarh?",
    "options": [
      "Gaur (Indian Bison)",
      "Wild Water Buffalo (Bubalus arnee)",
      "Chousingha (Four-horned antelope)",
      "Sloth Bear"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Indravati National Park along the Indravati River is renowned for conserving one of the last wild populations of the endangered Wild Water Buffalo, the state animal of Chhattisgarh.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 33,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q03-09",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-03",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 9,
    "question": "Kanger Ghati National Park in Bastar district of Chhattisgarh is famous for Tirathgarh waterfall and which subterranean limestone cave containing blind cavefish and stalagmites?",
    "options": [
      "Borra Caves",
      "Kotumsar Caves",
      "Belum Caves",
      "Mawsmai Caves"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Kotumsar Cave in Kanger Valley National Park is a 330-meter-deep limestone cave with subterranean stalactites, stalagmites, and the endemic blind cavefish (Indoreonectes evezardi).",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 34,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q03-10",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-03",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 10,
    "question": "Simlipal National Park in Mayurbhanj district of Odisha is globally unique as the world's only natural wild reserve harboring which rare variant of Bengal Tiger?",
    "options": [
      "Albino White Tigers",
      "Melanistic (Black-striped) Tigers",
      "Golden Tabby Tigers",
      "Blue Tigers"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Simlipal National Park and Biosphere Reserve in Odisha is the only habitat on Earth where pseudo-melanistic (black-striped) tigers exist in the wild, caused by a genetic mutation in the Taqpep gene.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 35,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q03-11",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-03",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 11,
    "question": "Bhitarkanika National Park in Kendrapara district of Odisha is the second largest mangrove ecosystem in India and holds the Guinness World Record for the largest living specimens of which reptile?",
    "options": [
      "Gharial",
      "Saltwater Crocodile (Crocodylus porosus)",
      "Mugger Crocodile",
      "King Cobra"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Bhitarkanika's Brahmani-Baitarani delta estuarine network is home to over 1,700 giant Saltwater Crocodiles (some exceeding 20 feet) and borders Gahirmatha, the world's largest Olive Ridley sea turtle nesting beach.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 36,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q03-12",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-03",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 12,
    "question": "Sundarbans National Park in West Bengal, a UNESCO World Heritage Site and Biosphere Reserve, is named after which dominant halophytic mangrove tree species?",
    "options": [
      "Rhizophora",
      "Sundari tree (Heritiera fomes)",
      "Avicennia",
      "Sonneratia"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "The Sundarbans mangrove forest in the Ganges delta is named after the prolific Sundari tree (Heritiera fomes), celebrated for pneumatophore roots and swimming Bengal Tigers.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 37,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q04-01",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-04",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 1,
    "question": "Manas National Park in Assam, contiguous with the Royal Manas National Park in Bhutan along the Manas River, is a UNESCO World Heritage Site noted for conserving which critically endangered diminutive mammal?",
    "options": [
      "Hispid Hare",
      "Pygmy Hog (Porcula salvania)",
      "Golden Langur",
      "All of the above"
    ],
    "correctAnswer": 3,
    "difficulty": "medium",
    "explanation": "Manas National Park is a biodiversity hotspot protecting endemic fauna including the world's rarest suid (Pygmy Hog), Golden Langur, Hispid Hare, and Wild Water Buffalo.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 38,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q04-02",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-04",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 2,
    "question": "Nameri National Park in Sonitpur district of Assam, drained by the Jia-Bhoroli River, is celebrated as a prime habitat for which state bird of Assam?",
    "options": [
      "Hornbill",
      "White-winged Wood Duck (Deo Hanh)",
      "Black-necked Crane",
      "Blyth's Tragopan"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Nameri National Park in the Himalayan foothills shares its northern border with Pakhui/Pakke Tiger Reserve of Arunachal Pradesh and is famous for the endangered White-winged Wood Duck and Golden Mahseer angling.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 39,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q04-03",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-04",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 3,
    "question": "Which river island national park in Assam, bounded by the Brahmaputra, Lohit, and Dibru rivers, is world-famous for its free-ranging wild feral horses?",
    "options": [
      "Orang National Park",
      "Dibru-Saikhowa National Park",
      "Raimona National Park",
      "Dihing Patkai National Park"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Dibru-Saikhowa National Park in Tinsukia/Dibrugarh is a riverine biome harboring feral horses (descendants of World War II military army horses) and Gangetic river dolphins.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 40,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q04-04",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-04",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 4,
    "question": "Namdapha National Park in Changlang district of Arunachal Pradesh is the only national park in the world that shelters which four apex feline predator species in a single ecosystem?",
    "options": [
      "Tiger, Lion, Leopard, Cheetah",
      "Tiger, Leopard, Snow Leopard, Clouded Leopard",
      "Tiger, Jaguar, Leopard, Cheetah",
      "Lion, Leopard, Snow Leopard, Ocelot"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Namdapha's dramatic altitudinal span (200 m to 4,571 m at Daphabum) enables it to host four big cat species: Bengal Tiger, Common Indian Leopard, Snow Leopard, and Clouded Leopard.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 41,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q04-05",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-04",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 5,
    "question": "Mouling National Park, forming the western part of the Dihang-Dibang Biosphere Reserve in Arunachal Pradesh, is drained by which major trans-boundary river?",
    "options": [
      "Subansiri River",
      "Siang (Brahmaputra) River",
      "Kameng River",
      "Tirap River"
    ],
    "correctAnswer": 1,
    "difficulty": "hard",
    "explanation": "Mouling National Park in Upper Siang district is drained by the Siang River, protecting red pandas, takins, and serows across temperate rainforests.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 42,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q04-06",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-04",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 6,
    "question": "In Manipur's Keibul Lamjao National Park on Loktak Lake, what is the official conservation status of the endemic Eld's Deer (Sangai) that treads upon the floating phumdis?",
    "options": [
      "Extinct in the Wild",
      "Endangered (Schedule I of Wildlife Protection Act, 1972)",
      "Least Concern",
      "Near Threatened"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "The Sangai or Manipur brow-antlered dancing deer is critically endangered, protected under Schedule I of the Wildlife (Protection) Act, 1972, exclusively found at Keibul Lamjao.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 43,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q04-07",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-04",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 7,
    "question": "Eravikulam National Park in Idukki district of Kerala protects the largest surviving wild population of the endangered Nilgiri Tahr and contains which highest mountain peak of Peninsular India (2,695 m)?",
    "options": [
      "Doddabetta",
      "Anamudi",
      "Agasthyamalai",
      "Chembra Peak"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Anamudi Peak (2,695 meters), the highest peak in India south of the Himalayas, stands inside Eravikulam National Park among rolling montane grassland-shola ecosystems.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 44,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q04-08",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-04",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 8,
    "question": "Silent Valley National Park in the Nilgiri Hills of Palakkad district, Kerala, is drained by which crystal-clear perennial river that was the center of India's historic hydro-electric conservation battle?",
    "options": [
      "Periyar River",
      "Kunthipuzha River",
      "Bharathappuzha River",
      "Pamba River"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "The Kunthipuzha River traverses the entire 24 km length of Silent Valley, saved from a dam project by the pioneering \"Save Silent Valley\" environmental movement to protect the Lion-tailed Macaque.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 45,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q04-09",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-04",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 9,
    "question": "Which historic 1895 gravity dam on the Periyar River formed the scenic 26 sq km reservoir around which Periyar National Park in Kerala was developed?",
    "options": [
      "Idukki Dam",
      "Mullaperiyar Dam",
      "Parambikulam Dam",
      "Cheruthoni Dam"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "The reservoir formed by the Mullaperiyar Dam in 1895 created the artificial lake habitat that became the Nellikkampatty Game Sanctuary in 1934 and Periyar National Park in 1982.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 46,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q04-10",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-04",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 10,
    "question": "Mudumalai National Park in Nilgiris district of Tamil Nadu shares interstate borders with Wayanad Wildlife Sanctuary in Kerala and which tiger reserve in Karnataka?",
    "options": [
      "Nagarhole Tiger Reserve",
      "Bandipur Tiger Reserve",
      "Bhadra Wildlife Sanctuary",
      "Anshi National Park"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Mudumalai, Bandipur (Karnataka), and Wayanad (Kerala) meet at the Nilgiri Biosphere tri-junction, creating India's single largest contiguous landscape for Asian Elephants and Royal Bengal Tigers.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 47,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q04-11",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-04",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 11,
    "question": "The Gulf of Mannar Marine National Park along the coast of Tamil Nadu spans 21 uninhabited coral islands and is India's prime reserve for which herbivorous marine mammal?",
    "options": [
      "Irrawaddy Dolphin",
      "Dugong / Sea Cow (Dugong dugon)",
      "Finless Porpoise",
      "Blue Whale"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "The Gulf of Mannar Marine National Park protects extensive shallow seagrass beds that sustain the vulnerable Dugong (sea cow) and over 117 hard coral species between Dhanushkodi and Tuticorin.",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 48,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-sgk-np-q04-12",
    "topicId": "static-gk",
    "quizId": "static-gk-quiz-04",
    "subtopicId": "state-wise-parks",
    "orderInQuiz": 12,
    "question": "Which National Park in North Andaman Island encompasses Saddle Peak (732 m) and is drained by the Kalpong River, the only river flowing through the Andaman & Nicobar archipelago?",
    "options": [
      "Mahatma Gandhi Marine National Park",
      "Saddle Peak National Park",
      "Campbell Bay National Park",
      "Galathea Bay National Park"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Saddle Peak National Park surrounds the highest point in the Andaman & Nicobar Islands (Saddle Peak, 732 m) and is nourished by the Kalpong River, the islands' only freshwater river (site of Kalpong Hydroelectric Project).",
    "source": "State_Repositories_2026.pdf",
    "sourcePage": 49,
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-6th-sched-01",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-01",
    "subtopicId": "constitutional-provisions",
    "orderInQuiz": 1,
    "question": "Which four northeastern states of India are administered under the provisions of the Sixth Schedule of the Constitution of India?",
    "options": [
      "Assam, Nagaland, Manipur, and Mizoram",
      "Assam, Meghalaya, Tripura, and Mizoram (AMTM)",
      "Arunachal Pradesh, Sikkim, Tripura, and Meghalaya",
      "Manipur, Nagaland, Mizoram, and Tripura"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "The Sixth Schedule applies exclusively to tribal areas in Assam, Meghalaya, Tripura, and Mizoram (mnemonic: AMTM) under Articles 244(2) and 275(1) of the Indian Constitution.",
    "source": "Constitution of India, Sixth Schedule & PRS India",
    "sourcePage": "Articles 244(2) & 275(1)",
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-6th-sched-02",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-01",
    "subtopicId": "constitutional-provisions",
    "orderInQuiz": 2,
    "question": "Which constitutional sub-committee of the Constituent Assembly of India recommended the creation of Autonomous District Councils under the Sixth Schedule?",
    "options": [
      "Kaka Kalelkar Committee",
      "Gopinath Bordoloi Sub-Committee",
      "B.R. Ambedkar Committee",
      "Fazal Ali Commission"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "The Gopinath Bordoloi Sub-Committee (constituted under the Advisory Committee on Fundamental Rights and Minorities) recommended Autonomous District Councils to ensure tribal self-governance and preservation of customary laws.",
    "source": "Constituent Assembly Debates & Ministry of Tribal Affairs",
    "sourcePage": "CAD Vol. IX",
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-6th-sched-03",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-01",
    "subtopicId": "autonomous-district-councils",
    "orderInQuiz": 3,
    "question": "How many Autonomous District Councils (ADCs) currently function under the Sixth Schedule of the Constitution across the four designated states?",
    "options": [
      "6 ADCs",
      "10 ADCs",
      "14 ADCs",
      "20 ADCs"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "There are 10 ADCs in total: 3 in Assam (Bodoland, Karbi Anglong, Dima Hasao), 3 in Meghalaya (Khasi Hills, Garo Hills, Jaintia Hills), 1 in Tripura (TTAADC), and 3 in Mizoram (Chakma, Mara, Lai).",
    "source": "National Commission for Scheduled Tribes (NCST) Annual Report",
    "sourcePage": "Table 4.2",
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-6th-sched-04",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-01",
    "subtopicId": "autonomous-district-councils",
    "orderInQuiz": 4,
    "question": "What is the standard constitutional composition and member count of an Autonomous District Council under Paragraph 2 of the Sixth Schedule (with the exception of Bodoland)?",
    "options": [
      "Up to 20 members (all elected)",
      "Up to 30 members (up to 26 elected via adult suffrage and 4 nominated by the Governor)",
      "Up to 40 members (30 elected and 10 nominated by the President)",
      "15 members appointed by the Chief Minister"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Under Paragraph 2 of the Sixth Schedule, each ADC has up to 30 members: up to 26 elected by adult franchise for a 5-year term and 4 nominated by the Governor. (Bodoland Territorial Council is an exception with 46 members).",
    "source": "Constitution of India, Sixth Schedule Paragraph 2",
    "sourcePage": "Para 2(1)",
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-6th-sched-05",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-01",
    "subtopicId": "powers-governance",
    "orderInQuiz": 5,
    "question": "Whose constitutional assent is mandatorily required before any law enacted by an Autonomous District Council on land, forests, or village administration can take legal effect?",
    "options": [
      "President of India",
      "Governor of the respective State",
      "Chief Minister of the State",
      "Chief Justice of the High Court"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Under Paragraph 3(2) of the Sixth Schedule, all laws made by an Autonomous District Council on land allocation, forests, water channels, village headmen, and customs must receive the assent of the Governor before having effect.",
    "source": "Constitution of India, Sixth Schedule Paragraph 3",
    "sourcePage": "Para 3(2)",
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-6th-sched-06",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-01",
    "subtopicId": "constitutional-provisions",
    "orderInQuiz": 6,
    "question": "Which constitutional Articles of India directly govern the establishment and grant-in-aid provisions of the Sixth Schedule?",
    "options": [
      "Article 244(1) and Article 245",
      "Article 244(2) and Article 275(1)",
      "Article 370 and Article 371",
      "Article 338 and Article 338A"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "Article 244(2) applies the Sixth Schedule to tribal areas in Assam, Meghalaya, Tripura, and Mizoram. Article 275(1) mandates special grants-in-aid from the Consolidated Fund of India for tribal development.",
    "source": "Constitution of India, Articles 244(2) & 275(1)",
    "sourcePage": "Part X & Part XII",
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-6th-sched-07",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-01",
    "subtopicId": "powers-governance",
    "orderInQuiz": 7,
    "question": "What is the key institutional distinction between the Fifth Schedule and the Sixth Schedule of the Constitution of India?",
    "options": [
      "Fifth Schedule applies to North-East; Sixth Schedule applies to South India",
      "Fifth Schedule areas have advisory Tribes Advisory Councils (TACs); Sixth Schedule areas have autonomous legislative, executive, and judicial ADCs",
      "Fifth Schedule is for Union Territories only",
      "Fifth Schedule councils have military and foreign affairs powers"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Fifth Schedule areas (in 10 mainland states) are governed through normal state machinery with advisory Tribes Advisory Councils (TACs), whereas Sixth Schedule ADCs exercise statutory legislative, judicial, and taxation autonomy.",
    "source": "Ministry of Tribal Affairs Governance Manual",
    "sourcePage": "Chapter 2, p. 18",
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-6th-sched-08",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-01",
    "subtopicId": "autonomous-district-councils",
    "orderInQuiz": 8,
    "question": "Which Autonomous District Council in Tripura covers approximately 68% of the state's total geographical area and over one-third of its population?",
    "options": [
      "Chakma Autonomous Council",
      "Tripura Tribal Areas Autonomous District Council (TTAADC)",
      "Dima Hasao Autonomous Council",
      "Karbi Anglong Council"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "The Tripura Tribal Areas Autonomous District Council (TTAADC), established under the Sixth Schedule in 1985, covers 7,132.5 sq km (about 68% of Tripura's area) with headquarters at Khumulwng.",
    "source": "TTAADC Official Portal & NCST",
    "sourcePage": "Administrative Profile 2026",
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-6th-sched-09",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-01",
    "subtopicId": "constitutional-provisions",
    "orderInQuiz": 9,
    "question": "In the Union Territory of Ladakh, civil society coalitions (Apex Body Leh and Kargil Democratic Alliance) have staged peaceful movements demanding inclusion under which constitutional framework?",
    "options": [
      "Fifth Schedule",
      "Sixth Schedule of the Constitution",
      "Article 371A",
      "Eighth Schedule"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Ladakh civil society leaders have demanded inclusion under the Sixth Schedule to protect indigenous land rights, fragile Himalayan ecology, and employment for its over 97% tribal population.",
    "source": "PRS Legislative Research & MHA Parliamentary Reports",
    "sourcePage": "Ladakh Governance Brief 2026",
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-6th-sched-10",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-01",
    "subtopicId": "powers-governance",
    "orderInQuiz": 10,
    "question": "What unique judicial power is conferred upon Autonomous District Councils under Paragraphs 4 and 5 of the Sixth Schedule?",
    "options": [
      "Authority to hear capital punishment murder appeals",
      "Power to constitute village councils and customary courts to try civil suits and minor offenses between Scheduled Tribes according to customary tribal law",
      "Supreme jurisdiction over State High Court judges",
      "Total immunity from Indian Penal Code"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Under Paragraphs 4 and 5 of the Sixth Schedule, District Councils can constitute village councils or courts to try suits and cases where both parties are Scheduled Tribes, applying tribal customary law with appellate oversight by the High Court.",
    "source": "Constitution of India, Sixth Schedule Paragraphs 4 & 5",
    "sourcePage": "Para 4-5",
    "lastVerifiedDate": "2026-11-24",
    "status": "published"
  },
  {
    "id": "top-cap-pib-q02-01",
    "topicId": "current-affairs-pib",
    "quizId": "current-affairs-pib-quiz-02",
    "subtopicId": "national-developments",
    "orderInQuiz": 1,
    "question": "Under the India Semiconductor Mission (ISM) approved by the Union Cabinet, which site was selected for setting up India's first commercial semiconductor fabrication facility (Fab) by Tata Electronics and Powerchip (PSMC)?",
    "options": [
      "Dholera, Gujarat",
      "Sanand, Gujarat",
      "Sri City, Andhra Pradesh",
      "Morigaon, Assam"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "The Union Cabinet approved the establishment of India's first commercial semiconductor wafer fabrication facility by Tata Electronics in partnership with Taiwan's Powerchip Semiconductor Manufacturing Corp (PSMC) at Dholera Special Investment Region (SIR) in Gujarat with an investment of ₹91,000 crore.",
    "source": "Press Information Bureau (PIB), Ministry of Electronics & IT",
    "sourceUrl": "https://pib.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-cap-pib-q02-02",
    "topicId": "current-affairs-pib",
    "quizId": "current-affairs-pib-quiz-02",
    "subtopicId": "national-developments",
    "orderInQuiz": 2,
    "question": "What is the name of the female humanoid robot developed by the Indian Space Research Organisation (ISRO) to fly aboard uncrewed test missions of the Gaganyaan human spaceflight programme?",
    "options": [
      "Vyommitra",
      "Shaktimaan",
      "Pragyan",
      "MitraShakti"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Vyommitra (\"Space Friend\") is a half-humanoid robot developed by ISRO. Equipped with artificial intelligence and speech capabilities, she is programmed to monitor environmental parameters, operate control panels, and simulate human physiological responses during Gaganyaan uncrewed test flights.",
    "source": "Press Information Bureau (PIB), Department of Space",
    "sourceUrl": "https://pib.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-cap-pib-q02-03",
    "topicId": "current-affairs-pib",
    "quizId": "current-affairs-pib-quiz-02",
    "subtopicId": "government-schemes",
    "orderInQuiz": 3,
    "question": "Under the PM-Surya Ghar: Muft Bijli Yojana launched with an outlay of ₹75,021 crore, how many units of free electricity per month are targeted for 1 crore beneficiary households?",
    "options": [
      "Up to 100 units",
      "Up to 200 units",
      "Up to 300 units",
      "Up to 500 units"
    ],
    "correctAnswer": 2,
    "difficulty": "easy",
    "explanation": "PM-Surya Ghar: Muft Bijli Yojana aims to install rooftop solar panels across 1 crore households in India, providing up to 300 units of free electricity per month, generating surplus power for DISCOMs, and reducing annual carbon emissions by 720 million tonnes.",
    "source": "Press Information Bureau (PIB), Ministry of New and Renewable Energy",
    "sourceUrl": "https://pib.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-cap-pib-q02-04",
    "topicId": "current-affairs-pib",
    "quizId": "current-affairs-pib-quiz-02",
    "subtopicId": "government-schemes",
    "orderInQuiz": 4,
    "question": "The Union Cabinet approved the Unified Pension Scheme (UPS) for Central Government employees. What percentage of the average basic pay drawn in the last 12 months is guaranteed as assured pension for qualifying service of minimum 25 years?",
    "options": [
      "40%",
      "50%",
      "60%",
      "65%"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "The Unified Pension Scheme (UPS) guarantees an assured pension of 50% of the average basic pay drawn over the last 12 months prior to superannuation for employees with a minimum qualifying service of 25 years. It also provides an assured minimum pension of ₹10,000 per month for service of at least 10 years.",
    "source": "Press Information Bureau (PIB), Ministry of Personnel, Public Grievances & Pensions",
    "sourceUrl": "https://pib.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-cap-pib-q02-05",
    "topicId": "current-affairs-pib",
    "quizId": "current-affairs-pib-quiz-02",
    "subtopicId": "national-developments",
    "orderInQuiz": 5,
    "question": "Under India's Deep Ocean Mission, what is the name of the indigenously developed manned submersible designed to carry three scientists to an ocean depth of 6,000 meters?",
    "options": [
      "MATSYA 6000",
      "VARUNA 6000",
      "SAGAR 6000",
      "SAMUDRA 6000"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "MATSYA 6000 is an indigenously developed human submersible vehicle developed by the National Institute of Ocean Technology (NIOT) under the Deep Ocean Mission (Samudrayaan), engineered with a titanium alloy personnel sphere to explore hydrothermal vents and polymetallic nodules at 6,000 meters depth.",
    "source": "Press Information Bureau (PIB), Ministry of Earth Sciences",
    "sourceUrl": "https://pib.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-cap-pib-q02-06",
    "topicId": "current-affairs-pib",
    "quizId": "current-affairs-pib-quiz-02",
    "subtopicId": "government-schemes",
    "orderInQuiz": 6,
    "question": "The Union Cabinet approved the continuation and expansion of Pradhan Mantri Awas Yojana (PMAY 2.0). How many additional affordable houses were approved for construction across rural and urban sectors?",
    "options": [
      "1 Crore houses",
      "2 Crore houses",
      "3 Crore houses",
      "5 Crore houses"
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "explanation": "The Union Cabinet chaired by Prime Minister Narendra Modi approved government assistance for constructing an additional 3 crore houses under PMAY—comprising 2 crore houses in rural areas (PMAY-Gramin) and 1 crore houses in urban areas (PMAY-Urban 2.0).",
    "source": "Press Information Bureau (PIB), Ministry of Housing and Urban Affairs",
    "sourceUrl": "https://pib.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-cap-pib-q02-07",
    "topicId": "current-affairs-pib",
    "quizId": "current-affairs-pib-quiz-02",
    "subtopicId": "national-developments",
    "orderInQuiz": 7,
    "question": "Which second indigenous nuclear-powered ballistic missile submarine (SSBN) was commissioned into the Indian Navy at Visakhapatnam, strengthening India's strategic nuclear triad?",
    "options": [
      "INS Arihant",
      "INS Arighaat",
      "INS Aridhaman",
      "INS Chakra"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "INS Arighaat, India's second indigenous nuclear-powered ballistic missile submarine (SSBN) built under the Advanced Technology Vessel (ATV) project, was commissioned into the Indian Navy at Visakhapatnam by Raksha Mantri Rajnath Singh, reinforcing India's sea-based nuclear deterrence.",
    "source": "Press Information Bureau (PIB), Ministry of Defence",
    "sourceUrl": "https://pib.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-cap-pib-q02-08",
    "topicId": "current-affairs-pib",
    "quizId": "current-affairs-pib-quiz-02",
    "subtopicId": "government-schemes",
    "orderInQuiz": 8,
    "question": "The Union Cabinet approved the Digital Agriculture Mission with an outlay of ₹2,817 crore. Which core digital public infrastructure component builds a federated registry of farmers linked to land records?",
    "options": [
      "AgriStack",
      "e-NAM Digital",
      "Kisan Credit Portal",
      "PM-KISAN Connect"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "AgriStack is the foundation of the Digital Agriculture Mission, providing digital public infrastructure comprising Farmer Registry, Geo-referenced Village Land Maps, and Crop Sown Registry to deliver seamless credit, crop insurance, and minimum support price services.",
    "source": "Press Information Bureau (PIB), Ministry of Agriculture & Farmers Welfare",
    "sourceUrl": "https://pib.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-cap-pib-q02-09",
    "topicId": "current-affairs-pib",
    "quizId": "current-affairs-pib-quiz-02",
    "subtopicId": "national-developments",
    "orderInQuiz": 9,
    "question": "Under the National Green Hydrogen Mission, what is the acronym of the flagship financial incentive programme designed to domesticate electrolyser manufacturing and green hydrogen production?",
    "options": [
      "SIGHT Programme",
      "PRAGATI Programme",
      "URJA Initiative",
      "HARIT Mission"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "SIGHT stands for Strategic Interventions for Green Hydrogen Transition. With an allocation of over ₹17,490 crore, it provides direct financial incentives for domestic electrolyser manufacturing and green hydrogen production capacity in India.",
    "source": "Press Information Bureau (PIB), Ministry of New and Renewable Energy",
    "sourceUrl": "https://pib.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-cap-pib-q02-10",
    "topicId": "current-affairs-pib",
    "quizId": "current-affairs-pib-quiz-02",
    "subtopicId": "national-developments",
    "orderInQuiz": 10,
    "question": "The Department of Telecommunications launched the Bharat 6G Alliance under the \"Bharat 6G Vision\" document. What is the target year set by the government for nationwide 6G leadership and commercial deployment?",
    "options": [
      "2028",
      "2030",
      "2035",
      "2040"
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "explanation": "The Bharat 6G Vision document, released by the Prime Minister, establishes an apex technology roadmap for India to be a global front-runner in 6G wireless communication technology by 2030, anchored by the Bharat 6G Alliance and indigenous patent development.",
    "source": "Press Information Bureau (PIB), Ministry of Communications",
    "sourceUrl": "https://pib.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-cap-pib-q02-11",
    "topicId": "current-affairs-pib",
    "quizId": "current-affairs-pib-quiz-02",
    "subtopicId": "national-developments",
    "orderInQuiz": 11,
    "question": "What is the full title of the BioE3 Policy approved by the Union Cabinet to spearhead a sustainable green bio-economy transition in India?",
    "options": [
      "Biotechnology for Economy, Environment and Employment",
      "Biomass for Energy, Ecology and Exports",
      "Bio-innovation for Enterprises, Education and Evolution",
      "Bio-safety for Ecosystems, Earth and Energy"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "The Union Cabinet approved the BioE3 Policy (Biotechnology for Economy, Environment and Employment) formulated by the Department of Biotechnology, targeting bio-based chemicals, precision therapeutics, smart proteins, and carbon capture biomanufacturing.",
    "source": "Press Information Bureau (PIB), Ministry of Science and Technology",
    "sourceUrl": "https://pib.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-cap-pib-q02-12",
    "topicId": "current-affairs-pib",
    "quizId": "current-affairs-pib-quiz-02",
    "subtopicId": "national-developments",
    "orderInQuiz": 12,
    "question": "The first prototype of the Vande Bharat Sleeper trainset, manufactured by BEML in Bengaluru for long-distance overnight transit, features which indigenous automatic train protection (ATP) system?",
    "options": [
      "Kavach",
      "Rakshak",
      "Suraksha",
      "Vajra"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "The Vande Bharat Sleeper trainset, designed for speeds up to 160 km/h with world-class passenger amenities, is fully integrated with the Kavach automatic train protection system, crash-resistant couplers, and modular vacuum toilet systems.",
    "source": "Press Information Bureau (PIB), Ministry of Railways",
    "sourceUrl": "https://pib.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-bfa-rbi-q02-01",
    "topicId": "banking-awareness-fa",
    "quizId": "banking-awareness-fa-quiz-02",
    "subtopicId": "rbi-monetary-policy",
    "orderInQuiz": 1,
    "question": "Under Basel III guidelines in India, the Capital Conservation Buffer (CCB) must be maintained at what percentage of Risk-Weighted Assets (RWA), bringing the minimum regulatory CRAR for commercial banks to 11.5%?",
    "options": [
      "1.5%",
      "2.0%",
      "2.5%",
      "3.0%"
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "explanation": "Under RBI's Basel III framework, commercial banks in India must maintain a minimum Total Capital Adequacy Ratio (CRAR) of 9% plus a Capital Conservation Buffer (CCB) of 2.5% in the form of Common Equity Tier 1 (CET1) capital, totaling a minimum regulatory CRAR of 11.5%.",
    "source": "Master Circular – Basel III Capital Regulations, Reserve Bank of India",
    "sourceUrl": "https://www.rbi.org.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-bfa-rbi-q02-02",
    "topicId": "banking-awareness-fa",
    "quizId": "banking-awareness-fa-quiz-02",
    "subtopicId": "banking-concepts",
    "orderInQuiz": 2,
    "question": "According to RBI prudential norms on income recognition, asset classification and provisioning (IRAC), after how many months in the Sub-standard category does a non-performing loan advance get classified as a \"Doubtful Asset\"?",
    "options": [
      "6 Months",
      "12 Months",
      "18 Months",
      "24 Months"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Under RBI IRAC norms: An asset is Sub-standard if it has remained an NPA for a period of up to 12 months. If it remains an NPA for more than 12 months, it is downgraded to a Doubtful Asset (Doubtful 1 up to 1 year, Doubtful 2 up to 3 years, Doubtful 3 above 3 years).",
    "source": "Master Circular – Prudential Norms on Income Recognition and Asset Classification, RBI",
    "sourceUrl": "https://www.rbi.org.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-bfa-rbi-q02-03",
    "topicId": "banking-awareness-fa",
    "quizId": "banking-awareness-fa-quiz-02",
    "subtopicId": "banking-concepts",
    "orderInQuiz": 3,
    "question": "Under the Reserve Bank - Integrated Ombudsman Scheme (RB-IOS), what is the maximum pecuniary compensation the Ombudsman can award for consequential loss suffered by a complainant?",
    "options": [
      "₹10 Lakh",
      "₹20 Lakh",
      "₹30 Lakh",
      "₹50 Lakh"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "The Reserve Bank - Integrated Ombudsman Scheme integrates banking, NBFC, and digital transaction ombudsman frameworks. The Ombudsman can award compensation up to ₹20 lakh for direct/consequential financial losses and up to ₹1 lakh for loss of time, expenses, and mental harassment.",
    "source": "The Reserve Bank - Integrated Ombudsman Scheme, 2021 (as amended 2026)",
    "sourceUrl": "https://www.rbi.org.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-bfa-rbi-q02-04",
    "topicId": "banking-awareness-fa",
    "quizId": "banking-awareness-fa-quiz-02",
    "subtopicId": "banking-concepts",
    "orderInQuiz": 4,
    "question": "Which three core financial indicators serve as the regulatory trigger parameters under the RBI's revised Prompt Corrective Action (PCA) framework for commercial banks?",
    "options": [
      "Capital (CRAR), Asset Quality (Net NPA), and Leverage Ratio",
      "Current Ratio, Quick Ratio, and Debt-to-Equity Ratio",
      "Total Assets, Total Liabilities, and Net Interest Margin",
      "Cash Reserve Ratio, Statutory Liquidity Ratio, and Repo Rate"
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "explanation": "The revised PCA framework monitors banks across three primary risk thresholds: Capital (CRAR and Common Equity Tier 1 ratio), Asset Quality (Net Non-Performing Asset ratio), and Leverage (Tier 1 Leverage Ratio). Breach of thresholds triggers mandatory and discretionary supervisory actions.",
    "source": "Prompt Corrective Action (PCA) Framework for Scheduled Commercial Banks, RBI",
    "sourceUrl": "https://www.rbi.org.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-bfa-rbi-q02-05",
    "topicId": "banking-awareness-fa",
    "quizId": "banking-awareness-fa-quiz-02",
    "subtopicId": "financial-inclusion",
    "orderInQuiz": 5,
    "question": "The Reserve Bank of India issues India's Central Bank Digital Currency (CBDC) in two distinct formats. What are their official designations?",
    "options": [
      "e₹-Retail (e₹-R) and e₹-Wholesale (e₹-W)",
      "Digital Rupee Public and Digital Rupee Commercial",
      "Bharat Coin and Rupee Token",
      "UPI Digital and RBI Digital"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "The Digital Rupee is issued by the RBI as sovereign legal tender in two variants: e₹-Retail (e₹-R) designed for peer-to-peer and person-to-merchant retail transactions, and e₹-Wholesale (e₹-W) designed for interbank settlement of secondary market government securities transactions.",
    "source": "Concept Note on Central Bank Digital Currency (CBDC), RBI",
    "sourceUrl": "https://www.rbi.org.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-bfa-rbi-q02-06",
    "topicId": "banking-awareness-fa",
    "quizId": "banking-awareness-fa-quiz-02",
    "subtopicId": "financial-inclusion",
    "orderInQuiz": 6,
    "question": "What is the mandatory Priority Sector Lending (PSL) target for Domestic Scheduled Commercial Banks as a percentage of Adjusted Net Bank Credit (ANBC) or Credit Equivalent Amount of Off-Balance Sheet Exposure (CEOBE)?",
    "options": [
      "25%",
      "30%",
      "40%",
      "50%"
    ],
    "correctAnswer": 2,
    "difficulty": "easy",
    "explanation": "Domestic commercial banks are mandated to allocate 40% of their ANBC or CEOBE to Priority Sector Lending, including sub-targets of 18% for Agriculture (with 10% for Small and Marginal Farmers) and 7.5% for Micro Enterprises.",
    "source": "Master Direction – Priority Sector Lending (PSL) – Targets and Classification, RBI",
    "sourceUrl": "https://www.rbi.org.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-bfa-rbi-q02-07",
    "topicId": "banking-awareness-fa",
    "quizId": "banking-awareness-fa-quiz-02",
    "subtopicId": "banking-concepts",
    "orderInQuiz": 7,
    "question": "Under RBI guidelines, which of the following is NOT a defined criterion for classifying a borrower account as a \"Wilful Defaulter\"?",
    "options": [
      "Defaulting on debt obligations despite having the capacity to pay",
      "Diverting loan funds for purposes other than the specific sanctioned objective",
      "Incurring legitimate business losses due to an unforeseen global macroeconomic downturn",
      "Disposing of or removing mortgaged immovable collateral without the lender's consent"
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "explanation": "Wilful default occurs when a unit defaults on obligations despite capacity to pay, diverts funds, siphons off funds, or disposes of secured assets without bank approval. Genuine business failure due to macroeconomic headwinds is not classified as wilful default.",
    "source": "Master Circular on Wilful Defaulters, Reserve Bank of India",
    "sourceUrl": "https://www.rbi.org.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-bfa-rbi-q02-08",
    "topicId": "banking-awareness-fa",
    "quizId": "banking-awareness-fa-quiz-02",
    "subtopicId": "banking-concepts",
    "orderInQuiz": 8,
    "question": "Under the Insolvency and Bankruptcy Code (IBC 2016), what is the mandatory outer time limit for completing the Corporate Insolvency Resolution Process (CIRP), inclusive of extensions and legal litigation time?",
    "options": [
      "180 Days",
      "270 Days",
      "330 Days",
      "365 Days"
    ],
    "correctAnswer": 2,
    "difficulty": "hard",
    "explanation": "The baseline CIRP period under IBC Section 12 is 180 days, extendable by up to 90 days (270 days). An amendment established a mandatory maximum outer ceiling of 330 days, inclusive of any time consumed in legal proceedings.",
    "source": "Insolvency and Bankruptcy Code, 2016 (IBC) & Insolvency and Bankruptcy Board of India (IBBI)",
    "sourceUrl": "https://ibbi.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-bfa-rbi-q02-09",
    "topicId": "banking-awareness-fa",
    "quizId": "banking-awareness-fa-quiz-02",
    "subtopicId": "banking-concepts",
    "orderInQuiz": 9,
    "question": "Under Section 138 of the Negotiable Instruments Act 1881 for cheque bouncing due to insufficient funds, within how many days of receiving intimation must the payee serve a statutory legal notice demanding payment?",
    "options": [
      "15 Days",
      "30 Days",
      "45 Days",
      "60 Days"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Under Section 138 of the Negotiable Instruments Act 1881, the payee must issue a written notice demanding payment within 30 days of receiving the cheque dishonour memo from the bank. If the drawer fails to make payment within 15 days of receiving the notice, a criminal complaint can be filed.",
    "source": "Negotiable Instruments Act, 1881, Ministry of Law & Justice",
    "sourceUrl": "https://legislative.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-bfa-rbi-q02-10",
    "topicId": "banking-awareness-fa",
    "quizId": "banking-awareness-fa-quiz-02",
    "subtopicId": "financial-inclusion",
    "orderInQuiz": 10,
    "question": "What is the minimum paid-up voting equity capital required by the Reserve Bank of India to establish a new Small Finance Bank (SFB)?",
    "options": [
      "₹100 Crore",
      "₹200 Crore",
      "₹300 Crore",
      "₹500 Crore"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "explanation": "Under RBI guidelines for 'on-tap' licensing of Small Finance Banks, the minimum paid-up voting equity capital is ₹200 crore (for primary urban cooperative banks transitioning to SFB, an initial net worth of ₹100 crore is allowed, to be increased to ₹200 crore within 5 years).",
    "source": "Guidelines for 'on tap' Licensing of Small Finance Banks in the Private Sector, RBI",
    "sourceUrl": "https://www.rbi.org.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-bfa-rbi-q02-11",
    "topicId": "banking-awareness-fa",
    "quizId": "banking-awareness-fa-quiz-02",
    "subtopicId": "financial-inclusion",
    "orderInQuiz": 11,
    "question": "Which of the following activities is strictly prohibited for Payments Banks (such as Airtel Payments Bank, India Post Payments Bank) under RBI guidelines?",
    "options": [
      "Accepting demand deposits up to ₹2,00,000 per customer",
      "Issuing ATM and debit cards",
      "Lending loans or issuing credit cards",
      "Facilitating utility bill payments and remittances"
    ],
    "correctAnswer": 2,
    "difficulty": "easy",
    "explanation": "Payments Banks are niche banks permitted to accept demand deposits (up to ₹2 lakh per individual), provide remittance services, and issue debit cards, but are explicitly prohibited by the RBI from undertaking any lending activities or issuing credit cards.",
    "source": "Operating Guidelines for Payments Banks, Reserve Bank of India",
    "sourceUrl": "https://www.rbi.org.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-bfa-rbi-q02-12",
    "topicId": "banking-awareness-fa",
    "quizId": "banking-awareness-fa-quiz-02",
    "subtopicId": "banking-concepts",
    "orderInQuiz": 12,
    "question": "In early recognition of financial stress before an account turns NPA, an overdue principal or interest payment of 61 to 90 days is classified as which Special Mention Account (SMA) category?",
    "options": [
      "SMA-0",
      "SMA-1",
      "SMA-2",
      "SMA-Sub"
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "explanation": "Under RBI framework: SMA-0 reflects overdue payments of 1–30 days; SMA-1 covers 31–60 days; and SMA-2 covers 61–90 days. Beyond 90 days of continuous default, the loan is formally classified as a Non-Performing Asset (NPA).",
    "source": "Prudential Framework for Resolution of Stressed Assets, RBI",
    "sourceUrl": "https://www.rbi.org.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-min-cab-q02-01",
    "topicId": "central-ministers",
    "quizId": "central-ministers-quiz-02",
    "subtopicId": "portfolios",
    "orderInQuiz": 1,
    "question": "Who serves as the Union Minister of Road Transport and Highways in the Union Council of Ministers?",
    "options": [
      "Nitin Jairam Gadkari",
      "Manohar Lal Khattar",
      "Sarbananda Sonowal",
      "Piyush Goyal"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Nitin Jairam Gadkari represents the Nagpur parliamentary constituency in Maharashtra and serves as the Union Minister for Road Transport and Highways, overseeing national highway network expansion and expressway infrastructure.",
    "source": "Cabinet Secretariat, Government of India (Official Portfolio Directory)",
    "sourceUrl": "https://cabsec.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-min-cab-q02-02",
    "topicId": "central-ministers",
    "quizId": "central-ministers-quiz-02",
    "subtopicId": "portfolios",
    "orderInQuiz": 2,
    "question": "Who holds the dual portfolio of Union Minister of Finance and Union Minister of Corporate Affairs?",
    "options": [
      "Nirmala Sitharaman",
      "Smriti Zubin Irani",
      "Annapurna Devi",
      "Nirmal Kumar"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Nirmala Sitharaman serves as the Union Minister of Finance and Minister of Corporate Affairs, having presented seven consecutive Union Budgets in Parliament.",
    "source": "Cabinet Secretariat, Government of India (Official Portfolio Directory)",
    "sourceUrl": "https://cabsec.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-min-cab-q02-03",
    "topicId": "central-ministers",
    "quizId": "central-ministers-quiz-02",
    "subtopicId": "portfolios",
    "orderInQuiz": 3,
    "question": "Who serves as the Union Minister of Railways, Minister of Information and Broadcasting, and Minister of Electronics and Information Technology?",
    "options": [
      "Ashwini Vaishnaw",
      "Jyotiraditya M. Scindia",
      "Rajeev Chandrasekhar",
      "Hardeep Singh Puri"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Ashwini Vaishnaw, a former IAS officer and Rajya Sabha MP from Odisha, holds the combined portfolios of Minister of Railways, Minister of Information & Broadcasting, and Minister of Electronics & Information Technology.",
    "source": "Cabinet Secretariat, Government of India (Official Portfolio Directory)",
    "sourceUrl": "https://cabsec.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-min-cab-q02-04",
    "topicId": "central-ministers",
    "quizId": "central-ministers-quiz-02",
    "subtopicId": "portfolios",
    "orderInQuiz": 4,
    "question": "Who serves as the Union Minister of Education in the Union Cabinet, responsible for overseeing the implementation of the National Education Policy (NEP 2020)?",
    "options": [
      "Dharmendra Pradhan",
      "Mansukh Mandaviya",
      "G. Kishan Reddy",
      "Kiren Rijiju"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Dharmendra Pradhan represents the Sambalpur constituency in Odisha and serves as the Union Minister of Education in the Union Council of Ministers.",
    "source": "Cabinet Secretariat, Government of India (Official Portfolio Directory)",
    "sourceUrl": "https://cabsec.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-min-cab-q02-05",
    "topicId": "central-ministers",
    "quizId": "central-ministers-quiz-02",
    "subtopicId": "portfolios",
    "orderInQuiz": 5,
    "question": "Who holds the ministerial charge of the Ministry of Health and Family Welfare and Ministry of Chemicals and Fertilizers in the Union Cabinet?",
    "options": [
      "Jagat Prakash Nadda",
      "Mansukh Mandaviya",
      "Dr. Harsh Vardhan",
      "Chirag Paswan"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Jagat Prakash Nadda holds the portfolio of Union Minister of Health and Family Welfare and Minister of Chemicals and Fertilizers in the Union Cabinet.",
    "source": "Cabinet Secretariat, Government of India (Official Portfolio Directory)",
    "sourceUrl": "https://cabsec.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-min-cab-q02-06",
    "topicId": "central-ministers",
    "quizId": "central-ministers-quiz-02",
    "subtopicId": "portfolios",
    "orderInQuiz": 6,
    "question": "Who is the Union Minister of Commerce and Industry in the Union Council of Ministers?",
    "options": [
      "Piyush Goyal",
      "Suresh Prabhu",
      "Bhupender Yadav",
      "Pralhad Joshi"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Piyush Goyal, representing Mumbai North constituency in Maharashtra, serves as the Union Minister of Commerce and Industry, steering foreign trade policy, free trade agreements (FTAs), and industrial corridors.",
    "source": "Cabinet Secretariat, Government of India (Official Portfolio Directory)",
    "sourceUrl": "https://cabsec.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-min-cab-q02-07",
    "topicId": "central-ministers",
    "quizId": "central-ministers-quiz-02",
    "subtopicId": "portfolios",
    "orderInQuiz": 7,
    "question": "Who serves as the Union Minister of Agriculture and Farmers Welfare and Union Minister of Rural Development?",
    "options": [
      "Shivraj Singh Chouhan",
      "Narendra Singh Tomar",
      "Arjun Munda",
      "Giriraj Singh"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Shivraj Singh Chouhan, former Chief Minister of Madhya Pradesh and MP from Vidisha, serves as the Union Minister of Agriculture and Farmers Welfare and Minister of Rural Development.",
    "source": "Cabinet Secretariat, Government of India (Official Portfolio Directory)",
    "sourceUrl": "https://cabsec.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-min-cab-q02-08",
    "topicId": "central-ministers",
    "quizId": "central-ministers-quiz-02",
    "subtopicId": "portfolios",
    "orderInQuiz": 8,
    "question": "Who serves as the Union Minister of Heavy Industries and Union Minister of Steel?",
    "options": [
      "H.D. Kumaraswamy",
      "Ram Mohan Naidu",
      "Jyotiraditya Scindia",
      "Jitan Ram Manjhi"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "H.D. Kumaraswamy, former Chief Minister of Karnataka and MP from Mandya, serves as the Union Minister of Heavy Industries and Minister of Steel.",
    "source": "Cabinet Secretariat, Government of India (Official Portfolio Directory)",
    "sourceUrl": "https://cabsec.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-min-cab-q02-09",
    "topicId": "central-ministers",
    "quizId": "central-ministers-quiz-02",
    "subtopicId": "portfolios",
    "orderInQuiz": 9,
    "question": "Who serves as the Union Minister of Housing and Urban Affairs and Union Minister of Power?",
    "options": [
      "Manohar Lal Khattar",
      "Hardeep Singh Puri",
      "R.K. Singh",
      "Gajendra Singh Shekhawat"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Manohar Lal Khattar, former Chief Minister of Haryana and MP from Karnal, serves as the Union Minister of Housing and Urban Affairs and Minister of Power.",
    "source": "Cabinet Secretariat, Government of India (Official Portfolio Directory)",
    "sourceUrl": "https://cabsec.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-min-cab-q02-10",
    "topicId": "central-ministers",
    "quizId": "central-ministers-quiz-02",
    "subtopicId": "portfolios",
    "orderInQuiz": 10,
    "question": "Who serves as the Union Minister of Environment, Forest and Climate Change in the Union Cabinet?",
    "options": [
      "Bhupender Yadav",
      "Prakash Javadekar",
      "Kiren Rijiju",
      "Sarbananda Sonowal"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Bhupender Yadav, MP from Alwar in Rajasthan, serves as the Union Minister of Environment, Forest and Climate Change, representing India at global climate forums (UNFCCC COP) and overseeing national wetland and wildlife conservation.",
    "source": "Cabinet Secretariat, Government of India (Official Portfolio Directory)",
    "sourceUrl": "https://cabsec.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-min-cab-q02-11",
    "topicId": "central-ministers",
    "quizId": "central-ministers-quiz-02",
    "subtopicId": "portfolios",
    "orderInQuiz": 11,
    "question": "Who holds the charge as Minister of State (Independent Charge) for Law and Justice and Minister of State for Parliamentary Affairs?",
    "options": [
      "Arjun Ram Meghwal",
      "Dr. Jitendra Singh",
      "Jayant Chaudhary",
      "Prataprao Jadhav"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Arjun Ram Meghwal, representing Bikaner constituency in Rajasthan, serves as the Minister of State (Independent Charge) of the Ministry of Law and Justice and Minister of State in the Ministry of Parliamentary Affairs.",
    "source": "Cabinet Secretariat, Government of India (Official Portfolio Directory)",
    "sourceUrl": "https://cabsec.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-min-cab-q02-12",
    "topicId": "central-ministers",
    "quizId": "central-ministers-quiz-02",
    "subtopicId": "portfolios",
    "orderInQuiz": 12,
    "question": "Who holds charge as Minister of State (Independent Charge) of Science & Technology, Earth Sciences, and MoS in PMO and Personnel?",
    "options": [
      "Dr. Jitendra Singh",
      "Rao Inderjit Singh",
      "Shripad Yesso Naik",
      "Pankaj Chaudhary"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Dr. Jitendra Singh, MP from Udhampur in Jammu & Kashmir, serves as the Minister of State (Independent Charge) for Science and Technology and Earth Sciences, and Minister of State in the Prime Minister's Office, Personnel, Atomic Energy and Space.",
    "source": "Cabinet Secretariat, Government of India (Official Portfolio Directory)",
    "sourceUrl": "https://cabsec.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-ram-26-q02-01",
    "topicId": "ramsar-sites-2026",
    "quizId": "ramsar-sites-2026-quiz-02",
    "subtopicId": "ramsar-sites",
    "orderInQuiz": 1,
    "question": "On 15 October 2026, India officially reached a monumental total of how many designated Ramsar Sites of International Importance under the Ramsar Convention?",
    "options": [
      "85 Sites",
      "95 Sites",
      "101 Sites",
      "103 Sites"
    ],
    "correctAnswer": 3,
    "difficulty": "easy",
    "explanation": "On 15 October 2026, the Ministry of Environment, Forest and Climate Change announced that India reached 103 Ramsar sites, cementing India's position as having the second largest network of Ramsar sites in Asia and third largest globally.",
    "source": "Ramsar Convention Secretariat & Ministry of Environment, Forest and Climate Change (MoEFCC)",
    "sourceUrl": "https://www.ramsar.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-ram-26-q02-02",
    "topicId": "ramsar-sites-2026",
    "quizId": "ramsar-sites-2026-quiz-02",
    "subtopicId": "ramsar-sites",
    "orderInQuiz": 2,
    "question": "Which iconic lake located at the foothills of the Shivaliks was designated as India's 102nd Ramsar site, becoming the first-ever Ramsar wetland in its Union Territory?",
    "options": [
      "Sukhna Wetland, Chandigarh",
      "Badkhal Lake, Haryana",
      "Wular Lake, Jammu & Kashmir",
      "Chandertal Wetland, Himachal Pradesh"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Sukhna Wetland in Chandigarh was designated as India's 102nd Ramsar site in October 2026, marking the first Ramsar site in the Union Territory of Chandigarh. Created in 1958 by Le Corbusier, it is a vital refuge for migratory waterfowl along the Central Asian Flyway.",
    "source": "MoEFCC Gazette Notification & Ramsar Sites Information Service",
    "sourceUrl": "https://rsis.ramsar.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-ram-26-q02-03",
    "topicId": "ramsar-sites-2026",
    "quizId": "ramsar-sites-2026-quiz-02",
    "subtopicId": "ramsar-sites",
    "orderInQuiz": 3,
    "question": "Sauj Jheel, designated as India's 103rd Ramsar site in October 2026, is an important seasonal freshwater wetland and key habitat for Sarus Cranes in which district of Uttar Pradesh?",
    "options": [
      "Mainpuri District",
      "Unnao District",
      "Etawah District",
      "Gonda District"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Sauj Jheel in Mainpuri district, Uttar Pradesh was designated as the 103rd Ramsar site of India. It serves as a vital wintering and breeding ground for the vulnerable Sarus Crane (Grus antigone) and numerous migratory waterbird populations.",
    "source": "MoEFCC Press Release & Uttar Pradesh State Wetland Authority",
    "sourceUrl": "https://moef.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-ram-26-q02-04",
    "topicId": "ramsar-sites-2026",
    "quizId": "ramsar-sites-2026-quiz-02",
    "subtopicId": "ramsar-sites",
    "orderInQuiz": 4,
    "question": "Glaw Lake, which became India's 101st Ramsar site in August 2026, represents the maiden Ramsar designation for which Indian state?",
    "options": [
      "Arunachal Pradesh",
      "Sikkim",
      "Nagaland",
      "Meghalaya"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Glaw Lake, nestled inside Kamlang Wildlife Sanctuary in Lohit/Anjaw district of Arunachal Pradesh, was designated as India's 101st Ramsar site in August 2026, becoming the first-ever Ramsar wetland site for Arunachal Pradesh.",
    "source": "Ramsar Convention on Wetlands & Arunachal Pradesh Forest Department",
    "sourceUrl": "https://www.ramsar.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-ram-26-q02-05",
    "topicId": "ramsar-sites-2026",
    "quizId": "ramsar-sites-2026-quiz-02",
    "subtopicId": "ramsar-sites",
    "orderInQuiz": 5,
    "question": "As of late 2026, which Indian state holds the distinction of having the highest number of Ramsar Sites in the country with 18 designated wetlands?",
    "options": [
      "Tamil Nadu",
      "Uttar Pradesh",
      "Kerala",
      "Odisha"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Tamil Nadu holds the highest number of Ramsar sites in India with 18 sites (including Point Calimere, Gulf of Mannar, Vedanthangal, Pichavaram, Karaivetti, Longwood Shola), followed closely by Uttar Pradesh with 17 sites.",
    "source": "Ministry of Environment, Forest and Climate Change (MoEFCC)",
    "sourceUrl": "https://moef.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-ram-26-q02-06",
    "topicId": "ramsar-sites-2026",
    "quizId": "ramsar-sites-2026-quiz-02",
    "subtopicId": "ramsar-sites",
    "orderInQuiz": 6,
    "question": "Which is the largest Ramsar site in India by surface area, covering approximately 4,230 square kilometers?",
    "options": [
      "Sundarban Wetland (West Bengal)",
      "Vembanad-Kol Wetland (Kerala)",
      "Chilika Lake (Odisha)",
      "Kolleru Lake (Andhra Pradesh)"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Sundarban Wetland in West Bengal, designated in 2019, is the largest Ramsar site in India, spanning over 4,230 square kilometers of coastal mangrove forests, tidal waterways, and critical habitat for the Bengal tiger and estuarine crocodile.",
    "source": "Ramsar Sites Information Service (RSIS)",
    "sourceUrl": "https://rsis.ramsar.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-ram-26-q02-07",
    "topicId": "ramsar-sites-2026",
    "quizId": "ramsar-sites-2026-quiz-02",
    "subtopicId": "ramsar-sites",
    "orderInQuiz": 7,
    "question": "Which is the smallest Ramsar site in India by surface area, covering just about 20 hectares (0.2 square kilometers)?",
    "options": [
      "Renuka Wetland (Himachal Pradesh)",
      "Vembannur Wetland (Tamil Nadu)",
      "Asan Barrage (Uttarakhand)",
      "Nangal Wildlife Sanctuary (Punjab)"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Renuka Wetland in Sirmaur district of Himachal Pradesh is the smallest Ramsar site in India, with an area of about 20 hectares (0.2 sq km). It is a freshwater spring-fed lake with religious and ecological significance.",
    "source": "Ramsar Sites Information Service (RSIS)",
    "sourceUrl": "https://rsis.ramsar.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-ram-26-q02-08",
    "topicId": "ramsar-sites-2026",
    "quizId": "ramsar-sites-2026-quiz-02",
    "subtopicId": "ramsar-sites",
    "orderInQuiz": 8,
    "question": "Which two wetlands were designated as India's very first Ramsar Sites in October 1981 upon India's accession to the Ramsar Convention?",
    "options": [
      "Chilika Lake (Odisha) and Keoladeo National Park (Rajasthan)",
      "Wular Lake (J&K) and Harike Lake (Punjab)",
      "Loktak Lake (Manipur) and Sambhar Lake (Rajasthan)",
      "Vembanad Lake (Kerala) and Kolleru Lake (Andhra Pradesh)"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Chilika Lake in Odisha and Keoladeo National Park in Rajasthan were designated as India's first two Ramsar sites on 1 October 1981, marking India's formal accession to the Ramsar Convention on Wetlands.",
    "source": "Ramsar Convention Directory of Wetlands of International Importance",
    "sourceUrl": "https://www.ramsar.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-ram-26-q02-09",
    "topicId": "ramsar-sites-2026",
    "quizId": "ramsar-sites-2026-quiz-02",
    "subtopicId": "ramsar-sites",
    "orderInQuiz": 9,
    "question": "Which two Indian wetlands currently remain listed on the Ramsar Montreux Record (a register of wetland sites where ecological character changes have occurred or are likely)?",
    "options": [
      "Keoladeo National Park (Rajasthan) and Loktak Lake (Manipur)",
      "Chilika Lake (Odisha) and Wular Lake (J&K)",
      "Sambhar Lake (Rajasthan) and Deepor Beel (Assam)",
      "Sundarban (West Bengal) and Kolleru Lake (Andhra Pradesh)"
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "explanation": "India has two sites currently on the Montreux Record: Keoladeo National Park (placed in 1990 due to water shortage) and Loktak Lake (placed in 1993 due to siltation and phumdi degradation). Chilika Lake was removed from the Montreux Record in 2002 after successful ecological restoration.",
    "source": "The Montreux Record, Ramsar Convention Secretariat",
    "sourceUrl": "https://www.ramsar.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-ram-26-q02-10",
    "topicId": "ramsar-sites-2026",
    "quizId": "ramsar-sites-2026-quiz-02",
    "subtopicId": "ramsar-sites",
    "orderInQuiz": 10,
    "question": "Which two high-altitude trans-Himalayan wetland sites in the Union Territory of Ladakh are recognized as Ramsar sites and critical breeding grounds for Black-necked Cranes?",
    "options": [
      "Tso Moriri and Tso Kar Wetland Complex",
      "Pangong Tso and Tso Moriri",
      "Chandra Taal and Suraj Taal",
      "Sheshnag Lake and Mansar Lake"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Tso Moriri (designated in 2002 at 4,595m altitude) and Tso Kar Wetland Complex (designated in 2020 at 4,530m altitude) in the Changthang region of Ladakh are premier high-altitude Ramsar wetlands and primary breeding sites for the vulnerable Black-necked Crane and Bar-headed Goose.",
    "source": "Ramsar Sites Information Service & Wildlife Protection Department, Ladakh",
    "sourceUrl": "https://rsis.ramsar.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-ram-26-q02-11",
    "topicId": "ramsar-sites-2026",
    "quizId": "ramsar-sites-2026-quiz-02",
    "subtopicId": "ramsar-sites",
    "orderInQuiz": 11,
    "question": "Lonar Lake in Buldhana district of Maharashtra, designated as a Ramsar site in 2020, is globally unique for which geological origin?",
    "options": [
      "A saline, endorheic meteorite impact crater lake formed in basalt rock",
      "A glacial cirque lake formed by Pleistocene glaciation",
      "A coastal lagoon created by tectonic downwarping",
      "An artificial reservoir built by the Rashtrakuta Dynasty"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Lonar Lake is an internationally renowned geo-heritage site and Ramsar wetland formed approximately 50,000 years ago by a high-velocity meteorite impact in Deccan basalt rock, creating a saline and highly alkaline endorheic lake with specialized microbial extremophiles.",
    "source": "Geological Survey of India & Ramsar Convention Secretariat",
    "sourceUrl": "https://www.ramsar.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-ram-26-q02-12",
    "topicId": "ramsar-sites-2026",
    "quizId": "ramsar-sites-2026-quiz-02",
    "subtopicId": "ramsar-sites",
    "orderInQuiz": 12,
    "question": "Which permanent freshwater lake on the southern outskirts of Guwahati, formed in a former channel of the Brahmaputra River, is the sole Ramsar wetland site in Assam?",
    "options": [
      "Deepor Beel",
      "Chandubi Lake",
      "Haflong Lake",
      "Son Beel"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Deepor Beel, designated as a Ramsar site in November 2002, is a permanent freshwater lake and oxbow wetland in a former channel of the Brahmaputra River southwest of Guwahati city, famous for staging thousands of migratory waterfowl and Asian elephants.",
    "source": "Assam State Biodiversity Board & Ramsar Sites Information Service",
    "sourceUrl": "https://rsis.ramsar.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-une-whs-q02-01",
    "topicId": "unesco-2026",
    "quizId": "unesco-2026-quiz-02",
    "subtopicId": "world-heritage-sites",
    "orderInQuiz": 1,
    "question": "On 25 July 2026, which historic sacred Buddhist landscape in Uttar Pradesh was officially inscribed as India's 45th UNESCO World Heritage Site under cultural criteria?",
    "options": [
      "Sarnath (Ancient Buddhist Sites & Monasteries)",
      "Kushinagar (Parinirvana Complex)",
      "Kapilavastu (Ancient Shakyas City)",
      "Piprahwa Stupa Complex"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Sarnath in Uttar Pradesh was officially inscribed on 25 July 2026 as India's 45th UNESCO World Heritage Site, bringing India's total World Heritage properties to 45. It represents the Deer Park (Isipatana) where Gautama Buddha delivered his first sermon (Dhammacakkappavattana Sutta), featuring the monumental Dhamek Stupa and Ashoka Pillar.",
    "source": "UNESCO World Heritage Centre & Archaeological Survey of India (ASI)",
    "sourceUrl": "https://whc.unesco.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-une-whs-q02-02",
    "topicId": "unesco-2026",
    "quizId": "unesco-2026-quiz-02",
    "subtopicId": "world-heritage-sites",
    "orderInQuiz": 2,
    "question": "What is the exact official category breakdown of India's 45 UNESCO World Heritage Sites following the 2026 Sarnath inscription?",
    "options": [
      "36 Cultural, 8 Natural, 1 Mixed",
      "35 Cultural, 9 Natural, 1 Mixed",
      "37 Cultural, 7 Natural, 1 Mixed",
      "34 Cultural, 10 Natural, 1 Mixed"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "With 45 inscribed properties, India's official UNESCO World Heritage portfolio consists of 36 Cultural sites, 8 Natural sites, and 1 Mixed site (Khangchendzonga National Park). India ranks 6th in the world for most World Heritage properties.",
    "source": "UNESCO World Heritage Centre List (India Portfolio)",
    "sourceUrl": "https://whc.unesco.org/en/statesparties/in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-une-whs-q02-03",
    "topicId": "unesco-2026",
    "quizId": "unesco-2026-quiz-02",
    "subtopicId": "world-heritage-sites",
    "orderInQuiz": 3,
    "question": "Which serial nomination comprising 12 strategic hill, coastal, and island forts representing the military genius of Chhatrapati Shivaji Maharaj was recognized as India's 44th World Heritage Site?",
    "options": [
      "Maratha Military Landscapes of India",
      "Hill Forts of Maharashtra",
      "Western Ghats Bastions of Shivaji",
      "Deccan Sultanate Fortifications"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "The \"Maratha Military Landscapes of India\" comprises 12 forts (11 in Maharashtra: Shivneri, Raigad, Torna, Rajgad, Pratapgad, Suvarnadurg, Panhala, Vijaydurg, Sindhudurg, Lohagad, Alibag; and Gingee in Tamil Nadu) exhibiting 17th-century guerrilla warfare strategy and naval defence.",
    "source": "UNESCO World Heritage Centre & Ministry of Culture",
    "sourceUrl": "https://whc.unesco.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-une-whs-q02-04",
    "topicId": "unesco-2026",
    "quizId": "unesco-2026-quiz-02",
    "subtopicId": "world-heritage-sites",
    "orderInQuiz": 4,
    "question": "Inscribed in 2024 at the 46th Session in New Delhi, the \"Moidams\" of the Ahom Dynasty in Charaideo, Assam represent which cultural heritage archetype?",
    "options": [
      "Mound-burial system of Ahom royalty and aristocracy",
      "Monolithic rock-cut temples dedicated to Lord Shiva",
      "Stepped subterranean royal bathing stepwells",
      "Ancient megalithic dolmens and cist burials"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "The Moidams are vaulted earth-and-brick mound-burial tumuli of the Tai-Ahom kings and queens in Charaideo, Assam. Spanning 600 years, they represent a unique pyramidal burial landscape and the first cultural World Heritage Site from Northeast India.",
    "source": "UNESCO 46th World Heritage Committee Decision (New Delhi Session)",
    "sourceUrl": "https://whc.unesco.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-une-whs-q02-05",
    "topicId": "unesco-2026",
    "quizId": "unesco-2026-quiz-02",
    "subtopicId": "world-heritage-sites",
    "orderInQuiz": 5,
    "question": "Which national park in Sikkim remains India's solitary \"Mixed\" (Cultural and Natural) UNESCO World Heritage Site, inscribed in 2016?",
    "options": [
      "Khangchendzonga National Park",
      "Manas National Park",
      "Nanda Devi National Park",
      "Great Himalayan National Park"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Khangchendzonga National Park in Sikkim is India's only Mixed World Heritage Site, recognized under both natural criteria (Mount Khangchendzonga, glaciers, alpine biodiversity) and cultural criteria (Tibetan Buddhist sacred landscape of Beyul / Denzong).",
    "source": "UNESCO World Heritage Centre Listing",
    "sourceUrl": "https://whc.unesco.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-une-whs-q02-06",
    "topicId": "unesco-2026",
    "quizId": "unesco-2026-quiz-02",
    "subtopicId": "world-heritage-sites",
    "orderInQuiz": 6,
    "question": "In 1983, India had its first properties inscribed on the UNESCO World Heritage List. Which four sites formed this historic inaugural group?",
    "options": [
      "Ajanta Caves, Ellora Caves, Agra Fort, and Taj Mahal",
      "Sun Temple Konark, Mahabalipuram, Kaziranga, and Manas",
      "Qutb Minar, Humayun's Tomb, Fatehpur Sikri, and Khajuraho",
      "Elephanta Caves, Hampi, Sanchi, and Pattadakal"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "The inaugural 1983 inscriptions for India were Ajanta Caves (Maharashtra), Ellora Caves (Maharashtra), Agra Fort (Uttar Pradesh), and the Taj Mahal (Uttar Pradesh).",
    "source": "Archaeological Survey of India (ASI) & UNESCO WHC",
    "sourceUrl": "https://asi.nic.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-une-whs-q02-07",
    "topicId": "unesco-2026",
    "quizId": "unesco-2026-quiz-02",
    "subtopicId": "world-heritage-sites",
    "orderInQuiz": 7,
    "question": "Dholavira: a Harappan City, inscribed as a World Heritage Site in 2021, is located on Khadir Bet island in the Great Rann of Kutch (Gujarat). What is its most outstanding engineering feature?",
    "options": [
      "A monumental cascading rainwater harvesting and reservoir system",
      "The world's earliest copper smelting blast furnace",
      "A massive subterranean Buddhist vihara complex",
      "A stone amphitheatre with acoustics for theatrical performances"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Dholavira flourished between 3000 BCE and 1500 BCE and is distinguished by its sophisticated stone water management system, comprising 16 interconnected cascading rock-cut reservoirs, check dams, and stormwater drainage channels engineered to survive desert aridity.",
    "source": "Archaeological Survey of India & UNESCO World Heritage Centre",
    "sourceUrl": "https://whc.unesco.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-une-whs-q02-08",
    "topicId": "unesco-2026",
    "quizId": "unesco-2026-quiz-02",
    "subtopicId": "world-heritage-sites",
    "orderInQuiz": 8,
    "question": "Kakatiya Rudreshwara (Ramappa) Temple in Palampet, Telangana, inscribed on the UNESCO list in 2021, was celebrated for which distinctive technological innovation?",
    "options": [
      "Floating bricks (sponge bricks) and sandbox foundation technology",
      "Interlocking iron clamps without any lime mortar",
      "Pure marble pillars carved with musical tones",
      "Corbelled granite domes balanced on a single central pivot"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "The 13th-century Ramappa Temple, built under Kakatiya ruler Recharla Rudra, features ultra-lightweight \"floating porous bricks\" that reduce weight on the roof, constructed over a seismic-resistant \"sandbox foundation\" that absorbs earthquake tremors.",
    "source": "UNESCO World Heritage Committee Inscription Dossier",
    "sourceUrl": "https://whc.unesco.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-une-whs-q02-09",
    "topicId": "unesco-2026",
    "quizId": "unesco-2026-quiz-02",
    "subtopicId": "world-heritage-sites",
    "orderInQuiz": 9,
    "question": "Inscribed in 2023, which university town and ashram founded by Rabindranath Tagore in Birbhum district of West Bengal is celebrated for its open-air education and international humanism?",
    "options": [
      "Santiniketan",
      "Nalanda Mahavihara",
      "Vikramashila",
      "Sabarmati"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Santiniketan, established by Maharshi Debendranath Tagore in 1863 and transformed by Nobel laureate Rabindranath Tagore into Visva-Bharati University in 1921, was inscribed in 2023 as an architectural and philosophical embodiment of pan-Asian internationalism and nature-based education.",
    "source": "UNESCO World Heritage Centre Listing",
    "sourceUrl": "https://whc.unesco.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-une-whs-q02-10",
    "topicId": "unesco-2026",
    "quizId": "unesco-2026-quiz-02",
    "subtopicId": "world-heritage-sites",
    "orderInQuiz": 10,
    "question": "The \"Sacred Ensembles of the Hoysalas\", inscribed as India's 42nd World Heritage property in 2023, comprises 12th–13th century stellate (star-shaped) temples in which three Karnataka locations?",
    "options": [
      "Belur, Halebidu, and Somanathapura",
      "Hampi, Badami, and Pattadakal",
      "Aihole, Banavasi, and Talakadu",
      "Sringeri, Moodabidri, and Karkala"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "The Sacred Ensembles of the Hoysalas comprises the Chennakeshava Temple at Belur, the Hoysaleswara Temple at Halebidu, and the Keshava Temple at Somanathapura in Karnataka, famous for their soapstone (chloritic schist) intricate friezes and star-shaped ground plans.",
    "source": "Archaeological Survey of India & UNESCO WHC",
    "sourceUrl": "https://whc.unesco.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-une-whs-q02-11",
    "topicId": "unesco-2026",
    "quizId": "unesco-2026-quiz-02",
    "subtopicId": "world-heritage-sites",
    "orderInQuiz": 11,
    "question": "Which of the following is NOT one of India's 8 officially inscribed Natural World Heritage Sites?",
    "options": [
      "Kaziranga National Park (Assam)",
      "Sundarbans National Park (West Bengal)",
      "Western Ghats (Serial nomination)",
      "Gir National Park (Gujarat)"
    ],
    "correctAnswer": 3,
    "difficulty": "medium",
    "explanation": "Gir National Park in Gujarat is not a UNESCO World Heritage Site. India's 8 Natural World Heritage Sites are: Kaziranga, Manas, Keoladeo, Sundarbans, Nanda Devi & Valley of Flowers, Western Ghats, and Great Himalayan National Park Conservation Area.",
    "source": "UNESCO World Heritage Centre Natural Properties Directory",
    "sourceUrl": "https://whc.unesco.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-une-whs-q02-12",
    "topicId": "unesco-2026",
    "quizId": "unesco-2026-quiz-02",
    "subtopicId": "world-heritage-sites",
    "orderInQuiz": 12,
    "question": "The Sun Temple at Konark (Odisha), inscribed on the UNESCO list in 1984, was constructed in the 13th century by which ruler of the Eastern Ganga Dynasty?",
    "options": [
      "King Narasimhadeva I",
      "King Anantavarman Chodaganga",
      "King Kapilendra Deva",
      "King Prataparudra Deva"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "The Sun Temple at Konark was built around 1250 CE by King Narasimhadeva I of the Eastern Ganga Dynasty. Conceived as a grand 24-wheeled chariot of Surya drawn by 7 horses, it represents the pinnacle of Kalinga stone architecture.",
    "source": "Archaeological Survey of India & UNESCO WHC",
    "sourceUrl": "https://asi.nic.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-unt-26-q02-01",
    "topicId": "unesco-tentative-2026",
    "quizId": "unesco-tentative-2026-quiz-02",
    "subtopicId": "tentative-sites",
    "orderInQuiz": 1,
    "question": "Which island in the Andaman and Nicobar archipelago was added to India's UNESCO Tentative List for its exceptional Karst-mud-volcano complex and limestone caves?",
    "options": [
      "Baratang Island",
      "Havelock Island (Swaraj Dweep)",
      "Neil Island (Shaheed Dweep)",
      "Little Andaman Island"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "The Karst-mud-volcano Complex of Baratang Island in the Andaman & Nicobar Islands is on India's UNESCO Tentative List. It exhibits active mud volcano degassing vents, subaerial karst limestone cave formations, and coastal mangrove waterways.",
    "source": "UNESCO Tentative Lists Database (India)",
    "sourceUrl": "https://whc.unesco.org/en/tentativelists/state=in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-une-whs-q02-02-volc",
    "topicId": "unesco-tentative-2026",
    "quizId": "unesco-tentative-2026-quiz-02",
    "subtopicId": "tentative-sites",
    "orderInQuiz": 2,
    "question": "The \"Andaman Subduction Volcanoes\" on the UNESCO Tentative List consists of Barren Island and which dormant volcanic island that is also the sole habitat of an endangered endemic hornbill?",
    "options": [
      "Narcondam Island",
      "Viper Island",
      "North Sentinel Island",
      "Rutland Island"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "The serial nomination includes Barren Island (India's only active volcano) and Narcondam Island (a dormant volcanic island formed by subduction of the Indo-Australian plate, sole home to the endemic Narcondam hornbill Rhyticeros narcondami).",
    "source": "UNESCO Tentative Lists Database (India) & Geological Survey of India",
    "sourceUrl": "https://whc.unesco.org/en/tentativelists/state=in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-unt-26-q02-03",
    "topicId": "unesco-tentative-2026",
    "quizId": "unesco-tentative-2026-quiz-02",
    "subtopicId": "tentative-sites",
    "orderInQuiz": 3,
    "question": "The Sirpur Cultural and Archaeological Landscape, included on India's UNESCO Tentative List, is an ancient capital of the Sarabhapuriya and Somavamshi dynasties along which river in Chhattisgarh?",
    "options": [
      "Mahanadi River",
      "Shivnath River",
      "Indravati River",
      "Hasdeo River"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Sirpur (ancient Shripura) in Mahasamund district of Chhattisgarh lies along the Mahanadi River. It flourished between the 5th and 12th centuries as a major Buddhist, Shaiva, and Vaishnava centre, featuring the 7th-century brick Lakshmana Temple and Teevardev Mahavihar.",
    "source": "Archaeological Survey of India & UNESCO Tentative Lists Database",
    "sourceUrl": "https://whc.unesco.org/en/tentativelists/state=in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-unt-26-q02-04",
    "topicId": "unesco-tentative-2026",
    "quizId": "unesco-tentative-2026-quiz-02",
    "subtopicId": "tentative-sites",
    "orderInQuiz": 4,
    "question": "The serial nomination \"The Sites of Satyagraha, India's Non-violent Freedom Movement\" on the UNESCO Tentative List commemorates Mahatma Gandhi's ashrams and campaign landmarks. Which of the following sites is NOT in Gujarat?",
    "options": [
      "Sevagram Ashram (Wardha)",
      "Sabarmati Ashram (Ahmedabad)",
      "Kochrab Ashram (Ahmedabad)",
      "Dandi Memorial (Navsari)"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Sevagram Ashram is located near Wardha in Maharashtra, where Mahatma Gandhi resided from 1936 until his death in 1948. Sabarmati, Kochrab, and Dandi are situated in Gujarat.",
    "source": "UNESCO Tentative Lists Database (India)",
    "sourceUrl": "https://whc.unesco.org/en/tentativelists/state=in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-unt-26-q02-05",
    "topicId": "unesco-tentative-2026",
    "quizId": "unesco-tentative-2026-quiz-02",
    "subtopicId": "tentative-sites",
    "orderInQuiz": 5,
    "question": "The rock-cut Bagh Cave paintings, included on India's UNESCO Tentative List, are situated on the banks of the Baghani river in which district of Madhya Pradesh?",
    "options": [
      "Dhar District",
      "Vidisha District",
      "Sehore District",
      "Raisen District"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Bagh Caves comprise nine rock-cut Buddhist sanctuaries in Dhar district of Madhya Pradesh, renowned for their 5th–6th century CE classical murals and tempera wall paintings executed in the same Gupta-period aesthetic tradition as Ajanta.",
    "source": "Archaeological Survey of India & UNESCO Tentative Lists Database",
    "sourceUrl": "https://whc.unesco.org/en/tentativelists/state=in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-unt-26-q02-06",
    "topicId": "unesco-tentative-2026",
    "quizId": "unesco-tentative-2026-quiz-02",
    "subtopicId": "tentative-sites",
    "orderInQuiz": 6,
    "question": "Ginnorgarh Fort on the UNESCO Tentative List, situated in the Vindhyan hills near Sehore in Madhya Pradesh, was the historic stronghold of which legendary 18th-century Gond queen?",
    "options": [
      "Rani Kamlapati",
      "Rani Durgavati",
      "Rani Chennamma",
      "Rani Tarabai"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Ginnorgarh Fort in Sehore district of Madhya Pradesh is a medieval hill fortress surrounded by deep ravines. It served as the capital of the Gond kingdom under King Nizam Shah and his consort Rani Kamlapati.",
    "source": "Madhya Pradesh Tourism Board & UNESCO Tentative List",
    "sourceUrl": "https://whc.unesco.org/en/tentativelists/state=in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-unt-26-q02-07",
    "topicId": "unesco-tentative-2026",
    "quizId": "unesco-tentative-2026-quiz-02",
    "subtopicId": "tentative-sites",
    "orderInQuiz": 7,
    "question": "The \"Chambal Valley Temple Group\" on the UNESCO Tentative List includes the spectacular restored cluster of over 200 Gurjara-Pratihara temples at which site in Morena district, Madhya Pradesh?",
    "options": [
      "Bateshwar Temple Complex",
      "Chausath Yogini Temple, Khajuraho",
      "Kandariya Mahadeva Temple",
      "Telika Mandir, Gwalior"
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "explanation": "The Bateshwar Temple complex near Morena in the Chambal valley comprises over 200 sandstone temples built between the 8th and 10th centuries by the Gurjara-Pratihara dynasty, painstakingly reconstructed by archaeologist K.K. Muhammed of the ASI.",
    "source": "Archaeological Survey of India & UNESCO Tentative Lists Database",
    "sourceUrl": "https://whc.unesco.org/en/tentativelists/state=in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-unt-26-q02-08",
    "topicId": "unesco-tentative-2026",
    "quizId": "unesco-tentative-2026-quiz-02",
    "subtopicId": "tentative-sites",
    "orderInQuiz": 8,
    "question": "The Udaigiri Caves near Vidisha (Madhya Pradesh), nominated on the UNESCO Tentative List, feature Cave 5 with which monumental Gupta-period high-relief rock sculpture?",
    "options": [
      "Colossal Varaha Avatar rescuing Prithvi (Earth Goddess)",
      "Anantasayana Vishnu reclining on Sheshanaga",
      "Trimurti Sadashiva sculpture",
      "Mahishasuramardini panel"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Cave 5 at Udaigiri features the iconic 5th-century Gupta-era colossal rock sculpture of Varaha (the boar incarnation of Lord Vishnu) lifting the Earth Goddess Bhudevi from the cosmic waters, symbolizing royal protection and restoration of cosmic order under Chandragupta II.",
    "source": "Archaeological Survey of India & UNESCO Tentative Lists Database",
    "sourceUrl": "https://whc.unesco.org/en/tentativelists/state=in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-unt-26-q02-09",
    "topicId": "unesco-tentative-2026",
    "quizId": "unesco-tentative-2026-quiz-02",
    "subtopicId": "tentative-sites",
    "orderInQuiz": 9,
    "question": "The \"Rangpur-Sivasagar Historic Ensemble\" on the UNESCO Tentative List showcases the architectural legacy of the Ahom dynasty in Assam. Which building served as Asia's earliest surviving royal amphitheatre?",
    "options": [
      "Rang Ghar",
      "Talatal Ghar",
      "Kareng Ghar",
      "Gargaon Palace"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Rang Ghar (\"House of Entertainment\") in Sivasagar, Assam is a two-storeyed oval brick pavilion built by Ahom King Pramatta Singha in 1744. It is widely considered one of the earliest surviving outdoor amphitheatres in Asia, used by royalty to view buffalo fights and Bihu dances.",
    "source": "UNESCO Tentative Lists Database & ASI Guwahati Circle",
    "sourceUrl": "https://whc.unesco.org/en/tentativelists/state=in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-unt-26-q02-10",
    "topicId": "unesco-tentative-2026",
    "quizId": "unesco-tentative-2026-quiz-02",
    "subtopicId": "tentative-sites",
    "orderInQuiz": 10,
    "question": "Which semi-arid region in northern Rajasthan is nominated on the UNESCO Tentative List as \"The Painted Haveli Towns\", famed for thousands of 18th-to-20th-century frescoed merchant mansions?",
    "options": [
      "Shekhawati (Mandawa, Nawalgarh, Fatehpur, Ramgarh)",
      "Marwar (Jodhpur, Nagaur, Pali)",
      "Mewar (Udaipur, Chittorgarh, Rajsamand)",
      "Hadoti (Kota, Bundi, Jhalawar)"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Shekhawati comprising towns in Jhunjhunu, Sikar, and Churu districts (Mandawa, Nawalgarh, Fatehpur, Ramgarh) is renowned as the world's largest \"open-air art gallery\", featuring thousands of ornate havelis covered in vibrant narrative frescoes depicting mythological, social, and British colonial themes.",
    "source": "Department of Tourism, Government of Rajasthan & UNESCO Tentative List",
    "sourceUrl": "https://whc.unesco.org/en/tentativelists/state=in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-unt-26-q02-11",
    "topicId": "unesco-tentative-2026",
    "quizId": "unesco-tentative-2026-quiz-02",
    "subtopicId": "tentative-sites",
    "orderInQuiz": 11,
    "question": "The UNESCO Tentative List proposal \"Nicobarese Cultural Continuity\" honors the living indigenous architecture and heritage of the Nicobarese. What is the traditional circular dome-shaped wooden house on stilts called?",
    "options": [
      "Pati (Tuhet / Hupat)",
      "Morung",
      "Iglu",
      "Namghar"
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "explanation": "The traditional stilted circular beehive house of the Nicobarese tribe is called a Pati or Tuhet. Raised on wooden pilings 2–3 meters above ground to protect against tides and pests, it demonstrates centuries of indigenous architectural adaptation to maritime and seismic conditions.",
    "source": "Anthropological Survey of India & UNESCO Tentative Lists Database",
    "sourceUrl": "https://whc.unesco.org/en/tentativelists/state=in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-unt-26-q02-12",
    "topicId": "unesco-tentative-2026",
    "quizId": "unesco-tentative-2026-quiz-02",
    "subtopicId": "tentative-sites",
    "orderInQuiz": 12,
    "question": "The \"Colonial Penal Settlement of Andaman Islands\" on the UNESCO Tentative List includes which iconic three-storeyed panopticon brick prison where Indian freedom fighters were sentenced to \"Kala Pani\"?",
    "options": [
      "Cellular Jail, Port Blair",
      "Alipore Central Jail, Kolkata",
      "Yerawada Central Jail, Pune",
      "Hijli Detention Camp, Kharagpur"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Cellular Jail in Port Blair, constructed between 1896 and 1906, was a seven-winged panopticon fortress designed for solitary confinement where thousands of Indian independence activists and revolutionaries were exiled under brutal conditions.",
    "source": "Archaeological Survey of India & UNESCO Tentative Lists Database",
    "sourceUrl": "https://whc.unesco.org/en/tentativelists/state=in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-dan-flk-q02-01",
    "topicId": "dance-forms",
    "quizId": "dance-forms-quiz-02",
    "subtopicId": "folk-dances",
    "orderInQuiz": 1,
    "question": "Which energetic spring harvest festival dance of Assam is performed by young men and women in traditional Muga silk attire, accompanied by the Pepa (buffalo horn flute) and Dhol?",
    "options": [
      "Bihu Dance",
      "Bagurumba Dance",
      "Jhumur Dance",
      "Bhortal Dance"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Bihu is the quintessential folk dance of Assam, celebrated during Rongali (Bohag) Bihu to mark the Assamese New Year and sowing season. It is characterized by brisk steps, rapid hand movements, and swaying of the hips accompanied by the dhol and pepa.",
    "source": "Sangeet Natak Akademi, Ministry of Culture",
    "sourceUrl": "https://sangeetnatak.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-dan-flk-q02-02",
    "topicId": "dance-forms",
    "quizId": "dance-forms-quiz-02",
    "subtopicId": "folk-dances",
    "orderInQuiz": 2,
    "question": "Which martial and folk dance tradition of Eastern India (inscribed on UNESCO's Representative List of Intangible Cultural Heritage) is practiced in three distinct regional sub-styles: Purulia, Seraikella, and Mayurbhanj?",
    "options": [
      "Chhau Dance",
      "Goti Pua",
      "Paika Dance",
      "Danda Nata"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Chhau is a semi-classical martial dance of Eastern India. Purulia Chhau (West Bengal) and Seraikella Chhau (Jharkhand) utilize elaborate painted masks depicting mythological figures, while Mayurbhanj Chhau (Odisha) is performed without masks.",
    "source": "UNESCO Intangible Cultural Heritage & Sangeet Natak Akademi",
    "sourceUrl": "https://ich.unesco.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-dan-flk-q02-03",
    "topicId": "dance-forms",
    "quizId": "dance-forms-quiz-02",
    "subtopicId": "folk-dances",
    "orderInQuiz": 3,
    "question": "In December 2023, which devotional circular folk dance of Gujarat performed during the nine nights of Navratri was officially inscribed on UNESCO's Representative List of the Intangible Cultural Heritage of Humanity?",
    "options": [
      "Garba",
      "Bhavai",
      "Tippani",
      "Dhamal"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Garba of Gujarat was inscribed on UNESCO's Representative List of the Intangible Cultural Heritage of Humanity in December 2023. Performed in concentric circles around an earthen lantern (Garbha Deep) or image of Goddess Durga, it symbolizes the cyclical nature of time.",
    "source": "UNESCO 18th Session of the Intergovernmental Committee for the Safeguarding of the ICH",
    "sourceUrl": "https://ich.unesco.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-dan-flk-q02-04",
    "topicId": "dance-forms",
    "quizId": "dance-forms-quiz-02",
    "subtopicId": "folk-dances",
    "orderInQuiz": 4,
    "question": "The Kalbelia dance, inscribed on the UNESCO Intangible Cultural Heritage list in 2010, is a sensuous serpent-like folk dance traditionally performed by women of which nomadic community in Rajasthan?",
    "options": [
      "Snake charmers (Sapera community)",
      "Blacksmiths (Gadiya Lohar community)",
      "Pastoralists (Raika community)",
      "Bards (Bhat community)"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Kalbelia is a folk dance performed by women of the Kalbelia snake-charmer community in Rajasthan. Dressed in flowing black embroidered skirts (ghaghra) resembling serpent scales, they swirl to the music of the Pungi (been), dafli, and khanjari.",
    "source": "UNESCO Intangible Cultural Heritage Representative List",
    "sourceUrl": "https://ich.unesco.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-dan-flk-q02-05",
    "topicId": "dance-forms",
    "quizId": "dance-forms-quiz-02",
    "subtopicId": "folk-dances",
    "orderInQuiz": 5,
    "question": "Yakshagana is a traditional theatre-dance form combining stylized dance, Carnatic-raga singing, extempore dialogue, and towering headgear (kedage), native to which southern state?",
    "options": [
      "Karnataka",
      "Tamil Nadu",
      "Andhra Pradesh",
      "Telangana"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Yakshagana is a vibrant folk theatre and dance tradition native to coastal and Malenadu districts of Karnataka (Udupi, Dakshina Kannada, Uttara Kannada). Staged through the night, it dramatizes episodes from the Mahabharata, Ramayana, and Bhagavata Purana.",
    "source": "Sangeet Natak Akademi, New Delhi",
    "sourceUrl": "https://sangeetnatak.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-dan-flk-q02-06",
    "topicId": "dance-forms",
    "quizId": "dance-forms-quiz-02",
    "subtopicId": "folk-dances",
    "orderInQuiz": 6,
    "question": "Which energetic and rhythmically rapid folk dance of Maharashtra, performed to the beats of the Dholki by female dancers wearing a nine-yard Nauvari saree, is an integral element of traditional Tamasha theatre?",
    "options": [
      "Lavani",
      "Koli Dance",
      "Dhangari Gaja",
      "Powada"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Lavani is the quintessential traditional musical folk dance of Maharashtra, originating from the Marathi word \"Lavanya\" (beauty). Performed to the brisk, syncopated rhythms of the dholki in a nine-yard Nauvari saree, it flourished under the Peshwa court in the 18th century.",
    "source": "Directorate of Cultural Affairs, Government of Maharashtra",
    "sourceUrl": "https://sangeetnatak.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-dan-flk-q02-07",
    "topicId": "dance-forms",
    "quizId": "dance-forms-quiz-02",
    "subtopicId": "folk-dances",
    "orderInQuiz": 7,
    "question": "Which traditional celebratory folk dance of Jammu and Kashmir is performed exclusively by women facing each other in linked rows during Eid, Ramzan, and the spring harvest season?",
    "options": [
      "Rouf Dance",
      "Bhand Pather",
      "Kud Dance",
      "Dumhal Dance"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Rouf is a lyrical and graceful women's folk dance of the Kashmir Valley. Women form two parallel facing rows with arms linked across each other's waists and glide forward and backward in unison to melodic Kashmiri folk songs.",
    "source": "Jammu & Kashmir Academy of Art, Culture and Languages",
    "sourceUrl": "https://sangeetnatak.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-dan-flk-q02-08",
    "topicId": "dance-forms",
    "quizId": "dance-forms-quiz-02",
    "subtopicId": "folk-dances",
    "orderInQuiz": 8,
    "question": "Cheraw, commonly known as the \"Bamboo Dance\", is a traditional ritual dance performed during Chapchar Kut festival in which northeastern state of India?",
    "options": [
      "Mizoram",
      "Nagaland",
      "Manipur",
      "Tripura"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Cheraw is an ancient ritual dance of the Mizo people in Mizoram. Male dancers sit on the ground clapping horizontal pairs of long bamboo staves together in rhythmic synchrony while female dancers in colourful traditional Puan attire step in and out between the closing bamboos.",
    "source": "Art and Culture Department, Government of Mizoram",
    "sourceUrl": "https://sangeetnatak.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-dan-flk-q02-09",
    "topicId": "dance-forms",
    "quizId": "dance-forms-quiz-02",
    "subtopicId": "folk-dances",
    "orderInQuiz": 9,
    "question": "Ghoomar is a graceful pirouetting traditional folk dance performed by veiled women in flowing skirts, originally developed by which tribal community in Rajasthan?",
    "options": [
      "Bhil Tribe",
      "Mina Tribe",
      "Garasia Tribe",
      "Sahariya Tribe"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Ghoomar originates from the Bhil tribe of Rajasthan, who originally danced it in reverence to Goddess Saraswati. Later adopted by Rajput royal courts, it became renowned for graceful swirling movements (Ghoomna) displaying the wide flares of the colorful ghaghra.",
    "source": "Sangeet Natak Akademi & Rajasthan Tourism",
    "sourceUrl": "https://sangeetnatak.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-dan-flk-q02-10",
    "topicId": "dance-forms",
    "quizId": "dance-forms-quiz-02",
    "subtopicId": "classical-dances",
    "orderInQuiz": 10,
    "question": "Koodiyattam, a 2,000-year-old Sanskrit temple drama tradition of Kerala proclaimed by UNESCO as a Masterpiece of the Oral and Intangible Heritage of Humanity in 2001, is accompanied by which copper percussion drum?",
    "options": [
      "Mizhavu",
      "Mridangam",
      "Chenda",
      "Tabla"
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "explanation": "Koodiyattam is the world's oldest surviving Sanskrit theatre tradition, staged in traditional temple theatres called Koothambalams in Kerala. It is accompanied primarily by the Mizhavu, a large sacred copper drum played exclusively with the bare palms by members of the Ambalavasi Nambiar community.",
    "source": "UNESCO Proclamation of Masterpieces of Oral & Intangible Heritage (2001)",
    "sourceUrl": "https://ich.unesco.org",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-dan-flk-q02-11",
    "topicId": "dance-forms",
    "quizId": "dance-forms-quiz-02",
    "subtopicId": "folk-dances",
    "orderInQuiz": 11,
    "question": "Thang-Ta is a traditional martial art and dance form native to Manipur, practiced by the Meitei community. What do the words \"Thang\" and \"Ta\" specifically denote?",
    "options": [
      "Sword and Spear",
      "Shield and Bow",
      "Dagger and Staff",
      "Mace and Axe"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Thang-Ta (officially known as Huyen Langlon) is the ancient martial art tradition of Manipur. \"Thang\" means sword and \"Ta\" means spear. It integrates armed combat techniques with devotional rhythmic movements dedicated to Meitei deities.",
    "source": "Sangeet Natak Akademi, New Delhi",
    "sourceUrl": "https://sangeetnatak.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-dan-flk-q02-12",
    "topicId": "dance-forms",
    "quizId": "dance-forms-quiz-02",
    "subtopicId": "classical-dances",
    "orderInQuiz": 12,
    "question": "Gotipua, a traditional dance from Odisha where young boys dress as female dancers and perform complex acrobatic postures (Bandhas) to praise Lord Jagannath, is the direct historical precursor of which classical Indian dance?",
    "options": [
      "Odissi",
      "Kathakali",
      "Manipuri",
      "Sattriya"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Gotipua (\"single boy\") emerged in Odisha during the 16th century when the Devadasi (Mahari) tradition declined. Young boys trained in gymnastic flexibility and Odissi music performed acrobatic bandhas in temple courtyards, laying the foundational repertoire that revived classical Odissi in the 20th century.",
    "source": "Odisha Sangeet Natak Akademi & Guru Kelucharan Mohapatra Odissi Research Centre",
    "sourceUrl": "https://sangeetnatak.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-six-sch-q02-01",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-02",
    "subtopicId": "sixth-schedule-provisions",
    "orderInQuiz": 1,
    "question": "Which two specific Articles of the Constitution of India mandate the administration and financial grants for tribal areas under the Sixth Schedule?",
    "options": [
      "Article 244(2) and Article 275(1)",
      "Article 244(1) and Article 371A",
      "Article 243M and Article 330",
      "Article 356 and Article 360"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Article 244(2) specifies that the provisions of the Sixth Schedule apply to the administration of tribal areas in Assam, Meghalaya, Tripura, and Mizoram. Article 275(1) second proviso mandates grants-in-aid from the Consolidated Fund of India to these Autonomous District Councils for schemes of development.",
    "source": "The Constitution of India, Ministry of Law & Justice",
    "sourceUrl": "https://legislative.gov.in/constitution-of-india",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-six-sch-q02-02",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-02",
    "subtopicId": "sixth-schedule-provisions",
    "orderInQuiz": 2,
    "question": "Under Paragraph 2 of the Sixth Schedule, what is the standard composition and tenure of an Autonomous District Council (ADC)?",
    "options": [
      "Maximum 30 members: 26 elected and 4 nominated by the Governor for a 5-year term",
      "Maximum 40 members: 35 elected and 5 nominated by the Chief Minister for a 6-year term",
      "Maximum 25 members: all elected by adult franchise for a 4-year term",
      "Maximum 20 members: 10 elected and 10 nominated by the District Magistrate"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Under Paragraph 2 of the Sixth Schedule, each Autonomous District Council consists of not more than 30 members, of whom not more than 4 are nominated by the Governor and the rest are elected on the basis of adult suffrage for a 5-year term (with exception for BTC which has 46 members).",
    "source": "The Constitution of India, Sixth Schedule, Paragraph 2",
    "sourceUrl": "https://legislative.gov.in/constitution-of-india",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-six-sch-q02-03",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-02",
    "subtopicId": "sixth-schedule-provisions",
    "orderInQuiz": 3,
    "question": "Under Paragraph 1 of the Sixth Schedule, who possesses the sole constitutional authority to alter boundaries, create new autonomous districts, or redefine autonomous regions?",
    "options": [
      "The Governor of the respective State",
      "The Speaker of the State Legislative Assembly",
      "The Chief Justice of the Gauhati High Court",
      "The Union Minister of Home Affairs"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Under Paragraph 1(3) of the Sixth Schedule, the Governor may by public notification: divide any autonomous district; create a new autonomous district; increase the area of any autonomous district; diminish the area; unite two or more autonomous districts; or define boundaries.",
    "source": "The Constitution of India, Sixth Schedule, Paragraph 1",
    "sourceUrl": "https://legislative.gov.in/constitution-of-india",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-six-sch-q02-04",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-02",
    "subtopicId": "sixth-schedule-provisions",
    "orderInQuiz": 4,
    "question": "Laws enacted by an Autonomous District Council regarding land allotment, unreserved forests, village councils, inheritance, and marriage (under Paragraph 3) require whose assent to have the force of law?",
    "options": [
      "The Governor of the State",
      "The President of India",
      "The Chief Minister of the State",
      "The Supreme Court of India"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Under Paragraph 3(3) of the Sixth Schedule, all laws made by a District or Regional Council shall be submitted forthwith to the Governor and, until assented to by him, shall have no effect.",
    "source": "The Constitution of India, Sixth Schedule, Paragraph 3",
    "sourceUrl": "https://legislative.gov.in/constitution-of-india",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-six-sch-q02-05",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-02",
    "subtopicId": "sixth-schedule-provisions",
    "orderInQuiz": 5,
    "question": "Under Paragraphs 4 and 5 of the Sixth Schedule, what jurisdiction limit is placed on village councils and courts established by an Autonomous District Council?",
    "options": [
      "They can try suits between Scheduled Tribe parties, but cannot try offences punishable with death, transportation for life, or imprisonment exceeding 5 years",
      "They have unlimited jurisdiction over all civil and criminal cases including murder",
      "They can only adjudicate property disputes up to ₹5,000 without criminal powers",
      "They can try only non-tribal residents within the autonomous district"
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "explanation": "Village councils and courts constituted by ADCs are empowered to try suits and cases between parties belonging to Scheduled Tribes according to customary law, but the Governor must specifically confer powers for trial of offences punishable with death, transportation for life, or imprisonment of 5+ years.",
    "source": "The Constitution of India, Sixth Schedule, Paragraphs 4 & 5",
    "sourceUrl": "https://legislative.gov.in/constitution-of-india",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-six-sch-q02-06",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-02",
    "subtopicId": "sixth-schedule-provisions",
    "orderInQuiz": 6,
    "question": "Under Paragraph 8 of the Sixth Schedule, which taxation powers are specifically vested in an Autonomous District Council?",
    "options": [
      "Power to assess and collect land revenue, and levy taxes on lands, buildings, professions, trades, callings, animals, vehicles, and tolls on ferries",
      "Power to levy Goods and Services Tax (GST) and Customs duty",
      "Power to impose Corporation tax and Income tax on tribal residents",
      "No taxation powers are granted; ADCs are strictly funded through direct grants"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Paragraph 8 empowers District Councils to assess and collect land revenue and levy taxes on lands and buildings, professions, trades, callings, animals, vehicles, tolls on bridges/ferries, and entry of goods into market.",
    "source": "The Constitution of India, Sixth Schedule, Paragraph 8",
    "sourceUrl": "https://legislative.gov.in/constitution-of-india",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-six-sch-q02-07",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-02",
    "subtopicId": "sixth-schedule-provisions",
    "orderInQuiz": 7,
    "question": "Under Paragraph 9 of the Sixth Schedule, how are royalties accruing from prospecting licences or mineral leases in an autonomous district shared?",
    "options": [
      "Shared between the State Government and the District Council in an agreed proportion (or as determined by the Governor in case of dispute)",
      "Retained 100% by the Central Government Mineral Fund",
      "Retained 100% by the private mining leaseholder",
      "Paid entirely to the Gram Sabha without state involvement"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Paragraph 9 mandates that the share of royalties accruing each year from licences or leases for prospecting or extracting minerals granted by the State Government in respect of any area within an autonomous district shall be shared between the State and the District Council in an agreed proportion, or as decided by the Governor.",
    "source": "The Constitution of India, Sixth Schedule, Paragraph 9",
    "sourceUrl": "https://legislative.gov.in/constitution-of-india",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-six-sch-q02-08",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-02",
    "subtopicId": "sixth-schedule-provisions",
    "orderInQuiz": 8,
    "question": "How do Acts of Parliament and State Legislatures apply to Autonomous Districts under Paragraph 12/12A/12B of the Sixth Schedule?",
    "options": [
      "They do not apply automatically; the Governor (or President) must issue a notification directing that they apply with specified exceptions or modifications",
      "They apply automatically and override all customary tribal laws without exception",
      "Parliamentary Acts apply automatically, but State Legislature Acts are strictly barred",
      "Only laws approved unanimously by the village council take effect"
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "explanation": "Under Paragraphs 12, 12A, and 12B, Central or State legislative enactments do not automatically apply to autonomous districts if they conflict with tribal customary rights; the Governor (in Assam and Meghalaya) or the President (in Mizoram and Tripura) may notify that an Act shall not apply or shall apply subject to exceptions.",
    "source": "The Constitution of India, Sixth Schedule, Paragraphs 12 & 12A",
    "sourceUrl": "https://legislative.gov.in/constitution-of-india",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-six-sch-q02-09",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-02",
    "subtopicId": "sixth-schedule-provisions",
    "orderInQuiz": 9,
    "question": "How many total Autonomous District Councils (ADCs) are currently active and functioning across the four states under the Sixth Schedule of the Constitution?",
    "options": [
      "6 Councils",
      "8 Councils",
      "10 Councils",
      "14 Councils"
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "explanation": "There are exactly 10 Autonomous District Councils under the Sixth Schedule: 3 in Assam (Bodoland Territorial Council, Karbi Anglong, Dima Hasao); 3 in Meghalaya (Khasi Hills, Garo Hills, Jaintia Hills); 3 in Mizoram (Chakma, Mara, Lai); and 1 in Tripura (Tripura Tribal Areas Autonomous District Council).",
    "source": "Ministry of Home Affairs & National Commission for Scheduled Tribes (NCST)",
    "sourceUrl": "https://mha.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-six-sch-q02-10",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-02",
    "subtopicId": "sixth-schedule-provisions",
    "orderInQuiz": 10,
    "question": "What is the key constitutional distinction between tribal area administration under the Fifth Schedule (Article 244(1)) and the Sixth Schedule (Article 244(2))?",
    "options": [
      "Fifth Schedule areas are governed with advisory Tribes Advisory Councils, whereas Sixth Schedule areas enjoy autonomous statutory legislative, executive, and judicial powers via elected ADCs",
      "Fifth Schedule applies to the North East, whereas Sixth Schedule applies to central Indian states",
      "Fifth Schedule councils can make criminal laws, whereas Sixth Schedule councils are purely consultative",
      "Fifth Schedule members are all appointed by the President without elections"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "The Fifth Schedule applies to tribal areas in 10 states (Andhra, Telangana, MP, Chhattisgarh, Jharkhand, Odisha, Maharashtra, Gujarat, Rajasthan, HP) through advisory Tribes Advisory Councils; the Sixth Schedule provides a far higher degree of autonomy with statutory legislative, executive, and judicial authority to elected ADCs in AMTM states.",
    "source": "The Constitution of India, Articles 244(1) & 244(2)",
    "sourceUrl": "https://legislative.gov.in/constitution-of-india",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-six-sch-q02-11",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-02",
    "subtopicId": "sixth-schedule-provisions",
    "orderInQuiz": 11,
    "question": "The Bodoland Territorial Council (BTC) in Assam was established under Sixth Schedule amendment following the Bodo Accords. Unlike other ADCs (30 members), what is the total membership of the BTC?",
    "options": [
      "30 Members",
      "40 Members",
      "46 Members",
      "50 Members"
    ],
    "correctAnswer": 2,
    "difficulty": "hard",
    "explanation": "Under the amended Paragraph 2(1) applicable to the Bodoland Territorial Area Districts, the Bodoland Territorial Council (BTC) has 46 members: 40 are elected on adult franchise (30 reserved for STs, 5 for non-STs, 5 unreserved) and 6 are nominated by the Governor.",
    "source": "The Sixth Schedule to the Constitution (Amendment) Act & BTC Secretariat",
    "sourceUrl": "https://legislative.gov.in",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  },
  {
    "id": "top-six-sch-q02-12",
    "topicId": "sixth-schedule",
    "quizId": "sixth-schedule-quiz-02",
    "subtopicId": "sixth-schedule-provisions",
    "orderInQuiz": 12,
    "question": "Why is it a constitutional error to categorize or confuse the \"Sixth Schedule\" of the Constitution of India with general taxation legislation?",
    "options": [
      "The Sixth Schedule is strictly an administrative framework for tribal self-governance; general taxation powers reside in the Seventh Schedule and Part XII of the Constitution",
      "The Sixth Schedule was repealed by the 101st Constitutional Amendment Act (GST)",
      "The Sixth Schedule deals solely with international border taxation and customs duty",
      "The Sixth Schedule was struck down by the Supreme Court in the Kesavananda Bharati case"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "The Sixth Schedule (Articles 244(2) and 275(1)) is purely a constitutional governance charter granting autonomy to tribal communities in the North East. General taxation powers and distribution of revenue are governed under the Seventh Schedule lists (Union, State, Concurrent) and Part XII (Finance, Property, Contracts and Suits) of the Constitution.",
    "source": "The Constitution of India, Articles 244(2), 246, Part XII",
    "sourceUrl": "https://legislative.gov.in/constitution-of-india",
    "lastVerifiedDate": "2026-11-24",
    "status": "published",
    "origin": "official-research",
    "sourcePage": 1
  }
];

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
    displayDate: `Quiz ${topicQuiz.order}`,
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
  const newId = `${topicId}-quiz-${String(nextOrder).padStart(2, '0')}`;

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
