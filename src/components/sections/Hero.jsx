import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../lib/motion";
import GlassCard from "../ui/GlassCard";
import { Sparkles, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="grid lg:grid-cols-12 gap-12 items-center pt-24 pb-12 relative">
      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        animate="visible"
        className="lg:col-span-7 flex flex-col gap-6 text-left"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/5 w-fit">
          <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Marketplace of trust</span>
        </motion.div>
        
        <motion.h1 variants={fadeUp} className="text-display text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
          Where the creator economy gets to <span className="text-gradient">work.</span>
        </motion.h1>
        
        <motion.p variants={fadeUp} className="text-slate-400 text-base md:text-lg max-w-xl leading-relaxed">
          MakerHQ connects Brands and Micro-Influencers across India. Create gigs, manage proposals, track milestones with automated escrow, and get verified analytics in one trusted flow.
        </motion.p>
        
        <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-4">
          <a
            href="#live-sandbox"
            className="px-6 py-4 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition shadow-glow flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            Try Live Sandbox <Zap className="w-3.5 h-3.5" />
          </a>
          <a
            href="#live-sandbox"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("live-sandbox")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
          >
            How it Works
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-5 relative"
      >
        {/* Decorative glows */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-primary-glow to-accent-glow -z-10 blur-2xl rounded-full opacity-40 animate-pulse-subtle" />
        
        <GlassCard className="p-6 md:p-8 flex flex-col gap-6 w-full max-w-[420px] mx-auto border-white/10 relative overflow-hidden">
          {/* Creator Profile Header */}
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-white text-lg">
              AR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white text-sm">Ananya Rao</span>
                <span className="text-[9px] text-accent font-mono uppercase tracking-wider bg-accent-glow px-1.5 py-0.5 rounded">✓ verified</span>
              </div>
              <p className="text-xs text-slate-500">Beauty & Lifestyle · Mumbai</p>
            </div>
          </div>

          {/* Followers count and interactive preview */}
          <div className="grid grid-cols-2 gap-4 text-mono-num bg-surface-950/50 p-4 rounded-xl border border-white/5">
            <div>
              <p className="text-xs text-slate-500 font-sans uppercase tracking-wider">Followers</p>
              <p className="text-lg font-bold text-white">84.2K</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-sans uppercase tracking-wider">Engagement</p>
              <p className="text-lg font-bold text-accent">6.4%</p>
            </div>
          </div>

          {/* Simulated contract milestone workflow preview */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Milestones</p>
            <div className="flex flex-col gap-2">
              <MilestoneItem label="Script Outline" status="approved" />
              <MilestoneItem label="Video Draft (30s Reel)" status="review" />
              <MilestoneItem label="Final Publish" status="pending" />
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}

function MilestoneItem({ label, status }) {
  return (
    <div className="flex items-center justify-between text-xs bg-surface-900/60 p-3 rounded-lg border border-white/5">
      <span className="text-slate-300 font-medium">{label}</span>
      {status === "approved" ? (
        <span className="text-[9px] text-success font-mono uppercase tracking-wider bg-success/10 px-1.5 py-0.5 rounded flex items-center gap-1">
          ✓ Approved
        </span>
      ) : status === "review" ? (
        <span className="text-[9px] text-warning font-mono uppercase tracking-wider bg-warning/10 px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse">
          In Review
        </span>
      ) : (
        <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider bg-white/5 px-1.5 py-0.5 rounded">
          Pending
        </span>
      )}
    </div>
  );
}
