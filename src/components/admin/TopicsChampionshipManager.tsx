import React, { useState } from 'react';
import {
  Layers,
  Lock,
  Unlock,
  CheckCircle2,
  Award,
  Eye,
  Check,
  X,
  BookOpen,
  Plus,
  Play,
  ArrowRightLeft,
  FileCheck,
  AlertCircle,
  Edit3
} from 'lucide-react';
import {
  TOPIC_CATEGORIES,
  getQuestionsForTopic,
  getTopicById,
  getQuizzesForTopic,
  createDraftQuiz,
  publishQuiz,
  unpublishQuiz,
  moveQuestionToQuiz,
  getQuestionsForQuiz
} from '../../data/topics';
import type { TopicQuiz, TopicQuestion } from '../../types/quiz';
import { getQuizForDay, validateQuizForPublishing } from '../../data/quizzes';
import { DAILY_SCHEDULE, isDayUnlocked, setDayAdminOverride } from '../../utils/schedule';
import { Card3D } from '../ui/Card3D';
import { QuestionEditorModal } from './QuestionEditorModal';
import { TopicEditorModal } from './TopicEditorModal';
import { QuizEditorModal } from './QuizEditorModal';

interface TopicsChampionshipManagerProps {
  completedDays: string[];
  onRefreshData: () => Promise<void>;
  onPreviewQuiz?: (quizId: string) => void;
}

