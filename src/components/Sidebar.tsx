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
  BookOpen
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
      badgeColor: 'bg-[#800020] text-white'
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
          className="fixed inset-0 bg-[#2b0c15]/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out flex flex-col ${
          isStudent
            ? 'bg-white border-r border-[#ebd4d9] text-[#2b0c15] shadow-xl lg:shadow-none'
            : 'bg-slate-950 border-r border-slate-800 text-slate-200 shadow-2xl lg:shadow-none'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className={`p-5 flex items-center justify-between border-b ${
          isStudent ? 'border-[#ebd4d9] bg-[#fff8fa]' : 'border-slate-800 bg-slate-900/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
              isStudent
                ? 'bg-[#800020] text-white shadow-[#800020]/20'
                : 'bg-gradient-to-tr from-red-800 to-red-600 text-white shadow-red-950/40'
            }`}>
              {isStudent ? <GraduationCap className="w-5 h-5 text-white" /> : <ShieldCheck className="w-5 h-5 text-white" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-black tracking-tight ${isStudent ? 'text-[#2b0c15]' : 'text-white'}`}>
                  Boddukuri's
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isStudent ? 'bg-[#fde8ec] text-[#800020] border border-[#ebd4d9]' : 'bg-red-700/20 text-red-400 border border-red-700/30'
                }`}>
                  {isStudent ? '#Mahi' : 'Admin'}
                </span>
              </div>
              <p className={`text-[11px] font-semibold ${isStudent ? 'text-[#800020]' : 'text-slate-400'}`}>
                Quiz Portal
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl lg:hidden transition-colors ${
              isStudent ? 'hover:bg-[#fde8ec] text-[#76515b]' : 'hover:bg-slate-800 text-slate-400'
            }`}
            aria-label="Close Navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className={`px-5 py-3.5 border-b text-xs flex items-center justify-between ${
          isStudent ? 'border-[#f3e3e6] bg-[#fffafb]' : 'border-slate-800/80 bg-slate-900/30'
        }`}>
          <div className="truncate">
            <div className={`font-bold truncate ${isStudent ? 'text-[#2b0c15]' : 'text-slate-100'}`}>
              {userName || (isStudent ? 'Mahi' : 'Sanju')}
            </div>
            <div className={`text-[11px] truncate ${isStudent ? 'text-[#76515b]' : 'text-slate-400'}`}>
              {userEmail || (isStudent ? 'mahi@boddukuri.quiz' : 'boddukurisanjay@gmail.com')}
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wide shrink-0 ${
            isStudent ? 'bg-[#fde8ec] text-[#800020] border border-[#ebd4d9]' : 'bg-red-600/20 text-red-400'
          }`}>
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
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group min-h-[44px] ${
                      isActive
                        ? 'bg-[#800020] text-white shadow-sm shadow-[#800020]/20'
                        : item.id === 'logout'
                        ? 'text-rose-700 hover:bg-rose-50 hover:text-rose-900'
                        : 'text-[#4a1824] hover:text-[#800020] hover:bg-[#fde8ec]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : item.id === 'logout' ? 'text-rose-600' : 'text-[#76515b] group-hover:text-[#800020]'
                      }`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isActive
                          ? 'bg-white text-[#800020]'
                          : 'bg-[#800020] text-white'
                      }`}>
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
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group min-h-[44px] ${
                      isActive
                        ? 'bg-[#800020] text-white shadow-md shadow-red-950/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-red-400'
                      }`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        item.badgeColor || (isActive ? 'bg-slate-900 text-white' : 'bg-red-700/20 text-red-400 border border-red-700/30')
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
        </nav>

        {/* Sidebar Footer: Settings & Sign Out (Admin only, as student has Settings & Logout in navigation items) */}
        {!isStudent && (
          <div className="p-4 border-t space-y-1.5 border-slate-800 bg-slate-900/40">
            <button
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors min-h-[44px] text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>

            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors min-h-[44px] text-rose-400 hover:bg-rose-950/40"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
