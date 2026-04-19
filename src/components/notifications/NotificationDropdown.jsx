import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Settings, ShieldCheck, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import NotificationItem from './NotificationItem';
import EmptyNotifications from './EmptyNotifications';
import { STAGGER_CONTAINER, MICRO_SPRING, PREMIUM_SPRING } from '../../lib/motion';

const NotificationDropdown = ({ onClose, notifications, loading, onMarkRead, onMarkAllRead }) => {
  const dropdownRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const hasUnread = notifications.some(n => !n.is_read);

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ scale: 0.95, opacity: 0, y: 10, filter: 'blur(10px)' }}
      animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ scale: 0.95, opacity: 0, y: 10, filter: 'blur(10px)' }}
      transition={PREMIUM_SPRING}
      className={`absolute right-0 top-full mt-5 w-[380px] max-h-[580px] flex flex-col glass-card !rounded-[2rem] border-white/10 shadow-elevated z-[150] overflow-hidden ${
        isDark ? 'bg-surface-950/90' : 'bg-white/90'
      }`}
    >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50" />
          
          <div className="flex items-center gap-3">
            <h3 className="font-display font-black text-xl tracking-tight text-white">Inbox</h3>
            {hasUnread && (
              <div className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                New
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <AnimatePresence>
              {hasUnread && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={onMarkAllRead}
                  className="p-2 rounded-xl bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-all active:scale-95"
                  title="Mark all as read"
                >
                  <Check size={16} />
                </motion.button>
              )}
            </AnimatePresence>
            <button className="p-2 rounded-xl bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-all active:scale-95">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1 min-h-[160px]">
          {loading && notifications.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-text-dim">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin shadow-glow" />
              <span className="text-[10px] font-black uppercase tracking-widest">Updating feed</span>
            </div>
          ) : notifications.length > 0 ? (
            <motion.div
              variants={STAGGER_CONTAINER}
              initial="hidden"
              animate="show"
              className="space-y-2"
            >
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={onMarkRead}
                />
              ))}
            </motion.div>
          ) : (
            <EmptyNotifications />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-white/2">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl bg-surface-900 border border-white/5 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted hover:text-white hover:border-white/10 transition-all"
          >
            Review Audit Logs
          </motion.button>
        </div>
      </motion.div>
  );
};

export default NotificationDropdown;
