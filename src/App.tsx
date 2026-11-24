import React, { useState, useEffect, useCallback } from 'react';
import { DAILY_QUIZZES, getQuizForDay } from './data/quizzes';
import { getQuizForTopic, getTopicById, getQuizById } from './data/topics';
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
  getCompletedDayIds,
  getProgressSnapshot,
  mergeProgressSnapshot,
  saveQuizAttempt,
  resetDayProgress,
  resetAllMahiProgress,
  STORAGE_CHANGE_EVENT
} from './utils/storage';
import { isDayUnlocked, hydrateScheduleOverridesCloud } from './utils/schedule';
import { evaluateBadges } from './utils/achievements';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MyQuizzes } from './components/MyQuizzes';
import { MyAttempts } from './components/MyAttempts';
import { MobileBottomNav } from './components/MobileBottomNav';
import { QuizRunner } from './components/QuizRunner';
import { ResultDashboard } from './components/ResultDashboard';
import { AnswerSheet } from './components/AnswerSheet';
import { ProgressHistory } from './components/ProgressHistory';
import { StudyGuide } from './components/StudyGuide';
import { SettingsModal } from './components/SettingsModal';
import { BadgesModal } from './components/BadgesModal';
import { LoginScreen } from './components/LoginScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { Sidebar, type StudentNavView } from './components/Sidebar';
import { StudentNotifications } from './components/StudentNotifications';
import { PersonalLearningDashboard } from './components/student/PersonalLearningDashboard';
import { MistakeNotebook } from './components/student/MistakeNotebook';
import { SmartRevisionCentre } from './components/student/SmartRevisionCentre';
import { MockExamPortal } from './components/student/MockExamPortal';
import { WeakAreaAnalysisView } from './components/student/WeakAreaAnalysisView';
import { StudyPlannerModal } from './components/student/StudyPlannerModal';
import { BookmarksNotesView } from './components/student/BookmarksNotesView';
import { CurrentAffairsCentre } from './components/student/CurrentAffairsCentre';
import { FlashcardsDeck } from './components/student/FlashcardsDeck';
import { StudentSupportModal } from './components/student/StudentSupportModal';
import { getUnreadNotificationCount, resetAllData } from './utils/storage';
import { subscribeToQuizRealtime } from './utils/realtime';
import { supabase, loadCloudProgress, saveCloudProgress, submitStudentQuizAttemptCloud, getUserProfile, getLocalAuthSession, clearLocalAuthSession, MAHI_STUDENT_ID, SANJU_ADMIN_ID } from './utils/supabase';
import { Sparkles, ShieldCheck, ArrowLeft } from 'lucide-react';

export type AppView =
  | 'dashboard'
  | 'my-quizzes'
  | 'my-attempts'
  | 'progress'
  | 'study'
  | 'quiz'
  | 'result'
  | 'review'
  | 'notifications'
  | 'mistake-notebook'
  | 'smart-revision'
  | 'mock-exam'
  | 'weak-areas'
  | 'bookmarks'
  | 'current-affairs'
  | 'flashcards';

