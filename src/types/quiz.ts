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
  section: QuizSection;
  state: string;
  parkName: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0, 1, 2, or 3
  difficulty: Difficulty;
  explanation: string;
  establishedYear?: number;
  district?: string;
  famousWildlife?: string[];
  keyFeature?: string;
}

export interface DailyQuiz {
  id: string; // e.g. "day-01"
  dayNumber: number;
  title: string; // e.g. "Day 01"
  quizDate: string; // "09-11-2026"
  displayDate: string; // "09 November 2026"
  statusLabel?: string; // "Available"
  statesCovered: string[]; // Cumulative pool of all states in this quiz
  newStatesIntroduced: string[]; // States newly added on this day
  previousStates: string[]; // States carried over from earlier days
  stateInfoList: StateNationalParkInfo[];
  questions: QuizQuestion[];
  totalQuestions: number;
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
  dayNumber: number;
  statesCovered: string[];
  timestamp: string; // ISO string
  formattedDate: string;
  answers: Record<string, number>; // questionId -> selectedOptionIndex (0-3), or -1 if skipped
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
