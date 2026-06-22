# MakerHQ Landing Page — Implementation Blueprint

A production-ready, phase-by-phase plan for the React 19 + Tailwind v4 + Framer Motion landing page. Hand this directly to your Antigravity agent — each phase is self-contained and ordered so the agent can build, checkpoint, and verify before moving on.

---

## 0. Design Plan (read this before generating any code)

Your brief already pins down the palette and stack tightly, so the open axes are **type**, **layout rhythm**, and **the signature moment**. Locking those down first keeps every later phase consistent instead of improvised.

**Color** (as specified): Primary `hsl(262 83% 68%)` violet · Accent `hsl(174 72% 56%)` teal · Background `hsl(222.2 84% 4.9%)` slate-black · Card `rgba(15,23,42,.45)` glass. Add two derived tones so gradients don't look flat: `--primary-glow: hsl(262 83% 68% / .35)` and `--accent-glow: hsl(174 72% 56% / .35)`.

**Type — three roles, chosen for the subject, not defaults:**
- **Display:** `Cabinet Grotesk` (or `Clash Display` as fallback) — confident, geometric, slightly unusual letterforms for headlines. Used large, used sparingly.
- **Body:** `Inter` — neutral workhorse for paragraphs, nav, buttons. Never competes with the display face.
- **Data/Mono:** `IBM Plex Mono` — reserved *only* for numbers: follower counts, engagement %, contract amounts, milestone timestamps. This is a deliberate choice, not decoration: mono numerals read as "measured/verified," which directly reinforces the Trust pillar every time a stat appears. Don't use it for body copy.

**Layout concept:**
```
[ nav: logo · Brand/Influencer toggle (top-level, not just in sandbox) · Sign in ]
[ HERO — left: headline+sub+dual CTA  |  right: live mini-preview of the sandbox, already mid-interaction ]
[ LIVE SANDBOX — full-width, the page's center of gravity, generous vertical room ]
[ THREE PILLARS — horizontal triptych, not stacked cards with icons-on-top (the default) —
  instead a single connected rail: Discovery → Workflow → Trust, with a thin animated
  progress line running through all three, since these three things ARE a sequence
  a brand/influencer moves through, not just a features list ]
[ SOCIAL PROOF strip — mono numerals ]
[ CTA — magnetic dual buttons ]
[ footer ]
```
Numbered/sequenced pillar treatment is justified here (per design principles) because Discovery → Workflow → Trust really is the order a user moves through the product — it's not an arbitrary feature list wearing fake numbers.

**Signature element:** the page is remembered for **one** thing: the Live Sandbox isn't a video or a static screenshot pretending to be a product — it's the real component tree, running on dummy state, that *becomes* the product the moment someone signs up. The milestone tracker's sequential checkmark-draw (Script → Draft → Final, each one stroking itself in as the previous resolves) is the single most repeated micro-moment — that's the detail to polish hardest and animate nowhere else on the page in that exact style, so it stays special.

**Restraint rule for build:** the particle network / aurora background is ambient and quiet (low opacity, slow drift, pauses off-screen). All the animation *budget* goes into the sandbox. If Phase A starts competing with Phase B for attention, dial Phase A back.

---

## Phase A — Base & Interactive Background Setup

### A1. `src/index.css` — Tailwind v4 token baseline

Tailwind v4 is CSS-first — no `tailwind.config.js` needed for design tokens, define them with `@theme`.

