import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import type { ProgressSnapshot } from './storage';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anonKey);
export const supabase: SupabaseClient | null = supabaseConfigured ? createClient(url!, anonKey!) : null;

export async function loadCloudProgress(userId: string): Promise<ProgressSnapshot | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('quiz_progress').select('payload').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return (data?.payload as ProgressSnapshot | undefined) || null;
}

export async function saveCloudProgress(userId: string, payload: ProgressSnapshot): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('quiz_progress').upsert({ user_id: userId, payload, updated_at: payload.updatedAt });
  if (error) throw error;
}

export function currentSession(): Promise<{ data: { session: Session | null } }> {
  return supabase ? supabase.auth.getSession() : Promise.resolve({ data: { session: null } });
}
