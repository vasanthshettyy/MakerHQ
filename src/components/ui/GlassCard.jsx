import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", ...props }) {
  return (
    <motion.div className={`glass-card rounded-2xl ${className}`} {...props}>
      {children}
    </motion.div>
  );
}
