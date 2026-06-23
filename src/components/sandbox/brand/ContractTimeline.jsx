import { motion } from "framer-motion";
import { staggerContainer } from "../../../lib/motion";
import { contractStages } from "../../../lib/mockData";

export default function ContractTimeline() {
  return (
    <motion.div variants={staggerContainer(0.15)} initial="hidden" animate="visible" className="max-w-md mx-auto py-8">
      {contractStages.map((stage, i) => (
        <motion.div
          key={stage.key}
          variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
          className="flex items-center gap-4 py-4 border-l border-border pl-6 relative"
        >
          <div className="absolute -left-[12px] bg-background p-0.5 rounded-full z-10 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="11" fill="var(--bg-primary)" stroke="var(--color-accent)" strokeWidth="1.5" />
              <motion.path
                d="M7 12l3.5 3.5L17 9" fill="none" stroke="var(--color-accent)" strokeWidth="2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: i * 0.15 + 0.3 }}
              />
            </svg>
          </div>
          <p className="text-text-primary text-sm font-semibold uppercase tracking-wider leading-none">{stage.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
