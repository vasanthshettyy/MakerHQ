import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Instagram, 
  Youtube, 
  Users, 
  Star, 
  TrendingUp,
  IndianRupee,
  ShieldCheck,
  Globe,
  Zap,
  ExternalLink,
  Info
} from 'lucide-react';
import { formatFollowers, formatINR, cn } from '../../lib/utils';
import { PREMIUM_SPRING, MICRO_INTERACTION } from '../../lib/motion';

/**
 * InfluencerProfileModal
 * A detailed slide-up/fade-in modal for brands to review an influencer's public profile.
 * Uses React Portals to break out of parent stacking contexts.
 */
const InfluencerProfileModal = ({ influencer, onClose }) => {
  if (!influencer) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/95 backdrop-blur-xl cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={PREMIUM_SPRING}
          className="relative w-full max-w-2xl bg-surface-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl shadow-black/50 max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-30 p-2.5 rounded-2xl bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-all backdrop-blur-xl border border-white/10 cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Top Visual Tier */}
          <div className="h-40 bg-gradient-to-br from-primary/30 via-surface-900 to-surface-950 border-b border-white/5 relative shrink-0">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15)_0%,transparent_50%)]" />
          </div>

          <div className="px-8 sm:px-12 pb-12 -mt-16 relative z-10 flex-1 overflow-y-auto custom-scrollbar">
            {/* Profile Header Core */}
            <div className="flex flex-col items-center text-center space-y-6 mb-10">
              <div className="relative">
                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary to-secondary p-1 shadow-2xl">
                  <div className="w-full h-full rounded-[2.2rem] bg-surface-950 overflow-hidden border-4 border-surface-950 shadow-inner">
                    {influencer.avatar_url ? (
                      <img 
                        src={influencer.avatar_url} 
                        alt={influencer.full_name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/10 uppercase bg-surface-900">
                        {influencer.full_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                {influencer.is_verified && (
                  <div className="absolute -right-2 -bottom-2 p-2 bg-surface-950 rounded-2xl border border-primary/30 text-primary shadow-xl shadow-primary/20">
                    <ShieldCheck size={22} />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-display font-black text-white tracking-tighter leading-tight">
                  {influencer.full_name}
                </h2>
                <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-text-dim">
                  <span className="text-primary">{influencer.niche}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-accent" />
                    {influencer.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Matrix Data Grid */}
            <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                    { label: 'Followers', value: formatFollowers(influencer.followers_count), icon: Users, color: 'text-primary' },
                    { label: 'Engagement', value: `${influencer.engagement_rate}%`, icon: Zap, color: 'text-success' },
                    { label: 'Base Rate', value: formatINR(influencer.price_per_post).replace('₹', ''), icon: IndianRupee, color: 'text-amber-400' }
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center justify-center p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-colors">
                        <stat.icon size={18} className={cn("mb-2 opacity-60", stat.color)} />
                        <span className="text-xl font-display font-black text-white tracking-tight">{stat.value}</span>
                        <span className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* About / Intel Segment */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-2 px-1">
                 <Info size={12} className="text-primary" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Node Intelligence</h3>
              </div>
              <div className="p-6 rounded-[2rem] bg-surface-900/50 border border-white/5 shadow-inner">
                <p className="text-sm text-text-secondary leading-relaxed font-medium italic opacity-90">
                  "{influencer.bio || 'This creator node has not initialized its mission statement.'}"
                </p>
              </div>
            </div>

            {/* Channel Links */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {influencer.instagram_handle && (
                <motion.a 
                  {...MICRO_INTERACTION}
                  href={`https://instagram.com/${influencer.instagram_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-text-secondary hover:text-rose-400 hover:border-rose-400/30 transition-all group"
                >
                  <Instagram size={18} />
                  <span className="text-xs font-bold tracking-wide">@{influencer.instagram_handle}</span>
                </motion.a>
              )}
              {influencer.youtube_handle && (
                <motion.a 
                  {...MICRO_INTERACTION}
                  href={`https://youtube.com/@${influencer.youtube_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-text-secondary hover:text-red-500 hover:border-red-500/30 transition-all group"
                >
                  <Youtube size={18} />
                  <span className="text-xs font-bold tracking-wide">@{influencer.youtube_handle}</span>
                </motion.a>
              )}
              {!influencer.instagram_handle && !influencer.youtube_handle && (
                <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Transmission channels offline</p>
              )}
            </div>
            
            {/* Global CTA Integration */}
            <div className="mt-12 pt-8 border-t border-white/5">
                <motion.button
                    {...MICRO_INTERACTION}
                    onClick={onClose}
                    className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                    Acknowledge & Close
                </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default InfluencerProfileModal;
