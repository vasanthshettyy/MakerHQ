import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, IndianRupee, Instagram, Youtube, Save, 
  Loader2, CheckCircle2, AlertCircle, FileText, Target,
  ShieldCheck, RefreshCcw, Camera, Sparkles, Info, Globe, Zap
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import PageWrapper from '../../components/layout/PageWrapper';
import { STAGGER_CONTAINER, STAGGER_ITEM, MICRO_INTERACTION, PREMIUM_SPRING } from '../../lib/motion';
import VerificationUpload from '../../components/verification/VerificationUpload';
import VerificationStatus from '../../components/trust/VerificationStatus';

const InfluencerProfilePage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [proofs, setProofs] = useState([]);
  const [loadingProofs, setLoadingProofs] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    niche: '',
    city: '',
    bio: '',
    instagram_handle: '',
    youtube_handle: '',
    price_per_post: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        niche: profile.niche || '',
        city: profile.city || '',
        bio: profile.bio || '',
        instagram_handle: profile.instagram_handle || '',
        youtube_handle: profile.youtube_handle || '',
        price_per_post: profile.price_per_post || ''
      });
      fetchProofs();
    }
  }, [profile]);

  const fetchProofs = async () => {
    if (!user) return;
    try {
      setLoadingProofs(true);
      const { data, error } = await supabase
        .from('verification_proofs')
        .select('*')
        .eq('influencer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProofs(data || []);
    } catch (err) {
      console.error('Error fetching proofs:', err);
    } finally {
      setLoadingProofs(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (message) setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles_influencer')
        .update({
          full_name: formData.full_name,
          niche: formData.niche,
          city: formData.city,
          bio: formData.bio,
          instagram_handle: formData.instagram_handle,
          youtube_handle: formData.youtube_handle,
          price_per_post: parseFloat(formData.price_per_post) || 0,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      await refreshProfile();
      setMessage({ type: 'success', text: 'Identity node synchronized successfully.' });
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error('Update Error:', err);
      setMessage({ type: 'error', text: err.message || 'Synchronization failed.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageWrapper title="System Engine" subtitle="Configure your creator identity and transmission parameters.">
      <div className="max-w-4xl">
        <motion.div 
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
            {/* Left: Identity Overview */}
            <div className="lg:col-span-1 space-y-6">
                <motion.div variants={STAGGER_ITEM} className="glass-card p-6 bg-primary/5 border-primary/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/20">
                            <ShieldCheck size={18} />
                        </div>
                        <h3 className="font-display font-black text-white uppercase tracking-tight">Identity Node</h3>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed mb-6">
                        Your public node profile affects how elite brands perceive and value your collaboration potential.
                    </p>
                    <div className="space-y-3">
                        <div className={cn(
                            "flex items-center gap-2 text-[10px] font-black text-text-dim uppercase tracking-widest bg-white/5 p-2.5 rounded-xl border border-white/5",
                            profile?.is_verified && "border-success/20 text-success bg-success/5"
                        )}>
                            <ShieldCheck size={12} className={profile?.is_verified ? "text-success" : "text-text-dim"} /> 
                            {profile?.is_verified ? "Verified Node" : "Unverified Node"}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-text-dim uppercase tracking-widest bg-white/5 p-2.5 rounded-xl border border-white/5">
                            <Sparkles size={12} className="text-primary" /> Premium Creator
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={STAGGER_ITEM} className="p-6 rounded-[2rem] border border-white/5 bg-surface-900/40 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-surface-800 border border-white/10 flex items-center justify-center overflow-hidden mb-4 shadow-xl group cursor-pointer relative">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <User size={40} className="text-text-dim" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera size={24} className="text-white" />
                            </div>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">{formData.full_name || 'Creator Node'}</h4>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{formData.niche || 'General'} • {formData.city || 'Global'}</p>
                    </div>
                </motion.div>
            </div>

            {/* Right: Refinement Form */}
            <motion.div variants={STAGGER_ITEM} className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="glass-card !rounded-[2.5rem] p-8 md:p-10 border-white/5 bg-surface-900/20 space-y-10">
                    <AnimatePresence mode="wait">
                        {message && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -10 }}
                                className={cn(
                                    "p-4 rounded-2xl border flex items-center gap-3 overflow-hidden",
                                    message.type === 'success' ? "bg-success/10 border-success/20 text-success" : "bg-error/10 border-error/20 text-error"
                                )}
                            >
                                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                <p className="text-xs font-bold uppercase tracking-widest">{message.text}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Section 1: Core Logistics */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-1">
                            <Info size={12} className="text-primary" />
                            <h4 className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Identity Parameters</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Professional Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="full_name"
                                        type="text"
                                        required
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3.5 bg-surface-950/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Market Spectrum</label>
                                <div className="relative group">
                                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="niche"
                                        type="text"
                                        value={formData.niche}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3.5 bg-surface-950/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 transition-all outline-none"
                                        placeholder="e.g. Fashion, Tech"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Operational Node</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="city"
                                        type="text"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3.5 bg-surface-950/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 transition-all outline-none"
                                        placeholder="Mumbai, IN"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Base Allocation (₹)</label>
                                <div className="relative group">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="price_per_post"
                                        type="number"
                                        value={formData.price_per_post}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3.5 bg-surface-950/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 transition-all outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Channels */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-1">
                            <Globe size={12} className="text-secondary" />
                            <h4 className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Transmission Channels</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 flex items-center gap-2">
                                    <Instagram size={12} className="text-rose-400" /> Instagram Handle
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim font-bold text-sm">@</span>
                                    <input
                                        name="instagram_handle"
                                        value={formData.instagram_handle.replace('@', '')}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3.5 bg-surface-950/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 transition-all outline-none"
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 flex items-center gap-2">
                                    <Youtube size={12} className="text-red-500" /> YouTube Node ID
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim font-bold text-sm">@</span>
                                    <input
                                        name="youtube_handle"
                                        value={formData.youtube_handle.replace('@', '')}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3.5 bg-surface-950/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 transition-all outline-none"
                                        placeholder="channel_id"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Bio */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 flex items-center gap-2">
                            <FileText size={12} className="text-primary" /> Node Biography
                        </label>
                        <div className="relative group">
                            <textarea
                                name="bio"
                                rows={5}
                                value={formData.bio}
                                onChange={handleChange}
                                className="w-full px-5 py-5 rounded-[2rem] bg-surface-950/50 border border-white/5 text-sm text-white placeholder:text-text-dim focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none leading-relaxed"
                                placeholder="Describe your creative vision and reach..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/5">
                        <motion.button
                            {...MICRO_INTERACTION}
                            type="submit"
                            disabled={isSaving}
                            className="btn-primary px-10 py-4 text-base"
                        >
                            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <><Save size={18} className="mr-2" /> Sync Node</>}
                        </motion.button>
                    </div>
                </form>

                {/* Verification Layer */}
                <div className="mt-12 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-success/10 text-success border border-success/20">
                                <ShieldCheck size={18} />
                            </div>
                            <h4 className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Trust & Verification Engine</h4>
                        </div>
                        {proofs.length > 0 && (
                            <button onClick={fetchProofs} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-muted transition-all border border-white/5 cursor-pointer group">
                                <RefreshCcw size={14} className={cn(loadingProofs && "animate-spin", "group-hover:rotate-180 transition-transform duration-700")} />
                            </button>
                        )}
                    </div>

                    <div className="space-y-6">
                        {proofs.length > 0 && <VerificationStatus proofs={proofs} />}

                        {(!profile?.is_verified || proofs.length === 0 || proofs.some(p => p.status === 'Rejected')) && (
                            <div className="glass-card !rounded-[2.5rem] p-1 border-white/5 bg-white/[0.01]">
                                <VerificationUpload user={user} profile={profile} onUploadSuccess={fetchProofs} />
                            </div>
                        )}

                        {profile?.is_verified && proofs.every(p => p.status !== 'Rejected') && (
                            <div className="p-8 rounded-[2.5rem] bg-success/5 border border-success/10 flex items-center gap-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 blur-3xl rounded-full -mr-16 -mt-16" />
                                <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center text-success shrink-0 shadow-lg border border-success/20 group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={28} />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="text-lg font-display font-black text-white tracking-tight uppercase">Node Verified</h4>
                                    <p className="text-sm text-success/70 font-medium">Your transmission reach has been confirmed by our protocol.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default InfluencerProfilePage;
