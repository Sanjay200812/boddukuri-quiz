import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Lock, MessageSquareText, PlayCircle } from 'lucide-react';
import type { StudentData } from './StudentApp';
import { QUIZZES, getQuiz, getTopic, quizzesForTopic } from '../lib/bank';
import { loadDraft } from '../lib/local';
import { average, bestByQuiz, formatDuration, timeAgo } from '../lib/format';
import { navigate } from '../lib/router';
import { ErrorNote, Page, ProgressBar, ScoreBadge, Stat, TopicIcon } from '../components/ui';

function greeting(d: Date) {
  const h = d.getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export function Home({ data, loadError, onRetry }: { data: StudentData; loadError: string; onRetry: () => void }) {
  const [today] = useState(() => new Date());
  const { profile, attempts, settings, isLocked, visibleTopics } = data;
  const best = useMemo(() => bestByQuiz(attempts), [attempts]);

  const available = QUIZZES.filter(q => !isLocked(q.id));
  const answered = attempts.reduce((n, a) => n + a.answers.filter(x => x.sel !== null).length, 0);
  const correct = attempts.reduce((n, a) => n + a.score, 0);
  const totalTime = attempts.reduce((n, a) => n + a.timeTakenSeconds, 0);

  // What to do next: an unfinished draft first, otherwise the first set not yet attempted.
  const inProgress = available
    .map(q => ({ quiz: q, draft: loadDraft(profile.id, q.id) }))
    .filter(x => x.draft && x.draft.answers.some(a => a !== null))
    .sort((a, b) => (b.draft!.savedAt > a.draft!.savedAt ? 1 : -1))[0];
  const nextUp = available.find(q => !best.has(q.id));
  const next = inProgress?.quiz ?? nextUp;
  const nextTopic = next ? getTopic(next.topicId) : undefined;

  return (
    <Page>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
        <div>
          <div className="eyebrow mb-2">{today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          <h1 className="page-title">{greeting(today)}, {profile.name}</h1>
        </div>
      </div>

      {loadError && <div className="mb-6"><ErrorNote message={loadError} onRetry={onRetry} /></div>}

      {settings.note.trim() && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-xl border border-brand/20 bg-brand-soft px-5 py-4 flex gap-3">
          <MessageSquareText className="w-5 h-5 text-brand shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-brand mb-0.5">Note from Sanju</div>
            <p className="text-[14.5px] text-ink whitespace-pre-line">{settings.note}</p>
          </div>
        </motion.div>
      )}

      {/* Continue / next up */}
      {next && nextTopic && (
        <button
          onClick={() => navigate(`quiz/${next.id}`)}
          className="group w-full text-left mb-8 rounded-2xl bg-night text-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5 overflow-hidden relative hover:shadow-lift transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <TopicIcon icon={nextTopic.icon} className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">{inProgress ? 'Continue where you stopped' : 'Up next'}</div>
            <div className="mt-1 font-display text-xl sm:text-2xl font-semibold">{nextTopic.title} · {next.title}</div>
            <div className="mt-1 text-sm text-white/55 truncate">
              {inProgress
                ? `${inProgress.draft!.answers.filter(a => a !== null).length} of ${next.questions.length} answered · ${formatDuration(inProgress.draft!.elapsed)} spent`
                : `${next.questions.length} questions${next.subtitle ? ' · ' + next.subtitle : ''}`}
            </div>
          </div>
          <span className="btn bg-white text-ink group-hover:bg-white/90 self-start sm:self-center">
            <PlayCircle className="w-4 h-4" /> {inProgress ? 'Resume' : 'Start'}
          </span>
        </button>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        <Stat label="Sets completed" value={<>{best.size}<span className="text-ink-faint text-xl">/{available.length}</span></>} hint={`${attempts.length} attempt${attempts.length === 1 ? '' : 's'} in total`} />
        <Stat label="Average score" value={attempts.length ? `${average(attempts.map(a => a.percentage))}%` : '—'} hint="Across all attempts" />
        <Stat label="Accuracy" value={answered ? `${Math.round((correct / answered) * 100)}%` : '—'} hint={`${correct} correct of ${answered} answered`} />
        <Stat label="Time practised" value={totalTime ? formatDuration(totalTime).replace(/ \d+s$/, '') : '—'} hint="Total time in quizzes" />
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-semibold">Topics</h2>
            <span className="text-xs text-ink-muted">{visibleTopics.length} topics · 30 questions per set</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {visibleTopics.map((t, i) => {
              const sets = quizzesForTopic(t.id);
              const open = sets.filter(q => !isLocked(q.id));
              const done = sets.filter(q => best.has(q.id)).length;
              const scores = sets.map(q => best.get(q.id)?.percentage).filter((x): x is number => x !== undefined);
              return (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  onClick={() => navigate(`topic/${t.id}`)}
                  className="card p-5 text-left hover:shadow-lift hover:-translate-y-0.5 transition-[box-shadow,transform] group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="w-9 h-9 rounded-lg bg-paper text-ink-soft flex items-center justify-center group-hover:bg-brand-soft group-hover:text-brand transition-colors">
                      <TopicIcon icon={t.icon} />
                    </span>
                    {open.length === 0
                      ? <span className="chip bg-paper text-ink-muted"><Lock className="w-3 h-3" /> Locked</span>
                      : scores.length > 0 && <ScoreBadge pct={average(scores)} />}
                  </div>
                  <div className="mt-4 font-semibold">{t.title}</div>
                  <p className="mt-1 text-[13px] text-ink-muted leading-relaxed line-clamp-3">{t.description}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <ProgressBar value={(done / sets.length) * 100} className="flex-1" tone={done === sets.length ? 'good' : 'brand'} />
                    <span className="text-xs text-ink-muted tabular shrink-0">{done}/{sets.length} sets</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent results</h2>
            {attempts.length > 0 && <button onClick={() => navigate('history')} className="text-xs font-semibold text-brand hover:underline">View all</button>}
          </div>
          {attempts.length === 0 ? (
            <div className="card p-6 text-sm text-ink-muted">
              No results yet. Finish a set and your score, time and answer review will show up here.
            </div>
          ) : (
            <div className="card divide-y divide-line">
              {attempts.slice(0, 6).map(a => {
                const t = getTopic(a.topicId);
                return (
                  <button key={a.id} onClick={() => navigate(`result/${a.id}`)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-paper/60 transition-colors">
                    <span className="w-8 h-8 rounded-md bg-paper text-ink-muted flex items-center justify-center shrink-0"><TopicIcon icon={t?.icon ?? ''} className="w-3.5 h-3.5" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{t?.title} · {getQuiz(a.quizId)?.title ?? a.quizTitle}</div>
                      <div className="text-xs text-ink-muted">{timeAgo(a.submittedAt)} · {a.score}/{a.total}</div>
                    </div>
                    <ScoreBadge pct={a.percentage} />
                  </button>
                );
              })}
            </div>
          )}
          {attempts.length > 0 && (
            <button onClick={() => navigate('history')} className="mt-3 w-full btn-outline">
              Open all results <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </section>
      </div>
    </Page>
  );
}
