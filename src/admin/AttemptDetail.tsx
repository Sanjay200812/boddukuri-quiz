import { ArrowLeft, Trash2 } from 'lucide-react';
import type { AdminData } from './AdminApp';
import type { Attempt } from '../lib/supabase';
import { navigate } from '../lib/router';
import { AnswerList, ResultSummary } from '../components/AttemptReview';
import { Empty, Page } from '../components/ui';
import { useDeleteAttempt } from './useDeleteAttempt';

export function AttemptDetail({ attempt, data }: { attempt?: Attempt; data: AdminData }) {
  const del = useDeleteAttempt(data, () => navigate(attempt ? `student/${attempt.userId}` : 'submissions', { replace: true }));
  if (!attempt) {
    return (
      <Page>
        <Empty title="Submission not found" action={<button className="btn-outline" onClick={() => navigate('submissions')}>All submissions</button>}>
          It may have been deleted.
        </Empty>
      </Page>
    );
  }
  return (
    <Page className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => navigate(`student/${attempt.userId}`)} className="btn-ghost -ml-3 h-8">
          <ArrowLeft className="w-4 h-4" /> {attempt.studentName}
        </button>
        <button onClick={() => del.ask(attempt)} className="btn-danger h-9"><Trash2 className="w-4 h-4" /> Delete</button>
      </div>
      <ResultSummary attempt={attempt} showName />
      <AnswerList attempt={attempt} />
      {del.modal}
    </Page>
  );
}
