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
    <header className="sticky top-0 z-30 bg-[#0c0407]/90 backdrop-blur-xl border-b border-[#260c18] text-[#f2e6eb] transition-all shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Left: Sidebar Toggle (Mobile) & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-[#a68690] hover:text-white hover:bg-[#1f0913] transition-colors lg:hidden cursor-pointer border border-[#2b0c18]"
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
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#9e1030] to-[#e6194b] flex items-center justify-center text-white shadow-ruby group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-[#ff8099] transition-colors">
                    Boddukuri's
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#2b0c18] text-[#ff8099] border border-[#52142a]">
                    Quiz Portal
                  </span>
                </div>
                <p className="text-[11px] font-bold text-[#ff3366] hidden sm:block">
                  Student Portal
                </p>
              </div>
            </div>
          </div>

          {/* Center Search Bar Matching Image 1 */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <label className="flex items-center gap-2.5 w-full rounded-2xl px-4 py-2 border border-[#2b0c18] bg-[#14060d] text-white shadow-inner focus-within:border-[#ff3366]/60 focus-within:bg-[#190710] transition-all">
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#9e1030] to-[#750720] text-white shadow-ruby border border-[#ff3366]/30'
                      : 'text-[#a68690] hover:text-white hover:bg-[#1a0610]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Streak, Notification Bell & User Avatar Pill Matching Image 1 */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Streak Counter */}
            <div
              title={`${streakDays} days consecutive learning streak!`}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                streakDays > 0
                  ? 'bg-[#1e0712] text-[#ff8099] border-[#470f25] shadow-ruby'
                  : 'bg-[#14060d] text-[#7a5b67] border-[#2b0c18]'
              }`}
            >
              <Flame
                className={`w-3.5 h-3.5 ${
                  streakDays > 0 ? 'text-[#ff3366] fill-[#ff3366] animate-pulse' : 'text-[#7a5b67]'
                }`}
              />
              <span>
                {streakDays} <span className="hidden sm:inline">{streakDays === 1 ? 'Day' : 'Days'}</span>
              </span>
            </div>

            {/* Notifications Bell with Red Dot Matching Image 1 */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                title="Notifications"
                className="relative p-2 rounded-xl text-[#a68690] hover:text-white hover:bg-[#1f0913] border border-[#2b0c18] bg-[#14060d] transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff3366] text-white font-black text-[10px] flex items-center justify-center shadow-ruby animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile Pill Matching Image 1: Avatar + Name + Student + Dropdown Chevron */}
            <div
              onClick={onOpenSettings}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#14060d] border border-[#2b0c18] hover:border-[#ff3366]/40 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9e1030] to-[#e6194b] text-white font-black text-xs flex items-center justify-center shadow-ruby shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-bold text-white leading-tight flex items-center gap-1">
                  <span>{userName}</span>
                  <ChevronDown className="w-3 h-3 text-[#7a5b67]" />
                </div>
                <div className="text-[10px] text-[#a68690] leading-tight">Student</div>
              </div>
            </div>

            {/* Sign Out (Desktop) */}
            {onSignOut && (
              <button
                onClick={onSignOut}
                title="Sign out"
                className="hidden xl:flex items-center justify-center p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-[#1f0913] border border-[#2b0c18] transition-colors cursor-pointer"
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
