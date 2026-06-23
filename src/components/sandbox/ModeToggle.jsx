import { motion } from "framer-motion";
import { springSnappy } from "../../lib/motion";

export default function ModeToggle({ mode, setMode }) {
  return (
    <div className="relative flex glass-card rounded-full p-1 border border-border bg-surface-900/10">
      {["brand", "influencer"].map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`relative px-6 py-2.5 z-10 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors duration-300 cursor-pointer ${
            mode === m ? "text-white dark:text-surface-950" : "text-text-secondary"
          }`}
        >
          {mode === m && (
            <motion.div 
              layoutId="mode-pill" 
              className="absolute inset-0 -z-10 rounded-full bg-primary dark:bg-white" 
              transition={springSnappy} 
            />
          )}
          {m === "brand" ? "Brand View" : "Influencer View"}
        </button>
      ))}
    </div>
  );
}
