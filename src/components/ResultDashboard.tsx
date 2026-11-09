import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import type { 
  QuizAttempt, 
  DailyQuiz 
} from '../types/quiz';
import { 
  getWhatsAppShareUrl, 
  shareResultNative, 
  copyToClipboard, 
  DEFAULT_SANJU_WHATSAPP_NUMBER
} from '../utils/whatsapp';
import { getUserSettings } from '../utils/storage';
import { playCompletionChime } from '../utils/sound';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  FileText, 
  Home, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  HelpCircle, 
  Percent, 
  Heart,
  MapPin
} from 'lucide-react';

interface ResultDashboardProps {
  attempt: QuizAttempt;
  quiz?: DailyQuiz;
  onReviewAnswers: () => void;
  onReattempt: () => void;
  onGoHome: () => void;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  attempt,
  onReviewAnswers,
  onReattempt,
  onGoHome,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const settings = getUserSettings();
  const whatsappNumber = settings.sanjuWhatsAppNumber || DEFAULT_SANJU_WHATSAPP_NUMBER;

  // Trigger celebration confetti & audio chime on mount
  useEffect(() => {
    try {
      playCompletionChime();
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#10b981', '#059669', '#34d399', '#f59e0b', '#fbbf24']
      });
    } catch {
      // ignore
    }
  }, []);

  const handleCopyResult = async () => {
    const res = await copyToClipboard(
      `🌿 BODDUKURI'S QUIZ\n\n🎉 #Mahi – Day ${attempt.dayNumber < 10 ? '0' + attempt.dayNumber : attempt.dayNumber} Completed!\n\n📚 States Covered:\n${attempt.statesCovered.join(', ')}.\n\n📊 Result:\nMarks: ${attempt.marksObtained}/${attempt.maxMarks}\nCorrect: ${attempt.correctCount}\nIncorrect: ${attempt.incorrectCount}\nPercentage: ${attempt.percentage}%\n\n🏆 Performance: ${attempt.performanceMessage}\n\n"Every day you learn something new, you become a better version of yourself."\n\nKeep learning, Mahi! 💚`
    );
    if (res.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    await shareResultNative(attempt);
  };

  // Format time (mm:ss)
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs}s`;
  };

  // Circular gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (attempt.percentage / 100) * circumference;

  const dayStr = attempt.dayNumber < 10 ? `0${attempt.dayNumber}` : `${attempt.dayNumber}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-fadeIn">
      
      {/* Celebration Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-forest-950 text-white p-6 sm:p-10 shadow-elevated text-center">
        {/* Subtle glow background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-teal-400/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs sm:text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Boddukuri's Quiz #Mahi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            🎉 #Mahi – Day {dayStr} Completed!
          </h1>

          <div className="text-emerald-200 text-xs sm:text-sm font-medium pt-1">
            <span className="text-emerald-300 font-bold block mb-1">📚 States Covered ({attempt.statesCovered.length}):</span>
            <span className="text-white font-semibold">{attempt.statesCovered.join(', ')}</span>
          </div>

          {/* Performance Badge */}
          <div className="pt-2">
            <span className="inline-block px-5 py-2 rounded-2xl bg-white text-emerald-950 font-black text-lg sm:text-xl shadow-lg border border-emerald-100">
              🏆 Performance: {attempt.performanceMessage}
            </span>
          </div>
        </div>
      </div>

      {/* Main Score Visualization & Key Metrics */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Circular Progress Gauge (Left) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#E2E8F0"
                  strokeWidth="14"
                  fill="transparent"
                />
                {/* Colored Progress Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#emeraldGradient)"
                  strokeWidth="14"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inside Gauge Text */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-slate-900 tracking-tight">
                  {attempt.percentage}%
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Accuracy
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="text-xl font-black text-emerald-800">
                Marks: {attempt.marksObtained} / {attempt.maxMarks}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">1 mark per correct answer</p>
            </div>
          </div>

          {/* Key Stat Blocks (Right) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            {/* Total Questions */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                Total Questions
              </div>
              <div className="text-2xl font-black text-slate-900">
                {attempt.totalQuestions}
              </div>
            </div>

            {/* Correct Answers */}
            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Correct
              </div>
              <div className="text-2xl font-black text-emerald-700">
                {attempt.correctCount}
              </div>
            </div>

            {/* Incorrect Answers */}
            <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-100">
              <div className="flex items-center gap-1.5 text-xs text-rose-800 font-semibold mb-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                Incorrect
              </div>
              <div className="text-2xl font-black text-rose-700">
                {attempt.incorrectCount}
              </div>
            </div>

            {/* Unanswered */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                Unanswered
              </div>
              <div className="text-2xl font-black text-slate-600">
                {attempt.unansweredCount}
              </div>
            </div>

            {/* Accuracy */}
            <div className="bg-teal-50/80 p-4 rounded-2xl border border-teal-100">
              <div className="flex items-center gap-1.5 text-xs text-teal-800 font-semibold mb-1">
                <Percent className="w-3.5 h-3.5 text-teal-600" />
                Hit Accuracy
              </div>
              <div className="text-2xl font-black text-teal-800">
                {attempt.accuracy}%
              </div>
            </div>

            {/* Time Taken */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Time Taken
              </div>
              <div className="text-2xl font-black text-slate-800">
                {formatTime(attempt.timeTakenSeconds)}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* State-by-State Cumulative Recall Breakdown */}
      {attempt.stateBreakdown && attempt.stateBreakdown.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                State-by-State Performance ({attempt.statesCovered.length} States)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Cumulative Pool Split</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {attempt.stateBreakdown.map((sb, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{sb.stateName}</span>
                  <span className="font-black text-emerald-800 text-xs">
                    {sb.correct}/{sb.total}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${sb.percentage}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 text-right">{sb.percentage}% Accuracy</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Quote & Personal Message for Mahi */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 sm:p-8 shadow-elevated space-y-4">
        <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Heart className="w-4 h-4 fill-emerald-300" />
          <span>Daily Motivation for Mahi</span>
        </div>

        <blockquote className="text-lg sm:text-2xl font-extrabold italic text-white leading-relaxed">
          "Every day you learn something new, you become a better version of yourself."
        </blockquote>

        <div className="pt-2 border-t border-emerald-700/60 flex items-start gap-3">
          <div className="text-2xl">🌱</div>
          <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed">
            Keep learning, Mahi! 💚 Every single state you practice becomes a permanent pillar of your knowledge!
          </p>
        </div>
      </div>

      {/* WHATSAPP RESULT SHARING SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-card space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>🌿</span>
            <span>Share My Result on WhatsApp</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Send your formatted quiz score report directly to Sanju on WhatsApp or copy it to your clipboard!
          </p>
        </div>

        {/* WhatsApp & Share Buttons Grid */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          
          {/* Main WhatsApp Share Button */}
          <a
            href={getWhatsAppShareUrl(attempt, whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-6 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-3 text-center"
          >
            {/* WhatsApp SVG Icon */}
            <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>Share My Result on WhatsApp</span>
          </a>

          {/* Native Web Share Button */}
          <button
            onClick={handleNativeShare}
            className="px-5 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4 text-slate-600" />
            <span>Share</span>
          </button>

          {/* Copy Result Button */}
          <button
            onClick={handleCopyResult}
            className={`px-5 py-4 rounded-2xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" />
                <span>Copy Result</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* Navigation & Action Options */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
        <button
          onClick={onReviewAnswers}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm sm:text-base shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <FileText className="w-5 h-5 text-emerald-300" />
          <span>Review Answer Sheet & Explanations</span>
        </button>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <button
            onClick={onReattempt}
            className="flex-1 sm:flex-none px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span>Reattempt Quiz</span>
          </button>

          <button
            onClick={onGoHome}
            className="flex-1 sm:flex-none px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-slate-600" />
            <span>Home</span>
          </button>
        </div>
      </div>

    </div>
  );
};
