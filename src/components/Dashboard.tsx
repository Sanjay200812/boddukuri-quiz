import React, { useState, useEffect } from 'react';
import {
  Play,
  CheckCircle2,
  Clock,
  Award,
  Flame,
  TrendingUp,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Lock,
  Hourglass,
  GraduationCap,
  FileText
} from 'lucide-react';
import type { DailyQuiz, OverallProgress, QuizAttempt } from '../types/quiz';
import {
  getQuizStatus,
  getAllAttempts,
  getCompletedDayIds,
  getInProgressQuiz,
  clearInProgressQuiz
} from '../utils/storage';
import { DAILY_SCHEDULE, isDayUnlocked, getDayCountdown, getRecommendedTargetDay } from '../utils/schedule';
import { getQuizForDay } from '../data/quizzes';

interface DashboardProps {
  quizzes: DailyQuiz[];
  overallProgress: OverallProgress;
  onStartQuiz: (quizId: string) => void;
  onViewResult: (attempt: QuizAttempt) => void;
  onInspectAnswers?: (attempt: QuizAttempt) => void;
  onOpenStudyGuide: (stateName?: string) => void;
  onNavigateToQuizzes: () => void;
  onNavigateToAttempts: () => void;
  onNavigateToProgress: () => void;
  onOpenBadges?: () => void;
  userEmail?: string | null;
  userName?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  quizzes: _quizzes,
  overallProgress,
  onStartQuiz,
  onViewResult,
  onInspectAnswers,
  onOpenStudyGuide,
  onNavigateToQuizzes,
  onNavigateToAttempts,
  onNavigateToProgress,
  userName = 'Mahi',
}) => {
  const [, setTick] = useState<number>(Date.now());

  // Live 1-second ticker for unlock countdowns
  useEffect(() => {
    const timer = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const allAttempts = getAllAttempts();
  const completedDayIds = getCompletedDayIds();

  // Determine current recommended target day
  const recommendedDayNumber = getRecommendedTargetDay(completedDayIds);
  const targetQuiz = getQuizForDay(recommendedDayNumber);
  const isTargetUnlocked = isDayUnlocked(recommendedDayNumber, completedDayIds);
  const targetCountdown = getDayCountdown(recommendedDayNumber, completedDayIds);
  const targetStatus = isTargetUnlocked ? getQuizStatus(targetQuiz.id) : 'pending';

  // Rule: Clean up stale in-progress sessions for locked or completed days
  useEffect(() => {
    DAILY_SCHEDULE.forEach((item) => {
      const dayQuiz = getQuizForDay(item.dayNumber);
      const isUnlocked = isDayUnlocked(item.dayNumber, completedDayIds);
      const isCompleted = completedDayIds.includes(dayQuiz.id);
      if ((!isUnlocked || isCompleted) && getInProgressQuiz(dayQuiz.id)) {
        clearInProgressQuiz(dayQuiz.id);
      }
    });
  }, [completedDayIds]);

  // Rule: The "Available Quizzes" section should display ONLY quizzes that have NOT yet been completed.
  const availableUncompletedQuizzes = DAILY_SCHEDULE.filter(day => {
    const dayQuiz = getQuizForDay(day.dayNumber);
    const isCompleted = completedDayIds.includes(dayQuiz.id);
    return !isCompleted;
  });

  // Recent attempts (up to 4 newest)
  const recentAttempts = allAttempts.slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 animate-fadeIn text-[#e8d5db]">
      {/* Hero Welcome Banner (Luxury Obsidian & Ruby Design matching Image 2 mockup) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c0610] via-[#14050d] to-[#0c0207] text-white p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.7)] border border-[#3d0e20]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#ff3366]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-20 w-64 h-64 rounded-full bg-[#9e1030]/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2b0c18] border border-[#4a1226] text-[#ff8099] text-xs font-semibold backdrop-blur-sm">
              <GraduationCap className="w-4 h-4 text-[#ff3366]" />
              <span>Boddukuri's Quiz Portal • #Mahi</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Welcome back, <span className="text-[#ff8099]">{userName}</span> 👋
            </h1>

            <p className="text-sm sm:text-base text-[#cbb5bc] leading-relaxed font-medium">
              Practice quizzes, test your knowledge, and track your progress across India's National Parks.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onNavigateToQuizzes}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b31238] via-[#9e1030] to-[#750720] hover:from-[#c91842] hover:to-[#8a0e28] active:scale-95 text-white text-xs sm:text-sm font-bold transition-all shadow-ruby flex items-center gap-2 border border-[#ff3366]/30"
              >
                <span>Explore Quizzes</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onNavigateToProgress}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 active:scale-95 text-xs sm:text-sm font-bold transition-all flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>View Progress</span>
              </button>
            </div>
          </div>

          {/* 3D Graduation Cap / Book Graphic Element */}
          <div className="hidden md:flex flex-col items-center justify-center p-6 rounded-3xl bg-[#16060e]/80 border border-[#3b0e1e] backdrop-blur-md shadow-inner text-center shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#3a0815] to-[#700820] border border-[#ff3366]/30 flex items-center justify-center shadow-lg mb-3">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <div className="text-sm font-black text-white">Daily Learning Goal</div>
            <div className="text-xs text-[#ff8099] mt-0.5">109 National Parks</div>
          </div>
        </div>
      </section>

      {/* 4 Summary Metric Cards (Exact layout from Image 2) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Quizzes Attempted */}
        <div className="rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] p-4 sm:p-5 shadow-lg backdrop-blur-md transition-all hover:border-[#471225]">
          <div className="flex items-center justify-between text-[#a68690] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Quizzes Attempted</span>
            <div className="w-8 h-8 rounded-xl bg-[#220713] text-[#ff3366] border border-[#470f25] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {allAttempts.length}
          </div>
          <p className="text-[11px] text-[#a68690] mt-1">Total submissions recorded</p>
        </div>

        {/* Card 2: Quizzes Completed */}
        <div className="rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] p-4 sm:p-5 shadow-lg backdrop-blur-md transition-all hover:border-[#471225]">
          <div className="flex items-center justify-between text-[#a68690] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Quizzes Completed</span>
            <div className="w-8 h-8 rounded-xl bg-[#220713] text-[#ff3366] border border-[#470f25] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {completedDayIds.length} <span className="text-sm font-semibold text-[#a68690]">/ {DAILY_SCHEDULE.length}</span>
          </div>
          <p className="text-[11px] text-[#a68690] mt-1">{Math.round((completedDayIds.length / DAILY_SCHEDULE.length) * 100)}% of syllabus</p>
        </div>

        {/* Card 3: Average Score */}
        <div className="rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] p-4 sm:p-5 shadow-lg backdrop-blur-md transition-all hover:border-[#471225]">
          <div className="flex items-center justify-between text-[#a68690] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Score</span>
            <div className="w-8 h-8 rounded-xl bg-[#220713] text-[#ff3366] border border-[#470f25] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#ff8099]">
            {overallProgress.overallAccuracy}%
          </div>
          <p className="text-[11px] text-[#a68690] mt-1">Accuracy across attempts</p>
        </div>

        {/* Card 4: Day Streak */}
        <div className="rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] p-4 sm:p-5 shadow-lg backdrop-blur-md transition-all hover:border-[#471225]">
          <div className="flex items-center justify-between text-[#a68690] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Day Streak</span>
            <div className="w-8 h-8 rounded-xl bg-[#220713] text-[#ff3366] border border-[#470f25] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#ff8099]">
            {overallProgress.currentStreak} <span className="text-sm font-semibold text-[#a68690]">{overallProgress.currentStreak === 1 ? 'Day' : 'Days'}</span>
          </div>
          <p className="text-[11px] text-[#a68690] mt-1">Daily learning habit</p>
        </div>
      </section>

      {/* Next Target / Spotlight Card */}
      {targetQuiz && !completedDayIds.includes(targetQuiz.id) && (
        <section className="rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] p-5 sm:p-6 shadow-lg backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-sm shrink-0 ${
              isTargetUnlocked ? 'bg-gradient-to-tr from-[#9e1030] to-[#e6194b]' : 'bg-[#260c18] text-[#a68690]'
            }`}>
              {targetQuiz.dayNumber < 10 ? `0${targetQuiz.dayNumber}` : targetQuiz.dayNumber}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ff3366]">
                  {isTargetUnlocked ? "Next Available Quiz" : "Upcoming Scheduled Day"}
                </span>
                <span className="text-xs text-[#a68690]">• {targetQuiz.displayDate}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {targetQuiz.title}: {targetQuiz.statesCovered.length} States ({targetQuiz.totalQuestions} Questions)
              </h3>
              <p className="text-xs text-[#a68690]">
                {targetQuiz.statesCovered.slice(0, 4).join(', ')}{targetQuiz.statesCovered.length > 4 ? '...' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {isTargetUnlocked ? (
              <button
                onClick={() => onStartQuiz(targetQuiz.id)}
                className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b31238] via-[#9e1030] to-[#750720] hover:from-[#c91842] hover:to-[#8a0e28] text-white text-xs sm:text-sm font-bold transition-all shadow-ruby active:scale-95 flex items-center justify-center gap-2 border border-[#ff3366]/30"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{targetStatus === 'in-progress' ? 'Resume Quiz' : 'Start Quiz'}</span>
              </button>
            ) : (
              <div className="w-full md:w-auto text-xs font-bold text-[#ff8099] bg-[#220713] border border-[#470f25] px-4 py-2 rounded-xl flex items-center justify-center gap-2">
                <Hourglass className="w-3.5 h-3.5 text-[#ff3366] animate-pulse" />
                <span>Unlocks at 8:29 PM IST ({targetCountdown.formattedCountdown})</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Available Quizzes (Uncompleted Quizzes Only) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#ff3366]" />
              <span>Available Quizzes</span>
            </h2>
            <p className="text-xs text-[#a68690]">
              Quizzes ready to attempt. Completed quizzes are moved to My Attempts.
            </p>
          </div>

          <button
            onClick={onNavigateToQuizzes}
            className="text-xs font-bold text-[#ff3366] hover:text-[#ff8099] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {availableUncompletedQuizzes.length === 0 ? (
          <div className="rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] p-8 text-center space-y-2 shadow-lg backdrop-blur-md">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">All Quizzes Completed!</h3>
            <p className="text-xs text-[#a68690]">
              You have completed every available quiz. Review your submitted answer sheets in My Attempts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableUncompletedQuizzes.slice(0, 3).map((scheduleItem) => {
              const dayQuiz = getQuizForDay(scheduleItem.dayNumber);
              const isUnlocked = isDayUnlocked(scheduleItem.dayNumber, completedDayIds);
              const status = getQuizStatus(dayQuiz.id);
              const isInProgress = isUnlocked && status === 'in-progress';
              const countdown = getDayCountdown(scheduleItem.dayNumber, completedDayIds);

              return (
                <div
                  key={scheduleItem.quizId}
                  className="rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] hover:border-[#471225] p-5 shadow-lg backdrop-blur-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-gradient-to-r from-[#9e1030] to-[#750720] text-white">
                        {scheduleItem.isSpecialTest ? scheduleItem.title : `Day 0${scheduleItem.dayNumber}`}
                      </span>
                      {isUnlocked ? (
                        <span className="text-[10px] font-bold text-[#ff8099] bg-[#2b0c18] px-2 py-0.5 rounded-full border border-[#4a1226]">
                          Available
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#a68690] bg-[#18070f] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#2b0c18]">
                          <Lock className="w-2.5 h-2.5" /> 8:29 PM
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white line-clamp-1">
                      {scheduleItem.title}
                    </h3>
                    <p className="text-xs text-[#a68690] line-clamp-1">
                      {scheduleItem.states.length} States: {scheduleItem.states.slice(0, 3).join(', ')}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#a68690] pt-1 border-t border-[#260c18]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#ff3366]" />
                        <span>15 mins</span>
                      </span>
                      <span className="font-semibold">{scheduleItem.totalQuestions} Questions</span>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <button
                      onClick={() => onStartQuiz(dayQuiz.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#b31238] via-[#9e1030] to-[#750720] hover:from-[#c91842] hover:to-[#8a0e28] text-white text-xs font-bold transition-all shadow-ruby active:scale-95 flex items-center justify-center gap-1.5 border border-[#ff3366]/30"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{isInProgress ? 'Resume Quiz →' : 'Start Quiz →'}</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl bg-[#18070f] text-[#7a5b67] text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5 border border-[#2b0c18]"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlocks {countdown.formattedCountdown}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent Activity / Attempts (Matching Image 2 bottom section) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#ff3366]" />
              <span>Recent Activity</span>
            </h2>
            <p className="text-xs text-[#a68690]">
              Your latest quiz completions, scores, and performance records.
            </p>
          </div>

          {recentAttempts.length > 0 && (
            <button
              onClick={onNavigateToAttempts}
              className="text-xs font-bold text-[#ff3366] hover:text-[#ff8099] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {recentAttempts.length === 0 ? (
          <div className="rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] p-8 text-center space-y-2 shadow-lg backdrop-blur-md">
            <FileText className="w-8 h-8 text-[#7a5b67] mx-auto" />
            <h3 className="text-sm font-bold text-white">No Recent Attempts</h3>
            <p className="text-xs text-[#a68690]">
              When you submit a quiz, your results and answer sheets will appear here.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] divide-y divide-[#260c18] shadow-lg backdrop-blur-md overflow-hidden">
            {recentAttempts.map((att) => {
              const quiz = getQuizForDay(att.quizId);
              return (
                <div
                  key={att.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[#1a0712] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#220713] text-[#ff3366] border border-[#470f25] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">
                        Attempted "{quiz.title}"
                      </div>
                      <div className="text-[11px] text-[#a68690]">
                        {att.formattedDate || new Date(att.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {Math.floor(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-xs font-black text-[#ff8099]">
                        Score: {att.marksObtained}/{att.maxMarks} ({att.percentage}%)
                      </div>
                      <div className="text-[10px] text-emerald-400 font-semibold">
                        {att.performanceMessage || 'Completed'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onViewResult(att)}
                        className="px-3 py-1.5 rounded-lg bg-[#220713] hover:bg-[#300a1b] border border-[#470f25] text-[#ff8099] text-xs font-bold transition-all"
                      >
                        Result
                      </button>

                      {onInspectAnswers && (
                        <button
                          onClick={() => onInspectAnswers(att)}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#9e1030] to-[#750720] text-white text-xs font-bold transition-all shadow-ruby"
                        >
                          Answers
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Study Guide Banner */}
      <section className="rounded-2xl bg-gradient-to-r from-[#1c0610] via-[#14050d] to-[#1c0610] border border-[#3d0e20] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#220713] border border-[#470f25] text-[#ff3366] flex items-center justify-center shrink-0 shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              National Parks Reference & Study Guide
            </h3>
            <p className="text-xs text-[#a68690]">
              Read state-wise national park notes, wildlife facts, and historical information before starting tests.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenStudyGuide()}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#c91842] hover:to-[#8a0e28] text-white text-xs font-bold transition-all shadow-ruby flex items-center gap-1.5 shrink-0 border border-[#ff3366]/30"
        >
          <span>Open Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>
    </div>
  );
};
