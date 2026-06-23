import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PageWrapper from '../../components/layout/PageWrapper';
import { useCountUp } from '../../hooks/useCountUp';
import {
    Briefcase, FileText, CheckCircle2, IndianRupee,
    ArrowUpRight, ArrowDownRight, ChevronRight, ChevronDown,
    Loader2, TrendingUp,
} from 'lucide-react';
import { STAGGER_CONTAINER, STAGGER_ITEM, MICRO_INTERACTION } from '../../lib/motion';
import { cn, formatINR, formatRelativeTime, formatFollowers } from '../../lib/utils';

/* ── Helpers for Sparklines & Daily Activity ──────────────── */
function getTimeSeriesData(items, dateField = 'created_at', valueExtractor = null) {
    const points = new Array(11).fill(0);
    const now = new Date();
    const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    for (let i = 0; i < 11; i++) {
        const pointDate = new Date(startDate.getTime() + (i / 10) * (30 * 24 * 60 * 60 * 1000));
        let sum = 0;
        items.forEach(item => {
            const dateValue = item[dateField];
            if (dateValue) {
                const itemDate = new Date(dateValue);
                if (itemDate <= pointDate) {
                    if (valueExtractor) {
                        sum += valueExtractor(item);
                    } else {
                        sum += 1;
                    }
                }
            }
        });
        points[i] = sum;
    }
    return points;
}

function getDailyProposalsData(proposals) {
    const now = new Date();
    const points = [];
    const labels = [];
    const daysCount = 11;

    for (let i = 0; i < daysCount; i++) {
        const d = new Date();
        d.setDate(now.getDate() - (daysCount - 1 - i) * 3);
        const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        labels.push(label);

        const startWindow = new Date(d.getTime() - 1.5 * 24 * 60 * 60 * 1000);
        const endWindow = new Date(d.getTime() + 1.5 * 24 * 60 * 60 * 1000);

        const count = proposals.filter(p => {
            if (!p.created_at) return false;
            const created = new Date(p.created_at);
            return created >= startWindow && created < endWindow;
        }).length;

        points.push(count);
    }

    const filteredLabels = labels.map((l, i) => (i % 2 === 0 || i === labels.length - 1) ? l : '');
    return { points, labels: filteredLabels };
}

function getPlatformIcon(platform) {
    const p = (platform || '').toLowerCase();
    if (p.includes('instagram')) return { emoji: '📸', gradient: 'from-pink-500/20 to-rose-500/20 text-rose-400 border-rose-500/10' };
    if (p.includes('youtube')) return { emoji: '🎥', gradient: 'from-red-500/20 to-orange-500/20 text-red-400 border-red-500/10' };
    if (p.includes('tiktok')) return { emoji: '🎵', gradient: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/10' };
    return { emoji: '🌿', gradient: 'from-amber-200/20 to-orange-300/20 text-amber-400 border-amber-500/10' };
}

/* ── Tiny sparkline via SVG ─────────────────────────────── */
function Sparkline({ data, color, fill }) {
    if (!data || data.length < 2) return null;
    const w = 80, h = 36;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => [
        (i / (data.length - 1)) * w,
        h - ((v - min) / range) * (h - 4) - 2,
    ]);
    const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    const fillD = `${pathD} L ${w} ${h} L 0 ${h} Z`;
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
            {fill && <path d={fillD} fill={`url(#sg-${color.replace('#', '')})`} opacity="0.18" />}
            <defs>
                <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={pathD} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ── Stat card ──────────────────────────────────────────── */
function StatCard({ title, value, trend, trendValue, icon: Icon, iconBg, sparkData, sparkColor, loading }) {
    const isUp = trend === 'up';
    const isDown = trend === 'down';
    return (
        <motion.div
            variants={STAGGER_ITEM}
            whileHover={{ y: -2 }}
            className="glass-card p-6 flex flex-col gap-4 cursor-pointer group relative overflow-hidden"
        >
            {/* Hover glow */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: sparkColor + '22' }} />

            <div className="flex items-start justify-between">
                <div className={cn('p-2.5 rounded-xl', iconBg)}>
                    <Icon size={18} className="opacity-90" />
                </div>
                <div className="flex items-center">
                    <ChevronRight size={14} className="text-text-dim" />
                </div>
            </div>

            <div>
                <p className="text-[11px] text-text-muted font-medium mb-1">{title}</p>
                {loading ? (
                    <div className="h-8 w-20 bg-white/5 animate-pulse rounded-lg" />
                ) : (
                    <h3 className="text-[26px] font-bold text-text-primary leading-none tracking-tight">{value}</h3>
                )}
            </div>

            <div className="flex items-end justify-between">
                <div className={cn(
                    'flex items-center gap-1 text-[11px] font-semibold',
                    isUp ? 'text-green-500' : isDown ? 'text-red-400' : 'text-text-muted',
                )}>
                    {isUp ? <ArrowUpRight size={13} /> : isDown ? <ArrowDownRight size={13} /> : null}
                    <span>{trendValue}</span>
                </div>
                <Sparkline data={sparkData} color={sparkColor} fill />
            </div>
        </motion.div>
    );
}

