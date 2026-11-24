import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { AdminData } from './AdminApp';
import { navigate } from '../lib/router';
import { AttemptTable } from '../components/AttemptTable';
import { Page, PageHeader } from '../components/ui';
import { useDeleteAttempt } from './useDeleteAttempt';
import { LiveDot } from './Overview';

export function Submissions({ data }: { data: AdminData }) {
  const [student, setStudent] = useState('all');
  const del = useDeleteAttempt(data);
  const rows = student === 'all' ? data.attempts : data.attempts.filter(a => a.userId === student);

  return (
    <Page>
      <PageHeader eyebrow="Admin" title="All submissions" actions={<LiveDot live={data.live} />}>
        Open any submission to see each answer the student chose.
      </PageHeader>

      <div className="inline-flex p-1 rounded-lg bg-white border border-line mb-4">
        {[{ id: 'all', name: 'Everyone' }, ...data.students].map(s => (
          <button
            key={s.id}
            onClick={() => setStudent(s.id)}
            className={`px-3 h-8 rounded-md text-[13px] font-medium transition-colors ${student === s.id ? 'bg-ink text-white' : 'text-ink-muted hover:text-ink'}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <AttemptTable
        attempts={rows}
        showStudent
        onOpen={a => navigate(`attempt/${a.id}`)}
        emptyText="When a student submits a quiz it appears here immediately."
        actions={a => (
          <button onClick={() => del.ask(a)} className="p-1.5 rounded-md text-ink-faint hover:text-bad hover:bg-bad-soft" aria-label="Delete submission" title="Delete submission">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      />
      {del.modal}
    </Page>
  );
}
