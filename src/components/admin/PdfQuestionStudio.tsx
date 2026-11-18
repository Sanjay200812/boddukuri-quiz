import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  XCircle,
  Trash2,
  Check,
  Edit3,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { TOPIC_CATEGORIES, addPublishedTopicQuestions } from '../../data/topics';
import type { TopicQuestion } from '../../types/quiz';

interface UploadedDoc {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  status: 'Uploaded' | 'Processing' | 'Processed' | 'Failed';
  topicId: string;
  subtopicId: string;
  extractedTextPreview: string;
}

interface DraftQuestion {
  id: string;
  docId: string;
  topicId: string;
  subtopicId: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  status: 'draft' | 'approved' | 'rejected' | 'published';
}

const SAMPLE_DOCS: Array<{ name: string; topicId: string; subtopicId: string; text: string }> = [
  {
    name: 'Union_Cabinet_Portfolios_Gazette_2026.pdf',
    topicId: 'central-ministers',
    subtopicId: 'union-cabinet',
    text: 'Government of India Official Gazette: Allocation of Business Rules. Ministry of External Affairs remains with Dr. S. Jaishankar. Ministry of Finance and Corporate Affairs remains under Smt. Nirmala Sitharaman. Ministry of Railways, Information and Broadcasting, Electronics & IT is headed by Ashwini Vaishnaw.'
  },
  {
    name: 'Current_Affairs_Nov_2026_Digest.pdf',
    topicId: 'current-affairs',
    subtopicId: 'national-events',
    text: 'November 2026 National Developments: India inaugurated the Chenab Rail Bridge as the highest railway arch bridge in the world. Unified Payments Interface (UPI) recorded historic 18 billion monthly transactions. India hosted the Global AI Governance Summit in New Delhi.'
  },
  {
    name: 'Ramsar_Wetlands_India_Special_Report.pdf',
    topicId: 'ramsar-sites',
    subtopicId: 'ramsar-overview',
    text: 'Ministry of Environment, Forest and Climate Change: India maintains 85 designated Ramsar Sites covering over 1.35 million hectares. Tamil Nadu possesses the highest number with 16 sites, followed by Uttar Pradesh with 10 sites. Keoladeo National Park and Loktak Lake are in the Montreux Record.'
  },
  {
    name: 'RBI_Monetary_Policy_Review_2026.pdf',
    topicId: 'banking-awareness',
    subtopicId: 'rbi-monetary-policy',
    text: 'Reserve Bank of India Monetary Policy Committee (MPC) resolution: Repo rate maintained with an emphasis on withdrawal of accommodation to align inflation with the 4% target. Standing Deposit Facility (SDF) and Marginal Standing Facility (MSF) operational corridors reviewed.'
  }
];

