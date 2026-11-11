import React from 'react';
import {
  Sparkles,
  Flame,
  BookOpen,
  BarChart3,
  Settings as SettingsIcon,
  Home,
  Award,
  LogOut,
  Menu,
  Bell,
  Search
} from 'lucide-react';

interface HeaderProps {
  currentView: 'dashboard' | 'progress' | 'study' | 'quiz' | 'result' | 'review' | string;
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
  syncStatus = 'synced',
  userEmail,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0f0f12]/95 backdrop-blur-md border-b border-red-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Left: Sidebar Toggle & Brand */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-slate-700 hover:text-red-900 hover:bg-red-50 transition-colors"
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
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-900 to-red-800 flex items-center justify-center text-white shadow-md shadow-red-900/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-red-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-red-900 transition-colors">
                    Boddukuri's Quiz
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-900 tracking-wide border border-red-300/60">
                    #Mahi
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Learn. Revise. Remember. Achieve.
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <label className="reference-search flex items-center gap-2 w-full rounded-2xl px-4 py-2.5 border border-red-100 bg-white shadow-sm">
              <Search className="w-4 h-4 text-red-900/70" />
              <input
                aria-label="Search quizzes and topics"
                placeholder="Search quizzes, topics..."
                className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
              />
            </label>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#241014]/80 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentView === 'dashboard'
                  ? 'bg-[#0f0f12] text-red-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#2b1118]/60'
              }`}
            >
              <Home className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('progress')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentView === 'progress'
                  ? 'bg-[#0f0f12] text-red-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#2b1118]/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Progress & History
            </button>
            <button
              onClick={() => onNavigate('study')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentView === 'study'
                  ? 'bg-[#0f0f12] text-red-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#2b1118]/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Study Guide
            </button>
          </nav>

          {/* Right: Badges, Notifications & Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Streak Counter */}
            <div
              title={`${streakDays} days consecutive learning streak!`}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold shadow-sm transition-all ${
                streakDays > 0
                  ? 'bg-amber-50 text-amber-900 border-amber-200 shadow-amber-500/5'
                  : 'bg-[#241014] text-slate-500 border-slate-200'
              }`}
            >
              <Flame className={`w-4 h-4 ${streakDays > 0 ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-400'}`} />
              <span>{streakDays} <span className="hidden sm:inline">{streakDays === 1 ? 'Day' : 'Days'}</span></span>
            </div>

            {/* Badges Trophy Trigger */}
            {onOpenBadges && (
              <button
                onClick={onOpenBadges}
                title={`${unlockedBadgesCount} Badges Unlocked! Click to open Trophy Cabinet`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold shadow-xs transition-colors"
              >
                <Award className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">{unlockedBadgesCount} Badges</span>
              </button>
            )}

            {/* Notifications Trigger */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                title="Notifications"
                className="relative p-2 rounded-xl text-slate-600 hover:text-red-900 hover:bg-red-50 border border-slate-200 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>
            )}

            {/* Cloud Sync Status Indicator */}
            <div
              title={`Cloud sync: ${syncStatus}${userEmail ? ` (${userEmail})` : ''}`}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#241014] border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <span className={`w-2 h-2 rounded-full ${
                syncStatus === 'synced'
                  ? 'bg-red-700'
                  : syncStatus === 'offline'
                  ? 'bg-slate-400'
                  : 'bg-amber-500 animate-pulse'
              }`} />
              <span className="hidden lg:inline capitalize">{syncStatus}</span>
            </div>

            {/* Settings Icon - Clearly Visible on Mobile & Desktop */}
            <button
              onClick={onOpenSettings}
              title="Settings & Preferences"
              className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-red-950 hover:bg-red-50 border border-slate-200/90 shadow-2xs transition-all active:scale-95"
              aria-label="Settings"
            >
              <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 hover:text-red-900" />
            </button>

            {/* Sign Out Button */}
            {onSignOut && (
              <button
                onClick={onSignOut}
                title="Sign out"
                className="hidden sm:flex items-center justify-center p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 transition-colors"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs font-medium">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              currentView === 'dashboard' ? 'text-red-900 font-bold bg-red-50' : 'text-slate-600'
            }`}
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('progress')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              currentView === 'progress' ? 'text-red-900 font-bold bg-red-50' : 'text-slate-600'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Progress
          </button>
          <button
            onClick={() => onNavigate('study')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              currentView === 'study' ? 'text-red-900 font-bold bg-red-50' : 'text-slate-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Study Guide
          </button>
        </div>

      </div>
    </header>
  );
};

