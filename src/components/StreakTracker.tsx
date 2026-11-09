import React from 'react';
import type { QuizAttempt } from '../types/quiz';
import { getWeeklyStreakDays } from '../utils/storage';
import { Flame, CheckCircle2, ShieldCheck, Zap, Trophy, AlertTriangle } from 'lucide-react';

interface StreakTrackerProps {
  attempts: QuizAttempt[];
  currentStreak: number;
  bestStreak: number;
  onOpenBadges: () => void;
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({
  attempts,
  currentStreak,
  bestStreak,
  onOpenBadges,
}) => {
  const weekDays = getWeeklyStreakDays(attempts);
  const todayItem = weekDays.find(d => d.isToday);
  const hasPracticedToday = todayItem?.completed ?? false;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-card hover:border-emerald-200 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        
        {/* Left: Streak Counter */}
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
            currentStreak > 0
              ? 'bg-gradient-to-tr from-amber-500 to-orange-500 shadow-amber-500/20'
              : 'bg-slate-200 text-slate-400'
          }`}>
            <Flame className={`w-7 h-7 ${currentStreak > 0 ? 'fill-white animate-bounce' : 'text-slate-400'}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {currentStreak} {currentStreak === 1 ? 'Day Streak' : 'Days Streak'}
              </h3>
              {bestStreak > 0 && (
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-600" /> Best: {bestStreak}d
                </span>
              )}
            </div>
            
            <p className="text-xs text-slate-500 mt-0.5">
              {hasPracticedToday ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Awesome! You've protected your learning streak today!
                </span>
              ) : (
                <span className="text-amber-700 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Practice today to maintain your streak!
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right: Badges CTA */}
        <button
          onClick={onOpenBadges}
          className="self-stretch sm:self-auto px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
        >
          <Zap className="w-4 h-4 text-emerald-600" />
          <span>View Badges & Streaks</span>
        </button>

      </div>

      {/* 7-Day Visual Calendar Pill Strip */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3 pt-3 border-t border-slate-100">
        {weekDays.map((day, idx) => {
          return (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                day.isToday
                  ? day.completed
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                    : 'bg-amber-50 text-amber-950 border-amber-300 ring-2 ring-amber-200 animate-pulse'
                  : day.completed
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border-slate-100'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
                {day.dayName}
              </span>

              <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs">
                {day.completed ? (
                  <CheckCircle2 className={`w-5 h-5 ${day.isToday ? 'text-white' : 'text-emerald-600'}`} />
                ) : (
                  <span>{day.dayNumber}</span>
                )}
              </div>

              <span className="text-[9px] font-medium mt-0.5">
                {day.isToday ? 'Today' : day.completed ? 'Done' : '—'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

