import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sandboxStepTransition } from "../../../lib/motion";
import { campaign as fallbackCampaign } from "../../../lib/mockData";
import { supabase } from "../../../lib/supabase";
import PriceSlider from "./PriceSlider";
import MilestoneTracker from "./MilestoneTracker";

export default function InfluencerFlow() {
  const [step, setStep] = useState("apply"); // apply -> price -> milestones
  const [price, setPrice] = useState(15000);
  const [activeCampaign, setActiveCampaign] = useState(null);

  useEffect(() => {
    async function loadRealGig() {
      try {
        const { data, error } = await supabase
          .from("gigs")
          .select("*, profiles_brand(company_name)")
          .eq("status", "Open")
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setActiveCampaign({
            id: data.id,
            brand: data.profiles_brand?.company_name || "Partner Brand",
            title: data.title,
            budgetRange: [Math.round(data.budget * 0.7), Math.round(data.budget * 1.3)],
            briefLine: data.description,
          });
          setPrice(Math.round(data.budget));
        }
      } catch (err) {
        console.error("Failed to load real gig for landing page sandbox:", err);
      }
    }
    loadRealGig();
  }, []);

  const campaign = activeCampaign || fallbackCampaign;
  const minPrice = campaign.budgetRange ? campaign.budgetRange[0] : 8000;
  const maxPrice = campaign.budgetRange ? campaign.budgetRange[1] : 25000;

  return (
    <AnimatePresence mode="wait">
      {step === "apply" && (
        <motion.div key="apply" {...sandboxStepTransition} className="max-w-md mx-auto text-center py-10">
          <p className="text-accent text-[10px] font-mono uppercase tracking-widest mb-2 font-bold">{campaign.brand}</p>
          <p className="text-2xl font-display text-white mb-3 font-semibold">{campaign.title}</p>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">{campaign.briefLine}</p>
          <button
            onClick={() => setStep("price")}
            className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition shadow-glow"
          >
            Apply to Campaign
          </button>
        </motion.div>
      )}

      {step === "price" && (
        <motion.div key="price" {...sandboxStepTransition} className="max-w-md mx-auto text-center py-10">
          <p className="text-slate-300 text-sm mb-6">Quote your custom price for this campaign deliverables.</p>
          <PriceSlider value={price} onChange={setPrice} min={minPrice} max={maxPrice} />
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setStep("apply")}
              className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Back
            </button>
            <button
              onClick={() => setStep("milestones")}
              className="px-6 py-3 rounded-xl bg-accent text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all"
            >
              Submit Quote
            </button>
          </div>
        </motion.div>
      )}

      {step === "milestones" && (
        <motion.div key="milestones" {...sandboxStepTransition}>
          <div className="text-center mb-6">
            <p className="text-accent text-[10px] font-mono uppercase tracking-widest font-bold">{campaign.brand}</p>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mt-1">Milestone Tracker Simulator</h3>
            <p className="text-xs text-slate-400">Campaign: {campaign.title} · Accepted Price: ₹{price.toLocaleString("en-IN")}</p>
          </div>
          <MilestoneTracker onReset={() => { setStep("apply"); setPrice(15000); }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
