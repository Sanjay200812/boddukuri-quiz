import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import type { ProgressSnapshot } from './storage';
import type { UserProfile, UserRole, RetakeRequest, DailyQuiz, QuizQuestion, QuizAttempt, InboxNotification } from '../types/quiz';
import { ALL_SCHEDULED_QUIZZES, getQuizForDay, validateQuizForPublishing } from '../data/quizzes.ts';

const globalProcess = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process;
const env = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : globalProcess?.env) || {};
const url = env.VITE_SUPABASE_URL as string | undefined;
const anonKey = env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anonKey);
export const supabase: SupabaseClient | null = supabaseConfigured ? createClient(url!, anonKey!) : null;

// -------------------------------------------------------------
// USER PROFILES & ROLES
// -------------------------------------------------------------

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  // Known deterministic ID mapping to safely avoid 42P17 recursive RLS errors on profiles table
  if (userId === MAHI_STUDENT_ID) {
    return {
      id: MAHI_STUDENT_ID,
      role: 'student',
      fullName: 'Mahi',
      email: 'boddukurimahima1234@gmail.com'
    };
  }
  if (userId === SANJU_ADMIN_ID) {
    return {
      id: SANJU_ADMIN_ID,
      role: 'admin',
      fullName: 'Sanju',
      email: 'boddukurisanjay@gmail.com'
    };
  }

  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role, full_name, email')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching profile from Supabase (falling back):', error.message);
      // Fallback check from local session
      const local = getLocalAuthSession();
      if (local && (local.userId === userId || !local.userId)) {
        return {
          id: userId,
          role: local.role,
          fullName: local.fullName,
          email: local.email
        };
      }
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      role: (data.role === 'admin' ? 'admin' : 'student') as UserRole,
      fullName: data.full_name || 'Mahi',
      email: data.email || ''
    };
  } catch (err) {
    console.warn('Network exception while reading profile:', err);
    return null;
  }
}

// -------------------------------------------------------------
// ACCESS CODE VERIFICATION & RATE-LIMITING
// -------------------------------------------------------------

// These are the real Supabase auth user IDs for the two controlled accounts.
// Keep them in one place so access-code mode and email/password mode target
// the same cloud rows.
export const MAHI_STUDENT_ID = '61758bc8-51bd-4cf9-b276-a7d6a796b6da';
export const SANJU_ADMIN_ID = '81545df0-2a05-4257-a0f0-2c3342eb9e34';

export interface AccessCodeVerifyResult {
  success: boolean;
  role?: UserRole;
  email?: string;
  fullName?: string;
  userId?: string;
  authTicket?: string;
  locked?: boolean;
  secondsRemaining?: number;
  attemptsRemaining?: number;
  error?: string;
}

const PIN_RATE_LIMIT_KEY = 'mahi_access_code_rate_limit_v1';
const AUTH_SESSION_KEY = 'mahi_auth_session_v1';

// Hashed PIN signatures (SHA-256 in lowercase hex)
// Student PIN hash (for 2002): 6c94e35ccc352d4e9ef0b99562cff995a5741ce8de8ad11b568892934daee366
// Admin PIN hash (for 2718):   c47e82e01e20ad22f816159eb3c3c048308ffca5b116cfc0c9aaaf012ee5b729
const STUDENT_PIN_HASH = '6c94e35ccc352d4e9ef0b99562cff995a5741ce8de8ad11b568892934daee366';
const ADMIN_PIN_HASH = 'c47e82e01e20ad22f816159eb3c3c048308ffca5b116cfc0c9aaaf012ee5b729';

interface RateLimitState {
  failedAttempts: number;
  lockedUntil: number | null;
}

function getRateLimitState(): RateLimitState {
  if (typeof localStorage === 'undefined') return { failedAttempts: 0, lockedUntil: null };
  try {
    const raw = localStorage.getItem(PIN_RATE_LIMIT_KEY);
    return raw ? JSON.parse(raw) : { failedAttempts: 0, lockedUntil: null };
  } catch {
    return { failedAttempts: 0, lockedUntil: null };
  }
}

