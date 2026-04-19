import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import PageWrapper from '../../components/layout/PageWrapper';
import { formatINR, formatRelativeTime, cn } from '../../lib/utils';
import { 
    Briefcase, CheckCircle, XCircle, Loader2, 
    Megaphone, AlertCircle, IndianRupee, Globe, Clock,
    Target, Filter, Sparkles, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PREMIUM_SPRING, STAGGER_ITEM, MICRO_INTERACTION, STAGGER_CONTAINER } from '../../lib/motion';
import { STATUS_COLORS } from '../../lib/constants';

export default function GigModerationPage() {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [filterStatus, setFilterStatus] = useState('Open');
    const [message, setMessage] = useState(null);

    async function fetchGigs() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('gigs')
                .select(`
                    *,
                    profiles_brand(company_name, logo_url)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setGigs(data || []);
        } catch (err) {
            console.error('Error fetching gigs:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchGigs();
    }, []);

    async function updateStatus(gigId, newStatus) {
        setActionLoading(gigId);
        setMessage(null);
        try {
            const { error } = await supabase
                .from('gigs')
                .update({ status: newStatus })
                .eq('id', gigId);

            if (error) throw error;
            
            setGigs(prev => prev.map(g => 
                g.id === gigId ? { ...g, status: newStatus } : g
            ));
            setMessage({ type: 'success', text: `Node ${newStatus} successfully.` });
        } catch (err) {
            console.error('Error updating gig status:', err);
            setMessage({ type: 'error', text: 'Failed to update channel status.' });
        } finally {
            setActionLoading(null);
            setTimeout(() => setMessage(null), 3000);
        }
    }

    const filteredGigs = gigs.filter(g => filterStatus === 'all' || g.status === filterStatus);

    return (
        <PageWrapper title="Signal Moderation" subtitle="Verify and maintain campaign quality across the transmission network.">
            <div className="space-y-10 pb-20">
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className={`fixed top-24 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 ${
                                message.type === 'success' 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                            }`}
                        >
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                message.type === 'success' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500"
                            )} />
                            <p className="text-[10px] font-black uppercase tracking-widest leading-none">{message.text}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header Actions & Filter Engine */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-glow">
                            <Target size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-black text-white tracking-tight leading-none mb-1 uppercase">Channel Stream</h2>
                            <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Audit Registry: {filteredGigs.length} Nodes</p>
                        </div>
                    </div>

                    <div className="flex bg-surface-900/50 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
                        {['all', 'Open', 'Closed', 'Cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={cn(
                                    "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer",
                                    filterStatus === status 
                                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                    : "text-text-muted hover:text-white hover:bg-white/5"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Signals Grid */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="glass-card aspect-video animate-pulse bg-white/[0.02] border-white/5" />
                                ))}
                            </motion.div>
                        ) : filteredGigs.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-32 glass-card !rounded-[3rem] border-dashed border-white/10 bg-white/[0.01]"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-surface-900 border border-white/5 flex items-center justify-center mb-6 relative">
                                    <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
                                    <Megaphone size={32} className="text-text-dim relative z-10" />
                                </div>
                                <h3 className="text-xl font-display font-black text-white mb-2">Zero Signals Identified</h3>
                                <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">Spectrum: {filterStatus}</p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                variants={STAGGER_CONTAINER}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filteredGigs.map((gig) => (
                                    <motion.div
                                        key={gig.id}
                                        variants={STAGGER_ITEM}
                                        layout
                                        className="glass-card group hover:border-primary/30 p-6 flex flex-col h-full overflow-hidden relative"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex-1">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-2xl bg-surface-900 border border-white/10 p-0.5 overflow-hidden shadow-xl group-hover:scale-105 transition-transform shrink-0">
                                                        {gig.profiles_brand?.logo_url ? (
                                                            <img src={gig.profiles_brand.logo_url} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center font-black text-primary text-sm uppercase">
                                                                {gig.profiles_brand?.company_name?.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">{gig.title}</h3>
                                                        <p className="text-[9px] text-text-dim uppercase tracking-widest font-black truncate">
                                                            {gig.profiles_brand?.company_name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={cn(
                                                    "px-2.5 py-1 rounded-xl border text-[8px] font-black uppercase tracking-widest",
                                                    STATUS_COLORS[gig.status]
                                                )}>
                                                    {gig.status}
                                                </div>
                                            </div>

                                            {/* Intel */}
                                            <p className="text-xs text-text-secondary line-clamp-3 mb-6 leading-relaxed font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">
                                                "{gig.description}"
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="bg-surface-950/50 border border-white/5 rounded-xl p-3 flex flex-col gap-1">
                                                    <span className="text-[8px] text-text-dim uppercase font-black tracking-widest flex items-center gap-1.5">
                                                        <IndianRupee size={10} className="text-success" /> Allocation
                                                    </span>
                                                    <span className="text-xs font-black text-white">{formatINR(gig.budget)}</span>
                                                </div>
                                                <div className="bg-surface-950/50 border border-white/5 rounded-xl p-3 flex flex-col gap-1">
                                                    <span className="text-[8px] text-text-dim uppercase font-black tracking-widest flex items-center gap-1.5">
                                                        <Globe size={10} className="text-primary" /> Channel
                                                    </span>
                                                    <span className="text-xs font-black text-white">{gig.platform}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-5 border-t border-white/5">
                                            <motion.button 
                                                {...MICRO_INTERACTION}
                                                onClick={() => updateStatus(gig.id, 'Cancelled')}
                                                disabled={actionLoading === gig.id || gig.status === 'Cancelled'}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[9px] font-black uppercase tracking-widest disabled:opacity-20 cursor-pointer"
                                            >
                                                <XCircle size={14} /> Reject Node
                                            </motion.button>
                                            <motion.button 
                                                {...MICRO_INTERACTION}
                                                onClick={() => updateStatus(gig.id, 'Open')}
                                                disabled={actionLoading === gig.id || gig.status === 'Open'}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-widest disabled:opacity-20 shadow-lg shadow-primary/20 cursor-pointer"
                                            >
                                                {actionLoading === gig.id ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                                                Validate
                                            </motion.button>
                                        </div>

                                        <div className="absolute bottom-1 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[8px] text-text-muted font-bold uppercase tracking-tighter flex items-center gap-1">
                                                <Clock size={8} /> Node Active {formatRelativeTime(gig.created_at)}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </PageWrapper>
    );
}
