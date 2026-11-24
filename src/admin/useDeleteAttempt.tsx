import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { AdminData } from './AdminApp';
import { deleteAttempt, type Attempt } from '../lib/supabase';
import { getQuiz, getTopic } from '../lib/bank';
import { Modal, Spinner } from '../components/ui';

/** Delete-confirmation for a single attempt; shared by several admin screens. */
export function useDeleteAttempt(data: AdminData, after?: () => void) {
  const [target, setTarget] = useState<Attempt | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const modal = (
    <Modal
      open={Boolean(target)}
      onClose={() => !busy && setTarget(null)}
      title="Delete this submission?"
      footer={
        <>
          <button className="btn-outline" disabled={busy} onClick={() => setTarget(null)}>Cancel</button>
          <button
            className="btn-danger"
            disabled={busy}
            onClick={async () => {
              if (!target) return;
              setBusy(true);
              setErr('');
              try {
                await deleteAttempt(target.id);
                await data.refresh();
                setTarget(null);
                after?.();
              } catch (e) {
                setErr(e instanceof Error ? e.message : 'Delete failed.');
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? <Spinner className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />} Delete
          </button>
        </>
      }
    >
      {target && (
        <>
          {target.studentName}'s {getTopic(target.topicId)?.title} · {getQuiz(target.quizId)?.title ?? target.quizTitle} result ({target.percentage}%) will be removed from both dashboards. This cannot be undone.
        </>
      )}
      {err && <div className="mt-2 text-bad">{err}</div>}
    </Modal>
  );
  return { ask: setTarget, modal };
}
