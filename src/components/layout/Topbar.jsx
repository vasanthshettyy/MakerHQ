import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Search, Menu, Command, Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import NotificationBell from '../notifications/NotificationBell';
import { MICRO_INTERACTION } from '../../lib/motion';
import { cn } from '../../lib/utils';

const PAGE_LABELS = {
    dashboard:    'Dashboard',
    discover:     'Discovery',
    gigs:         'Campaigns',
    contracts:    'Contracts',
    messages:     'Messages',
    settings:     'Settings',
    proposals:    'My Bids',
    profile:      'Profile',
    users:        'Directory',
    verification: 'Compliance',
};

export default function Topbar({ onMenuClick }) {
    const { profile, role } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();

    const pathParts = location.pathname.split('/').filter(Boolean);
    const rawSegment = pathParts[1] ?? pathParts[0] ?? '';
    const pageTitle = PAGE_LABELS[rawSegment] ?? (rawSegment.charAt(0).toUpperCase() + rawSegment.slice(1).replace(/-/g, ' ') || 'Overview');

    const displayName =
        role === 'brand'      ? (profile?.company_name || 'Brand Entity')  :
        role === 'influencer' ? (profile?.full_name    || 'Creator Node')  :
                                'System Admin';

    return (
        <header className={cn(
            'relative z-[40] flex items-center justify-between gap-6 px-4 md:px-2 py-1',
        )}>
            {/* ── Mobile menu button ─── */}
            <div className="flex items-center gap-4 lg:hidden">
                <motion.button
                    {...MICRO_INTERACTION}
                    onClick={onMenuClick}
                    className={cn(
                        'p-3 rounded-2xl border text-text-muted shadow-xl transition-colors',
                        isDark
                            ? 'bg-surface-900 border-white/10 hover:text-text-primary'
                            : 'bg-white border-black/08 hover:text-text-primary',
                    )}
                >
                    <Menu size={20} />
                </motion.button>
            </div>

            {/* ── Page title (desktop) ─── */}
            <div className="hidden lg:flex flex-col gap-1">
                {/* Breadcrumb eyebrow */}
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-80" />
                    <span className={cn(
                        'text-[9px] font-black uppercase tracking-[0.3em]',
                        isDark ? 'text-text-dim' : 'text-text-muted',
                    )}>
                        {role ?? 'workspace'} · network
                    </span>
                </div>
                <motion.h1
                    key={pageTitle}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className="text-[22px] font-display font-black text-text-primary tracking-tight leading-none uppercase"
                >
                    {pageTitle}
                </motion.h1>
            </div>

            {/* ── Omni-search ─── */}
            <div className="flex-1 max-w-xl hidden md:block">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search size={15} className="text-text-dim group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search campaigns, talent, gigs…"
                        className={cn(
                            'w-full rounded-2xl py-3 pl-11 pr-16 text-sm placeholder:text-text-dim outline-none transition-all',
                            'focus:ring-4 focus:ring-primary/10 focus:border-primary/40',
                            isDark
                                ? 'bg-surface-950/40 border border-white/[0.07] text-text-primary backdrop-blur-xl'
                                : 'bg-black/[0.03] border border-black/[0.07] text-text-primary',
                        )}
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <div className={cn(
                            'flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black text-text-dim uppercase tracking-tighter border',
                            isDark ? 'bg-surface-900 border-white/[0.07]' : 'bg-white border-black/[0.07]',
                        )}>
                            <Command size={9} /> K
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right action cluster ─── */}
            <div className="flex items-center gap-3">
                {/* Theme toggle */}
                <motion.button
                    {...MICRO_INTERACTION}
                    onClick={toggleTheme}
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    className={cn(
                        'relative p-2.5 rounded-2xl border transition-colors overflow-hidden group',
                        isDark
                            ? 'bg-surface-900/60 border-white/[0.07] text-text-muted hover:text-amber-300 hover:border-amber-400/20 hover:bg-amber-400/[0.07]'
                            : 'bg-white border-black/[0.07] text-text-muted hover:text-indigo-500 hover:border-primary/20 hover:bg-primary/[0.06]',
                    )}
                >
                    <motion.div
                        key={isDark ? 'sun' : 'moon'}
                        initial={{ rotate: -30, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    </motion.div>
                </motion.button>

                {/* Notification bell */}
                <NotificationBell />

                {/* Divider */}
                <div className={cn(
                    'h-8 w-px hidden md:block',
                    isDark ? 'bg-white/[0.07]' : 'bg-black/[0.08]',
                )} />

                {/* User chip */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                        'flex items-center gap-3 p-1 pr-4 rounded-2xl border cursor-pointer group transition-all',
                        isDark
                            ? 'bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.06] hover:border-white/10 shadow-xl'
                            : 'bg-white border-black/[0.07] hover:bg-black/[0.02] hover:border-black/10 shadow-md',
                    )}
                >
                    <div className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center border relative overflow-hidden group-hover:scale-105 transition-transform',
                        isDark
                            ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-white/10'
                            : 'bg-gradient-to-br from-primary/15 to-secondary/15 border-primary/15',
                    )}>
                        <span className="relative z-10 text-primary font-black text-xs">
                            {displayName.charAt(0)}
                        </span>
                        <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="hidden sm:flex flex-col">
                        <span className="text-[11px] font-black text-text-primary truncate max-w-[110px] leading-none mb-1.5 uppercase tracking-wide">
                            {displayName}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                            <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.18em]">
                                Online
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}
