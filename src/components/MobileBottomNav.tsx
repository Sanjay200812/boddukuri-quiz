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
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0407]/95 backdrop-blur-2xl border-t border-[#260c18] py-2 px-3 flex items-center justify-around lg:hidden shadow-[0_-8px_25px_rgba(0,0,0,0.8)]"
    >
      {/* 1: Home */}
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[52px] min-h-[44px] cursor-pointer ${
          isDashboard ? 'text-[#ff3366] font-bold' : 'text-[#a68690] hover:text-white'
        }`}
      >
        <div className={`p-1.5 rounded-xl ${isDashboard ? 'bg-[#220713] text-[#ff3366] border border-[#470f25] shadow-ruby' : ''}`}>
          <Home className={`w-5 h-5 ${isDashboard ? 'stroke-[2.5]' : ''}`} />
        </div>
        <span className="text-[10px] mt-1 font-semibold">Home</span>
      </button>

      {/* 2: Quizzes */}
      <button
        onClick={() => onNavigate('my-quizzes')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[52px] min-h-[44px] cursor-pointer ${
          isQuizzes ? 'text-[#ff3366] font-bold' : 'text-[#a68690] hover:text-white'
        }`}
      >
        <div className={`p-1.5 rounded-xl ${isQuizzes ? 'bg-[#220713] text-[#ff3366] border border-[#470f25] shadow-ruby' : ''}`}>
          <Play className={`w-5 h-5 ${isQuizzes ? 'stroke-[2.5] fill-[#ff3366]' : ''}`} />
        </div>
        <span className="text-[10px] mt-1 font-semibold">Quizzes</span>
      </button>

      {/* 3: Progress */}
      <button
        onClick={() => onNavigate('progress')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[52px] min-h-[44px] cursor-pointer ${
          isProgress ? 'text-[#ff3366] font-bold' : 'text-[#a68690] hover:text-white'
        }`}
      >
        <div className={`p-1.5 rounded-xl ${isProgress ? 'bg-[#220713] text-[#ff3366] border border-[#470f25] shadow-ruby' : ''}`}>
          <BarChart3 className={`w-5 h-5 ${isProgress ? 'stroke-[2.5]' : ''}`} />
        </div>
        <span className="text-[10px] mt-1 font-semibold">Progress</span>
      </button>

      {/* 4: Saved / Study */}
      <button
        onClick={() => onNavigate('study-guide')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[52px] min-h-[44px] cursor-pointer ${
          isSaved ? 'text-[#ff3366] font-bold' : 'text-[#a68690] hover:text-white'
        }`}
      >
        <div className={`p-1.5 rounded-xl ${isSaved ? 'bg-[#220713] text-[#ff3366] border border-[#470f25] shadow-ruby' : ''}`}>
          <Bookmark className={`w-5 h-5 ${isSaved ? 'stroke-[2.5] fill-[#ff3366]' : ''}`} />
        </div>
        <span className="text-[10px] mt-1 font-semibold">Saved</span>
      </button>

      {/* 5: Profile / Settings */}
      <button
        onClick={onOpenDrawer}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[52px] min-h-[44px] cursor-pointer ${
          isProfile ? 'text-[#ff3366] font-bold' : 'text-[#a68690] hover:text-white'
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
