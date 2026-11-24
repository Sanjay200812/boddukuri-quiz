import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence } from 'motion/react';
import { House, History as HistoryIcon, Eye, ArrowLeft } from 'lucide-react';
import {
  listAttempts, loadSettings, submitAttempt, subscribeToChanges, emptySettings, loadProfile,
  type Attempt, type Profile, type StudentSettings,
} from '../lib/supabase';
import { TOPICS, getQuiz, getTopic, quizzesForTopic } from '../lib/bank';
import { addPending, loadPending, removePending } from '../lib/local';
import { navigate, Redirect, useRoute } from '../lib/router';
import { Shell, type NavSection } from '../components/Shell';
import { QuizPlayer } from '../components/QuizPlayer';
import { TopicIcon, Spinner } from '../components/ui';
import { Home } from './Home';
import { TopicView } from './TopicView';
import { HistoryView } from './HistoryView';
import { ResultView } from './ResultView';

export interface StudentData {
  profile: Profile;
  attempts: Attempt[];
  settings: StudentSettings;
  isLocked: (quizId: string) => boolean;
  visibleTopics: typeof TOPICS;
}

interface Props {
  profile: Profile;
  onSignOut: () => void;
  /** Present when the admin is previewing the student workspace. */
  onExitPreview?: () => void;
}