```css
@import "tailwindcss";

@theme {
  --color-primary: hsl(262 83% 68%);
  --color-primary-glow: hsl(262 83% 68% / 0.35);
  --color-accent: hsl(174 72% 56%);
  --color-accent-glow: hsl(174 72% 56% / 0.35);
  --color-bg: hsl(222.2 84% 4.9%);
  --color-card: rgba(15, 23, 42, 0.45);
  --color-border: rgba(148, 163, 184, 0.12);

  --font-display: "Cabinet Grotesk", "Clash Display", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;

  --animate-aurora-drift: aurora-drift 22s ease-in-out infinite alternate;
  --animate-grid-pulse: grid-pulse 6s ease-in-out infinite;
}

@layer base {
  html { color-scheme: dark; }
  body {
    background: var(--color-bg);
    font-family: var(--font-body);
    color: hsl(210 40% 96%);
  }
  ::selection { background: var(--color-primary-glow); }
}

.glass-card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.text-display { font-family: var(--font-display); letter-spacing: -0.02em; }
.text-mono-num { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }

@keyframes aurora-drift {
  0%   { transform: translate(-5%, -5%) scale(1); }
  100% { transform: translate(5%, 8%) scale(1.15); }
}
@keyframes grid-pulse {
  0%, 100% { opacity: 0.18; }
  50%      { opacity: 0.32; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}
```

### A2. `src/components/background/AuroraBackground.jsx`

Two soft radial blobs, CSS-driven (cheap, GPU-composited), not JS-animated — JS budget is reserved for the sandbox.

```jsx
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
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}
```

### A3. `src/components/background/ParticleNetwork.jsx` — canvas, mouse-reactive

Self-pausing (IntersectionObserver), density scales down on mobile, disabled entirely under `prefers-reduced-motion`.

```jsx
import { useEffect, useRef } from "react";

export default function ParticleNetwork({ density = 60 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let running = true;

    const mouse = { x: -9999, y: -9999 };
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? Math.round(density * 0.4) : density;

    let particles = [];
    function resize() {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    function init() {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function tick() {
      if (!running) return;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) { p.x += dx / dist * 0.6; p.y += dy / dist * 0.6; }
      }

      ctx.strokeStyle = "rgba(167, 139, 250, 0.12)";
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.globalAlpha = 1 - d / 110;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
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
    window.addEventListener("resize", () => { resize(); init(); });
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const observer = new IntersectionObserver(([entry]) => { running = entry.isIntersecting; if (running) tick(); });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [density]);

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 w-full h-full pointer-events-auto" />;
}
```

### A4. Compose: `src/components/background/BackgroundLayer.jsx`

```jsx
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
```
Mount once in the layout shell (`src/components/layout/PublicLayout.jsx`), not per-page, so it persists under route transitions without re-initializing.

