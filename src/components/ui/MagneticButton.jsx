import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticButton({ children, to, className = "", ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18 });
  const springY = useSpring(y, { stiffness: 200, damping: 18 });

  function handleMove(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-14, Math.min(14, relX * 0.3)));
    y.set(Math.max(-14, Math.min(14, relY * 0.3)));
  }
  function handleLeave() { x.set(0); y.set(0); }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={`inline-flex rounded-full overflow-hidden transition-shadow ${className}`}
    >
      <Link
        to={to}
        className="px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] text-center min-w-[180px] select-none cursor-pointer flex items-center justify-center"
        {...props}
      >
        {children}
      </Link>
    </motion.div>
  );
}
