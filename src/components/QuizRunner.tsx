import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { 
  DailyQuiz, 
  QuizAttempt, 
  QuizQuestion, 
  SectionScore 
} from '../types/quiz';
import { 
  getInProgressQuiz, 
  saveInProgressQuiz, 
  saveQuizAttempt 
} from '../utils/storage';
import { getPerformanceTier } from '../data/quotes';
import { playOptionClickSound } from '../utils/sound';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Flag, 
  CheckCircle2, 
  AlertCircle, 
  Grid, 
  LogOut, 
  Send
} from 'lucide-react';

interface QuizRunnerProps {
  quiz: DailyQuiz;
  onFinishQuiz: (attempt: QuizAttempt) => void;
  onExit: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  quiz,
  onFinishQuiz,
  onExit,
}) => {
  // Load initial in-progress state if existing
  const savedState = useMemo(() => getInProgressQuiz(quiz.id), [quiz.id]);

  const [currentIndex, setCurrentIndex] = useState<number>(savedState ? savedState.currentQuestionIndex : 0);
  const [answers, setAnswers] = useState<Record<string, number>>(savedState ? savedState.answers : {});
  const [flaggedIds, setFlaggedIds] = useState<string[]>(savedState ? savedState.flaggedQuestionIds : []);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(savedState ? savedState.timeElapsedSeconds : 0);
  const [showPaletteModal, setShowPaletteModal] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  const questions: QuizQuestion[] = quiz.questions;
  const currentQuestion = questions[currentIndex];

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Autosave in-progress state whenever answers or index change
  useEffect(() => {
    saveInProgressQuiz({
      quizId: quiz.id,
      dayNumber: quiz.dayNumber,
      currentQuestionIndex: currentIndex,
      answers,
      flaggedQuestionIds: flaggedIds,
      timeElapsedSeconds: secondsElapsed,
      lastUpdated: new Date().toISOString()
    });
  }, [quiz.id, quiz.dayNumber, currentIndex, answers, flaggedIds, secondsElapsed]);

  // Handle option select
  const handleSelectOption = (optionIndex: number) => {
    playOptionClickSound();
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  // Toggle flag for review
  const handleToggleFlag = () => {
    setFlaggedIds(prev => 
      prev.includes(currentQuestion.id)
        ? prev.filter(id => id !== currentQuestion.id)
        : [...prev, currentQuestion.id]
    );
  };

  // Navigation handlers
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  // Jump directly to question
  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    setShowPaletteModal(false);
  };

  // Count progress
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = flaggedIds.length;

  // Format time (mm:ss)
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Submission handler with accurate score evaluation
  const handleSubmitQuiz = useCallback(() => {
    let correctCount = 0;
    let incorrectCount = 0;
    let unanswered = 0;

    // Section counters
    let prevTotal = 0;
    let prevCorrect = 0;
    let prevIncorrect = 0;
    let prevUnanswered = 0;

    let newTotal = 0;
    let newCorrect = 0;
    let newIncorrect = 0;
    let newUnanswered = 0;

    questions.forEach(q => {
      const selected = answers[q.id];
      const isAnswered = selected !== undefined && selected !== -1;
      const isCorrect = isAnswered && selected === q.correctAnswer;

      if (q.section === 'previous') {
        prevTotal++;
        if (!isAnswered) {
          prevUnanswered++;
        } else if (isCorrect) {
          prevCorrect++;
        } else {
          prevIncorrect++;
        }
      } else {
        newTotal++;
        if (!isAnswered) {
          newUnanswered++;
        } else if (isCorrect) {
          newCorrect++;
        } else {
          newIncorrect++;
        }
      }

      if (!isAnswered) {
        unanswered++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const marksObtained = correctCount; // 1 mark per correct question
    const maxMarks = questions.length;
    const percentage = Math.round((marksObtained / maxMarks) * 100);
    const accuracy = (answeredCount > 0) ? Math.round((correctCount / answeredCount) * 100) : 0;

    const prevSectionScore: SectionScore = {
      total: prevTotal,
      correct: prevCorrect,
      incorrect: prevIncorrect,
      unanswered: prevUnanswered,
      percentage: prevTotal > 0 ? Math.round((prevCorrect / prevTotal) * 100) : 0
    };

    const newSectionScore: SectionScore = {
      total: newTotal,
      correct: newCorrect,
      incorrect: newIncorrect,
      unanswered: newUnanswered,
      percentage: newTotal > 0 ? Math.round((newCorrect / newTotal) * 100) : 0
    };

    // State-wise breakdown calculation
    const stateCounts: Record<string, { total: number; correct: number }> = {};
    quiz.statesCovered.forEach(st => {
      stateCounts[st] = { total: 0, correct: 0 };
    });

    questions.forEach(q => {
      if (!stateCounts[q.state]) {
        stateCounts[q.state] = { total: 0, correct: 0 };
      }
      stateCounts[q.state].total++;
      const selected = answers[q.id];
      if (selected !== undefined && selected === q.correctAnswer) {
        stateCounts[q.state].correct++;
      }
    });

    const stateBreakdown = Object.entries(stateCounts).map(([stateName, val]) => ({
      stateName,
      total: val.total,
      correct: val.correct,
      percentage: val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0
    }));

    const performance = getPerformanceTier(percentage);

    const attempt: QuizAttempt = {
      id: `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      quizId: quiz.id,
      dayNumber: quiz.dayNumber,
      statesCovered: quiz.statesCovered,
      timestamp: new Date().toISOString(),
      formattedDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      answers,
      totalQuestions: questions.length,
      correctCount,
      incorrectCount,
      unansweredCount: unanswered,
      marksObtained,
      maxMarks,
      percentage,
      accuracy,
      timeTakenSeconds: secondsElapsed,
      sectionBreakdown: {
        previous: prevSectionScore,
        new: newSectionScore
      },
      stateBreakdown,
      performanceTier: performance.tier,
      performanceMessage: performance.title,
      quote: {
        quote: "Every day you learn something new, you become a better version of yourself.",
        author: "Boddukuri's Daily Creed",
        personalNote: "Keep learning, Mahi! 💚"
      }
    };

    // Save attempt to storage & clear in-progress
    saveQuizAttempt(attempt);

    // Transition to Result page
    onFinishQuiz(attempt);
  }, [answers, onFinishQuiz, questions, quiz, secondsElapsed, answeredCount]);

  // Keyboard navigation shortcuts: numbers 1-4 for options, arrows for prev/next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSubmitModal || showPaletteModal) return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        handleSelectOption(optIdx);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, showSubmitModal, showPaletteModal, questions.length]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Top Bar: Navigation, Day info, Live Timer, Palette & Quit */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-soft flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Day & State */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Save and return to dashboard? You can resume anytime!')) {
                onExit();
              }
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Save & Return to Dashboard"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-xs font-black bg-slate-900 text-white">
                {quiz.title}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Boddukuri's Quiz #Mahi
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              {quiz.statesCovered.length} States Cumulative Pool ({quiz.totalQuestions} Questions)
            </p>
          </div>
        </div>

        {/* Right: Live Timer & Palette Button */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs sm:text-sm font-mono font-bold">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          {/* Palette button */}
          <button
            onClick={() => setShowPaletteModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-semibold hover:bg-emerald-100 transition-colors"
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">Palette</span>
            <span className="font-bold text-emerald-700">({answeredCount}/{questions.length})</span>
          </button>
        </div>

      </div>

      {/* Progress Bar & Section Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span className="text-emerald-700 font-bold">
            {Math.round(((currentIndex + 1) / questions.length) * 100)}% Through
          </span>
        </div>
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Section Indicator Pill */}
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold border shadow-xs transition-colors">
          {currentQuestion.section === 'previous' ? (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-lg">
              Revision State: {currentQuestion.state}
            </span>
          ) : (
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-lg">
              {quiz.dayNumber === 1 ? `State: ${currentQuestion.state}` : `New State: ${currentQuestion.state}`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Difficulty pill */}
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
            currentQuestion.difficulty === 'easy' 
              ? 'bg-green-100 text-green-800' 
              : currentQuestion.difficulty === 'medium'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-purple-100 text-purple-800'
          }`}>
            {currentQuestion.difficulty}
          </span>

          {/* National Park tag */}
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">
            📍 {currentQuestion.parkName}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
        
        {/* Question Text */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Question #{currentIndex + 1}
          </div>
          <h3 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
            {currentQuestion.question}
          </h3>
        </div>

        {/* 4 Options Grid */}
        <div className="space-y-3 pt-2">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = answers[currentQuestion.id] === idx;
            const letters = ['A', 'B', 'C', 'D'];

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start sm:items-center gap-3.5 group cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-200 text-slate-900'
                    : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50/70 text-slate-800'
                }`}
              >
                {/* Option Letter Circle */}
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                }`}>
                  {letters[idx]}
                </span>

                {/* Option Text */}
                <span className={`text-sm sm:text-base font-semibold leading-relaxed flex-1 ${
                  isSelected ? 'text-emerald-950 font-bold' : 'text-slate-800'
                }`}>
                  {option}
                </span>

                {/* Checkmark indicator */}
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-auto" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom helper tip */}
        <div className="pt-2 text-xs text-slate-400 flex items-center justify-between">
          <span>Tip: You can use keys 1-4 on your keyboard to select options</span>
          <button
            onClick={handleToggleFlag}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              flaggedIds.includes(currentQuestion.id)
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${flaggedIds.includes(currentQuestion.id) ? 'fill-amber-600 text-amber-600' : ''}`} />
            {flaggedIds.includes(currentQuestion.id) ? 'Flagged for Review' : 'Mark for Review'}
          </button>
        </div>

      </div>

      {/* Bottom Navigation Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {/* Submit button always accessible */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-3 rounded-2xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all shadow-sm flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Submit Quiz</span>
            <span className="sm:hidden">Submit</span>
          </button>

          {/* Next Button */}
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-2xl font-bold text-sm bg-emerald-700 text-white hover:bg-emerald-800 active:scale-95 transition-all shadow-md flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-3 rounded-2xl font-bold text-sm bg-emerald-700 text-white hover:bg-emerald-800 active:scale-95 transition-all shadow-md flex items-center gap-2"
            >
              Finish & Review
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Question Palette Modal */}
      {showPaletteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Question Palette</h3>
                <p className="text-xs text-slate-500">Jump directly to any question</p>
              </div>
              <button
                onClick={() => setShowPaletteModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 bg-slate-50 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-md bg-emerald-600" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-md bg-slate-200 border border-slate-300" />
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-md bg-amber-400" />
                <span>Flagged ({flaggedCount})</span>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-5 gap-2.5">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = currentIndex === idx;
                const isFlagged = flaggedIds.includes(q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`relative h-12 rounded-xl text-sm font-bold transition-all flex items-center justify-center ${
                      isCurrent
                        ? 'ring-4 ring-emerald-400/50 scale-105 z-10'
                        : ''
                    } ${
                      isFlagged
                        ? 'bg-amber-100 text-amber-900 border-2 border-amber-400'
                        : isAnswered
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setShowPaletteModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close Palette
              </button>
              <button
                onClick={() => {
                  setShowPaletteModal(false);
                  setShowSubmitModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow-sm"
              >
                Proceed to Submit
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Send className="w-6 h-6 text-emerald-700" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">
                Ready to Submit Quiz?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Your answers will be evaluated and the full answer sheet with explanations will be revealed.
              </p>
            </div>

            {/* Summary statistics */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs">
              <div>
                <div className="text-slate-400 font-medium">Answered</div>
                <div className="text-lg font-black text-emerald-700">{answeredCount}</div>
              </div>
              <div>
                <div className="text-slate-400 font-medium">Unanswered</div>
                <div className="text-lg font-black text-rose-600">{unansweredCount}</div>
              </div>
              <div>
                <div className="text-slate-400 font-medium">Flagged</div>
                <div className="text-lg font-black text-amber-600">{flaggedCount}</div>
              </div>
            </div>

            {/* Warning if unanswered */}
            {unansweredCount > 0 && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>
                  You have <strong>{unansweredCount} unanswered questions</strong>. You can go back and answer them, or submit now.
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Go Back & Review
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleSubmitQuiz();
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
              >
                Confirm & Submit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