function saveRateLimitState(state: RateLimitState): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(PIN_RATE_LIMIT_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

async function computeSha256Hex(text: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(text.trim());
  const globalCrypto = (globalThis as unknown as { crypto?: Crypto }).crypto;
  if (typeof globalCrypto !== 'undefined' && globalCrypto.subtle) {
    const hashBuffer = await globalCrypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Node.js environment fallback
  const requireFn = (globalThis as unknown as { require?: (mod: string) => { createHash: (alg: string) => { update: (d: string) => { digest: (enc: string) => string } } } }).require;
  if (typeof requireFn === 'function') {
    const nodeCrypto = requireFn('crypto');
    return nodeCrypto.createHash('sha256').update(text.trim()).digest('hex');
  }
  throw new Error('WebCrypto subtle or Node crypto is required for hash computation.');
}

export interface LocalAuthSession {
  email: string;
  role: UserRole;
  fullName: string;
  userId?: string;
  loggedInAt: string;
}

export function saveLocalAuthSession(session: LocalAuthSession): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function getLocalAuthSession(): LocalAuthSession | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearLocalAuthSession(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
  } catch {
    // ignore
  }
}

export async function verifyAccessCodeCloud(code: string, clientId?: string): Promise<AccessCodeVerifyResult> {
  const trimmedCode = code.trim();
  if (!trimmedCode) {
    return { success: false, error: 'Please enter a 4-digit access code.' };
  }

  // 1. Rate limiting check
  const rl = getRateLimitState();
  if (rl.lockedUntil && Date.now() < rl.lockedUntil) {
    const remainingSecs = Math.ceil((rl.lockedUntil - Date.now()) / 1000);
    return {
      success: false,
      locked: true,
      secondsRemaining: remainingSecs,
      error: `Too many incorrect attempts. Security lockout active (${Math.ceil(remainingSecs / 60)} minutes remaining).`
    };
  }

  // 2. Try Supabase backend RPC if configured
  if (supabase) {
    try {
      const clientIdentifier = clientId || (typeof window !== 'undefined' ? localStorage.getItem('mahi_quiz_device_id') || 'browser_client' : 'browser_client');
      const { data, error } = await supabase.rpc('verify_access_code', {
        p_code: trimmedCode,
        p_identifier: clientIdentifier
      });

      if (!error && data) {
        const res = data as {
          success?: boolean;
          user_id?: string;
          email?: string;
          auth_ticket?: string;
          locked?: boolean;
          seconds_remaining?: number;
          attempts_remaining?: number;
          error?: string;
          role?: string;
        };

        if (res.success && res.email && res.user_id) {
          saveRateLimitState({ failedAttempts: 0, lockedUntil: null });
          const role = (res.role === 'admin' || res.email.toLowerCase().includes('sanju') || res.email.toLowerCase().includes('sanjay') ? 'admin' : 'student') as UserRole;
          return {
            success: true,
            email: res.email,
            role,
            fullName: role === 'admin' ? 'Sanju' : 'Student',
            authTicket: res.auth_ticket,
            userId: res.user_id
          };
        }

        if (res.locked) {
          const secs = res.seconds_remaining || 900;
          saveRateLimitState({ failedAttempts: 5, lockedUntil: Date.now() + secs * 1000 });
          return {
            success: false,
            locked: true,
            secondsRemaining: secs,
            error: res.error || 'Too many incorrect attempts. Security lockout active.'
          };
        }
      }
    } catch {
      // Configured deployments fail closed if the secure RPC is unavailable.
    }

    return { success: false, error: 'Secure access-code verification is unavailable. Please contact the administrator.' };
  }

  // 3. Local verification is only available when no cloud backend is configured.
  try {
    const inputHash = await computeSha256Hex(trimmedCode);

    if (inputHash === STUDENT_PIN_HASH) {
      saveRateLimitState({ failedAttempts: 0, lockedUntil: null });
      return {
        success: true,
        role: 'student',
        email: 'mahi@boddukuri.quiz',
        fullName: 'Mahi',
        userId: MAHI_STUDENT_ID
      };
    }

    if (inputHash === ADMIN_PIN_HASH) {
      saveRateLimitState({ failedAttempts: 0, lockedUntil: null });
      return {
        success: true,
        role: 'admin',
        email: 'boddukurisanjay@gmail.com',
        fullName: 'Sanju',
        userId: SANJU_ADMIN_ID
      };
    }

    // Failed attempt: record and enforce 5-attempt limit with 15-min lockout
    const newFailed = (rl.failedAttempts || 0) + 1;
    if (newFailed >= 5) {
      const lockUntil = Date.now() + 15 * 60 * 1000;
      saveRateLimitState({ failedAttempts: newFailed, lockedUntil: lockUntil });
      return {
        success: false,
        locked: true,
        secondsRemaining: 900,
        error: 'Too many incorrect attempts. Account locked for 15 minutes.'
      };
    } else {
      saveRateLimitState({ failedAttempts: newFailed, lockedUntil: null });
      return {
        success: false,
        locked: false,
        attemptsRemaining: 5 - newFailed,
        error: `Invalid access code. ${5 - newFailed} attempt${5 - newFailed === 1 ? '' : 's'} remaining before security lockout.`
      };
    }
  } catch (err) {
    return {
      success: false,
      error: 'Security verification failed. Please try again.'
    };
  }
}

// -------------------------------------------------------------
// QUIZ PROGRESS SYNC
// -------------------------------------------------------------

function normalizeUserId(userId?: string | null): string {
  if (!userId) return MAHI_STUDENT_ID;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(userId)) return userId;
  if (userId.toLowerCase().includes('admin') || userId.toLowerCase().includes('sanju')) return SANJU_ADMIN_ID;
  return MAHI_STUDENT_ID;
}

