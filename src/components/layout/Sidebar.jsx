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
    Milestone,
    CreditCard,
    Star,
    BookImage,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { PREMIUM_SPRING, MICRO_INTERACTION } from '../../lib/motion';
import makerhqMark from '../../assets/makerhq-mark.png';

const ROLE_NAV_CONFIG = {
    brand: [
        { id: 'dashboard', label: 'Overview',    icon: LayoutDashboard, path: '/brand/dashboard' },
        { id: 'discovery', label: 'Discover',    icon: Search,          path: '/brand/discover'  },
        { id: 'gigs',      label: 'Campaigns',   icon: Briefcase,       path: '/brand/gigs'      },
        { id: 'proposals', label: 'Proposals',   icon: Send,            path: '/brand/applications' },
        { id: 'contracts', label: 'Contracts',   icon: FileText,        path: '/brand/contracts' },
        { id: 'milestone', label: 'Milestones',  icon: Milestone,       path: '/brand/contracts' },
        { id: 'messages',  label: 'Messages',    icon: MessageSquare,   path: '/brand/messages', badge: 3 },
        { id: 'payments',  label: 'Payments',    icon: CreditCard,      path: '/brand/settings'  },
        { id: 'reviews',   label: 'Reviews',     icon: Star,            path: '/brand/settings'  },
        { id: 'mediakit',  label: 'Media Kit',   icon: BookImage,       path: '/brand/settings'  },
    ],
    influencer: [
        { id: 'dashboard', label: 'Overview',    icon: LayoutDashboard, path: '/influencer/dashboard' },
        { id: 'discovery', label: 'Find Gigs',   icon: Search,          path: '/influencer/gigs'      },
        { id: 'proposals', label: 'My Bids',     icon: Send,            path: '/influencer/proposals' },
        { id: 'contracts', label: 'Contracts',   icon: FileText,        path: '/influencer/contracts' },
        { id: 'messages',  label: 'Messages',    icon: MessageSquare,   path: '/influencer/messages'  },
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
            animate={{ width: isCollapsed ? 80 : 240 }}
            onMouseEnter={() => setIsCollapsed(false)}
            onMouseLeave={() => setIsCollapsed(true)}
            transition={PREMIUM_SPRING}
            className={cn(
                'z-50 hidden lg:flex flex-col h-full relative group/sidebar overflow-hidden',
                'rounded-[2rem]',
                isDark
                    ? 'bg-[#13131a] border border-white/[0.06]'
                    : 'bg-white border border-black/[0.07] shadow-xl',
            )}
        >
            {/* ── Logo ─────────────────────────── */}
            <div className={cn(
                'px-5 pt-6 pb-4 flex items-center gap-3 shrink-0',
                isCollapsed ? 'justify-center' : '',
            )}>
                <motion.div
                    {...MICRO_INTERACTION}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20"
                >
                    <span className="text-white font-black text-lg">M</span>
                </motion.div>

                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            key="logo-text"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.16 }}
                            className="flex flex-col min-w-0 overflow-hidden"
                        >
                            <span className={cn(
                                'text-[15px] font-black tracking-tight leading-none',
                                isDark ? 'text-white' : 'text-gray-900',
                            )}>
                                MakerHQ
                            </span>
                            <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.22em] mt-0.5">
                                BRANDSYNC
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Navigation ───────────────────── */}
            <nav className="flex-1 px-3 space-y-0.5 py-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    const Icon = item.icon;

                    return (
                        <NavLink key={item.id} to={item.path} className="block group/nav relative">
                            <motion.div
                                className={cn(
                                    'relative flex items-center h-10 rounded-xl transition-colors duration-150 px-3 gap-3',
                                    isActive
                                        ? 'bg-primary text-white shadow-sm shadow-primary/30'
                                        : cn(
                                            'text-text-muted',
                                            isDark
                                                ? 'hover:bg-white/[0.05] hover:text-white'
                                                : 'hover:bg-gray-100 hover:text-gray-900',
                                        ),
                                )}
                            >
                                {/* Icon */}
                                <div className={cn(
                                    'flex items-center justify-center shrink-0',
                                    isCollapsed ? 'w-full' : 'w-5',
                                    isActive ? 'text-white' : '',
                                )}>
                                    <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                                </div>

                                {/* Label */}
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            key="nav-label"
                                            initial={{ opacity: 0, x: -6 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -6 }}
                                            transition={{ duration: 0.14 }}
                                            className={cn(
                                                'text-[13px] font-semibold whitespace-nowrap flex-1',
                                                isActive ? 'text-white' : '',
                                            )}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Badge */}
                                {!isCollapsed && item.badge && (
                                    <span className={cn(
                                        'text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                                        isActive
                                            ? 'bg-white/20 text-white'
                                            : 'bg-primary text-white',
                                    )}>
                                        {item.badge}
                                    </span>
                                )}
                            </motion.div>

                            {/* Collapsed tooltip */}
                            {isCollapsed && (
                                <div className={cn(
                                    'absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-xl',
                                    'text-[11px] font-semibold whitespace-nowrap',
                                    'opacity-0 group-hover/nav:opacity-100 pointer-events-none transition-opacity duration-150',
                                    'z-[999] border shadow-lg',
                                    isDark
                                        ? 'bg-[#13131a] border-white/10 text-white'
                                        : 'bg-white border-black/10 text-gray-900',
                                )}>
                                    {item.label}
                                    {item.badge && (
                                        <span className="ml-1.5 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-full">{item.badge}</span>
                                    )}
                                </div>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* ── Profile footer ───────────────── */}
            <div className={cn(
                'p-3 pb-5 shrink-0 border-t',
                isDark ? 'border-white/[0.06]' : 'border-black/[0.06]',
            )}>
                <Link
                    to={role === 'influencer' ? '/influencer/profile' : `/${role}/settings`}
                    className="block group/profile"
                >
                    <div className={cn(
                        'flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors',
                        isDark ? 'hover:bg-white/[0.05]' : 'hover:bg-gray-100',
                    )}>
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center">
                                {profile?.avatar_url || profile?.logo_url ? (
                                    <img src={profile.avatar_url || profile.logo_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-primary font-black text-sm">{displayName.charAt(0)}</span>
                                )}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#13131a] rounded-full" />
                        </div>

                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.div
                                    key="profile-text"
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -6 }}
                                    transition={{ duration: 0.14 }}
                                    className="flex-1 min-w-0"
                                >
                                    <span className={cn(
                                        'text-[12px] font-bold truncate block leading-tight',
                                        isDark ? 'text-white' : 'text-gray-900',
                                    )}>
                                        {displayName}
                                    </span>
                                    <span className="text-[10px] text-text-muted capitalize">{role} Account ↓</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Settings icon */}
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.button
                                    key="settings-btn"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={(e) => { e.preventDefault(); signOut(); }}
                                    className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 transition-colors"
                                    title="Sign out"
                                >
                                    <LogOut size={13} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </Link>
            </div>
        </motion.aside>
    );
}
