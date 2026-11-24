import React, { useState } from 'react';
import {
  Users,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Layers,
  X,
  BookOpen,
  Check,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  KeyRound
} from 'lucide-react';
import type { QuizAttempt } from '../../types/quiz';
import { TOPIC_CATEGORIES, calculateTopicProgress } from '../../data/topics';
import { Card3D } from '../ui/Card3D';
import { MAHI_STUDENT_ID, provisionStudentAccount, adminUpdateStudentCredentials } from '../../utils/supabase';

interface MultiStudentHubProps {
  attempts: QuizAttempt[];
  completedDays?: string[];
  onResetStudent: (studentId: string, studentName: string, quizId?: string) => Promise<void>;
  onViewAnswerSheet: (attempt: QuizAttempt) => void;
  onRefreshData: () => Promise<void>;
}

interface StoredStudentAccount {
  email: string;
  username: string;
  displayName: string;
  onboarded: boolean;
  userId?: string;
  accessCode?: string;
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

  // Student Provisioning Form State (strictly enforced for Shailu)
  const [displayName, setDisplayName] = useState('Shailu');
  const [username, setUsername] = useState('shailu');
  const [accessCode, setAccessCode] = useState('2580');
  const [initialPassword, setInitialPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [provisionLoading, setProvisionLoading] = useState(false);
  const [provisionError, setProvisionError] = useState<string | null>(null);
  const [onboardSuccessMessage, setOnboardSuccessMessage] = useState<string | null>(null);

  // Manage Credentials Modal State (for updating access code or password)
  const [showManageCredsModal, setShowManageCredsModal] = useState(false);
  const [manageAccessCode, setManageAccessCode] = useState('2580');
  const [managePassword, setManagePassword] = useState('');
  const [manageConfirmPw, setManageConfirmPw] = useState('');
  const [manageLoading, setManageLoading] = useState(false);
  const [manageError, setManageError] = useState<string | null>(null);
  const [showManagePw, setShowManagePw] = useState(false);

  // Independent Reset Modal state
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [targetStudentForReset, setTargetStudentForReset] = useState<'Mahi' | 'Shailu'>('Mahi');
  const [resetScope, setResetScope] = useState<'all' | string>('all');
  const [resetConfirmWord, setResetConfirmWord] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Stored state for Shailu
  const [shailuConfig, setShailuConfig] = useState<StoredStudentAccount>(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('spideyy_shailu_account');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {
      email: 'shailu@users.spideyyquiz.invalid',
      username: 'shailu',
      displayName: 'Shailu',
      onboarded: false,
      accessCode: '2580'
    };
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

  // Handle Explicit Student Account Provisioning by Admin Sanju
  const handleProvisionStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvisionError(null);

    const cleanDisplay = displayName.trim();
    const cleanUsername = username.toLowerCase().trim();

    if (!cleanDisplay) {
      setProvisionError('Student display name is required.');
      return;
    }
    if (!cleanUsername || cleanUsername.length < 3) {
      setProvisionError('Username must be at least 3 characters.');
      return;
    }
    if (['mahi', 'sanju', 'admin'].includes(cleanUsername)) {
      setProvisionError(`Username '${cleanUsername}' is reserved.`);
      return;
    }
    if (!initialPassword || initialPassword.length < 4) {
      setProvisionError('Password must be at least 4 characters.');
      return;
    }
    if (initialPassword !== confirmPassword) {
      setProvisionError('Initial password and confirm password do not match.');
      return;
    }

    const cleanAccessCode = accessCode.trim();
    if (!/^\d{4}$/.test(cleanAccessCode)) {
      setProvisionError('Access code must be exactly 4 numeric digits (e.g. 2580).');
      return;
    }
    if (cleanAccessCode === '2002' || cleanAccessCode === '2718') {
      setProvisionError(`Access code '${cleanAccessCode}' is reserved by another account.`);
      return;
    }

    setProvisionLoading(true);

    try {
      const res = await provisionStudentAccount({
        displayName: cleanDisplay,
        username: cleanUsername,
        password: initialPassword,
        confirmPassword,
        accessCode: cleanAccessCode
      });

      if (res.success) {
        const updatedConfig: StoredStudentAccount = {
          email: res.email || `${cleanUsername}@users.spideyyquiz.invalid`,
          displayName: cleanDisplay,
          username: cleanUsername,
          userId: res.userId,
          onboarded: true,
          accessCode: cleanAccessCode
        };
        setShailuConfig(updatedConfig);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('spideyy_shailu_account', JSON.stringify(updatedConfig));
        }
        setOnboardSuccessMessage(res.message || `Student '${cleanDisplay}' successfully provisioned with username: ${cleanUsername} and access code: ${cleanAccessCode}.`);
        setShowOnboardModal(false);
        setInitialPassword('');
        setConfirmPassword('');
        await onRefreshData();
      } else {
        setProvisionError(res.error || 'Failed to provision student account.');
      }
    } catch (err) {
      setProvisionError(err instanceof Error ? err.message : String(err));
    } finally {
      setProvisionLoading(false);
    }
  };

