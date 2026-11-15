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
import { ThreeDNationalParkOrb } from './ThreeDNationalParkOrb';
import { Card3D } from './ui/Card3D';
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

  const [heroVisual, setHeroVisual] = useState<'3d-orb' | 'cap'>('3d-orb');

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
      {/* Hero Welcome Banner with 3D Component Toggle & Crystal-Clear Typography */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c0610] via-[#14050d] to-[#0a0206] text-white p-6 sm:p-8 shadow-[0_16px_45px_rgba(0,0,0,0.75)] border border-[#3b0f23]"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#9e1030]/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-20 w-60 h-60 rounded-full bg-[#ff3366]/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-3.5 text-left w-full">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm sm:text-base text-rose-200 font-semibold tracking-wide">
                Welcome back,
              </span>

              {/* 3D Visual Mode Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#14050e] border border-[#3a0d20] text-xs font-bold shadow-inner">
                <button
                  type="button"
                  onClick={() => setHeroVisual('3d-orb')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    heroVisual === '3d-orb'
                      ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby'
                      : 'text-rose-200/80 hover:text-white'
                  }`}
                >
                  🔮 3D Orb
                </button>
                <button
                  type="button"
                  onClick={() => setHeroVisual('cap')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    heroVisual === 'cap'
                      ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby'
                      : 'text-rose-200/80 hover:text-white'
                  }`}
                >
                  🎓 Cap
                </button>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
              {userName} <span className="inline-block animate-bounce">👋</span>
            </h1>

            <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed max-w-lg font-medium">
              Master India's 109 National Parks through structured daily learning, revision drills, and high-precision assessments.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNavigateToQuizzes}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs sm:text-sm font-bold transition-all shadow-ruby flex items-center gap-2 border border-[#ff3366]/40 cursor-pointer"
              >
                <span>Explore Quizzes</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNavigateToProgress}
                className="px-5 py-2.5 rounded-xl bg-[#14060d] hover:bg-[#1f0913] text-[#f2e6eb] border border-[#3b0f23] text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <TrendingUp className="w-4 h-4 text-[#ff8099]" />
                <span>View Progress</span>
              </motion.button>
            </div>
          </div>

          {/* Interactive 3D National Park Orb / Graduation Cap Display */}
          <div className="flex relative shrink-0 justify-center items-center">
            {heroVisual === '3d-orb' ? (
              <ThreeDNationalParkOrb size={270} showBadge={true} />
            ) : (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-[#ff3366]/20 blur-2xl rounded-full scale-90 pointer-events-none" />
                <img
                  src={graduationHeroImg}
                  alt="Graduation Cap and Books"
                  className="w-56 lg:w-68 h-auto object-cover rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] border border-[#3b0f23] relative z-10"
                />
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {/* 4 Summary Metric Cards Wrapped with 3D Perspective Tilt & Specular Glare */}
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
              className="h-full"
            >
              <Card3D intensity={10} depth={14} className="h-full rounded-2xl">
                <div className="h-full rounded-2xl bg-gradient-to-br from-[#16050e]/95 to-[#0d0208]/95 border border-[#3a0d20] hover:border-[#ff3366]/40 p-4 sm:p-5 shadow-lg backdrop-blur-md transition-colors flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2a0717] to-[#17030c] text-[#ff3366] border border-[#52102c] shadow-inner flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 drop-shadow" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-white leading-none mb-1 tracking-tight">
                      {item.value}
                    </div>
                    <div className="text-xs font-black text-rose-200 tracking-wider uppercase">
                      {item.label}
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          );
        })}
      </section>

      {/* Next Target / Spotlight Card with 3D Depth */}
      {targetQuiz && !completedDayIds.includes(targetQuiz.id) && (
        <motion.section {...sectionFade}>
          <Card3D intensity={6} depth={10}>
            <div className="rounded-2xl bg-gradient-to-r from-[#1b0612] via-[#14050e] to-[#12040b] border border-[#ff3366]/50 p-5 sm:p-6 shadow-[0_0_35px_rgba(255,51,102,0.22)] ring-1 ring-[#ff3366]/30 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff3366]/15 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start gap-4 relative z-10">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-sm shrink-0 ${
                    isTargetUnlocked ? 'bg-gradient-to-tr from-[#9e1030] to-[#e6194b] shadow-ruby animate-pulse' : 'bg-[#1a0712] text-rose-300/80 border border-[#3b0f23]'
                  }`}
                >
                  {targetQuiz.dayNumber < 10 ? `0${targetQuiz.dayNumber}` : targetQuiz.dayNumber}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#3d0f21] text-rose-200 border border-[#6b1535]">
                      <Sparkles className="w-3 h-3 text-[#ff3366]" />
                      {isTargetUnlocked ? 'Up Next: Available Now' : 'Up Next: Scheduled'}
                    </span>
                    <span className="text-xs font-semibold text-rose-200/90">• {targetQuiz.displayDate}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {targetQuiz.title}: {targetQuiz.statesCovered.length} States ({targetQuiz.totalQuestions} Questions)
                  </h3>
                  <p className="text-xs font-medium text-rose-100/90">
                    {targetQuiz.statesCovered.slice(0, 4).join(', ')}
                    {targetQuiz.statesCovered.length > 4 ? '...' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end relative z-10">
                {isTargetUnlocked ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onStartQuiz(targetQuiz.id)}
                    className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs sm:text-sm font-bold transition-all shadow-ruby flex items-center justify-center gap-2 border border-[#ff3366]/40 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{targetStatus === 'in-progress' ? 'Resume Quiz' : 'Start Quiz'}</span>
                  </motion.button>
                ) : (
                  <div className="w-full md:w-auto text-xs font-bold text-rose-200 bg-[#1a0712] border border-[#3b0f23] px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-inner">
                    <Hourglass className="w-3.5 h-3.5 text-[#ff3366] animate-pulse" />
                    <span>Unlocks at 8:29 PM IST ({targetCountdown.formattedCountdown})</span>
                  </div>
                )}
              </div>
            </div>
          </Card3D>
        </motion.section>
      )}

      {/* Available Quizzes (Uncompleted Quizzes Only) Matching Image 1 3-Card Grid */}
      <motion.section {...sectionFade} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>Available Quizzes</span>
            </h2>
            <p className="text-xs text-rose-200/90 font-medium">
              Quizzes ready to attempt. Completed quizzes automatically move to My Attempts.
            </p>
          </div>

          <button
            onClick={onNavigateToQuizzes}
            className="text-xs font-extrabold text-[#ff3366] hover:text-[#ff8099] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {availableUncompletedQuizzes.length === 0 ? (
          <div className="rounded-2xl bg-[#12050c]/90 border border-[#3b0f23] p-8 text-center space-y-2 shadow-lg backdrop-blur-md">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">All Quizzes Completed!</h3>
            <p className="text-xs text-rose-100/90 font-medium">
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
                  className="h-full"
                >
                  <Card3D intensity={8} depth={12} className="h-full">
                    <div className="h-full rounded-2xl bg-gradient-to-b from-[#16050e]/95 to-[#0e0208]/95 border border-[#3a0d20] hover:border-[#ff3366]/40 p-5 shadow-lg backdrop-blur-md transition-colors flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        {/* Top Row: Icon container + Bookmark */}
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a0717] to-[#17030c] text-[#ff3366] border border-[#52102c] shadow-inner flex items-center justify-center">
                            <CardIcon className="w-5 h-5 drop-shadow" />
                          </div>
                          <button
                            onClick={() => toggleBookmark(scheduleItem.quizId)}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${
                              isBookmarked
                                ? 'text-[#ff3366] bg-[#220713] border border-[#470f25]'
                                : 'text-rose-200/70 hover:text-white hover:bg-white/[0.04]'
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
                          <p className="text-xs text-rose-100/90 font-medium mt-1 line-clamp-2 leading-relaxed">
                            {scheduleItem.states.length} States: {scheduleItem.states.slice(0, 3).join(', ')}. Complete national park recall.
                          </p>
                        </div>

                        {/* Meta Info: Duration & Question Count */}
                        <div className="flex items-center gap-4 text-xs font-semibold text-rose-200/90 pt-1 border-t border-[#260817]">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#ff3366]" />
                            <span>15 mins</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-[#ff3366]" />
                            <span className="font-bold text-white">{scheduleItem.totalQuestions} Questions</span>
                          </span>
                        </div>
                      </div>

                      {/* Action Button: Start Quiz -> in Crimson Gradient */}
                      {isUnlocked ? (
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onStartQuiz(dayQuiz.id)}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs font-bold transition-all shadow-ruby flex items-center justify-center gap-1.5 border border-[#ff3366]/40 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>{isInProgress ? 'Resume Quiz →' : 'Start Quiz →'}</span>
                        </motion.button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl bg-[#160710] text-rose-300/60 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5 border border-[#300c1c]"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Unlocks {countdown.formattedCountdown}</span>
                        </button>
                      )}
                    </div>
                  </Card3D>
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
          <div className="rounded-2xl bg-[#12050c]/90 border border-[#3b0f23] p-8 text-center space-y-2 shadow-lg backdrop-blur-md">
            <FileText className="w-8 h-8 text-rose-300/60 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Recent Attempts</h3>
            <p className="text-xs text-rose-100/90 font-medium">
              When you submit a quiz, your results and answer sheets will appear here.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#12050c]/90 border border-[#3b0f23] divide-y divide-[#260817] shadow-lg backdrop-blur-md overflow-hidden">
            {recentAttempts.map((att, idx) => {
              const quiz = getQuizForDay(att.quizId);
              return (
                <motion.div
                  key={att.id}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06, duration: 0.4 }}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2a0717] to-[#17030c] text-[#ff3366] border border-[#52102c] shadow-inner flex items-center justify-center shrink-0">
                      <Play className="w-3.5 h-3.5 fill-[#ff3366]" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">
                        Attempted "{quiz.title}"
                      </div>
                      <div className="text-[11px] font-semibold text-rose-200/80">
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
                    <div className="text-xs font-black text-rose-200 bg-[#250815] border border-[#4d112b] px-2.5 py-1 rounded-lg">
                      Score: {att.marksObtained} / {att.maxMarks} ({att.percentage}%)
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onViewResult(att)}
                        className="px-3 py-1.5 rounded-lg bg-[#1a0712] hover:bg-[#25091a] border border-[#3b0f23] text-rose-100 text-xs font-bold transition-all cursor-pointer"
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
        className="rounded-2xl bg-gradient-to-r from-[#1c0610] via-[#12050c] to-[#1c0610] border border-[#3b0f23] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg backdrop-blur-md"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2a0717] to-[#17030c] border border-[#52102c] text-[#ff3366] flex items-center justify-center shrink-0 shadow-inner">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              National Parks Reference & Study Guide
            </h3>
            <p className="text-xs text-rose-100/90 font-medium">
              Read state-wise national park notes, wildlife facts, and historical information before starting tests.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onOpenStudyGuide ? onOpenStudyGuide() : onNavigateToQuizzes()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs font-bold transition-all shadow-ruby flex items-center gap-1.5 shrink-0 border border-[#ff3366]/40 cursor-pointer"
        >
          <span>Open Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </motion.section>
    </div>
  );
};
