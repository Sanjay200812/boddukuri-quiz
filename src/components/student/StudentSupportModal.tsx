import React, { useState } from 'react';
import {
  HelpCircle,
  Send,
  CheckCircle2,
  X
} from 'lucide-react';
import { submitStudentQuestionReport } from '../../utils/studentLearning';
import { getTopicsList } from '../../data/topics';

interface StudentSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
}

export const StudentSupportModal: React.FC<StudentSupportModalProps> = ({
  isOpen,
  onClose,
  studentId,
  studentName
}) => {
  const [activeTab, setActiveTab] = useState<'report' | 'notices' | 'instructions'>('report');
  const [topicId, setTopicId] = useState<string>('static-gk');
  const [questionRef, setQuestionRef] = useState<string>('');
  const [issueType, setIssueType] = useState<'incorrect-answer' | 'broken-link' | 'typo' | 'outdated-info'>('incorrect-answer');
  const [description, setDescription] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const topics = getTopicsList();

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please describe the issue so Admin Sanju can inspect it.');
      return;
    }

    submitStudentQuestionReport({
      studentId,
      studentName,
      questionId: questionRef.trim() || 'unspecified-question',
      quizId: `${topicId}-quiz-01`,
      topicId,
      issueType: issueType as any,
      comment: description.trim()
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
      setQuestionRef('');
      onClose();
    }, 1800);
  };

  const notices = [
    {
      id: 'n-01',
      date: '24 November 2026',
      title: 'Platform Upgrade: 9 Topics & Multi-Quiz Architecture Live',
      content: 'All topics now feature multi-quiz partitioning (10-15 Qs per quiz), mistake notebooks, and mock exam timers.'
    },
    {
      id: 'n-02',
      date: '20 November 2026',
      title: 'Ramsar Sites Updated to 103 Sites',
      content: 'Questions on Sukhna Wetland (102nd, Chandigarh) and Sauj Jheel (103rd, Mainpuri, UP) have been audited and added.'
    },
    {
      id: 'n-03',
      date: '15 November 2026',
      title: 'UNESCO World Heritage 45th Site: Sarnath Added',
      content: 'Questions verified against UNESCO WHC 45th session decisions. Ensure you revise Sarnath cultural criteria.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#ebd4d9] overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#2b0c15] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 text-amber-300">
                <HelpCircle className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Student Support & Guidance</h2>
                <p className="text-xs text-rose-200">Notice board, rules, and question feedback</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex gap-2 mt-4 pt-2 border-t border-white/10">
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition min-h-[36px] ${
                activeTab === 'report' ? 'bg-white text-[#800020]' : 'text-rose-100 hover:bg-white/10'
              }`}
            >
              Report Question / Error
            </button>
            <button
              onClick={() => setActiveTab('notices')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition min-h-[36px] ${
                activeTab === 'notices' ? 'bg-white text-[#800020]' : 'text-rose-100 hover:bg-white/10'
              }`}
            >
              Admin Notices
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition min-h-[36px] ${
                activeTab === 'instructions' ? 'bg-white text-[#800020]' : 'text-rose-100 hover:bg-white/10'
              }`}
            >
              Exam Instructions
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'report' && (
            <div>
              {submitted ? (
                <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-emerald-900">Report Submitted to Admin Sanju!</h3>
                  <p className="text-xs text-emerald-700">
                    Thank you, {studentName}. Admin Sanju will inspect the question and verify official sources.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReport} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                      Related Topic
                    </label>
                    <select
                      value={topicId}
                      onChange={e => setTopicId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
                    >
                      {topics.map(t => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                      Issue Category
                    </label>
                    <select
                      value={issueType}
                      onChange={e => setIssueType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
                    >
                      <option value="incorrect-answer">Incorrect Answer / Key Error</option>
                      <option value="broken-link">Broken Official Source URL</option>
                      <option value="typo">Spelling or Grammatical Typo</option>
                      <option value="outdated-info">Outdated Information (New Policy / Amendment)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                      Question Identifier or Keywords (Optional)
                    </label>
                    <input
                      type="text"
                      value={questionRef}
                      onChange={e => setQuestionRef(e.target.value)}
                      placeholder="e.g. Q4 or 'Sukhna Wetland question'"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                      Detailed Description of the Issue
                    </label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={4}
                      placeholder="Please explain what is incorrect or what official source says..."
                      className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#800020]/20"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
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
                      <Send className="w-3.5 h-3.5" /> Submit Report
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="space-y-3">
              {notices.map(n => (
                <div key={n.id} className="p-4 rounded-xl border border-stone-100 bg-stone-50/70">
                  <div className="flex items-center justify-between text-[11px] text-[#76515b] mb-1">
                    <span className="font-bold text-[#800020]">Official Announcement</span>
                    <span>{n.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#2b0c15] mb-1">{n.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{n.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950">
                <span className="font-bold">Exam Mode Rules:</span> No explanations or answers are shown during a Mock Exam. Timer auto-submits upon expiry.
              </div>

              <div>
                <h4 className="font-bold text-[#2b0c15] mb-1">Negative Marking Math:</h4>
                <p>Formula: Score = Correct - (Incorrect * 0.25). Unanswered questions do not incur penalties.</p>
              </div>

              <div>
                <h4 className="font-bold text-[#2b0c15] mb-1">Spaced Repetition Intervals:</h4>
                <p>Incorrect or difficult questions are scheduled for review on Day 1, Day 3, Day 7, Day 14, and Day 30 until mastered.</p>
              </div>

              <div>
                <h4 className="font-bold text-[#2b0c15] mb-1">Accuracy vs Completion:</h4>
                <p>Accuracy = (Total Correct Answers / Total Attempted Questions) * 100. Quiz completion tracks finished modules separately.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
