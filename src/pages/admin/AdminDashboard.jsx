import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import PageWrapper from '../../components/layout/PageWrapper';
import { STAGGER_CONTAINER, STAGGER_ITEM, PREMIUM_SPRING, MICRO_INTERACTION } from '../../lib/motion';
import { formatINR, formatRelativeTime, cn } from '../../lib/utils';
import { STATUS_COLORS } from '../../lib/constants';
import { 
    AlertCircle, CheckCircle, XCircle, Clock, 
    IndianRupee, Users, Megaphone, FileText, 
    ArrowUpRight, ShieldAlert, Zap, Search,
    Filter, Database, BarChart3, Inbox
} from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';
import SkeletonCard from '../../components/ui/SkeletonCard';

const AdminKPICard = ({ title, value, icon: Icon, colorClass, trend, trendValue, isHero = false, loading = false, onClick }) => {
    return (
        <motion.div
            variants={STAGGER_ITEM}
            {...MICRO_INTERACTION}
            onClick={onClick}
            className={cn(
                "glass-card group p-6 flex flex-col justify-between min-h-[160px] cursor-pointer relative overflow-hidden",
                isHero ? "bg-gradient-to-br from-primary to-secondary md:col-span-2" : "hover:border-primary/30"
            )}
        >
            <div className={cn(
                "absolute -right-8 -bottom-8 w-32 h-32 blur-3xl rounded-full transition-opacity duration-500",
                isHero ? "bg-white/20 opacity-40" : "bg-primary/10 opacity-0 group-hover:opacity-100"
            )} />

            <div className="relative z-10 flex items-center justify-between mb-4">
                <div className={cn(
                    "p-2 rounded-xl border transition-colors",
                    isHero ? "bg-white/10 border-white/20 text-white" : "bg-primary/10 border-primary/20 text-primary"
                )}>
                    <Icon size={18} />
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        isHero 
                            ? "bg-white/10 text-white border border-white/20" 
                            : "bg-success/10 text-success border border-success/20"
                    )}>
                        {trend === 'up' ? '↑' : '↓'} {trendValue}
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <p className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] mb-1",
                    isHero ? "text-white/70" : "text-text-muted"
                )}>{title}</p>
                {loading ? (
                    <div className="h-10 w-24 bg-white/10 animate-pulse rounded-xl" />
                ) : (
                    <h2 className={cn(
                        "text-3xl font-display font-black tracking-tighter",
                        isHero ? "text-white" : "text-white"
                    )}>{value}</h2>
                )}
            </div>
            
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                <ArrowUpRight size={16} className={isHero ? "text-white" : "text-primary"} />
            </div>
        </motion.div>
    );
};

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeGigs: 0,
        activeContracts: 0,
        gmv: 0
    });
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const animatedUsers = useCountUp(stats.totalUsers);
    const animatedGigs = useCountUp(stats.activeGigs);
    const animatedContracts = useCountUp(stats.activeContracts);
    const animatedGMV = useCountUp(stats.gmv);

    async function fetchStats() {
        setLoading(true);
        try {
            const [usersRes, gigsRes, contractsRes, listRes] = await Promise.all([
                supabase.from('users').select('*', { count: 'exact', head: true }),
                supabase.from('gigs').select('*', { count: 'exact', head: true }).eq('status', 'Open'),
                supabase.from('contracts').select('agreed_price, status, contract_milestones(status)'),
                supabase.from('contracts')
                    .select('id, status, agreed_price, created_at, gigs(title), profiles_brand(company_name), profiles_influencer(full_name)')
                    .order('created_at', { ascending: false })
                    .limit(20)
            ]);

            const activeContracts = (contractsRes.data || []).filter(c => c.status === 'Active').length;

            const gmv = (contractsRes.data || []).reduce((acc, c) => {
                const approvedCount = (c.contract_milestones || []).filter(m => m.status === 'Approved').length;
                return acc + (c.agreed_price / 3) * approvedCount;
            }, 0);

            setStats({
                totalUsers: usersRes.count || 0,
                activeGigs: gigsRes.count || 0,
                activeContracts,
                gmv
            });

            setContracts(listRes.data || []);
        } catch (err) {
            console.error('Error fetching admin stats:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStats();
    }, []);

    const resolveDispute = async (contractId) => {
        setActionLoading(contractId);
        try {
            const { error } = await supabase
                .from('contracts')
                .update({ status: 'Cancelled' })
                .eq('id', contractId);

            if (error) throw error;
            await fetchStats();
        } catch (err) {
            console.error('Error resolving dispute:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const disputedContracts = contracts.filter(c => c.status === 'Disputed');

    return (
        <PageWrapper title="Intelligence Core" subtitle="Global platform telemetry and moderation control.">
            <div className="space-y-10">
                {/* KPI Matrix */}
                <motion.div 
                    variants={STAGGER_CONTAINER}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <AdminKPICard title="Platform Reach" value={animatedUsers.toLocaleString()} icon={Users} isHero trend="up" trendValue="+4%" loading={loading} />
                    <AdminKPICard title="Active Channels" value={animatedGigs} icon={Megaphone} trend="up" trendValue="+2" loading={loading} />
                    <AdminKPICard title="Live Execution" value={animatedContracts} icon={Zap} trend="up" trendValue="+5%" loading={loading} />
                    <AdminKPICard title="Total Yield (GMV)" value={formatINR(animatedGMV)} icon={IndianRupee} trend="up" trendValue="+12%" loading={loading} />
                </motion.div>

                {/* Dispute Intervention */}
                <AnimatePresence>
                    {disputedContracts.length > 0 && (
                        <motion.section 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3 px-2">
                                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-glow shadow-rose-500/10">
                                    <ShieldAlert size={18} />
                                </div>
                                <h2 className="text-xl font-display font-black text-white tracking-tight uppercase">Dispute Protocol</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {disputedContracts.map((contract) => (
                                    <motion.div
                                        key={contract.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="glass-card !rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-rose-500/30 bg-rose-500/5 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white text-lg truncate mb-1">{contract.gigs?.title}</h3>
                                            <div className="flex items-center gap-3 text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">
                                                <span>Brand: <span className="text-white">{contract.profiles_brand?.company_name}</span></span>
                                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                                <span>Creator: <span className="text-white">{contract.profiles_influencer?.full_name}</span></span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 shrink-0">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Locked Capital</p>
                                                <p className="text-xl font-display font-black text-white">{formatINR(contract.agreed_price)}</p>
                                            </div>
                                            <motion.button
                                                {...MICRO_INTERACTION}
                                                onClick={() => resolveDispute(contract.id)}
                                                disabled={actionLoading === contract.id}
                                                className="px-6 py-3.5 rounded-xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
                                            >
                                                {actionLoading === contract.id ? <Loader2 size={16} className="animate-spin" /> : 'Terminate Node'}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Global Ledger */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-glow">
                                <Database size={18} />
                            </div>
                            <h2 className="text-xl font-display font-black text-white tracking-tight uppercase">Platform Ledger</h2>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[9px] font-black text-text-dim uppercase tracking-widest leading-none">Sync Status:</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[9px] font-black text-success uppercase tracking-widest leading-none">Nominal</span>
                        </div>
                    </div>

                    <div className="data-table-container">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse data-table">
                                <thead>
                                    <tr className="bg-white/[0.01]">
                                        <th>Node Title</th>
                                        <th>Brand Entity</th>
                                        <th>Creator Node</th>
                                        <th className="text-right">Allocation</th>
                                        <th>Status</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        [...Array(6)].map((_, i) => (
                                            <tr key={i} className="animate-pulse opacity-40">
                                                {[...Array(6)].map((_, j) => (
                                                    <td key={j} className="p-4"><div className="h-4 bg-white/5 rounded w-full"></div></td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : contracts.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-24 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-20">
                                                    <Inbox size={48} strokeWidth={1} />
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Ledger Empty</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        contracts.map((contract) => (
                                            <tr key={contract.id} className="group transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-1.5 rounded-lg bg-surface-800 border border-white/5 text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                                                            <FileText size={12} />
                                                        </div>
                                                        <span className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate max-w-[180px]">{contract.gigs?.title}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">{contract.profiles_brand?.company_name}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">{contract.profiles_influencer?.full_name}</span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className="text-sm font-black text-white">{formatINR(contract.agreed_price)}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest",
                                                        STATUS_COLORS[contract.status] || 'bg-white/5 border-white/10 text-text-muted'
                                                    )}>
                                                        {contract.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-[10px] font-bold text-text-dim uppercase tracking-tighter">
                                                        {new Date(contract.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </PageWrapper>
    );
}
