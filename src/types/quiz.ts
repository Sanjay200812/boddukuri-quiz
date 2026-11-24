export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuizSection = 'previous' | 'new';

export interface NationalParkFact {
  name: string;
  year: number;
  district: string;
  riverOrBiome?: string;
  famousWildlife?: string[];
  keyFeature: string;
  unescoOrSpecialStatus?: string;
}

export interface StateNationalParkInfo {
  stateName: string;
  capital: string;
  totalParks: number;
  parks: NationalParkFact[];
  overview: string;
  tipsForMahi: string;
}

export interface QuizQuestion {
  id: string;
  quizId?: string;
  dayNumber?: number;
  order?: number;
  section: QuizSection;
  state: string;
  parkName: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0, 1, 2, or 3
  difficulty: Difficulty;
  explanation: string;
  status?: 'published' | 'draft';
  establishedYear?: number;
  district?: string;
  famousWildlife?: string[];
  keyFeature?: string;
}

export interface DailyQuiz {
  id: string; // e.g. "day-01"
  dayNumber: number;
  title: string; // e.g. "Day 01"
  version?: number;
  status?: 'published' | 'draft' | 'scheduled';
  quizDate: string; // "09-11-2026"
  displayDate: string; // "09 November 2026"
  statusLabel?: string; // "Available"
  statesCovered: string[]; // Cumulative pool of all states in this quiz
  newStatesIntroduced: string[]; // States newly added on this day
  previousStates: string[]; // States carried over from earlier days
  stateInfoList: StateNationalParkInfo[];
  questions: QuizQuestion[];
  totalQuestions: number;
  publishedAt?: string;
  updatedAt?: string;
}

export interface SectionScore {
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  percentage: number;
}

export interface StateScoreBreakdown {
  stateName: string;
  total: number;
  correct: number;
  percentage: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle?: string;
  quizVersion?: number;
  dayNumber: number;
  statesCovered: string[];
  timestamp: string; // ISO string
  formattedDate: string;
  quizDate?: string;
  displayDate?: string;
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  submissionId?: string;
  status?: 'completed' | 'in-progress';
  answers: Record<string, number>; // questionId -> selectedOptionIndex (0-3), or -1 if skipped
  questionsSnapshot?: QuizQuestion[]; // Immutable snapshot of exact questions when attempted
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  marksObtained: number;
  score?: number;
  maxMarks: number;
  percentage: number;
  accuracy: number;
  timeTakenSeconds: number;
  passed?: boolean;
  completedAt?: string;
  sectionBreakdown: {
    previous: SectionScore;
    new: SectionScore;
  };
  stateBreakdown?: StateScoreBreakdown[];
  performanceTier: 'outstanding' | 'excellent' | 'good' | 'practice' | 'retry';
  performanceMessage: string;
  quote: {
    quote: string;
    author?: string;
    personalNote: string;
  };
}

export interface QuizValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalQuestions: number;
    newQuestions: number;
    revisionQuestions: number;
    statesCoveredCount: number;
  };
}

export interface InProgressQuiz {
  quizId: string;
  dayNumber: number;
  currentQuestionIndex: number;
  answers: Record<string, number>;
  flaggedQuestionIds: string[];
  timeElapsedSeconds: number;
  questionExpiresAt?: number;
  questionSecondsLeft?: number;
  lastUpdated: string;
}

export interface OverallProgress {
  totalStatesLearned: number;
  totalCompletedDays: number;
  totalQuizzesAttempted: number;
  overallMarks: number;
  overallMaxMarks: number;
  overallAccuracy: number;
  currentStreak: number;
  bestStreak: number;
  unlockedBadgesCount: number;
  totalDaysAvailable: number;
  nextLearningDayNumber: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'score' | 'mastery' | 'milestone';
  unlocked: boolean;
  unlockedAt?: string;
  currentProgress?: number;
  targetProgress?: number;
  rewardHint?: string;
}

export interface UserSettings {
  sanjuWhatsAppNumber: string;
  studentName: string;
}

export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  displayName?: string;
  username?: string;
}

export interface RetakeRequest {
  id: string;
  userId: string;
  userEmail: string;
  dayNumber: number;
  quizId: string;
  dayTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
}

export interface InboxNotification {
  id: string;
  userId?: string;
  targetRole: 'admin' | 'student';
  type: 'submission' | 'achievement' | 'retake' | 'system' | 'topic_quiz';
  title: string;
  message: string;
  quizId?: string;
  topicId?: string;
  subtopicId?: string;
  attemptId?: string;
  dayNumber?: number;
  studentName?: string;
  scoreText?: string;
  percentage?: number;
  timeTakenText?: string;
  read: boolean;
  isRead?: boolean;
  createdAt: string;
  readAt?: string;
}

