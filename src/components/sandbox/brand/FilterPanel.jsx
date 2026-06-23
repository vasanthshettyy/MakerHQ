import { motion } from "framer-motion";

export default function FilterPanel({ niches, active, onSelect }) {
  return (
    <div className="flex gap-2.5 flex-wrap justify-center">
      {niches.map((n) => (
        <motion.button
          layout 
          key={n} 
          onClick={() => onSelect(n)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border cursor-pointer transition-all duration-300 ${
            active === n 
              ? "bg-primary text-white border-primary shadow-lg shadow-primary/25" 
              : "border-border text-text-muted hover:text-text-primary hover:border-text-muted bg-surface-900/5 dark:bg-white/[0.02]"
          }`}
        >
          {n}
        </motion.button>
      ))}
    </div>
  );
}
