import type {
  TopicQuestion,
  QuizQuestion,
  Difficulty,
  StudentMistake,
  SmartRevisionItem,
  StudentBookmark,
  StudentStudyPlan,
  MockExamConfig,
  MockExamState,
  MockExamResult,
  Flashcard,
  QuestionVersionRecord,
  StudentQuestionReport,
  PlatformSettings,
  WeakAreaReport
} from '../types/quiz';
import { getAllTopicQuestions, getTopicsList, getQuizzesForTopic } from '../data/topics.ts';
import { getAllAttempts } from './storage.ts';

const STORAGE_KEYS = {
  MISTAKES: 'spideyy_student_mistakes_v2',
  REVISIONS: 'spideyy_student_revisions_v2',
  BOOKMARKS: 'spideyy_student_bookmarks_v2',
  STUDY_PLANS: 'spideyy_student_study_plans_v2',
  MOCK_EXAMS: 'spideyy_mock_exam_results_v2',
  VERSIONS: 'spideyy_question_versions_v2',
  REPORTS: 'spideyy_question_reports_v2',
  SETTINGS: 'spideyy_platform_settings_v2'
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key}:`, err);
  }
}

// ==============================================================================
// 1. MISTAKE NOTEBOOK
// ==============================================================================

export function getStudentMistakes(studentId: string): StudentMistake[] {
  const all = safeGet<StudentMistake[]>(STORAGE_KEYS.MISTAKES, []);
  return all.filter(m => m.studentId === studentId);
}

export function recordStudentMistake(
  studentId: string,
  params: {
    questionId: string;
    topicId: string;
    quizId: string;
    question: TopicQuestion;
    selectedAnswer?: number;
    correctAnswer: number;
    explanation: string;
    source?: string;
    sourceUrl?: string;
  }
): StudentMistake {
  const all = safeGet<StudentMistake[]>(STORAGE_KEYS.MISTAKES, []);
  const mistakeId = `mistake-${studentId}-${params.questionId}`;
  const existingIdx = all.findIndex(m => m.id === mistakeId);

  const mistake: StudentMistake = {
    id: mistakeId,
    studentId,
    questionId: params.questionId,
    topicId: params.topicId,
    quizId: params.quizId,
    question: params.question,
    selectedAnswer: params.selectedAnswer,
    correctAnswer: params.correctAnswer,
    explanation: params.explanation,
    source: params.source,
    sourceUrl: params.sourceUrl,
    recordedAt: new Date().toISOString(),
    retriedCount: existingIdx >= 0 ? all[existingIdx].retriedCount : 0,
    lastRetriedAt: existingIdx >= 0 ? all[existingIdx].lastRetriedAt : undefined,
    lastRetryResult: existingIdx >= 0 ? all[existingIdx].lastRetryResult : undefined,
    status: 'active',
    notes: existingIdx >= 0 ? all[existingIdx].notes : undefined
  };

  if (existingIdx >= 0) {
    all[existingIdx] = mistake;
  } else {
    all.unshift(mistake);
  }

  safeSet(STORAGE_KEYS.MISTAKES, all);
  // Also automatically schedule for smart revision
  scheduleQuestionForRevision(studentId, params.question, params.question.difficulty);
  return mistake;
}

export function updateStudentMistakeStatus(
  studentId: string,
  questionId: string,
  status: 'active' | 'understood' | 'mastered',
  retryResult?: 'correct' | 'incorrect'
): boolean {
  const all = safeGet<StudentMistake[]>(STORAGE_KEYS.MISTAKES, []);
  const mistakeId = `mistake-${studentId}-${questionId}`;
  const item = all.find(m => m.id === mistakeId);
  if (!item) return false;

  item.status = status;
  if (retryResult) {
    item.retriedCount = (item.retriedCount || 0) + 1;
    item.lastRetriedAt = new Date().toISOString();
    item.lastRetryResult = retryResult;
  }

  safeSet(STORAGE_KEYS.MISTAKES, all);
  return true;
}

export function retryMistakeQuestion(
  studentId: string,
  questionId: string,
  selectedAnswer: number
): { isCorrect: boolean; mistake: StudentMistake | null } {
  const all = safeGet<StudentMistake[]>(STORAGE_KEYS.MISTAKES, []);
  const mistakeId = `mistake-${studentId}-${questionId}`;
  const mistake = all.find(m => m.id === mistakeId);
  if (!mistake) return { isCorrect: false, mistake: null };

  const isCorrect = selectedAnswer === mistake.correctAnswer;
  mistake.retriedCount = (mistake.retriedCount || 0) + 1;
  mistake.lastRetriedAt = new Date().toISOString();
  mistake.lastRetryResult = isCorrect ? 'correct' : 'incorrect';
  if (isCorrect) {
    mistake.status = 'understood';
  }

  safeSet(STORAGE_KEYS.MISTAKES, all);
  return { isCorrect, mistake };
}

// ==============================================================================
// 2. SMART REVISION (SPACED REPETITION SCHEDULER)
// ==============================================================================

const REPETITION_INTERVALS_DAYS = [1, 3, 7, 14, 30]; // Level 0 to Level 4

export function getSmartRevisionList(studentId: string): {
  dueToday: SmartRevisionItem[];
  upcoming: SmartRevisionItem[];
  mastered: SmartRevisionItem[];
  total: number;
} {
  const all = safeGet<SmartRevisionItem[]>(STORAGE_KEYS.REVISIONS, []).filter(r => r.studentId === studentId);
  const todayStr = new Date().toISOString().split('T')[0];

  const dueToday: SmartRevisionItem[] = [];
  const upcoming: SmartRevisionItem[] = [];
  const mastered: SmartRevisionItem[] = [];

  for (const item of all) {
    if (item.status === 'mastered' || item.repetitionLevel >= 5) {
      mastered.push(item);
    } else if (item.nextDueDate <= todayStr) {
      dueToday.push({ ...item, status: 'due' });
    } else {
      upcoming.push(item);
    }
  }

  return {
    dueToday,
    upcoming,
    mastered,
    total: all.length
  };
}

export function scheduleQuestionForRevision(
  studentId: string,
  question: TopicQuestion,
  difficulty?: Difficulty
): SmartRevisionItem {
  const all = safeGet<SmartRevisionItem[]>(STORAGE_KEYS.REVISIONS, []);
  const revId = `rev-${studentId}-${question.id}`;
  const existingIdx = all.findIndex(r => r.id === revId);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextDueDate = tomorrow.toISOString().split('T')[0];

  if (existingIdx >= 0) {
    const existing = all[existingIdx];
    existing.reviewCount += 1;
    existing.status = 'pending';
    existing.nextDueDate = nextDueDate;
    safeSet(STORAGE_KEYS.REVISIONS, all);
    return existing;
  }

  const newItem: SmartRevisionItem = {
    id: revId,
    studentId,
    questionId: question.id,
    topicId: question.topicId,
    quizId: question.quizId || `${question.topicId}-quiz-01`,
    question,
    difficultyRating: difficulty || question.difficulty,
    repetitionLevel: 0,
    intervalDays: 1,
    nextDueDate,
    reviewCount: 0,
    successStreak: 0,
    status: 'pending'
  };

  all.unshift(newItem);
  safeSet(STORAGE_KEYS.REVISIONS, all);
  return newItem;
}

export function recordRevisionReview(
  studentId: string,
  questionId: string,
  wasSuccessful: boolean
): SmartRevisionItem | null {
  const all = safeGet<SmartRevisionItem[]>(STORAGE_KEYS.REVISIONS, []);
  const revId = `rev-${studentId}-${questionId}`;
  const item = all.find(r => r.id === revId);
  if (!item) return null;

  item.reviewCount += 1;
  item.lastReviewedAt = new Date().toISOString();

  if (wasSuccessful) {
    item.successStreak += 1;
    item.repetitionLevel = Math.min(item.repetitionLevel + 1, 5);
    if (item.repetitionLevel >= 5) {
      item.status = 'mastered';
    } else {
      item.status = 'reviewed';
      const days = REPETITION_INTERVALS_DAYS[item.repetitionLevel] || 30;
      item.intervalDays = days;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + days);
      item.nextDueDate = nextDate.toISOString().split('T')[0];
    }
  } else {
    // Reset streak on error, step back to 1-day interval
    item.successStreak = 0;
    item.repetitionLevel = Math.max(item.repetitionLevel - 1, 0);
    item.intervalDays = 1;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    item.nextDueDate = tomorrow.toISOString().split('T')[0];
    item.status = 'pending';
  }

  safeSet(STORAGE_KEYS.REVISIONS, all);
  return item;
}

// ==============================================================================
// 3. BOOKMARKS AND PERSONAL NOTES
// ==============================================================================

export function getStudentBookmarks(studentId: string): StudentBookmark[] {
  const all = safeGet<StudentBookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
  return all.filter(b => b.studentId === studentId);
}

export function toggleStudentBookmark(
  studentId: string,
  question: TopicQuestion,
  note?: string
): boolean {
  const all = safeGet<StudentBookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
  const bmId = `bm-${studentId}-${question.id}`;
  const existingIdx = all.findIndex(b => b.id === bmId);

  if (existingIdx >= 0) {
    all.splice(existingIdx, 1);
    safeSet(STORAGE_KEYS.BOOKMARKS, all);
    return false; // Removed
  }

  const newBm: StudentBookmark = {
    id: bmId,
    studentId,
    questionId: question.id,
    topicId: question.topicId,
    quizId: question.quizId || `${question.topicId}-quiz-01`,
    question,
    note: note || '',
    tags: [question.topicId],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  all.unshift(newBm);
  safeSet(STORAGE_KEYS.BOOKMARKS, all);
  return true; // Added
}

export function updateBookmarkNote(
  studentId: string,
  questionId: string,
  note: string
): boolean {
  const all = safeGet<StudentBookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
  const bmId = `bm-${studentId}-${questionId}`;
  const bm = all.find(b => b.id === bmId);
  if (!bm) return false;

  bm.note = note;
  bm.updatedAt = new Date().toISOString();
  safeSet(STORAGE_KEYS.BOOKMARKS, all);
  return true;
}

export function searchBookmarks(studentId: string, query: string): StudentBookmark[] {
  const q = query.trim().toLowerCase();
  const list = getStudentBookmarks(studentId);
  if (!q) return list;
  return list.filter(b =>
    b.question.question.toLowerCase().includes(q) ||
    (b.note && b.note.toLowerCase().includes(q)) ||
    b.topicId.toLowerCase().includes(q)
  );
}

// ==============================================================================
// 4. STUDY PLANNER
// ==============================================================================

export function getStudentStudyPlan(studentId: string): StudentStudyPlan {
  const plans = safeGet<Record<string, StudentStudyPlan>>(STORAGE_KEYS.STUDY_PLANS, {});
  if (plans[studentId]) return plans[studentId];

  const defaultPlan: StudentStudyPlan = {
    studentId,
    dailyQuestionTarget: 15,
    weeklyQuizTarget: 5,
    preferredStudyTime: 'Evening (7:00 PM)',
    dailyLogs: {},
    updatedAt: new Date().toISOString()
  };

  plans[studentId] = defaultPlan;
  safeSet(STORAGE_KEYS.STUDY_PLANS, plans);
  return defaultPlan;
}

export function updateStudyPlanTargets(
  studentId: string,
  dailyTarget: number,
  weeklyTarget: number,
  preferredTime?: string
): StudentStudyPlan {
  const plans = safeGet<Record<string, StudentStudyPlan>>(STORAGE_KEYS.STUDY_PLANS, {});
  const plan = getStudentStudyPlan(studentId);

  plan.dailyQuestionTarget = Math.max(5, dailyTarget);
  plan.weeklyQuizTarget = Math.max(1, weeklyTarget);
  if (preferredTime) plan.preferredStudyTime = preferredTime;
  plan.updatedAt = new Date().toISOString();

  plans[studentId] = plan;
  safeSet(STORAGE_KEYS.STUDY_PLANS, plans);
  return plan;
}

export function logDailyStudyActivity(
  studentId: string,
  questionsCount: number,
  quizzesCount: number,
  minutesSpent: number
): void {
  const plans = safeGet<Record<string, StudentStudyPlan>>(STORAGE_KEYS.STUDY_PLANS, {});
  const plan = getStudentStudyPlan(studentId);
  const today = new Date().toISOString().split('T')[0];

  const existing = plan.dailyLogs[today] || {
    questionsSolved: 0,
    quizzesCompleted: 0,
    minutesSpent: 0,
    goalMet: false
  };

  existing.questionsSolved += questionsCount;
  existing.quizzesCompleted += quizzesCount;
  existing.minutesSpent += minutesSpent;
  existing.goalMet = existing.questionsSolved >= plan.dailyQuestionTarget;

  plan.dailyLogs[today] = existing;
  plan.updatedAt = new Date().toISOString();

  plans[studentId] = plan;
  safeSet(STORAGE_KEYS.STUDY_PLANS, plans);
}

// ==============================================================================
// 5. MOCK EXAMINATION MODE
// ==============================================================================

export function generateMockExam(config: MockExamConfig): MockExamState {
  const allQuestions = getAllTopicQuestions();
  let pool = allQuestions;

  if (config.mode === 'sectional' && config.topicId) {
    pool = allQuestions.filter(q => q.topicId === config.topicId);
  }

  // Shuffle pool deterministically
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, config.totalQuestions);

  const quizQuestions: QuizQuestion[] = selectedQuestions.map((q, idx) => ({
    id: q.id,
    quizId: config.id,
    order: idx + 1,
    section: 'new',
    state: q.topicId,
    parkName: q.subtopicId,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    difficulty: q.difficulty,
    explanation: q.explanation,
    status: 'published'
  }));

  const initialStatus: Record<string, 'not-visited' | 'unanswered' | 'answered' | 'marked-for-review' | 'answered-and-marked'> = {};
  quizQuestions.forEach((q, idx) => {
    initialStatus[q.id] = idx === 0 ? 'unanswered' : 'not-visited';
  });

  const totalSeconds = config.timeLimitMinutes * 60;

  return {
    examId: config.id,
    title: config.title,
    mode: config.mode,
    topicId: config.topicId,
    questions: quizQuestions,
    currentQuestionIndex: 0,
    answers: {},
    questionStatus: initialStatus,
    secondsRemaining: totalSeconds,
    totalSeconds,
    startedAt: new Date().toISOString(),
    isSubmitted: false
  };
}

export function submitMockExam(
  state: MockExamState,
  studentId: string,
  studentName: string,
  negativeMarkRatio: number = 0.25
): MockExamResult {
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let markedCount = 0;

  const topicBreakdown: Record<string, { total: number; correct: number; incorrect: number }> = {};

  for (const q of state.questions) {
    const selected = state.answers[q.id];
    const status = state.questionStatus[q.id];
    const topic = q.state || 'General';

    if (!topicBreakdown[topic]) {
      topicBreakdown[topic] = { total: 0, correct: 0, incorrect: 0 };
    }
    topicBreakdown[topic].total += 1;

    if (status === 'marked-for-review' || status === 'answered-and-marked') {
      markedCount++;
    }

    if (selected === undefined || selected === -1) {
      unansweredCount++;
    } else if (selected === q.correctAnswer) {
      correctCount++;
      topicBreakdown[topic].correct += 1;
    } else {
      incorrectCount++;
      topicBreakdown[topic].incorrect += 1;
    }
  }

  const attemptedCount = correctCount + incorrectCount;
  const rawScore = correctCount - (incorrectCount * negativeMarkRatio);
  const score = Math.max(0, Math.round(rawScore * 100) / 100);
  const maxScore = state.questions.length;
  const percentage = Math.round((score / maxScore) * 100);
  const passed = percentage >= 50;
  const timeTakenSeconds = state.totalSeconds - state.secondsRemaining;

  const result: MockExamResult = {
    id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    examId: state.examId,
    studentId,
    studentName,
    title: state.title,
    mode: state.mode,
    topicId: state.topicId,
    totalQuestions: state.questions.length,
    attemptedCount,
    correctCount,
    incorrectCount,
    unansweredCount,
    markedForReviewCount: markedCount,
    score,
    maxScore,
    percentage,
    passed,
    timeTakenSeconds,
    completedAt: new Date().toISOString(),
    answers: state.answers,
    questionsSnapshot: state.questions,
    topicBreakdown
  };

  const all = safeGet<MockExamResult[]>(STORAGE_KEYS.MOCK_EXAMS, []);
  all.unshift(result);
  safeSet(STORAGE_KEYS.MOCK_EXAMS, all);

  // Log study activity
  logDailyStudyActivity(studentId, attemptedCount, 1, Math.ceil(timeTakenSeconds / 60));

  return result;
}

export function getMockExamResults(studentId?: string): MockExamResult[] {
  const all = safeGet<MockExamResult[]>(STORAGE_KEYS.MOCK_EXAMS, []);
  if (!studentId) return all;
  return all.filter(r => r.studentId === studentId);
}

// ==============================================================================
// 6. WEAK AREA ANALYSIS
// ==============================================================================

export function getWeakAreaAnalysis(studentId: string): WeakAreaReport[] {
  const attempts = getAllAttempts().filter(a => a.studentId === studentId || studentId === 'mahi_student');
  const topics = getTopicsList().filter(t => t.isPublished);

  const reports: WeakAreaReport[] = [];

  for (const topic of topics) {
    let totalAttempted = 0;
    let totalCorrect = 0;
    const missedConceptSet = new Set<string>();

    const topicAttempts = attempts.filter(a => {
      return a.quizId.startsWith(topic.id) || a.quizId === topic.id;
    });

    for (const att of topicAttempts) {
      totalAttempted += att.totalQuestions || 0;
      totalCorrect += att.correctCount || 0;

      // Extract missed questions from snapshot
      if (att.questionsSnapshot) {
        for (const q of att.questionsSnapshot) {
          if (att.answers[q.id] !== q.correctAnswer && q.parkName) {
            missedConceptSet.add(q.parkName);
          }
        }
      }
    }

    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    const sampleSizeSufficient = totalAttempted >= 10;
    const isWeak = sampleSizeSufficient && accuracy < 60;

    const topicQuizzes = getQuizzesForTopic(topic.id, false);
    const recommendedQuizzes = topicQuizzes.slice(0, 2).map(q => ({
      quizId: q.id,
      title: q.title
    }));

    reports.push({
      topicId: topic.id,
      topicTitle: topic.title,
      totalAttempted,
      totalCorrect,
      accuracyPercentage: accuracy,
      isWeak,
      sampleSizeSufficient,
      recommendedQuizzes,
      frequentlyMissedConcepts: Array.from(missedConceptSet).slice(0, 4)
    });
  }

  return reports.sort((a, b) => a.accuracyPercentage - b.accuracyPercentage);
}

// ==============================================================================
// 7. FLASHCARDS
// ==============================================================================

export const STARTER_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-bank-01',
    category: 'banking',
    categoryLabel: 'Banking Concepts',
    front: 'What is Capital Conservation Buffer (CCB) under Basel III in India?',
    back: 'Mandated at 2.5% of Risk-Weighted Assets (RWA) in the form of Common Equity Tier 1 (CET1) capital, taking minimum Total CRAR to 11.5%.',
    keyFact: '2.5% RWA | Total CRAR 11.5%',
    source: 'RBI Master Circular - Basel III',
    difficulty: 'medium'
  },
  {
    id: 'fc-bank-02',
    category: 'banking',
    categoryLabel: 'NPA Classification',
    front: 'What constitutes a Sub-Standard vs Doubtful NPA asset?',
    back: 'Sub-Standard: NPA for a period ≤ 12 months.\nDoubtful: An asset that has remained in the sub-standard category for > 12 months.',
    keyFact: 'Sub-Standard ≤ 12mo | Doubtful > 12mo',
    source: 'RBI Master Circular on IRAC Norms',
    difficulty: 'medium'
  },
  {
    id: 'fc-rbi-01',
    category: 'rbi',
    categoryLabel: 'RBI Monetary Policy',
    front: 'What is the composition and voting rule of the RBI Monetary Policy Committee (MPC)?',
    back: '6 members: 3 RBI officials (including Governor) and 3 external experts appointed by the Central Govt. Governor holds a casting vote in case of a tie under Section 45ZB.',
    keyFact: '6 members (3 RBI + 3 External) | Governor casting vote',
    source: 'Section 45ZB, RBI Act 1934',
    difficulty: 'easy'
  },
  {
    id: 'fc-ramsar-01',
    category: 'ramsar',
    categoryLabel: 'Ramsar Sites',
    front: 'What was the milestone reached on 15 October 2026 for Ramsar sites in India?',
    back: 'India officially reached 103 designated Ramsar wetlands with the inclusion of Sukhna Wetland (102nd, Chandigarh) and Sauj Jheel (103rd, Mainpuri, Uttar Pradesh).',
    keyFact: '103 Total Sites | 102nd Sukhna | 103rd Sauj Jheel',
    source: 'Ramsar Convention Secretariat & MoEFCC',
    difficulty: 'easy'
  },
  {
    id: 'fc-unesco-01',
    category: 'unesco',
    categoryLabel: 'UNESCO World Heritage',
    front: 'Which site was inscribed on 25 July 2026 as India\'s 45th World Heritage Site?',
    back: 'Sarnath (Uttar Pradesh) was inscribed as India\'s 45th World Heritage Site under cultural criteria. Total breakdown: 36 Cultural, 8 Natural, 1 Mixed.',
    keyFact: '45th Site: Sarnath (UP) | 36 Cultural + 8 Natural + 1 Mixed',
    source: 'UNESCO World Heritage Centre',
    difficulty: 'easy'
  },
  {
    id: 'fc-sixth-01',
    category: 'constitution',
    categoryLabel: 'Sixth Schedule',
    front: 'Which four northeastern states are governed under the Sixth Schedule of the Constitution?',
    back: 'Assam, Meghalaya, Tripura, Mizoram (AMTM) administered through 10 Autonomous District Councils (ADCs) under Articles 244(2) and 275(1).',
    keyFact: 'AMTM States | 10 ADCs | Articles 244(2) & 275(1)',
    source: 'The Constitution of India',
    difficulty: 'easy'
  },
  {
    id: 'fc-parks-01',
    category: 'national-parks',
    categoryLabel: 'National Parks',
    front: 'Which is the oldest National Park in India and when was it established?',
    back: 'Jim Corbett National Park (Uttarakhand), originally established in 1936 as Hailey National Park and later renamed Ramganga and then Corbett.',
    keyFact: '1936 | Hailey NP -> Jim Corbett NP',
    source: 'MoEFCC National Parks Directory',
    difficulty: 'easy'
  },
  {
    id: 'fc-schemes-01',
    category: 'schemes',
    categoryLabel: 'Government Schemes',
    front: 'What is the approved outlay and objective of the India Semiconductor Mission (ISM)?',
    back: '₹76,000 Crore incentive scheme approved to develop a sustainable semiconductor and display fabrication ecosystem in India.',
    keyFact: '₹76,000 Crore | Semicon India Program',
    source: 'PIB / Ministry of Electronics & IT',
    difficulty: 'medium'
  }
];

export function getFlashcards(category?: string): Flashcard[] {
  if (!category || category === 'all') return STARTER_FLASHCARDS;
  return STARTER_FLASHCARDS.filter(f => f.category === category);
}

// ==============================================================================
// 8. QUESTION VERSION HISTORY & AUDIT TRAIL (ADMIN)
// ==============================================================================

export function getQuestionVersionHistory(questionId?: string): QuestionVersionRecord[] {
  const all = safeGet<QuestionVersionRecord[]>(STORAGE_KEYS.VERSIONS, []);
  if (!questionId) return all;
  return all.filter(v => v.questionId === questionId);
}

export function recordQuestionVersion(
  previousSnapshot: TopicQuestion,
  newSnapshot: TopicQuestion,
  adminUserId: string,
  adminName: string,
  reason?: string
): QuestionVersionRecord {
  const all = safeGet<QuestionVersionRecord[]>(STORAGE_KEYS.VERSIONS, []);
  const existingForQuestion = all.filter(v => v.questionId === newSnapshot.id);
  const nextVer = existingForQuestion.length + 1;

  const changedFields: string[] = [];
  if (previousSnapshot.question !== newSnapshot.question) changedFields.push('question');
  if (previousSnapshot.correctAnswer !== newSnapshot.correctAnswer) changedFields.push('correctAnswer');
  if (previousSnapshot.explanation !== newSnapshot.explanation) changedFields.push('explanation');
  if (previousSnapshot.difficulty !== newSnapshot.difficulty) changedFields.push('difficulty');
  if (previousSnapshot.source !== newSnapshot.source) changedFields.push('source');
  if (previousSnapshot.sourcePage !== newSnapshot.sourcePage) changedFields.push('sourcePage');

  const record: QuestionVersionRecord = {
    id: `ver-${newSnapshot.id}-${nextVer}-${Date.now()}`,
    questionId: newSnapshot.id,
    versionNumber: nextVer,
    previousSnapshot,
    newSnapshot,
    changedFields,
    adminUserId,
    adminName,
    timestamp: new Date().toISOString(),
    reason: reason || 'Admin updated question content'
  };

  all.unshift(record);
  safeSet(STORAGE_KEYS.VERSIONS, all);
  return record;
}

// ==============================================================================
// 9. STUDENT QUESTION FEEDBACK & ERROR REPORTS
// ==============================================================================

export function getStudentQuestionReports(): StudentQuestionReport[] {
  return safeGet<StudentQuestionReport[]>(STORAGE_KEYS.REPORTS, []);
}

export function submitStudentQuestionReport(
  report: Omit<StudentQuestionReport, 'id' | 'createdAt' | 'status'>
): StudentQuestionReport {
  const all = safeGet<StudentQuestionReport[]>(STORAGE_KEYS.REPORTS, []);
  const newReport: StudentQuestionReport = {
    ...report,
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: 'open',
    createdAt: new Date().toISOString()
  };

  all.unshift(newReport);
  safeSet(STORAGE_KEYS.REPORTS, all);
  return newReport;
}

export function updateQuestionReportStatus(
  reportId: string,
  status: 'open' | 'investigating' | 'resolved'
): boolean {
  const all = safeGet<StudentQuestionReport[]>(STORAGE_KEYS.REPORTS, []);
  const item = all.find(r => r.id === reportId);
  if (!item) return false;

  item.status = status;
  safeSet(STORAGE_KEYS.REPORTS, all);
  return true;
}

// ==============================================================================
// 10. PLATFORM SETTINGS (ADMIN CONTROLLED)
// ==============================================================================

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  platformName: 'Spideyy Quiz',
  brandingTagline: 'Topic-Wise GK & Competitive Exam Preparation Platform',
  allowAccessCodeLogin: true,
  allowUsernameLogin: true,
  allowEmailPasswordLogin: true,
  defaultPassingScore: 70,
  defaultQuizTimeLimitMinutes: 15,
  spacedRepetitionIntervals: [1, 3, 7, 14, 30],
  announcements: [
    {
      id: 'ann-01',
      title: 'Welcome to Spideyy Quiz Multi-Quiz Curriculum',
      message: 'All 9 main topics now feature independent quizzes with spaced repetition, mistake notebooks, and mock examinations.',
      date: '2026-11-24',
      priority: 'important',
      isActive: true
    }
  ],
  learningInstructions: [
    'Take one topic quiz daily to build your retention streak.',
    'Review your Mistake Notebook immediately after completing a quiz.',
    'Attempt Smart Revision items due today to anchor long-term memory.',
    'Use Mock Exam mode for realistic, timed competitive exam practice.'
  ],
  updatedAt: '2026-11-24T00:00:00.000Z',
  updatedBy: 'admin-sanju'
};

export function getPlatformSettings(): PlatformSettings {
  return safeGet<PlatformSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_PLATFORM_SETTINGS);
}

export function savePlatformSettings(
  settings: Partial<PlatformSettings>,
  adminUserId: string
): PlatformSettings {
  const current = getPlatformSettings();
  const updated: PlatformSettings = {
    ...current,
    ...settings,
    updatedAt: new Date().toISOString(),
    updatedBy: adminUserId
  };

  safeSet(STORAGE_KEYS.SETTINGS, updated);
  return updated;
}
