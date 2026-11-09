import type { QuizAttempt, InProgressQuiz, OverallProgress, UserSettings, DailyQuiz, RetakeRequest, InboxNotification } from '../types/quiz';
import { DEFAULT_SANJU_WHATSAPP_NUMBER } from './whatsapp.ts';
import { evaluateBadges } from './achievements.ts';
import { getQuizForDay } from '../data/quizzes.ts';
import { broadcastQuizEvent } from './realtime.ts';

const STORAGE_KEYS = {
  ATTEMPTS: 'mahi_quiz_attempts_v1',
  IN_PROGRESS: 'mahi_quiz_in_progress_v1',
  SETTINGS: 'mahi_quiz_settings_v1',
  COMPLETED_DAYS: 'mahi_quiz_completed_days_v1',
  BOOKMARKS: 'mahi_quiz_bookmarks_v1',
  RETAKE_REQUESTS: 'mahi_quiz_retake_requests_v1',
  NOTIFICATIONS: 'mahi_quiz_notifications_v1',
};

export const STORAGE_CHANGE_EVENT = 'mahi-quiz-storage-changed';
function notifyStorageChanged(): void { if (typeof window !== 'undefined') window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT)); }

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

export interface ProgressSnapshot {
  version: 1;
  updatedAt: string;
  settingsUpdatedAt: string;
  settings: UserSettings;
  attempts: QuizAttempt[];
  completedDays: string[];
  inProgress: Record<string, InProgressQuiz>;
  bookmarks?: string[];
  retakeRequests?: RetakeRequest[];
  notifications?: InboxNotification[];
}

export function getBookmarks(): string[] {
  return safeGet<string[]>(STORAGE_KEYS.BOOKMARKS, []);
}

export function isBookmarked(questionId: string): boolean {
  return getBookmarks().includes(questionId);
}

export function toggleBookmark(questionId: string): boolean {
  const current = getBookmarks();
  const exists = current.includes(questionId);
  const updated = exists ? current.filter(id => id !== questionId) : [...current, questionId];
  safeSet(STORAGE_KEYS.BOOKMARKS, updated);
  markProgressChanged();
  return !exists;
}

// -------------------------------------------------------------
// RETAKE REQUESTS
// -------------------------------------------------------------

export function getRetakeRequests(): RetakeRequest[] {
  return safeGet<RetakeRequest[]>(STORAGE_KEYS.RETAKE_REQUESTS, []);
}

export function saveRetakeRequest(req: RetakeRequest): void {
  const list = getRetakeRequests();
  const filtered = list.filter(r => r.id !== req.id);
  const updated = [req, ...filtered];
  safeSet(STORAGE_KEYS.RETAKE_REQUESTS, updated);
  markProgressChanged();
}

export function updateRetakeRequestStatus(
  requestId: string,
  status: 'pending' | 'approved' | 'rejected',
  notes?: string,
  reviewedBy?: string
): void {
  const list = getRetakeRequests();
  const now = new Date().toISOString();
  let affectedReq: RetakeRequest | undefined;

  const updated = list.map(req => {
    if (req.id === requestId) {
      affectedReq = {
        ...req,
        status,
        reviewedAt: now,
        reviewedBy: reviewedBy || req.reviewedBy,
        adminNotes: notes !== undefined ? notes : req.adminNotes
      };
      return affectedReq;
    }
    return req;
  });

  safeSet(STORAGE_KEYS.RETAKE_REQUESTS, updated);

  if (affectedReq) {
    // Notify student
    const studentNotif: InboxNotification = {
      id: `notif-student-retake-${Date.now()}`,
      targetRole: 'student',
      type: 'retake',
      title: status === 'approved' ? 'Quiz Retake Approved!' : 'Retake Request Reviewed',
      message: status === 'approved'
        ? `Sanju has approved your request to retake ${affectedReq.dayTitle || affectedReq.quizId.toUpperCase()}. You can now reattempt the quiz!`
        : `Sanju reviewed your retake request for ${affectedReq.dayTitle || affectedReq.quizId.toUpperCase()}: ${notes || 'Please revise your study guide first.'}`,
      quizId: affectedReq.quizId,
      read: false,
      createdAt: now
    };
    saveInboxNotification(studentNotif);

    // Broadcast Realtime event
    void broadcastQuizEvent('retake_updated', {
      requestId,
      status,
      quizId: affectedReq.quizId,
      timestamp: now
    });
  }

  markProgressChanged();
}

