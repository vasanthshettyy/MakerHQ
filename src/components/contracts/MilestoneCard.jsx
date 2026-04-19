import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Clock, 
  Send, 
  Search, 
  MessageSquare,
  Zap,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { PREMIUM_SPRING, MICRO_INTERACTION } from '../../lib/motion';
import MilestoneSubmitForm from './MilestoneSubmitForm';
import MilestoneReviewPanel from './MilestoneReviewPanel';

const StatusBadge = ({ status }) => {
  const configs = {
    'Pending': { bg: 'bg-white/5 border-white/5 text-text-muted', icon: <Clock size={12} />, label: 'Pending' },
    'Submitted': { bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400', icon: <Send size={12} />, label: 'Submitted' },
    'In_Review': { bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400', icon: <Search size={12} />, label: 'Reviewing' },
    'Approved': { bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', icon: <CheckCircle size={12} />, label: 'Verified' },
    'Revision_Requested': { bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400', icon: <AlertCircle size={12} />, label: 'Correction Required' }
  };

  const config = configs[status] || configs['Pending'];

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border transition-all shadow-sm",
      config.bg
    )}>
      {config.icon}
      {config.label}
    </div>
  );
};

const MilestoneCard = ({ milestone, isBrand, isLocked, onSubmit, onApprove, onRevision }) => {
  const [showForm, setShowForm] = useState(false);
  const { 
    milestone_name, 
    status, 
    submission_link, 
    submission_notes, 
    brand_feedback 
  } = milestone;

  const isInfluencer = !isBrand;
  const showInfluencerAction = isInfluencer && !isLocked && (status === 'Pending' || status === 'Revision_Requested');
  const showBrandAction = isBrand && (status === 'Submitted' || status === 'In_Review');

  return (
    <div className={cn(
      "glass-card !rounded-[2rem] border-white/5 p-6 transition-all relative overflow-hidden",
      isLocked ? "opacity-40 grayscale" : "bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10"
    )}>
      <div className="flex flex-col gap-6 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
             <div className={cn(
                 "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all",
                 status === 'Approved' ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-white/5 border-white/5 text-text-muted"
             )}>
                 {status === 'Approved' ? <CheckCircle size={18} /> : <Zap size={18} />}
             </div>
             <div className="min-w-0">
                <h4 className="text-sm font-bold text-white tracking-tight truncate leading-none mb-2">
                  {milestone_name}
                </h4>
                <StatusBadge status={status} />
             </div>
          </div>
          
          {(showInfluencerAction || showBrandAction) && (
            <motion.button
              {...MICRO_INTERACTION}
              onClick={() => setShowForm(!showForm)}
              disabled={isLocked}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg cursor-pointer flex items-center gap-2",
                showForm ? "bg-white/5 text-white border border-white/10" : "bg-primary text-white shadow-primary/20"
              )}
            >
              {showForm ? 'Cancel Operation' : (isBrand ? 'Execute Review' : 'Initialize Submission')}
              {!showForm && <ArrowRight size={12} strokeWidth={3} />}
            </motion.button>
          )}
        </div>

        {/* Intelligence Tier */}
        {!showForm && (
            <div className="space-y-5">
              {submission_link && (
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-dim px-1">Transmission Data</span>
                  <div className="flex">
                    <a 
                        href={submission_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-950 border border-white/5 text-xs text-primary hover:text-white hover:border-primary/40 transition-all group/link max-w-full overflow-hidden"
                    >
                        <ExternalLink size={14} className="shrink-0" />
                        <span className="truncate font-bold tracking-tight">{submission_link}</span>
                    </a>
                  </div>
                </div>
              )}

              {submission_notes && (
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-dim px-1">Node Commentary</span>
                  <div className="p-4 rounded-2xl bg-surface-950/50 border border-white/5 shadow-inner">
                    <p className="text-xs text-text-secondary leading-relaxed font-medium italic opacity-90">
                      "{submission_notes}"
                    </p>
                  </div>
                </div>
              )}

              {brand_feedback && (
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-dim px-1">Correction Directives</span>
                  <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex gap-3">
                    <MessageSquare size={14} className="text-rose-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-300/80 leading-relaxed font-medium">
                        {brand_feedback}
                    </p>
                  </div>
                </div>
              )}
            </div>
        )}

        {/* Transaction Interfaces */}
        <AnimatePresence>
            {showForm && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="pt-6 border-t border-white/5">
                        {showInfluencerAction && (
                            <MilestoneSubmitForm 
                                milestoneId={milestone.id} 
                                onSubmit={async (data) => { await onSubmit(milestone.id, data); setShowForm(false); }} 
                                onCancel={() => setShowForm(false)} 
                            />
                        )}
                        {showBrandAction && (
                            <MilestoneReviewPanel 
                                milestone={milestone} 
                                onApprove={async () => { await onApprove(milestone.id); setShowForm(false); }} 
                                onRequestRevision={async (feedback) => { await onRevision(milestone.id, feedback); setShowForm(false); }} 
                                onCancel={() => setShowForm(false)} 
                            />
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MilestoneCard;
