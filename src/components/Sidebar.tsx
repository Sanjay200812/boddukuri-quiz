import React from 'react';
import {
  Home,
  Play,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Inbox,
  Users,
  Calendar,
  FileCheck,
  TrendingUp,
  ShieldCheck,
  GraduationCap,
  X,
  RotateCcw,
  UserCheck,
  FileText,
  BookOpen,
  Crown
} from 'lucide-react';

export type StudentNavView =
  | 'dashboard'
  | 'my-quizzes'
  | 'my-attempts'
  | 'progress'
  | 'study-guide'
  | 'notifications'
  | 'settings'
  | 'logout'
  | 'today-quiz'
  | 'my-results'
  | 'review-mistakes'
  | 'achievements'
  | 'streak'
  | 'help';

export type AdminNavTab =
  | 'overview'
  | 'students'
  | 'mahi-profile'
  | 'attempts'
  | 'retake-requests'
  | 'answer-sheets'
  | 'quiz-management'
  | 'schedule'
  | 'analytics'
  | 'inbox'
  | 'notifications'
  | 'settings'
  | 'help'
  | 'logs';

interface SidebarProps {
  role: 'student' | 'admin';
  isOpen: boolean; // For mobile drawer
  onClose: () => void;
  currentStudentView?: StudentNavView | string;
  currentAdminTab?: AdminNavTab | string;
  onStudentNavigate?: (view: StudentNavView) => void;
  onAdminNavigate?: (tab: AdminNavTab) => void;
  unreadInboxCount?: number;
  unreadNotifsCount?: number;
  pendingRetakesCount?: number;
  userName?: string;
  userEmail?: string | null;
  onSignOut: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  isOpen,
  onClose,
  currentStudentView = 'dashboard',
  currentAdminTab = 'overview',
  onStudentNavigate,
  onAdminNavigate,
  unreadInboxCount = 0,
  unreadNotifsCount = 0,
  pendingRetakesCount = 0,
  userName,
  userEmail,
  onSignOut,
  onOpenSettings,
}) => {
  const isStudent = role === 'student';

  const studentNavItems: Array<{
    id: StudentNavView;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'my-quizzes', label: 'My Quizzes', icon: Play },
    { id: 'my-attempts', label: 'My Attempts', icon: FileText },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'study-guide', label: 'Study Guide', icon: BookOpen },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined
    },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  const adminNavItems: Array<{
    id: AdminNavTab;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'mahi-profile', label: "Mahi's Profile", icon: UserCheck },
    { id: 'attempts', label: 'Quiz Attempts', icon: FileText },
    {
      id: 'retake-requests',
      label: 'Retake Requests',
      icon: RotateCcw,
      badge: pendingRetakesCount > 0 ? pendingRetakesCount : undefined,
      badgeColor: 'bg-amber-500 text-amber-950 font-black'
    },
    { id: 'answer-sheets', label: 'Answer Sheets', icon: FileCheck },
    { id: 'schedule', label: 'Quiz Schedule', icon: Calendar },
    {
      id: 'inbox',
      label: 'Inbox',
      icon: Inbox,
      badge: unreadInboxCount > 0 ? unreadInboxCount : undefined,
      badgeColor: 'bg-[#9e1030] text-white'
    },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id: string) => {
    if (isStudent && onStudentNavigate) {
      if (id === 'settings') {
        onOpenSettings();
      } else if (id === 'logout') {
        onSignOut();
      } else {
        onStudentNavigate(id as StudentNavView);
      }
    } else if (!isStudent && onAdminNavigate) {
      if (id === 'settings') {
        onOpenSettings();
      } else {
        onAdminNavigate(id as AdminNavTab);
      }
    }
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out flex flex-col bg-[#0b0307]/95 backdrop-blur-2xl border-r border-[#260c18] text-[#f2e6eb] shadow-[0_10px_35px_rgba(0,0,0,0.8)] lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header / Brand matching Image 1 & 2 */}
        <div className="p-5 flex items-center justify-between border-b border-[#260c18] bg-[#12050c]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-[#9e1030] to-[#e6194b] text-white shadow-ruby shrink-0">
              {isStudent ? <GraduationCap className="w-5 h-5 text-white" /> : <ShieldCheck className="w-5 h-5 text-white" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white">
                  Boddukuri's
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#2a0b16] text-[#ff8099] border border-[#52142a]">
                  {isStudent ? '#Mahi' : 'Admin'}
                </span>
              </div>
              <p className="text-[11px] font-bold text-[#ff3366]">
                {isStudent ? 'Quiz Portal' : 'Admin Panel'}
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl lg:hidden transition-colors hover:bg-white/[0.06] text-[#a68690] hover:text-white cursor-pointer"
            aria-label="Close Navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-5 py-3 border-b border-[#260c18] text-xs flex items-center justify-between bg-[#14060d]/50">
          <div className="truncate">
            <div className="font-bold text-white truncate">
              {userName || (isStudent ? 'Sanju' : 'Sanjay Boddukuri')}
            </div>
            <div className="text-[11px] text-[#a68690] truncate">
              {userEmail || (isStudent ? 'student@boddukuri.quiz' : 'boddukurisanjay@gmail.com')}
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wide shrink-0 bg-[#2a0b16] text-[#ff8099] border border-[#52142a]">
            {role}
          </span>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto p-3.5 space-y-1">
          {isStudent
            ? studentNavItems.map(item => {
                const Icon = item.icon;
                const isActive =
                  currentStudentView === item.id ||
                  (item.id === 'my-quizzes' && currentStudentView === 'today-quiz') ||
                  (item.id === 'my-attempts' && currentStudentView === 'my-results') ||
                  (item.id === 'study-guide' && currentStudentView === 'study');

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group min-h-[44px] cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby border border-[#ff3366]/40'
                        : item.id === 'logout'
                        ? 'text-rose-400 hover:bg-[#2b0c18] hover:text-rose-300'
                        : 'text-[#a68690] hover:text-white hover:bg-[#1a0610]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive
                            ? 'text-white'
                            : item.id === 'logout'
                            ? 'text-rose-400'
                            : 'text-[#ff3366] group-hover:text-[#ff8099]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isActive
                            ? 'bg-white text-[#800020]'
                            : 'bg-[#ff3366] text-white shadow-ruby'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })
            : adminNavItems.map(item => {
                const Icon = item.icon;
                const isActive = currentAdminTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group min-h-[44px] cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby border border-[#ff3366]/40'
                        : 'text-[#a68690] hover:text-white hover:bg-[#1a0610]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-[#ff3366] group-hover:text-[#ff8099]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          item.badgeColor ||
                          (isActive ? 'bg-white text-[#800020]' : 'bg-[#ff3366] text-white shadow-ruby')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
        </nav>

        {/* Sidebar Footer */}
        {!isStudent ? (
          <div className="p-3 border-t border-[#260c18] space-y-2 bg-[#12050c]/60">
            {/* Admin Access Card Matching Image 2 Mockup */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1f0613] to-[#12040b] border border-[#ff3366]/20 shadow-md flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#9e1030] to-[#e6194b] flex items-center justify-center text-white shrink-0 shadow-ruby">
                <Crown className="w-5 h-5 text-amber-300" />
              </div>
              <div className="truncate">
                <div className="text-xs font-black text-white">Admin Access</div>
                <div className="text-[10px] text-[#a68690] truncate leading-tight">
                  Manage quizzes, users and platform settings.
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors min-h-[40px] text-[#a68690] hover:text-white hover:bg-[#1a0610] cursor-pointer"
            >
              <Settings className="w-4 h-4 text-[#ff3366]" />
              <span>Settings</span>
            </button>

            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors min-h-[40px] text-rose-400 hover:bg-[#2b0c18] hover:text-rose-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="p-3 border-t border-[#260c18] space-y-1 bg-[#12050c]/60">
            <button
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors min-h-[40px] text-[#a68690] hover:text-white hover:bg-[#1a0610] cursor-pointer"
            >
              <Settings className="w-4 h-4 text-[#ff3366]" />
              <span>Settings</span>
            </button>
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors min-h-[40px] text-rose-400 hover:bg-[#2b0c18] hover:text-rose-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