// ==============================================================================
// TOPIC-BASED LEARNING WORKSPACE INTERFACES (SPIDEYY QUIZ)
// ==============================================================================

export type TopicCategory =
  | 'static-gk'
  | 'current-affairs-pib'
  | 'banking-awareness-fa'
  | 'central-ministers'
  | 'ramsar-sites-2026'
  | 'unesco-2026'
  | 'unesco-tentative-2026'
  | 'other-important-gk'
  | 'dance-forms'
  | 'sixth-schedule'
  | 'vi-tax'
  | 'current-affairs'
  | 'banking-awareness'
  | 'ramsar-sites';

export interface SubTopic {
  id: string;
  title: string;
  description: string;
  questionCount?: number;
}

export interface TopicQuiz {
  id: string; // e.g. "static-gk-quiz-01"
  topicId: string; // e.g. "static-gk"
  title: string; // e.g. "Quiz 1 – National Parks Part 1"
  order: number;
  description?: string;
  isPublished: boolean;
  status: 'draft' | 'published' | 'archived';
  targetQuestionCount?: number;
  questionIds: string[];
  difficulty?: Difficulty;
  timeLimitMinutes?: number;
  passingScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Topic {
  id: string;
  title: string;
  category: TopicCategory;
  description: string;
  icon: string;
  iconName?: string;
  order?: number;
  learningInstructions?: string;
  sources?: Array<{ title: string; url?: string }>;
  subtopics: SubTopic[];
  quizzes?: TopicQuiz[]; // Multiple quizzes under this topic
  totalQuestions: number;
  isPublished: boolean;
  publishedAt?: string;
  isConfigurable?: boolean;
  statusNote?: string;
}

export interface TopicQuestion {
  id: string;
  topicId: string;
  quizId?: string; // Links question to a specific quiz inside the topic
  subtopicId: string;
  orderInQuiz?: number;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
  difficulty: Difficulty;
  source?: string;
  sourcePage?: number | string;
  sourceUrl?: string;
  sourcePdf?: string;
  origin?: 'pdf-extracted' | 'official-research';
  lastVerifiedDate?: string;
  verifiedDate?: string;
  isDraft?: boolean;
  status?: 'published' | 'draft' | 'archived';
  documentId?: string;
}

export interface TopicProgressMetrics {
  topicId: string;
  totalQuizzes: number;
  publishedQuizzes: number;
  completedQuizzes: number;
  completionPercentage: number;
  totalQuestionsAttempted: number;
  totalCorrectAnswers: number;
  accuracyPercentage: number; // (totalCorrectAnswers / totalQuestionsAttempted) * 100
  totalAttemptsCount: number;
  bestScoreOverall: number;
  latestScore: number;
  quizzesMetrics: Record<string, {
    quizId: string;
    title: string;
    questionCount: number;
    attemptsCount: number;
    bestScore: number;
    latestScore: number;
    isCompleted: boolean;
    lastAttemptDate?: string;
  }>;
}

export interface StudentTopicProgress {
  userId: string;
  topicId: string;
  subtopicId?: string;
  attemptsCount: number;
  bestScore: number;
  maxMarks: number;
  completed: boolean;
  lastAttemptAt?: string;
}

// ==============================================================================
// PDF UPLOAD & QUESTION GENERATION PIPELINE INTERFACES (FUTURE WORKFLOW)
// ==============================================================================

export type DocumentProcessingStatus =
  | 'uploaded'
  | 'processing'
  | 'extracted'
  | 'questions_generated'
  | 'completed'
  | 'failed';

export interface UploadedDocument {
  id: string;
  title: string;
  fileName: string;
  fileSizeBytes: number;
  topicId: string;
  subtopicId?: string;
  status: DocumentProcessingStatus;
  extractedTextPreview?: string;
  uploadedAt: string;
  uploadedBy?: string;
  generatedCount?: number;
}

export interface GeneratedQuestionDraft {
  id: string;
  documentId: string;
  topicId: string;
  subtopicId?: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
  difficulty?: Difficulty;
  status: 'draft' | 'approved' | 'rejected' | 'published';
  adminNotes?: string;
  createdAt: string;
}

// ==============================================================================
// MULTI-STUDENT WORKSPACE INTERFACES (MAHI & SHAILU)
// ==============================================================================

export interface ManagedStudent {
  id: string;
  fullName: 'Mahi' | 'Shailu' | string;
  email: string;
  status: 'active' | 'awaiting_onboarding';
  accessCode?: string;
  totalAttempts: number;
  completedTopics: number;
  avgScore: number;
  lastActive?: string;
  streaks: number;
  topicBreakdown: Record<string, { attempts: number; bestScore: number; maxMarks: number }>;
}

// ==============================================================================
// ADVANCED STUDENT LEARNING & COMPLETE ADMIN CONTROL INTERFACES
// ==============================================================================

export interface StudentMistake {
  id: string; // "mistake-{studentId}-{questionId}"
  studentId: string;
  questionId: string;
  topicId: string;
  quizId: string;
  question: TopicQuestion;
  selectedAnswer?: number; // 0-3 or -1
  correctAnswer: number;
  explanation: string;
  source?: string;
  sourceUrl?: string;
  recordedAt: string;
  retriedCount: number;
  lastRetriedAt?: string;
  lastRetryResult?: 'correct' | 'incorrect';
  status: 'active' | 'understood' | 'mastered';
  notes?: string;
}

export interface SmartRevisionItem {
  id: string; // "rev-{studentId}-{questionId}"
  studentId: string;
  questionId: string;
  topicId: string;
  quizId: string;
  question: TopicQuestion;
  difficultyRating?: Difficulty;
  repetitionLevel: number; // 0 to 5
  intervalDays: number;
  nextDueDate: string; // YYYY-MM-DD
  lastReviewedAt?: string;
  reviewCount: number;
  successStreak: number;
  status: 'pending' | 'due' | 'reviewed' | 'mastered';
}

export interface StudentBookmark {
  id: string; // "bm-{studentId}-{questionId}"
  studentId: string;
  questionId: string;
  topicId: string;
  quizId: string;
  question: TopicQuestion;
  note?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentStudyPlan {
  studentId: string;
  dailyQuestionTarget: number;
  weeklyQuizTarget: number;
  preferredStudyTime?: string;
  dailyLogs: Record<string, {
    questionsSolved: number;
    quizzesCompleted: number;
    minutesSpent: number;
    goalMet: boolean;
  }>;
  updatedAt: string;
}

export interface MockExamConfig {
  id: string;
  title: string;
  mode: 'full-length' | 'sectional' | 'custom';
  topicId?: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  passingPercentage: number;
  negativeMarkingRatio?: number; // e.g. 0.25 (1/4 mark)
}

export interface MockExamState {
  examId: string;
  title: string;
  mode: 'full-length' | 'sectional' | 'custom';
  topicId?: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, number>;
  questionStatus: Record<string, 'not-visited' | 'unanswered' | 'answered' | 'marked-for-review' | 'answered-and-marked'>;
  secondsRemaining: number;
  totalSeconds: number;
  startedAt: string;
  isSubmitted: boolean;
}

export interface MockExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  title: string;
  mode: 'full-length' | 'sectional' | 'custom';
  topicId?: string;
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  markedForReviewCount: number;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  timeTakenSeconds: number;
  completedAt: string;
  answers: Record<string, number>;
  questionsSnapshot: QuizQuestion[];
  topicBreakdown: Record<string, { total: number; correct: number; incorrect: number }>;
}

export interface Flashcard {
  id: string;
  category: 'banking' | 'rbi' | 'schemes' | 'appointments' | 'awards' | 'national-parks' | 'ramsar' | 'unesco' | 'constitution';
  categoryLabel: string;
  front: string;
  back: string;
  keyFact?: string;
  source?: string;
  difficulty?: Difficulty;
}

export interface QuestionVersionRecord {
  id: string;
  questionId: string;
  versionNumber: number;
  version?: number;
  previousSnapshot: TopicQuestion;
  newSnapshot: TopicQuestion;
  changedFields: string[];
  adminUserId: string;
  adminName: string;
  timestamp: string;
  createdAt?: string;
  reason?: string;
}

export interface StudentQuestionReport {
  id: string;
  studentId: string;
  studentName: string;
  questionId: string;
  quizId: string;
  topicId: string;
  issueType: 'incorrect-answer' | 'typo' | 'broken-source' | 'outdated-info' | 'other';
  comment: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
}

export interface PlatformSettings {
  platformName: string;
  brandingTagline: string;
  allowAccessCodeLogin: boolean;
  allowUsernameLogin: boolean;
  allowEmailPasswordLogin: boolean;
  defaultPassingScore: number;
  defaultQuizTimeLimitMinutes: number;
  spacedRepetitionIntervals: number[]; // e.g. [1, 3, 7, 14, 30]
  announcements: Array<{
    id: string;
    title: string;
    message: string;
    date: string;
    priority: 'info' | 'important' | 'urgent';
    isActive: boolean;
  }>;
  learningInstructions: string[];
  activeStudents?: {
    mahi: boolean;
    shailu: boolean;
  };
  announcementActive?: boolean;
  announcementBannerText?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface WeakAreaReport {
  topicId: string;
  topicTitle: string;
  totalAttempted: number;
  totalCorrect: number;
  accuracyPercentage: number;
  isWeak: boolean;
  sampleSizeSufficient: boolean;
  recommendedQuizzes: Array<{ quizId: string; title: string }>;
  frequentlyMissedConcepts: string[];
}
