import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Send, Star, ShieldCheck, Sparkles, MessageSquareQuote } from 'lucide-react';
import StarRating from './StarRating';
import { useReviews } from '../../hooks/useReviews';
import { useAuth } from '../../context/AuthContext';
import { MICRO_INTERACTION, PREMIUM_SPRING } from '../../lib/motion';
import { cn } from '../../lib/utils';

export default function ReviewFormModal({ 
    isOpen, 
    onClose, 
    contractId, 
    targetId, 
    targetName, 
    onSuccess 
}) {
    const { user, role } = useAuth();
    const { submitReview } = useReviews();
    
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating magnitude.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await submitReview(
                contractId,
                user.id,
                targetId,
                rating,
                comment,
                role
            );
            
            setRating(0);
            setComment('');
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error('Submit review error:', err);
            setError('Synchronization failed. Retry protocol.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 cursor-pointer"
            />

            {/* Modal Container */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 40 }}
                transition={PREMIUM_SPRING}
                className="relative w-full max-w-lg glass-card !rounded-[2.5rem] bg-surface-950 border-white/10 shadow-2xl overflow-hidden"
            >
                {/* Header Visual */}
                <div className="h-24 bg-gradient-to-br from-amber-500/20 via-surface-950 to-surface-950 border-b border-white/5 flex items-center px-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-glow">
                            <Star size={24} fill="currentColor" />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-black text-white tracking-tight leading-none mb-1">Node Resonance</h2>
                            <p className="text-[10px] text-text-dim uppercase tracking-[0.25em] font-black italic">Validating: {targetName}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="ml-auto p-2.5 rounded-xl bg-white/5 text-text-muted hover:text-white transition-all border border-white/5 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-10">
                    {/* Rating Matrix */}
                    <div className="space-y-4 text-center">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                            Signal Magnitude
                        </label>
                        <div className="flex justify-center bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 shadow-inner">
                            <StarRating rating={rating} setRating={setRating} />
                        </div>
                    </div>

                    {/* Commentary Channel */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">
                            Operational Commentary
                        </label>
                        <div className="relative group">
                            <MessageSquareQuote className="absolute left-4 top-4 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                            <textarea
                                required
                                rows={5}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Describe the collaboration protocol and results..."
                                className="w-full pl-11 pr-5 py-5 rounded-[2rem] bg-surface-900 border border-white/5 text-sm text-white placeholder:text-text-dim focus:border-primary/50 transition-all outline-none resize-none leading-relaxed"
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                            >
                                <AlertCircle size={14} />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Matrix */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-white transition-all cursor-pointer order-2 sm:order-1"
                        >
                            Abort Sync
                        </button>
                        <motion.button
                            {...MICRO_INTERACTION}
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] btn-primary py-4 text-base shadow-2xl shadow-primary/20 order-1 sm:order-2"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Syncing Node...</>
                            ) : (
                                <><Send size={18} className="mr-2" /> Sync Feedback</>
                            )}
                        </motion.button>
                    </div>

                    <div className="flex items-center justify-center gap-2 opacity-30 pt-2">
                        <ShieldCheck size={12} className="text-primary" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-text-muted">Protocol Logged</span>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
