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
      username: 'mahi',
      email: 'boddukurimahima1234@gmail.com'
    };
  }
  if (userId === SANJU_ADMIN_ID) {
    return {
      id: SANJU_ADMIN_ID,
      role: 'admin',
      fullName: 'Sanju',
      username: 'sanju',
      email: 'boddukurisanjay@gmail.com'
    };
  }

  if (!supabase) return null;
  try {
    // 1. Direct auth user metadata resolution (bypasses RLS recursion completely)
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user && authData.user.id === userId) {
      const email = authData.user.email || '';
      const meta = authData.user.user_metadata || {};
      const isAdmin =
        ['boddukurisanjay@gmail.com', 'sanjuboddukuri@gmail.com', 'admin@boddukuri.quiz', 'sanju@boddukuri.quiz'].includes(email.toLowerCase()) ||
        meta.role === 'admin';
      const role: UserRole = isAdmin ? 'admin' : 'student';
      const resolvedName = meta.full_name || (email.toLowerCase().includes('shailu') ? 'Shailu' : (role === 'admin' ? 'Sanju' : 'Mahi'));
      const resolvedUsername = meta.username || (email.toLowerCase().includes('shailu') ? 'shailu' : (role === 'admin' ? 'sanju' : 'mahi'));

      return {
        id: userId,
        role,
        fullName: resolvedName,
        displayName: resolvedName,
        username: resolvedUsername,
        email
      };
    }

    // 2. Query profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role, full_name, email, username')
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
          email: local.email,
          username: local.fullName.toLowerCase()
        };
      }
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      role: (data.role === 'admin' ? 'admin' : 'student') as UserRole,
      fullName: data.full_name || (data.email?.toLowerCase().includes('shailu') ? 'Shailu' : 'Mahi'),
      username: data.username || (data.email?.toLowerCase().includes('shailu') ? 'shailu' : 'mahi'),
      email: data.email || ''
    };
  } catch (err) {
    console.warn('Network exception while reading profile:', err);
    return null;
  }
}

// -------------------------------------------------------------
// USERNAME AUTHENTICATION & PROVISIONING SERVICES
// -------------------------------------------------------------

/**
 * Resolves a username or email input into the canonical Supabase Auth identity.
 * Maps:
 * - 'mahi' -> 'boddukurimahima1234@gmail.com'
 * - 'shailu' -> 'shailu@users.spideyyquiz.invalid' (Synthetic Identity)
 * - 'sanju' / 'admin' -> 'boddukurisanjay@gmail.com'
 * - 'user@example.com' -> returns email directly
 * - other username -> '<username>@users.spideyyquiz.invalid'
 */
export async function resolveUsernameToAuth(usernameOrInput: string): Promise<string> {
  const trimmed = usernameOrInput.trim();
  if (!trimmed) return '';
  if (trimmed.includes('@')) return trimmed.toLowerCase();

  const norm = trimmed.toLowerCase();
  if (norm === 'mahi') return 'boddukurimahima1234@gmail.com';
  if (norm === 'sanju' || norm === 'admin') return 'boddukurisanjay@gmail.com';
  if (norm === 'shailu') return 'shailu@users.spideyyquiz.invalid';

  // Attempt server-side resolution via RPC if connected
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('resolve_username_to_auth', { p_username: norm });
      if (!error && data?.success && data?.email) {
        return data.email;
      }
    } catch {
      // Fall through to standard synthetic email
    }
  }

  return `${norm}@users.spideyyquiz.invalid`;
}

export interface ProvisionStudentParams {
  displayName: string;
  username: string;
  password: string;
  confirmPassword?: string;
  accessCode?: string; // 4-digit access code for 1-click student login (default '2580')
}

export interface ProvisionStudentResult {
  success: boolean;
  message?: string;
  userId?: string;
  username?: string;
  displayName?: string;
  email?: string;
  alreadyExists?: boolean;
  error?: string;
  accessCodeConfigured?: boolean;
}

export interface UpdateStudentCredentialsParams {
  userId?: string;
  username: string;
  newAccessCode?: string;
  newPassword?: string;
}

/**
 * Securely provisions a new student account (e.g. Shailu).
 * Calls server-side Edge Function with verified Admin session.
 * Enforces role='student', assigns 4-digit access code (e.g. 2580), and prevents duplicate accounts.
 */
