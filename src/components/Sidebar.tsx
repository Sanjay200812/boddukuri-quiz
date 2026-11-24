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
  FileCheck,
  TrendingUp,
  ShieldCheck,
  GraduationCap,
  X,
  RotateCcw,
  FileText,
  BookOpen,
  Crown,
  UploadCloud,
  Layers,
  Zap,
  XCircle,
  Bookmark,
  Sparkles
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
  | 'help'
  | 'mistake-notebook'
  | 'smart-revision'
  | 'mock-exam'
  | 'weak-areas'
  | 'study-planner'
  | 'bookmarks'
  | 'current-affairs'
  | 'flashcards'
  | 'support';

export type AdminNavTab =
  | 'overview'
  | 'students'
  | 'mahi-profile'
  | 'attempts'
  | 'retake-requests'
  | 'answer-sheets'
  | 'quiz-management'
  | 'schedule'
  | 'pdf-studio'
  | 'analytics'
  | 'inbox'
  | 'notifications'
  | 'settings'
  | 'help'
  | 'logs'
  | 'platform-settings'
  | 'import-export';

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
    { id: 'dashboard', label: 'Learning Dashboard', icon: Home },
    { id: 'my-quizzes', label: 'My Quizzes', icon: Play },
    { id: 'mistake-notebook', label: 'Mistake Notebook', icon: XCircle },
    { id: 'smart-revision', label: 'Smart Revision', icon: RotateCcw },
    { id: 'mock-exam', label: 'Mock Exam Mode', icon: Zap },
    { id: 'weak-areas', label: 'Weak Area Analysis', icon: TrendingUp },
    { id: 'flashcards', label: 'Rapid Flashcards', icon: Sparkles },
    { id: 'current-affairs', label: 'Current Affairs', icon: Layers },
    { id: 'bookmarks', label: 'Bookmarks & Notes', icon: Bookmark },
    { id: 'my-attempts', label: 'My Attempts', icon: FileText },
    { id: 'progress', label: 'Roadmap Progress', icon: BarChart3 },
    { id: 'study-guide', label: 'National Parks Guide', icon: BookOpen },
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
    { id: 'students', label: 'Students (Mahi & Shailu)', icon: Users },
    { id: 'schedule', label: 'Topics & Championship', icon: Layers },
    { id: 'pdf-studio', label: 'PDF Question Studio', icon: UploadCloud },
    { id: 'attempts', label: 'Quiz Attempts', icon: FileText },
    {
      id: 'retake-requests',
      label: 'Retake Requests',
      icon: RotateCcw,
      badge: pendingRetakesCount > 0 ? pendingRetakesCount : undefined,
      badgeColor: 'bg-amber-500 text-amber-950 font-black'
    },
    { id: 'answer-sheets', label: 'Answer Sheets', icon: FileCheck },
    { id: 'analytics', label: 'Analytics Centre', icon: TrendingUp },
    { id: 'platform-settings', label: 'Platform Settings', icon: Settings },
    { id: 'import-export', label: 'Import & Export', icon: UploadCloud },
    {
      id: 'inbox',
      label: 'Inbox',
      icon: Inbox,
      badge: unreadInboxCount > 0 ? unreadInboxCount : undefined,
      badgeColor: 'bg-[#9e1030] text-white'
    },
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out flex flex-col bg-white border-r border-slate-200 text-slate-800 shadow-elevated lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="p-5 flex items-center justify-between border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1e3a5f] text-white shadow-soft shrink-0">
              {isStudent ? <GraduationCap className="w-5 h-5 text-white" /> : <ShieldCheck className="w-5 h-5 text-white" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-base font-bold tracking-tight text-slate-900">
                  Spideyy
                </span>
                <span className="font-serif text-base font-bold tracking-tight text-[#800020]">
                  Quiz
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 text-slate-700 border border-slate-300/60">
                  {isStudent ? 'Portal' : 'Admin'}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                {isStudent ? 'GK & Examination Platform' : 'Central Admin Console'}
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg lg:hidden transition-colors hover:bg-slate-200/70 text-slate-500 hover:text-slate-900 cursor-pointer"
            aria-label="Close Navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-5 py-3 border-b border-slate-200 text-xs flex items-center justify-between bg-white">
          <div className="truncate">
            <div className="font-bold text-slate-900 truncate">
              {userName || (isStudent ? 'Sanju' : 'Sanjay Boddukuri')}
            </div>
            <div className="text-[11px] text-slate-500 truncate">
              {userEmail || (isStudent ? 'student@boddukuri.quiz' : 'boddukurisanjay@gmail.com')}
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wide shrink-0 bg-slate-100 text-slate-700 border border-slate-200">
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
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left group min-h-[44px] cursor-pointer ${
                      isActive
                        ? 'bg-[#1e3a5f] text-white shadow-soft'
                        : item.id === 'logout'
                        ? 'text-rose-700 hover:bg-rose-50 hover:text-rose-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-white'
                            : item.id === 'logout'
                            ? 'text-rose-600'
                            : 'text-slate-400 group-hover:text-[#1e3a5f]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-white text-[#1e3a5f]'
                            : 'bg-[#800020] text-white'
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
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left group min-h-[44px] cursor-pointer ${
                      isActive
                        ? 'bg-[#1e3a5f] text-white shadow-soft'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#1e3a5f]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.badgeColor ||
                          (isActive ? 'bg-white text-[#1e3a5f]' : 'bg-[#800020] text-white')
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
          <div className="p-3 border-t border-slate-200 space-y-2 bg-slate-50/70">
            {/* Admin Access Card */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-soft flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1e3a5f] flex items-center justify-center text-white shrink-0">
                <Crown className="w-4 h-4 text-amber-300" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900">Admin Access</div>
                <div className="text-[10px] text-slate-500 truncate leading-tight">
                  Manage quizzes, users & settings
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors min-h-[40px] text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Settings</span>
            </button>

            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors min-h-[40px] text-rose-700 hover:bg-rose-50 hover:text-rose-800 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="p-3 border-t border-slate-200 space-y-1 bg-slate-50/70">
            <button
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors min-h-[40px] text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Settings</span>
            </button>
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors min-h-[40px] text-rose-700 hover:bg-rose-50 hover:text-rose-800 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
