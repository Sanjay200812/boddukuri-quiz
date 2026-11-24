import React from 'react';
import {
  Flame,
  BookOpen,
  BarChart3,
  Home,
  LogOut,
  Menu,
  Bell,
  Search,
  Play,
  FileText,
  GraduationCap,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentView: 'dashboard' | 'my-quizzes' | 'my-attempts' | 'progress' | 'study' | 'quiz' | 'result' | 'review' | 'notifications' | string;
  onNavigate: (view: any) => void;
  onOpenSettings: () => void;
  onOpenBadges?: () => void;
  onToggleSidebar?: () => void;
  unreadNotifsCount?: number;
  onOpenNotifications?: () => void;
  streakDays: number;
  unlockedBadgesCount?: number;
  completedQuizzesCount?: number;
  totalQuizzesCount?: number;
  syncStatus?: 'synced' | 'offline' | 'pending';
  userEmail?: string | null;
  userName?: string;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenSettings,
  onOpenBadges: _onOpenBadges,
  onToggleSidebar,
  unreadNotifsCount = 0,
  onOpenNotifications,
  streakDays,
  unlockedBadgesCount: _unlockedBadgesCount = 0,
  completedQuizzesCount: _completedQuizzesCount,
  totalQuizzesCount: _totalQuizzesCount,
  syncStatus: _syncStatus = 'synced',
  userEmail: _userEmail,
  userName = 'Sanju',
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 transition-all shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          {/* Left: Sidebar Toggle (Mobile) & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors lg:hidden cursor-pointer border border-slate-200"
                aria-label="Toggle navigation menu"
                title="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center text-white shadow-soft group-hover:bg-[#102a43] transition-colors shrink-0">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                    Spideyy
                  </span>
                  <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#800020]">
                    Quiz
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                    GK Portal
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                  Academic Assessment Workspace
                </p>
              </div>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <label className="flex items-center gap-2.5 w-full rounded-xl px-3.5 py-2 border border-slate-200 bg-slate-50 text-slate-900 focus-within:border-[#1e3a5f] focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                aria-label="Search quizzes, topics"
                placeholder="Search quizzes, topics..."
                className="w-full bg-transparent outline-none text-xs text-slate-900 placeholder:text-slate-400"
              />
            </label>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home, match: ['dashboard'] },
              { id: 'my-quizzes', label: 'Quizzes', icon: Play, match: ['my-quizzes', 'quiz'] },
              { id: 'my-attempts', label: 'My Attempts', icon: FileText, match: ['my-attempts', 'result', 'review'] },
              { id: 'progress', label: 'Progress', icon: BarChart3, match: ['progress'] },
              { id: 'study', label: 'Study Guide', icon: BookOpen, match: ['study'] }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = tab.match.includes(currentView);
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigate(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1e3a5f] text-white shadow-soft'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Streak, Notification Bell & User Avatar Pill */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Streak Counter */}
            <div
              title={`${streakDays} days consecutive learning streak!`}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                streakDays > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              <Flame
                className={`w-3.5 h-3.5 ${
                  streakDays > 0 ? 'text-amber-600 fill-amber-500' : 'text-slate-400'
                }`}
              />
              <span>
                {streakDays} <span className="hidden sm:inline">{streakDays === 1 ? 'Day' : 'Days'}</span>
              </span>
            </div>

            {/* Notifications Bell */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                title="Notifications"
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 bg-white transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#800020] text-white font-bold text-[10px] flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile Pill */}
            <div
              onClick={onOpenSettings}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-semibold text-slate-900 leading-tight flex items-center gap-1">
                  <span>{userName}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">Student</div>
              </div>
            </div>

            {/* Sign Out (Desktop) */}
            {onSignOut && (
              <button
                onClick={onSignOut}
                title="Sign out"
                className="hidden xl:flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-[#800020] hover:bg-rose-50 border border-slate-200 bg-white transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
