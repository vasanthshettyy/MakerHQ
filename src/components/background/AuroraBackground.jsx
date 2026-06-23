export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
      {/* Primary Indigo aurora blob */}
      <div
        className="absolute -top-1/4 -left-1/4 w-[75vw] h-[75vw] rounded-full blur-[140px] animate-aurora-drift"
        style={{ background: "radial-gradient(circle, rgba(99, 102, 241, 0.30) 0%, rgba(139, 92, 246, 0.12) 50%, transparent 80%)" }}
      />
      {/* Rose/accent aurora blob */}
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[70vw] h-[70vw] rounded-full blur-[140px] animate-aurora-drift"
        style={{ background: "radial-gradient(circle, rgba(225, 29, 72, 0.20) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 80%)", animationDelay: "-9s" }}
      />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 animate-grid-pulse"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99, 102, 241, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.18) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 30%, black 40%, transparent 88%)",
          maskImage: "radial-gradient(ellipse 85% 75% at 50% 30%, black 40%, transparent 88%)",
        }}
      />
    </div>
  );
}
