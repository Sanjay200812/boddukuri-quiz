import { createClient, type RealtimeChannel } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export type Role = 'admin' | 'student';

export interface Profile {
  id: string;
  name: string;
  role: Role;
}

export interface AnswerRecord {
  qid: string;
  sel: number | null;
  correct: boolean;
}

export interface Attempt {
  id: string;
  userId: string;
  studentName: string;
  quizId: string;
  topicId: string;
  quizTitle: string;
  score: number;
  total: number;
  percentage: number;
  timeTakenSeconds: number;
  answers: AnswerRecord[];
  submittedAt: string;
}

interface AttemptRow {
  id: string;
  user_id: string;
  student_name: string;
  quiz_id: string;
  topic_id: string;
  quiz_title: string;
  score: number;
  total: number;
  percentage: number;
  time_taken_seconds: number;
  answers: AnswerRecord[];
  submitted_at: string;
}

const fromRow = (r: AttemptRow): Attempt => ({
  id: r.id,
  userId: r.user_id,
  studentName: r.student_name,
  quizId: r.quiz_id,
  topicId: r.topic_id,
  quizTitle: r.quiz_title,
  score: r.score,
  total: r.total,
  percentage: r.percentage,
  timeTakenSeconds: r.time_taken_seconds,
  answers: r.answers ?? [],
  submittedAt: r.submitted_at,
});

function requireClient() {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.');
  return supabase;
}

function errorText(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === 'object' && 'message' in err) return String((err as { message: unknown }).message);
  return 'Something went wrong. Please try again.';
}

function deviceId(): string {
  try {
    let id = localStorage.getItem('spideyy_device_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('spideyy_device_id', id);
    }
    return id;
  } catch {
    return 'browser';
  }
}

export async function signInWithCode(code: string): Promise<Profile> {
  const sb = requireClient();
  const { data, error } = await sb.rpc('verify_access_code', { p_code: code.trim(), p_identifier: deviceId() });
  if (error) throw new Error(errorText(error));
  const res = data as { success: boolean; email?: string; auth_ticket?: string; error?: string; locked?: boolean };
  if (!res.success || !res.email || !res.auth_ticket) {
    throw new Error(res.error || 'That code is not recognised.');
  }
  const { data: session, error: signInError } = await sb.auth.signInWithPassword({ email: res.email, password: res.auth_ticket });
  if (signInError || !session.user) throw new Error(signInError ? errorText(signInError) : 'Sign-in failed.');
  return loadProfile(session.user.id);
}

export async function loadProfile(userId: string): Promise<Profile> {
  const sb = requireClient();
  const { data, error } = await sb.from('profiles').select('id, full_name, role').eq('id', userId).maybeSingle();
  if (error) throw new Error(errorText(error));
  if (!data) throw new Error('No profile exists for this account.');
  return { id: data.id, name: data.full_name || 'Student', role: data.role === 'admin' ? 'admin' : 'student' };
}

export async function currentProfile(): Promise<Profile | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  try {
    return await loadProfile(data.session.user.id);
  } catch {
    return null;
  }
}

export async function signOut(): Promise<void> {
  if (supabase) await supabase.auth.signOut();
}

export async function listStudents(): Promise<Profile[]> {
  const sb = requireClient();
  const { data, error } = await sb.from('profiles').select('id, full_name, role').eq('role', 'student').order('full_name');
  if (error) throw new Error(errorText(error));
  return (data ?? []).map(d => ({ id: d.id, name: d.full_name || 'Student', role: 'student' as const }));
}

/** Students see their own attempts; the admin sees everyone's (enforced by RLS). */
export async function listAttempts(userId?: string): Promise<Attempt[]> {
  const sb = requireClient();
  let query = sb.from('quiz_attempts').select('*').order('submitted_at', { ascending: false }).limit(1000);
  if (userId) query = query.eq('user_id', userId);
  const { data, error } = await query;
  if (error) throw new Error(errorText(error));
  return (data as AttemptRow[]).map(fromRow);
}

