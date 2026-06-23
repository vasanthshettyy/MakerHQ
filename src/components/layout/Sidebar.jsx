import { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Search,
    Briefcase,
    Send,
    FileText,
    MessageSquare,
    Settings,
    LogOut,
    User,
    ShieldCheck,
    ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { PREMIUM_SPRING, MICRO_INTERACTION } from '../../lib/motion';
import makerhqMark from '../../assets/makerhq-mark.png';

const ROLE_NAV_CONFIG = {
    brand: [
        { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard, path: '/brand/dashboard' },
        { id: 'discovery', label: 'Discovery',  icon: Search,           path: '/brand/discover'  },
        { id: 'gigs',      label: 'Campaigns',  icon: Briefcase,        path: '/brand/gigs'      },
        { id: 'contracts', label: 'Contracts',  icon: FileText,         path: '/brand/contracts' },
        { id: 'messages',  label: 'Messages',   icon: MessageSquare,    path: '/brand/messages'  },
        { id: 'settings',  label: 'Settings',   icon: Settings,         path: '/brand/settings'  },
    ],
    influencer: [
        { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard, path: '/influencer/dashboard' },
        { id: 'discovery', label: 'Find Gigs',  icon: Search,           path: '/influencer/gigs'      },
        { id: 'proposals', label: 'My Bids',    icon: Send,             path: '/influencer/proposals' },
        { id: 'contracts', label: 'Contracts',  icon: FileText,         path: '/influencer/contracts' },
        { id: 'messages',  label: 'Messages',   icon: MessageSquare,    path: '/influencer/messages'  },
    ],
    admin: [
        { id: 'dashboard',    label: 'Insights',   icon: LayoutDashboard, path: '/admin/dashboard'    },
        { id: 'users',        label: 'Directory',  icon: User,             path: '/admin/users'        },
        { id: 'gigs',         label: 'Moderation', icon: ShieldCheck,      path: '/admin/gigs'         },
        { id: 'verification', label: 'Compliance', icon: FileText,         path: '/admin/verification' },
        { id: 'settings',     label: 'Engine',     icon: Settings,         path: '/admin/settings'     },
    ],
};

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const { role, profile, user, signOut } = useAuth();
    const { isDark } = useTheme();
    const location = useLocation();

    const navItems = ROLE_NAV_CONFIG[role] || ROLE_NAV_CONFIG.brand;
    const displayName =
        profile?.company_name || profile?.full_name || profile?.display_name ||
        user?.email?.split('@')[0] || 'Member';

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 272 }}
            onMouseEnter={() => setIsCollapsed(false)}
            onMouseLeave={() => setIsCollapsed(true)}
            transition={PREMIUM_SPRING}
            className={cn(
                'z-50 hidden lg:flex flex-col h-full relative group/sidebar overflow-visible',
                'rounded-[2.5rem] border shadow-2xl',
                isDark
                    ? 'bg-surface-950/60 border-white/[0.07] backdrop-blur-2xl'
                    : 'bg-white/70 border-black/[0.06] backdrop-blur-2xl',
            )}
            style={{ boxShadow: isDark
                ? '0 0 0 1px rgba(255,255,255,0.05), 0 32px 64px -12px rgba(0,0,0,0.65)'
                : '0 0 0 1px rgba(0,0,0,0.04), 0 24px 56px -10px rgba(0,0,0,0.12)',
            }}
        >
            {/* Inner gloss highlight */}
            <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-60" />
            </div>

            {/* ── Logo ─────────────────────────────────────── */}
            <div className={cn(
                'p-5 flex items-center gap-3.5 relative shrink-0',
                isCollapsed ? 'justify-center' : 'px-6',
            )}>
                <motion.div
                    {...MICRO_INTERACTION}
                    className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[1.5px] shadow-lg shadow-primary/25 flex-shrink-0"
                >
                    <div className="w-full h-full rounded-[14px] bg-surface-950 flex items-center justify-center overflow-hidden">
                        <img src={makerhqMark} alt="M" className="w-5.5 h-5.5 object-contain" />
                    </div>
                </motion.div>

                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            key="logo-text"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.18 }}
                            className="flex flex-col min-w-0 overflow-hidden"
                        >
                            <span className="text-[15px] font-display font-black text-text-primary tracking-tighter leading-none uppercase">
                                MakerHQ
                            </span>
                            <span className="text-[8px] font-black text-primary uppercase tracking-[0.28em] mt-1 opacity-75">
                                Sync Platform
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Divider */}
            <div className={cn(
                'mx-5 h-px mb-3',
                isDark ? 'bg-white/[0.05]' : 'bg-black/[0.05]',
            )} />

            {/* ── Navigation ───────────────────────────────── */}
            <nav className="flex-1 px-3 space-y-1.5 relative overflow-y-auto overflow-x-visible scrollbar-hide">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    const Icon = item.icon;

                    return (
                        <NavLink key={item.id} to={item.path} className="block group/nav relative">
                            <motion.div
                                layout
                                className={cn(
                                    'relative flex items-center h-11 rounded-2xl transition-colors duration-200 px-3.5 overflow-visible',
                                    isActive
                                        ? cn(
                                            'shadow-[inset_0_0_0_1px_rgba(99,102,241,0.20)]',
                                            isDark
                                                ? 'bg-gradient-to-r from-primary/[0.18] to-secondary/[0.10]'
                                                : 'bg-gradient-to-r from-primary/[0.10] to-secondary/[0.06] shadow-[inset_0_0_0_1px_rgba(99,102,241,0.14)]',
                                        )
                                        : cn(
                                            isDark
                                                ? 'hover:bg-white/[0.04] text-text-muted hover:text-text-primary'
                                                : 'hover:bg-black/[0.03] text-text-muted hover:text-text-primary',
                                        ),
                                )}
                            >
                                {/* Active left indicator pill */}
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active-pill"
                                        className="absolute left-0 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-primary to-secondary"
                                        style={{ boxShadow: '0 0 8px rgba(99,102,241,0.6)' }}
                                        transition={PREMIUM_SPRING}
                                    />
                                )}

                                {/* Icon */}
                                <div className={cn(
                                    'flex items-center justify-center shrink-0 transition-all duration-200',
                                    isActive
                                        ? 'text-primary scale-105'
                                        : 'text-inherit group-hover/nav:scale-110',
                                    isCollapsed ? 'w-full' : '',
                                )}>
                                    <Icon
                                        size={18}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </div>

                                {/* Label */}
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            key="nav-label"
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -8 }}
                                            transition={{ duration: 0.15 }}
                                            className={cn(
                                                'ml-3 text-[11px] font-black uppercase tracking-[0.16em] whitespace-nowrap',
                                                isActive ? 'text-primary' : 'text-inherit',
                                            )}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Collapsed: active chevron hint */}
                                {isCollapsed && isActive && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute -right-1 top-1/2 -translate-y-1/2"
                                    >
                                        <ChevronRight size={10} className="text-primary" />
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Tooltip on collapsed */}
                            {isCollapsed && (
                                <div className={cn(
                                    'absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3.5 py-2 rounded-xl',
                                    'text-[10px] font-black uppercase tracking-widest whitespace-nowrap',
                                    'opacity-0 group-hover/nav:opacity-100 pointer-events-none transition-all duration-150',
                                    'shadow-elevated z-[999] border',
                                    isDark
                                        ? 'bg-surface-900 border-white/10 text-text-primary'
                                        : 'bg-white border-black/10 text-text-primary shadow-lg',
                                )}>
                                    {item.label}
                                    <div className={cn(
                                        'absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent',
                                        isDark ? 'border-r-surface-900' : 'border-r-white',
                                    )} />
                                </div>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* ── Bottom: Profile & Logout ──────────────────── */}
            <div className="p-3 mt-auto space-y-1.5 relative shrink-0">
                {/* Divider */}
                <div className={cn(
                    'mx-2 h-px mb-3',
                    isDark ? 'bg-white/[0.05]' : 'bg-black/[0.05]',
                )} />

                {/* Profile link */}
                <Link
                    to={role === 'influencer' ? '/influencer/profile' : `/${role}/settings`}
                    className="block group/profile"
                >
                    <motion.div
                        className={cn(
                            'flex items-center gap-3 p-2.5 rounded-2xl border transition-all cursor-pointer',
                            isDark
                                ? 'border-transparent hover:border-white/[0.07] hover:bg-white/[0.04]'
                                : 'border-transparent hover:border-black/[0.05] hover:bg-black/[0.03]',
                        )}
                    >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className={cn(
                                'w-10 h-10 rounded-[14px] border overflow-hidden p-[1.5px]',
                                isDark ? 'bg-surface-800 border-white/10' : 'bg-surface-100 border-black/08',
                            )}>
                                {profile?.avatar_url || profile?.logo_url ? (
                                    <img
                                        src={profile.avatar_url || profile.logo_url}
                                        alt=""
                                        className="w-full h-full object-cover rounded-[11px]"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 to-secondary/20 rounded-[11px] text-primary font-black text-xs uppercase">
                                        {displayName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            {/* Online dot */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-surface-950 rounded-full shadow-sm" />
                        </div>

                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.div
                                    key="profile-text"
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.15 }}
                                    className="flex flex-col min-w-0"
                                >
                                    <span className="text-[12px] font-bold text-text-primary truncate leading-tight">
                                        {displayName}
                                    </span>
                                    <span className="text-[8px] font-black text-text-dim uppercase tracking-[0.22em] mt-1 flex items-center gap-1.5">
                                        <div className="w-1 h-1 rounded-full bg-primary" />
                                        {role} Node
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </Link>

                {/* Logout button */}
                <button
                    onClick={() => signOut()}
                    className={cn(
                        'w-full flex items-center h-10 rounded-2xl transition-all duration-200 px-3.5 group/logout cursor-pointer',
                        'text-rose-400/40 hover:text-rose-400',
                        isDark
                            ? 'hover:bg-rose-500/10'
                            : 'hover:bg-rose-50',
                    )}
                >
                    <div className={cn(
                        'flex items-center justify-center shrink-0 transition-transform duration-200 group-hover/logout:-translate-x-0.5',
                        isCollapsed ? 'w-full' : '',
                    )}>
                        <LogOut size={16} />
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                key="logout-label"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.15 }}
                                className="ml-3 text-[10px] font-black uppercase tracking-[0.2em]"
                            >
                                Sign Out
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.aside>
    );
}
