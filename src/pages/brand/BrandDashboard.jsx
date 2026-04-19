import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../../components/layout/PageWrapper';
import { useCountUp } from '../../hooks/useCountUp';
import SkeletonCard from '../../components/ui/SkeletonCard';
import {
    Users, Megaphone, FileText, IndianRupee,
    ArrowUpRight, Bell, Loader2, Sparkles,
    Calendar, Inbox, Rocket, Settings,
    Zap, BarChart3, Target, Search
} from 'lucide-react';
import { MICRO_INTERACTION, PREMIUM_SPRING, STAGGER_CONTAINER, STAGGER_ITEM } from '../../lib/motion';
import { cn, formatINR, formatRelativeTime } from '../../lib/utils';

const KPICard = ({ title, value, trend, trendValue, icon: Icon, isHero = false, loading = false, onClick }) => {
    return (
        <motion.div
            variants={STAGGER_ITEM}
            {...MICRO_INTERACTION}
            onClick={onClick}
            className={cn(
                "glass-card group p-8 flex flex-col justify-between min-h-[180px] cursor-pointer relative overflow-hidden",
                isHero ? "bg-gradient-to-br from-primary to-secondary md:col-span-2" : "hover:border-primary/40 bg-surface-900/40"
            )}
        >
            <div className={cn(
                "absolute -right-8 -bottom-8 w-32 h-32 blur-3xl rounded-full transition-opacity duration-500",
                isHero ? "bg-white/20 opacity-30" : "bg-primary/10 opacity-0 group-hover:opacity-100"
            )} />

            <div className="relative z-10 flex items-center justify-between mb-6">
                <div className={cn(
                    "p-2.5 rounded-2xl border transition-colors",
                    isHero ? "bg-white/10 border-white/20 text-white" : "bg-primary/10 border-primary/20 text-primary"
                )}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border transition-all shadow-sm",
                    isHero 
                        ? "bg-white/10 text-white border-white/20" 
                        : trend === 'up' ? "bg-success/10 text-success border-success/20 shadow-success/5" : "bg-warning/10 text-warning border-warning/20"
                )}>
                    {trend === 'up' ? '↑' : '↓'} {trendValue}
                </div>
            </div>

            <div className="relative z-10">
                <p className={cn(
                    "text-[10px] font-black uppercase tracking-[0.25em] mb-1.5",
                    isHero ? "text-white/60" : "text-text-dim"
                )}>{title}</p>
                {loading ? (
                    <div className="h-10 w-24 bg-white/5 animate-pulse rounded-xl" />
                ) : (
                    <h2 className={cn(
                        "text-3xl font-display font-black tracking-tight",
                        isHero ? "text-white" : "text-white"
                    )}>{value}</h2>
                )}
            </div>
            
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500">
                <ArrowUpRight size={18} className={isHero ? "text-white" : "text-primary"} />
            </div>
        </motion.div>
    );
};

