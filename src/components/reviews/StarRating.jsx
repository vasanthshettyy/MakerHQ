import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { PREMIUM_SPRING } from '../../lib/motion';
import { cn } from '../../lib/utils';

export default function StarRating({ rating, setRating, readOnly = false }) {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    whileHover={!readOnly ? { scale: 1.15 } : {}}
                    whileTap={!readOnly ? { scale: 0.95 } : {}}
                    transition={PREMIUM_SPRING}
                    onMouseEnter={() => !readOnly && setHoverRating(star)}
                    onMouseLeave={() => !readOnly && setHoverRating(0)}
                    onClick={() => !readOnly && setRating(star)}
                    className={cn(
                        "relative transition-all duration-300 outline-none",
                        readOnly ? "cursor-default" : "cursor-pointer"
                    )}
                >
                    <Star
                        size={readOnly ? 14 : 26}
                        className={cn(
                            "transition-all duration-300 ease-out",
                            (hoverRating || rating) >= star
                                ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.4)]"
                                : "text-white/10 fill-transparent"
                        )}
                    />
                    
                    {!readOnly && hoverRating === star && (
                        <motion.div
                            layoutId="star-glow-active"
                            className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full -z-10"
                        />
                    )}
                </motion.button>
            ))}
            
            {!readOnly && rating > 0 && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={PREMIUM_SPRING}
                    className="ml-4 px-3 py-1 rounded-xl bg-yellow-400/10 border border-yellow-400/20 shadow-glow shadow-yellow-400/5"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400">
                        {rating}.0 Magnitude
                    </span>
                </motion.div>
            )}
        </div>
    );
}
