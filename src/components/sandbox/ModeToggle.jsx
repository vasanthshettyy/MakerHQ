import { motion } from "framer-motion";
import { springSnappy } from "../../lib/motion";

export default function ModeToggle({ mode, setMode }) {
  return (
    <div className="relative flex glass-card rounded-full p-1">
      {["brand", "influencer"].map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`relative px-5 py-2.5 z-10 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${
            mode === m ? "text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {mode === m && (
            <motion.div
              layoutId="mode-pill"
              className="absolute inset-0 -z-10 rounded-full bg-primary"
              transition={springSnappy}
            />
          )}
          {m === "brand" ? "Brand View" : "Influencer View"}
        </button>
      ))}
    </div>
  );
}
