import type { QuizAttempt, InProgressQuiz, OverallProgress, UserSettings, DailyQuiz } from '../types/quiz';
import { DEFAULT_SANJU_WHATSAPP_NUMBER } from './whatsapp.ts';
import { evaluateBadges } from './achievements.ts';

const STORAGE_KEYS = {
  ATTEMPTS: 'mahi_quiz_attempts_v1',
  IN_PROGRESS: 'mahi_quiz_in_progress_v1',
  SETTINGS: 'mahi_quiz_settings_v1',
  COMPLETED_DAYS: 'mahi_quiz_completed_days_v1',
};

// Safe JSON parser helper
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Failed to read ${key} from localStorage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write ${key} to localStorage:`, err);
  }
}

// -------------------------------------------------------------
// ATTEMPTS
// -------------------------------------------------------------

export function getAllAttempts(): QuizAttempt[] {
  const attempts = safeGet<QuizAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
  // Sort descending by timestamp (newest first)
  return attempts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getAttemptsForQuiz(quizId: string): QuizAttempt[] {
  return getAllAttempts().filter(att => att.quizId === quizId);
}

export function getLatestAttempt(quizId: string): QuizAttempt | null {
  const attempts = getAttemptsForQuiz(quizId);
  return attempts.length > 0 ? attempts[0] : null;
}

export function getBestAttempt(quizId: string): QuizAttempt | null {
  const attempts = getAttemptsForQuiz(quizId);
  if (attempts.length === 0) return null;
  return attempts.reduce((best, current) => {
    if (current.percentage > best.percentage) return current;
    if (current.percentage === best.percentage && current.timeTakenSeconds < best.timeTakenSeconds) return current;
    return best;
  }, attempts[0]);
}

export function saveQuizAttempt(attempt: QuizAttempt): void {
  const attempts = getAllAttempts();
  // Append new attempt without overwriting previous attempts
  const updatedAttempts = [attempt, ...attempts];
  safeSet(STORAGE_KEYS.ATTEMPTS, updatedAttempts);

  // Mark this day as completed
  const completedDays = getCompletedDayIds();
  if (!completedDays.includes(attempt.quizId)) {
    completedDays.push(attempt.quizId);
    safeSet(STORAGE_KEYS.COMPLETED_DAYS, completedDays);
  }

  // Clear in-progress session for this quiz
  clearInProgressQuiz(attempt.quizId);
}

// -------------------------------------------------------------
// COMPLETED DAYS
// -------------------------------------------------------------

export function getCompletedDayIds(): string[] {
  return safeGet<string[]>(STORAGE_KEYS.COMPLETED_DAYS, []);
}

export function isQuizCompleted(quizId: string): boolean {
  return getCompletedDayIds().includes(quizId);
}

// -------------------------------------------------------------
// IN PROGRESS QUIZ
// -------------------------------------------------------------

export function getInProgressQuiz(quizId: string): InProgressQuiz | null {
  const map = safeGet<Record<string, InProgressQuiz>>(STORAGE_KEYS.IN_PROGRESS, {});
  return map[quizId] || null;
}

export function saveInProgressQuiz(data: InProgressQuiz): void {
  const map = safeGet<Record<string, InProgressQuiz>>(STORAGE_KEYS.IN_PROGRESS, {});
  map[data.quizId] = data;
  safeSet(STORAGE_KEYS.IN_PROGRESS, map);
}

export function clearInProgressQuiz(quizId: string): void {
  const map = safeGet<Record<string, InProgressQuiz>>(STORAGE_KEYS.IN_PROGRESS, {});
  if (map[quizId]) {
    delete map[quizId];
    safeSet(STORAGE_KEYS.IN_PROGRESS, map);
  }
}

export function getQuizStatus(quizId: string): 'not-started' | 'in-progress' | 'completed' {
  if (isQuizCompleted(quizId)) return 'completed';
  if (getInProgressQuiz(quizId)) return 'in-progress';
  return 'not-started';
}

// -------------------------------------------------------------
// STREAK & OVERALL STATS
// -------------------------------------------------------------

/**
 * Calculates continuous daily streak based on unique UTC/local days with at least 1 attempt
 */
function getLocalDateString(dateInput: Date | string): string {
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface DayStreakItem {
  dateStr: string;
  dayShort: string;
  dayName: string;
  dayNumber: number;
  completed: boolean;
  isToday: boolean;
}

/**
 * Calculates continuous daily streak based on unique local calendar days
 */
export function calculateCurrentStreak(attempts: QuizAttempt[]): number {
  if (!attempts || attempts.length === 0) return 0;

  // Get sorted unique dates (YYYY-MM-DD in local time)
  const uniqueDates = Array.from(
    new Set(attempts.map(a => getLocalDateString(a.timestamp)))
  ).sort().reverse();

  if (uniqueDates.length === 0) return 0;

  const now = new Date();
  const today = getLocalDateString(now);
  const yesterday = getLocalDateString(new Date(now.getTime() - 86400000));

  // If latest attempt is neither today nor yesterday, streak is 0
  const mostRecentDate = uniqueDates[0];
  if (mostRecentDate !== today && mostRecentDate !== yesterday) {
    return 0;
  }

  let streak = 0;
  let expectedDate = new Date(mostRecentDate);

  for (const dateStr of uniqueDates) {
    const curDate = new Date(dateStr);
    const diffDays = Math.round((expectedDate.getTime() - curDate.getTime()) / 86400000);
    
    if (diffDays === 0) {
      streak += 1;
      // Decrement expected date by 1 day
      expectedDate = new Date(expectedDate.getTime() - 86400000);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculates highest all-time streak achieved
 */
export function calculateBestStreak(attempts: QuizAttempt[]): number {
  if (!attempts || attempts.length === 0) return 0;

  const uniqueDates = Array.from(
    new Set(attempts.map(a => getLocalDateString(a.timestamp)))
  ).sort();

  if (uniqueDates.length === 0) return 0;

  let maxStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000);

    if (diffDays === 1) {
      currentRun += 1;
      if (currentRun > maxStreak) {
        maxStreak = currentRun;
      }
    } else if (diffDays > 1) {
      currentRun = 1;
    }
  }

  return maxStreak;
}

/**
 * Returns streak breakdown for the current week (Monday to Sunday)
 */
export function getWeeklyStreakDays(attempts: QuizAttempt[]): DayStreakItem[] {
  const attemptDates = new Set(attempts.map(a => getLocalDateString(a.timestamp)));
  const today = new Date();
  const todayStr = getLocalDateString(today);

  // Get current week Monday
  const dayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon...
  const distanceToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - distanceToMonday);

  const days: DayStreakItem[] = [];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dStr = getLocalDateString(d);
    days.push({
      dateStr: dStr,
      dayShort: dayLabels[i][0],
      dayName: dayLabels[i],
      dayNumber: d.getDate(),
      completed: attemptDates.has(dStr),
      isToday: dStr === todayStr
    });
  }

  return days;
}

export function getOverallProgress(availableQuizzes: DailyQuiz[]): OverallProgress {
  const attempts = getAllAttempts();
  const completedIds = getCompletedDayIds();

  const totalDaysAvailable = availableQuizzes.length;
  const totalCompletedDays = completedIds.length;
  const totalQuizzesAttempted = attempts.length;

  let overallMarks = 0;
  let overallMaxMarks = 0;

  // For overall marks & accuracy, consider the BEST attempt for each completed quiz
  availableQuizzes.forEach(quiz => {
    const best = getBestAttempt(quiz.id);
    if (best) {
      overallMarks += best.marksObtained;
      overallMaxMarks += best.maxMarks;
    }
  });

  const overallAccuracy = overallMaxMarks > 0 
    ? Math.round((overallMarks / overallMaxMarks) * 100) 
    : 0;

  const currentStreak = calculateCurrentStreak(attempts);
  const bestStreak = Math.max(currentStreak, calculateBestStreak(attempts));

  // Evaluate badges
  const badges = evaluateBadges(attempts, currentStreak);
  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;

  // Calculate unique states learned from completed days
  const learnedStatesSet = new Set<string>();
  availableQuizzes.forEach(quiz => {
    if (completedIds.includes(quiz.id)) {
      quiz.statesCovered.forEach(s => learnedStatesSet.add(s));
    }
  });
  const totalStatesLearned = learnedStatesSet.size;

  // Find next learning day
  let nextLearningDayNumber = 1;
  for (const q of availableQuizzes) {
    if (!completedIds.includes(q.id)) {
      nextLearningDayNumber = q.dayNumber;
      break;
    }
    nextLearningDayNumber = availableQuizzes[availableQuizzes.length - 1].dayNumber;
  }

  return {
    totalStatesLearned,
    totalCompletedDays,
    totalQuizzesAttempted,
    overallMarks,
    overallMaxMarks,
    overallAccuracy,
    currentStreak,
    bestStreak,
    unlockedBadgesCount,
    totalDaysAvailable,
    nextLearningDayNumber
  };
}

// -------------------------------------------------------------
// USER SETTINGS
// -------------------------------------------------------------

export function getUserSettings(): UserSettings {
  const settings = safeGet<UserSettings>(STORAGE_KEYS.SETTINGS, {
    sanjuWhatsAppNumber: DEFAULT_SANJU_WHATSAPP_NUMBER,
    studentName: 'Mahi'
  });

  // Ensure default matches 917075920852 if old dummy number was present
  if (!settings.sanjuWhatsAppNumber || settings.sanjuWhatsAppNumber === '919876543210' || settings.sanjuWhatsAppNumber === '91XXXXXXXXXX') {
    settings.sanjuWhatsAppNumber = DEFAULT_SANJU_WHATSAPP_NUMBER;
    safeSet(STORAGE_KEYS.SETTINGS, settings);
  }

  return settings;
}

export function saveUserSettings(settings: UserSettings): void {
  safeSet(STORAGE_KEYS.SETTINGS, settings);
}

// -------------------------------------------------------------
// BACKUP & RESTORE (JSON EXPORT/IMPORT)
// -------------------------------------------------------------

export interface BackupData {
  version: string;
  exportedAt: string;
  settings: UserSettings;
  attempts: QuizAttempt[];
  completedDays: string[];
  inProgress: Record<string, InProgressQuiz>;
}

export function exportBackupData(): string {
  const data: BackupData = {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    settings: getUserSettings(),
    attempts: getAllAttempts(),
    completedDays: getCompletedDayIds(),
    inProgress: safeGet<Record<string, InProgressQuiz>>(STORAGE_KEYS.IN_PROGRESS, {})
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupData(jsonString: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonString) as BackupData;
    if (!data || !Array.isArray(data.attempts)) {
      return { success: false, message: 'Invalid backup format. Missing quiz attempts data.' };
    }

    if (data.settings) safeSet(STORAGE_KEYS.SETTINGS, data.settings);
    if (data.attempts) safeSet(STORAGE_KEYS.ATTEMPTS, data.attempts);
    if (data.completedDays) safeSet(STORAGE_KEYS.COMPLETED_DAYS, data.completedDays);
    if (data.inProgress) safeSet(STORAGE_KEYS.IN_PROGRESS, data.inProgress);

    return { 
      success: true, 
      message: `Successfully imported ${data.attempts.length} attempts and ${data.completedDays?.length || 0} completed days!` 
    };
  } catch (err: unknown) {
    return { success: false, message: `Import failed: ${(err as Error)?.message || 'Unknown error'}` };
  }
}

export function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
  localStorage.removeItem(STORAGE_KEYS.IN_PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.COMPLETED_DAYS);
  saveUserSettings({
    sanjuWhatsAppNumber: DEFAULT_SANJU_WHATSAPP_NUMBER,
    studentName: 'Mahi'
  });
}
