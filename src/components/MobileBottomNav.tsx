import React from 'react';
import {
  Home,
  Play,
  BarChart3,
  Bookmark,
  User
} from 'lucide-react';
import type { StudentNavView } from './Sidebar';

interface MobileBottomNavProps {
  currentView: StudentNavView | string;
  onNavigate: (view: StudentNavView) => void;
  onOpenDrawer: () => void;
  unreadNotifsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenDrawer,
  unreadNotifsCount: _unreadNotifsCount = 0,
}) => {
  const isDashboard = currentView === 'dashboard';
  const isQuizzes = currentView === 'my-quizzes' || currentView === 'today-quiz';
  const isProgress = currentView === 'progress';
  const isSaved = currentView === 'study-guide' || currentView === 'study';
  const isProfile = currentView === 'settings';

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 flex items-center justify-around lg:hidden shadow-[0_-4px_15px_rgba(15,23,42,0.06)]"
    >
      {/* 1: Home */}
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[52px] min-h-[44px] cursor-pointer ${
          isDashboard ? 'text-[#1e3a5f] font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <div className={`p-1.5 rounded-xl ${isDashboard ? 'bg-slate-100 text-[#1e3a5f] border border-slate-200' : ''}`}>
          <Home className={`w-5 h-5 ${isDashboard ? 'stroke-[2.25]' : ''}`} />
        </div>
        <span className="text-[10px] mt-1 font-semibold">Home</span>
      </button>

      {/* 2: Quizzes */}
      <button
        onClick={() => onNavigate('my-quizzes')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[52px] min-h-[44px] cursor-pointer ${
          isQuizzes ? 'text-[#1e3a5f] font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <div className={`p-1.5 rounded-xl ${isQuizzes ? 'bg-slate-100 text-[#1e3a5f] border border-slate-200' : ''}`}>
          <Play className={`w-5 h-5 ${isQuizzes ? 'stroke-[2.25] fill-[#1e3a5f]' : ''}`} />
        </div>
        <span className="text-[10px] mt-1 font-semibold">Quizzes</span>
      </button>

      {/* 3: Progress */}
      <button
        onClick={() => onNavigate('progress')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[52px] min-h-[44px] cursor-pointer ${
          isProgress ? 'text-[#1e3a5f] font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <div className={`p-1.5 rounded-xl ${isProgress ? 'bg-slate-100 text-[#1e3a5f] border border-slate-200' : ''}`}>
          <BarChart3 className={`w-5 h-5 ${isProgress ? 'stroke-[2.25]' : ''}`} />
        </div>
        <span className="text-[10px] mt-1 font-semibold">Progress</span>
      </button>

      {/* 4: Saved / Study */}
      <button
        onClick={() => onNavigate('study-guide')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[52px] min-h-[44px] cursor-pointer ${
          isSaved ? 'text-[#1e3a5f] font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <div className={`p-1.5 rounded-xl ${isSaved ? 'bg-slate-100 text-[#1e3a5f] border border-slate-200' : ''}`}>
          <Bookmark className={`w-5 h-5 ${isSaved ? 'stroke-[2.25] fill-[#1e3a5f]' : ''}`} />
        </div>
        <span className="text-[10px] mt-1 font-semibold">Saved</span>
      </button>

      {/* 5: Profile / Settings */}
      <button
        onClick={onOpenDrawer}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[52px] min-h-[44px] cursor-pointer ${
          isProfile ? 'text-[#1e3a5f] font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <div className="p-1.5 rounded-xl">
          <User className="w-5 h-5" />
        </div>
        <span className="text-[10px] mt-1 font-semibold">Profile</span>
      </button>
    </nav>
  );
};
