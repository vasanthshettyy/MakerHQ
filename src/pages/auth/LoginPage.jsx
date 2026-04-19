import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { PREMIUM_SPRING, MICRO_INTERACTION, STAGGER_CONTAINER, STAGGER_ITEM } from '../../lib/motion';
import makerhqMark from '../../assets/makerhq-mark.png';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

            if (authError) {
                setError(authError.message);
                setLoading(false);
                return;
            }

            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('role')
                .eq('user_id', data.user.id)
                .single();

            if (userError || !userData) {
                navigate('/select-role');
            } else {
                const dashPath = userData.role === 'brand' ? '/brand/dashboard' 
                             : userData.role === 'influencer' ? '/influencer/dashboard' 
                             : '/admin/dashboard';
                navigate(dashPath);
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/select-role`,
                queryParams: { access_type: 'offline', prompt: 'consent' },
            },
        });
        if (error) setError(error.message);
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse-subtle" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-pulse-subtle" style={{ animationDelay: '1.5s' }} />

            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={PREMIUM_SPRING}
                className="glass-card w-full max-w-[440px] p-10 relative z-10"
            >
                {/* Logo Section */}
                <motion.div 
                    variants={STAGGER_CONTAINER}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col items-center mb-10 text-center"
                >
                    <motion.div variants={STAGGER_ITEM} className="relative mb-4">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150" />
                        <img src={makerhqMark} alt="MakerHQ" className="w-12 h-12 relative z-10" />
                    </motion.div>
                    
                    <motion.h1 variants={STAGGER_ITEM} className="text-3xl font-display font-bold tracking-tight text-white mb-2">
                        Welcome Back
                    </motion.h1>
                    <motion.p variants={STAGGER_ITEM} className="text-sm text-text-secondary max-w-[280px]">
                        Sign in to manage your creator ecosystem and active campaigns.
                    </motion.p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            className="mb-6 p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-xs font-bold flex items-center gap-3 overflow-hidden"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-text-muted ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white placeholder:text-text-dim outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-text-muted">
                                Password
                            </label>
                            <button type="button" className="text-[10px] font-bold text-primary hover:text-primary-light transition-colors uppercase tracking-wider">
                                Forgot?
                            </button>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full pl-11 pr-12 py-3.5 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white placeholder:text-text-dim outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary cursor-pointer transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        {...MICRO_INTERACTION}
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 mt-4"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-text-dim">
                        <span className="px-4 bg-surface-900/80 backdrop-blur-sm rounded-full">
                            secure social access
                        </span>
                    </div>
                </div>

                <motion.button
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)', scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleGoogleLogin}
                    className="w-full py-3.5 border border-white/5 rounded-2xl text-sm font-bold text-white transition-all flex items-center justify-center gap-3 cursor-pointer group"
                >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </motion.button>

                <p className="text-center text-xs font-medium text-text-muted mt-8">
                    New to MakerHQ?{' '}
                    <Link to="/signup" className="text-primary font-bold hover:text-primary-light transition-colors cursor-pointer">
                        Create an Account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
