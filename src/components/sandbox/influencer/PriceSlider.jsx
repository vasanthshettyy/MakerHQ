import { useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { springSnappy } from "../../../lib/motion";

export default function PriceSlider({ value, onChange, min, max }) {
  const motionVal = useMotionValue(value);
  
  useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  const display = useTransform(motionVal, (v) => `₹${Math.round(v).toLocaleString("en-IN")}`);

  return (
    <div className="w-full">
      <motion.p className="text-mono-num text-3xl font-bold text-white mb-6 tracking-tight">{display}</motion.p>
      <input
        type="range"
        min={min}
        max={max}
        step={500}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2 uppercase tracking-wider">
        <span>Min: ₹{min.toLocaleString("en-IN")}</span>
        <span>Max: ₹{max.toLocaleString("en-IN")}</span>
      </div>
      <motion.div whileDrag={{ scale: 1.15 }} transition={springSnappy} className="sr-only" />
    </div>
  );
}