/* ── Campaign performance mini-chart ────────────────────── */
function CampaignChart({ points = [], labels = [], isDark }) {
    if (!points || points.length === 0 || Math.max(...points) === 0) {
        return (
            <div className="h-[180px] flex flex-col items-center justify-center text-text-dim text-[11px] uppercase tracking-widest border border-dashed border-white/5 rounded-2xl">
                No Campaign Activity Identified
            </div>
        );
    }
    const w = 500, h = 160;
    const pad = { t: 20, b: 40, l: 40, r: 20 };
    const innerW = w - pad.l - pad.r;
    const innerH = h - pad.t - pad.b;
    const max = Math.max(...points) || 10;
    const yLabels = [0, Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max];

    const pts = points.map((v, i) => [
        pad.l + (i / (points.length - 1)) * innerW,
        pad.t + innerH - (v / max) * innerH,
    ]);
    const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    const fillD = `${pathD} L ${pts[pts.length - 1][0]} ${h - pad.b} L ${pts[0][0]} ${h - pad.b} Z`;

    const peakIdx = points.indexOf(Math.max(...points));
    const peakPt = pts[peakIdx];

    return (
        <div className="relative w-full overflow-hidden">
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: 180 }}>
                <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Y grid lines */}
                {yLabels.map((y, idx) => {
                    const yPos = pad.t + innerH - (y / max) * innerH;
                    return (
                        <g key={idx}>
                            <line x1={pad.l} y1={yPos} x2={w - pad.r} y2={yPos}
                                stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'} strokeWidth="1" />
                            <text x={pad.l - 6} y={yPos + 4} textAnchor="end"
                                fontSize="9" fill={isDark ? '#475569' : '#94a3b8'}>{y}</text>
                        </g>
                    );
                })}

                {/* X axis labels */}
                {labels.map((l, i) => {
                    const x = pad.l + (i / (labels.length - 1)) * innerW;
                    return (
                        <text key={i} x={x} y={h - 4} textAnchor="middle"
                            fontSize="9" fill={isDark ? '#475569' : '#94a3b8'}>{l}</text>
                    );
                })}

                {/* Fill */}
                <path d={fillD} fill="url(#chartFill)" />

                {/* Line */}
                <path d={pathD} stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                {/* Data points */}
                {pts.map((p, i) => (
                    <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#7c3aed" />
                ))}

                {/* Tooltip at peak */}
                {peakPt && max > 0 && (
                    <g>
                        <rect x={peakPt[0] - 32} y={peakPt[1] - 38} width={64} height={30} rx="6"
                            fill={isDark ? '#1e1b2e' : '#fff'}
                            stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                            strokeWidth="1" />
                        <text x={peakPt[0]} y={peakPt[1] - 23} textAnchor="middle"
                            fontSize="8.5" fill={isDark ? '#94a3b8' : '#64748b'}>Peak Activity</text>
                        <text x={peakPt[0]} y={peakPt[1] - 13} textAnchor="middle"
                            fontSize="9" fill="#7c3aed" fontWeight="700">{max} apps</text>
                    </g>
                )}
            </svg>
        </div>
    );
}

