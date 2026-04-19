import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGigs } from '../../hooks/useGigs';
import { useProposals } from '../../hooks/useProposals';
import { MICRO_INTERACTION, PREMIUM_SPRING, STAGGER_CONTAINER, STAGGER_ITEM } from '../../lib/motion';
import { formatINR, getGigNiche, formatGigDeadline, cn } from '../../lib/utils';
import PageWrapper from '../../components/layout/PageWrapper';
import { STATUS_COLORS } from '../../lib/constants';
import {
    Briefcase, MapPin, Clock, Send, Loader2,
    Instagram, Youtube, ChevronRight, X, IndianRupee, Target,
    Sparkles, Globe, Rocket, ShieldCheck
} from 'lucide-react';

export default function GigFeedPage() {
    const { gigs, loading } = useGigs();
    const [selectedGig, setSelectedGig] = useState(null);

    return (
        <PageWrapper title="Campaign Feed" subtitle="Identify high-resonance transmissions matching your profile.">
            {loading ? (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    variants={STAGGER_CONTAINER}
                    initial="hidden"
                    animate="show"
                >
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="glass-card aspect-[4/5] animate-pulse bg-white/[0.02] border-white/5" />
                    ))}
                </motion.div>
            ) : gigs.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card !rounded-[3rem] p-24 text-center border-dashed border-white/10 bg-white/[0.01]"
                >
                    <div className="relative w-20 h-20 mx-auto mb-8">
                        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
                        <div className="w-20 h-20 rounded-3xl bg-surface-900 border border-white/5 flex items-center justify-center text-text-dim relative z-10">
                            <Briefcase size={32} strokeWidth={1} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-display font-black text-white mb-3 tracking-tight">Zero Signals Detected</h3>
                    <p className="text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                        The transmission feed is currently silent. Check back soon for fresh campaign nodes.
                    </p>
                </motion.div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    variants={STAGGER_CONTAINER}
                    initial="hidden"
                    animate="show"
                >
                    {gigs.map((gig) => (
                        <GigCard 
                            key={gig.id} 
                            gig={gig} 
                            onApply={() => setSelectedGig(gig)} 
                        />
                    ))}
                </motion.div>
            )}

            <AnimatePresence>
                {selectedGig && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={PREMIUM_SPRING}
                            className="w-full max-w-xl glass-card !rounded-[2.5rem] relative overflow-hidden bg-surface-950 border-white/10 shadow-2xl"
                        >
                            <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />
                            
                            <div className="p-8 md:p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-glow">
                                            <Rocket size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-display font-black text-white tracking-tight leading-none mb-1">Node Application</h2>
                                            <p className="text-[10px] text-text-dim uppercase tracking-[0.25em] font-black italic">Target: {selectedGig.title}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedGig(null)}
                                        className="p-2.5 rounded-xl bg-white/5 text-text-muted hover:text-white transition-all border border-white/5 cursor-pointer"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 mb-8 flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-surface-900 border border-white/10 p-0.5 overflow-hidden shadow-inner shrink-0">
                                        {selectedGig.profiles_brand?.logo_url ? (
                                            <img src={selectedGig.profiles_brand.logo_url} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20 font-black text-lg">
                                                {selectedGig.profiles_brand?.company_name?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white truncate mb-1">{selectedGig.profiles_brand?.company_name}</h3>
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-text-muted">
                                            <span className="text-primary">{selectedGig.platform}</span>
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            <span>Budget: {formatINR(selectedGig.budget)}</span>
                                        </div>
                                    </div>
                                </div>

                                <ApplyForm gigId={selectedGig.id} budget={selectedGig.budget} onClose={() => setSelectedGig(null)} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </PageWrapper>
    );
}

function GigCard({ gig, onApply }) {
    const PlatformIcon = gig.platform === 'YouTube' ? Youtube : Instagram;

    return (
        <motion.div
            variants={STAGGER_ITEM}
            {...MICRO_INTERACTION}
            onClick={onApply}
            className="glass-card group hover:border-primary/40 transition-all duration-500 cursor-pointer flex flex-col h-full relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Visual Core */}
            <div className="relative aspect-[16/10] overflow-hidden bg-surface-900 m-2 rounded-2xl border border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <PlatformIcon size={48} className="text-white/10 group-hover:scale-110 group-hover:text-white/20 transition-all duration-700" />
                </div>
                
                <div className="absolute top-3 right-3">
                    <div className={cn(
                        "px-2.5 py-1 rounded-xl backdrop-blur-md border text-[8px] font-black uppercase tracking-widest shadow-xl",
                        STATUS_COLORS[gig.status]
                    )}>
                        {gig.status}
                    </div>
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden">
                        {gig.profiles_brand?.logo_url ? (
                            <img src={gig.profiles_brand.logo_url} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[10px] font-black text-white">{selectedGig?.profiles_brand?.company_name?.charAt(0)}</span>
                        )}
                    </div>
                    <span className="text-[9px] font-black text-white uppercase tracking-widest drop-shadow-md">{gig.profiles_brand?.company_name}</span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display font-black text-base text-white mb-2 leading-tight group-hover:text-primary transition-colors">
                    {gig.title}
                </h3>
                
                <p className="text-xs text-text-muted line-clamp-2 mb-6 leading-relaxed font-medium">
                    {gig.description}
                </p>

                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                        <Target size={12} className="text-primary" />
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">{getGigNiche(gig)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                        <Clock size={12} className="text-text-dim" />
                        <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">
                            {formatGigDeadline(gig.deadline, gig.created_at)}
                        </span>
                    </div>
                </div>

                <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[8px] font-black text-text-dim uppercase tracking-[0.2em] mb-1">Max Allocation</p>
                        <p className="text-sm font-display font-black text-white">{formatINR(gig.budget)}</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-surface-900 border border-white/5 flex items-center justify-center text-text-dim group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                        <ChevronRight size={14} strokeWidth={3} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function ApplyForm({ gigId, budget, onClose }) {
    const { submitProposal } = useProposals();
    const [coverLetter, setCoverLetter] = useState('');
    const [proposedPrice, setProposedPrice] = useState(budget?.toString() || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    async function handleApply(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await submitProposal(gigId, { coverLetter, proposedPrice });
            setSuccess(true);
            setTimeout(onClose, 2000);
        } catch (err) {
            setError(err.message || 'Transmission initialization failed.');
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="p-12 text-center">
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow"
                >
                    <ShieldCheck size={40} />
                </motion.div>
                <h3 className="text-2xl font-display font-black text-white mb-2">Signal Transmitted</h3>
                <p className="text-sm text-text-muted font-medium">Your node is now visible to the campaign curator.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleApply} className="space-y-8">
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

            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted">Pitch Logic</label>
                    <span className={cn(
                        "text-[10px] font-black tracking-widest",
                        coverLetter.length >= 50 ? "text-success" : "text-text-dim"
                    )}>
                        {coverLetter.length} / 500
                    </span>
                </div>
                <textarea 
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value.slice(0, 500))} 
                    rows={5}
                    required
                    placeholder="Describe your creative angle and strategic value..." 
                    className="w-full px-5 py-4 rounded-[2rem] bg-surface-900 border border-white/5 text-sm text-white placeholder:text-text-dim focus:border-primary/50 transition-all outline-none resize-none leading-relaxed"
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted ml-1">Proposed Allocation (₹)</label>
                <div className="relative group">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                    <input 
                        type="number" 
                        value={proposedPrice}
                        onChange={e => setProposedPrice(e.target.value)}
                        required
                        min="100"
                        className="w-full pl-11 pr-4 py-4 rounded-2xl bg-surface-900 border border-white/5 text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        placeholder="Your valuation" 
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
                <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-white transition-all cursor-pointer order-2 sm:order-1">
                    Abort
                </button>
                <motion.button
                    {...MICRO_INTERACTION}
                    type="submit" 
                    disabled={loading || !coverLetter.trim() || coverLetter.length < 10}
                    className="flex-[2] btn-primary py-4 text-base shadow-2xl order-1 sm:order-2"
                >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <><Send size={18} className="mr-2" /> Initialize Sync</>}
                </motion.button>
            </div>
        </form>
    );
}
