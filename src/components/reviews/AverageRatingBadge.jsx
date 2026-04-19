import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AverageRatingBadge({ rating, totalReviews }) {
    if (!totalReviews || totalReviews === 0) {
        return (
            <div className="inline-flex items-center gap-2 text-text-dim text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 opacity-50">
                <Star size={10} className="text-text-muted" />
                <span>Zero Resonance</span>
            </div>
        );
    }

    return (
        <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-xl shadow-glow shadow-amber-500/5 transition-all hover:border-amber-500/40 group cursor-default">
            <Star size={14} className="fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-white font-black text-sm tracking-tighter">
                {Number(rating).toFixed(1)}
            </span>
            <div className="w-1 h-1 rounded-full bg-amber-500/40" />
            <span className="text-amber-400/80 text-[10px] font-black uppercase tracking-widest">
                {totalReviews} Logs
            </span>
        </div>
    );
}
