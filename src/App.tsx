import React, { useState, useEffect, useCallback } from 'react';
import { DAILY_QUIZZES, getQuizForDay } from './data/quizzes';
import type { 
  QuizAttempt, 
  DailyQuiz, 
  OverallProgress 
} from './types/quiz';
import { 
  getOverallProgress, 
  clearInProgressQuiz,
  getAllAttempts,
  getProgressSnapshot,
  mergeProgressSnapshot,
  STORAGE_CHANGE_EVENT
} from './utils/storage';
import { evaluateBadges } from './utils/achievements';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { QuizRunner } from './components/QuizRunner';
import { ResultDashboard } from './components/ResultDashboard';
import { AnswerSheet } from './components/AnswerSheet';
import { ProgressHistory } from './components/ProgressHistory';
import { StudyGuide } from './components/StudyGuide';
import { SettingsModal } from './components/SettingsModal';
import { BadgesModal } from './components/BadgesModal';
import { OpeningMotivation } from './components/OpeningMotivation';
import { LoginScreen } from './components/LoginScreen';
import { supabase, loadCloudProgress, saveCloudProgress } from './utils/supabase';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  // Opening Motivation state (once per session, replayable from Settings)
  const [hasSeenMotivation, setHasSeenMotivation] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return sessionStorage.getItem('mahi_motivation_seen') === 'true';
  });

  // Supabase Auth session gate
  const [sessionChecked, setSessionChecked] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'offline' | 'pending'>(() => 
    typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'synced'
  );

  // Views: 'dashboard' | 'progress' | 'study' | 'quiz' | 'result' | 'review'
  const [currentView, setCurrentView] = useState<'dashboard' | 'progress' | 'study' | 'quiz' | 'result' | 'review'>('dashboard');
  const [activeQuizId, setActiveQuizId] = useState<string>(DAILY_QUIZZES[0].id);
  const [activeAttempt, setActiveAttempt] = useState<QuizAttempt | null>(null);
  const [studyGuideInitialState, setStudyGuideInitialState] = useState<string | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState<boolean>(false);
  const [overallProgress, setOverallProgress] = useState<OverallProgress>(() => getOverallProgress(DAILY_QUIZZES));

  // Refresh progress state whenever returning to dashboard or after actions
  const refreshProgress = useCallback(() => {
    setOverallProgress(getOverallProgress(DAILY_QUIZZES));
  }, []);

  // Cloud Sync Handler
  const performCloudSync = useCallback(async (uid: string) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setSyncStatus('offline');
      return;
    }
    try {
      setSyncStatus('pending');
      const cloudData = await loadCloudProgress(uid);
      const merged = cloudData ? mergeProgressSnapshot(cloudData) : getProgressSnapshot();
      await saveCloudProgress(uid, merged);
      setSyncStatus('synced');
      refreshProgress();
    } catch (err) {
      console.warn('Cloud sync advisory:', err);
      setSyncStatus(typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'pending');
    }
  }, [refreshProgress]);

  // Auth Gate: Check active session on mount
  useEffect(() => {
    if (!supabase) {
      setSessionChecked(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (user) {
        setUserEmail(user.email || null);
        setUserId(user.id);
        void performCloudSync(user.id);
      }
      setSessionChecked(true);
    }).catch(() => {
      setSessionChecked(true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user;
      if (user) {
        setUserEmail(user.email || null);
        setUserId(user.id);
        if (event !== 'SIGNED_OUT') {
          void performCloudSync(user.id);
        }
      } else {
        setUserEmail(null);
        setUserId(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [performCloudSync]);

  // Online / Offline transitions
  useEffect(() => {
    const handleOnline = () => {
      if (userId) {
        void performCloudSync(userId);
      } else {
        setSyncStatus('synced');
      }
    };
    const handleOffline = () => setSyncStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [userId, performCloudSync]);

  // Storage listener
  useEffect(() => {
    refreshProgress();
    const onStorageChanged = () => {
      refreshProgress();
      if (userId && typeof navigator !== 'undefined' && navigator.onLine) {
        const snap = getProgressSnapshot();
        void saveCloudProgress(userId, snap).catch(() => setSyncStatus('pending'));
      }
    };
    window.addEventListener(STORAGE_CHANGE_EVENT, onStorageChanged);
    window.addEventListener('storage', onStorageChanged);
    return () => {
      window.removeEventListener(STORAGE_CHANGE_EVENT, onStorageChanged);
      window.removeEventListener('storage', onStorageChanged);
    };
  }, [refreshProgress, userId]);

  // Current active quiz object (supports Days 01 to 07)
  const currentQuiz: DailyQuiz = (() => {
    const dayMatch = activeQuizId.match(/\d+/);
    if (dayMatch) {
      const dayNum = parseInt(dayMatch[0], 10);
      return getQuizForDay(dayNum);
    }
    return DAILY_QUIZZES[0];
  })();

  // Handler: Start or resume a quiz
  const handleStartQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Quiz submitted & finished
  const handleFinishQuiz = (attempt: QuizAttempt) => {
    setActiveAttempt(attempt);
    refreshProgress();
    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: View past result
  const handleViewResult = (attempt: QuizAttempt) => {
    setActiveAttempt(attempt);
    setActiveQuizId(attempt.quizId);
    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Open Answer Sheet from Result or History
  const handleReviewAnswers = (attempt?: QuizAttempt) => {
    if (attempt) {
      setActiveAttempt(attempt);
      setActiveQuizId(attempt.quizId);
    }
    setCurrentView('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Reattempt quiz (clears in-progress to start clean new attempt)
  const handleReattempt = () => {
    if (activeQuizId) {
      clearInProgressQuiz(activeQuizId);
      setCurrentView('quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handler: Go to dashboard
  const handleGoHome = () => {
    refreshProgress();
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Open Study Guide
  const handleOpenStudyGuide = (stateName?: string) => {
    setStudyGuideInitialState(stateName);
    setCurrentView('study');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Sign out
  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUserEmail(null);
    setUserId(null);
  };

  // -------------------------------------------------------------
  // GATES: MOTIVATION & AUTHENTICATION
  // -------------------------------------------------------------

  // 1. Show Opening Motivation if not seen this session
  if (!hasSeenMotivation) {
    return (
      <OpeningMotivation
        onComplete={() => {
          sessionStorage.setItem('mahi_motivation_seen', 'true');
          setHasSeenMotivation(true);
        }}
      />
    );
  }

  // 2. Loading splash while verifying persistent Supabase session
  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#072415] text-white">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-700/60 border border-emerald-500/40 shadow-xl shadow-emerald-900/50 animate-bounce">
            <Sparkles className="w-8 h-8 text-emerald-200" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Boddukuri's Quiz #Mahi</h2>
          <p className="text-xs text-emerald-200/70">Connecting to learning portal…</p>
        </div>
      </div>
    );
  }

  // 3. Authentication Gate: If not logged in, render mobile-first LoginScreen
  if (!userEmail) {
    return (
      <LoginScreen
        onLoginSuccess={(email) => {
          setUserEmail(email);
        }}
        onReplayMotivation={() => {
          setHasSeenMotivation(false);
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // MAIN APPLICATION (RENDERED ONLY AFTER SUCCESSFUL LOGIN)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF7] text-slate-800">
      
      {/* Sticky Header with branding, streak counter & navigation */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          refreshProgress();
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenBadges={() => setIsBadgesModalOpen(true)}
        streakDays={overallProgress.currentStreak}
        unlockedBadgesCount={overallProgress.unlockedBadgesCount}
        completedQuizzesCount={overallProgress.totalCompletedDays}
        totalQuizzesCount={DAILY_QUIZZES.length}
        syncStatus={syncStatus}
        userEmail={userEmail}
        onSignOut={handleSignOut}
      />

      {/* Main Body Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* VIEW 1: DASHBOARD */}
        {currentView === 'dashboard' && (
          <Dashboard
            quizzes={DAILY_QUIZZES}
            overallProgress={overallProgress}
            onStartQuiz={handleStartQuiz}
            onViewResult={handleViewResult}
            onOpenStudyGuide={handleOpenStudyGuide}
            onOpenBadges={() => setIsBadgesModalOpen(true)}
          />
        )}

        {/* VIEW 2: QUIZ RUNNER */}
        {currentView === 'quiz' && (
          <QuizRunner
            key={activeQuizId}
            quiz={currentQuiz}
            onFinishQuiz={handleFinishQuiz}
            onExit={handleGoHome}
          />
        )}

        {/* VIEW 3: RESULT DASHBOARD */}
        {currentView === 'result' && activeAttempt && (
          <ResultDashboard
            attempt={activeAttempt}
            quiz={currentQuiz}
            onReviewAnswers={() => handleReviewAnswers()}
            onReattempt={handleReattempt}
            onGoHome={handleGoHome}
          />
        )}

        {/* VIEW 4: ANSWER SHEET & EXPLANATIONS */}
        {currentView === 'review' && activeAttempt && (
          <AnswerSheet
            attempt={activeAttempt}
            quiz={currentQuiz}
            onBackToResult={() => setCurrentView('result')}
            onReattempt={handleReattempt}
            onGoHome={handleGoHome}
          />
        )}

        {/* VIEW 5: PROGRESS & ATTEMPTS HISTORY */}
        {currentView === 'progress' && (
          <ProgressHistory
            quizzes={DAILY_QUIZZES}
            overallProgress={overallProgress}
            onSelectAttempt={handleReviewAnswers}
            onStartQuiz={handleStartQuiz}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onGoHome={handleGoHome}
          />
        )}

        {/* VIEW 6: NATIONAL PARKS STUDY GUIDE */}
        {currentView === 'study' && (
          <StudyGuide
            quizzes={DAILY_QUIZZES}
            initialState={studyGuideInitialState}
            onStartQuiz={handleStartQuiz}
            onGoHome={handleGoHome}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <span>🌿 Boddukuri's Quiz</span>
            <span className="text-emerald-700 font-extrabold">#Mahi</span>
            <span>• Learn. Revise. Remember. Achieve.</span>
          </div>
          <div className="text-slate-400">
            Cumulative National Parks learning platform (09 Nov – 15 Nov 2026).
          </div>
        </div>
      </footer>

      {/* Settings & Account Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDataChanged={refreshProgress}
        userEmail={userEmail}
        syncStatus={syncStatus}
        onSyncNow={() => userId && performCloudSync(userId)}
        onSignOut={handleSignOut}
        onReplayMotivation={() => setHasSeenMotivation(false)}
      />

      {/* Badges & Achievements Modal */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        badges={evaluateBadges(getAllAttempts(), overallProgress.currentStreak)}
      />

    </div>
  );
};

export default App;