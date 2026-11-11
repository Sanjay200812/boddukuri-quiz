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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#ebd4d9] shadow-soft transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">

          {/* Left: Sidebar Toggle (Mobile) & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-[#76515b] hover:text-[#800020] hover:bg-[#fde8ec] transition-colors lg:hidden"
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
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#800020] flex items-center justify-center text-white shadow-md shadow-[#800020]/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black tracking-tight text-[#2b0c15] group-hover:text-[#800020] transition-colors">
                    Boddukuri's
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-[#fde8ec] text-[#800020] border border-[#ebd4d9]">
                    #Mahi
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-[#76515b] hidden sm:block">
                  Quiz Portal
                </p>
              </div>
            </div>
          </div>

          {/* Center Search Bar (Reference Mockup) */}
          <div className="hidden xl:flex flex-1 max-w-sm mx-4">
            <label className="flex items-center gap-2.5 w-full rounded-2xl px-3.5 py-2 border border-[#ebd4d9] bg-[#fffafb] shadow-2xs focus-within:border-[#800020] focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-[#800020]" />
              <input
                aria-label="Search quizzes, topics"
                placeholder="Search quizzes, topics..."
                className="w-full bg-transparent outline-none text-xs text-[#2b0c15] placeholder:text-[#76515b]"
              />
            </label>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#fff8fa] p-1 rounded-xl border border-[#ebd4d9]">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'dashboard'
                  ? 'bg-[#800020] text-white shadow-sm'
                  : 'text-[#4a1824] hover:text-[#800020] hover:bg-[#fde8ec]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Dashboard
            </button>

            <button
              onClick={() => onNavigate('my-quizzes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'my-quizzes' || currentView === 'quiz'
                  ? 'bg-[#800020] text-white shadow-sm'
                  : 'text-[#4a1824] hover:text-[#800020] hover:bg-[#fde8ec]'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              My Quizzes
            </button>

            <button
              onClick={() => onNavigate('my-attempts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'my-attempts' || currentView === 'result' || currentView === 'review'
                  ? 'bg-[#800020] text-white shadow-sm'
                  : 'text-[#4a1824] hover:text-[#800020] hover:bg-[#fde8ec]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              My Attempts
            </button>

            <button
              onClick={() => onNavigate('progress')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'progress'
                  ? 'bg-[#800020] text-white shadow-sm'
                  : 'text-[#4a1824] hover:text-[#800020] hover:bg-[#fde8ec]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Progress
            </button>

            <button
              onClick={() => onNavigate('study')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'study'
                  ? 'bg-[#800020] text-white shadow-sm'
                  : 'text-[#4a1824] hover:text-[#800020] hover:bg-[#fde8ec]'
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
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold shadow-2xs transition-all ${
                streakDays > 0
                  ? 'bg-[#fde8ec] text-[#800020] border-[#ebd4d9]'
                  : 'bg-stone-50 text-[#76515b] border-stone-200'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${streakDays > 0 ? 'text-[#800020] fill-[#800020] animate-pulse' : 'text-[#76515b]'}`} />
              <span>{streakDays} <span className="hidden sm:inline">{streakDays === 1 ? 'Day' : 'Days'}</span></span>
            </div>

            {/* Badges Trophy Trigger */}
            {onOpenBadges && (
              <button
                onClick={onOpenBadges}
                title={`${unlockedBadgesCount} Badges Unlocked! Click to open Trophy Cabinet`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ebd4d9] bg-white hover:bg-[#fde8ec] text-[#800020] text-xs font-bold shadow-2xs transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-[#800020]" />
                <span className="hidden lg:inline">{unlockedBadgesCount} Badges</span>
              </button>
            )}

            {/* Notifications Bell */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                title="Notifications"
                className="relative p-2 rounded-xl text-[#76515b] hover:text-[#800020] hover:bg-[#fde8ec] border border-[#ebd4d9] bg-white transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#800020] text-white font-black text-[10px] flex items-center justify-center animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>
            )}

            {/* Settings Icon */}
            <button
              onClick={onOpenSettings}
              title="Settings & Account"
              className="p-2 rounded-xl text-[#76515b] hover:text-[#800020] hover:bg-[#fde8ec] border border-[#ebd4d9] bg-white transition-colors"
              aria-label="Settings"
            >
              <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* User Profile Pill */}
            <div className="hidden sm:flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-[#800020] text-white font-black text-xs flex items-center justify-center shadow-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left text-xs">
                <div className="font-bold text-[#2b0c15] leading-tight">{userName}</div>
                <div className="text-[10px] text-[#76515b] leading-tight">Student</div>
              </div>
            </div>

            {/* Sign Out (Desktop) */}
            {onSignOut && (
              <button
                onClick={onSignOut}
                title="Sign out"
                className="hidden xl:flex items-center justify-center p-2 rounded-xl text-[#76515b] hover:text-rose-700 hover:bg-rose-50 border border-[#ebd4d9] transition-colors"
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
