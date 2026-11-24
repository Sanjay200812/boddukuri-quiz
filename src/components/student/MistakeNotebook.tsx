import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  RotateCcw,
  ExternalLink,
  Search,
  Check,
  ArrowLeft
} from 'lucide-react';
import type { StudentMistake } from '../../types/quiz';
import {
  getStudentMistakes,
  retryMistakeQuestion,
  updateStudentMistakeStatus
} from '../../utils/storage';
import { getTopicsList, getQuizzesForTopic } from '../../data/topics';

interface MistakeNotebookProps {
  studentId: string;
  studentName?: string;
  onNavigateToQuiz?: (quizId: string) => void;
  onGoBack?: () => void;
  onStartQuiz?: (quizId: string) => void;
}

export const MistakeNotebook: React.FC<MistakeNotebookProps> = ({
  studentId,
  studentName = 'Scholar',
  onNavigateToQuiz: _onNavigateToQuiz,
  onGoBack,
  onStartQuiz: _onStartQuiz
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [selectedQuizId, setSelectedQuizId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'understood'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [retryResults, setRetryResults] = useState<Record<string, { isCorrect: boolean }>>({});

  const mistakes = getStudentMistakes(studentId);
  const topics = getTopicsList().filter(t => t.isPublished);

  // Available quizzes for selected topic
  const availableQuizzes = selectedTopicId !== 'all'
    ? getQuizzesForTopic(selectedTopicId, false)
    : [];

  // Filtered mistakes list
  const filteredMistakes = mistakes.filter(m => {
    if (selectedTopicId !== 'all' && m.topicId !== selectedTopicId) return false;
    if (selectedQuizId !== 'all' && m.quizId !== selectedQuizId) return false;
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQ = m.question.question.toLowerCase().includes(q);
      const matchExp = m.explanation.toLowerCase().includes(q);
      const matchTopic = m.topicId.toLowerCase().includes(q);
      if (!matchQ && !matchExp && !matchTopic) return false;
    }
    return true;
  });

  const totalMistakes = mistakes.length;
  const activeMistakesCount = mistakes.filter(m => m.status === 'active').length;
  const understoodCount = mistakes.filter(m => m.status === 'understood' || m.status === 'mastered').length;
  const resolvedRate = totalMistakes > 0 ? Math.round((understoodCount / totalMistakes) * 100) : 0;

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleRetrySubmit = (mistake: StudentMistake) => {
    const chosen = selectedAnswers[mistake.questionId];
    if (chosen === undefined) {
      alert('Please select an option first before checking your answer.');
      return;
    }
    const res = retryMistakeQuestion(studentId, mistake.questionId, chosen);
    setRetryResults(prev => ({ ...prev, [mistake.questionId]: { isCorrect: res.isCorrect } }));
  };

  const handleToggleUnderstood = (mistake: StudentMistake) => {
    const newStatus = mistake.status === 'understood' ? 'active' : 'understood';
    updateStudentMistakeStatus(studentId, mistake.questionId, newStatus);
  };

  return (
    <div className="space-y-6 text-[#f2e6eb] pb-16">
      {onGoBack && (
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#ff8099] hover:bg-white/5 transition active:scale-95 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#260c18] pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#ff8099] px-2.5 py-0.5 rounded-full bg-[#2a0717] border border-[#52102c]">
            Learning & Retention Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-[#ff3366]" />
            <span>Mistake Notebook</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Personalized record of questions missed during practice for {studentName}.
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-[#14060d] border border-[#2b0c18] text-xs">
            <span className="text-neutral-400">Needs Review: </span>
            <span className="text-rose-400 font-extrabold">{activeMistakesCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#14060d] border border-[#2b0c18] text-xs">
            <span className="text-neutral-400">Understood: </span>
            <span className="text-emerald-400 font-extrabold">{understoodCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#14060d] border border-[#2b0c18] text-xs">
            <span className="text-neutral-400">Mastery: </span>
            <span className="text-[#ff8099] font-extrabold">{resolvedRate}%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#14060d] border border-[#2b0c18] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search in questions or notes…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#0c0407] border border-[#2b0c18] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff3366]"
            />
          </div>

          {/* Topic Filter */}
          <div>
            <select
              value={selectedTopicId}
              onChange={e => {
                setSelectedTopicId(e.target.value);
                setSelectedQuizId('all');
              }}
              className="w-full px-3 py-2 bg-[#0c0407] border border-[#2b0c18] rounded-xl text-xs text-white focus:outline-none focus:border-[#ff3366]"
            >
              <option value="all">All Topics ({topics.length})</option>
              {topics.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Quiz Filter */}
          <div>
            <select
              value={selectedQuizId}
              onChange={e => setSelectedQuizId(e.target.value)}
              disabled={selectedTopicId === 'all'}
              className="w-full px-3 py-2 bg-[#0c0407] border border-[#2b0c18] rounded-xl text-xs text-white disabled:opacity-50 focus:outline-none focus:border-[#ff3366]"
            >
              <option value="all">All Quizzes</option>
              {availableQuizzes.map(q => (
                <option key={q.id} value={q.id}>
                  {q.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-[#0c0407] border border-[#2b0c18] rounded-xl text-xs font-bold">
            <button
              onClick={() => setStatusFilter('active')}
              className={`flex-1 py-1 px-2 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'active' ? 'bg-[#9e1030] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Active ({activeMistakesCount})
            </button>
            <button
              onClick={() => setStatusFilter('understood')}
              className={`flex-1 py-1 px-2 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'understood' ? 'bg-emerald-900 text-emerald-100 shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Understood ({understoodCount})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 py-1 px-2 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'all' ? 'bg-[#260817] text-rose-200 shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              All ({totalMistakes})
            </button>
          </div>
        </div>
      </div>

      {/* Mistakes Feed */}
      {filteredMistakes.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#14060d]/80 border border-[#2b0c18] space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-950/60 border border-emerald-700/50 flex items-center justify-center text-emerald-300">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-white">
            {statusFilter === 'active' ? 'No active mistakes!' : 'No mistake records matching filters.'}
          </h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            {statusFilter === 'active'
              ? 'Excellent progress! Every question you missed has been understood or retried correctly.'
              : 'Mistakes made during quizzes will automatically appear here for review and retry.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMistakes.map((mistake, idx) => {
            const isUnderstood = mistake.status === 'understood' || mistake.status === 'mastered';
            const userChoice = selectedAnswers[mistake.questionId];
            const retryRes = retryResults[mistake.questionId];

            return (
              <div
                key={mistake.id}
                className={`p-5 sm:p-6 rounded-2xl border transition-all space-y-4 ${
                  isUnderstood
                    ? 'bg-[#0f1412] border-emerald-900/40'
                    : 'bg-[#15050e] border-[#3a0d20] hover:border-[#ff3366]/40 shadow-lg'
                }`}
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#260c18]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-[#220713] text-[#ff8099] border border-[#470f25]">
                      {mistake.topicId}
                    </span>
                    <span className="text-xs text-neutral-400">
                      Quiz: <strong className="text-neutral-200">{mistake.quizId}</strong>
                    </span>
                    {mistake.retriedCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1d0714] text-amber-300 border border-amber-800/40">
                        Retried {mistake.retriedCount}x
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleUnderstood(mistake)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isUnderstood
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900'
                          : 'bg-[#200713] text-neutral-300 border-[#470f25] hover:text-white hover:bg-[#330c1f]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isUnderstood ? 'Understood' : 'Mark Understood'}</span>
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white leading-relaxed">
                    <span className="text-rose-400 mr-2">Q{idx + 1}.</span>
                    {mistake.question.question}
                  </h3>
                </div>

                {/* Interactive Retry Options Palette */}
                <div className="space-y-2">
                  <div className="text-[11px] font-black uppercase tracking-wider text-neutral-400">
                    Select & Retry:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {mistake.question.options.map((opt, optIdx) => {
                      const isSelected = userChoice === optIdx;
                      const isOriginalMistake = mistake.selectedAnswer === optIdx;
                      const isTheCorrectAnswer = mistake.correctAnswer === optIdx;

                      let optClass = 'bg-[#12040b] border-[#2b0c18] text-neutral-200 hover:border-[#ff3366]/40';
                      if (retryRes) {
                        if (isTheCorrectAnswer) {
                          optClass = 'bg-emerald-950/80 border-emerald-600 text-emerald-100 font-bold';
                        } else if (isSelected && !retryRes.isCorrect) {
                          optClass = 'bg-rose-950/80 border-rose-600 text-rose-100 font-bold';
                        }
                      } else if (isSelected) {
                        optClass = 'bg-[#2b0918] border-[#ff3366] text-white shadow-sm';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(mistake.questionId, optIdx)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${optClass}`}
                        >
                          <span className="w-5 h-5 rounded-full bg-[#1e0714] border border-[#470f25] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {isOriginalMistake && !retryRes && (
                            <span className="text-[10px] text-rose-400 font-bold shrink-0">
                              (Your past answer)
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Retry Feedback & Explanation Box */}
                {retryRes ? (
                  <div
                    className={`p-4 rounded-xl border space-y-2 animate-fadeIn ${
                      retryRes.isCorrect
                        ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-100'
                        : 'bg-rose-950/40 border-rose-800/60 text-rose-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-xs">
                      {retryRes.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Correct! Great improvement. Concept marked understood.</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span>Incorrect again. Read the official explanation below carefully:</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-neutral-200 leading-relaxed pt-1">
                      {mistake.explanation}
                    </p>

                    {mistake.source && (
                      <div className="text-[11px] text-neutral-400 pt-1 border-t border-white/10 flex items-center gap-2">
                        <span>Source: <strong>{mistake.source}</strong></span>
                        {mistake.sourceUrl && (
                          <a
                            href={mistake.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#ff8099] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Verify Source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <span className="text-[11px] text-neutral-400">
                      Original choice: Option {mistake.selectedAnswer !== undefined && mistake.selectedAnswer >= 0
                        ? String.fromCharCode(65 + mistake.selectedAnswer)
                        : 'Skipped'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRetrySubmit(mistake)}
                      className="px-4 py-2 min-h-[44px] rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs font-bold transition-all shadow-ruby flex items-center gap-1.5 cursor-pointer border border-[#ff3366]/40"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Check Retry Answer</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
