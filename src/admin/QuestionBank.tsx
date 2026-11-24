import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { QUIZZES, TOPICS, TOTAL_QUESTIONS, getTopic, quizzesForTopic } from '../lib/bank';
import { navigate } from '../lib/router';
import { Page, PageHeader, TopicIcon } from '../components/ui';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export function QuestionBank({ topicParam }: { topicParam?: string }) {
  const topicId = topicParam && getTopic(topicParam) ? topicParam : TOPICS[0].id;
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (q.length < 2) return null;
    return QUIZZES.flatMap(quiz => quiz.questions
      .map((x, i) => ({ quiz, x, n: i + 1 }))
      .filter(({ x }) => x.q.toLowerCase().includes(q) || x.options.some(o => o.toLowerCase().includes(q))));
  }, [q]);

  return (
    <Page>
      <PageHeader eyebrow="Content" title="Question bank">
        {TOTAL_QUESTIONS} questions in {QUIZZES.length} sets of 30, across {TOPICS.length} topics. Built from the study PDFs and the earlier topic notes.
      </PageHeader>

      <div className="relative mb-5 max-w-md">
        <Search className="w-4 h-4 text-ink-faint absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search questions and options…"
          className="w-full h-10 pl-9 pr-3 rounded-lg border border-line bg-white text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
        />
      </div>

      {results ? (
        <div>
          <div className="text-sm text-ink-muted mb-3">{results.length} match{results.length === 1 ? '' : 'es'}</div>
          <div className="space-y-2">
            {results.slice(0, 60).map(({ quiz, x, n }) => (
              <QuestionCard key={x.id} label={`${getTopic(quiz.topicId)?.title} · ${quiz.title} · Q${n}`} question={x} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-3 -mx-1 px-1">
            {TOPICS.map(t => (
              <button
                key={t.id}
                onClick={() => navigate(`bank/${t.id}`, { replace: true })}
                className={`chip h-8 px-3 border whitespace-nowrap ${t.id === topicId ? 'bg-ink text-white border-ink' : 'bg-white text-ink-soft border-line hover:border-ink-faint'}`}
              >
                <TopicIcon icon={t.icon} className="w-3.5 h-3.5" /> {t.title}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {quizzesForTopic(topicId).map(quiz => {
              const isOpen = open === quiz.id;
              return (
                <div key={quiz.id} className="card overflow-hidden">
                  <button onClick={() => setOpen(isOpen ? null : quiz.id)} className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-paper/50">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{quiz.title}</div>
                      <div className="text-xs text-ink-muted truncate">{quiz.questions.length} questions{quiz.subtitle ? ` · ${quiz.subtitle}` : ''}</div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-ink-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="border-t border-line p-3 space-y-2 bg-paper/40">
                          {quiz.questions.map((x, i) => <QuestionCard key={x.id} label={`Q${i + 1}`} question={x} />)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Page>
  );
}

function QuestionCard({ label, question }: { label: string; question: { q: string; options: string[]; answer: number; explanation?: string } }) {
  return (
    <div className="rounded-lg bg-white border border-line p-4">
      <div className="text-[11px] font-medium text-ink-faint mb-1">{label}</div>
      <p className="text-sm font-medium leading-relaxed whitespace-pre-line">{question.q}</p>
      <ul className="mt-2 grid sm:grid-cols-2 gap-1">
        {question.options.map((o, i) => (
          <li key={i} className={`text-[13px] rounded-md px-2.5 py-1.5 ${i === question.answer ? 'bg-good-soft text-good font-medium' : 'text-ink-muted'}`}>
            <span className="font-semibold mr-1.5">{LETTERS[i]}</span>{o}
          </li>
        ))}
      </ul>
      {question.explanation && <p className="mt-2 text-xs text-ink-muted leading-relaxed">{question.explanation}</p>}
    </div>
  );
}
