import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Menu, X } from 'lucide-react';
import { Logo } from './ui';
import { initials } from '../lib/format';
import { navigate } from '../lib/router';

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
  meta?: ReactNode;
  /** Runs instead of navigating to href. */
  onClick?: () => void;
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

interface ShellProps {
  sections: NavSection[];
  activeKey: string;
  user: { name: string; subtitle: string };
  onSignOut: () => void;
  banner?: ReactNode;
  children: ReactNode;
}

export function Shell({ sections, activeKey, user, onSignOut, banner, children }: ShellProps) {
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex flex-col h-full bg-night text-white">
      <div className="px-5 h-16 flex items-center shrink-0 border-b border-night-line">
        <button onClick={() => navigate('')} className="text-left"><Logo light /></button>
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-6">
        {sections.map((section, si) => (
          <div key={si}>
            {section.label && <div className="px-3 mb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/35">{section.label}</div>}
            <ul className="space-y-0.5">
              {section.items.map(item => {
                const active = item.key === activeKey;
                return (
                  <li key={item.key}>
                    <a
                      href={'#/' + item.href}
                      onClick={e => {
                        setOpen(false);
                        if (item.onClick) {
                          e.preventDefault();
                          item.onClick();
                        }
                      }}
                      className={`relative flex items-center gap-3 rounded-lg px-3 h-9 text-[13.5px] transition-colors
                        ${active ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/[0.04]'}`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.06]"
                          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        />
                      )}
                      {active && <motion.span layoutId="nav-bar" className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-brand" />}
                      <span className={`relative shrink-0 ${active ? 'text-white' : 'text-white/45'}`}>{item.icon}</span>
                      <span className="relative flex-1 truncate">{item.label}</span>
                      {item.meta && <span className="relative text-[11px] text-white/40 tabular">{item.meta}</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-night-line shrink-0">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-sm font-semibold shrink-0">{initials(user.name)}</div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">{user.name}</div>
            <div className="text-[11px] text-white/45 truncate">{user.subtitle}</div>
          </div>
          <button onClick={onSignOut} className="p-2 rounded-md text-white/50 hover:text-white hover:bg-white/[0.06]" aria-label="Sign out" title="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30">{sidebar}</aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 h-14 bg-night text-white flex items-center justify-between px-4">
        <button onClick={() => navigate('')}><Logo light /></button>
        <button onClick={() => setOpen(true)} className="p-2 -mr-2 rounded-md hover:bg-white/10" aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="lg:hidden fixed inset-0 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <motion.aside
              className="absolute inset-y-0 left-0 w-[82%] max-w-[300px]"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            >
              {sidebar}
              <button onClick={() => setOpen(false)} className="absolute top-4 -right-11 p-2 rounded-full bg-white text-ink" aria-label="Close menu">
                <X className="w-4 h-4" />
              </button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        {banner}
        <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
