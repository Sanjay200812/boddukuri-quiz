import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  Calendar,
  Lock,
  Download,
  Hourglass,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { DailyQuiz, OverallProgress, QuizAttempt, RetakeRequest } from '../types/quiz';
import {
  getQuizStatus,
  getBestAttempt,
  getLatestAttempt,
  getCompletedDayIds,
  getRetakeStatusForQuiz,
  saveRetakeRequest,
  consumeApprovedRetake,
  getInProgressQuiz,
  clearInProgressQuiz
} from '../utils/storage';
import { DAILY_SCHEDULE, isDayUnlocked, getDayCountdown, getRecommendedTargetDay, type DaySchedule } from '../utils/schedule';
import { getQuizForDay } from '../data/quizzes';
import { generateDayNotesPDF } from '../utils/pdfGenerator';
import { submitRetakeRequestCloud } from '../utils/supabase';

interface MyQuizzesProps {
  quizzes: DailyQuiz[];
  overallProgress: OverallProgress;
  onStartQuiz: (quizId: string) => void;
  onViewResult: (attempt: QuizAttempt) => void;
  onOpenStudyGuide: (stateName?: string) => void;
  onNavigateToAttempts: () => void;
  userEmail?: string | null;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const MyQuizzes: React.FC<MyQuizzesProps> = ({
  quizzes: _quizzes,
  overallProgress: _overallProgress,
  onStartQuiz,
  onViewResult,
  onOpenStudyGuide,
  onNavigateToAttempts,
  userEmail,
}) => {
  const [filter, setFilter] = useState<'active' | 'all'>('active');
  const [, setTick] = useState<number>(Date.now());
  const [requestSentQuizId, setRequestSentQuizId] = useState<string | null>(null);

  // Live 1-second ticker for unlock countdowns
  useEffect(() => {
    const timer = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const completedDayIds = getCompletedDayIds();

  // Clean up stale in-progress sessions for locked or completed days
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
      console.warn('Retake cloud sync:', err);
    }
    setTick(Date.now());
  };

  const handleStartApprovedRetake = (quizId: string) => {
    consumeApprovedRetake(quizId);
    onStartQuiz(quizId);
  };

  // Rule: Do not mix completed quizzes into the active quiz list. Completed quizzes move to My Attempts.
  const activeSchedule = DAILY_SCHEDULE.filter(day => {
    const dayQuiz = getQuizForDay(day.dayNumber);
    const isCompleted = completedDayIds.includes(dayQuiz.id);
    if (filter === 'active') {
      return !isCompleted;
    }
    return true;
  });

  const completedCount = DAILY_SCHEDULE.filter(day => {
    const dayQuiz = getQuizForDay(day.dayNumber);
    return completedDayIds.includes(dayQuiz.id);
  }).length;

  return (
    <div className="space-y-6 pb-20 animate-fadeIn text-[#e8d5db]">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c0610] via-[#14050d] to-[#0c0207] text-white p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.7)] border border-[#3d0e20] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-[#ff3366]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2b0c18] border border-[#4a1226] text-[#ff8099] text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#ff3366]" />
            <span>Syllabus Quizzes</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            My Quizzes
          </h1>
          <p className="text-sm sm:text-base text-[#cbb5bc] leading-relaxed">
            Follow the daily cumulative National Parks study plan in chronological order. Completed quizzes automatically move to <strong className="text-white">My Attempts</strong>.
          </p>
        </div>
      </div>

      {/* Completed Quizzes Notice Banner */}
      {completedCount > 0 && (
        <div className="rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#102919] border border-[#1b4329] text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">
                {completedCount} {completedCount === 1 ? 'quiz has' : 'quizzes have'} been completed!
              </div>
              <p className="text-xs text-[#a68690]">
                Completed quizzes are preserved with full scores and answer sheets in My Attempts.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToAttempts}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs font-bold transition-all shadow-ruby flex items-center justify-center gap-1.5 active:scale-95 shrink-0 border border-[#ff3366]/30"
          >
            <span>View My Attempts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter / View Tabs */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span>{filter === 'active' ? 'Active & Upcoming Quizzes' : 'All Curriculum Quizzes'}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#2b0c18] text-[#ff8099] border border-[#4a1226]">
            {activeSchedule.length}
          </span>
        </h2>

        <div className="flex items-center bg-[#14060d] p-1 rounded-xl text-xs font-semibold border border-[#260c18]">
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'active'
                ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby font-bold border border-[#c41c43]/40'
                : 'text-[#a68690] hover:text-white'
            }`}
          >
            Active ({DAILY_SCHEDULE.length - completedCount})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby font-bold border border-[#c41c43]/40'
                : 'text-[#a68690] hover:text-white'
            }`}
          >
            All ({DAILY_SCHEDULE.length})
          </button>
        </div>
      </div>

      {/* Quizzes Grid (2 cards per row on desktop/tablet, 1 per row on mobile) */}
      {activeSchedule.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-[#0f090e]/85 border border-white/[0.08] p-12 text-center space-y-4 shadow-lg backdrop-blur-md"
        >
          <div className="w-16 h-16 rounded-3xl bg-[#1e0d17] text-[#ff3366] border border-white/[0.08] flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">All Available Quizzes Completed!</h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mt-1">
              Outstanding work! You have completed all active quizzes. You can inspect your answer sheets, scores, and review your mistakes in My Attempts.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNavigateToAttempts}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] text-white text-xs font-bold transition-all shadow-ruby border border-[#ff3366]/30 cursor-pointer"
          >
            Go to My Attempts
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {activeSchedule.map((scheduleItem, idx) => {
            const dayQuiz = getQuizForDay(scheduleItem.dayNumber);
            const status = getQuizStatus(dayQuiz.id);
            const bestAttempt = getBestAttempt(dayQuiz.id);
            const latestAttempt = getLatestAttempt(dayQuiz.id);
            const isCompleted = status === 'completed';
            const isUnlocked = isDayUnlocked(scheduleItem.dayNumber, completedDayIds);
            const isInProgress = isUnlocked && !isCompleted && status === 'in-progress';
            const countdown = getDayCountdown(scheduleItem.dayNumber, completedDayIds);
            const retakeStatus = getRetakeStatusForQuiz(dayQuiz.id);
            const nextTargetDay = getRecommendedTargetDay(completedDayIds);
            const isNextTarget = scheduleItem.dayNumber === nextTargetDay && !isCompleted;

            return (
              <motion.div
                key={scheduleItem.dayNumber}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: (idx % 4) * 0.08, ease: EASE_OUT }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={`rounded-2xl border p-5 sm:p-6 transition-colors flex flex-col justify-between shadow-lg backdrop-blur-md relative ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-[#0f090e]/85'
                    : isNextTarget
                    ? 'border-[#ff3366] bg-[#14060e] ring-2 ring-[#ff3366]/40 shadow-[0_0_25px_rgba(255,51,102,0.25)]'
                    : isInProgress
                    ? 'border-[#ff3366]/50 bg-[#0f090e]/85 ring-1 ring-[#ff3366]/30'
                    : isUnlocked
                    ? 'border-white/[0.08] hover:border-white/[0.16] bg-[#0f090e]/85'
                    : 'border-white/[0.05] bg-[#0b070a]/80 opacity-90'
                }`}
              >
                <div>
                  {/* Top Bar: Badge, Date & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black tracking-wide bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby">
                        {scheduleItem.isSpecialTest
                          ? scheduleItem.title
                          : `Day ${scheduleItem.dayNumber < 10 ? '0' + scheduleItem.dayNumber : scheduleItem.dayNumber}`}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#1a0c15] text-[#ff8099] border border-white/[0.06]">
                        <Calendar className="w-3.5 h-3.5" />
                        {scheduleItem.displayDate}
                      </span>
                      {isNextTarget && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#ff3366] to-[#9e1030] text-white shadow-ruby animate-pulse">
                          <Sparkles className="w-3 h-3" />
                          Up Next
                        </span>
                      )}
                    </div>

                    {/* Status Pill */}
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/50 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Completed
                      </span>
                    ) : !isUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#140810] text-neutral-400 border border-white/[0.06]">
                        <Lock className="w-3 h-3 text-neutral-400" />
                        Locked (8:29 PM)
                      </span>
                    ) : isInProgress ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-950/50 text-amber-300 border border-amber-500/30 animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#220d1a] text-[#ff8099] border border-white/[0.08]">
                        Available Now
                      </span>
                    )}
                  </div>

                  {/* Auto-Highlight Next Day Banner */}
                  {isNextTarget && (
                    <div className="mb-3 px-3 py-2 rounded-xl bg-gradient-to-r from-[#2b0c18] to-[#1a0712] border border-[#ff3366]/40 text-[#ff8099] text-xs font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#ff3366] animate-bounce" />
                        <span>Up Next: Ready to conquer Day 0{scheduleItem.dayNumber}!</span>
                      </span>
                    </div>
                  )}

                  {/* Countdown bar if locked */}
                  {!isUnlocked && (
                    <div className="mb-3 p-2.5 rounded-xl bg-[#1a0c15] border border-white/[0.08] text-[#ff8099] text-xs font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Hourglass className="w-3.5 h-3.5 text-[#ff3366] animate-pulse" />
                        <span>Unlocks at 8:29 PM IST</span>
                      </span>
                      <span className="font-mono font-black text-white">{countdown.formattedCountdown}</span>
                    </div>
                  )}

                  {/* Title & Theme */}
                  <div className="mb-3">
                    <h3 className="text-base font-bold text-white">
                      {scheduleItem.title}
                    </h3>
                    {scheduleItem.theme && (
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                        {scheduleItem.theme}
                      </p>
                    )}
                  </div>

                  {/* States Covered Chips */}
                  <div className="space-y-2 mb-4 text-xs">
                    <div>
                      <span className="font-semibold text-neutral-400 uppercase tracking-wider block text-[10px] mb-1">
                        States Covered ({scheduleItem.states.length}):
                      </span>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                        {scheduleItem.states.map((st, sIdx) => {
                          const isNew = scheduleItem.newStates.includes(st);
                          return (
                            <span
                              key={sIdx}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                                isNew
                                  ? 'bg-[#220d1a] text-[#ff8099] border border-[#ff3366]/20 font-semibold'
                                  : 'bg-[#140a10] text-neutral-300 border border-white/[0.05]'
                              }`}
                            >
                              {st} {isNew && scheduleItem.dayNumber > 1 && '★'}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-[11px] text-neutral-400 pt-1 flex items-center justify-between">
                      <span className="font-semibold text-white">
                        {dayQuiz.totalQuestions || scheduleItem.totalQuestions} Questions Pool • {dayQuiz.stateInfoList.reduce((acc, s) => acc + s.parks.length, 0)} National Parks
                      </span>
                      {scheduleItem.newStates.length > 0 && scheduleItem.dayNumber > 1 && (
                        <span className="line-clamp-1 text-right max-w-[50%]">
                          New: <strong className="text-[#ff8099]">{scheduleItem.newStates.join(', ')}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Study Guide Shortcut */}
                  <div className="bg-[#12080f] rounded-xl p-2.5 border border-white/[0.06] mb-4 text-xs flex items-center justify-between">
                    <button
                      onClick={() => onOpenStudyGuide(scheduleItem.states[0])}
                      className="text-[#ff8099] hover:text-white font-medium hover:underline inline-flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#ff3366]" />
                      <span>Review State Study Guide</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Best Score if completed */}
                  {isCompleted && bestAttempt && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 mb-4 text-xs">
                      <div className="flex items-center justify-between font-semibold text-emerald-200">
                        <span className="flex items-center gap-1 text-emerald-300">
                          <Award className="w-3.5 h-3.5 text-emerald-400" />
                          Best Score:
                        </span>
                        <span className="font-black text-emerald-300">
                          {bestAttempt.marksObtained}/{bestAttempt.maxMarks} ({bestAttempt.percentage}%)
                        </span>
                      </div>
                      {latestAttempt && latestAttempt.id !== bestAttempt.id && (
                        <div className="flex items-center justify-between text-emerald-400/70 text-[11px] mt-1">
                          <span>Latest Attempt:</span>
                          <span>{latestAttempt.marksObtained}/{latestAttempt.maxMarks} ({latestAttempt.percentage}%)</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    {isCompleted ? (
                      <>
                        <button
                          onClick={() => onViewResult(latestAttempt || bestAttempt!)}
                          className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold text-[#ff8099] bg-[#1e0d17] hover:bg-[#2a1321] border border-white/[0.08] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Review Result</span>
                        </button>

                        {/* Retake Button */}
                        {retakeStatus?.status === 'approved' ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStartApprovedRetake(dayQuiz.id)}
                            className="flex-1 px-3 py-2.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-1.5 animate-pulse cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Retake Approved!</span>
                          </motion.button>
                        ) : retakeStatus?.status === 'pending' || requestSentQuizId === dayQuiz.id ? (
                          <button
                            disabled
                            className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-800 cursor-not-allowed flex items-center justify-center gap-1.5"
                          >
                            <Hourglass className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                            <span>Retake Pending</span>
                          </button>
                        ) : retakeStatus?.status === 'rejected' ? (
                          <button
                            onClick={() => handleRequestRetake(scheduleItem, dayQuiz.id)}
                            className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/60 border border-rose-800 hover:bg-rose-900/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Ask Again</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRequestRetake(scheduleItem, dayQuiz.id)}
                            className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold text-[#ff8099] bg-[#1e0d17] border border-white/[0.08] hover:bg-[#2a1321] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Request Retake</span>
                          </button>
                        )}
                      </>
                    ) : !isUnlocked ? (
                      <button
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-500 bg-[#140a10] border border-white/[0.06] cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Lock className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Unlocks at 8:29 PM IST</span>
                      </button>
                    ) : isInProgress ? (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onStartQuiz(dayQuiz.id)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] transition-all shadow-ruby flex items-center justify-center gap-2 border border-[#ff3366]/30 cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Resume Quiz</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onStartQuiz(dayQuiz.id)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] transition-all shadow-ruby flex items-center justify-center gap-2 border border-[#ff3366]/30 cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Start Quiz ({scheduleItem.totalQuestions} Qs)</span>
                      </motion.button>
                    )}
                  </div>

                  {/* Notes PDF Download button */}
                  <button
                    onClick={() => generateDayNotesPDF(dayQuiz)}
                    className="w-full py-2 px-3 rounded-xl bg-[#140a10] hover:bg-[#1e0e18] border border-white/[0.06] text-neutral-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Download complete notes and questions PDF for this day"
                  >
                    <Download className="w-3.5 h-3.5 text-[#ff8099]" />
                    <span>Download Notes PDF</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

