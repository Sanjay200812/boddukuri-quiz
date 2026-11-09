import React, { useEffect, useState } from 'react';
import { supabase, supabaseConfigured, loadCloudProgress, saveCloudProgress } from '../utils/supabase';
import { getProgressSnapshot, mergeProgressSnapshot, STORAGE_CHANGE_EVENT } from '../utils/storage';

export const AuthSyncPanel: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const sync = async (userId: string) => {
    const cloud = await loadCloudProgress(userId);
    const merged = cloud ? mergeProgressSnapshot(cloud) : getProgressSnapshot();
    await saveCloudProgress(userId, merged);
    setStatus('Synced across devices');
    window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
  };

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUserEmail(data.session?.user.email || null));
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUserEmail(session?.user.email || null);
      if (session && event !== 'SIGNED_OUT') void sync(session.user.id).catch(() => setStatus('Sync failed; local progress is safe'));
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabaseConfigured) return <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Cloud sync is not configured yet. Local progress continues to work.</div>;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setStatus('');
    try {
      if (!supabase) return;
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      setStatus('Signed in. Syncing progress…');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Unable to sign in'); }
    finally { setBusy(false); }
  };

  if (userEmail) return <div className="flex items-center justify-between gap-3 rounded-xl bg-red-50 p-3 text-sm text-red-900"><span>Signed in as {userEmail}. {status}</span><button className="font-semibold underline" onClick={() => supabase?.auth.signOut()}>Sign out</button></div>;
  return <form onSubmit={submit} className="space-y-2 rounded-xl bg-slate-50 p-3"><p className="text-sm font-semibold text-slate-700">Sync Mahi’s progress across phones</p><div className="grid gap-2 sm:grid-cols-2"><input required type="email" placeholder="Mahi’s email" value={email} onChange={e => setEmail(e.target.value)} className="rounded-lg border px-3 py-2" /><input required minLength={6} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="rounded-lg border px-3 py-2" /></div><button disabled={busy} className="rounded-lg bg-red-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Signing in…' : 'Sign in'}</button>{status && <p className="text-xs text-slate-600">{status}</p>}</form>;
};
