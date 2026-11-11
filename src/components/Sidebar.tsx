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
          className="fixed inset-0 bg-[#090306]/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container (Obsidian & Luxury Ruby Theme matching Image 2 & 3 mockups) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out flex flex-col bg-[#0c0407]/95 backdrop-blur-xl border-r border-[#260c18] text-[#e8d5db] shadow-[0_10px_35px_rgba(0,0,0,0.7)] lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="p-5 flex items-center justify-between border-b border-[#260c18] bg-[#10050b]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-[#9e1030] to-[#e6194b] text-white shadow-[0_0_18px_rgba(230,25,75,0.4)] shrink-0">
              {isStudent ? <GraduationCap className="w-5 h-5 text-white" /> : <ShieldCheck className="w-5 h-5 text-white" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-white">
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
            className="p-1.5 rounded-xl lg:hidden transition-colors hover:bg-[#200712] text-[#a68690] hover:text-white"
            aria-label="Close Navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-5 py-3.5 border-b border-[#260c18] text-xs flex items-center justify-between bg-[#0e0409]">
          <div className="truncate">
            <div className="font-bold text-white truncate">
              {userName || (isStudent ? 'Mahi' : 'Sanju')}
            </div>
            <div className="text-[11px] text-[#a68690] truncate">
              {userEmail || (isStudent ? 'mahi@boddukuri.quiz' : 'boddukurisanjay@gmail.com')}
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md font-extrabold text-[10px] uppercase tracking-wide shrink-0 bg-[#2b0c18] text-[#ff8099] border border-[#4a1226]">
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
                        ? 'bg-gradient-to-r from-[#9e1030] via-[#850b26] to-[#6b061d] text-white shadow-[0_4px_20px_rgba(158,16,48,0.45)] border border-[#ff3366]/40'
                        : item.id === 'logout'
                        ? 'text-rose-400 hover:bg-[#260a14] hover:text-rose-300'
                        : 'text-[#b395a0] hover:text-white hover:bg-[#1a0610]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : item.id === 'logout' ? 'text-rose-400' : 'text-[#a68690] group-hover:text-white'
                      }`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isActive
                          ? 'bg-white text-[#800020]'
                          : 'bg-[#e6194b] text-white shadow-[0_0_10px_rgba(230,25,75,0.5)]'
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
                        ? 'bg-gradient-to-r from-[#9e1030] via-[#850b26] to-[#6b061d] text-white shadow-[0_4px_20px_rgba(158,16,48,0.45)] border border-[#ff3366]/40'
                        : 'text-[#b395a0] hover:text-white hover:bg-[#1a0610]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-[#a68690] group-hover:text-white'
                      }`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        item.badgeColor || (isActive ? 'bg-white text-[#800020]' : 'bg-[#e6194b] text-white shadow-[0_0_10px_rgba(230,25,75,0.5)]')
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
        </nav>

        {/* Sidebar Footer */}
        {!isStudent ? (
          <div className="p-3 border-t border-[#260c18] space-y-2 bg-[#10050b]/60">
            {/* Crown Admin Access Card matching Image 3 */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1c0610] to-[#12030a] border border-[#3d0f21] shadow-lg flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#9e1030] to-[#e6194b] flex items-center justify-center text-white shrink-0 shadow-md">
                <Crown className="w-4 h-4 text-amber-300" />
              </div>
              <div className="truncate">
                <div className="text-xs font-black text-white">Admin Access</div>
                <div className="text-[10px] text-[#b38895] truncate">Manage quizzes & settings</div>
              </div>
            </div>

            <button
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors min-h-[40px] text-[#b395a0] hover:text-white hover:bg-[#1a0610]"
            >
              <Settings className="w-4 h-4 text-[#a68690]" />
              <span>Settings</span>
            </button>

            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors min-h-[40px] text-rose-400 hover:bg-[#260a14] hover:text-rose-300"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="p-3 border-t border-[#260c18] space-y-1 bg-[#10050b]/60">
            <button
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors min-h-[40px] text-[#b395a0] hover:text-white hover:bg-[#1a0610]"
            >
              <Settings className="w-4 h-4 text-[#a68690]" />
              <span>Settings</span>
            </button>
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors min-h-[40px] text-rose-400 hover:bg-[#260a14] hover:text-rose-300"
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
