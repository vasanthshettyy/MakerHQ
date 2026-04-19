import React from 'react';
import { Star, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { MICRO_INTERACTION } from '../../lib/motion';

export default function ReviewPromptBanner({ onReviewClick, partnerName, isBrand }) {
  const roleText = isBrand ? "influencer" : "brand";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden p-8 rounded-[2.5rem]",
        "bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent",
        "border border-amber-500/20 hover:border-amber-500/40 transition-all duration-700",
        "backdrop-blur-xl shadow-2xl shadow-amber-500/5 group"
      )}
    >
      {/* Background Decorative Element */}
      <div className="absolute -right-12 -bottom-12 text-amber-500/5 transform rotate-12 scale-150 transition-transform duration-1000 group-hover:rotate-45">
        <Star size={200} fill="currentColor" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-start gap-6">
          {/* Animated Icon Area */}
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-xl shadow-amber-500/10 group-hover:scale-110 transition-transform">
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Star size={32} fill="currentColor" />
            </motion.div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-display font-black text-white tracking-tight leading-none">
                Node Task Terminated
              </h3>
              <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-400 font-black uppercase tracking-[0.2em] shadow-glow shadow-amber-500/10">
                Action Required
              </div>
            </div>
            <p className="text-text-secondary text-sm max-w-xl leading-relaxed font-medium">
                The campaign lifecycle for <span className="text-amber-400 font-bold">{partnerName}</span> has concluded. 
                Synchronize your feedback to the network ledger to finalize the collaboration signal.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          {...MICRO_INTERACTION}
          onClick={onReviewClick}
          className={cn(
            "flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all",
            "bg-amber-500 hover:bg-amber-400 text-black shadow-2xl shadow-amber-500/20",
            "group cursor-pointer shrink-0"
          )}
        >
          Initialize Feedback
          <Zap size={14} fill="currentColor" className="transition-transform group-hover:scale-125" />
        </motion.button>
      </div>
    </motion.div>
  );
}