  // Handle Admin Securely Changing Shailu's Access Code or Password
  const handleUpdateCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManageError(null);

    const cleanCode = manageAccessCode.trim();
    if (cleanCode && !/^\d{4}$/.test(cleanCode)) {
      setManageError('Access code must be exactly 4 numeric digits.');
      return;
    }
    if (cleanCode && (cleanCode === '2002' || cleanCode === '2718')) {
      setManageError(`Access code '${cleanCode}' is reserved.`);
      return;
    }
    if (managePassword && managePassword.length < 4) {
      setManageError('Password must be at least 4 characters long.');
      return;
    }
    if (managePassword && managePassword !== manageConfirmPw) {
      setManageError('New password and confirm password do not match.');
      return;
    }
    if (!cleanCode && !managePassword) {
      setManageError('Please enter a new access code or password.');
      return;
    }

    setManageLoading(true);
    try {
      const res = await adminUpdateStudentCredentials({
        userId: shailuConfig.userId,
        username: shailuConfig.username || 'shailu',
        newAccessCode: cleanCode || undefined,
        newPassword: managePassword || undefined
      });

      if (res.success) {
        const updated: StoredStudentAccount = {
          ...shailuConfig,
          accessCode: cleanCode || shailuConfig.accessCode || '2580'
        };
        setShailuConfig(updated);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('spideyy_shailu_account', JSON.stringify(updated));
        }
        setOnboardSuccessMessage(res.message || `Credentials for Shailu updated successfully. Access code: ${cleanCode || shailuConfig.accessCode || '2580'}`);
        setShowManageCredsModal(false);
        setManagePassword('');
        setManageConfirmPw('');
        await onRefreshData();
      } else {
        setManageError(res.error || 'Failed to update student credentials.');
      }
    } catch (err) {
      setManageError(err instanceof Error ? err.message : String(err));
    } finally {
      setManageLoading(false);
    }
  };

  // Handle Reset Action
  const handleExecuteReset = async () => {
    if (resetConfirmWord.trim().toUpperCase() !== 'RESET') {
      alert('Please type "RESET" to confirm.');
      return;
    }

    setIsResetting(true);
    try {
      const studentId = targetStudentForReset === 'Mahi'
        ? MAHI_STUDENT_ID
        : (shailuConfig.userId || 'shailu-student-id');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1e3a5f]" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Multi-Student Workspace
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-[#800020] border border-slate-200">
              2 Scholars
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Independent topic learning, separate test attempts, answer sheets, and isolated progress resets for Mahi and Shailu.
          </p>
        </div>

        {/* Student Selector Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200">
          <button
            onClick={() => setSelectedStudentTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedStudentTab === 'all'
                ? 'bg-[#1e3a5f] text-white shadow-soft'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Scholars
          </button>
          <button
            onClick={() => setSelectedStudentTab('mahi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedStudentTab === 'mahi'
                ? 'bg-[#1e3a5f] text-white shadow-soft'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Mahi</span>
          </button>
          <button
            onClick={() => setSelectedStudentTab('shailu')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedStudentTab === 'shailu'
                ? 'bg-[#1e3a5f] text-white shadow-soft'
                : 'text-slate-500 hover:text-slate-900'
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
          <button onClick={() => setOnboardSuccessMessage(null)} className="text-emerald-400 hover:text-slate-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STUDENT CARDS: MAHI & SHAILU */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* STUDENT 1: MAHI */}
        {(selectedStudentTab === 'all' || selectedStudentTab === 'mahi') && (
          <Card3D intensity={6} depth={8}>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16050e]/95 to-[#0e0208]/95 border border-slate-200 shadow-lg flex flex-col justify-between space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9e1030] to-[#ff3366] text-white flex items-center justify-center font-black text-xl shadow-soft">
                    M
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">Mahi</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                        Active Scholar
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">boddukurimahima1234@gmail.com</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTargetStudentForReset('Mahi');
                    setResetScope('all');
                    setResetModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#3a0d20] text-[#800020] border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Reset Mahi's Progress"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Mahi</span>
                </button>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-center">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Attempts</div>
                  <div className="text-base font-bold text-slate-900">{mahiStats.total}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Avg Score</div>
                  <div className="text-base font-black text-[#800020]">{mahiStats.avgScore}%</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Best Score</div>
                  <div className="text-base font-black text-emerald-400">{mahiStats.bestScore}%</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Access Code</div>
                  <div className="text-base font-black font-mono text-amber-300">2002</div>
                </div>
              </div>

              {/* Topic Completion Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#1e3a5f]" />
                    <span>Topic & Multi-Quiz Mastery</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {TOPIC_CATEGORIES.filter(t => t.isPublished && calculateTopicProgress(t.id, mahiAttempts, mahiStats.completedQuizIds).completionPercentage === 100).length} of {TOPIC_CATEGORIES.filter(t => t.isPublished).length} Topics Mastered
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TOPIC_CATEGORIES.filter(t => t.isPublished).map(topic => {
                    const tProgress = calculateTopicProgress(topic.id, mahiAttempts, mahiStats.completedQuizIds);
                    const isDone = tProgress.completionPercentage === 100;

                    return (
                      <div
                        key={topic.id}
                        className={`p-2.5 rounded-xl border text-xs transition-all ${
                          isDone
                            ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                            : tProgress.completedQuizzes > 0
                            ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <div className="font-bold truncate text-white">{topic.title}</div>
                        <div className="text-[10px] flex items-center justify-between mt-1">
                          <span>{tProgress.completedQuizzes}/{tProgress.publishedQuizzes} Qzs</span>
                          <span className={isDone ? 'text-emerald-400 font-bold' : tProgress.totalAttemptsCount > 0 ? 'text-[#800020] font-bold' : 'text-slate-400'}>
                            {tProgress.totalAttemptsCount > 0 ? `${tProgress.accuracyPercentage}% Acc` : 'Unattempted'}
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
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <div className="font-bold truncate text-amber-300">Semi-Final Test</div>
                    <div className="text-[10px] flex items-center justify-between mt-1">
                      <span>{mahiAttempts.filter(a => a.quizId === 'semi-final').length} att.</span>
                      <span className={mahiStats.completedQuizIds.includes('semi-final') ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                        {mahiStats.completedQuizIds.includes('semi-final') ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity footer */}
              {mahiStats.lastAttempt ? (
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between">
                  <div className="truncate">
                    <span className="text-slate-500">Latest: </span>
                    <strong className="text-slate-900">{mahiStats.lastAttempt.quizId.toUpperCase()}</strong>
                    <span className="text-emerald-400 ml-1.5 font-bold">({mahiStats.lastAttempt.percentage}%)</span>
                  </div>
                  <button
                    onClick={() => onViewAnswerSheet(mahiStats.lastAttempt!)}
                    className="text-[#1e3a5f] hover:text-[#800020] font-bold text-xs flex items-center gap-1"
                  >
                    <span>View Sheet</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 text-center">
                  Mahi is ready for her first topic test.
                </div>
              )}
            </div>
          </Card3D>
        )}

        {/* STUDENT 2: SHAILU */}
        {(selectedStudentTab === 'all' || selectedStudentTab === 'shailu') && (
          <Card3D intensity={6} depth={8}>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16050e]/95 to-[#0e0208]/95 border border-slate-200 shadow-lg flex flex-col justify-between space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-700 to-purple-600 text-white flex items-center justify-center font-black text-xl shadow-lg">
                    S
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">Shailu</h3>
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
                    <p className="text-xs text-slate-500 font-mono">
                      {shailuConfig.email || 'Awaiting Admin setup'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {shailuConfig.onboarded ? (
                    <button
                      onClick={() => {
                        setManageAccessCode(shailuConfig.accessCode || '2580');
                        setManagePassword('');
                        setManageConfirmPw('');
                        setManageError(null);
                        setShowManageCredsModal(true);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-800 text-xs font-bold transition-all flex items-center gap-1.5"
                      title="Manage Access Code and Password"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                      <span>Manage Credentials</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setDisplayName(shailuConfig.displayName || 'Shailu');
                        setUsername(shailuConfig.username || 'shailu');
                        setAccessCode(shailuConfig.accessCode || '2580');
                        setInitialPassword('');
                        setConfirmPassword('');
                        setProvisionError(null);
                        setShowOnboardModal(true);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-800 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Provision Shailu</span>
                    </button>
                  )}

                  {shailuStats.total > 0 && (
                    <button
                      onClick={() => {
                        setTargetStudentForReset('Shailu');
                        setResetScope('all');
                        setResetModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#3a0d20] text-[#800020] border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                      title="Reset Shailu's Progress"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-center">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Attempts</div>
                  <div className="text-base font-bold text-slate-900">{shailuStats.total}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Avg Score</div>
                  <div className="text-base font-black text-[#800020]">{shailuStats.avgScore}%</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Best Score</div>
                  <div className="text-base font-black text-emerald-400">{shailuStats.bestScore}%</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Access Code</div>
                  <div className="text-base font-black font-mono text-amber-300">{shailuConfig.accessCode || '2580'}</div>
                </div>
              </div>

              {/* Shailu Empty State or Progress */}
              {shailuStats.total === 0 ? (
                <div className="p-5 rounded-xl bg-slate-50/80 border border-dashed border-slate-200 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-purple-950/60 border border-purple-800 text-purple-300 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-300 font-semibold">
                    Shailu hasn't attempted any quizzes yet.
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Initial progress is initialized to zero. Once she signs in using username <strong className="text-purple-300">shailu</strong>, her scores and answer sheets will appear here independently.
                  </p>
                  {!shailuConfig.onboarded && (
                    <button
                      onClick={() => {
                        setDisplayName('Shailu');
                        setUsername('shailu');
                        setInitialPassword('');
                        setConfirmPassword('');
                        setProvisionError(null);
                        setShowOnboardModal(true);
                      }}
                      className="mt-2 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Provision Shailu's Account</span>
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
                    <span className="text-[11px] text-slate-500">
                      {TOPIC_CATEGORIES.filter(t => t.isPublished && calculateTopicProgress(t.id, shailuAttempts, shailuStats.completedQuizIds).completionPercentage === 100).length} of {TOPIC_CATEGORIES.filter(t => t.isPublished).length} Topics
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TOPIC_CATEGORIES.filter(t => t.isPublished).map(topic => {
                      const tProgress = calculateTopicProgress(topic.id, shailuAttempts, shailuStats.completedQuizIds);
                      const isDone = tProgress.completionPercentage === 100;
                      return (
                        <div
                          key={topic.id}
                          className={`p-2.5 rounded-xl border text-xs ${
                            isDone ? 'bg-emerald-950/30 border-emerald-800 text-emerald-200' : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          <div className="font-bold truncate text-white">{topic.title}</div>
                          <div className="text-[10px] mt-1 text-slate-400">{isDone ? 'Completed' : `${tProgress.completedQuizzes}/${tProgress.publishedQuizzes} Qzs`}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Shailu Bottom Action */}
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between">
                <span className="text-slate-500">Onboarding Status:</span>
                <span className="font-bold text-purple-300">
                  {shailuConfig.onboarded ? 'Ready for Login' : 'Credentials Not Set'}
                </span>
              </div>
            </div>
          </Card3D>
        )}
      </div>

      {/* SIDE-BY-SIDE SCHOLAR COMPARISON MATRIX */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#12050c]/90 border border-slate-200 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#1e3a5f]" />
            <h3 className="text-base font-bold text-slate-900">Side-by-Side Scholar Comparison</h3>
          </div>
          <span className="text-xs text-slate-500">Real-time Evaluation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-2.5 font-bold uppercase tracking-wider">Metric</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-center text-[#800020]">Mahi</th>
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
                  {TOPIC_CATEGORIES.filter(t => t.isPublished && calculateTopicProgress(t.id, mahiAttempts, mahiStats.completedQuizIds).completionPercentage === 100).length} / {TOPIC_CATEGORIES.filter(t => t.isPublished).length}
                </td>
                <td className="py-2.5 text-center font-bold text-white">
                  {TOPIC_CATEGORIES.filter(t => t.isPublished && calculateTopicProgress(t.id, shailuAttempts, shailuStats.completedQuizIds).completionPercentage === 100).length} / {TOPIC_CATEGORIES.filter(t => t.isPublished).length}
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
                <td className="py-2.5 text-center font-bold text-[#800020]">{mahiStats.avgScore}%</td>
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
                    className="text-xs font-bold text-[#1e3a5f] hover:underline"
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

      {/* SECURE ADMIN PROVISIONING MODAL FOR SHAILU */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-purple-900/60 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-slate-900">Provision Student Account</h3>
              </div>
              <button
                onClick={() => {
                  setShowOnboardModal(false);
                  setProvisionError(null);
                }}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Create a dedicated student account for <strong className="text-slate-900">Shailu</strong>.
              Initial progress will be zero, curriculum will be shared, and all attempts will remain strictly isolated from Mahi.
            </p>

            {provisionError && (
              <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{provisionError}</span>
              </div>
            )}

            <form onSubmit={handleProvisionStudentSubmit} className="space-y-3.5">
              {/* Field 1: Student Display Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Student Display Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="e.g. Shailu"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0e0208] border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 font-semibold"
                  />
                </div>
              </div>

              {/* Field 2: Username (Prepopulated with shailu) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300">
                    Username
                  </label>
                  <span className="text-[10px] text-purple-400 font-mono">Lowercase normalized</span>
                </div>
                <div className="relative">
                  <span className="text-xs font-bold text-purple-400 absolute left-3 top-2">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="shailu"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0e0208] border border-slate-200 text-xs font-mono text-purple-300 placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  Internal synthetic identity: {username || 'shailu'}@users.spideyyquiz.invalid
                </p>
              </div>

              {/* Field 3: 4-Digit Access Code */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300">
                    4-Digit Access Code
                  </label>
                  <span className="text-[10px] text-amber-300 font-mono">1-Click Login Code</span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    pattern="[0-9]*"
                    maxLength={4}
                    inputMode="numeric"
                    required
                    value={accessCode}
                    onChange={e => setAccessCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="2580"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0e0208] border border-slate-200 text-xs font-mono text-amber-300 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 font-bold"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Default: <span className="text-amber-300 font-bold font-mono">2580</span>. Shailu can use this 4-digit code for 1-click access-code login.
                </p>
              </div>

              {/* Field 4: Initial Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300">
                    Initial Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    {showPw ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPw ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={initialPassword}
                    onChange={e => setInitialPassword(e.target.value)}
                    placeholder="Enter password (min 4 characters)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0e0208] border border-slate-200 text-xs font-mono text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Field 5: Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password to confirm"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0e0208] border border-slate-200 text-xs font-mono text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Field 6: Enforced Role Badge */}
              <div className="p-2.5 rounded-xl bg-[#0a0206] border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Account Role</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                    Student (Scholar)
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Role is strictly enforced server-side. Arbitrary roles cannot be assigned.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowOnboardModal(false);
                    setProvisionError(null);
                  }}
                  disabled={provisionLoading}
                  className="px-4 py-2 rounded-xl bg-[#1e0813] text-slate-500 hover:text-slate-900 text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={provisionLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-700 hover:from-purple-700 hover:to-indigo-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {provisionLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Provisioning Account…</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Provision Scholar Shailu</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE CREDENTIALS / ACCESS CODE MODAL FOR SHAILU */}
      {showManageCredsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-purple-900/60 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-purple-900/40">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-slate-900">
                  Manage Credentials: Shailu
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowManageCredsModal(false);
                  setManageError(null);
                }}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Assign a new 4-digit access code or update password for <strong className="text-slate-900">Shailu</strong>.
              All changes are authenticated server-side and take effect immediately.
            </p>

            {manageError && (
              <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{manageError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateCredentialsSubmit} className="space-y-3.5">
              {/* Field 1: Access Code */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300">
                    4-Digit Access Code
                  </label>
                  <span className="text-[10px] text-amber-300 font-mono">Current / New Code</span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    pattern="[0-9]*"
                    maxLength={4}
                    inputMode="numeric"
                    required
                    value={manageAccessCode}
                    onChange={e => setManageAccessCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="2580"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0e0208] border border-slate-200 text-xs font-mono text-amber-300 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 font-bold"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Shailu uses this 4-digit code to log in via Access Code. Default is <span className="text-amber-300 font-bold font-mono">2580</span>.
                </p>
              </div>

              {/* Field 2: New Password (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300">
                    New Password (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowManagePw(!showManagePw)}
                    className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    {showManagePw ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showManagePw ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showManagePw ? 'text' : 'password'}
                    value={managePassword}
                    onChange={e => setManagePassword(e.target.value)}
                    placeholder="Leave blank to keep existing password"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0e0208] border border-slate-200 text-xs font-mono text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Field 3: Confirm New Password */}
              {managePassword && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type={showManagePw ? 'text' : 'password'}
                      required={!!managePassword}
                      value={manageConfirmPw}
                      onChange={e => setManageConfirmPw(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0e0208] border border-slate-200 text-xs font-mono text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowManageCredsModal(false);
                    setManageError(null);
                  }}
                  disabled={manageLoading}
                  className="px-4 py-2 rounded-xl bg-[#1e0813] text-slate-500 hover:text-slate-900 text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={manageLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-700 hover:from-purple-700 hover:to-indigo-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {manageLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Updating Credentials…</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INDEPENDENT PROGRESS RESET MODAL */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-red-900/60 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-red-900/40 text-red-500">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">
                Reset Progress: {targetStudentForReset}
              </h3>
            </div>

            <p className="text-xs text-slate-300">
              You are about to reset progress for <strong className="text-slate-900">{targetStudentForReset}</strong>.
              This operation is strictly isolated and will <strong>NOT</strong> affect the other scholar.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Reset Scope</label>
                <select
                  value={resetScope}
                  onChange={e => setResetScope(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e0208] border border-slate-200 text-xs text-slate-900"
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

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                disabled={isResetting}
                className="px-4 py-2 rounded-xl bg-[#1e0813] text-slate-500 hover:text-slate-900 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReset}
                disabled={isResetting || resetConfirmWord.trim().toUpperCase() !== 'RESET'}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white text-xs font-bold transition-all shadow-soft disabled:opacity-50 flex items-center gap-1.5"
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
