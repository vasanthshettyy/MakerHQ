import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGigs } from '../../hooks/useGigs';
import { usePlatformSettings } from '../../hooks/usePlatformSettings';
import PageWrapper from '../../components/layout/PageWrapper';
import CreateGigModal from '../../components/gigs/CreateGigModal';
import { 
    Plus, Megaphone, IndianRupee, Globe, 
    ArrowRight, Loader2, Calendar, Target,
    LayoutGrid, Sparkles, Filter, Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatINR, formatRelativeTime, cn } from '../../lib/utils';
import { STATUS_COLORS } from '../../lib/constants';
import { STAGGER_CONTAINER, STAGGER_ITEM, MICRO_INTERACTION, PREMIUM_SPRING } from '../../lib/motion';

export default function BrandGigsPage() {
    const navigate = useNavigate();
    const { gigs, loading, fetchGigs } = useGigs();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <PageWrapper 
            title="Campaign Node" 
            subtitle="Manage your active transmissions and track creator resonance."
        >
            <div className="space-y-10">
                {/* Dashboard Header Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-glow">
                            <Target size={18} />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-xl font-display font-black text-white tracking-tight leading-none mb-1">Live Feed</h2>
                            <p className="text-[10px] font-bold text-text-dim uppercase tracking-[0.2em]">Total Nodes: {gigs.length}</p>
                        </div>
                    </div>
                    
                    <motion.button
                        {...MICRO_INTERACTION}
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-3 shadow-xl"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Broadcast New Gig
                    </motion.button>
                </div>

                {/* Main Content Area */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="glass-card aspect-[4/3] animate-pulse bg-white/[0.02] border-white/5" />
                        ))}
                    </div>
                ) : gigs.length > 0 ? (
                    <motion.div 
                        variants={STAGGER_CONTAINER}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {gigs.map((gig) => (
                                <motion.div
                                    key={gig.id}
                                    layout
                                    variants={STAGGER_ITEM}
                                    {...MICRO_INTERACTION}
                                    onClick={() => navigate(`/brand/gigs/${gig.id}/applications`)}
                                    className="group glass-card p-6 flex flex-col h-full cursor-pointer hover:border-primary/40 transition-all relative overflow-hidden"
                                >
                                    {/* Visual Accent */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />

                                    <div className="flex items-center justify-between mb-6 relative z-10">
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-2 rounded-xl bg-surface-900 border border-white/5 text-primary shadow-inner">
                                                <Globe size={14} />
                                            </div>
                                            <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">{gig.platform}</span>
                                        </div>
                                        <div className={cn(
                                            "px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest",
                                            STATUS_COLORS[gig.status]
                                        )}>
                                            {gig.status}
                                        </div>
                                    </div>

                                    <div className="flex-1 mb-8 relative z-10">
                                        <h3 className="text-lg font-display font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors">
                                            {gig.title}
                                        </h3>
                                        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed font-medium">
                                            {gig.description}
                                        </p>
                                    </div>

                                    <div className="space-y-5 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">
                                                <IndianRupee size={12} className="text-success" />
                                                <span className="text-xs font-black text-white">{formatINR(gig.budget)}</span>
                                            </div>
                                            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">
                                                <Calendar size={12} className="text-text-dim" />
                                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">{formatRelativeTime(gig.created_at)}</span>
                                            </div>
                                        </div>

                                        <div className="pt-5 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className="w-5 h-5 rounded-full bg-surface-800 border border-surface-950" />
                                                    ))}
                                                </div>
                                                <span className="text-[9px] font-black text-primary uppercase tracking-widest ml-1">Process Pipeline</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-xl bg-surface-900 border border-white/5 flex items-center justify-center text-text-dim group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                                                <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-32 glass-card !rounded-[3rem] bg-white/[0.01] border-dashed border-white/10"
                    >
                        <div className="relative w-20 h-20 mb-8">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                            <div className="w-20 h-20 rounded-3xl bg-surface-900 border border-white/5 flex items-center justify-center text-text-dim relative z-10">
                                <Inbox size={32} strokeWidth={1} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-display font-black text-white mb-3">No Active Channels</h3>
                        <p className="text-text-muted text-sm mb-10 text-center max-w-xs leading-relaxed font-medium">
                            Initialize your first campaign transmission to begin connecting with elite creator nodes.
                        </p>
                        <motion.button
                            {...MICRO_INTERACTION}
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary px-10 py-4 shadow-2xl"
                        >
                            <Sparkles size={18} className="mr-2" />
                            Initialize Gig
                        </motion.button>
                    </motion.div>
                )}
            </div>

            <CreateGigModal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    fetchGigs();
                }} 
            />
        </PageWrapper>
    );
}
