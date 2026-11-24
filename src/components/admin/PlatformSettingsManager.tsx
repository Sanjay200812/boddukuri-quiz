import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Bell,
  Lock,
  Users,
  Award,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { getPlatformSettings, savePlatformSettings } from '../../utils/studentLearning';
import type { PlatformSettings } from '../../types/quiz';

interface PlatformSettingsManagerProps {
  adminName: string;
  onRefreshData?: () => Promise<void>;
}

export const PlatformSettingsManager: React.FC<PlatformSettingsManagerProps> = ({
  adminName,
  onRefreshData
}) => {
  const [settings, setSettings] = useState<PlatformSettings>(() => getPlatformSettings());
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    savePlatformSettings(settings, adminName);
    showToast('Platform settings successfully saved and applied.');
    if (onRefreshData) {
      await onRefreshData();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2b0c15] via-[#5c0017] to-[#800020] text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Settings className="w-3.5 h-3.5" />
            Global Platform Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Platform Settings & Control
          </h1>
          <p className="text-xs sm:text-sm text-rose-100/90 mt-1">
            Configure system-wide parameters, authentication controls, passing thresholds, and notices.
          </p>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200 shadow-sm animate-fade-in flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {toastMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Branding & Identity */}
        <div className="p-6 rounded-2xl bg-white border border-[#ebd4d9] shadow-sm space-y-4">
          <h3 className="font-bold text-[#2b0c15] text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#800020]" />
            Platform Branding & Title
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                Platform Title
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={e => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-[#2b0c15] focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                Platform Subtitle
              </label>
              <input
                type="text"
                value={settings.brandingTagline}
                onChange={e => setSettings({ ...settings, brandingTagline: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-[#2b0c15] focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
                required
              />
            </div>
          </div>
        </div>

        {/* Card 2: Authentication Security Controls */}
        <div className="p-6 rounded-2xl bg-white border border-[#ebd4d9] shadow-sm space-y-4">
          <h3 className="font-bold text-[#2b0c15] text-base flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#800020]" />
            Authentication Methods & Access Control
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <div>
                <div className="font-bold text-xs text-[#2b0c15]">Allow Access Code Authentication</div>
                <div className="text-[11px] text-stone-500">
                  Allows students to sign in using their 4-digit numeric code (e.g. 2002 for Mahi, 2580 for Shailu).
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, allowAccessCodeLogin: !settings.allowAccessCodeLogin })}
                className="text-2xl text-[#800020] min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                {settings.allowAccessCodeLogin ? (
                  <ToggleRight className="w-8 h-8 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-stone-400" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <div>
                <div className="font-bold text-xs text-[#2b0c15]">Allow Username / Password Login</div>
                <div className="text-[11px] text-stone-500">
                  Allows students and administrators to authenticate with standard username/email & password.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, allowUsernameLogin: !settings.allowUsernameLogin })}
                className="text-2xl text-[#800020] min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                {settings.allowUsernameLogin ? (
                  <ToggleRight className="w-8 h-8 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-stone-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Active Student Status */}
        <div className="p-6 rounded-2xl bg-white border border-[#ebd4d9] shadow-sm space-y-4">
          <h3 className="font-bold text-[#2b0c15] text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-[#800020]" />
            Student Account Availability
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#2b0c15]">Mahi Account</span>
                <p className="text-xs text-stone-500">Role: Student • Access Code 2002</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({
                  ...settings,
                  activeStudents: {
                    mahi: !(settings.activeStudents?.mahi ?? true),
                    shailu: settings.activeStudents?.shailu ?? true
                  }
                })}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                {(settings.activeStudents?.mahi ?? true) ? (
                  <ToggleRight className="w-8 h-8 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-stone-400" />
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#2b0c15]">Shailu Account</span>
                <p className="text-xs text-stone-500">Role: Student • Access Code 2580</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({
                  ...settings,
                  activeStudents: {
                    mahi: settings.activeStudents?.mahi ?? true,
                    shailu: !(settings.activeStudents?.shailu ?? true)
                  }
                })}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                {(settings.activeStudents?.shailu ?? true) ? (
                  <ToggleRight className="w-8 h-8 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-stone-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Card 4: Default Quiz Criteria */}
        <div className="p-6 rounded-2xl bg-white border border-[#ebd4d9] shadow-sm space-y-4">
          <h3 className="font-bold text-[#2b0c15] text-base flex items-center gap-2">
            <Award className="w-4 h-4 text-[#800020]" />
            Default Quiz & Examination Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                Default Passing Score (%)
              </label>
              <input
                type="number"
                min={20}
                max={100}
                value={settings.defaultPassingScore}
                onChange={e => setSettings({ ...settings, defaultPassingScore: parseInt(e.target.value) || 50 })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-semibold focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2b0c15] mb-1">
                Default Quiz Time Limit (Minutes)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={settings.defaultQuizTimeLimitMinutes}
                onChange={e => setSettings({ ...settings, defaultQuizTimeLimitMinutes: parseInt(e.target.value) || 15 })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-semibold focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
              />
            </div>
          </div>
        </div>

        {/* Card 5: Platform Announcement Banner */}
        <div className="p-6 rounded-2xl bg-white border border-[#ebd4d9] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#2b0c15] text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#800020]" />
              Platform Announcements Banner
            </h3>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, announcementActive: !settings.announcementActive })}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {settings.announcementActive ? (
                <ToggleRight className="w-8 h-8 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-stone-400" />
              )}
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2b0c15] mb-1">
              Banner Message Text
            </label>
            <textarea
              rows={2}
              value={settings.announcementBannerText}
              onChange={e => setSettings({ ...settings, announcementBannerText: e.target.value })}
              className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#800020]/20"
              placeholder="e.g. 📢 Important: Sarnath has been inscribed as 45th UNESCO Site. Review new quiz questions!"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-[#800020] text-white font-bold text-sm hover:bg-[#5c0017] transition shadow-lg flex items-center gap-2 active:scale-95 min-h-[48px]"
          >
            <Save className="w-4 h-4" />
            Save Platform Settings
          </button>
        </div>
      </form>
    </div>
  );
};
