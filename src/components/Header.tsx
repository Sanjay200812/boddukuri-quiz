import React from 'react';
import { 
  Sparkles, 
  Flame, 
  BookOpen, 
  BarChart3, 
  Settings as SettingsIcon,
  Home,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  currentView: 'dashboard' | 'progress' | 'study' | 'quiz' | 'result' | 'review';
  onNavigate: (view: 'dashboard' | 'progress' | 'study') => void;
  onOpenSettings: () => void;
  streakDays: number;
  completedQuizzesCount: number;
  totalQuizzesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenSettings,
  streakDays,
  completedQuizzesCount,
  totalQuizzesCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Boddukuri's Quiz
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 tracking-wide border border-emerald-200/60">
                  #Mahi
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Learn. Revise. Remember. Achieve.
              </p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-50/80 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentView === 'dashboard'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Home className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('progress')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentView === 'progress'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Progress & History
            </button>
            <button
              onClick={() => onNavigate('study')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentView === 'study'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Study Guide
            </button>
          </nav>

          {/* Right Badges & Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter */}
            <div 
              title={`${streakDays} days consecutive learning streak!`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold shadow-sm transition-all ${
                streakDays > 0 
                  ? 'bg-amber-50 text-amber-900 border-amber-200 shadow-amber-500/5' 
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              <Flame className={`w-4 h-4 ${streakDays > 0 ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-400'}`} />
              <span>{streakDays} {streakDays === 1 ? 'Day' : 'Days'}</span>
            </div>

            {/* Quizzes Completed Counter */}
            <div 
              title={`${completedQuizzesCount} of ${totalQuizzesCount} daily quizzes completed`}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs sm:text-sm font-semibold"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{completedQuizzesCount}/{totalQuizzesCount} Done</span>
            </div>

            {/* Settings & Backup Modal Trigger */}
            <button
              onClick={onOpenSettings}
              title="Settings & JSON Backup"
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors"
              aria-label="Settings"
            >
              <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs font-medium">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              currentView === 'dashboard' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'
            }`}
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('progress')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              currentView === 'progress' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Progress
          </button>
          <button
            onClick={() => onNavigate('study')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              currentView === 'study' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'
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

