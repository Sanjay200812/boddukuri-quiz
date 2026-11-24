import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  Play,
  Award
} from 'lucide-react';
import type { MockExamConfig, MockExamState, MockExamResult } from '../../types/quiz';
import {
  generateMockExam,
  submitMockExam,
  getMockExamResults
} from '../../utils/storage';
import { getTopicsList } from '../../data/topics';

interface MockExamPortalProps {
  studentId: string;
  studentName?: string;
  onExit?: () => void;
  onExitExam?: () => void;
}

export const MockExamPortal: React.FC<MockExamPortalProps> = ({
  studentId,
  studentName = 'Scholar',
  onExit,
  onExitExam
}) => {
  const exitHandler = onExitExam || onExit || (() => {});
  const [examState, setExamState] = useState<MockExamState | null>(null);
  const [activeResult, setActiveResult] = useState<MockExamResult | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [historyTab, setHistoryTab] = useState<'launcher' | 'history'>('launcher');

  const topics = getTopicsList().filter(t => t.isPublished);
  const pastResults = getMockExamResults(studentId);

  // Timer Effect
  useEffect(() => {
    if (!examState || examState.isSubmitted) return;

    const timer = setInterval(() => {
      setExamState(prev => {
        if (!prev || prev.isSubmitted) return prev;
        if (prev.secondsRemaining <= 1) {
          clearInterval(timer);
          // Auto submit on time expiry!
          const result = submitMockExam(
            { ...prev, secondsRemaining: 0, isSubmitted: true },
            studentId,
            studentName
          );
          setActiveResult(result);
          return null;
        }
        return { ...prev, secondsRemaining: prev.secondsRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examState, studentId, studentName]);

  const handleStartExam = (config: MockExamConfig) => {
    const state = generateMockExam(config);
    setExamState(state);
    setActiveResult(null);
    setShowSubmitConfirm(false);
  };

  const handleSelectOption = (optionIdx: number) => {
    if (!examState) return;
    const currentQ = examState.questions[examState.currentQuestionIndex];
    const prevStatus = examState.questionStatus[currentQ.id];

    const newStatus = prevStatus === 'marked-for-review' || prevStatus === 'answered-and-marked'
      ? 'answered-and-marked'
      : 'answered';

    setExamState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        answers: { ...prev.answers, [currentQ.id]: optionIdx },
        questionStatus: { ...prev.questionStatus, [currentQ.id]: newStatus }
      };
    });
  };

  const handleClearResponse = () => {
    if (!examState) return;
    const currentQ = examState.questions[examState.currentQuestionIndex];
    setExamState(prev => {
      if (!prev) return null;
      const newAns = { ...prev.answers };
      delete newAns[currentQ.id];
      const newStatus = { ...prev.questionStatus, [currentQ.id]: 'unanswered' as const };
      return {
        ...prev,
        answers: newAns,
        questionStatus: newStatus
      };
    });
  };

  const handleMarkForReviewAndNext = () => {
    if (!examState) return;
    const currentQ = examState.questions[examState.currentQuestionIndex];
    const hasAnswer = examState.answers[currentQ.id] !== undefined;
    const status: 'answered-and-marked' | 'marked-for-review' = hasAnswer ? 'answered-and-marked' : 'marked-for-review';

    setExamState(prev => {
      if (!prev) return null;
      const nextIdx = Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1);
      const nextQ = prev.questions[nextIdx];
      const updatedStatus: Record<string, 'not-visited' | 'unanswered' | 'answered' | 'marked-for-review' | 'answered-and-marked'> = {
        ...prev.questionStatus,
        [currentQ.id]: status
      };
      if (updatedStatus[nextQ.id] === 'not-visited') {
        updatedStatus[nextQ.id] = 'unanswered';
      }
      return {
        ...prev,
        questionStatus: updatedStatus,
        currentQuestionIndex: nextIdx
      };
    });
  };

  const handleSaveAndNext = () => {
    if (!examState) return;
    const currentQ = examState.questions[examState.currentQuestionIndex];
    const hasAnswer = examState.answers[currentQ.id] !== undefined;

    setExamState(prev => {
      if (!prev) return null;
      const nextIdx = Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1);
      const nextQ = prev.questions[nextIdx];
      const updatedStatus = { ...prev.questionStatus };
      if (!hasAnswer && updatedStatus[currentQ.id] !== 'marked-for-review') {
        updatedStatus[currentQ.id] = 'unanswered';
      }
      if (updatedStatus[nextQ.id] === 'not-visited') {
        updatedStatus[nextQ.id] = 'unanswered';
      }
      return {
        ...prev,
        questionStatus: updatedStatus,
        currentQuestionIndex: nextIdx
      };
    });
  };

  const handleJumpToQuestion = (targetIdx: number) => {
    if (!examState) return;
    setExamState(prev => {
      if (!prev) return null;
      const targetQ = prev.questions[targetIdx];
      const updatedStatus = { ...prev.questionStatus };
      if (updatedStatus[targetQ.id] === 'not-visited') {
        updatedStatus[targetQ.id] = 'unanswered';
      }
      return {
        ...prev,
        questionStatus: updatedStatus,
        currentQuestionIndex: targetIdx
      };
    });
  };

  const handleConfirmSubmit = () => {
    if (!examState) return;
    const result = submitMockExam(examState, studentId, studentName);
    setActiveResult(result);
    setExamState(null);
    setShowSubmitConfirm(false);
  };

  // Helper formatting for timer mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ============================================================================
  // 1. LIVE EXAMINATION INTERFACE
  // ============================================================================
  if (examState) {
    const currentQ = examState.questions[examState.currentQuestionIndex];
    const chosenAns = examState.answers[currentQ.id];
    const timerUrgent = examState.secondsRemaining < 300; // Under 5 mins

    // Palette Counts
    let answeredCount = 0;
    let markedCount = 0;
    let notVisitedCount = 0;
    let unansweredCount = 0;

    Object.values(examState.questionStatus).forEach(st => {
      if (st === 'answered') answeredCount++;
      else if (st === 'marked-for-review' || st === 'answered-and-marked') markedCount++;
      else if (st === 'not-visited') notVisitedCount++;
      else unansweredCount++;
    });

    return (
      <div className="space-y-4 text-slate-900 pb-16">
        {/* Exam Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-lg">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#800020] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
              Examination Mode (Strict)
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              {examState.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time countdown timer */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-black text-sm sm:text-base ${
                timerUrgent
                  ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
                  : 'bg-slate-100 border-slate-200 text-emerald-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTime(examState.secondsRemaining)}</span>
            </div>

            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer border border-emerald-500/40"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Main Examination Layout: Question + Palette */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Question Viewer (3 Cols) */}
          <div className="lg:col-span-3 p-5 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
                <span className="font-extrabold text-[#800020]">
                  Question {examState.currentQuestionIndex + 1} of {examState.questions.length}
                </span>
                <span className="text-slate-500">
                  Marks: +1.00 | -0.25 (Negative)
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = chosenAns === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-[#1e3a5f] text-white shadow-soft font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#1e3a5f]/30 hover:text-slate-900'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'bg-[#ff3366] text-white border-white'
                            : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearResponse}
                  disabled={chosenAns === undefined}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                >
                  Clear Selection
                </button>
                <button
                  type="button"
                  onClick={handleMarkForReviewAndNext}
                  className="px-3.5 py-2 rounded-xl bg-[#2c142e] hover:bg-[#3f1d42] text-purple-300 text-xs font-bold transition-all border border-purple-800/60 cursor-pointer"
                >
                  Mark for Review & Next
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={examState.currentQuestionIndex === 0}
                  onClick={() => handleJumpToQuestion(examState.currentQuestionIndex - 1)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-white disabled:opacity-40 text-xs font-bold transition-all border border-slate-200 cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveAndNext}
                  className="px-5 py-2 min-h-[44px] rounded-xl bg-[#1e3a5f] hover:bg-[#102a43] text-white text-xs font-bold transition-all shadow-soft cursor-pointer border border-[#1e3a5f]/30 flex items-center gap-1"
                >
                  <span>Save & Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Question Palette Sidebar (1 Col) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Question Palette
            </h4>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-emerald-600 shrink-0" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-rose-700 shrink-0" />
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-purple-600 shrink-0" />
                <span>Review ({markedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#250a17] shrink-0" />
                <span>Not Visited ({notVisitedCount})</span>
              </div>
            </div>

            {/* Palette Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-[350px] overflow-y-auto pr-1">
              {examState.questions.map((q, idx) => {
                const status = examState.questionStatus[q.id];
                const isCurrent = examState.currentQuestionIndex === idx;

                let bgClass = 'bg-[#1a0712] text-slate-500 border-slate-200';
                if (status === 'answered') bgClass = 'bg-emerald-600 text-white border-emerald-400';
                else if (status === 'marked-for-review' || status === 'answered-and-marked') {
                  bgClass = 'bg-purple-600 text-white border-purple-400';
                } else if (status === 'unanswered') {
                  bgClass = 'bg-rose-700 text-white border-rose-500';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`h-9 rounded-xl font-bold text-xs border transition-all cursor-pointer flex items-center justify-center ${bgClass} ${
                      isCurrent ? 'ring-2 ring-white scale-105 shadow-md' : 'hover:opacity-90'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="max-w-md w-full p-6 rounded-3xl bg-gradient-to-b from-[#180510] to-[#0e0209] border border-slate-200 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Submit Mock Examination?</span>
              </h3>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Questions:</span>
                  <strong className="text-slate-900">{examState.questions.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Answered Questions:</span>
                  <strong className="text-emerald-400">{answeredCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Marked for Review:</span>
                  <strong className="text-purple-300">{markedCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unanswered Questions:</span>
                  <strong className="text-rose-400">{unansweredCount + notVisitedCount}</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-white/10">
                  <span className="text-slate-500">Time Remaining:</span>
                  <strong className="text-amber-300 font-mono">{formatTime(examState.secondsRemaining)}</strong>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Are you sure you want to finalize your exam submission? You cannot change answers after submitting.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirm(false)}
                  className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors border border-slate-200 cursor-pointer"
                >
                  Return to Test
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // 2. DETAILED POST-EXAMINATION RESULT REPORT VIEW
  // ============================================================================
  if (activeResult) {
    return (
      <div className="space-y-6 text-slate-900 pb-16 animate-fadeIn">
        {/* Result Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1c0612] via-[#14040d] to-[#0c0208] border border-slate-200 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#800020] px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                Official Score Report
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                {activeResult.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Candidate: <strong className="text-slate-900">{activeResult.studentName}</strong> • Completed on{' '}
                {new Date(activeResult.completedAt).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-500">Final Score</div>
                <div className="text-2xl font-black text-[#800020]">
                  {activeResult.score} / {activeResult.maxScore}
                </div>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-500">Percentage</div>
                <div className="text-2xl font-black text-emerald-400">
                  {activeResult.percentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#260817]">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500">Correct: </span>
              <strong className="text-emerald-400">{activeResult.correctCount}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500">Incorrect: </span>
              <strong className="text-rose-400">{activeResult.incorrectCount}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500">Unanswered: </span>
              <strong className="text-slate-700">{activeResult.unansweredCount}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500">Time Taken: </span>
              <strong className="text-slate-900">{Math.round(activeResult.timeTakenSeconds / 60)} mins</strong>
            </div>
          </div>
        </div>

        {/* Detailed Question Review with Explanations */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1e3a5f]" />
            <span>Question-by-Question Solution & Verification Explanations</span>
          </h3>

          <div className="space-y-3.5">
            {activeResult.questionsSnapshot.map((q, idx) => {
              const studentAns = activeResult.answers[q.id];
              const isCorrect = studentAns === q.correctAnswer;
              const isUnanswered = studentAns === undefined || studentAns === -1;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border space-y-3 transition-all ${
                    isCorrect
                      ? 'bg-[#0e1713] border-emerald-800/40'
                      : isUnanswered
                      ? 'bg-white border-slate-200'
                      : 'bg-[#18050e] border-rose-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-white/5">
                    <span className="font-extrabold text-[#800020]">
                      Question {idx + 1}
                    </span>
                    {isCorrect ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct (+1.00)</span>
                      </span>
                    ) : isUnanswered ? (
                      <span className="text-slate-500 font-bold">Unanswered (0.00)</span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect (-0.25)</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-relaxed">
                    {q.question}
                  </h4>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isStudentSelected = studentAns === optIdx;
                      const isRealAnswer = q.correctAnswer === optIdx;

                      let optClass = 'bg-[#10030a] border-[#220713] text-slate-700';
                      if (isRealAnswer) {
                        optClass = 'bg-emerald-950 border-emerald-600 text-emerald-200 font-bold';
                      } else if (isStudentSelected && !isCorrect) {
                        optClass = 'bg-rose-950 border-rose-600 text-rose-200 font-bold';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${optClass}`}
                        >
                          <span className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {isRealAnswer && <span className="text-[10px] text-emerald-400">✓ Correct</span>}
                          {isStudentSelected && !isRealAnswer && <span className="text-[10px] text-rose-400">✗ Your Choice</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="p-3 rounded-xl bg-[#0b0207] border border-[#200814] text-xs text-slate-700 leading-relaxed">
                      <strong className="text-rose-300 block mb-0.5">Explanation:</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={() => setActiveResult(null)}
              className="px-6 py-3 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-white text-xs font-bold transition-all border border-slate-200 cursor-pointer"
            >
              Back to Mock Exams Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 3. LAUNCHER & CONFIGURATION PORTAL
  // ============================================================================
  return (
    <div className="space-y-6 text-slate-900 pb-16">
      <div className="flex items-center justify-between">
        <button
          onClick={exitHandler}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#800020] hover:bg-slate-100 transition active:scale-95 min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#800020] px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
            Timed Competitive Exam Environment
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-[#1e3a5f]" />
            <span>Mock Examination Mode</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Simulate realistic competitive test conditions with question palettes, countdown timers, and negative marking.
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHistoryTab('launcher')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              historyTab === 'launcher'
                ? 'bg-[#1e3a5f] text-white shadow-soft'
                : 'text-slate-500 hover:text-slate-900 bg-white'
            }`}
          >
            Launch Tests
          </button>
          <button
            onClick={() => setHistoryTab('history')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              historyTab === 'history'
                ? 'bg-[#1e3a5f] text-white shadow-soft'
                : 'text-slate-500 hover:text-slate-900 bg-white'
            }`}
          >
            Attempt History ({pastResults.length})
          </button>
        </div>
      </div>

      {historyTab === 'launcher' ? (
        <div className="space-y-6">
          {/* Preset 1: Full-Length All-India Mock Test */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1e0714] via-[#14050e] to-[#0c0208] border border-slate-200 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800/40">
                  Full-Length Simulator
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Comprehensive All-India GK Mock Test (60 Qs)
                </h3>
                <p className="text-xs text-slate-700 mt-1 max-w-2xl leading-relaxed">
                  Full 60-question competitive examination simulator randomly drawn across all 9 core syllabus subjects: National Parks, Current Affairs, Banking, Cabinet, Ramsar, UNESCO, Dance, and Sixth Schedule.
                </p>
              </div>

              <button
                onClick={() =>
                  handleStartExam({
                    id: 'mock-full-length-60',
                    title: 'Full-Length All-India GK Mock Test',
                    mode: 'full-length',
                    totalQuestions: 60,
                    timeLimitMinutes: 45,
                    passingPercentage: 60,
                    negativeMarkingRatio: 0.25
                  })
                }
                className="px-6 py-3 min-h-[44px] rounded-2xl bg-[#1e3a5f] hover:bg-[#102a43] text-white text-xs sm:text-sm font-bold transition-all shadow-soft flex items-center justify-center gap-2 cursor-pointer border border-[#1e3a5f]/30 shrink-0"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Full Mock (45 Mins) →</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-200">
              <span>60 Questions</span>
              <span>•</span>
              <span>45 Minutes</span>
              <span>•</span>
              <span>Negative Marking: 0.25 marks</span>
              <span>•</span>
              <span>Palette Navigation</span>
            </div>
          </div>

          {/* Preset 2: Sectional Subject-Wise Tests */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1e3a5f]" />
              <span>Sectional Subject-Wise Timed Tests (20 Questions / 15 Mins)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map(topic => (
                <div
                  key={topic.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#1e3a5f]/30 transition-all flex flex-col justify-between space-y-3 shadow-md"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#800020]">
                      Sectional Practice
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {topic.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {topic.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#200814]">
                    <button
                      onClick={() =>
                        handleStartExam({
                          id: `mock-sec-${topic.id}`,
                          title: `${topic.title} — Sectional Mock Exam`,
                          mode: 'sectional',
                          topicId: topic.id,
                          totalQuestions: 20,
                          timeLimitMinutes: 15,
                          passingPercentage: 65,
                          negativeMarkingRatio: 0.25
                        })
                      }
                      className="w-full py-2.5 px-4 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-white text-xs font-bold transition-all border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-[#800020]" />
                      <span>Start Sectional (15m) →</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="space-y-3">
          {pastResults.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-200 text-xs text-slate-500 space-y-2">
              <Award className="w-8 h-8 text-neutral-600 mx-auto" />
              <p>No past mock examination records found. Launch a test above to record your competitive score report.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pastResults.map(res => (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#1e3a5f]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 text-[#800020]">
                        {res.mode}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(res.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{res.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Score: <strong className="text-slate-900">{res.score}/{res.maxScore}</strong></span>
                      <span>•</span>
                      <span>Accuracy: <strong className="text-emerald-400">{res.percentage}%</strong></span>
                      <span>•</span>
                      <span>Time: <strong>{Math.round(res.timeTakenSeconds / 60)} mins</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveResult(res)}
                    className="px-4 py-2 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-white text-xs font-bold transition-all border border-slate-200 cursor-pointer self-start sm:self-center"
                  >
                    View Solutions →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
