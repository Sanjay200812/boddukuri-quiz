import React, { useState } from 'react';
import {
  Calendar,
  Flame,
  X,
  CheckCircle2
} from 'lucide-react';
import { getStudentStudyPlan, updateStudyPlanTargets } from '../../utils/studentLearning';

interface StudyPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
}

export const StudyPlannerModal: React.FC<StudyPlannerModalProps> = ({
  isOpen,
  onClose,
  studentId,
  studentName
}) => {
  const currentPlan = getStudentStudyPlan(studentId);
  const [dailyTarget, setDailyTarget] = useState<number>(currentPlan.dailyQuestionTarget || 15);
  const [weeklyTarget, setWeeklyTarget] = useState<number>(currentPlan.weeklyQuizTarget || 5);
  const [preferredTime, setPreferredTime] = useState<string>(currentPlan.preferredStudyTime || 'Evening (7:00 PM)');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = currentPlan.dailyLogs?.[todayStr] || { questionsSolved: 0, quizzesCompleted: 0, minutesSpent: 0, goalMet: false };

  // Calculate past 7 days history
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const log = currentPlan.dailyLogs?.[dateStr];
    return {
      dateStr,
      dayName: d.toLocaleDateString(undefined, { weekday: 'short' }),
      isToday: dateStr === todayStr,
      solved: log?.questionsSolved || 0,
      goalMet: (log?.questionsSolved || 0) >= currentPlan.dailyQuestionTarget
    };
  });

  const handleSave = () => {
    updateStudyPlanTargets(studentId, dailyTarget, weeklyTarget, preferredTime);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#ebd4d9] overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#2b0c15] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 text-amber-300">
                <Calendar className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Personal Study Planner</h2>
                <p className="text-xs text-rose-200">Daily targets and habit tracker for {studentName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Today's Goal Status */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#76515b] uppercase">Today's Progress</span>
              <span className="text-xs font-bold text-[#800020]">
                {todayLog.questionsSolved} / {dailyTarget} Questions
              </span>
            </div>
            <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${todayLog.questionsSolved >= dailyTarget ? 'bg-emerald-500' : 'bg-[#800020]'}`}
                style={{ width: `${Math.min(100, Math.round((todayLog.questionsSolved / dailyTarget) * 100))}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-stone-600 flex items-center justify-between">
              <span>{todayLog.minutesSpent} mins studied today</span>
              {todayLog.questionsSolved >= dailyTarget ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Target Achieved!
                </span>
              ) : (
                <span className="text-amber-700 font-medium">
                  {Math.max(0, dailyTarget - todayLog.questionsSolved)} more to hit goal
                </span>
              )}
            </div>
          </div>

          {/* 7-Day Consistency Tracker */}
          <div>
            <h3 className="text-xs font-bold text-[#2b0c15] uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              Past 7 Days Consistency
            </h3>
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {past7Days.map(d => (
                <div
                  key={d.dateStr}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center ${
                    d.isToday
                      ? 'border-[#800020] bg-rose-50/50'
                      : d.goalMet
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-stone-100 bg-stone-50'
                  }`}
                >
                  <span className="text-[10px] font-medium text-stone-500">{d.dayName}</span>
                  <div className="my-1">
                    {d.goalMet ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className="text-xs font-black text-stone-700">{d.solved}</span>
                    )}
                  </div>
                  <span className="text-[9px] text-stone-400">Qs</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target Configuration Form */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1.5">
                Daily Question Target
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 15, 25].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setDailyTarget(cnt)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition min-h-[44px] ${
                      dailyTarget === cnt
                        ? 'border-[#800020] bg-rose-50 text-[#800020]'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1.5">
                Weekly Quiz Target
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 7].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setWeeklyTarget(cnt)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition min-h-[44px] ${
                      weeklyTarget === cnt
                        ? 'border-[#800020] bg-rose-50 text-[#800020]'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {cnt} Quizzes
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1.5">
                Preferred Study Routine
              </label>
              <select
                value={preferredTime}
                onChange={e => setPreferredTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
              >
                <option value="Morning (6:00 AM - 9:00 AM)">Morning (6:00 AM - 9:00 AM)</option>
                <option value="Afternoon (1:00 PM - 3:00 PM)">Afternoon (1:00 PM - 3:00 PM)</option>
                <option value="Evening (7:00 PM - 9:00 PM)">Evening (7:00 PM - 9:00 PM)</option>
                <option value="Night (9:30 PM - 11:30 PM)">Night (9:30 PM - 11:30 PM)</option>
              </select>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200">
              Targets updated successfully! Keep up the momentum! ✨
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-100 transition min-h-[44px]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-[#800020] text-white text-sm font-bold hover:bg-[#5c0017] transition shadow-md active:scale-95 min-h-[44px]"
            >
              Save Targets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