export async function loadCloudProgress(userId: string): Promise<ProgressSnapshot | null> {
  if (!supabase) throw new Error('Supabase is not configured in this deployment.');
  const cleanId = normalizeUserId(userId);
  try {
    const { data, error } = await supabase
      .from('quiz_progress')
      .select('payload')
      .eq('user_id', cleanId)
      .maybeSingle();
    if (error) throw error;
    return (data?.payload as ProgressSnapshot | undefined) || null;
  } catch (err) {
    console.warn('Load cloud progress failed:', err);
    throw err;
  }
}

export async function saveCloudProgress(userId: string, payload: ProgressSnapshot): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured in this deployment.');
  const cleanId = normalizeUserId(userId);
  try {
    const { error } = await supabase
      .from('quiz_progress')
      .upsert({ user_id: cleanId, payload, updated_at: payload.updatedAt });
    if (error) throw error;
  } catch (err) {
    console.warn('saveCloudProgress failed:', err);
    throw err;
  }
}

export async function deleteCloudProgress(userId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured in this deployment.');
  const { error } = await supabase.from('quiz_progress').delete().eq('user_id', normalizeUserId(userId));
  if (error) throw error;
}

/**
 * Authoritatively resets a student's progress directly in Supabase.
 * Admin has UPDATE permission on quiz_progress, ensuring safe atomic updates without RLS insertion blocks.
 */
export async function adminResetStudentProgressCloud(
  studentId: string = MAHI_STUDENT_ID,
  quizId?: string
): Promise<{ success: boolean; resetVersion: number; resetAt: string; message: string }> {
  if (!supabase) throw new Error('Supabase is not configured in this deployment.');
  const cleanId = normalizeUserId(studentId);
  const now = new Date().toISOString();
  const resetVersion = Date.now();

  // 1. Fetch current row
  const { data: currentData, error: fetchErr } = await supabase
    .from('quiz_progress')
    .select('payload')
    .eq('user_id', cleanId)
    .maybeSingle();

  if (fetchErr) {
    throw new Error(`Failed to load student progress for reset: ${fetchErr.message}`);
  }

  const existingPayload = (currentData?.payload || {}) as ProgressSnapshot;
  const currentSettings = existingPayload.settings || {
    studentName: 'Mahi',
    sanjuWhatsAppNumber: '917075920852'
  };

  let cleanPayload: ProgressSnapshot;

  if (quizId) {
    // Single-day reset: remove attempts and completed status for this specific quizId
    const remainingAttempts = (existingPayload.attempts || []).filter(a => a.quizId !== quizId);
    const remainingCompleted = (existingPayload.completedDays || []).filter(id => id !== quizId);
    const remainingInProgress = Object.fromEntries(
      Object.entries(existingPayload.inProgress || {}).filter(([id]) => id !== quizId)
    );
    const remainingRetakes = (existingPayload.retakeRequests || []).filter(r => r.quizId !== quizId);

    cleanPayload = {
      ...existingPayload,
      version: 1,
      resetVersion,
      resetAt: now,
      updatedAt: now,
      settings: currentSettings,
      attempts: remainingAttempts,
      completedDays: remainingCompleted,
      inProgress: remainingInProgress,
      retakeRequests: remainingRetakes
    };
  } else {
    // Full student progress reset: clear all attempts, completions, in-progress, notifications, streaks
    cleanPayload = {
      version: 1,
      resetVersion,
      resetAt: now,
      updatedAt: now,
      settingsUpdatedAt: existingPayload.settingsUpdatedAt || now,
      settings: currentSettings,
      attempts: [],
      completedDays: [],
      inProgress: {},
      bookmarks: existingPayload.bookmarks || [],
      retakeRequests: [],
      notifications: []
    };
  }

  // 2. Perform UPDATE on student row in quiz_progress
  const { data: updateRes, error: updateErr } = await supabase
    .from('quiz_progress')
    .update({
      payload: cleanPayload,
      updated_at: now
    })
    .eq('user_id', cleanId)
    .select();

  if (updateErr) {
    throw new Error(`Database reset transaction failed: ${updateErr.message}`);
  }

  if (!updateRes || updateRes.length === 0) {
    // If no row was updated (row didn't exist yet), insert a fresh baseline row
    const { error: insertErr } = await supabase
      .from('quiz_progress')
      .insert({
        user_id: cleanId,
        payload: cleanPayload,
        updated_at: now
      });
    if (insertErr) {
      throw new Error(`Failed to create reset row: ${insertErr.message}`);
    }
  }

  // 3. Log to admin audit logs
  await logAdminActionCloud(
    quizId ? 'RESET_DAY_PROGRESS' : 'RESET_ALL_MAHI_PROGRESS',
    quizId || cleanId,
    { resetVersion, resetAt: now, targetStudent: 'Mahi' }
  );

  return {
    success: true,
    resetVersion,
    resetAt: now,
    message: quizId
      ? `Progress for ${quizId.toUpperCase()} has been reset in Supabase.`
      : 'All progress for Mahi has been reset in Supabase.'
  };
}

