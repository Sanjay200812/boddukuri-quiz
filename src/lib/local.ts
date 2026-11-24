import type { Attempt } from './supabase';

/** Small, failure-tolerant wrappers around localStorage. */
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    if (value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked: in-progress saving is a convenience only
  }
}

export interface QuizDraft {
  answers: (number | null)[];
  flagged: number[];
  current: number;
  elapsed: number;
  savedAt: string;
}

const draftKey = (userId: string, quizId: string) => `spideyy_draft_${userId}_${quizId}`;

export const loadDraft = (userId: string, quizId: string) => read<QuizDraft | null>(draftKey(userId, quizId), null);
export const saveDraft = (userId: string, quizId: string, draft: QuizDraft) => write(draftKey(userId, quizId), draft);
export const clearDraft = (userId: string, quizId: string) => write(draftKey(userId, quizId), undefined);

/** Submissions that could not reach Supabase yet (offline); retried on next load / reconnect. */
const pendingKey = (userId: string) => `spideyy_pending_${userId}`;
export const loadPending = (userId: string) => read<Attempt[]>(pendingKey(userId), []);
export function addPending(userId: string, attempt: Attempt) {
  write(pendingKey(userId), [...loadPending(userId).filter(a => a.id !== attempt.id), attempt]);
}
export function removePending(userId: string, id: string) {
  const rest = loadPending(userId).filter(a => a.id !== id);
  write(pendingKey(userId), rest.length ? rest : undefined);
}
