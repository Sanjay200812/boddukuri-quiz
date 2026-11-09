import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Award, 
  Flame, 
  TrendingUp, 
  FileCheck, 
  ChevronRight, 
  BookOpen, 
  ArrowRight, 
  MapPin,
  Calendar
} from 'lucide-react';
import type { DailyQuiz, OverallProgress, QuizAttempt } from '../types/quiz';
import { getQuizStatus, getBestAttempt, getLatestAttempt } from '../utils/storage';

interface DashboardProps {
  quizzes: DailyQuiz[];
  overallProgress: OverallProgress;
  onStartQuiz: (quizId: string) => void;
  onViewResult: (attempt: QuizAttempt) => void;
  onOpenStudyGuide: (stateName?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  quizzes,
  overallProgress,
  onStartQuiz,
  onViewResult,
  onOpenStudyGuide,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Filter quizzes according to tab
  const filteredQuizzes = quizzes.filter(quiz => {
    const status = getQuizStatus(quiz.id);
    if (filter === 'completed') return status === 'completed';
    if (filter === 'pending') return status !== 'completed';
    return true;
  });

  // Find next uncompleted day or default to Day 1
  const nextQuiz = quizzes.find(q => getQuizStatus(q.id) !== 'completed') || quizzes[0];
  const nextQuizStatus = getQuizStatus(nextQuiz.id);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-forest-950 text-white p-6 sm:p-10 shadow-elevated">
        {/* Decorative background botanicals / shapes */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-700/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm font-semibold mb-4 backdrop-blur-sm">
            <span>🌿</span>
            <span>Welcome back, Mahi!</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
            Boddukuri's Quiz <span className="text-emerald-300 font-black">#Mahi</span>
          </h1>

          <p className="text-base sm:text-xl text-emerald-100 font-bold tracking-wide mb-4">
            Learn. Revise. Remember. Achieve.
          </p>

          <p className="text-sm sm:text-base text-emerald-200/90 mb-8 max-w-2xl leading-relaxed">
            Your daily cumulative learning platform for India's National Parks. Every daily quiz retains all previously learned states while introducing newly studied states to build permanent recall!
          </p>

          {/* Call to action: Next Day Target */}
          {nextQuiz && (
            <div className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {nextQuiz.dayNumber < 10 ? `0${nextQuiz.dayNumber}` : nextQuiz.dayNumber}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-2">
                    <span>{nextQuizStatus === 'in-progress' ? 'Resume Current Session' : "Today's Target — Day 01"}</span>
                    <span className="text-emerald-200/90 font-medium">• {nextQuiz.displayDate || '09 November 2026'}</span>
                  </div>
                  <div className="text-base font-bold text-white">
                    {nextQuiz.title}: {nextQuiz.statesCovered.length} States Pool ({nextQuiz.totalQuestions} Questions)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStartQuiz(nextQuiz.id)}
                  className="px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50 active:scale-95 transition-all shadow-md flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-emerald-900" />
                  {nextQuizStatus === 'in-progress' ? 'Resume Quiz' : 'Start Today\'s Quiz'}
                </button>
                <button
                  onClick={() => onOpenStudyGuide(nextQuiz.statesCovered[0])}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 text-sm font-semibold transition-colors flex items-center gap-1.5"
                  title="Read brief facts before quiz"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Quick Notes</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6 Key Metrics Grid as required in Section 8 */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          Overall Learning Progress
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          {/* 1. Total states learned */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft hover:border-emerald-200 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">States Learned</span>
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {overallProgress.totalStatesLearned}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">States mastered</div>
          </div>

          {/* 2. Total completed days */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft hover:border-emerald-200 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Completed Days</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700">
              {overallProgress.totalCompletedDays}
              <span className="text-xs text-slate-400 font-normal ml-1">/ {overallProgress.totalDaysAvailable}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Daily quizzes cleared</div>
          </div>

          {/* 3. Total quizzes attempted */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft hover:border-emerald-200 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Quizzes Attempted</span>
              <HelpCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {overallProgress.totalQuizzesAttempted}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Total sessions taken</div>
          </div>

          {/* 4. Overall accuracy */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft hover:border-emerald-200 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Overall Accuracy</span>
              <Award className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-teal-700">
              {overallProgress.overallAccuracy}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Based on best scores</div>
          </div>

          {/* 5. Overall marks */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft hover:border-emerald-200 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Overall Marks</span>
              <FileCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {overallProgress.overallMarks}
              <span className="text-xs text-slate-400 font-normal ml-1">/ {overallProgress.overallMaxMarks}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Points obtained</div>
          </div>

          {/* 6. Current streak */}
          <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-soft hover:border-amber-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900">Current Streak</span>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-700">
              {overallProgress.currentStreak} {overallProgress.currentStreak === 1 ? 'Day' : 'Days'}
            </div>
            <div className="text-[11px] text-amber-800/80 mt-0.5">Consistent daily habit</div>
          </div>

        </div>
      </section>

      {/* Daily Quizzes Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Daily Quiz
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Day 01 • 09 November 2026 — 6 States Covered (30 Questions)
            </p>
          </div>

          {quizzes.length > 1 && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Days ({quizzes.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'pending' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'completed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed ({overallProgress.totalCompletedDays})
              </button>
            </div>
          )}
        </div>

        {/* Quizzes Grid */}
        <div className={`grid grid-cols-1 ${quizzes.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3' : 'max-w-3xl'} gap-5`}>
          {filteredQuizzes.map((quiz) => {
            const status = getQuizStatus(quiz.id);
            const bestAttempt = getBestAttempt(quiz.id);
            const latestAttempt = getLatestAttempt(quiz.id);
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in-progress';
            const isUpcoming = !isCompleted && !isInProgress && quiz.dayNumber > overallProgress.totalCompletedDays + 1;

            return (
              <div 
                key={quiz.id}
                className={`relative flex flex-col justify-between rounded-2xl bg-white border p-5 sm:p-6 transition-all duration-200 hover:shadow-elevated group ${
                  isCompleted 
                    ? 'border-emerald-200/90 bg-gradient-to-b from-white to-emerald-50/20' 
                    : isInProgress
                    ? 'border-amber-300 ring-2 ring-amber-100'
                    : isUpcoming
                    ? 'border-slate-200/60 bg-slate-50/50 opacity-90'
                    : 'border-slate-200 shadow-card hover:border-slate-300'
                }`}
              >
                {/* Top Row: Day Badge & Status */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black tracking-wide bg-slate-900 text-white">
                        {quiz.title}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        {quiz.displayDate} ({quiz.quizDate})
                      </span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" />
                        {quiz.totalQuestions} Questions (~5 per state)
                      </span>
                    </div>

                    {/* Status Pill */}
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Completed
                      </span>
                    ) : isInProgress ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Quiz Status: Available
                      </span>
                    )}
                  </div>

                  {/* Day States Heading */}
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors mb-2">
                    {quiz.statesCovered.length} States Learning Pool
                  </h3>

                  {/* States List Chips */}
                  <div className="space-y-2 mb-4 text-xs">
                    <div>
                      <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-1">
                        📚 States Covered ({quiz.statesCovered.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {quiz.statesCovered.map((st, sIdx) => {
                          const isNew = quiz.newStatesIntroduced.includes(st);
                          return (
                            <span
                              key={sIdx}
                              className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                                isNew 
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' 
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {st} {isNew && quiz.dayNumber > 1 && '⭐ (New)'}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Breakdown Details */}
                    {quiz.previousStates.length > 0 && (
                      <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                        <span>Revision: <strong>{quiz.previousStates.length} states</strong></span>
                        <span>New today: <strong>{quiz.newStatesIntroduced.join(', ')}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Study Notes Link */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 mb-4 text-xs text-slate-600 flex items-center justify-between">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      Study Fact Sheets:
                    </span>
                    <button 
                      onClick={() => onOpenStudyGuide(quiz.statesCovered[0])}
                      className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline inline-flex items-center gap-0.5 text-xs"
                    >
                      Open Guide <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Scores (if completed) */}
                  {isCompleted && bestAttempt && (
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 mb-4 text-xs">
                      <div className="flex items-center justify-between font-semibold text-emerald-950 mb-1">
                        <span className="flex items-center gap-1 text-emerald-800">
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          Best Score:
                        </span>
                        <span className="font-black text-emerald-800">
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

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {isCompleted ? (
                    <>
                      <button
                        onClick={() => onViewResult(latestAttempt || bestAttempt!)}
                        className="flex-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                        View Result
                      </button>
                      <button
                        onClick={() => onStartQuiz(quiz.id)}
                        title="Reattempts are saved independently without overwriting previous scores!"
                        className="flex-1 px-3 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reattempt
                      </button>
                    </>
                  ) : isInProgress ? (
                    <button
                      onClick={() => onStartQuiz(quiz.id)}
                      className="w-full px-4 py-2.5 rounded-xl text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-500 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-amber-950" />
                      Resume Quiz
                    </button>
                  ) : (
                    <button
                      onClick={() => onStartQuiz(quiz.id)}
                      className="w-full px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 group-hover:bg-emerald-800"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Start Day Quiz ({quiz.totalQuestions} Qs)
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* Motivational Bottom Banner */}
      <section className="rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sage-50 border border-emerald-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-sm shrink-0">
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
          className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-emerald-900 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-colors shadow-sm flex items-center gap-1.5"
        >
          Explore Study Guide
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