export function StudentApp({ profile: initialProfile, onSignOut, onExitPreview }: Props) {
  const route = useRoute();
  const [profile, setProfile] = useState(initialProfile);
  const [attempts, setAttempts] = useState<Attempt[] | null>(null);
  const [settings, setSettings] = useState<StudentSettings>(() => emptySettings(initialProfile.id));
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState('');
  const isPreview = Boolean(onExitPreview);
  const settingsStamp = useRef('');

  const refresh = useCallback(async () => {
    try {
      // Upload anything that was submitted while offline first.
      for (const p of loadPending(profile.id)) {
        try {
          await submitAttempt(p);
          removePending(profile.id, p.id);
        } catch { /* still offline */ }
      }
      const [a, s, p] = await Promise.all([
        listAttempts(profile.id),
        isPreview ? Promise.resolve(emptySettings(profile.id)) : loadSettings(profile.id),
        loadProfile(profile.id),
      ]);
      const pending = loadPending(profile.id);
      setAttempts([...pending.filter(x => !a.some(y => y.id === x.id)), ...a]);
      if (settingsStamp.current && settingsStamp.current !== s.updatedAt && !isPreview) {
        setToast('Sanju updated your workspace.');
      }
      settingsStamp.current = s.updatedAt;
      setSettings(s);
      setProfile(p);
      setLoadError('');
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load your progress.');
      setAttempts(prev => prev ?? loadPending(profile.id));
    }
  }, [profile.id, isPreview]);

  useEffect(() => {
    void refresh();
    const unsub = subscribeToChanges(() => void refresh());
    const onFocus = () => void refresh();
    window.addEventListener('focus', onFocus);
    window.addEventListener('online', onFocus);
    const poll = setInterval(() => void refresh(), 60_000);
    return () => {
      unsub();
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('online', onFocus);
      clearInterval(poll);
    };
  }, [refresh]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const visibleTopics = useMemo(() => TOPICS.filter(t => !settings.hiddenTopicIds.includes(t.id)), [settings]);
  const isLocked = useCallback((quizId: string) => {
    const quiz = getQuiz(quizId);
    return settings.lockedQuizIds.includes(quizId) || (quiz ? settings.hiddenTopicIds.includes(quiz.topicId) : true);
  }, [settings]);

  const handleSubmit = useCallback(async (quizId: string, answers: (number | null)[], elapsed: number) => {
    const quiz = getQuiz(quizId)!;
    const records = quiz.questions.map((q, i) => ({ qid: q.id, sel: answers[i], correct: answers[i] === q.answer }));
    const score = records.filter(r => r.correct).length;
    const attempt: Attempt = {
      id: crypto.randomUUID(),
      userId: profile.id,
      studentName: profile.name,
      quizId: quiz.id,
      topicId: quiz.topicId,
      quizTitle: quiz.title,
      score,
      total: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100),
      timeTakenSeconds: elapsed,
      answers: records,
      submittedAt: new Date().toISOString(),
    };
    try {
      const saved = await submitAttempt(attempt);
      setAttempts(prev => [saved, ...(prev ?? []).filter(a => a.id !== saved.id)]);
    } catch (err) {
      if (navigator.onLine) throw err;
      // Offline: keep it locally and upload automatically when back online.
      addPending(profile.id, attempt);
      setAttempts(prev => [attempt, ...(prev ?? [])]);
      setToast('You are offline. The result is saved and will upload automatically.');
    }
    navigate(`result/${attempt.id}`, { replace: true });
  }, [profile]);

  const [view, param] = route;

  if (attempts === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-muted gap-3">
        <Spinner /> Loading your workspace…
      </div>
    );
  }

  const data: StudentData = { profile, attempts, settings, isLocked, visibleTopics };

  // Focus mode: the quiz runs full-screen without the sidebar.
  if (view === 'quiz' && param) {
    const quiz = getQuiz(param);
    if (!quiz || isLocked(param)) return <Redirect to={quiz ? `topic/${quiz.topicId}` : ''} />;
    return (
      <QuizPlayer
        key={quiz.id}
        quiz={quiz}
        userId={profile.id}
        onSubmit={(answers, elapsed) => handleSubmit(quiz.id, answers, elapsed)}
        onExit={() => navigate(`topic/${quiz.topicId}`)}
      />
    );
  }

  const completedIn = (topicId: string) =>
    new Set(attempts.filter(a => a.topicId === topicId).map(a => a.quizId)).size;

  const sections: NavSection[] = [
    {
      items: [
        { key: 'home', label: 'Dashboard', href: '', icon: <House className="w-4 h-4" strokeWidth={1.75} /> },
        { key: 'history', label: 'My results', href: 'history', icon: <HistoryIcon className="w-4 h-4" strokeWidth={1.75} />, meta: attempts.length || undefined },
      ],
    },
    {
      label: 'Topics',
      items: visibleTopics.map(t => ({
        key: `topic-${t.id}`,
        label: t.title,
        href: `topic/${t.id}`,
        icon: <TopicIcon icon={t.icon} />,
        meta: `${completedIn(t.id)}/${quizzesForTopic(t.id).length}`,
      })),
    },
  ];

  let activeKey = 'home';
  let content: ReactNode;
  if (view === 'topic' && param && getTopic(param) && visibleTopics.some(t => t.id === param)) {
    activeKey = `topic-${param}`;
    content = <TopicView key={param} topicId={param} data={data} />;
  } else if (view === 'history') {
    activeKey = 'history';
    content = <HistoryView key="history" data={data} />;
  } else if (view === 'result' && param) {
    const attempt = attempts.find(a => a.id === param);
    activeKey = attempt ? `topic-${attempt.topicId}` : 'history';
    content = <ResultView key={param} attempt={attempt} data={data} />;
  } else {
    content = <Home key="home" data={data} loadError={loadError} onRetry={refresh} />;
  }

  return (
    <Shell
      sections={sections}
      activeKey={activeKey}
      user={{ name: profile.name, subtitle: isPreview ? 'Admin · student preview' : 'Student' }}
      onSignOut={onSignOut}
      banner={
        isPreview ? (
          <div className="bg-warn-soft border-b border-warn/20 text-warn text-[13px]">
            <div className="max-w-6xl mx-auto px-4 sm:px-8 h-11 flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 font-medium"><Eye className="w-4 h-4" /> Student view preview — your attempts here are not counted for students.</span>
              <button onClick={onExitPreview} className="flex items-center gap-1 font-semibold hover:underline shrink-0"><ArrowLeft className="w-3.5 h-3.5" /> Back to admin</button>
            </div>
          </div>
        ) : undefined
      }
    >
      <AnimatePresence mode="wait">{content}</AnimatePresence>
      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-ink text-white text-sm px-4 py-2.5 rounded-lg shadow-lift max-w-[90vw]">
          {toast}
        </div>
      )}
    </Shell>
  );
}
