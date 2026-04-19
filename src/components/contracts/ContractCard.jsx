import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, FileText, Clock, MessageSquare, ChevronDown, ChevronUp, ExternalLink, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useReviews } from '../../hooks/useReviews';
import { formatINR, formatRelativeTime, cn } from '../../lib/utils';
import { STATUS_COLORS } from '../../lib/constants';
import { MICRO_INTERACTION, PREMIUM_SPRING } from '../../lib/motion';
import ReviewFormModal from '../reviews/ReviewFormModal';
import ReviewPromptBanner from '../reviews/ReviewPromptBanner';
import MilestoneWorkflow from './MilestoneWorkflow';

export default function ContractCard({
    contract,
    onApprove,
    onRevision,
    onSubmitMilestone,
    onAddMilestone,
    onUpdateMilestone,
    onDeleteMilestone,
    isBrand,
    highlight = false
}) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { canLeaveReview } = useReviews();
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [reviewAllowed, setReviewAllowed] = useState(false);

    useEffect(() => {
        if (highlight) setIsExpanded(true);
    }, [highlight]);

    useEffect(() => {
        const checkReviewStatus = async () => {
            if (contract.status === 'Completed' && user) {
                const allowed = await canLeaveReview(contract.id, user.id);
                setReviewAllowed(allowed);
            }
        };
        checkReviewStatus();
    }, [contract, user]);

    // Role-specific data
    const partnerName = isBrand
        ? contract.profiles_influencer?.full_name
        : contract.profiles_brand?.company_name;

    const partnerAvatar = isBrand
        ? contract.profiles_influencer?.avatar_url
        : contract.profiles_brand?.logo_url;

    const targetId = isBrand ? contract.influencer_id : contract.brand_id;

    return (
        <motion.div
            id={contract.id}
            layout
            className={cn(
                "glass-card !rounded-[2rem] p-6 mb-4 cursor-pointer hover:border-white/10 transition-all select-none overflow-hidden relative group/contract bg-white/[0.01]",
                highlight && "border-primary/50 shadow-[0_0_40px_rgba(99,102,241,0.15)] bg-primary/[0.02]"
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover/contract:opacity-100 transition-opacity" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-surface-900 border border-white/5 p-0.5 overflow-hidden shadow-xl group-hover/contract:scale-105 transition-transform shrink-0">
                        {partnerAvatar ? (
                            <img src={partnerAvatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/10 font-black text-lg bg-white/5">
                                {partnerName?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-display font-black text-base text-white flex items-center gap-2 group-hover/contract:text-primary transition-colors leading-tight">
                            <FileText size={16} className="text-primary/70" />
                            {isBrand ? partnerName : contract.gigs?.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-text-dim uppercase tracking-widest">
                                {isBrand ? (
                                    <span className="text-primary">{formatINR(contract.agreed_price)}</span>
                                ) : (
                                    <span className="text-white">with {partnerName}</span>
                                )}
                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                <span className="flex items-center gap-1"><Clock size={10} />{formatRelativeTime(contract.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        {contract.status !== 'Pending' && (
                            <motion.button
                                {...MICRO_INTERACTION}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(isBrand ? '/brand/messages' : '/influencer/messages');
                                }}
                                className="p-2.5 rounded-xl bg-white/5 text-text-muted hover:text-primary hover:bg-primary/10 transition-all border border-white/5"
                            >
                                <MessageSquare size={16} />
                            </motion.button>
                        )}
                        {reviewAllowed && (
                            <motion.button
                                {...MICRO_INTERACTION}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowReviewModal(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all"
                            >
                                <Star size={12} fill="currentColor" />
                                Review
                            </motion.button>
                        )}
                    </div>
                    
                    <div className={cn(
                        "px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest",
                        STATUS_COLORS[contract.status]
                    )}>
                        {contract.status}
                    </div>

                    <div className={cn(
                        "w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-text-dim transition-all",
                        isExpanded ? "bg-primary/20 text-primary border-primary/20 rotate-180" : "group-hover/contract:bg-white/10 group-hover/contract:text-white"
                    )}>
                        <ChevronDown size={20} />
                    </div>
                </div>
            </div>

            {/* Review Prompt Banner */}
            {contract.status === 'Completed' && reviewAllowed && (
                <div className="mt-6 pt-2" onClick={(e) => e.stopPropagation()}>
                    <ReviewPromptBanner
                        onReviewClick={() => setShowReviewModal(true)}
                        partnerName={partnerName}
                        isBrand={isBrand}
                    />
                </div>
            )}

            {/* Milestones Flow */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={PREMIUM_SPRING}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-10 pt-10 border-t border-white/5 cursor-default overflow-hidden relative"
                    >
                        <MilestoneWorkflow
                            contractId={contract.id}
                            milestones={contract.contract_milestones || []}
                            isBrand={isBrand}
                            onApprove={onApprove}
                            onRevision={onRevision}
                            onSubmit={onSubmitMilestone}
                            onAddMilestone={onAddMilestone}
                            onUpdateMilestone={onUpdateMilestone}
                            onDeleteMilestone={onDeleteMilestone}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <ReviewFormModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                contractId={contract.id}
                targetId={targetId}
                targetName={partnerName}
                onSuccess={() => setReviewAllowed(false)}
            />
        </motion.div>
    );
}
