import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import PageWrapper from '../../components/layout/PageWrapper';
import UserModerationTable from '../../components/admin/UserModerationTable';
import { Users, Loader2, ShieldCheck, Database, Search, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    async function fetchUsers() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();

        // Subscribe to real-time changes on the users table
        const channel = supabase
            .channel('public-users-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'users'
                },
                () => {
                    fetchUsers();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function toggleUserStatus(userId, newStatus) {
        setMessage(null);
        try {
            const { error } = await supabase
                .from('users')
                .update({ is_active: newStatus })
                .eq('user_id', userId);

            if (error) throw error;
            
            setUsers(prev => prev.map(u => 
                u.user_id === userId ? { ...u, is_active: newStatus } : u
            ));
            setMessage({ type: 'success', text: `Node ${newStatus ? 'activated' : 'deactivated'} successfully.` });
        } catch (err) {
            console.error('Error updating user status:', err);
            setMessage({ type: 'error', text: 'Failed to update node status.' });
        } finally {
            setTimeout(() => setMessage(null), 3000);
        }
    }

    return (
        <PageWrapper title="Entity Directory" subtitle="Manage and moderate platform participants across all nodes.">
            <div className="space-y-8 pb-20">
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className={`fixed top-24 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 ${
                                message.type === 'success' 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                            }`}
                        >
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                message.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'
                            )} />
                            <p className="text-[10px] font-black uppercase tracking-widest leading-none">{message.text}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-glow">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-black text-white tracking-tight leading-none mb-1 uppercase">Platform Nodes</h2>
                            <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em]">Total Registered Entities: {users.length}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
                            <Database size={14} className="text-primary" />
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none">Sync Status: Active</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card !rounded-[2.5rem] bg-surface-900/20 border-white/5 p-1">
                    <UserModerationTable 
                        users={users} 
                        onToggleStatus={toggleUserStatus} 
                        isLoading={loading} 
                    />
                </div>
            </div>
        </PageWrapper>
    );
}
