import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ChevronLeft, Map, Search, Sparkles } from 'lucide-react';
import { MICRO_INTERACTION, PREMIUM_SPRING } from '../lib/motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Visual background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={PREMIUM_SPRING}
        className="glass-card max-w-lg w-full text-center p-12 md:p-16 border border-white/10 shadow-2xl relative z-10"
      >
        <div className="relative mb-10">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <motion.h1 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl md:text-9xl font-display font-black text-white relative z-10 tracking-tighter"
            >
                404
            </motion.h1>
        </div>

        <div className="space-y-4 mb-12">
            <div className="flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary" />
                <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Map size={18} className="text-primary" />
                    Node Not Identified
                </h2>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary" />
            </div>
            <p className="text-text-secondary text-base font-medium leading-relaxed max-w-sm mx-auto">
                The transmission route you followed is currently offline or the node address has been re-encrypted.
            </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
            <motion.div {...MICRO_INTERACTION}>
                <Link 
                    to="/login" 
                    className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2"
                >
                    <ChevronLeft size={16} strokeWidth={3} />
                    Reset to Command Core
                </Link>
            </motion.div>
            
            <div className="pt-8 border-t border-white/5 flex items-center justify-center gap-2 opacity-30">
                <Sparkles size={12} className="text-primary" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-text-muted">Network Workspace 2.0</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
