import { useState } from "react";
import { motion } from "framer-motion";
import { milestoneSteps } from "../../../lib/mockData";

export default function MilestoneTracker({ onReset }) {
  const [current, setCurrent] = useState(0); // index into milestoneSteps
  const [reviewing, setReviewing] = useState(false);

  function advance() {
    if (current >= milestoneSteps.length - 1 && !reviewing) {
      // Completed, let's reset
      onReset();
      return;
    }
    if (!reviewing) {
      setReviewing(true);
      return;
    }
    setReviewing(false);
    setCurrent((c) => Math.min(c + 1, milestoneSteps.length - 1));
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="flex items-center justify-between relative mb-12">
        {/* Gray baseline connector */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2" />
        
        {/* Animated active progress connector */}
        <motion.div
          className="absolute top-4 left-0 h-0.5 bg-accent -translate-y-1/2 origin-left"
          animate={{ scaleX: current / (milestoneSteps.length - 1) }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%" }}
        />
        
        {milestoneSteps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 flex-1">
              <motion.div
                animate={active && reviewing ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={active && reviewing ? { repeat: Infinity, duration: 1.6 } : {}}
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                  done
                    ? "bg-accent border-accent text-slate-950"
                    : active
                    ? "border-accent bg-surface-950 text-white"
                    : "border-slate-800 bg-surface-950 text-slate-500"
                }`}
              >
                {done ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" className="w-4 h-4">
                    <motion.path
                      d="M4 12l5 5L20 6"
                      fill="none"
                      stroke="#020205"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </svg>
                ) : (
                  <span className="text-xs font-bold font-mono">{i + 1}</span>
                )}
              </motion.div>
              <p className={`text-xs uppercase tracking-wider font-bold ${active ? "text-white" : "text-slate-500"}`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="text-center min-h-[50px] mb-8">
        <p className="text-slate-300 text-sm">
          {reviewing ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              <strong className="text-white">{milestoneSteps[current].label}</strong> is currently in review...
            </span>
          ) : (
            milestoneSteps[current].description
          )}
        </p>
      </div>

      <div className="flex justify-center gap-4">
        {current > 0 && !reviewing && (
          <button
            onClick={() => {
              setCurrent((c) => Math.max(0, c - 1));
              setReviewing(false);
            }}
            className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all"
          >
            ← Back
          </button>
        )}
        <button
          onClick={advance}
          className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition shadow-glow"
        >
          {reviewing ? "Mark Approved" : current === milestoneSteps.length - 1 ? "Complete & Restart" : "Submit Milestone"}
        </button>
      </div>
    </div>
  );
}
