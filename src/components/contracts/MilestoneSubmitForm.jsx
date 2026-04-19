import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Link as LinkIcon, AlignLeft, Send, X, Zap, Globe, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PREMIUM_SPRING, MICRO_INTERACTION } from '../../lib/motion';

const MilestoneSubmitForm = ({ milestoneId, onSubmit, onCancel }) => {
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({ 
        link: submissionLink, 
        notes: submissionNotes 
      });
      setSubmissionLink('');
      setSubmissionNotes('');
      onCancel();
    } catch (err) {
      setError(err.message || 'Transmission failed. Verify node status and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto overflow-hidden rounded-[2.5rem] border border-white/10 bg-surface-950 shadow-2xl relative">
      {/* Header Visual */}
      <div className="h-24 bg-gradient-to-br from-primary/20 via-surface-950 to-surface-950 border-b border-white/5 flex items-center px-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-glow">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="text-xl font-display font-black text-white tracking-tight leading-none mb-1 text-left">Transmission Node</h3>
            <p className="text-[10px] text-text-dim uppercase tracking-[0.25em] font-black">Syncing Milestone Deliverables</p>
          </div>
        </div>
        <button 
          onClick={onCancel}
          className="ml-auto p-2.5 rounded-xl bg-white/5 text-text-muted hover:text-white transition-all border border-white/5 cursor-pointer"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8 text-left">
        <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
              >
                <X size={14} />
                {error}
              </motion.div>
            )}
        </AnimatePresence>

        <div className="space-y-6">
            {/* Submission Link */}
            <div className="space-y-2">
              <label htmlFor="link" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 flex items-center gap-2">
                <Globe size={12} className="text-primary" />
                Live Transmission Link
              </label>
              <div className="relative group">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                  <input
                    id="link"
                    type="url"
                    required
                    disabled={isSubmitting}
                    placeholder="e.g. cloud.storage/node-assets-v1"
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface-900 border border-white/5 text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  />
              </div>
            </div>

            {/* Submission Notes */}
            <div className="space-y-2">
              <label htmlFor="notes" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 flex items-center gap-2">
                <Sparkles size={12} className="text-primary" />
                Operational Context
              </label>
              <div className="relative group">
                  <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                  <textarea
                    id="notes"
                    rows={4}
                    disabled={isSubmitting}
                    placeholder="Provide specific details or documentation for this node..."
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-[2rem] bg-surface-900 border border-white/5 text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none leading-relaxed"
                  />
              </div>
            </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-white/5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:flex-1 py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-white transition-all cursor-pointer order-2 sm:order-1"
          >
            Abort Sync
          </button>
          <motion.button
            {...MICRO_INTERACTION}
            type="submit"
            disabled={isSubmitting || !submissionLink}
            className="w-full sm:flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/20 disabled:opacity-50 cursor-pointer order-1 sm:order-2"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} strokeWidth={3} />
            )}
            Execute Sync
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default MilestoneSubmitForm;
