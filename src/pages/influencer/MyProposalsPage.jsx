import { useProposals } from '../../hooks/useProposals';
import { formatINR, formatRelativeTime, cn } from '../../lib/utils';
import { STATUS_COLORS } from '../../lib/constants';
import PageWrapper from '../../components/layout/PageWrapper';
import { Send, Briefcase, Clock, XCircle, Loader2, Target, Globe, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAGGER_CONTAINER, STAGGER_ITEM, MICRO_INTERACTION, PREMIUM_SPRING } from '../../lib/motion';

export default function MyProposalsPage() {
    const { proposals, loading, withdrawProposal } = useProposals();

    return (
        <PageWrapper title="Applied Signals" subtitle="Track your active transmissions and campaign nodes.">
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="glass-card !rounded-[2rem] h-40 animate-pulse bg-white/[0.02] border-white/5" />
                    ))}
                </div>
            ) : proposals.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card !rounded-[3rem] p-24 text-center border-dashed border-white/10 bg-white/[0.01]"
                >
                    <div className="relative w-20 h-20 mx-auto mb-8">
                        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
                        <div className="w-20 h-20 rounded-3xl bg-surface-900 border border-white/5 flex items-center justify-center text-text-dim relative z-10">
                            <Send size={32} strokeWidth={1} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-display font-black text-white mb-3 tracking-tight">Zero Active Signals</h3>
                    <p className="text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                        You haven't initialized any campaign transmissions yet. Browse the feed to begin.
                    </p>
                </motion.div>
            ) : (
                <motion.div 
                    variants={STAGGER_CONTAINER}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    {proposals.map(proposal => (
                        <ProposalCard key={proposal.id} proposal={proposal} onWithdraw={withdrawProposal} />
                    ))}
                </motion.div>
            )}
        </PageWrapper>
    );
}

function ProposalCard({ proposal, onWithdraw }) {
    const [withdrawing, setWithdrawing] = useState(false);

    async function handleWithdraw() {
        setWithdrawing(true);
        try {
            await onWithdraw(proposal.id);
        } catch (err) {
            console.error('Withdrawal Error:', err);
        }
        setWithdrawing(false);
    }

    return (
        <motion.div
            variants={STAGGER_ITEM}
            className="glass-card !rounded-[2rem] p-6 hover:border-white/10 transition-all group/proposal relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.01] to-transparent opacity-0 group-hover/proposal:opacity-100 transition-opacity" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-surface-900 border border-white/5 flex items-center justify-center text-primary shadow-inner group-hover/proposal:scale-105 transition-transform">
                        <Target size={20} />
                    </div>
                    <div>
                        <h3 className="font-display font-black text-base text-white group-hover/proposal:text-primary transition-colors leading-tight mb-1.5">
                            {proposal.gigs?.title || 'Campaign Hub'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-text-dim uppercase tracking-widest">
                                <span className="text-white">Allocation: {formatINR(proposal.quoted_price)}</span>
                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                <span className="text-text-muted">Max: {formatINR(proposal.gigs?.budget)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted">
                                <Clock size={10} />
                                {formatRelativeTime(proposal.created_at)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className={cn(
                        "px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest",
                        STATUS_COLORS[proposal.status]
                    )}>
                        {proposal.status}
                    </div>
                    
                    {proposal.status === 'Pending' && (
                        <motion.button 
                            {...MICRO_INTERACTION}
                            onClick={handleWithdraw} 
                            disabled={withdrawing}
                            className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {withdrawing ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                        </motion.button>
                    )}
                </div>
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-white/[0.02] border border-white/5 relative z-10">
                <p className="text-xs text-text-secondary line-clamp-2 italic leading-relaxed font-medium">
                    "{proposal.cover_letter}"
                </p>
            </div>
            
            <div className="absolute top-6 right-6 opacity-0 group-hover/proposal:opacity-100 transition-all duration-300">
                <ArrowRight size={14} className="text-text-dim" />
            </div>
        </motion.div>
    );
}
