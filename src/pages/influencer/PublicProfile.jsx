import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import PageWrapper from '../../components/layout/PageWrapper';
import {
    Users, Star, Globe, Instagram, Youtube, MapPin,
    BadgeCheck, Share2, Send, Loader2, AlertCircle,
    ChevronLeft, Heart, ExternalLink, Briefcase, Camera,
    Zap, Sparkles, ShieldCheck, Target, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PREMIUM_SPRING, STAGGER_CONTAINER, STAGGER_ITEM, MICRO_INTERACTION } from '../../lib/motion';
import { formatFollowers, formatINR, cn } from '../../lib/utils';
import ReviewList from '../../components/reviews/ReviewList';
import AverageRatingBadge from '../../components/reviews/AverageRatingBadge';

export default function PublicProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [campaignsCount, setCampaignsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const PORTFOLIO_PLACEHOLDERS = [
        { id: 1, title: 'Visionary Campaign', type: 'Lifestyle', image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800&auto=format&fit=crop' },
        { id: 2, title: 'Signal Transmission', type: 'Tech', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop' },
        { id: 3, title: 'Core Engagement', type: 'Vlog', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop' },
    ];

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            try {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles_influencer')
                    .select('*')
                    .eq('user_id', id)
                    .maybeSingle();

                if (profileError) throw profileError;
                if (!profileData) {
                    setError('Node identity not initialized.');
                    return;
                }
                setProfile(profileData);

                const { count } = await supabase
                    .from('contracts')
                    .select('*', { count: 'exact', head: true })
                    .eq('influencer_id', id)
                    .eq('status', 'Completed');

                setCampaignsCount(count || 0);
            } catch (err) {
                console.error('Profile Fetch Error:', err);
                setError('Failed to synchronize node data.');
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchProfile();
    }, [id]);

    const handleInvite = () => {
        navigate('/brand/gigs', {
            state: { influencerId: id, influencerName: profile.full_name }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 opacity-40">
                <Loader2 className="animate-spin text-primary w-10 h-10 shadow-glow" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim">Synchronizing Identity</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-3xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-8 border border-rose-500/20 shadow-glow">
                    <AlertCircle size={40} />
                </div>
                <h1 className="text-3xl font-display font-black text-white mb-3 tracking-tight">{error || 'Node Offline'}</h1>
                <p className="text-text-muted text-sm max-w-xs mb-10 font-medium">
                    This identity node is either offline or the encryption key is invalid.
                </p>
                <motion.button
                    {...MICRO_INTERACTION}
                    onClick={() => navigate(-1)}
                    className="btn-secondary px-10 py-4"
                >
                    <ChevronLeft size={18} className="mr-2" />
                    Back to Feed
                </motion.button>
            </div>
        );
    }

    return (
        <PageWrapper>
            <motion.div
                variants={STAGGER_CONTAINER}
                initial="hidden"
                animate="show"
                className="max-w-6xl mx-auto space-y-10 pb-32"
            >
                {/* Hero Profile Block */}
                <motion.div variants={STAGGER_ITEM} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 blur-[100px] -z-10 opacity-50" />
                    <div className="glass-card !rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 md:gap-16 border-white/10 relative overflow-hidden bg-surface-900/40">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-32 -mt-32" />

                        {/* Avatar Matrix */}
                        <div className="relative shrink-0">
                            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-primary via-secondary to-primary p-1.5 shadow-2xl group-hover:rotate-3 transition-transform duration-700">
                                <div className="w-full h-full rounded-full bg-surface-950 overflow-hidden border-4 border-surface-950 relative shadow-inner">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-surface-900">
                                            <span className="text-6xl font-black text-white/10 uppercase">{profile.full_name?.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {profile.is_verified && (
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: 'spring' }}
                                    className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-primary p-2.5 rounded-2xl shadow-2xl border-4 border-surface-950 text-white"
                                >
                                    <ShieldCheck size={24} strokeWidth={3} />
                                </motion.div>
                            )}
                        </div>

                        {/* Identity Logic */}
                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <div className="px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest shadow-glow">
                                        {profile.niche}
                                    </div>
                                    {!profile.is_verified && <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-text-dim text-[10px] font-black uppercase tracking-widest">Rising Node</div>}
                                </div>
                                <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter leading-none">
                                    {profile.full_name}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1">
                                    <AverageRatingBadge rating={profile.average_rating || 0} totalReviews={profile.total_reviews || 0} />
                                    <div className="h-4 w-px bg-white/10 hidden md:block" />
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <MapPin size={16} className="text-accent" />
                                        <span className="text-xs font-black uppercase tracking-widest">{profile.city || 'Global Origin'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                                <motion.button {...MICRO_INTERACTION} onClick={handleInvite} className="btn-primary min-w-[220px] py-4 text-base shadow-2xl shadow-primary/20">
                                    <Send size={18} className="mr-2" />
                                    Initialize Campaign
                                </motion.button>
                                <motion.button {...MICRO_INTERACTION} className="btn-secondary px-8 py-4 text-sm">
                                    <Share2 size={18} className="mr-2" />
                                    Copy Link
                                </motion.button>
                            </div>
                        </div>

                        {/* Power Metrics */}
                        <div className="flex flex-row md:flex-col gap-4 w-full md:w-auto">
                            {[
                                { label: 'Reach', value: formatFollowers(profile.followers_count || 0), icon: Users, color: 'text-primary' },
                                { label: 'Signal', value: `${profile.engagement_rate || '0.0'}%`, icon: Zap, color: 'text-success' }
                            ].map((stat, i) => (
                                <div key={i} className="flex-1 glass-card bg-white/[0.03] p-6 text-center border-white/5 min-w-[140px] group/stat hover:border-white/10 transition-colors">
                                    <p className="text-2xl font-display font-black text-white group-hover/stat:scale-110 transition-transform">{stat.value}</p>
                                    <div className="flex items-center justify-center gap-1.5 mt-1 text-text-dim">
                                        <stat.icon size={10} className={stat.color} />
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Data Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Transaction Logic */}
                        <motion.div variants={STAGGER_ITEM} className="glass-card p-8 space-y-8 bg-surface-900/40">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-6 flex items-center gap-2">
                                    <div className="w-1 h-3 bg-primary rounded-full" />
                                    Economic Node
                                </h3>
                                <p className="text-4xl font-display font-black text-white tracking-tighter">
                                    {formatINR(profile.price_per_post || 0)}
                                    <span className="text-xs font-bold text-text-dim tracking-normal ml-2 lowercase">/ transmission</span>
                                </p>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/5">
                                {[
                                    { label: 'Primary Language', value: profile.language || 'English', icon: Globe },
                                    { label: 'Deployment Channel', value: profile.platform_primary || 'Instagram', icon: Target }
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <row.icon size={14} className="text-text-dim group-hover:text-primary transition-colors" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{row.label}</span>
                                        </div>
                                        <span className="text-xs font-bold text-white capitalize">{row.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Verification Badge */}
                            {profile.is_verified && (
                                <div className="mt-6 p-4 rounded-2xl bg-success/5 border border-success/10 flex items-center gap-4">
                                    <ShieldCheck size={20} className="text-success" />
                                    <span className="text-[10px] font-black text-success uppercase tracking-widest">Protocol Validated</span>
                                </div>
                            )}
                        </motion.div>

                        {/* Social Signals */}
                        <motion.div variants={STAGGER_ITEM} className="glass-card p-8 space-y-6 bg-surface-900/40">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted flex items-center gap-2">
                                <div className="w-1 h-3 bg-secondary rounded-full" />
                                Channel Access
                            </h3>
                            <div className="space-y-3">
                                {profile.instagram_handle && (
                                    <motion.a 
                                        {...MICRO_INTERACTION}
                                        href={`https://instagram.com/${profile.instagram_handle}`} 
                                        target="_blank" 
                                        className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 hover:border-rose-500/30 group transition-all"
                                    >
                                        <div className="flex items-center gap-3 text-rose-400">
                                            <Instagram size={20} />
                                            <span className="text-sm font-bold">@{profile.instagram_handle}</span>
                                        </div>
                                        <ExternalLink size={14} className="text-rose-500/50 group-hover:text-rose-400" />
                                    </motion.a>
                                )}
                                {profile.youtube_handle && (
                                    <motion.a 
                                        {...MICRO_INTERACTION}
                                        href={`https://youtube.com/@${profile.youtube_handle}`} 
                                        target="_blank" 
                                        className="flex items-center justify-between p-4 rounded-2xl bg-red-500/5 border border-red-500/10 hover:border-red-500/30 group transition-all"
                                    >
                                        <div className="flex items-center gap-3 text-red-500">
                                            <Youtube size={20} />
                                            <span className="text-sm font-bold">Node {profile.youtube_handle.slice(0, 10)}...</span>
                                        </div>
                                        <ExternalLink size={14} className="text-red-500/50 group-hover:text-red-500" />
                                    </motion.a>
                                )}
                            </div>
                        </motion.div>

                        {/* Review Stream */}
                        <motion.div variants={STAGGER_ITEM} className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted px-2 flex items-center gap-2">
                                <div className="w-1 h-3 bg-amber-400 rounded-full" />
                                Network Feedback
                            </h3>
                            <ReviewList targetId={id} />
                        </motion.div>
                    </div>

                    {/* Bio & Portfolio */}
                    <div className="lg:col-span-2 space-y-10">
                        <motion.div variants={STAGGER_ITEM} className="glass-card !rounded-[3rem] p-8 md:p-12 bg-surface-900/40 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48 opacity-40" />
                            <h2 className="text-2xl font-display font-black text-white mb-8 flex items-center gap-3">
                                <Info size={24} className="text-primary" />
                                Node Intel
                            </h2>

                            {/* Deep Matrix */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                {[
                                    { label: 'Connectivity', value: formatFollowers(profile.followers_count || 0), icon: Users, color: 'text-primary' },
                                    { label: 'Resonance', value: `${profile.engagement_rate || '0.0'}%`, icon: Zap, color: 'text-success' },
                                    { label: 'Pulse Avg', value: formatFollowers((profile.followers_count || 0) * 0.05), icon: Heart, color: 'text-rose-500' },
                                    { label: 'Success Nodes', value: campaignsCount, icon: ShieldCheck, color: 'text-indigo-400' }
                                ].map((stat, i) => (
                                    <div key={i} className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all text-center">
                                        <div className="flex items-center justify-center mb-3">
                                            <stat.icon size={18} className={stat.color} />
                                        </div>
                                        <p className="text-xl font-display font-black text-white">{stat.value}</p>
                                        <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            <p className="text-lg text-text-secondary leading-relaxed font-medium italic border-l-2 border-primary/20 pl-8 py-2 mb-12">
                                {profile.bio || "This identity node has not provided a mission description."}
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {['Strategic Partner', 'High Resonance', 'Verified Output', 'Fast Deployment'].map((tag) => (
                                    <div key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                        <Sparkles size={12} className="text-primary" />
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div variants={STAGGER_ITEM} className="glass-card !rounded-[3rem] p-8 md:p-12 bg-surface-900/40">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
                                <h2 className="text-2xl font-display font-black text-white flex items-center gap-3">
                                    <Camera size={24} className="text-secondary" />
                                    Execution Gallery
                                </h2>
                                {profile.portfolio_url && (
                                    <motion.a 
                                        {...MICRO_INTERACTION}
                                        href={profile.portfolio_url} 
                                        target="_blank" 
                                        className="btn-secondary px-6 py-3 text-xs"
                                    >
                                        Access Live Node
                                        <ExternalLink size={14} className="ml-2" />
                                    </motion.a>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {PORTFOLIO_PLACEHOLDERS.map((item) => (
                                    <div key={item.id} className="group relative aspect-square rounded-[2rem] overflow-hidden border border-white/10 bg-surface-800 shadow-xl">
                                        <img src={item.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">{item.type}</p>
                                            <p className="text-base font-display font-black text-white tracking-tight">{item.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </PageWrapper>
    );
}
