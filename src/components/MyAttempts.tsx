import React, { useState } from 'react';
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
  const avgScore = attempts.length > 0 ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length) : 0;

  const filteredGroups = dayGroups.filter(group => {
    if (selectedDayFilter === 'all') return true;
    return group.scheduleItem.quizId === selectedDayFilter;
  });

  return (
    <div className="space-y-6 pb-20 animate-fadeIn text-[#e8d5db]">
      {/* Top Header Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c0610] via-[#14050d] to-[#0c0207] text-white p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.7)] border border-[#3d0e20] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-[#ff3366]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2b0c18] border border-[#4a1226] text-[#ff8099] text-xs font-semibold mb-3">
            <FileText className="w-3.5 h-3.5 text-[#ff3366]" />
            <span>Submission Records</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            My Attempts
          </h1>
          <p className="text-sm sm:text-base text-[#cbb5bc] leading-relaxed">
            Every submitted quiz attempt is preserved here grouped by quiz day. You can review detailed results, scores, time taken, and inspect question-by-question answer sheets.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-[#a68690] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Attempts</span>
            <FileText className="w-4 h-4 text-[#ff3366]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {totalSubmissions}
          </div>
          <p className="text-[11px] text-[#a68690] mt-1">Across all curriculum days</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-[#a68690] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Best Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#ff8099]">
            {bestScore}%
          </div>
          <p className="text-[11px] text-[#a68690] mt-1">Highest recorded accuracy</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-[#a68690] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Average Score</span>
            <TrendingUp className="w-4 h-4 text-[#ff3366]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {avgScore}%
          </div>
          <p className="text-[11px] text-[#a68690] mt-1">Overall test accuracy</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-[#a68690] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Retakes Preserved</span>
            <RotateCcw className="w-4 h-4 text-[#ff8099]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {Math.max(0, totalSubmissions - dayGroups.filter(g => g.attempts.length > 0).length)}
          </div>
          <p className="text-[11px] text-[#a68690] mt-1">Previous attempts kept intact</p>
        </div>
      </div>

      {/* Filter by Day */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span>Day-wise Attempt History</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#2b0c18] text-[#ff8099] border border-[#4a1226]">
            {attempts.length} Total
          </span>
        </h2>

        <div className="flex items-center gap-2 max-w-full overflow-x-auto scrollbar-none pb-1">
          <span className="text-xs text-[#a68690] font-bold flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#ff3366]" /> Filter:
          </span>
          <div className="flex items-center bg-[#14060d] p-1 rounded-xl text-xs font-semibold border border-[#260c18]">
            <button
              onClick={() => setSelectedDayFilter('all')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedDayFilter === 'all'
                  ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby font-bold border border-[#c41c43]/40'
                  : 'text-[#a68690] hover:text-white'
              }`}
            >
              All Days
            </button>
            {DAILY_SCHEDULE.map(day => (
              <button
                key={day.quizId}
                onClick={() => setSelectedDayFilter(day.quizId)}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedDayFilter === day.quizId
                    ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby font-bold border border-[#c41c43]/40'
                    : 'text-[#a68690] hover:text-white'
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
        <div className="rounded-3xl bg-[#12050c]/90 border border-[#2b0c18] p-12 text-center space-y-4 shadow-lg backdrop-blur-md">
          <div className="w-16 h-16 rounded-3xl bg-[#220713] text-[#ff3366] border border-[#470f25] flex items-center justify-center mx-auto shadow-inner">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Quiz Attempts Recorded Yet</h3>
            <p className="text-xs sm:text-sm text-[#a68690] max-w-md mx-auto mt-1">
              Start Day 01 from My Quizzes. When you submit your answers, your full score, percentage, duration, and answer sheet will automatically appear here.
            </p>
          </div>
          <button
            onClick={onNavigateToQuizzes}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b31238] via-[#9e1030] to-[#750720] hover:from-[#c91842] text-white text-xs font-bold transition-all shadow-ruby active:scale-95 inline-flex items-center gap-2 border border-[#ff3366]/30"
          >
            <span>Go to My Quizzes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredGroups.map(group => {
            const hasAttempts = group.attempts.length > 0;
            if (selectedDayFilter !== 'all' && !hasAttempts) {
              return (
                <div key={group.scheduleItem.quizId} className="p-8 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] text-center text-xs text-[#a68690]">
                  No attempts recorded yet for {group.scheduleItem.title}.
                </div>
              );
            }
            if (!hasAttempts && selectedDayFilter === 'all') return null;

            return (
              <div
                key={group.scheduleItem.quizId}
                className="rounded-3xl bg-[#12050c]/90 border border-[#2b0c18] p-5 sm:p-6 shadow-lg backdrop-blur-md space-y-4"
              >
                {/* Section Group Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#260c18]">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl text-xs font-black tracking-wide bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby">
                      {group.scheduleItem.isSpecialTest
                        ? group.scheduleItem.title
                        : `Day ${group.scheduleItem.dayNumber < 10 ? '0' + group.scheduleItem.dayNumber : group.scheduleItem.dayNumber}`}
                    </span>
                    <div>
                      <h3 className="text-base font-extrabold text-white">
                        {group.scheduleItem.title} Attempts ({group.attempts.length})
                      </h3>
                      <p className="text-xs text-[#a68690]">
                        {group.scheduleItem.displayDate} • {group.scheduleItem.states.length} States • {group.scheduleItem.totalQuestions} Questions
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#2b0c18] text-[#ff8099] border border-[#4a1226]">
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
                      <div
                        key={att.id}
                        className="rounded-2xl bg-[#180710]/80 border border-[#2e0d1d] hover:border-[#ff3366]/40 p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-2.5 py-0.5 rounded-lg bg-[#2b0c18] text-[#ff8099] border border-[#4a1226] text-xs font-bold">
                              Attempt #{attemptNumber} {idx === 0 && <span className="ml-1 text-[10px] font-black uppercase text-[#ff3366]">(Latest)</span>}
                            </span>
                            <span className="text-xs font-semibold text-white">
                              Student: <strong>{att.studentName || 'Mahi'}</strong>
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-[#a68690]">
                              <Calendar className="w-3 h-3 text-[#ff3366]" />
                              {att.formattedDate || new Date(att.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>

                          {/* Stats Row */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 max-w-xl text-center">
                            <div className="p-2 rounded-xl bg-[#12050c] border border-[#260c18]">
                              <div className="text-[10px] uppercase font-bold text-[#a68690]">Score</div>
                              <div className="text-sm font-black text-white">
                                {att.marksObtained} / {att.maxMarks}
                              </div>
                            </div>

                            <div className="p-2 rounded-xl bg-[#12050c] border border-[#260c18]">
                              <div className="text-[10px] uppercase font-bold text-[#a68690]">Percentage</div>
                              <div className={`text-sm font-black ${isPerfect ? 'text-emerald-400' : 'text-[#ff8099]'}`}>
                                {att.percentage}%
                              </div>
                            </div>

                            <div className="p-2 rounded-xl bg-[#12050c] border border-[#260c18]">
                              <div className="text-[10px] uppercase font-bold text-[#a68690]">Time Taken</div>
                              <div className="text-xs font-bold text-white mt-0.5 flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3 text-[#ff3366]" />
                                <span>{timeFormatted}</span>
                              </div>
                            </div>

                            <div className="p-2 rounded-xl bg-[#12050c] border border-[#260c18]">
                              <div className="text-[10px] uppercase font-bold text-[#a68690]">Result</div>
                              <div className="text-xs font-bold text-emerald-400 mt-0.5">
                                {att.performanceMessage || (isPerfect ? 'Outstanding' : 'Completed')}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-[#260c18]">
                          <button
                            onClick={() => onViewResult(att)}
                            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#220713] hover:bg-[#300a1b] border border-[#470f25] text-[#ff8099] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
                          >
                            <FileCheck className="w-4 h-4" />
                            <span>View Result</span>
                          </button>

                          <button
                            onClick={() => onInspectAnswers(att)}
                            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b31238] via-[#9e1030] to-[#750720] hover:from-[#c91842] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-ruby active:scale-95 border border-[#ff3366]/30"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Inspect Answers</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

