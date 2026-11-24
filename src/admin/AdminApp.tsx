import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LayoutDashboard, ListOrdered, BookOpen, Eye } from 'lucide-react';
import {
  listAttempts, listStudents, loadAllSettings, subscribeToChanges, emptySettings,
  type Attempt, type Profile, type StudentSettings,
} from '../lib/supabase';
import { useRoute } from '../lib/router';
import { initials } from '../lib/format';
import { getQuiz, getTopic } from '../lib/bank';
import { Shell, type NavSection } from '../components/Shell';
import { Spinner } from '../components/ui';
import { Overview } from './Overview';
import { Submissions } from './Submissions';
import { StudentDetail } from './StudentDetail';
import { AttemptDetail } from './AttemptDetail';
import { QuestionBank } from './QuestionBank';

export interface AdminData {
  students: Profile[];
  attempts: Attempt[];
  settings: Map<string, StudentSettings>;
  settingsFor: (userId: string) => StudentSettings;
  refresh: () => Promise<void>;
  live: boolean;
}

export function AdminApp({ profile, onSignOut, onPreview }: { profile: Profile; onSignOut: () => void; onPreview: () => void }) {
  const route = useRoute();
  const [students, setStudents] = useState<Profile[] | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [settings, setSettings] = useState<Map<string, StudentSettings>>(new Map());
  const [error, setError] = useState('');
  const [live, setLive] = useState(false);
  const [toast, setToast] = useState<ReactNode>(null);
  const known = useRef<Set<string> | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [s, a, st] = await Promise.all([listStudents(), listAttempts(), loadAllSettings()]);
      const studentIds = new Set(s.map(x => x.id));
      const studentAttempts = a.filter(x => studentIds.has(x.userId));
      if (known.current) {
        const fresh = studentAttempts.find(x => !known.current!.has(x.id));
        if (fresh) {
          setToast(
            <span><b>{fresh.studentName}</b> submitted {getTopic(fresh.topicId)?.title} · {getQuiz(fresh.quizId)?.title ?? fresh.quizTitle} — <b>{fresh.percentage}%</b></span>,
          );
        }
      }
      known.current = new Set(studentAttempts.map(x => x.id));
      setStudents(s);
      setAttempts(studentAttempts);
      setSettings(st);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load data.');
      setStudents(prev => prev ?? []);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const unsub = subscribeToChanges(() => void refresh(), setLive);
    const poll = setInterval(() => void refresh(), 30_000);
    const onFocus = () => void refresh();
    window.addEventListener('focus', onFocus);
    return () => {
      unsub();
      clearInterval(poll);
      window.removeEventListener('focus', onFocus);
    };
  }, [refresh]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  if (students === null) {
    return <div className="min-h-screen flex items-center justify-center gap-3 text-ink-muted"><Spinner /> Loading admin dashboard…</div>;
  }

  const data: AdminData = {
    students,
    attempts,
    settings,
    settingsFor: id => settings.get(id) ?? emptySettings(id),
    refresh,
    live,
  };

  const [view, param] = route;
  const sections: NavSection[] = [
    {
      items: [
        { key: 'overview', label: 'Overview', href: '', icon: <LayoutDashboard className="w-4 h-4" strokeWidth={1.75} /> },
        { key: 'submissions', label: 'All submissions', href: 'submissions', icon: <ListOrdered className="w-4 h-4" strokeWidth={1.75} />, meta: attempts.length || undefined },
      ],
    },
    {
      label: 'Students',
      items: students.map(s => ({
        key: `student-${s.id}`,
        label: s.name,
        href: `student/${s.id}`,
        icon: <span className="w-4 h-4 rounded-full bg-white/15 text-[10px] font-semibold flex items-center justify-center">{initials(s.name)}</span>,
        meta: attempts.filter(a => a.userId === s.id).length || undefined,
      })),
    },
    {
      label: 'Content',
      items: [
        { key: 'bank', label: 'Question bank', href: 'bank', icon: <BookOpen className="w-4 h-4" strokeWidth={1.75} /> },
        { key: 'preview', label: 'Open student view', href: '', onClick: onPreview, icon: <Eye className="w-4 h-4" strokeWidth={1.75} /> },
      ],
    },
  ];

  let activeKey = 'overview';
  let content: ReactNode;
  if (view === 'submissions') {
    activeKey = 'submissions';
    content = <Submissions key="subs" data={data} />;
  } else if (view === 'student' && param && students.some(s => s.id === param)) {
    activeKey = `student-${param}`;
    content = <StudentDetail key={param} student={students.find(s => s.id === param)!} data={data} />;
  } else if (view === 'attempt' && param) {
    const a = attempts.find(x => x.id === param);
    activeKey = a ? `student-${a.userId}` : 'submissions';
    content = <AttemptDetail key={param} attempt={a} data={data} />;
  } else if (view === 'bank') {
    activeKey = 'bank';
    content = <QuestionBank key="bank" topicParam={param} />;
  } else {
    content = <Overview key="overview" data={data} error={error} />;
  }

  return (
    <Shell sections={sections} activeKey={activeKey} user={{ name: profile.name, subtitle: 'Administrator' }} onSignOut={onSignOut}>
      <AnimatePresence mode="wait">{content}</AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-5 right-5 left-5 sm:left-auto z-50 bg-ink text-white text-sm px-4 py-3 rounded-lg shadow-lift sm:max-w-sm flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-good shrink-0 animate-pulse" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  );
}
