import React, { useState, useEffect, useCallback } from 'react';
import { DAILY_QUIZZES } from './data/quizzes';
import type { 
  QuizAttempt, 
  DailyQuiz, 
  OverallProgress 
} from './types/quiz';
import { 
  getOverallProgress, 
  clearInProgressQuiz,
  getAllAttempts
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

export const App: React.FC = () => {
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

  // Update progress on mount
  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  // Current active quiz object
  const currentQuiz: DailyQuiz = DAILY_QUIZZES.find(q => q.id === activeQuizId) || DAILY_QUIZZES[0];

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
            key={activeQuizId} // re-mount if quiz changes
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
            Cumulative National Parks learning platform. All progress saved locally in browser.
          </div>
        </div>
      </footer>

      {/* Settings & JSON Backup Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDataChanged={refreshProgress}
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
