import { motion } from 'motion/react';
import { Lock, Play, RotateCcw, ChevronRight, Clock } from 'lucide-react';
import type { StudentData } from './StudentApp';
import { getTopic, quizzesForTopic } from '../lib/bank';
import { loadDraft } from '../lib/local';
import { average, formatDuration, timeAgo } from '../lib/format';
import { navigate } from '../lib/router';
import { Page, PageHeader, ProgressBar, ScoreBadge, TopicIcon } from '../components/ui';

export function TopicView({ topicId, data }: { topicId: string; data: StudentData }) {
  const topic = getTopic(topicId)!;
  const sets = quizzesForTopic(topicId);
  const { attempts, profile, isLocked } = data;

  const rows = sets.map(quiz => {
    const tries = attempts.filter(a => a.quizId === quiz.id);
    const best = tries.reduce<number | null>((m, a) => (m === null || a.percentage > m ? a.percentage : m), null);
    const draft = loadDraft(profile.id, quiz.id);
    const draftCount = draft ? draft.answers.filter(a => a !== null).length : 0;
    return { quiz, tries, best, draft: draftCount > 0 ? draft : null, draftCount, locked: isLocked(quiz.id) };
  });
  const done = rows.filter(r => r.tries.length > 0).length;
  const bests = rows.map(r => r.best).filter((x): x is number => x !== null);

  return (
    <Page>
      <PageHeader
        eyebrow="Topic"
        title={<span className="flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0"><TopicIcon icon={topic.icon} className="w-5 h-5" /></span>{topic.title}</span>}
      >
        {topic.description}
      </PageHeader>

      <div className="card p-5 mb-6 grid grid-cols-3 gap-4">
        <div>
          <div className="eyebrow">Sets done</div>
          <div className="mt-1.5 text-2xl font-semibold tabular">{done}<span className="text-ink-faint text-base">/{sets.length}</span></div>
        </div>
        <div>
          <div className="eyebrow">Average</div>
          <div className="mt-1.5 text-2xl font-semibold tabular">{bests.length ? `${average(bests)}%` : '—'}</div>
        </div>
        <div>
          <div className="eyebrow">Questions</div>
          <div className="mt-1.5 text-2xl font-semibold tabular">{sets.reduce((n, q) => n + q.questions.length, 0)}</div>
        </div>
        <ProgressBar value={(done / sets.length) * 100} className="col-span-3" tone={done === sets.length ? 'good' : 'brand'} />
      </div>

      <div className="space-y-2.5">
        {rows.map(({ quiz, tries, best, draft, draftCount, locked }, i) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: i * 0.04 }}
            className={`card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${locked ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center font-display text-lg font-semibold shrink-0
                ${best !== null ? 'bg-good-soft text-good' : 'bg-paper text-ink-soft'}`}>
                {locked ? <Lock className="w-4 h-4" /> : String(quiz.number).padStart(2, '0')}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{quiz.title}</span>
                  {best !== null && <ScoreBadge pct={best} />}
                  {draft && <span className="chip bg-warn-soft text-warn">In progress · {draftCount}/{quiz.questions.length}</span>}
                </div>
                <div className="text-[13px] text-ink-muted mt-0.5 sm:truncate">
                  {quiz.questions.length} questions{quiz.subtitle ? ` · ${quiz.subtitle}` : ''}
                </div>
                {tries.length > 0 && (
                  <div className="text-xs text-ink-faint mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Last attempt {timeAgo(tries[0].submittedAt)} · {tries.length} attempt{tries.length > 1 ? 's' : ''} · {formatDuration(tries[0].timeTakenSeconds)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 sm:shrink-0">
              {locked ? (
                <span className="text-xs text-ink-muted px-2">Locked by Sanju</span>
              ) : (
                <>
                  {tries.length > 0 && (
                    <button onClick={() => navigate(`result/${tries[0].id}`)} className="btn-outline flex-1 sm:flex-none">
                      Result <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => navigate(`quiz/${quiz.id}`)} className={`${tries.length && !draft ? 'btn-outline' : 'btn-primary'} flex-1 sm:flex-none`}>
                    {draft ? <><Play className="w-4 h-4" /> Resume</> : tries.length ? <><RotateCcw className="w-4 h-4" /> Retake</> : <><Play className="w-4 h-4" /> Start</>}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Page>
  );
}
