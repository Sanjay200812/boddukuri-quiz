import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  ChevronRight,
  ArrowRight,
  FileText,
  Target,
  Sparkles,
  Award,
  Trees,
  Globe2,
  Landmark,
  Waves,
  Trophy,
  FileCheck,
  Music,
  HelpCircle,
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';
import graduationHeroImg from '../assets/graduation-hero.png';
import { ThreeDNationalParkOrb } from './ThreeDNationalParkOrb';
import { Card3D } from './ui/Card3D';
import type { DailyQuiz, OverallProgress, QuizAttempt, Topic } from '../types/quiz';
import {
  getAllAttempts,
  getCompletedDayIds
} from '../utils/storage';
import { getTopicsList, getQuizzesForTopic, calculateTopicProgress, getTopicById } from '../data/topics';
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
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, ease: EASE_OUT }
};

export const Dashboard: React.FC<DashboardProps> = ({
  quizzes: _quizzes,
  overallProgress,
  onStartQuiz,
  onViewResult,
  onNavigateToQuizzes,
  onNavigateToAttempts,
  onNavigateToProgress,
  userName = 'Student',
}) => {
  const [heroVisual, setHeroVisual] = useState<'3d-orb' | 'cap'>('3d-orb');
  const [viewingTopicId, setViewingTopicId] = useState<string | null>(null);

  const topics: Topic[] = getTopicsList();
  const allAttempts = getAllAttempts();
  const completedDayIds = getCompletedDayIds();

  // Calculate topic-specific metrics using question-level weighted accuracy
  const getTopicMetrics = (topicId: string) => {
    return calculateTopicProgress(topicId, allAttempts, completedDayIds);
  };

  const viewingTopic = viewingTopicId ? getTopicById(viewingTopicId) : null;
  const viewingQuizzes = viewingTopicId ? getQuizzesForTopic(viewingTopicId, false) : [];
  const viewingMetrics = viewingTopicId ? calculateTopicProgress(viewingTopicId, allAttempts, completedDayIds) : null;

  // Recent attempts (up to 4 newest)
  const recentAttempts = allAttempts.slice(0, 4);

  // Championship Quizzes
  const semiFinalQuiz = getQuizForDay('semi-final');
  const grandFinalQuiz = getQuizForDay('grand-final');
  const semiAttempts = allAttempts.filter(a => a.quizId === 'semi-final');
  const grandAttempts = allAttempts.filter(a => a.quizId === 'grand-final');

  // Topic icon mapping helper
  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trees': return Trees;
      case 'Globe2': return Globe2;
      case 'Landmark': return Landmark;
      case 'Award': return Award;
      case 'Waves': return Waves;
      case 'Sparkles': return Sparkles;
      case 'FileCheck': return FileCheck;
      case 'Music': return Music;
      case 'HelpCircle': return HelpCircle;
      default: return Target;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 text-[#f2e6eb]">
      {/* Hero Welcome Banner */}
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
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#ff8099] px-2.5 py-0.5 rounded-full bg-[#2a0717] border border-[#52102c]">
                Spideyy Quiz Workspace
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
                  🎓 Mascot
                </button>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
              Hello, {userName} <span className="inline-block animate-bounce">✨</span>
            </h1>

            <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed max-w-lg font-medium">
              Explore 5 comprehensive topic workspaces, master examination-grade GK facts, and compete in the Semi-Final and Grand Championship Tests.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNavigateToQuizzes}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs sm:text-sm font-bold transition-all shadow-ruby flex items-center gap-2 border border-[#ff3366]/40 cursor-pointer"
              >
                <span>Browse All Topics</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNavigateToProgress}
                className="px-5 py-2.5 rounded-xl bg-[#14060d] hover:bg-[#1f0913] text-[#f2e6eb] border border-[#3b0f23] text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <TrendingUp className="w-4 h-4 text-[#ff8099]" />
                <span>My Progress</span>
              </motion.button>
            </div>
          </div>

          {/* Interactive 3D National Park Orb / Visual Display */}
          <div className="flex relative shrink-0 justify-center items-center">
            {heroVisual === '3d-orb' ? (
              <ThreeDNationalParkOrb size={260} showBadge={true} />
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
                  alt="Graduation Mascot"
                  className="w-52 lg:w-64 h-auto object-cover rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] border border-[#3b0f23] relative z-10"
                />
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {/* 4 Summary Metric KPI Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: 'Topics Available',
            value: `${topics.length} Subjects`,
            icon: Target
          },
          {
            label: 'Quizzes Attempted',
            value: allAttempts.length,
            icon: FileText
          },
          {
            label: 'Average Accuracy',
            value: allAttempts.length > 0 ? `${overallProgress.overallAccuracy}%` : 'N/A',
            icon: CheckCircle2
          },
          {
            label: 'Learning Streak',
            value: `${overallProgress.currentStreak} Days`,
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
              <Card3D intensity={6} depth={10} className="h-full rounded-2xl">
                <div className="h-full rounded-2xl bg-gradient-to-br from-[#16050e]/95 to-[#0d0208]/95 border border-[#3a0d20] hover:border-[#ff3366]/40 p-4 sm:p-5 shadow-lg backdrop-blur-md transition-colors flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2a0717] to-[#17030c] text-[#ff3366] border border-[#52102c] shadow-inner flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 drop-shadow" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white leading-none mb-1 tracking-tight">
                      {item.value}
                    </div>
                    <div className="text-[11px] font-black text-rose-200 tracking-wider uppercase">
                      {item.label}
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          );
        })}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1: TOPIC-BASED LEARNING WORKSPACE (5 MAIN TOPIC CARDS)           */}
      {/* ========================================================================= */}
      <motion.section {...sectionFade} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ff3366]" />
              <span>Topic-Based Learning Workspaces</span>
            </h2>
            <p className="text-xs text-rose-200/90 font-medium">
              Curated examination syllabus across {topics.length} subject workspaces. Both students access the same verified content.
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

        {viewingTopic && viewingMetrics ? (
          /* DEDICATED MOBILE-FIRST TOPIC DRILL-DOWN VIEW */
          <div className="space-y-6 animate-fadeIn">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#2b0c18]">
              <button
                onClick={() => setViewingTopicId(null)}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#200713] hover:bg-[#330c1f] text-[#ff8099] hover:text-white text-xs font-bold transition-all border border-[#52102c] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>← Back to Topics</span>
              </button>

              <span className="text-[11px] font-bold text-neutral-400">
                Topic: <span className="text-white font-extrabold">{viewingTopic.title}</span>
              </span>
            </div>

            {/* Topic Overview Header Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#1c0612] via-[#14040d] to-[#0c0208] border border-[#3a0d20] shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {(() => {
                    const Icon = getTopicIcon(viewingTopic.icon);
                    return (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2a0717] to-[#17030c] text-[#ff3366] border border-[#52102c] flex items-center justify-center shrink-0 shadow-inner">
                        <Icon className="w-6 h-6" />
                      </div>
                    );
                  })()}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#ff8099] px-2.5 py-0.5 rounded-full bg-[#2a0717] border border-[#52102c]">
                        Topic Workspace
                      </span>
                      <span className="text-xs text-neutral-400 font-semibold">
                        {viewingQuizzes.length} Quizzes • {viewingTopic.totalQuestions} Questions
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {viewingTopic.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-3xl leading-relaxed">
                      {viewingTopic.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Accuracy & Progress Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#260817]">
                <div className="p-3.5 rounded-xl bg-[#12040b] border border-[#2b0c18] space-y-1">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Published Quizzes</div>
                  <div className="text-lg sm:text-xl font-black text-white">{viewingMetrics.publishedQuizzes}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#12040b] border border-[#2b0c18] space-y-1">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Completed Quizzes</div>
                  <div className="text-lg sm:text-xl font-black text-emerald-400">
                    {viewingMetrics.completedQuizzes} / {viewingMetrics.publishedQuizzes}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#12040b] border border-[#2b0c18] space-y-1">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Weighted Accuracy</div>
                  <div className="text-lg sm:text-xl font-black text-[#ff8099]">
                    {viewingMetrics.accuracyPercentage}%
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#12040b] border border-[#2b0c18] space-y-1">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Total Questions</div>
                  <div className="text-lg sm:text-xl font-black text-white">
                    {viewingMetrics.totalCorrectAnswers} / {viewingMetrics.totalQuestionsAttempted}
                  </div>
                </div>
              </div>
            </div>

            {/* Quizzes List (Always-visible natural scrolling grid) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff3366]" />
                  <span>Independent Practice Quizzes</span>
                </h3>
                <span className="text-xs text-neutral-400">
                  Target: 10–15 Questions per Quiz
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {viewingQuizzes.map((quiz) => {
                  const qMetric = viewingMetrics.quizzesMetrics[quiz.id];
                  const isQuizDone = qMetric?.isCompleted;
                  const quizAttempts = allAttempts.filter(
                    a => a.quizId === quiz.id || (quiz.order === 1 && a.quizId === viewingTopic.id)
                  );
                  const latestAtt = quizAttempts[0] || null;

                  return (
                    <div
                      key={quiz.id}
                      className="p-5 rounded-2xl bg-gradient-to-b from-[#16050e] to-[#0e0208] border border-[#3a0d20] hover:border-[#ff3366]/50 transition-all flex flex-col justify-between space-y-4 shadow-md"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-[#220713] text-[#ff8099] border border-[#470f25]">
                              {quiz.questionIds.length || quiz.targetQuestionCount || 10} Questions
                            </span>
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#1a0712] text-neutral-300 border border-[#3b0f23]">
                              {quiz.difficulty || 'standard'}
                            </span>
                          </div>

                          {isQuizDone ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-800/40">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Completed ({qMetric?.bestScore}%)</span>
                            </span>
                          ) : qMetric && qMetric.attemptsCount > 0 ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-800/40">
                              <Clock className="w-3.5 h-3.5" />
                              <span>In Progress ({qMetric.latestScore}%)</span>
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500 font-bold">Unattempted</span>
                          )}
                        </div>

                        <h4 className="text-base font-extrabold text-white leading-snug">
                          {quiz.title}
                        </h4>
                        {quiz.description && (
                          <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                            {quiz.description}
                          </p>
                        )}
                      </div>

                      {qMetric && qMetric.attemptsCount > 0 && (
                        <div className="p-2.5 rounded-xl bg-[#0c0207] border border-[#200814] flex items-center justify-between text-xs">
                          <span className="text-neutral-400">
                            {qMetric.attemptsCount} Attempt{qMetric.attemptsCount > 1 ? 's' : ''}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-emerald-400 font-bold">Best: {qMetric.bestScore}%</span>
                            <span className="text-neutral-500">•</span>
                            <span className="text-slate-300">Latest: {qMetric.latestScore}%</span>
                          </div>
                        </div>
                      )}

                      {/* Action buttons (min-height 44px touch targets) */}
                      <div className="flex items-center gap-2 pt-2 border-t border-[#200814]">
                        <button
                          onClick={() => {
                            onStartQuiz(quiz.id);
                          }}
                          className="flex-1 py-3 px-4 min-h-[44px] rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs sm:text-sm font-bold transition-all shadow-ruby flex items-center justify-center gap-2 cursor-pointer border border-[#ff3366]/40"
                        >
                          <Play className="w-4 h-4 fill-white" />
                          <span>{qMetric && qMetric.attemptsCount > 0 ? 'Retake Quiz →' : 'Start Quiz →'}</span>
                        </button>

                        {latestAtt && (
                          <button
                            onClick={() => {
                              onViewResult(latestAtt);
                            }}
                            className="py-3 px-4 min-h-[44px] rounded-xl bg-[#260817] hover:bg-[#380e22] text-[#ff8099] hover:text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-[#52102c]"
                          >
                            View Result
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 text-center">
                <button
                  onClick={() => setViewingTopicId(null)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#1c0612] hover:bg-[#2c0a1d] text-neutral-300 hover:text-white text-xs font-bold transition-colors border border-[#3a0d20] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Topics</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* NORMAL TOPICS WORKSPACE GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic, idx) => {
              const Icon = getTopicIcon(topic.icon);
              const metrics = getTopicMetrics(topic.id);
              const topicQuizzes = getQuizzesForTopic(topic.id, false);
              const isCompleted = metrics.completedQuizzes > 0 && metrics.completedQuizzes === metrics.publishedQuizzes;

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5, ease: EASE_OUT }}
                  className="h-full"
                >
                  <Card3D intensity={6} depth={10} className="h-full">
                    <div className="h-full rounded-2xl bg-gradient-to-b from-[#16050e]/95 to-[#0e0208]/95 border border-[#3a0d20] hover:border-[#ff3366]/50 p-5 shadow-lg backdrop-blur-md transition-all flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        {/* Top Header: Icon & Category pill */}
                        <div className="flex items-center justify-between">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2a0717] to-[#17030c] text-[#ff3366] border border-[#52102c] shadow-inner flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#220713] text-[#ff8099] border border-[#470f25]">
                            {topicQuizzes.length > 0 ? `${topicQuizzes.length} Quizzes` : 'Module'} • {topic.totalQuestions} Qs
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                            <span>{topic.title}</span>
                            {isCompleted && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </h3>
                          <p className="text-xs text-rose-100/80 font-medium mt-1 line-clamp-2 leading-relaxed">
                            {topic.description}
                          </p>
                        </div>

                        {/* Subtopics / Quizzes Preview */}
                        <div className="space-y-1.5 pt-1 border-t border-[#260817]">
                          <span className="text-[10px] uppercase font-bold text-rose-300/70 tracking-wider">
                            Curriculum Sections:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {topic.subtopics.map(sub => (
                              <span
                                key={sub.id}
                                className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[#1a0712] text-rose-200/90 border border-[#3b0f23]"
                              >
                                {sub.title}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Topic-Level Accuracy & Progress (Question-Level Weighted Accuracy) */}
                        {metrics.totalAttemptsCount > 0 ? (
                          <div className="p-2.5 rounded-xl bg-[#12040b] border border-[#2b0c18] space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-400 text-[11px]">
                                {metrics.completedQuizzes} / {metrics.publishedQuizzes} Completed
                              </span>
                              <span className="text-emerald-400 font-bold">
                                {metrics.accuracyPercentage}% Question Accuracy
                              </span>
                            </div>
                            <div className="w-full bg-[#1e0714] h-1.5 rounded-full overflow-hidden border border-[#380e22]">
                              <div
                                className="bg-gradient-to-r from-[#ff3366] to-emerald-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${metrics.completionPercentage}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-[#12040b]/50 border border-[#2b0c18] flex items-center justify-between text-xs text-neutral-400">
                            <span className="text-[11px]">{topicQuizzes.length} Quizzes Available</span>
                            <span className="text-[11px] font-bold text-slate-500">Unattempted</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      {topic.isConfigurable ? (
                        <div className="w-full py-2.5 px-3 rounded-xl bg-[#200612] border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Awaiting Admin Subject Clarification</span>
                        </div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setViewingTopicId(topic.id)}
                          className="w-full py-3 px-4 min-h-[44px] rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs font-bold transition-all shadow-ruby flex items-center justify-center gap-1.5 border border-[#ff3366]/40 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>
                            {topicQuizzes.length > 1
                              ? `Explore Quizzes (${topicQuizzes.length}) →`
                              : metrics.totalAttemptsCount > 0
                              ? 'Practice Again →'
                              : 'Start Topic Quiz →'}
                          </span>
                        </motion.button>
                      )}
                    </div>
                  </Card3D>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* ========================================================================= */}
      {/* SECTION 2: SEPARATE CHAMPIONSHIP ASSESSMENTS (SEMI-FINAL & GRAND TEST)   */}
      {/* ========================================================================= */}
      <motion.section {...sectionFade} className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Championship Assessments (Preserved Core)</span>
            </h2>
            <p className="text-xs text-rose-200/90 font-medium">
              Comprehensive all-India National Parks tests covering all 30 States and Union Territories.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Semi-Final Championship Card */}
          <Card3D intensity={6} depth={10} className="h-full">
            <div className="h-full rounded-2xl bg-gradient-to-br from-[#1a0815]/95 via-[#12050e]/95 to-[#0b0207]/95 border border-amber-500/40 p-5 sm:p-6 shadow-[0_4px_25px_rgba(245,158,11,0.12)] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-950 to-amber-900 border border-amber-600/40 text-amber-300 flex items-center justify-center font-black">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white">
                        Semi-Final Championship Test
                      </h3>
                      <p className="text-[11px] text-amber-300/80 font-semibold">
                        30 Questions • 30 States/UTs (1 Question per State)
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-950/60 text-amber-300 border border-amber-700/50">
                    Official
                  </span>
                </div>

                <p className="text-xs text-rose-100/80 leading-relaxed font-medium">
                  The first major milestone assessment covering national parks across the entire geography of India, balancing eastern, western, northern, and southern regions.
                </p>

                <div className="flex items-center gap-4 text-xs font-semibold text-rose-200/80 pt-1 border-t border-[#260817]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>20 mins</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span>{semiAttempts.length > 0 ? `Best: ${Math.max(...semiAttempts.map(a => a.percentage || 0))}%` : 'Not Attempted'}</span>
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStartQuiz(semiFinalQuiz.id)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 border border-amber-500/40 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{semiAttempts.length > 0 ? 'Retake Semi-Final Test →' : 'Start Semi-Final Test →'}</span>
              </motion.button>
            </div>
          </Card3D>

          {/* Grand Test Championship Card */}
          <Card3D intensity={6} depth={10} className="h-full">
            <div className="h-full rounded-2xl bg-gradient-to-br from-[#200511]/95 via-[#14040b]/95 to-[#0b0207]/95 border border-[#ff3366]/50 p-5 sm:p-6 shadow-[0_4px_30px_rgba(255,51,102,0.18)] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b0818] to-[#22040d] border border-[#ff3366]/50 text-[#ff8099] flex items-center justify-center font-black shadow-ruby">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white">
                        Grand Championship Final
                      </h3>
                      <p className="text-[11px] text-[#ff8099] font-semibold">
                        60 Questions • 30 States/UTs (2 Questions per State)
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#2e0714] text-[#ff8099] border border-[#52102c]">
                    Championship
                  </span>
                </div>

                <p className="text-xs text-rose-100/80 leading-relaxed font-medium">
                  The ultimate championship examination spanning 60 comprehensive national park questions across all 30 States and Union Territories.
                </p>

                <div className="flex items-center gap-4 text-xs font-semibold text-rose-200/80 pt-1 border-t border-[#260817]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#ff3366]" />
                    <span>40 mins</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#ff3366]" />
                    <span>{grandAttempts.length > 0 ? `Best: ${Math.max(...grandAttempts.map(a => a.percentage || 0))}%` : 'Not Attempted'}</span>
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStartQuiz(grandFinalQuiz.id)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs sm:text-sm font-bold transition-all shadow-ruby flex items-center justify-center gap-2 border border-[#ff3366]/50 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{grandAttempts.length > 0 ? 'Retake Grand Final →' : 'Start Grand Championship Final →'}</span>
              </motion.button>
            </div>
          </Card3D>
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* SECTION 3: RECENT ACTIVITY & SUBMISSIONS                                  */}
      {/* ========================================================================= */}
      <motion.section {...sectionFade} className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#ff3366]" />
              <span>Recent Attempt History</span>
            </h2>
            <p className="text-xs text-rose-200/90 font-medium">
              Review your submitted answer sheets and score breakdowns.
            </p>
          </div>

          <button
            onClick={onNavigateToAttempts}
            className="text-xs font-extrabold text-[#ff3366] hover:text-[#ff8099] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All ({allAttempts.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {recentAttempts.length === 0 ? (
          <div className="rounded-2xl bg-[#12050c]/90 border border-[#3b0f23] p-8 text-center space-y-2 shadow-lg backdrop-blur-md">
            <Target className="w-10 h-10 text-rose-400/60 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Quiz Attempts Recorded Yet</h3>
            <p className="text-xs text-rose-100/90 font-medium max-w-md mx-auto">
              Select any of the 5 topic workspaces or championship tests above to begin your learning journey.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {recentAttempts.map((attempt) => (
              <div
                key={attempt.id}
                onClick={() => onViewResult(attempt)}
                className="p-4 rounded-2xl bg-[#14060d] border border-[#2b0c18] hover:border-[#ff3366]/40 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate max-w-[140px]">
                    {attempt.quizId.toUpperCase()}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    attempt.percentage >= 70 ? 'bg-emerald-950/60 text-emerald-400' : 'bg-rose-950/60 text-rose-300'
                  }`}>
                    {attempt.percentage}%
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  Score: {attempt.marksObtained}/{attempt.maxMarks} • {attempt.formattedDate || 'Recent'}
                </div>
                <div className="text-[10px] text-[#ff8099] font-bold flex items-center gap-1">
                  <span>View Answer Sheet</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
};
export default Dashboard;
