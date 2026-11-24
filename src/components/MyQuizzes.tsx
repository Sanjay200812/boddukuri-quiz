import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  Trophy,
  Trees,
  Globe2,
  Landmark,
  Waves,
  Target,
  FileCheck,
  Music,
  HelpCircle,
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';
import { Card3D } from './ui/Card3D';
import type { DailyQuiz, OverallProgress, QuizAttempt } from '../types/quiz';
import {
  getAllAttempts,
  getCompletedDayIds
} from '../utils/storage';
import { getTopicsList, getQuizzesForTopic, calculateTopicProgress, getTopicById } from '../data/topics';
import { getQuizForDay } from '../data/quizzes';

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
  onStartQuiz,
  onViewResult,
}) => {
  const [activeTab, setActiveTab] = useState<'topics' | 'championship' | 'all'>('topics');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const topics = getTopicsList();
  const allAttempts = getAllAttempts();
  const completedDayIds = getCompletedDayIds();

  const semiFinalQuiz = getQuizForDay('semi-final');
  const grandFinalQuiz = getQuizForDay('grand-final');

  const getTopicMetrics = (topicId: string) => {
    return calculateTopicProgress(topicId, allAttempts, completedDayIds);
  };

  const selectedTopic = selectedTopicId ? getTopicById(selectedTopicId) : null;
  const selectedQuizzes = selectedTopicId ? getQuizzesForTopic(selectedTopicId, false) : [];
  const selectedMetrics = selectedTopicId ? calculateTopicProgress(selectedTopicId, allAttempts, completedDayIds) : null;

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
    <div className="space-y-6 sm:space-y-8 pb-20 text-slate-900">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#800020] px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
            Spideyy Quiz
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Learning Workspace & Assessments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Select any topic category or championship assessment to practice.
          </p>
        </div>

        {/* Tab Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200">
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'topics'
                ? 'bg-[#1e3a5f] text-white shadow-soft'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Topics ({topics.length})
          </button>
          <button
            onClick={() => setActiveTab('championship')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'championship'
                ? 'bg-[#1e3a5f] text-white shadow-soft'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Championships (2)
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#1e3a5f] text-white shadow-soft'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Workspaces
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TOPICS WORKSPACE GRID                                                    */}
      {/* ========================================================================= */}
      {(activeTab === 'topics' || activeTab === 'all') && (
        <div className="space-y-4">
          {selectedTopic && selectedMetrics ? (
            /* DEDICATED MOBILE-FIRST TOPIC DRILL-DOWN VIEW (No modal popups) */
            <div className="space-y-6 animate-fadeIn">
              {/* Breadcrumb Navigation */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <button
                  onClick={() => setSelectedTopicId(null)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-[#800020] hover:text-slate-900 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>← Back to All Topics</span>
                </button>

                <span className="text-[11px] font-bold text-slate-500">
                  Topic: <span className="text-white font-extrabold">{selectedTopic.title}</span>
                </span>
              </div>

              {/* Topic Overview Header Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#1c0612] via-[#14040d] to-[#0c0208] border border-slate-200 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {(() => {
                      const Icon = getTopicIcon(selectedTopic.icon);
                      return (
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#1e3a5f] border border-slate-200 flex items-center justify-center shrink-0 shadow-inner">
                          <Icon className="w-6 h-6" />
                        </div>
                      );
                    })()}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#800020] px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                          Topic Workspace
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          {selectedQuizzes.length} Quizzes • {selectedTopic.totalQuestions} Questions
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                        {selectedTopic.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-3xl leading-relaxed">
                        {selectedTopic.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Accuracy & Progress Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#260817]">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Published Quizzes</div>
                    <div className="text-lg sm:text-xl font-bold text-slate-900">{selectedMetrics.publishedQuizzes}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Completed Quizzes</div>
                    <div className="text-lg sm:text-xl font-black text-emerald-400">
                      {selectedMetrics.completedQuizzes} / {selectedMetrics.publishedQuizzes}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Weighted Accuracy</div>
                    <div className="text-lg sm:text-xl font-black text-[#800020]">
                      {selectedMetrics.accuracyPercentage}%
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Total Questions</div>
                    <div className="text-lg sm:text-xl font-bold text-slate-900">
                      {selectedMetrics.totalCorrectAnswers} / {selectedMetrics.totalQuestionsAttempted}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quizzes List (Always-visible natural scrolling grid) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#1e3a5f]" />
                    <span>Independent Practice Quizzes</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    Target: 10–15 Questions per Quiz
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedQuizzes.map((quiz) => {
                    const qMetric = selectedMetrics.quizzesMetrics[quiz.id];
                    const isQuizDone = qMetric?.isCompleted;
                    const quizAttempts = allAttempts.filter(
                      a => a.quizId === quiz.id || (quiz.order === 1 && a.quizId === selectedTopic.id)
                    );
                    const latestAtt = quizAttempts[0] || null;

                    return (
                      <div
                        key={quiz.id}
                        className="p-5 rounded-2xl bg-gradient-to-b from-[#16050e] to-[#0e0208] border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-md"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 text-[#800020] border border-slate-200">
                                {quiz.questionIds.length || quiz.targetQuestionCount || 10} Questions
                              </span>
                              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#1a0712] text-slate-700 border border-slate-200">
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

                          <h4 className="text-base font-bold text-slate-900 leading-snug">
                            {quiz.title}
                          </h4>
                          {quiz.description && (
                            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                              {quiz.description}
                            </p>
                          )}
                        </div>

                        {qMetric && qMetric.attemptsCount > 0 && (
                          <div className="p-2.5 rounded-xl bg-[#0c0207] border border-[#200814] flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                              {qMetric.attemptsCount} Attempt{qMetric.attemptsCount > 1 ? 's' : ''}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-emerald-400 font-bold">Best: {qMetric.bestScore}%</span>
                              <span className="text-neutral-500">•</span>
                              <span className="text-slate-300">Latest: {qMetric.latestScore}%</span>
                            </div>
                          </div>
                        )}

                        {/* Action buttons with touch-friendly min-height 44px */}
                        <div className="flex items-center gap-2 pt-2 border-t border-[#200814]">
                          <button
                            onClick={() => {
                              onStartQuiz(quiz.id);
                            }}
                            className="flex-1 py-3 px-4 min-h-[44px] rounded-xl bg-[#1e3a5f] hover:bg-[#102a43] text-white text-xs sm:text-sm font-bold transition-all shadow-soft flex items-center justify-center gap-2 cursor-pointer border border-[#1e3a5f]/30"
                          >
                            <Play className="w-4 h-4 fill-white" />
                            <span>{qMetric && qMetric.attemptsCount > 0 ? 'Retake Quiz →' : 'Start Quiz →'}</span>
                          </button>

                          {latestAtt && (
                            <button
                              onClick={() => {
                                onViewResult(latestAtt);
                              }}
                              className="py-3 px-4 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-[#800020] hover:text-slate-900 text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-slate-200"
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
                    onClick={() => setSelectedTopicId(null)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#1c0612] hover:bg-[#2c0a1d] text-slate-700 hover:text-slate-900 text-xs font-bold transition-colors border border-slate-200 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to All Topics</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ALL TOPICS WORKSPACE GRID */
            <div>
              <div className="flex items-center justify-between pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1e3a5f]" />
                  <span>Specialized Topic Categories</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map((topic, idx) => {
                  const Icon = getTopicIcon(topic.icon);
                  const metrics = getTopicMetrics(topic.id);
                  const topicQuizzes = getQuizzesForTopic(topic.id, false);
                  const isCompleted = metrics.completedQuizzes > 0 && metrics.completedQuizzes === metrics.publishedQuizzes;

                  return (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.4, ease: EASE_OUT }}
                      className="h-full"
                    >
                      <Card3D intensity={6} depth={10} className="h-full">
                        <div className="h-full rounded-2xl bg-gradient-to-b from-[#16050e]/95 to-[#0e0208]/95 border border-slate-200 hover:border-slate-300 p-5 shadow-lg backdrop-blur-md transition-all flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#1e3a5f] border border-slate-200 shadow-inner flex items-center justify-center">
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-[#800020] border border-slate-200">
                                {topicQuizzes.length > 0 ? `${topicQuizzes.length} Quizzes` : 'Module'} • {topic.totalQuestions} Qs
                              </span>
                            </div>

                            <div>
                              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{topic.title}</span>
                                {isCompleted && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                )}
                              </h3>
                              <p className="text-xs text-rose-100/80 font-medium mt-1 line-clamp-2 leading-relaxed">
                                {topic.description}
                              </p>
                            </div>

                            {/* Subtopics */}
                            <div className="space-y-1 pt-1 border-t border-[#260817]">
                              <span className="text-[10px] uppercase font-bold text-rose-300/70 tracking-wider">
                                Curriculum Sections:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {topic.subtopics.map(sub => (
                                  <span
                                    key={sub.id}
                                    className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[#1a0712] text-rose-200/90 border border-slate-200"
                                  >
                                    {sub.title}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Weighted Question-Level Topic Accuracy & Progress */}
                            {metrics.totalAttemptsCount > 0 ? (
                              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-500 text-[11px]">
                                    {metrics.completedQuizzes} / {metrics.publishedQuizzes} Completed
                                  </span>
                                  <span className="text-emerald-400 font-bold">
                                    {metrics.accuracyPercentage}% Question Accuracy
                                  </span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-[#380e22]">
                                <div
                                  className="bg-gradient-to-r from-[#ff3366] to-emerald-400 h-full rounded-full transition-all duration-500"
                                  style={{ width: `${metrics.completionPercentage}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-500">
                              <span className="text-[11px]">{topicQuizzes.length} Quizzes Available</span>
                              <span className="text-[11px] font-bold text-slate-500">Unattempted</span>
                            </div>
                          )}
                        </div>

                        {topic.isConfigurable ? (
                          <div className="w-full py-2.5 px-3 rounded-xl bg-[#200612] border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Awaiting Admin Subject Clarification</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 pt-1">
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedTopicId(topic.id)}
                              className="flex-1 py-3 px-4 min-h-[44px] rounded-xl bg-[#1e3a5f] hover:bg-[#102a43] text-white text-xs font-bold transition-all shadow-soft flex items-center justify-center gap-1.5 border border-[#1e3a5f]/30 cursor-pointer"
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
                          </div>
                        )}
                      </div>
                    </Card3D>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    )}

      {/* ========================================================================= */}
      {/* CHAMPIONSHIP ASSESSMENTS GRID                                            */}
      {/* ========================================================================= */}
      {(activeTab === 'championship' || activeTab === 'all') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Championship Assessments (Preserved Core)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Semi-Final */}
            <Card3D intensity={6} depth={10} className="h-full">
              <div className="h-full rounded-2xl bg-gradient-to-br from-[#1a0815]/95 via-[#12050e]/95 to-[#0b0207]/95 border border-amber-500/40 p-5 sm:p-6 shadow-[0_4px_25px_rgba(245,158,11,0.12)] flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-950 to-amber-900 border border-amber-600/40 text-amber-300 flex items-center justify-center font-black">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          Semi-Final Test
                        </h3>
                        <p className="text-[11px] text-amber-300/80 font-semibold">
                          30 Questions • All 30 States and UTs (1 Q per State)
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-950/60 text-amber-300 border border-amber-700/50">
                      30 Marks
                    </span>
                  </div>

                  <p className="text-xs text-rose-100/80 leading-relaxed font-medium">
                    Preserved examination assessment covering one signature national park question from every Indian State and Union Territory.
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold text-rose-200/80 pt-1 border-t border-[#260817]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>20 mins</span>
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
                  <span>Start Semi-Final Test →</span>
                </motion.button>
              </div>
            </Card3D>

            {/* Grand Test */}
            <Card3D intensity={6} depth={10} className="h-full">
              <div className="h-full rounded-2xl bg-gradient-to-br from-[#102a43] via-[#1e3a5f] to-[#243b53] text-white border border-slate-300 p-5 sm:p-6 shadow-card flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-white/15 border border-slate-300 text-[#800020] flex items-center justify-center font-black shadow-soft">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          Grand Championship Final
                        </h3>
                        <p className="text-[11px] text-[#800020] font-semibold">
                          60 Questions • All 30 States and UTs (2 Qs per State)
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/15 text-[#800020] border border-slate-200">
                      60 Marks
                    </span>
                  </div>

                  <p className="text-xs text-rose-100/80 leading-relaxed font-medium">
                    The grand final championship testing comprehensive mastery of India's complete 109 National Parks pool across all 30 States/UTs.
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold text-rose-200/80 pt-1 border-t border-[#260817]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#1e3a5f]" />
                      <span>40 mins</span>
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onStartQuiz(grandFinalQuiz.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1e3a5f] hover:bg-[#102a43] text-white text-xs sm:text-sm font-bold transition-all shadow-soft flex items-center justify-center gap-2 border border-slate-300 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Grand Championship Final →</span>
                </motion.button>
              </div>
            </Card3D>
          </div>
        </div>
      )}
    </div>
  );
};
export default MyQuizzes;
