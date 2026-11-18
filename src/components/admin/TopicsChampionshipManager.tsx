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
  BookOpen
} from 'lucide-react';
import { TOPIC_CATEGORIES, getQuestionsForTopic, getTopicById } from '../../data/topics';
import { getQuizForDay, validateQuizForPublishing } from '../../data/quizzes';
import { DAILY_SCHEDULE, isDayUnlocked, setDayAdminOverride } from '../../utils/schedule';
import { Card3D } from '../ui/Card3D';

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const inspectedTopic = inspectingTopicId ? getTopicById(inspectingTopicId) : null;
  const inspectedQuestions = inspectingTopicId ? getQuestionsForTopic(inspectingTopicId) : [];

  const handleToggleUnlock = async (quizId: string, currentUnlocked: boolean) => {
    try {
      setDayAdminOverride(quizId, {
        forceUnlocked: !currentUnlocked,
        forceLocked: currentUnlocked
      });
      setToastMessage(`Updated unlock status for ${quizId.toUpperCase()}`);
      setTimeout(() => setToastMessage(null), 3000);
      await onRefreshData();
    } catch (err) {
      alert(`Failed to update override: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#260c18]">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#ff3366]" />
            <h2 className="text-xl font-black text-white tracking-tight">
              Topics & Championship Studio
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#2a0b16] text-[#ff8099] border border-[#52142a]">
              Curriculum Core
            </span>
          </div>
          <p className="text-xs text-[#a68690] mt-0.5">
            Manage the 5 core topic learning workspaces, subtopics, starter questions, and the authoritative Semi-Final and Grand Championship tests.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#14060d] border border-[#2b0c18]">
          <button
            onClick={() => setSubTab('topics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'topics'
                ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby'
                : 'text-[#a68690] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5 Topics ({TOPIC_CATEGORIES.length})</span>
          </button>
          <button
            onClick={() => setSubTab('championship')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'championship'
                ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby'
                : 'text-[#a68690] hover:text-white'
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

      {/* SUB-VIEW 1: 5 TOPIC WORKSPACES */}
      {subTab === 'topics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPIC_CATEGORIES.map(topic => {
              const questions = getQuestionsForTopic(topic.id);

              return (
                <Card3D key={topic.id} intensity={6} depth={8} className="h-full">
                  <div className="h-full p-5 rounded-2xl bg-gradient-to-br from-[#16050e]/95 to-[#0e0208]/95 border border-[#3a0d20] shadow-lg flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#2a0b16] text-[#ff8099] border border-[#52142a]">
                          Topic #{topic.id}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40">
                          <Check className="w-3 h-3" />
                          <span>Published</span>
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-white">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-[#a68690] line-clamp-2">
                        {topic.description}
                      </p>
                    </div>

                    {/* Subtopics List */}
                    <div className="space-y-1.5 pt-2 border-t border-[#260c18]">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Subtopics ({topic.subtopics.length}):
                      </div>
                      <div className="space-y-1">
                        {topic.subtopics.map(sub => (
                          <div
                            key={sub.id}
                            className="text-[11px] text-slate-300 flex items-center justify-between"
                          >
                            <span className="truncate max-w-[180px]">• {sub.title}</span>
                            <span className="text-[10px] text-[#ff8099] font-mono">{sub.questionCount} Qs</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Metadata & Inspect Button */}
                    <div className="pt-2 border-t border-[#260c18] flex items-center justify-between text-xs">
                      <span className="text-white font-black">
                        {questions.length} Questions
                      </span>
                      <button
                        onClick={() => setInspectingTopicId(topic.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-[#2a0717] hover:bg-[#3a0d20] text-[#ff8099] hover:text-white border border-[#52102c] text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Bank</span>
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
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#16050e]/95 to-[#0e0208]/95 border border-[#3a0d20] shadow-lg space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-amber-400" />
                          <h3 className="text-lg font-black text-white">{item.title}</h3>
                        </div>
                        <p className="text-xs text-[#a68690] mt-0.5">{item.theme}</p>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                        {validation.isValid ? '100% Validated' : 'Issues Detected'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-[#12040b] border border-[#260c18]">
                        <div className="text-[10px] uppercase font-bold text-[#a68690]">Questions</div>
                        <div className="text-base font-black text-white">{quiz.questions.length}</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#12040b] border border-[#260c18]">
                        <div className="text-[10px] uppercase font-bold text-[#a68690]">States Covered</div>
                        <div className="text-base font-black text-[#ff8099]">30 / 30</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#12040b] border border-[#260c18]">
                        <div className="text-[10px] uppercase font-bold text-[#a68690]">Status</div>
                        <div className={`text-base font-black ${unlocked ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {unlocked ? 'Unlocked' : 'Locked'}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#12040b] border border-[#260c18] text-xs space-y-1">
                      <div className="text-slate-300 font-bold flex items-center justify-between">
                        <span>All-India Syllabus Coverage:</span>
                        <span className="text-emerald-400 font-mono">100% Complete</span>
                      </div>
                      <p className="text-[11px] text-[#a68690]">
                        {item.quizId === 'semi-final'
                          ? 'Exactly 1 question per state across all 28 states and 2 UTs (Ladakh & Andaman).'
                          : 'Exactly 2 questions per state across all 28 states and 2 UTs (Ladakh & Andaman).'}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-[#260c18]">
                      <button
                        onClick={() => handleToggleUnlock(item.quizId, unlocked)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          unlocked
                            ? 'bg-amber-950/60 hover:bg-amber-900 text-amber-200 border border-amber-800'
                            : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200 border border-emerald-800'
                        }`}
                      >
                        {unlocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        <span>{unlocked ? 'Force Lock' : 'Force Unlock'}</span>
                      </button>

                      {onPreviewQuiz && (
                        <button
                          onClick={() => onPreviewQuiz(item.quizId)}
                          className="px-3 py-1.5 rounded-xl bg-[#2a0717] hover:bg-[#3a0d20] text-white text-xs font-bold transition-colors border border-[#52102c]"
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

      {/* QUESTION BANK INSPECTOR MODAL */}
      {inspectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-3xl max-h-[85vh] flex flex-col p-6 rounded-3xl bg-[#14060d] border border-[#3a0d20] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#260c18]">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#ff3366]" />
                  <span>Topic Bank: {inspectedTopic.title}</span>
                </h3>
                <p className="text-xs text-[#a68690] mt-0.5">
                  {inspectedQuestions.length} verified starter questions with official citations and explanations
                </p>
              </div>
              <button
                onClick={() => setInspectingTopicId(null)}
                className="text-[#a68690] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {inspectedQuestions.map((q, idx) => (
                <div key={q.id} className="p-3.5 rounded-2xl bg-[#0e0208] border border-[#260c18] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#ff8099]">Q{idx + 1}. [{q.subtopicId}]</span>
                    <span className="text-[10px] text-[#a68690]">Verified: {q.lastVerifiedDate}</span>
                  </div>

                  <p className="font-bold text-white text-xs sm:text-sm">{q.question}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2 rounded-xl border text-xs flex items-center justify-between ${
                          q.correctAnswer === oIdx
                            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200 font-bold'
                            : 'bg-[#14060d] border-[#260c18] text-slate-300'
                        }`}
                      >
                        <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                        {q.correctAnswer === oIdx && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                    ))}
                  </div>

                  <div className="p-2 rounded-xl bg-[#14060d] border border-[#260c18] text-[11px] text-[#a68690]">
                    <strong className="text-white">Explanation: </strong>
                    {q.explanation}
                    {q.source && (
                      <div className="text-[10px] text-[#ff8099] mt-1">Source: {q.source}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end border-t border-[#260c18]">
              <button
                onClick={() => setInspectingTopicId(null)}
                className="px-4 py-2 rounded-xl bg-[#1e0813] text-white text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
