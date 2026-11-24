import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import type { Attempt } from '../lib/supabase';
import { TOPICS, getQuiz, getTopic } from '../lib/bank';
import { formatDateTime, formatDuration } from '../lib/format';
import { ScoreBadge, TopicIcon, Empty } from './ui';

/** Attempts table with topic filter; shared by student history and admin views. */
export function AttemptTable({ attempts, onOpen, showStudent = false, emptyText, actions }: {
  attempts: Attempt[];
  onOpen: (a: Attempt) => void;
  showStudent?: boolean;
  emptyText?: string;
  actions?: (a: Attempt) => ReactNode;
}) {
  const [topic, setTopic] = useState('all');
  const topicsWithData = TOPICS.filter(t => attempts.some(a => a.topicId === t.id));
  const rows = topic === 'all' ? attempts : attempts.filter(a => a.topicId === topic);

  if (attempts.length === 0) return <Empty title="No submissions yet">{emptyText}</Empty>;

  return (
    <div>
      {topicsWithData.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-3 -mx-1 px-1 mb-1">
          {[{ id: 'all', title: 'All topics' }, ...topicsWithData].map(t => (
            <button
              key={t.id}
              onClick={() => setTopic(t.id)}
              className={`chip h-8 px-3 border whitespace-nowrap transition-colors ${topic === t.id ? 'bg-ink text-white border-ink' : 'bg-white text-ink-soft border-line hover:border-ink-faint'}`}
            >
              {t.title}
            </button>
          ))}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className={`hidden md:grid ${showStudent ? 'md:grid-cols-[1.1fr_2fr_1.3fr_0.8fr_0.7fr_auto]' : 'md:grid-cols-[2fr_1.3fr_0.8fr_0.7fr_auto]'} gap-4 px-5 h-10 items-center border-b border-line bg-paper/60 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted`}>
          {showStudent && <div>Student</div>}
          <div>Quiz</div>
          <div>Submitted</div>
          <div>Time</div>
          <div>Score</div>
          <div className="w-5" />
        </div>
        <ul className="divide-y divide-line">
          {rows.map((a, i) => {
            const t = getTopic(a.topicId);
            return (
              <motion.li
                key={a.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: Math.min(i, 12) * 0.02 }}
                className={`group grid grid-cols-[1fr_auto] ${showStudent ? 'md:grid-cols-[1.1fr_2fr_1.3fr_0.8fr_0.7fr_auto]' : 'md:grid-cols-[2fr_1.3fr_0.8fr_0.7fr_auto]'} gap-x-4 gap-y-1 px-5 py-3.5 items-center hover:bg-paper/60 cursor-pointer transition-colors`}
                onClick={() => onOpen(a)}
              >
                {showStudent && <div className="font-medium text-sm col-span-2 md:col-span-1">{a.studentName}</div>}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-8 h-8 rounded-md bg-paper text-ink-muted hidden sm:flex items-center justify-center shrink-0"><TopicIcon icon={t?.icon ?? ''} className="w-3.5 h-3.5" /></span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{t?.title ?? a.topicId} · {getQuiz(a.quizId)?.title ?? a.quizTitle}</div>
                    <div className="text-xs text-ink-muted md:hidden">{formatDateTime(a.submittedAt)} · {formatDuration(a.timeTakenSeconds)}</div>
                  </div>
                </div>
                <div className="hidden md:block text-sm text-ink-soft">{formatDateTime(a.submittedAt)}</div>
                <div className="hidden md:block text-sm text-ink-soft tabular">{formatDuration(a.timeTakenSeconds)}</div>
                <div className="flex items-center gap-2 justify-end md:justify-start">
                  <ScoreBadge pct={a.percentage} />
                  <span className="text-xs text-ink-muted tabular hidden lg:inline">{a.score}/{a.total}</span>
                </div>
                <div className="hidden md:flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
                  {actions?.(a)}
                  <ChevronRight className="w-4 h-4 text-ink-faint group-hover:text-ink transition-colors" />
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
