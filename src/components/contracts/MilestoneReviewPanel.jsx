import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  RotateCcw, 
  X, 
  AlertCircle, 
  Loader2,
  MessageSquareQuote,
  ShieldCheck,
  Zap,
  Info,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { PREMIUM_SPRING, MICRO_INTERACTION } from '../../lib/motion';

const MilestoneReviewPanel = ({ 
  milestone, 
  onApprove, 
  onRequestRevision, 
  onCancel 
}) => {
  const [feedback, setFeedback] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleApprove = async () => {
    setError(null);
    setIsProcessing(true);
    try {
      await onApprove();
      onCancel();
    } catch (err) {
      setError(err.message || 'Failed to approve milestone.');
      setIsProcessing(false);
    }
  };

  const handleRequestRevision = async () => {
    setError(null);
    if (!feedback.trim()) {
      setError('Please provide feedback explaining what needs to be revised.');
      return;
    }
    setIsProcessing(true);
    try {
      await onRequestRevision(feedback);
      onCancel();
    } catch (err) {
      setError(err.message || 'Failed to request revision.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto overflow-hidden rounded-[2.5rem] border border-white/10 bg-surface-950 shadow-2xl relative">
      {/* Header Visual */}
      <div className="h-24 bg-gradient-to-br from-primary/20 via-surface-950 to-surface-950 border-b border-white/5 flex items-center px-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-xl font-display font-black text-white tracking-tight leading-none mb-1">Audit Protocol</h3>
            <p className="text-[10px] text-text-dim uppercase tracking-[0.25em] font-black">Validating: {milestone.milestone_name}</p>
          </div>
        </div>
        <button 
          onClick={onCancel}
          className="ml-auto p-2.5 rounded-xl bg-white/5 text-text-muted hover:text-white transition-all border border-white/5 cursor-pointer"
          disabled={isProcessing}
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-8 md:p-10 space-y-8">
        {/* Core Submission Intel */}
        {(milestone.submission_link || milestone.submission_notes) && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-1">
                <Info size={12} className="text-primary" />
                <h4 className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Transmission Data</h4>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {milestone.submission_link && (
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-primary/20 transition-all">
                    <span className="block text-[8px] text-text-dim uppercase font-black tracking-widest mb-2">Live Asset Link</span>
                    <a 
                      href={milestone.submission_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-primary hover:text-white font-bold transition-colors break-all flex items-center gap-2"
                    >
                      {milestone.submission_link}
                      <ArrowRight size={14} />
                    </a>
                  </div>
                )}
                {milestone.submission_notes && (
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="block text-[8px] text-text-dim uppercase font-black tracking-widest mb-2">Node Context</span>
                    <p className="text-sm text-text-secondary italic font-medium leading-relaxed">
                      "{milestone.submission_notes}"
                    </p>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Feedback Channel */}
        <div className="space-y-3">
          <label htmlFor="feedback" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">
            Verification Directives
          </label>
          <div className="relative group">
              <MessageSquareQuote className="absolute left-4 top-4 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
              <textarea
                id="feedback"
                rows={5}
                disabled={isProcessing}
                placeholder="Specify required corrections or validation notes..."
                value={feedback}
                onChange={(e) => {
                  setFeedback(e.target.value);
                  if (error) setError(null);
                }}
                className={cn(
                  "w-full pl-11 pr-4 py-4 rounded-[2rem] bg-surface-900 border border-white/5 text-sm text-white placeholder:text-text-dim outline-none transition-all resize-none leading-relaxed",
                  "focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
                  error && "border-rose-500/50 focus:ring-rose-500/20"
                )}
              />
          </div>
          <AnimatePresence>
            {error && (
                <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-[10px] text-rose-400 font-black uppercase tracking-widest mt-2 ml-1"
                >
                    <AlertCircle size={14} />
                    {error}
                </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Action Matrix */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
          <motion.button
            {...MICRO_INTERACTION}
            onClick={handleRequestRevision}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
            Request Revision
          </motion.button>

          <motion.button
            {...MICRO_INTERACTION}
            onClick={handleApprove}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={3} />}
            Finalize Validation
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneReviewPanel;
