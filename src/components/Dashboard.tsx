import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Award,
  Flame,
  TrendingUp,
  FileCheck,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Calendar,
  Lock,
  Zap,
  Download,
  Hourglass
} from 'lucide-react';
import type { DailyQuiz, OverallProgress, QuizAttempt, RetakeRequest } from '../types/quiz';
import {
  getQuizStatus,
  getBestAttempt,
  getLatestAttempt,
  getAllAttempts,
  getCompletedDayIds,
  getRetakeStatusForQuiz,
  saveRetakeRequest,
  consumeApprovedRetake,
  getInProgressQuiz,
  clearInProgressQuiz
} from '../utils/storage';
import { evaluateBadges } from '../utils/achievements';
import { StreakTracker } from './StreakTracker';
import { DAILY_SCHEDULE, isDayUnlocked, getDayCountdown, getRecommendedTargetDay, type DaySchedule } from '../utils/schedule';
import { getQuizForDay } from '../data/quizzes';
import { generateDayNotesPDF } from '../utils/pdfGenerator';
import { submitRetakeRequestCloud } from '../utils/supabase';

interface DashboardProps {
  quizzes: DailyQuiz[];
  overallProgress: OverallProgress;
  onStartQuiz: (quizId: string) => void;
  onViewResult: (attempt: QuizAttempt) => void;
  onOpenStudyGuide: (stateName?: string) => void;
  onOpenBadges?: () => void;
  userEmail?: string | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  quizzes: _quizzes,
  overallProgress,
  onStartQuiz,
  onViewResult,
  onOpenStudyGuide,
  onOpenBadges,
  userEmail,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [, setTick] = useState<number>(Date.now());
  const [requestSentQuizId, setRequestSentQuizId] = useState<string | null>(null);

  // 1-second live ticker to keep countdowns accurate and live
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const allAttempts = getAllAttempts();
  const completedDayIds = getCompletedDayIds();
  const allBadges = evaluateBadges(allAttempts, overallProgress.currentStreak);
  const unlockedCount = allBadges.filter(b => b.unlocked).length;

  // Determine current target day
  const recommendedDayNumber = getRecommendedTargetDay(completedDayIds);
  const targetQuiz = getQuizForDay(recommendedDayNumber);
  const isTargetUnlocked = isDayUnlocked(recommendedDayNumber, completedDayIds);
  const targetCountdown = getDayCountdown(recommendedDayNumber, completedDayIds);
  const targetStatus = isTargetUnlocked ? getQuizStatus(targetQuiz.id) : 'pending';

  // Automatically clean up any stale in-progress sessions for locked days or completed days
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

  // Filter scheduled days
  const filteredSchedule = DAILY_SCHEDULE.filter(day => {
    const dayQuiz = getQuizForDay(day.dayNumber);
    const status = getQuizStatus(dayQuiz.id);
    if (filter === 'completed') return status === 'completed';
    if (filter === 'pending') return status !== 'completed';
    return true;
  });

  // Handle student request for retake
  const handleRequestRetake = async (scheduleItem: DaySchedule, quizId: string) => {
    const req: RetakeRequest = {
      id: 'retake-' + Date.now(),
      userId: 'mahi-user',
      userEmail: userEmail || 'mahi@boddukuri.quiz',
      dayNumber: scheduleItem.dayNumber,
      quizId,
      dayTitle: scheduleItem.title,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };
    saveRetakeRequest(req);
    setRequestSentQuizId(quizId);
    setTimeout(() => setRequestSentQuizId(null), 3000);

    try {
      await submitRetakeRequestCloud(req);
    } catch (err) {
      console.warn('Retake request cloud submit:', err);
    }
    setTick(Date.now());
  };

  // Handle starting approved retake
  const handleStartApprovedRetake = (quizId: string) => {
    consumeApprovedRetake(quizId);
    onStartQuiz(quizId);
  };

  return (
    <div className="portal-light relative space-y-8 pb-16 animate-fadeIn">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050506]">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-red-950/30 blur-3xl animate-pulse" />
        <div className="absolute right-0 top-1/3 h-[32rem] w-[32rem] rounded-full bg-[#3a1822]/20 blur-3xl" />
      </div>

