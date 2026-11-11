import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  ArrowLeft,
  CheckCheck,
  Trash2,
  Play,
  FileCheck,
  RotateCcw,
  Sparkles,
  Inbox
} from 'lucide-react';
import type { InboxNotification } from '../types/quiz';
import {
  getInboxNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteInboxNotification
} from '../utils/storage';

interface StudentNotificationsProps {
  onGoHome: () => void;
  onStartQuiz: (quizId: string) => void;
  onViewResult?: (quizId: string, attemptId?: string) => void;
}

export const StudentNotifications: React.FC<StudentNotificationsProps> = ({
  onGoHome,
  onStartQuiz,
  onViewResult
}) => {
  const [notifications, setNotifications] = useState<InboxNotification[]>(() => getInboxNotifications('student'));
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const refresh = () => {
    setNotifications(getInboxNotifications('student'));
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleMarkAsRead = (id: string) => {
    markNotificationRead(id);
    refresh();
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead('student');
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteInboxNotification(id);
    refresh();
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredList = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  const handleAction = (notif: InboxNotification) => {
    if (!notif.read) {
      markNotificationRead(notif.id);
    }
    if (notif.type === 'submission' && notif.quizId && onViewResult) {
      onViewResult(notif.quizId, notif.attemptId);
    } else if (notif.type === 'retake' && notif.quizId) {
      onStartQuiz(notif.quizId);
    } else if (notif.quizId) {
      onStartQuiz(notif.quizId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fadeIn">

      {/* Top Header Card */}
      <div className="rounded-3xl bg-white border border-[#ebd4d9] p-6 sm:p-8 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onGoHome}
            className="p-2.5 rounded-2xl bg-[#fff8fa] hover:bg-[#fde8ec] border border-[#ebd4d9] text-[#76515b] transition-colors"
            title="Back to Dashboard"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-[#800020]" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#fde8ec] text-[#800020]">
                <Bell className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#2b0c15]">
                Notifications & Updates
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#800020] text-white animate-pulse">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#76515b] mt-1">
              Live updates on quiz submissions, retake approvals, and daily releases.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex bg-[#fff8fa] p-1 rounded-xl text-xs font-semibold border border-[#ebd4d9]">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'all' ? 'bg-[#800020] text-white shadow-2xs font-bold' : 'text-[#76515b] hover:text-[#2b0c15]'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'unread' ? 'bg-[#800020] text-white shadow-2xs font-bold' : 'text-[#76515b] hover:text-[#2b0c15]'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 rounded-xl bg-[#fde8ec] hover:bg-[#fbd0d9] border border-[#ebd4d9] text-[#800020] text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {filteredList.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#ebd4d9] p-12 text-center space-y-3 shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-[#fde8ec] text-[#800020] flex items-center justify-center mx-auto shadow-inner">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#2b0c15]">
            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </h3>
          <p className="text-xs text-[#76515b] max-w-sm mx-auto">
            {filter === 'unread'
              ? 'You are all caught up! When Sanju reviews retake requests or unlocks new days, updates will appear here.'
              : 'As you complete daily quizzes and unlock milestones, your updates and Sanju’s review notes will appear here.'}
          </p>
          <button
            onClick={onGoHome}
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white font-bold text-xs transition-colors shadow-2xs"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredList.map((notif) => {
            const isUnread = !notif.read;
            const isRetake = notif.type === 'retake';
            const isSubmission = notif.type === 'submission';

            return (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isUnread
                    ? 'bg-[#fff5f7] border-[#800020]/40 ring-1 ring-[#800020]/30 shadow-soft'
                    : 'bg-white border-[#ebd4d9] hover:border-[#800020]/40 shadow-soft'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isRetake
                      ? 'bg-amber-100 text-amber-800'
                      : isSubmission
                      ? 'bg-[#fde8ec] text-[#800020]'
                      : 'bg-[#fde8ec] text-[#800020]'
                  }`}>
                    {isRetake ? (
                      <RotateCcw className="w-5 h-5" />
                    ) : isSubmission ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#2b0c15]">
                        {notif.title}
                      </h4>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#800020] shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-[#76515b] leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-[#76515b] pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#800020]" />
                        {new Date(notif.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })} • {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {notif.scoreText && (
                        <span className="font-bold text-[#800020] bg-[#fde8ec] px-2 py-0.5 rounded-md border border-[#ebd4d9]">
                          Score: {notif.scoreText} ({notif.percentage}%)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#ebd4d9]">
                  {notif.quizId && (
                    <button
                      onClick={() => handleAction(notif)}
                      className="px-3.5 py-2 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      {isSubmission ? (
                        <>
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>View Result</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Go to Quiz</span>
                        </>
                      )}
                    </button>
                  )}

                  {isUnread && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-2 rounded-xl text-[#76515b] hover:text-[#800020] hover:bg-[#fde8ec] transition-colors"
                      title="Mark as read"
                      aria-label="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-2 rounded-xl text-[#76515b] hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    title="Delete notification"
                    aria-label="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