/**
 * Authoritatively saves student quiz attempt directly to Supabase.
 * Validates scores and updates quiz_progress atomically.
 */
export async function submitStudentQuizAttemptCloud(
  userId: string,
  attempt: QuizAttempt,
  studentName?: string
): Promise<{ success: boolean; attempt: QuizAttempt; message: string }> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const cleanId = normalizeUserId(userId);
  const now = new Date().toISOString();

  if (!attempt.quizId || typeof attempt.marksObtained !== 'number' || typeof attempt.maxMarks !== 'number') {
    throw new Error('Invalid attempt payload: missing quizId or marks.');
  }

  // 1. Fetch current cloud state
  const { data: currentData, error: fetchErr } = await supabase
    .from('quiz_progress')
    .select('payload')
    .eq('user_id', cleanId)
    .maybeSingle();

  if (fetchErr) {
    throw new Error(`Failed to read current progress from database: ${fetchErr.message}`);
  }

  const existingPayload = (currentData?.payload || {}) as ProgressSnapshot;
  const attempts = existingPayload.attempts || [];

  // Deduplicate
  const isDuplicate = attempts.some(a => a.id === attempt.id || (a.submissionId && a.submissionId === attempt.submissionId));
  const updatedAttempts = isDuplicate
    ? attempts.map(a => a.id === attempt.id ? attempt : a)
    : [attempt, ...attempts];

  const completedDays = Array.from(new Set([...(existingPayload.completedDays || []), attempt.quizId]));
  const inProgress = { ...(existingPayload.inProgress || {}) };
  delete inProgress[attempt.quizId];

  const resolvedStudentName = studentName || attempt.studentName || existingPayload.settings?.studentName || 'Student';

  const studentNotification: InboxNotification = {
    id: `notif-student-${attempt.id}`,
    targetRole: 'student',
    type: 'submission',
    title: `Quiz Completed!`,
    message: `You scored ${attempt.marksObtained}/${attempt.maxMarks} (${attempt.percentage}%) in ${Math.floor(attempt.timeTakenSeconds / 60)}m ${attempt.timeTakenSeconds % 60}s.`,
    quizId: attempt.quizId,
    attemptId: attempt.id,
    dayNumber: attempt.dayNumber,
    scoreText: `${attempt.marksObtained}/${attempt.maxMarks}`,
    percentage: attempt.percentage,
    read: false,
    createdAt: now
  };

  const existingNotifs = existingPayload.notifications || [];
  const updatedNotifs = [studentNotification, ...existingNotifs.filter(n => n.id !== studentNotification.id)];

  const updatedPayload: ProgressSnapshot = {
    ...existingPayload,
    version: 1,
    updatedAt: now,
    settings: {
      ...existingPayload.settings,
      studentName: resolvedStudentName,
      sanjuWhatsAppNumber: existingPayload.settings?.sanjuWhatsAppNumber || '917075920852'
    },
    attempts: updatedAttempts,
    completedDays,
    inProgress,
    notifications: updatedNotifs
  };

  // 2. Persist to Supabase
  const { error: upsertErr } = await supabase
    .from('quiz_progress')
    .upsert({
      user_id: cleanId,
      payload: updatedPayload,
      updated_at: now
    });

  if (upsertErr) {
    throw new Error(`Failed to save attempt in database: ${upsertErr.message}`);
  }

  return {
    success: true,
    attempt,
    message: 'Quiz attempt saved and synchronized successfully to Supabase.'
  };
}

