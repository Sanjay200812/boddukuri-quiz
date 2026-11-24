import { useMemo, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Check, Minus, X } from 'lucide-react';
import type { Attempt } from '../lib/supabase';
import { getQuestion, getQuiz, getTopic } from '../lib/bank';
import { formatDateTime, formatDuration, grade } from '../lib/format';
import { CountUp, ScoreRing } from './ui';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export function ResultSummary({ attempt, showName = false }: { attempt: Attempt; showName?: boolean }) {
  const wrong = attempt.answers.filter(a => a.sel !== null && !a.correct).length;
  const skipped = attempt.answers.filter(a => a.sel === null).length;
  const g = grade(attempt.percentage);
  const topic = getTopic(attempt.topicId);
  return (
    <div className="card p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-stretch">
      <ScoreRing pct={attempt.percentage}>
        <div className="font-display text-[40px] leading-none font-semibold"><CountUp value={attempt.percentage} suffix="%" /></div>
        <div className="text-xs text-ink-muted mt-1 tabular">{attempt.score} / {attempt.total}</div>
      </ScoreRing>
      <div className="flex-1 w-full flex flex-col justify-center">
        <div className="eyebrow">{showName ? `${attempt.studentName} · ` : ''}{topic?.title ?? attempt.topicId}</div>
        <div className="mt-1.5 flex items-baseline gap-3 flex-wrap">
          <h2 className="font-display text-2xl font-semibold">{attempt.quizTitle}</h2>
          <span className={`chip ${g.tone === 'good' ? 'bg-good-soft text-good' : g.tone === 'ok' ? 'bg-warn-soft text-warn' : 'bg-bad-soft text-bad'}`}>{g.label}</span>
        </div>
        <div className="text-sm text-ink-muted mt-1">Submitted {formatDateTime(attempt.submittedAt)} · {formatDuration(attempt.timeTakenSeconds)}</div>
        <div className="mt-5 grid grid-cols-3 gap-2 max-w-md">
          <Metric icon={<Check className="w-3.5 h-3.5" />} cls="text-good bg-good-soft" n={attempt.score} label="Correct" />
          <Metric icon={<X className="w-3.5 h-3.5" />} cls="text-bad bg-bad-soft" n={wrong} label="Wrong" />
          <Metric icon={<Minus className="w-3.5 h-3.5" />} cls="text-ink-muted bg-paper" n={skipped} label="Skipped" />
        </div>
      </div>
    </div>
  );
}

function Metric({ icon, cls, n, label }: { icon: ReactNode; cls: string; n: number; label: string }) {
  return (
    <div className="rounded-lg border border-line px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span className={`w-5 h-5 rounded flex items-center justify-center ${cls}`}>{icon}</span>
        <span className="text-lg font-semibold tabular">{n}</span>
      </div>
      <div className="text-[11px] text-ink-muted mt-0.5">{label}</div>
    </div>
  );
}

type Filter = 'all' | 'wrong' | 'skipped' | 'correct';

export function AnswerList({ attempt }: { attempt: Attempt }) {
  const [filter, setFilter] = useState<Filter>('all');
  const quiz = getQuiz(attempt.quizId);

  const rows = useMemo(() => attempt.answers.map((a, i) => ({ ...a, n: i + 1, question: getQuestion(a.qid) ?? quiz?.questions[i] })), [attempt, quiz]);
  const counts = {
    all: rows.length,
    wrong: rows.filter(r => r.sel !== null && !r.correct).length,
    skipped: rows.filter(r => r.sel === null).length,
    correct: rows.filter(r => r.correct).length,
  };
  const visible = rows.filter(r =>
    filter === 'all' ? true : filter === 'wrong' ? r.sel !== null && !r.correct : filter === 'skipped' ? r.sel === null : r.correct);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <h3 className="text-lg font-semibold">Answer review</h3>
        <div className="inline-flex p-1 rounded-lg bg-white border border-line">
          {(['all', 'wrong', 'skipped', 'correct'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative px-3 h-8 rounded-md text-[13px] font-medium capitalize transition-colors ${filter === f ? 'text-white' : 'text-ink-muted hover:text-ink'}`}
            >
              {filter === f && <motion.span layoutId="review-filter" className="absolute inset-0 rounded-md bg-ink" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
              <span className="relative">{f} <span className="tabular opacity-60">{counts[f]}</span></span>
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 && <div className="card p-8 text-center text-sm text-ink-muted">Nothing here.</div>}

      <div className="space-y-3">
        {visible.map((r, idx) => {
          const q = r.question;
          const status = r.sel === null ? 'skipped' : r.correct ? 'correct' : 'wrong';
          return (
            <motion.article
              key={r.qid + r.n}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx, 10) * 0.025 }}
              className="card p-5"
            >
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center shrink-0
                  ${status === 'correct' ? 'bg-good-soft text-good' : status === 'wrong' ? 'bg-bad-soft text-bad' : 'bg-paper text-ink-muted'}`}>
                  {status === 'correct' ? <Check className="w-3.5 h-3.5" /> : status === 'wrong' ? <X className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] text-ink-faint font-medium mb-1">Q{r.n}{status === 'skipped' ? ' · Skipped' : ''}</div>
                  {q ? (
                    <>
                      <p className="text-[15px] leading-relaxed font-medium whitespace-pre-line">{q.q}</p>
                      <ul className="mt-3 space-y-1.5">
                        {q.options.map((opt, i) => {
                          const isAnswer = i === q.answer;
                          const isPicked = i === r.sel;
                          return (
                            <li key={i} className={`flex items-start gap-2.5 rounded-lg px-3 py-2 text-sm border
                              ${isAnswer ? 'border-good/30 bg-good-soft text-ink' : isPicked ? 'border-bad/30 bg-bad-soft text-ink' : 'border-transparent text-ink-muted'}`}>
                              <span className="font-semibold w-4 shrink-0">{LETTERS[i]}</span>
                              <span className="flex-1">{opt}</span>
                              {isAnswer && <span className="text-[11px] font-semibold text-good shrink-0">{isPicked ? 'Your answer · Correct' : 'Correct answer'}</span>}
                              {isPicked && !isAnswer && <span className="text-[11px] font-semibold text-bad shrink-0">Your answer</span>}
                            </li>
                          );
                        })}
                      </ul>
                      {q.explanation && (
                        <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft border-l-2 border-line pl-3">{q.explanation}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-ink-muted">This question is no longer in the bank.</p>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
