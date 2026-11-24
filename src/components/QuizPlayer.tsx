import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Bookmark, Clock, Grid3x3, X } from 'lucide-react';
import type { Quiz } from '../lib/bank';
import { getTopic } from '../lib/bank';
import { clearDraft, loadDraft, saveDraft } from '../lib/local';
import { formatClock } from '../lib/format';
import { Modal, Spinner, TopicIcon } from './ui';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

interface Props {
  quiz: Quiz;
  userId: string;
  onSubmit: (answers: (number | null)[], elapsedSeconds: number) => Promise<void>;
  onExit: () => void;
}

export function QuizPlayer({ quiz, userId, onSubmit, onExit }: Props) {
  const topic = getTopic(quiz.topicId);
  const total = quiz.questions.length;
  const draft = useMemo(() => loadDraft(userId, quiz.id), [userId, quiz.id]);

  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    draft && draft.answers.length === total ? draft.answers : Array(total).fill(null));
  const [flagged, setFlagged] = useState<Set<number>>(() => new Set(draft?.flagged ?? []));
  const [current, setCurrent] = useState(() => Math.min(draft?.current ?? 0, total - 1));
  const [direction, setDirection] = useState(1);
  const [elapsed, setElapsed] = useState(draft?.elapsed ?? 0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [resumed] = useState(() => Boolean(draft && draft.answers.some(a => a !== null)));

  // Timer
  useEffect(() => {
    if (submitting) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [submitting]);

  // Autosave (answers immediately; elapsed every 10 s)
  const elapsedBucket = Math.floor(elapsed / 10);
  useEffect(() => {
    saveDraft(userId, quiz.id, { answers, flagged: [...flagged], current, elapsed: elapsedBucket * 10, savedAt: new Date().toISOString() });
  }, [answers, flagged, current, elapsedBucket, userId, quiz.id]);

  const answeredCount = answers.filter(a => a !== null).length;
  const q = quiz.questions[current];

  const go = useCallback((i: number) => {
    if (i < 0 || i >= total) return;
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
    setPaletteOpen(false);
  }, [current, total]);

  const choose = useCallback((opt: number) => {
    setAnswers(a => a.map((x, i) => (i === current ? (x === opt ? null : opt) : x)));
  }, [current]);

  const toggleFlag = useCallback(() => {
    setFlagged(f => {
      const n = new Set(f);
      if (n.has(current)) n.delete(current); else n.add(current);
      return n;
    });
  }, [current]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (confirmOpen || exitOpen || submitting) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const k = e.key.toUpperCase();
      const byNumber = Number(k) - 1;
      const byLetter = LETTERS.indexOf(k);
      const idx = byNumber >= 0 && byNumber < q.options.length ? byNumber : byLetter >= 0 && byLetter < q.options.length ? byLetter : -1;
      if (idx >= 0 && !e.metaKey && !e.ctrlKey) { choose(idx); return; }
      if (e.key === 'ArrowRight') go(current + 1);
      else if (e.key === 'ArrowLeft') go(current - 1);
      else if (k === 'F') toggleFlag();
      else if (e.key === 'Enter') { if (current < total - 1) go(current + 1); else setConfirmOpen(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choose, go, toggleFlag, current, total, q.options.length, confirmOpen, exitOpen, submitting]);

  async function finish() {
    setSubmitting(true);
    setSubmitError('');
    try {
      await onSubmit(answers, elapsed);
      clearDraft(userId, quiz.id);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed.');
      setSubmitting(false);
    }
  }

  const palette = (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold">Questions</div>
        <div className="text-xs text-ink-muted tabular">{answeredCount}/{total} answered</div>
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {quiz.questions.map((_, i) => {
          const isCur = i === current;
          const done = answers[i] !== null;
          const flag = flagged.has(i);
          return (
            <button
              key={i}
              onClick={() => go(i)}
              className={`relative h-9 rounded-md text-[13px] font-medium tabular transition
                ${isCur ? 'ring-2 ring-brand ring-offset-1' : ''}
                ${done ? 'bg-ink text-white' : 'bg-paper text-ink-soft hover:bg-line'}`}
              aria-label={`Question ${i + 1}${done ? ', answered' : ''}${flag ? ', marked for review' : ''}`}
            >
              {i + 1}
              {flag && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-warn border-2 border-white" />}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11.5px] text-ink-muted">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-ink" /> Answered</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-paper border border-line" /> Not answered</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warn" /> Review</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center gap-4">
          <button onClick={() => setExitOpen(true)} className="btn-ghost h-9 px-2 -ml-2" aria-label="Exit quiz"><X className="w-4 h-4" /></button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="w-7 h-7 rounded-md bg-brand-soft text-brand flex items-center justify-center shrink-0">
              <TopicIcon icon={topic?.icon ?? ''} className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{topic?.title} · {quiz.title}</div>
              <div className="text-[11px] text-ink-muted truncate hidden sm:block">{quiz.subtitle || `${total} questions`}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium tabular text-ink-soft" aria-label="Time elapsed">
            <Clock className="w-4 h-4 text-ink-faint" /> {formatClock(elapsed)}
          </div>
          <button onClick={() => setConfirmOpen(true)} className="btn-dark h-9 hidden sm:inline-flex">Submit</button>
        </div>
        <div className="h-[3px] bg-line/60">
          <motion.div className="h-full bg-brand" animate={{ width: `${(answeredCount / total) * 100}%` }} transition={{ duration: 0.35 }} />
        </div>
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-10 grid lg:grid-cols-[1fr_280px] gap-8">
        <div className="min-w-0">
          {resumed && (
            <div className="mb-4 text-xs text-ink-muted">Resumed where you left off · {answeredCount} answered</div>
          )}

          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.section
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="eyebrow">Question {current + 1} of {total}</div>
                <button
                  onClick={toggleFlag}
                  className={`chip border transition ${flagged.has(current) ? 'bg-warn-soft text-warn border-warn/30' : 'text-ink-muted border-line hover:border-ink-faint'}`}
                >
                  <Bookmark className="w-3 h-3" fill={flagged.has(current) ? 'currentColor' : 'none'} />
                  {flagged.has(current) ? 'Marked for review' : 'Mark for review'}
                </button>
              </div>

              <h2 className="text-[19px] sm:text-[21px] leading-[1.5] font-medium text-ink whitespace-pre-line">{q.q}</h2>

              <div className="mt-7 space-y-2.5" role="radiogroup" aria-label="Answer options">
                {q.options.map((opt, i) => {
                  const selected = answers[current] === i;
                  return (
                    <motion.button
                      key={i}
                      role="radio"
                      aria-checked={selected}
                      onClick={() => choose(i)}
                      whileTap={{ scale: 0.995 }}
                      className={`group w-full flex items-start gap-4 text-left rounded-xl border px-4 py-3.5 transition-colors
                        ${selected ? 'border-brand bg-brand-soft' : 'border-line bg-white hover:border-ink-faint'}`}
                    >
                      <span className={`mt-px w-7 h-7 rounded-md shrink-0 flex items-center justify-center text-[13px] font-semibold transition-colors
                        ${selected ? 'bg-brand text-white' : 'bg-paper text-ink-soft group-hover:bg-line'}`}>
                        {LETTERS[i]}
                      </span>
                      <span className={`pt-0.5 text-[15px] leading-relaxed ${selected ? 'text-ink font-medium' : 'text-ink-soft'}`}>{opt}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3">
            <button onClick={() => go(current - 1)} disabled={current === 0} className="btn-outline">
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
            <button onClick={() => setPaletteOpen(true)} className="btn-ghost lg:hidden tabular">
              <Grid3x3 className="w-4 h-4" /> {current + 1}/{total}
            </button>
            {current < total - 1 ? (
              <button onClick={() => go(current + 1)} className="btn-primary">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => setConfirmOpen(true)} className="btn-dark">Finish & submit</button>
            )}
          </div>

          <div className="hidden sm:flex flex-wrap items-center gap-x-4 gap-y-2 mt-8 text-xs text-ink-faint">
            <span>Keyboard:</span>
            <span><Kbd>1</Kbd>–<Kbd>{q.options.length}</Kbd> choose</span>
            <span><Kbd>←</Kbd> <Kbd>→</Kbd> move</span>
            <span><Kbd>F</Kbd> mark for review</span>
            <span><Kbd>Enter</Kbd> next</span>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="card p-5 sticky top-24">
            {palette}
            <button onClick={() => setConfirmOpen(true)} className="btn-dark w-full mt-5">Submit quiz</button>
          </div>
        </aside>
      </div>

      {/* Mobile palette sheet */}
      <AnimatePresence>
        {paletteOpen && (
          <motion.div className="lg:hidden fixed inset-0 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink/40" onClick={() => setPaletteOpen(false)} />
            <motion.div
              className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl p-5 pb-8"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
              {palette}
              <button onClick={() => { setPaletteOpen(false); setConfirmOpen(true); }} className="btn-dark w-full mt-5">Submit quiz</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        open={confirmOpen}
        onClose={() => !submitting && setConfirmOpen(false)}
        title="Submit this quiz?"
        footer={
          <>
            <button className="btn-outline" disabled={submitting} onClick={() => setConfirmOpen(false)}>Keep working</button>
            <button className="btn-primary" disabled={submitting} onClick={finish}>
              {submitting ? <><Spinner className="w-4 h-4" /> Submitting…</> : 'Submit'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-3 gap-2 my-3">
          <div className="rounded-lg bg-paper p-3"><div className="text-xl font-semibold tabular">{answeredCount}</div><div className="text-xs text-ink-muted">Answered</div></div>
          <div className="rounded-lg bg-paper p-3"><div className="text-xl font-semibold tabular">{total - answeredCount}</div><div className="text-xs text-ink-muted">Unanswered</div></div>
          <div className="rounded-lg bg-paper p-3"><div className="text-xl font-semibold tabular">{flagged.size}</div><div className="text-xs text-ink-muted">For review</div></div>
        </div>
        {total - answeredCount > 0 ? 'Unanswered questions are marked as skipped.' : 'All questions answered.'} Your result is sent to Sanju as soon as you submit.
        {submitError && <div className="mt-3 text-bad">{submitError}</div>}
      </Modal>

      <Modal
        open={exitOpen}
        onClose={() => setExitOpen(false)}
        title="Leave the quiz?"
        footer={
          <>
            <button className="btn-outline" onClick={() => setExitOpen(false)}>Stay</button>
            <button className="btn-dark" onClick={onExit}>Leave</button>
          </>
        }
      >
        Your answers and time are saved on this device. You can continue this set later from where you stopped.
      </Modal>
    </div>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded border border-line bg-white font-sans text-[11px] text-ink-soft shadow-card">{children}</kbd>;
}
