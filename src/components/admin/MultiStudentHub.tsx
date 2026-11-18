import React, { useState } from 'react';
import {
  Users,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Mail,
  Key,
  Layers,
  X,
  BookOpen,
  Check
} from 'lucide-react';
import type { QuizAttempt } from '../../types/quiz';
import { TOPIC_CATEGORIES } from '../../data/topics';
import { Card3D } from '../ui/Card3D';
import { MAHI_STUDENT_ID } from '../../utils/supabase';

interface MultiStudentHubProps {
  attempts: QuizAttempt[];
  completedDays?: string[];
  onResetStudent: (studentId: string, studentName: string, quizId?: string) => Promise<void>;
  onViewAnswerSheet: (attempt: QuizAttempt) => void;
  onRefreshData: () => Promise<void>;
}

export const MultiStudentHub: React.FC<MultiStudentHubProps> = ({
  attempts,
  completedDays: _completedDays,
  onResetStudent,
  onViewAnswerSheet,
  onRefreshData
}) => {
  const [selectedStudentTab, setSelectedStudentTab] = useState<'all' | 'mahi' | 'shailu'>('all');
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [shailuEmail, setShailuEmail] = useState('');
  const [shailuPassword, setShailuPassword] = useState('2026');
  const [shailuRole, setShailuRole] = useState<'student' | 'admin'>('student');
  const [onboardSuccessMessage, setOnboardSuccessMessage] = useState<string | null>(null);

  // Independent Reset Modal state
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [targetStudentForReset, setTargetStudentForReset] = useState<'Mahi' | 'Shailu'>('Mahi');
  const [resetScope, setResetScope] = useState<'all' | string>('all');
  const [resetConfirmWord, setResetConfirmWord] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Stored onboarding state for Shailu
  const [shailuConfig, setShailuConfig] = useState<{ email: string; code: string; onboarded: boolean }>(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('spideyy_shailu_account');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return { email: '', code: '2026', onboarded: false };
  });

  // Split attempts by student
  const mahiAttempts = attempts.filter(a => {
    if (!a.studentName) return true; // default legacy to Mahi
    return a.studentName.toLowerCase().includes('mahi') || a.studentEmail?.includes('mahi');
  });

  const shailuAttempts = attempts.filter(a => {
    return (
      (a.studentName && a.studentName.toLowerCase().includes('shailu')) ||
      (a.studentEmail && a.studentEmail.toLowerCase().includes('shailu'))
    );
  });

  // Calculate stats for a given attempts list
  const getStudentStats = (studentAttempts: QuizAttempt[]) => {
    const total = studentAttempts.length;
    const completedQuizIds = Array.from(new Set(studentAttempts.map(a => a.quizId)));
    const avgScore = total > 0
      ? Math.round(studentAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / total)
      : 0;
    const bestScore = total > 0
      ? Math.max(...studentAttempts.map(a => a.percentage || 0))
      : 0;
    const lastAttempt = studentAttempts[0] || null;

    return { total, completedQuizIds, avgScore, bestScore, lastAttempt };
  };

  const mahiStats = getStudentStats(mahiAttempts);
  const shailuStats = getStudentStats(shailuAttempts);

  // Handle Shailu Onboarding
  const handleSaveShailuAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shailuEmail.trim() || !shailuEmail.includes('@')) {
      alert('Please enter a valid email address for Shailu.');
      return;
    }
    const newConfig = {
      email: shailuEmail.trim(),
      code: shailuPassword.trim() || '2026',
      onboarded: true
    };
    setShailuConfig(newConfig);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('spideyy_shailu_account', JSON.stringify(newConfig));
    }
    setOnboardSuccessMessage(`Shailu's account has been configured with email: ${newConfig.email} and access code: ${newConfig.code}.`);
    setShowOnboardModal(false);
  };

  const generateRandomCode = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setShailuPassword(randomCode);
  };

  // Handle Reset Action
  const handleExecuteReset = async () => {
    if (resetConfirmWord.trim().toUpperCase() !== 'RESET') {
      alert('Please type "RESET" to confirm.');
      return;
    }

    setIsResetting(true);
    try {
      const studentId = targetStudentForReset === 'Mahi' ? MAHI_STUDENT_ID : 'shailu-student-id';
      const targetQuizId = resetScope === 'all' ? undefined : resetScope;
      await onResetStudent(studentId, targetStudentForReset, targetQuizId);
      setResetModalOpen(false);
      setResetConfirmWord('');
      await onRefreshData();
    } catch (err) {
      alert(`Reset failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#260c18]">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#ff3366]" />
            <h2 className="text-xl font-black text-white tracking-tight">
              Multi-Student Workspace
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#2a0b16] text-[#ff8099] border border-[#52142a]">
              2 Scholars
            </span>
          </div>
          <p className="text-xs text-[#a68690] mt-0.5">
            Independent topic learning, separate test attempts, answer sheets, and isolated progress resets for Mahi and Shailu.
          </p>
        </div>

        {/* Student Selector Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#14060d] border border-[#2b0c18]">
          <button
            onClick={() => setSelectedStudentTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedStudentTab === 'all'
                ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby'
                : 'text-[#a68690] hover:text-white'
            }`}
          >
            All Scholars
          </button>
          <button
            onClick={() => setSelectedStudentTab('mahi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedStudentTab === 'mahi'
                ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby'
                : 'text-[#a68690] hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Mahi</span>
          </button>
          <button
            onClick={() => setSelectedStudentTab('shailu')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedStudentTab === 'shailu'
                ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby'
                : 'text-[#a68690] hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${shailuConfig.onboarded ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            <span>Shailu</span>
          </button>
        </div>
      </div>

      {onboardSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{onboardSuccessMessage}</span>
          </div>
          <button onClick={() => setOnboardSuccessMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STUDENT CARDS: MAHI & SHAILU */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* STUDENT 1: MAHI */}
        {(selectedStudentTab === 'all' || selectedStudentTab === 'mahi') && (
          <Card3D intensity={6} depth={8}>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16050e]/95 to-[#0e0208]/95 border border-[#3a0d20] shadow-lg flex flex-col justify-between space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9e1030] to-[#ff3366] text-white flex items-center justify-center font-black text-xl shadow-ruby">
                    M
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-white">Mahi</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                        Active Scholar
                      </span>
                    </div>
                    <p className="text-xs text-[#a68690] font-mono">boddukurimahima1234@gmail.com</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTargetStudentForReset('Mahi');
                    setResetScope('all');
                    setResetModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-[#2a0717] hover:bg-[#3a0d20] text-[#ff8099] border border-[#52102c] text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Reset Mahi's Progress"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Mahi</span>
                </button>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#260c18] text-center">
                <div className="p-2 rounded-xl bg-[#12040b] border border-[#260c18]">
                  <div className="text-[10px] uppercase font-bold text-[#a68690]">Attempts</div>
                  <div className="text-base font-black text-white">{mahiStats.total}</div>
                </div>
                <div className="p-2 rounded-xl bg-[#12040b] border border-[#260c18]">
                  <div className="text-[10px] uppercase font-bold text-[#a68690]">Avg Score</div>
                  <div className="text-base font-black text-[#ff8099]">{mahiStats.avgScore}%</div>
                </div>
                <div className="p-2 rounded-xl bg-[#12040b] border border-[#260c18]">
                  <div className="text-[10px] uppercase font-bold text-[#a68690]">Best Score</div>
                  <div className="text-base font-black text-emerald-400">{mahiStats.bestScore}%</div>
                </div>
                <div className="p-2 rounded-xl bg-[#12040b] border border-[#260c18]">
                  <div className="text-[10px] uppercase font-bold text-[#a68690]">Access Code</div>
                  <div className="text-base font-black font-mono text-amber-300">2002</div>
                </div>
              </div>

              {/* Topic Completion Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#ff3366]" />
                    <span>Topic & Championship Mastery</span>
                  </span>
                  <span className="text-[11px] text-[#a68690]">
                    {TOPIC_CATEGORIES.filter(t => mahiStats.completedQuizIds.includes(t.id)).length} of 5 Topics
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TOPIC_CATEGORIES.map(topic => {
                    const isDone = mahiStats.completedQuizIds.includes(topic.id);
                    const topicAttempts = mahiAttempts.filter(a => a.quizId === topic.id);
                    const best = topicAttempts.length > 0 ? Math.max(...topicAttempts.map(a => a.percentage)) : 0;

                    return (
                      <div
                        key={topic.id}
                        className={`p-2.5 rounded-xl border text-xs transition-all ${
                          isDone
                            ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                            : 'bg-[#12040b] border-[#260c18] text-[#a68690]'
                        }`}
                      >
                        <div className="font-bold truncate text-white">{topic.title}</div>
                        <div className="text-[10px] flex items-center justify-between mt-1">
                          <span>{topicAttempts.length} att.</span>
                          <span className={isDone ? 'text-emerald-400 font-bold' : 'text-[#7a5b67]'}>
                            {topicAttempts.length > 0 ? `${best}%` : 'Unattempted'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {/* Championship: Semi-Final */}
                  <div
                    className={`p-2.5 rounded-xl border text-xs transition-all ${
                      mahiStats.completedQuizIds.includes('semi-final')
                        ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                        : 'bg-[#12040b] border-[#260c18] text-[#a68690]'
                    }`}
                  >
                    <div className="font-bold truncate text-amber-300">Semi-Final Test</div>
                    <div className="text-[10px] flex items-center justify-between mt-1">
                      <span>{mahiAttempts.filter(a => a.quizId === 'semi-final').length} att.</span>
                      <span className={mahiStats.completedQuizIds.includes('semi-final') ? 'text-emerald-400 font-bold' : 'text-[#7a5b67]'}>
                        {mahiStats.completedQuizIds.includes('semi-final') ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity footer */}
              {mahiStats.lastAttempt ? (
                <div className="p-2.5 rounded-xl bg-[#14060d] border border-[#260c18] text-xs flex items-center justify-between">
                  <div className="truncate">
                    <span className="text-[#a68690]">Latest: </span>
                    <strong className="text-white">{mahiStats.lastAttempt.quizId.toUpperCase()}</strong>
                    <span className="text-emerald-400 ml-1.5 font-bold">({mahiStats.lastAttempt.percentage}%)</span>
                  </div>
                  <button
                    onClick={() => onViewAnswerSheet(mahiStats.lastAttempt!)}
                    className="text-[#ff3366] hover:text-[#ff8099] font-bold text-xs flex items-center gap-1"
                  >
                    <span>View Sheet</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-[#14060d] border border-[#260c18] text-xs text-[#a68690] text-center">
                  Mahi is ready for her first topic test.
                </div>
              )}
            </div>
          </Card3D>
        )}

        {/* STUDENT 2: SHAILU */}
        {(selectedStudentTab === 'all' || selectedStudentTab === 'shailu') && (
          <Card3D intensity={6} depth={8}>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16050e]/95 to-[#0e0208]/95 border border-[#3a0d20] shadow-lg flex flex-col justify-between space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-700 to-purple-600 text-white flex items-center justify-center font-black text-xl shadow-lg">
                    S
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-white">Shailu</h3>
                      {shailuConfig.onboarded ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                          Onboarded Scholar
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800">
                          Awaiting Credentials
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#a68690] font-mono">
                      {shailuConfig.email || 'Awaiting Admin setup'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setShailuEmail(shailuConfig.email || '');
                      setShailuPassword(shailuConfig.code || '2026');
                      setShowOnboardModal(true);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-800 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{shailuConfig.onboarded ? 'Edit Credentials' : 'Setup Credentials'}</span>
                  </button>

                  {shailuStats.total > 0 && (
                    <button
                      onClick={() => {
                        setTargetStudentForReset('Shailu');
                        setResetScope('all');
                        setResetModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#2a0717] hover:bg-[#3a0d20] text-[#ff8099] border border-[#52102c] text-xs font-bold transition-all flex items-center gap-1.5"
                      title="Reset Shailu's Progress"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#260c18] text-center">
                <div className="p-2 rounded-xl bg-[#12040b] border border-[#260c18]">
                  <div className="text-[10px] uppercase font-bold text-[#a68690]">Attempts</div>
                  <div className="text-base font-black text-white">{shailuStats.total}</div>
                </div>
                <div className="p-2 rounded-xl bg-[#12040b] border border-[#260c18]">
                  <div className="text-[10px] uppercase font-bold text-[#a68690]">Avg Score</div>
                  <div className="text-base font-black text-[#ff8099]">{shailuStats.avgScore}%</div>
                </div>
                <div className="p-2 rounded-xl bg-[#12040b] border border-[#260c18]">
                  <div className="text-[10px] uppercase font-bold text-[#a68690]">Best Score</div>
                  <div className="text-base font-black text-emerald-400">{shailuStats.bestScore}%</div>
                </div>
                <div className="p-2 rounded-xl bg-[#12040b] border border-[#260c18]">
                  <div className="text-[10px] uppercase font-bold text-[#a68690]">Access Code</div>
                  <div className="text-base font-black font-mono text-purple-300">{shailuConfig.code}</div>
                </div>
              </div>

              {/* Shailu Empty State or Progress */}
              {shailuStats.total === 0 ? (
                <div className="p-5 rounded-xl bg-[#12040b]/80 border border-dashed border-[#3a0d20] text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-purple-950/60 border border-purple-800 text-purple-300 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-300 font-semibold">
                    Shailu hasn't attempted any quizzes yet.
                  </p>
                  <p className="text-[11px] text-[#a68690] max-w-sm mx-auto">
                    Once she logs in and begins exploring topics, her scores, question analytics, and answer sheets will appear here independently.
                  </p>
                  {!shailuConfig.onboarded && (
                    <button
                      onClick={() => setShowOnboardModal(true)}
                      className="mt-2 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Configure Shailu's Account</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      <span>Topic Mastery</span>
                    </span>
                    <span className="text-[11px] text-[#a68690]">
                      {TOPIC_CATEGORIES.filter(t => shailuStats.completedQuizIds.includes(t.id)).length} of 5 Topics
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TOPIC_CATEGORIES.map(topic => {
                      const isDone = shailuStats.completedQuizIds.includes(topic.id);
                      return (
                        <div
                          key={topic.id}
                          className={`p-2.5 rounded-xl border text-xs ${
                            isDone ? 'bg-emerald-950/30 border-emerald-800 text-emerald-200' : 'bg-[#12040b] border-[#260c18] text-[#a68690]'
                          }`}
                        >
                          <div className="font-bold truncate text-white">{topic.title}</div>
                          <div className="text-[10px] mt-1 text-[#7a5b67]">{isDone ? 'Completed' : 'Pending'}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Shailu Bottom Action */}
              <div className="p-2.5 rounded-xl bg-[#14060d] border border-[#260c18] text-xs flex items-center justify-between">
                <span className="text-[#a68690]">Onboarding Status:</span>
                <span className="font-bold text-purple-300">
                  {shailuConfig.onboarded ? 'Ready for Login' : 'Credentials Not Set'}
                </span>
              </div>
            </div>
          </Card3D>
        )}
      </div>

      {/* SIDE-BY-SIDE SCHOLAR COMPARISON MATRIX */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#ff3366]" />
            <h3 className="text-base font-extrabold text-white">Side-by-Side Scholar Comparison</h3>
          </div>
          <span className="text-xs text-[#a68690]">Real-time Evaluation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#260c18] text-[#a68690]">
                <th className="pb-2.5 font-bold uppercase tracking-wider">Metric</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-center text-[#ff8099]">Mahi</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-center text-purple-400">Shailu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e0813]">
              <tr>
                <td className="py-2.5 text-slate-300 font-semibold">Account State</td>
                <td className="py-2.5 text-center font-bold text-emerald-400">Active & Verified</td>
                <td className="py-2.5 text-center font-bold text-purple-300">
                  {shailuConfig.onboarded ? 'Credentials Configured' : 'Pending Onboarding'}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-300 font-semibold">Total Quiz Submissions</td>
                <td className="py-2.5 text-center font-bold text-white">{mahiStats.total}</td>
                <td className="py-2.5 text-center font-bold text-white">{shailuStats.total}</td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-300 font-semibold">Topics Mastered</td>
                <td className="py-2.5 text-center font-bold text-white">
                  {TOPIC_CATEGORIES.filter(t => mahiStats.completedQuizIds.includes(t.id)).length} / 5
                </td>
                <td className="py-2.5 text-center font-bold text-white">
                  {TOPIC_CATEGORIES.filter(t => shailuStats.completedQuizIds.includes(t.id)).length} / 5
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-300 font-semibold">Championship Assessments</td>
                <td className="py-2.5 text-center font-bold text-white">
                  {mahiStats.completedQuizIds.filter(id => id.includes('final')).length} / 2
                </td>
                <td className="py-2.5 text-center font-bold text-white">
                  {shailuStats.completedQuizIds.filter(id => id.includes('final')).length} / 2
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-300 font-semibold">Average Score</td>
                <td className="py-2.5 text-center font-bold text-[#ff8099]">{mahiStats.avgScore}%</td>
                <td className="py-2.5 text-center font-bold text-purple-300">{shailuStats.avgScore}%</td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-300 font-semibold">Best Accuracy</td>
                <td className="py-2.5 text-center font-bold text-emerald-400">{mahiStats.bestScore}%</td>
                <td className="py-2.5 text-center font-bold text-emerald-400">{shailuStats.bestScore}%</td>
              </tr>
              <tr>
                <td className="py-2.5 text-slate-300 font-semibold">Isolated Progress Reset</td>
                <td className="py-2.5 text-center">
                  <button
                    onClick={() => {
                      setTargetStudentForReset('Mahi');
                      setResetScope('all');
                      setResetModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#ff3366] hover:underline"
                  >
                    Reset Mahi Progress
                  </button>
                </td>
                <td className="py-2.5 text-center">
                  <button
                    onClick={() => {
                      setTargetStudentForReset('Shailu');
                      setResetScope('all');
                      setResetModalOpen(true);
                    }}
                    className="text-xs font-bold text-purple-400 hover:underline"
                  >
                    Reset Shailu Progress
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SHAILU ONBOARDING MODAL */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#14060d] border border-[#3a0d20] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#260c18]">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-extrabold text-white">Onboard Scholar: Shailu</h3>
              </div>
              <button onClick={() => setShowOnboardModal(false)} className="text-[#a68690] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#a68690]">
              Configure Shailu's credentials. Once saved, Shailu can sign in on the student portal using this email and access code.
            </p>

            <form onSubmit={handleSaveShailuAccount} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#a68690] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={shailuEmail}
                    onChange={e => setShailuEmail(e.target.value)}
                    placeholder="e.g. shailu@gmail.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0e0208] border border-[#2b0c18] text-xs text-white placeholder:text-[#7a5b67] focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300">
                    Access Code / Password
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="text-[11px] font-bold text-purple-400 hover:text-purple-300"
                  >
                    Generate Code
                  </button>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#a68690] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={shailuPassword}
                    onChange={e => setShailuPassword(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0e0208] border border-[#2b0c18] text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  User Role
                </label>
                <select
                  value={shailuRole}
                  onChange={e => setShailuRole(e.target.value as 'student' | 'admin')}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e0208] border border-[#2b0c18] text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="student">Student (Scholar)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#260c18]">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1e0813] text-[#a68690] hover:text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Onboard Shailu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INDEPENDENT PROGRESS RESET MODAL */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#14060d] border border-red-900/60 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-red-900/40 text-red-500">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-extrabold text-white">
                Reset Progress: {targetStudentForReset}
              </h3>
            </div>

            <p className="text-xs text-slate-300">
              You are about to reset progress for <strong className="text-white">{targetStudentForReset}</strong>.
              This operation is strictly isolated and will <strong>NOT</strong> affect the other scholar.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Reset Scope</label>
                <select
                  value={resetScope}
                  onChange={e => setResetScope(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e0208] border border-[#2b0c18] text-xs text-white"
                >
                  <option value="all">Full Reset (All attempts, topics & badges)</option>
                  {TOPIC_CATEGORIES.map(t => (
                    <option key={t.id} value={t.id}>Reset Topic: {t.title}</option>
                  ))}
                  <option value="semi-final">Reset Championship: Semi-Final Test</option>
                  <option value="grand-final">Reset Championship: Grand Test</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Type <span className="font-mono text-red-400 font-black">RESET</span> to confirm
                </label>
                <input
                  type="text"
                  value={resetConfirmWord}
                  onChange={e => setResetConfirmWord(e.target.value)}
                  placeholder="RESET"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e0208] border border-red-900/60 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#260c18]">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                disabled={isResetting}
                className="px-4 py-2 rounded-xl bg-[#1e0813] text-[#a68690] hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReset}
                disabled={isResetting || resetConfirmWord.trim().toUpperCase() !== 'RESET'}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white text-xs font-bold transition-all shadow-ruby disabled:opacity-50 flex items-center gap-1.5"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                <span>{isResetting ? 'Resetting...' : `Confirm Reset for ${targetStudentForReset}`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
