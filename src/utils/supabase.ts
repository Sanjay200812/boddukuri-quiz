import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import type { ProgressSnapshot } from './storage';
import type { UserProfile, UserRole, RetakeRequest } from '../types/quiz';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

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
// ACCESS CODE VERIFICATION (BACKEND RPC ONLY)
// -------------------------------------------------------------

export interface AccessCodeVerifyResult {
  success: boolean;
  role?: UserRole;
  email?: string;
  authTicket?: string;
  locked?: boolean;
  secondsRemaining?: number;
  attemptsRemaining?: number;
  error?: string;
}

export async function verifyAccessCodeCloud(code: string, clientId?: string): Promise<AccessCodeVerifyResult> {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase is not configured. Please sign in with email & password or configure Supabase.'
    };
  }

  try {
    const clientIdentifier = clientId || (typeof window !== 'undefined' ? localStorage.getItem('mahi_quiz_device_id') || 'browser_client' : 'browser_client');

    const { data, error } = await supabase.rpc('verify_access_code', {
      p_code: code.trim(),
      p_identifier: clientIdentifier
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Verification service error'
      };
    }

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

    if (res?.success && res.email && res.auth_ticket) {
      return {
        success: true,
        email: res.email,
        authTicket: res.auth_ticket,
        role: (res.role === 'admin' ? 'admin' : 'student') as UserRole
      };
    }

    return {
      success: false,
      locked: res?.locked || false,
      secondsRemaining: res?.seconds_remaining,
      attemptsRemaining: res?.attempts_remaining,
      error: res?.error || 'Invalid access code'
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to contact verification service'
    };
  }
}

// -------------------------------------------------------------
// QUIZ PROGRESS SYNC
// -------------------------------------------------------------

export async function loadCloudProgress(userId: string): Promise<ProgressSnapshot | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('quiz_progress')
      .select('payload')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return (data?.payload as ProgressSnapshot | undefined) || null;
  } catch (err) {
    console.warn('Load cloud progress error:', err);
    return null;
  }
}

export async function saveCloudProgress(userId: string, payload: ProgressSnapshot): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('quiz_progress')
    .upsert({ user_id: userId, payload, updated_at: payload.updatedAt });
  if (error) throw error;
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
