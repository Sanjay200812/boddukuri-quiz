import React, { useState, useMemo } from 'react';
import {
  Zap,
  RotateCw,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Shuffle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { STARTER_FLASHCARDS, scheduleQuestionForRevision } from '../../utils/studentLearning';
import type { Flashcard, TopicQuestion } from '../../types/quiz';

interface FlashcardsDeckProps {
  studentId: string;
  studentName: string;
  onGoBack: () => void;
  onOpenRevision: () => void;
}

export const FlashcardsDeck: React.FC<FlashcardsDeckProps> = ({
  studentId,
  studentName: _studentName,
  onGoBack,
  onOpenRevision
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deck, setDeck] = useState<Flashcard[]>(STARTER_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredCount, setMasteredCount] = useState<number>(0);
  const [revisionScheduledCount, setRevisionScheduledCount] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'banking', label: 'Banking & Basel III' },
    { id: 'rbi', label: 'RBI Monetary Policy' },
    { id: 'ramsar', label: 'Ramsar Sites' },
    { id: 'unesco', label: 'UNESCO Heritage' },
    { id: 'constitution', label: 'Sixth Schedule' },
    { id: 'national-parks', label: 'National Parks' },
    { id: 'schemes', label: 'Govt Schemes' }
  ];

  const filteredCards = useMemo(() => {
    if (selectedCategory === 'all') return deck;
    return deck.filter(c => c.category === selectedCategory);
  }, [deck, selectedCategory]);

  const activeCard: Flashcard | undefined = filteredCards[currentIndex];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleShuffle = () => {
    const shuffled = [...filteredCards].sort(() => 0.5 - Math.random());
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    showToast('Deck shuffled randomly.');
  };

  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleKnow = () => {
    setMasteredCount(prev => prev + 1);
    showToast('Marked as Known! Great work. ✨');
    handleNext();
  };

  const handleDontKnow = () => {
    if (activeCard) {
      // Schedule for smart revision
      const mockTopicQuestion: TopicQuestion = {
        id: activeCard.id,
        topicId: activeCard.category,
        subtopicId: activeCard.category,
        question: activeCard.front,
        options: [activeCard.back, 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        explanation: activeCard.back,
        difficulty: activeCard.difficulty || 'medium',
        source: activeCard.source,
        status: 'published'
      };
      scheduleQuestionForRevision(studentId, mockTopicQuestion, activeCard.difficulty || 'medium');
      setRevisionScheduledCount(prev => prev + 1);
      showToast('Scheduled for 24hr Smart Revision! ⏰');
    }
    handleNext();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-2 sm:px-4 pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#800020] hover:bg-rose-50 transition active:scale-95 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition min-h-[44px]"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Shuffle
          </button>
          <button
            onClick={onOpenRevision}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#800020] bg-rose-50 hover:bg-rose-100 transition min-h-[44px]"
          >
            Revisions ({revisionScheduledCount})
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2b0c15] via-[#5c0017] to-[#800020] text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold uppercase tracking-wider border border-purple-500/30 mb-2">
              <Zap className="w-3.5 h-3.5" />
              Rapid Recall Flashcards
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive 3D Flashcards
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 mt-1">
              Tap any card to flip between question and key fact. Integrated directly with spaced repetition.
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end text-xs text-rose-200">
            <span>Known: <strong className="text-emerald-400">{masteredCount}</strong></span>
            <span>Needs Rev: <strong className="text-amber-300">{revisionScheduledCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition min-h-[44px] ${
              selectedCategory === cat.id
                ? 'bg-[#800020] text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200 shadow-sm animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* Flashcard Area */}
      {activeCard ? (
        <div className="space-y-4">
          {/* Card Counter & Category Badge */}
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span className="font-bold text-[#800020]">
              {activeCard.categoryLabel}
            </span>
            <span>
              Card {currentIndex + 1} of {filteredCards.length}
            </span>
          </div>

          {/* Interactive Card */}
          <div
            onClick={() => setIsFlipped(prev => !prev)}
            className="cursor-pointer select-none perspective-1000 min-h-[320px] sm:min-h-[360px] flex flex-col"
          >
            <div
              className={`relative flex-1 p-8 rounded-3xl border-2 transition-all duration-300 shadow-lg flex flex-col justify-between ${
                isFlipped
                  ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 text-stone-900'
                  : 'bg-white border-[#ebd4d9] hover:border-[#800020] text-[#2b0c15]'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="font-semibold uppercase tracking-wider">
                  {isFlipped ? 'Key Answer & Explanation' : 'Question / Concept'}
                </span>
                <span className="flex items-center gap-1 text-[#800020] font-bold">
                  <RotateCw className="w-3.5 h-3.5" /> Tap to Flip
                </span>
              </div>

              {/* Main Content */}
              <div className="my-auto py-6">
                {isFlipped ? (
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg font-semibold leading-relaxed text-stone-900 whitespace-pre-line">
                      {activeCard.back}
                    </p>
                    {activeCard.keyFact && (
                      <div className="inline-block p-2.5 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-950 font-bold text-xs">
                        ⚡ Quick Fact: {activeCard.keyFact}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-lg sm:text-2xl font-black leading-snug">
                    {activeCard.front}
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-4 border-t border-stone-100">
                <span>Source: {activeCard.source}</span>
                <span className="capitalize font-semibold text-stone-400">{activeCard.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Control Buttons (Know vs Don't Know) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDontKnow}
              className="py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 min-h-[48px]"
            >
              <XCircle className="w-5 h-5 text-rose-600" />
              Need Revision (1 Day)
            </button>
            <button
              onClick={handleKnow}
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-95 min-h-[48px]"
            >
              <CheckCircle2 className="w-5 h-5" />
              I Know This!
            </button>
          </div>

          {/* Pagination Arrows */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= filteredCards.length - 1}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 min-h-[44px]"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200">
          <Zap className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h3 className="font-bold text-stone-800">No Flashcards in this category</h3>
        </div>
      )}
    </div>
  );
};
