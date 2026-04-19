import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, SlidersHorizontal, Search as SearchIcon, X } from 'lucide-react';
import { useDiscovery } from '../../hooks/useDiscovery';
import { MICRO_INTERACTION, PREMIUM_SPRING, STAGGER_CONTAINER, STAGGER_ITEM } from '../../lib/motion';
import PageWrapper from '../../components/layout/PageWrapper';

import SearchFilters from '../../components/discovery/SearchFilters';
import InfluencerGrid from '../../components/discovery/InfluencerGrid';
import InfluencerDetailModal from '../../components/discovery/InfluencerDetailModal';

export default function DiscoverPage() {
    const { 
        influencers, 
        loading, 
        totalCount, 
        totalPages, 
        filters, 
        updateFilter, 
        resetFilters, 
        setPage 
    } = useDiscovery();

    const [showFilters, setShowFilters] = useState(false);
    const [selectedInfluencer, setSelectedInfluencer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = (influencer) => {
        setSelectedInfluencer(influencer);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedInfluencer(null), 300);
    };

    return (
        <PageWrapper 
            title="Intelligence Hub" 
            subtitle={`Scanning ${totalCount} optimized creator nodes for your criteria.`}
        >
            <div className="space-y-8">
                {/* Search Bar & Primary Actions */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative group w-full">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            value={filters.search}
                            onChange={e => updateFilter('search', e.target.value)}
                            placeholder="Identify talent by niche, name, or mission..."
                            className="w-full pl-12 pr-4 py-4 bg-surface-900/50 border border-white/5 rounded-2xl text-sm text-white placeholder:text-text-dim focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none backdrop-blur-xl"
                        />
                        {filters.search && (
                            <button 
                                onClick={() => updateFilter('search', '')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    
                    <motion.button
                        {...MICRO_INTERACTION}
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest border transition-all cursor-pointer w-full md:w-auto ${
                            showFilters 
                                ? 'border-primary bg-primary/20 text-primary shadow-glow' 
                                : 'border-white/5 bg-white/5 text-text-muted hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <SlidersHorizontal size={16} />
                        Filter Engine
                    </motion.button>
                </div>

                {/* Expanded Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -20 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -20 }}
                            transition={PREMIUM_SPRING}
                            className="overflow-hidden"
                        >
                            <SearchFilters 
                                filters={filters}
                                updateFilter={updateFilter}
                                resetFilters={resetFilters}
                                showFilters={showFilters}
                                setShowFilters={setShowFilters}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Area */}
                <div className="relative min-h-[400px]">
                    <InfluencerGrid 
                        influencers={influencers}
                        loading={loading}
                        onCardClick={handleCardClick}
                    />
                </div>

                {/* Premium Pagination */}
                {!loading && totalPages > 1 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between mt-12 pb-12 pt-8 border-t border-white/5"
                    >
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">Viewing page</span>
                            <div className="px-3 py-1 rounded-lg bg-surface-900 border border-white/10 text-white font-bold text-xs">{filters.page}</div>
                            <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">of {totalPages} nodes</span>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <motion.button
                                {...MICRO_INTERACTION}
                                onClick={() => setPage(filters.page - 1)} 
                                disabled={filters.page <= 1}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all text-xs font-black uppercase tracking-widest text-white cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </motion.button>

                            <motion.button
                                {...MICRO_INTERACTION}
                                onClick={() => setPage(filters.page + 1)} 
                                disabled={filters.page >= totalPages}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all text-xs font-black uppercase tracking-widest cursor-pointer shadow-lg shadow-primary/20"
                            >
                                Next Segment
                                <ChevronRight className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </div>

            <InfluencerDetailModal 
                influencer={selectedInfluencer}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </PageWrapper>
    );
}
