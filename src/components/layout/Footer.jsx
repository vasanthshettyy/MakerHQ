import { Link } from "react-router-dom";
import makerhqMark from "../../assets/makerhq-mark.png";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-transparent px-6 md:px-12 py-12 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left side: Logo & Branding */}
        <div className="flex items-center gap-3">
          <img src={makerhqMark} alt="MakerHQ" className="w-6 h-6 opacity-80" />
          <span className="text-display font-black text-sm uppercase tracking-wider text-slate-300">
            MakerHQ
          </span>
        </div>

        {/* Center: Navigation quick links */}
        <div className="flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <a
            href="#live-sandbox"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("live-sandbox")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="hover:text-white transition-colors"
          >
            Live Sandbox
          </a>
          <Link to="/signup" className="hover:text-white transition-colors">
            Get Started
          </Link>
          <a
            href="https://github.com/vasanthshettyy/MakerHQ"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Repository
          </a>
        </div>

        {/* Right side: Copyright */}
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
          © {new Date().getFullYear()} MakerHQ. All nodes active.
        </div>
      </div>
    </footer>
  );
}
