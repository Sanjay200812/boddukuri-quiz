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
  saveQuizAttempt,
  isBookmarked,
  toggleBookmark
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
  Send,
  Bookmark,
  Hourglass
} from 'lucide-react';

interface QuizRunnerProps {
  quiz: DailyQuiz;
  onFinishQuiz: (attempt: QuizAttempt) => void;
  onExit: () => void;
}

const QUESTION_LIMIT_SECONDS = 60;

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

  // 60-Second Per-Question Timer (mobile-friendly with refresh preservation)
  const [questionSecondsLeft, setQuestionSecondsLeft] = useState<number>(() => {
    if (savedState?.questionExpiresAt && savedState.currentQuestionIndex === (savedState.currentQuestionIndex || 0)) {
      const remaining = Math.max(1, Math.ceil((savedState.questionExpiresAt - Date.now()) / 1000));
      if (remaining > 0 && remaining <= QUESTION_LIMIT_SECONDS) {
        return remaining;
      }
    }
    return savedState?.questionSecondsLeft && savedState.questionSecondsLeft > 0
      ? savedState.questionSecondsLeft
      : QUESTION_LIMIT_SECONDS;
  });

  const [questionExpiresAt, setQuestionExpiresAt] = useState<number>(() => {
    if (savedState?.questionExpiresAt && savedState.questionExpiresAt > Date.now()) {
      return savedState.questionExpiresAt;
    }
    return Date.now() + QUESTION_LIMIT_SECONDS * 1000;
  });

  const questions: QuizQuestion[] = quiz.questions;
  const currentQuestion = questions[currentIndex];

  const [bookmarked, setBookmarked] = useState<boolean>(() => isBookmarked(currentQuestion.id));

  useEffect(() => {
    setBookmarked(isBookmarked(currentQuestion.id));
  }, [currentQuestion.id]);

  const handleToggleBookmark = () => {
    const nextState = toggleBookmark(currentQuestion.id);
    setBookmarked(nextState);
  };

  // Live timer tick for total time & 60s per-question timer with auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);

      setQuestionSecondsLeft(prev => {
        if (prev <= 1) {
          // Timer hit 0s -> auto advance to next question
          if (currentIndex < questions.length - 1) {
            setCurrentIndex(curr => curr + 1);
            setQuestionExpiresAt(Date.now() + QUESTION_LIMIT_SECONDS * 1000);
            return QUESTION_LIMIT_SECONDS;
          } else {
            // Reached end of quiz
            setShowSubmitModal(true);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, questions.length]);

  // Autosave in-progress state whenever answers, index or timers change
  useEffect(() => {
    saveInProgressQuiz({
      quizId: quiz.id,
      dayNumber: quiz.dayNumber,
      currentQuestionIndex: currentIndex,
      answers,
      flaggedQuestionIds: flaggedIds,
      timeElapsedSeconds: secondsElapsed,
      questionExpiresAt,
      questionSecondsLeft,
      lastUpdated: new Date().toISOString()
    });
  }, [quiz.id, quiz.dayNumber, currentIndex, answers, flaggedIds, secondsElapsed, questionExpiresAt, questionSecondsLeft]);

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

  // Navigation handlers (resets per-question timer to 60s)
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setQuestionSecondsLeft(QUESTION_LIMIT_SECONDS);
      setQuestionExpiresAt(Date.now() + QUESTION_LIMIT_SECONDS * 1000);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setQuestionSecondsLeft(QUESTION_LIMIT_SECONDS);
      setQuestionExpiresAt(Date.now() + QUESTION_LIMIT_SECONDS * 1000);
    } else {
      setShowSubmitModal(true);
    }
  };

  // Jump directly to question
  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    setQuestionSecondsLeft(QUESTION_LIMIT_SECONDS);
    setQuestionExpiresAt(Date.now() + QUESTION_LIMIT_SECONDS * 1000);
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
      submissionId: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studentId: 'mahi_student',
      studentName: 'Mahi',
      studentEmail: 'mahi@boddukuri.quiz',
      status: 'completed',
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
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#ebd4d9] shadow-soft flex flex-wrap items-center justify-between gap-4">

        {/* Left: Day & State */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Save and return to dashboard? You can resume anytime!')) {
                onExit();
              }
            }}
            className="p-2 rounded-xl text-[#76515b] hover:text-[#2b0c15] hover:bg-[#fff8fa] transition-colors"
            title="Save & Return to Dashboard"
          >
            <LogOut className="w-5 h-5 text-[#800020]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-xs font-black bg-[#800020] text-white">
                {quiz.title}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#2b0c15]">
                Boddukuri's Quiz #Mahi
              </h2>
            </div>
            <p className="text-xs text-[#76515b]">
              {quiz.statesCovered.length} States Pool • {quiz.displayDate || '09 November 2026'} ({quiz.totalQuestions} Questions)
            </p>
          </div>
        </div>

        {/* Right: Live Timer & Palette Button */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fff8fa] border border-[#ebd4d9] text-[#2b0c15] text-xs sm:text-sm font-mono font-bold">
            <Clock className="w-4 h-4 text-[#800020]" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          {/* Palette button */}
          <button
            onClick={() => setShowPaletteModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fde8ec] text-[#800020] border border-[#ebd4d9] text-xs sm:text-sm font-semibold hover:bg-[#fbd0d9] transition-colors"
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">Palette</span>
            <span className="font-bold text-[#800020]">({answeredCount}/{questions.length})</span>
          </button>
        </div>

      </div>

      {/* Progress Bar & Section Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#76515b] px-1">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span className="text-[#800020] font-bold">
            {Math.round(((currentIndex + 1) / questions.length) * 100)}% Through
          </span>
        </div>
        <div className="w-full bg-[#fde8ec] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#800020] to-[#b91c3c] h-full rounded-full transition-all duration-300 ease-out"
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
            <span className="bg-red-100 text-red-950 border border-red-400 px-2 py-0.5 rounded-lg">
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebd4d9] shadow-soft space-y-6 relative overflow-hidden">

        {/* 60-Second Mini Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#fde8ec]">
          <div
            className={`h-full transition-all duration-1000 ${
              questionSecondsLeft <= 10
                ? 'bg-rose-500 animate-pulse'
                : questionSecondsLeft <= 20
                ? 'bg-amber-400'
                : 'bg-[#800020]'
            }`}
            style={{ width: `${(questionSecondsLeft / QUESTION_LIMIT_SECONDS) * 100}%` }}
          />
        </div>

        {/* Question Header & 60-Second Timer Badge */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="text-xs font-bold uppercase tracking-wider text-[#800020]">
            Question #{currentIndex + 1}
          </div>

          {/* 60s Countdown Timer Badge */}
          <div
            title="60 seconds limit per question. Advances automatically at 0s."
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border transition-all ${
              questionSecondsLeft <= 10
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                : questionSecondsLeft <= 20
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-[#fde8ec] text-[#800020] border-[#ebd4d9]'
            }`}
          >
            <Hourglass className={`w-3.5 h-3.5 ${questionSecondsLeft <= 10 ? 'text-rose-600 animate-spin' : 'text-[#800020]'}`} />
            <span>{questionSecondsLeft}s Left</span>
          </div>
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-2xl font-bold text-[#2b0c15] leading-snug">
          {currentQuestion.question}
        </h3>

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
                    ? 'border-[#800020] bg-[#fde8ec] shadow-md ring-2 ring-[#800020]/20 text-[#2b0c15]'
                    : 'border-[#ebd4d9] bg-white hover:border-[#800020]/50 hover:bg-[#fff8fa] text-[#2b0c15]'
                }`}
              >
                {/* Option Letter Circle */}
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-[#800020] text-white'
                    : 'bg-[#fff8fa] text-[#76515b] border border-[#ebd4d9] group-hover:bg-[#fde8ec] group-hover:text-[#800020]'
                }`}>
                  {letters[idx]}
                </span>

                {/* Option Text */}
                <span className={`text-sm sm:text-base font-semibold leading-relaxed flex-1 ${
                  isSelected ? 'text-[#800020] font-bold' : 'text-[#2b0c15]'
                }`}>
                  {option}
                </span>

                {/* Checkmark indicator */}
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-[#800020] shrink-0 ml-auto" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom helper tip, Bookmark & Flag */}
        <div className="pt-2 text-xs text-[#76515b] flex flex-wrap items-center justify-between gap-2 border-t border-[#ebd4d9]">
          <span className="hidden sm:inline">Tip: You can use keys 1-4 on your keyboard</span>
          <div className="flex items-center gap-2 ml-auto">
            {/* Bookmark button */}
            <button
              type="button"
              onClick={handleToggleBookmark}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                bookmarked
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-[#76515b] hover:text-[#2b0c15] bg-[#fff8fa] hover:bg-[#fde8ec] border border-[#ebd4d9]'
              }`}
              title="Bookmark question for review"
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-600 text-amber-600' : 'text-[#76515b]'}`} />
              <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            {/* Flag for review */}
            <button
              type="button"
              onClick={handleToggleFlag}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                flaggedIds.includes(currentQuestion.id)
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-[#76515b] hover:text-[#2b0c15] bg-[#fff8fa] hover:bg-[#fde8ec] border border-[#ebd4d9]'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${flaggedIds.includes(currentQuestion.id) ? 'fill-amber-600 text-amber-600' : ''}`} />
              <span>{flaggedIds.includes(currentQuestion.id) ? 'Flagged' : 'Flag'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Navigation Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-[#fff8fa] border border-[#ebd4d9] text-[#76515b]'
              : 'bg-white border border-[#ebd4d9] text-[#2b0c15] hover:bg-[#fff8fa] active:scale-95 shadow-2xs'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {/* Submit button always accessible */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-3 rounded-2xl font-bold text-sm bg-[#800020] text-white hover:bg-[#68001a] active:scale-95 transition-all shadow-md flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Submit Quiz</span>
            <span className="sm:hidden">Submit</span>
          </button>

          {/* Next Button */}
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-2xl font-bold text-sm bg-[#800020] text-white hover:bg-[#68001a] active:scale-95 transition-all shadow-md flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-3 rounded-2xl font-bold text-sm bg-[#800020] text-white hover:bg-[#68001a] active:scale-95 transition-all shadow-md flex items-center gap-2"
            >
              Finish & Review
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Question Palette Modal */}
      {showPaletteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2b0c15]/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#ebd4d9] space-y-6 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between border-b border-[#ebd4d9] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#2b0c15]">Question Palette</h3>
                <p className="text-xs text-[#76515b]">Jump directly to any question</p>
              </div>
              <button
                onClick={() => setShowPaletteModal(false)}
                className="w-8 h-8 rounded-full bg-[#fff8fa] border border-[#ebd4d9] text-[#76515b] hover:text-[#2b0c15] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#76515b] bg-[#fff8fa] p-3 rounded-2xl border border-[#ebd4d9]">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-md bg-[#800020]" />
                <span className="text-[#2b0c15] font-semibold">Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-md bg-white border border-[#ebd4d9]" />
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
                        ? 'ring-4 ring-[#800020]/40 scale-105 z-10'
                        : ''
                    } ${
                      isFlagged
                        ? 'bg-amber-100 text-amber-900 border-2 border-amber-400'
                        : isAnswered
                        ? 'bg-[#800020] text-white shadow-2xs'
                        : 'bg-[#fff8fa] text-[#76515b] hover:bg-[#fde8ec] border border-[#ebd4d9]'
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

            <div className="pt-2 border-t border-[#ebd4d9] flex items-center justify-between gap-3">
              <button
                onClick={() => setShowPaletteModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[#ebd4d9] text-xs font-bold text-[#76515b] hover:bg-[#fff8fa]"
              >
                Close Palette
              </button>
              <button
                onClick={() => {
                  setShowPaletteModal(false);
                  setShowSubmitModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#68001a] shadow-sm"
              >
                Proceed to Submit
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2b0c15]/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#ebd4d9] space-y-5">

            <div className="w-12 h-12 rounded-2xl bg-[#fde8ec] text-[#800020] flex items-center justify-center mx-auto">
              <Send className="w-6 h-6 text-[#800020]" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-extrabold text-[#2b0c15]">
                Ready to Submit Quiz?
              </h3>
              <p className="text-xs sm:text-sm text-[#76515b]">
                Your answers will be evaluated and the full answer sheet with explanations will be revealed.
              </p>
            </div>

            {/* Summary statistics */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#fff8fa] border border-[#ebd4d9] text-center text-xs">
              <div>
                <div className="text-[#76515b] font-medium">Answered</div>
                <div className="text-lg font-black text-[#800020]">{answeredCount}</div>
              </div>
              <div>
                <div className="text-[#76515b] font-medium">Unanswered</div>
                <div className="text-lg font-black text-rose-600">{unansweredCount}</div>
              </div>
              <div>
                <div className="text-[#76515b] font-medium">Flagged</div>
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
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#ebd4d9] text-xs sm:text-sm font-bold text-[#76515b] hover:bg-[#fff8fa] transition-colors"
              >
                Go Back & Review
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleSubmitQuiz();
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
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
