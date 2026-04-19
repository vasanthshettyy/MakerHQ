import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, Instagram, Youtube, BadgeCheck, Globe, Star, ExternalLink, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatFollowers, formatINR, cn } from '../../lib/utils';
import { MICRO_INTERACTION, PREMIUM_SPRING } from '../../lib/motion';

export default function InfluencerDetailModal({ influencer, isOpen, onClose }) {
    if (!influencer) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 40 }}
                        transition={PREMIUM_SPRING}
                        className="relative w-full max-w-4xl bg-surface-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-30 p-2.5 rounded-2xl bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-all backdrop-blur-xl border border-white/10"
                        >
                            <X size={20} />
                        </button>

                        {/* Left Section: Visual Identity */}
                        <div className="w-full lg:w-[45%] relative bg-surface-900 border-r border-white/5 overflow-hidden">
                            {influencer.avatar_url ? (
                                <img
                                    src={influencer.avatar_url}
                                    alt={influencer.full_name}
                                    className="w-full h-full object-cover lg:absolute inset-0"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-800 to-surface-950">
                                    <Users size={64} className="text-white/5" />
                                </div>
                            )}
                            
                            {/* Visual Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-transparent to-transparent opacity-80" />
                            
                            <div className="absolute bottom-8 left-8 right-8 z-10 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1.5 rounded-xl bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-xs font-black uppercase tracking-widest">
                                        {influencer.niche}
                                    </div>
                                    {influencer.is_verified && (
                                        <div className="p-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white">
                                            <ShieldCheck size={18} />
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-4xl font-display font-black text-white tracking-tighter leading-tight">
                                    {influencer.full_name}
                                </h2>
                                <div className="flex items-center gap-4 text-white/60 font-bold text-xs uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-accent" /> {influencer.city}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/20" />
                                    <span className="flex items-center gap-1.5"><Globe size={14} className="text-primary" /> {influencer.language}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Section: Intelligence & Data */}
                        <div className="w-full lg:w-[55%] p-8 lg:p-12 overflow-y-auto custom-scrollbar flex flex-col">
                            <div className="space-y-10 flex-1">
                                {/* Core Metrics */}
                                <div>
                                    <h3 className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
                                        <div className="w-1 h-3 bg-primary rounded-full" />
                                        Network Intelligence
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Network Magnitude', value: formatFollowers(influencer.followers_count), icon: Users, sub: 'Direct Connections', color: 'text-primary' },
                                            { label: 'Transmission Signal', value: `${influencer.engagement_rate}%`, icon: Zap, sub: 'Active Engagement', color: 'text-success' },
                                            { label: 'Valuation Node', value: formatINR(influencer.price_per_post), icon: Star, sub: 'Per Transmission', color: 'text-amber-400' },
                                            { label: 'Platform Origin', value: influencer.platform_primary, icon: Globe, sub: 'Primary Channel', color: 'text-secondary', capitalize: true }
                                        ].map((stat, i) => (
                                            <div key={i} className="p-5 rounded-[1.5rem] bg-white/[0.03] border border-white/5 space-y-2 group hover:border-white/10 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <stat.icon size={16} className={stat.color} />
                                                    <span className="text-[10px] font-black text-text-dim uppercase tracking-widest">{stat.label}</span>
                                                </div>
                                                <p className={cn("text-xl font-display font-black text-white", stat.capitalize && "capitalize")}>{stat.value}</p>
                                                <p className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">{stat.sub}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bio Segment */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em] flex items-center gap-2">
                                        <div className="w-1 h-3 bg-secondary rounded-full" />
                                        Node Description
                                    </h3>
                                    <div className="p-6 rounded-[2rem] bg-surface-900 border border-white/5">
                                        <p className="text-sm text-text-secondary leading-relaxed font-medium italic">
                                            "{influencer.bio || "This node has not provided a mission description."}"
                                        </p>
                                    </div>
                                </div>

                                {/* Social Handlers */}
                                <div className="space-y-4 pb-8">
                                    <h3 className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em] flex items-center gap-2">
                                        <div className="w-1 h-3 bg-accent rounded-full" />
                                        Transmission Channels
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {influencer.instagram_handle && (
                                            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
                                                <Instagram size={16} className="text-rose-400" />
                                                <span className="text-xs font-bold text-white tracking-wide">@{influencer.instagram_handle}</span>
                                            </div>
                                        )}
                                        {influencer.youtube_handle && (
                                            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
                                                <Youtube size={16} className="text-red-500" />
                                                <span className="text-xs font-bold text-white tracking-wide">@{influencer.youtube_handle}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="pt-8 border-t border-white/5 flex items-center gap-4">
                                <Link 
                                    to={`/influencer/${influencer.user_id}`}
                                    className="flex-1 btn-primary py-4 text-sm"
                                >
                                    Access Full Profile
                                    <ExternalLink size={16} className="ml-2" />
                                </Link>
                                <motion.button
                                    {...MICRO_INTERACTION}
                                    onClick={onClose}
                                    className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all cursor-pointer"
                                >
                                    Dismiss
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