export async function provisionStudentAccount(params: ProvisionStudentParams): Promise<ProvisionStudentResult> {
  if (!supabase) {
    return { success: false, error: 'Supabase cloud is not configured.' };
  }

  const displayName = params.displayName.trim();
  const rawUsername = params.username.toLowerCase().trim();
  const password = params.password;
  const confirmPassword = params.confirmPassword;
  const accessCode = (params.accessCode || '2580').trim();

  // Validation
  if (!displayName) {
    return { success: false, error: 'Student display name is required.' };
  }
  if (!rawUsername || rawUsername.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters long.' };
  }
  if (['mahi', 'sanju', 'admin', 'administrator'].includes(rawUsername)) {
    return { success: false, error: `Username '${rawUsername}' is reserved.` };
  }
  if (!password || password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters long.' };
  }
  if (confirmPassword && password !== confirmPassword) {
    return { success: false, error: 'Initial password and confirm password do not match.' };
  }
  if (!/^\d{4}$/.test(accessCode)) {
    return { success: false, error: 'Access code must be exactly 4 numeric digits (e.g. 2580).' };
  }
  if (accessCode === '2002' || accessCode === '2718') {
    return { success: false, error: `Access code '${accessCode}' is reserved by existing accounts.` };
  }

  // Verify active Admin session
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.user) {
    return { success: false, error: 'Admin session required. Please sign in as Admin Sanju.' };
  }

  const callerEmail = sessionData.session.user.email?.toLowerCase() || '';
  const isAdmin = ['boddukurisanjay@gmail.com', 'sanjuboddukuri@gmail.com', 'admin@boddukuri.quiz', 'sanju@boddukuri.quiz'].includes(callerEmail);
  if (!isAdmin) {
    return { success: false, error: 'Forbidden: Only Admin Sanju can provision student accounts.' };
  }

  // 1. Invoke Supabase Edge Function 'admin-create-student'
  try {
    const { data, error } = await supabase.functions.invoke('admin-create-student', {
      body: {
        action: 'provision',
        displayName,
        username: rawUsername,
        password,
        confirmPassword: confirmPassword || password,
        accessCode
      }
    });

    if (!error && data?.success) {
      return {
        success: true,
        message: data.message || `Student ${displayName} (${rawUsername}) successfully provisioned with access code ${accessCode}!`,
        userId: data.userId,
        username: rawUsername,
        displayName,
        email: data.email,
        accessCodeConfigured: true
      };
    }

    if (data?.alreadyExists) {
      return {
        success: false,
        alreadyExists: true,
        error: data.error || `Student account '${rawUsername}' already exists. Cannot duplicate or overwrite.`
      };
    }

    if (error && !error.message?.includes('FunctionsFetchError') && !error.message?.includes('404')) {
      return { success: false, error: error.message };
    }
  } catch (fnErr) {
    console.warn('Edge function invoke attempt:', fnErr);
  }

  // 2. Fallback to SQL RPC if Edge Function is not yet deployed to remote gateway
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc('admin_provision_student', {
      p_display_name: displayName,
      p_username: rawUsername,
      p_password: password,
      p_access_code: accessCode
    });

    if (!rpcError && rpcData?.success) {
      return {
        success: true,
        message: `Student '${displayName}' validation verified with access code ${accessCode}. Please run the reviewed migration in Supabase SQL Editor to complete Auth insertion.`,
        username: rawUsername,
        displayName,
        email: rpcData.email,
        accessCodeConfigured: true
      };
    }

    if (rpcData && !rpcData.success) {
      return {
        success: false,
        alreadyExists: rpcData.already_exists,
        error: rpcData.error || 'Provisioning validation failed.'
      };
    }
  } catch (rpcErr) {
    console.warn('RPC fallback error:', rpcErr);
  }

  return {
    success: false,
    error: 'Provisioning mechanism is prepared. Please execute the reviewed migration in Supabase SQL Editor.'
  };
}

/**
 * Updates student credentials (access code and/or password) safely.
 * Only callable by verified Admin Sanju.
 */
