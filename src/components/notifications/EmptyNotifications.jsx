import React from 'react';
import { motion } from 'framer-motion';
import { Inbox, Sparkles } from 'lucide-react';
import { STAGGER_ITEM, PREMIUM_SPRING } from '../../lib/motion';

const EmptyNotifications = () => {
  return (
    <motion.div
      variants={STAGGER_ITEM}
      className="flex flex-col items-center justify-center py-20 px-8 text-center bg-white/[0.01] rounded-[2rem] border border-dashed border-white/5 mx-2"
    >
      <div className="relative mb-6">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" 
        />
        <div className="w-16 h-16 bg-surface-900 rounded-2xl flex items-center justify-center text-text-dim border border-white/5 relative z-10">
          <Inbox className="w-7 h-7" />
        </div>
        <motion.div 
            animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 text-primary"
        >
            <Sparkles size={16} />
        </motion.div>
      </div>

      <h3 className="text-lg font-display font-bold text-white mb-2">Zero Distractions</h3>
      <p className="text-xs text-text-muted max-w-[200px] leading-relaxed font-medium">
        Your workspace is clean. We'll alert you when campaigns require your attention.
      </p>
    </motion.div>
  );
};

export default EmptyNotifications;
