import Hero from "../components/sections/Hero";
import LiveSandbox from "../components/sandbox/LiveSandbox";
import ThreePillars from "../components/sections/ThreePillars";
import SocialProof from "../components/sections/SocialProof";
import CTASection from "../components/sections/CTASection";

export default function LandingPage() {
  return (
    <main className="relative z-10 flex flex-col gap-32 px-6 md:px-12 pb-32">
      <Hero />
      <LiveSandbox />
      <ThreePillars />
      <SocialProof />
      <CTASection />
    </main>
  );
}
