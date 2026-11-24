import React, { useState } from 'react';
import {
  Layers,
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { getTopicsList, TOPIC_CATEGORIES } from '../../data/topics';
import type { TopicCategory } from '../../types/quiz';

interface TopicEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTopic: (topicData: any) => void;
  initialTopicId?: string;
}

export const TopicEditorModal: React.FC<TopicEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveTopic,
  initialTopicId
}) => {
  const allTopics = getTopicsList();
  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopicId || allTopics[0]?.id || 'static-gk');

  const activeTopic = allTopics.find(t => t.id === selectedTopicId) || allTopics[0];

  const [title, setTitle] = useState<string>(activeTopic?.title || '');
  const [description, setDescription] = useState<string>(activeTopic?.description || '');
  const [iconName, setIconName] = useState<string>(activeTopic?.iconName || 'Award');
  const [category, setCategory] = useState<TopicCategory>(activeTopic?.category || 'general');
  const [displayOrder, setDisplayOrder] = useState<number>(activeTopic?.order || 1);
  const [isPublished, setIsPublished] = useState<boolean>(activeTopic?.isPublished ?? true);
  const [learningInstructions, setLearningInstructions] = useState<string>(
    activeTopic?.learningInstructions || 'Read source references and attempt all 10-15 multiple choice questions.'
  );
  const [sourcesText, setSourcesText] = useState<string>(
    (activeTopic?.sources || []).map(s => `${s.title}|${s.url || ''}`).join('\n')
  );

  if (!isOpen) return null;

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopicId(topicId);
    const t = allTopics.find(item => item.id === topicId);
    if (t) {
      setTitle(t.title);
      setDescription(t.description);
      setIconName(t.iconName || 'Award');
      setCategory(t.category);
      setDisplayOrder(t.order || 1);
      setIsPublished(t.isPublished);
      setLearningInstructions(t.learningInstructions || 'Read source references and attempt all questions.');
      setSourcesText((t.sources || []).map(s => `${s.title}|${s.url || ''}`).join('\n'));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse sources text: Title|URL
    const parsedSources = sourcesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const parts = line.split('|');
        return {
          title: parts[0]?.trim() || 'Official Source',
          url: parts[1]?.trim() || undefined
        };
      });

    onSaveTopic({
      id: selectedTopicId,
      title: title.trim(),
      description: description.trim(),
      iconName,
      category,
      order: displayOrder,
      isPublished,
      learningInstructions: learningInstructions.trim(),
      sources: parsedSources
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#ebd4d9] overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#2b0c15] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/10 text-amber-300">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Topic Architecture Editor</h2>
              <p className="text-xs text-rose-200">Point-by-point management of curriculum topics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Select Topic to Edit */}
          <div>
            <label className="block text-xs font-bold text-[#2b0c15] mb-1">
              Select Topic to Edit
            </label>
            <select
              value={selectedTopicId}
              onChange={e => handleTopicSelect(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-[#800020] focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
            >
              {allTopics.map(t => (
                <option key={t.id} value={t.id}>
                  {t.order}. {t.title} ({t.category})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                Topic Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-semibold focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TopicCategory)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-medium focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
              >
                {TOPIC_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.category}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2b0c15] mb-1">
              Description / Scope
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#800020]/20"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                Display Order
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={displayOrder}
                onChange={e => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-bold min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                Icon Name
              </label>
              <input
                type="text"
                value={iconName}
                onChange={e => setIconName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                Visibility
              </label>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 min-h-[44px] ${
                  isPublished
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-stone-300 bg-stone-100 text-stone-600'
                }`}
              >
                {isPublished ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-stone-500" />}
                {isPublished ? 'Published (Live)' : 'Draft (Hidden)'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2b0c15] mb-1">
              Learning Instructions for Students
            </label>
            <textarea
              rows={2}
              value={learningInstructions}
              onChange={e => setLearningInstructions(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#800020]/20"
              placeholder="e.g. Master the state locations, key fauna, and river crossings before testing."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2b0c15] mb-1">
              Authoritative Official Sources (One per line: Title|URL)
            </label>
            <textarea
              rows={3}
              value={sourcesText}
              onChange={e => setSourcesText(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 text-xs font-mono focus:ring-2 focus:ring-[#800020]/20"
              placeholder="PIB MoEFCC Press Release|https://pib.gov.in"
            />
            <span className="text-[10px] text-stone-400">
              Format each line as: Source Name | Optional URL
            </span>
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
              <Save className="w-3.5 h-3.5" /> Save Topic Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
