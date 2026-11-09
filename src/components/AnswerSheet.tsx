import React, { useState } from 'react';
import type {
  QuizAttempt,
  DailyQuiz
} from '../types/quiz';
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowLeft,
  RotateCcw,
  Home,
  HelpCircle,
  Sparkles,
  Calendar,
  MapPin,
  Bookmark,
  Download
} from 'lucide-react';
import { toggleBookmark, getBookmarks } from '../utils/storage';
import { generateDayNotesPDF } from '../utils/pdfGenerator';

interface AnswerSheetProps {
  attempt: QuizAttempt;
  quiz: DailyQuiz;
  onBackToResult: () => void;
  onReattempt: () => void;
  onGoHome: () => void;
}

export const AnswerSheet: React.FC<AnswerSheetProps> = ({
  attempt,
  quiz,
  onBackToResult,
  onReattempt,
  onGoHome,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'correct' | 'incorrect' | 'unanswered' | 'bookmarked'>('all');
  const [sectionFilter, setSectionFilter] = useState<'all' | 'previous' | 'new'>('all');
  const [bookmarksList, setBookmarksList] = useState<string[]>(() => getBookmarks());

  const questions = quiz.questions;

  const handleToggle = (qId: string) => {
    toggleBookmark(qId);
    setBookmarksList(getBookmarks());
  };

  // Filter questions based on selections
  const filteredQuestions = questions.filter(q => {
    const selected = attempt.answers[q.id];
    const isAnswered = selected !== undefined && selected !== -1;
    const isCorrect = isAnswered && selected === q.correctAnswer;
    const isIncorrect = isAnswered && selected !== q.correctAnswer;
    const isUnanswered = !isAnswered;
    const isSaved = bookmarksList.includes(q.id);

    // Filter by status
    if (statusFilter === 'correct' && !isCorrect) return false;
    if (statusFilter === 'incorrect' && !isIncorrect) return false;
    if (statusFilter === 'unanswered' && !isUnanswered) return false;
    if (statusFilter === 'bookmarked' && !isSaved) return false;

    // Filter by section
    if (sectionFilter === 'previous' && q.section !== 'previous') return false;
    if (sectionFilter === 'new' && q.section !== 'new') return false;

    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-fadeIn">

      {/* Top Header & Sticky Navigation */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft space-y-4">

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToResult}
              className="p-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
              title="Back to Score Summary"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-xs font-black bg-slate-900 text-white">
                  {quiz.title} Answer Sheet
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {attempt.formattedDate}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Boddukuri's Quiz #Mahi — {quiz.title} Explanations ({quiz.statesCovered.length} States)
              </h2>
            </div>
          </div>

          {/* Quick Score Capsule & PDF Button */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => generateDayNotesPDF(quiz)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              title="Download full revision notes and explanations PDF"
            >
              <Download className="w-3.5 h-3.5 text-red-800" />
              <span>Download PDF</span>
            </button>

            <div className="flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400">Score:</span>{' '}
                <strong className="text-red-900 text-sm">{attempt.marksObtained}/{attempt.maxMarks}</strong>
              </div>
              <div className="w-px h-4 bg-slate-300" />
              <div>
                <span className="text-slate-400">Accuracy:</span>{' '}
                <strong className="text-slate-900 text-sm">{attempt.percentage}%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">

          {/* Status Filters */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setStatusFilter('correct')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                statusFilter === 'correct'
                  ? 'bg-red-900 text-white shadow-sm'
                  : 'bg-red-50 text-red-900 hover:bg-red-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Correct ({attempt.correctCount})
            </button>
            <button
              onClick={() => setStatusFilter('incorrect')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                statusFilter === 'incorrect'
                  ? 'bg-rose-700 text-white shadow-sm'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              Incorrect ({attempt.incorrectCount})
            </button>
            <button
              onClick={() => setStatusFilter('unanswered')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                statusFilter === 'unanswered'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <MinusCircle className="w-3.5 h-3.5" />
              Unanswered ({attempt.unansweredCount})
            </button>
            <button
              onClick={() => setStatusFilter('bookmarked')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                statusFilter === 'bookmarked'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Bookmarked ({bookmarksList.length})
            </button>
          </div>

          {/* Section Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setSectionFilter('all')}
              className={`px-2.5 py-1 rounded-lg ${sectionFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              Both Sections
            </button>
            <button
              onClick={() => setSectionFilter('previous')}
              className={`px-2.5 py-1 rounded-lg ${sectionFilter === 'previous' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              Section A (Recall)
            </button>
            <button
              onClick={() => setSectionFilter('new')}
              className={`px-2.5 py-1 rounded-lg ${sectionFilter === 'new' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              Section B (New)
            </button>
          </div>

        </div>

      </div>

      {/* Questions Breakdown List */}
      <div className="space-y-5">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500 space-y-2">
            <HelpCircle className="w-10 h-10 mx-auto text-slate-300" />
            <h4 className="font-bold text-slate-700">No questions match the selected filter</h4>
            <p className="text-xs">Try switching filters above to see more questions.</p>
          </div>
        ) : (
          filteredQuestions.map((question) => {
            const selectedOption = attempt.answers[question.id];
            const isAnswered = selectedOption !== undefined && selectedOption !== -1;
            const isCorrect = isAnswered && selectedOption === question.correctAnswer;
            const isIncorrect = isAnswered && selectedOption !== question.correctAnswer;
            const isUnanswered = !isAnswered;

            // Find question overall index (1-based)
            const qIndex = questions.findIndex(q => q.id === question.id) + 1;

            return (
              <div
                key={question.id}
                className={`bg-white rounded-3xl p-6 sm:p-7 border-2 transition-all space-y-5 shadow-soft ${
                  isCorrect
                    ? 'border-red-300 bg-gradient-to-b from-white to-red-50/10'
                    : isIncorrect
                    ? 'border-rose-200 bg-gradient-to-b from-white to-rose-50/10'
                    : 'border-slate-200'
                }`}
              >

                {/* Header: Status pill, Section tag, National Park */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                      Q#{qIndex}
                    </span>

                    {/* Section / State Badge */}
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                      question.section === 'previous'
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : 'bg-red-50 text-red-950 border-red-300'
                    }`}>
                      {question.section === 'previous' ? `Revision: ${question.state}` : `State: ${question.state}`}
                    </span>
                  </div>

                  {/* Status Indicator & Bookmark Badge */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggle(question.id)}
                      className={`p-1.5 rounded-xl border transition-all ${
                        bookmarksList.includes(question.id)
                          ? 'bg-amber-100 border-amber-300 text-amber-800'
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                      }`}
                      title={bookmarksList.includes(question.id) ? 'Remove Bookmark' : 'Bookmark this question'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${bookmarksList.includes(question.id) ? 'fill-amber-600' : ''}`} />
                    </button>

                    {isCorrect && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-900 border border-red-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-900" />
                        Correct (+1)
                      </span>
                    )}
                    {isIncorrect && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
                        <XCircle className="w-3.5 h-3.5 text-rose-700" />
                        Incorrect (0)
                      </span>
                    )}
                    {isUnanswered && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        <MinusCircle className="w-3.5 h-3.5 text-slate-500" />
                        Unanswered
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <div>
                  <div className="text-xs text-slate-400 font-medium mb-1">
                    State: <strong className="text-slate-600">{question.state}</strong> • Park: <strong className="text-slate-600">{question.parkName}</strong>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 leading-snug">
                    {question.question}
                  </h3>
                </div>

                {/* 4 Options Detailed Review */}
                <div className="space-y-2 pt-1">
                  {question.options.map((opt, optIdx) => {
                    const isOptionCorrect = optIdx === question.correctAnswer;
                    const isUserPick = optIdx === selectedOption;
                    const letters = ['A', 'B', 'C', 'D'];

                    let optionStyle = 'border-slate-200 bg-slate-50/50 text-slate-700';
                    let badge = null;

                    if (isOptionCorrect) {
                      optionStyle = 'border-red-700 bg-red-50 text-red-950 font-bold ring-2 ring-red-300';
                      badge = (
                        <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-red-800 text-white shadow-xs">
                          <CheckCircle2 className="w-3 h-3" /> Correct Answer
                        </span>
                      );
                    } else if (isUserPick && !isOptionCorrect) {
                      optionStyle = 'border-rose-400 bg-rose-50 text-rose-950 font-semibold ring-2 ring-rose-200';
                      badge = (
                        <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
                          <XCircle className="w-3 h-3" /> Your Answer
                        </span>
                      );
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3.5 sm:p-4 rounded-2xl border flex items-center gap-3 transition-colors ${optionStyle}`}
                      >
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isOptionCorrect
                            ? 'bg-red-800 text-white'
                            : isUserPick && !isOptionCorrect
                            ? 'bg-rose-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-600'
                        }`}>
                          {letters[optIdx]}
                        </span>

                        <span className="text-sm leading-relaxed flex-1">
                          {opt}
                        </span>

                        {badge}
                      </div>
                    );
                  })}
                </div>

                {/* Factual Explanation Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-red-50/70 border border-red-300/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-950">
                    <Sparkles className="w-4 h-4 text-red-900" />
                    <span>Fact & Explanation</span>
                  </div>

                  <p className="text-xs sm:text-sm text-red-950 leading-relaxed font-medium">
                    {question.explanation}
                  </p>

                  {/* Additional Metadata chips if available */}
                  {(question.establishedYear || question.district || question.keyFeature) && (
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-red-900">
                      {question.establishedYear && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-red-300">
                          <Calendar className="w-3 h-3 text-red-800" />
                          Est. {question.establishedYear}
                        </span>
                      )}
                      {question.district && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-red-300">
                          <MapPin className="w-3 h-3 text-red-800" />
                          {question.district}
                        </span>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-elevated flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBackToResult}
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Results
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onReattempt}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm transition-colors shadow-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Reattempt
          </button>
          <button
            onClick={onGoHome}
            className="px-5 py-2.5 rounded-xl bg-red-900 hover:bg-red-900 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            Home Dashboard
          </button>
        </div>
      </div>

    </div>
  );
};
