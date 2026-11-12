import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Clock,
  Award,
  Calendar,
  FileCheck,
  Eye,
  TrendingUp,
  RotateCcw,
  ArrowRight,
  Filter
} from 'lucide-react';
import type { QuizAttempt } from '../types/quiz';
import { getAllAttempts } from '../utils/storage';
import { DAILY_SCHEDULE } from '../utils/schedule';
import { getQuizForDay } from '../data/quizzes';

interface MyAttemptsProps {
  onViewResult: (attempt: QuizAttempt) => void;
  onInspectAnswers: (attempt: QuizAttempt) => void;
  onNavigateToQuizzes: () => void;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const MyAttempts: React.FC<MyAttemptsProps> = ({
  onViewResult,
  onInspectAnswers,
  onNavigateToQuizzes,
}) => {
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const attempts = getAllAttempts();

  // Group attempts by quizId in chronological order of DAILY_SCHEDULE
  const dayGroups = DAILY_SCHEDULE.map(scheduleItem => {
    const dayAttempts = attempts
      .filter(a => a.quizId === scheduleItem.quizId || a.dayNumber === scheduleItem.dayNumber)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      scheduleItem,
      quiz: getQuizForDay(scheduleItem.dayNumber),
      attempts: dayAttempts
    };
  });

  const totalSubmissions = attempts.length;
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : 0;
  const avgScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
      : 0;

  const filteredGroups = dayGroups.filter(group => {
    if (selectedDayFilter === 'all') return true;
    return group.scheduleItem.quizId === selectedDayFilter;
  });

