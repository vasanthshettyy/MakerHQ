import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGigs } from '../../hooks/useGigs';
import { useProposals } from '../../hooks/useProposals';
import { useContracts } from '../../hooks/useContracts';
import { formatINR, formatRelativeTime, getGigNiche, cn } from '../../lib/utils';
import { STATUS_COLORS } from '../../lib/constants';
import PageWrapper from '../../components/layout/PageWrapper';
import ContractCard from '../../components/contracts/ContractCard';
import InfluencerDetailModal from '../../components/discovery/InfluencerDetailModal';
import {
    Megaphone, Users, Clock, CheckCircle, XCircle, Loader2, 
    ChevronDown, ChevronUp, Zap, Briefcase, FileText, Globe
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { PREMIUM_SPRING, STAGGER_CONTAINER, STAGGER_ITEM, MICRO_INTERACTION } from '../../lib/motion';

export default function BrandContractsPage() {
    const { gigs, loading: gigsLoading } = useGigs();

    return (
        <PageWrapper title="Execution Matrix" subtitle="Monitor active contract nodes and deployment milestones.">
            <div className="space-y-6">
                {gigsLoading ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="glass-card !rounded-[2rem] h-32 animate-pulse bg-white/[0.02] border-white/5" />
                        ))}
                    </div>
                ) : gigs.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card !rounded-[3rem] p-24 text-center border-dashed border-white/10 bg-white/[0.01]"
                    >
                        <div className="relative w-20 h-20 mx-auto mb-8">
                            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
                            <div className="w-20 h-20 rounded-3xl bg-surface-900 border border-white/5 flex items-center justify-center text-text-dim relative z-10">
                                <Briefcase size={32} strokeWidth={1} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-display font-black text-white mb-3">Zero Execution Flows</h3>
                        <p className="text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                            No active contract frameworks identified. Initialize a campaign node to receive creator signals.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={STAGGER_CONTAINER}
                        initial="hidden"
                        animate="show"
                        className="space-y-6"
                    >
                        {gigs.map(gig => <GigWithProposals key={gig.id} gig={gig} />)}
                    </motion.div>
                )}
            </div>
        </PageWrapper>
    );
}

