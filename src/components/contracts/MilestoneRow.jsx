import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Send, CheckCircle, AlertCircle, Loader2, Link as LinkIcon, AlignLeft, ArrowRight, Zap, RefreshCcw } from 'lucide-react';
import { STATUS_COLORS } from '../../lib/constants';
import { MICRO_INTERACTION, PREMIUM_SPRING } from '../../lib/motion';
import { cn } from '../../lib/utils';

export default function MilestoneRow({ milestone, onSubmit, onApprove, onRevision, isBrand }) {
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [url, setUrl] = useState('');
    const [note, setNote] = useState('');

    const statusIcon = {
        Pending: <Clock className="w-4 h-4 text-text-muted" />,
        Submitted: <Send className="w-4 h-4 text-primary" />,
        Approved: <CheckCircle className="w-4 h-4 text-success" />,
        Revision_Requested: <AlertCircle className="w-4 h-4 text-warning" />,
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onSubmit(milestone.id, { url, note });
            setShowForm(false);
        } catch (err) {
            console.error(err);
        }
        setSubmitting(false);
    }

    if (isBrand) {
        return (
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 mb-3 group hover:border-white/10 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        milestone.status === 'Approved' ? "bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
                        milestone.status === 'Submitted' ? "bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "bg-zinc-600"
                    )} />
                    <span className="text-xs font-bold text-white truncate">{milestone.title}</span>
                    <div className={cn(
                        "px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest",
                        STATUS_COLORS[milestone.status]
                    )}>
                        {milestone.status?.replace('_', ' ')}
                    </div>
                </div>
                {milestone.status === 'Submitted' && (
                    <div className="flex gap-3">
                        <button 
                            onClick={() => onRevision(milestone.id, 'Revision required for deployment.')} 
                            className="text-[10px] text-warning font-black uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
                        >
                            Revision
                        </button>
                        <button 
                            onClick={() => onApprove(milestone.id)} 
                            className="text-[10px] text-success font-black uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
                        >
                            Approve
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 mb-4 group hover:border-white/10 transition-all">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    {statusIcon[milestone.status] || statusIcon.Pending}
                    <span className="text-sm font-bold text-white">{milestone.title}</span>
                    <div className={cn(
                        "px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest",
                        STATUS_COLORS[milestone.status] || ''
                    )}>
                        {milestone.status?.replace('_', ' ')}
                    </div>
                </div>

                {(milestone.status === 'Pending' || milestone.status === 'Revision_Requested') && (
                    <motion.button 
                        {...MICRO_INTERACTION}
                        onClick={() => setShowForm(!showForm)}
                        className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest cursor-pointer"
                    >
                        {showForm ? 'Cancel' : 'Submit Node'}
                    </motion.button>
                )}
            </div>

            {milestone.revision_note && milestone.status === 'Revision_Requested' && (
                <div className="mt-3 p-3 rounded-xl bg-warning/5 border border-warning/10 flex items-start gap-3">
                    <RefreshCcw className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                    <p className="text-[11px] text-warning/90 leading-relaxed font-medium">
                        <span className="font-black uppercase tracking-widest text-[9px] mr-1.5">Directive:</span>
                        {milestone.revision_note}
                    </p>
                </div>
            )}

            <AnimatePresence>
                {showForm && (
                    <motion.form 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleSubmit} 
                        className="mt-5 space-y-4 pt-4 border-t border-white/5"
                    >
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-dim ml-1">Asset Link</label>
                            <div className="relative group">
                                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="url" 
                                    required
                                    value={url} 
                                    onChange={e => setUrl(e.target.value)}
                                    placeholder="e.g. cloud.storage/asset-v1"
                                    className="w-full pl-10 pr-4 py-2.5 bg-surface-950 border border-white/5 rounded-xl text-xs text-white outline-none focus:border-primary/50 transition-all" 
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-text-dim ml-1">Process Note</label>
                            <div className="relative group">
                                <AlignLeft className="absolute left-3.5 top-3 w-3.5 h-3.5 text-text-dim group-focus-within:text-primary transition-colors" />
                                <textarea 
                                    value={note} 
                                    onChange={e => setNote(e.target.value)}
                                    placeholder="Add operational context..." 
                                    rows={2}
                                    className="w-full pl-10 pr-4 py-2.5 bg-surface-950 border border-white/5 rounded-xl text-xs text-white outline-none focus:border-primary/50 transition-all resize-none" 
                                />
                            </div>
                        </div>

                        <motion.button 
                            {...MICRO_INTERACTION}
                            type="submit" 
                            disabled={submitting || !url.trim()}
                            className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap size={14} />}
                            Initialize Transmission
                        </motion.button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
