import React, { useState } from 'react';
import type { AchievementBadge } from '../types/quiz';
import { X, CheckCircle2, Lock, Sparkles, Filter } from 'lucide-react';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: AchievementBadge[];
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  badges,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'streak' | 'score' | 'mastery' | 'milestone'>('all');

  if (!isOpen) return null;

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalBadges = badges.length;
  const unlockPercentage = Math.round((unlockedCount / totalBadges) * 100);

  const filteredBadges = badges.filter(b => {
    if (selectedCategory === 'all') return true;
    return b.category === selectedCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-[#0f0f12] w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >

        {/* Header */}
        <div className="relative bg-gradient-to-br from-red-950 via-red-900 to-forest-950 text-white p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-[#0f0f12]/10 hover:bg-[#0f0f12]/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Mahi's Trophy Cabinet</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>🏆 Learning Badges & Achievements</span>
          </h2>

          <p className="text-xs sm:text-sm text-red-300/90 mt-1 max-w-xl">
            Unlock trophies as you build streaks, score high marks, and conquer the National Parks of India!
          </p>

          {/* Progress Bar */}
          <div className="mt-4 pt-4 border-t border-white/15">
            <div className="flex items-center justify-between text-xs font-bold text-red-300 mb-1.5">
              <span>Overall Progress</span>
              <span className="text-white">{unlockedCount} of {totalBadges} Badges Unlocked ({unlockPercentage}%)</span>
            </div>
            <div className="w-full bg-[#0f0f12]/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${unlockPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 bg-[#241014] border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-thin text-xs font-semibold">
          <span className="text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {(['all', 'streak', 'score', 'mastery', 'milestone'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-red-900 text-white font-bold shadow-xs'
                  : 'bg-[#0f0f12] text-slate-600 border border-slate-200 hover:bg-[#2b1118]'
              }`}
            >
              {cat === 'all' ? 'All Badges' : cat}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="p-6 overflow-y-auto max-h-[55vh] space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredBadges.map(badge => {
              const isUnlocked = badge.unlocked;

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-[#0f0f12] to-red-50/40 border-red-400 shadow-sm ring-1 ring-red-100'
                      : 'bg-[#241014]/60 border-slate-200 text-slate-400'
                  }`}
                >
                  {/* Badge Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm ${
                    isUnlocked
                      ? 'bg-red-100 border border-red-400 text-red-950'
                      : 'bg-[#3a1822] border border-slate-300 text-slate-400 grayscale opacity-60'
                  }`}>
                    {badge.icon}
                  </div>

                  {/* Badge Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className={`text-sm font-bold truncate ${isUnlocked ? 'text-slate-900' : 'text-slate-600'}`}>
                        {badge.title}
                      </h4>
                      {isUnlocked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-red-900 bg-red-100/80 px-2 py-0.5 rounded-full border border-red-300">
                          <CheckCircle2 className="w-3 h-3 text-red-800" /> Unlocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-[#3a1822] px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>

                    <p className={`text-xs ${isUnlocked ? 'text-slate-600' : 'text-slate-500'} line-clamp-2`}>
                      {badge.description}
                    </p>

                    {/* Progress indicator */}
                    {!isUnlocked && badge.targetProgress !== undefined && (
                      <div className="mt-2 pt-2 border-t border-slate-200/80">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                          <span>Hint: {badge.rewardHint}</span>
                          <span className="font-bold text-slate-700">{badge.currentProgress || 0} / {badge.targetProgress}</span>
                        </div>
                        <div className="w-full bg-[#3a1822] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-slate-400 h-full rounded-full"
                            style={{ width: `${Math.min(100, Math.round(((badge.currentProgress || 0) / badge.targetProgress) * 100))}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#241014] border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Keep learning every day, Mahi! 💚</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-red-900 hover:bg-red-950 text-white font-bold transition-colors"
          >
            Close Cabinet
          </button>
        </div>

      </div>
    </div>
  );
};
