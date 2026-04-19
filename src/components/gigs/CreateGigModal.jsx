import { useState } from 'react';
import { useGigs } from '../../hooks/useGigs';
import { NICHES, PLATFORMS } from '../../lib/constants';
import {
    Megaphone, FileText, IndianRupee, Loader2, Check, X,
    Globe, Sparkles, Target, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MICRO_INTERACTION, PREMIUM_SPRING } from '../../lib/motion';
import { cn } from '../../lib/utils';

export default function CreateGigModal({ isOpen, onClose }) {
    const { createGig } = useGigs();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        title: '',
        description: '',
        platform: '',
        budget: '',
        niche: ''
    });

    if (!isOpen) return null;

    function updateForm(key, value) {
        setForm(prev => ({ ...prev, [key]: value }));
    }

    function canSubmit() {
        return form.title.trim() && 
               form.description.trim().length >= 50 && 
               form.platform && 
               Number(form.budget) >= 500 && 
               form.niche;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createGig(form);
            onClose();
            setForm({
                title: '',
                description: '',
                platform: '',
                budget: '',
                niche: ''
            });
        } catch (err) {
            setError(err.message || 'Failed to create transmission node.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 40 }}
                transition={PREMIUM_SPRING}
                className="w-full max-w-xl glass-card !rounded-[2.5rem] relative overflow-hidden bg-surface-950 shadow-2xl border-white/10"
            >
                {/* Header Visual */}
                <div className="h-24 bg-gradient-to-br from-primary/20 via-surface-950 to-surface-950 border-b border-white/5 flex items-center px-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20 shadow-glow">
                            <Megaphone size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-display font-black text-white tracking-tight">Transmission Node</h2>
                            <p className="text-[10px] text-text-dim uppercase tracking-[0.25em] font-black">Initialize Campaign Protocol</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="ml-auto p-2.5 rounded-xl bg-white/5 text-text-muted hover:text-white transition-all border border-white/5 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
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
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Campaign Identifier</label>
                            <div className="relative group">
                                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="text" 
                                    required
                                    value={form.title}
                                    onChange={e => updateForm('title', e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    placeholder="e.g. Winter Node 2026" 
                                />
                            </div>
                        </div>

                        {/* Platform & Niche */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Transmission</label>
                                <div className="relative group">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none group-focus-within:text-primary transition-colors" />
                                    <select 
                                        required
                                        value={form.platform}
                                        onChange={e => updateForm('platform', e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-surface-950">Select</option>
                                        {PLATFORMS.map(p => <option key={p} value={p} className="bg-surface-950">{p}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Spectrum</label>
                                <div className="relative group">
                                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none group-focus-within:text-primary transition-colors" />
                                    <select 
                                        required
                                        value={form.niche}
                                        onChange={e => updateForm('niche', e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-surface-950">Select</option>
                                        {NICHES.map(n => <option key={n} value={n} className="bg-surface-950">{n}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Resource Allocation (₹)</label>
                            <div className="relative group">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="number" 
                                    required
                                    value={form.budget}
                                    onChange={e => updateForm('budget', e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    placeholder="Min. 500" 
                                    min="500" 
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Mission Description</label>
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest",
                                    form.description.length >= 50 ? "text-success" : "text-text-dim"
                                )}>
                                    {form.description.length} / 1000
                                </span>
                            </div>
                            <div className="relative group">
                                <FileText className="absolute left-4 top-4 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                                <textarea 
                                    required
                                    value={form.description}
                                    onChange={e => updateForm('description', e.target.value.slice(0, 1000))}
                                    rows={4}
                                    className="w-full pl-11 pr-4 py-4 bg-surface-900/50 border border-white/5 rounded-[2rem] text-sm text-white focus:border-primary/50 transition-all outline-none resize-none leading-relaxed"
                                    placeholder="Define requirements and deliverables..." 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <motion.button 
                            {...MICRO_INTERACTION}
                            type="submit" 
                            disabled={!canSubmit() || loading}
                            className="btn-primary w-full py-5 text-base shadow-2xl"
                        >
                            {loading ? (
                                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing Transmission...</>
                            ) : (
                                <><Zap size={20} className="mr-2" /> Initialize Channel</>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
