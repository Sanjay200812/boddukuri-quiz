import React from 'react';
import type { 
  QuizAttempt, 
  DailyQuiz, 
  OverallProgress 
} from '../types/quiz';
import { 
  getAllAttempts, 
  getBestAttempt, 
  getCompletedDayIds 
} from '../utils/storage';
import { 
  BarChart3, 
  Flame, 
  CheckCircle2, 
  FileText, 
  Clock, 
  Download, 
  ArrowRight, 
  MapPin
} from 'lucide-react';

interface ProgressHistoryProps {
  quizzes: DailyQuiz[];
  overallProgress: OverallProgress;
  onSelectAttempt: (attempt: QuizAttempt) => void;
  onStartQuiz: (quizId: string) => void;
  onOpenSettings: () => void;
  onGoHome: () => void;
}

export const ProgressHistory: React.FC<ProgressHistoryProps> = ({
  quizzes,
  overallProgress,
  onSelectAttempt,
  onStartQuiz,
  onOpenSettings,
  onGoHome,
}) => {
  const attempts = getAllAttempts();
  const completedIds = getCompletedDayIds();

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-fadeIn">
      
      {/* Page Title & Intro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Boddukuri's Quiz #Mahi — Learning Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track cumulative state retention, reattempt past quizzes, and maintain your learning streak!
          </p>
        </div>

        {/* Backup / Settings Shortcut */}
        <button
          onClick={onOpenSettings}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 shadow-xs flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Export / Backup Data</span>
        </button>
      </div>

      {/* High Level Progress Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
          <div className="text-xs font-semibold text-slate-500 mb-1">States Learned</div>
          <div className="text-3xl font-black text-slate-900">{overallProgress.totalStatesLearned}</div>
          <div className="text-[11px] text-slate-400 mt-1">Unique states mastered</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
          <div className="text-xs font-semibold text-slate-500 mb-1">Completed Days</div>
          <div className="text-3xl font-black text-emerald-700">
            {overallProgress.totalCompletedDays} <span className="text-xs text-slate-400 font-normal">/ {quizzes.length}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Daily pathways cleared</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
          <div className="text-xs font-semibold text-slate-500 mb-1">Overall Accuracy</div>
          <div className="text-3xl font-black text-teal-700">
            {overallProgress.overallAccuracy}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all best scores</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-card">
          <div className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Learning Streak
          </div>
          <div className="text-3xl font-black text-amber-700">
            {overallProgress.currentStreak} {overallProgress.currentStreak === 1 ? 'Day' : 'Days'}
          </div>
          <div className="text-[11px] text-amber-800/80 mt-1">Consistent daily progress</div>
        </div>

      </div>

      {/* Day by Day Mastery Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <span>Cumulative Days Mastery Level</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your best score recorded for each day's quiz. Reattempt any time to improve your accuracy!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => {
            const best = getBestAttempt(quiz.id);
            const isCompleted = completedIds.includes(quiz.id);

            return (
              <div 
                key={quiz.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCompleted 
                    ? 'border-emerald-200 bg-emerald-50/20' 
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-xs font-black bg-slate-900 text-white">
                      {quiz.title}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {quiz.displayDate || '09 November 2026'}
                    </span>
                  </div>
                  {isCompleted ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Pending</span>
                  )}
                </div>

                <div className="font-bold text-slate-900 text-base mb-1">
                  {quiz.statesCovered.length} States Pool ({quiz.totalQuestions} Questions)
                </div>

                <div className="text-xs text-slate-500 line-clamp-1 mb-2">
                  {quiz.statesCovered.join(', ')}
                </div>

                {best ? (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Best Score:</span>
                      <strong className="text-emerald-800 font-black">
                        {best.marksObtained}/{best.maxMarks} ({best.percentage}%)
                      </strong>
                    </div>
                    {/* Score Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          best.percentage >= 80 ? 'bg-emerald-600' : best.percentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${best.percentage}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 py-2 italic">
                    Not attempted yet.
                  </div>
                )}

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  {best ? (
                    <button
                      onClick={() => onSelectAttempt(best)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      View Answer Sheet <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onStartQuiz(quiz.id)}
                      className="text-xs font-bold text-slate-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      Start Quiz <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Attempts Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-700" />
              <span>Full Attempt History Log</span>
            </h2>
            <p className="text-xs text-slate-500">
              Every attempt is saved independently without overwriting previous attempts.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {attempts.length} Total Records
          </span>
        </div>

        {attempts.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700">No quiz attempts recorded yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Take your first daily quiz on the dashboard to start logging your learning records!
            </p>
            <button
              onClick={onGoHome}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold text-xs">
                  <th className="pb-3 font-semibold">Date & Time</th>
                  <th className="pb-3 font-semibold">Quiz Day</th>
                  <th className="pb-3 font-semibold">States Covered</th>
                  <th className="pb-3 font-semibold">Marks</th>
                  <th className="pb-3 font-semibold">Percentage</th>
                  <th className="pb-3 font-semibold">Time</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attempts.map((att) => {
                  const dayStr = att.dayNumber < 10 ? `0${att.dayNumber}` : att.dayNumber;
                  const mins = Math.floor(att.timeTakenSeconds / 60);
                  const secs = att.timeTakenSeconds % 60;

                  return (
                    <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 font-medium text-slate-500 whitespace-nowrap">
                        {att.formattedDate}
                      </td>
                      <td className="py-3.5 font-bold text-slate-900 whitespace-nowrap">
                        Day {dayStr}
                      </td>
                      <td className="py-3.5 font-medium text-slate-700 max-w-[220px] truncate" title={att.statesCovered.join(', ')}>
                        {att.statesCovered.join(', ')}
                      </td>
                      <td className="py-3.5 font-bold text-slate-900 whitespace-nowrap">
                        {att.marksObtained} / {att.maxMarks}
                      </td>
                      <td className="py-3.5 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          att.percentage >= 80 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : att.percentage >= 60 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {att.percentage}%
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-500 whitespace-nowrap">
                        {mins}m {secs}s
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectAttempt(att)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-bold text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Answers
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