export const TopicsChampionshipManager: React.FC<TopicsChampionshipManagerProps> = ({
  completedDays,
  onRefreshData,
  onPreviewQuiz
}) => {
  const [subTab, setSubTab] = useState<'topics' | 'championship'>('topics');
  const [inspectingTopicId, setInspectingTopicId] = useState<string | null>(null);
  const [inspectingQuizId, setInspectingQuizId] = useState<string | null>(null);
  const [addingQuizTopicId, setAddingQuizTopicId] = useState<string | null>(null);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizCount, setNewQuizCount] = useState<number>(10);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [movingQuestionId, setMovingQuestionId] = useState<string | null>(null);
  const [targetQuizId, setTargetQuizId] = useState<string>('');
  const [versionCounter, setVersionCounter] = useState(0);
  const [editingQuestion, setEditingQuestion] = useState<TopicQuestion | null>(null);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<TopicQuiz | null>(null);

  const inspectedTopic = inspectingTopicId ? getTopicById(inspectingTopicId) : null;
  const inspectedQuestions = inspectingTopicId ? getQuestionsForTopic(inspectingTopicId) : [];
  const activeQuizQuestions = inspectingQuizId ? getQuestionsForQuiz(inspectingQuizId) : [];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleUnlock = async (quizId: string, currentUnlocked: boolean) => {
    try {
      setDayAdminOverride(quizId, {
        forceUnlocked: !currentUnlocked,
        forceLocked: currentUnlocked
      });
      triggerToast(`Updated unlock status for ${quizId.toUpperCase()}`);
      await onRefreshData();
    } catch (err) {
      alert(`Failed to update override: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleTogglePublishQuiz = async (quiz: TopicQuiz) => {
    try {
      if (quiz.isPublished) {
        unpublishQuiz(quiz.id);
        triggerToast(`Unpublished "${quiz.title}". Set to Draft.`);
      } else {
        publishQuiz(quiz.id);
        triggerToast(`Published "${quiz.title}". Now active for students.`);
      }
      setVersionCounter(v => v + 1);
      await onRefreshData();
    } catch (err) {
      alert(`Failed to toggle publish status: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleCreateDraftQuiz = async (topicId: string) => {
    if (!newQuizTitle.trim()) {
      alert('Please enter a quiz title.');
      return;
    }
    try {
      const created = createDraftQuiz(topicId, newQuizTitle.trim(), newQuizCount || 10);
      triggerToast(`Created draft quiz: "${created.title}" (Status: Draft)`);
      setAddingQuizTopicId(null);
      setNewQuizTitle('');
      setNewQuizCount(10);
      setVersionCounter(v => v + 1);
      await onRefreshData();
    } catch (err) {
      alert(`Failed to create quiz: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleMoveQuestion = (questionId: string, toQuizId: string) => {
    if (!toQuizId) return;
    const ok = moveQuestionToQuiz(questionId, toQuizId);
    if (ok) {
      triggerToast(`Question moved to ${toQuizId}`);
      setMovingQuestionId(null);
      setTargetQuizId('');
      setVersionCounter(v => v + 1);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" key={versionCounter}>
      {/* Top Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#1e3a5f]" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Topics & Championship Studio
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-[#800020] border border-slate-200">
              Multi-Quiz Core
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage the 4-tier curriculum: Subject → Topic → Multiple Quizzes → Questions. Draft-by-default publishing engine.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200">
          <button
            onClick={() => setSubTab('topics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'topics'
                ? 'bg-[#1e3a5f] text-white shadow-soft'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Topics & Quizzes ({TOPIC_CATEGORIES.length})</span>
          </button>
          <button
            onClick={() => setSubTab('championship')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'championship'
                ? 'bg-[#1e3a5f] text-white shadow-soft'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Championship Tests (2)</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SUB-VIEW 1: TOPIC WORKSPACES & MULTIPLE QUIZZES */}
      {subTab === 'topics' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {TOPIC_CATEGORIES.map(topic => {
              const allTopicQuestions = getQuestionsForTopic(topic.id);
              // Include drafts for Admin
              const topicQuizzes = getQuizzesForTopic(topic.id, true);

              return (
                <Card3D key={topic.id} intensity={4} depth={6} className="h-full">
                  <div className="h-full p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#16050e]/95 to-[#0e0208]/95 border border-slate-200 shadow-lg flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-[#800020] border border-slate-200">
                          Topic #{topic.id}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                            {topicQuizzes.length} Quizzes
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#1a0712] px-2.5 py-0.5 rounded-full border border-slate-200">
                            {allTopicQuestions.length} Questions
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {topic.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {topic.description}
                        </p>
                      </div>

                      {/* Quizzes List under this Topic */}
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[#800020]">
                          <span>Quizzes in Topic ({topicQuizzes.length})</span>
                          <button
                            onClick={() => {
                              setAddingQuizTopicId(topic.id);
                              setNewQuizTitle(`Quiz ${topicQuizzes.length + 1} – ${topic.title} Part ${topicQuizzes.length + 1}`);
                              setNewQuizCount(10);
                            }}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-[#3d0d24] text-white text-[10px] font-bold flex items-center gap-1 transition-colors border border-slate-200 cursor-pointer"
                          >
                            <Plus className="w-3 h-3 text-[#800020]" />
                            <span>Add Quiz</span>
                          </button>
                        </div>

                        {topicQuizzes.length === 0 ? (
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-neutral-500">
                            No quizzes created yet. Click "Add Quiz" to create a draft quiz.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {topicQuizzes.map(quiz => {
                              const questionsInQuiz = getQuestionsForQuiz(quiz.id);

                              return (
                                <div
                                  key={quiz.id}
                                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#3d0d24] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                                >
                                  <div className="space-y-0.5 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-slate-900 text-xs truncate max-w-[240px]">
                                        {quiz.title}
                                      </span>
                                      {quiz.isPublished ? (
                                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-800/40">
                                          Published
                                        </span>
                                      ) : (
                                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-800/40">
                                          Draft
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                      <span>{questionsInQuiz.length} Questions</span>
                                      <span>•</span>
                                      <span className="text-[10px] font-mono text-slate-500">{quiz.id}</span>
                                    </div>
                                  </div>

                                  {/* Quiz Actions */}
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      onClick={() => handleTogglePublishQuiz(quiz)}
                                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                                        quiz.isPublished
                                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300 hover:bg-emerald-900/60'
                                          : 'bg-amber-950/40 border-amber-800 text-amber-300 hover:bg-amber-900/60'
                                      }`}
                                      title={quiz.isPublished ? 'Unpublish to Draft' : 'Publish to Students'}
                                    >
                                      {quiz.isPublished ? 'Published' : 'Publish'}
                                    </button>

                                    <button
                                      onClick={() => setInspectingQuizId(quiz.id)}
                                      className="p-1.5 rounded-lg bg-[#200612] hover:bg-[#300a1c] text-[#800020] border border-slate-200 transition-colors cursor-pointer"
                                      title="Inspect Questions"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>

                                    {onPreviewQuiz && (
                                      <button
                                        onClick={() => onPreviewQuiz(quiz.id)}
                                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#3d0d24] text-white border border-slate-200 transition-colors cursor-pointer"
                                        title="Preview Quiz"
                                      >
                                        <Play className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Metadata & Topic Bank Inspection */}
                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Subtopics: {topic.subtopics.length}
                      </span>
                      <button
                        onClick={() => setInspectingTopicId(topic.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#3a0d20] text-[#800020] hover:text-slate-900 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Inspect Topic Bank</span>
                      </button>
                    </div>
                  </div>
                </Card3D>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: CHAMPIONSHIP ASSESSMENTS */}
      {subTab === 'championship' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DAILY_SCHEDULE.map(item => {
              const quiz = getQuizForDay(item.quizId);
              const unlocked = isDayUnlocked(item.quizId, completedDays);
              const validation = validateQuizForPublishing(quiz);

              return (
                <Card3D key={item.quizId} intensity={8} depth={10}>
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#16050e]/95 to-[#0e0208]/95 border border-slate-200 shadow-lg space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-amber-400" />
                          <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{item.theme}</p>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                        {validation.isValid ? '100% Validated' : 'Issues Detected'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Questions</div>
                        <div className="text-base font-bold text-slate-900">{quiz.questions.length}</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] uppercase font-bold text-slate-500">States / UTs</div>
                        <div className="text-base font-bold text-slate-900">30</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Status</div>
                        <div className={`text-xs font-black mt-1 ${unlocked ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {unlocked ? 'Unlocked' : 'Locked'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <button
                        onClick={() => handleToggleUnlock(item.quizId, unlocked)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                          unlocked
                            ? 'bg-amber-950/40 text-amber-300 border border-amber-800/60 hover:bg-amber-900/60'
                            : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/60'
                        }`}
                      >
                        {unlocked ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Lock Test</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Unlock Now</span>
                          </>
                        )}
                      </button>

                      {onPreviewQuiz && (
                        <button
                          onClick={() => onPreviewQuiz(item.quizId)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#3a0d20] text-white text-xs font-bold transition-colors border border-slate-200 cursor-pointer"
                        >
                          Preview Test →
                        </button>
                      )}
                    </div>
                  </div>
                </Card3D>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE DRAFT QUIZ MODAL (DRAFT BY DEFAULT) */}
      {addingQuizTopicId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#1e3a5f]" />
                <span>Create New Quiz (Draft by Default)</span>
              </h3>
              <button
                onClick={() => setAddingQuizTopicId(null)}
                className="text-slate-500 hover:text-slate-900 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Quiz Title</label>
                <input
                  type="text"
                  value={newQuizTitle}
                  onChange={e => setNewQuizTitle(e.target.value)}
                  placeholder="e.g. Quiz 5 – National Parks Part 5"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e0208] border border-slate-200 text-white focus:outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Target Question Count</label>
                <input
                  type="number"
                  min="5"
                  max="25"
                  value={newQuizCount}
                  onChange={e => setNewQuizCount(parseInt(e.target.value, 10) || 10)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e0208] border border-slate-200 text-white focus:outline-none focus:border-[#1e3a5f]"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Target 10–15 questions recommended.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-[11px] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Draft Safety Guard:</strong> Newly created quizzes remain in Draft status until explicitly reviewed and published by Admin Sanju. Students will not see this quiz until published.
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setAddingQuizTopicId(null)}
                className="px-3.5 py-2 rounded-xl bg-[#1e0813] text-slate-700 hover:text-slate-900 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateDraftQuiz(addingQuizTopicId)}
                className="px-4 py-2 rounded-xl bg-[#1e3a5f] hover:bg-[#102a43] text-white text-xs font-bold shadow-soft cursor-pointer"
              >
                Create Draft Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ QUESTIONS INSPECTOR MODAL */}
      {inspectingQuizId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-3xl max-h-[85vh] flex flex-col p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#1e3a5f]" />
                  <span>Quiz Questions: {inspectingQuizId}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeQuizQuestions.length} verified questions assigned to this quiz
                </p>
              </div>
              <button
                onClick={() => setInspectingQuizId(null)}
                className="text-slate-500 hover:text-slate-900 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {activeQuizQuestions.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                  No questions assigned to this quiz yet. Move questions from the Topic Bank.
                </div>
              ) : (
                activeQuizQuestions.map((q, idx) => (
                  <div key={q.id} className="p-3.5 rounded-2xl bg-[#0e0208] border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#800020]">Q{idx + 1}. [{q.id}]</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500">Verified: {q.lastVerifiedDate}</span>
                        <button
                          onClick={() => setEditingQuestion(q)}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-[#3d0d24] text-[#800020] border border-slate-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-2.5 h-2.5" /> Edit
                        </button>
                      </div>
                    </div>

                    <p className="font-bold text-white text-xs sm:text-sm">{q.question}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-xl border text-xs flex items-center justify-between ${
                            q.correctAnswer === oIdx
                              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200 font-bold'
                              : 'bg-white border-slate-200 text-slate-300'
                          }`}
                        >
                          <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                          {q.correctAnswer === oIdx && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                      ))}
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-500">
                      <strong className="text-slate-900">Explanation: </strong>
                      {q.explanation}
                      {q.source && (
                        <div className="text-[10px] text-[#800020] mt-1">
                          Source: {q.source} {q.sourcePage ? `(Page ${q.sourcePage})` : ''}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end border-t border-slate-200">
              <button
                onClick={() => setInspectingQuizId(null)}
                className="px-4 py-2 rounded-xl bg-[#1e0813] text-white text-xs font-bold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC BANK INSPECTOR & QUESTION MOVER MODAL */}
      {inspectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-4xl max-h-[85vh] flex flex-col p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#1e3a5f]" />
                  <span>Topic Bank: {inspectedTopic.title}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {inspectedQuestions.length} verified questions with official citations and cross-quiz allocations
                </p>
              </div>
              <button
                onClick={() => {
                  setInspectingTopicId(null);
                  setMovingQuestionId(null);
                }}
                className="text-slate-500 hover:text-slate-900 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {inspectedQuestions.map((q, idx) => {
                const assignedQuizId = q.quizId || 'Unassigned';
                const topicQuizzes = getQuizzesForTopic(inspectedTopic.id, true);

                return (
                  <div key={q.id} className="p-3.5 rounded-2xl bg-[#0e0208] border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#800020]">Q{idx + 1}. [{q.subtopicId}]</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40">
                          {assignedQuizId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500">Verified: {q.lastVerifiedDate}</span>
                        <button
                          onClick={() => setEditingQuestion(q)}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-[#3d0d24] text-[#800020] border border-slate-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            setMovingQuestionId(movingQuestionId === q.id ? null : q.id);
                            setTargetQuizId(topicQuizzes[0]?.id || '');
                          }}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-[#3d0d24] text-[#800020] border border-slate-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          <span>Move Quiz</span>
                        </button>
                      </div>
                    </div>

                    {/* Question Mover Drawer */}
                    {movingQuestionId === q.id && (
                      <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-2">
                        <span className="text-[11px] text-slate-700 font-bold shrink-0">
                          Assign to:
                        </span>
                        <select
                          value={targetQuizId}
                          onChange={e => setTargetQuizId(e.target.value)}
                          className="px-2 py-1 rounded-lg bg-[#0e0208] border border-slate-200 text-white text-xs flex-1"
                        >
                          {topicQuizzes.map(qz => (
                            <option key={qz.id} value={qz.id}>
                              {qz.title} ({qz.id})
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleMoveQuestion(q.id, targetQuizId)}
                          className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                        >
                          Confirm Move
                        </button>
                      </div>
                    )}

                    <p className="font-bold text-white text-xs sm:text-sm">{q.question}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-xl border text-xs flex items-center justify-between ${
                            q.correctAnswer === oIdx
                              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200 font-bold'
                              : 'bg-white border-slate-200 text-slate-300'
                          }`}
                        >
                          <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                          {q.correctAnswer === oIdx && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                      ))}
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-500">
                      <strong className="text-slate-900">Explanation: </strong>
                      {q.explanation}
                      {q.source && (
                        <div className="text-[10px] text-[#800020] mt-1">
                          Source: {q.source} {q.sourcePage ? `(Page ${q.sourcePage})` : ''}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end border-t border-slate-200">
              <button
                onClick={() => {
                  setInspectingTopicId(null);
                  setMovingQuestionId(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#1e0813] text-white text-xs font-bold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Individual Question Editor Modal with Audit Trail */}
      {editingQuestion && (
        <QuestionEditorModal
          isOpen={true}
          onClose={() => setEditingQuestion(null)}
          question={editingQuestion}
          onSaveQuestion={(updated, reason) => {
            triggerToast(`Question ${updated.id} saved! Reason: ${reason}`);
            setEditingQuestion(null);
            setVersionCounter(v => v + 1);
            void onRefreshData();
          }}
          adminId="sanju-admin"
          adminName="Sanju"
        />
      )}

      {/* Topic Architecture Editor Modal */}
      {editingTopicId && (
        <TopicEditorModal
          isOpen={true}
          onClose={() => setEditingTopicId(null)}
          initialTopicId={editingTopicId}
          onSaveTopic={(data) => {
            triggerToast(`Topic "${data.title}" updated.`);
            setEditingTopicId(null);
            void onRefreshData();
          }}
        />
      )}

      {/* Quiz Module Editor Modal */}
      {editingQuiz && (
        <QuizEditorModal
          isOpen={true}
          onClose={() => setEditingQuiz(null)}
          initialQuiz={editingQuiz}
          onSaveQuiz={(data) => {
            triggerToast(`Quiz "${data.title}" saved.`);
            setEditingQuiz(null);
            void onRefreshData();
          }}
        />
      )}
    </div>
  );
};
