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
  Save
} from 'lucide-react';
import { 
  getUserSettings, 
  saveUserSettings, 
  exportBackupData, 
  importBackupData, 
  resetAllData 
} from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
}) => {
  const [settings, setSettings] = useState(getUserSettings());
  const [phoneInput, setPhoneInput] = useState(settings.sanjuWhatsAppNumber);
  const [studentNameInput, setStudentNameInput] = useState(settings.studentName);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<{ message: string; success?: boolean } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean phone number
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
    // Reset file input value
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
                Settings & Data Backup
              </h2>
              <p className="text-xs text-slate-500">
                Configure WhatsApp numbers and backup your local progress
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

        {/* WhatsApp & User Configuration */}
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
              <div className="relative">
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="e.g. 917075920852"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
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

        {/* JSON Backup & Restore Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Backup & Restore (Offline LocalStorage)</span>
          </h3>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Since all progress is saved locally in your browser's LocalStorage, you can export a JSON backup file to keep your completed days and score records safe.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              {/* Export Button */}
              <button
                type="button"
                onClick={handleExportJSON}
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Export Progress (.json)</span>
              </button>

              {/* Import Button */}
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

        {/* Reset Progress Section */}
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
