import { motion } from "framer-motion";
import { springSoft } from "../../../lib/motion";

export default function CreatorCard({ creator, onSelect }) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ y: -4, boxShadow: "0 0 0 1px var(--color-accent-glow), 0 20px 40px -20px var(--color-primary-glow)" }}
      transition={springSoft}
      className="glass-card w-full rounded-2xl p-5 text-left border-border cursor-pointer bg-surface-900/10 hover:border-primary/30"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-text-primary text-base leading-none uppercase tracking-wide">{creator.name}</p>
        {creator.verified && (
          <span className="text-[10px] font-black uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-md">
            verified
          </span>
        )}
      </div>
      <p className="text-xs text-text-muted mb-4 font-semibold uppercase tracking-wider">{creator.niche} · {creator.city}</p>
      <p className="text-mono-num text-sm text-text-secondary font-medium">
        {creator.followers.toLocaleString("en-IN")} followers · {creator.engagement}% eng.
      </p>
    </motion.button>
  );
}
