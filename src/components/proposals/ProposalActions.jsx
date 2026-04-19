import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, AlertTriangle, ArrowRight, Zap, ShieldX } from 'lucide-react';
import { MICRO_INTERACTION, PREMIUM_SPRING } from '../../lib/motion';

export default function ProposalActions({ proposal, onAccept, onReject, loading }) {
    const [confirming, setConfirming] = useState(null); // 'accept' or 'reject'

    const handleAction = async (type) => {
        if (type === 'accept') {
            await onAccept(proposal.id);
        } else {
            await onReject(proposal.id);
        }
        setConfirming(null);
    };

    return (
        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-white/5">
            <motion.button
                {...MICRO_INTERACTION}
                onClick={() => setConfirming('reject')}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-text-muted hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 cursor-pointer"
            >
                <ShieldX size={14} />
                Decline
            </motion.button>
            <motion.button
                {...MICRO_INTERACTION}
                onClick={() => setConfirming('accept')}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white hover:brightness-110 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
            >
                <Zap size={14} />
                Initialize
            </motion.button>

            {/* Confirmation Overlay */}
            <AnimatePresence>
                {confirming && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md glass-card !rounded-[2.5rem] p-10 border-white/10 shadow-2xl relative overflow-hidden bg-surface-950"
                        >
                            <div className={`absolute top-0 left-0 w-full h-1 ${confirming === 'accept' ? 'bg-primary' : 'bg-rose-500'}`} />
                            
                            <div className="flex flex-col items-center text-center mb-10">
                                <div className={`p-4 rounded-3xl mb-6 shadow-xl ${confirming === 'accept' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                    {confirming === 'accept' ? <Zap size={32} /> : <AlertTriangle size={32} />}
                                </div>
                                <h3 className="text-2xl font-display font-black text-white tracking-tight mb-2">
                                    {confirming === 'accept' ? 'Initialize Contract?' : 'Decline Signal?'}
                                </h3>
                                <p className="text-sm text-text-muted font-medium">Verify your intent to proceed with this action.</p>
                            </div>

                            {confirming === 'accept' && (
                                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 mb-8">
                                    <p className="text-xs text-text-secondary leading-relaxed font-medium">
                                        <span className="font-black text-primary uppercase tracking-widest mr-1.5">Note:</span> 
                                        Accepting this node will <span className="text-white font-bold">terminate all other active applications</span> for this campaign and immediately instantiate a legal contract framework.
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => setConfirming(null)}
                                    className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-white transition-all cursor-pointer order-2 sm:order-1"
                                >
                                    Abort
                                </button>
                                <button
                                    onClick={() => handleAction(confirming)}
                                    disabled={loading}
                                    className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all cursor-pointer order-1 sm:order-2 ${
                                        confirming === 'accept' 
                                        ? 'bg-primary shadow-primary/20' 
                                        : 'bg-rose-600 shadow-rose-600/20'
                                    }`}
                                >
                                    {loading ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <>
                                            Confirm {confirming === 'accept' ? 'Acceptance' : 'Decline'}
                                            <ArrowRight size={14} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
