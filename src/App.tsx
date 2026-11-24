import { useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { currentProfile, signOut, supabase, type Profile } from './lib/supabase';
import { navigate } from './lib/router';
import { Login } from './components/Login';
import { Logo, Spinner } from './components/ui';
import { StudentApp } from './student/StudentApp';
import { AdminApp } from './admin/AdminApp';

export default function App() {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void currentProfile().then(p => { if (!cancelled) setProfile(p); });
    const sub = supabase?.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_OUT') setProfile(null);
    });
    return () => {
      cancelled = true;
      sub?.data.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setPreviewing(false);
    setProfile(null);
    navigate('', { replace: true });
  };

  let screen;
  if (profile === undefined) {
    screen = (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <Logo />
        <Spinner className="w-5 h-5 text-ink-faint" />
      </div>
    );
  } else if (!supabase) {
    screen = (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-sm"><Logo /><p className="mt-6 text-sm text-ink-muted">Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the .env file and rebuild.</p></div>
      </div>
    );
  } else if (!profile) {
    screen = <Login onSignedIn={p => { navigate('', { replace: true }); setProfile(p); }} />;
  } else if (profile.role === 'admin' && !previewing) {
    screen = <AdminApp profile={profile} onSignOut={handleSignOut} onPreview={() => { navigate('', { replace: true }); setPreviewing(true); }} />;
  } else {
    screen = (
      <StudentApp
        key={profile.id + String(previewing)}
        profile={profile}
        onSignOut={handleSignOut}
        onExitPreview={profile.role === 'admin' ? () => { navigate('', { replace: true }); setPreviewing(false); } : undefined}
      />
    );
  }

  return <MotionConfig reducedMotion="user">{screen}</MotionConfig>;
}
