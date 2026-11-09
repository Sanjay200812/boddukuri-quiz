import React from 'react';
import { 
  Home, 
  Play, 
  BarChart3, 
  Award, 
  Flame, 
  Bell, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Inbox, 
  Users, 
  Calendar, 
  FileCheck, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  X,
  RotateCcw,
  UserCheck,
  FileText
} from 'lucide-react';

export type StudentNavView = 
  | 'dashboard'
  | 'today-quiz'
  | 'progress'
  | 'my-results'
  | 'review-mistakes'
  | 'achievements'
  | 'streak'
  | 'notifications'
  | 'settings'
  | 'help';

export type AdminNavTab = 
  | 'overview'
  | 'students'
  | 'mahi-profile'
  | 'attempts'
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
  streakDays?: number;
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
  streakDays = 0,
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
    { id: 'today-quiz', label: "Today's Quiz", icon: Play },
    { id: 'progress', label: 'Learning History', icon: BarChart3 },
    { id: 'my-results', label: 'My Results', icon: FileCheck },
    { id: 'review-mistakes', label: 'Review Mistakes', icon: RotateCcw },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { 
      id: 'streak', 
      label: 'Learning Streak', 
      icon: Flame, 
      badge: streakDays > 0 ? `${streakDays}d` : undefined 
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell, 
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined 
    },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help / About', icon: HelpCircle },
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
    { id: 'answer-sheets', label: 'Answer Sheets', icon: FileCheck },
    { id: 'schedule', label: 'Quiz Schedule', icon: Calendar },
    { 
      id: 'inbox', 
      label: 'Inbox', 
      icon: Inbox, 
      badge: unreadInboxCount > 0 ? unreadInboxCount : undefined,
      badgeColor: 'bg-emerald-500 text-white' 
    },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id: string) => {
    if (isStudent && onStudentNavigate) {
      if (id === 'settings') {
        onOpenSettings();
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
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out flex flex-col ${
          isStudent 
            ? 'bg-white border-r border-emerald-100 text-slate-800 shadow-xl lg:shadow-none' 
            : 'bg-slate-950 border-r border-slate-800 text-slate-200 shadow-2xl lg:shadow-none'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className={`p-5 flex items-center justify-between border-b ${
          isStudent ? 'border-emerald-100/80 bg-emerald-50/40' : 'border-slate-800 bg-slate-900/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
              isStudent 
                ? 'bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white shadow-emerald-800/20' 
                : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-900/40'
            }`}>
              {isStudent ? <Sparkles className="w-5 h-5 text-emerald-200" /> : <ShieldCheck className="w-5 h-5 text-white" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-black tracking-tight ${isStudent ? 'text-slate-900' : 'text-white'}`}>
                  Boddukuri's Quiz
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isStudent ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {isStudent ? '#Mahi' : 'Admin'}
                </span>
              </div>
              <p className={`text-[11px] font-medium ${isStudent ? 'text-slate-500' : 'text-slate-400'}`}>
                {isStudent ? 'Learn. Revise. Achieve.' : 'Control & Inspection Center'}
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-xl lg:hidden transition-colors ${
              isStudent ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
            }`}
            aria-label="Close Navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className={`px-5 py-3.5 border-b text-xs flex items-center justify-between ${
          isStudent ? 'border-slate-100 bg-slate-50/50' : 'border-slate-800/80 bg-slate-900/30'
        }`}>
          <div className="truncate">
            <div className={`font-bold truncate ${isStudent ? 'text-slate-900' : 'text-slate-100'}`}>
              {userName || (isStudent ? 'Mahi' : 'Sanju')}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {userEmail || (isStudent ? 'mahi@boddukuri.quiz' : 'boddukurisanjay@gmail.com')}
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wide shrink-0 ${
            isStudent ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-500/20 text-teal-300'
          }`}>
            {role}
          </span>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto p-3.5 space-y-1">
          {isStudent
            ? studentNavItems.map(item => {
                const Icon = item.icon;
                const isActive = currentStudentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group ${
                      isActive 
                        ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20' 
                        : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-700'
                      }`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isActive 
                          ? 'bg-emerald-900/80 text-white' 
                          : 'bg-emerald-100 text-emerald-800'
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
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left group ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                      }`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        item.badgeColor || (isActive ? 'bg-slate-900 text-white' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30')
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
        </nav>

        {/* Sidebar Footer: Settings & Sign Out */}
        <div className={`p-4 border-t space-y-2 ${
          isStudent ? 'border-emerald-100/80 bg-slate-50/40' : 'border-slate-800 bg-slate-900/40'
        }`}>
          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
              isStudent 
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm(`Sign out of ${isStudent ? 'Mahi’s student' : 'Admin'} session?`)) {
                onSignOut();
              }
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
              isStudent 
                ? 'text-rose-600 hover:bg-rose-50' 
                : 'text-rose-400 hover:bg-rose-950/40'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