/* ── Recent proposal row ─────────────────────────────────── */
function ProposalRow({ name, niche, followers, amount, status }) {
    const statusStyles = {
        Shortlisted: 'bg-green-500/10 text-green-500 border-green-500/20',
        Pending:     'bg-orange-400/10 text-orange-400 border-orange-400/20',
        Declined:    'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return (
        <div className="flex items-center gap-3 py-3 border-b border-border last:border-0 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-text-primary leading-tight">{name}</p>
                <p className="text-[11px] text-text-muted">{niche} · {followers} Followers</p>
            </div>
            <div className="text-right flex flex-col items-end gap-1.5">
                <span className="text-[13px] font-bold text-text-primary">{amount}</span>
                <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', statusStyles[status] ?? statusStyles.Pending)}>
                    {status}
                </span>
            </div>
        </div>
    );
}

/* ── Main dashboard ─────────────────────────────────────── */
export default function BrandDashboard() {
    const { user, profile } = useAuth();
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const [stats, setStats] = useState({ activeGigs: 0, proposals: 0, completed: 0, totalSpent: 0 });
    const [loading, setLoading] = useState(true);
    const [recentProposals, setRecentProposals] = useState([]);
    const [activeGigsList, setActiveGigsList] = useState([]);
    const [contractsList, setContractsList] = useState([]);
    const [chartData, setChartData] = useState({ points: [], labels: [] });
    const [sparks, setSparks] = useState({
        gigs:      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        proposals: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        completed: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        spent:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    });
    const [trends, setTrends] = useState({
        gigs: { value: '0 new this week', trend: 'neutral' },
        proposals: { value: '0 new this week', trend: 'neutral' },
        completed: { value: '0 new this week', trend: 'neutral' },
        spent: { value: '+₹0 this week', trend: 'neutral' },
    });

    const animatedActiveGigs  = useCountUp(stats.activeGigs);
    const animatedProposals   = useCountUp(stats.proposals);
    const animatedCompleted   = useCountUp(stats.completed);
    const animatedTotalSpent  = useCountUp(stats.totalSpent);

    async function fetchDashboardData() {
        if (!user) return;
        setLoading(true);
        try {
            // 1. Fetch gigs and nested proposals
            const { data: gigsData, error: gigsErr } = await supabase
                .from('gigs')
                .select(`
                    *,
                    proposals(
                        id, 
                        status, 
                        quoted_price, 
                        created_at, 
                        profiles_influencer(
                            full_name, 
                            niche, 
                            followers_count
                        )
                    )
                `)
                .eq('brand_id', user.id)
                .order('created_at', { ascending: false });

            if (gigsErr) throw gigsErr;

            // 2. Fetch contracts and nested milestones
            const { data: contractsData, error: contractsErr } = await supabase
                .from('contracts')
                .select('*, contract_milestones(*)')
                .eq('brand_id', user.id);

            if (contractsErr) throw contractsErr;

            const allGigs = gigsData || [];
            const activeGigs = allGigs.filter(g => g.status === 'Open');
            const allContracts = contractsData || [];

            // Extract all proposals
            const allProposals = allGigs.flatMap(g => g.proposals || []);

            // Count completed
            const completedCount = allContracts.filter(c => c.status === 'Completed').length;

            // Extract approved milestones for total spent
            const approvedMilestones = [];
            allContracts.forEach(c => {
                (c.contract_milestones || []).forEach(m => {
                    if (m.status === 'Approved') {
                        approvedMilestones.push({
                            amount: Number(c.agreed_price) / 3,
                            date: m.reviewed_at || m.updated_at || m.created_at || c.created_at
                        });
                    }
                });
            });

            const totalSpentAmount = approvedMilestones.reduce((acc, m) => acc + m.amount, 0);

            // Update state variables
            setStats({
                activeGigs: activeGigs.length,
                proposals: allProposals.length,
                completed: completedCount,
                totalSpent: totalSpentAmount
            });

            setContractsList(allContracts);
            setActiveGigsList(activeGigs.slice(0, 3));

            const sortedRecent = [...allProposals]
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 4);
            setRecentProposals(sortedRecent);

            // Compute Sparks (11 intervals over last 30 days)
            const gigsSpark = getTimeSeriesData(activeGigs, 'created_at');
            const proposalsSpark = getTimeSeriesData(allProposals, 'created_at');
            const completedSpark = getTimeSeriesData(allContracts.filter(c => c.status === 'Completed'), 'completed_at');
            const spentSpark = getTimeSeriesData(approvedMilestones, 'date', m => m.amount);

            setSparks({
                gigs: gigsSpark,
                proposals: proposalsSpark,
                completed: completedSpark,
                spent: spentSpark
            });

            // Compute trends
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const recentGigsCount = activeGigs.filter(g => new Date(g.created_at) >= oneWeekAgo).length;
            const recentProposalsCount = allProposals.filter(p => new Date(p.created_at) >= oneWeekAgo).length;
            const recentCompletedCount = allContracts.filter(c => c.status === 'Completed' && c.completed_at && new Date(c.completed_at) >= oneWeekAgo).length;
            const recentSpentAmount = approvedMilestones.filter(m => new Date(m.date) >= oneWeekAgo).reduce((acc, m) => acc + m.amount, 0);

            setTrends({
                gigs: { value: `+${recentGigsCount} new this week`, trend: recentGigsCount > 0 ? 'up' : 'neutral' },
                proposals: { value: `+${recentProposalsCount} new this week`, trend: recentProposalsCount > 0 ? 'up' : 'neutral' },
                completed: { value: `+${recentCompletedCount} new this week`, trend: recentCompletedCount > 0 ? 'up' : 'neutral' },
                spent: { value: `+${formatINR(recentSpentAmount)} this week`, trend: recentSpentAmount > 0 ? 'up' : 'neutral' }
            });

            // Compute Chart data
            const { points, labels } = getDailyProposalsData(allProposals);
            setChartData({ points, labels });

        } catch (err) {
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!user) return;
        fetchDashboardData();
        const ch = supabase.channel(`brand-dash-${user.id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'gigs' }, fetchDashboardData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'contracts' }, fetchDashboardData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'contract_milestones' }, fetchDashboardData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'proposals' }, fetchDashboardData)
            .subscribe();
        return () => supabase.removeChannel(ch);
    }, [user]);

    return (
        <PageWrapper>
            <div className="space-y-6 pb-16">

                {/* ── 4 Stat Cards ──────────────────── */}
                <motion.div
                    variants={STAGGER_CONTAINER}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
                >
                    <StatCard
                        title="Active Campaigns"
                        value={animatedActiveGigs}
                        trend={trends.gigs.trend} trendValue={trends.gigs.value}
                        icon={Briefcase}
                        iconBg="bg-violet-500/10 text-violet-400"
                        sparkData={sparks.gigs} sparkColor="#7c3aed"
                        loading={loading}
                    />
                    <StatCard
                        title="Total Proposals"
                        value={animatedProposals}
                        trend={trends.proposals.trend} trendValue={trends.proposals.value}
                        icon={FileText}
                        iconBg="bg-sky-500/10 text-sky-400"
                        sparkData={sparks.proposals} sparkColor="#0ea5e9"
                        loading={loading}
                    />
                    <StatCard
                        title="Completed Deals"
                        value={animatedCompleted}
                        trend={trends.completed.trend} trendValue={trends.completed.value}
                        icon={CheckCircle2}
                        iconBg="bg-green-500/10 text-green-500"
                        sparkData={sparks.completed} sparkColor="#22c55e"
                        loading={loading}
                    />
                    <StatCard
                        title="Total Spent"
                        value={formatINR(animatedTotalSpent)}
                        trend={trends.spent.trend} trendValue={trends.spent.value}
                        icon={IndianRupee}
                        iconBg="bg-amber-500/10 text-amber-500"
                        sparkData={sparks.spent} sparkColor="#f59e0b"
                        loading={loading}
                    />
                </motion.div>

                {/* ── Chart + Recent Proposals ───────── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {/* Campaign Performance Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3 glass-card p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[15px] font-bold text-text-primary">Campaign Performance</h3>
                            <button className={cn(
                                'flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors',
                                isDark
                                    ? 'border-white/10 text-text-muted hover:text-text-primary bg-white/[0.03]'
                                    : 'border-black/10 text-text-muted hover:text-gray-800 bg-gray-100',
                            )}>
                                This Month <ChevronDown size={13} />
                            </button>
                        </div>
                        <CampaignChart points={chartData.points} labels={chartData.labels} isDark={isDark} />
                    </motion.div>

                    {/* Recent Proposals */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 glass-card p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[15px] font-bold text-text-primary">Recent Proposals</h3>
                            <button
                                onClick={() => navigate('/brand/applications')}
                                className="text-[12px] text-primary font-semibold hover:underline flex items-center gap-1"
                            >
                                View All <ChevronRight size={13} />
                            </button>
                        </div>
                        <div className="space-y-1">
                            {recentProposals.length === 0 ? (
                                <div className="h-[200px] flex flex-col items-center justify-center text-text-dim text-[11px] uppercase tracking-widest border border-dashed border-white/5 rounded-2xl">
                                    No Incoming Signals
                                </div>
                            ) : (
                                recentProposals.map((p) => (
                                    <ProposalRow
                                        key={p.id}
                                        name={p.profiles_influencer?.full_name || 'Anonymous Creator'}
                                        niche={p.profiles_influencer?.niche || 'Lifestyle'}
                                        followers={p.profiles_influencer?.followers_count ? formatFollowers(p.profiles_influencer.followers_count) : '0'}
                                        amount={formatINR(p.quoted_price)}
                                        status={p.status}
                                    />
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* ── Active Campaigns ───────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-[15px] font-bold text-text-primary">Active Campaigns</h3>
                        <button
                            onClick={() => navigate('/brand/gigs')}
                            className={cn(
                                'flex items-center gap-1 text-[12px] font-medium text-text-muted hover:text-text-primary transition-colors',
                            )}
                        >
                            View All Campaigns <ChevronDown size={13} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="h-28 w-full bg-white/5 animate-pulse rounded-2xl" />
                        ) : activeGigsList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-text-dim text-[11px] uppercase tracking-widest border border-dashed border-white/5 rounded-2xl">
                                No Active Campaigns Deployed
                            </div>
                        ) : (
                            activeGigsList.map((gig) => {
                                const contract = contractsList.find((c) => c.gig_id === gig.id);
                                const milestones = [...(contract?.contract_milestones || [])].sort(
                                    (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
                                );
                                const approvedCount = milestones.filter((m) => m.status === 'Approved').length;
                                const progressPercent =
                                    milestones.length > 0
                                        ? Math.round((approvedCount / milestones.length) * 100)
                                        : 0;

                                const steps = milestones.map((m, idx) => {
                                    const isDone = m.status === 'Approved';
                                    const isActive = m.status === 'Submitted' || m.status === 'Revision_Requested';
                                    return {
                                        label: m.milestone_name || `M${idx + 1}`,
                                        sub:
                                            m.status === 'Approved'
                                                ? 'Completed'
                                                : m.status === 'Submitted'
                                                ? 'In Review'
                                                : m.status === 'Revision_Requested'
                                                ? 'Revision'
                                                : 'Pending',
                                        done: isDone,
                                        active: isActive,
                                    };
                                });

                                const platformInfo = getPlatformIcon(gig.platform);

                                return (
                                    <div
                                        key={gig.id}
                                        onClick={() => navigate(`/brand/gigs/${gig.id}/applications`)}
                                        className={cn(
                                            'flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 rounded-2xl border cursor-pointer hover:border-primary/30 transition-all relative overflow-hidden group',
                                            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-gray-50 border-gray-100'
                                        )}
                                    >
                                        <div className="flex items-center gap-5 flex-1 min-w-0">
                                            {/* Thumbnail */}
                                            <div className={cn(
                                                "w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-2.5xl border",
                                                platformInfo.gradient
                                            )}>
                                                {platformInfo.emoji}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2.5 mb-1.5">
                                                    <h4 className="text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                                                        {gig.title}
                                                    </h4>
                                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
                                                        {gig.status}
                                                    </span>
                                                </div>
                                                <p className="text-[12px] text-text-muted mb-2 font-medium">
                                                    {gig.niche_required || 'General'} · {gig.platform} · {formatINR(gig.budget)}
                                                </p>
                                                <div className="flex items-center gap-4 text-[11px] text-text-muted font-semibold">
                                                    <span>{gig.proposals?.length || 0} Proposals</span>
                                                    <span>· {gig.proposals?.filter(p => p.status === 'Shortlisted').length || 0} Shortlisted</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Milestone progress */}
                                        <div className="flex items-center gap-8 shrink-0">
                                            {contract ? (
                                                <>
                                                    <div className="hidden lg:block text-center">
                                                        <p className="text-[9px] text-text-muted mb-3 font-semibold uppercase tracking-wider">Milestone Progress</p>
                                                        <div className="flex items-center gap-3">
                                                            {steps.map((step, i) => (
                                                                <div key={step.label} className="flex items-center gap-2">
                                                                    {i > 0 && (
                                                                        <div className={cn('w-6 h-px', step.done ? 'bg-primary' : isDark ? 'bg-white/10' : 'bg-gray-200')} />
                                                                    )}
                                                                    <div className="flex flex-col items-center gap-1">
                                                                        <div className={cn(
                                                                            'w-6.5 h-6.5 rounded-full flex items-center justify-center text-[10px] border font-bold',
                                                                            step.done
                                                                                ? 'bg-green-500 border-green-500 text-white'
                                                                                : step.active
                                                                                    ? 'bg-primary border-primary text-white shadow-glow'
                                                                                    : isDark ? 'bg-white/5 border-white/10 text-text-dim' : 'bg-gray-100 border-gray-200 text-gray-400',
                                                                        )}>
                                                                            {step.done ? '✓' : i + 1}
                                                                        </div>
                                                                        <span className="text-[9px] font-bold text-text-primary whitespace-nowrap">{step.label}</span>
                                                                        <span className="text-[8px] text-text-muted">{step.sub}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Circular progress */}
                                                    <div className="flex flex-col items-center justify-center bg-white/[0.01] border border-white/5 rounded-xl px-4 py-2 shrink-0">
                                                        <svg width="44" height="44" viewBox="0 0 44 44">
                                                            <circle cx="22" cy="22" r="17" fill="none" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeWidth="3" />
                                                            <circle cx="22" cy="22" r="17" fill="none" stroke="#7c3aed" strokeWidth="3"
                                                                strokeDasharray="106.8" strokeDashoffset={106.8 - (106.8 * progressPercent) / 100}
                                                                strokeLinecap="round" transform="rotate(-90 22 22)" />
                                                        </svg>
                                                        <span className="text-[10px] font-black text-text-primary -mt-8">{progressPercent}%</span>
                                                        <span className="text-[8px] text-text-muted mt-5 font-bold uppercase tracking-wider">Progress</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center border border-white/5 bg-white/[0.01] rounded-2xl px-5 py-3 text-center shrink-0">
                                                    <p className="text-[9px] text-text-muted uppercase tracking-widest mb-1.5 font-bold">Transmission Status</p>
                                                    <span className="text-[11px] font-black text-primary uppercase tracking-wider">Receiving Signals</span>
                                                    <span className="text-[9px] text-text-muted mt-1 font-semibold">{(gig.proposals || []).filter(p => p.status === 'Pending').length} pending review</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </motion.div>

            </div>
        </PageWrapper>
    );
}
