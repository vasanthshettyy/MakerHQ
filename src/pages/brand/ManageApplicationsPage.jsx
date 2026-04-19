import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, Loader2, Star, 
    CheckCircle, XCircle, ClipboardList,
    Bookmark, BookmarkCheck, LayoutPanelLeft,
    Filter, ArrowRight, Zap, Users
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useProposals } from '../../hooks/useProposals';
import PageWrapper from '../../components/layout/PageWrapper';
import ProposalActions from '../../components/proposals/ProposalActions';
import InfluencerProfileModal from '../../components/proposals/InfluencerProfileModal';
import { formatFollowers, formatINR, cn } from '../../lib/utils';
import { STAGGER_CONTAINER, STAGGER_ITEM, MICRO_INTERACTION, PREMIUM_SPRING } from '../../lib/motion';

export default function ManageApplicationsPage() {
    const { gigId } = useParams();
    const navigate = useNavigate();
    const { proposals, fetchProposals, acceptProposal, rejectProposal } = useProposals(gigId);
    
    const [gig, setGig] = useState(null);
    const [fetchingGig, setFetchingGig] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [selectedInfluencer, setSelectedInfluencer] = useState(null);

    // Local state for shortlisted proposals (client-only)
    const [shortlistedIds, setShortlistedIds] = useState(new Set());

    useEffect(() => {
        async function fetchGigDetails() {
            setFetchingGig(true);
            const { data, error } = await supabase.from('gigs').select('*').eq('id', gigId).single();
            if (error) console.error('Error fetching gig:', error);
            else setGig(data);
            setFetchingGig(false);
        }
        fetchGigDetails();
    }, [gigId]);

    const toggleShortlist = (id) => {
        const newSet = new Set(shortlistedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setShortlistedIds(newSet);
    };

    const handleAccept = async (proposalId) => {
        setActionLoading(true);
        try {
            await acceptProposal(proposalId);
            navigate(`/brand/contracts`);
        } catch (err) {
            console.error('Acceptance failed:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (proposalId) => {
        setActionLoading(true);
        try {
            await rejectProposal(proposalId);
        } catch (err) {
            console.error('Rejection failed:', err);
        } finally {
            setActionLoading(false);
        }
    };

    if (fetchingGig) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary w-10 h-10 shadow-glow" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Synchronizing Workspace</p>
            </div>
        );
    }

    const pendingProposals = proposals.filter(p => p.status === 'Pending' && !shortlistedIds.has(p.id));
    const shortlistedProposals = proposals.filter(p => shortlistedIds.has(p.id) && p.status === 'Pending');
    const acceptedProposals = proposals.filter(p => p.status === 'Accepted');

    return (
        <PageWrapper title="Vetting Engine" subtitle={gig?.title}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                <motion.button 
                    {...MICRO_INTERACTION}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-black text-white hover:bg-white/10 hover:border-white/10 transition-all uppercase tracking-widest group cursor-pointer"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Exit Workspace
                </motion.button>

                <div className="flex items-center gap-3">
                    <div className={cn(
                        "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border",
                        gig?.status === 'Open' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/10 text-text-muted"
                    )}>
                        Channel: {gig?.status}
                    </div>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                        <Users size={14} />
                        <span className="text-xs font-black">{proposals.length}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Active Nodes</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20 items-start">
                <KanbanColumn title="Pending Signals" count={pendingProposals.length} color="primary" proposals={pendingProposals} onAccept={handleAccept} onReject={handleReject} onToggleShortlist={toggleShortlist} shortlistedIds={shortlistedIds} loading={actionLoading} onProfileClick={setSelectedInfluencer} />
                <KanbanColumn title="Shortlisted" count={shortlistedProposals.length} color="amber" proposals={shortlistedProposals} onAccept={handleAccept} onReject={handleReject} onToggleShortlist={toggleShortlist} shortlistedIds={shortlistedIds} loading={actionLoading} onProfileClick={setSelectedInfluencer} />
                <KanbanColumn title="Deployment" count={acceptedProposals.length} color="success" proposals={acceptedProposals} onAccept={handleAccept} onReject={handleReject} onToggleShortlist={toggleShortlist} shortlistedIds={shortlistedIds} loading={actionLoading} onProfileClick={setSelectedInfluencer} />
            </div>

            <InfluencerProfileModal 
                influencer={selectedInfluencer}
                onClose={() => setSelectedInfluencer(null)}
            />
        </PageWrapper>
    );
}

function KanbanColumn({ title, count, color, proposals, onAccept, onReject, onToggleShortlist, shortlistedIds, loading, onProfileClick }) {
    const colorMap = { primary: "bg-primary shadow-primary/40", amber: "bg-amber-500 shadow-amber-500/40", success: "bg-emerald-500 shadow-emerald-500/40" };

    return (
        <div className="flex flex-col h-full bg-surface-900/30 border border-white/5 rounded-[2.5rem] p-6 min-h-[600px] relative overflow-hidden group/column">
            {/* Visual Accent */}
            <div className={cn("absolute top-0 left-0 w-full h-1 opacity-40", color === 'primary' ? 'bg-primary' : color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500')} />

            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full shadow-lg", colorMap[color])} />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/80">{title}</h3>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-surface-950 border border-white/5 text-[10px] font-black text-text-dim">
                    {count}
                </div>
            </div>

            <div className="flex-1 space-y-5">
                <AnimatePresence mode="popLayout">
                    {proposals.length === 0 ? (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-48 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-white/5 rounded-[2rem]">
                            <ClipboardList size={32} strokeWidth={1} />
                            <p className="mt-3 text-[9px] font-black uppercase tracking-[0.2em]">Zero Data</p>
                        </motion.div>
                    ) : (
                        proposals.map((proposal) => (
                            <ProposalCard 
                                key={proposal.id} 
                                proposal={proposal} 
                                onAccept={onAccept}
                                onReject={onReject}
                                onToggleShortlist={onToggleShortlist}
                                isShortlisted={shortlistedIds.has(proposal.id)}
                                loading={loading}
                                onProfileClick={onProfileClick}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function ProposalCard({ proposal, onAccept, onReject, onToggleShortlist, isShortlisted, loading, onProfileClick }) {
    const influencer = proposal.profiles_influencer;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card !rounded-[1.75rem] p-5 group/card hover:border-primary/30 transition-all border-white/5 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between mb-5 relative z-10">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onProfileClick(influencer)}>
                    <div className="w-12 h-12 rounded-2xl bg-surface-800 border border-white/10 p-0.5 overflow-hidden shadow-lg group-hover/card:scale-105 transition-transform">
                        {influencer?.avatar_url ? (
                            <img src={influencer.avatar_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary font-black text-sm uppercase bg-primary/10">
                                {influencer?.full_name?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white leading-tight mb-1 group-hover/card:text-primary transition-colors">
                            {influencer?.full_name}
                        </h4>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-text-dim uppercase tracking-wider">{influencer?.niche}</span>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-[9px] font-black text-text-dim uppercase tracking-wider">{influencer?.city}</span>
                        </div>
                    </div>
                </div>
                
                {proposal.status === 'Pending' && (
                    <button 
                        onClick={() => onToggleShortlist(proposal.id)}
                        className={cn(
                            "p-2 rounded-xl transition-all cursor-pointer",
                            isShortlisted ? "bg-amber-500/20 text-amber-400 border border-amber-500/20" : "bg-white/5 text-text-dim hover:text-white border border-white/5"
                        )}
                    >
                        {isShortlisted ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
                <div className="bg-surface-950/50 border border-white/5 p-3 rounded-2xl">
                    <span className="text-[8px] font-black text-text-dim uppercase tracking-widest mb-1 block">Quoted</span>
                    <span className="text-xs font-black text-white">{formatINR(proposal.quoted_price)}</span>
                </div>
                <div className="bg-surface-950/50 border border-white/5 p-3 rounded-2xl">
                    <span className="text-[8px] font-black text-text-dim uppercase tracking-widest mb-1 block">Reach</span>
                    <span className="text-xs font-black text-primary">{formatFollowers(influencer?.followers_count)}</span>
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-5 relative z-10">
                <p className="text-xs text-text-secondary line-clamp-2 italic leading-relaxed font-medium">
                    "{proposal.cover_letter}"
                </p>
            </div>

            <div className="relative z-10">
                {proposal.status === 'Pending' ? (
                    <ProposalActions proposal={proposal} onAccept={onAccept} onReject={onReject} loading={loading} />
                ) : (
                    <div className={cn(
                        "flex items-center justify-center gap-2 p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest",
                        proposal.status === 'Accepted' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/5 text-text-dim"
                    )}>
                        {proposal.status === 'Accepted' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {proposal.status === 'Accepted' ? 'Hired' : 'Rejected'}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
