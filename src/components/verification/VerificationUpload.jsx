import { useState } from 'react';
import { Upload, CheckCircle, Loader2, AlertCircle, X, Image as ImageIcon, Send, Zap, ShieldCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import { MICRO_INTERACTION, PREMIUM_SPRING } from '../../lib/motion';

export default function VerificationUpload({ user, profile, onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [ocrStatus, setOcrStatus] = useState('idle'); // 'idle' | 'scanning' | 'success' | 'failed' | 'submitted'
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [manualFollowers, setManualFollowers] = useState('');
    const [extractedData, setExtractedData] = useState({
        followers: null,
        platform: null,
        handle: null
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setOcrStatus('idle');
            setError(null);
            setExtractedData({ followers: null, platform: null, handle: null });
            setManualFollowers('');
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setPreviewUrl(null);
        setOcrStatus('idle');
        setError(null);
        setExtractedData({ followers: null, platform: null, handle: null });
        setManualFollowers('');
    };

    const compressImageForUpload = async (fileUpload) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(fileUpload);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1024;
                let width = img.width;
                let height = img.height;
                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
        });
    };

    const handleScan = async () => {
        if (!file) return;
        setOcrStatus('scanning');
        setError(null);
        try {
            const base64Image = await compressImageForUpload(file);
            const { data, error: funcError } = await supabase.functions.invoke('verify-image', {
                body: { image: base64Image }
            });
            if (funcError) throw funcError;

            const threshold = data?.threshold || 0.85;
            if (data && data.confidence >= threshold && data.followers_count) {
                setExtractedData({
                    followers: data.followers_count,
                    platform: data.platform || 'Social Media'
                });
                setOcrStatus('success');
            } else {
                setOcrStatus('failed');
                setError(data?.error || "Low confidence signal. Falling back to manual audit.");
            }
        } catch (err) {
            console.error("Scan Error:", err);
            setOcrStatus('failed');
            setError(err.message || "Transmission interrupted.");
        }
    };

    const handleSubmit = async () => {
        const finalFollowers = extractedData.followers || parseInt(manualFollowers);
        if (!file || !finalFollowers) return;

        setIsSubmitting(true);
        try {
            const fileName = `${user.id}/${Date.now()}.png`;
            const { error: uploadError } = await supabase.storage.from('verification-proofs').upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('verification-proofs').getPublicUrl(fileName);
            const isAutoApproved = !!extractedData.followers;
            
            const { error: dbError } = await supabase.from('verification_proofs').insert({
                influencer_id: user.id,
                proof_url: publicUrl,
                platform: extractedData.platform || 'Unknown',
                status: isAutoApproved ? 'Approved' : 'Pending',
                admin_notes: isAutoApproved ? `Auto-verified. Reach: ${extractedData.followers}` : `Manual audit required.`
            });
            if (dbError) throw dbError;

            if (isAutoApproved) {
                await supabase.from('profiles_influencer').update({
                    is_verified: true,
                    followers_count: finalFollowers
                }).eq('user_id', user.id);
            }

            setOcrStatus('submitted');
            if (onUploadSuccess) onUploadSuccess();
            setTimeout(handleRemoveFile, 3000);
        } catch (err) {
            setOcrStatus('failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card !rounded-[2.5rem] p-8 md:p-10 border-white/10 bg-surface-900/20 relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-transparent opacity-50" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-glow">
                            <ShieldCheck size={20} />
                        </div>
                        <h2 className="text-xl font-display font-black text-white tracking-tight leading-none uppercase">Trust Node Activation</h2>
                    </div>
                    <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em] ml-1">Evidence Required: Audience Magnitude</p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
                    <Info size={14} className="text-primary" />
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest leading-none">High Confidence OCR v1.0</span>
                </div>
            </div>

            <div className="relative group">
                {!previewUrl ? (
                    <label className={cn(
                        "flex flex-col items-center justify-center w-full h-72 rounded-[2.5rem] border-2 border-dashed transition-all cursor-pointer",
                        "border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/40 group/label"
                    )}>
                        <div className="flex flex-col items-center justify-center text-center px-10">
                            <div className="p-5 rounded-[2rem] bg-surface-800 text-text-muted mb-6 group-hover/label:scale-110 group-hover/label:text-primary transition-all duration-500 shadow-xl border border-white/5">
                                <Upload size={32} strokeWidth={1.5} />
                            </div>
                            <p className="mb-2 text-base text-white font-bold tracking-tight">Drop analytics screenshot here</p>
                            <p className="text-[10px] text-text-dim uppercase tracking-widest font-black opacity-60">PNG, JPG or WEBP • MAX 5MB</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                ) : (
                    <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 aspect-video bg-black/40 group shadow-2xl">
                        <img src={previewUrl} alt="" className="w-full h-full object-contain" />
                        {!isSubmitting && (
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <motion.button
                                    {...MICRO_INTERACTION}
                                    onClick={handleRemoveFile}
                                    className="p-4 rounded-3xl bg-rose-500 text-white shadow-2xl cursor-pointer"
                                >
                                    <X size={24} strokeWidth={3} />
                                </motion.button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-8 space-y-6">
                <AnimatePresence mode="wait">
                    {ocrStatus === 'scanning' && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-4">
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            <div>
                                <p className="text-xs font-black text-white uppercase tracking-[0.15em]">Analyzing Transmission Evidence</p>
                                <p className="text-[10px] text-text-muted mt-0.5 font-medium">Detecting node handle and connectivity magnitude...</p>
                            </div>
                        </motion.div>
                    )}

                    {ocrStatus === 'success' && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
                            <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 relative z-10" />
                            <div className="relative z-10">
                                <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.15em]">High Confidence Signal Detected</p>
                                <p className="text-[10px] text-emerald-400/70 mt-0.5 font-black uppercase tracking-widest">
                                    Magnitude: {extractedData.followers.toLocaleString()} Node Units
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {ocrStatus === 'failed' && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 rounded-[2rem] bg-rose-500/5 border border-rose-500/20 space-y-5">
                            <div className="flex items-center gap-4">
                                <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
                                <div>
                                    <p className="text-xs font-black text-rose-400 uppercase tracking-[0.15em]">Signal Low Confidence</p>
                                    <p className="text-[10px] text-rose-400/60 font-medium">{error || "The evidence was insufficient for auto-verification."}</p>
                                </div>
                            </div>
                            <div className="pl-10 space-y-2">
                                <label className="text-[10px] text-text-muted uppercase tracking-widest font-black">Manual Magnitude Input:</label>
                                <input
                                    type="number"
                                    placeholder="Enter follower count"
                                    value={manualFollowers}
                                    onChange={(e) => setManualFollowers(e.target.value)}
                                    className="w-full bg-surface-950/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                />
                                <p className="text-[9px] text-rose-400/40 font-bold uppercase tracking-widest">Falling back to manual audit protocol.</p>
                            </div>
                        </motion.div>
                    )}

                    {ocrStatus === 'submitted' && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-10 text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-glow">
                                <Send size={32} />
                            </div>
                            <h3 className="text-lg font-display font-black text-white tracking-tight uppercase">Protocol Logged</h3>
                            <p className="text-xs text-text-muted font-medium">Your evidence has been transmitted to the audit stream.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col gap-4">
                    {ocrStatus === 'success' ? (
                        <div className="flex gap-4">
                            <motion.button {...MICRO_INTERACTION} onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all cursor-pointer">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Execute Sync'}
                            </motion.button>
                            <motion.button {...MICRO_INTERACTION} onClick={() => setOcrStatus('failed')} disabled={isSubmitting} className="px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] cursor-pointer">
                                <X size={18} />
                            </motion.button>
                        </div>
                    ) : (ocrStatus === 'failed' && manualFollowers) ? (
                        <motion.button {...MICRO_INTERACTION} onClick={handleSubmit} disabled={isSubmitting} className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl cursor-pointer">
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Initialize Manual Audit'}
                        </motion.button>
                    ) : ocrStatus !== 'submitted' && (
                        <motion.button
                            {...MICRO_INTERACTION}
                            onClick={handleScan}
                            disabled={!file || ocrStatus === 'scanning'}
                            className={cn(
                                "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-2xl",
                                file && ocrStatus !== 'scanning'
                                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-primary/20"
                                    : "bg-white/5 text-text-muted border border-white/5 opacity-50 cursor-not-allowed"
                            )}
                        >
                            {ocrStatus === 'scanning' ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap size={18} fill="currentColor" /> Initialize Scan</>}
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
