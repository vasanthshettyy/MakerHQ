import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import StepIndicator from '../../components/onboarding/StepIndicator';
import { INDUSTRIES, INDIAN_CITIES } from '../../lib/constants';
import {
    Building2, MapPin, Briefcase, Upload, Globe, FileText,
    Loader2, ArrowRight, ArrowLeft, Check, Sparkles
} from 'lucide-react';
import { PREMIUM_SPRING, STAGGER_CONTAINER, STAGGER_ITEM, MICRO_INTERACTION } from '../../lib/motion';

const STEPS = ['Identity', 'Profile', 'Mission'];

export default function BrandOnboarding() {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [companyName, setCompanyName] = useState('');
    const [industry, setIndustry] = useState('');
    const [location, setLocation] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [website, setWebsite] = useState('');
    const [description, setDescription] = useState('');

    function handleLogoChange(e) {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    }

    function canProceed() {
        if (step === 1) return companyName.trim() && industry && location;
        if (step === 2) return logoFile || logoPreview;
        if (step === 3) return description.trim().length >= 50;
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
            let logoUrl = '';
            if (logoFile) {
                const fileExt = logoFile.name.split('.').pop();
                const filePath = `${user.id}/${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('logos')
                    .upload(filePath, logoFile, { cacheControl: '3600', upsert: true });

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('logos')
                    .getPublicUrl(filePath);
                logoUrl = publicUrl;
            }

            const { error: updateError } = await supabase
                .from('profiles_brand')
                .update({
                    company_name: companyName.trim(),
                    industry,
                    location,
                    logo_url: logoUrl,
                    website: website.trim() || null,
                    description: description.trim(),
                    onboarding_complete: true,
                })
                .eq('user_id', user.id);

            if (updateError) throw updateError;

            await refreshProfile();
            navigate('/brand/dashboard');
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-xl p-10 md:p-12 relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-4"
                    >
                        <Sparkles size={12} />
                        Brand Enrollment
                    </motion.div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">Build Your Presence</h2>
                    <p className="text-text-secondary text-sm">Tell us about your brand to start hiring elite creators.</p>
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

                <div className="min-h-[340px]">
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
                                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted ml-1">Company Name</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={e => setCompanyName(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3.5 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                            placeholder="e.g. Acme Studio"
                                        />
                                    </div>
                                </motion.div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <motion.div variants={STAGGER_ITEM} className="space-y-2">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted ml-1">Industry</label>
                                        <div className="relative group">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none" />
                                            <select
                                                value={industry}
                                                onChange={e => setIndustry(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3.5 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled className="bg-surface-800">Select Industry</option>
                                                {INDUSTRIES.map(i => <option key={i} value={i} className="bg-surface-800">{i}</option>)}
                                            </select>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={STAGGER_ITEM} className="space-y-2">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted ml-1">Base Location</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none" />
                                            <select
                                                value={location}
                                                onChange={e => setLocation(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3.5 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled className="bg-surface-800">Select City</option>
                                                {INDIAN_CITIES.map(c => <option key={c} value={c} className="bg-surface-800">{c}</option>)}
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
                                className="space-y-8"
                            >
                                <div className="flex flex-col sm:flex-row items-center gap-8 bg-white/2 p-6 rounded-[2rem] border border-white/5">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-[2rem] bg-surface-800 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-surface-700">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                            ) : (
                                                <Upload className="w-8 h-8 text-text-muted group-hover:text-primary transition-colors" />
                                            )}
                                            <input type="file" accept="image/*" onChange={handleLogoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                        {logoPreview && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                                                <Check size={12} strokeWidth={4} />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 text-center sm:text-left">
                                        <h4 className="text-lg font-bold text-white mb-2">Corporate Identity</h4>
                                        <p className="text-sm text-text-secondary leading-relaxed mb-4">
                                            Upload a high-resolution logo (min 400x400px). 
                                            This is the first thing creators see.
                                        </p>
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                                            PNG, SVG or JPG • Max 2MB
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted ml-1">Official Website</label>
                                    <div className="relative group">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="url"
                                            value={website}
                                            onChange={e => setWebsite(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3.5 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                            placeholder="https://acme.com"
                                        />
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
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">Brand Story</label>
                                        <span className={`text-[10px] font-bold ${description.length >= 50 ? 'text-success' : 'text-text-dim'}`}>
                                            {description.length} / 500
                                        </span>
                                    </div>
                                    <div className="relative group">
                                        <FileText className="absolute left-4 top-4 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                        <textarea
                                            value={description}
                                            onChange={e => setDescription(e.target.value.slice(0, 500))}
                                            rows={8}
                                            className="w-full pl-11 pr-4 py-4 bg-surface-900/50 border border-white/5 rounded-[2rem] text-sm text-white placeholder:text-text-dim focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none leading-relaxed"
                                            placeholder="Describe your brand's vision, target demographic, and what makes your products unique..."
                                        />
                                    </div>
                                    {description.length > 0 && description.length < 50 && (
                                        <motion.p 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }}
                                            className="text-[10px] font-bold text-accent uppercase tracking-widest mt-2 flex items-center gap-1"
                                        >
                                            <div className="w-1 h-1 rounded-full bg-accent animate-ping" />
                                            Needs {50 - description.length} more characters to proceed
                                        </motion.p>
                                    )}
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
                                Finalize Profile
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
