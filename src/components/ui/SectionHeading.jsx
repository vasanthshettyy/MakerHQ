export default function SectionHeading({ eyebrow, title, sub }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="text-accent text-sm font-mono uppercase tracking-widest mb-3">{eyebrow}</p>}
      <h2 className="text-display text-4xl md:text-5xl font-semibold text-white">{title}</h2>
      {sub && <p className="mt-4 text-slate-400 text-lg leading-relaxed">{sub}</p>}
    </div>
  );
}
