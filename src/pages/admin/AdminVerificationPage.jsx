import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import VerificationModerationPanel from '../../components/admin/VerificationModerationPanel';
import { Loader2, ShieldCheck, Database, Search, Filter, Sparkles, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../../components/layout/PageWrapper';
import { cn } from '../../lib/utils';

const AdminVerificationPage = () => {
  const [pendingProofs, setPendingProofs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchPendingProofs = async () => {
    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('verification_proofs')
        .select(`
          id, 
          influencer_id, 
          platform, 
          proof_url, 
          submitted_at, 
          status,
          profiles_influencer (
            full_name
          )
        `)
        .eq('status', 'Pending')
        .order('submitted_at', { ascending: true });

      if (fetchError) throw fetchError;
      setPendingProofs(data || []);
    } catch (err) {
      console.error('Error fetching pending proofs:', err);
      setError('Failed to synchronize audit stream.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProofs();
  }, []);

  const handleReview = async (proofId, newStatus, adminNotes) => {
    setMessage(null);
    try {
      const { error: updateError } = await supabase
        .from('verification_proofs')
        .update({
          status: newStatus,
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', proofId);

      if (updateError) throw updateError;

      if (newStatus === 'Approved') {
        const proof = pendingProofs.find(p => p.id === proofId);
        if (proof) {
          await supabase
            .from('profiles_influencer')
            .update({ is_verified: true })
            .eq('user_id', proof.influencer_id);
        }
      }

      setPendingProofs(prev => prev.filter(p => p.id !== proofId));
      setMessage({ type: 'success', text: `Audit node ${newStatus.toLowerCase()} successfully.` });
    } catch (err) {
      console.error('Error reviewing proof:', err);
      setMessage({ type: 'error', text: 'Synchronization failed. Retry protocol.' });
      throw err;
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <PageWrapper title="Trust & Safety" subtitle="Review and moderate influencer analytics for account verification.">
      <div className="space-y-10 pb-20">
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className={`fixed top-24 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 ${
                        message.type === 'success' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}
                >
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        message.type === 'success' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500"
                    )} />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">{message.text}</p>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-glow">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-display font-black text-white tracking-tight leading-none mb-1 uppercase">Audit Queue</h2>
                    <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Pending Analysis: {pendingProofs.length} Nodes</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
                    <Database size={14} className="text-primary" />
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none">Security Level: High</span>
                </div>
            </div>
        </div>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6 opacity-40">
                <Loader2 size={48} className="text-primary animate-spin shadow-glow" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim">Decrypting Queue...</p>
            </div>
        ) : error ? (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center glass-card !rounded-[3rem] bg-rose-500/5 border-rose-500/20"
            >
                <AlertCircle size={40} className="text-rose-500 mx-auto mb-4" />
                <p className="text-sm text-rose-400 font-bold uppercase tracking-widest mb-6">{error}</p>
                <button 
                    onClick={fetchPendingProofs}
                    className="btn-secondary px-8 py-3 text-xs"
                >
                    Reset Protocol
                </button>
            </motion.div>
        ) : pendingProofs.length === 0 ? (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-32 glass-card !rounded-[3rem] border-dashed border-white/10 bg-white/[0.01]"
            >
                <div className="w-20 h-20 rounded-3xl bg-surface-900 border border-white/5 flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full animate-pulse" />
                    <ShieldCheck size={32} className="text-success relative z-10" />
                </div>
                <h3 className="text-xl font-display font-black text-white mb-2 uppercase tracking-tight">Queue Synchronized</h3>
                <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Zero Nodes Pending Validation</p>
            </motion.div>
        ) : (
            <VerificationModerationPanel 
                pendingProofs={pendingProofs} 
                onReview={handleReview} 
            />
        )}
      </div>
    </PageWrapper>
  );
};

export default AdminVerificationPage;
