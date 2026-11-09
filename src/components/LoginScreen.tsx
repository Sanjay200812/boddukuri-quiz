import React, { useState, useEffect } from 'react';
import { supabase, supabaseConfigured, verifyAccessCodeCloud, getUserProfile, saveLocalAuthSession } from '../utils/supabase';
import type { UserRole } from '../types/quiz';
import { Sparkles, Lock, Mail, Eye, EyeOff, AlertCircle, WifiOff, CheckCircle2, ArrowRight, KeyRound, ShieldAlert, Clock } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (userEmail: string, role?: UserRole) => void;
  onReplayMotivation?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onReplayMotivation,
}) => {
  const [authMethod, setAuthMethod] = useState<'password' | 'code'>('password');
  
  // Password login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Access code state
  const [accessCode, setAccessCode] = useState('');
  const [showAccessCode, setShowAccessCode] = useState(false);
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);

  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  // Countdown timer if lockout is active
  useEffect(() => {
    if (!lockoutSeconds || lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds(prev => {
        if (!prev || prev <= 1) {
          clearInterval(interval);
          setErrorMessage(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Handle standard Email & Password Sign In
  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setAttemptsRemaining(null);

    if (!isOnline) {
      setErrorMessage('You are currently offline. Please connect to Wi-Fi or mobile data to sign in.');
      return;
    }

    if (!supabaseConfigured || !supabase) {
      setErrorMessage('Supabase is not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (
          error.message.toLowerCase().includes('invalid login credentials') ||
          error.message.toLowerCase().includes('invalid grant')
        ) {
          setErrorMessage('Invalid email or password. Please check your credentials and try again.');
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      if (data.user?.email) {
        // Fetch profile to verify role
        const profile = await getUserProfile(data.user.id);
        const resolvedRole = profile?.role || (data.user.email.toLowerCase().includes('sanju') || data.user.email.toLowerCase().includes('sanjay') ? 'admin' : 'student');
        saveLocalAuthSession({
          email: data.user.email,
          role: resolvedRole,
          fullName: profile?.fullName || (resolvedRole === 'admin' ? 'Sanju' : 'Mahi'),
          userId: data.user.id,
          loggedInAt: new Date().toISOString()
        });
        onLoginSuccess(data.user.email, resolvedRole);
      } else {
        setErrorMessage('Sign in succeeded, but no user email was returned.');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Access Code Sign In (Backend verified via verify_access_code RPC)
  const handleAccessCodeSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (lockoutSeconds && lockoutSeconds > 0) {
      setErrorMessage(`Access temporarily locked. Please wait ${Math.ceil(lockoutSeconds / 60)} more minutes.`);
      return;
    }

    if (!accessCode.trim()) {
      setErrorMessage('Please enter your personal access code.');
      return;
    }

    if (!isOnline) {
      setErrorMessage('You are currently offline. Please connect to Wi-Fi or mobile data.');
      return;
    }

    if (!supabaseConfigured || !supabase) {
      setErrorMessage('Supabase is not configured. Please configure Supabase in your environment.');
      return;
    }

    setLoading(true);

    try {
      const result = await verifyAccessCodeCloud(accessCode.trim());

      if (result.locked) {
        const secs = result.secondsRemaining || 900;
        setLockoutSeconds(secs);
        setErrorMessage(`Too many incorrect attempts. Account locked out for security (${Math.ceil(secs / 60)} minutes remaining).`);
        return;
      }

      if (!result.success || !result.email) {
        if (typeof result.attemptsRemaining === 'number') {
          setAttemptsRemaining(result.attemptsRemaining);
          setErrorMessage(`Invalid access code. ${result.attemptsRemaining} attempt${result.attemptsRemaining === 1 ? '' : 's'} remaining before lockout.`);
        } else {
          setErrorMessage(result.error || 'Invalid access code. Please try again.');
        }
        return;
      }

      // Valid access code! If backend ticket provided, sign in to Supabase auth session
      if (result.authTicket && supabase) {
        try {
          await supabase.auth.signInWithPassword({
            email: result.email,
            password: result.authTicket,
          });
        } catch {
          // ignore session activation error in fallback mode
        }
      }

      const resolvedRole = result.role || (result.email.toLowerCase().includes('sanju') || result.email.toLowerCase().includes('sanjay') ? 'admin' : 'student');
      saveLocalAuthSession({
        email: result.email,
        role: resolvedRole,
        fullName: result.fullName || (resolvedRole === 'admin' ? 'Sanju' : 'Mahi'),
        loggedInAt: new Date().toISOString()
      });
      onLoginSuccess(result.email, resolvedRole);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to verify access code.');
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
              Access daily quizzes, national parks study guide, and learning streaks.
            </p>
          </div>

          {/* Auth Method Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('password');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'password'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Password</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('code');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'code'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Access Code</span>
            </button>
          </div>

          {/* Offline warning if detected */}
          {!isOnline && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-start gap-2.5">
              <WifiOff className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>You are currently offline. Please connect to the internet to sign in.</span>
            </div>
          )}

          {/* Lockout Warning */}
          {lockoutSeconds !== null && lockoutSeconds > 0 && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
              <Clock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold">Rate Limit Protection Active</div>
                <div>
                  Too many incorrect attempts. Please wait{' '}
                  <span className="font-mono font-bold">
                    {Math.floor(lockoutSeconds / 60)}:{String(lockoutSeconds % 60).padStart(2, '0')}
                  </span>{' '}
                  before retrying.
                </div>
              </div>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (!lockoutSeconds || lockoutSeconds <= 0) && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{errorMessage}</span>
                {attemptsRemaining !== null && attemptsRemaining < 5 && (
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-rose-700">
                    <ShieldAlert className="w-3 h-3" />
                    <span>Rate limit: 5 attempts before a 15-minute lockout.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FORM 1: EMAIL & PASSWORD */}
          {authMethod === 'password' && (
            <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
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
          )}

          {/* FORM 2: ACCESS CODE */}
          {authMethod === 'code' && (
            <form onSubmit={handleAccessCodeSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Secret Access Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showAccessCode ? 'text' : 'password'}
                    required
                    autoComplete="off"
                    value={accessCode}
                    onChange={e => setAccessCode(e.target.value)}
                    placeholder="Enter your personal access code"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm font-medium transition-all outline-none tracking-widest font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccessCode(!showAccessCode)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    title={showAccessCode ? 'Hide code' : 'Show code'}
                  >
                    {showAccessCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Validated securely on the server with SHA-256 and brute-force protection.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !isOnline || (lockoutSeconds !== null && lockoutSeconds > 0)}
                className="w-full min-h-[48px] px-5 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-98 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-md shadow-emerald-900/15 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Code…</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code & Enter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

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
