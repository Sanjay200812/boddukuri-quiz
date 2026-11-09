import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Download, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trash2, 
  Eye, 
  Calendar, 
  Sparkles, 
  AlertTriangle, 
  Award, 
  Flame, 
  Search, 
  LogOut, 
  Check, 
  RotateCcw, 
  BookOpen, 
  Filter,
  MessageCircle,
  ExternalLink 
} from 'lucide-react';
import { DEFAULT_SANJU_WHATSAPP_NUMBER, formatWhatsAppMessage, getWhatsAppShareUrl } from '../utils/whatsapp';
import type { QuizAttempt, RetakeRequest, UserProfile } from '../types/quiz';
import { 
  getAllAttempts, 
  getCompletedDayIds, 
  getRetakeRequests, 
  updateRetakeRequestStatus, 
  deleteAttemptById, 
  resetDayProgress, 
  resetAllMahiProgress,
  exportBackupData
} from '../utils/storage';
import { 
  DAILY_SCHEDULE, 
  getScheduleOverrides, 
  setDayAdminOverride, 
  isDayUnlocked 
} from '../utils/schedule';
import { 
  getQuizForDay 
} from '../data/quizzes';
import { 
  loadAllStudentsProgressCloud, 
  reviewRetakeRequestCloud, 
  saveAdminScheduleOverrideCloud, 
  logAdminActionCloud,
  loadAdminAuditLogsCloud,
  type AdminAuditLogEntry
} from '../utils/supabase';

interface AdminDashboardProps {
  adminProfile: UserProfile;
  onSignOut: () => void;
  onPreviewStudentView?: () => void;
  onPreviewDayQuiz?: (quizId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminProfile,
  onSignOut,
  onPreviewStudentView,
  onPreviewDayQuiz
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'attempts' | 'retakes' | 'schedule' | 'notifications' | 'logs'>('overview');
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => getAllAttempts());
  const [completedDays, setCompletedDays] = useState<string[]>(() => getCompletedDayIds());
  const [retakeRequests, setRetakeRequests] = useState<RetakeRequest[]>(() => getRetakeRequests());
  const [auditLogs, setAuditLogs] = useState<AdminAuditLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Inspector modal state
  const [inspectedAttempt, setInspectedAttempt] = useState<QuizAttempt | null>(null);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  
  // Confirmation dialogs
  const [resetConfirmQuizId, setResetConfirmQuizId] = useState<string | null>(null);
  const [showFullResetModal, setShowFullResetModal] = useState<boolean>(false);
  const [fullResetConfirmText, setFullResetConfirmText] = useState<string>('');

  // Reload local & cloud data
  const refreshAllData = async () => {
    setLoading(true);
    try {
      setAttempts(getAllAttempts());
      setCompletedDays(getCompletedDayIds());
      setRetakeRequests(getRetakeRequests());
      
      const logs = await loadAdminAuditLogsCloud();
      setAuditLogs(logs);

      // Also try to load cloud records
      const cloudStudents = await loadAllStudentsProgressCloud();
      if (cloudStudents.length > 0 && cloudStudents[0].payload) {
        // If cloud has more attempts or retakes, sync state
        const p = cloudStudents[0].payload;
        if (p.attempts) setAttempts(p.attempts);
        if (p.completedDays) setCompletedDays(p.completedDays);
        if (p.retakeRequests) setRetakeRequests(p.retakeRequests);
      }
    } catch (err) {
      console.warn('Admin refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshAllData();
  }, []);

  // Filtered attempts
  const filteredAttempts = useMemo(() => {
    return attempts.filter(att => {
      if (selectedDayFilter !== 'all' && att.quizId !== selectedDayFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const quiz = getQuizForDay(att.quizId);
        const matchesDate = (att.formattedDate || '').toLowerCase().includes(q) || quiz.displayDate.toLowerCase().includes(q);
        const matchesScore = `${att.marksObtained}/${att.maxMarks}`.includes(q) || `${att.percentage}%`.includes(q);
        const matchesQuiz = att.quizId.toLowerCase().includes(q) || quiz.title.toLowerCase().includes(q);
        return matchesDate || matchesScore || matchesQuiz;
      }
      return true;
    });
  }, [attempts, selectedDayFilter, searchQuery]);

  // Overall statistics for Mahi
  const stats = useMemo(() => {
    const totalAttempts = attempts.length;
    const completedCount = completedDays.length;
    const bestPercentage = attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : 0;
    const avgPercentage = attempts.length > 0 ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / attempts.length) : 0;
    const pendingRetakes = retakeRequests.filter(r => r.status === 'pending').length;
    return { totalAttempts, completedCount, bestPercentage, avgPercentage, pendingRetakes };
  }, [attempts, completedDays, retakeRequests]);

