import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Search, Menu, Command, LayoutGrid } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from '../notifications/NotificationBell';
import { PREMIUM_SPRING, MICRO_INTERACTION } from '../../lib/motion';
import { cn } from '../../lib/utils';

export default function Topbar({ onMenuClick }) {
    const { profile, role } = useAuth();
    const { isDark } = useTheme();
    const location = useLocation();

    const pathParts = location.pathname.split('/').filter(Boolean);
    const pageTitle = pathParts.length > 1
        ? pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1).replace('-', ' ')
        : 'Overview';

    const displayName = role === 'brand'
        ? profile?.company_name || 'Brand Entity'
        : role === 'influencer'
            ? profile?.full_name || 'Creator Node'
            : 'System Admin';

    return (
        <header className="relative z-[40] flex items-center justify-between gap-6 px-4 md:px-2">
            {/* Left: Branding/Context */}
            <div className="flex items-center gap-4 lg:hidden">
                <motion.button
                    {...MICRO_INTERACTION}
                    onClick={onMenuClick}
                    className="p-3 rounded-2xl bg-surface-900 border border-white/10 text-text-muted shadow-xl"
                >
                    <Menu size={20} />
                </motion.button>
            </div>

            <div className="hidden lg:flex flex-col">
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2.5 mb-1.5"
                >
                    <div className="p-1 rounded-md bg-primary/10 border border-primary/20">
                        <LayoutGrid size={10} className="text-primary" />
                    </div>
                    <span className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em]">Network Workspace</span>
                </motion.div>
                <h1 className="text-2xl font-display font-black text-white tracking-tighter uppercase">{pageTitle}</h1>
            </div>

            {/* Center: Omni-Search */}
            <div className="flex-1 max-w-2xl hidden md:block">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search size={16} className="text-text-dim group-focus-within:text-primary transition-colors" />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search collaborations, talent, or nodes..."
                        className="w-full bg-surface-950/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-16 text-sm text-white placeholder:text-text-dim focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none backdrop-blur-xl shadow-inner"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-text-dim uppercase tracking-tighter">
                            <Command size={10} /> K
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Global Actions */}
            <div className="flex items-center gap-4 md:gap-6">
                <NotificationBell />
                
                <div className="h-10 w-px bg-white/5 hidden md:block" />

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3.5 p-1 pr-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all cursor-pointer group shadow-xl"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/5 relative overflow-hidden group-hover:scale-105 transition-transform">
                        <span className="relative z-10 text-primary font-black text-xs">{displayName.charAt(0)}</span>
                        <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="hidden sm:flex flex-col">
                        <span className="text-xs font-black text-white truncate max-w-[120px] leading-none mb-1.5 uppercase tracking-wide">{displayName}</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                            <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Node Online</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}
