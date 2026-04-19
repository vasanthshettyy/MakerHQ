import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import StepIndicator from '../../components/onboarding/StepIndicator';
import { NICHES, LANGUAGES, INDIAN_CITIES, PLATFORMS } from '../../lib/constants';
import {
    User, MapPin, Languages, Upload, Instagram, Youtube,
    Users, TrendingUp, IndianRupee, FileText,
    Loader2, ArrowRight, ArrowLeft, Check, Sparkles
} from 'lucide-react';
import { PREMIUM_SPRING, STAGGER_CONTAINER, STAGGER_ITEM, MICRO_INTERACTION } from '../../lib/motion';

const STEPS = ['Personal', 'Analytics', 'Monetization'];

export default function InfluencerOnboarding() {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [fullName, setFullName] = useState('');
    const [city, setCity] = useState('');
    const [language, setLanguage] = useState('');
    const [platformPrimary, setPlatformPrimary] = useState('');
    const [instagramHandle, setInstagramHandle] = useState('');
    const [youtubeHandle, setYoutubeHandle] = useState('');
    const [followersCount, setFollowersCount] = useState('');
    const [engagementRate, setEngagementRate] = useState('');
    const [niche, setNiche] = useState('');
    const [pricePerPost, setPricePerPost] = useState('');
    const [bio, setBio] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    function handleAvatarChange(e) {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    }

    function canProceed() {
        if (step === 1) return fullName.trim() && city && language;
        if (step === 2) {
            const hasHandle = platformPrimary === 'Instagram' ? instagramHandle.trim()
                : platformPrimary === 'YouTube' ? youtubeHandle.trim()
                    : instagramHandle.trim() || youtubeHandle.trim();
            return platformPrimary && hasHandle && Number(followersCount) > 0;
        }
        if (step === 3) return niche && Number(pricePerPost) >= 100 && bio.trim().length >= 50;
        return false;
    }

    async function handleNext() {
        if (step < 3) {
            setStep(step + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        setError('');

        try {
            let avatarUrl = '';
            if (avatarFile) {
                const fileExt = avatarFile.name.split('.').pop();
                const filePath = `${user.id}/${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, avatarFile, { cacheControl: '3600', upsert: true });

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);
                avatarUrl = publicUrl;
            }

            const { error: updateError } = await supabase
                .from('profiles_influencer')
                .update({
                    full_name: fullName.trim(),
                    city,
                    language,
                    platform_primary: platformPrimary.toLowerCase(),
                    instagram_handle: instagramHandle.trim() || null,
                    youtube_handle: youtubeHandle.trim() || null,
                    followers_count: parseInt(followersCount),
                    engagement_rate: parseFloat(engagementRate) || 0,
                    niche,
                    price_per_post: parseFloat(pricePerPost),
                    bio: bio.trim(),
                    avatar_url: avatarUrl || null,
                    onboarding_complete: true,
                })
                .eq('user_id', user.id);

            if (updateError) throw updateError;

            await refreshProfile();
            navigate('/influencer/dashboard');
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/4" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-xl p-10 md:p-12 relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-wider mb-4"
                    >
                        <Sparkles size={12} />
                        Creator Enrollment
                    </motion.div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">Showcase Your Talent</h2>
                    <p className="text-text-secondary text-sm">Tell brands who you are and why they should work with you.</p>
                </div>

                <StepIndicator steps={STEPS} currentStep={step} />

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8 p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-xs font-bold text-center"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="min-h-[360px]">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div 
                                key="step1"
                                variants={STAGGER_CONTAINER}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <motion.div variants={STAGGER_ITEM} className="space-y-2">
                                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3.5 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </motion.div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <motion.div variants={STAGGER_ITEM} className="space-y-2">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted ml-1">Location</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none" />
                                            <select
                                                value={city}
                                                onChange={e => setCity(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3.5 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled className="bg-surface-800">Select City</option>
                                                {INDIAN_CITIES.map(c => <option key={c} value={c} className="bg-surface-800">{c}</option>)}
                                            </select>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={STAGGER_ITEM} className="space-y-2">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted ml-1">Language</label>
                                        <div className="relative group">
                                            <Languages className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none" />
                                            <select
                                                value={language}
                                                onChange={e => setLanguage(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3.5 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled className="bg-surface-800">Select Language</option>
                                                {LANGUAGES.map(l => <option key={l} value={l} className="bg-surface-800">{l}</option>)}
                                            </select>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted ml-1">Primary Platform</label>
                                    <div className="flex gap-3">
                                        {PLATFORMS.map(p => (
                                            <button
                                                key={p}
                                                onClick={() => setPlatformPrimary(p)}
                                                className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all cursor-pointer ${
                                                    platformPrimary === p
                                                        ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                                                        : 'border-white/5 bg-surface-900/50 hover:bg-surface-800 text-text-secondary'
                                                }`}
                                            >
                                                {p === 'Instagram' ? <Instagram size={20} /> : p === 'YouTube' ? <Youtube size={20} /> : <Sparkles size={20} />}
                                                <span className="text-xs font-bold uppercase tracking-widest">{p}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {(platformPrimary === 'Instagram' || platformPrimary === 'Both') && (
                                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-2">
                                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted ml-1">Instagram Handle</label>
                                            <div className="relative group">
                                                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="text"
                                                    value={instagramHandle}
                                                    onChange={e => setInstagramHandle(e.target.value)}
                                                    className="w-full pl-11 pr-4 py-3 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 transition-all outline-none"
                                                    placeholder="@username"
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {(platformPrimary === 'YouTube' || platformPrimary === 'Both') && (
                                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-2">
                                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted ml-1">YouTube Channel</label>
                                            <div className="relative group">
                                                <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="text"
                                                    value={youtubeHandle}
                                                    onChange={e => setYoutubeHandle(e.target.value)}
                                                    className="w-full pl-11 pr-4 py-3 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 transition-all outline-none"
                                                    placeholder="Channel URL"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted ml-1">Total Followers</label>
                                        <div className="relative group">
                                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="number"
                                                value={followersCount}
                                                onChange={e => setFollowersCount(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 transition-all outline-none"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted ml-1">Engagement Rate</label>
                                        <div className="relative group">
                                            <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="number"
                                                value={engagementRate}
                                                onChange={e => setEngagementRate(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 transition-all outline-none"
                                                placeholder="0.0%"
                                                step="0.1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div 
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-6 bg-white/2 p-6 rounded-[2rem] border border-white/5">
                                    <div className="relative group">
                                        <div className="w-20 h-20 rounded-full bg-surface-800 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-surface-700 shadow-xl">
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <Upload className="w-6 h-6 text-text-muted group-hover:text-primary transition-colors" />
                                            )}
                                            <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-base font-bold text-white mb-1">Avatar Photo</h4>
                                        <p className="text-xs text-text-secondary leading-relaxed">
                                            Use a professional headshot. First impressions matter most.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted ml-1">Content Niche</label>
                                        <div className="relative group">
                                            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none" />
                                            <select
                                                value={niche}
                                                onChange={e => setNiche(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled>Select Niche</option>
                                                {NICHES.map(n => <option key={n} value={n} className="bg-surface-800">{n}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted ml-1">Base Rate (₹)</label>
                                        <div className="relative group">
                                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="number"
                                                value={pricePerPost}
                                                onChange={e => setPricePerPost(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 transition-all outline-none"
                                                placeholder="Min 100"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">Creator Bio</label>
                                        <span className={`text-[10px] font-bold ${bio.length >= 50 ? 'text-success' : 'text-text-dim'}`}>
                                            {bio.length} / 300
                                        </span>
                                    </div>
                                    <div className="relative group">
                                        <FileText className="absolute left-4 top-4 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                        <textarea
                                            value={bio}
                                            onChange={e => setBio(e.target.value.slice(0, 300))}
                                            rows={5}
                                            className="w-full pl-11 pr-4 py-4 bg-surface-900/50 border border-white/5 rounded-[2rem] text-sm text-white placeholder:text-text-dim focus:border-primary/50 transition-all outline-none resize-none leading-relaxed"
                                            placeholder="Highlight your experience, audience demographics, and the value you bring to brands..."
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-4 mt-12">
                    {step > 1 && (
                        <motion.button
                            {...MICRO_INTERACTION}
                            onClick={() => setStep(step - 1)}
                            className="btn-secondary px-8"
                        >
                            <ArrowLeft size={18} />
                        </motion.button>
                    )}
                    <motion.button
                        {...MICRO_INTERACTION}
                        onClick={handleNext}
                        disabled={!canProceed() || loading}
                        className="btn-primary flex-1 py-4 text-base"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : step === 3 ? (
                            <>
                                Complete Profile
                                <Check size={20} className="ml-2" />
                            </>
                        ) : (
                            <>
                                Continue
                                <ArrowRight size={20} className="ml-2" />
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
