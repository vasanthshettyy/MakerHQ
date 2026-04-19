import { motion } from 'framer-motion';
import { Check, Clock, Send, AlertCircle, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PREMIUM_SPRING } from '../../lib/motion';

export default function MilestoneStepper({ milestones }) {
    const sortedMilestones = [...milestones].sort((a, b) => a.sort_order - b.sort_order);
    const approvedCount = sortedMilestones.filter(m => m.status === 'Approved').length;
    const progressPercent = (approvedCount / Math.max(1, sortedMilestones.length - 1)) * 100;

    return (
        <div className="w-full overflow-x-auto pb-6 hide-scrollbar px-4 md:px-8">
            <div className="relative flex items-center justify-between min-w-[600px] py-10">
                {/* Infrastructure Lines */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 rounded-full z-0" />
                
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={PREMIUM_SPRING}
                    className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary via-primary-light to-secondary -translate-y-1/2 z-0 shadow-glow"
                />

                {sortedMilestones.map((m, idx) => {
                    const isApproved = m.status === 'Approved';
                    const isCurrent = !isApproved && (idx === 0 || sortedMilestones[idx - 1].status === 'Approved');
                    const isSubmitted = m.status === 'Submitted' || m.status === 'In_Review';
                    const isRevision = m.status === 'Revision_Requested';

                    return (
                        <div key={m.id} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isCurrent ? 1.1 : 1,
                                    backgroundColor: isApproved ? 'var(--color-success)' : isCurrent ? 'var(--color-primary)' : isSubmitted ? 'var(--color-primary-light)' : isRevision ? 'var(--color-error)' : 'var(--color-surface-800)',
                                    borderColor: isCurrent || isApproved ? 'transparent' : 'rgba(255,255,255,0.1)'
                                }}
                                className={cn(
                                    "w-12 h-12 rounded-2xl border-2 flex items-center justify-center shadow-2xl transition-all duration-500",
                                    isCurrent && "shadow-primary/40 scale-110 border-white/20",
                                    isApproved && "shadow-success/20"
                                )}
                            >
                                {isApproved ? (
                                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                                ) : isSubmitted ? (
                                    <Send className="w-5 h-5 text-white animate-pulse" />
                                ) : isRevision ? (
                                    <AlertCircle className="w-5 h-5 text-white" />
                                ) : isCurrent ? (
                                    <Zap className="w-5 h-5 text-white animate-pulse" />
                                ) : (
                                    <span className="text-[10px] font-black text-white/30 uppercase">{idx + 1}</span>
                                )}
                            </motion.div>
                            
                            {/* Metadata Float */}
                            <div className="absolute top-14 whitespace-nowrap text-center">
                                <motion.p 
                                    animate={{ opacity: isCurrent || isApproved ? 1 : 0.4 }}
                                    className={cn(
                                        "text-[10px] font-black uppercase tracking-[0.15em]",
                                        isApproved ? "text-success" : isCurrent ? "text-primary" : "text-text-muted"
                                    )}
                                >
                                    {m.milestone_name}
                                </motion.p>
                                <p className="text-[8px] font-bold text-text-dim uppercase mt-1 tracking-widest">
                                    {m.status.replace('_', ' ')}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
