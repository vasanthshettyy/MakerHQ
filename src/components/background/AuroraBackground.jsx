export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-1/4 -left-1/4 w-[75vw] h-[75vw] rounded-full blur-[140px] animate-aurora-drift"
        style={{ background: "radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 80%)" }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[70vw] h-[70vw] rounded-full blur-[140px] animate-aurora-drift"
        style={{ background: "radial-gradient(circle, rgba(45, 212, 191, 0.18) 0%, rgba(20, 184, 166, 0.06) 50%, transparent 80%)", animationDelay: "-9s" }}
      />
      <div
        className="absolute inset-0 animate-grid-pulse"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99, 102, 241, 0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.14) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 40%, transparent 85%)",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 40%, transparent 85%)",
        }}
      />
    </div>
  );
}
