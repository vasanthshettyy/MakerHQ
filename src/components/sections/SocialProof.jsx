import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../../lib/motion";
import GlassCard from "../ui/GlassCard";

const stats = [
  { label: "Creator Nodes", value: "12,840", suffix: "+" },
  { label: "Active Campaigns", value: "1,420", suffix: "" },
  { label: "Escrow Secured", value: "₹4.2M", suffix: "" },
  { label: "Avg Engagement", value: "6.8%", suffix: "" },
];

export default function SocialProof() {
  return (
    <motion.section
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="py-12 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-glow/5 to-accent-glow/5 -z-10 blur-2xl rounded-[3rem] pointer-events-none" />
      
      <GlassCard className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 md:p-12 border-white/5 bg-surface-900/30">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className="flex flex-col items-center text-center justify-center relative group"
          >
            {/* Split dividers */}
            {i > 0 && (
              <div className="absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-slate-800/40 hidden md:block" />
            )}
            
            <p className="text-mono-num text-3xl md:text-5xl font-black text-white leading-none tracking-tight mb-3">
              <span className="text-gradient">{stat.value}</span>
              {stat.suffix && <span className="text-accent text-2xl font-bold ml-0.5">{stat.suffix}</span>}
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-400 transition-colors">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </GlassCard>
    </motion.section>
  );
}
