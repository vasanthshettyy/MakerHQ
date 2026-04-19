import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Star, Instagram, Youtube, BadgeCheck, Zap, Sparkles } from 'lucide-react';
import { useReviews } from '../../hooks/useReviews';
import { MICRO_INTERACTION, STAGGER_ITEM } from '../../lib/motion';
import { formatFollowers, formatINR } from '../../lib/utils';

export default function InfluencerCard({ inf, onClick }) {
    const { getUserRating } = useReviews();
    const [ratingData, setRatingData] = useState({ avg_rating: 0, total_reviews: 0 });

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const data = await getUserRating(inf.user_id);
                setRatingData(data);
            } catch (err) {
                console.error('Error fetching rating for card:', err);
            }
        };
        fetchRating();
    }, [inf.user_id, getUserRating]);

    return (
        <motion.div
            variants={STAGGER_ITEM}
            {...MICRO_INTERACTION}
            onClick={() => onClick?.(inf)}
            className="glass-card group hover:border-primary/40 transition-all duration-500 cursor-pointer flex flex-col h-full relative"
        >
            {/* Visual Top Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Media Core */}
            <div className="relative aspect-[16/11] overflow-hidden bg-surface-900 m-2 rounded-2xl border border-white/5">
                {inf.avatar_url ? (
                    <img
                        src={inf.avatar_url}
                        alt={inf.full_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-800 to-surface-950">
                        <Users size={32} className="text-white/10" />
                    </div>
                )}

                {/* Status Float */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                    {inf.is_verified && (
                        <div className="bg-primary/20 backdrop-blur-md p-1.5 rounded-xl border border-primary/20 shadow-xl">
                            <BadgeCheck className="w-3.5 h-3.5 text-primary" />
                        </div>
                    )}
                    <div className="bg-surface-950/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[8px] font-black text-white uppercase tracking-widest">Active</span>
                    </div>
                </div>

                {/* Channel Icon */}
                <div className="absolute top-3 right-3">
                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 text-white">
                        {inf.platform_primary === 'instagram' ? <Instagram size={14} /> : <Youtube size={14} />}
                    </div>
                </div>

                {/* Rating Overlay */}
                <div className="absolute bottom-3 left-3">
                    {ratingData.total_reviews > 0 && (
                        <div className="bg-amber-500/20 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-amber-500/20 flex items-center gap-1.5 shadow-xl">
                            <Star size={10} className="text-amber-400 fill-amber-400" />
                            <span className="text-[10px] font-black text-amber-400 tracking-tight">{ratingData.avg_rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Entity Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0">
                        <h3 className="font-display font-black text-base text-white truncate leading-tight group-hover:text-primary transition-colors">
                            {inf.full_name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                            <MapPin size={10} className="text-text-dim" />
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{inf.city}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="px-2 py-1 rounded-lg bg-surface-900 border border-white/5 text-[9px] font-black text-primary uppercase tracking-widest">
                            {inf.niche}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col">
                        <span className="text-[8px] font-black text-text-dim uppercase tracking-[0.2em] mb-1">Reach</span>
                        <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                            <Users size={12} className="text-primary" />
                            {formatFollowers(inf.followers_count)}
                        </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col">
                        <span className="text-[8px] font-black text-text-dim uppercase tracking-[0.2em] mb-1">Signal</span>
                        <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                            <Zap size={12} className="text-success" />
                            {inf.engagement_rate}%
                        </div>
                    </div>
                </div>

                {/* Bottom Tier: Economic Value */}
                <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between relative">
                    <div>
                        <p className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em] mb-1">Base Valuation</p>
                        <p className="text-sm font-display font-black text-white">
                            {formatINR(inf.price_per_post)}
                            <span className="text-[10px] font-medium text-text-muted"> /node</span>
                        </p>
                    </div>
                    <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg"
                    >
                        <Sparkles size={14} />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
