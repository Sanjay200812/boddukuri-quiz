import { useEffect, useState } from 'react';

/** Minimal hash router: "#/topic/banking" -> ["topic", "banking"]. */
function parse(): string[] {
  return window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
}

export function useRoute(): string[] {
  const [route, setRoute] = useState<string[]>(parse);
  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function navigate(path: string, opts: { replace?: boolean } = {}): void {
  const hash = '#/' + path.replace(/^\/+/, '');
  if (opts.replace) {
    history.replaceState(null, '', hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else if (window.location.hash !== hash) {
    window.location.hash = hash;
  }
  window.scrollTo({ top: 0 });
}

/** Redirects after render (navigating during render would update state mid-render). */
export function Redirect({ to }: { to: string }): null {
  useEffect(() => navigate(to, { replace: true }), [to]);
  return null;
}
