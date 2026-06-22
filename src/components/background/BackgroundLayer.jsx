import AuroraBackground from "./AuroraBackground";
import ParticleNetwork from "./ParticleNetwork";

export default function BackgroundLayer() {
  return (
    <div className="fixed inset-0 -z-30">
      <AuroraBackground />
      <ParticleNetwork density={70} />
    </div>
  );
}
