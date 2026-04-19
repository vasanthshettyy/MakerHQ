import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  ShieldOff, 
  Search, 
  Loader2, 
  User, 
  Mail, 
  Calendar,
  MoreVertical,
  Zap,
  Building2,
  Users,
  Target
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MICRO_INTERACTION, PREMIUM_SPRING } from '../../lib/motion';

const UserModerationTable = ({ users = [], onToggleStatus, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleToggle = async (userId, newStatus) => {
    setProcessingId(userId);
    try {
      await onToggleStatus(userId, newStatus);
    } finally {
      setProcessingId(null);
    }
  };

  const RoleBadge = ({ role }) => {
    const isBrand = role === 'brand';
    return (
      <div className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border transition-all shadow-sm",
        isBrand 
          ? "bg-primary/10 border-primary/20 text-primary" 
          : "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400"
      )}>
        {isBrand ? <Building2 size={10} /> : <Users size={10} />}
        {role}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Refined Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white/[0.01]">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search nodes by identity hash or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-surface-950/50 border border-white/5 rounded-2xl text-sm text-white placeholder:text-text-dim outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all backdrop-blur-md"
          />
        </div>
        <div className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          Scan Results: {filteredUsers.length} Nodes Identified
        </div>
      </div>

      {/* Modern Data Table */}
      <div className="data-table-container !rounded-none !border-0 !shadow-none bg-transparent">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse data-table">
            <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-5">Node Identity</th>
                <th className="px-8 py-5">Protocol Role</th>
                <th className="px-8 py-5">Initialization Date</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Intervention</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {isLoading ? (
                [...Array(6)].map((_, i) => (
                    <tr key={i} className="animate-pulse opacity-40">
                        <td colSpan={5} className="px-8 py-10">
                            <div className="h-4 bg-white/5 rounded-full w-full" />
                        </td>
                    </tr>
                ))
                ) : filteredUsers.length === 0 ? (
                <tr>
                    <td colSpan={5} className="px-8 py-32 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-20">
                            <Target size={48} strokeWidth={1} />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Zero Signals Identified</p>
                        </div>
                    </td>
                </tr>
                ) : (
                filteredUsers.map((user) => (
                    <tr 
                    key={user.user_id} 
                    className={cn(
                        "group transition-all hover:bg-white/[0.02]",
                        !user.is_active && "opacity-60 bg-rose-500/[0.02]"
                    )}
                    >
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-surface-900 border border-white/5 text-text-dim group-hover:text-primary group-hover:border-primary/20 transition-all shadow-inner">
                            <User size={18} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">
                                {user.email}
                            </span>
                            <span className="text-[9px] text-text-dim font-black uppercase tracking-widest mt-0.5">
                                Node ID: {user.user_id.split('-')[0]}...{user.user_id.slice(-4)}
                            </span>
                        </div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <RoleBadge role={user.role} />
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-text-secondary text-xs font-medium">
                        <Calendar size={14} className="text-text-dim" />
                        {new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            user.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" : "bg-rose-500"
                        )} />
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            user.is_active ? "text-emerald-400" : "text-rose-400"
                        )}>
                            {user.is_active ? 'Active Node' : 'Banned Node'}
                        </span>
                        </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                        <motion.button
                        {...MICRO_INTERACTION}
                        onClick={() => handleToggle(user.user_id, !user.is_active)}
                        disabled={processingId === user.user_id}
                        className={cn(
                            "inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg disabled:opacity-50",
                            user.is_active 
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white" 
                            : "bg-emerald-500 text-black shadow-emerald-500/20"
                        )}
                        >
                        {processingId === user.user_id ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : user.is_active ? (
                            <ShieldOff size={14} />
                        ) : (
                            <Shield size={14} />
                        )}
                        {user.is_active ? 'Deactivate' : 'Reactivate'}
                        </motion.button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default UserModerationTable;
