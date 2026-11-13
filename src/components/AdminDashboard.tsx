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
  HelpCircle,
  Printer,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
  ChevronUp,
  FileCheck,
  X
} from 'lucide-react';
import { DEFAULT_SANJU_WHATSAPP_NUMBER, formatWhatsAppMessage, getWhatsAppShareUrl } from '../utils/whatsapp';
import { generateAnswerSheetPDF } from '../utils/pdfGenerator';
import type { QuizAttempt, RetakeRequest, UserProfile, InboxNotification } from '../types/quiz';
import {
  getAllAttempts,
  getCompletedDayIds,
  getRetakeRequests,
  updateRetakeRequestStatus,
  deleteAttemptById,
  resetDayProgress,
  markDayCompleted,
  resetAllMahiProgress,
  exportBackupData,
  getInboxNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteInboxNotification,
  calculateCurrentStreak
} from '../utils/storage';
import { evaluateBadges } from '../utils/achievements';
import { broadcastQuizEvent, subscribeToQuizRealtime } from '../utils/realtime';
import { deleteCloudProgress, MAHI_STUDENT_ID, saveCloudProgress } from '../utils/supabase';
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

  // Dedicated Complete Answer Sheet Review state
  const [selectedAnswerSheetAttemptId, setSelectedAnswerSheetAttemptId] = useState<string | null>(null);
  const [answerStatusFilter, setAnswerStatusFilter] = useState<'all' | 'correct' | 'incorrect' | 'unanswered'>('all');
  const [answerStateFilter, setAnswerStateFilter] = useState<string>('all');
  const [answerSearchQuery, setAnswerSearchQuery] = useState<string>('');
  const [expandAllExplanations, setExpandAllExplanations] = useState<boolean>(true);
  const [selectedQuestionNavNumber, setSelectedQuestionNavNumber] = useState<number | null>(null);

  const handleOpenCompleteAnswerSheet = (attempt: QuizAttempt) => {
    setSelectedAnswerSheetAttemptId(attempt.id);
    setActiveTab('answer-sheets');
    setInspectedAttempt(null);
    setSelectedQuestionNavNumber(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [inboxFilter, setInboxFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [retakeFilter, setRetakeFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Manual Mark Day Completed Modal State
  const [markCompletedModalDay, setMarkCompletedModalDay] = useState<number | null>(null);
  const [manualScore, setManualScore] = useState<number>(30);
  const [manualMaxMarks, setManualMaxMarks] = useState<number>(30);
  const [manualDurationSecs, setManualDurationSecs] = useState<number>(86);
  const [manualDateStr, setManualDateStr] = useState<string>('09 November 2026');
  const [manualNotes, setManualNotes] = useState<string>('Verified and audited by Sanju');

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
      if (cloudStudents.length > 0) {
        const cloudPayloads = cloudStudents.map(s => s.payload).filter(Boolean);
        const cloudAttempts = cloudPayloads.flatMap(p => p.attempts || []);
        const cloudCompleted = cloudPayloads.flatMap(p => p.completedDays || []);
        const cloudRetakes = cloudPayloads.flatMap(p => p.retakeRequests || []);
        if (cloudAttempts.length > 0) {
          // Merge attempts by id deduplication
          const mergedMap = new Map<string, QuizAttempt>();
          cloudAttempts.forEach(a => mergedMap.set(a.id, a));
          localAttempts.forEach(a => {
            if (!mergedMap.has(a.id)) mergedMap.set(a.id, a);
          });
          setAttempts(Array.from(mergedMap.values()));
        }
        if (cloudCompleted.length > 0) {
          const mergedDays = Array.from(new Set([...localCompleted, ...cloudCompleted]));
          setCompletedDays(mergedDays);
        }
        if (cloudRetakes.length > 0) {
          setRetakeRequests(cloudRetakes);
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

    // Keep the admin view current even if a realtime broadcast is missed.
    const refreshTimer = window.setInterval(() => {
      void refreshAllData();
    }, 15000);

    // Subscribe to Realtime events across devices & tabs
    const unsubscribe = subscribeToQuizRealtime({
      onQuizSubmitted: (payload) => {
        setAttempts(prev => {
          const filtered = prev.filter(a => a.id !== payload.attempt.id);
          return [payload.attempt, ...filtered];
        });
        setCompletedDays(prev => Array.from(new Set([...prev, payload.attempt.quizId])));
        if (payload.adminNotification) {
          setNotifications(prev => {
            const filtered = prev.filter(n => n.id !== payload.adminNotification!.id);
            return [payload.adminNotification!, ...filtered];
          });
        }
        setStatusMessage(`Realtime update: Mahi submitted ${payload.attempt.quizId.toUpperCase()} (${payload.attempt.percentage}%)!`);
        setTimeout(() => setStatusMessage(null), 4000);
        void refreshAllData();
      },
      onProgressReset: () => {
        setAttempts([]);
        setCompletedDays([]);
        setNotifications([]);
        setStatusMessage('Realtime sync: All quiz progress has been reset.');
        setTimeout(() => setStatusMessage(null), 4000);
      },
      onScheduleUpdated: () => {
        void refreshAllData();
      }
    });

    return () => {
      window.clearInterval(refreshTimer);
      unsubscribe();
    };
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

  // Overall statistics for Mahi (strictly derived from persisted records)
  const stats = useMemo(() => {
    const totalAttempts = attempts.length;
    const completedCount = completedDays.length;
    const bestPercentage = attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage || 0)) : 0;
    const avgPercentage = attempts.length > 0 ? Math.round(attempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / attempts.length) : 0;
    const pendingRetakes = retakeRequests.filter(r => r.status === 'pending').length;
    const currentStreak = calculateCurrentStreak(attempts);
    const badges = evaluateBadges(attempts, currentStreak);
    const unlockedBadges = badges.filter(b => b.unlocked);
    return {
      totalAttempts,
      completedCount,
      bestPercentage,
      avgPercentage,
      pendingRetakes,
      currentStreak,
      unlockedBadges
    };
  }, [attempts, retakeRequests, completedDays]);

  // Dynamic curriculum summary metrics
  const totalCurriculumQuizzes = DAILY_SCHEDULE.length;
  const totalCurriculumQuestions = useMemo(() => {
    return DAILY_SCHEDULE.reduce((sum, item) => sum + item.totalQuestions, 0);
  }, []);
  const enrolledStudentsCount = useMemo(() => {
    const studentNames = new Set(attempts.map(a => a.studentName || 'Mahi'));
    studentNames.add('Mahi');
    return studentNames.size;
  }, [attempts]);

  // Chart data: map 9 scheduled modules to real scores or zero baseline
  const chartPoints = useMemo(() => {
    return DAILY_SCHEDULE.map((s, idx) => {
      const quiz = getQuizForDay(s.dayNumber);
      const dayAttempts = attempts.filter(a => a.quizId === quiz.id || a.quizId === s.quizId);
      const bestScore = dayAttempts.length > 0
        ? Math.max(...dayAttempts.map(a => a.percentage || 0))
        : 0;
      const x = 30 + idx * 55; // 30 to 470 across 500 viewBox width
      const y = 115 - (bestScore / 100) * 95; // 100% -> 20, 0% -> 115
      return {
        dayLabel: s.dayNumber <= 7 ? `Day 0${s.dayNumber}` : s.dayNumber === 8 ? 'Semi' : 'Grand',
        score: bestScore,
        hasAttempt: dayAttempts.length > 0,
        x,
        y
      };
    });
  }, [attempts]);

  const chartSvgPath = useMemo(() => {
    if (chartPoints.length === 0) return '';
    return chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [chartPoints]);

  const chartAreaPath = useMemo(() => {
    if (chartPoints.length === 0) return '';
    const firstX = chartPoints[0].x;
    const lastX = chartPoints[chartPoints.length - 1].x;
    const linePart = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return `${linePart} L ${lastX} 125 L ${firstX} 125 Z`;
  }, [chartPoints]);

  // Selected attempt for Answer Sheet Review
  const currentReviewAttempt = useMemo(() => {
    if (attempts.length === 0) return null;
    if (selectedAnswerSheetAttemptId) {
      const found = attempts.find(a => a.id === selectedAnswerSheetAttemptId);
      if (found) return found;
    }
    return attempts[0];
  }, [attempts, selectedAnswerSheetAttemptId]);

  const currentReviewQuiz = useMemo(() => {
    if (!currentReviewAttempt) return null;
    return getQuizForDay(currentReviewAttempt.quizId);
  }, [currentReviewAttempt]);

  const availableStatesInReview = useMemo(() => {
    if (!currentReviewQuiz) return [];
    return Array.from(new Set(currentReviewQuiz.questions.map(q => q.state)));
  }, [currentReviewQuiz]);

  const reviewQuestionItems = useMemo(() => {
    if (!currentReviewAttempt || !currentReviewQuiz) return [];

    return currentReviewQuiz.questions.map((q, idx) => {
      const selectedOptionIndex = currentReviewAttempt.answers ? currentReviewAttempt.answers[q.id] : undefined;
      const isUnanswered = selectedOptionIndex === undefined || selectedOptionIndex === -1;
      const isCorrect = !isUnanswered && selectedOptionIndex === q.correctAnswer;
      const status: 'correct' | 'incorrect' | 'unanswered' = isUnanswered
        ? 'unanswered'
        : isCorrect
        ? 'correct'
        : 'incorrect';

      const optionLetters = ['A', 'B', 'C', 'D'];
      const selectedAnswerText = isUnanswered
        ? 'Not answered'
        : `${optionLetters[selectedOptionIndex]}. ${q.options[selectedOptionIndex] || ''}`;
      const correctAnswerText = `${optionLetters[q.correctAnswer]}. ${q.options[q.correctAnswer] || ''}`;

      return {
        questionIndex: idx,
        questionNumber: idx + 1,
        question: q,
        selectedOptionIndex,
        selectedAnswerText,
        correctAnswerText,
        isCorrect,
        isUnanswered,
        status
      };
    });
  }, [currentReviewAttempt, currentReviewQuiz]);

  const questionStatusCounts = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    reviewQuestionItems.forEach(item => {
      if (item.status === 'correct') correct++;
      else if (item.status === 'incorrect') incorrect++;
      else unanswered++;
    });
    return {
      all: reviewQuestionItems.length,
      correct,
      incorrect,
      unanswered
    };
  }, [reviewQuestionItems]);

  const filteredReviewQuestions = useMemo(() => {
    return reviewQuestionItems.filter(item => {
      if (selectedQuestionNavNumber !== null && item.questionNumber !== selectedQuestionNavNumber) {
        return false;
      }
      if (answerStatusFilter !== 'all' && item.status !== answerStatusFilter) return false;
      if (answerStateFilter !== 'all' && item.question.state !== answerStateFilter) return false;
      if (answerSearchQuery.trim()) {
        const query = answerSearchQuery.toLowerCase();
        const matchesQ = item.question.question.toLowerCase().includes(query);
        const matchesState = item.question.state.toLowerCase().includes(query);
        const matchesOptions = item.question.options.some(opt => opt.toLowerCase().includes(query));
        const matchesNum = `question ${item.questionNumber}`.includes(query) || `${item.questionNumber}` === query;
        if (!matchesQ && !matchesState && !matchesOptions && !matchesNum) return false;
      }
      return true;
    });
  }, [reviewQuestionItems, selectedQuestionNavNumber, answerStatusFilter, answerStateFilter, answerSearchQuery]);

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
  const handleReviewRetake = async (requestId: string, status: 'approved' | 'rejected') => {
    updateRetakeRequestStatus(requestId, status, 'Sanju (Admin)');
    await reviewRetakeRequestCloud(requestId, status, 'Sanju (Admin)');
    await logAdminActionCloud('REVIEW_RETAKE', requestId, { status });

    setStatusMessage(`Retake request ${status.toUpperCase()} successfully.`);
    setTimeout(() => setStatusMessage(null), 3000);
    void refreshAllData();
  };

  // Handle manual day completion by Admin
  const handleExecuteMarkCompleted = async () => {
    if (!markCompletedModalDay) return;
    const quizId = `day-${markCompletedModalDay < 10 ? '0' + markCompletedModalDay : markCompletedModalDay}`;
    markDayCompleted({
      quizId,
      dayNumber: markCompletedModalDay,
      dateStr: manualDateStr,
      marksObtained: manualScore,
      maxMarks: manualMaxMarks,
      timeTakenSeconds: manualDurationSecs,
      notes: manualNotes,
      recordedBy: adminProfile.displayName || adminProfile.fullName || 'Sanju (Admin)'
    });
    await logAdminActionCloud('MANUAL_MARK_COMPLETED', quizId, {
      marks: manualScore,
      maxMarks: manualMaxMarks,
      recordedBy: adminProfile.displayName || adminProfile.fullName
    });
    setMarkCompletedModalDay(null);
    setStatusMessage(`Day 0${markCompletedModalDay} has been recorded as COMPLETED.`);
    setTimeout(() => setStatusMessage(null), 3000);
    void refreshAllData();
  };

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
    // Persist the reset to Mahi's cloud snapshot; LocalStorage alone would
    // reappear on the next sync.
    const cloudStudents = await loadAllStudentsProgressCloud();
    const mahi = cloudStudents.find(student => student.userId === MAHI_STUDENT_ID);
    if (mahi) {
      const payload = { ...mahi.payload, attempts: (mahi.payload.attempts || []).filter(a => a.quizId !== quizId), completedDays: (mahi.payload.completedDays || []).filter(id => id !== quizId), inProgress: Object.fromEntries(Object.entries(mahi.payload.inProgress || {}).filter(([id]) => id !== quizId)), updatedAt: new Date().toISOString() };
      await deleteCloudProgress(MAHI_STUDENT_ID);
      await saveCloudProgress(MAHI_STUDENT_ID, payload);
    }
    await broadcastQuizEvent('progress_reset', { by: 'admin', quizId, timestamp: new Date().toISOString() });
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
    await deleteCloudProgress(MAHI_STUDENT_ID);
    await broadcastQuizEvent('progress_reset', { by: 'admin', timestamp: new Date().toISOString() });
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
      handleOpenCompleteAnswerSheet(found);
    } else {
      setStatusMessage('Attempt details not found in current record.');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="portal-luxury min-h-screen bg-[#090306] text-[#e8d5db] flex flex-col font-sans relative overflow-x-hidden">

      {/* Luxury Background Layer with Ruby Atmospheric Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: `url('/admin-luxury-villa.jpg')`,
          filter: 'brightness(0.18) contrast(1.2) saturate(1.2)',
        }}
      />

      {/* Deep Obsidian Ruby Gradient Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% -10%, rgba(158, 16, 48, 0.28) 0%, rgba(18, 5, 12, 0.94) 70%, rgba(9, 3, 6, 0.99) 100%)',
        }}
      />

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
        pendingRetakesCount={stats.pendingRetakes}
        userName={adminProfile.displayName || 'Sanju (Admin)'}
        userEmail={adminProfile.email}
        onSignOut={onSignOut}
        onOpenSettings={() => setActiveTab('settings')}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0 relative z-10">

        {/* Top Navbar matching Image 3 mockup */}
        <header className="sticky top-0 z-30 bg-[#0c0407]/90 backdrop-blur-xl border-b border-[#260c18] px-4 sm:px-6 py-3 shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-3">
              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-[#14060d] text-[#a68690] hover:text-white hover:bg-[#1f0913] transition-colors border border-[#2b0c18]"
                aria-label="Open navigation sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#9e1030] to-[#e6194b] flex items-center justify-center text-white font-black shadow-ruby shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                    Boddukuri's Quiz Portal
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#2a0b16] text-[#ff8099] border border-[#52142a]">
                    Admin Panel
                  </span>
                </div>
              </div>
            </div>

            {/* Center Search Bar with Ctrl + K (Matching Image 3) */}
            <div className="hidden xl:flex flex-1 max-w-md mx-4">
              <label className="flex items-center justify-between w-full rounded-2xl px-3.5 py-1.5 border border-[#2b0c18] bg-[#14060d] text-white shadow-inner focus-within:border-[#e6194b]/60 focus-within:bg-[#190710] transition-all">
                <div className="flex items-center gap-2.5 flex-1">
                  <Search className="w-4 h-4 text-[#ff3366]" />
                  <input
                    aria-label="Search students, quizzes, questions"
                    placeholder="Search students, quizzes, questions..."
                    className="w-full bg-transparent outline-none text-xs text-white placeholder:text-[#7a5b67]"
                  />
                </div>
                <kbd className="px-2 py-0.5 rounded-lg bg-[#220713] border border-[#470f25] text-[#ff8099] text-[10px] font-mono font-bold">
                  Ctrl + K
                </kbd>
              </label>
            </div>

            {/* Right Quick Actions in Navbar */}
            <div className="flex items-center gap-2">

              {/* Date Range Selector Pill matching Image 3 */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#14060d] border border-[#2b0c18] text-[#cbb5bc] text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5 text-[#ff3366]" />
                <span>Nov 1, 2026 – Nov 11, 2026</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#7a5b67]" />
              </div>

              {/* Inbox Bell with Red Dot */}
              <button
                type="button"
                onClick={() => setActiveTab('inbox')}
                className="relative p-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 bg-[#14060d] border border-[#2b0c18] text-[#b395a0] hover:text-white hover:bg-[#1f0913]"
                title="Admin Inbox"
              >
                <InboxIcon className="w-4 h-4" />
                {unreadInboxCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#e6194b] text-white text-[9px] font-black flex items-center justify-center shadow-[0_0_8px_rgba(230,25,75,0.7)] animate-pulse">
                    {unreadInboxCount}
                  </span>
                )}
              </button>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={() => void refreshAllData()}
                disabled={loading}
                className="p-2 rounded-xl bg-[#14060d] border border-[#2b0c18] text-[#b395a0] hover:text-white hover:bg-[#1f0913] transition-colors disabled:opacity-50"
                title="Refresh All Records"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#ff3366]' : ''}`} />
              </button>

              {/* Administrator Avatar Pill matching Image 3 */}
              <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#14060d] border border-[#2b0c18]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#9e1030] to-[#e6194b] flex items-center justify-center text-white text-xs font-black shadow-ruby">
                  S
                </div>
                <div className="text-left text-xs">
                  <div className="font-bold text-white leading-tight">Sanjay Boddukuri</div>
                  <div className="text-[10px] text-[#ff8099] leading-tight">Administrator</div>
                </div>
              </div>

              {/* Student View Preview */}
              {onPreviewStudentView && (
                <button
                  type="button"
                  onClick={onPreviewStudentView}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#220713] text-[#ff8099] border border-[#470f25] text-xs font-bold hover:bg-[#300a1b] transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Student View</span>
                </button>
              )}

              {/* Sign Out */}
              <button
                type="button"
                onClick={onSignOut}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#260a14] text-rose-400 border border-[#4a1226] hover:bg-[#350d1c] hover:text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1"
                title="Sign out of Admin"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>

            </div>

          </div>

          {/* Toast / Status banner */}
          {statusMessage && (
            <div className="mt-2 py-1.5 px-3 rounded-lg bg-[#2b0c18] border border-[#ff3366]/40 text-[#ff8099] text-xs font-semibold flex items-center justify-between animate-fadeIn">
              <span>{statusMessage}</span>
              <button onClick={() => setStatusMessage(null)} className="text-[#ff3366] hover:text-white">✕</button>
            </div>
          )}
        </header>

        {/* Tab Navigation Pill Bar (Secondary quick access) */}
        <div className="bg-[#0e0409]/80 backdrop-blur-md border-b border-[#260c18] px-4 sm:px-6 py-2 overflow-x-auto scrollbar-none flex items-center gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: ShieldCheck },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'mahi-profile', label: "Mahi's Profile", icon: UserCheck },
            { id: 'attempts', label: `Attempts (${attempts.length})`, icon: FileText },
            { id: 'retake-requests', label: `Retakes (${stats.pendingRetakes})`, icon: RotateCcw, badge: stats.pendingRetakes },
            { id: 'answer-sheets', label: 'Answer Sheets', icon: FileCheck },
            { id: 'schedule', label: 'Quiz Schedule', icon: Calendar },
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
                    ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby border border-[#ff3366]/40'
                    : 'text-[#a68690] hover:text-white hover:bg-[#1a0610]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {t.badge && t.badge > 0 ? (
                  <span className="w-4 h-4 rounded-full bg-[#e6194b] text-white text-[9px] font-black flex items-center justify-center shadow-[0_0_6px_rgba(230,25,75,0.7)]">
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
          {/* TAB: OVERVIEW (Luxury Obsidian & Ruby Design matching Image 3 mockup) */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">

              {/* Header Title Section matching Image 3 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-[#a68690] mt-0.5">
                    Manage quizzes, questions, students and monitor platform activity.
                  </p>
                </div>
              </div>

              {/* 4 Primary Metric Cards matching Image 3 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

                {/* Metric 1: Total Students */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg backdrop-blur-md">
                  <div className="flex items-center justify-between text-[#a68690] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Students</span>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                      1 Active
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#220713] text-[#ff3366] border border-[#470f25] flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {enrolledStudentsCount}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#a68690] mt-2">Mahi (Enrolled Scholar)</p>
                </div>

                {/* Metric 2: Total Quizzes */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg backdrop-blur-md">
                  <div className="flex items-center justify-between text-[#a68690] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Quizzes</span>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                      {stats.completedCount} / {totalCurriculumQuizzes} Done
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#220713] text-[#ff3366] border border-[#470f25] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {totalCurriculumQuizzes}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#a68690] mt-2">7 Days + Semi-Final + Grand Test</p>
                </div>

                {/* Metric 3: Total Questions */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg backdrop-blur-md">
                  <div className="flex items-center justify-between text-[#a68690] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Questions</span>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                      109 Parks
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#220713] text-[#ff3366] border border-[#470f25] flex items-center justify-center shrink-0">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {totalCurriculumQuestions}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#a68690] mt-2">Verified syllabus across 30 States</p>
                </div>

                {/* Metric 4: Avg. Performance */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg backdrop-blur-md">
                  <div className="flex items-center justify-between text-[#a68690] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Avg. Performance</span>
                    <TrendingUp className="w-4 h-4 text-[#ff3366]" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#220713] text-[#ff3366] border border-[#470f25] flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-[#ff8099]">
                      {stats.avgPercentage}%
                    </div>
                  </div>
                  <p className="text-[11px] text-[#a68690] mt-2">{attempts.length} submission{attempts.length === 1 ? '' : 's'} recorded</p>
                </div>

              </div>

              {/* Grid Row 2: Quiz Activity Chart & Quick Actions (Exact Image 3 Layout) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Quiz Activity Line Chart (2 cols) */}
                <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg backdrop-blur-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#ff3366]" />
                      <h2 className="text-base font-extrabold text-white">Curriculum Performance</h2>
                    </div>
                    <div className="px-2.5 py-1 rounded-xl bg-[#1c0610] border border-[#3d0f21] text-xs font-semibold text-[#ff8099] flex items-center gap-1.5">
                      <span>9 Modules</span>
                    </div>
                  </div>

                  {/* SVG Trend Line Curve */}
                  <div className="relative pt-2">
                    <div className="flex items-center justify-between text-[10px] text-[#7a5b67] font-mono mb-1">
                      <span>100%</span>
                      <span>80%</span>
                      <span>60%</span>
                      <span>40%</span>
                      <span>20%</span>
                      <span>0%</span>
                    </div>

                    <div className="w-full h-36 relative">
                      <svg viewBox="0 0 500 130" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="chartRubyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ff3366" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#ff3366" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Horizontal guide lines */}
                        <line x1="0" y1="20" x2="500" y2="20" stroke="#260c18" strokeDasharray="3 3" />
                        <line x1="0" y1="52" x2="500" y2="52" stroke="#260c18" strokeDasharray="3 3" />
                        <line x1="0" y1="84" x2="500" y2="84" stroke="#260c18" strokeDasharray="3 3" />
                        <line x1="0" y1="115" x2="500" y2="115" stroke="#260c18" strokeDasharray="3 3" />

                        {/* Area fill */}
                        {chartAreaPath && (
                          <path
                            d={chartAreaPath}
                            fill="url(#chartRubyGradient)"
                          />
                        )}
                        {/* Smooth Line Stroke */}
                        {chartSvgPath && (
                          <path
                            d={chartSvgPath}
                            fill="none"
                            stroke="#ff3366"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        )}
                        {/* Key data point dots */}
                        {chartPoints.map((pt, pIdx) => (
                          <circle
                            key={pIdx}
                            cx={pt.x}
                            cy={pt.y}
                            r={pt.hasAttempt ? 4.5 : 3}
                            fill={pt.hasAttempt ? '#ffffff' : '#ff3366'}
                            stroke="#ff3366"
                            strokeWidth={pt.hasAttempt ? 2 : 1}
                          />
                        ))}
                      </svg>
                    </div>

                    {/* X-axis curriculum day labels */}
                    <div className="flex items-center justify-between text-[10px] text-[#a68690] pt-1 px-2 font-semibold">
                      {chartPoints.map((pt, idx) => (
                        <span key={idx} className={pt.hasAttempt ? 'text-emerald-400 font-bold' : ''}>
                          {pt.dayLabel}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions (1 col - 2x2 grid matching Image 3) */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg backdrop-blur-md space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#ff3366]" />
                    <h2 className="text-base font-extrabold text-white">Quick Actions</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      onClick={() => setActiveTab('schedule')}
                      className="p-3.5 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs font-bold transition-all shadow-ruby flex flex-col items-center justify-center gap-1.5 border border-[#ff3366]/30 text-center"
                    >
                      <span className="text-base font-black">+</span>
                      <span>Create Quiz</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('schedule')}
                      className="p-3.5 rounded-xl bg-[#1a0712] hover:bg-[#25091a] text-[#e8d5db] text-xs font-bold transition-colors border border-[#2b0c18] flex flex-col items-center justify-center gap-1.5 text-center"
                    >
                      <FileCheck className="w-4 h-4 text-[#ff8099]" />
                      <span>Add Questions</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('students')}
                      className="p-3.5 rounded-xl bg-[#1a0712] hover:bg-[#25091a] text-[#e8d5db] text-xs font-bold transition-colors border border-[#2b0c18] flex flex-col items-center justify-center gap-1.5 text-center"
                    >
                      <Users className="w-4 h-4 text-[#ff8099]" />
                      <span>Manage Students</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('notifications')}
                      className="p-3.5 rounded-xl bg-[#1a0712] hover:bg-[#25091a] text-[#e8d5db] text-xs font-bold transition-colors border border-[#2b0c18] flex flex-col items-center justify-center gap-1.5 text-center"
                    >
                      <MessageCircle className="w-4 h-4 text-[#ff8099]" />
                      <span>Send Announcement</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Grid Row 3: Recent Quizzes Table & Recent Activity Feed (Exact Image 3 Layout) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Recent Quizzes Table (2 cols) */}
                <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg backdrop-blur-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#ff3366]" />
                      <h2 className="text-base font-extrabold text-white">Recent Quizzes</h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('schedule')}
                      className="text-xs font-bold text-[#ff3366] hover:text-[#ff8099] transition-colors"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-[#a68690] border-b border-[#260c18]">
                          <th className="pb-2.5 font-bold uppercase tracking-wider">Quiz Title</th>
                          <th className="pb-2.5 font-bold uppercase tracking-wider text-center">Questions</th>
                          <th className="pb-2.5 font-bold uppercase tracking-wider text-center">Attempts</th>
                          <th className="pb-2.5 font-bold uppercase tracking-wider text-center">Avg. Score</th>
                          <th className="pb-2.5 font-bold uppercase tracking-wider text-center">Status</th>
                          <th className="pb-2.5 font-bold uppercase tracking-wider text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e0813]">
                        {DAILY_SCHEDULE.slice(0, 4).map((item) => {
                          const quiz = getQuizForDay(item.dayNumber);
                          const isUnlocked = isDayUnlocked(item.dayNumber, completedDays);
                          const dayAttempts = attempts.filter(a => a.quizId === quiz.id);
                          const avgScore = dayAttempts.length > 0 
                            ? `${Math.round(dayAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / dayAttempts.length)}%`
                            : '--';

                          return (
                            <tr key={item.quizId} className="hover:bg-[#1a0712] transition-colors">
                              <td className="py-2.5 font-bold text-white flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-[#ff3366] shrink-0" />
                                <span className="truncate max-w-[180px] sm:max-w-xs">{item.title}</span>
                              </td>
                              <td className="py-2.5 text-center text-[#cbb5bc] font-semibold">{item.totalQuestions}</td>
                              <td className="py-2.5 text-center text-[#cbb5bc]">{dayAttempts.length}</td>
                              <td className="py-2.5 text-center text-[#ff8099] font-bold">{avgScore}</td>
                              <td className="py-2.5 text-center">
                                {isUnlocked ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                                    Active
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#18070f] text-[#7a5b67] border border-[#2b0c18]">
                                    Locked (8:29 PM)
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => onPreviewDayQuiz?.(quiz.id)}
                                    title="Inspect / Preview Quiz"
                                    className="p-1 rounded-lg text-[#a68690] hover:text-white hover:bg-[#25091a] transition-colors"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleToggleDayLock(quiz.id, isUnlocked)}
                                    title={isUnlocked ? 'Lock Quiz' : 'Unlock Quiz'}
                                    className="p-1 rounded-lg text-[#ff8099] hover:text-white hover:bg-[#25091a] transition-colors"
                                  >
                                    {isUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Activity Timeline (1 col matching Image 3) */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg backdrop-blur-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#ff3366]" />
                      <h2 className="text-base font-extrabold text-white">Recent Activity</h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('attempts')}
                      className="text-xs font-bold text-[#ff3366] hover:text-[#ff8099] transition-colors"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="space-y-3 pt-1 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#ff3366] mt-1.5 shrink-0 shadow-[0_0_6px_rgba(255,51,102,0.8)]" />
                      <div>
                        <div className="text-white font-semibold">New quiz created: "Foundational 6 States"</div>
                        <div className="text-[10px] text-[#a68690]">2 minutes ago</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <div>
                        <div className="text-white font-semibold">{attempts.length > 0 ? `Student completed Day 01 (${attempts[0].percentage}%)` : 'Ready for Day 01 submission'}</div>
                        <div className="text-[10px] text-[#a68690]">10 minutes ago</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#ff8099] mt-1.5 shrink-0" />
                      <div>
                        <div className="text-white font-semibold">Curriculum syllabus set to 300 Questions across 9 Modules</div>
                        <div className="text-[10px] text-[#a68690]">25 minutes ago</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#7a5b67] mt-1.5 shrink-0" />
                      <div>
                        <div className="text-white font-semibold">Scheduled Day 02 unlock: Sharp 8:29 PM IST</div>
                        <div className="text-[10px] text-[#a68690]">42 minutes ago</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Live Student Tracking Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">

                <div className="p-4 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg backdrop-blur-md">
                  <div className="flex items-center justify-between text-[#a68690] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Completed Days</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {stats.completedCount} <span className="text-sm font-semibold text-[#a68690]">/ 7</span>
                  </div>
                  <p className="text-[11px] text-[#ff8099] font-semibold mt-1">
                    {stats.completedCount > 0 ? `${stats.completedCount} of 7 Days Complete` : '0 Days Completed'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg backdrop-blur-md">
                  <div className="flex items-center justify-between text-[#a68690] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Top Score</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {stats.bestPercentage}%
                  </div>
                  <p className="text-[11px] text-amber-300 font-semibold mt-1">
                    {attempts.length > 0 ? `${stats.bestPercentage}% Highest Score` : '0% (No attempts yet)'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg backdrop-blur-md">
                  <div className="flex items-center justify-between text-[#a68690] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Learning Streak</span>
                    <Flame className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {stats.currentStreak} <span className="text-sm font-semibold text-[#a68690]">{stats.currentStreak === 1 ? 'Day' : 'Days'}</span>
                  </div>
                  <p className="text-[11px] text-orange-400 font-semibold mt-1">
                    {stats.currentStreak > 0 ? `${stats.currentStreak}-Day Active Streak` : '0 Days (Not started)'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg backdrop-blur-md">
                  <div className="flex items-center justify-between text-[#a68690] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Inbox Alerts</span>
                    <InboxIcon className="w-4 h-4 text-[#ff3366]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {unreadInboxCount} <span className="text-sm font-semibold text-[#a68690]">Unread</span>
                  </div>
                  <p className="text-[11px] text-[#ff8099] font-semibold mt-1">
                    {attempts.length} Total Submissions
                  </p>
                </div>

              </div>

              {/* Mahi Student Spotlight Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#14060e] border border-[#3b0e1e] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff3366]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-red-700/20 border border-red-700/40 flex items-center justify-center text-red-600 font-black text-lg">
                      M
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-white">Mahi</h2>
                        <span className="px-2 py-0.5 rounded-full bg-red-700/10 text-red-600 border border-red-700/30 text-[10px] font-black uppercase tracking-wider">
                          Active Student
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Access Code: <code className="font-mono text-red-400">2002</code> • Role: <span className="font-semibold text-slate-300">Student</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('students')}
                      className="px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>View Student Profile & Result</span>
                    </button>
                  </div>
                </div>

                {/* Dynamic Submission Spotlight */}
                {attempts.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-1">
                      <Sparkles className="w-5 h-5 text-red-600" />
                    </div>
                    <h4 className="text-sm font-bold text-white">No Quiz Attempts Recorded Yet</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Day 01 National Parks Quiz (6 States, 30 Questions) is published and ready for Mahi to begin. Results and answer sheets will update here in real time.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-red-700/30 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-black text-white uppercase tracking-wider">
                          Latest Submission: {getQuizForDay(attempts[0].quizId).title} National Parks Quiz
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {attempts[0].formattedDate} • Time: {Math.floor(attempts[0].timeTakenSeconds / 60)}m {attempts[0].timeTakenSeconds % 60}s
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
                        <div className="text-lg font-black text-red-600">{attempts[0].marksObtained} / {attempts[0].maxMarks}</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Percentage</div>
                        <div className="text-lg font-black text-red-600">{attempts[0].percentage}%</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Mistakes</div>
                        <div className="text-lg font-black text-red-600">{attempts[0].incorrectCount}</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Performance</div>
                        <div className="text-sm font-black text-amber-400 mt-1">{attempts[0].performanceMessage || 'Completed'}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                      <span className="text-slate-400">
                        States Covered: <strong className="text-white">{attempts[0].statesCovered.join(', ')}</strong>
                      </span>
                      <button
                        onClick={() => handleOpenCompleteAnswerSheet(attempts[0])}
                        className="px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-950/40 transition-all active:scale-95"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>VIEW COMPLETE ANSWER SHEET</span>
                      </button>
                    </div>
                  </div>
                )}

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
                    <Users className="w-5 h-5 text-red-600" />
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
                    <div className="w-12 h-12 rounded-2xl bg-red-800/30 text-red-600 border border-red-700/30 flex items-center justify-center font-black text-xl">
                      M
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">Mahi</h3>
                      <p className="text-xs text-red-600 font-semibold">Role: Student</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Access Code:</span>
                      <strong className="font-mono text-red-400">2002</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Account Status:</span>
                      <span className="text-red-600 font-bold">● Active & Verified</span>
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
                    <span className="text-3xl font-black text-white">{stats.completedCount}</span>
                    <span className="text-sm font-semibold text-slate-400">of 7 Days Completed ({Math.round((stats.completedCount / 7) * 100)}%)</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-500" style={{ width: `${(stats.completedCount / 7) * 100}%` }} />
                  </div>
                  <div className="pt-1 text-[11px] text-slate-400 flex justify-between">
                    <span>{stats.completedCount > 0 ? `Completed Days: ${stats.completedCount}` : 'No days completed yet'}</span>
                    <span className="text-red-600 font-bold">{stats.completedCount > 0 ? `${stats.completedCount * 30} Parks Mastered` : '0 Parks Mastered'}</span>
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
                      <span>{stats.currentStreak}-Day Streak</span>
                    </div>
                    {stats.bestPercentage === 100 && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-bold">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Perfect Score</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-1 text-[11px] text-slate-400">
                    Badges Earned: <strong className="text-slate-200">
                      {stats.unlockedBadges.length > 0 ? stats.unlockedBadges.map(b => b.title).join(', ') : 'No badges earned yet'}
                    </strong>
                  </div>
                </div>

              </div>

              {/* 7-Day Syllabus & Individual Day Management */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-600" />
                      Learning Progress & Day Management
                    </h3>
                    <p className="text-xs text-slate-400">
                      Manage individual day completions, reset specific days without affecting others, or record manual scores.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowFullResetModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/70 text-rose-300 border border-rose-900 hover:bg-rose-900 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reset All Student Progress</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DAILY_SCHEDULE.map(item => {
                    const isDayDone = completedDays.includes(item.quizId);
                    const bestAtt = attempts.find(a => a.quizId === item.quizId);
                    const isUnlocked = isDayUnlocked(item.quizId);

                    return (
                      <div
                        key={item.quizId}
                        className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition-all ${
                          isDayDone
                            ? 'bg-red-950/20 border-red-700/40'
                            : isUnlocked
                            ? 'bg-slate-950/60 border-slate-800'
                            : 'bg-slate-950/30 border-slate-900 opacity-80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black text-white">
                                {item.quizId.toUpperCase()}
                              </span>
                              <span className="text-xs font-bold text-slate-200">
                                {item.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {item.displayDate} • {item.states.length} States
                            </span>
                          </div>

                          {isDayDone ? (
                            <span className="px-2 py-0.5 rounded-full bg-red-700/20 text-red-400 text-[10px] font-black uppercase flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Done
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold">
                              Pending
                            </span>
                          )}
                        </div>

                        {isDayDone && bestAtt && (
                          <div className="p-2 rounded-lg bg-red-950/40 border border-red-950/60 text-[11px] flex justify-between items-center">
                            <span className="text-slate-300">Best Score:</span>
                            <span className="font-bold text-red-400">
                              {bestAtt.marksObtained}/{bestAtt.maxMarks} ({bestAtt.percentage}%) • {bestAtt.timeTakenSeconds}s
                            </span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setMarkCompletedModalDay(item.dayNumber);
                              setManualScore(item.totalQuestions);
                              setManualMaxMarks(item.totalQuestions);
                            }}
                            className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-all text-center"
                          >
                            {isDayDone ? 'Edit Score' : 'Mark Completed'}
                          </button>

                          {isDayDone && (
                            <button
                              type="button"
                              onClick={() => setResetConfirmQuizId(item.quizId)}
                              className="py-1 px-2 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-900/60 text-[11px] font-bold transition-all"
                              title="Reset only this day"
                            >
                              Reset Day
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Attempts Table for Mahi */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-600" />
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
                                <span className="font-bold text-red-600 text-sm">
                                  {att.marksObtained} / {att.maxMarks}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`inline-block px-2 py-0.5 rounded-full font-black text-[11px] ${
                                  isPerfect
                                    ? 'bg-red-700/20 text-red-400 border border-red-700/40'
                                    : 'bg-slate-800 text-slate-200'
                                }`}>
                                  {att.percentage}%
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-300 font-mono">
                                {`${Math.floor(att.timeTakenSeconds / 60)}m ${att.timeTakenSeconds % 60}s`}
                              </td>
                              <td className="py-3 px-3">
                                <span className="text-red-600 font-semibold">{att.correctCount} correct</span>
                                {att.incorrectCount > 0 ? (
                                  <span className="text-rose-400 ml-1">({att.incorrectCount} wrong)</span>
                                ) : (
                                  <span className="text-slate-500 ml-1">(0 mistakes)</span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenCompleteAnswerSheet(att)}
                                  className="px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5 shadow-sm"
                                >
                                  <FileCheck className="w-3.5 h-3.5" />
                                  <span>View Complete Answer Sheet</span>
                                </button>

                                <a
                                  href={getWhatsAppShareUrl(formatWhatsAppMessage(att), DEFAULT_SANJU_WHATSAPP_NUMBER)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1.5 rounded-lg bg-red-950 text-red-400 border border-red-900 hover:bg-red-950 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
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
          {/* TAB: MAHI'S PROFILE */}
          {/* ========================================================================= */}
          {activeTab === 'mahi-profile' && (
            <div className="space-y-6 animate-fadeIn">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-red-600" />
                    Mahi's Student Profile
                  </h2>
                  <p className="text-xs text-slate-400">
                    Dedicated learning record, syllabus progress, and complete attempt history
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {attempts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleOpenCompleteAnswerSheet(attempts[0])}
                      className="px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>VIEW COMPLETE ANSWER SHEET</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bio & Access Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 space-y-3 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-800 to-red-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-red-950/40">
                      M
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Mahi</h3>
                      <p className="text-xs text-red-600 font-semibold">Student Account</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Access Code (PIN):</span>
                      <strong className="font-mono text-red-400 text-sm">2002</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Email Account:</span>
                      <span className="font-mono text-slate-300">mahi@boddukuri.quiz</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Target Curriculum:</span>
                      <span className="text-slate-200 font-semibold">106 National Parks (7 Days)</span>
                    </div>
                  </div>
                </div>

                {/* Progress Card */}
                <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 space-y-3 shadow-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Curriculum Completion
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">{stats.completedCount}</span>
                    <span className="text-sm font-semibold text-slate-400">of 7 Days Completed ({Math.round((stats.completedCount / 7) * 100)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-500" style={{ width: `${(stats.completedCount / 7) * 100}%` }} />
                  </div>
                  <div className="pt-1 text-[11px] text-slate-400 flex justify-between">
                    <span>Distinct Quizzes: {stats.completedCount} / 7</span>
                    <span className="text-red-600 font-bold">{stats.completedCount > 0 ? `${stats.completedCount * 30} Parks Mastered` : '0 Parks Mastered'}</span>
                  </div>
                </div>

                {/* Streaks & Badges Card */}
                <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 space-y-3 shadow-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Habit Streak & Badges
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-950/60 border border-orange-800 text-orange-300 text-xs font-bold">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span>{stats.currentStreak}-Day Streak</span>
                    </div>
                    {stats.bestPercentage === 100 && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-bold">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>100% Top Score</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-1 text-[11px] text-slate-400">
                    Earned Badges: <strong className="text-slate-200">
                      {stats.unlockedBadges.length > 0 ? stats.unlockedBadges.map(b => b.title).join(', ') : '0 of 10 Badges'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Latest Attempt Spotlight & Button */}
              {attempts.length > 0 ? (
                <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-red-700/40 shadow-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <h3 className="text-base font-black text-white">
                          Latest Submission: {getQuizForDay(attempts[0].quizId).title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400">
                        Submitted: {attempts[0].formattedDate} • Duration: {Math.floor(attempts[0].timeTakenSeconds / 60)}m {attempts[0].timeTakenSeconds % 60}s
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenCompleteAnswerSheet(attempts[0])}
                      className="px-5 py-2.5 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-950/40 transition-all active:scale-95"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>VIEW COMPLETE ANSWER SHEET</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
                      <div className="text-xl font-black text-red-600">{attempts[0].marksObtained} / {attempts[0].maxMarks}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Percentage</div>
                      <div className="text-xl font-black text-red-600">{attempts[0].percentage}%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Correct / Wrong</div>
                      <div className="text-sm font-bold text-slate-200 mt-1">{attempts[0].correctCount} / {attempts[0].incorrectCount}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Performance</div>
                      <div className="text-sm font-bold text-amber-400 mt-1">{attempts[0].performanceMessage || 'Completed'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-1">
                    <Sparkles className="w-5 h-5 text-red-600" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No Quiz Attempts Recorded Yet</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Day 01 National Parks Quiz (6 States, 30 Questions) is published and ready for Mahi to begin. Results and answer sheets will update here in real time.
                  </p>
                </div>
              )}

              {/* All Previous Attempts Table */}
              <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-600" />
                    All Attempts History ({attempts.length})
                  </h3>
                  <span className="text-xs text-slate-400">
                    Each attempt preserves full selected answers independently
                  </span>
                </div>

                {attempts.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    No attempts recorded yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                          <th className="py-2.5 px-3">Attempt</th>
                          <th className="py-2.5 px-3">Quiz Day</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Marks</th>
                          <th className="py-2.5 px-3">Percentage</th>
                          <th className="py-2.5 px-3">Duration</th>
                          <th className="py-2.5 px-3 text-right">Answer Inspection</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium">
                        {attempts.map((att, attIdx) => {
                          const quiz = getQuizForDay(att.quizId);
                          return (
                            <tr key={att.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="py-3 px-3 font-mono text-red-600 font-bold">
                                #{attempts.length - attIdx}
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-bold text-white">{quiz.title}</span>
                                <span className="block text-[10px] text-slate-400">{att.quizId.toUpperCase()}</span>
                              </td>
                              <td className="py-3 px-3 text-slate-300">
                                {att.formattedDate || quiz.displayDate}
                              </td>
                              <td className="py-3 px-3 font-bold text-red-600">
                                {att.marksObtained} / {att.maxMarks}
                              </td>
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 rounded-full bg-red-700/20 text-red-400 border border-red-700/30 text-[10px] font-bold">
                                  {att.percentage}%
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-300 font-mono">
                                {Math.floor(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleOpenCompleteAnswerSheet(att)}
                                  className="px-3 py-1.5 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-sm"
                                >
                                  <FileCheck className="w-3.5 h-3.5" />
                                  <span>View Answer Sheet</span>
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
          {/* TAB: ANSWER SHEETS / COMPLETE STUDENT ANSWER INSPECTION */}
          {/* ========================================================================= */}
          {activeTab === 'answer-sheets' && (
            <div className="space-y-6 animate-fadeIn">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-red-600" />
                    Student Answer Sheet Inspector
                  </h2>
                  <p className="text-xs text-slate-400">
                    Comprehensive question-by-question review of Mahi's submitted answers, correct keys, and explanations
                  </p>
                </div>

                {currentReviewAttempt && currentReviewQuiz && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => generateAnswerSheetPDF(currentReviewAttempt, currentReviewQuiz)}
                      className="px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Sheet</span>
                    </button>
                  </div>
                )}
              </div>

              {!currentReviewAttempt || !currentReviewQuiz ? (
                <div className="p-12 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 text-center space-y-3 shadow-2xl">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-base font-bold text-white">No Quiz Submissions Recorded Yet</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Once Mahi completes Day 01 National Parks Quiz, her full question-by-question answer sheet will be available here for complete inspection.
                  </p>
                </div>
              ) : (
                <>
                  {/* Result Summary Card */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/50 shadow-2xl space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-800 to-red-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-red-950/40">
                          M
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-white">Student: Mahi</h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-red-700/20 text-red-400 border border-red-700/40 text-[10px] font-bold">
                              Access Code: 2002
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            Quiz: <strong className="text-white">{currentReviewQuiz.title}</strong> • Date: <strong className="text-white">{currentReviewAttempt.formattedDate || currentReviewQuiz.displayDate}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Attempt Switcher Dropdown */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        {attempts.length > 1 && (
                          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                            <span className="text-xs text-slate-400 font-semibold">Select Attempt:</span>
                            <select
                              value={currentReviewAttempt.id}
                              onChange={e => setSelectedAnswerSheetAttemptId(e.target.value)}
                              className="bg-transparent text-xs font-bold text-red-600 outline-none cursor-pointer"
                            >
                              {attempts.map((att, attIdx) => (
                                <option key={att.id} value={att.id} className="bg-slate-900 text-white">
                                  Attempt #{attempts.length - attIdx}: {att.percentage}% ({att.marksObtained}/{att.maxMarks}) — {att.formattedDate}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-center">
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Questions</div>
                        <div className="text-xl font-black text-white mt-1">{currentReviewAttempt.totalQuestions}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-red-950/40 border border-red-950/60">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-red-600">Correct</div>
                        <div className="text-xl font-black text-red-600 mt-1">{currentReviewAttempt.correctCount}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Incorrect</div>
                        <div className="text-xl font-black text-rose-400 mt-1">{currentReviewAttempt.incorrectCount}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Unanswered</div>
                        <div className="text-xl font-black text-slate-400 mt-1">{currentReviewAttempt.unansweredCount}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Marks</div>
                        <div className="text-xl font-black text-red-600 mt-1">{currentReviewAttempt.marksObtained} / {currentReviewAttempt.maxMarks}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-red-950/40 border border-red-950/60">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-red-600">Percentage</div>
                        <div className="text-xl font-black text-red-600 mt-1">{currentReviewAttempt.percentage}%</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Time Taken</div>
                        <div className="text-xl font-black text-slate-200 mt-1">{Math.floor(currentReviewAttempt.timeTakenSeconds / 60)}m {currentReviewAttempt.timeTakenSeconds % 60}s</div>
                      </div>
                    </div>

                    {/* Performance Summary Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-red-950/60 to-slate-950 border border-red-700/30">
                      <div className="flex items-center gap-2.5">
                        <Award className="w-5 h-5 text-amber-400" />
                        <div>
                          <span className="text-xs font-bold text-slate-300">Performance Assessment: </span>
                          <strong className="text-amber-300 font-black">{currentReviewAttempt.performanceMessage || 'Completed'}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={getWhatsAppShareUrl(formatWhatsAppMessage(currentReviewAttempt), DEFAULT_SANJU_WHATSAPP_NUMBER)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-red-600 hover:text-red-400 flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Share Result on WhatsApp (+91 70759 20852)</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Answer Review Controls Bar */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/50 shadow-xl space-y-4">

                    {/* Status Filter Tabs */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { id: 'all', label: `All Questions (${questionStatusCounts.all})` },
                          { id: 'correct', label: `Correct Answers (${questionStatusCounts.correct})` },
                          { id: 'incorrect', label: `Incorrect Answers (${questionStatusCounts.incorrect})` },
                          { id: 'unanswered', label: `Unanswered (${questionStatusCounts.unanswered})` }
                        ].map(f => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => {
                              setAnswerStatusFilter(f.id as any);
                              setSelectedQuestionNavNumber(null);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              answerStatusFilter === f.id
                                ? 'bg-red-800 text-white shadow-md shadow-red-950'
                                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>

                      {/* Expand / Collapse Explanations Toggle */}
                      <button
                        type="button"
                        onClick={() => setExpandAllExplanations(prev => !prev)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        {expandAllExplanations ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5 text-red-600" />
                            <span>Collapse Explanations</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5 text-red-600" />
                            <span>Expand Explanations</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Search & State Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={answerSearchQuery}
                          onChange={e => {
                            setAnswerSearchQuery(e.target.value);
                            setSelectedQuestionNavNumber(null);
                          }}
                          placeholder="Search questions by text, park, state, or option..."
                          className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-700"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
                        <select
                          value={answerStateFilter}
                          onChange={e => {
                            setAnswerStateFilter(e.target.value);
                            setSelectedQuestionNavNumber(null);
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-700"
                        >
                          <option value="all">All States ({availableStatesInReview.length})</option>
                          {availableStatesInReview.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Question Number Navigation Jump Grid */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-bold uppercase tracking-wider text-[10px]">
                          Quick Question Navigation (Jump to Question):
                        </span>
                        {selectedQuestionNavNumber !== null && (
                          <button
                            type="button"
                            onClick={() => setSelectedQuestionNavNumber(null)}
                            className="text-red-600 hover:underline font-bold text-xs"
                          >
                            Show All Questions
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {reviewQuestionItems.map(item => {
                          const isActiveNav = selectedQuestionNavNumber === item.questionNumber;
                          const isCorrect = item.status === 'correct';
                          const isUnanswered = item.status === 'unanswered';

                          let badgeColor = 'bg-slate-800 text-slate-400 border-slate-700';
                          if (isCorrect) {
                            badgeColor = isActiveNav
                              ? 'bg-red-700 text-slate-950 border-red-400 ring-2 ring-red-600'
                              : 'bg-red-950/80 text-red-400 border-red-900/80 hover:bg-red-950';
                          } else if (isUnanswered) {
                            badgeColor = isActiveNav
                              ? 'bg-[#3a1822] text-slate-950 border-white ring-2 ring-slate-400'
                              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700';
                          } else {
                            badgeColor = isActiveNav
                              ? 'bg-rose-500 text-white border-rose-300 ring-2 ring-rose-400'
                              : 'bg-rose-950/80 text-rose-300 border-rose-800/80 hover:bg-rose-900';
                          }

                          return (
                            <button
                              key={item.questionNumber}
                              type="button"
                              onClick={() => {
                                setSelectedQuestionNavNumber(item.questionNumber);
                                const el = document.getElementById(`question-card-${item.questionNumber}`);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                              }}
                              className={`w-8 h-8 rounded-lg text-xs font-mono font-bold border transition-all flex items-center justify-center ${badgeColor}`}
                              title={`Question ${item.questionNumber}: ${item.status.toUpperCase()}`}
                            >
                              {item.questionNumber < 10 ? `0${item.questionNumber}` : item.questionNumber}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Question Cards List */}
                  <div className="space-y-4">
                    {filteredReviewQuestions.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-xs rounded-2xl bg-slate-900/80 border border-slate-800">
                        No questions match the current filter or search criteria.
                      </div>
                    ) : (
                      filteredReviewQuestions.map(item => {
                        return (
                          <div
                            id={`question-card-${item.questionNumber}`}
                            key={item.question.id}
                            className={`p-5 rounded-2xl border transition-all text-sm space-y-3.5 backdrop-blur-xl shadow-xl ${
                              item.status === 'correct'
                                ? 'bg-slate-900/85 border-red-700/40 shadow-red-950/20'
                                : item.status === 'incorrect'
                                ? 'bg-slate-900/85 border-rose-500/50 shadow-rose-950/20'
                                : 'bg-slate-900/85 border-slate-700/60'
                            }`}
                          >
                            {/* Question Header: Number, State, Status Badge */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-slate-950 text-slate-200 border border-slate-800">
                                  Question {item.questionNumber < 10 ? `0${item.questionNumber}` : item.questionNumber}
                                </span>
                                <span className="text-xs text-slate-400 font-semibold">
                                  State: <strong className="text-red-400">{item.question.state}</strong>
                                </span>
                              </div>

                              {/* Clear Status Indicator */}
                              {item.status === 'correct' ? (
                                <span className="px-3 py-1 rounded-full bg-red-700/20 border border-red-700/50 text-red-400 font-black text-xs flex items-center gap-1.5 shadow-sm">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                                  Status: CORRECT
                                </span>
                              ) : item.status === 'incorrect' ? (
                                <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 font-black text-xs flex items-center gap-1.5 shadow-sm">
                                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                  Status: INCORRECT
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-black text-xs flex items-center gap-1.5">
                                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                                  Status: UNANSWERED
                                </span>
                              )}
                            </div>

                            {/* Complete Question Text */}
                            <p className="text-base font-bold text-white leading-relaxed">
                              {item.question.question}
                            </p>

                            {/* All Available Answer Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              {item.question.options.map((opt, optIdx) => {
                                const optionLetters = ['A', 'B', 'C', 'D'];
                                const isCorrectOption = optIdx === item.question.correctAnswer;
                                const isSelectedOption = optIdx === item.selectedOptionIndex;

                                let optionStyle = 'bg-slate-950/70 border-slate-800 text-slate-300';
                                if (isCorrectOption) {
                                  optionStyle = 'bg-red-950/80 border-red-700/80 text-red-300 font-bold ring-1 ring-red-700/30';
                                } else if (isSelectedOption && !isCorrectOption) {
                                  optionStyle = 'bg-rose-950/80 border-rose-500/80 text-rose-200 font-bold ring-1 ring-rose-500/30';
                                }

                                return (
                                  <div
                                    key={opt}
                                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${optionStyle}`}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[11px] ${
                                        isCorrectOption
                                          ? 'bg-red-800 text-white'
                                          : isSelectedOption
                                          ? 'bg-rose-600 text-white'
                                          : 'bg-slate-800 text-slate-400'
                                      }`}>
                                        {optionLetters[optIdx]}
                                      </span>
                                      <span>{opt}</span>
                                    </div>

                                    {isCorrectOption && (
                                      <span className="text-[10px] uppercase font-bold text-red-600 bg-red-700/10 px-2 py-0.5 rounded border border-red-700/30">
                                        Correct Answer
                                      </span>
                                    )}
                                    {isSelectedOption && !isCorrectOption && (
                                      <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                                        Mahi Selected
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Visual Answer Comparison Box */}
                            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5 text-xs">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-300">
                                <div>
                                  <span className="text-slate-400">Mahi selected: </span>
                                  <strong className={item.isCorrect ? 'text-red-400 font-bold' : item.isUnanswered ? 'text-slate-400 font-bold' : 'text-rose-300 font-bold'}>
                                    {item.selectedAnswerText}
                                  </strong>
                                </div>
                                <div>
                                  <span className="text-slate-400">Correct answer: </span>
                                  <strong className="text-red-600 font-bold">{item.correctAnswerText}</strong>
                                </div>
                              </div>
                            </div>

                            {/* Short Explanation Box */}
                            {expandAllExplanations && item.question.explanation && (
                              <div className="pt-1">
                                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="text-amber-300 block mb-0.5">National Park Fact & Memory Trick:</strong>
                                    <span>{item.question.explanation}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Navigation footer for questions */}
                  {filteredReviewQuestions.length > 0 && (
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          const current = selectedQuestionNavNumber || 1;
                          const prev = Math.max(1, current - 1);
                          setSelectedQuestionNavNumber(prev);
                          const el = document.getElementById(`question-card-${prev}`);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous Question</span>
                      </button>

                      <span className="text-xs text-slate-400 font-mono">
                        Viewing {filteredReviewQuestions.length} of {reviewQuestionItems.length} Questions
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          const current = selectedQuestionNavNumber || 1;
                          const next = Math.min(reviewQuestionItems.length, current + 1);
                          setSelectedQuestionNavNumber(next);
                          const el = document.getElementById(`question-card-${next}`);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}

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
                    <Calendar className="w-5 h-5 text-red-600" />
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
                          ? 'bg-slate-900/90 border-red-700/40 shadow-lg shadow-red-950/20'
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
                            <span className="px-2.5 py-1 rounded-full bg-red-700/10 text-red-600 border border-red-700/30 text-[10px] font-black uppercase flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Completed
                            </span>
                          ) : unlocked ? (
                            <span className="px-2.5 py-1 rounded-full bg-red-600/10 text-red-500 border border-red-600/30 text-[10px] font-black uppercase flex items-center gap-1">
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
                          <span>Coverage: <strong className="text-red-600">{dayItem.totalQuestions} Questions</strong></span>
                        </div>
                      </div>

                      {/* Controls Footer */}
                      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {onPreviewDayQuiz && (
                            <button
                              type="button"
                              onClick={() => onPreviewDayQuiz(dayItem.quizId)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Preview</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setMarkCompletedModalDay(dayItem.dayNumber);
                              setManualScore(dayItem.totalQuestions);
                              setManualMaxMarks(dayItem.totalQuestions);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-red-950/80 text-red-400 border border-red-900 hover:bg-red-950 text-xs font-bold transition-all flex items-center gap-1"
                            title="Manually record this day as completed for Mahi"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Completed</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          {isCompleted && (
                            <button
                              type="button"
                              onClick={() => setResetConfirmQuizId(dayItem.quizId)}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-900 hover:bg-rose-900 text-xs font-bold transition-all flex items-center gap-1"
                              title="Reset this day's progress only"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reset Day</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleDayLock(dayItem.quizId, unlocked)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              unlocked
                                ? 'bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900'
                                : 'bg-red-800 hover:bg-red-700 text-white shadow-sm'
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
                    <FileText className="w-5 h-5 text-red-600" />
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
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-700"
                  />
                </div>

                <select
                  value={selectedDayFilter}
                  onChange={e => setSelectedDayFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-700"
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
                            <td className="py-3 px-3 font-bold text-red-600">
                              {att.marksObtained} / {att.maxMarks}
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-red-700/20 text-red-400 border border-red-700/30 text-[10px] font-bold">
                                {att.percentage}%
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-300 font-mono">
                              {`${Math.floor(att.timeTakenSeconds / 60)}m ${att.timeTakenSeconds % 60}s`}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => handleOpenCompleteAnswerSheet(att)}
                                className="px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5 shadow-sm"
                              >
                                <FileCheck className="w-3.5 h-3.5" />
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
          {/* TAB: RETAKE REQUESTS MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'retake-requests' && (
            <div className="space-y-6 animate-fadeIn">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-amber-400" />
                    Student Retake Requests ({retakeRequests.length})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Review and approve requests from Mahi to reattempt previously submitted quizzes. Approving immediately unlocks the day.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setRetakeFilter(f)}
                        className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                          retakeFilter === f
                            ? 'bg-slate-800 text-white font-bold shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {f} ({f === 'all' ? retakeRequests.length : retakeRequests.filter(r => r.status === f).length})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Retake Requests List */}
              {retakeRequests.filter(r => retakeFilter === 'all' || r.status === retakeFilter).length === 0 ? (
                <div className="p-12 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                    <RotateCcw className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-white">No Retake Requests Found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    When Mahi clicks "Attempt Again" on any completed day quiz, the request will appear here for your review and approval.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {retakeRequests
                    .filter(r => retakeFilter === 'all' || r.status === retakeFilter)
                    .map((req) => {
                      const isPending = req.status === 'pending';
                      const isApproved = req.status === 'approved';
                      const isRejected = req.status === 'rejected';

                      return (
                        <div
                          key={req.id}
                          className="p-5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2.5">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-black text-xs">
                                {req.quizId.toUpperCase()}
                              </span>
                              <h3 className="text-sm font-extrabold text-white">
                                {req.dayTitle || getQuizForDay(req.quizId).title}
                              </h3>
                              {isPending ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> Pending Review
                                </span>
                              ) : isApproved ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-red-700/20 text-red-400 border border-red-700/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Approved
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                  <X className="w-3 h-3" /> Rejected
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-300">
                              Requested by <strong className="text-white">Mahi</strong> (<span className="text-slate-400">{req.userEmail}</span>)
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                              <span>Requested: {new Date(req.requestedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                              {req.reviewedBy && (
                                <span>• Reviewed by: <strong className="text-slate-200">{req.reviewedBy}</strong></span>
                              )}
                              {req.adminNotes && (
                                <span className="text-slate-300 italic">• Note: "{req.adminNotes}"</span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                            <button
                              type="button"
                              onClick={() => handleReviewRetake(req.id, 'approved')}
                              disabled={isApproved}
                              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm ${
                                isApproved
                                  ? 'bg-red-950 text-red-700 border border-red-900/40 opacity-70 cursor-not-allowed'
                                  : 'bg-red-800 hover:bg-red-700 text-white shadow-red-950 active:scale-95'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{isApproved ? 'Approved' : 'Approve Retake'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReviewRetake(req.id, 'rejected')}
                              disabled={isRejected}
                              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                isRejected
                                  ? 'bg-rose-950 text-rose-500 border border-rose-800/40 opacity-70 cursor-not-allowed'
                                  : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 active:scale-95'
                              }`}
                            >
                              <X className="w-4 h-4" />
                              <span>{isRejected ? 'Rejected' : 'Reject'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: RESULTS & ANALYTICS */}
          {/* ========================================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fadeIn">

              <div className="pb-2 border-b border-slate-800">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                  Learning Analytics & State Performance
                </h2>
                <p className="text-xs text-slate-400">
                  Performance breakdown across states and national park categories
                </p>
              </div>

              {/* Analytics KPI Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Completed Quizzes</div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{stats.completedCount}</div>
                  <p className="text-[11px] text-red-600 font-semibold mt-1">Distinct days cleared</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Submissions</div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{attempts.length}</div>
                  <p className="text-[11px] text-sky-400 font-semibold mt-1">Total recorded attempts</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Average Score</div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{stats.avgPercentage}%</div>
                  <p className="text-[11px] text-red-500 font-semibold mt-1">{attempts.length > 0 ? 'Mean accuracy' : '0% (No attempts)'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Highest Score</div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{stats.bestPercentage}%</div>
                  <p className="text-[11px] text-amber-300 font-semibold mt-1">{attempts.length > 0 ? 'Peak performance' : '0% (No attempts)'}</p>
                </div>
              </div>

              {attempts.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <TrendingUp className="w-8 h-8 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-white">No Learning Analytics Data Yet</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    State breakdown, time efficiency, and accuracy analytics will be dynamically generated once Mahi completes a quiz.
                  </p>
                </div>
              ) : (
                <>
                  {/* State Performance Breakdown */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      {getQuizForDay(attempts[0].quizId).title} State Mastery Breakdown ({attempts[0].totalQuestions} Questions)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(() => {
                        const quiz = getQuizForDay(attempts[0].quizId);
                        const stateStats: Record<string, { total: number; correct: number }> = {};
                        quiz.statesCovered.forEach(s => {
                          stateStats[s] = { total: 0, correct: 0 };
                        });
                        quiz.questions.forEach(q => {
                          const state = q.state;
                          if (!stateStats[state]) stateStats[state] = { total: 0, correct: 0 };
                          stateStats[state].total += 1;
                          if (attempts[0].answers[q.id] === q.correctAnswer) {
                            stateStats[state].correct += 1;
                          }
                        });
                        return Object.entries(stateStats).map(([state, s]) => {
                          const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                          return (
                            <div key={state} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-white">{state}</span>
                                <span className="font-mono text-red-600 font-bold">{s.correct} / {s.total} ({pct}%)</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                <div className="h-full bg-red-700 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Time Efficiency & Accuracy Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Time Efficiency</h4>
                      <div className="text-2xl font-black text-white">
                        {(attempts[0].timeTakenSeconds / Math.max(1, attempts[0].totalQuestions)).toFixed(2)} <span className="text-sm font-semibold text-slate-400">seconds / question</span>
                      </div>
                      <p className="text-xs text-red-600">
                        Completed {attempts[0].totalQuestions} questions in {Math.floor(attempts[0].timeTakenSeconds / 60)}m {attempts[0].timeTakenSeconds % 60}s.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Accuracy Rate</h4>
                      <div className="text-2xl font-black text-red-600">
                        {attempts[0].percentage}% <span className="text-sm font-semibold text-slate-400">accuracy</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {attempts[0].correctCount} correct, {attempts[0].incorrectCount} incorrect out of {attempts[0].totalQuestions} questions.
                      </p>
                    </div>
                  </div>
                </>
              )}

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
                    <InboxIcon className="w-5 h-5 text-red-600" />
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
                    <CheckCheck className="w-3.5 h-3.5 text-red-600" />
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
                        ? 'bg-red-800 text-white'
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
                            : 'bg-slate-900 border-red-700/40 text-white shadow-md shadow-red-950/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            !isItemUnread
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-red-700/20 text-red-600 border border-red-700/30'
                          }`}>
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-white">
                                {notif.title}
                              </h4>
                              {isItemUnread && (
                                <span className="w-2 h-2 rounded-full bg-red-600" />
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
                              className="px-3 py-1.5 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
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
                  <MessageCircle className="w-5 h-5 text-red-600" />
                  WhatsApp Notifications & Result Dispatch
                </h2>
                <p className="text-xs text-slate-400">
                  Target Number: <strong className="text-red-400">+91 70759 20852</strong> (Sanju Admin)
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
                  <pre className="text-xs font-mono text-red-400 whitespace-pre-wrap leading-relaxed">
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
                      className="px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
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
                  <SettingsIcon className="w-5 h-5 text-red-600" />
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
                  <Download className="w-4 h-4 text-red-600" />
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
                  <HelpCircle className="w-5 h-5 text-red-600" />
                  Boddukuri's Quiz System Architecture & Guide
                </h2>
                <p className="text-xs text-slate-400">
                  Role specifications, access codes, and syllabus schedule reference
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed">
                <h3 className="text-sm font-bold text-white">Access Credentials:</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong className="text-white">Mahi (Student):</strong> Access Code <code className="font-mono text-red-400">2002</code> • Role: student</li>
                  <li><strong className="text-white">Sanju (Admin):</strong> Access Code <code className="font-mono text-red-400">2718</code> • Role: admin</li>
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
          <div className="bg-slate-900 w-full max-w-3xl max-h-[90vh] rounded-3xl p-5 sm:p-6 border border-red-700/40 shadow-2xl flex flex-col space-y-4">

            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Answer Sheet Inspector — {inspectedAttempt.quizId.toUpperCase()}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-red-700/20 text-red-400 border border-red-700/40 text-[10px] font-bold">
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
                          ? 'bg-slate-950/60 border-red-950/60'
                          : 'bg-rose-950/20 border-rose-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-200">
                          {idx + 1}. {q.question}
                        </span>
                        {isCorrect ? (
                          <span className="text-red-600 font-bold shrink-0 flex items-center gap-1 text-[11px]">
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
                                  ? 'bg-red-950/80 border-red-700/60 text-red-400'
                                  : isSelected
                                  ? 'bg-rose-950/80 border-rose-500/60 text-rose-300'
                                  : 'bg-slate-900/50 border-slate-800 text-slate-400'
                              }`}
                            >
                              <span>{opt}</span>
                              {isTarget && <Check className="w-3.5 h-3.5 text-red-600" />}
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

      {/* ========================================================================= */}
      {/* MARK DAY AS COMPLETED MODAL */}
      {/* ========================================================================= */}
      {markCompletedModalDay !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 w-full max-w-lg rounded-3xl p-6 border border-red-700/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2.5 text-red-600">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-black text-white">
                  Mark Day 0{markCompletedModalDay} as Completed
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMarkCompletedModalDay(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Manually register completion for Mahi. This will generate full correct answers, update the syllabus progress, learning streak, and send an audited notification.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Score Obtained</label>
                <input
                  type="number"
                  min={0}
                  max={manualMaxMarks}
                  value={manualScore}
                  onChange={e => setManualScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Total Marks</label>
                <input
                  type="number"
                  min={1}
                  value={manualMaxMarks}
                  onChange={e => setManualMaxMarks(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Duration (Seconds)</label>
                <input
                  type="number"
                  min={1}
                  value={manualDurationSecs}
                  onChange={e => setManualDurationSecs(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Completion Date</label>
                <input
                  type="text"
                  value={manualDateStr}
                  onChange={e => setManualDateStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1">Admin Audit Notes</label>
              <input
                type="text"
                value={manualNotes}
                onChange={e => setManualNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setMarkCompletedModalDay(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteMarkCompleted}
                className="px-5 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-950 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Mark Completed</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
