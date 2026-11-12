import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  supabase,
  supabaseConfigured,
  verifyAccessCodeCloud,
  getUserProfile,
  saveLocalAuthSession
} from '../utils/supabase';
import type { UserRole } from '../types/quiz';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  WifiOff,
  CheckCircle2,
  ArrowRight,
  KeyRound,
  ShieldAlert,
  Clock,
  Play
} from 'lucide-react';
import { BackgroundCubesGrid } from './ui/background-cubes-grid';

interface LoginScreenProps {
  onLoginSuccess: (userEmail: string, role?: UserRole, userId?: string) => void;
  onReplayMotivation?: () => void;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onReplayMotivation,
}) => {
  const [authMethod, setAuthMethod] = useState<'code' | 'password'>('code');

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
        const profile = await getUserProfile(data.user.id);
        const resolvedRole =
          profile?.role ||
          (data.user.email.toLowerCase().includes('sanju') || data.user.email.toLowerCase().includes('sanjay')
            ? 'admin'
            : 'student');
        saveLocalAuthSession({
          email: data.user.email,
          role: resolvedRole,
          fullName: profile?.fullName || (resolvedRole === 'admin' ? 'Sanju' : 'Mahi'),
          userId: data.user.id,
          loggedInAt: new Date().toISOString()
        });
        onLoginSuccess(data.user.email, resolvedRole, data.user.id);
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
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#070508] text-neutral-100 selection:bg-[#9e1030] selection:text-white px-4 py-8 sm:py-12">
      {/* 3D Interactive Background Cubes Grid (Aceternity UI component) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-auto">
        <BackgroundCubesGrid
          variant="isometric"
          cellSize={48}
          gap={0.12}
          topColor="#160811"
          leftColor="#0a0307"
          rightColor="#10050d"
          glowColor="#a31d38"
          glow={0.8}
        />
      </div>

      {/* Subtle radial vignette overlay */}
      <div className="absolute inset-0 z-0 bg-radial-[ellipse_80%_60%_at_50%_50%] from-transparent via-[#070508]/60 to-[#070508] pointer-events-none" />

      {/* Top Brand Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="relative z-10 max-w-md w-full mx-auto text-center space-y-3 pt-2 sm:pt-4"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#9e1030] to-[#5a0618] text-white shadow-ruby border border-white/10 mb-1">
          <Sparkles className="w-7 h-7 text-rose-200" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <span>Boddukuri's Quiz</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#9e1030]/20 text-[#ff8099] border border-[#ff3366]/30">
              #Mahi
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
            National Parks Master Curriculum • Daily Interactive Assessment
          </p>
        </div>
      </motion.div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
        className="relative z-10 max-w-md w-full mx-auto my-auto"
      >
        <div className="rounded-3xl bg-[#0e0a0d]/85 backdrop-blur-2xl p-6 sm:p-8 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.7)] space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Sign In to Your Learning Portal
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Access scheduled quizzes, state study guides, and progress sync.
            </p>
          </div>

          {/* Auth Method Tabs with Smooth Animated Pill */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#150e13] rounded-2xl border border-white/[0.06] relative">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('code');
                setErrorMessage(null);
              }}
              className={`relative z-10 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${
                authMethod === 'code' ? 'text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {authMethod === 'code' && (
                <motion.div
                  layoutId="authTabIndicator"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] shadow-ruby border border-[#ff3366]/30 -z-10"
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.4 }}
                />
              )}
              <KeyRound className="w-3.5 h-3.5" />
              <span>Access Code</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMethod('password');
                setErrorMessage(null);
              }}
              className={`relative z-10 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${
                authMethod === 'password' ? 'text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {authMethod === 'password' && (
                <motion.div
                  layoutId="authTabIndicator"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] shadow-ruby border border-[#ff3366]/30 -z-10"
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.4 }}
                />
              )}
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Password</span>
            </button>
          </div>

          {/* Offline warning if detected */}
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs font-medium flex items-start gap-2.5"
            >
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>You are currently offline. Please connect to the internet to sign in.</span>
            </motion.div>
          )}

          {/* Lockout Warning */}
          {lockoutSeconds !== null && lockoutSeconds > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs font-medium flex items-start gap-2.5"
            >
              <Clock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold text-white">Rate Limit Protection Active</div>
                <div>
                  Too many incorrect attempts. Please wait{' '}
                  <span className="font-mono font-bold text-rose-300">
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
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs font-medium flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{errorMessage}</span>
                  {attemptsRemaining !== null && attemptsRemaining < 5 && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
                      <ShieldAlert className="w-3 h-3" />
                      <span>Rate limit: 5 attempts before a 15-minute lockout.</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FORM 1: EMAIL & PASSWORD */}
          {authMethod === 'password' && (
            <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
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
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-white/[0.08] bg-[#120a10] text-white placeholder:text-neutral-500 focus:border-[#9e1030] focus:ring-2 focus:ring-[#9e1030]/30 text-sm font-medium transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/[0.08] bg-[#120a10] text-white placeholder:text-neutral-500 focus:border-[#9e1030] focus:ring-2 focus:ring-[#9e1030]/30 text-sm font-medium transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-white transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !isOnline}
                className="w-full min-h-[48px] px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white font-bold text-sm shadow-ruby border border-[#ff3366]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
              </motion.button>
            </form>
          )}

          {/* FORM 2: ACCESS CODE */}
          {authMethod === 'code' && (
            <form onSubmit={handleAccessCodeSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-300">
                  Secret Access Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showAccessCode ? 'text' : 'password'}
                    required
                    autoComplete="off"
                    value={accessCode}
                    onChange={e => setAccessCode(e.target.value)}
                    placeholder="Enter your personal access code"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/[0.08] bg-[#120a10] text-white placeholder:text-neutral-500 focus:border-[#9e1030] focus:ring-2 focus:ring-[#9e1030]/30 text-sm font-bold tracking-widest font-mono transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccessCode(!showAccessCode)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-white transition-colors"
                    title={showAccessCode ? 'Hide code' : 'Show code'}
                  >
                    {showAccessCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Encrypted with SHA-256 cloud verification and rate limit guard.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !isOnline || (lockoutSeconds !== null && lockoutSeconds > 0)}
                className="w-full min-h-[48px] px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white font-bold text-sm shadow-ruby border border-[#ff3366]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
              </motion.button>
            </form>
          )}

          {/* Session Persistence Note */}
          <div className="pt-2 border-t border-white/[0.06] flex items-start gap-2 text-[11px] text-neutral-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Session persists securely across browser restarts until you sign out.
            </span>
          </div>

          {/* Replay motivation animation shortcut */}
          {onReplayMotivation && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onReplayMotivation}
                className="text-xs text-neutral-400 hover:text-white font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3 text-[#ff8099]" />
                <span>Replay Opening Motivation</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 max-w-md w-full mx-auto text-center text-[11px] text-neutral-500 pt-4"
      >
        Boddukuri's Quiz #Mahi • All learning progress stored locally and synchronized with Supabase Cloud.
      </motion.div>
    </div>
  );
};
