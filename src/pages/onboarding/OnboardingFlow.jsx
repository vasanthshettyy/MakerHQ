import { useAuth } from '../../context/AuthContext';
import BrandOnboarding from '../../components/onboarding/BrandOnboarding';
import InfluencerOnboarding from '../../components/onboarding/InfluencerOnboarding';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function OnboardingFlow() {
    const { role, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">Synchronizing Profile</p>
                </motion.div>
            </div>
        );
    }

    if (profile?.onboarding_complete) {
        const dashPath = role === 'brand' ? '/brand/dashboard' : '/influencer/dashboard';
        return <Navigate to={dashPath} replace />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
        >
            {role === 'brand' && <BrandOnboarding />}
            {role === 'influencer' && <InfluencerOnboarding />}
            {!role && <Navigate to="/select-role" replace />}
        </motion.div>
    );
}