**On image generation (your Antigravity agent can call an image tool, but here it shouldn't need to):** this entire background is code-driven — no image assets required. The one place a generated image *would* add real value is the **OG/social-share card** (1200×630, dark, MakerHQ wordmark + a frozen frame of the milestone tracker) and possibly 2–3 **creator avatar placeholders** for the mock data in Phase D. Don't generate decorative hero art — the sandbox itself is the hero visual.

---

## Phase B — Component Architecture

### File structure

```
src/
├─ components/
│  ├─ layout/
│  │  └─ PublicLayout.jsx          (mounts BackgroundLayer + <Outlet/>)
│  ├─ background/
│  │  ├─ AuroraBackground.jsx
│  │  ├─ ParticleNetwork.jsx
│  │  └─ BackgroundLayer.jsx
│  ├─ ui/
│  │  ├─ GlassCard.jsx
│  │  ├─ SectionHeading.jsx
│  │  └─ MagneticButton.jsx
│  ├─ sandbox/
│  │  ├─ LiveSandbox.jsx            (state machine + view toggle, top-level)
│  │  ├─ ModeToggle.jsx             (Brand/Influencer pill switch)
│  │  ├─ brand/
│  │  │  ├─ BrandFlow.jsx
│  │  │  ├─ FilterPanel.jsx
│  │  │  ├─ CreatorCard.jsx
│  │  │  └─ ContractTimeline.jsx
│  │  └─ influencer/
│  │     ├─ InfluencerFlow.jsx
│  │     ├─ PriceSlider.jsx
│  │     └─ MilestoneTracker.jsx
│  └─ sections/
│     ├─ Hero.jsx
│     ├─ ThreePillars.jsx
│     └─ CTASection.jsx
├─ lib/
│  ├─ motion.js                     (shared variants + timing tokens)
│  └─ mockData.js
├─ pages/
│  └─ LandingPage.jsx
└─ routes/
   └─ AppRouter.jsx
```

### `src/pages/LandingPage.jsx`

```jsx
import Hero from "@/components/sections/Hero";
import LiveSandbox from "@/components/sandbox/LiveSandbox";
import ThreePillars from "@/components/sections/ThreePillars";
import CTASection from "@/components/sections/CTASection";

export default function LandingPage() {
  return (
    <main className="relative z-10 flex flex-col gap-32 px-6 md:px-12 pb-32">
      <Hero />
      <LiveSandbox />
      <ThreePillars />
      <CTASection />
    </main>
  );
}
```

### `src/routes/AppRouter.jsx` — additions

```jsx
import { createBrowserRouter } from "react-router";
import PublicLayout from "@/components/layout/PublicLayout";
import LandingPage from "@/pages/LandingPage";
import SignupPage from "@/pages/SignupPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/signup", element: <SignupPage /> }, // reads ?role=brand | ?role=influencer via useSearchParams
    ],
  },
]);
```

### Primitives

`GlassCard.jsx` and `SectionHeading.jsx` are intentionally tiny — they exist so every card/heading in the page shares one source of truth for the glass treatment and the eyebrow/heading/sub pattern, instead of each section reinventing it:

```jsx
// src/components/ui/GlassCard.jsx
import { motion } from "framer-motion";
export default function GlassCard({ children, className = "", ...props }) {
  return (
    <motion.div className={`glass-card rounded-2xl ${className}`} {...props}>
      {children}
    </motion.div>
  );
}
```

```jsx
// src/components/ui/SectionHeading.jsx
export default function SectionHeading({ eyebrow, title, sub }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="text-accent text-sm font-mono uppercase tracking-widest mb-3">{eyebrow}</p>}
      <h2 className="text-display text-4xl md:text-5xl font-semibold text-white">{title}</h2>
      {sub && <p className="mt-4 text-slate-400 text-lg leading-relaxed">{sub}</p>}
    </div>
  );
}
```

---

## Phase C — Detailed Animation Spec

### C1. Shared motion tokens — `src/lib/motion.js`

Centralizing this means "make it feel snappier everywhere" is a one-line change, not a 12-file hunt.

```js
export const EASE = [0.16, 1, 0.3, 1]; // signature "ease-out-expo"-ish curve, used everywhere

export const durations = { fast: 0.18, base: 0.32, slow: 0.55, stagger: 0.08 };

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: durations.slow, ease: EASE } },
};

export const staggerContainer = (stagger = durations.stagger) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: 0.1 } },
});

export const sandboxStepTransition = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: durations.base, ease: EASE } },
  exit: { opacity: 0, x: -24, transition: { duration: durations.fast, ease: EASE } },
};

export const springSnappy = { type: "spring", stiffness: 300, damping: 24 };
export const springSoft = { type: "spring", stiffness: 150, damping: 18 };
```

### C2. Hero entrance

Headline words stagger in via `staggerContainer`/`fadeUp` (children = each line, not each letter — letter-stagger reads as more "AI demo" than premium). The sandbox preview panel on the right enters with a slight scale+blur resolve (`initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}`) at `durations.slow`, delayed 0.2s after the headline starts, so the eye lands on copy first, product second.

### C3. Mode toggle (Brand / Influencer)

A pill switch where the active-state background is a single `motion.div` with `layoutId="mode-pill"` shared between both buttons — Framer Motion animates its position/size automatically between states (no manual x/width math):

```jsx
<button onClick={() => setMode("brand")} className="relative px-5 py-2 z-10">
  {mode === "brand" && (
    <motion.div layoutId="mode-pill" className="absolute inset-0 rounded-full bg-primary -z-10" transition={springSnappy} />
  )}
  Brand View
</button>
```

### C4. Sandbox step transitions (the core interaction)

Each flow is a small state machine (`step: "search" | "filters" | "profile" | "offer" | "contract"` for Brand). Step content is wrapped in `AnimatePresence mode="wait"` keyed by `step`, using `sandboxStepTransition` from C1 — slide-fade, 320ms, no overlap (`mode="wait"` prevents two steps rendering at once, which matters here because layout height changes between steps).

### C5. Filter panel "animate in"

Filter chips use `staggerContainer` as the parent `variants`, each chip `fadeUp` — 80ms stagger reads as "snapping into place" without feeling slow. `layout` prop on the chip container so the creator grid below reflows smoothly when a filter narrows results, instead of jump-cutting.

### C6. Creator card hover

```jsx
<motion.div
  whileHover={{ y: -4, boxShadow: "0 0 0 1px var(--color-accent-glow), 0 20px 40px -20px var(--color-primary-glow)" }}
  transition={springSoft}
/>
```
No tilt/3D — keep it to lift + glow. A 3D tilt on every card in a grid is the "too much animation" trap the design skill warns about; reserve dimensional movement for the one signature moment (milestone tracker).

### C7. Contract timeline reveal

Sequential reveal using `staggerContainer` (children = each contract stage row). Each checkmark is an inline SVG with a `<motion.path>` animated via `pathLength`:

```jsx
<motion.path d="M4 12l5 5L20 6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
  transition={{ duration: 0.4, ease: EASE, delay: i * 0.15 }} />
```

### C8. Milestone tracker — the signature animation

Three nodes (Script → Draft → Final) connected by a progress line. The line itself animates with `scaleX` from the previous breakpoint to the current one whenever `currentStep` advances; the *current* node pulses (`animate={{ scale: [1, 1.15, 1] }}, transition: { repeat: Infinity, duration: 1.6 }`) while status is "in review," then on approval the pulse stops and the same `pathLength` checkmark draw from C7 fires — this shared checkmark treatment is what ties Phase B/D's two "approval" moments (contract + milestone) into one consistent visual language instead of two competing animation styles.

### C9. Price slider

`PriceSlider` uses Framer's `useMotionValue` + `useTransform` so the displayed number is driven directly by drag position with zero extra re-renders:

```jsx
const x = useMotionValue(quotedPrice);
const display = useTransform(x, (v) => `₹${Math.round(v).toLocaleString("en-IN")}`);
```
Handle scales to `1.15` on `whileDrag`, springs back on release (`springSnappy`).

### C10. Magnetic CTA buttons

Pointer position relative to button center drives `x`/`y` via spring, clamped to a max offset so it pulls, not chases:

```jsx
const handleMove = (e) => {
  const rect = ref.current.getBoundingClientRect();
  const relX = e.clientX - (rect.left + rect.width / 2);
  const relY = e.clientY - (rect.top + rect.height / 2);
  x.set(Math.max(-12, Math.min(12, relX * 0.3)));
  y.set(Math.max(-12, Math.min(12, relY * 0.3)));
};
```
Full implementation in Phase D.

### C11. Pillar rail

Per the layout concept, the three pillars share one thin horizontal line that fills left-to-right via `useScroll` + `useTransform` scroll-linked progress (not click-triggered) — it's a *scroll* reveal because it represents a journey, reinforcing the "this is a sequence" framing rather than three independent feature cards.

### C12. Reduced motion

Every component above checks `useReducedMotion()` from Framer Motion at the top and, when `true`, swaps spring/staggered variants for instant opacity-only transitions — handled once in a `useAccessibleMotion()` wrapper hook in `lib/motion.js` rather than re-checked ad hoc in each file.

---

## Phase D — Code & Mock Data

### D1. `src/lib/mockData.js`

```js
export const creators = [
  { id: "c1", name: "Ananya Rao", niche: "Beauty", city: "Mumbai", followers: 84200, engagement: 6.4, verified: true,  rate: 18000 },
  { id: "c2", name: "Rohit Mehta", niche: "Tech", city: "Bengaluru", followers: 152000, engagement: 4.1, verified: true,  rate: 32000 },
  { id: "c3", name: "Sana Iqbal", niche: "Fashion", city: "Delhi", followers: 46300, engagement: 8.2, verified: false, rate: 9500 },
  { id: "c4", name: "Vikram Singh", niche: "Fitness", city: "Pune", followers: 61800, engagement: 5.9, verified: true,  rate: 14000 },
];

export const niches = ["All", "Beauty", "Tech", "Fashion", "Fitness"];

export const campaign = {
  id: "camp-01",
  brand: "Lumora Skincare",
  title: "Festive Glow — Reels Campaign",
  budgetRange: [8000, 25000],
  briefLine: "3 reels showcasing the new vitamin-C serum, festive aesthetic, 30–45s each.",
};

export const milestoneSteps = [
  { key: "script", label: "Script", description: "Outline + hook approved" },
  { key: "draft",  label: "Draft",  description: "First cut shared for review" },
  { key: "final",  label: "Final",  description: "Delivered, ready to post" },
];

export const contractStages = [
  { key: "sent",      label: "Offer sent" },
  { key: "accepted",  label: "Accepted by creator" },
  { key: "escrow",    label: "Payment in escrow" },
  { key: "delivered", label: "Content delivered" },
  { key: "released",  label: "Payment released" },
];
```

### D2. `src/components/sandbox/LiveSandbox.jsx` — top-level state machine

```jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import ModeToggle from "./ModeToggle";
import BrandFlow from "./brand/BrandFlow";
import InfluencerFlow from "./influencer/InfluencerFlow";
import { fadeUp } from "@/lib/motion";

export default function LiveSandbox() {
  const [mode, setMode] = useState("brand"); // "brand" | "influencer"

  return (
    <motion.section
      id="live-sandbox"
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp} className="relative"
    >
      <div className="flex flex-col items-center text-center mb-10">
        <p className="text-accent text-sm font-mono uppercase tracking-widest mb-3">Try it live</p>
        <h2 className="text-display text-4xl md:text-5xl font-semibold text-white mb-4">
          This isn't a demo video. It's the product.
        </h2>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>

      <GlassCard className="p-6 md:p-10 min-h-[480px]">
        <AnimatePresence mode="wait">
          {mode === "brand"
            ? <motion.div key="brand"><BrandFlow /></motion.div>
            : <motion.div key="influencer"><InfluencerFlow /></motion.div>}
        </AnimatePresence>
      </GlassCard>
    </motion.section>
  );
}
```

### D3. `src/components/sandbox/ModeToggle.jsx`

```jsx
import { motion } from "framer-motion";
import { springSnappy } from "@/lib/motion";

export default function ModeToggle({ mode, setMode }) {
  return (
    <div className="relative flex glass-card rounded-full p-1">
      {["brand", "influencer"].map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`relative px-5 py-2 z-10 text-sm font-medium rounded-full transition-colors ${
            mode === m ? "text-white" : "text-slate-400"
          }`}
        >
          {mode === m && (
            <motion.div layoutId="mode-pill" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={springSnappy} />
          )}
          {m === "brand" ? "Brand View" : "Influencer View"}
        </button>
      ))}
    </div>
  );
}
```

### D4. `src/components/sandbox/brand/BrandFlow.jsx`

```jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sandboxStepTransition, staggerContainer, fadeUp } from "@/lib/motion";
import { creators, niches } from "@/lib/mockData";
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
        <motion.div key="search" {...sandboxStepTransition} className="flex flex-col items-center gap-6 py-12">
          <p className="text-slate-300 text-lg">Find creators who already talk to your audience.</p>
          <button
            onClick={() => setStep("filters")}
            className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition"
          >
            Search Creators
          </button>
        </motion.div>
      )}

      {step === "filters" && (
        <motion.div key="filters" {...sandboxStepTransition}>
          <FilterPanel niches={niches} active={niche} onSelect={setNiche} />
          <motion.div
            layout variants={staggerContainer()} initial="hidden" animate="visible"
            className="grid sm:grid-cols-2 gap-4 mt-6"
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
        <motion.div key="profile" {...sandboxStepTransition} className="max-w-md mx-auto text-center py-8">
          <p className="text-2xl font-display text-white mb-1">{selected.name}</p>
          <p className="text-slate-400 mb-6">{selected.niche} · {selected.city}</p>
          <div className="flex justify-center gap-8 mb-8 text-mono-num">
            <Stat label="Followers" value={selected.followers.toLocaleString("en-IN")} />
            <Stat label="Engagement" value={`${selected.engagement}%`} />
            <Stat label="Rate / reel" value={`₹${selected.rate.toLocaleString("en-IN")}`} />
          </div>
          <div className="flex justify-center gap-3">
            <button onClick={() => setStep("filters")} className="px-5 py-2.5 rounded-xl glass-card text-slate-300">Back</button>
            <button onClick={() => setStep("offer")} className="px-5 py-2.5 rounded-xl bg-accent text-slate-900 font-medium">Send Gig Offer</button>
          </div>
        </motion.div>
      )}

      {step === "offer" && (
        <motion.div key="offer" {...sandboxStepTransition} className="max-w-md mx-auto text-center py-12">
          <p className="text-slate-300 mb-6">Offer sent to {selected?.name}. Once accepted, the contract moves through escrow automatically.</p>
          <button onClick={() => setStep("contract")} className="px-6 py-3 rounded-xl bg-primary text-white font-medium">View Contract Timeline</button>
        </motion.div>
      )}

      {step === "contract" && <motion.div key="contract" {...sandboxStepTransition}><ContractTimeline /></motion.div>}
    </AnimatePresence>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-lg text-white">{value}</p>
      <p className="text-xs text-slate-500 font-sans uppercase tracking-wide">{label}</p>
    </div>
  );
}
```

### D5. `src/components/sandbox/brand/FilterPanel.jsx`

```jsx
import { motion } from "framer-motion";

export default function FilterPanel({ niches, active, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {niches.map((n) => (
        <motion.button
          layout key={n} onClick={() => onSelect(n)}
          className={`px-4 py-1.5 rounded-full text-sm border ${
            active === n ? "bg-primary text-white border-primary" : "border-slate-700 text-slate-400"
          }`}
        >
          {n}
        </motion.button>
      ))}
    </div>
  );
}
```

### D6. `src/components/sandbox/brand/CreatorCard.jsx`

```jsx
import { motion } from "framer-motion";
import { springSoft } from "@/lib/motion";

export default function CreatorCard({ creator, onSelect }) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ y: -4, boxShadow: "0 0 0 1px var(--color-accent-glow), 0 20px 40px -20px var(--color-primary-glow)" }}
      transition={springSoft}
      className="glass-card rounded-xl p-4 text-left"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-white">{creator.name}</p>
        {creator.verified && <span className="text-xs text-accent font-mono">✓ verified</span>}
      </div>
      <p className="text-sm text-slate-400 mb-3">{creator.niche} · {creator.city}</p>
      <p className="text-mono-num text-sm text-slate-300">
        {creator.followers.toLocaleString("en-IN")} followers · {creator.engagement}% eng.
      </p>
    </motion.button>
  );
}
```

### D7. `src/components/sandbox/brand/ContractTimeline.jsx`

```jsx
import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import { contractStages } from "@/lib/mockData";

export default function ContractTimeline() {
  return (
    <motion.div variants={staggerContainer(0.15)} initial="hidden" animate="visible" className="max-w-md mx-auto py-6">
      {contractStages.map((stage, i) => (
        <motion.div
          key={stage.key}
          variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
          className="flex items-center gap-3 py-3 border-l border-slate-700 pl-4 relative"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" className="absolute -left-[11px] bg-bg rounded-full">
            <circle cx="12" cy="12" r="11" fill="var(--color-bg)" stroke="var(--color-accent)" strokeWidth="1.5" />
            <motion.path
              d="M7 12l3.5 3.5L17 9" fill="none" stroke="var(--color-accent)" strokeWidth="2"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: i * 0.15 + 0.3 }}
            />
          </svg>
          <p className="text-slate-200">{stage.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### D8. `src/components/sandbox/influencer/InfluencerFlow.jsx`

```jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sandboxStepTransition } from "@/lib/motion";
import { campaign } from "@/lib/mockData";
import PriceSlider from "./PriceSlider";
import MilestoneTracker from "./MilestoneTracker";

