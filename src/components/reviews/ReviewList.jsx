import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Inbox, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ReviewCard from './ReviewCard';
import { STAGGER_CONTAINER, STAGGER_ITEM } from '../../lib/motion';

export default function ReviewList({ targetId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReviews() {
            if (!targetId) return;
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('reviews')
                    .select(`
                        *,
                        profiles_brand:reviewer_id (company_name, logo_url),
                        profiles_influencer:reviewer_id (full_name, avatar_url)
                    `)
                    .eq('target_id', targetId)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setReviews(data || []);
            } catch (err) {
                console.error('Error fetching reviews:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchReviews();
    }, [targetId]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card !rounded-[2rem] h-32 animate-pulse bg-white/[0.02] border-white/5" />
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-8 glass-card !rounded-[2.5rem] border-dashed border-white/10 bg-white/[0.01]">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
                    <div className="w-16 h-16 rounded-2xl bg-surface-900 border border-white/5 flex items-center justify-center text-text-dim relative z-10">
                        <Inbox size={32} strokeWidth={1} />
                    </div>
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">Zero Signals</h3>
                <p className="text-xs text-text-muted text-center max-w-[220px] leading-relaxed font-medium">
                    This node has not yet established a feedback resonance from campaign transactions.
                </p>
            </div>
        );
    }

    return (
        <motion.div 
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="show"
            className="space-y-4"
        >
            {reviews.map((review) => (
                <motion.div key={review.id} variants={STAGGER_ITEM}>
                    <ReviewCard review={review} />
                </motion.div>
            ))}
            
            <div className="pt-6 flex items-center justify-center gap-2 opacity-30">
                <ShieldCheck size={12} className="text-primary" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted">Encrypted Ledger</span>
            </div>
        </motion.div>
    );
}
