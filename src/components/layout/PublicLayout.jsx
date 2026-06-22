import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BackgroundLayer from '../background/BackgroundLayer';
import makerhqMark from '../../assets/makerhq-mark.png';

export default function PublicLayout() {
  const { user, role } = useAuth();

  const dashboardPath = user
    ? role === 'brand' ? '/brand/dashboard'
      : role === 'influencer' ? '/influencer/dashboard'
        : role === 'admin' ? '/admin/dashboard'
          : '/select-role'
    : '/login';

  return (
    <div className="min-h-screen relative text-white bg-bg">
      <BackgroundLayer />
      
      {/* Premium Glassmorphic Navbar */}
      <header className="sticky top-0 z-50 w-full glass-card !rounded-none border-t-0 border-x-0 border-b border-white/5 px-6 md:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={makerhqMark} alt="MakerHQ" className="w-8 h-8 group-hover:scale-105 transition-transform" />
          <span className="text-display font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            MakerHQ
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <a href="#live-sandbox" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Live Sandbox
          </a>
          {user ? (
            <Link to={dashboardPath} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-light transition text-xs font-semibold uppercase tracking-wider">
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition text-xs font-semibold uppercase tracking-wider">
              Sign In
            </Link>
          )}
        </nav>
      </header>

      <Outlet />
    </div>
  );
}