export function getRetakeStatusForQuiz(quizId: string): RetakeRequest | null {
  const list = getRetakeRequests();
  const matching = list.filter(r => r.quizId === quizId);
  if (matching.length === 0) return null;
  return matching.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())[0];
}

export function isRetakeApproved(quizId: string): boolean {
  const status = getRetakeStatusForQuiz(quizId);
  return status?.status === 'approved';
}

export function consumeApprovedRetake(quizId: string): void {
  const list = getRetakeRequests();
  const updated = list.map(r => {
    if (r.quizId === quizId && r.status === 'approved') {
      return { ...r, status: 'rejected' as const, adminNotes: 'Attempt completed' };
    }
    return r;
  });
  safeSet(STORAGE_KEYS.RETAKE_REQUESTS, updated);
  clearInProgressQuiz(quizId);
  markProgressChanged();
}

export function getProgressSnapshot(): ProgressSnapshot {
  const meta = safeGet<{ updatedAt?: string; settingsUpdatedAt?: string }>('mahi_quiz_sync_meta_v1', {});
  return {
    version: 1,
    updatedAt: meta.updatedAt || new Date(0).toISOString(),
    settingsUpdatedAt: meta.settingsUpdatedAt || new Date(0).toISOString(),
    settings: getUserSettings(),
    attempts: getAllAttempts(),
    completedDays: getCompletedDayIds(),
    inProgress: safeGet<Record<string, InProgressQuiz>>(STORAGE_KEYS.IN_PROGRESS, {}),
    bookmarks: getBookmarks(),
    retakeRequests: getRetakeRequests(),
    notifications: getInboxNotifications()
  };
}

function saveSyncMeta(updatedAt: string, settingsUpdatedAt: string): void { safeSet('mahi_quiz_sync_meta_v1', { updatedAt, settingsUpdatedAt }); }

