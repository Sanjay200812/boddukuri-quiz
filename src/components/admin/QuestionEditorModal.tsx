import React, { useState, useMemo } from 'react';
import {
  FileText,
  Save,
  X,
  CheckCircle2,
  AlertTriangle,
  History,
  RotateCcw,
  Eye,
  ExternalLink
} from 'lucide-react';
import type { TopicQuestion, Difficulty, QuestionVersionRecord } from '../../types/quiz';
import { getTopicsList, getQuizzesForTopic, getAllTopicQuestions } from '../../data/topics';
import { getQuestionVersionHistory, recordQuestionVersion } from '../../utils/studentLearning';

interface QuestionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: TopicQuestion | null;
  onSaveQuestion: (updatedQuestion: TopicQuestion, reason: string) => void;
  adminId: string;
  adminName: string;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  onClose,
  question,
  onSaveQuestion,
  adminId,
  adminName
}) => {
  if (!isOpen || !question) return null;

  const topics = getTopicsList();
  const allExistingQuestions = useMemo(() => getAllTopicQuestions(), []);

  // Form Fields
  const [questionText, setQuestionText] = useState<string>(question.question);
  const [optionA, setOptionA] = useState<string>(question.options[0] || '');
  const [optionB, setOptionB] = useState<string>(question.options[1] || '');
  const [optionC, setOptionC] = useState<string>(question.options[2] || '');
  const [optionD, setOptionD] = useState<string>(question.options[3] || '');
  const [correctAnswer, setCorrectAnswer] = useState<number>(question.correctAnswer);
  const [explanation, setExplanation] = useState<string>(question.explanation || '');
  const [difficulty, setDifficulty] = useState<Difficulty>(question.difficulty || 'medium');
  const [topicId, setTopicId] = useState<string>(question.topicId);
  const [quizId, setQuizId] = useState<string>(question.quizId || '');
  const [sourceTitle, setSourceTitle] = useState<string>(question.source || '');
  const [sourceUrl, setSourceUrl] = useState<string>(question.sourceUrl || '');
  const [sourcePdf, setSourcePdf] = useState<string>(question.sourcePdf || '');
  const [sourcePage, setSourcePage] = useState<number>(parseInt(String(question.sourcePage)) || 1);
  const [verificationDate, setVerificationDate] = useState<string>(
    question.verifiedDate || question.lastVerifiedDate || new Date().toISOString().split('T')[0]
  );
  const [isDraft, setIsDraft] = useState<boolean>(question.isDraft ?? false);
  const [changeReason, setChangeReason] = useState<string>('Refined wording and verified official source citations');

  // Preview & Version History Tabs
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'history'>('editor');
  const [versionHistory] = useState<QuestionVersionRecord[]>(() =>
    getQuestionVersionHistory(question.id)
  );

  const availableQuizzes = useMemo(() => {
    return getQuizzesForTopic(topicId, false);
  }, [topicId]);

  // Duplicate Check against other questions
  const potentialDuplicates = useMemo(() => {
    const qLower = questionText.trim().toLowerCase();
    if (qLower.length < 15) return [];
    return allExistingQuestions.filter(
      item => item.id !== question.id && item.question.toLowerCase().includes(qLower.substring(0, 30))
    );
  }, [questionText, question.id, allExistingQuestions]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionText.trim()) {
      alert('Question text cannot be empty.');
      return;
    }

    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      alert('All 4 options (A, B, C, D) are mandatory.');
      return;
    }

    if (correctAnswer < 0 || correctAnswer > 3) {
      alert('Correct answer index must be between 0 and 3 (Option A to D).');
      return;
    }

    const updated: TopicQuestion = {
      ...question,
      question: questionText.trim(),
      options: [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()],
      correctAnswer,
      explanation: explanation.trim(),
      difficulty,
      topicId,
      quizId: quizId || undefined,
      source: sourceTitle.trim() || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      sourcePdf: sourcePdf.trim() || undefined,
      sourcePage: sourcePage > 0 ? sourcePage : undefined,
      verifiedDate: verificationDate,
      isDraft
    };

    // Record version record
    recordQuestionVersion(question, updated, adminId, adminName, changeReason);

    onSaveQuestion(updated, changeReason);
    onClose();
  };

  const handleRestoreVersion = (ver: QuestionVersionRecord) => {
    const timestampStr = ver.createdAt || ver.timestamp;
    if (confirm(`Restore question state from version created on ${new Date(timestampStr).toLocaleString()}?`)) {
      const snap = ver.previousSnapshot;
      setQuestionText(snap.question);
      setOptionA(snap.options[0] || '');
      setOptionB(snap.options[1] || '');
      setOptionC(snap.options[2] || '');
      setOptionD(snap.options[3] || '');
      setCorrectAnswer(snap.correctAnswer);
      setExplanation(snap.explanation || '');
      setDifficulty(snap.difficulty);
      setTopicId(snap.topicId);
      setQuizId(snap.quizId || '');
      setSourceTitle(snap.source || '');
      setSourceUrl(snap.sourceUrl || '');
      setSourcePdf(snap.sourcePdf || '');
      setSourcePage(parseInt(String(snap.sourcePage)) || 1);
      setActiveTab('editor');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/65 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#ebd4d9] overflow-hidden my-6">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#2b0c15] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-white/10 text-amber-300">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/10 text-amber-200">
                  ID: {question.id}
                </span>
                <span className="text-[11px] font-semibold text-rose-200">
                  Topic: {question.topicId}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight mt-0.5">
                Question Editor & Audit Trail
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-200 bg-stone-50 text-xs">
          <button
            onClick={() => setActiveTab('editor')}
            className={`py-2 px-4 font-bold border-b-2 transition min-h-[40px] ${
              activeTab === 'editor'
                ? 'border-[#800020] text-[#800020]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Question Fields Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2 px-4 font-bold border-b-2 transition min-h-[40px] flex items-center gap-1 ${
              activeTab === 'preview'
                ? 'border-[#800020] text-[#800020]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Live Student Preview
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-4 font-bold border-b-2 transition min-h-[40px] flex items-center gap-1 ${
              activeTab === 'history'
                ? 'border-[#800020] text-[#800020]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Version History ({versionHistory.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* TAB 1: FULL FIELD EDITOR */}
          {activeTab === 'editor' && (
            <form onSubmit={handleSave} className="space-y-5">
              {/* Duplicate Warning Alert */}
              {potentialDuplicates.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Potential Duplicate Warning: </span>
                    Found {potentialDuplicates.length} question(s) with similar phrasing:
                    <ul className="list-disc list-inside mt-1 font-mono text-[11px]">
                      {potentialDuplicates.slice(0, 2).map(d => (
                        <li key={d.id}>{d.id}: "{d.question.substring(0, 60)}..."</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Question Statement */}
              <div>
                <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                  Question Text <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm font-medium focus:ring-2 focus:ring-[#800020]/20"
                  required
                />
              </div>

              {/* 4 MCQ Options with Correct Radio Selection */}
              <div>
                <label className="block text-xs font-bold text-[#2b0c15] mb-2">
                  Options & Correct Answer Selection <span className="text-rose-600">*</span>
                  <span className="text-[11px] font-normal text-stone-500 ml-2">
                    (Select the radio button next to the single correct option)
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option A */}
                  <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${correctAnswer === 0 ? 'bg-emerald-50/60 border-emerald-400' : 'bg-stone-50 border-stone-200'}`}>
                    <input
                      type="radio"
                      name="correctAnswerSelect"
                      checked={correctAnswer === 0}
                      onChange={() => setCorrectAnswer(0)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs font-black text-stone-600">A</span>
                    <input
                      type="text"
                      value={optionA}
                      onChange={e => setOptionA(e.target.value)}
                      placeholder="Option A text"
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-medium focus:bg-white"
                      required
                    />
                  </div>

                  {/* Option B */}
                  <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${correctAnswer === 1 ? 'bg-emerald-50/60 border-emerald-400' : 'bg-stone-50 border-stone-200'}`}>
                    <input
                      type="radio"
                      name="correctAnswerSelect"
                      checked={correctAnswer === 1}
                      onChange={() => setCorrectAnswer(1)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs font-black text-stone-600">B</span>
                    <input
                      type="text"
                      value={optionB}
                      onChange={e => setOptionB(e.target.value)}
                      placeholder="Option B text"
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-medium focus:bg-white"
                      required
                    />
                  </div>

                  {/* Option C */}
                  <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${correctAnswer === 2 ? 'bg-emerald-50/60 border-emerald-400' : 'bg-stone-50 border-stone-200'}`}>
                    <input
                      type="radio"
                      name="correctAnswerSelect"
                      checked={correctAnswer === 2}
                      onChange={() => setCorrectAnswer(2)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs font-black text-stone-600">C</span>
                    <input
                      type="text"
                      value={optionC}
                      onChange={e => setOptionC(e.target.value)}
                      placeholder="Option C text"
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-medium focus:bg-white"
                      required
                    />
                  </div>

                  {/* Option D */}
                  <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${correctAnswer === 3 ? 'bg-emerald-50/60 border-emerald-400' : 'bg-stone-50 border-stone-200'}`}>
                    <input
                      type="radio"
                      name="correctAnswerSelect"
                      checked={correctAnswer === 3}
                      onChange={() => setCorrectAnswer(3)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs font-black text-stone-600">D</span>
                    <input
                      type="text"
                      value={optionD}
                      onChange={e => setOptionD(e.target.value)}
                      placeholder="Option D text"
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-medium focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Detailed Explanation */}
              <div>
                <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                  Detailed Explanation & Memory Mnemonics
                </label>
                <textarea
                  rows={3}
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                  placeholder="Explain why the answer is correct with official references..."
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#800020]/20"
                />
              </div>

              {/* Hierarchy Assignment: Topic & Quiz */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div>
                  <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                    Assign to Topic
                  </label>
                  <select
                    value={topicId}
                    onChange={e => setTopicId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium min-h-[44px]"
                  >
                    {topics.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                    Assign to Quiz
                  </label>
                  <select
                    value={quizId}
                    onChange={e => setQuizId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium min-h-[44px]"
                  >
                    <option value="">Unassigned Pool</option>
                    {availableQuizzes.map(q => (
                      <option key={q.id} value={q.id}>{q.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                    Difficulty Rating
                  </label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as Difficulty)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium min-h-[44px]"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Source & Research Metadata */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <span className="text-xs font-bold text-[#800020] uppercase tracking-wider block">
                  Authoritative Official Source & Research Metadata
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Source Title / Ministry
                    </label>
                    <input
                      type="text"
                      value={sourceTitle}
                      onChange={e => setSourceTitle(e.target.value)}
                      placeholder="e.g. PIB / RBI Master Circular"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs min-h-[40px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Official Source URL
                    </label>
                    <input
                      type="url"
                      value={sourceUrl}
                      onChange={e => setSourceUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono min-h-[40px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Source PDF Filename
                    </label>
                    <input
                      type="text"
                      value={sourcePdf}
                      onChange={e => setSourcePdf(e.target.value)}
                      placeholder="e.g. static_gk_national_parks.pdf"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs min-h-[40px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      PDF Page Reference
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={sourcePage}
                      onChange={e => setSourcePage(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs min-h-[40px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Verification Date
                    </label>
                    <input
                      type="date"
                      value={verificationDate}
                      onChange={e => setVerificationDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs min-h-[40px]"
                    />
                  </div>
                </div>
              </div>

              {/* Status and Change Reason */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-[#2b0c15]">
                    Publication Status:
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsDraft(!isDraft)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      isDraft
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    {isDraft ? 'Draft (Admin Only)' : 'Published (Live)'}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                    Audit Trail Reason for Modification <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={changeReason}
                    onChange={e => setChangeReason(e.target.value)}
                    placeholder="e.g. Updated explanation and verified with UNESCO decision 45"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#800020]/20 min-h-[40px]"
                    required
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Recorded in question version history. Does not overwrite student past attempt snapshots.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#5c0017] transition flex items-center gap-1.5 shadow-md active:scale-95 min-h-[44px]"
                >
                  <Save className="w-4 h-4" /> Save Question & Commit Version
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: LIVE STUDENT PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-rose-50 text-[#800020] text-xs font-bold flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Live Student Preview: Exactly how this question renders on mobile and desktop
              </div>

              <div className="p-6 rounded-2xl bg-white border-2 border-[#ebd4d9] shadow-md space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-bold text-[#800020]">Topic: {topicId}</span>
                  <span className="capitalize px-2 py-0.5 rounded bg-stone-100 font-semibold">{difficulty}</span>
                </div>

                <div className="text-base sm:text-lg font-bold text-[#2b0c15]">
                  {questionText || 'Enter question statement...'}
                </div>

                <div className="space-y-2 text-sm">
                  {[optionA, optionB, optionC, optionD].map((opt, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center gap-3 ${
                        idx === correctAnswer
                          ? 'border-emerald-400 bg-emerald-50/70 text-emerald-950 font-bold'
                          : 'border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                        idx === correctAnswer ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{opt || `Option ${String.fromCharCode(65 + idx)}`}</span>
                      {idx === correctAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                  ))}
                </div>

                {explanation && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                    <span className="font-bold">Official Explanation: </span>
                    {explanation}
                  </div>
                )}

                {sourceTitle && (
                  <div className="text-xs text-stone-500 flex items-center gap-2">
                    <span>Source: {sourceTitle} {sourcePage ? `(Page ${sourcePage})` : ''}</span>
                    {sourceUrl && (
                      <a href={sourceUrl} target="_blank" rel="noreferrer" className="text-[#800020] underline inline-flex items-center gap-0.5">
                        Link <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: VERSION HISTORY & AUDIT TRAIL */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-bold text-[#2b0c15]">Audit Trail Logs</span>
                <span>{versionHistory.length} Recorded Modifications</span>
              </div>

              {versionHistory.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                  <History className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                  No prior versions recorded yet. Edits made in this studio will generate immutable version records.
                </div>
              ) : (
                <div className="space-y-3">
                  {versionHistory.map(ver => (
                    <div
                      key={ver.id}
                      className="p-4 rounded-xl border border-stone-200 bg-white shadow-sm space-y-2 hover:border-[#800020]/40 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#800020]">
                            Version #{ver.versionNumber ?? ver.version ?? 1}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            by {ver.adminName} on {new Date(ver.createdAt || ver.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRestoreVersion(ver)}
                          className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-[#800020] hover:text-white text-stone-700 text-xs font-semibold transition flex items-center gap-1 min-h-[36px]"
                        >
                          <RotateCcw className="w-3 h-3" /> Restore Snapshot
                        </button>
                      </div>

                      <div className="text-xs text-stone-700">
                        <span className="font-semibold">Reason:</span> {ver.reason}
                      </div>

                      <div className="p-2.5 rounded-lg bg-stone-50 text-[11px] font-mono text-stone-600 line-clamp-2">
                        {ver.previousSnapshot.question}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
