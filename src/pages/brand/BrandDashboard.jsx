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
import { cn, formatINR, formatRelativeTime } from '../../lib/utils';

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
                    isUp ? 'text-green-500' : 'text-red-400',
                )}>
                    {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    <span>{trendValue} from last month</span>
                </div>
                <Sparkline data={sparkData} color={sparkColor} fill />
            </div>
        </motion.div>
    );
}

/* ── Campaign performance mini-chart ────────────────────── */
function CampaignChart({ isDark }) {
    const points = [38, 55, 70, 45, 120, 88, 95, 80, 118, 102, 130];
    const w = 500, h = 160;
    const pad = { t: 20, b: 40, l: 40, r: 20 };
    const innerW = w - pad.l - pad.r;
    const innerH = h - pad.t - pad.b;
    const max = Math.max(...points);
    const labels = ['1 May', '8 May', '15 May', '22 May', '29 May'];
    const yLabels = [0, 40, 80, 120, 160];

    const pts = points.map((v, i) => [
        pad.l + (i / (points.length - 1)) * innerW,
        pad.t + innerH - (v / max) * innerH,
    ]);
    const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    const fillD = `${pathD} L ${pts[pts.length - 1][0]} ${h - pad.b} L ${pts[0][0]} ${h - pad.b} Z`;

    // Tooltip position — peak point
    const peakIdx = points.indexOf(max);
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
                {yLabels.map((y) => {
                    const yPos = pad.t + innerH - (y / 160) * innerH;
                    return (
                        <g key={y}>
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
                        <text key={l} x={x} y={h - 4} textAnchor="middle"
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
                {peakPt && (
                    <g>
                        <rect x={peakPt[0] - 32} y={peakPt[1] - 38} width={64} height={30} rx="6"
                            fill={isDark ? '#1e1b2e' : '#fff'}
                            stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                            strokeWidth="1" />
                        <text x={peakPt[0]} y={peakPt[1] - 23} textAnchor="middle"
                            fontSize="8.5" fill={isDark ? '#94a3b8' : '#64748b'}>May 15</text>
                        <text x={peakPt[0]} y={peakPt[1] - 13} textAnchor="middle"
                            fontSize="9" fill="#7c3aed" fontWeight="700">Reach 128K</text>
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

    const animatedActiveGigs  = useCountUp(stats.activeGigs);
    const animatedProposals   = useCountUp(stats.proposals);
    const animatedCompleted   = useCountUp(stats.completed);
    const animatedTotalSpent  = useCountUp(stats.totalSpent);

    async function fetchDashboardData() {
        if (!user) return;
        setLoading(true);
        try {
            const [
                { count: activeGigs },
                { count: proposals },
                { data: contractsData },
            ] = await Promise.all([
                supabase.from('gigs').select('*', { count: 'exact', head: true }).eq('brand_id', user.id).eq('status', 'Open'),
                supabase.from('proposals').select('*', { count: 'exact', head: true }).eq('brand_id', user.id),
                supabase.from('contracts').select('status, agreed_price, contract_milestones(status)').eq('brand_id', user.id),
            ]);

            const completed = (contractsData || []).filter(c => c.status === 'Completed').length;
            const spent = (contractsData || []).reduce((acc, c) => {
                const approved = (c.contract_milestones || []).filter(m => m.status === 'Approved').length;
                return acc + (c.agreed_price / 3) * approved;
            }, 0);

            setStats({ activeGigs: activeGigs || 0, proposals: proposals || 0, completed, totalSpent: spent });
        } catch (err) { console.error('Dashboard error:', err); }
        finally { setLoading(false); }
    }

    useEffect(() => {
        fetchDashboardData();
        const ch = supabase.channel(`brand-dash-${user?.id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'gigs' }, fetchDashboardData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'contracts' }, fetchDashboardData)
            .subscribe();
        return () => supabase.removeChannel(ch);
    }, [user]);

    // Mock sparkline data per card
    const sparks = {
        gigs:      [8, 10, 9, 12, 11, 13, 12, 14, 12, 13, 12],
        proposals: [28, 30, 34, 32, 35, 36, 38, 37, 36, 38, 38],
        completed: [3, 4, 4, 5, 5, 6, 6, 6, 7, 7, 7],
        spent:     [180, 200, 210, 195, 220, 230, 215, 225, 235, 240, 246],
    };

    // Mock recent proposals
    const MOCK_PROPOSALS = [
        { name: 'Ananya Sharma', niche: 'Lifestyle', followers: '62K', amount: '₹25,000', status: 'Shortlisted' },
        { name: 'Rohit Verma',   niche: 'Tech',       followers: '48K', amount: '₹18,000', status: 'Pending'     },
        { name: 'Sneha Iyer',    niche: 'Fashion',    followers: '78K', amount: '₹32,000', status: 'Shortlisted' },
        { name: 'Karan Malhotra',niche: 'Fitness',    followers: '55K', amount: '₹20,000', status: 'Declined'    },
    ];

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
                        trend="up" trendValue="↑ 2"
                        icon={Briefcase}
                        iconBg="bg-violet-500/10 text-violet-400"
                        sparkData={sparks.gigs} sparkColor="#7c3aed"
                        loading={loading}
                    />
                    <StatCard
                        title="Total Proposals"
                        value={animatedProposals}
                        trend="up" trendValue="↑ 12%"
                        icon={FileText}
                        iconBg="bg-sky-500/10 text-sky-400"
                        sparkData={sparks.proposals} sparkColor="#0ea5e9"
                        loading={loading}
                    />
                    <StatCard
                        title="Completed Deals"
                        value={animatedCompleted}
                        trend="up" trendValue="↑ 16%"
                        icon={CheckCircle2}
                        iconBg="bg-green-500/10 text-green-500"
                        sparkData={sparks.completed} sparkColor="#22c55e"
                        loading={loading}
                    />
                    <StatCard
                        title="Total Spent"
                        value={`₹${(animatedTotalSpent / 1000).toFixed(0) !== '0' ? (animatedTotalSpent / 1000).toFixed(0) + ',000' : '2,46,000'}`}
                        trend="down" trendValue="↓ 8%"
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
                        <CampaignChart isDark={isDark} />
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
                        <div>
                            {MOCK_PROPOSALS.map((p) => (
                                <ProposalRow key={p.name} {...p} />
                            ))}
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

                    {/* Campaign row */}
                    <div className={cn(
                        'flex items-center gap-6 p-4 rounded-2xl border',
                        isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-gray-50 border-gray-100',
                    )}>
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-amber-200 to-orange-300 flex-shrink-0 flex items-center justify-center text-3xl">
                            🌿
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-[14px] font-bold text-text-primary">Glow &amp; Go Skincare Launch</h4>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                    In Progress
                                </span>
                            </div>
                            <p className="text-[12px] text-text-muted mb-2">Lifestyle · Instagram · ₹80,000</p>
                            <div className="flex items-center gap-4 text-[12px] text-text-muted">
                                <span>↓ 12 Proposals</span>
                                <span>· 3 Shortlisted</span>
                            </div>
                        </div>

                        {/* Milestone progress */}
                        <div className="hidden md:flex items-center gap-8">
                            <div className="text-center">
                                <p className="text-[10px] text-text-muted mb-2 font-medium">Milestone Progress</p>
                                <div className="flex items-center gap-3">
                                    {[
                                        { label: 'Script', sub: 'Completed', done: true },
                                        { label: 'Draft', sub: 'In Review', active: true },
                                        { label: 'Final Content', sub: 'Pending', done: false },
                                    ].map((step, i) => (
                                        <div key={step.label} className="flex items-center gap-2">
                                            {i > 0 && (
                                                <div className={cn('w-8 h-px', step.done ? 'bg-primary' : isDark ? 'bg-white/10' : 'bg-gray-200')} />
                                            )}
                                            <div className="flex flex-col items-center gap-1">
                                                <div className={cn(
                                                    'w-7 h-7 rounded-full flex items-center justify-center text-[11px] border',
                                                    step.done
                                                        ? 'bg-green-500 border-green-500 text-white'
                                                        : step.active
                                                            ? 'bg-primary border-primary text-white'
                                                            : isDark ? 'bg-white/5 border-white/10 text-text-dim' : 'bg-gray-100 border-gray-200 text-gray-400',
                                                )}>
                                                    {step.done ? '✓' : step.active ? '○' : '✓'}
                                                </div>
                                                <span className="text-[10px] font-medium text-text-primary whitespace-nowrap">{step.label}</span>
                                                <span className="text-[9px] text-text-muted">{step.sub}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Circular progress */}
                            <div className="flex flex-col items-center">
                                <svg width="56" height="56" viewBox="0 0 56 56">
                                    <circle cx="28" cy="28" r="22" fill="none" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeWidth="4" />
                                    <circle cx="28" cy="28" r="22" fill="none" stroke="#7c3aed" strokeWidth="4"
                                        strokeDasharray="138.2" strokeDashoffset="41.5"
                                        strokeLinecap="round" transform="rotate(-90 28 28)" />
                                </svg>
                                <span className="text-[11px] font-bold text-text-primary -mt-10">70%</span>
                                <span className="text-[9px] text-text-muted mt-8">Progress</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </PageWrapper>
    );
}
