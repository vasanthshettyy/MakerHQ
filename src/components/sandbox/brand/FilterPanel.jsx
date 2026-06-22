import { motion } from "framer-motion";

export default function FilterPanel({ niches, active, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {niches.map((n) => (
        <button
          key={n}
          onClick={() => onSelect(n)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all ${
            active === n
              ? "bg-primary text-white border-primary shadow-glow"
              : "border-slate-800 bg-surface-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
