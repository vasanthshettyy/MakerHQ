import { useEffect, useRef } from "react";

export default function ParticleNetwork({ density = 60 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let animationId;
    let running = true;

    const mouse = { x: -9999, y: -9999 };
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? Math.round(density * 0.4) : density;

    let particles = [];
    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    function init() {
      if (!canvas) return;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function tick() {
      if (!running || !canvas) return;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        if (Math.abs(dx) < 120 && Math.abs(dy) < 120) {
          const distSq = dx * dx + dy * dy;
          if (distSq < 14400) { // 120^2
            const dist = Math.sqrt(distSq);
            if (dist > 0) {
              p.x += (dx / dist) * 0.6;
              p.y += (dy / dist) * 0.6;
            }
          }
        }
      }

      ctx.strokeStyle = "rgba(167, 139, 250, 0.12)";
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (Math.abs(dx) < 110 && Math.abs(dy) < 110) {
            const distSq = dx * dx + dy * dy;
            if (distSq < 12100) { // 110^2
              const d = Math.sqrt(distSq);
              ctx.globalAlpha = 1 - d / 110;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
        }
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(45, 212, 191, 0.5)";
      for (const p of particles) {
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      animationId = requestAnimationFrame(tick);
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    }
    function onLeave() { mouse.x = -9999; mouse.y = -9999; }

    resize(); init(); tick();
    const handleResize = () => { resize(); init(); };
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const observer = new IntersectionObserver(([entry]) => { running = entry.isIntersecting; if (running) tick(); });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [density]);

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 w-full h-full pointer-events-auto" />;
}
