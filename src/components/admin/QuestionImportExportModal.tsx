import React, { useState } from 'react';
import {
  UploadCloud,
  Download,
  X,
  Check
} from 'lucide-react';
import { getAllTopicQuestions } from '../../data/topics';
import { getAllAttempts } from '../../utils/storage';
import type { TopicQuestion } from '../../types/quiz';

interface QuestionImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportQuestions: (imported: TopicQuestion[]) => void;
}

export const QuestionImportExportModal: React.FC<QuestionImportExportModalProps> = ({
  isOpen,
  onClose,
  onImportQuestions
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [rawText, setRawText] = useState<string>('');
  const [parsedPreview, setParsedPreview] = useState<TopicQuestion[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleValidateInput = () => {
    setValidationErrors([]);
    setParsedPreview([]);

    if (!rawText.trim()) {
      setValidationErrors(['Please paste JSON or CSV text to validate.']);
      return;
    }

    try {
      // Try JSON first
      if (rawText.trim().startsWith('[') || rawText.trim().startsWith('{')) {
        const json = JSON.parse(rawText);
        const array: any[] = Array.isArray(json) ? json : [json];
        const validQuestions: TopicQuestion[] = [];
        const errs: string[] = [];

        array.forEach((item, idx) => {
          if (!item.question) errs.push(`Item ${idx + 1}: Missing question text`);
          if (!item.options || !Array.isArray(item.options) || item.options.length < 4) {
            errs.push(`Item ${idx + 1}: Must contain 4 options in an array`);
          }
          if (item.correctAnswer === undefined || item.correctAnswer < 0 || item.correctAnswer > 3) {
            errs.push(`Item ${idx + 1}: correctAnswer must be 0, 1, 2, or 3`);
          }

          if (item.question && item.options && item.options.length === 4) {
            validQuestions.push({
              id: item.id || `imp-${Date.now()}-${idx}`,
              topicId: item.topicId || 'static-gk',
              subtopicId: item.subtopicId || item.topicId || 'general',
              question: item.question,
              options: item.options,
              correctAnswer: item.correctAnswer ?? 0,
              explanation: item.explanation || '',
              difficulty: item.difficulty || 'medium',
              source: item.source || 'Imported Question Bank',
              sourceUrl: item.sourceUrl || undefined,
              sourcePage: item.sourcePage || undefined,
              isDraft: true,
              status: 'draft'
            });
          }
        });

        if (errs.length > 0) {
          setValidationErrors(errs.slice(0, 5));
        }
        setParsedPreview(validQuestions);
      } else {
        // Simple CSV parser
        // Expected format: question,optionA,optionB,optionC,optionD,correctAnswer(0-3),explanation,topicId
        const lines = rawText.split('\n').filter(l => l.trim().length > 0);
        const validQuestions: TopicQuestion[] = [];
        const errs: string[] = [];

        lines.forEach((line, idx) => {
          const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length < 6) {
            errs.push(`Line ${idx + 1}: Needs at least 6 comma-separated columns`);
            return;
          }

          const [qText, optA, optB, optC, optD, cAns, expl, tId] = cols;
          const cIndex = parseInt(cAns) || 0;

          validQuestions.push({
            id: `imp-csv-${Date.now()}-${idx}`,
            topicId: tId || 'static-gk',
            subtopicId: tId || 'general',
            question: qText,
            options: [optA, optB, optC, optD],
            correctAnswer: Math.max(0, Math.min(3, cIndex)),
            explanation: expl || '',
            difficulty: 'medium',
            source: 'CSV Import',
            isDraft: true,
            status: 'draft'
          });
        });

        if (errs.length > 0) setValidationErrors(errs);
        setParsedPreview(validQuestions);
      }
    } catch (err) {
      setValidationErrors([`Parse error: ${err instanceof Error ? err.message : String(err)}`]);
    }
  };

  const handleCommitImport = () => {
    if (parsedPreview.length === 0) return;
    onImportQuestions(parsedPreview);
    showToast(`Successfully imported ${parsedPreview.length} questions in Draft state!`);
    setRawText('');
    setParsedPreview([]);
    setTimeout(() => onClose(), 1500);
  };

  // Exports
  const handleExportQuestionsJSON = () => {
    const questions = getAllTopicQuestions();
    const blob = new Blob([JSON.stringify(questions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spideyy_questions_curriculum_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Exported question bank JSON.');
  };

  const handleExportPerformanceCSV = () => {
    const attempts = getAllAttempts();
    const headers = ['AttemptID', 'StudentID', 'StudentName', 'QuizID', 'Score', 'MaxMarks', 'Percentage', 'Passed', 'CompletedAt'];
    const rows = attempts.map(a => [
      a.id,
      a.studentId || 'mahi',
      a.studentName || 'Mahi',
      a.quizId,
      a.score,
      a.totalQuestions,
      a.percentage,
      a.passed ? 'Yes' : 'No',
      a.completedAt
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spideyy_student_performance_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Exported student performance CSV.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#ebd4d9] overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#2b0c15] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/10 text-amber-300">
              <UploadCloud className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Import & Export Studio</h2>
              <p className="text-xs text-rose-200">Bulk question ingestion and performance report downloads</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-200 px-6 pt-3 bg-stone-50 text-xs">
          <button
            onClick={() => setActiveTab('import')}
            className={`py-2 px-4 font-bold border-b-2 transition min-h-[40px] ${
              activeTab === 'import' ? 'border-[#800020] text-[#800020]' : 'border-transparent text-stone-600'
            }`}
          >
            Bulk Question Import (JSON / CSV)
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`py-2 px-4 font-bold border-b-2 transition min-h-[40px] ${
              activeTab === 'export' ? 'border-[#800020] text-[#800020]' : 'border-transparent text-stone-600'
            }`}
          >
            Export Data & Reports
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {toastMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200">
              {toastMsg}
            </div>
          )}

          {activeTab === 'import' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                  Paste JSON Array or CSV Rows
                </label>
                <textarea
                  rows={6}
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  placeholder='JSON: [{"question": "...", "options": ["A","B","C","D"], "correctAnswer": 0, "explanation": "..."}]&#10;OR CSV: Question,OptA,OptB,OptC,OptD,0,Explanation,static-gk'
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs font-mono focus:ring-2 focus:ring-[#800020]/20"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleValidateInput}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-900 transition min-h-[44px]"
                >
                  Validate & Preview
                </button>
              </div>

              {validationErrors.length > 0 && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                  <span className="font-bold">Validation Issues:</span>
                  <ul className="list-disc list-inside">
                    {validationErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {parsedPreview.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span>Ready to Ingest: {parsedPreview.length} Valid Questions</span>
                    <span className="text-[11px] font-normal text-emerald-700">All set to Draft status</span>
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-1 text-xs text-stone-700 font-mono">
                    {parsedPreview.slice(0, 3).map((q, idx) => (
                      <div key={idx} className="p-1.5 rounded bg-white border border-emerald-100 truncate">
                        #{idx + 1}: {q.question}
                      </div>
                    ))}
                    {parsedPreview.length > 3 && (
                      <div className="text-[11px] text-stone-500 italic">
                        ...and {parsedPreview.length - 3} more questions
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleCommitImport}
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 min-h-[44px]"
                  >
                    <Check className="w-4 h-4" /> Commit Import to Curriculum
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                <h4 className="font-bold text-sm text-[#2b0c15]">Curriculum Question Bank (JSON)</h4>
                <p className="text-xs text-stone-600">
                  Full export of all 222+ questions across all 9 topics, including options, explanations, sources, and verification dates.
                </p>
                <button
                  type="button"
                  onClick={handleExportQuestionsJSON}
                  className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#5c0017] transition flex items-center gap-1.5 min-h-[44px]"
                >
                  <Download className="w-3.5 h-3.5" /> Download Questions JSON
                </button>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                <h4 className="font-bold text-sm text-[#2b0c15]">Student Performance Ledger (CSV)</h4>
                <p className="text-xs text-stone-600">
                  Spreadsheet-ready CSV of all attempts logged by Mahi and Shailu with timestamps, scores, and completion flags.
                </p>
                <button
                  type="button"
                  onClick={handleExportPerformanceCSV}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-900 transition flex items-center gap-1.5 min-h-[44px]"
                >
                  <Download className="w-3.5 h-3.5" /> Download Student Attempts CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
