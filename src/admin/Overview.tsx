import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Settings2 } from 'lucide-react';
import type { AdminData } from './AdminApp';
import type { Attempt, Profile } from '../lib/supabase';
import { QUIZZES, TOPICS, getQuiz, getTopic, quizzesForTopic } from '../lib/bank';
import { average, bestByQuiz, plural, timeAgo } from '../lib/format';
import { navigate } from '../lib/router';
import { ErrorNote, Page, PageHeader, ProgressBar, ScoreBadge, Stat, TopicIcon } from '../components/ui';

export function LiveDot({ live }: { live: boolean }) {
  return (
    <span className="chip bg-white border border-line text-ink-soft">
      <span className="relative flex w-2 h-2">
        {live && <span className="absolute inline-flex h-full w-full rounded-full bg-good opacity-60 animate-ping" />}
        <span className={`relative inline-flex rounded-full w-2 h-2 ${live ? 'bg-good' : 'bg-ink-faint'}`} />
      </span>
      {live ? 'Live' : 'Connecting'}
    </span>
  );
}

function topicAverages(attempts: Attempt[]) {
  const best = bestByQuiz(attempts);
  return TOPICS.map(t => {
    const scores = quizzesForTopic(t.id).map(q => best.get(q.id)?.percentage).filter((x): x is number => x !== undefined);
    return { topic: t, avg: scores.length ? average(scores) : null, done: scores.length };
  });
}

function StudentCard({ student, attempts, data, i }: { student: Profile; attempts: Attempt[]; data: AdminData; i: number }) {
  const best = bestByQuiz(attempts);
  const s = data.settingsFor(student.id);
  const per = topicAverages(attempts).filter(x => x.avg !== null);
  const strongest = [...per].sort((a, b) => b.avg! - a.avg!)[0];
  const weakest = per.length > 1 ? [...per].sort((a, b) => a.avg! - b.avg!)[0] : undefined;
  const locks = s.lockedQuizIds.length + s.hiddenTopicIds.length;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-ink text-white flex items-center justify-center font-semibold">{student.name[0]}</div>
          <div>
            <div className="font-semibold text-[17px]">{student.name}</div>
            <div className="text-xs text-ink-muted">{attempts[0] ? `Last active ${timeAgo(attempts[0].submittedAt)}` : 'No submissions yet'}</div>
          </div>
        </div>
        <button onClick={() => navigate(`student/${student.id}`)} className="btn-outline h-9"><Settings2 className="w-4 h-4" /> Manage</button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div><div className="eyebrow">Sets</div><div className="mt-1 text-xl font-semibold tabular">{best.size}<span className="text-ink-faint text-sm">/{QUIZZES.length}</span></div></div>
        <div><div className="eyebrow">Average</div><div className="mt-1 text-xl font-semibold tabular">{attempts.length ? `${average(attempts.map(a => a.percentage))}%` : '—'}</div></div>
        <div><div className="eyebrow">Attempts</div><div className="mt-1 text-xl font-semibold tabular">{attempts.length}</div></div>
      </div>
      <ProgressBar value={(best.size / QUIZZES.length) * 100} className="mt-4" />

      <div className="mt-4 space-y-1.5 text-[13px]">
        {strongest && <div className="flex justify-between gap-2"><span className="text-ink-muted">Strongest</span><span className="font-medium truncate">{strongest.topic.title} · {strongest.avg}%</span></div>}
        {weakest && weakest.topic.id !== strongest?.topic.id && <div className="flex justify-between gap-2"><span className="text-ink-muted">Needs work</span><span className="font-medium truncate">{weakest.topic.title} · {weakest.avg}%</span></div>}
        {locks > 0 && <div className="flex justify-between gap-2"><span className="text-ink-muted">Restrictions</span><span className="font-medium">{plural(s.lockedQuizIds.length, 'set')} locked · {plural(s.hiddenTopicIds.length, 'topic')} hidden</span></div>}
      </div>
    </motion.div>
  );
}

