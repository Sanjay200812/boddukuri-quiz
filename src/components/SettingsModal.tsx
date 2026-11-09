import React, { useState } from 'react';
import {
  X,
  User,
  CheckCircle2,
  Save,
  Cloud,
  LogOut,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import {
  getUserSettings,
  saveUserSettings
} from '../utils/storage';
import type { UserRole } from '../types/quiz';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
  userEmail?: string | null;
  userRole?: UserRole;
  syncStatus?: 'synced' | 'offline' | 'pending';
  onSyncNow?: () => void;
  onSignOut?: () => void;
  onReplayMotivation?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
  userEmail,
  userRole = 'student',
  syncStatus = 'synced',
  onSyncNow,
  onSignOut,
}) => {
  const [settings, setSettings] = useState(getUserSettings());
  const [studentNameInput, setStudentNameInput] = useState(settings.studentName);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = studentNameInput.trim() || 'Mahi';
    const newSettings = {
      ...settings,
      studentName: cleanName
    };
    saveUserSettings(newSettings);
    setSettings(newSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    onDataChanged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f0f12] w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-red-50 text-red-900">
              <User className="w-5 h-5 text-red-900" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Student Profile
              </h2>
              <p className="text-xs text-slate-500">
                Manage your profile name and active session
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2b1118] text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Account & Supabase Cloud Sync Section */}
        <div className="space-y-3 bg-red-50/50 p-4 rounded-2xl border border-red-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-950 flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-red-900" />
              <span>Learning Session</span>
            </h3>

            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0f0f12] border border-red-300">
              <span className={`w-2 h-2 rounded-full ${
                syncStatus === 'synced' ? 'bg-red-700' : syncStatus === 'offline' ? 'bg-slate-400' : 'bg-amber-500 animate-pulse'
              }`} />
              <span className="capitalize text-slate-700">{syncStatus}</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 flex flex-col gap-1">
            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-red-800" />
              <span>Signed in as: <strong>{userEmail || 'Mahi'}</strong></span>
            </div>
            <p className="text-[11px] text-slate-500">
              Role: <span className="capitalize font-semibold text-red-900">{userRole}</span> • Progress synced securely with Supabase.
            </p>
          </div>

          {onSyncNow && (
            <div className="pt-2 flex justify-end border-t border-red-100/70">
              <button
                type="button"
                onClick={onSyncNow}
                className="px-3 py-1.5 rounded-xl bg-[#0f0f12] border border-red-300 text-red-900 hover:bg-red-50 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Cloud Now</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. Change Student Display Name */}
        <form onSubmit={handleSaveName} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Student Display Name
            </label>
            <input
              type="text"
              value={studentNameInput}
              onChange={(e) => setStudentNameInput(e.target.value)}
              placeholder="Mahi"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#0f0f12] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Displayed on your dashboard and achievement reports.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            {saveSuccess ? (
              <span className="text-xs font-bold text-red-900 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Name updated!
              </span>
            ) : <div />}

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-red-900 hover:bg-red-900 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Name</span>
            </button>
          </div>
        </form>

        {/* 3. Log Out */}
        <div className="pt-4 border-t border-slate-100">
          {onSignOut && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onSignOut();
              }}
              className="w-full py-3 px-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-sm font-bold transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Log Out</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
