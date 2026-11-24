import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  Search,
  ArrowLeft,
  FileText,
  Trash2,
  CheckCircle2,
  Save,
  ExternalLink
} from 'lucide-react';
import { getStudentBookmarks, updateBookmarkNote, toggleStudentBookmark } from '../../utils/studentLearning';
import { getTopicsList } from '../../data/topics';
import type { StudentBookmark } from '../../types/quiz';

interface BookmarksNotesViewProps {
  studentId: string;
  studentName: string;
  onGoBack: () => void;
}

export const BookmarksNotesView: React.FC<BookmarksNotesViewProps> = ({
  studentId,
  studentName,
  onGoBack
}) => {
  const [bookmarks, setBookmarks] = useState<StudentBookmark[]>(() => getStudentBookmarks(studentId));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [activeEditingId, setActiveEditingId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const topics = useMemo(() => getTopicsList(), []);

  const refreshList = () => {
    setBookmarks(getStudentBookmarks(studentId));
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(b => {
      const matchesTopic = selectedTopic === 'all' || b.topicId === selectedTopic;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        b.question.question.toLowerCase().includes(q) ||
        (b.note && b.note.toLowerCase().includes(q)) ||
        b.topicId.toLowerCase().includes(q);
      return matchesTopic && matchesSearch;
    });
  }, [bookmarks, selectedTopic, searchQuery]);

  const handleStartEditNote = (bm: StudentBookmark) => {
    setActiveEditingId(bm.questionId);
    setEditingNoteText(bm.note || '');
  };

  const handleSaveNote = (questionId: string) => {
    updateBookmarkNote(studentId, questionId, editingNoteText);
    setActiveEditingId(null);
    refreshList();
    showToast('Private note saved successfully.');
  };

  const handleRemoveBookmark = (bm: StudentBookmark) => {
    if (confirm('Remove this question from your bookmarks?')) {
      toggleStudentBookmark(studentId, bm.question);
      refreshList();
      showToast('Bookmark removed.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#800020] hover:bg-rose-50 transition active:scale-95 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="text-xs text-[#76515b]">
          {bookmarks.length} Bookmarked Questions
        </div>
      </div>

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2b0c15] via-[#5c0017] to-[#800020] text-white shadow-xl">
        <div className="flex items-center gap-3">
          <span className="p-3 rounded-2xl bg-white/10 text-amber-300">
            <Bookmark className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bookmarks & Personal Notes
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 mt-1">
              Private study repository for {studentName}. Save key questions and attach your own memory mnemonics.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search questions or your personal notes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
          >
            <option value="all">All Topics ({bookmarks.length})</option>
            {topics.map(t => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200 shadow-sm">
          {toastMsg}
        </div>
      )}

      {/* Bookmarks List */}
      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200">
          <Bookmark className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#2b0c15]">No Bookmarked Questions Found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
            {searchQuery || selectedTopic !== 'all'
              ? 'Try clearing your filters or search terms.'
              : 'While reviewing a quiz or checking answer sheets, click the bookmark icon to save questions here with private study notes.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookmarks.map((bm, index) => {
            const q = bm.question;
            const isEditing = activeEditingId === q.id;

            return (
              <div
                key={bm.id}
                className="p-5 rounded-2xl bg-white border border-[#ebd4d9] shadow-sm space-y-4 hover:border-[#800020]/40 transition"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-[#800020] uppercase">
                      #{index + 1} • {bm.topicId}
                    </span>
                    <span className="text-xs text-stone-400">
                      Saved {new Date(bm.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemoveBookmark(bm)}
                      className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div className="text-sm sm:text-base font-bold text-[#2b0c15]">
                  {q.question}
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correctAnswer;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                          isCorrect
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-semibold'
                            : 'bg-stone-50 border-stone-200 text-stone-700'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-950">
                    <span className="font-bold">Official Explanation: </span>
                    {q.explanation}
                  </div>
                )}

                {/* Source Citation */}
                {q.source && (
                  <div className="flex items-center gap-2 text-[11px] text-[#76515b]">
                    <span className="font-semibold">Source:</span>
                    <span>{q.source} {q.sourcePage ? `(Page ${q.sourcePage})` : ''}</span>
                    {q.sourceUrl && (
                      <a
                        href={q.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#800020] hover:underline inline-flex items-center gap-0.5 ml-1"
                      >
                        Official Source <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* Private Personal Notes Section */}
                <div className="pt-3 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#2b0c15] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#800020]" />
                      My Private Note:
                    </span>
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEditNote(bm)}
                        className="text-xs font-semibold text-[#800020] hover:underline"
                      >
                        {bm.note ? 'Edit Note' : '+ Add Note'}
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editingNoteText}
                        onChange={e => setEditingNoteText(e.target.value)}
                        placeholder="Type personal reminders, mnemonics, or key numbers..."
                        rows={3}
                        className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveEditingId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100 min-h-[36px]"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNote(q.id)}
                          className="px-4 py-1.5 rounded-lg bg-[#800020] text-white text-xs font-bold hover:bg-[#5c0017] flex items-center gap-1 min-h-[36px]"
                        >
                          <Save className="w-3.5 h-3.5" /> Save Note
                        </button>
                      </div>
                    </div>
                  ) : bm.note ? (
                    <div className="p-2.5 rounded-xl bg-rose-50/40 border border-rose-200/50 text-xs text-[#2b0c15] italic">
                      "{bm.note}"
                    </div>
                  ) : (
                    <p className="text-xs text-stone-400 italic">No notes added yet.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
