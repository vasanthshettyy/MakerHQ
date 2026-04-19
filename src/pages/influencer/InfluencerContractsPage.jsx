import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContracts } from '../../hooks/useContracts';
import PageWrapper from '../../components/layout/PageWrapper';
import ContractCard from '../../components/contracts/ContractCard';
import { FileText, Inbox, Sparkles, Workflow } from 'lucide-react';
import { STAGGER_CONTAINER, STAGGER_ITEM, PREMIUM_SPRING } from '../../lib/motion';

export default function InfluencerContractsPage() {
    const { contractId } = useParams();
    const { contracts, loading, submitMilestone } = useContracts();

    useEffect(() => {
        if (!loading && contractId) {
            const element = document.getElementById(contractId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [loading, contractId]);

    return (
        <PageWrapper title="Execution Matrix" subtitle="Monitor active campaign nodes and deployment milestones.">
            {loading ? (
                <div className="space-y-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="glass-card !rounded-[2rem] h-40 animate-pulse bg-white/[0.02] border-white/5" />
                    ))}
                </div>
            ) : contracts.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card !rounded-[3rem] p-24 text-center border-dashed border-white/10 bg-white/[0.01]"
                >
                    <div className="relative w-20 h-20 mx-auto mb-8">
                        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
                        <div className="w-20 h-20 rounded-3xl bg-surface-900 border border-white/5 flex items-center justify-center text-text-dim relative z-10">
                            <Workflow size={32} strokeWidth={1} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-display font-black text-white mb-3 tracking-tight">Zero Active Flows</h3>
                    <p className="text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                        No active contract frameworks identified. When a brand accept your proposal, your execution nodes will appear here.
                    </p>
                </motion.div>
            ) : (
                <motion.div 
                    variants={STAGGER_CONTAINER}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                >
                    {contracts.map(contract => (
                        <motion.div key={contract.id} variants={STAGGER_ITEM}>
                            <ContractCard
                                contract={contract}
                                onSubmitMilestone={submitMilestone}
                                isBrand={false}
                                highlight={contract.id === contractId}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </PageWrapper>
    );
}
