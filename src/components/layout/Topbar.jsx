import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Search, Menu, Command, Sun, Moon, Plus, Bell } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NotificationBell from '../notifications/NotificationBell';
import { MICRO_INTERACTION } from '../../lib/motion';
import { cn } from '../../lib/utils';

const PAGE_SUBTITLES = {
    dashboard:    "Here's what's happening with your brand today.",
    discover:     'Find the right creator for your next campaign.',
    gigs:         'Manage your active and draft campaigns.',
    contracts:    'Track active contracts and milestone approvals.',
    messages:     'Your conversations and collaboration threads.',
    settings:     'Manage your brand account and preferences.',
    proposals:    'Review incoming bids from creators.',
    profile:      'Your public creator profile.',
    users:        'User directory and account management.',
    verification: 'Compliance and verification queue.',
};

const GREET = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
};

export default function Topbar({ onMenuClick }) {
    const { profile, role } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const pathParts = location.pathname.split('/').filter(Boolean);
    const rawSegment = pathParts[1] ?? pathParts[0] ?? 'dashboard';
    const isDashboard = rawSegment === 'dashboard';

    const displayName =
        role === 'brand'      ? (profile?.company_name || 'Brand')  :
        role === 'influencer' ? (profile?.full_name    || 'Creator') :
                                'Admin';

    const subtitle = PAGE_SUBTITLES[rawSegment] ?? '';

    return (
        <header className="relative z-[40] flex items-center justify-between gap-4 px-2 py-1 min-h-[64px]">
            {/* ── Mobile menu ── */}
            <div className="flex items-center gap-3 lg:hidden">
                <motion.button
                    {...MICRO_INTERACTION}
                    onClick={onMenuClick}
                    className={cn(
                        'p-2.5 rounded-xl border text-text-muted',
                        isDark ? 'bg-[#13131a] border-white/10' : 'bg-white border-black/08',
                    )}
                >
                    <Menu size={18} />
                </motion.button>
            </div>

            {/* ── Greeting / Title ── */}
            <div className="hidden lg:flex flex-col gap-0.5 flex-shrink-0">
                {isDashboard ? (
                    <>
                        <motion.h1
                            key="greeting"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                'text-[20px] font-bold leading-tight',
                                isDark ? 'text-white' : 'text-gray-900',
                            )}
                        >
                            {GREET()}, {displayName} 👋
                        </motion.h1>
                        {subtitle && (
                            <p className="text-[13px] text-text-muted leading-none">{subtitle}</p>
                        )}
                    </>
                ) : (
                    <motion.h1
                        key={rawSegment}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            'text-[20px] font-bold capitalize leading-tight',
                            isDark ? 'text-white' : 'text-gray-900',
                        )}
                    >
                        {rawSegment.charAt(0).toUpperCase() + rawSegment.slice(1).replace(/-/g, ' ')}
                    </motion.h1>
                )}
            </div>

            {/* ── Search ── */}
            <div className="flex-1 max-w-md hidden md:block">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                        <Search size={14} className="text-text-dim group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search campaigns, creators..."
                        className={cn(
                            'w-full rounded-xl py-2.5 pl-10 pr-16 text-[13px] placeholder:text-text-dim outline-none transition-all',
                            'focus:ring-2 focus:ring-primary/20 focus:border-primary/40',
                            isDark
                                ? 'bg-white/[0.05] border border-white/[0.08] text-white'
                                : 'bg-gray-100 border border-transparent text-gray-900 focus:bg-white focus:border-gray-300',
                        )}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <div className={cn(
                            'flex items-center gap-0.5 px-1.5 py-1 rounded-md text-[9px] font-bold text-text-dim border',
                            isDark ? 'bg-[#13131a] border-white/[0.07]' : 'bg-white border-black/[0.1]',
                        )}>
                            <Command size={9} /> K
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right actions ── */}
            <div className="flex items-center gap-2.5">
                {/* Theme toggle */}
                <motion.button
                    {...MICRO_INTERACTION}
                    onClick={toggleTheme}
                    className={cn(
                        'p-2.5 rounded-xl border transition-colors',
                        isDark
                            ? 'bg-white/[0.04] border-white/[0.07] text-text-muted hover:text-amber-300 hover:border-amber-300/20'
                            : 'bg-gray-100 border-transparent text-text-muted hover:text-indigo-600 hover:bg-indigo-50',
                    )}
                >
                    <motion.div
                        key={isDark ? 'sun' : 'moon'}
                        initial={{ rotate: -20, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.18 }}
                    >
                        {isDark ? <Sun size={15} /> : <Moon size={15} />}
                    </motion.div>
                </motion.button>

                {/* Notification bell */}
                <NotificationBell />

                {/* New Campaign CTA — only for brand role */}
                {role === 'brand' && (
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/brand/gigs')}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-colors shadow-sm shadow-primary/20 whitespace-nowrap"
                    >
                        <Plus size={15} strokeWidth={2.5} />
                        New Campaign
                    </motion.button>
                )}
            </div>
        </header>
    );
}