      {/* Hero Welcome Banner */}
      <section className="portal-hero relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-950 via-red-900 to-forest-950 text-white p-6 sm:p-10 shadow-elevated">
        {/* Decorative background botanicals / shapes */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-red-900/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-red-600/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/60 border border-red-700/30 text-red-300 text-xs sm:text-sm font-semibold mb-4 backdrop-blur-sm">
            <span>🌿</span>
            <span>Welcome back, Mahi!</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
            Boddukuri's Quiz <span className="text-red-400 font-black">#Mahi</span>
          </h1>

          <p className="text-base sm:text-xl text-red-100 font-bold tracking-wide mb-4">
            Learn. Revise. Remember. Achieve.
          </p>

          <p className="text-sm sm:text-base text-red-300/90 mb-8 max-w-2xl leading-relaxed">
            Your daily cumulative learning platform for India's National Parks (09 Nov – 15 Nov 2026). Every daily quiz retains all previously learned states while introducing newly studied states to build permanent recall!
          </p>

          {/* Call to action: Recommended Today's Target */}
          {targetQuiz && (
            <div className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-[#0f0f12]/10 backdrop-blur-md border border-white/20 shadow-inner w-full max-w-2xl">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-md ${
                  isTargetUnlocked ? 'bg-red-700 text-white' : 'bg-amber-500/90 text-white'
                }`}>
                  {targetQuiz.dayNumber < 10 ? `0${targetQuiz.dayNumber}` : targetQuiz.dayNumber}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider font-extrabold flex items-center gap-2">
                    {isTargetUnlocked ? (
                      <span className="text-red-400">
                        {targetStatus === 'in-progress' ? 'Resume Current Session' : targetStatus === 'completed' ? "Day Completed" : "Today's Target — Available Now"}
                      </span>
                    ) : (
                      <span className="text-amber-300 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Unlocks at 8:30 PM IST ({targetCountdown.formattedCountdown})
                      </span>
                    )}
                    <span className="text-red-300/80 font-medium">• {targetQuiz.displayDate}</span>
                  </div>
                  <div className="text-base font-bold text-white">
                    {targetQuiz.title}: {targetQuiz.statesCovered.length} States Pool ({targetQuiz.totalQuestions} Questions)
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:ml-auto w-full sm:w-auto">
                {isTargetUnlocked ? (
                  <button
                    onClick={() => onStartQuiz(targetQuiz.id)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0f0f12] text-red-950 font-bold text-sm hover:bg-red-50 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-red-950" />
                    {targetStatus === 'in-progress' ? 'Resume Quiz' : targetStatus === 'completed' ? 'View Target Day' : 'Start Today\'s Quiz'}
                  </button>
                ) : (
                  <div className="text-xs font-bold text-amber-200 bg-amber-950/60 border border-amber-400/30 px-3.5 py-2 rounded-xl flex items-center gap-2">
                    <Hourglass className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>Countdown: {targetCountdown.formattedCountdown}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Overview Statistics Cards */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-red-900" />
          <span>Learning Analytics</span>
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

          {/* Card 1: Completed Quizzes */}
          <div className="bg-[#0f0f12] p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-elevated transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Days</span>
              <CheckCircle2 className="w-4 h-4 text-red-800" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {overallProgress.totalCompletedDays} / {DAILY_SCHEDULE.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {Math.round((overallProgress.totalCompletedDays / DAILY_SCHEDULE.length) * 100)}% of curriculum
            </div>
          </div>

          {/* Card 2: States Mastered */}
          <div className="bg-[#0f0f12] p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-elevated transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">States Mastered</span>
              <BookOpen className="w-4 h-4 text-red-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {overallProgress.totalStatesLearned} / 28
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Across cumulative daily pools</div>
          </div>

          {/* Card 3: Overall Accuracy */}
          <div className="bg-[#0f0f12] p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-card hover:shadow-elevated transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Accuracy</span>
              <Award className="w-4 h-4 text-red-800" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {overallProgress.overallAccuracy}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {overallProgress.overallMarks}/{overallProgress.overallMaxMarks} Best Marks
            </div>
          </div>

          {/* Card 4: Learning Streak */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-card hover:shadow-elevated transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900">Current Streak</span>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-700">
              {overallProgress.currentStreak} {overallProgress.currentStreak === 1 ? 'Day' : 'Days'}
            </div>
            <div className="text-[11px] text-amber-800/80 mt-1">Consistent daily habit</div>
          </div>

        </div>
      </section>

      {/* Daily Learning Streak Tracker */}
      <StreakTracker
        attempts={allAttempts}
        currentStreak={overallProgress.currentStreak}
        bestStreak={overallProgress.bestStreak || overallProgress.currentStreak}
        onOpenBadges={onOpenBadges || (() => {})}
      />

      {/* Featured Achievement Badges Showcase */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Achievement Badges</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Celebrate your learning milestones, perfect scores, and daily habit streaks!
            </p>
          </div>

          {onOpenBadges && (
            <button
              onClick={onOpenBadges}
              className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Trophy Cabinet ({unlockedCount}/{allBadges.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 4 Spotlight Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {allBadges.slice(0, 4).map(badge => (
            <div
              key={badge.id}
              onClick={onOpenBadges}
              className={`p-4 rounded-2xl border transition-all cursor-pointer hover:scale-102 flex flex-col justify-between ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-[#0f0f12] to-amber-50/40 border-amber-300 shadow-sm'
                  : 'bg-[#0f0f12] border-slate-200 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{badge.icon}</span>
                {badge.unlocked ? (
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-900 bg-red-100 px-2 py-0.5 rounded-full border border-red-300">
                    Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400 bg-[#2b1118] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" /> Locked
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {badge.description}
                </p>
              </div>

              {!badge.unlocked && badge.targetProgress && (
                <div className="mt-2.5 pt-2 border-t border-slate-100">
                  <div className="w-full bg-[#2b1118] h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${Math.min(100, Math.round(((badge.currentProgress || 0) / badge.targetProgress) * 100))}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Daily Quizzes Section (09 Nov to 15 Nov Schedule + Special Tests) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Daily Learning Schedule (09 Nov – 15 Nov 2026)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Content unlocks at 8:29 PM IST each day. Completed days remain permanently accessible for review.
            </p>
          </div>

          <div className="flex items-center bg-[#2b1118] p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'all' ? 'bg-[#0f0f12] text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Days ({DAILY_SCHEDULE.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'pending' ? 'bg-[#0f0f12] text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'completed' ? 'bg-[#0f0f12] text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({overallProgress.totalCompletedDays})
            </button>
          </div>
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchedule.map((scheduleItem) => {
            const dayQuiz = getQuizForDay(scheduleItem.dayNumber);
            const status = getQuizStatus(dayQuiz.id);
            const bestAttempt = getBestAttempt(dayQuiz.id);
            const latestAttempt = getLatestAttempt(dayQuiz.id);
            const isCompleted = status === 'completed';
            const isUnlocked = isDayUnlocked(scheduleItem.dayNumber, completedDayIds);
            const isInProgress = isUnlocked && !isCompleted && status === 'in-progress';
            const countdown = getDayCountdown(scheduleItem.dayNumber, completedDayIds);
            const retakeStatus = getRetakeStatusForQuiz(dayQuiz.id);

            return (
              <div
                key={scheduleItem.dayNumber}
                className={`relative flex flex-col justify-between rounded-2xl bg-[#0f0f12] border p-5 sm:p-6 transition-all duration-200 hover:shadow-elevated group ${
                  isCompleted
                    ? 'border-red-300/90 bg-gradient-to-b from-[#0f0f12] to-red-50/20'
                    : isInProgress
                    ? 'border-amber-300 ring-2 ring-amber-100'
                    : isUnlocked
                    ? 'border-slate-200 shadow-card hover:border-slate-300'
                    : 'border-slate-200/70 bg-[#241014]/50 opacity-90'
                }`}
              >
                {/* Top Row: Day Badge & Status */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black tracking-wide ${
                        isUnlocked ? 'bg-slate-900 text-white' : 'bg-slate-400 text-white'
                      }`}>
                        {scheduleItem.isSpecialTest
                          ? scheduleItem.title
                          : `Day ${scheduleItem.dayNumber < 10 ? '0' + scheduleItem.dayNumber : scheduleItem.dayNumber}`}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-900 border border-red-300">
                        <Calendar className="w-3.5 h-3.5 text-red-800" />
                        {scheduleItem.displayDate}
                      </span>
                    </div>

                    {/* Status Pill */}
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-800" />
                        Completed
                      </span>
                    ) : !isUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#2b1118] text-slate-600 border border-slate-200">
                        <Lock className="w-3 h-3 text-slate-500" />
                        Locked (8:29 PM)
                      </span>
                    ) : isUnlocked && isInProgress ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-900 border border-red-300">
                        Available Now
                      </span>
                    )}
                  </div>

                  {/* Countdown notice if locked */}
                  {!isUnlocked && (
                    <div className="mb-3 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Hourglass className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        <span>Unlocks at 8:30 PM IST</span>
                      </span>
                      <span className="font-mono text-amber-800 font-black">{countdown.formattedCountdown}</span>
                    </div>
                  )}

                  {/* States List Chips */}
                  <div className="space-y-2 mb-4 text-xs">
                    <div>
                      <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-1">
                        📚 States Covered ({scheduleItem.states.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {scheduleItem.states.map((st, sIdx) => {
                          const isNew = scheduleItem.newStates.includes(st);
                          return (
                            <span
                              key={sIdx}
                              className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                                isNew
                                  ? 'bg-red-100 text-red-950 border border-red-400 font-bold'
                                  : 'bg-[#2b1118] text-slate-700 border border-slate-200'
                              }`}
                            >
                              {st} {isNew && scheduleItem.dayNumber > 1 && '⭐ (New)'}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                      <span>{scheduleItem.totalQuestions} Questions Pool</span>
                      {scheduleItem.newStates.length > 0 && scheduleItem.dayNumber > 1 && (
                        <span>New: <strong>{scheduleItem.newStates.join(', ')}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Study Notes Shortcut */}
                  <div className="bg-[#241014]/80 rounded-xl p-2.5 border border-slate-100 mb-4 text-xs flex items-center justify-between">
                    <button
                      onClick={() => onOpenStudyGuide(scheduleItem.states[0])}
                      className="text-red-900 hover:text-red-950 font-bold hover:underline inline-flex items-center gap-1 text-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-red-800" />
                      <span>Review State Study Guide</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Scores (if completed) */}
                  {isCompleted && bestAttempt && (
                    <div className="p-3 rounded-xl bg-red-50/70 border border-red-300 mb-4 text-xs">
                      <div className="flex items-center justify-between font-semibold text-red-950 mb-1">
                        <span className="flex items-center gap-1 text-red-900">
                          <Award className="w-3.5 h-3.5 text-red-800" />
                          Best Score:
                        </span>
                        <span className="font-black text-red-900">
                          {bestAttempt.marksObtained}/{bestAttempt.maxMarks} ({bestAttempt.percentage}%)
                        </span>
                      </div>
                      {latestAttempt && latestAttempt.id !== bestAttempt.id && (
                        <div className="flex items-center justify-between text-slate-500 text-[11px]">
                          <span>Latest Attempt:</span>
                          <span>{latestAttempt.marksObtained}/{latestAttempt.maxMarks} ({latestAttempt.percentage}%)</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions & Notes PDF */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    {isCompleted ? (
                      <>
                        <button
                          onClick={() => onViewResult(latestAttempt || bestAttempt!)}
                          className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-[#2b1118] hover:bg-[#3a1822] transition-colors flex items-center justify-center gap-1.5"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-red-800" />
                          <span>View Result</span>
                        </button>

                        {/* Retake Request Option */}
                        {retakeStatus?.status === 'approved' ? (
                          <button
                            onClick={() => handleStartApprovedRetake(dayQuiz.id)}
                            className="flex-1 px-3 py-2.5 rounded-xl text-xs font-extrabold text-white bg-red-800 hover:bg-red-900 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5 animate-pulse"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Retake Approved!</span>
                          </button>
                        ) : retakeStatus?.status === 'pending' || requestSentQuizId === dayQuiz.id ? (
                          <button
                            disabled
                            className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 cursor-not-allowed flex items-center justify-center gap-1.5"
                          >
                            <Hourglass className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                            <span>Retake Pending</span>
                          </button>
                        ) : retakeStatus?.status === 'rejected' ? (
                          <button
                            onClick={() => handleRequestRetake(scheduleItem, dayQuiz.id)}
                            className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5"
                            title="Sanju requested reviewing notes first. Click to ask again."
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Ask Again</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRequestRetake(scheduleItem, dayQuiz.id)}
                            className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold text-red-900 bg-red-50 border border-red-300 hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
                            title="Ask Sanju to approve another quiz attempt"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Attempt Again</span>
                          </button>
                        )}
                      </>
                    ) : !isUnlocked ? (
                      <button
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-[#2b1118] cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Unlocks at 8:30 PM IST</span>
                      </button>
                    ) : isInProgress ? (
                      <button
                        onClick={() => onStartQuiz(dayQuiz.id)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-500 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-amber-950" />
                        Resume Quiz
                      </button>
                    ) : (
                      <button
                        onClick={() => onStartQuiz(dayQuiz.id)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-red-900 hover:bg-red-900 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 group-hover:bg-red-900"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        Start Day Quiz ({scheduleItem.totalQuestions} Qs)
                      </button>
                    )}
                  </div>

                  {/* Notes PDF Download button located at bottom of day card */}
                  <button
                    onClick={() => generateDayNotesPDF(dayQuiz)}
                    className="w-full py-2 px-3 rounded-xl bg-[#241014] hover:bg-[#2b1118] border border-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                    title="Download complete notes and questions PDF for this day"
                  >
                    <Download className="w-3.5 h-3.5 text-red-800" />
                    <span>Download Notes PDF</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* Motivational Bottom Banner */}
      <section className="rounded-2xl bg-gradient-to-r from-red-50 via-red-50 to-sage-50 border border-red-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0f0f12] border border-red-300 flex items-center justify-center text-red-900 shadow-sm shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
              "Every day you learn something new, you become a better version of yourself."
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Keep learning, Mahi! Each day's cumulative revision makes your memory permanent.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenStudyGuide()}
          className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-[#0f0f12] border border-red-300 text-red-950 font-bold text-xs sm:text-sm hover:bg-red-50 transition-colors shadow-sm flex items-center gap-1.5"
        >
          Explore Study Guide
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