export async function submitAttempt(a: Attempt): Promise<Attempt> {
  const sb = requireClient();
  const row: AttemptRow = {
    id: a.id,
    user_id: a.userId,
    student_name: a.studentName,
    quiz_id: a.quizId,
    topic_id: a.topicId,
    quiz_title: a.quizTitle,
    score: a.score,
    total: a.total,
    percentage: a.percentage,
    time_taken_seconds: a.timeTakenSeconds,
    answers: a.answers,
    submitted_at: a.submittedAt,
  };
  // Upsert on the client-generated id makes retries safe (no duplicate rows).
  const { data, error } = await sb.from('quiz_attempts').upsert(row).select().single();
  if (error) throw new Error(errorText(error));
  return fromRow(data as AttemptRow);
}

export async function deleteAttempt(id: string): Promise<void> {
  const sb = requireClient();
  const { error } = await sb.from('quiz_attempts').delete().eq('id', id);
  if (error) throw new Error(errorText(error));
}

export async function deleteAttemptsFor(userId: string, quizId?: string): Promise<void> {
  const sb = requireClient();
  let q = sb.from('quiz_attempts').delete().eq('user_id', userId);
  if (quizId) q = q.eq('quiz_id', quizId);
  const { error } = await q;
  if (error) throw new Error(errorText(error));
}

export async function renameStudent(userId: string, name: string): Promise<void> {
  const sb = requireClient();
  const { error } = await sb.from('profiles').update({ full_name: name.trim(), updated_at: new Date().toISOString() }).eq('id', userId);
  if (error) throw new Error(errorText(error));
}

// ---------------------------------------------------------------
// Per-student settings controlled by the admin
// ---------------------------------------------------------------

export interface StudentSettings {
  userId: string;
  lockedQuizIds: string[];
  hiddenTopicIds: string[];
  note: string;
  updatedAt: string;
}

export const emptySettings = (userId: string): StudentSettings => ({
  userId, lockedQuizIds: [], hiddenTopicIds: [], note: '', updatedAt: new Date(0).toISOString(),
});

interface SettingsRow { user_id: string; locked_quiz_ids: string[]; hidden_topic_ids: string[]; note: string; updated_at: string }
const settingsFromRow = (r: SettingsRow): StudentSettings => ({
  userId: r.user_id, lockedQuizIds: r.locked_quiz_ids ?? [], hiddenTopicIds: r.hidden_topic_ids ?? [], note: r.note ?? '', updatedAt: r.updated_at,
});

export async function loadSettings(userId: string): Promise<StudentSettings> {
  const sb = requireClient();
  const { data, error } = await sb.from('student_settings').select('*').eq('user_id', userId).maybeSingle();
  if (error) throw new Error(errorText(error));
  return data ? settingsFromRow(data as SettingsRow) : emptySettings(userId);
}

export async function loadAllSettings(): Promise<Map<string, StudentSettings>> {
  const sb = requireClient();
  const { data, error } = await sb.from('student_settings').select('*');
  if (error) throw new Error(errorText(error));
  return new Map((data as SettingsRow[]).map(r => [r.user_id, settingsFromRow(r)]));
}

export async function saveSettings(s: StudentSettings): Promise<StudentSettings> {
  const sb = requireClient();
  const { data, error } = await sb.from('student_settings').upsert({
    user_id: s.userId,
    locked_quiz_ids: s.lockedQuizIds,
    hidden_topic_ids: s.hiddenTopicIds,
    note: s.note,
    updated_at: new Date().toISOString(),
  }).select().single();
  if (error) throw new Error(errorText(error));
  return settingsFromRow(data as SettingsRow);
}

/** Any change to attempts, settings or names triggers a refetch (RLS limits what each user receives). */
export function subscribeToChanges(onChange: () => void, onStatus?: (connected: boolean) => void): () => void {
  if (!supabase) return () => {};
  const channel: RealtimeChannel = supabase
    .channel(`spideyy-live-${Math.random().toString(36).slice(2)}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'quiz_attempts' }, () => onChange())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'student_settings' }, () => onChange())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => onChange())
    .subscribe(status => onStatus?.(status === 'SUBSCRIBED'));
  return () => {
    void supabase?.removeChannel(channel);
  };
}

export { errorText };
