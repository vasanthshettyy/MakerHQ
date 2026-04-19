import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Globe, FileText, MapPin, 
  Save, Loader2, CheckCircle2, AlertCircle,
  Camera, Briefcase, Info, ExternalLink,
  ShieldCheck, Sparkles
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import PageWrapper from '../../components/layout/PageWrapper';
import { STAGGER_CONTAINER, STAGGER_ITEM, MICRO_INTERACTION, PREMIUM_SPRING } from '../../lib/motion';

const BrandSettingsPage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    location: '',
    website: '',
    description: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || '',
        industry: profile.industry || '',
        location: profile.location || '',
        website: profile.website || '',
        description: profile.description || ''
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
        .from('profiles_brand')
        .update({
          company_name: formData.company_name,
          industry: formData.industry,
          location: formData.location,
          website: formData.website,
          description: formData.description,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      await refreshProfile();
      setMessage({ type: 'success', text: 'Corporate profile synchronized successfully.' });
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error('Update Error:', err);
      setMessage({ type: 'error', text: err.message || 'Synchronization failed.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageWrapper title="System Engine" subtitle="Configure your brand identity and workspace parameters.">
      <div className="max-w-4xl">
        <motion.div 
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
            {/* Left: Nav/Info */}
            <div className="lg:col-span-1 space-y-6">
                <motion.div variants={STAGGER_ITEM} className="glass-card p-6 bg-primary/5 border-primary/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/20">
                            <ShieldCheck size={18} />
                        </div>
                        <h3 className="font-display font-black text-white uppercase tracking-tight">Identity Node</h3>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed mb-6">
                        Your public profile affects how top-tier creators perceive and value your collaboration requests.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-text-dim uppercase tracking-widest bg-white/5 p-2 rounded-lg border border-white/5">
                            <CheckCircle2 size={12} className="text-success" /> Verified Organization
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-text-dim uppercase tracking-widest bg-white/5 p-2 rounded-lg border border-white/5">
                            <Sparkles size={12} className="text-primary" /> Premium Workspace
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={STAGGER_ITEM} className="p-6 rounded-[2rem] border border-white/5 bg-surface-900/40 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-[2rem] bg-surface-800 border border-white/10 flex items-center justify-center overflow-hidden mb-4 shadow-xl group cursor-pointer relative">
                            {profile?.logo_url ? (
                                <img src={profile.logo_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <Building2 size={32} className="text-text-dim" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera size={20} className="text-white" />
                            </div>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">{formData.company_name || 'Organization'}</h4>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Base Node: {formData.location || 'Global'}</p>
                    </div>
                </motion.div>
            </div>

            {/* Right: Form */}
            <motion.div variants={STAGGER_ITEM} className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="glass-card !rounded-[2.5rem] p-8 md:p-10 border-white/5 bg-surface-900/20 space-y-8">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Entity Name</label>
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                                <input
                                    name="company_name"
                                    type="text"
                                    required
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3.5 bg-surface-950/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    placeholder="Acme Org"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Industry Sector</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                                <input
                                    name="industry"
                                    type="text"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3.5 bg-surface-950/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    placeholder="e.g. Technology"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Headquarters</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                                <input
                                    name="location"
                                    type="text"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3.5 bg-surface-950/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    placeholder="Mumbai, IN"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Digital Domain</label>
                            <div className="relative group">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                                <input
                                    name="website"
                                    type="url"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3.5 bg-surface-950/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    placeholder="https://acme.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Mission Protocol</label>
                        <div className="relative group">
                            <FileText className="absolute left-4 top-4 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                            <textarea
                                name="description"
                                rows={6}
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-4 bg-surface-950/50 border border-white/5 rounded-[2rem] text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none leading-relaxed"
                                placeholder="Core brand values and campaign objectives..."
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
                            {isSaving ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    Save Protocol
                                    <Save size={18} className="ml-2" />
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default BrandSettingsPage;
