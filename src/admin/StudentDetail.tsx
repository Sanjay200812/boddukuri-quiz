import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, EyeOff, Lock, LockOpen, RotateCcw, Trash2, Eye } from 'lucide-react';
import type { AdminData } from './AdminApp';
import {
  deleteAttemptsFor, renameStudent, saveSettings, type Profile, type StudentSettings,
} from '../lib/supabase';
import { QUIZZES, TOPICS, quizzesForTopic } from '../lib/bank';
import { average, bestByQuiz, plural, timeAgo } from '../lib/format';
import { navigate } from '../lib/router';
import { AttemptTable } from '../components/AttemptTable';
import { ErrorNote, Modal, Page, PageHeader, ScoreBadge, Spinner, Stat, TopicIcon } from '../components/ui';
import { useDeleteAttempt } from './useDeleteAttempt';

type Tab = 'progress' | 'submissions' | 'settings';

export function StudentDetail({ student, data }: { student: Profile; data: AdminData }) {
  const [tab, setTab] = useState<Tab>('progress');
  const attempts = data.attempts.filter(a => a.userId === student.id);
  const best = bestByQuiz(attempts);
  const [settings, setSettings] = useState<StudentSettings>(data.settingsFor(student.id));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [reset, setReset] = useState<{ topicId?: string; quizId?: string; label: string } | null>(null);
  const [resetBusy, setResetBusy] = useState(false);
  const del = useDeleteAttempt(data);

  // Keep in sync with realtime changes made elsewhere.
  const remote = data.settingsFor(student.id);
  useEffect(() => setSettings(remote), [remote.updatedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  async function persist(next: StudentSettings) {
    const prev = settings;
    setSettings(next);
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await saveSettings(next);
      await data.refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setSettings(prev);
      setError(e instanceof Error ? e.message : 'Could not save.');
    } finally {
      setSaving(false);
    }
  }

  const toggleQuiz = (quizId: string) => {
    const locked = settings.lockedQuizIds.includes(quizId);
    void persist({ ...settings, lockedQuizIds: locked ? settings.lockedQuizIds.filter(x => x !== quizId) : [...settings.lockedQuizIds, quizId] });
  };
  const toggleTopic = (topicId: string) => {
    const hidden = settings.hiddenTopicIds.includes(topicId);
    void persist({ ...settings, hiddenTopicIds: hidden ? settings.hiddenTopicIds.filter(x => x !== topicId) : [...settings.hiddenTopicIds, topicId] });
  };
  const setTopicLocks = (topicId: string, lock: boolean) => {
    const ids = quizzesForTopic(topicId).map(q => q.id);
    const rest = settings.lockedQuizIds.filter(x => !ids.includes(x));
    void persist({ ...settings, lockedQuizIds: lock ? [...rest, ...ids] : rest });
  };

  async function doReset() {
    if (!reset) return;
    setResetBusy(true);
    setError('');
    try {
      if (reset.quizId) await deleteAttemptsFor(student.id, reset.quizId);
      else if (reset.topicId) {
        for (const q of quizzesForTopic(reset.topicId)) await deleteAttemptsFor(student.id, q.id);
      } else await deleteAttemptsFor(student.id);
      await data.refresh();
      setReset(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Reset failed.');
    } finally {
      setResetBusy(false);
    }
  }

  const statusText = saving ? <span className="flex items-center gap-1.5 text-ink-muted"><Spinner className="w-3.5 h-3.5" /> Saving…</span>
    : saved ? <span className="flex items-center gap-1.5 text-good"><Check className="w-3.5 h-3.5" /> Saved · {student.name} sees it now</span> : null;

  return (
    <Page>
      <PageHeader
        eyebrow="Student"
        title={student.name}
        actions={<div className="text-sm h-10 flex items-center">{statusText}</div>}
      >
        {attempts[0] ? `Last submission ${timeAgo(attempts[0].submittedAt)}.` : 'No submissions yet.'} Changes you make here apply only to {student.name} and show up on their dashboard instantly.
      </PageHeader>

      {error && <div className="mb-6"><ErrorNote message={error} /></div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <Stat label="Sets completed" value={<>{best.size}<span className="text-ink-faint text-xl">/{QUIZZES.length}</span></>} />
        <Stat label="Average" value={attempts.length ? `${average(attempts.map(a => a.percentage))}%` : '—'} />
        <Stat label="Attempts" value={attempts.length} />
        <Stat label="Locked" value={settings.lockedQuizIds.length + settings.hiddenTopicIds.length} hint={`${plural(settings.lockedQuizIds.length, 'set')} locked · ${plural(settings.hiddenTopicIds.length, 'topic')} hidden`} />
      </div>

      <div className="border-b border-line mb-6 flex gap-6">
        {([['progress', 'Progress & access'], ['submissions', `Submissions (${attempts.length})`], ['settings', 'Profile & note']] as [Tab, string][]).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} className={`relative pb-3 text-sm font-medium transition-colors ${tab === k ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}>
            {label}
            {tab === k && <motion.span layoutId="student-tab" className="absolute left-0 right-0 -bottom-px h-0.5 bg-ink" />}
          </button>
        ))}
      </div>

      {tab === 'progress' && (
        <div className="space-y-4">
          {TOPICS.map(t => {
            const sets = quizzesForTopic(t.id);
            const hidden = settings.hiddenTopicIds.includes(t.id);
            const allLocked = sets.every(q => settings.lockedQuizIds.includes(q.id));
            const topicAttempts = attempts.filter(a => a.topicId === t.id).length;
            return (
              <div key={t.id} className={`card ${hidden ? 'opacity-70' : ''}`}>
                <div className="px-5 py-3.5 flex flex-wrap items-center gap-3 border-b border-line">
                  <TopicIcon icon={t.icon} className="w-4 h-4 text-ink-muted" />
                  <div className="font-semibold flex-1 min-w-[140px]">{t.title}{hidden && <span className="ml-2 chip bg-paper text-ink-muted">Hidden</span>}</div>
                  <div className="flex flex-wrap gap-1.5">
                    <button disabled={saving} onClick={() => setTopicLocks(t.id, !allLocked)} className="btn-ghost h-8 px-2.5 text-xs">
                      {allLocked ? <><LockOpen className="w-3.5 h-3.5" /> Unlock all</> : <><Lock className="w-3.5 h-3.5" /> Lock all</>}
                    </button>
                    <button disabled={saving} onClick={() => toggleTopic(t.id)} className="btn-ghost h-8 px-2.5 text-xs">
                      {hidden ? <><Eye className="w-3.5 h-3.5" /> Show topic</> : <><EyeOff className="w-3.5 h-3.5" /> Hide topic</>}
                    </button>
                    {topicAttempts > 0 && (
                      <button onClick={() => setReset({ topicId: t.id, label: `all ${t.title} results (${topicAttempts})` })} className="btn-ghost h-8 px-2.5 text-xs text-bad hover:bg-bad-soft">
                        <RotateCcw className="w-3.5 h-3.5" /> Reset topic
                      </button>
                    )}
                  </div>
                </div>
                <ul className="divide-y divide-line">
                  {sets.map(q => {
                    const tries = attempts.filter(a => a.quizId === q.id);
                    const locked = settings.lockedQuizIds.includes(q.id);
                    return (
                      <li key={q.id} className="px-5 py-3 flex items-center gap-3 flex-wrap">
                        <div className="flex-1 min-w-[160px]">
                          <div className="text-sm font-medium">{q.title}</div>
                          <div className="text-xs text-ink-muted truncate">{q.subtitle || `${q.questions.length} questions`}</div>
                        </div>
                        <div className="w-28 text-xs text-ink-muted">
                          {tries.length ? <button className="hover:underline" onClick={() => navigate(`attempt/${tries[0].id}`)}>{plural(tries.length, 'attempt')}</button> : 'Not attempted'}
                        </div>
                        <div className="w-14">{best.get(q.id) ? <ScoreBadge pct={best.get(q.id)!.percentage} /> : <span className="text-ink-faint text-sm">—</span>}</div>
                        <button
                          disabled={saving}
                          onClick={() => toggleQuiz(q.id)}
                          role="switch"
                          aria-checked={!locked}
                          aria-label={`${q.title} ${locked ? 'locked' : 'open'}`}
                          className={`chip h-7 px-2.5 border w-[86px] justify-center transition-colors ${locked ? 'bg-ink text-white border-ink' : 'bg-white text-ink-soft border-line hover:border-ink-faint'}`}
                        >
                          {locked ? <><Lock className="w-3 h-3" /> Locked</> : <><LockOpen className="w-3 h-3" /> Open</>}
                        </button>
                        {tries.length > 0 && (
                          <button onClick={() => setReset({ quizId: q.id, label: `${t.title} · ${q.title} results (${tries.length})` })} className="p-1.5 rounded-md text-ink-faint hover:text-bad hover:bg-bad-soft" aria-label="Reset this set" title="Reset this set">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'submissions' && (
        <AttemptTable
          attempts={attempts}
          onOpen={a => navigate(`attempt/${a.id}`)}
          emptyText={`${student.name} has not submitted any quiz yet.`}
          actions={a => (
            <button onClick={() => del.ask(a)} className="p-1.5 rounded-md text-ink-faint hover:text-bad hover:bg-bad-soft" aria-label="Delete submission">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        />
      )}

      {tab === 'settings' && <ProfileSettings student={student} settings={settings} onSave={persist} onRenamed={data.refresh} onResetAll={() => setReset({ label: `every result of ${student.name} (${attempts.length})` })} attemptsCount={attempts.length} saving={saving} />}

      <Modal
        open={Boolean(reset)}
        onClose={() => !resetBusy && setReset(null)}
        title="Reset progress?"
        footer={
          <>
            <button className="btn-outline" disabled={resetBusy} onClick={() => setReset(null)}>Cancel</button>
            <button className="btn-danger" disabled={resetBusy} onClick={doReset}>{resetBusy ? <Spinner className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />} Reset</button>
          </>
        }
      >
        This permanently deletes {reset?.label}. {student.name}'s dashboard updates immediately. Other students are not affected.
      </Modal>
      {del.modal}
    </Page>
  );
}

function ProfileSettings({ student, settings, onSave, onRenamed, onResetAll, attemptsCount, saving }: {
  student: Profile; settings: StudentSettings; onSave: (s: StudentSettings) => Promise<void>; onRenamed: () => Promise<void>; onResetAll: () => void; attemptsCount: number; saving: boolean;
}) {
  const [name, setName] = useState(student.name);
  const [note, setNote] = useState(settings.note);
  const [nameBusy, setNameBusy] = useState(false);
  const [nameMsg, setNameMsg] = useState('');

  useEffect(() => setNote(settings.note), [settings.note]);

  return (
    <div className="grid lg:grid-cols-2 gap-4 items-start">
      <div className="card p-5">
        <div className="font-semibold">Note on {student.name}'s dashboard</div>
        <p className="text-sm text-ink-muted mt-1">Shown at the top of their dashboard — use it for targets, reminders or feedback. Leave empty to hide it.</p>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={4}
          maxLength={500}
          placeholder={`e.g. Finish Banking Set 2 by Sunday.`}
          className="mt-3 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 resize-y"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-ink-faint tabular">{note.length}/500</span>
          <div className="flex gap-2">
            {settings.note && <button className="btn-ghost h-9" disabled={saving} onClick={() => { setNote(''); void onSave({ ...settings, note: '' }); }}>Clear</button>}
            <button className="btn-primary h-9" disabled={saving || note === settings.note} onClick={() => void onSave({ ...settings, note: note.trim() })}>Save note</button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card p-5">
          <div className="font-semibold">Display name</div>
          <p className="text-sm text-ink-muted mt-1">Used in greetings and on results.</p>
          <form
            className="mt-3 flex gap-2"
            onSubmit={async e => {
              e.preventDefault();
              if (!name.trim() || name.trim() === student.name) return;
              setNameBusy(true);
              setNameMsg('');
              try {
                await renameStudent(student.id, name);
                await onRenamed();
                setNameMsg('Saved.');
              } catch (err) {
                setNameMsg(err instanceof Error ? err.message : 'Could not rename.');
              } finally {
                setNameBusy(false);
              }
            }}
          >
            <input value={name} onChange={e => setName(e.target.value)} maxLength={40} className="flex-1 min-w-0 h-10 rounded-lg border border-line px-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" />
            <button className="btn-outline" disabled={nameBusy || !name.trim() || name.trim() === student.name}>{nameBusy ? <Spinner className="w-4 h-4" /> : 'Rename'}</button>
          </form>
          {nameMsg && <div className="mt-2 text-xs text-ink-muted">{nameMsg}</div>}
        </div>

        <div className="card p-5 border-bad/25">
          <div className="font-semibold">Reset all progress</div>
          <p className="text-sm text-ink-muted mt-1">{attemptsCount === 0 ? `${student.name} has no results yet.` : attemptsCount === 1 ? `Deletes ${student.name}'s only result.` : `Deletes all ${attemptsCount} of ${student.name}'s results.`} Locks, hidden topics and the note are kept.</p>
          <button className="btn-danger mt-3" disabled={attemptsCount === 0} onClick={onResetAll}><RotateCcw className="w-4 h-4" /> Reset {student.name}'s progress</button>
        </div>
      </div>
    </div>
  );
}
