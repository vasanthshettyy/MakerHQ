import MagneticButton from "../ui/MagneticButton";

export default function CTASection() {
  return (
    <section className="flex flex-col items-center text-center gap-8 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-dark/5 to-transparent -z-10 blur-3xl pointer-events-none" />
      <h2 className="text-display text-4xl md:text-6xl font-black text-white max-w-3xl leading-tight">
        Your next campaign — or your next brand deal — starts here.
      </h2>
      <p className="text-slate-400 max-w-lg text-base md:text-lg">
        Step into a workflow where agreements are clear, deliverables are verified, and escrow ensures everyone gets paid on time.
      </p>
      <div className="flex flex-wrap gap-6 justify-center mt-6">
        <MagneticButton to="/signup?role=brand" className="bg-primary hover:brightness-110 shadow-glow text-white">
          I'm a Brand
        </MagneticButton>
        <MagneticButton to="/signup?role=influencer" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white">
          I'm an Influencer
        </MagneticButton>
      </div>
    </section>
  );
}
