import React, { useState } from 'react';
import type { QuizAttempt, DailyQuiz, QuizQuestion } from '../types/quiz';
import { 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  Eye, 
  EyeOff, 
  MapPin, 
  Calendar, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface ReviewMistakesSectionProps {
  attempt: QuizAttempt;
  quiz?: DailyQuiz;
  onOpenFullAnswerSheet: () => void;
}

export const ReviewMistakesSection: React.FC<ReviewMistakesSectionProps> = ({
  attempt,
  quiz,
  onOpenFullAnswerSheet,
}) => {
  // Reveal state for self-testing mode per question
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [filterType, setFilterType] = useState<'all' | 'incorrect' | 'unanswered'>('all');

  if (!quiz) return null;

  // Find questions with mistakes or unanswered
  const allMistakes: { question: QuizQuestion; questionNumber: number; selectedAnswer: number | undefined }[] = [];
  quiz.questions.forEach((q, idx) => {
    const selected = attempt.answers[q.id];
    const isAnswered = selected !== undefined && selected !== -1;
    const isCorrect = isAnswered && selected === q.correctAnswer;
    if (!isCorrect) {
      allMistakes.push({
        question: q,
        questionNumber: idx + 1,
        selectedAnswer: selected
      });
    }
  });

  const filteredMistakes = allMistakes.filter(item => {
    const isUnanswered = item.selectedAnswer === undefined || item.selectedAnswer === -1;
    if (filterType === 'incorrect') return !isUnanswered;
    if (filterType === 'unanswered') return isUnanswered;
    return true;
  });

  const toggleReveal = (qId: string) => {
    setRevealedIds(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // If 0 mistakes: Perfect Score Celebration!
  if (allMistakes.length === 0) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 border-2 border-emerald-400 p-6 sm:p-8 shadow-card text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/30 animate-bounce">
          💯
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-emerald-950">
          Zero Mistakes! Flawless Score!
        </h3>
        <p className="text-sm sm:text-base text-emerald-800 max-w-xl mx-auto font-medium">
          Mahi, you answered every single question correctly today across all 6 states! You've unlocked the <strong>Perfect Score</strong> achievement badge! 🏆
        </p>
        <div className="pt-2">
          <button
            onClick={onOpenFullAnswerSheet}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <span>Review Full Answer Sheet</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-200 shadow-card space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold mb-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Learning Opportunity</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>Review Mistakes</span>
            <span className="text-xs sm:text-sm font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              {allMistakes.length} {allMistakes.length === 1 ? 'Question' : 'Questions'}
            </span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Compare your chosen answer against the correct answer and read the factual explanation to solidify your memory!
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            All ({allMistakes.length})
          </button>
          <button
            onClick={() => setFilterType('incorrect')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterType === 'incorrect' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Incorrect ({attempt.incorrectCount})
          </button>
          {attempt.unansweredCount > 0 && (
            <button
              onClick={() => setFilterType('unanswered')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterType === 'unanswered' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Skipped ({attempt.unansweredCount})
            </button>
          )}
        </div>
      </div>

      {/* Mistakes Questions List */}
      <div className="space-y-5">
        {filteredMistakes.map(({ question, questionNumber, selectedAnswer }) => {
          const isUnanswered = selectedAnswer === undefined || selectedAnswer === -1;
          const userChosenText = isUnanswered ? 'Not Attempted (Skipped)' : question.options[selectedAnswer];
          const correctText = question.options[question.correctAnswer];
          const isTestingHidden = revealedIds[question.id] === false; // default open, can be toggled

          return (
            <div
              key={question.id}
              className="p-5 rounded-2xl border border-rose-200/90 bg-rose-50/20 hover:border-rose-300 transition-colors space-y-4"
            >
              {/* Question Metadata Row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                    {questionNumber < 10 ? `0${questionNumber}` : questionNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-white text-slate-700 border border-slate-200">
                    {question.state}
                  </span>
                  {question.parkName && (
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                      • {question.parkName}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    isUnanswered 
                      ? 'bg-amber-50 text-amber-800 border-amber-200' 
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {isUnanswered ? 'Skipped' : 'Incorrect'}
                  </span>

                  <button
                    onClick={() => toggleReveal(question.id)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white transition-colors"
                    title={isTestingHidden ? 'Reveal Answer' : 'Hide Answer to test yourself'}
                  >
                    {isTestingHidden ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Reveal Answer</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Self-Test</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                {question.question}
              </div>

              {/* Answers Comparison Box */}
              {!isTestingHidden ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  
                  {/* Your Answer */}
                  <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                    isUnanswered 
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900' 
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}>
                    <div className="mt-0.5">
                      {isUnanswered ? (
                        <HelpCircle className="w-4 h-4 text-amber-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                        {isUnanswered ? 'Your Status' : 'Your Answer'}
                      </span>
                      <span className="text-xs sm:text-sm font-bold">
                        {userChosenText}
                      </span>
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div className="p-3.5 rounded-xl border bg-emerald-50 border-emerald-300 text-emerald-950 flex items-start gap-2.5">
                    <div className="mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider block text-emerald-800">
                        Correct Answer
                      </span>
                      <span className="text-xs sm:text-sm font-black text-emerald-900">
                        {correctText}
                      </span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-100 text-center text-xs text-slate-600 italic">
                  Answers hidden for self-testing. Can you recall the correct answer? Click "Reveal Answer" above to check!
                </div>
              )}

              {/* Explanation & Key Fact Box */}
              {!isTestingHidden && (
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Why this is correct & Fact Sheet:</span>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {question.explanation}
                  </p>

                  {/* Quick context pills if available */}
                  {(question.establishedYear || question.district || question.famousWildlife) && (
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      {question.district && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {question.district}
                        </span>
                      )}
                      {question.establishedYear && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" /> Estd. {question.establishedYear}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Bottom CTA to view full answer sheet */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
        <span className="text-xs text-slate-500">
          Want to review all 30 questions, including those you got right?
        </span>
        <button
          onClick={onOpenFullAnswerSheet}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Open Full 30-Question Answer Sheet</span>
        </button>
      </div>

    </div>
  );
};
