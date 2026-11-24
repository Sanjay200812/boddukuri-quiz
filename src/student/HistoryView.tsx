import type { StudentData } from './StudentApp';
import { navigate } from '../lib/router';
import { average } from '../lib/format';
import { AttemptTable } from '../components/AttemptTable';
import { Page, PageHeader } from '../components/ui';

export function HistoryView({ data }: { data: StudentData }) {
  const { attempts } = data;
  return (
    <Page>
      <PageHeader eyebrow="History" title="My results">
        {attempts.length
          ? `${attempts.length} submission${attempts.length === 1 ? '' : 's'} · average ${average(attempts.map(a => a.percentage))}%. Open any result to review every answer with explanations.`
          : 'Every quiz you submit is listed here with its full answer review.'}
      </PageHeader>
      <AttemptTable
        attempts={attempts}
        onOpen={a => navigate(`result/${a.id}`)}
        emptyText="Pick a topic from the sidebar and finish a set to see your first result."
      />
    </Page>
  );
}
