import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sandboxStepTransition, staggerContainer, fadeUp } from "../../../lib/motion";
import { creators, niches } from "../../../lib/mockData";
import FilterPanel from "./FilterPanel";
import CreatorCard from "./CreatorCard";
import ContractTimeline from "./ContractTimeline";

export default function BrandFlow() {
  const [step, setStep] = useState("search");     // search -> filters -> profile -> offer -> contract
  const [niche, setNiche] = useState("All");
  const [selected, setSelected] = useState(null);

  const visible = niche === "All" ? creators : creators.filter((c) => c.niche === niche);

  return (
    <AnimatePresence mode="wait">
      {step === "search" && (
        <motion.div key="search" {...sandboxStepTransition} className="flex flex-col items-center gap-6 py-16">
          <p className="text-text-secondary text-base md:text-lg text-center max-w-sm leading-relaxed">
            Find micro-influencers who align with your target demographics in seconds.
          </p>
          <button
            onClick={() => setStep("filters")}
            className="btn-primary py-3.5 px-8 text-xs cursor-pointer shadow-lg"
          >
            Search Creators
          </button>
        </motion.div>
      )}

      {step === "filters" && (
        <motion.div key="filters" {...sandboxStepTransition}>
          <FilterPanel niches={niches} active={niche} onSelect={setNiche} />
          <motion.div
            layout 
            variants={staggerContainer()} 
            initial="hidden" 
            animate="visible"
            className="grid sm:grid-cols-2 gap-4 mt-8"
          >
            {visible.map((c) => (
              <motion.div key={c.id} variants={fadeUp}>
                <CreatorCard creator={c} onSelect={() => { setSelected(c); setStep("profile"); }} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {step === "profile" && selected && (
        <motion.div key="profile" {...sandboxStepTransition} className="max-w-md mx-auto text-center py-10">
          <h3 className="text-2xl font-display font-black text-text-primary mb-1 uppercase tracking-wide">{selected.name}</h3>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-8">{selected.niche} · {selected.city}</p>
          <div className="grid grid-cols-3 gap-6 mb-10 text-mono-num bg-surface-900/5 dark:bg-white/[0.01] p-6 rounded-2xl border border-border">
            <Stat label="Followers" value={selected.followers.toLocaleString("en-IN")} />
            <Stat label="Engagement" value={`${selected.engagement}%`} />
            <Stat label="Rate / reel" value={`₹${selected.rate.toLocaleString("en-IN")}`} />
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={() => setStep("filters")} className="btn-secondary py-3 px-6 text-[10px] cursor-pointer">Back</button>
            <button onClick={() => setStep("offer")} className="btn-primary py-3 px-6 text-[10px] cursor-pointer">Send Gig Offer</button>
          </div>
        </motion.div>
      )}

      {step === "offer" && (
        <motion.div key="offer" {...sandboxStepTransition} className="max-w-md mx-auto text-center py-16">
          <p className="text-text-secondary mb-8 text-sm md:text-base leading-relaxed">
            Offer sent to <span className="text-text-primary font-bold">{selected?.name}</span>. Once accepted, your transaction moves to escrow.
          </p>
          <button onClick={() => setStep("contract")} className="btn-primary py-3.5 px-8 text-xs cursor-pointer">View Contract Timeline</button>
        </motion.div>
      )}

      {step === "contract" && (
        <motion.div key="contract" {...sandboxStepTransition}>
          <div className="text-center mb-6">
            <p className="text-xs text-accent font-mono uppercase tracking-widest mb-2">active pipeline</p>
            <h4 className="text-lg font-display font-bold text-text-primary uppercase tracking-wide">Contract Escrow Flow</h4>
          </div>
          <ContractTimeline />
          <div className="flex justify-center mt-8">
            <button onClick={() => { setStep("search"); setSelected(null); setNiche("All"); }} className="btn-secondary py-2.5 px-6 text-[10px] cursor-pointer">Reset Sandbox</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-base font-black text-text-primary leading-tight">{value}</p>
      <p className="text-[9px] text-text-muted font-sans font-black uppercase tracking-widest mt-2">{label}</p>
    </div>
  );
}