export default function BrandDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ reach: 0, activeGigs: 0, totalSpent: 0, contracts: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const animatedReach = useCountUp(stats.reach);
    const animatedActiveGigs = useCountUp(stats.activeGigs);
    const animatedTotalSpent = useCountUp(stats.totalSpent);
    const animatedContracts = useCountUp(stats.contracts);

    async function fetchDashboardData() {
        if (!user) return;
        setLoading(true);
        try {
            const { count: activeGigs } = await supabase.from('gigs').select('*', { count: 'exact', head: true }).eq('brand_id', user.id).eq('status', 'Open');
            const { data: contractsData, error: contractsError } = await supabase.from('contracts').select('*, profiles_influencer(followers_count), contract_milestones(status)').eq('brand_id', user.id);
            if (contractsError) throw contractsError;

            const reach = (contractsData || []).reduce((acc, c) => acc + (c.profiles_influencer?.followers_count || 0), 0);
            const spent = (contractsData || []).reduce((acc, c) => {
                const approvedCount = (c.contract_milestones || []).filter(m => m.status === 'Approved').length;
                return acc + (c.agreed_price / 3) * approvedCount;
            }, 0);

            setStats({ reach, activeGigs: activeGigs || 0, totalSpent: spent, contracts: (contractsData || []).length });
            const { data: notifications } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5);
            setRecentActivity(notifications || []);
        } catch (err) { console.error('Dashboard Fetch Error:', err); }
        finally { setLoading(false); }
    }

    useEffect(() => {
        fetchDashboardData();
        const channel = supabase.channel(`brand-dash-${user?.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user?.id}` }, () => fetchDashboardData()).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [user]);

    if (loading) return (
        <PageWrapper title="Overview" subtitle="Real-time performance telemetry for your node network.">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} height="h-44" />)}
            </div>
        </PageWrapper>
    );

    return (
        <PageWrapper title="Overview" subtitle="Real-time performance telemetry for your node network.">
            <div className="space-y-12 pb-20">
                {/* Stats Matrix */}
                <motion.div 
                    variants={STAGGER_CONTAINER}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <KPICard title="Platform Reach" value={animatedReach.toLocaleString()} trend="up" trendValue="+12%" icon={Users} isHero onClick={() => navigate('/brand/contracts')} />
                    <KPICard title="Live Channels" value={animatedActiveGigs} trend="up" trendValue="+2" icon={Target} onClick={() => navigate('/brand/gigs')} />
                    <KPICard title="Capital Sync" value={formatINR(animatedTotalSpent)} trend="down" trendValue="-4%" icon={IndianRupee} onClick={() => navigate('/brand/contracts')} />
                    <KPICard title="Active Nodes" value={animatedContracts} trend="up" trendValue="+1" icon={Zap} onClick={() => navigate('/brand/contracts')} />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Activity Feed */}
                    <motion.div 
                        variants={STAGGER_ITEM}
                        initial="hidden"
                        animate="show"
                        className="lg:col-span-2 glass-card !rounded-[2.5rem] p-8 border-white/5 bg-surface-900/20 shadow-2xl relative"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-glow">
                                    <BarChart3 size={22} />
                                </div>
                                <h3 className="text-2xl font-display font-black text-white tracking-tight uppercase">Signal Stream</h3>
                            </div>
                            <motion.button {...MICRO_INTERACTION} onClick={() => navigate('/brand/messages')} className="btn-secondary py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.25em] cursor-pointer">Review Audit</motion.button>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((activity) => (
                                        <motion.div
                                            layout
                                            key={activity.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            onClick={() => activity.link && navigate(activity.link)}
                                            className="flex items-center gap-5 p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary/20 hover:translate-x-1 transition-all group cursor-pointer"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-surface-950 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-inner shrink-0">
                                                <Bell size={18} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-white truncate leading-tight mb-1">{activity.title}</p>
                                                <p className="text-xs text-text-muted truncate font-medium opacity-80">{activity.message}</p>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-text-dim bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">{formatRelativeTime(activity.created_at)}</span>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="py-24 flex flex-col items-center justify-center text-center opacity-30">
                                        <Inbox size={56} strokeWidth={1} className="mb-6 text-text-dim" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero Signals Identified</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Quick Access Actions */}
                    <div className="space-y-8">
                        <motion.div 
                            variants={STAGGER_ITEM}
                            initial="hidden"
                            animate="show"
                            className="glass-card !rounded-[2.5rem] p-8 border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent shadow-elevated"
                        >
                            <h3 className="text-xl font-display font-black text-white tracking-tight mb-10 uppercase">Node Access</h3>
                            <div className="space-y-5">
                                {[
                                    { label: 'Broadcast Node', icon: Rocket, path: '/brand/gigs', color: 'text-primary' },
                                    { label: 'Talent Scout', icon: Search, path: '/brand/discover', color: 'text-secondary' },
                                    { label: 'System Engine', icon: Settings, path: '/brand/settings', color: 'text-text-muted' },
                                    { label: 'Capital Node', icon: IndianRupee, path: '/brand/settings', color: 'text-success' }
                                ].map((action) => (
                                    <motion.button
                                        key={action.label}
                                        whileHover={{ scale: 1.02, x: 4, backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate(action.path)}
                                        className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/40 transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-xl bg-surface-950 border border-white/5 group-hover:text-primary transition-colors">
                                                <action.icon size={16} className={cn("transition-all", action.color)} />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest text-text-secondary group-hover:text-white transition-colors">{action.label}</span>
                                        </div>
                                        <ArrowUpRight size={16} className="text-text-dim group-hover:text-primary transition-all opacity-40 group-hover:opacity-100" />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Node Optimization Card */}
                        <motion.div variants={STAGGER_ITEM} className="p-8 rounded-[2.5rem] bg-primary/10 border border-primary/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                            <div className="relative z-10">
                                <Sparkles size={24} className="text-primary mb-4" />
                                <h4 className="text-lg font-display font-black text-white tracking-tight uppercase mb-2">Protocol 2.0</h4>
                                <p className="text-xs text-text-muted leading-relaxed mb-6 font-medium">Activate predictive node matching and unlimited transmission lanes.</p>
                                <button className="text-[10px] font-black text-primary uppercase tracking-[0.3em] group-hover:underline cursor-pointer">Upgrade Engine →</button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