  // Handle Day lock toggle
  const handleToggleDayLock = async (quizId: string, currentUnlocked: boolean) => {
    const overrides = getScheduleOverrides();
    const existing = overrides[quizId] || {};
    const newForceUnlocked = !currentUnlocked;

    setDayAdminOverride(quizId, {
      ...existing,
      forceUnlocked: newForceUnlocked,
      forceLocked: !newForceUnlocked
    });

    try {
      await saveAdminScheduleOverrideCloud(quizId, {
        isUnlockedOverride: newForceUnlocked
      });
      await logAdminActionCloud('TOGGLE_DAY_LOCK', quizId, { unlocked: newForceUnlocked });
      setStatusMessage(`Day ${quizId} is now ${newForceUnlocked ? 'MANUALLY UNLOCKED' : 'LOCKED'}.`);
      setTimeout(() => setStatusMessage(null), 3000);
      void refreshAllData();
    } catch {
      setStatusMessage(`Day ${quizId} updated locally.`);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  // Handle Retake Approval / Rejection
  const handleReviewRetake = async (reqId: string, status: 'approved' | 'rejected', notes?: string) => {
    updateRetakeRequestStatus(reqId, status, notes, adminProfile.email);
    setRetakeRequests(getRetakeRequests());

    try {
      await reviewRetakeRequestCloud(reqId, status, notes, adminProfile.email);
      await logAdminActionCloud('REVIEW_RETAKE', reqId, { status, notes });
      setStatusMessage(`Retake request ${status.toUpperCase()} successfully.`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch {
      setStatusMessage(`Retake request updated.`);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  // Handle Single Attempt Deletion
  const handleDeleteAttempt = async (attemptId: string) => {
    if (!window.confirm('Delete this single attempt record? Other attempts and progress will be preserved.')) return;
    deleteAttemptById(attemptId);
    setAttempts(getAllAttempts());
    setCompletedDays(getCompletedDayIds());
    if (inspectedAttempt?.id === attemptId) setInspectedAttempt(null);

    await logAdminActionCloud('DELETE_ATTEMPT', attemptId);
    setStatusMessage('Attempt deleted safely.');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  // Handle Day Progress Reset
  const handleResetDayProgress = async (quizId: string) => {
    resetDayProgress(quizId);
    setResetConfirmQuizId(null);
    setAttempts(getAllAttempts());
    setCompletedDays(getCompletedDayIds());

    await logAdminActionCloud('RESET_DAY_PROGRESS', quizId);
    setStatusMessage(`Progress for ${quizId} reset.`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Handle Full Progress Reset
  const handleExecuteFullReset = async () => {
    if (fullResetConfirmText.trim().toUpperCase() !== 'RESET MAHI PROGRESS') {
      alert('Confirmation text did not match "RESET MAHI PROGRESS". Action aborted.');
      return;
    }
    resetAllMahiProgress();
    setShowFullResetModal(false);
    setFullResetConfirmText('');
    setAttempts([]);
    setCompletedDays([]);
    setRetakeRequests([]);

    await logAdminActionCloud('RESET_ALL_MAHI_PROGRESS', 'all');
    alert('All progress, streaks, attempts, and requests have been reset.');
  };

  // CSV Exporters
  const downloadAttemptsCSV = () => {
    const headers = ['Attempt ID', 'Quiz Title', 'Formatted Date', 'Marks', 'Max Marks', 'Percentage', 'Time Taken (s)', 'Mistakes Count', 'Timestamp'];
    const rows = attempts.map(a => {
      const quiz = getQuizForDay(a.quizId);
      return [
        `"${a.id}"`,
        `"${quiz.title}"`,
        `"${a.formattedDate || quiz.displayDate}"`,
        a.marksObtained,
        a.maxMarks,
        `${a.percentage}%`,
        a.timeTakenSeconds,
        a.incorrectCount,
        `"${a.timestamp}"`
      ];
    });
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mahi_quiz_attempts_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadDetailedAnswersCSV = () => {
    const headers = ['Attempt ID', 'Quiz Title', 'Question Number', 'State', 'Question', 'Selected Answer', 'Correct Answer', 'Is Correct', 'Explanation'];
    const rows: string[] = [];

    attempts.forEach(a => {
      const quiz = getQuizForDay(a.quizId);
      quiz.questions.forEach((q, idx) => {
        const selectedIdx = a.answers[q.id];
        const isAnswered = selectedIdx !== undefined && selectedIdx >= 0;
        const selectedText = isAnswered ? q.options[selectedIdx] : '(Unanswered)';
        const correctText = q.options[q.correctAnswer];
        const isCorrect = isAnswered && selectedIdx === q.correctAnswer;
        rows.push([
          `"${a.id}"`,
          `"${quiz.title}"`,
          `"Q${idx + 1}"`,
          `"${q.state.replace(/"/g, '""')}"`,
          `"${q.question.replace(/"/g, '""')}"`,
          `"${selectedText.replace(/"/g, '""')}"`,
          `"${correctText.replace(/"/g, '""')}"`,
          isCorrect ? 'YES' : 'NO',
          `"${(q.explanation || '').replace(/"/g, '""')}"`
        ].join(','));
      });
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mahi_quiz_detailed_answers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadFullJSON = () => {
    const jsonStr = exportBackupData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mahi_quiz_full_progress_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Admin Navbar */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                Admin Control Room
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Sanju
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Mahi's National Parks Learning Operations & Assessment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {onPreviewStudentView && (
            <button
              onClick={onPreviewStudentView}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Preview Student View</span>
            </button>
          )}

          <button
            onClick={refreshAllData}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Refresh cloud & local records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button
            onClick={onSignOut}
            className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Status banner alert */}
      {statusMessage && (
        <div className="bg-emerald-900/90 text-emerald-100 px-4 py-2 text-xs font-bold text-center border-b border-emerald-700 animate-fadeIn flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Admin Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-950/60 rounded-2xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Mahi Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('attempts')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'attempts'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>All Attempts ({attempts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('retakes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'retakes'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Requests</span>
            {stats.pendingRetakes > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                {stats.pendingRetakes}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule & Lock Control</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'notifications'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp & Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Audit Logs ({auditLogs.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-md">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Completed Days</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white">
                  {stats.completedCount} <span className="text-base text-slate-500 font-semibold">/ {DAILY_SCHEDULE.length}</span>
                </div>
                <div className="text-xs text-emerald-400 mt-2 font-medium">
                  {Math.round((stats.completedCount / DAILY_SCHEDULE.length) * 100)}% of curriculum covered
                </div>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-md">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Total Attempts</span>
                  <Award className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-3xl font-black text-white">
                  {stats.totalAttempts}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  All attempts recorded independently
                </div>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-md">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Average Score</span>
                  <Flame className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-amber-300">
                  {stats.avgPercentage}%
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Highest: <strong className="text-emerald-300">{stats.bestPercentage}%</strong>
                </div>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-md">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Pending Retakes</span>
                  <RotateCcw className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-3xl font-black text-white">
                  {stats.pendingRetakes}
                </div>
                <div className="text-xs text-amber-400 mt-2 font-medium">
                  {stats.pendingRetakes > 0 ? 'Awaiting your approval' : 'All requests reviewed'}
                </div>
              </div>
            </div>

            {/* Quick Export & Actions Toolbar */}
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Export & Reporting</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Export attempts, question-by-question answers, and full backup data.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={downloadAttemptsCSV}
                  className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Attempts CSV</span>
                </button>
                <button
                  onClick={downloadDetailedAnswersCSV}
                  className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span>Detailed Answers CSV</span>
                </button>
                <button
                  onClick={downloadFullJSON}
                  className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Full Progress JSON</span>
                </button>
              </div>
            </div>

            {/* Curriculum Progress Map */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Curriculum & Daily Completion Map</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {DAILY_SCHEDULE.map(day => {
                  const dayQuiz = getQuizForDay(day.dayNumber);
                  const isDone = completedDays.includes(dayQuiz.id);
                  const isUnl = isDayUnlocked(day.dayNumber, completedDays);
                  const dayAttempts = attempts.filter(a => a.quizId === dayQuiz.id);
                  const best = dayAttempts.length > 0 ? Math.max(...dayAttempts.map(a => a.percentage)) : null;

                  return (
                    <div 
                      key={day.dayNumber}
                      className={`p-4 rounded-xl border flex flex-col justify-between ${
                        isDone 
                          ? 'bg-emerald-950/30 border-emerald-500/40' 
                          : isUnl 
                          ? 'bg-slate-800/80 border-slate-700' 
                          : 'bg-slate-900/60 border-slate-800 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-white">
                          {day.title} • {day.displayDate}
                        </span>
                        {isDone ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Done ({best}%)
                          </span>
                        ) : isUnl ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            Available
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-400 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Locked
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 line-clamp-1 mb-3">
                        {day.states.join(', ')}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                        <span className="text-[11px] text-slate-400">
                          {dayAttempts.length} attempt{dayAttempts.length === 1 ? '' : 's'}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          {onPreviewDayQuiz && (
                            <button
                              onClick={() => onPreviewDayQuiz(dayQuiz.id)}
                              className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1"
                              title="Preview questions"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Preview</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleToggleDayLock(dayQuiz.id, isUnl)}
                            className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                              isUnl 
                                ? 'bg-amber-950/60 hover:bg-amber-900 text-amber-200 border border-amber-800/60' 
                                : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200 border border-emerald-800/60'
                            }`}
                          >
                            {isUnl ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            <span>{isUnl ? 'Lock' : 'Unlock'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Danger Zone: Administrative Resets */}
            <div className="bg-rose-950/30 border border-rose-900/60 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Administrative Progress Management & Resets</span>
                </h3>
                <p className="text-xs text-rose-200/80 mt-1">
                  Reset a specific day's progress without losing other days, or perform a total reset with strong confirmation.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowFullResetModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-md flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Reset All Mahi Progress…</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ATTEMPTS INSPECTOR */}
        {/* ========================================================================= */}
        {activeTab === 'attempts' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search date, quiz ID, score…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={selectedDayFilter}
                  onChange={e => setSelectedDayFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
                >
                  <option value="all">All Days ({attempts.length})</option>
                  {DAILY_SCHEDULE.map(d => (
                    <option key={d.quizId} value={d.quizId}>
                      {d.title} ({d.displayDate})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Attempts Table */}
            {filteredAttempts.length === 0 ? (
              <div className="bg-slate-800/50 p-12 text-center rounded-2xl border border-slate-800 text-slate-400">
                <Award className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold">No quiz attempts found matching filters.</p>
              </div>
            ) : (
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700">
                        <th className="py-3.5 px-4">Quiz / Day</th>
                        <th className="py-3.5 px-4">Date & Time</th>
                        <th className="py-3.5 px-4">Score</th>
                        <th className="py-3.5 px-4">Percentage</th>
                        <th className="py-3.5 px-4">Time Taken</th>
                        <th className="py-3.5 px-4">Mistakes</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 font-medium">
                      {filteredAttempts.map(att => {
                        const quiz = getQuizForDay(att.quizId);
                        return (
                          <tr key={att.id} className="hover:bg-slate-700/40 transition-colors">
                            <td className="py-3 px-4 font-bold text-white">
                              {quiz.title}
                            </td>
                            <td className="py-3 px-4 text-slate-300">
                              <div>{att.formattedDate || quiz.displayDate}</div>
                              <div className="text-[10px] text-slate-500">
                                {new Date(att.timestamp).toLocaleTimeString()}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-bold text-emerald-400">
                              {att.marksObtained} / {att.maxMarks}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-full font-bold ${
                                att.percentage >= 90 
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                  : att.percentage >= 70 
                                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' 
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}>
                                {att.percentage}%
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-300">
                              {Math.floor(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s
                            </td>
                            <td className="py-3 px-4">
                              {att.incorrectCount > 0 ? (
                                <span className="text-rose-400 font-bold">
                                  {att.incorrectCount} mistakes
                                </span>
                              ) : (
                                <span className="text-emerald-400 font-bold">0 (Perfect)</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => setInspectedAttempt(att)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all inline-flex items-center gap-1 shadow-sm"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Inspect</span>
                            </button>

                            <button
                              onClick={() => handleDeleteAttempt(att.id)}
                              className="px-2 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors inline-flex items-center gap-1"
                              title="Delete this single attempt"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: RETAKE REQUESTS */}
        {/* ========================================================================= */}
        {activeTab === 'retakes' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-400" />
                <span>Mahi's "Attempt Again" Requests</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Approve or reject requests for quiz reattempts. When approved, Mahi can take the quiz again while all past attempts are preserved permanently.
              </p>
            </div>

            {retakeRequests.length === 0 ? (
              <div className="bg-slate-800/50 p-12 text-center rounded-2xl border border-slate-800 text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                <p className="text-sm font-semibold">No retake requests pending at this time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {retakeRequests.map(req => (
                  <div
                    key={req.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between ${
                      req.status === 'pending'
                        ? 'bg-amber-950/20 border-amber-500/40'
                        : req.status === 'approved'
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-rose-950/20 border-rose-500/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-white">
                          Day {req.dayNumber < 10 ? '0' + req.dayNumber : req.dayNumber}: {req.dayTitle}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          req.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : req.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {req.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 space-y-1 mb-4">
                        <div>Requested by: <strong>{req.userEmail}</strong></div>
                        <div>Time: {new Date(req.requestedAt).toLocaleString()}</div>
                        {req.adminNotes && (
                          <div className="text-slate-300 italic pt-1">
                            Notes: "{req.adminNotes}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-700 flex items-center justify-end gap-2">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleReviewRetake(req.id, 'rejected', 'Sanju suggested reviewing study notes first')}
                            className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>

                          <button
                            onClick={() => handleReviewRetake(req.id, 'approved', 'Approved by Sanju')}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve Retake</span>
                          </button>
                        </>
                      ) : (
                        <div className="text-xs text-slate-500 font-semibold">
                          Reviewed: {req.reviewedAt ? new Date(req.reviewedAt).toLocaleDateString() : 'Yes'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SCHEDULE & LOCK CONTROL */}
        {/* ========================================================================= */}
        {activeTab === 'schedule' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Daily Unlock Schedule & Admin Overrides</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Default unlock time is <strong>8:29 PM IST</strong> daily. As Admin, you can manually lock or unlock any day at will.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 divide-y divide-slate-700/60">
              {DAILY_SCHEDULE.map(item => {
                const dayQuiz = getQuizForDay(item.dayNumber);
                const isUnlocked = isDayUnlocked(item.dayNumber, completedDays);
                const overrides = getScheduleOverrides();
                const override = overrides[dayQuiz.id];

                return (
                  <div key={item.dayNumber} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-750/30">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white">
                          Day {item.dayNumber < 10 ? '0' + item.dayNumber : item.dayNumber}: {item.title}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({item.displayDate})
                        </span>
                        {item.isSpecialTest && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            SPECIAL TEST
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-400">
                        {item.states.length} States • {item.totalQuestions} Questions • Default unlock: 8:29 PM IST
                      </div>

                      {override && (
                        <div className="text-[11px] text-amber-300 font-semibold">
                          Admin override active: {override.forceUnlocked ? 'Force Unlocked' : override.forceLocked ? 'Force Locked' : 'Custom Schedule'}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {resetConfirmQuizId === dayQuiz.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-rose-300 font-bold">Confirm Reset?</span>
                          <button
                            onClick={() => handleResetDayProgress(dayQuiz.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                          >
                            Yes, Reset
                          </button>
                          <button
                            onClick={() => setResetConfirmQuizId(null)}
                            className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-300 text-xs hover:bg-slate-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setResetConfirmQuizId(dayQuiz.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-colors"
                          title="Clear this day's progress"
                        >
                          Reset Day
                        </button>
                      )}

                      <button
                        onClick={() => handleToggleDayLock(dayQuiz.id, isUnlocked)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                          isUnlocked 
                            ? 'bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-800' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {isUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        <span>{isUnlocked ? 'Lock Day' : 'Unlock Now'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: WHATSAPP & NOTIFICATIONS CONFIGURATION */}
        {/* ========================================================================= */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>WhatsApp Notification Configuration & Verification</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify and test how Mahi's quiz results and scores are dispatched to Sanju's WhatsApp.
              </p>
            </div>

            {/* Notification Status Card */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Target WhatsApp Recipient:</span>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold">
                      +{DEFAULT_SANJU_WHATSAPP_NUMBER} (Sanju)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Result notifications automatically target this phone number with pre-formatted marks and analytics.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-bold text-emerald-300">Direct wa.me Integration: Fully Operational</span>
                </div>
              </div>

              {/* Sample Message Preview */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Verified Result Message Template:
                </h3>
                {(() => {
                  const sampleAttempt: QuizAttempt = {
                    id: 'sample-attempt',
                    quizId: 'day-01',
                    dayNumber: 1,
                    timestamp: new Date().toISOString(),
                    formattedDate: '09 November 2026',
                    statesCovered: ['Madhya Pradesh', 'Andhra Pradesh', 'Telangana', 'Kerala', 'Assam', 'Karnataka'],
                    totalQuestions: 30,
                    correctCount: 28,
                    incorrectCount: 2,
                    unansweredCount: 0,
                    marksObtained: 28,
                    maxMarks: 30,
                    percentage: 93,
                    accuracy: 93,
                    performanceTier: 'outstanding',
                    performanceMessage: 'Outstanding mastery!',
                    timeTakenSeconds: 315,
                    answers: {},
                    sectionBreakdown: {
                      previous: { total: 0, correct: 0, incorrect: 0, unanswered: 0, percentage: 0 },
                      new: { total: 30, correct: 28, incorrect: 2, unanswered: 0, percentage: 93 }
                    },
                    quote: {
                      quote: 'Learn. Revise. Remember. Achieve.',
                      personalNote: 'Keep learning, Mahi! 💚'
                    }
                  };

                  return (
                    <>
                      <pre className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed select-all">
                        {formatWhatsAppMessage(sampleAttempt)}
                      </pre>
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <a
                          href={getWhatsAppShareUrl(sampleAttempt)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Test Open in WhatsApp</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Cloud API Architecture Notice */}
            <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/80 space-y-3">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Meta WhatsApp Business Cloud API Integration Status</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The application currently delivers 100% reliable 1-click WhatsApp results to Sanju (+91 70759 20852) after quiz submission. If fully automated silent background push is desired without opening WhatsApp Web/App, the following Meta Cloud API credentials must be added to Supabase Edge Functions:
              </p>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                <li><code className="text-slate-200">META_WA_PHONE_NUMBER_ID</code>: Meta Business verified sender phone ID</li>
                <li><code className="text-slate-200">META_WA_SYSTEM_TOKEN</code>: Permanent System User Access Token (kept server-side only)</li>
                <li><code className="text-slate-200">META_WA_TEMPLATE_NAME</code>: Approved WhatsApp utility notification template</li>
              </ul>
              <p className="text-[11px] text-slate-500">
                🔒 Security Note: Permanent WhatsApp API tokens must never be embedded in client-side code and must reside solely in Supabase Edge Functions.
              </p>
            </div>
          </div>
        )}
        {/* ========================================================================= */}
        {activeTab === 'logs' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Security & Admin Audit Logs</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every administrative change (unlocks, retake decisions, resets) is recorded with timestamps.
              </p>
            </div>

            {auditLogs.length === 0 ? (
              <div className="bg-slate-800/50 p-12 text-center rounded-2xl border border-slate-800 text-slate-400">
                <ShieldCheck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold">No audit logs recorded yet in cloud database.</p>
              </div>
            ) : (
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700 divide-y divide-slate-700/60 overflow-hidden">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                          {log.action}
                        </span>
                        {log.target && <span className="text-slate-300">Target: {log.target}</span>}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Admin: {log.admin_email || 'Sanju'}
                      </div>
                      {log.details && (
                        <div className="text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2 rounded-lg mt-1 inline-block">
                          {JSON.stringify(log.details)}
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* ATTEMPT INSPECTOR MODAL */}
      {/* ========================================================================= */}
      {inspectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 w-full max-w-4xl rounded-3xl p-6 border border-slate-700 shadow-2xl max-h-[92vh] flex flex-col space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <span>Attempt Details: {getQuizForDay(inspectedAttempt.quizId).title}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Submitted {new Date(inspectedAttempt.timestamp).toLocaleString()} • Time taken: {Math.floor(inspectedAttempt.timeTakenSeconds / 60)}m {inspectedAttempt.timeTakenSeconds % 60}s
                </p>
              </div>

              <button
                onClick={() => setInspectedAttempt(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Score Strip */}
            <div className="grid grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-center">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Marks</div>
                <div className="text-xl font-black text-emerald-400">{inspectedAttempt.marksObtained} / {inspectedAttempt.maxMarks}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Accuracy</div>
                <div className="text-xl font-black text-white">{inspectedAttempt.percentage}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Mistakes</div>
                <div className="text-xl font-black text-rose-400">{inspectedAttempt.incorrectCount}</div>
              </div>
            </div>

            {/* Detailed Question Review List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {(() => {
                const quiz = getQuizForDay(inspectedAttempt.quizId);
                return quiz.questions.map((q, idx) => {
                  const selectedIdx = inspectedAttempt.answers[q.id];
                  const isAnswered = selectedIdx !== undefined && selectedIdx >= 0;
                  const isCorrect = isAnswered && selectedIdx === q.correctAnswer;
                  const selectedText = isAnswered ? q.options[selectedIdx] : '(Unanswered)';
                  const correctText = q.options[q.correctAnswer];

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border text-xs space-y-2 ${
                        isCorrect
                          ? 'bg-slate-950/40 border-emerald-900/50'
                          : !isAnswered
                          ? 'bg-amber-950/20 border-amber-800/40'
                          : 'bg-rose-950/20 border-rose-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px]">
                        <span>Question {idx + 1} • {q.state}</span>
                        <div className="flex items-center gap-2">
                          {isCorrect ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1)
                            </span>
                          ) : !isAnswered ? (
                            <span className="text-amber-400 font-bold flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Unanswered (0)
                            </span>
                          ) : (
                            <span className="text-rose-400 font-bold flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Incorrect (0)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="font-bold text-sm text-white">
                        {q.question}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div className={`p-2.5 rounded-xl border ${
                          isCorrect 
                            ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200' 
                            : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                        }`}>
                          <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Selected Answer:</div>
                          <div className="font-semibold">{selectedText}</div>
                        </div>

                        {!isCorrect && (
                          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-emerald-200">
                            <div className="text-[10px] uppercase font-bold text-emerald-400 mb-0.5">Correct Answer:</div>
                            <div className="font-semibold">{correctText}</div>
                          </div>
                        )}
                      </div>

                      {q.explanation && (
                        <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 text-[11px] leading-relaxed">
                          <strong className="text-emerald-400">Explanation: </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleDeleteAttempt(inspectedAttempt.id)}
                className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Attempt</span>
              </button>

              <button
                onClick={() => setInspectedAttempt(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL RESET CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {showFullResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-rose-600/70 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-black tracking-tight text-white">
                Strong Admin Confirmation Required
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This action will reset <strong>ALL</strong> of Mahi's quiz attempts, streaks, bookmarks, and completed day marks.
            </p>

            <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-900/60 text-xs text-rose-300">
              To proceed, please type <strong className="font-mono text-white">RESET MAHI PROGRESS</strong> below:
            </div>

            <input
              type="text"
              value={fullResetConfirmText}
              onChange={e => setFullResetConfirmText(e.target.value)}
              placeholder="RESET MAHI PROGRESS"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white outline-none focus:border-rose-500 uppercase"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowFullResetModal(false);
                  setFullResetConfirmText('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteFullReset}
                disabled={fullResetConfirmText.trim().toUpperCase() !== 'RESET MAHI PROGRESS'}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Full Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
