import type { Attempt } from './supabase';

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m ? `${m}m ${String(r).padStart(2, '0')}s` : `${r}s`;
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}

export function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} d ago`;
  return formatDate(iso);
}

export function grade(pct: number): { label: string; tone: 'good' | 'ok' | 'low' } {
  if (pct >= 85) return { label: 'Excellent', tone: 'good' };
  if (pct >= 70) return { label: 'Good', tone: 'good' };
  if (pct >= 50) return { label: 'Fair', tone: 'ok' };
  return { label: 'Needs revision', tone: 'low' };
}

export function bestByQuiz(attempts: Attempt[]): Map<string, Attempt> {
  const best = new Map<string, Attempt>();
  for (const a of attempts) {
    const cur = best.get(a.quizId);
    if (!cur || a.percentage > cur.percentage) best.set(a.quizId, a);
  }
  return best;
}

export function average(nums: number[]): number {
  return nums.length ? Math.round(nums.reduce((s, n) => s + n, 0) / nums.length) : 0;
}

export function initials(name: string): string {
  return name.trim().slice(0, 1).toUpperCase() || '?';
}

export function plural(n: number, one: string, many = one + 's'): string {
  return `${n} ${n === 1 ? one : many}`;
}