export default function InfluencerFlow() {
  const [step, setStep] = useState("apply"); // apply -> price -> milestones
  const [price, setPrice] = useState(15000);

  return (
    <AnimatePresence mode="wait">
      {step === "apply" && (
        <motion.div key="apply" {...sandboxStepTransition} className="max-w-md mx-auto text-center py-10">
          <p className="text-accent text-sm font-mono uppercase tracking-widest mb-2">{campaign.brand}</p>
          <p className="text-2xl font-display text-white mb-3">{campaign.title}</p>
          <p className="text-slate-400 mb-8">{campaign.briefLine}</p>
          <button onClick={() => setStep("price")} className="px-6 py-3 rounded-xl bg-primary text-white font-medium">
            Apply to Campaign
          </button>
        </motion.div>
      )}

      {step === "price" && (
        <motion.div key="price" {...sandboxStepTransition} className="max-w-md mx-auto text-center py-10">
          <p className="text-slate-300 mb-6">Quote your price for this deliverable.</p>
          <PriceSlider value={price} onChange={setPrice} min={8000} max={25000} />
          <button onClick={() => setStep("milestones")} className="mt-8 px-6 py-3 rounded-xl bg-accent text-slate-900 font-medium">
            Submit Quote
          </button>
        </motion.div>
      )}

      {step === "milestones" && <motion.div key="milestones" {...sandboxStepTransition}><MilestoneTracker /></motion.div>}
    </AnimatePresence>
  );
}
```

### D9. `src/components/sandbox/influencer/PriceSlider.jsx`

```jsx
import { motion, useMotionValue, useTransform } from "framer-motion";
import { springSnappy } from "@/lib/motion";