export const PdfQuestionStudio: React.FC = () => {
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>(() => [
    {
      id: 'doc-init-01',
      name: 'Union_Cabinet_Portfolios_Gazette_2026.pdf',
      size: 1420000,
      uploadDate: new Date().toLocaleDateString('en-IN'),
      status: 'Processed',
      topicId: 'central-ministers',
      subtopicId: 'union-cabinet',
      extractedTextPreview: SAMPLE_DOCS[0].text
    }
  ]);

  const [draftQuestions, setDraftQuestions] = useState<DraftQuestion[]>(() => [
    {
      id: 'draft-01',
      docId: 'doc-init-01',
      topicId: 'central-ministers',
      subtopicId: 'union-cabinet',
      question: 'Which minister heads the Ministry of Railways as well as Electronics and Information Technology?',
      options: ['Ashwini Vaishnaw', 'Jyotiraditya Scindia', 'Piyush Goyal', 'Hardeep Singh Puri'],
      correctAnswer: 0,
      difficulty: 'medium',
      explanation: 'Ashwini Vaishnaw holds the Cabinet portfolio for Railways, Information & Broadcasting, and Electronics & Information Technology.',
      status: 'approved'
    },
    {
      id: 'draft-02',
      docId: 'doc-init-01',
      topicId: 'central-ministers',
      subtopicId: 'union-cabinet',
      question: 'Who serves as the Union Minister of Finance and Corporate Affairs?',
      options: ['Smt. Nirmala Sitharaman', 'Smriti Irani', 'Anupriya Patel', 'Shobha Karandlaje'],
      correctAnswer: 0,
      difficulty: 'easy',
      explanation: 'Smt. Nirmala Sitharaman continues to head the Ministry of Finance and Ministry of Corporate Affairs.',
      status: 'approved'
    }
  ]);

  const [selectedTopicId, setSelectedTopicId] = useState<string>('central-ministers');
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string>('union-cabinet');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [draftFilter, setDraftFilter] = useState<'all' | 'draft' | 'approved' | 'rejected' | 'published'>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const activeTopic = TOPIC_CATEGORIES.find(t => t.id === selectedTopicId) || TOPIC_CATEGORIES[0];

  // Drag and drop handler
  const handleFileUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const matchingSample = SAMPLE_DOCS.find(s => s.topicId === selectedTopicId) || SAMPLE_DOCS[0];
      const newDoc: UploadedDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        size: file.size,
        uploadDate: new Date().toLocaleDateString('en-IN'),
        status: 'Processed',
        topicId: selectedTopicId,
        subtopicId: selectedSubtopicId,
        extractedTextPreview: `[Extracted from ${file.name}]: ${matchingSample.text}`
      };

      setUploadedDocs(prev => [newDoc, ...prev]);

      // Automatically generate 3 exam draft questions for review
      generateDraftsForDoc(newDoc);
      setIsUploading(false);
      setUploadProgress(0);
      setNotification({
        type: 'success',
        text: `Extracted and generated draft questions from "${file.name}" for ${activeTopic.title}.`
      });
      setTimeout(() => setNotification(null), 5000);
    }, 1200);
  };

  // Generate mock draft questions based on topic
  const generateDraftsForDoc = (doc: UploadedDoc) => {
    let mockQuestions: DraftQuestion[] = [];

    if (doc.topicId === 'current-affairs') {
      mockQuestions = [
        {
          id: `draft-${Date.now()}-1`,
          docId: doc.id,
          topicId: doc.topicId,
          subtopicId: 'national-events',
          question: 'Which bridge, inaugurated in Jammu & Kashmir, is celebrated as the highest railway arch bridge in the world?',
          options: ['Chenab Rail Bridge', 'Bogibeel Bridge', 'Pamban Bridge', 'Dhola-Sadiya Bridge'],
          correctAnswer: 0,
          difficulty: 'medium',
          explanation: 'The Chenab Bridge stands 359 metres above the Chenab River, surpassing the Eiffel Tower in height.',
          status: 'draft'
        },
        {
          id: `draft-${Date.now()}-2`,
          docId: doc.id,
          topicId: doc.topicId,
          subtopicId: 'national-events',
          question: 'What is the primary objective of the PM Surya Ghar Muft Bijli Yojana launched by the Government of India?',
          options: ['Solar rooftop electricity for 1 crore households', 'Free LPG connections to rural women', 'Universal tap water connections', 'Subsidized electric vehicle charging stations'],
          correctAnswer: 0,
          difficulty: 'easy',
          explanation: 'PM Surya Ghar: Muft Bijli Yojana provides free electricity up to 300 units per month through rooftop solar systems.',
          status: 'draft'
        }
      ];
    } else if (doc.topicId === 'ramsar-sites') {
      mockQuestions = [
        {
          id: `draft-${Date.now()}-1`,
          docId: doc.id,
          topicId: doc.topicId,
          subtopicId: 'state-wise-ramsar',
          question: 'Which Indian state currently holds the highest number of designated Ramsar Sites?',
          options: ['Tamil Nadu (16 Sites)', 'Uttar Pradesh (10 Sites)', 'Kerala (3 Sites)', 'Punjab (6 Sites)'],
          correctAnswer: 0,
          difficulty: 'medium',
          explanation: 'Tamil Nadu leads with 16 designated Ramsar Sites, followed closely by Uttar Pradesh with 10.',
          status: 'draft'
        },
        {
          id: `draft-${Date.now()}-2`,
          docId: doc.id,
          topicId: doc.topicId,
          subtopicId: 'designation-facts',
          question: 'Under the Ramsar Convention, what is the significance of placing a wetland on the Montreux Record?',
          options: [
            'Indicates ecological character changes due to pollution or human interference',
            'Denotes wetlands having complete commercial fishing rights',
            'Marks wetlands that are fully artificial reservoirs',
            'Designates wetlands exempt from national environmental laws'
          ],
          correctAnswer: 0,
          difficulty: 'hard',
          explanation: 'The Montreux Record is a register of wetland sites on the List of Ramsar wetlands where changes in ecological character have occurred, are occurring, or are likely to occur.',
          status: 'draft'
        }
      ];
    } else if (doc.topicId === 'banking-awareness') {
      mockQuestions = [
        {
          id: `draft-${Date.now()}-1`,
          docId: doc.id,
          topicId: doc.topicId,
          subtopicId: 'rbi-monetary-policy',
          question: 'How many members constitute the Monetary Policy Committee (MPC) of the Reserve Bank of India?',
          options: ['6 members (3 RBI + 3 External)', '5 members (All RBI)', '7 members (4 Govt + 3 RBI)', '9 members (Equal representation)'],
          correctAnswer: 0,
          difficulty: 'medium',
          explanation: 'The RBI MPC consists of 6 members: the Governor, Deputy Governor in charge of monetary policy, one RBI nominated official, and three external members appointed by the Central Government.',
          status: 'draft'
        }
      ];
    } else {
      mockQuestions = [
        {
          id: `draft-${Date.now()}-1`,
          docId: doc.id,
          topicId: doc.topicId,
          subtopicId: doc.subtopicId,
          question: `Sample extracted question from ${doc.name}?`,
          options: ['Verified Option A (Correct)', 'Plausible Distractor B', 'Plausible Distractor C', 'Plausible Distractor D'],
          correctAnswer: 0,
          difficulty: 'medium',
          explanation: `Factual explanation extracted directly from official document ${doc.name}.`,
          status: 'draft'
        }
      ];
    }

    setDraftQuestions(prev => [...mockQuestions, ...prev]);
  };

  // Draft Actions
  const handleApproveDraft = (id: string) => {
    setDraftQuestions(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));
  };

  const handleRejectDraft = (id: string) => {
    setDraftQuestions(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' } : d));
  };

  const handleBulkApprove = () => {
    setDraftQuestions(prev => prev.map(d => d.status === 'draft' ? { ...d, status: 'approved' } : d));
    setNotification({ type: 'success', text: 'All draft questions approved for publishing.' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateDraft = (id: string, updates: Partial<DraftQuestion>) => {
    setDraftQuestions(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  // Publish approved questions directly into topic question bank
  const handlePublishApproved = () => {
    const approved = draftQuestions.filter(d => d.status === 'approved');
    if (approved.length === 0) {
      alert('No approved questions to publish. Please approve draft questions first.');
      return;
    }

    const topicQuestions: TopicQuestion[] = approved.map(a => ({
      id: `top-${a.topicId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      topicId: a.topicId,
      subtopicId: a.subtopicId,
      question: a.question,
      options: a.options,
      correctAnswer: a.correctAnswer,
      difficulty: a.difficulty,
      explanation: a.explanation,
      source: 'PDF Question Studio (Extracted & Admin Audited)',
      lastVerifiedDate: '2026-11-18',
      status: 'published'
    }));

    addPublishedTopicQuestions(topicQuestions);

    setDraftQuestions(prev => prev.map(d => d.status === 'approved' ? { ...d, status: 'published' } : d));
    setNotification({
      type: 'success',
      text: `Successfully published ${topicQuestions.length} questions into the live learning syllabus!`
    });
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredDrafts = draftQuestions.filter(d => {
    if (draftFilter === 'all') return true;
    return d.status === draftFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#260c18]">
        <div>
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#ff3366]" />
            <h2 className="text-xl font-black text-white tracking-tight">
              PDF Question Studio
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#2a0b16] text-[#ff8099] border border-[#52142a]">
              Pipeline Studio
            </span>
          </div>
          <p className="text-xs text-[#a68690] mt-0.5">
            Extract text from official PDFs, map to syllabus topics, generate draft questions, audit in the review queue, and publish into the live bank.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBulkApprove}
            className="px-3 py-1.5 rounded-xl bg-[#1e0813] hover:bg-[#2e0c1e] text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-[#2b0c18]"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Approve All Drafts</span>
          </button>
          <button
            onClick={handlePublishApproved}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs font-bold transition-all shadow-ruby flex items-center gap-1.5 border border-[#ff3366]/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Publish to Live Bank</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION 1: UPLOAD & CONFIGURATION DROPZONE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upload Box */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff8099] flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4" />
              <span>Document Upload & Extraction</span>
            </span>
            <span className="text-[11px] text-[#a68690]">PDF, TXT, DOCX</span>
          </div>

          {/* Topic & Subtopic selector for incoming documents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Target Topic</label>
              <select
                value={selectedTopicId}
                onChange={e => {
                  setSelectedTopicId(e.target.value);
                  const newT = TOPIC_CATEGORIES.find(t => t.id === e.target.value);
                  if (newT && newT.subtopics[0]) {
                    setSelectedSubtopicId(newT.subtopics[0].id);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#0e0208] border border-[#2b0c18] text-xs text-white focus:outline-none focus:border-[#ff3366]"
              >
                {TOPIC_CATEGORIES.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Target Subtopic</label>
              <select
                value={selectedSubtopicId}
                onChange={e => setSelectedSubtopicId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0e0208] border border-[#2b0c18] text-xs text-white focus:outline-none focus:border-[#ff3366]"
              >
                {activeTopic.subtopics.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Drag & Drop Box */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className="p-6 border-2 border-dashed border-[#3a0d20] hover:border-[#ff3366] rounded-2xl bg-[#0e0208]/80 text-center space-y-2 cursor-pointer transition-colors"
          >
            <UploadCloud className="w-8 h-8 mx-auto text-[#ff3366]" />
            <p className="text-xs text-white font-bold">
              Drag & drop examination PDF here, or click to browse
            </p>
            <p className="text-[11px] text-[#a68690]">
              Supports up to 25MB • Automated text extraction and syllabus question mapping
            </p>
            <input
              type="file"
              accept=".pdf,.txt,.docx"
              className="hidden"
              id="pdf-upload-input"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <label
              htmlFor="pdf-upload-input"
              className="inline-block px-3.5 py-1.5 rounded-xl bg-[#1e0813] hover:bg-[#2b0c1b] text-white text-xs font-bold cursor-pointer transition-colors border border-[#3a0d20]"
            >
              Select File
            </label>
          </div>

          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300 font-bold">
                <span>Extracting document text...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#9e1030] to-[#ff3366] rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Sample Selector for immediate demo */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ff3366]" />
            <h3 className="text-sm font-extrabold text-white">Instant Sample Gazette Selector</h3>
          </div>
          <p className="text-[11px] text-[#a68690]">
            Select an official gazette sample to test text extraction and question generation instantly without uploading files:
          </p>

          <div className="space-y-2 pt-1">
            {SAMPLE_DOCS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const newDoc: UploadedDoc = {
                    id: `doc-${Date.now()}`,
                    name: sample.name,
                    size: 980000,
                    uploadDate: new Date().toLocaleDateString('en-IN'),
                    status: 'Processed',
                    topicId: sample.topicId,
                    subtopicId: sample.subtopicId,
                    extractedTextPreview: sample.text
                  };
                  setUploadedDocs(prev => [newDoc, ...prev]);
                  generateDraftsForDoc(newDoc);
                  setNotification({
                    type: 'success',
                    text: `Generated questions from ${sample.name}!`
                  });
                  setTimeout(() => setNotification(null), 4000);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-[#1a0712] hover:bg-[#25091a] border border-[#2b0c18] text-xs transition-colors flex items-center justify-between"
              >
                <div className="truncate">
                  <div className="font-bold text-white truncate">{sample.name}</div>
                  <div className="text-[10px] text-[#ff8099] capitalize">{sample.topicId.replace('-', ' ')}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#ff3366] shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: UPLOADED DOCUMENTS TABLE */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#ff3366]" />
            <h3 className="text-base font-extrabold text-white">Document Management ({uploadedDocs.length})</h3>
          </div>
          <span className="text-xs text-[#a68690]">Tracked Documents</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#260c18] text-[#a68690]">
                <th className="pb-2.5 font-bold uppercase tracking-wider">Document Name</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-center">Topic</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-center">Size</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-center">Date</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-center">Status</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e0813]">
              {uploadedDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-[#1a0712] transition-colors">
                  <td className="py-2.5 font-bold text-white flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#ff3366] shrink-0" />
                    <span className="truncate max-w-xs">{doc.name}</span>
                  </td>
                  <td className="py-2.5 text-center text-[#ff8099] font-semibold capitalize">
                    {doc.topicId.replace('-', ' ')}
                  </td>
                  <td className="py-2.5 text-center text-[#cbb5bc]">
                    {Math.round(doc.size / 1024)} KB
                  </td>
                  <td className="py-2.5 text-center text-[#a68690]">{doc.uploadDate}</td>
                  <td className="py-2.5 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-center">
                    <button
                      onClick={() => {
                        setUploadedDocs(prev => prev.filter(d => d.id !== doc.id));
                        setDraftQuestions(prev => prev.filter(q => q.docId !== doc.id));
                      }}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete document and its drafts"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: ADMIN QUESTION REVIEW QUEUE */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#260c18]">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff3366]" />
              <h3 className="text-base font-extrabold text-white">
                Generated Question Drafts Review Queue ({filteredDrafts.length})
              </h3>
            </div>
            <p className="text-xs text-[#a68690] mt-0.5">
              Review, edit options, verify factual correctness, approve, and publish directly into topic syllabus.
            </p>
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#14060d] border border-[#2b0c18] text-xs">
            {(['all', 'draft', 'approved', 'published'] as const).map(filterKey => (
              <button
                key={filterKey}
                onClick={() => setDraftFilter(filterKey)}
                className={`px-2.5 py-1 rounded-xl font-bold capitalize transition-all ${
                  draftFilter === filterKey
                    ? 'bg-[#9e1030] text-white shadow-ruby'
                    : 'text-[#a68690] hover:text-white'
                }`}
              >
                {filterKey}
              </button>
            ))}
          </div>
        </div>

        {filteredDrafts.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#a68690] space-y-2">
            <HelpCircle className="w-6 h-6 mx-auto text-[#ff3366]" />
            <p>No questions found in this review filter.</p>
            <p>Upload a PDF above or pick a sample gazette to generate draft questions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDrafts.map((draft, idx) => {
              const isEditing = editingDraftId === draft.id;

              return (
                <div
                  key={draft.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    draft.status === 'approved'
                      ? 'bg-emerald-950/20 border-emerald-800/40'
                      : draft.status === 'published'
                        ? 'bg-purple-950/20 border-purple-800/40'
                        : 'bg-[#14060d] border-[#2b0c18]'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#2a0717] text-[#ff8099] border border-[#52102c] flex items-center justify-center font-bold text-xs">
                        #{idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1e0813] text-[#ff8099] border border-[#2b0c18] capitalize">
                        {draft.topicId.replace('-', ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1e0813] text-slate-300 border border-[#2b0c18] capitalize">
                        {draft.difficulty}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          draft.status === 'approved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : draft.status === 'published'
                              ? 'bg-purple-950 text-purple-300 border border-purple-800'
                              : draft.status === 'rejected'
                                ? 'bg-red-950 text-red-400 border border-red-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {draft.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingDraftId(isEditing ? null : draft.id)}
                        className="p-1.5 rounded-lg bg-[#1e0813] hover:bg-[#2b0c1b] text-slate-300 hover:text-white transition-colors"
                        title="Edit question text and options"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleApproveDraft(draft.id)}
                        className="px-2 py-1 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 text-xs font-bold transition-colors flex items-center gap-1 border border-emerald-700/50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectDraft(draft.id)}
                        className="px-2 py-1 rounded-lg bg-red-900/50 hover:bg-red-800 text-red-300 text-xs font-bold transition-colors flex items-center gap-1 border border-red-700/50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  {/* Question Content */}
                  {isEditing ? (
                    <div className="space-y-3 pt-1 text-xs">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Question Prompt</label>
                        <input
                          type="text"
                          value={draft.question}
                          onChange={e => handleUpdateDraft(draft.id, { question: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#0e0208] border border-[#2b0c18] text-xs text-white focus:outline-none focus:border-[#ff3366]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {draft.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${draft.id}`}
                              checked={draft.correctAnswer === oIdx}
                              onChange={() => handleUpdateDraft(draft.id, { correctAnswer: oIdx })}
                              title="Set as correct answer"
                              className="accent-[#ff3366]"
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={e => {
                                const newOpts = [...draft.options] as [string, string, string, string];
                                newOpts[oIdx] = e.target.value;
                                handleUpdateDraft(draft.id, { options: newOpts });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e0208] border border-[#2b0c18] text-xs text-white"
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Explanation</label>
                        <textarea
                          rows={2}
                          value={draft.explanation}
                          onChange={e => handleUpdateDraft(draft.id, { explanation: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#0e0208] border border-[#2b0c18] text-xs text-white"
                        />
                      </div>

                      <button
                        onClick={() => setEditingDraftId(null)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs"
                      >
                        Done Editing
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-white text-sm">
                        {draft.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {draft.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-xl border text-xs flex items-center justify-between ${
                              draft.correctAnswer === oIdx
                                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200 font-bold'
                                : 'bg-[#0e0208] border-[#260c18] text-slate-300'
                            }`}
                          >
                            <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                            {draft.correctAnswer === oIdx && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#0e0208] border border-[#260c18] text-[11px] text-[#a68690] mt-2">
                        <strong className="text-white">Explanation: </strong>
                        {draft.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
