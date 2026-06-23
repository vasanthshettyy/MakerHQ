import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../ui/GlassCard";
import ModeToggle from "./ModeToggle";
import BrandFlow from "./brand/BrandFlow";
import InfluencerFlow from "./influencer/InfluencerFlow";
import { fadeUp } from "../../lib/motion";

export default function LiveSandbox() {
  const [mode, setMode] = useState("brand"); // "brand" | "influencer"

  return (
    <motion.section
      id="live-sandbox"
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp} className="relative w-full"
    >
      <div className="flex flex-col items-center text-center mb-12">
        <p className="text-accent text-sm font-mono uppercase tracking-widest mb-3">Try it live</p>
        <h2 className="text-display text-4xl md:text-5xl font-semibold text-text-primary mb-4">
          This isn't a demo video. It's the product.
        </h2>
        <p className="text-slate-400 max-w-lg mb-8 text-sm md:text-base leading-relaxed">
          Interact with our live contract and milestone state machine right here. Switch between views to see how brands and creators collaborate.
        </p>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>

      <GlassCard className="p-6 md:p-10 min-h-[480px] bg-surface-900/10 border-border">
        <AnimatePresence mode="wait">
          {mode === "brand"
            ? <motion.div key="brand"><BrandFlow /></motion.div>
            : <motion.div key="influencer"><InfluencerFlow /></motion.div>}
        </AnimatePresence>
      </GlassCard>
    </motion.section>
  );
}