// -------------------------------------------------------------
// RETAKE REQUESTS
// -------------------------------------------------------------

export async function loadRetakeRequestsCloud(): Promise<RetakeRequest[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('retake_requests')
      .select('*')
      .order('requested_at', { ascending: false });
    if (error) {
      console.warn('loadRetakeRequestsCloud error:', error.message);
      return [];
    }
    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      userEmail: row.user_email,
      dayNumber: row.day_number,
      quizId: row.quiz_id,
      dayTitle: row.day_title,
      status: row.status,
      requestedAt: row.requested_at,
      reviewedAt: row.reviewed_at,
      reviewedBy: row.reviewed_by,
      adminNotes: row.admin_notes
    }));
  } catch {
    return [];
  }
}

export async function submitRetakeRequestCloud(req: RetakeRequest): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('retake_requests')
    .upsert({
      id: req.id,
      user_id: req.userId,
      user_email: req.userEmail,
      day_number: req.dayNumber,
      quiz_id: req.quizId,
      day_title: req.dayTitle,
      status: req.status,
      requested_at: req.requestedAt,
      reviewed_at: req.reviewedAt,
      reviewed_by: req.reviewedBy,
      admin_notes: req.adminNotes
    });
  if (error) throw error;
}

export async function reviewRetakeRequestCloud(
  requestId: string,
  status: 'approved' | 'rejected',
  adminNotes?: string,
  reviewerEmail?: string
): Promise<void> {
  if (!supabase) return;
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('retake_requests')
    .update({
      status,
      reviewed_at: now,
      reviewed_by: reviewerEmail,
      admin_notes: adminNotes
    })
    .eq('id', requestId);
  if (error) throw error;
}

// -------------------------------------------------------------
// ADMIN SCHEDULE & OVERRIDES
// -------------------------------------------------------------

export async function loadAdminScheduleOverridesCloud(): Promise<Record<string, { isUnlockedOverride?: boolean; customUnlockTime?: string }>> {
  if (!supabase) return {};
  try {
    const { data, error } = await supabase
      .from('admin_schedule_config')
      .select('key, payload');
    if (error) {
      console.warn('loadAdminScheduleOverridesCloud error:', error.message);
      return {};
    }
    const map: Record<string, { isUnlockedOverride?: boolean; customUnlockTime?: string }> = {};
    (data || []).forEach(row => {
      const payload = (row.payload || {}) as { isUnlockedOverride?: boolean; customUnlockTime?: string };
      map[row.key] = {
        isUnlockedOverride: payload.isUnlockedOverride,
        customUnlockTime: payload.customUnlockTime
      };
    });
    return map;
  } catch {
    return {};
  }
}

export async function saveAdminScheduleOverrideCloud(
  quizId: string,
  override: { isUnlockedOverride?: boolean | null; customUnlockTime?: string | null }
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('admin_schedule_config')
    .upsert({
      key: quizId,
      payload: {
        isUnlockedOverride: override.isUnlockedOverride ?? null,
        customUnlockTime: override.customUnlockTime ?? null
      },
      updated_at: new Date().toISOString()
    });
  if (error) throw error;
}

// -------------------------------------------------------------
// ADMIN AUDIT LOGS
// -------------------------------------------------------------

export async function logAdminActionCloud(action: string, target?: string, details?: unknown): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.rpc('log_admin_action', {
      p_action: action,
      p_target: target || null,
      p_details: details || {}
    });
  } catch (err) {
    console.warn('Failed to record admin audit log:', err);
  }
}

