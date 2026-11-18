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
  maxMarks: number;
  percentage: number;
  accuracy: number;
  timeTakenSeconds: number;
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
// TOPIC-BASED LEARNING WORKSPACE INTERFACES (QUIZ BY SPIDEEYY)
// ==============================================================================

export type TopicCategory =
  | 'static-gk'
  | 'current-affairs'
  | 'banking-awareness'
  | 'central-ministers'
  | 'ramsar-sites';

export interface SubTopic {
  id: string;
  title: string;
  description: string;
  questionCount: number;
}

export interface Topic {
  id: string;
  title: string;
  category: TopicCategory;
  description: string;
  icon: string;
  subtopics: SubTopic[];
  totalQuestions: number;
  isPublished: boolean;
  publishedAt?: string;
}

export interface TopicQuestion {
  id: string;
  topicId: string;
  subtopicId: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
  difficulty: Difficulty;
  source?: string;
  lastVerifiedDate?: string;
  status: 'published' | 'draft';
  documentId?: string;
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