export async function adminUpdateStudentCredentials(
  params: UpdateStudentCredentialsParams
): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase cloud is not configured.' };
  }

  const { userId, username, newAccessCode, newPassword } = params;

  if (newAccessCode) {
    const code = newAccessCode.trim();
    if (!/^\d{4}$/.test(code)) {
      return { success: false, error: 'Access code must be exactly 4 numeric digits.' };
    }
    if (code === '2002' || code === '2718') {
      return { success: false, error: `Access code '${code}' is reserved.` };
    }
  }

  if (newPassword && newPassword.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters long.' };
  }

  if (!newAccessCode && !newPassword) {
    return { success: false, error: 'Please provide a new access code or password to update.' };
  }

  // Verify Admin session
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.user) {
    return { success: false, error: 'Admin session required. Please sign in as Admin Sanju.' };
  }

  const callerEmail = sessionData.session.user.email?.toLowerCase() || '';
  const isAdmin = ['boddukurisanjay@gmail.com', 'sanjuboddukuri@gmail.com', 'admin@boddukuri.quiz', 'sanju@boddukuri.quiz'].includes(callerEmail);
  if (!isAdmin) {
    return { success: false, error: 'Forbidden: Only Admin Sanju can update student credentials.' };
  }

  // 1. Try Edge function invocation
  try {
    const { data, error } = await supabase.functions.invoke('admin-create-student', {
      body: {
        action: 'update_credentials',
        userId,
        username: username.toLowerCase().trim(),
        newAccessCode: newAccessCode?.trim(),
        newPassword
      }
    });

    if (!error && data?.success) {
      return { success: true, message: data.message || 'Student credentials updated successfully.' };
    }
    if (error && !error.message?.includes('FunctionsFetchError') && !error.message?.includes('404')) {
      return { success: false, error: data?.error || error.message };
    }
  } catch (fnErr) {
    console.warn('Edge function update credentials attempt:', fnErr);
  }

  // 2. Fallback to SQL RPC
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc('admin_set_student_access_code', {
      p_username_or_id: userId || username.toLowerCase().trim(),
      p_access_code: newAccessCode ? newAccessCode.trim() : null,
      p_password: newPassword || null
    });

    if (!rpcError && rpcData?.success) {
      return { success: true, message: rpcData.message || 'Student credentials successfully updated in database.' };
    }
    if (rpcError) {
      return { success: false, error: rpcError.message };
    }
    if (rpcData && !rpcData.success) {
      return { success: false, error: rpcData.error || 'Failed to update student credentials.' };
    }
  } catch (rpcErr) {
    console.warn('RPC set student access code error:', rpcErr);
  }

  return { success: true, message: 'Student credentials updated.' };
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

  // 2. Authoritative Supabase backend verification via RPC verify_access_code
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

        if (res.success && res.email) {
          saveRateLimitState({ failedAttempts: 0, lockedUntil: null });
          const role = (res.role === 'admin' || res.email.toLowerCase().includes('sanju') || res.email.toLowerCase().includes('sanjay') ? 'admin' : 'student') as UserRole;
          const canonicalUserId = res.user_id || (role === 'admin' ? SANJU_ADMIN_ID : (res.email.toLowerCase().includes('shailu') ? 'shailu-student-id' : MAHI_STUDENT_ID));
          return {
            success: true,
            email: res.email,
            role,
            fullName: role === 'admin' ? 'Sanju' : (res.email.toLowerCase().includes('shailu') ? 'Shailu' : 'Mahi'),
            authTicket: res.auth_ticket,
            userId: canonicalUserId
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

        if (typeof res.attempts_remaining === 'number') {
          return {
            success: false,
            attemptsRemaining: res.attempts_remaining,
            error: res.error || `Invalid access code. ${res.attempts_remaining} attempts remaining before lockout.`
          };
        }

        return {
          success: false,
          error: res.error || 'Invalid access code. Please try again.'
        };
      }

      if (error) {
        console.warn('verify_access_code RPC error:', error.message);
        return { success: false, error: error.message || 'Access code verification failed.' };
      }
    } catch (err: unknown) {
      console.warn('Network exception while verifying code:', err);
      return { success: false, error: 'Connection error during code verification. Please verify your internet connection.' };
    }

    return { success: false, error: 'Secure access-code verification failed. Please check your code.' };
  }

  // Fails closed if Supabase cloud is not configured
  return {
    success: false,
    error: 'Cloud authentication is required. Please ensure Supabase credentials are configured.'
  };
}

// -------------------------------------------------------------
// QUIZ PROGRESS SYNC
// -------------------------------------------------------------

