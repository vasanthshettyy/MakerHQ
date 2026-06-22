export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full blur-3xl animate-aurora-drift"
        style={{ background: "radial-gradient(circle, var(--color-primary-glow), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[55vw] h-[55vw] rounded-full blur-3xl animate-aurora-drift"
        style={{ background: "radial-gradient(circle, var(--color-accent-glow), transparent 70%)", animationDelay: "-9s" }}
      />
      <div
        className="absolute inset-0 animate-grid-pulse"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 75%)",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}