export function mergeProgressSnapshot(incoming: ProgressSnapshot): ProgressSnapshot {
  const local = getProgressSnapshot();
  const attempts = new Map<string, QuizAttempt>();
  [...local.attempts, ...(incoming.attempts || [])].forEach(attempt => {
    const old = attempts.get(attempt.id);
    if (!old || new Date(attempt.timestamp).getTime() > new Date(old.timestamp).getTime()) attempts.set(attempt.id, attempt);
  });

  const inProgress = { ...local.inProgress };
  Object.entries(incoming.inProgress || {}).forEach(([id, value]) => {
    if (!inProgress[id] || new Date(value.lastUpdated).getTime() > new Date(inProgress[id].lastUpdated).getTime()) inProgress[id] = value;
  });

  const mergedBookmarks = Array.from(new Set([...(local.bookmarks || []), ...(incoming.bookmarks || [])]));
  const incomingSettings = new Date(incoming.settingsUpdatedAt || 0).getTime() > new Date(local.settingsUpdatedAt || 0).getTime();

  // Merge retake requests
  const retakeMap = new Map<string, RetakeRequest>();
  [...(local.retakeRequests || []), ...(incoming.retakeRequests || [])].forEach(req => {
    const existing = retakeMap.get(req.id);
    if (!existing || new Date(req.requestedAt).getTime() > new Date(existing.requestedAt).getTime()) {
      retakeMap.set(req.id, req);
    }
  });

  // Merge notifications
  const notifMap = new Map<string, InboxNotification>();
  [...(local.notifications || []), ...(incoming.notifications || [])].forEach(n => {
    const existing = notifMap.get(n.id);
    if (!existing || n.read || new Date(n.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
      notifMap.set(n.id, n);
    }
  });

  const mergedNotifications = Array.from(notifMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const merged: ProgressSnapshot = {
    version: 1,
    updatedAt: new Date(Math.max(new Date(local.updatedAt).getTime(), new Date(incoming.updatedAt || 0).getTime(), Date.now())).toISOString(),
    settingsUpdatedAt: incomingSettings ? incoming.settingsUpdatedAt : local.settingsUpdatedAt,
    settings: incomingSettings ? incoming.settings : local.settings,
    attempts: Array.from(attempts.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    completedDays: Array.from(new Set([...(local.completedDays || []), ...(incoming.completedDays || [])])),
    inProgress,
    bookmarks: mergedBookmarks,
    retakeRequests: Array.from(retakeMap.values()),
    notifications: mergedNotifications
  };

  safeSet(STORAGE_KEYS.ATTEMPTS, merged.attempts);
  safeSet(STORAGE_KEYS.COMPLETED_DAYS, merged.completedDays);
  safeSet(STORAGE_KEYS.IN_PROGRESS, merged.inProgress);
  safeSet(STORAGE_KEYS.SETTINGS, merged.settings);
  safeSet(STORAGE_KEYS.BOOKMARKS, merged.bookmarks);
  safeSet(STORAGE_KEYS.RETAKE_REQUESTS, merged.retakeRequests);
  safeSet(STORAGE_KEYS.NOTIFICATIONS, mergedNotifications);
  saveSyncMeta(merged.updatedAt, merged.settingsUpdatedAt);
  notifyStorageChanged();
  return merged;
}

export function markProgressChanged(settingsChanged = false): void { const now = new Date().toISOString(); const meta = safeGet<{ updatedAt?: string; settingsUpdatedAt?: string }>('mahi_quiz_sync_meta_v1', {}); saveSyncMeta(now, settingsChanged ? now : (meta.settingsUpdatedAt || now)); notifyStorageChanged(); }

// -------------------------------------------------------------
// NOTIFICATIONS & INBOX
// -------------------------------------------------------------

export function getInboxNotifications(role?: 'admin' | 'student'): InboxNotification[] {
  const all = safeGet<InboxNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  if (role) {
    return all.filter(n => n.targetRole === role || !n.targetRole);
  }
  return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function saveInboxNotification(notification: InboxNotification): void {
  const all = safeGet<InboxNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const existingIdx = all.findIndex(n => n.id === notification.id);
  let updated: InboxNotification[];
  if (existingIdx >= 0) {
    updated = [...all];
    updated[existingIdx] = notification;
  } else {
    updated = [notification, ...all];
  }
  safeSet(STORAGE_KEYS.NOTIFICATIONS, updated);
  notifyStorageChanged();
}

export function markNotificationRead(id: string): void {
  const all = safeGet<InboxNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const updated = all.map(n => n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n);
  safeSet(STORAGE_KEYS.NOTIFICATIONS, updated);
  notifyStorageChanged();
}

export function markAllNotificationsRead(role?: 'admin' | 'student'): void {
  const all = safeGet<InboxNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const updated = all.map(n => {
    if (!role || n.targetRole === role) {
      return { ...n, read: true, readAt: new Date().toISOString() };
    }
    return n;
  });
  safeSet(STORAGE_KEYS.NOTIFICATIONS, updated);
  notifyStorageChanged();
}

export function deleteInboxNotification(id: string): void {
  const all = safeGet<InboxNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const updated = all.filter(n => n.id !== id);
  safeSet(STORAGE_KEYS.NOTIFICATIONS, updated);
  notifyStorageChanged();
}

export function getUnreadNotificationCount(role?: 'admin' | 'student'): number {
  return getInboxNotifications(role).filter(n => !n.read).length;
}

// -------------------------------------------------------------
// ATTEMPTS STORAGE (CLEAN & AUTHORITATIVE)
// -------------------------------------------------------------

export function getAllAttempts(): QuizAttempt[] {
  let rawAttempts = safeGet<QuizAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
  if (rawAttempts.length === 0) {
    const hasExplicitReset = safeGet<boolean>('mahi_quiz_explicitly_reset_v1', false);
    if (!hasExplicitReset) {
      ensureMahiBaselineAttempt();
      rawAttempts = safeGet<QuizAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
    }
  }
  // Sort descending by timestamp (newest first)
  return rawAttempts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
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

/**
 * Baseline attempt metadata reference for audit and verification (Day 01, 30 marks, 86 seconds, Outstanding)
 * Restores all 30 questions with correct answers mapped.
 */
export function getOrRecoverBaselineAttempts(autoInject = false): QuizAttempt[] {
  const day01Quiz = getQuizForDay('day-01');
  const answers: Record<string, number> = {};
  if (day01Quiz && day01Quiz.questions) {
    day01Quiz.questions.forEach((q) => {
      answers[q.id] = q.correctAnswer;
    });
  }

  const baselineAttempt: QuizAttempt = {
    id: 'attempt-mahi-day01-100',
    quizId: 'day-01',
    dayNumber: 1,
    studentId: '00000000-0000-0000-0000-000000002002',
    studentName: 'Mahi',
    studentEmail: 'mahi@boddukuri.quiz',
    statesCovered: day01Quiz ? day01Quiz.statesCovered : [
      'Madhya Pradesh', 'Andhra Pradesh', 'Telangana', 'Kerala', 'Assam', 'Karnataka'
    ],
    timestamp: '2026-11-09T14:56:00.000Z',
    formattedDate: '09 November 2026',
    quizDate: '2026-11-09',
    displayDate: '09 November 2026',
    answers,
    totalQuestions: 30,
    correctCount: 30,
    incorrectCount: 0,
    unansweredCount: 0,
    marksObtained: 30,
    maxMarks: 30,
    percentage: 100,
    accuracy: 100,
    timeTakenSeconds: 86,
    performanceTier: 'outstanding',
    performanceMessage: 'Outstanding',
    status: 'completed',
    submissionId: 'sub_baseline_mahi_day01_100',
    quote: {
      quote: 'Every day you learn something new, you become a better version of yourself.',
      personalNote: 'Keep learning, Mahi! 💚'
    },
    sectionBreakdown: {
      previous: { total: 0, correct: 0, incorrect: 0, unanswered: 0, percentage: 0 },
      new: { total: 30, correct: 30, incorrect: 0, unanswered: 0, percentage: 100 }
    }
  };

  if (autoInject) {
    saveQuizAttempt(baselineAttempt);
  }
  return [baselineAttempt];
}

/**
 * Ensures Mahi's Day 01 baseline attempt exists with full answer mappings.
 */
export function ensureMahiBaselineAttempt(): QuizAttempt {
  const attempts = safeGet<QuizAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
  let day01 = attempts.find(a => a.quizId === 'day-01');
  const day01Quiz = getQuizForDay('day-01');

  const answers: Record<string, number> = {};
  if (day01Quiz?.questions) {
    day01Quiz.questions.forEach((q) => {
      answers[q.id] = q.correctAnswer;
    });
  }

  if (day01) {
    // If existing day01 attempt has empty answers or needs recovery, enrich it
    if (!day01.answers || Object.keys(day01.answers).length === 0 || day01.marksObtained !== 30) {
      day01 = {
        ...day01,
        marksObtained: 30,
        maxMarks: 30,
        percentage: 100,
        correctCount: 30,
        incorrectCount: 0,
        unansweredCount: 0,
        timeTakenSeconds: 86,
        performanceTier: 'outstanding',
        performanceMessage: 'Outstanding',
        status: 'completed',
        answers: Object.keys(day01.answers || {}).length > 0 ? (day01.answers as Record<string, number>) : answers
      };
      saveQuizAttempt(day01);
    }
    return day01;
  }

  const baseline = getOrRecoverBaselineAttempts(false)[0]!;
  saveQuizAttempt(baseline);
  return baseline;
}

export function saveQuizAttempt(attempt: QuizAttempt): void {
  const attempts = getAllAttempts();

  // Ensure student metadata
  const enrichedAttempt: QuizAttempt = {
    ...attempt,
    studentId: attempt.studentId || 'mahi_student',
    studentName: attempt.studentName || 'Mahi',
    studentEmail: attempt.studentEmail || 'mahi@boddukuri.quiz',
    submissionId: attempt.submissionId || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: 'completed'
  };

  // Deduplicate by attempt ID
  const filtered = attempts.filter(a => a.id !== enrichedAttempt.id);
  const updatedAttempts = [enrichedAttempt, ...filtered];
  safeSet(STORAGE_KEYS.ATTEMPTS, updatedAttempts);

  // Mark this day as completed
  const completedDays = getCompletedDayIds();
  if (!completedDays.includes(enrichedAttempt.quizId)) {
    completedDays.push(enrichedAttempt.quizId);
    safeSet(STORAGE_KEYS.COMPLETED_DAYS, completedDays);
  }

  // Clear in-progress session for this quiz
  clearInProgressQuiz(enrichedAttempt.quizId);

  // Automatically create Admin Inbox notification
  const mins = Math.floor(enrichedAttempt.timeTakenSeconds / 60);
  const secs = enrichedAttempt.timeTakenSeconds % 60;
  const timeTakenFormatted = `${mins}m ${secs}s`;
  const quizTitle = `Day ${enrichedAttempt.dayNumber < 10 ? '0' + enrichedAttempt.dayNumber : enrichedAttempt.dayNumber}`;

  const adminNotif: InboxNotification = {
    id: `notif-admin-${enrichedAttempt.id}`,
    targetRole: 'admin',
    type: 'submission',
    title: `Mahi completed ${quizTitle}`,
    message: `Mahi has successfully completed ${quizTitle} with a score of ${enrichedAttempt.marksObtained}/${enrichedAttempt.maxMarks} (${enrichedAttempt.percentage}%).`,
    quizId: enrichedAttempt.quizId,
    attemptId: enrichedAttempt.id,
    dayNumber: enrichedAttempt.dayNumber,
    studentName: 'Mahi',
    scoreText: `${enrichedAttempt.marksObtained}/${enrichedAttempt.maxMarks}`,
    percentage: enrichedAttempt.percentage,
    timeTakenText: timeTakenFormatted,
    read: false,
    createdAt: enrichedAttempt.timestamp
  };
  saveInboxNotification(adminNotif);

  // Also create student notification
  const studentNotif: InboxNotification = {
    id: `notif-student-${enrichedAttempt.id}`,
    targetRole: 'student',
    type: 'submission',
    title: `${quizTitle} Completed!`,
    message: `You scored ${enrichedAttempt.marksObtained}/${enrichedAttempt.maxMarks} (${enrichedAttempt.percentage}%) in ${timeTakenFormatted}. Keep up the great work!`,
    quizId: enrichedAttempt.quizId,
    attemptId: enrichedAttempt.id,
    dayNumber: enrichedAttempt.dayNumber,
    scoreText: `${enrichedAttempt.marksObtained}/${enrichedAttempt.maxMarks}`,
    percentage: enrichedAttempt.percentage,
    read: false,
    createdAt: enrichedAttempt.timestamp
  };
  saveInboxNotification(studentNotif);

  markProgressChanged();

  // Broadcast Realtime submission event
  void broadcastQuizEvent('quiz_submitted', {
    attempt: enrichedAttempt,
    snapshot: getProgressSnapshot(),
    adminNotification: adminNotif,
    timestamp: enrichedAttempt.timestamp
  });
}

// -------------------------------------------------------------
// COMPLETED DAYS (ACCURATELY DERIVED FROM PERSISTED ATTEMPTS)
// -------------------------------------------------------------

export function getCompletedDayIds(): string[] {
  const attempts = getAllAttempts();
  const set = new Set<string>();
  attempts.forEach(a => {
    if (a.quizId) set.add(a.quizId);
  });
  return Array.from(set);
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
  markProgressChanged();
}

export function clearInProgressQuiz(quizId: string): void {
  const map = safeGet<Record<string, InProgressQuiz>>(STORAGE_KEYS.IN_PROGRESS, {});
  if (map[quizId]) {
    delete map[quizId];
    safeSet(STORAGE_KEYS.IN_PROGRESS, map);
    markProgressChanged();
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
 * Formats date strictly in Asia/Kolkata timezone (YYYY-MM-DD)
 */
export function getKolkataDateString(dateInput: Date | string | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(d);
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
 * Calculates continuous daily streak based on unique local calendar days in Asia/Kolkata timezone
 */
export function calculateCurrentStreak(attempts: QuizAttempt[]): number {
  if (!attempts || attempts.length === 0) return 0;

  // Get sorted unique dates (YYYY-MM-DD in Asia/Kolkata timezone)
  const uniqueDates = Array.from(
    new Set(attempts.map(a => getKolkataDateString(a.timestamp)).filter(Boolean))
  ).sort().reverse();

  if (uniqueDates.length === 0) return 0;

  const now = new Date();
  const today = getKolkataDateString(now);
  const yesterday = getKolkataDateString(new Date(now.getTime() - 86400000));

  // If latest attempt is neither today nor yesterday in Kolkata, streak is 0
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
    new Set(attempts.map(a => getKolkataDateString(a.timestamp)).filter(Boolean))
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
  const attemptDates = new Set(attempts.map(a => getKolkataDateString(a.timestamp)).filter(Boolean));
  const today = new Date();
  const todayStr = getKolkataDateString(today);

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
    const dStr = getKolkataDateString(d);
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
  markProgressChanged(true);
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
  bookmarks?: string[];
}

export function exportBackupData(): string {
  const data: BackupData = {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    settings: getUserSettings(),
    attempts: getAllAttempts(),
    completedDays: getCompletedDayIds(),
    inProgress: safeGet<Record<string, InProgressQuiz>>(STORAGE_KEYS.IN_PROGRESS, {}),
    bookmarks: getBookmarks()
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
    if (data.bookmarks && Array.isArray(data.bookmarks)) safeSet(STORAGE_KEYS.BOOKMARKS, data.bookmarks);

    return {
      success: true,
      message: `Successfully imported ${data.attempts.length} attempts and ${data.completedDays?.length || 0} completed days!`
    };
  } catch (err: unknown) {
    return { success: false, message: `Import failed: ${(err as Error)?.message || 'Unknown error'}` };
  }
}

export function deleteAttemptById(attemptId: string): void {
  const attempts = getAllAttempts();
  const target = attempts.find(a => a.id === attemptId);
  if (!target) return;

  const remaining = attempts.filter(a => a.id !== attemptId);
  safeSet(STORAGE_KEYS.ATTEMPTS, remaining);

  // If no attempts remain for this quiz, remove it from completedDays
  const stillHasAttempt = remaining.some(a => a.quizId === target.quizId);
  if (!stillHasAttempt) {
    const completed = getCompletedDayIds().filter(id => id !== target.quizId);
    safeSet(STORAGE_KEYS.COMPLETED_DAYS, completed);
  }

  markProgressChanged();
}

export function resetDayProgress(quizId: string): void {
  const attempts = getAllAttempts().filter(a => a.quizId !== quizId);
  safeSet(STORAGE_KEYS.ATTEMPTS, attempts);

  const completed = getCompletedDayIds().filter(id => id !== quizId);
  safeSet(STORAGE_KEYS.COMPLETED_DAYS, completed);

  clearInProgressQuiz(quizId);

  const retakes = getRetakeRequests().filter(r => r.quizId !== quizId);
  safeSet(STORAGE_KEYS.RETAKE_REQUESTS, retakes);

  if (quizId === 'day-01') {
    safeSet('mahi_quiz_explicitly_reset_v1', true);
  }

  markProgressChanged();
}

/**
 * Manually marks a scheduled day as completed by Sanju with full question answers and audit record.
 */
export function markDayCompleted(params: {
  quizId: string;
  dayNumber: number;
  dateStr?: string;
  marksObtained: number;
  maxMarks: number;
  timeTakenSeconds: number;
  notes?: string;
  recordedBy?: string;
}): QuizAttempt {
  const dayQuiz = getQuizForDay(params.quizId);
  const percentage = Math.round((params.marksObtained / (params.maxMarks || 1)) * 100);
  const correctCount = params.marksObtained;
  const incorrectCount = Math.max(0, params.maxMarks - params.marksObtained);

  const answers: Record<string, number> = {};
  if (dayQuiz?.questions) {
    dayQuiz.questions.forEach((q, idx) => {
      if (idx < params.marksObtained) {
        answers[q.id] = q.correctAnswer;
      } else {
        const wrongOpt = [0, 1, 2, 3].find(k => k !== q.correctAnswer) ?? 0;
        answers[q.id] = wrongOpt;
      }
    });
  }

  const mins = Math.floor(params.timeTakenSeconds / 60);
  const secs = params.timeTakenSeconds % 60;
  const timeTakenFormatted = `${mins}m ${secs}s`;

  const attempt: QuizAttempt = {
    id: `attempt-manual-${params.quizId}-${Date.now()}`,
    quizId: params.quizId,
    dayNumber: params.dayNumber,
    studentId: '00000000-0000-0000-0000-000000002002',
    studentName: 'Mahi',
    studentEmail: 'mahi@boddukuri.quiz',
    statesCovered: dayQuiz ? dayQuiz.statesCovered : [],
    timestamp: new Date().toISOString(),
    formattedDate: params.dateStr || '09 November 2026',
    quizDate: params.dateStr || new Date().toISOString().split('T')[0],
    displayDate: params.dateStr || '09 November 2026',
    answers,
    totalQuestions: params.maxMarks,
    correctCount,
    incorrectCount,
    unansweredCount: 0,
    marksObtained: params.marksObtained,
    maxMarks: params.maxMarks,
    percentage,
    accuracy: percentage,
    timeTakenSeconds: params.timeTakenSeconds,
    performanceTier: percentage === 100 ? 'outstanding' : percentage >= 80 ? 'excellent' : 'good',
    performanceMessage: percentage === 100 ? 'Outstanding' : percentage >= 80 ? 'Great job!' : 'Completed',
    status: 'completed',
    submissionId: `admin_manual_${Date.now()}`,
    sectionBreakdown: {
      previous: { total: 0, correct: 0, incorrect: 0, unanswered: 0, percentage: 0 },
      new: { total: params.maxMarks, correct: correctCount, incorrect: incorrectCount, unanswered: 0, percentage }
    },
    quote: {
      quote: 'Every day you learn something new, you become a better version of yourself.',
      personalNote: 'Recorded by Admin'
    }
  };

  saveQuizAttempt(attempt);
  clearInProgressQuiz(params.quizId);

  // Student notification
  const studentNotif: InboxNotification = {
    id: `notif-student-manual-${Date.now()}`,
    targetRole: 'student',
    type: 'submission',
    title: `Day 0${params.dayNumber} Completion Recorded`,
    message: `Sanju recorded completion for Day 0${params.dayNumber}: ${params.marksObtained}/${params.maxMarks} (${percentage}%) in ${timeTakenFormatted}.`,
    quizId: params.quizId,
    attemptId: attempt.id,
    dayNumber: params.dayNumber,
    scoreText: `${params.marksObtained}/${params.maxMarks}`,
    percentage,
    read: false,
    createdAt: new Date().toISOString()
  };
  saveInboxNotification(studentNotif);

  return attempt;
}

export function resetAllData(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.IN_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_DAYS);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    localStorage.removeItem(STORAGE_KEYS.RETAKE_REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem('mahi_quiz_sync_meta_v1');
    localStorage.removeItem('mahi_quiz_whatsapp_logs_v1');
    localStorage.setItem('mahi_quiz_explicitly_reset_v1', 'true');
  }
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem('mahi_motivation_seen');
  }
  saveUserSettings({
    sanjuWhatsAppNumber: DEFAULT_SANJU_WHATSAPP_NUMBER,
    studentName: 'Mahi'
  });
  markProgressChanged();
  void broadcastQuizEvent('progress_reset', { by: 'admin', timestamp: new Date().toISOString() });
}

export const resetAllMahiProgress = resetAllData;
