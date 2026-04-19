import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Loader2, 
  User, 
  Calendar,
  AlertCircle,
  Clock,
  ShieldCheck,
  Zap,
  Info,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MICRO_INTERACTION, PREMIUM_SPRING, STAGGER_CONTAINER, STAGGER_ITEM } from '../../lib/motion';

const VerificationModerationPanel = ({ pendingProofs = [], onReview }) => {
  const [processingId, setProcessingId] = useState(null);
  const [rejectionId, setRejectionId] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [error, setError] = useState(null);

  const handleApprove = async (proofId) => {
    setProcessingId(proofId);
    setError(null);
    try {
      await onReview(proofId, 'Approved', null);
    } catch (err) {
      setError(err.message || 'Validation sequence failed.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (proofId) => {
    if (!adminNotes.trim()) {
      setError('Directive notes required for failed validation.');
      return;
    }
    
    setProcessingId(proofId);
    setError(null);
    try {
      await onReview(proofId, 'Rejected', adminNotes);
      setRejectionId(null);
      setAdminNotes('');
    } catch (err) {
      setError(err.message || 'Rejection protocol failed.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <motion.div 
        variants={STAGGER_CONTAINER}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      {pendingProofs.map((proof) => (
        <motion.div 
          key={proof.id} 
          variants={STAGGER_ITEM}
          className="group flex flex-col glass-card !rounded-[2.5rem] border-white/5 bg-surface-900/40 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Header */}
          <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-surface-950 border border-white/10 flex items-center justify-center text-primary shadow-inner group-hover:scale-105 transition-transform">
                <User size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white tracking-tight truncate leading-none mb-1.5">
                  {proof.profiles_influencer?.full_name || 'Node Identity'}
                </h4>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border",
                    proof.platform?.toLowerCase() === 'instagram' ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                  )}>
                    {proof.platform}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="text-[9px] text-text-dim font-bold uppercase tracking-wider">Analytics Evidence</span>
                </div>
              </div>
            </div>
            
            <motion.a 
              {...MICRO_INTERACTION}
              href={proof.proof_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[9px] font-black tracking-widest text-primary bg-primary/10 hover:bg-primary hover:text-white px-4 py-2 rounded-xl border border-primary/20 transition-all shadow-lg shadow-primary/5"
            >
              INSPECT
              <ExternalLink size={12} />
            </motion.a>
          </div>

          {/* Body */}
          <div className="p-6 flex-1 flex flex-col justify-between space-y-8">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-[10px] text-text-dim font-black uppercase tracking-widest">
                <Clock size={12} />
                Initialized {new Date(proof.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </div>
              <div className="text-[8px] text-text-muted font-mono uppercase">
                NODE_SEC: {proof.id.split('-')[0]}
              </div>
            </div>

            {rejectionId === proof.id ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-rose-400">
                  <AlertCircle size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Correction Directive</span>
                </div>
                <div className="relative">
                    <textarea
                        className="w-full bg-surface-950/50 border border-rose-500/20 rounded-[1.5rem] p-4 text-sm text-white placeholder:text-text-dim outline-none focus:border-rose-500 transition-all resize-none leading-relaxed font-medium"
                        rows={3}
                        placeholder="Provide details on submission failure..."
                        value={adminNotes}
                        onChange={(e) => {
                            setAdminNotes(e.target.value);
                            if (error) setError(null);
                        }}
                        autoFocus
                    />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(proof.id)}
                    disabled={processingId === proof.id}
                    className="flex-[2] bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-[0.2em] py-3.5 rounded-xl transition-all shadow-xl shadow-rose-900/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {processingId === proof.id ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Failure'}
                  </button>
                  <button
                    onClick={() => {
                      setRejectionId(null);
                      setAdminNotes('');
                      setError(null);
                    }}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-text-muted text-[10px] font-black uppercase tracking-[0.2em] py-3.5 rounded-xl transition-all cursor-pointer"
                  >
                    Abort
                  </button>
                </div>
                {error && <p className="text-[10px] text-rose-400 font-bold italic ml-1 flex items-center gap-1.5"><AlertCircle size={10} /> {error}</p>}
              </motion.div>
            ) : (
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <motion.button
                  {...MICRO_INTERACTION}
                  onClick={() => handleApprove(proof.id)}
                  disabled={processingId === proof.id}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {processingId === proof.id ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} strokeWidth={3} />}
                  VALIDATE
                </motion.button>
                <motion.button
                  {...MICRO_INTERACTION}
                  onClick={() => setRejectionId(proof.id)}
                  disabled={processingId === proof.id}
                  className="flex-1 bg-white/5 hover:bg-rose-500/10 border border-white/10 text-text-dim hover:text-rose-400 hover:border-rose-500/20 text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <XCircle size={16} />
                  REJECT
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default VerificationModerationPanel;
