import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  supabase,
  supabaseConfigured,
  verifyAccessCodeCloud,
  resolveUsernameToAuth,
  getUserProfile,
  saveLocalAuthSession
} from '../utils/supabase';
import type { UserRole } from '../types/quiz';
import {
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  WifiOff,
  CheckCircle2,
  ArrowRight,
  KeyRound,
  ShieldAlert,
  Clock,
  Mail
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (userEmail: string, role?: UserRole, userId?: string) => void;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
}) => {
  const [authMethod, setAuthMethod] = useState<'code' | 'username'>('code');

  // Username/Password login state
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
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

  // Handle Username/Email & Password Sign In
  const handleUsernamePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setAttemptsRemaining(null);

    if (lockoutSeconds && lockoutSeconds > 0) {
      setErrorMessage(`Access temporarily locked. Please wait ${Math.ceil(lockoutSeconds / 60)} more minutes.`);
      return;
    }

    if (!usernameOrEmail.trim()) {
      setErrorMessage('Please enter your username or email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

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
      // Server-side mapped resolution (mahi -> actual email, shailu -> synthetic identity, sanju -> admin email)
      const resolvedEmail = await resolveUsernameToAuth(usernameOrEmail.trim());

      const { data, error } = await supabase.auth.signInWithPassword({
        email: resolvedEmail,
        password: password,
      });

      if (error) {
        // Enforce brute-force rate-limiting locally
        const currentFailed = (parseInt(localStorage.getItem('spideyy_login_failed_count') || '0', 10) || 0) + 1;
        localStorage.setItem('spideyy_login_failed_count', String(currentFailed));

        if (currentFailed >= 5) {
          setLockoutSeconds(900);
          setErrorMessage('Too many failed sign-in attempts. Account temporarily locked for 15 minutes.');
        } else {
          setAttemptsRemaining(5 - currentFailed);
          // Generic error message to prevent username enumeration
          setErrorMessage('Invalid username or password. Please verify your credentials and try again.');
        }
        return;
      }

      // Reset failure counter on success
      localStorage.removeItem('spideyy_login_failed_count');

      if (data.user?.email) {
        const profile = await getUserProfile(data.user.id);
        const resolvedRole =
          profile?.role ||
          (data.user.email.toLowerCase().includes('sanju') || data.user.email.toLowerCase().includes('sanjay')
            ? 'admin'
            : 'student');

        const resolvedFullName =
          profile?.fullName ||
          (data.user.email.toLowerCase().includes('shailu')
            ? 'Shailu'
            : (resolvedRole === 'admin' ? 'Sanju' : 'Mahi'));

        saveLocalAuthSession({
          email: data.user.email,
          role: resolvedRole,
          fullName: resolvedFullName,
          userId: data.user.id,
          loggedInAt: new Date().toISOString()
        });

        // Redirect directly to the appropriate dashboard
        onLoginSuccess(data.user.email, resolvedRole, data.user.id);
      } else {
        setErrorMessage('Sign in succeeded, but no user identity was returned.');
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

      let authenticatedUserId = result.userId;
      if (result.authTicket && supabase) {
        const { error: cloudSignInError } = await supabase.auth.signInWithPassword({
          email: result.email,
          password: result.authTicket,
        });
        if (cloudSignInError) {
          throw new Error(`Cloud sign-in failed: ${cloudSignInError.message}. Your result cannot sync until Supabase Auth is connected.`);
        }
        const { data: cloudSession } = await supabase.auth.getSession();
        if (!cloudSession.session?.user) {
          throw new Error('Supabase did not create a cloud session. Please try signing in again.');
        }
        authenticatedUserId = cloudSession.session.user.id;
      }

      const resolvedRole =
        result.role ||
        (result.email.toLowerCase().includes('sanju') || result.email.toLowerCase().includes('sanjay')
          ? 'admin'
          : 'student');
      saveLocalAuthSession({
        email: result.email,
        role: resolvedRole,
        fullName: result.fullName || (resolvedRole === 'admin' ? 'Sanju' : 'Mahi'),
        userId: authenticatedUserId,
        loggedInAt: new Date().toISOString()
      });
      onLoginSuccess(result.email, resolvedRole, authenticatedUserId);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to verify access code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#f8fafc] text-slate-900 selection:bg-[#1e3a5f] selection:text-white px-4 py-8 sm:py-12">
      {/* Subtle Classic Architectural Grid Backdrop */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-45"
        style={{
          backgroundImage:
            'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/70 via-transparent to-[#f8fafc] pointer-events-none" />

      {/* Top Brand Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        className="relative z-10 max-w-md w-full mx-auto text-center space-y-3 pt-2 sm:pt-4"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1e3a5f] text-white shadow-card border border-slate-700/20 mb-1">
          <Sparkles className="w-6 h-6 text-amber-300" />
        </div>

        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <span>Spideyy</span>
            <span className="text-[#800020]">Quiz</span>
            <span className="font-sans px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              GK Portal
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
            Topic-Based Learning Workspace • Multi-Student Assessment Engine
          </p>
        </div>
      </motion.div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: EASE_OUT }}
        className="relative z-10 max-w-md w-full mx-auto my-auto"
      >
        <div className="rounded-2xl bg-white p-6 sm:p-8 border border-slate-200 shadow-elevated space-y-5">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Sign In to Your Learning Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Access scheduled quizzes, study guides, and cloud progress sync.
            </p>
          </div>

          {/* Auth Method Tabs: First Access Code, Beside it Mail & PW */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 relative">
            {/* 1. Access Code (First) */}
            <button
              type="button"
              onClick={() => {
                setAuthMethod('code');
                setErrorMessage(null);
              }}
              className={`relative z-10 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                authMethod === 'code' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {authMethod === 'code' && (
                <motion.div
                  layoutId="authTabIndicator"
                  className="absolute inset-0 rounded-lg bg-[#1e3a5f] shadow-soft -z-10"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                />
              )}
              <KeyRound className="w-3.5 h-3.5" />
              <span>Access Code</span>
            </button>

            {/* 2. Mail & PW (Beside it) */}
            <button
              type="button"
              onClick={() => {
                setAuthMethod('username');
                setErrorMessage(null);
              }}
              className={`relative z-10 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                authMethod === 'username' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {authMethod === 'username' && (
                <motion.div
                  layoutId="authTabIndicator"
                  className="absolute inset-0 rounded-lg bg-[#1e3a5f] shadow-soft -z-10"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                />
              )}
              <Mail className="w-3.5 h-3.5" />
              <span>Mail & PW</span>
            </button>
          </div>

          {/* Offline warning if detected */}
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-start gap-2.5"
            >
              <WifiOff className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>You are currently offline. Please connect to the internet to sign in.</span>
            </motion.div>
          )}

          {/* Lockout Warning */}
          {lockoutSeconds !== null && lockoutSeconds > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-start gap-2.5"
            >
              <Clock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold text-rose-950">Rate Limit Protection Active</div>
                <div>
                  Too many incorrect attempts. Please wait{' '}
                  <span className="font-mono font-bold text-rose-700">
                    {Math.floor(lockoutSeconds / 60)}:{String(lockoutSeconds % 60).padStart(2, '0')}
                  </span>{' '}
                  before retrying.
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message Alert */}
          <AnimatePresence>
            {errorMessage && (!lockoutSeconds || lockoutSeconds <= 0) && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-start gap-2.5"
              >
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* FORM 1: ACCESS CODE (First) */}
          {authMethod === 'code' && (
            <form onSubmit={handleAccessCodeSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
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
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 text-sm font-semibold tracking-widest font-mono transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccessCode(!showAccessCode)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
                    title={showAccessCode ? 'Hide code' : 'Show code'}
                  >
                    {showAccessCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Encrypted with SHA-256 cloud verification and rate limit guard.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !isOnline || (lockoutSeconds !== null && lockoutSeconds > 0)}
                className="w-full min-h-[46px] px-5 py-3 rounded-xl bg-[#1e3a5f] hover:bg-[#102a43] text-white font-semibold text-sm shadow-soft transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* FORM 2: EMAIL / USERNAME & PASSWORD (Beside it) */}
          {authMethod === 'username' && (
            <form onSubmit={handleUsernamePasswordSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Email / Username or Email
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">shailu • mahi • sanju</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={usernameOrEmail}
                    onChange={e => setUsernameOrEmail(e.target.value)}
                    placeholder="Enter email (e.g. mahi@...) or username"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 text-sm font-medium transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
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
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 text-sm font-medium transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isOnline}
                className="w-full min-h-[46px] px-5 py-3 rounded-xl bg-[#1e3a5f] hover:bg-[#102a43] text-white font-semibold text-sm shadow-soft transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Session Persistence Note */}
          <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Session persists securely across browser restarts until you sign out.
            </span>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 max-w-md w-full mx-auto text-center text-[11px] text-slate-500 pt-4"
      >
        Spideyy Quiz • Shared GK Learning Workspace for Mahi & Shailu • Supabase Cloud Verified
      </motion.div>
    </div>
  );
};
