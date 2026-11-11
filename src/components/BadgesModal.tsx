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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2b0c15]/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#ebd4d9] overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >

        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#800020] via-[#6d001b] to-[#450311] text-white p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Mahi's Trophy Cabinet</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>🏆 Learning Badges & Achievements</span>
          </h2>

          <p className="text-xs sm:text-sm text-rose-100/90 mt-1 max-w-xl">
            Unlock trophies as you build streaks, score high marks, and conquer the National Parks of India!
          </p>

          {/* Progress Bar */}
          <div className="mt-4 pt-4 border-t border-white/15">
            <div className="flex items-center justify-between text-xs font-bold text-rose-200 mb-1.5">
              <span>Overall Progress</span>
              <span className="text-white">{unlockedCount} of {totalBadges} Badges Unlocked ({unlockPercentage}%)</span>
            </div>
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-700"
                style={{ width: `${unlockPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 bg-[#fff8fa] border-b border-[#ebd4d9] flex items-center gap-1.5 overflow-x-auto scrollbar-thin text-xs font-semibold">
          <span className="text-[#76515b] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#800020]" /> Filter:
          </span>
          {(['all', 'streak', 'score', 'mastery', 'milestone'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-[#800020] text-white font-bold shadow-2xs'
                  : 'bg-white text-[#76515b] border border-[#ebd4d9] hover:bg-[#fde8ec]'
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
                      ? 'bg-gradient-to-br from-white to-[#fff5f7] border-[#800020]/40 shadow-soft ring-1 ring-[#800020]/20'
                      : 'bg-[#fff8fa] border-[#ebd4d9] text-[#76515b]'
                  }`}
                >
                  {/* Badge Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-2xs ${
                    isUnlocked
                      ? 'bg-[#fde8ec] border border-[#ebd4d9] text-[#800020]'
                      : 'bg-stone-100 border border-stone-200 text-stone-400 grayscale opacity-60'
                  }`}>
                    {badge.icon}
                  </div>

                  {/* Badge Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className={`text-sm font-bold truncate ${isUnlocked ? 'text-[#2b0c15]' : 'text-[#76515b]'}`}>
                        {badge.title}
                      </h4>
                      {isUnlocked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#800020] bg-[#fde8ec] px-2 py-0.5 rounded-full border border-[#ebd4d9]">
                          <CheckCircle2 className="w-3 h-3 text-[#800020]" /> Unlocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#76515b] bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>

                    <p className={`text-xs ${isUnlocked ? 'text-[#2b0c15]' : 'text-[#76515b]'} line-clamp-2`}>
                      {badge.description}
                    </p>

                    {/* Progress indicator */}
                    {!isUnlocked && badge.targetProgress !== undefined && (
                      <div className="mt-2 pt-2 border-t border-[#ebd4d9]">
                        <div className="flex items-center justify-between text-[11px] text-[#76515b] mb-1">
                          <span>Hint: {badge.rewardHint}</span>
                          <span className="font-bold text-[#2b0c15]">{badge.currentProgress || 0} / {badge.targetProgress}</span>
                        </div>
                        <div className="w-full bg-[#ebd4d9] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#800020] h-full rounded-full"
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
        <div className="px-6 py-4 bg-[#fff8fa] border-t border-[#ebd4d9] flex items-center justify-between text-xs text-[#76515b]">
          <span>Keep learning every day, Mahi! 🎓</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white font-bold transition-colors shadow-2xs"
          >
            Close Cabinet
          </button>
        </div>

      </div>
    </div>
  );
};
