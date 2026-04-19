import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, IndianRupee, Instagram, Youtube, Save, 
  Loader2, CheckCircle2, AlertCircle, FileText, Target,
  ShieldCheck, Info, Globe, Zap, Settings, ShieldAlert,
  Smartphone, Lock, BellRing, Database
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import PageWrapper from '../../components/layout/PageWrapper';
import { STAGGER_CONTAINER, STAGGER_ITEM, MICRO_INTERACTION, PREMIUM_SPRING } from '../../lib/motion';

const InfluencerSettingsPage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
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
    }
  }, [profile]);

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
      setMessage({ type: 'success', text: 'Operational parameters synchronized.' });
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error('Update Error:', err);
      setMessage({ type: 'error', text: err.message || 'Synchronization failed.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageWrapper title="System Engine" subtitle="Maintain your node's operational integrity and security protocols.">
      <div className="max-w-4xl">
        <motion.div 
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
            {/* Sidebar: Nav & Critical Alerts */}
            <div className="lg:col-span-1 space-y-6">
                <motion.div variants={STAGGER_ITEM} className="glass-card p-6 bg-primary/5 border-primary/10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim mb-6 px-1">Engine Control</h3>
                    <nav className="space-y-2">
                        {[
                            { label: 'Core Identity', icon: User, active: true },
                            { label: 'Secure Access', icon: Lock, active: false },
                            { label: 'Transmission', icon: BellRing, active: false },
                            { label: 'Node Sync', icon: Database, active: false }
                        ].map((item) => (
                            <button key={item.label} className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all",
                                item.active ? "bg-primary/20 text-primary border border-primary/20 shadow-glow" : "text-text-muted hover:text-white hover:bg-white/5"
                            )}>
                                <item.icon size={14} strokeWidth={item.active ? 2.5 : 2} />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </motion.div>

                <motion.div variants={STAGGER_ITEM} className="p-6 rounded-[2rem] border border-rose-500/10 bg-rose-500/5 relative overflow-hidden group">
                    <ShieldAlert size={20} className="text-rose-400 mb-3 opacity-60 group-hover:scale-110 transition-transform" />
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Hazard Protocol</h4>
                    <p className="text-[10px] text-rose-300/60 leading-relaxed font-medium">Any changes to identity nodes require manual validation by the system core.</p>
                </motion.div>
            </div>

            {/* Main Configuration Matrix */}
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

                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-1">
                            <Smartphone size={12} className="text-primary" />
                            <h4 className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Operational Metadata</h4>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Identity Identifier</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="full_name"
                                        type="text"
                                        required
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3.5 bg-surface-950/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 transition-all outline-none"
                                        placeholder="Creator Node Name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Market Logic</label>
                                    <input
                                        name="niche"
                                        type="text"
                                        value={formData.niche}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-surface-950/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 transition-all outline-none"
                                        placeholder="e.g. Lifestyle"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Node Origin</label>
                                    <input
                                        name="city"
                                        type="text"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-surface-950/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 transition-all outline-none"
                                        placeholder="Mumbai, IN"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/5">
                        <motion.button
                            {...MICRO_INTERACTION}
                            type="submit"
                            disabled={isSaving}
                            className="btn-primary px-10 py-4 text-base"
                        >
                            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <><Save size={18} className="mr-2" /> Sync Engine</>}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default InfluencerSettingsPage;
