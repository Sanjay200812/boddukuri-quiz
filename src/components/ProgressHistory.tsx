import React from 'react';
import type {
  QuizAttempt,
  DailyQuiz,
  OverallProgress
} from '../types/quiz';
import {
  getBestAttempt,
  getCompletedDayIds,
  getAllAttempts
} from '../utils/storage';
import { DAILY_SCHEDULE } from '../utils/schedule';
import { getQuizForDay } from '../data/quizzes';
import {
  TrendingUp,
  Flame,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  MapPin,
  Award,
  BookOpen
} from 'lucide-react';

interface ProgressHistoryProps {
  quizzes: DailyQuiz[];
  overallProgress: OverallProgress;
  onSelectAttempt: (attempt: QuizAttempt) => void;
  onStartQuiz: (quizId: string) => void;
  onOpenSettings?: () => void;
  onGoHome: () => void;
  onNavigateToAttempts?: () => void;
}

export const ProgressHistory: React.FC<ProgressHistoryProps> = ({
  quizzes: _quizzes,
  overallProgress,
  onSelectAttempt,
  onStartQuiz,
  onNavigateToAttempts,
}) => {
  const attempts = getAllAttempts();
  const completedIds = getCompletedDayIds();

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#800020] via-[#6d001b] to-[#450311] text-white p-6 sm:p-8 shadow-elevated relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-rose-100 text-xs font-semibold mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Learning Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Learning Progress
          </h1>
          <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed">
            Monitor your cumulative National Parks mastery, state coverage, accuracy trends, and day-by-day study roadmap.
          </p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Completed Days */}
        <div className="rounded-2xl bg-white border border-[#ebd4d9] p-4 sm:p-5 shadow-soft">
          <div className="flex items-center justify-between text-[#76515b] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Completed Days</span>
            <CheckCircle2 className="w-4 h-4 text-[#800020]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2b0c15]">
            {completedIds.length} <span className="text-xs text-[#76515b] font-normal">/ {DAILY_SCHEDULE.length}</span>
          </div>
          <p className="text-[11px] text-[#76515b] mt-1">{Math.round((completedIds.length / DAILY_SCHEDULE.length) * 100)}% of curriculum</p>
        </div>

        {/* Card 2: States Mastered */}
        <div className="rounded-2xl bg-white border border-[#ebd4d9] p-4 sm:p-5 shadow-soft">
          <div className="flex items-center justify-between text-[#76515b] text-xs font-bold uppercase tracking-wider mb-2">
            <span>States Mastered</span>
            <MapPin className="w-4 h-4 text-[#800020]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2b0c15]">
            {overallProgress.totalStatesLearned} <span className="text-xs text-[#76515b] font-normal">/ 28</span>
          </div>
          <p className="text-[11px] text-[#76515b] mt-1">Across cumulative daily pools</p>
        </div>

        {/* Card 3: Average Accuracy */}
        <div className="rounded-2xl bg-white border border-[#ebd4d9] p-4 sm:p-5 shadow-soft">
          <div className="flex items-center justify-between text-[#76515b] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Average Accuracy</span>
            <Award className="w-4 h-4 text-[#800020]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#800020]">
            {overallProgress.overallAccuracy}%
          </div>
          <p className="text-[11px] text-[#76515b] mt-1">Across all best quiz attempts</p>
        </div>

        {/* Card 4: Learning Streak */}
        <div className="rounded-2xl bg-white border border-[#ebd4d9] p-4 sm:p-5 shadow-soft">
          <div className="flex items-center justify-between text-[#76515b] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-[#800020]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#800020]">
            {overallProgress.currentStreak} <span className="text-xs text-[#76515b] font-normal">{overallProgress.currentStreak === 1 ? 'Day' : 'Days'}</span>
          </div>
          <p className="text-[11px] text-[#76515b] mt-1">Consecutive learning days</p>
        </div>
      </div>

      {/* Link to My Attempts Banner */}
      {attempts.length > 0 && onNavigateToAttempts && (
        <div className="rounded-2xl bg-gradient-to-r from-[#fde8ec] via-white to-[#fde8ec] border border-[#ebd4d9] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#800020] text-white flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2b0c15]">
                View All {attempts.length} Detailed Submissions in My Attempts
              </h3>
              <p className="text-xs text-[#76515b]">
                Inspect question-by-question answer sheets, time taken, and retake records.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToAttempts}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
          >
            <span>Open My Attempts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Day by Day Progress Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#2b0c15] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#800020]" />
              <span>Day-by-Day Syllabus Progress</span>
            </h2>
            <p className="text-xs text-[#76515b]">
              Track your best score recorded for each day's National Parks curriculum.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAILY_SCHEDULE.map((scheduleItem) => {
            const dayQuiz = getQuizForDay(scheduleItem.dayNumber);
            const best = getBestAttempt(dayQuiz.id);
            const isCompleted = completedIds.includes(dayQuiz.id);

            return (
              <div
                key={scheduleItem.quizId}
                className={`rounded-2xl bg-white border p-5 shadow-soft transition-all hover:shadow-elevated flex flex-col justify-between space-y-4 ${
                  isCompleted ? 'border-emerald-200 bg-gradient-to-b from-white to-emerald-50/20' : 'border-[#ebd4d9]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-[#800020] text-white">
                      {scheduleItem.isSpecialTest ? scheduleItem.title : `Day 0${scheduleItem.dayNumber}`}
                    </span>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-[#76515b] bg-[#f5e6e9] px-2 py-0.5 rounded-full border border-[#ebd4d9]">
                        Pending
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-[#2b0c15]">
                    {scheduleItem.title}
                  </h3>
                  <p className="text-xs text-[#76515b] line-clamp-1">
                    {scheduleItem.states.length} States: {scheduleItem.states.slice(0, 3).join(', ')}
                  </p>

                  {/* Best Score or not attempted */}
                  {best ? (
                    <div className="space-y-1.5 pt-2 border-t border-[#f3e3e6]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#76515b]">Best Score:</span>
                        <strong className="text-[#800020] font-black">
                          {best.marksObtained}/{best.maxMarks} ({best.percentage}%)
                        </strong>
                      </div>
                      <div className="w-full bg-[#fde8ec] h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#800020]"
                          style={{ width: `${best.percentage}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-[#76515b] flex items-center justify-between pt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {Math.floor(best.timeTakenSeconds / 60)}m {best.timeTakenSeconds % 60}s
                        </span>
                        <span className="text-emerald-800 font-semibold">{best.performanceMessage || 'Completed'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#76515b] pt-2 border-t border-[#f3e3e6] italic">
                      Not attempted yet ({scheduleItem.totalQuestions} Questions)
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#f3e3e6]">
                  {best ? (
                    <button
                      onClick={() => onSelectAttempt(best)}
                      className="w-full py-2 px-3 rounded-xl bg-[#fde8ec] hover:bg-[#fad5dc] border border-[#ebd4d9] text-[#800020] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>View Answer Sheet</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onStartQuiz(dayQuiz.id)}
                      className="w-full py-2 px-3 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>Start Quiz</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
