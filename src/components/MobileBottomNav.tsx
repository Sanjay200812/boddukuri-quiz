import React from 'react';
import {
  Home,
  Play,
  FileText,
  TrendingUp,
  Menu
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
  unreadNotifsCount = 0,
}) => {
  const isDashboard = currentView === 'dashboard';
  const isQuizzes = currentView === 'my-quizzes' || currentView === 'today-quiz';
  const isAttempts = currentView === 'my-attempts' || currentView === 'my-results';
  const isProgress = currentView === 'progress';

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0408]/95 backdrop-blur-xl border-t border-[#260c18] py-1.5 px-2 flex items-center justify-around lg:hidden shadow-[0_-8px_25px_rgba(0,0,0,0.7)]"
    >
      {/* 1: Dashboard */}
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] min-h-[44px] ${
          isDashboard ? 'text-[#ff3366] font-black' : 'text-[#a68690] hover:text-white'
        }`}
      >
        <div className={`p-1 rounded-lg ${isDashboard ? 'bg-[#280a17] text-[#ff3366] shadow-[0_0_12px_rgba(255,51,102,0.3)]' : ''}`}>
          <Home className={`w-5 h-5 ${isDashboard ? 'stroke-[2.5]' : ''}`} />
        </div>
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      {/* 2: My Quizzes */}
      <button
        onClick={() => onNavigate('my-quizzes')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] min-h-[44px] ${
          isQuizzes ? 'text-[#ff3366] font-black' : 'text-[#a68690] hover:text-white'
        }`}
      >
        <div className={`p-1 rounded-lg ${isQuizzes ? 'bg-[#280a17] text-[#ff3366] shadow-[0_0_12px_rgba(255,51,102,0.3)]' : ''}`}>
          <Play className={`w-5 h-5 ${isQuizzes ? 'stroke-[2.5] fill-[#ff3366]' : ''}`} />
        </div>
        <span className="text-[10px] mt-0.5">Quizzes</span>
      </button>

      {/* 3: My Attempts */}
      <button
        onClick={() => onNavigate('my-attempts')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] min-h-[44px] ${
          isAttempts ? 'text-[#ff3366] font-black' : 'text-[#a68690] hover:text-white'
        }`}
      >
        <div className={`p-1 rounded-lg ${isAttempts ? 'bg-[#280a17] text-[#ff3366] shadow-[0_0_12px_rgba(255,51,102,0.3)]' : ''}`}>
          <FileText className={`w-5 h-5 ${isAttempts ? 'stroke-[2.5]' : ''}`} />
        </div>
        <span className="text-[10px] mt-0.5">Attempts</span>
      </button>

      {/* 4: Progress */}
      <button
        onClick={() => onNavigate('progress')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] min-h-[44px] ${
          isProgress ? 'text-[#ff3366] font-black' : 'text-[#a68690] hover:text-white'
        }`}
      >
        <div className={`p-1 rounded-lg ${isProgress ? 'bg-[#280a17] text-[#ff3366] shadow-[0_0_12px_rgba(255,51,102,0.3)]' : ''}`}>
          <TrendingUp className={`w-5 h-5 ${isProgress ? 'stroke-[2.5]' : ''}`} />
        </div>
        <span className="text-[10px] mt-0.5">Progress</span>
      </button>

      {/* 5: Menu / Drawer toggle */}
      <button
        onClick={onOpenDrawer}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] min-h-[44px] text-[#a68690] hover:text-white relative"
      >
        <div className="p-1 rounded-lg relative">
          <Menu className="w-5 h-5" />
          {unreadNotifsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#e6194b] shadow-[0_0_6px_rgba(230,25,75,0.8)] animate-pulse" />
          )}
        </div>
        <span className="text-[10px] mt-0.5">Menu</span>
      </button>
    </nav>
  );
};

