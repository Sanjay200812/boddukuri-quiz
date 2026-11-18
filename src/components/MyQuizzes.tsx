import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  Trophy,
  Trees,
  Globe2,
  Landmark,
  Waves,
  Target
} from 'lucide-react';
import { Card3D } from './ui/Card3D';
import type { DailyQuiz, OverallProgress, QuizAttempt } from '../types/quiz';
import {
  getAllAttempts,
  getCompletedDayIds
} from '../utils/storage';
import { getTopicsList } from '../data/topics';
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

  const topics = getTopicsList();
  const allAttempts = getAllAttempts();
  const completedDayIds = getCompletedDayIds();

  const semiFinalQuiz = getQuizForDay('semi-final');
  const grandFinalQuiz = getQuizForDay('grand-final');

  const getTopicMetrics = (topicId: string) => {
    const topicAttempts = allAttempts.filter(a => a.quizId === topicId);
    const attemptsCount = topicAttempts.length;
    const bestPercentage = attemptsCount > 0 ? Math.max(...topicAttempts.map(a => a.percentage || 0)) : 0;
    const isCompleted = completedDayIds.includes(topicId) || bestPercentage >= 70;
    const latest = topicAttempts[0] || null;
    return { attemptsCount, bestPercentage, isCompleted, latest };
  };

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trees': return Trees;
      case 'Globe2': return Globe2;
      case 'Landmark': return Landmark;
      case 'Award': return Award;
      case 'Waves': return Waves;
      default: return Target;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 text-[#f2e6eb]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#260c18] pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#ff8099] px-2.5 py-0.5 rounded-full bg-[#2a0717] border border-[#52102c]">
            Quiz by Spideyy
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Learning Workspace & Assessments
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Select any topic category or championship assessment to practice.
          </p>
        </div>

        {/* Tab Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#14060d] border border-[#2b0c18]">
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'topics'
                ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby'
                : 'text-[#a68690] hover:text-white'
            }`}
          >
            5 Topics ({topics.length})
          </button>
          <button
            onClick={() => setActiveTab('championship')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'championship'
                ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby'
                : 'text-[#a68690] hover:text-white'
            }`}
          >
            Championships (2)
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby'
                : 'text-[#a68690] hover:text-white'
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
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff3366]" />
              <span>Specialized Topic Categories</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic, idx) => {
              const Icon = getTopicIcon(topic.icon);
              const metrics = getTopicMetrics(topic.id);

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4, ease: EASE_OUT }}
                  className="h-full"
                >
                  <Card3D intensity={6} depth={10} className="h-full">
                    <div className="h-full rounded-2xl bg-gradient-to-b from-[#16050e]/95 to-[#0e0208]/95 border border-[#3a0d20] hover:border-[#ff3366]/50 p-5 shadow-lg backdrop-blur-md transition-all flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a0717] to-[#17030c] text-[#ff3366] border border-[#52102c] shadow-inner flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#220713] text-[#ff8099] border border-[#470f25]">
                            {topic.totalQuestions} Questions
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                            <span>{topic.title}</span>
                            {metrics.isCompleted && (
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
                            Subtopics:
                          </span>
                          <div className="flex flex-wrap gap-1">
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

                        {metrics.attemptsCount > 0 && (
                          <div className="p-2 rounded-xl bg-[#12040b] border border-[#2b0c18] flex items-center justify-between text-xs">
                            <span className="text-neutral-400 text-[11px]">
                              {metrics.attemptsCount} Attempt{metrics.attemptsCount > 1 ? 's' : ''}
                            </span>
                            <span className="text-emerald-400 font-bold">
                              Best: {metrics.bestPercentage}%
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onStartQuiz(topic.id)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs font-bold transition-all shadow-ruby flex items-center justify-center gap-1.5 border border-[#ff3366]/40 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>{metrics.attemptsCount > 0 ? 'Retake Quiz' : 'Start Quiz'}</span>
                        </motion.button>

                        {metrics.latest && (
                          <button
                            onClick={() => onViewResult(metrics.latest!)}
                            className="p-2.5 rounded-xl bg-[#1a0712] hover:bg-[#25091a] text-[#ff8099] border border-[#2b0c18] transition-colors"
                            title="View Last Answer Sheet"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </Card3D>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CHAMPIONSHIP ASSESSMENTS GRID                                            */}
      {/* ========================================================================= */}
      {(activeTab === 'championship' || activeTab === 'all') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
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
                        <h3 className="text-base font-black text-white">
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
              <div className="h-full rounded-2xl bg-gradient-to-br from-[#200511]/95 via-[#14040b]/95 to-[#0b0207]/95 border border-[#ff3366]/50 p-5 sm:p-6 shadow-[0_4px_30px_rgba(255,51,102,0.18)] flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b0818] to-[#22040d] border border-[#ff3366]/50 text-[#ff8099] flex items-center justify-center font-black shadow-ruby">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">
                          Grand Championship Final
                        </h3>
                        <p className="text-[11px] text-[#ff8099] font-semibold">
                          60 Questions • All 30 States and UTs (2 Qs per State)
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#2e0714] text-[#ff8099] border border-[#52102c]">
                      60 Marks
                    </span>
                  </div>

                  <p className="text-xs text-rose-100/80 leading-relaxed font-medium">
                    The grand final championship testing comprehensive mastery of India's complete 109 National Parks pool across all 30 States/UTs.
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold text-rose-200/80 pt-1 border-t border-[#260817]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#ff3366]" />
                      <span>40 mins</span>
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