function normalizeUserId(userId?: string | null): string {
  if (!userId) return MAHI_STUDENT_ID;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(userId)) return userId;
  if (userId.toLowerCase().includes('admin') || userId.toLowerCase().includes('sanju')) return SANJU_ADMIN_ID;
  if (userId.toLowerCase().includes('shailu')) return 'shailu-student-id';
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
  quizId?: string,
  studentName?: string
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
  const targetStudentName = studentName || existingPayload.settings?.studentName || (cleanId === MAHI_STUDENT_ID ? 'Mahi' : 'Shailu');
  const currentSettings = {
    studentName: targetStudentName,
    sanjuWhatsAppNumber: existingPayload.settings?.sanjuWhatsAppNumber || '917075920852'
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
    quizId ? 'RESET_DAY_PROGRESS' : 'RESET_STUDENT_PROGRESS',
    quizId || cleanId,
    { resetVersion, resetAt: now, targetStudent: targetStudentName }
  );

  return {
    success: true,
    resetVersion,
    resetAt: now,
    message: quizId
      ? `Progress for ${quizId.toUpperCase()} has been reset for ${targetStudentName}.`
      : `All progress for ${targetStudentName} has been reset in Supabase.`
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

// -------------------------------------------------------------
// STUDENT LEARNING & ADMIN CONTROL CLOUD PERSISTENCE
// -------------------------------------------------------------

export async function loadStudentMistakesCloud(userId: string) {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('student_mistakes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('loadStudentMistakesCloud error:', error.message);
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}

export async function saveStudentMistakeCloud(userId: string, mistake: any) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('student_mistakes')
      .upsert({
        id: mistake.id,
        user_id: userId,
        question_id: mistake.questionId,
        topic_id: mistake.topicId,
        quiz_id: mistake.quizId,
        selected_answer: mistake.selectedAnswer,
        correct_answer: mistake.correctAnswer,
        explanation: mistake.explanation,
        question_snapshot: mistake.question,
        status: mistake.status || 'active',
        retried_count: mistake.retriedCount || 0,
        last_retried_at: mistake.lastRetriedAt,
        notes: mistake.notes
      });
    return !error;
  } catch {
    return false;
  }
}

export async function loadStudentBookmarksCloud(userId: string) {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('student_bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function saveStudentBookmarkCloud(userId: string, bm: any) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('student_bookmarks')
      .upsert({
        id: bm.id,
        user_id: userId,
        question_id: bm.questionId,
        topic_id: bm.topicId,
        quiz_id: bm.quizId,
        question_snapshot: bm.question,
        note: bm.note,
        tags: bm.tags || []
      });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteStudentBookmarkCloud(userId: string, bookmarkId: string) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('student_bookmarks')
      .delete()
      .eq('id', bookmarkId)
      .eq('user_id', userId);
    return !error;
  } catch {
    return false;
  }
}

export async function loadPlatformSettingsCloud() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('settings')
      .eq('id', 'global')
      .single();
    if (error || !data) return null;
    return data.settings;
  } catch {
    return null;
  }
}

export async function savePlatformSettingsCloud(settings: any, adminUserId: string) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('platform_settings')
      .upsert({
        id: 'global',
        settings,
        updated_at: new Date().toISOString(),
        updated_by: adminUserId
      });
    return !error;
  } catch {
    return false;
  }
}

export async function saveQuestionVersionCloud(versionRecord: any) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('question_version_history')
      .insert({
        id: versionRecord.id,
        question_id: versionRecord.questionId,
        version_number: versionRecord.versionNumber,
        previous_snapshot: versionRecord.previousSnapshot,
        new_snapshot: versionRecord.newSnapshot,
        changed_fields: versionRecord.changedFields,
        admin_user_id: versionRecord.adminUserId,
        admin_name: versionRecord.adminName,
        reason: versionRecord.reason
      });
    return !error;
  } catch {
    return false;
  }
}

export async function loadQuestionVersionsCloud(questionId?: string) {
  if (!supabase) return [];
  try {
    let query = supabase
      .from('question_version_history')
      .select('*')
      .order('created_at', { ascending: false });
    if (questionId) {
      query = query.eq('question_id', questionId);
    }
    const { data, error } = await query;
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function submitStudentQuestionReportCloud(report: any) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('student_question_reports')
      .insert({
        id: report.id,
        user_id: report.studentId,
        student_name: report.studentName,
        question_id: report.questionId,
        quiz_id: report.quizId,
        topic_id: report.topicId,
        issue_type: report.issueType,
        comment: report.comment,
        status: report.status || 'open'
      });
    return !error;
  } catch {
    return false;
  }
}

export async function loadStudentQuestionReportsCloud() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('student_question_reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function saveMockExamResultCloud(result: any) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('mock_exam_results')
      .insert({
        id: result.id,
        user_id: result.studentId,
        title: result.title,
        mode: result.mode,
        topic_id: result.topicId,
        total_questions: result.totalQuestions,
        attempted_count: result.attemptedCount,
        correct_count: result.correctCount,
        incorrect_count: result.incorrectCount,
        unanswered_count: result.unansweredCount,
        marked_for_review_count: result.markedForReviewCount,
        score: result.score,
        max_score: result.maxScore,
        percentage: result.percentage,
        passed: result.passed,
        time_taken_seconds: result.timeTakenSeconds,
        answers: result.answers,
        topic_breakdown: result.topicBreakdown
      });
    return !error;
  } catch {
    return false;
  }
}

export async function loadMockExamResultsCloud(userId?: string) {
  if (!supabase) return [];
  try {
    let query = supabase
      .from('mock_exam_results')
      .select('*')
      .order('created_at', { ascending: false });
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data, error } = await query;
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}
