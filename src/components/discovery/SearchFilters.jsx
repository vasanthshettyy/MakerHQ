import { motion } from 'framer-motion';
import { SlidersHorizontal, BadgeCheck, X, Sparkles, MapPin, Languages as LangIcon, Target, Users } from 'lucide-react';
import { MICRO_INTERACTION, STAGGER_ITEM } from '../../lib/motion';
import { NICHES, INDIAN_CITIES, LANGUAGES, PLATFORMS, FOLLOWER_TIERS } from '../../lib/constants';

export default function SearchFilters({ 
    filters, 
    updateFilter, 
    resetFilters
}) {
    return (
        <div className="glass-card !rounded-[2rem] p-8 border-white/5 bg-surface-900/40 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                        <Target size={18} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Refinement Engine</h3>
                </div>
                <button onClick={resetFilters} className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim hover:text-primary transition-colors cursor-pointer">
                    Reset parameters
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
                {/* Niche */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 flex items-center gap-1.5">
                        <Sparkles size={10} className="text-primary" /> Core Niche
                    </label>
                    <select 
                        className="w-full bg-surface-950/50 border border-white/5 rounded-2xl py-3 px-4 text-xs text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                        value={filters.niche} 
                        onChange={e => updateFilter('niche', e.target.value)}
                    >
                        <option value="" className="bg-surface-900">Broad Spectrum</option>
                        {NICHES.map(n => <option key={n} value={n} className="bg-surface-900">{n}</option>)}
                    </select>
                </div>

                {/* City */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 flex items-center gap-1.5">
                        <MapPin size={10} className="text-accent" /> Base Node
                    </label>
                    <select 
                        className="w-full bg-surface-950/50 border border-white/5 rounded-2xl py-3 px-4 text-xs text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                        value={filters.city} 
                        onChange={e => updateFilter('city', e.target.value)}
                    >
                        <option value="" className="bg-surface-900">All Locations</option>
                        {INDIAN_CITIES.map(c => <option key={c} value={c} className="bg-surface-900">{c}</option>)}
                    </select>
                </div>

                {/* Language */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 flex items-center gap-1.5">
                        <LangIcon size={10} className="text-primary" /> Dialect
                    </label>
                    <select 
                        className="w-full bg-surface-950/50 border border-white/5 rounded-2xl py-3 px-4 text-xs text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                        value={filters.language} 
                        onChange={e => updateFilter('language', e.target.value)}
                    >
                        <option value="" className="bg-surface-900">Any Language</option>
                        {LANGUAGES.map(l => <option key={l} value={l} className="bg-surface-900">{l}</option>)}
                    </select>
                </div>

                {/* Platform */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 flex items-center gap-1.5">
                        <Target size={10} className="text-secondary" /> Transmission
                    </label>
                    <select 
                        className="w-full bg-surface-950/50 border border-white/5 rounded-2xl py-3 px-4 text-xs text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                        value={filters.platform} 
                        onChange={e => updateFilter('platform', e.target.value)}
                    >
                        <option value="" className="bg-surface-900">All Platforms</option>
                        {PLATFORMS.map(p => <option key={p} value={p} className="bg-surface-900">{p}</option>)}
                    </select>
                </div>

                {/* Followers */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 flex items-center gap-1.5">
                        <Users size={10} className="text-primary" /> Reach Tier
                    </label>
                    <select 
                        className="w-full bg-surface-950/50 border border-white/5 rounded-2xl py-3 px-4 text-xs text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                        value={`${filters.minFollowers}-${filters.maxFollowers}`}
                        onChange={e => {
                            const [min, max] = e.target.value.split('-').map(Number);
                            updateFilter('minFollowers', min);
                            setTimeout(() => updateFilter('maxFollowers', max), 0);
                        }}>
                        <option value="0-0" className="bg-surface-900">Any Magnitude</option>
                        {Object.values(FOLLOWER_TIERS).map(t => (
                            <option key={t.label} value={`${t.min}-${t.max}`} className="bg-surface-900">{t.label}</option>
                        ))}
                    </select>
                </div>

                {/* Verified Toggle */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Trust Validation</label>
                    <button
                        onClick={() => updateFilter('verifiedOnly', !filters.verifiedOnly)}
                        className={`flex items-center justify-between w-full py-3 px-4 rounded-2xl border transition-all cursor-pointer ${
                            filters.verifiedOnly 
                            ? 'bg-primary/20 border-primary/30 text-primary shadow-glow' 
                            : 'bg-surface-950/50 border-white/5 text-text-dim hover:border-white/20'
                        }`}
                    >
                        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                            <BadgeCheck size={14} className={filters.verifiedOnly ? 'text-primary' : 'text-text-dim'} />
                            Verified Only
                        </span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${filters.verifiedOnly ? 'bg-primary' : 'bg-white/10'}`}>
                            <motion.div 
                                animate={{ x: filters.verifiedOnly ? 16 : 2 }}
                                className="absolute top-1 w-2 h-2 rounded-full bg-white shadow-sm" 
                            />
                        </div>
                    </button>
                </div>

                {/* Budget Range */}
                <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Capital Range (₹)</label>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-dim group-focus-within:text-primary transition-colors">MIN</span>
                            <input 
                                type="number"
                                placeholder="0"
                                value={filters.minPrice || ''}
                                onChange={e => updateFilter('minPrice', Number(e.target.value))}
                                className="w-full bg-surface-950/50 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                            />
                        </div>
                        <div className="flex-1 relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-dim group-focus-within:text-primary transition-colors">MAX</span>
                            <input 
                                type="number"
                                placeholder="∞"
                                value={filters.maxPrice || ''}
                                onChange={e => updateFilter('maxPrice', Number(e.target.value))}
                                className="w-full bg-surface-950/50 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
