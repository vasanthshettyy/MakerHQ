import React from 'react';
import { 
  Users, 
  Briefcase, 
  FileSignature, 
  AlertTriangle,
  ArrowUpRight,
  Zap,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { STAGGER_CONTAINER, STAGGER_ITEM, MICRO_INTERACTION } from '../../lib/motion';

const StatCard = ({ label, value, icon: Icon, colorClass, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass-card !rounded-2xl h-32 p-6 animate-pulse bg-white/[0.02] border-white/5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="h-3 w-20 bg-white/5 rounded" />
          <div className="h-8 w-8 bg-white/5 rounded-lg" />
        </div>
        <div className="h-6 w-16 bg-white/5 rounded" />
      </div>
    );
  }

  return (
    <motion.div 
      variants={STAGGER_ITEM}
      {...MICRO_INTERACTION}
      className="relative group overflow-hidden glass-card !rounded-2xl p-6 border-white/5 bg-surface-900/40 transition-all hover:border-primary/30"
    >
      {/* Dynamic Glow */}
      <div className={cn(
        "absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
        colorClass
      )} />
      
      <div className="flex justify-between items-start relative z-10 mb-4">
        <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">
          {label}
        </p>
        <div className={cn(
            "p-2 rounded-xl border transition-colors",
            colorClass.replace('bg-', 'bg-').replace('-500', '-500/10').replace('primary', 'primary/10'),
            colorClass.replace('bg-', 'text-').replace('-500', '-400')
        )}>
          <Icon size={16} />
        </div>
      </div>
      
      <div className="relative z-10 flex items-baseline gap-2">
        <h3 className="text-2xl font-display font-black text-white tracking-tight">
          {value?.toLocaleString() || '0'}
        </h3>
        <span className="text-[9px] font-bold text-success uppercase tracking-widest">+2.4%</span>
      </div>
      
      <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
          <ArrowUpRight size={14} className="text-text-dim" />
      </div>
    </motion.div>
  );
};

const AdminStatsBanner = ({ stats, isLoading }) => {
  const statConfigs = [
    {
      label: "Total Node Reach",
      value: stats?.totalUsers,
      icon: Users,
      colorClass: "bg-primary"
    },
    {
      label: "Open Channels",
      value: stats?.openGigs,
      icon: Zap,
      colorClass: "bg-indigo-500"
    },
    {
      label: "Active Protocols",
      value: stats?.activeContracts,
      icon: FileSignature,
      colorClass: "bg-emerald-500"
    },
    {
      label: "Audit Queue",
      value: stats?.pendingVerifications,
      icon: ShieldCheck,
      colorClass: "bg-amber-500"
    }
  ];

  return (
    <motion.div 
        variants={STAGGER_CONTAINER}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {statConfigs.map((config, index) => (
        <StatCard 
          key={index}
          {...config}
          isLoading={isLoading}
        />
      ))}
    </motion.div>
  );
};

export default AdminStatsBanner;