export default function PriceSlider({ value, onChange, min, max }) {
  const display = useTransform(useMotionValue(value), (v) => `₹${Math.round(v).toLocaleString("en-IN")}`);

  return (
    <div>
      <motion.p className="text-mono-num text-3xl text-white mb-6">{display}</motion.p>
      <input
        type="range" min={min} max={max} step={500} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <motion.div whileDrag={{ scale: 1.15 }} transition={springSnappy} className="sr-only" />
    </div>
  );
}
```
*(Native `<input type="range">` is intentional — it's fully accessible and keyboard-operable for free; the `useTransform` number readout is the animated layer on top, not a replacement for the control.)*

### D10. `src/components/sandbox/influencer/MilestoneTracker.jsx` — signature component

```jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { milestoneSteps } from "@/lib/mockData";

export default function MilestoneTracker() {
  const [current, setCurrent] = useState(0); // index into milestoneSteps
  const [reviewing, setReviewing] = useState(false);

  function advance() {
    if (current >= milestoneSteps.length - 1 && !reviewing) return;
    if (!reviewing) { setReviewing(true); return; }
    setReviewing(false);
    setCurrent((c) => Math.min(c + 1, milestoneSteps.length - 1));
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="flex items-center justify-between relative mb-10">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-700 -translate-y-1/2" />
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-accent -translate-y-1/2 origin-left"
          animate={{ scaleX: current / (milestoneSteps.length - 1) }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%" }}
        />
        {milestoneSteps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 flex-1">
              <motion.div
                animate={active && reviewing ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={active && reviewing ? { repeat: Infinity, duration: 1.6 } : {}}
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${
                  done ? "bg-accent border-accent" : active ? "border-accent bg-bg" : "border-slate-600 bg-bg"
                }`}
              >
                {done ? (
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <motion.path d="M4 12l5 5L20 6" fill="none" stroke="#0f172a" strokeWidth="3"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
                  </svg>
                ) : (
                  <span className="text-xs text-slate-400 font-mono">{i + 1}</span>
                )}
              </motion.div>
              <p className={`text-sm ${active ? "text-white" : "text-slate-500"}`}>{step.label}</p>
            </div>
          );
        })}
      </div>

      <p className="text-center text-slate-400 mb-6">
        {reviewing ? `${milestoneSteps[current].label} in review…` : milestoneSteps[current].description}
      </p>
      <div className="flex justify-center">
        <button onClick={advance} className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium">
          {reviewing ? "Mark Approved" : current === milestoneSteps.length - 1 ? "Submit Milestone" : "Submit Milestone"}
        </button>
      </div>
    </div>
  );
}
```

### D11. `src/components/ui/MagneticButton.jsx`

```jsx
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticButton({ children, href, ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18 });
  const springY = useSpring(y, { stiffness: 200, damping: 18 });

  function handleMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-14, Math.min(14, relX * 0.3)));
    y.set(Math.max(-14, Math.min(14, relY * 0.3)));
  }
  function handleLeave() { x.set(0); y.set(0); }

  return (
    <motion.a
      ref={ref} href={href}
      onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className="inline-flex px-8 py-4 rounded-full font-medium text-white"
      {...props}
    >
      {children}
    </motion.a>
  );
}
```

### D12. `src/components/sections/CTASection.jsx`

```jsx
import MagneticButton from "@/components/ui/MagneticButton";

export default function CTASection() {
  return (
    <section className="flex flex-col items-center text-center gap-8 py-20">
      <h2 className="text-display text-4xl md:text-5xl font-semibold text-white max-w-2xl">
        Your next campaign — or your next brand deal — starts here.
      </h2>
      <div className="flex flex-wrap gap-4 justify-center">
        <MagneticButton href="/signup?role=brand" className="bg-primary">I'm a Brand</MagneticButton>
        <MagneticButton href="/signup?role=influencer" className="bg-accent text-slate-900">I'm an Influencer</MagneticButton>
      </div>
    </section>
  );
}
```

### D13. `src/components/sections/ThreePillars.jsx`

```jsx
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const pillars = [
  { label: "Discovery",  copy: "Filter by niche, city, and real engagement — not follower counts alone." },
  { label: "Workflow",   copy: "Script → Draft → Final. Every milestone tracked, every approval timestamped." },
  { label: "Trust",      copy: "Verified stats and escrow payments, so neither side is taking it on faith." },
];

export default function ThreePillars() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.5"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref}>
      <SectionHeading eyebrow="How it works" title="Three steps, one trusted flow" />
      <div className="relative mt-12">
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-700 hidden md:block" />
        <motion.div style={{ scaleX: lineScale }} className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent origin-left hidden md:block" />
        <div className="grid md:grid-cols-3 gap-10 relative">
          {pillars.map((p, i) => (
            <div key={p.label} className="relative pt-14">
              <div className="absolute top-0 left-0 w-3 h-3 rounded-full bg-accent" />
              <p className="text-mono-num text-sm text-slate-500 mb-2">0{i + 1}</p>
              <p className="text-xl font-display text-white mb-2">{p.label}</p>
              <p className="text-slate-400 leading-relaxed">{p.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Build order for the agent

1. Phase A files first, mount in `PublicLayout`, verify background renders + particles react to mouse, nothing else on the page yet.
2. Scaffold Phase B file tree with empty stubs, wire `AppRouter`, confirm `/` renders the empty sections without errors.
3. Build `BrandFlow` end to end (D4–D7) before touching `InfluencerFlow` — it's the longer state machine, and `ContractTimeline`'s checkmark pattern gets reused in `MilestoneTracker`.
4. Build `InfluencerFlow` (D8–D10), reusing the checkmark SVG pattern from step 3.
5. `MagneticButton` + `CTASection`, then `ThreePillars`, then `Hero` last — Hero references the sandbox's visual language (mini-preview), so it's easiest to match once the real sandbox exists.
6. Pass over everything once with `prefers-reduced-motion` forced on (devtools emulation) — confirm nothing breaks and nothing feels broken, just calmer.
7. Only then consider the optional OG-card image asset from Phase A's closing note.