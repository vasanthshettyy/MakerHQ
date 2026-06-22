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
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className="relative"
    >
      <div className="flex flex-col items-center text-center mb-10">
        <p className="text-accent text-sm font-mono uppercase tracking-widest mb-3">Try it live</p>
        <h2 className="text-display text-4xl md:text-5xl font-semibold text-white mb-4">
          This isn't a demo video. It's the product.
        </h2>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>

      <GlassCard className="p-6 md:p-10 min-h-[480px]">
        <AnimatePresence mode="wait">
          {mode === "brand" ? (
            <motion.div key="brand" className="w-full">
              <BrandFlow />
            </motion.div>
          ) : (
            <motion.div key="influencer" className="w-full">
              <InfluencerFlow />
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.section>
  );
}
