import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, ArrowRight, FastForward, Heart } from 'lucide-react';

interface OpeningMotivationProps {
  onComplete: () => void;
}

export const OpeningMotivation: React.FC<OpeningMotivationProps> = ({ onComplete }) => {
  // Check prefers-reduced-motion media query
  const prefersReducedMotion = useMemo(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);

  // Diverse motivational pools cycling around core theme
  const phrasePools = useMemo(() => [
    [
      { text: 'Boddukuri Mahima…', highlight: true, delay: 1100 },
      { text: 'Wake up.', delay: 900 },
      { text: 'Keep learning.', delay: 900 },
      { text: 'Believe in yourself.', highlight: true, delay: 1000 },
      { text: 'Show your progress through your actions.', highlight: true, delay: 1400 },
      { text: 'Every quiz brings you closer to mastery.', delay: 1100 }
    ],
    [
      { text: 'Boddukuri Mahima…', highlight: true, delay: 1100 },
      { text: 'A new day of opportunity is here.', delay: 1000 },
      { text: 'Wake up and focus your energy.', delay: 900 },
      { text: 'Learn with complete confidence.', highlight: true, delay: 1100 },
      { text: 'Prove them right who believe in you.', delay: 1000 },
      { text: 'Show your greatness through your actions.', highlight: true, delay: 1400 }
    ],
    [
      { text: 'Boddukuri Mahima…', highlight: true, delay: 1100 },
      { text: 'Wake up and stay determined.', delay: 900 },
      { text: 'Consistent revision builds champions.', delay: 1000 },
      { text: 'Believe in your preparation.', highlight: true, delay: 1000 },
      { text: 'Let your scores and progress speak for you.', highlight: true, delay: 1400 }
    ]
  ], []);

  // Pick one variant per session based on timestamp or random index
  const lines = useMemo(() => {
    const idx = Math.floor(Date.now() / 3600000) % phrasePools.length;
    return phrasePools[idx];
  }, [phrasePools]);

  const [currentLineIndex, setCurrentLineIndex] = useState(() => prefersReducedMotion ? lines.length : 0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (currentLineIndex < lines.length) {
      const timer = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
      }, lines[currentLineIndex].delay);
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, lines, prefersReducedMotion]);

  const isFinished = currentLineIndex >= lines.length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-br from-[#041a0f] via-[#062e1b] to-[#03150c] text-white select-none overflow-hidden animate-fadeIn">
      {/* Background glowing botanical botanics */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

      {/* Top Bar with Skip Button */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          <span>Boddukuri's Quiz #Mahi</span>
        </div>

        <button
          onClick={onComplete}
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs text-emerald-100 font-bold transition-all flex items-center gap-1.5 border border-white/15"
          title="Skip to learning portal"
        >
          <span>Skip</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Motivational Message */}
      <div className="relative z-10 max-w-xl mx-auto my-auto w-full space-y-4 py-8">
        <div className="space-y-3.5">
          {lines.map((item, idx) => {
            const isVisible = idx <= currentLineIndex || prefersReducedMotion;
            const isCurrent = idx === currentLineIndex;

            if (!isVisible) return null;

            return (
              <div
                key={idx}
                className={`transition-all duration-700 transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                } ${
                  item.highlight
                    ? 'text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 tracking-tight'
                    : 'text-lg sm:text-2xl font-bold text-emerald-100/90'
                } ${isCurrent ? 'scale-101' : ''}`}
              >
                {item.text}
              </div>
            );
          })}
        </div>

        {isFinished && (
          <div className="pt-6 animate-scaleUp">
            <div className="p-4 rounded-2xl bg-white/10 border border-emerald-500/30 backdrop-blur-md mb-6">
              <p className="text-xs sm:text-sm text-emerald-200 font-medium leading-relaxed flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400 shrink-0" />
                <span>Every single day of learning is a step toward your highest achievement.</span>
              </p>
            </div>

            <button
              onClick={onComplete}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-base shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2.5 mx-auto"
            >
              <span>Enter Learning Portal</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Progress Bar */}
      <div className="relative z-10 w-full max-w-xl mx-auto">
        <div className="flex items-center justify-between text-[11px] text-emerald-300/70 font-semibold mb-1.5">
          <span>Daily Awakening Motivation</span>
          <span>{Math.min(100, Math.round(((currentLineIndex + 1) / lines.length) * 100))}%</span>
        </div>
        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
          <div
            className="bg-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.round(((currentLineIndex + 1) / lines.length) * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
