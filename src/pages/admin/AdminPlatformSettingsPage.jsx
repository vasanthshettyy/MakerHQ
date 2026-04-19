import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Save, Loader2, CheckCircle2, ShieldCheck, 
    MessageSquare, BadgePercent, LayoutGrid, 
    Cpu, Zap, Info, ShieldAlert, Database,
    Lock, Globe, BellRing
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { usePlatformSettings } from '../../hooks/usePlatformSettings';
import PageWrapper from '../../components/layout/PageWrapper';
import { cn } from '../../lib/utils';
import { STAGGER_CONTAINER, STAGGER_ITEM, MICRO_INTERACTION, PREMIUM_SPRING } from '../../lib/motion';

export default function AdminPlatformSettingsPage() {
    const { settings: initialSettings, loading: loadingInitial } = usePlatformSettings();
    const [settings, setSettings] = useState(null);
    const [saving, setSaving] = useState({});
    const [savedFeedback, setSavedFeedback] = useState({});

    useEffect(() => {
        if (initialSettings) {
            setSettings({
                commission_rate: initialSettings.commissionRate,
                max_gigs_per_brand_free: initialSettings.maxGigsPerBrandFree,
                enable_escrow: initialSettings.enableEscrow,
                enable_chat: initialSettings.enableChat
            });
        }
    }, [initialSettings]);

    const handleUpdate = async (key, value) => {
        if (settings[key] === value && typeof value !== 'boolean') return;
        setSaving(prev => ({ ...prev, [key]: true }));
        try {
            const { error } = await supabase.from('platform_settings').upsert({ key, value }, { onConflict: 'key' });
            if (error) throw error;
            setSettings(prev => ({ ...prev, [key]: value }));
            setSavedFeedback(prev => ({ ...prev, [key]: true }));
            setTimeout(() => setSavedFeedback(prev => ({ ...prev, [key]: false })), 2000);
        } catch (err) {
            console.error(`Failed to update ${key}:`, err);
        } finally {
            setSaving(prev => ({ ...prev, [key]: false }));
        }
    };

    if (loadingInitial || !settings) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 opacity-40">
                <Loader2 size={32} className="text-primary animate-spin shadow-glow" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim">Accessing Engine Core...</p>
            </div>
        );
    }

    return (
        <PageWrapper title="Engine Parameters" subtitle="Configure global platform heuristics and operational protocols.">
            <motion.div 
                variants={STAGGER_CONTAINER}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20"
            >
                {/* Left: Intelligence Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div variants={STAGGER_ITEM} className="glass-card p-6 bg-primary/5 border-primary/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/20 shadow-glow">
                                <Cpu size={18} />
                            </div>
                            <h3 className="font-display font-black text-white uppercase tracking-tight">Core Logic</h3>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed mb-6">
                            Adjusting these parameters will propagate across the entire network in real-time. Verify impact before commitment.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[9px] font-black text-text-dim uppercase tracking-widest bg-white/5 p-2.5 rounded-xl border border-white/5">
                                <Database size={12} className="text-primary" /> Persistent Registry
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-black text-text-dim uppercase tracking-widest bg-white/5 p-2.5 rounded-xl border border-white/5">
                                <ShieldCheck size={12} className="text-success" /> Logic Validated
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={STAGGER_ITEM} className="p-6 rounded-[2rem] border border-rose-500/10 bg-rose-500/5 relative overflow-hidden group">
                        <ShieldAlert size={20} className="text-rose-400 mb-3 opacity-60" />
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Impact Protocol</h4>
                        <p className="text-[10px] text-rose-300/60 leading-relaxed font-medium italic">"Changes to commission logic will only apply to new contract nodes initialized after synchronization."</p>
                    </motion.div>
                </div>

                {/* Right: Configuration Matrix */}
                <div className="lg:col-span-2 space-y-10">
                    <motion.div variants={STAGGER_ITEM} className="glass-card !rounded-[2.5rem] p-8 md:p-10 border-white/5 bg-surface-900/20 space-y-10">
                        {/* Section: Economic Tiers */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-2 px-1">
                                <Info size={12} className="text-primary" />
                                <h4 className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Financial Logic</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 flex items-center gap-2">
                                            <BadgePercent size={14} className="text-primary" /> Commission (%)
                                        </label>
                                        <Feedback saved={savedFeedback.commission_rate} saving={saving.commission_rate} />
                                    </div>
                                    <div className="relative group">
                                        <input 
                                            type="number" 
                                            className="w-full bg-surface-950/50 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-primary/50 transition-all outline-none"
                                            value={settings.commission_rate}
                                            onChange={(e) => setSettings(prev => ({ ...prev, commission_rate: e.target.value }))}
                                            onBlur={(e) => handleUpdate('commission_rate', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <p className="text-[9px] text-text-dim font-bold uppercase tracking-widest ml-1">Platform yield per transaction</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 flex items-center gap-2">
                                            <LayoutGrid size={14} className="text-secondary" /> Free Node Limit
                                        </label>
                                        <Feedback saved={savedFeedback.max_gigs_per_brand_free} saving={saving.max_gigs_per_brand_free} />
                                    </div>
                                    <div className="relative group">
                                        <input 
                                            type="number" 
                                            className="w-full bg-surface-950/50 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-secondary/50 transition-all outline-none"
                                            value={settings.max_gigs_per_brand_free}
                                            onChange={(e) => setSettings(prev => ({ ...prev, max_gigs_per_brand_free: e.target.value }))}
                                            onBlur={(e) => handleUpdate('max_gigs_per_brand_free', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <p className="text-[9px] text-text-dim font-bold uppercase tracking-widest ml-1">Max open channels (Unpaid brands)</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/5" />

                        {/* Section: Operational Gates */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-2 px-1">
                                <Zap size={12} className="text-secondary" />
                                <h4 className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Kill Switches</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <ToggleField 
                                    label="Security Escrow" 
                                    icon={<Lock className="w-3.5 h-3.5 text-emerald-400" />}
                                    description="Enforce capital locking before milestone synchronization."
                                    value={settings.enable_escrow}
                                    onChange={(val) => handleUpdate('enable_escrow', val)}
                                    saved={savedFeedback.enable_escrow}
                                    saving={saving.enable_escrow}
                                />
                                <ToggleField 
                                    label="Network Comms" 
                                    icon={<MessageSquare className="w-3.5 h-3.5 text-blue-400" />}
                                    description="Global signal relay for inter-node messaging."
                                    value={settings.enable_chat}
                                    onChange={(val) => handleUpdate('enable_chat', val)}
                                    saved={savedFeedback.enable_chat}
                                    saving={saving.enable_chat}
                                />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex items-center justify-center gap-2 opacity-20">
                            <ShieldCheck size={12} className="text-primary" />
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-text-muted">Encrypted Sync Interface</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </PageWrapper>
    );
}

function ToggleField({ label, icon, description, value, onChange, saved, saving }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
                </div>
                <Feedback saved={saved} saving={saving} />
            </div>
            <button 
                onClick={() => onChange(!value)}
                className={cn(
                    "w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 cursor-pointer shadow-lg",
                    value 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : "bg-white/5 border-white/10 text-text-muted hover:border-white/20"
                )}
            >
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{value ? 'Operational' : 'Deactivated'}</span>
                <div className={cn(
                    "w-11 h-6 rounded-full relative transition-colors duration-500",
                    value ? "bg-emerald-500" : "bg-surface-800"
                )}>
                    <motion.div 
                        animate={{ x: value ? 22 : 2 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-2xl" 
                    />
                </div>
            </button>
            <p className="text-[10px] text-text-dim font-medium leading-relaxed italic">"{description}"</p>
        </div>
    );
}

function Feedback({ saved, saving }) {
    return (
        <div className="min-w-[70px] flex justify-end">
            <AnimatePresence mode="wait">
                {saving ? (
                    <motion.div 
                        key="saving"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 text-text-muted"
                    >
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Sync</span>
                    </motion.div>
                ) : saved ? (
                    <motion.div 
                        key="saved"
                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                        className="flex items-center gap-1 text-emerald-400"
                    >
                        <CheckCircle2 className="w-3 h-3 shadow-glow shadow-emerald-500/20" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Locked</span>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
