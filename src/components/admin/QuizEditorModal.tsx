import React, { useState } from 'react';
import {
  Save,
  X,
  Play,
  Eye,
  EyeOff
} from 'lucide-react';
import { getTopicsList } from '../../data/topics';
import type { TopicQuiz, Difficulty } from '../../types/quiz';

interface QuizEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveQuiz: (quizData: Partial<TopicQuiz>) => void;
  initialQuiz?: TopicQuiz | null;
}

export const QuizEditorModal: React.FC<QuizEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveQuiz,
  initialQuiz
}) => {
  const topics = getTopicsList();

  const [topicId, setTopicId] = useState<string>(initialQuiz?.topicId || topics[0]?.id || 'static-gk');
  const [quizId, setQuizId] = useState<string>(initialQuiz?.id || '');
  const [title, setTitle] = useState<string>(initialQuiz?.title || '');
  const [description, setDescription] = useState<string>(initialQuiz?.description || '');
  const [order] = useState<number>(initialQuiz?.order || 1);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialQuiz?.difficulty || 'medium');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(initialQuiz?.timeLimitMinutes || 15);
  const [passingScore, setPassingScore] = useState<number>(initialQuiz?.passingScore || 50);
  const [isPublished, setIsPublished] = useState<boolean>(initialQuiz?.isPublished ?? false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Quiz title is required.');
      return;
    }

    const finalId = quizId.trim() || `${topicId}-quiz-${String(order).padStart(2, '0')}`;

    onSaveQuiz({
      id: finalId,
      topicId,
      title: title.trim(),
      description: description.trim(),
      order,
      difficulty,
      timeLimitMinutes,
      passingScore,
      isPublished
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#ebd4d9] overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#2b0c15] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/10 text-amber-300">
              <Play className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Quiz Module Editor</h2>
              <p className="text-xs text-rose-200">Configure quiz title, difficulty, time limit, and publish status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                Parent Topic
              </label>
              <select
                value={topicId}
                onChange={e => setTopicId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-medium focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
              >
                {topics.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                Quiz Identifier
              </label>
              <input
                type="text"
                value={quizId}
                onChange={e => setQuizId(e.target.value)}
                placeholder="e.g. static-gk-quiz-01"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-mono focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2b0c15] mb-1">
              Quiz Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Quiz 1 – Northern & Western Parks"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-bold focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2b0c15] mb-1">
              Description / Coverage
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What subtopics or questions are covered in this quiz..."
              className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#800020]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as Difficulty)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm min-h-[44px]"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                Time Limit (Mins)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={timeLimitMinutes}
                onChange={e => setTimeLimitMinutes(parseInt(e.target.value) || 15)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                Passing Score (%)
              </label>
              <input
                type="number"
                min={10}
                max={100}
                value={passingScore}
                onChange={e => setPassingScore(parseInt(e.target.value) || 50)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2b0c15] mb-1">
              Publishing State
            </label>
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 min-h-[44px] ${
                isPublished
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : 'border-amber-300 bg-amber-50 text-amber-800'
              }`}
            >
              {isPublished ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-amber-600" />}
              {isPublished ? 'Published (Live for Students)' : 'Draft (Admin Only Review)'}
            </button>
            <p className="text-[10px] text-stone-400 mt-1">
              Newly created quizzes should remain in Draft until reviewed.
            </p>
          </div>

          {/* Action buttons */}
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
              <Save className="w-3.5 h-3.5" /> Save Quiz Module
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