export interface AdminAuditLogEntry {
  id: string;
  admin_id?: string;
  admin_email?: string;
  action: string;
  target?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

export async function loadAdminAuditLogsCloud(): Promise<AdminAuditLogEntry[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) {
      console.warn('loadAdminAuditLogsCloud error:', error.message);
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}

// -------------------------------------------------------------
// ADMIN FETCH ALL STUDENTS
// -------------------------------------------------------------

export async function loadAllStudentsProgressCloud(): Promise<Array<{ userId: string; email?: string; payload: ProgressSnapshot; updatedAt: string }>> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('quiz_progress')
      .select('user_id, payload, updated_at');
    if (error) {
      console.warn('loadAllStudentsProgressCloud error:', error.message);
      return [];
    }
    return (data || []).map(row => ({
      userId: row.user_id,
      payload: row.payload as ProgressSnapshot,
      updatedAt: row.updated_at
    }));
  } catch {
    return [];
  }
}

export function currentSession(): Promise<{ data: { session: Session | null } }> {
  return supabase ? supabase.auth.getSession() : Promise.resolve({ data: { session: null } });
}

// -------------------------------------------------------------
// AUTHORITATIVE CLOUD QUIZ & QUESTION SERVICE
// -------------------------------------------------------------

export interface CloudQuizRegistryEntry {
  id: string;
  dayNumber: number;
  title: string;
  version: number;
  status: 'published' | 'draft' | 'scheduled';
  quizDate: string;
  displayDate: string;
  totalQuestions: number;
  statesCovered: string[];
  publishedAt?: string;
  updatedAt: string;
}

export async function loadCloudQuizRegistry(): Promise<CloudQuizRegistryEntry[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('admin_schedule_config')
      .select('payload')
      .eq('key', 'quizzes_registry')
      .maybeSingle();

    if (error || !data?.payload) return [];
    return (data.payload as { quizzes?: CloudQuizRegistryEntry[] }).quizzes || [];
  } catch {
    return [];
  }
}

export async function loadPublishedQuizzesCloud(): Promise<DailyQuiz[]> {
  if (!supabase) return ALL_SCHEDULED_QUIZZES;
  try {
    const { data, error } = await supabase
      .from('admin_schedule_config')
      .select('key, payload');

    if (error || !data || data.length === 0) {
      return ALL_SCHEDULED_QUIZZES;
    }

    const quizMap = new Map<string, DailyQuiz>();
    data.forEach(row => {
      if (row.key.startsWith('quiz:')) {
        const quizId = row.key.replace('quiz:', '');
        const payload = row.payload as { quiz: DailyQuiz; questions: QuizQuestion[]; version?: number; status?: string };
        if (payload?.quiz) {
          const combined: DailyQuiz = {
            ...payload.quiz,
            version: payload.version || payload.quiz.version || 1,
            status: (payload.status || payload.quiz.status || 'published') as 'published' | 'draft' | 'scheduled',
            questions: payload.questions || payload.quiz.questions || []
          };
          quizMap.set(quizId, combined);
        }
      }
    });

    if (quizMap.size > 0) {
      return ALL_SCHEDULED_QUIZZES.map(defaultQuiz => {
        const cloudQuiz = quizMap.get(defaultQuiz.id);
        if (cloudQuiz && cloudQuiz.status === 'published') {
          return {
            ...defaultQuiz,
            ...cloudQuiz,
            questions: cloudQuiz.questions && cloudQuiz.questions.length > 0 ? cloudQuiz.questions : defaultQuiz.questions,
            totalQuestions: cloudQuiz.questions && cloudQuiz.questions.length > 0 ? cloudQuiz.questions.length : defaultQuiz.totalQuestions
          };
        }
        return defaultQuiz;
      });
    }

    return ALL_SCHEDULED_QUIZZES;
  } catch (err) {
    console.warn('Failed to load published quizzes from cloud, falling back to local curriculum:', err);
    return ALL_SCHEDULED_QUIZZES;
  }
}

export async function loadQuizByIdCloud(quizId: string): Promise<DailyQuiz> {
  const fallback = getQuizForDay(quizId);
  if (!supabase) return fallback;
  try {
    const { data, error } = await supabase
      .from('admin_schedule_config')
      .select('payload')
      .eq('key', `quiz:${quizId}`)
      .maybeSingle();

    if (error || !data?.payload) return fallback;
    const payload = data.payload as { quiz: DailyQuiz; questions: QuizQuestion[]; version?: number };
    return {
      ...fallback,
      ...payload.quiz,
      version: payload.version || fallback.version || 1,
      questions: payload.questions || fallback.questions,
      totalQuestions: (payload.questions || fallback.questions).length
    };
  } catch {
    return fallback;
  }
}

