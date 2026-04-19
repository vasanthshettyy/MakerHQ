import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Sparkles } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../context/ThemeContext';
import NotificationDropdown from './NotificationDropdown';
import { MICRO_INTERACTION, PREMIUM_SPRING } from '../../lib/motion';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const { isDark } = useTheme();

  return (
    <div className="relative z-[100]">
      <motion.button
        {...MICRO_INTERACTION}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-2xl transition-all duration-300 cursor-pointer group ${
          isOpen ? 'bg-primary/20 text-primary' : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-text-secondary'
        }`}
        aria-label="Notifications"
      >
        <Bell size={20} strokeWidth={isOpen ? 2.5 : 2} className="transition-all" />
        
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary rounded-full flex items-center justify-center border-2 border-surface-950 shadow-lg shadow-primary/40"
            >
              <span className="text-[9px] font-black text-white leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <NotificationDropdown
            onClose={() => setIsOpen(false)}
            notifications={notifications}
            loading={loading}
            onMarkRead={markAsRead}
            onMarkAllRead={markAllAsRead}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
