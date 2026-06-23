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
    Sparkles,
    ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { PREMIUM_SPRING, MICRO_INTERACTION } from '../../lib/motion';
import makerhqMark from '../../assets/makerhq-mark.png';

const ROLE_NAV_CONFIG = {
    brand: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/brand/dashboard' },
        { id: 'discovery', label: 'Discovery', icon: Search, path: '/brand/discover' },
        { id: 'gigs', label: 'Campaigns', icon: Briefcase, path: '/brand/gigs' },
        { id: 'contracts', label: 'Contracts', icon: FileText, path: '/brand/contracts' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/brand/messages' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/brand/settings' },
    ],
    influencer: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/influencer/dashboard' },
        { id: 'discovery', label: 'Find Gigs', icon: Search, path: '/influencer/gigs' },
        { id: 'proposals', label: 'My Bids', icon: Send, path: '/influencer/proposals' },
        { id: 'contracts', label: 'Contracts', icon: FileText, path: '/influencer/contracts' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/influencer/messages' },
    ],
    admin: [
        { id: 'dashboard', label: 'Insights', icon: LayoutDashboard, path: '/admin/dashboard' },
        { id: 'users', label: 'Directory', icon: User, path: '/admin/users' },
        { id: 'gigs', label: 'Moderation', icon: ShieldCheck, path: '/admin/gigs' },
        { id: 'verification', label: 'Compliance', icon: FileText, path: '/admin/verification' },
        { id: 'settings', label: 'Engine', icon: Settings, path: '/admin/settings' },
    ],
};

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const { role, profile, user, signOut } = useAuth();
    const { isDark } = useTheme();
    const location = useLocation();

    const navItems = ROLE_NAV_CONFIG[role] || ROLE_NAV_CONFIG.brand;
    const displayName = profile?.company_name || profile?.full_name || profile?.display_name || user?.email?.split('@')[0] || 'Member';

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 88 : 280 }}
            onMouseEnter={() => setIsCollapsed(false)}
            onMouseLeave={() => setIsCollapsed(true)}
            transition={PREMIUM_SPRING}
            className={cn(
                "z-50 hidden lg:flex flex-col h-full relative group/sidebar",
                "glass-card !rounded-[2.5rem] border-border shadow-2xl overflow-hidden",
                isDark ? "bg-surface-950/40" : "bg-white/50 backdrop-blur-xl"
            )}
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-transparent opacity-30" />

            {/* Header: Logo */}
            <div className={cn("p-6 flex items-center gap-4 relative", isCollapsed ? "justify-center" : "px-7")}>
                <motion.div 
                    {...MICRO_INTERACTION}
                    className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[1px] shadow-xl shadow-primary/20 flex-shrink-0"
                >
                    <div className="w-full h-full rounded-[15px] bg-surface-950 flex items-center justify-center overflow-hidden">
                        <img src={makerhqMark} alt="M" className="w-6 h-6 object-contain" />
                    </div>
                </motion.div>
                
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex flex-col min-w-0"
                        >
                            <span className="text-lg font-display font-black text-text-primary tracking-tight leading-none uppercase">MakerHQ</span>
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.25em] mt-1.5 opacity-80">Sync Platform</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 mt-6 relative overflow-y-auto overflow-x-hidden scrollbar-hide">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    const Icon = item.icon;

                    return (
                        <NavLink key={item.id} to={item.path} className="block group/nav">
                            <motion.div
                                className={cn(
                                    "relative flex items-center h-12 rounded-2xl transition-all duration-300 px-4",
                                    isActive 
                                        ? "text-primary dark:text-white bg-gradient-to-r from-primary/10 to-secondary/10 dark:bg-white/5 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.12)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] border border-primary/10 dark:border-white/5" 
                                        : "text-text-muted hover:text-text-primary hover:bg-black/[0.02] dark:hover:bg-white/[0.04]"
                                )}
                            >
                                {isActive && (
                                    <motion.div 
                                        layoutId="sidebar-active-pill"
                                        className="absolute left-0 w-1.5 h-5 bg-primary rounded-r-full shadow-glow"
                                        transition={PREMIUM_SPRING}
                                    />
                                )}

                                <div className={cn(
                                    "flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/nav:scale-110",
                                    isActive ? "text-primary" : "text-inherit"
                                )}>
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>

                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="ml-4 text-[13px] font-black uppercase tracking-widest whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {isCollapsed && (
                                    <div className="absolute left-full ml-6 px-4 py-2.5 rounded-xl bg-surface-950 border border-border text-[10px] font-black uppercase tracking-widest text-white opacity-0 group-hover/nav:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-elevated z-50">
                                        {item.label}
                                    </div>
                                )}
                            </motion.div>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Bottom Actions: Profile & Exit */}
            <div className="p-4 mt-auto space-y-3 relative">
                <Link to={role === 'influencer' ? '/influencer/profile' : `/${role}/settings`}>
                    <motion.div
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                        className={cn(
                            "flex items-center gap-3 p-2.5 rounded-[1.75rem] border border-transparent transition-all cursor-pointer",
                            !isCollapsed && "hover:border-white/10"
                        )}
                    >
                        <div className="relative shrink-0">
                            <div className="w-11 h-11 rounded-2xl bg-surface-800 border border-border overflow-hidden shadow-inner p-0.5">
                                {profile?.avatar_url || profile?.logo_url ? (
                                    <img src={profile.avatar_url || profile.logo_url} alt="" className="w-full h-full object-cover rounded-[14px]" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-700 to-surface-900 text-text-primary font-black text-xs uppercase">
                                        {displayName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-surface-950 rounded-full shadow-lg shadow-success/20" />
                        </div>

                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col min-w-0"
                            >
                                <span className="text-sm font-bold text-text-primary truncate leading-tight">{displayName}</span>
                                <span className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-primary" />
                                    {role} Node
                                </span>
                            </motion.div>
                        )}
                    </motion.div>
                </Link>

                <button
                    onClick={() => signOut()}
                    className={cn(
                        "w-full flex items-center h-12 rounded-2xl transition-all duration-300 px-4 group/logout",
                        "text-rose-400/40 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    )}
                >
                    <LogOut size={20} className="shrink-0 transition-transform group-hover/logout:-translate-x-1" />
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="ml-4 text-[11px] font-black uppercase tracking-widest"
                        >
                            Node Exit
                        </motion.span>
                    )}
                </button>
            </div>
        </motion.aside>
    );
}
