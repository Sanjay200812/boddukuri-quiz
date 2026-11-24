import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import type { Attempt } from '../lib/supabase';
import type { StudentData } from './StudentApp';
import { getQuiz, getTopic, quizzesForTopic } from '../lib/bank';
import { navigate } from '../lib/router';
import { AnswerList, ResultSummary } from '../components/AttemptReview';
import { Empty, Page } from '../components/ui';

export function ResultView({ attempt, data }: { attempt?: Attempt; data: StudentData }) {
  if (!attempt) {
    return (
      <Page>
        <Empty title="Result not found" action={<button className="btn-outline" onClick={() => navigate('history')}>Go to my results</button>}>
          It may have been removed by Sanju.
        </Empty>
      </Page>
    );
  }
  const quiz = getQuiz(attempt.quizId);
  const topic = getTopic(attempt.topicId);
  const sets = quizzesForTopic(attempt.topicId);
  const next = quiz ? sets.find(q => q.number > quiz.number && !data.isLocked(q.id)) : undefined;
  const tries = data.attempts.filter(a => a.quizId === attempt.quizId);
  const prevTry = tries[tries.findIndex(a => a.id === attempt.id) + 1];

  return (
    <Page className="space-y-8">
      <button onClick={() => navigate(`topic/${attempt.topicId}`)} className="btn-ghost -ml-3 h-8">
        <ArrowLeft className="w-4 h-4" /> {topic?.title ?? 'Back'}
      </button>

      <ResultSummary attempt={attempt} />

      <div className="flex flex-wrap items-center gap-2">
        {quiz && !data.isLocked(quiz.id) && (
          <button className="btn-outline" onClick={() => navigate(`quiz/${quiz.id}`)}><RotateCcw className="w-4 h-4" /> Retake this set</button>
        )}
        {next && <button className="btn-primary" onClick={() => navigate(`quiz/${next.id}`)}>Next: {next.title} <ArrowRight className="w-4 h-4" /></button>}
        {prevTry && (
          <span className="text-sm text-ink-muted ml-1">
            Previous attempt: {prevTry.percentage}%
            {attempt.percentage !== prevTry.percentage && (
              <span className={attempt.percentage > prevTry.percentage ? 'text-good font-medium' : 'text-bad font-medium'}>
                {' '}({attempt.percentage > prevTry.percentage ? '+' : ''}{attempt.percentage - prevTry.percentage} pts)
              </span>
            )}
          </span>
        )}
      </div>

      <AnswerList attempt={attempt} />
    </Page>
  );
}
