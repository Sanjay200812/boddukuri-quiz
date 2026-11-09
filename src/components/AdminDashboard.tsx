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
  MessageCircle,
  ExternalLink,
  Menu,
  Settings as SettingsIcon,
  Users,
  Inbox as InboxIcon,
  TrendingUp,
  UserCheck,
  CheckCheck,
  HelpCircle
} from 'lucide-react';
import { DEFAULT_SANJU_WHATSAPP_NUMBER, formatWhatsAppMessage, getWhatsAppShareUrl } from '../utils/whatsapp';
import type { QuizAttempt, RetakeRequest, UserProfile, InboxNotification } from '../types/quiz';
import { 
  getAllAttempts, 
  getCompletedDayIds, 
  getRetakeRequests, 
  updateRetakeRequestStatus, 
  deleteAttemptById, 
  resetDayProgress, 
  resetAllMahiProgress,
  exportBackupData,
  getInboxNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteInboxNotification
} from '../utils/storage';
import { 
  DAILY_SCHEDULE, 
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
import { Sidebar, type AdminNavTab } from './Sidebar';

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
  const [activeTab, setActiveTab] = useState<AdminNavTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => getAllAttempts());
  const [completedDays, setCompletedDays] = useState<string[]>(() => getCompletedDayIds());
  const [retakeRequests, setRetakeRequests] = useState<RetakeRequest[]>(() => getRetakeRequests());
  const [notifications, setNotifications] = useState<InboxNotification[]>(() => getInboxNotifications('admin'));
  const [_auditLogs, setAuditLogs] = useState<AdminAuditLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Inspector modal state
  const [inspectedAttempt, setInspectedAttempt] = useState<QuizAttempt | null>(null);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [inboxFilter, setInboxFilter] = useState<'all' | 'unread' | 'read'>('all');
  
  // Confirmation dialogs
  const [resetConfirmQuizId, setResetConfirmQuizId] = useState<string | null>(null);
  const [showFullResetModal, setShowFullResetModal] = useState<boolean>(false);
  const [fullResetConfirmText, setFullResetConfirmText] = useState<string>('');

  // Reload local & cloud data safely
  const refreshAllData = async () => {
    setLoading(true);
    try {
      const localAttempts = getAllAttempts();
      const localCompleted = getCompletedDayIds();
      const localRetakes = getRetakeRequests();
      const localNotifs = getInboxNotifications('admin');
      
      setAttempts(localAttempts);
      setCompletedDays(localCompleted);
      setRetakeRequests(localRetakes);
      setNotifications(localNotifs);
      
      const logs = await loadAdminAuditLogsCloud();
      setAuditLogs(logs);

      // Try to load cloud records without overwriting local data with empty arrays
      const cloudStudents = await loadAllStudentsProgressCloud();
      if (cloudStudents.length > 0 && cloudStudents[0]?.payload) {
        const p = cloudStudents[0].payload;
        if (p.attempts && p.attempts.length > 0) {
          // Merge attempts by id deduplication
          const mergedMap = new Map<string, QuizAttempt>();
          p.attempts.forEach(a => mergedMap.set(a.id, a));
          localAttempts.forEach(a => {
            if (!mergedMap.has(a.id)) mergedMap.set(a.id, a);
          });
          setAttempts(Array.from(mergedMap.values()));
        }
        if (p.completedDays && p.completedDays.length > 0) {
          const mergedDays = Array.from(new Set([...localCompleted, ...p.completedDays]));
          setCompletedDays(mergedDays);
        }
        if (p.retakeRequests && p.retakeRequests.length > 0) {
          setRetakeRequests(p.retakeRequests);
        }
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

  const unreadInboxCount = useMemo(() => {
    return notifications.filter(n => !n.read && !n.isRead).length;
  }, [notifications]);

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
    const newUnlocked = !currentUnlocked;
    setDayAdminOverride(quizId, {
      forceUnlocked: newUnlocked,
      forceLocked: !newUnlocked
    });
    
    // Cloud sync override
    await saveAdminScheduleOverrideCloud(quizId, { isUnlockedOverride: newUnlocked });
    await logAdminActionCloud('TOGGLE_DAY_LOCK', quizId, { unlocked: newUnlocked });

    setStatusMessage(`Day ${quizId.toUpperCase()} has been ${newUnlocked ? 'UNLOCKED' : 'LOCKED'}.`);
    setTimeout(() => setStatusMessage(null), 3000);
    void refreshAllData();
  };

  // Handle Retake approval/rejection
  const _handleReviewRetake = async (requestId: string, status: 'approved' | 'rejected') => {
    updateRetakeRequestStatus(requestId, status, 'Sanju (Admin)');
    await reviewRetakeRequestCloud(requestId, status, 'Sanju (Admin)');
    await logAdminActionCloud('REVIEW_RETAKE', requestId, { status });
    
    setStatusMessage(`Retake request ${status.toUpperCase()} successfully.`);
    setTimeout(() => setStatusMessage(null), 3000);
    void refreshAllData();
  };
  void _handleReviewRetake;

  // Handle attempt deletion
  const handleDeleteAttempt = async (attemptId: string) => {
    if (!window.confirm('Are you sure you want to delete this attempt permanently?')) return;
    deleteAttemptById(attemptId);
    await logAdminActionCloud('DELETE_ATTEMPT', attemptId);
    setInspectedAttempt(null);
    setStatusMessage('Attempt removed.');
    setTimeout(() => setStatusMessage(null), 3000);
    void refreshAllData();
  };

  // Handle single day reset
  const handleExecuteDayReset = async (quizId: string) => {
    resetDayProgress(quizId);
    await logAdminActionCloud('RESET_DAY_PROGRESS', quizId);
    setResetConfirmQuizId(null);
    setStatusMessage(`All progress for ${quizId.toUpperCase()} has been reset.`);
    setTimeout(() => setStatusMessage(null), 3000);
    void refreshAllData();
  };

  // Handle full reset of Mahi's data
  const handleExecuteFullReset = async () => {
    if (fullResetConfirmText.trim().toUpperCase() !== 'RESET MAHI PROGRESS') return;
    resetAllMahiProgress();
    await logAdminActionCloud('RESET_ALL_MAHI_PROGRESS', 'all', { by: adminProfile.displayName || adminProfile.fullName });
    setShowFullResetModal(false);
    setFullResetConfirmText('');
    setStatusMessage('All progress for Mahi has been reset.');
    setTimeout(() => setStatusMessage(null), 4000);
    void refreshAllData();
  };

  // Handle Inbox notification mark as read
  const handleMarkNotifRead = (id: string) => {
    markNotificationRead(id);
    setNotifications(getInboxNotifications('admin'));
  };

  // Handle Inbox notification delete
  const handleDeleteNotif = (id: string) => {
    deleteInboxNotification(id);
    setNotifications(getInboxNotifications('admin'));
  };

  // Handle Mark All Read
  const handleMarkAllRead = () => {
    markAllNotificationsRead('admin');
    setNotifications(getInboxNotifications('admin'));
    setStatusMessage('All notifications marked as read.');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const isUnread = !n.read && !n.isRead;
      if (inboxFilter === 'unread') return isUnread;
      if (inboxFilter === 'read') return !isUnread;
      return true;
    });
  }, [notifications, inboxFilter]);

  // Open attempt from notification
  const handleOpenAttemptFromNotif = (attemptId?: string) => {
    if (!attemptId) return;
    const found = attempts.find(a => a.id === attemptId);
    if (found) {
      setInspectedAttempt(found);
    } else {
      setStatusMessage('Attempt details not found in current record.');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Responsive Sidebar for Admin */}
      <Sidebar
        role="admin"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentAdminTab={activeTab}
        onAdminNavigate={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }}
        unreadInboxCount={unreadInboxCount}
        userName={adminProfile.displayName || 'Sanju (Admin)'}
        userEmail={adminProfile.email}
        onSignOut={onSignOut}
        onOpenSettings={() => setActiveTab('settings')}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between gap-3">
            
            <div className="flex items-center gap-3">
              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Open navigation sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-950/40">
                  <ShieldCheck className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                    Boddukuri's Quiz
                    <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Admin Portal
                    </span>
                  </h1>
                  <p className="text-[11px] text-slate-400 hidden sm:block">
                    Monitoring Mahi's 7-Day National Parks Learning Journey
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions in Navbar */}
            <div className="flex items-center gap-2">
              
              {/* Inbox Shortcut Button */}
              <button
                type="button"
                onClick={() => setActiveTab('inbox')}
                className={`relative p-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'inbox' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title="Admin Inbox"
              >
                <InboxIcon className="w-4 h-4" />
                <span className="hidden md:inline">Inbox</span>
                {unreadInboxCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                    {unreadInboxCount}
                  </span>
                )}
              </button>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={() => void refreshAllData()}
                disabled={loading}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                title="Refresh All Records"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              </button>

              {/* Settings Icon */}
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`p-2 rounded-xl transition-colors ${
                  activeTab === 'settings' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title="System Settings"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>

              {/* Student View Preview */}
              {onPreviewStudentView && (
                <button
                  type="button"
                  onClick={onPreviewStudentView}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 text-emerald-300 border border-emerald-800 text-xs font-semibold hover:bg-emerald-900 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Student View</span>
                </button>
              )}

              {/* Sign Out */}
              <button
                type="button"
                onClick={onSignOut}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-950/60 text-rose-300 border border-rose-900/50 hover:bg-rose-900 text-xs font-semibold transition-colors flex items-center gap-1"
                title="Sign out of Admin"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>

            </div>

          </div>

          {/* Toast / Status banner */}
          {statusMessage && (
            <div className="mt-2 py-1.5 px-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
              <span>{statusMessage}</span>
              <button onClick={() => setStatusMessage(null)} className="text-emerald-400 hover:text-white">✕</button>
            </div>
          )}
        </header>

        {/* Tab Navigation Pill Bar (Secondary quick access) */}
        <div className="bg-slate-900/50 border-b border-slate-800/80 px-4 sm:px-6 py-2 overflow-x-auto scrollbar-none flex items-center gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: ShieldCheck },
            { id: 'students', label: 'Students (Mahi)', icon: Users },
            { id: 'quiz-management', label: 'Quiz Schedule', icon: Calendar },
            { id: 'attempts', label: `Attempts (${attempts.length})`, icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'inbox', label: `Inbox`, icon: InboxIcon, badge: unreadInboxCount },
            { id: 'notifications', label: 'WhatsApp', icon: MessageCircle },
            { id: 'settings', label: 'Settings', icon: SettingsIcon }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as AdminNavTab)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {t.badge && t.badge > 0 ? (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                    {t.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* ========================================================================= */}
          {/* TAB: OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Completed Days</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {stats.completedCount} <span className="text-sm font-semibold text-slate-500">/ 7</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                    Day 01 Complete (100%)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Top Score</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {stats.bestPercentage}%
                  </div>
                  <p className="text-[11px] text-amber-300 font-semibold mt-1">
                    30 / 30 Marks on Day 01
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Learning Streak</span>
                    <Flame className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    1 <span className="text-sm font-semibold text-slate-500">Day Active</span>
                  </div>
                  <p className="text-[11px] text-orange-400 font-semibold mt-1">
                    Streak Protected
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Inbox Alerts</span>
                    <InboxIcon className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {unreadInboxCount} <span className="text-sm font-semibold text-slate-500">Unread</span>
                  </div>
                  <p className="text-[11px] text-sky-400 font-semibold mt-1">
                    {notifications.length} Total Submissions
                  </p>
                </div>

              </div>

              {/* Mahi Student Spotlight Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-lg">
                      M
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-white">Mahi</h2>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                          Active Student
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Access Code: <code className="font-mono text-emerald-300">2002</code> • Role: <span className="font-semibold text-slate-300">Student</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('students')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>View Student Profile & Result</span>
                    </button>
                  </div>
                </div>

                {/* Day 01 Verified Test Case Highlight */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/30 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-black text-white uppercase tracking-wider">
                        Latest Verified Submission: Day 01 National Parks Quiz
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      09 November 2026 • Time: 1m 26s (86s)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
                      <div className="text-lg font-black text-emerald-400">30 / 30</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Percentage</div>
                      <div className="text-lg font-black text-emerald-400">100%</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Mistakes</div>
                      <div className="text-lg font-black text-emerald-400">0 (Clean)</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Performance</div>
                      <div className="text-sm font-black text-amber-400 mt-1">Outstanding 🏆</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <span className="text-slate-400">
                      States Covered: <strong className="text-white">MP, AP, TS, Kerala, Assam, Karnataka</strong>
                    </span>
                    {attempts.length > 0 && (
                      <button
                        onClick={() => setInspectedAttempt(attempts[0])}
                        className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Full 30-Question Answer Sheet</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Next Scheduled Day Alert */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Next Up: Day 02 Scheduled</h4>
                    <p className="text-xs text-slate-400">
                      Scheduled unlock: <strong className="text-amber-300">10 November 2026 at 8:29 PM IST</strong> • Andaman & Nicobar, Goa, Sikkim, Nagaland (12 Questions).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
                  >
                    Manage Schedule
                  </button>
                  <button
                    onClick={() => handleToggleDayLock('day-02', isDayUnlocked('day-02'))}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-slate-950 transition-colors"
                  >
                    {isDayUnlocked('day-02') ? 'Lock Day 02' : 'Unlock Day 02 Now'}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: STUDENTS (STUDENT MONITORING FOR MAHI) */}
          {/* ========================================================================= */}
          {activeTab === 'students' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    Student Monitoring: Mahi
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real-time view of Mahi's learning journey, quiz attempts, answer sheets, and achievements
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => void refreshAllData()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Student Data</span>
                  </button>
                </div>
              </div>

              {/* Student Bio & Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Profile Card */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xl">
                      M
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">Mahi</h3>
                      <p className="text-xs text-emerald-400 font-semibold">Role: Student</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Access Code:</span>
                      <strong className="font-mono text-emerald-300">2002</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Account Status:</span>
                      <span className="text-emerald-400 font-bold">● Active & Verified</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Sync Engine:</span>
                      <span className="text-slate-300">Supabase + Local Snapshot</span>
                    </div>
                  </div>
                </div>

                {/* Progress Summary */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Syllabus Progress
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">1</span>
                    <span className="text-sm font-semibold text-slate-400">of 7 Days Completed (14%)</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '14.28%' }} />
                  </div>
                  <div className="pt-1 text-[11px] text-slate-400 flex justify-between">
                    <span>Day 01: Covered (6 States)</span>
                    <span className="text-emerald-400 font-bold">30 Parks Mastered</span>
                  </div>
                </div>

                {/* Badges & Streaks */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Streaks & Achievements
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-950/60 border border-orange-800 text-orange-300 text-xs font-bold">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span>1-Day Streak</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-bold">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Perfect Score</span>
                    </div>
                  </div>
                  <div className="pt-1 text-[11px] text-slate-400">
                    Badges Earned: <strong className="text-slate-200">First Quiz</strong>, <strong className="text-amber-300">Perfect Score (100%)</strong>
                  </div>
                </div>

              </div>

              {/* Attempts Table for Mahi */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    Quiz Attempt History & Answer Sheets
                  </h3>
                  <span className="text-xs text-slate-400">
                    Total Attempts Recorded: <strong className="text-white">{attempts.length}</strong>
                  </span>
                </div>

                {attempts.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No attempts recorded yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                          <th className="py-2.5 px-3">Quiz Day</th>
                          <th className="py-2.5 px-3">Date Completed</th>
                          <th className="py-2.5 px-3">Score / Marks</th>
                          <th className="py-2.5 px-3">Percentage</th>
                          <th className="py-2.5 px-3">Time Taken</th>
                          <th className="py-2.5 px-3">Correct / Wrong</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium">
                        {attempts.map(att => {
                          const quiz = getQuizForDay(att.quizId);
                          const isPerfect = att.percentage === 100;
                          return (
                            <tr key={att.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="py-3 px-3">
                                <span className="font-bold text-white">{quiz.title}</span>
                                <span className="block text-[10px] text-slate-400">{att.quizId.toUpperCase()}</span>
                              </td>
                              <td className="py-3 px-3 text-slate-300">
                                {att.formattedDate || quiz.displayDate}
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-bold text-emerald-400 text-sm">
                                  {att.marksObtained} / {att.maxMarks}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`inline-block px-2 py-0.5 rounded-full font-black text-[11px] ${
                                  isPerfect 
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                    : 'bg-slate-800 text-slate-200'
                                }`}>
                                  {att.percentage}%
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-300 font-mono">
                                {`${Math.floor(att.timeTakenSeconds / 60)}m ${att.timeTakenSeconds % 60}s`}
                              </td>
                              <td className="py-3 px-3">
                                <span className="text-emerald-400 font-semibold">{att.correctCount} correct</span>
                                {att.incorrectCount > 0 ? (
                                  <span className="text-rose-400 ml-1">({att.incorrectCount} wrong)</span>
                                ) : (
                                  <span className="text-slate-500 ml-1">(0 mistakes)</span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => setInspectedAttempt(att)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Inspect</span>
                                </button>
                                
                                <a
                                  href={getWhatsAppShareUrl(formatWhatsAppMessage(att), DEFAULT_SANJU_WHATSAPP_NUMBER)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                                  title="Share to WhatsApp (+91 70759 20852)"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                </a>

                                <button
                                  type="button"
                                  onClick={() => setResetConfirmQuizId(att.quizId)}
                                  className="px-2 py-1.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-900/60 hover:bg-rose-900 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                                  title="Reset Day Progress"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: QUIZ MANAGEMENT & SCHEDULE */}
          {/* ========================================================================= */}
          {(activeTab === 'quiz-management' || activeTab === 'schedule') && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    Seven-Day Syllabus & Release Schedule
                  </h2>
                  <p className="text-xs text-slate-400">
                    Day 01 published & completed. Days 02–07 scheduled. Admin can manually unlock or lock any day.
                  </p>
                </div>
              </div>

              {/* Day Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DAILY_SCHEDULE.map(dayItem => {
                  const quiz = getQuizForDay(dayItem.quizId);
                  const isCompleted = completedDays.includes(dayItem.quizId);
                  const unlocked = isDayUnlocked(dayItem.quizId);

                  return (
                    <div 
                      key={dayItem.quizId}
                      className={`p-5 rounded-2xl border transition-all ${
                        isCompleted 
                          ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20' 
                          : unlocked 
                          ? 'bg-slate-900/80 border-slate-700' 
                          : 'bg-slate-950 border-slate-800/80 opacity-90'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-white font-black text-xs">
                              {dayItem.quizId.toUpperCase()}
                            </span>
                            <h3 className="text-sm font-bold text-white">{dayItem.title}</h3>
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-1">
                            Scheduled Date: <strong className="text-slate-300">{dayItem.displayDate}</strong>
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {isCompleted ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Completed
                            </span>
                          ) : unlocked ? (
                            <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-[10px] font-black uppercase flex items-center gap-1">
                              <Unlock className="w-3 h-3" /> Unlocked
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Locked
                            </span>
                          )}
                        </div>
                      </div>

                      {/* States & Parks */}
                      <div className="space-y-2 mb-4">
                        <div className="text-[11px] text-slate-400">
                          States ({dayItem.states.length}):
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {dayItem.states.map(st => (
                            <span 
                              key={st}
                              className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700/60"
                            >
                              {st}
                            </span>
                          ))}
                        </div>
                        <div className="text-[11px] text-slate-400 pt-1 flex justify-between">
                          <span>Question Pool: <strong className="text-white">{quiz.questions.length} Questions</strong></span>
                          <span>Coverage: <strong className="text-emerald-400">{dayItem.totalQuestions} Questions</strong></span>
                        </div>
                      </div>

                      {/* Controls Footer */}
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                        {onPreviewDayQuiz && (
                          <button
                            type="button"
                            onClick={() => onPreviewDayQuiz(dayItem.quizId)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleDayLock(dayItem.quizId, unlocked)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              unlocked 
                                ? 'bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900' 
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            {unlocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            <span>{unlocked ? 'Lock Day' : 'Unlock Now'}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: ATTEMPTS LIST & FILTER */}
          {/* ========================================================================= */}
          {activeTab === 'attempts' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    Quiz Attempts Log ({attempts.length})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Comprehensive log of all student submissions with detailed answer sheets
                  </p>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by day, date, score..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <select
                  value={selectedDayFilter}
                  onChange={e => setSelectedDayFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All Days</option>
                  {DAILY_SCHEDULE.map(d => (
                    <option key={d.quizId} value={d.quizId}>{d.quizId.toUpperCase()}: {d.title}</option>
                  ))}
                </select>
              </div>

              {/* Attempts Table */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
                {filteredAttempts.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No matching attempts found.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Student</th>
                        <th className="py-2.5 px-3">Quiz</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Score</th>
                        <th className="py-2.5 px-3">Percentage</th>
                        <th className="py-2.5 px-3">Time</th>
                        <th className="py-2.5 px-3 text-right">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {filteredAttempts.map(att => {
                        const quiz = getQuizForDay(att.quizId);
                        return (
                          <tr key={att.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-3">
                              <span className="font-bold text-white">{att.studentName || 'Mahi'}</span>
                              <span className="block text-[10px] text-slate-400 font-mono">Code: 2002</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-slate-200">{quiz.title}</span>
                              <span className="block text-[10px] text-slate-400">{att.quizId.toUpperCase()}</span>
                            </td>
                            <td className="py-3 px-3 text-slate-300">
                              {att.formattedDate || quiz.displayDate}
                            </td>
                            <td className="py-3 px-3 font-bold text-emerald-400">
                              {att.marksObtained} / {att.maxMarks}
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                                {att.percentage}%
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-300 font-mono">
                              {`${Math.floor(att.timeTakenSeconds / 60)}m ${att.timeTakenSeconds % 60}s`}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => setInspectedAttempt(att)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Inspect Answers</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: RESULTS & ANALYTICS */}
          {/* ========================================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="pb-2 border-b border-slate-800">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Learning Analytics & State Performance
                </h2>
                <p className="text-xs text-slate-400">
                  Performance breakdown across states and national park categories
                </p>
              </div>

              {/* State Performance Breakdown for Day 01 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Day 01 State Mastery Breakdown (30 Parks)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { state: 'Madhya Pradesh', parks: 11, correct: 11, pct: 100 },
                    { state: 'Assam', parks: 7, correct: 7, pct: 100 },
                    { state: 'Kerala', parks: 6, correct: 6, pct: 100 },
                    { state: 'Karnataka', parks: 5, correct: 5, pct: 100 },
                    { state: 'Andhra Pradesh', parks: 3, correct: 3, pct: 100 },
                    { state: 'Telangana', parks: 3, correct: 3, pct: 100 },
                  ].map(item => (
                    <div key={item.state} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">{item.state}</span>
                        <span className="font-mono text-emerald-400 font-bold">{item.correct} / {item.parks} ({item.pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Efficiency Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Time Efficiency</h4>
                  <div className="text-2xl font-black text-white">
                    2.87 <span className="text-sm font-semibold text-slate-400">seconds / question</span>
                  </div>
                  <p className="text-xs text-emerald-400">
                    Outstanding speed: completed 30 questions in 1 minute 26 seconds.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Accuracy Rate</h4>
                  <div className="text-2xl font-black text-emerald-400">
                    100% <span className="text-sm font-semibold text-slate-400">clean sheet</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Zero mistakes recorded. All 30 national parks correctly identified.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: ADMIN INBOX */}
          {/* ========================================================================= */}
          {activeTab === 'inbox' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <InboxIcon className="w-5 h-5 text-emerald-400" />
                    Admin Submission Inbox
                  </h2>
                  <p className="text-xs text-slate-400">
                    Notifications of quiz submissions, retake requests, and student alerts
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    disabled={unreadInboxCount === 0}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mark All Read</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                {[
                  { id: 'all', label: `All (${notifications.length})` },
                  { id: 'unread', label: `Unread (${unreadInboxCount})` },
                  { id: 'read', label: `Read (${notifications.length - unreadInboxCount})` }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setInboxFilter(f.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      inboxFilter === f.id
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Notifications List */}
              <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-xs rounded-2xl bg-slate-900 border border-slate-800">
                    No notifications in this view.
                  </div>
                ) : (
                  filteredNotifications.map(notif => {
                    const isItemUnread = !notif.read && !notif.isRead;
                    return (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          !isItemUnread
                            ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                            : 'bg-slate-900 border-emerald-500/40 text-white shadow-md shadow-emerald-950/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            !isItemUnread 
                              ? 'bg-slate-800 text-slate-400' 
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-white">
                                {notif.title}
                              </h4>
                              {isItemUnread && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              )}
                            </div>
                            <p className="text-xs text-slate-400">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-slate-500 block font-mono">
                              {new Date(notif.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {notif.attemptId && (
                            <button
                              type="button"
                              onClick={() => handleOpenAttemptFromNotif(notif.attemptId)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect Result</span>
                            </button>
                          )}

                          {isItemUnread ? (
                            <button
                              type="button"
                              onClick={() => handleMarkNotifRead(notif.id)}
                              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                              title="Mark as Read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => handleDeleteNotif(notif.id)}
                            className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: NOTIFICATIONS & WHATSAPP */}
          {/* ========================================================================= */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="pb-2 border-b border-slate-800">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  WhatsApp Notifications & Result Dispatch
                </h2>
                <p className="text-xs text-slate-400">
                  Target Number: <strong className="text-emerald-300">+91 70759 20852</strong> (Sanju Admin)
                </p>
              </div>

              {/* WhatsApp Config Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  WhatsApp Result Dispatch Pipeline
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upon quiz submission, Boddukuri's Quiz creates an inbox notification and prepares the WhatsApp message payload using the exact formatted template for <strong>+91 70759 20852</strong>.
                </p>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Live Template Preview:</div>
                  <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">
{attempts.length > 0 ? formatWhatsAppMessage(attempts[0]) : `🌿 BODDUKURI'S QUIZ — RESULT NOTIFICATION
Student: Mahi
Quiz: Day 01
Date: 09 November 2026
Marks: 30 / 30
Percentage: 100%
Correct: 30 | Incorrect: 0 | Unanswered: 0
Time Taken: 1m 26s
Performance: Outstanding`}
                  </pre>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {attempts.length > 0 && (
                    <a
                      href={getWhatsAppShareUrl(formatWhatsAppMessage(attempts[0]), DEFAULT_SANJU_WHATSAPP_NUMBER)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send WhatsApp Notification to +91 70759 20852</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (attempts.length > 0) {
                        navigator.clipboard.writeText(formatWhatsAppMessage(attempts[0]));
                        setStatusMessage('WhatsApp message copied to clipboard!');
                        setTimeout(() => setStatusMessage(null), 2500);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                  >
                    Copy Message Text
                  </button>
                </div>
              </div>

              {/* Meta Cloud API Guide */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Meta WhatsApp Cloud API Automated Server Setup
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  For automated background WhatsApp delivery without manual user action:
                </p>
                <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1">
                  <li>Configure Meta WhatsApp Cloud API credentials (<code className="font-mono text-slate-300">WHATSAPP_API_TOKEN</code>, <code className="font-mono text-slate-300">WHATSAPP_PHONE_NUMBER_ID</code>) in Supabase Vault / Edge Functions.</li>
                  <li>Register the template <code className="font-mono text-slate-300">mahi_quiz_result_v1</code> in Meta Business Manager.</li>
                  <li>Supabase Edge Function <code className="font-mono text-slate-300">send-whatsapp-result</code> dispatches automatically on quiz submission.</li>
                </ol>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: SETTINGS & CONTROLS */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="pb-2 border-b border-slate-800">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-emerald-400" />
                  Admin Controls & System Settings
                </h2>
                <p className="text-xs text-slate-400">
                  Manage student reset controls, system backups, and application state
                </p>
              </div>

              {/* Danger Zone: Progress Resets */}
              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/50 space-y-4">
                <div className="flex items-center gap-2 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    Administrative Reset Controls
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  These controls allow resetting student progress. All resets require explicit confirmation and are logged to audit logs.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setResetConfirmQuizId('day-01')}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-rose-800 hover:bg-rose-950 text-rose-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Day 01 Progress Only</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowFullResetModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Full Student Progress Reset (Strong Confirmation)</span>
                  </button>
                </div>
              </div>

              {/* Backup & Export */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Backup & JSON Data Export
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Export complete student progress, all attempt snapshots, answers, and audit logs as a JSON backup file.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const json = exportBackupData();
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `boddukuri_quiz_backup_${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Complete Backup JSON</span>
                </button>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: HELP & ABOUT */}
          {/* ========================================================================= */}
          {activeTab === 'help' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="pb-2 border-b border-slate-800">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-400" />
                  Boddukuri's Quiz System Architecture & Guide
                </h2>
                <p className="text-xs text-slate-400">
                  Role specifications, access codes, and syllabus schedule reference
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed">
                <h3 className="text-sm font-bold text-white">Access Credentials:</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong className="text-white">Mahi (Student):</strong> Access Code <code className="font-mono text-emerald-300">2002</code> • Role: student</li>
                  <li><strong className="text-white">Sanju (Admin):</strong> Access Code <code className="font-mono text-emerald-300">2718</code> • Role: admin</li>
                </ul>

                <h3 className="text-sm font-bold text-white pt-3">National Parks 7-Day Plan:</h3>
                <p className="text-slate-400">
                  106 total National Parks across India distributed across 7 structured days. Every park is tested strictly as "National Park name → Which state is it located in?".
                </p>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* ATTEMPT QUESTION INSPECTOR MODAL */}
      {/* ========================================================================= */}
      {inspectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 w-full max-w-3xl max-h-[90vh] rounded-3xl p-5 sm:p-6 border border-emerald-500/40 shadow-2xl flex flex-col space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Answer Sheet Inspector — {inspectedAttempt.quizId.toUpperCase()}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                    {inspectedAttempt.percentage}% Score
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Student: <strong className="text-white">{inspectedAttempt.studentName || 'Mahi'}</strong> • Date: {inspectedAttempt.formattedDate} • Time: {`${Math.floor(inspectedAttempt.timeTakenSeconds / 60)}m ${inspectedAttempt.timeTakenSeconds % 60}s`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInspectedAttempt(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {(() => {
                const quiz = getQuizForDay(inspectedAttempt.quizId);
                return quiz.questions.map((q, idx) => {
                  const selectedIdx = inspectedAttempt.answers[q.id];
                  const isCorrect = selectedIdx === q.correctAnswer;
                  
                  return (
                    <div 
                      key={q.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                        isCorrect 
                          ? 'bg-slate-950/60 border-emerald-900/60' 
                          : 'bg-rose-950/20 border-rose-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-200">
                          {idx + 1}. {q.question}
                        </span>
                        {isCorrect ? (
                          <span className="text-emerald-400 font-bold shrink-0 flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold shrink-0 flex items-center gap-1 text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedIdx === optIdx;
                          const isTarget = optIdx === q.correctAnswer;
                          return (
                            <div 
                              key={opt}
                              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center justify-between ${
                                isTarget 
                                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300' 
                                  : isSelected 
                                  ? 'bg-rose-950/80 border-rose-500/60 text-rose-300' 
                                  : 'bg-slate-900/50 border-slate-800 text-slate-400'
                              }`}
                            >
                              <span>{opt}</span>
                              {isTarget && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                          💡 <strong className="text-slate-300">Fact:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteAttempt(inspectedAttempt.id)}
                className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Attempt</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectedAttempt(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Close Answer Sheet
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SINGLE DAY RESET CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {resetConfirmQuizId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-rose-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-black text-white">
                Reset {resetConfirmQuizId.toUpperCase()} Progress?
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will remove all attempt records for <strong>{resetConfirmQuizId.toUpperCase()}</strong> and mark it as uncompleted for Mahi.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirmQuizId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleExecuteDayReset(resetConfirmQuizId)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Confirm Reset
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
