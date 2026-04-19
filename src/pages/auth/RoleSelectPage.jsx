import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Building2, Users, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { PREMIUM_SPRING, STAGGER_CONTAINER, STAGGER_ITEM, MICRO_INTERACTION } from '../../lib/motion';
import makerhqMark from '../../assets/makerhq-mark.png';

export default function RoleSelectPage() {
    const navigate = useNavigate();
    const { user, role, refreshProfile } = useAuth();
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && !role) {
            refreshProfile();
        }
        if (role === 'brand') navigate('/brand/dashboard', { replace: true });
        else if (role === 'influencer') navigate('/influencer/dashboard', { replace: true });
        else if (role === 'admin') navigate('/admin/dashboard', { replace: true });
    }, [role, navigate, user, refreshProfile]);

    async function handleContinue() {
        if (!selectedRole || !user) return;
        setLoading(true);
        setError('');

        try {
            const { error: userError } = await supabase.from('users').insert({
                user_id: user.id,
                email: user.email,
                role: selectedRole,
            });

            if (userError) throw userError;

            const profileTable = selectedRole === 'brand' ? 'profiles_brand' : 'profiles_influencer';
            const { error: profileError } = await supabase.from(profileTable).insert({
                user_id: user.id,
                onboarding_complete: false,
            });

            if (profileError) throw profileError;

            navigate('/onboarding');
        } catch (err) {
            console.error('Role select error:', err);
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    const roles = [
        {
            id: 'brand',
            icon: Building2,
            title: 'I\'m a Brand',
            description: 'Post high-impact campaigns, discover elite talent, and manage global collaborations in one space.',
            accent: 'from-indigo-500 to-cyan-400'
        },
        {
            id: 'influencer',
            icon: Users,
            title: 'I\'m a Creator',
            description: 'Monetize your influence, track performance analytics, and partner with brands you actually love.',
            accent: 'from-fuchsia-500 to-rose-400'
        },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
            {/* Ambient background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05)_0%,transparent_50%)]" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={PREMIUM_SPRING}
                className="glass-card w-full max-w-[640px] p-12 relative z-10"
            >
                <motion.div 
                    variants={STAGGER_CONTAINER}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col items-center mb-12 text-center"
                >
                    <motion.div variants={STAGGER_ITEM} className="flex items-center gap-3 mb-6">
                        <img src={makerhqMark} alt="MakerHQ" className="w-10 h-10" />
                        <span className="text-xl font-display font-bold tracking-tight text-white">MakerHQ</span>
                    </motion.div>
                    
                    <motion.h1 variants={STAGGER_ITEM} className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-white mb-3">
                        Choose Your Path
                    </motion.h1>
                    <motion.p variants={STAGGER_ITEM} className="text-base text-text-secondary max-w-[420px]">
                        Tailor your MakerHQ experience to your specific goals and workflow.
                    </motion.p>
                </motion.div>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-8 p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-xs font-bold text-center"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                    {roles.map(({ id, title, description, icon: Icon, accent }) => (
                        <motion.button
                            key={id}
                            variants={STAGGER_ITEM}
                            initial="hidden"
                            animate="show"
                            onClick={() => setSelectedRole(id)}
                            whileHover={{ y: -4, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative p-8 rounded-[2rem] border transition-all text-left group overflow-hidden ${
                                selectedRole === id
                                    ? 'border-primary/50 bg-primary/10 shadow-[0_0_40px_rgba(99,102,241,0.1)]'
                                    : 'border-white/5 bg-surface-900/50 hover:bg-surface-800/80 hover:border-white/10'
                            }`}
                        >
                            {/* Accent Glow */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${accent} opacity-0 blur-3xl group-hover:opacity-10 transition-opacity`} />
                            
                            <div className={`p-4 rounded-2xl mb-6 w-fit shadow-lg transition-all ${
                                selectedRole === id 
                                    ? 'bg-primary text-white scale-110' 
                                    : 'bg-white/5 text-text-muted group-hover:text-primary group-hover:bg-primary/5'
                            }`}>
                                <Icon size={28} />
                            </div>
                            
                            <h3 className="font-bold text-xl text-white mb-2 flex items-center gap-2">
                                {title}
                                {selectedRole === id && <Sparkles size={16} className="text-primary animate-pulse" />}
                            </h3>
                            <p className="text-sm text-text-muted leading-relaxed font-medium">
                                {description}
                            </p>

                            {/* Checkmark for selection */}
                            <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                                selectedRole === id 
                                    ? 'border-primary bg-primary scale-100' 
                                    : 'border-white/10 scale-0 opacity-0'
                            }`}>
                                <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white -rotate-45 mb-0.5" />
                            </div>
                        </motion.button>
                    ))}
                </div>

                <motion.button
                    {...MICRO_INTERACTION}
                    onClick={handleContinue}
                    disabled={!selectedRole || loading}
                    className="btn-primary w-full py-5 text-base"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Get Started
                            <ArrowRight size={20} className="ml-2" />
                        </>
                    )}
                </motion.button>

                <p className="text-center text-xs font-medium text-text-dim mt-8">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </motion.div>
        </div>
    );
}
