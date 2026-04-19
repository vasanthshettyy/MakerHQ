import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ShieldCheck, 
  Instagram, 
  Youtube, 
  AlertCircle,
  Database,
  ArrowRight,
  ShieldEllipsis
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { STAGGER_CONTAINER, STAGGER_ITEM } from '../../lib/motion';

const VerificationStatus = ({ proofs = [] }) => {
  if (proofs.length === 0) {
    return (
      <div className="p-8 rounded-[2rem] bg-surface-900 border border-white/5 text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-text-dim border border-white/5">
          <ShieldEllipsis size={32} strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <h4 className="text-white font-bold tracking-tight">Trust Protocol Inactive</h4>
          <p className="text-xs text-text-muted max-w-[280px] mx-auto leading-relaxed">
            Your reach has not been synchronized. Upload analytics evidence to initialize node verification.
          </p>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Approved':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          icon: <ShieldCheck size={14} className="mr-1.5 shadow-glow" />,
          label: 'Validated'
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          icon: <XCircle size={14} className="mr-1.5" />,
          label: 'Failed'
        };
      case 'Pending':
      default:
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          icon: <Clock size={14} className="mr-1.5" />,
          label: 'In Audit'
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
            <Database size={14} className="text-primary" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-text-dim">
                Audit Stream
            </h3>
        </div>
        <span className="text-[9px] font-black text-text-muted bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
          {proofs.length} NODE LOGS
        </span>
      </div>

      <motion.div 
        variants={STAGGER_CONTAINER}
        initial="hidden"
        animate="show"
        className="grid gap-4"
      >
        {proofs.map((proof, index) => {
          const config = getStatusConfig(proof.status);
          const isInstagram = proof.platform?.toLowerCase() === 'instagram';

          return (
            <motion.div 
              key={index}
              variants={STAGGER_ITEM}
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.02] p-5 transition-all duration-500 hover:border-white/20"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl border flex items-center justify-center shadow-inner transition-all",
                    isInstagram ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                  )}>
                    {isInstagram ? <Instagram size={24} /> : <Youtube size={24} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {proof.platform} Analytics
                    </h4>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">Transmission Ledger: Manual Review</p>
                  </div>
                </div>

                <div className={cn(
                  "inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border transition-all shadow-lg",
                  config.bg
                )}>
                  {config.icon}
                  {config.label}
                </div>
              </div>

              {/* Admin Feedback Box */}
              {proof.status === 'Rejected' && proof.admin_notes && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-5 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex gap-3 relative z-10"
                >
                  <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Protocol Directives</span>
                    <p className="text-xs text-rose-200/60 leading-relaxed italic font-medium">
                      "{proof.admin_notes}"
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Success Decoration */}
              {proof.status === 'Approved' && (
                <div className="absolute -right-6 -bottom-6 p-10 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default VerificationStatus;