  return (
    <div className="space-y-6 pb-20 text-neutral-100">
      {/* Top Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="rounded-3xl bg-gradient-to-br from-[#180a13] via-[#0f070d] to-[#070407] text-white p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-white/[0.08] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-[#9e1030]/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#200d18] border border-white/[0.08] text-[#ff8099] text-xs font-semibold mb-1">
            <FileText className="w-3.5 h-3.5 text-[#ff3366]" />
            <span>Submission Records</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            My Attempts
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            Every submitted quiz attempt is preserved here grouped by quiz day. You can review detailed results, scores, time taken, and inspect question-by-question answer sheets.
          </p>
        </div>
      </motion.div>

      {/* Summary KPI Cards with Staggered Scroll Animation */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: 'Total Attempts',
            value: totalSubmissions,
            subtitle: 'Across all curriculum days',
            icon: FileText
          },
          {
            label: 'Best Score',
            value: `${bestScore}%`,
            subtitle: 'Highest recorded accuracy',
            icon: Award,
            highlight: true
          },
          {
            label: 'Average Score',
            value: `${avgScore}%`,
            subtitle: 'Overall test accuracy',
            icon: TrendingUp
          },
          {
            label: 'Retakes Preserved',
            value: Math.max(0, totalSubmissions - dayGroups.filter(g => g.attempts.length > 0).length),
            subtitle: 'Previous attempts kept intact',
            icon: RotateCcw
          }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07, duration: 0.45 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-4 sm:p-5 rounded-2xl bg-[#0f090e]/85 border border-white/[0.08] hover:border-white/[0.14] shadow-lg backdrop-blur-md transition-colors"
            >
              <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span>{item.label}</span>
                <div className="w-8 h-8 rounded-xl bg-[#1e0d17] text-[#ff3366] border border-white/[0.06] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-3xl font-black ${item.highlight ? 'text-[#ff8099]' : 'text-white'}`}>
                {item.value}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">{item.subtitle}</p>
            </motion.div>
          );
        })}
      </section>

      {/* Filter by Day */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span>Day-wise Attempt History</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#220d1a] text-[#ff8099] border border-white/[0.08]">
            {attempts.length} Total
          </span>
        </h2>

        <div className="flex items-center gap-2 max-w-full overflow-x-auto scrollbar-none pb-1">
          <span className="text-xs text-neutral-400 font-bold flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#ff3366]" /> Filter:
          </span>
          <div className="flex items-center bg-[#140a10] p-1 rounded-xl text-xs font-semibold border border-white/[0.06]">
            <button
              onClick={() => setSelectedDayFilter('all')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                selectedDayFilter === 'all'
                  ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby font-bold border border-[#ff3366]/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All Days
            </button>
            {DAILY_SCHEDULE.map(day => (
              <button
                key={day.quizId}
                onClick={() => setSelectedDayFilter(day.quizId)}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedDayFilter === day.quizId
                    ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby font-bold border border-[#ff3366]/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {day.isSpecialTest ? (day.dayNumber === 8 ? 'Semi' : 'Grand') : `Day 0${day.dayNumber}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Attempts Grouped Day by Day */}
      {attempts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-[#0f090e]/85 border border-white/[0.08] p-12 text-center space-y-4 shadow-lg backdrop-blur-md"
        >
          <div className="w-16 h-16 rounded-3xl bg-[#1e0d17] text-[#ff3366] border border-white/[0.06] flex items-center justify-center mx-auto shadow-inner">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Quiz Attempts Recorded Yet</h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mt-1">
              Start Day 01 from My Quizzes. When you submit your answers, your full score, percentage, duration, and answer sheet will automatically appear here.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNavigateToQuizzes}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] text-white text-xs font-bold transition-all shadow-ruby border border-[#ff3366]/30 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Go to My Quizzes</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {filteredGroups.map(group => {
            const hasAttempts = group.attempts.length > 0;
            if (selectedDayFilter !== 'all' && !hasAttempts) {
              return (
                <div
                  key={group.scheduleItem.quizId}
                  className="p-8 rounded-2xl bg-[#0f090e]/85 border border-white/[0.08] text-center text-xs text-neutral-400"
                >
                  No attempts recorded yet for {group.scheduleItem.title}.
                </div>
              );
            }
            if (!hasAttempts && selectedDayFilter === 'all') return null;

            return (
              <motion.div
                key={group.scheduleItem.quizId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="rounded-3xl bg-[#0f090e]/85 border border-white/[0.08] p-5 sm:p-6 shadow-lg backdrop-blur-md space-y-4"
              >
                {/* Section Group Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl text-xs font-black tracking-wide bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby">
                      {group.scheduleItem.isSpecialTest
                        ? group.scheduleItem.title
                        : `Day ${group.scheduleItem.dayNumber < 10 ? '0' + group.scheduleItem.dayNumber : group.scheduleItem.dayNumber}`}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {group.scheduleItem.title} Attempts ({group.attempts.length})
                      </h3>
                      <p className="text-xs text-neutral-400">
                        {group.scheduleItem.displayDate} • {group.scheduleItem.states.length} States • {group.scheduleItem.totalQuestions} Questions
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#1e0d17] text-[#ff8099] border border-white/[0.06]">
                    {group.attempts.length} {group.attempts.length === 1 ? 'Submission' : 'Submissions'}
                  </span>
                </div>

                {/* Attempt Cards in chronological descending order */}
                <div className="space-y-3">
                  {group.attempts.map((att, idx) => {
                    const attemptNumber = group.attempts.length - idx;
                    const mins = Math.floor(att.timeTakenSeconds / 60);
                    const secs = att.timeTakenSeconds % 60;
                    const timeFormatted = `${mins}m ${secs}s`;
                    const isPerfect = att.percentage === 100;

                    return (
                      <motion.div
                        key={att.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05, duration: 0.4 }}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        className="rounded-2xl bg-[#140b12]/80 border border-white/[0.06] hover:border-white/[0.14] p-4 sm:p-5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-2.5 py-0.5 rounded-lg bg-[#200d18] text-[#ff8099] border border-white/[0.06] text-xs font-bold">
                              Attempt #{attemptNumber}{' '}
                              {idx === 0 && (
                                <span className="ml-1 text-[10px] font-black uppercase text-[#ff3366]">
                                  (Latest)
                                </span>
                              )}
                            </span>
                            <span className="text-xs font-semibold text-white">
                              Student: <strong>{att.studentName || 'Mahi'}</strong>
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
                              <Calendar className="w-3 h-3 text-[#ff3366]" />
                              {att.formattedDate ||
                                new Date(att.timestamp).toLocaleString('en-IN', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short'
                                })}
                            </span>
                          </div>

                          {/* Stats Row */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 max-w-xl text-center">
                            <div className="p-2 rounded-xl bg-[#0c070a] border border-white/[0.04]">
                              <div className="text-[10px] uppercase font-bold text-neutral-400">Score</div>
                              <div className="text-sm font-black text-white">
                                {att.marksObtained} / {att.maxMarks}
                              </div>
                            </div>

                            <div className="p-2 rounded-xl bg-[#0c070a] border border-white/[0.04]">
                              <div className="text-[10px] uppercase font-bold text-neutral-400">Percentage</div>
                              <div className={`text-sm font-black ${isPerfect ? 'text-emerald-400' : 'text-[#ff8099]'}`}>
                                {att.percentage}%
                              </div>
                            </div>

                            <div className="p-2 rounded-xl bg-[#0c070a] border border-white/[0.04]">
                              <div className="text-[10px] uppercase font-bold text-neutral-400">Time Taken</div>
                              <div className="text-xs font-bold text-white mt-0.5 flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3 text-[#ff3366]" />
                                <span>{timeFormatted}</span>
                              </div>
                            </div>

                            <div className="p-2 rounded-xl bg-[#0c070a] border border-white/[0.04]">
                              <div className="text-[10px] uppercase font-bold text-neutral-400">Result</div>
                              <div className="text-xs font-bold text-emerald-400 mt-0.5">
                                {att.performanceMessage || (isPerfect ? 'Outstanding' : 'Completed')}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onViewResult(att)}
                            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-neutral-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <FileCheck className="w-4 h-4" />
                            <span>View Result</span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onInspectAnswers(att)}
                            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-ruby border border-[#ff3366]/30 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Inspect Answers</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
