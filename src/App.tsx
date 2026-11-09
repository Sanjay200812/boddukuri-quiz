import React, { useState, useEffect, useCallback } from 'react';
import { DAILY_QUIZZES, getQuizForDay } from './data/quizzes';
import type { 
  QuizAttempt, 
  DailyQuiz, 
  OverallProgress,
  UserProfile,
  UserRole
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
import { AdminDashboard } from './components/AdminDashboard';
import { supabase, loadCloudProgress, saveCloudProgress, getUserProfile } from './utils/supabase';
import { Sparkles, ShieldCheck, ArrowLeft } from 'lucide-react';

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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [isAdminPreviewingStudent, setIsAdminPreviewingStudent] = useState<boolean>(false);

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

  // Auth Gate: Check active session on mount & determine role
  useEffect(() => {
    if (!supabase) {
      setSessionChecked(true);
      return;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      if (user) {
        setUserEmail(user.email || null);
        setUserId(user.id);
        const profile = await getUserProfile(user.id);
        if (profile) {
          setUserProfile(profile);
          setUserRole(profile.role);
        }
        void performCloudSync(user.id);
      }
      setSessionChecked(true);
    }).catch(() => {
      setSessionChecked(true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user;
      if (user) {
        setUserEmail(user.email || null);
        setUserId(user.id);
        const profile = await getUserProfile(user.id);
        if (profile) {
          setUserProfile(profile);
          setUserRole(profile.role);
        }
        if (event !== 'SIGNED_OUT') {
          void performCloudSync(user.id);
        }
      } else {
        setUserEmail(null);
        setUserId(null);
        setUserProfile(null);
        setUserRole('student');
        setIsAdminPreviewingStudent(false);
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

  // Current active quiz object (supports Days 01 to 07, Semi-Final, Grand Final)
  const currentQuiz: DailyQuiz = (() => {
    return getQuizForDay(activeQuizId);
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

  // Handler: Reattempt quiz
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
    setUserProfile(null);
    setUserRole('student');
    setIsAdminPreviewingStudent(false);
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
        onLoginSuccess={async (email, role) => {
          setUserEmail(email);
          if (role) {
            setUserRole(role);
          }
          if (supabase) {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user) {
              setUserId(data.session.user.id);
              const p = await getUserProfile(data.session.user.id);
              if (p) {
                setUserProfile(p);
                setUserRole(p.role);
              }
            }
          }
        }}
        onReplayMotivation={() => {
          setHasSeenMotivation(false);
        }}
      />
    );
  }

  // 4. Role Gate: If authenticated user is Admin Sanju and not in preview mode, show Admin Dashboard
  if (userRole === 'admin' && !isAdminPreviewingStudent) {
    return (
      <AdminDashboard
        adminProfile={userProfile || {
          id: userId || 'admin-id',
          email: userEmail,
          role: 'admin',
          fullName: 'Sanju'
        }}
        onSignOut={handleSignOut}
        onPreviewStudentView={() => {
          setIsAdminPreviewingStudent(true);
          setCurrentView('dashboard');
        }}
        onPreviewDayQuiz={(quizId) => {
          setActiveQuizId(quizId);
          setIsAdminPreviewingStudent(true);
          setCurrentView('quiz');
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // STUDENT LEARNING PORTAL (OR ADMIN PREVIEWING STUDENT VIEW)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF7] text-slate-800">
      
      {/* Admin Preview Mode Floating Bar */}
      {userRole === 'admin' && isAdminPreviewingStudent && (
        <div className="bg-slate-950 text-amber-300 px-4 py-2 text-xs font-bold flex items-center justify-between border-b border-slate-800 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sanju Admin: Previewing Student Interface</span>
          </div>
          <button
            onClick={() => setIsAdminPreviewingStudent(false)}
            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Admin Dashboard</span>
          </button>
        </div>
      )}

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
            userEmail={userEmail}
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
            userEmail={userEmail}
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

      {/* Settings & Account Modal (Shows only Change Name & Log Out for students) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDataChanged={refreshProgress}
        userEmail={userEmail}
        userRole={userRole}
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