function GigWithProposals({ gig }) {
    const { contractId } = useParams();
    const [expanded, setExpanded] = useState(() => gig.id === contractId);

    return (
        <motion.div 
            variants={STAGGER_ITEM}
            className="glass-card !rounded-[2.5rem] overflow-hidden border-white/5 bg-surface-900/20 group/gig"
        >
            {/* Gig Header */}
            <button 
                onClick={() => setExpanded(!expanded)}
                className="w-full p-6 sm:p-8 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition-all text-left group/btn relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-surface-900 border border-white/5 flex items-center justify-center text-primary shadow-inner group-hover/btn:scale-105 transition-transform">
                        <Globe size={24} />
                    </div>
                    <div>
                        <h3 className="font-display font-black text-lg text-white leading-tight mb-1 group-hover/btn:text-primary transition-colors">
                            {gig.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-text-dim uppercase tracking-widest">
                                <span className="text-primary">{gig.platform}</span>
                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                <span className="text-white">{formatINR(gig.budget)}</span>
                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                <span>{getGigNiche(gig)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted">
                                <Clock size={10} />
                                {formatRelativeTime(gig.created_at)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className={cn(
                        "px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest",
                        STATUS_COLORS[gig.status]
                    )}>
                        {gig.status}
                    </div>
                    <div className={cn(
                        "w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-text-dim transition-all",
                        expanded ? "bg-primary/20 text-primary border-primary/20 rotate-180" : "group-hover/btn:bg-white/10 group-hover/btn:text-white"
                    )}>
                        <ChevronDown size={20} />
                    </div>
                </div>
            </button>

            {/* Content List */}
            <AnimatePresence>
                {expanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={PREMIUM_SPRING}
                        className="border-t border-white/5 bg-black/20 overflow-hidden"
                    >
                        <ProposalsList gigId={gig.id} />
                        <ActiveContractsList gigId={gig.id} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function ActiveContractsList({ gigId }) {
    const {
        contracts,
        loading,
        approveMilestone,
        requestRevision,
        addMilestone,
        updateMilestone,
        deleteMilestone
    } = useContracts();
    const { contractId } = useParams();
    const activeContracts = contracts.filter(c => c.gig_id === gigId);

    if (loading || activeContracts.length === 0) return null;

    return (
        <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 px-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <FileText size={12} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted">Active Contract Frameworks</h4>
            </div>
            {activeContracts.map(contract => (
                <ContractCard
                    key={contract.id}
                    contract={contract}
                    onApprove={approveMilestone}
                    onRevision={requestRevision}
                    onAddMilestone={addMilestone}
                    onUpdateMilestone={updateMilestone}
                    onDeleteMilestone={deleteMilestone}
                    isBrand={true}
                    highlight={contract.id === contractId}
                />
            ))}
        </div>
    );
}

function ProposalsList({ gigId }) {
    const { proposals, loading, acceptProposal, rejectProposal } = useProposals(gigId);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedInfluencer, setSelectedInfluencer] = useState(null);

    async function handleAction(proposalId, action) {
        setActionLoading(proposalId);
        try {
            if (action === 'accept') await acceptProposal(proposalId);
            else await rejectProposal(proposalId);
        } catch (err) { console.error(err); }
        setActionLoading(null);
    }

    if (loading) {
        return (
            <div className="p-10 flex items-center justify-center gap-3 text-text-dim">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest">Scanning signals...</span>
            </div>
        );
    }

    if (proposals.length === 0) return null;

    return (
        <div className="divide-y divide-white/5">
            <div className="px-8 py-4 bg-white/[0.02]">
                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted">Incoming Signal Stream</h4>
            </div>
            {proposals.map(p => (
                <div key={p.id} className="p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 hover:bg-white/[0.02] transition-colors group/row">
                    <div
                        onClick={() => setSelectedInfluencer(p.profiles_influencer)}
                        className="flex items-start gap-5 flex-1 min-w-0 cursor-pointer"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-surface-900 border border-white/10 p-0.5 overflow-hidden shadow-lg group-hover/row:scale-105 transition-transform shrink-0">
                            {p.profiles_influencer?.avatar_url ? (
                                <img src={p.profiles_influencer.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary font-black text-xs bg-primary/10">
                                    {p.profiles_influencer?.full_name?.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="font-bold text-base text-white group-hover/row:text-primary transition-colors">{p.profiles_influencer?.full_name}</span>
                                <div className="px-2 py-0.5 rounded-lg bg-surface-950 border border-white/5 text-[9px] font-black text-text-muted uppercase tracking-widest">
                                    {p.profiles_influencer?.niche || 'General'}
                                </div>
                            </div>
                            <p className="text-sm text-text-secondary line-clamp-1 italic mb-3 opacity-80 group-hover/row:opacity-100 transition-opacity">"{p.cover_letter}"</p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest">
                                    <span>{formatINR(p.quoted_price)}</span>
                                    <div className="w-1 h-1 rounded-full bg-white/10" />
                                    <span className="text-text-dim">{formatRelativeTime(p.created_at)}</span>
                                </div>
                                <div className={cn(
                                    "px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest",
                                    STATUS_COLORS[p.status]
                                )}>
                                    {p.status}
                                </div>
                            </div>
                        </div>
                    </div>

                    {p.status === 'Pending' && (
                        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                            <motion.button
                                {...MICRO_INTERACTION}
                                onClick={() => handleAction(p.id, 'accept')}
                                disabled={actionLoading === p.id}
                                className="flex-1 sm:flex-none h-11 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                {actionLoading === p.id ? <Loader2 size={16} className="animate-spin" /> : 'Initialize'}
                            </motion.button>
                            <motion.button
                                {...MICRO_INTERACTION}
                                onClick={() => handleAction(p.id, 'reject')}
                                disabled={actionLoading === p.id}
                                className="h-11 px-4 rounded-xl bg-white/5 border border-white/5 text-text-muted hover:text-white transition-all disabled:opacity-50"
                            >
                                <XCircle size={18} />
                            </motion.button>
                        </div>
                    )}
                </div>
            ))}
            {selectedInfluencer && (
                <InfluencerDetailModal
                    influencer={selectedInfluencer}
                    isOpen={!!selectedInfluencer}
                    onClose={() => setSelectedInfluencer(null)}
                />
            )}
        </div>
    );
}