export const App: React.FC = () => {
  // Supabase Auth session gate
  const [sessionChecked, setSessionChecked] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [isAdminPreviewingStudent, setIsAdminPreviewingStudent] = useState<boolean>(false);
  const [isStudentSidebarOpen, setIsStudentSidebarOpen] = useState<boolean>(false);

  const [syncStatus, setSyncStatus] = useState<'synced' | 'offline' | 'pending'>(() =>
    typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'synced'
  );

  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [dashboardMode, setDashboardMode] = useState<'learning' | 'daily'>('learning');
  const [isStudyPlannerOpen, setIsStudyPlannerOpen] = useState<boolean>(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);
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

  useEffect(() => {
    // Production clean-start marker: reset to fresh launch state
    // Discard stale offline attempts, reset streak to 0, clear badges and notifications
    if (typeof localStorage !== 'undefined' && localStorage.getItem('mahi_launch_fresh_start_2026') !== 'true') {
      resetAllData();
      localStorage.setItem('mahi_launch_fresh_start_2026', 'true');
    }
  }, []);

  useEffect(() => {
    void hydrateScheduleOverridesCloud().then(refreshProgress);
  }, [refreshProgress]);

  // Cloud Sync Handler (Authoritative Pull from Supabase)
  const performCloudSync = useCallback(async (uid: string) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setSyncStatus('offline');
      return;
    }
    try {
      setSyncStatus('pending');
      const cloudData = await loadCloudProgress(uid);
      if (cloudData) {
        mergeProgressSnapshot(cloudData);
      }
      setSyncStatus('synced');
      refreshProgress();
    } catch (err) {
      console.warn('Cloud sync advisory:', err);
      setSyncStatus(typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'pending');
    }
  }, [refreshProgress]);

  // Auth Gate: Check active session on mount & determine role
  useEffect(() => {
    // 1. Only use the local session when Supabase is unavailable. When cloud
    // auth is configured, trusting this cache would resurrect the old
    // local-only fallback and submit without a JWT, causing RLS 401 errors.
    const localSaved = getLocalAuthSession();
    if (!supabase && localSaved?.email) {
      setUserEmail(localSaved.email);
      setUserRole(localSaved.role);
      setUserProfile({
        id: localSaved.userId || 'local-user',
        email: localSaved.email,
        role: localSaved.role,
        fullName: localSaved.fullName
      });
      const canonicalUserId = localSaved.userId || (localSaved.role === 'admin' ? SANJU_ADMIN_ID : MAHI_STUDENT_ID);
      setUserId(canonicalUserId);
      // This uploads any already-completed local attempts after an app update;
      // the student does not need to repeat the quiz.
      void performCloudSync(canonicalUserId);
    }

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
        } else {
          const resolvedRole = user.email?.toLowerCase().includes('sanju') || user.email?.toLowerCase().includes('sanjay') ? 'admin' : 'student';
          setUserRole(resolvedRole);
          setUserProfile({ id: user.id, email: user.email || '', role: resolvedRole, fullName: resolvedRole === 'admin' ? 'Sanju' : 'Mahi' });
        }
        void performCloudSync(user.id);
      } else {
        // Remove any pre-cloud local session so it cannot mask a missing
        // Supabase session on an existing phone/browser.
        clearLocalAuthSession();
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
      } else if (event === 'SIGNED_OUT') {
        clearLocalAuthSession();
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

  // Supabase Realtime Listener (multi-device & cross-client live updates)
  useEffect(() => {
    const unsubscribe = subscribeToQuizRealtime({
      onQuizSubmitted: () => {
        refreshProgress();
        if (userId) {
          void performCloudSync(userId);
        }
      },
      onScheduleUpdated: () => {
        refreshProgress();
      },
      onProgressReset: (payload) => {
        console.log('Realtime progress_reset event received in Client UI:', payload);
        if (payload?.quizId) {
          resetDayProgress(payload.quizId);
        } else {
          resetAllMahiProgress();
        }
        setActiveAttempt(null);
        setCurrentView('dashboard');
        if (userId) {
          void performCloudSync(userId);
        }
        refreshProgress();
      },
    });

    return () => {
      unsubscribe();
    };
  }, [refreshProgress, userId, performCloudSync]);

  // Current active quiz object (supports Multi-Quizzes, Topics and Championship Tests)
  const currentQuiz: DailyQuiz = (() => {
    const topicQuiz = getQuizById(activeQuizId);
    if (topicQuiz) {
      return topicQuiz;
    }
    const topic = getTopicById(activeQuizId);
    if (topic) {
      return getQuizForTopic(activeQuizId);
    }
    const found = getQuizForDay(activeQuizId);
    const completedDayIds = getCompletedDayIds();
    if (!isDayUnlocked(activeQuizId, completedDayIds) && userRole !== 'admin') {
      return DAILY_QUIZZES[0];
    }
    return found;
  })();

  // Handler: Start or resume a quiz (Strict locking guard)
  const handleStartQuiz = (quizId: string) => {
    const topicQuiz = getQuizById(quizId);
    const topic = getTopicById(quizId);
    if (!topicQuiz && !topic) {
      const completedDayIds = getCompletedDayIds();
      const isUnlocked = isDayUnlocked(quizId, completedDayIds);
      if (!isUnlocked && userRole !== 'admin') {
        alert("This championship assessment is scheduled and locked.");
        return;
      }
    }
    setActiveQuizId(quizId);
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Quiz submitted & finished
  const handleFinishQuiz = async (attempt: QuizAttempt) => {
    const currentUid = userId || MAHI_STUDENT_ID;
    const resolvedStudentName = userProfile?.fullName || (userEmail?.toLowerCase().includes('shailu') ? 'Shailu' : 'Mahi');
    const enrichedAttempt: QuizAttempt = {
      ...attempt,
      studentId: currentUid,
      studentName: resolvedStudentName,
      studentEmail: userEmail || undefined
    };

    try {
      // Supabase is the single source of truth.
      if (!supabase || !userId) {
        throw new Error('Cloud session is not active. Please sign in again before submitting.');
      }
      setSyncStatus('pending');
      // 1. Authoritatively save attempt to Supabase
      await submitStudentQuizAttemptCloud(currentUid, enrichedAttempt, resolvedStudentName);
      // 2. Save locally for instant offline UI responsiveness
      saveQuizAttempt(enrichedAttempt);
      setActiveAttempt(enrichedAttempt);
      refreshProgress();
      setSyncStatus('synced');
      setCurrentView('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSyncStatus('pending');
      const detail = err instanceof Error
        ? err.message
        : err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message || JSON.stringify(err))
          : String(err || 'Unknown Supabase error');
      alert(`Result submission failed in Supabase: ${detail}. Please check your connection and retry.`);
    }
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

  // Handler: Student Navigation from Sidebar or Bottom Nav
  const handleStudentNav = (view: StudentNavView) => {
    setIsStudentSidebarOpen(false);
    refreshProgress();
    switch (view) {
      case 'dashboard':
        setCurrentView('dashboard');
        break;
      case 'my-quizzes':
      case 'today-quiz':
        setCurrentView('my-quizzes');
        break;
      case 'my-attempts':
      case 'my-results':
        setCurrentView('my-attempts');
        break;
      case 'progress':
        setCurrentView('progress');
        break;
      case 'study-guide':
      case 'help':
        setCurrentView('study');
        break;
      case 'mistake-notebook':
        setCurrentView('mistake-notebook');
        break;
      case 'smart-revision':
        setCurrentView('smart-revision');
        break;
      case 'mock-exam':
        setCurrentView('mock-exam');
        break;
      case 'weak-areas':
        setCurrentView('weak-areas');
        break;
      case 'bookmarks':
        setCurrentView('bookmarks');
        break;
      case 'current-affairs':
        setCurrentView('current-affairs');
        break;
      case 'flashcards':
        setCurrentView('flashcards');
        break;
      case 'study-planner':
        setIsStudyPlannerOpen(true);
        break;
      case 'support':
        setIsSupportModalOpen(true);
        break;
      case 'review-mistakes': {
        const attempts = getAllAttempts();
        if (attempts.length > 0) {
          handleReviewAnswers(attempts[0]);
        } else {
          setCurrentView('my-attempts');
        }
        break;
      }
      case 'achievements':
      case 'streak':
        setIsBadgesModalOpen(true);
        break;
      case 'notifications':
        setCurrentView('notifications');
        break;
      case 'settings':
        setIsSettingsOpen(true);
        break;
      case 'logout':
        void handleSignOut();
        break;
      default:
        setCurrentView('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Sign out
  const handleSignOut = async () => {
    clearLocalAuthSession();
    if (supabase) {
      await supabase.auth.signOut().catch(() => { });
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

  // 1. Loading splash while verifying persistent Supabase session
  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070508] text-white">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-[#9e1030] to-[#5a0618] border border-[#ff3366]/30 shadow-ruby animate-pulse">
            <Sparkles className="w-8 h-8 text-rose-200" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            <span>Spideyy</span> <span className="text-[#ff3366]">Quiz</span>
          </h2>
          <p className="text-xs text-rose-300/80">Connecting to learning portal…</p>
        </div>
      </div>
    );
  }

  // 2. Authentication Gate: If not logged in, render mobile-first LoginScreen
  if (!userEmail) {
    return (
      <LoginScreen
        onLoginSuccess={async (email, role, authenticatedUserId) => {
          setUserEmail(email);
          if (authenticatedUserId) {
            setUserId(authenticatedUserId);
            void performCloudSync(authenticatedUserId);
          }
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
    <div className="portal-classic min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans selection:bg-[#1e3a5f] selection:text-white">

      {/* Responsive Sidebar for Student */}
      <Sidebar
        role="student"
        isOpen={isStudentSidebarOpen}
        onClose={() => setIsStudentSidebarOpen(false)}
        currentStudentView={currentView}
        onStudentNavigate={handleStudentNav}
        unreadNotifsCount={getUnreadNotificationCount('student')}
        userName={userProfile?.displayName || userProfile?.fullName || 'Mahi'}
        userEmail={userEmail}
        onSignOut={handleSignOut}
        onOpenSettings={() => {
          setIsStudentSidebarOpen(false);
          setIsSettingsOpen(true);
        }}
      />

      {/* Main Content Area (With left margin on desktop to accommodate persistent sidebar) */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">

        {/* Admin Preview Mode Floating Bar */}
        {userRole === 'admin' && isAdminPreviewingStudent && (
          <div className="bg-slate-900 text-slate-100 px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-b border-slate-800 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Sanju Admin: Previewing Student Interface</span>
            </div>
            <button
              onClick={() => setIsAdminPreviewingStudent(false)}
              className="px-3 py-1 rounded-lg bg-[#800020] hover:bg-[#5c0017] text-white text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
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
          onToggleSidebar={() => setIsStudentSidebarOpen(prev => !prev)}
          unreadNotifsCount={getUnreadNotificationCount('student')}
          onOpenNotifications={() => {
            refreshProgress();
            setCurrentView('notifications');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          streakDays={overallProgress.currentStreak}
          unlockedBadgesCount={overallProgress.unlockedBadgesCount}
          completedQuizzesCount={overallProgress.totalCompletedDays}
          totalQuizzesCount={DAILY_QUIZZES.length}
          syncStatus={syncStatus}
          userEmail={userEmail}
          userName={userProfile?.displayName || userProfile?.fullName || 'Mahi'}
          onSignOut={handleSignOut}
        />

        {/* Main Body Content View */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

          {/* VIEW 1: DASHBOARD (Dual Mode: Learning Analytics / Daily Quizzes) */}
          {currentView === 'dashboard' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="inline-flex p-1 rounded-2xl bg-stone-100 border border-stone-200">
                  <button
                    onClick={() => setDashboardMode('learning')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition min-h-[40px] ${
                      dashboardMode === 'learning'
                        ? 'bg-[#800020] text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    📊 Learning Dashboard
                  </button>
                  <button
                    onClick={() => setDashboardMode('daily')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition min-h-[40px] ${
                      dashboardMode === 'daily'
                        ? 'bg-[#800020] text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    📅 Daily Quizzes & Badges
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsStudyPlannerOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#ebd4d9] text-xs font-bold text-[#800020] hover:bg-rose-50 transition min-h-[40px]"
                  >
                    Study Planner
                  </button>
                  <button
                    onClick={() => setIsSupportModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#ebd4d9] text-xs font-bold text-[#800020] hover:bg-rose-50 transition min-h-[40px]"
                  >
                    Support & Guidance
                  </button>
                </div>
              </div>

              {dashboardMode === 'learning' ? (
                <PersonalLearningDashboard
                  studentId={userId || 'mahi_student'}
                  studentName={userProfile?.displayName || userProfile?.fullName || 'Mahi'}
                  onNavigate={(v) => handleStudentNav(v as StudentNavView)}
                  onStartQuiz={handleStartQuiz}
                />
              ) : (
                <Dashboard
                  quizzes={DAILY_QUIZZES}
                  overallProgress={overallProgress}
                  onStartQuiz={handleStartQuiz}
                  onViewResult={handleViewResult}
                  onInspectAnswers={handleReviewAnswers}
                  onOpenStudyGuide={handleOpenStudyGuide}
                  onNavigateToQuizzes={() => {
                    setCurrentView('my-quizzes');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onNavigateToAttempts={() => {
                    setCurrentView('my-attempts');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onNavigateToProgress={() => {
                    setCurrentView('progress');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenBadges={() => setIsBadgesModalOpen(true)}
                  userEmail={userEmail}
                  userName={userProfile?.displayName || userProfile?.fullName || 'Mahi'}
                />
              )}
            </div>
          )}

          {/* VIEW: MISTAKE NOTEBOOK */}
          {currentView === 'mistake-notebook' && (
            <MistakeNotebook
              studentId={userId || 'mahi_student'}
              studentName={userProfile?.displayName || userProfile?.fullName || 'Mahi'}
              onGoBack={() => setCurrentView('dashboard')}
              onStartQuiz={handleStartQuiz}
            />
          )}

          {/* VIEW: SMART REVISION */}
          {currentView === 'smart-revision' && (
            <SmartRevisionCentre
              studentId={userId || 'mahi_student'}
              studentName={userProfile?.displayName || userProfile?.fullName || 'Mahi'}
              onGoBack={() => setCurrentView('dashboard')}
              onStartQuiz={handleStartQuiz}
            />
          )}

          {/* VIEW: MOCK EXAM MODE */}
          {currentView === 'mock-exam' && (
            <MockExamPortal
              studentId={userId || 'mahi_student'}
              studentName={userProfile?.displayName || userProfile?.fullName || 'Mahi'}
              onExitExam={() => setCurrentView('dashboard')}
            />
          )}

          {/* VIEW: WEAK AREA ANALYSIS */}
          {currentView === 'weak-areas' && (
            <WeakAreaAnalysisView
              studentId={userId || 'mahi_student'}
              studentName={userProfile?.displayName || userProfile?.fullName || 'Mahi'}
              onGoBack={() => setCurrentView('dashboard')}
              onStartQuiz={handleStartQuiz}
              onOpenRevision={() => setCurrentView('smart-revision')}
            />
          )}

          {/* VIEW: BOOKMARKS & NOTES */}
          {currentView === 'bookmarks' && (
            <BookmarksNotesView
              studentId={userId || 'mahi_student'}
              studentName={userProfile?.displayName || userProfile?.fullName || 'Mahi'}
              onGoBack={() => setCurrentView('dashboard')}
            />
          )}

          {/* VIEW: CURRENT AFFAIRS CENTRE */}
          {currentView === 'current-affairs' && (
            <CurrentAffairsCentre
              onGoBack={() => setCurrentView('dashboard')}
              onStartQuiz={handleStartQuiz}
            />
          )}

          {/* VIEW: RAPID FLASHCARDS */}
          {currentView === 'flashcards' && (
            <FlashcardsDeck
              studentId={userId || 'mahi_student'}
              studentName={userProfile?.displayName || userProfile?.fullName || 'Mahi'}
              onGoBack={() => setCurrentView('dashboard')}
              onOpenRevision={() => setCurrentView('smart-revision')}
            />
          )}

          {/* VIEW 2: MY QUIZZES (Dedicated Chronological Quiz Hub) */}
          {currentView === 'my-quizzes' && (
            <MyQuizzes
              quizzes={DAILY_QUIZZES}
              overallProgress={overallProgress}
              onStartQuiz={handleStartQuiz}
              onViewResult={handleViewResult}
              onOpenStudyGuide={handleOpenStudyGuide}
              onNavigateToAttempts={() => {
                setCurrentView('my-attempts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              userEmail={userEmail}
            />
          )}

          {/* VIEW 3: MY ATTEMPTS (Dedicated Attempt Records by Day) */}
          {currentView === 'my-attempts' && (
            <MyAttempts
              onViewResult={handleViewResult}
              onInspectAnswers={handleReviewAnswers}
              onNavigateToQuizzes={() => {
                setCurrentView('my-quizzes');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* VIEW 4: QUIZ RUNNER */}
          {currentView === 'quiz' && (
            <QuizRunner
              key={activeQuizId}
              quiz={currentQuiz}
              onFinishQuiz={handleFinishQuiz}
              onExit={handleGoHome}
            />
          )}

          {/* VIEW 5: RESULT DASHBOARD */}
          {currentView === 'result' && activeAttempt && (
            <ResultDashboard
              attempt={activeAttempt}
              quiz={getQuizForDay(activeAttempt.quizId)}
              onReviewAnswers={() => handleReviewAnswers()}
              onReattempt={handleReattempt}
              onGoHome={handleGoHome}
              userEmail={userEmail}
            />
          )}

          {/* VIEW 6: ANSWER SHEET & EXPLANATIONS */}
          {currentView === 'review' && activeAttempt && (
            <AnswerSheet
              attempt={activeAttempt}
              quiz={getQuizForDay(activeAttempt.quizId)}
              onBackToResult={() => setCurrentView('result')}
              onReattempt={handleReattempt}
              onGoHome={handleGoHome}
            />
          )}

          {/* VIEW 7: PROGRESS & ROADMAP */}
          {currentView === 'progress' && (
            <ProgressHistory
              quizzes={DAILY_QUIZZES}
              overallProgress={overallProgress}
              onSelectAttempt={handleReviewAnswers}
              onStartQuiz={handleStartQuiz}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onGoHome={handleGoHome}
              onNavigateToAttempts={() => {
                setCurrentView('my-attempts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* VIEW 8: NATIONAL PARKS STUDY GUIDE */}
          {currentView === 'study' && (
            <StudyGuide
              quizzes={DAILY_QUIZZES}
              initialState={studyGuideInitialState}
              onStartQuiz={handleStartQuiz}
              onGoHome={handleGoHome}
            />
          )}

          {/* VIEW 9: STUDENT NOTIFICATIONS */}
          {currentView === 'notifications' && (
            <StudentNotifications
              onGoHome={handleGoHome}
              onStartQuiz={handleStartQuiz}
              onViewResult={(quizId, attemptId) => {
                const attempts = getAllAttempts();
                const found = attemptId ? attempts.find(a => a.id === attemptId) : attempts.find(a => a.quizId === quizId);
                if (found) {
                  handleViewResult(found);
                } else {
                  handleStartQuiz(quizId);
                }
              }}
            />
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-[#ebd4d9] bg-white py-6 text-center text-xs text-[#76515b]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-bold text-[#2b0c15]">
              <span className="text-[#800020]">🎓 Boddukuri's Quiz</span>
              <span className="text-[#800020] font-black">#Mahi</span>
              <span>• Learn. Revise. Remember. Achieve.</span>
            </div>
            <div className="text-[#76515b]">
              Cumulative National Parks learning platform (09 Nov – 15 Nov 2026).
            </div>
          </div>
        </footer>

      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={handleStudentNav}
        onOpenDrawer={() => setIsStudentSidebarOpen(true)}
        unreadNotifsCount={getUnreadNotificationCount('student')}
      />

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
      />

      {/* Badges & Achievements Modal */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        badges={evaluateBadges(getAllAttempts(), overallProgress.currentStreak)}
      />

      {/* Study Planner Modal */}
      <StudyPlannerModal
        isOpen={isStudyPlannerOpen}
        onClose={() => setIsStudyPlannerOpen(false)}
        studentId={userId || 'mahi_student'}
        studentName={userProfile?.displayName || userProfile?.fullName || 'Mahi'}
      />

      {/* Student Support & Guidelines Modal */}
      <StudentSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        studentId={userId || 'mahi_student'}
        studentName={userProfile?.displayName || userProfile?.fullName || 'Mahi'}
      />

    </div>
  );
};

export default App;
