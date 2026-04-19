import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Star, 
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { STAGGER_ITEM, MICRO_INTERACTION } from '../../lib/motion';
import { cn } from '../../lib/utils';

const NotificationItem = ({ notification, onMarkRead }) => {
  const navigate = useNavigate();
  
  const isSupportedLink = (link) => {
    if (!link || typeof link !== 'string') return false;
    const validPrefixes = ['/brand/', '/influencer/', '/admin/'];
    if (validPrefixes.some(prefix => link.startsWith(prefix))) return true;
    const staticRoutes = ['/login', '/select-role', '/onboarding', '/profile'];
    return staticRoutes.includes(link);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'proposal_received':
        return <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400"><FileText size={16} /></div>;
      case 'proposal_update':
        return notification.title.includes('Accepted') 
          ? <div className="p-2 rounded-xl bg-success/20 text-success"><CheckCircle2 size={16} /></div>
          : <div className="p-2 rounded-xl bg-error/20 text-error"><XCircle size={16} /></div>;
      case 'milestone_update':
        if (notification.title.includes('Approved')) return <div className="p-2 rounded-xl bg-success/20 text-success"><CheckCircle2 size={16} /></div>;
        if (notification.title.includes('Revision')) return <div className="p-2 rounded-xl bg-warning/20 text-warning"><RefreshCw size={16} /></div>;
        return <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400"><FileText size={16} /></div>;
      case 'contract_completed':
        return <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400"><CheckCircle2 size={16} /></div>;
      case 'review_received':
        return <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400"><Star size={16} fill="currentColor" /></div>;
      default:
        return <div className="p-2 rounded-xl bg-white/5 text-text-muted"><AlertCircle size={16} /></div>;
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (!notification.is_read) onMarkRead(notification.id);
    if (isSupportedLink(notification.link)) navigate(notification.link);
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const intervals = {
      y: 31536000,
      mo: 2592000,
      d: 86400,
      h: 3600,
      m: 60
    };
    for (let key in intervals) {
      const count = Math.floor(seconds / intervals[key]);
      if (count >= 1) return `${count}${key} ago`;
    }
    return "Recently";
  };

  return (
    <motion.div
      variants={STAGGER_ITEM}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)', x: 4 }}
      className={cn(
        "group relative flex gap-4 p-4 rounded-2xl transition-all border border-transparent cursor-pointer",
        !notification.is_read && "bg-white/[0.03] border-white/5 shadow-sm"
      )}
      onClick={handleClick}
    >
      <div className="flex-shrink-0">
        <div className="relative">
          {getIcon()}
          {!notification.is_read && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface-950" />
          )}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1 gap-2">
          <h4 className={cn(
            "text-sm font-bold tracking-tight truncate leading-none transition-colors",
            !notification.is_read ? "text-white" : "text-text-secondary group-hover:text-white"
          )}>
            {notification.title}
          </h4>
          <span className="text-[9px] font-black uppercase tracking-widest text-text-dim whitespace-nowrap bg-white/5 px-1.5 py-0.5 rounded-md">
            {timeAgo(notification.created_at)}
          </span>
        </div>
        <p className={cn(
          "text-xs leading-relaxed line-clamp-2 transition-colors",
          !notification.is_read ? "text-text-secondary" : "text-text-muted group-hover:text-text-secondary"
        )}>
          {notification.message}
        </p>
        
        {isSupportedLink(notification.link) && (
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all uppercase tracking-[0.15em]">
            Take Action <ArrowUpRight size={10} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationItem;