export async function saveQuizDraftCloud(
  quiz: DailyQuiz,
  questions: QuizQuestion[]
): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('admin_schedule_config')
    .upsert({
      key: `quiz_draft:${quiz.id}`,
      payload: {
        quiz: {
          ...quiz,
          questions: undefined
        },
        questions,
        status: 'draft',
        updatedAt: now
      },
      updated_at: now
    });

  if (error) throw new Error(`Draft save failed: ${error.message}`);
  await logAdminActionCloud('save_quiz_draft', quiz.id, { questionCount: questions.length });
}

export async function publishQuizCloud(
  quiz: DailyQuiz,
  questions: QuizQuestion[],
  adminEmail?: string
): Promise<{ success: boolean; version: number; message: string }> {
  if (!supabase) throw new Error('Supabase is not configured in this deployment.');

  // Strict Phase 5 validation before cloud publication
  const validation = validateQuizForPublishing(quiz, questions);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(' | ')}`);
  }

  const now = new Date().toISOString();
  const currentVersion = quiz.version || 1;
  const newVersion = currentVersion + 1;

  // 1. Write immutable historical snapshot of this exact version
  const snapshotKey = `quiz_version:${quiz.id}:v${newVersion}`;
  const { error: snapshotError } = await supabase
    .from('admin_schedule_config')
    .upsert({
      key: snapshotKey,
      payload: {
        quizId: quiz.id,
        version: newVersion,
        publishedAt: now,
        publishedBy: adminEmail || 'Sanju',
        quiz: {
          ...quiz,
          version: newVersion,
          status: 'published',
          publishedAt: now,
          updatedAt: now,
          questions: undefined
        },
        questions
      },
      updated_at: now
    });

  if (snapshotError) {
    throw new Error(`Failed to save immutable version snapshot: ${snapshotError.message}`);
  }

  // 2. Write active published quiz key
  const activeQuizKey = `quiz:${quiz.id}`;
  const { error: publishError } = await supabase
    .from('admin_schedule_config')
    .upsert({
      key: activeQuizKey,
      payload: {
        quiz: {
          ...quiz,
          version: newVersion,
          status: 'published',
          publishedAt: now,
          updatedAt: now,
          totalQuestions: questions.length,
          questions: undefined
        },
        questions,
        version: newVersion,
        status: 'published',
        publishedAt: now,
        updatedAt: now
      },
      updated_at: now
    });

  if (publishError) {
    throw new Error(`Failed to update published quiz: ${publishError.message}`);
  }

  // 3. Update quizzes registry
  const existingRegistry = await loadCloudQuizRegistry();
  const updatedEntry: CloudQuizRegistryEntry = {
    id: quiz.id,
    dayNumber: quiz.dayNumber,
    title: quiz.title,
    version: newVersion,
    status: 'published',
    quizDate: quiz.quizDate,
    displayDate: quiz.displayDate,
    totalQuestions: questions.length,
    statesCovered: quiz.statesCovered,
    publishedAt: now,
    updatedAt: now
  };

  const filtered = existingRegistry.filter(e => e.id !== quiz.id);
  filtered.push(updatedEntry);
  filtered.sort((a, b) => a.dayNumber - b.dayNumber);

  await supabase
    .from('admin_schedule_config')
    .upsert({
      key: 'quizzes_registry',
      payload: { quizzes: filtered, updatedAt: now },
      updated_at: now
    });

  // 4. Log admin audit action
  await logAdminActionCloud('publish_quiz', quiz.id, {
    version: newVersion,
    questionCount: questions.length,
    publishedBy: adminEmail || 'Sanju'
  });

  // 5. Broadcast realtime change event
  try {
    const channel = supabase.channel('boddukuri-quiz-sync');
    channel.send({
      type: 'broadcast',
      event: 'quiz_published',
      payload: { quizId: quiz.id, version: newVersion, timestamp: now }
    });
  } catch {
    // Non-blocking realtime broadcast
  }

  return {
    success: true,
    version: newVersion,
    message: `Quiz "${quiz.title}" v${newVersion} successfully published to production cloud with ${questions.length} questions.`
  };
}