export function Overview({ data, error }: { data: AdminData; error: string }) {
  const { students, attempts, live } = data;
  const [now] = useState(() => Date.now());
  const weekAgo = now - 7 * 86400_000;
  const today = new Date(now).toDateString();
  const thisWeek = attempts.filter(a => new Date(a.submittedAt).getTime() > weekAgo);
  const activeToday = new Set(attempts.filter(a => new Date(a.submittedAt).toDateString() === today).map(a => a.userId)).size;
  const byStudent = new Map(students.map(s => [s.id, attempts.filter(a => a.userId === s.id)]));

  return (
    <Page>
      <PageHeader eyebrow="Admin" title="Overview" actions={<LiveDot live={live} />}>
        Every submission from {students.map(s => s.name).join(' and ') || 'your students'} lands here the moment it is submitted.
      </PageHeader>

      {error && <div className="mb-6"><ErrorNote message={error} onRetry={() => void data.refresh()} /></div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <Stat label="Submissions" value={attempts.length} hint="All time" />
        <Stat label="This week" value={thisWeek.length} hint="Last 7 days" />
        <Stat label="Average score" value={attempts.length ? `${average(attempts.map(a => a.percentage))}%` : '—'} hint="All students" />
        <Stat label="Active today" value={`${activeToday}/${students.length}`} hint="Students who submitted today" />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {students.map((s, i) => <StudentCard key={s.id} student={s} attempts={byStudent.get(s.id) ?? []} data={data} i={i} />)}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <section>
          <h2 className="text-lg font-semibold mb-4">Topic comparison</h2>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm min-w-[420px]">
              <thead>
                <tr className="border-b border-line bg-paper/60 text-left text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                  <th className="font-semibold px-4 h-10">Topic</th>
                  {students.map(s => <th key={s.id} className="font-semibold px-4 h-10">{s.name}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {TOPICS.map(t => {
                  const sets = quizzesForTopic(t.id).length;
                  return (
                    <tr key={t.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5"><TopicIcon icon={t.icon} className="w-4 h-4 text-ink-muted" /><span className="font-medium">{t.title}</span></div>
                      </td>
                      {students.map(s => {
                        const row = topicAverages(byStudent.get(s.id) ?? []).find(x => x.topic.id === t.id)!;
                        return (
                          <td key={s.id} className="px-4 py-3">
                            {row.avg === null
                              ? <span className="text-ink-faint">—</span>
                              : <span className="flex items-center gap-2"><ScoreBadge pct={row.avg} /><span className="text-xs text-ink-muted tabular">{row.done}/{sets}</span></span>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-semibold">Latest submissions</h2>
            {attempts.length > 0 && <button onClick={() => navigate('submissions')} className="text-xs font-semibold text-brand hover:underline">View all</button>}
          </div>
          {attempts.length === 0 ? (
            <div className="card p-6 text-sm text-ink-muted">Nothing submitted yet. New results appear here instantly.</div>
          ) : (
            <ul className="card divide-y divide-line">
              {attempts.slice(0, 8).map(a => (
                <motion.li key={a.id} layout initial={{ opacity: 0, backgroundColor: '#ECEFFC' }} animate={{ opacity: 1, backgroundColor: '#FFFFFF' }} transition={{ duration: 1.2 }}>
                  <button onClick={() => navigate(`attempt/${a.id}`)} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-paper/60 transition-colors">
                    <span className="w-8 h-8 rounded-full bg-paper flex items-center justify-center text-xs font-semibold shrink-0">{a.studentName[0]}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm truncate"><span className="font-semibold">{a.studentName}</span> · {getTopic(a.topicId)?.title} {getQuiz(a.quizId)?.title ?? a.quizTitle}</div>
                      <div className="text-xs text-ink-muted">{timeAgo(a.submittedAt)} · {a.score}/{a.total}</div>
                    </div>
                    <ScoreBadge pct={a.percentage} />
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
          {attempts.length > 0 && (
            <button onClick={() => navigate('submissions')} className="mt-3 w-full btn-outline">Open submissions <ArrowRight className="w-4 h-4" /></button>
          )}
        </section>
      </div>
    </Page>
  );
}
