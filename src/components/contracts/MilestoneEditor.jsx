import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, X, ListChecks, Loader2, GripVertical, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PREMIUM_SPRING, MICRO_INTERACTION, STAGGER_CONTAINER, STAGGER_ITEM } from '../../lib/motion';

export default function MilestoneEditor({ 
    contractId, 
    existingMilestones, 
    onAdd, 
    onUpdate, 
    onDelete, 
    onClose 
}) {
    const [loading, setLoading] = useState(false);
    const [milestones, setMilestones] = useState(
        existingMilestones.length > 0 
        ? [...existingMilestones].sort((a, b) => a.sort_order - b.sort_order)
        : []
    );

    const handleAdd = () => {
        if (milestones.length >= 6) return;
        const newOrder = milestones.length + 1;
        setMilestones([...milestones, { id: 'temp-' + Date.now(), milestone_name: '', sort_order: newOrder, isNew: true }]);
    };

    const handleRemove = async (idx) => {
        const m = milestones[idx];
        if (!m.isNew) {
            setLoading(true);
            await onDelete(m.id);
            setLoading(false);
        }
        setMilestones(milestones.filter((_, i) => i !== idx).map((item, i) => ({ ...item, sort_order: i + 1 })));
    };

    const handleSaveAll = async () => {
        setLoading(true);
        try {
            for (const m of milestones) {
                if (m.isNew) {
                    if (m.milestone_name.trim()) {
                        await onAdd(contractId, { name: m.milestone_name, order: m.sort_order });
                    }
                } else {
                    const original = existingMilestones.find(ex => ex.id === m.id);
                    if (original && (original.milestone_name !== m.milestone_name || original.sort_order !== m.sort_order)) {
                        await onUpdate(m.id, { name: m.milestone_name, order: m.sort_order });
                    }
                }
            }
            onClose();
        } catch (err) {
            console.error('Failed to save milestones:', err);
        } finally {
            setLoading(false);
        }
    };

    const suggestDefault = () => {
        const defaults = [
            { id: 'd1', milestone_name: 'Creative Direction / Script', sort_order: 1, isNew: true },
            { id: 'd2', milestone_name: 'Draft Concept / Rough Cut', sort_order: 2, isNew: true },
            { id: 'd3', milestone_name: 'Final Asset Production', sort_order: 3, isNew: true }
        ];
        setMilestones(defaults);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-10 rounded-[2.5rem] bg-surface-950 border border-white/10 shadow-2xl space-y-10"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-glow">
                        <ListChecks size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-display font-black text-white tracking-tight leading-none mb-1 text-left">Workflow Logic</h3>
                        <p className="text-[10px] text-text-dim uppercase tracking-[0.25em] font-black">Configure Campaign Deployment Steps</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {milestones.length === 0 && (
                        <motion.button 
                            {...MICRO_INTERACTION}
                            onClick={suggestDefault}
                            className="text-[10px] font-black text-primary hover:text-white transition-all uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl border border-primary/20 bg-primary/5 cursor-pointer"
                        >
                            Suggest Standard Node Map
                        </motion.button>
                    )}
                    <motion.button 
                        {...MICRO_INTERACTION}
                        onClick={handleAdd}
                        disabled={milestones.length >= 6}
                        className="p-2.5 rounded-xl bg-white/5 text-text-muted hover:text-white border border-white/5 transition-all disabled:opacity-20 cursor-pointer"
                    >
                        <Plus size={20} strokeWidth={3} />
                    </motion.button>
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence initial={false} mode="popLayout">
                    {milestones.map((m, idx) => (
                        <motion.div 
                            key={m.id}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex items-center gap-4 group/item"
                        >
                            <div className="w-10 h-10 rounded-xl bg-surface-900 border border-white/5 flex items-center justify-center text-xs font-black text-text-muted shrink-0 shadow-inner group-hover/item:text-primary group-hover/item:border-primary/20 transition-all">
                                {idx + 1}
                            </div>
                            <div className="flex-1 relative group/input">
                                <GripVertical className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/5 group-hover/input:text-white/20 transition-colors pointer-events-none" />
                                <input 
                                    type="text" 
                                    value={m.milestone_name}
                                    onChange={e => {
                                        const newMs = [...milestones];
                                        newMs[idx].milestone_name = e.target.value;
                                        setMilestones(newMs);
                                    }}
                                    disabled={!m.isNew && m.status !== 'Pending'}
                                    placeholder="e.g. Asset Synchronization"
                                    className="w-full pl-10 pr-4 py-3 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none disabled:opacity-40"
                                />
                            </div>
                            <motion.button 
                                {...MICRO_INTERACTION}
                                onClick={() => handleRemove(idx)}
                                disabled={!m.isNew && m.status !== 'Pending'}
                                className="p-3 rounded-xl text-rose-400/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all disabled:opacity-0 cursor-pointer"
                            >
                                <Trash2 size={18} />
                            </motion.button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {milestones.length === 0 && (
                    <div className="py-16 text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                        <p className="text-[10px] text-text-dim uppercase font-black tracking-[0.3em]">No Operational Steps Defined</p>
                    </div>
                )}
            </div>

            <div className="p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 flex gap-4">
                <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-text-muted leading-relaxed font-medium">
                    <span className="text-amber-400 font-bold uppercase tracking-widest text-[9px] mr-1.5">Logic Guard:</span> 
                    Milestones already in progress or approved cannot be deleted. Changes will propagate across the creator dashboard instantly.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-white/5">
                <button 
                    onClick={onClose}
                    className="w-full sm:flex-1 py-4 rounded-2xl bg-white/5 border border-white/5 text-text-muted text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-all cursor-pointer order-2 sm:order-1"
                >
                    Cancel Edit
                </button>
                <motion.button 
                    {...MICRO_INTERACTION}
                    onClick={handleSaveAll}
                    disabled={loading || milestones.length === 0 || milestones.some(m => !m.milestone_name.trim())}
                    className="w-full sm:flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/20 disabled:opacity-50 cursor-pointer order-1 sm:order-2"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} strokeWidth={3} />}
                    Sync Workflow
                </motion.button>
            </div>
        </motion.div>
    );
}
