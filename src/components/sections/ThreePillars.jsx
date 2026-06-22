import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";

const pillars = [
  { label: "Discovery",  copy: "Filter by niche, city, and real engagement — not follower counts alone." },
  { label: "Workflow",   copy: "Script → Draft → Final. Every milestone tracked, every approval timestamped." },
  { label: "Trust",      copy: "Verified stats and escrow payments, so neither side is taking it on faith." },
];

export default function ThreePillars() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.6"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="py-12">
      <SectionHeading eyebrow="How it works" title="Three steps, one trusted flow" />
      <div className="relative mt-16">
        {/* Baseline rail connector */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-800/60 hidden md:block" />
        
        {/* Scroll dynamic connector line */}
        <motion.div
          style={{ scaleX: lineScale }}
          className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent origin-left hidden md:block"
        />
        
        <div className="grid md:grid-cols-3 gap-12 relative">
          {pillars.map((p, i) => (
            <div key={p.label} className="relative pt-12">
              <div className="absolute top-0 left-0 w-3 h-3 rounded-full bg-accent border border-bg shadow-[0_0_10px_var(--color-accent-glow)]" />
              <p className="text-mono-num text-xs text-slate-500 font-semibold mb-2">0{i + 1}</p>
              <p className="text-xl font-display font-semibold text-white mb-3">{p.label}</p>
              <p className="text-slate-400 text-sm leading-relaxed">{p.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
