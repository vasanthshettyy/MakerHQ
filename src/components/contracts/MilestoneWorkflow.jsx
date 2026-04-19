import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MilestoneStepper from './MilestoneStepper';
import MilestoneCard from './MilestoneCard';
import MilestoneEditor from './MilestoneEditor';
import { Settings2, Workflow, ArrowRight } from 'lucide-react';
import { PREMIUM_SPRING, MICRO_INTERACTION } from '../../lib/motion';

export default function MilestoneWorkflow({ 
    contractId,
    milestones, 
    isBrand, 
    onSubmit, 
    onApprove, 
    onRevision,
    onAddMilestone,
    onUpdateMilestone,
    onDeleteMilestone
}) {
    const [isEditing, setIsEditing] = useState(false);
    const sortedMilestones = [...milestones].sort((a, b) => a.sort_order - b.sort_order);

    return (
        <div className="space-y-10 relative">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-glow">
                        <Workflow size={16} />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-text-dim">
                        Campaign Execution Protocol
                    </h4>
                </div>
                {isBrand && !isEditing && (
                    <motion.button 
                        {...MICRO_INTERACTION}
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-text-muted hover:text-white transition-all uppercase tracking-widest cursor-pointer"
                    >
                        <Settings2 size={12} />
                        Modify Workflow
                    </motion.button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.div
                        key="editor"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={PREMIUM_SPRING}
                    >
                        <MilestoneEditor 
                            contractId={contractId}
                            existingMilestones={sortedMilestones}
                            onAdd={onAddMilestone}
                            onUpdate={onUpdateMilestone}
                            onDelete={onDeleteMilestone}
                            onClose={() => setIsEditing(false)}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="workflow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-10"
                    >
                        {/* Visual Progress Stepper */}
                        <div className="glass-card !rounded-[2rem] bg-white/[0.01] border-white/5 p-4 shadow-inner relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50" />
                            <MilestoneStepper milestones={sortedMilestones} />
                        </div>

                        {/* Detailed Milestone Cards */}
                        <div className="space-y-4 relative">
                            {/* Vertical Progress Line UI (Visual only) */}
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5 z-0" />
                            
                            {sortedMilestones.map((m, idx) => {
                                const isFirst = idx === 0;
                                const prevApproved = isFirst || sortedMilestones[idx - 1].status === 'Approved';
                                const isLocked = !prevApproved;

                                return (
                                    <motion.div
                                        key={m.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="relative z-10"
                                    >
                                        <MilestoneCard 
                                            milestone={m}
                                            isBrand={isBrand}
                                            isLocked={isLocked}
                                            onSubmit={onSubmit}
                                            onApprove={onApprove}
                                            onRevision={onRevision}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
