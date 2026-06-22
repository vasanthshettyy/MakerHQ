import { motion } from "framer-motion";
import { springSoft } from "../../../lib/motion";

export default function CreatorCard({ creator, onSelect }) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ y: -4, boxShadow: "0 0 0 1px var(--color-accent-glow), 0 20px 40px -20px var(--color-primary-glow)" }}
      transition={springSoft}
      className="glass-card rounded-xl p-4 text-left w-full cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-white group-hover:text-primary-light transition-colors">{creator.name}</p>
        {creator.verified && <span className="text-[10px] text-accent font-mono uppercase tracking-wider">✓ verified</span>}
      </div>
      <p className="text-xs text-slate-400 mb-3">{creator.niche} · {creator.city}</p>
      <p className="text-mono-num text-xs text-slate-300">
        {creator.followers.toLocaleString("en-IN")} followers · {creator.engagement}% eng.
      </p>
    </motion.button>
  );
}
