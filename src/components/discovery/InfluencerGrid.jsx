import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { STAGGER_CONTAINER, STAGGER_ITEM } from '../../lib/motion';
import InfluencerCard from './InfluencerCard';

export default function InfluencerGrid({ influencers, loading, onCardClick }) {
    if (loading) {
        return (
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                variants={STAGGER_CONTAINER}
                initial="hidden"
                animate="show"
            >
                {[...Array(10)].map((_, i) => (
                    <motion.div key={i} variants={STAGGER_ITEM} className="glass-card aspect-[16/22] animate-pulse overflow-hidden bg-white/[0.02]">
                        <div className="aspect-[16/10] bg-white/5 w-full" />
                        <div className="p-5 space-y-4">
                            <div className="h-5 bg-white/10 rounded-lg w-3/4" />
                            <div className="h-3 bg-white/5 rounded-lg w-1/2" />
                            <div className="pt-4 flex justify-between gap-4">
                                <div className="h-10 bg-white/5 rounded-xl flex-1" />
                                <div className="h-10 bg-white/5 rounded-xl flex-1" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        );
    }

    if (influencers.length === 0) {
        return (
            <div className="glass-card !rounded-[3rem] p-24 text-center border-dashed border-white/10 bg-white/[0.01]">
                <div className="relative w-20 h-20 mx-auto mb-8">
                    <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full animate-pulse" />
                    <div className="w-20 h-20 rounded-3xl bg-surface-900 border border-white/5 flex items-center justify-center text-text-dim relative z-10">
                        <Search size={32} strokeWidth={1.5} />
                    </div>
                </div>
                <h3 className="text-2xl font-display font-black text-white mb-3 tracking-tight">Zero Signals Found</h3>
                <p className="text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                    No creator nodes match your current search parameters. Try broadening your refinement spectrum.
                </p>
                <button className="mt-8 text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:underline cursor-pointer">Reset refinement engine</button>
            </div>
        );
    }

    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="show"
        >
            {influencers.map(inf => (
                <InfluencerCard 
                    key={inf.user_id} 
                    inf={inf} 
                    onClick={onCardClick}
                />
            ))}
        </motion.div>
    );
}
