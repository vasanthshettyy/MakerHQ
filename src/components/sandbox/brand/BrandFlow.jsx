import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sandboxStepTransition, staggerContainer, fadeUp } from "../../../lib/motion";
import { creators as fallbackCreators, niches } from "../../../lib/mockData";
import { supabase } from "../../../lib/supabase";
import FilterPanel from "./FilterPanel";
import CreatorCard from "./CreatorCard";
import ContractTimeline from "./ContractTimeline";

export default function BrandFlow() {
  const [step, setStep] = useState("search");     // search -> filters -> profile -> offer -> contract
  const [niche, setNiche] = useState("All");
  const [selected, setSelected] = useState(null);
  const [dbCreators, setDbCreators] = useState([]);

  useEffect(() => {
    async function loadCreators() {
      try {
        const { data, error } = await supabase
          .from("profiles_influencer")
          .select("*")
          .eq("onboarding_complete", true)
          .limit(8);

        if (error) throw error;
        if (data && data.length > 0) {
          const mapped = data.map((i) => ({
            id: i.id,
            name: i.full_name || "Anonymous Creator",
            niche: i.niche || "General",
            city: i.city || "India",
            followers: i.followers_count || 0,
            engagement: i.engagement_rate || 0,
            verified: i.is_verified || false,
            rate: i.price_per_post || 10000,
          }));
          setDbCreators(mapped);
        }
      } catch (err) {
        console.error("Failed to load real creators for landing page sandbox:", err);
      }
    }
    loadCreators();
  }, []);

  const creatorsList = dbCreators.length > 0 ? dbCreators : fallbackCreators;
  const visible = niche === "All" ? creatorsList : creatorsList.filter((c) => c.niche === niche);

  return (
    <AnimatePresence mode="wait">
      {step === "search" && (
        <motion.div key="search" {...sandboxStepTransition} className="flex flex-col items-center gap-6 py-12 text-center">
          <p className="text-slate-300 text-lg max-w-md">Find creators who already talk to your audience with verified analytics.</p>
          <button
            onClick={() => setStep("filters")}
            className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition shadow-glow"
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
              <motion.div key={c.id} variants={fadeUp} layout>
                <CreatorCard creator={c} onSelect={() => { setSelected(c); setStep("profile"); }} />
              </motion.div>
            ))}
          </motion.div>
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setStep("search")}
              className="text-xs uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-colors font-bold"
            >
              ← Back to Start
            </button>
          </div>
        </motion.div>
      )}

      {step === "profile" && selected && (
        <motion.div key="profile" {...sandboxStepTransition} className="max-w-md mx-auto text-center py-8">
          <p className="text-3xl font-display text-white mb-1 font-semibold">{selected.name}</p>
          <p className="text-sm text-slate-400 mb-8">{selected.niche} · {selected.city}</p>
          <div className="grid grid-cols-3 gap-4 mb-10 text-mono-num bg-surface-900/40 p-6 rounded-2xl border border-white/5">
            <Stat label="Followers" value={selected.followers.toLocaleString("en-IN")} />
            <Stat label="Engagement" value={`${selected.engagement}%`} />
            <Stat label="Rate / reel" value={`₹${selected.rate.toLocaleString("en-IN")}`} />
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setStep("filters")}
              className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Back to List
            </button>
            <button
              onClick={() => setStep("offer")}
              className="px-6 py-3 rounded-xl bg-accent text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all"
            >
              Send Gig Offer
            </button>
          </div>
        </motion.div>
      )}

      {step === "offer" && (
        <motion.div key="offer" {...sandboxStepTransition} className="max-w-md mx-auto text-center py-12">
          <p className="text-slate-300 text-lg mb-8 max-w-sm mx-auto">
            Offer sent to <strong className="text-white">{selected?.name}</strong>. Once accepted, the contract moves through escrow automatically.
          </p>
          <button
            onClick={() => setStep("contract")}
            className="px-6 py-3.5 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition shadow-glow animate-pulse-subtle"
          >
            View Contract Timeline
          </button>
        </motion.div>
      )}

      {step === "contract" && (
        <motion.div key="contract" {...sandboxStepTransition}>
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Active Contract Overview</h3>
            <p className="text-xs text-slate-400 mt-1">Creator: {selected?.name} · Budget: ₹{selected?.rate.toLocaleString("en-IN")}</p>
          </div>
          <ContractTimeline onReset={() => { setStep("search"); setSelected(null); }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-base md:text-lg font-bold text-white tracking-tight">{value}</p>
      <p className="text-[10px] text-slate-500 font-sans uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}
