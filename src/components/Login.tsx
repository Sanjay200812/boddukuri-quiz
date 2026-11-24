import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Lock } from 'lucide-react';
import { signInWithCode, type Profile } from '../lib/supabase';
import { TOPICS, QUIZZES, TOTAL_QUESTIONS } from '../lib/bank';
import { Logo, Spinner } from './ui';

const LENGTH = 4;

export function Login({ onSignedIn }: { onSignedIn: (p: Profile) => void }) {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(0);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const code = digits.join('');

  const setAt = (i: number, v: string) => {
    setDigits(d => d.map((x, j) => (j === i ? v : x)));
  };

  const handleChange = (i: number, raw: string) => {
    setError('');
    const only = raw.replace(/\D/g, '');
    if (only.length > 1) {
      // pasted a whole code
      const next = Array(LENGTH).fill('').map((_, j) => only[j] ?? '');
      setDigits(next);
      refs.current[Math.min(only.length, LENGTH) - 1]?.focus();
      if (only.length >= LENGTH) void submit(next.join(''));
      return;
    }
    setAt(i, only);
    if (only && i < LENGTH - 1) refs.current[i + 1]?.focus();
    if (only && i === LENGTH - 1) {
      const full = digits.map((x, j) => (j === i ? only : x)).join('');
      if (full.length === LENGTH) void submit(full);
    }
  };

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < LENGTH - 1) refs.current[i + 1]?.focus();
  };

  async function submit(value = code) {
    if (busy) return;
    if (value.length !== LENGTH) {
      setError('Enter your 4-digit access code.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const profile = await signInWithCode(value);
      onSignedIn(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.');
      setShake(s => s + 1);
      setDigits(Array(LENGTH).fill(''));
      setTimeout(() => refs.current[0]?.focus(), 50);
    } finally {
      setBusy(false);
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit();
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between bg-night text-white p-12 overflow-hidden">
        <WebPattern />
        <div className="relative"><Logo light /></div>
        <div className="relative max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[44px] leading-[1.05] font-semibold tracking-tight"
          >
            Thirty questions.<br />One topic at a time.
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.5 }} className="mt-5 text-white/60 text-[15px] leading-relaxed">
            Topic-wise sets built from your study material — national parks, current affairs, banking, heritage and more. Every answer is explained after you submit.
          </motion.p>
          <div className="mt-10 grid grid-cols-3 gap-px bg-night-line rounded-xl overflow-hidden border border-night-line">
            {[
              [TOPICS.length, 'Topics'],
              [QUIZZES.length, 'Quiz sets'],
              [TOTAL_QUESTIONS, 'Questions'],
            ].map(([n, l]) => (
              <div key={l} className="bg-night-2 px-4 py-4">
                <div className="font-display text-2xl font-semibold tabular">{n}</div>
                <div className="text-xs text-white/50 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-white/40">Private workspace for Sanju, Mahi and Shailu.</div>
      </div>

      {/* Sign-in */}
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10"><Logo /></div>
          <div className="eyebrow mb-3">Sign in</div>
          <h2 className="font-display text-[30px] font-semibold tracking-tight leading-tight">Enter your access code</h2>
          <p className="mt-2 text-sm text-ink-muted">Your 4-digit code opens your own workspace and progress.</p>

          <form onSubmit={onSubmit} className="mt-8">
            <motion.div
              key={shake}
              animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : {}}
              transition={{ duration: 0.35 }}
              className="flex gap-3"
            >
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={el => { refs.current[i] = el; }}
                  value={d}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKey(i, e)}
                  onFocus={e => e.target.select()}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={LENGTH}
                  type="password"
                  autoFocus={i === 0}
                  aria-label={`Digit ${i + 1}`}
                  disabled={busy}
                  className={`w-full h-16 rounded-xl border bg-white text-center text-2xl font-semibold tabular outline-none transition
                    ${error ? 'border-bad/50' : d ? 'border-ink' : 'border-line'}
                    focus:border-brand focus:ring-4 focus:ring-brand/15`}
                />
              ))}
            </motion.div>

            <div className="min-h-[24px] mt-3">
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-bad">{error}</motion.p>
              )}
            </div>

            <button type="submit" disabled={busy || code.length !== LENGTH} className="btn-primary w-full h-12 mt-2 text-[15px]">
              {busy ? <><Spinner className="w-4 h-4" /> Checking…</> : <>Continue <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-2 text-xs text-ink-muted">
            <Lock className="w-3.5 h-3.5" />
            Five wrong attempts locks this device for 15 minutes.
          </div>
        </div>
      </div>
    </div>
  );
}

/** Thin radial "web" lines — a quiet nod to the Spideyy name. */
function WebPattern() {
  const rings = [80, 160, 240, 320, 400, 480];
  const spokes = Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6);
  return (
    <svg className="absolute -right-40 -bottom-40 w-[900px] h-[900px] text-white/[0.06]" viewBox="-500 -500 1000 1000" aria-hidden>
      {rings.map(r => (
        <polygon key={r} fill="none" stroke="currentColor" strokeWidth="1"
          points={spokes.map(a => `${Math.cos(a) * r},${Math.sin(a) * r}`).join(' ')} />
      ))}
      {spokes.map(a => (
        <line key={a} x1="0" y1="0" x2={Math.cos(a) * 500} y2={Math.sin(a) * 500} stroke="currentColor" strokeWidth="1" />
      ))}
    </svg>
  );
}
