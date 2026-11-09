import React, { useState } from 'react';
import { 
  X, 
  Settings as SettingsIcon, 
  Phone, 
  Download, 
  Upload, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Save,
  Cloud,
  LogOut,
  Sparkles,
  RefreshCw,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { 
  getUserSettings, 
  saveUserSettings, 
  exportBackupData, 
  importBackupData, 
  resetAllData 
} from '../utils/storage';
import { isDevUnlockAllEnabled, setDevUnlockAll } from '../utils/schedule';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
  userEmail?: string | null;
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
  syncStatus = 'synced',
  onSyncNow,
  onSignOut,
  onReplayMotivation,
}) => {
  const [settings, setSettings] = useState(getUserSettings());
  const [phoneInput, setPhoneInput] = useState(settings.sanjuWhatsAppNumber);
  const [studentNameInput, setStudentNameInput] = useState(settings.studentName);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<{ message: string; success?: boolean } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [devUnlock, setDevUnlock] = useState(isDevUnlockAllEnabled());

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneInput.replace(/\D/g, '');
    const newSettings = {
      ...settings,
      sanjuWhatsAppNumber: cleanNumber,
      studentName: studentNameInput.trim() || 'Mahi'
    };
    saveUserSettings(newSettings);
    setSettings(newSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    onDataChanged();
  };

  const handleToggleDevUnlock = (enabled: boolean) => {
    setDevUnlock(enabled);
    setDevUnlockAll(enabled);
    onDataChanged();
  };

  const handleExportJSON = () => {
    const jsonStr = exportBackupData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `mahi_national_parks_progress_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;
      const res = importBackupData(content);
      setImportStatus(res);
      if (res.success) {
        onDataChanged();
        setSettings(getUserSettings());
        setPhoneInput(getUserSettings().sanjuWhatsAppNumber);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExecuteReset = () => {
    if (confirmInput.trim().toUpperCase() === 'RESET') {
      resetAllData();
      setShowResetConfirm(false);
      setConfirmInput('');
      onDataChanged();
      alert('All quiz attempts and progress have been safely reset.');
    } else {
      alert('Confirmation text did not match "RESET". Cancelled.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <SettingsIcon className="w-5 h-5 text-emerald-700" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Settings & Account
              </h2>
              <p className="text-xs text-slate-500">
                Manage cloud sync, WhatsApp configuration, and learning options
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Account & Supabase Cloud Sync Section */}
        <div className="space-y-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-emerald-700" />
              <span>Supabase Cloud Sync</span>
            </h3>

            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white border border-emerald-200">
              <span className={`w-2 h-2 rounded-full ${
                syncStatus === 'synced' ? 'bg-emerald-500' : syncStatus === 'offline' ? 'bg-slate-400' : 'bg-amber-500 animate-pulse'
              }`} />
              <span className="capitalize text-slate-700">{syncStatus}</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 flex flex-col gap-1">
            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Signed in as: <strong>{userEmail || 'Authenticated User'}</strong></span>
            </div>
            <p className="text-[11px] text-slate-500">
              Progress, badges, streaks, and bookmarks sync securely with your Supabase account.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-100/70">
            {onSyncNow && (
              <button
                type="button"
                onClick={onSyncNow}
                className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Cloud Now</span>
              </button>
            )}

            {onSignOut && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to sign out? Your local progress is saved.')) {
                    onClose();
                    onSignOut();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all flex items-center gap-1.5 ml-auto"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Motivational Intro Replay */}
        {onReplayMotivation && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Opening Motivation Screen</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Replay Mahi's personalized daily motivation message
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onReplayMotivation();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-xs"
            >
              Replay Screen
            </button>
          </div>
        )}

        {/* 3. Sanju's WhatsApp Configuration */}
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Sanju's WhatsApp Configuration</span>
          </h3>

          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recipient WhatsApp Number (International format without + or spaces)
              </label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="e.g. 917075920852"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Results will be pre-filled to this number when Mahi clicks "Share on WhatsApp". Format: 91XXXXXXXXXX.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Name
              </label>
              <input
                type="text"
                value={studentNameInput}
                onChange={(e) => setStudentNameInput(e.target.value)}
                placeholder="Mahi"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {saveSuccess ? (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Saved successfully!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        </form>

        {/* 4. Developer / Sanju's Testing Options */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Developer & Testing Mode</span>
            </h3>

            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={devUnlock} 
                onChange={(e) => handleToggleDevUnlock(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            <strong>Dev: Unlock All Days</strong> — allows Sanju to preview and test any upcoming day quiz (Days 02 to 07) before the 8:30 PM IST scheduled unlock time.
          </p>
        </div>

        {/* 5. JSON Backup & Restore Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Local Backup & Restore (JSON)</span>
          </h3>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Export a JSON file to keep an offline backup of all completed days, scores, bookmarks, and badges.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleExportJSON}
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Export Progress (.json)</span>
              </button>

              <label className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer">
                <Upload className="w-4 h-4 text-teal-600" />
                <span>Import Progress (.json)</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                importStatus.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {importStatus.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{importStatus.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* 6. Reset Progress Section */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-rose-900 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Reset All Quiz Data</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Clears all attempts, streak, and completed day marks.
              </p>
            </div>

            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors"
              >
                Reset Data...
              </button>
            ) : null}
          </div>

          {showResetConfirm && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
              <p className="text-xs text-rose-900 font-semibold">
                ⚠️ Are you sure? Type <strong>RESET</strong> in the box below to confirm:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type RESET"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-rose-300 bg-white text-xs font-mono uppercase"
                />
                <button
                  type="button"
                  onClick={handleExecuteReset}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
                >
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetConfirm(false);
                    setConfirmInput('');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};