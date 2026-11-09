import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import type { ProgressSnapshot } from './storage';
import type { UserProfile, UserRole, RetakeRequest } from '../types/quiz';

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
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role, full_name, email')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching profile from Supabase:', error.message);
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

export const MAHI_STUDENT_ID = '00000000-0000-0000-0000-000000002002';
export const SANJU_ADMIN_ID = '00000000-0000-0000-0000-000000002718';

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
          return {
            success: true,
            email: res.email,
            role,
            fullName: role === 'admin' ? 'Sanju' : 'Mahi',
            authTicket: res.auth_ticket
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
      // Fall through to resilient cryptographic verification
    }
  }

  // 3. Resilient Cryptographic SHA-256 Hash Verification
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
  if (!supabase) return null;
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
    console.warn('Load cloud progress advisory:', err);
    return null;
  }
}

export async function saveCloudProgress(userId: string, payload: ProgressSnapshot): Promise<void> {
  if (!supabase) return;
  const cleanId = normalizeUserId(userId);
  try {
    const { error } = await supabase
      .from('quiz_progress')
      .upsert({ user_id: cleanId, payload, updated_at: payload.updatedAt });
    if (error) {
      console.warn('Cloud progress upsert note:', error.message);
    }
  } catch (err) {
    console.warn('saveCloudProgress note:', err);
  }
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
      .select('*');
    if (error) {
      console.warn('loadAdminScheduleOverridesCloud error:', error.message);
      return {};
    }
    const map: Record<string, { isUnlockedOverride?: boolean; customUnlockTime?: string }> = {};
    (data || []).forEach(row => {
      map[row.quiz_id] = {
        isUnlockedOverride: row.is_unlocked_override,
        customUnlockTime: row.custom_unlock_time
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
      quiz_id: quizId,
      is_unlocked_override: override.isUnlockedOverride ?? null,
      custom_unlock_time: override.customUnlockTime ?? null,
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
