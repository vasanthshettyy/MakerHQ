import { motion } from "framer-motion";
import { staggerContainer } from "../../../lib/motion";
import { contractStages } from "../../../lib/mockData";

export default function ContractTimeline({ onReset }) {
  return (
    <div className="max-w-md mx-auto py-6">
      <motion.div
        variants={staggerContainer(0.15)}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-1"
      >
        {contractStages.map((stage, i) => (
          <motion.div
            key={stage.key}
            variants={{
              hidden: { opacity: 0, x: -12 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
            }}
            className="flex items-center gap-4 py-4 border-l border-slate-800 pl-6 relative"
          >
            <div className="absolute -left-[11px] top-1/2 -translate-y-1/2 bg-surface-950 w-[22px] h-[22px] rounded-full flex items-center justify-center border border-slate-800">
              <svg width="22" height="22" viewBox="0 0 24 24" className="w-full h-full">
                <circle cx="12" cy="12" r="11" fill="none" />
                <motion.path
                  d="M7 12l3.5 3.5L17 9"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.15 + 0.3 }}
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-200 uppercase tracking-wider">{stage.label}</p>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="flex justify-center mt-8">
        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-semibold text-xs uppercase tracking-wider transition-colors"
        >
          Reset Simulation
        </button>
      </div>
    </div>
  );
}
