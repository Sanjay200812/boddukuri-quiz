import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Lock,
  Hourglass,
  FileText,
  Bookmark,
  Layers,
  Brain,
  Target,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import graduationHeroImg from '../assets/graduation-hero.png';
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

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const sectionFade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: EASE_OUT }
};

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
  userName = 'Sanju',
}) => {
  const [, setTick] = useState<number>(Date.now());
  const [bookmarkedQuizIds, setBookmarkedQuizIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('boddukuri_bookmarked_quizzes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (quizId: string) => {
    setBookmarkedQuizIds(prev => {
      const next = prev.includes(quizId) ? prev.filter(id => id !== quizId) : [...prev, quizId];
      try {
        localStorage.setItem('boddukuri_bookmarked_quizzes', JSON.stringify(next));
      } catch (e) {
        console.warn('Bookmark save error:', e);
      }
      return next;
    });
  };

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

  // Rule: Available Quizzes displays ONLY quizzes that have NOT yet been completed.
  const availableUncompletedQuizzes = DAILY_SCHEDULE.filter(day => {
    const dayQuiz = getQuizForDay(day.dayNumber);
    const isCompleted = completedDayIds.includes(dayQuiz.id);
    return !isCompleted;
  });

  // Recent attempts (up to 4 newest)
  const recentAttempts = allAttempts.slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 text-[#f2e6eb]">
      {/* Hero Welcome Banner Matching Image 1 Mockup */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c0610] via-[#14050d] to-[#0a0206] text-white p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.7)] border border-[#2b0c18]"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#9e1030]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-20 w-60 h-60 rounded-full bg-[#ff3366]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-3.5 text-left w-full">
            <div className="text-sm sm:text-base text-[#cbb5bc] font-normal">
              Welcome back,
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {userName} <span className="inline-block animate-bounce">👋</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#a68690] leading-relaxed max-w-md font-normal">
              Practice quizzes, test your knowledge, and track your progress.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNavigateToQuizzes}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs sm:text-sm font-bold transition-all shadow-ruby flex items-center gap-2 border border-[#ff3366]/30 cursor-pointer"
              >
                <span>Explore Quizzes</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNavigateToProgress}
                className="px-5 py-2.5 rounded-xl bg-[#14060d] hover:bg-[#1f0913] text-[#f2e6eb] border border-[#2b0c18] text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-[#ff8099]" />
                <span>View Progress</span>
              </motion.button>
            </div>
          </div>

          {/* 3D Graduation Cap on Stacked Books (Photorealistic Render from Image 1) */}
          <div className="hidden md:flex relative shrink-0 justify-center items-center">
            <div className="absolute inset-0 bg-[#ff3366]/15 blur-2xl rounded-full scale-90 pointer-events-none" />
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              src={graduationHeroImg}
              alt="Graduation Cap and Books"
              className="w-56 lg:w-72 h-auto object-cover rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] border border-[#2b0c18] relative z-10"
            />
          </div>
        </div>
      </motion.section>

      {/* 4 Summary Metric Cards Matching Image 1 */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: 'Quizzes Attempted',
            value: allAttempts.length,
            icon: FileText
          },
          {
            label: 'Quizzes Completed',
            value: completedDayIds.length,
            icon: CheckCircle2
          },
          {
            label: 'Average Score',
            value: `${overallProgress.overallAccuracy}%`,
            icon: Target
          },
          {
            label: 'Day Streak',
            value: overallProgress.currentStreak,
            icon: Flame
          }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5, ease: EASE_OUT }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] hover:border-[#ff3366]/30 p-4 sm:p-5 shadow-lg backdrop-blur-md transition-all flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#220713] text-[#ff3366] border border-[#470f25] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white leading-none mb-1">
                  {item.value}
                </div>
                <div className="text-xs font-bold text-[#a68690] uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Next Target / Spotlight Card (Prominently Highlighted) */}
      {targetQuiz && !completedDayIds.includes(targetQuiz.id) && (
        <motion.section
          {...sectionFade}
          className="rounded-2xl bg-gradient-to-r from-[#190610] to-[#12050c] border border-[#ff3366]/50 p-5 sm:p-6 shadow-[0_0_30px_rgba(255,51,102,0.2)] ring-1 ring-[#ff3366]/30 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff3366]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start gap-4 relative z-10">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-sm shrink-0 ${
                isTargetUnlocked ? 'bg-gradient-to-tr from-[#9e1030] to-[#e6194b] shadow-ruby animate-pulse' : 'bg-[#1a0712] text-[#7a5b67] border border-[#2b0c18]'
              }`}
            >
              {targetQuiz.dayNumber < 10 ? `0${targetQuiz.dayNumber}` : targetQuiz.dayNumber}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#3d0f21] text-[#ff8099] border border-[#6b1535]">
                  <Sparkles className="w-3 h-3 text-[#ff3366]" />
                  {isTargetUnlocked ? 'Up Next: Available Now' : 'Up Next: Scheduled'}
                </span>
                <span className="text-xs text-[#a68690]">• {targetQuiz.displayDate}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {targetQuiz.title}: {targetQuiz.statesCovered.length} States ({targetQuiz.totalQuestions} Questions)
              </h3>
              <p className="text-xs text-[#a68690]">
                {targetQuiz.statesCovered.slice(0, 4).join(', ')}
                {targetQuiz.statesCovered.length > 4 ? '...' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {isTargetUnlocked ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStartQuiz(targetQuiz.id)}
                className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs sm:text-sm font-bold transition-all shadow-ruby flex items-center justify-center gap-2 border border-[#ff3366]/30 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{targetStatus === 'in-progress' ? 'Resume Quiz' : 'Start Quiz'}</span>
              </motion.button>
            ) : (
              <div className="w-full md:w-auto text-xs font-bold text-[#ff8099] bg-[#1a0712] border border-[#2b0c18] px-4 py-2.5 rounded-xl flex items-center justify-center gap-2">
                <Hourglass className="w-3.5 h-3.5 text-[#ff3366] animate-pulse" />
                <span>Unlocks at 8:29 PM IST ({targetCountdown.formattedCountdown})</span>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Available Quizzes (Uncompleted Quizzes Only) Matching Image 1 3-Card Grid */}
      <motion.section {...sectionFade} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>Available Quizzes</span>
            </h2>
            <p className="text-xs text-[#a68690]">
              Quizzes ready to attempt. Completed quizzes automatically move to My Attempts.
            </p>
          </div>

          <button
            onClick={onNavigateToQuizzes}
            className="text-xs font-bold text-[#ff3366] hover:text-[#ff8099] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {availableUncompletedQuizzes.length === 0 ? (
          <div className="rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] p-8 text-center space-y-2 shadow-lg backdrop-blur-md">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">All Quizzes Completed!</h3>
            <p className="text-xs text-[#a68690]">
              You have completed every available quiz. Review your submitted answer sheets in My Attempts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableUncompletedQuizzes.slice(0, 3).map((scheduleItem, idx) => {
              const dayQuiz = getQuizForDay(scheduleItem.dayNumber);
              const isUnlocked = isDayUnlocked(scheduleItem.dayNumber, completedDayIds);
              const status = getQuizStatus(dayQuiz.id);
              const isInProgress = isUnlocked && status === 'in-progress';
              const countdown = getDayCountdown(scheduleItem.dayNumber, completedDayIds);
              const isBookmarked = bookmarkedQuizIds.includes(scheduleItem.quizId);

              // Distinct card icon per index
              const CardIcon = idx === 0 ? Layers : idx === 1 ? Brain : BookOpen;

              return (
                <motion.div
                  key={scheduleItem.quizId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5, ease: EASE_OUT }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] hover:border-[#ff3366]/30 p-5 shadow-lg backdrop-blur-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Row: Icon container + Bookmark */}
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#220713] text-[#ff3366] border border-[#470f25] flex items-center justify-center">
                        <CardIcon className="w-5 h-5" />
                      </div>
                      <button
                        onClick={() => toggleBookmark(scheduleItem.quizId)}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          isBookmarked
                            ? 'text-[#ff3366] bg-[#220713] border border-[#470f25]'
                            : 'text-[#7a5b67] hover:text-white hover:bg-white/[0.04]'
                        }`}
                        title={isBookmarked ? 'Bookmarked' : 'Add bookmark'}
                        aria-label="Bookmark quiz"
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#ff3366]' : ''}`} />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-white line-clamp-1">
                        {scheduleItem.isSpecialTest ? scheduleItem.title : `Day 0${scheduleItem.dayNumber}: ${scheduleItem.title}`}
                      </h3>
                      <p className="text-xs text-[#a68690] mt-1 line-clamp-2">
                        {scheduleItem.states.length} States: {scheduleItem.states.slice(0, 3).join(', ')}. Complete national park recall.
                      </p>
                    </div>

                    {/* Meta Info: Duration & Question Count matching Image 1 */}
                    <div className="flex items-center gap-4 text-xs text-[#a68690] pt-1 border-t border-[#1e0813]">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#ff3366]" />
                        <span>15 mins</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-[#ff3366]" />
                        <span className="font-semibold text-white">{scheduleItem.totalQuestions} Questions</span>
                      </span>
                    </div>
                  </div>

                  {/* Action Button: Start Quiz -> in Crimson Gradient */}
                  {isUnlocked ? (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onStartQuiz(dayQuiz.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs font-bold transition-all shadow-ruby flex items-center justify-center gap-1.5 border border-[#ff3366]/30 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{isInProgress ? 'Resume Quiz →' : 'Start Quiz →'}</span>
                    </motion.button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl bg-[#160710] text-[#7a5b67] text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5 border border-[#2b0c18]"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlocks {countdown.formattedCountdown}</span>
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* Recent Activity Section Matching Image 1 */}
      <motion.section {...sectionFade} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#ff3366]" />
              <span>Recent Activity</span>
            </h2>
          </div>

          {recentAttempts.length > 0 && (
            <button
              onClick={onNavigateToAttempts}
              className="text-xs font-bold text-[#ff3366] hover:text-[#ff8099] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All →</span>
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
          <div className="rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] divide-y divide-[#1e0813] shadow-lg backdrop-blur-md overflow-hidden">
            {recentAttempts.map((att, idx) => {
              const quiz = getQuizForDay(att.quizId);
              return (
                <motion.div
                  key={att.id}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06, duration: 0.4 }}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#200813] text-[#ff3366] border border-[#4a0d20] flex items-center justify-center shrink-0">
                      <Play className="w-3.5 h-3.5 fill-[#ff3366]" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">
                        Attempted "{quiz.title}"
                      </div>
                      <div className="text-[11px] text-[#a68690]">
                        {att.formattedDate ||
                          new Date(att.timestamp).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-xs font-bold text-[#ff8099]">
                      Score: {att.marksObtained} / {att.maxMarks} ({att.percentage}%)
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onViewResult(att)}
                        className="px-3 py-1.5 rounded-lg bg-[#1a0712] hover:bg-[#25091a] border border-[#2b0c18] text-[#e8d5db] text-xs font-bold transition-all cursor-pointer"
                      >
                        Result
                      </button>

                      {onInspectAnswers && (
                        <button
                          onClick={() => onInspectAnswers(att)}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs font-bold transition-all shadow-ruby cursor-pointer"
                        >
                          Answers
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* Study Guide Banner */}
      <motion.section
        {...sectionFade}
        className="rounded-2xl bg-gradient-to-r from-[#1c0610] via-[#12050c] to-[#1c0610] border border-[#2b0c18] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg backdrop-blur-md"
      >
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

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onOpenStudyGuide ? onOpenStudyGuide() : onNavigateToQuizzes()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs font-bold transition-all shadow-ruby flex items-center gap-1.5 shrink-0 border border-[#ff3366]/30 cursor-pointer"
        >
          <span>Open Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </motion.section>
    </div>
  );
};
