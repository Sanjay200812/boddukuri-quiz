import React, { useState } from 'react';
import { supabase, supabaseConfigured } from '../utils/supabase';
import { Sparkles, Lock, Mail, Eye, EyeOff, AlertCircle, WifiOff, CheckCircle2, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (userEmail: string) => void;
  onReplayMotivation?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onReplayMotivation,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isOnline) {
      setErrorMessage('You are currently offline. Please connect to Wi-Fi or mobile data to sign in.');
      return;
    }

    if (!supabaseConfigured || !supabase) {
      setErrorMessage('Supabase is not configured yet. Please check environment variables.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials') || error.message.toLowerCase().includes('invalid grant')) {
          setErrorMessage('Invalid email or password. Please check your credentials and try again.');
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      if (data.user?.email) {
        onLoginSuccess(data.user.email);
      } else {
        setErrorMessage('Sign in succeeded, but no user email was returned.');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#F2F7F4] via-[#EEF5F0] to-[#E5EFE8] px-4 py-8 sm:py-12 text-slate-800">
      
      {/* Top Brand Banner */}
      <div className="max-w-md w-full mx-auto text-center space-y-3 pt-4">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white shadow-xl shadow-emerald-700/20 mb-1">
          <Sparkles className="w-7 h-7 text-emerald-200" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Boddukuri's Quiz
          </h1>
          <div className="inline-block px-3 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 mt-1">
            #Mahi
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
            Learn. Revise. Remember. Achieve.
          </p>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xl shadow-slate-200/50 space-y-5">
          
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Sign in to Your Learning Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Sign in with Mahi's account to sync daily quizzes, learning streaks, and trophy badges.
            </p>
          </div>

          {/* Offline warning if detected */}
          {!isOnline && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-start gap-2.5">
              <WifiOff className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>You are currently offline. Please connect to the internet to sign in.</span>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm font-medium transition-all outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm font-medium transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isOnline}
              className="w-full min-h-[48px] px-5 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-98 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-md shadow-emerald-900/15 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In…</span>
                </>
              ) : (
                <>
                  <span>Sign In to Learning Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Session Persistence Note */}
          <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Your session will stay active permanently across browser restarts until you explicitly sign out.
            </span>
          </div>

          {/* Replay motivation animation shortcut */}
          {onReplayMotivation && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onReplayMotivation}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline"
              >
                Replay Opening Motivation
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center text-[11px] text-slate-400">
        Boddukuri's Quiz #Mahi • All learning progress stored locally and synced securely.
      </div>

    </div>
  );
};
