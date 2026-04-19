import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';
import StarRating from './StarRating';
import { PREMIUM_SPRING } from '../../lib/motion';
import { formatRelativeTime, cn } from '../../lib/utils';

export default function ReviewCard({ review }) {
    if (!review) return null;

    const { 
        rating, 
        comment, 
        created_at, 
        profiles_brand, 
        profiles_influencer 
    } = review;

    const reviewerName = profiles_brand?.company_name || 
                        profiles_influencer?.full_name || 
                        'Anonymous Node';
    
    const reviewerAvatar = profiles_brand?.logo_url || 
                          profiles_influencer?.avatar_url;

    const isBrand = !!profiles_brand;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={PREMIUM_SPRING}
            whileHover={{ y: -4 }}
            className={cn(
                "relative group overflow-hidden p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] transition-all duration-500",
                "hover:border-primary/20 hover:bg-white/[0.04]"
            )}
        >
            {/* Visual Decoration */}
            <div className="absolute -top-6 -right-6 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                <Quote size={80} className="text-primary rotate-180" />
            </div>

            <div className="relative z-10 space-y-5">
                {/* Header Context */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-surface-900 border border-white/10 p-0.5 overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-500">
                            {reviewerAvatar ? (
                                <img src={reviewerAvatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary font-black text-sm uppercase bg-primary/10">
                                    {reviewerName.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                                {reviewerName}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-black text-text-dim uppercase tracking-widest">{isBrand ? 'Contract Brand' : 'Creator Node'}</span>
                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold">
                                    {formatRelativeTime(created_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-2 py-1 rounded-xl bg-surface-950 border border-white/5 flex items-center shadow-inner">
                        <StarRating rating={rating} readOnly />
                    </div>
                </div>

                {/* Comment Text */}
                <div className="relative">
                    <p className="text-text-secondary text-sm leading-relaxed font-medium italic border-l-2 border-white/5 pl-5 py-1">
                        "{comment}"
                    </p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                    <Sparkles size={10} className="text-primary animate-pulse" />
                    <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Verified Transaction</span>
                </div>
            </div>
        </motion.div>
    );
}
