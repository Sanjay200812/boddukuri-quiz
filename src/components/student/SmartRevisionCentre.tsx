import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Brain,
  ArrowLeft
} from 'lucide-react';
import type { SmartRevisionItem } from '../../types/quiz';
import {
  getSmartRevisionList,
  recordRevisionReview
} from '../../utils/storage';

interface SmartRevisionCentreProps {
  studentId: string;
  studentName?: string;
  onNavigateToQuiz?: (quizId: string) => void;
  onGoBack?: () => void;
  onStartQuiz?: (quizId: string) => void;
}

export const SmartRevisionCentre: React.FC<SmartRevisionCentreProps> = ({
  studentId,
  studentName = 'Scholar',
  onNavigateToQuiz: _onNavigateToQuiz,
  onGoBack,
  onStartQuiz: _onStartQuiz
}) => {
  const [activeTab, setActiveTab] = useState<'due' | 'upcoming' | 'mastered' | 'session'>('due');
  const [sessionIndex, setSessionIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [_sessionResults, setSessionResults] = useState<{ reviewed: number; correct: number }>({ reviewed: 0, correct: 0 });

  const { dueToday, upcoming, mastered } = getSmartRevisionList(studentId);

  // Active review session
  const currentSessionItem: SmartRevisionItem | undefined = dueToday[sessionIndex];

  const handleReviewAnswer = (wasSuccessful: boolean) => {
    if (!currentSessionItem) return;
    recordRevisionReview(studentId, currentSessionItem.questionId, wasSuccessful);

    setSessionResults(prev => ({
      reviewed: prev.reviewed + 1,
      correct: prev.correct + (wasSuccessful ? 1 : 0)
    }));

    setIsAnswerRevealed(false);
    if (sessionIndex + 1 < dueToday.length) {
      setSessionIndex(prev => prev + 1);
    } else {
      setActiveTab('due');
      setSessionIndex(0);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 pb-16">
      {onGoBack && (
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#800020] hover:bg-slate-100 transition active:scale-95 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#800020] px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
            Spaced Repetition Scheduler
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Brain className="w-6 h-6 text-[#1e3a5f]" />
            <span>Smart Revision Centre</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Scientifically spaced review intervals (1d $\to$ 3d $\to$ 7d $\to$ 14d $\to$ 30d) for {studentName}.
          </p>
        </div>

        {dueToday.length > 0 && activeTab !== 'session' && (
          <button
            onClick={() => {
              setActiveTab('session');
              setSessionIndex(0);
              setIsAnswerRevealed(false);
            }}
            className="px-5 py-3 min-h-[44px] rounded-xl bg-[#1e3a5f] hover:bg-[#102a43] text-white text-xs sm:text-sm font-bold transition-all shadow-soft flex items-center gap-2 cursor-pointer border border-[#1e3a5f]/30"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>Start Due Revision Session ({dueToday.length}) →</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('due')}
          className={`px-4 py-2 min-h-[44px] rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'due'
              ? 'bg-[#1e3a5f] text-white shadow-soft'
              : 'text-slate-500 hover:text-slate-900 bg-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Due Today ({dueToday.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 min-h-[44px] rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'bg-[#1e3a5f] text-white shadow-soft'
              : 'text-slate-500 hover:text-slate-900 bg-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Upcoming Schedule ({upcoming.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mastered')}
          className={`px-4 py-2 min-h-[44px] rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'mastered'
              ? 'bg-emerald-900 text-emerald-100 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 bg-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Mastered ({mastered.length})</span>
        </button>
      </div>

      {/* VIEW: INTERACTIVE REVISION SESSION */}
      {activeTab === 'session' && currentSessionItem && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#180510] to-[#0e0209] border border-slate-200 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs font-extrabold text-[#800020]">
              Question {sessionIndex + 1} of {dueToday.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-amber-300 border border-amber-800/40">
              Level {currentSessionItem.repetitionLevel} (Interval: {currentSessionItem.intervalDays}d)
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-300">
              {currentSessionItem.topicId} • {currentSessionItem.quizId}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentSessionItem.question.question}
            </h3>
          </div>

          {/* Options Display */}
          <div className="space-y-2">
            {currentSessionItem.question.options.map((opt, idx) => {
              const isCorrect = idx === currentSessionItem.question.correctAnswer;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-center gap-3 ${
                    isAnswerRevealed && isCorrect
                      ? 'bg-emerald-950/80 border-emerald-600 text-emerald-100 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
              );
            })}
          </div>

          {/* Reveal / Feedback Controls */}
          {!isAnswerRevealed ? (
            <button
              onClick={() => setIsAnswerRevealed(true)}
              className="w-full py-3 min-h-[44px] rounded-xl bg-[#1e3a5f] hover:bg-[#102a43] text-white text-xs sm:text-sm font-bold transition-all shadow-soft cursor-pointer border border-[#1e3a5f]/30"
            >
              Reveal Correct Answer & Explanation
            </button>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="font-extrabold text-emerald-400">
                  Correct Answer: Option {String.fromCharCode(65 + currentSessionItem.question.correctAnswer)}
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {currentSessionItem.question.explanation}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleReviewAnswer(false)}
                  className="py-3 px-4 min-h-[44px] rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Didn't Know (Reset to 1d)</span>
                </button>

                <button
                  onClick={() => handleReviewAnswer(true)}
                  className="py-3 px-4 min-h-[44px] rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Knew It (Advance Level)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW: DUE TODAY LIST */}
      {activeTab === 'due' && (
        <div className="space-y-3">
          {dueToday.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-200 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-950/60 border border-emerald-700/50 flex items-center justify-center text-emerald-300">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No questions due today!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You're completely up to date with your spaced repetition schedule. Check the upcoming tab to see future dates.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dueToday.map(item => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#1e3a5f]/30 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 text-[#800020] border border-slate-200">
                        {item.topicId}
                      </span>
                      <span className="text-[11px] font-bold text-rose-400">
                        Due: Today
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {item.question.question}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#200814] text-xs">
                    <span className="text-slate-500">
                      Streak: <strong className="text-slate-900">{item.successStreak}x</strong>
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab('session');
                        setSessionIndex(dueToday.findIndex(i => i.id === item.id));
                        setIsAnswerRevealed(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#800020] hover:text-slate-900 font-bold transition-all cursor-pointer border border-slate-200"
                    >
                      Review Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: UPCOMING SCHEDULE */}
      {activeTab === 'upcoming' && (
        <div className="space-y-3">
          {upcoming.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl bg-white border border-slate-200 text-xs text-slate-500">
              No upcoming scheduled revisions. Complete more practice quizzes to automatically populate your smart review queue.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                      {item.topicId}
                    </span>
                    <span className="text-slate-500">
                      Due: <strong className="text-amber-300">{item.nextDueDate}</strong> ({item.intervalDays}d interval)
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                    {item.question.question}
                  </h4>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: MASTERED LIST */}
      {activeTab === 'mastered' && (
        <div className="space-y-3">
          {mastered.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl bg-white border border-slate-200 text-xs text-slate-500">
              No mastered questions yet. Successfully review due questions across all spaced intervals to permanently master concepts.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mastered.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-900/40 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300">
                      {item.topicId}
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Permanently Mastered</span>
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                    {item.question.question}
                  </h4>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
