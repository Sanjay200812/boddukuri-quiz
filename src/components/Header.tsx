import React from 'react';
import {
  Flame,
  BookOpen,
  BarChart3,
  Settings as SettingsIcon,
  Home,
  Award,
  LogOut,
  Menu,
  Bell,
  Search,
  Play,
  FileText,
  GraduationCap
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
  onOpenBadges,
  onToggleSidebar,
  unreadNotifsCount = 0,
  onOpenNotifications,
  streakDays,
  unlockedBadgesCount = 0,
  completedQuizzesCount: _completedQuizzesCount,
  totalQuizzesCount: _totalQuizzesCount,
  syncStatus: _syncStatus = 'synced',
  userEmail: _userEmail,
  userName = 'Mahi',
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0c0407]/90 backdrop-blur-xl border-b border-[#260c18] text-[#e8d5db] transition-all shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">

          {/* Left: Sidebar Toggle (Mobile) & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-[#a68690] hover:text-white hover:bg-[#1a0610] transition-colors lg:hidden"
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
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#9e1030] to-[#e6194b] flex items-center justify-center text-white shadow-[0_0_18px_rgba(230,25,75,0.4)] group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-[#ff8099] transition-colors">
                    Boddukuri's
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-[#2b0c18] text-[#ff8099] border border-[#4a1226]">
                    #Mahi
                  </span>
                </div>
                <p className="text-[11px] font-bold text-[#ff3366] hidden sm:block">
                  Quiz Portal
                </p>
              </div>
            </div>
          </div>

          {/* Center Search Bar (Reference Mockup) */}
          <div className="hidden xl:flex flex-1 max-w-sm mx-4">
            <label className="flex items-center gap-2.5 w-full rounded-2xl px-3.5 py-2 border border-[#2b0c18] bg-[#14060d] text-white shadow-inner focus-within:border-[#e6194b]/60 focus-within:bg-[#190710] transition-all">
              <Search className="w-4 h-4 text-[#ff3366]" />
              <input
                aria-label="Search quizzes, topics"
                placeholder="Search quizzes, topics..."
                className="w-full bg-transparent outline-none text-xs text-white placeholder:text-[#7a5b67]"
              />
            </label>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#14060d] p-1 rounded-xl border border-[#260c18]">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'dashboard'
                  ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby border border-[#c41c43]/40'
                  : 'text-[#b395a0] hover:text-white hover:bg-[#1a0610]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Dashboard
            </button>

            <button
              onClick={() => onNavigate('my-quizzes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'my-quizzes' || currentView === 'quiz'
                  ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby border border-[#c41c43]/40'
                  : 'text-[#b395a0] hover:text-white hover:bg-[#1a0610]'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              My Quizzes
            </button>

            <button
              onClick={() => onNavigate('my-attempts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'my-attempts' || currentView === 'result' || currentView === 'review'
                  ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby border border-[#c41c43]/40'
                  : 'text-[#b395a0] hover:text-white hover:bg-[#1a0610]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              My Attempts
            </button>

            <button
              onClick={() => onNavigate('progress')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'progress'
                  ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby border border-[#c41c43]/40'
                  : 'text-[#b395a0] hover:text-white hover:bg-[#1a0610]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Progress
            </button>

            <button
              onClick={() => onNavigate('study')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'study'
                  ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby border border-[#c41c43]/40'
                  : 'text-[#b395a0] hover:text-white hover:bg-[#1a0610]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Study Guide
            </button>
          </nav>

          {/* Right: Badges, Notifications & Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Streak Counter */}
            <div
              title={`${streakDays} days consecutive learning streak!`}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                streakDays > 0
                  ? 'bg-[#220713] text-[#ff8099] border-[#470f25] shadow-[0_0_12px_rgba(255,128,153,0.2)]'
                  : 'bg-[#14060d] text-[#7a5b67] border-[#2b0c18]'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${streakDays > 0 ? 'text-[#ff3366] fill-[#ff3366] animate-pulse' : 'text-[#7a5b67]'}`} />
              <span>{streakDays} <span className="hidden sm:inline">{streakDays === 1 ? 'Day' : 'Days'}</span></span>
            </div>

            {/* Badges Trophy Trigger */}
            {onOpenBadges && (
              <button
                onClick={onOpenBadges}
                title={`${unlockedBadgesCount} Badges Unlocked! Click to open Trophy Cabinet`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2b0c18] bg-[#14060d] hover:bg-[#1f0913] text-[#f497aa] text-xs font-bold transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-[#ff8099]" />
                <span className="hidden lg:inline">{unlockedBadgesCount} Badges</span>
              </button>
            )}

            {/* Notifications Bell */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                title="Notifications"
                className="relative p-2 rounded-xl text-[#b395a0] hover:text-white hover:bg-[#1f0913] border border-[#2b0c18] bg-[#14060d] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#e6194b] text-white font-black text-[10px] flex items-center justify-center shadow-[0_0_8px_rgba(230,25,75,0.7)] animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>
            )}

            {/* Settings Icon */}
            <button
              onClick={onOpenSettings}
              title="Settings & Account"
              className="p-2 rounded-xl text-[#b395a0] hover:text-white hover:bg-[#1f0913] border border-[#2b0c18] bg-[#14060d] transition-colors"
              aria-label="Settings"
            >
              <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* User Profile Pill */}
            <div className="hidden sm:flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9e1030] to-[#e6194b] text-white font-black text-xs flex items-center justify-center shadow-[0_0_10px_rgba(230,25,75,0.4)]">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left text-xs">
                <div className="font-bold text-white leading-tight">{userName}</div>
                <div className="text-[10px] text-[#a68690] leading-tight">Student</div>
              </div>
            </div>

            {/* Sign Out (Desktop) */}
            {onSignOut && (
              <button
                onClick={onSignOut}
                title="Sign out"
                className="hidden xl:flex items-center justify-center p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-[#250813] border border-[#2b0c18] transition-colors"
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
