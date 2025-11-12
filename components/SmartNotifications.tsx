/**
 * Smart Notifications Component
 * Shows AI-powered suggestions for making money and growing subscribers
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUrgentNotifications } from '../lib/channelAnalyzer';

interface Notification {
  id: string;
  channelName: string;
  channelId: string;
  message: string;
  type: 'money' | 'growth' | 'action';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  read: boolean;
}

export default function SmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications
  const loadNotifications = () => {
    try {
      // Get AI-generated notifications
      const aiNotifications = getUrgentNotifications();
      
      // Get existing notifications from localStorage
      const stored = JSON.parse(localStorage.getItem('smart_notifications') || '[]');
      
      // Merge with AI notifications (avoid duplicates)
      const allNotifications = [...stored];
      
      aiNotifications.forEach(aiNotif => {
        const exists = stored.some((n: Notification) => 
          n.channelId === aiNotif.channelId && n.message === aiNotif.message
        );
        
        if (!exists) {
          allNotifications.push({
            id: `notif-${Date.now()}-${Math.random()}`,
            ...aiNotif,
            timestamp: new Date().toISOString(),
            read: false
          });
        }
      });
      
      // Sort by priority and timestamp
      allNotifications.sort((a, b) => {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityWeight[a.priority as keyof typeof priorityWeight] || 0;
        const bPriority = priorityWeight[b.priority as keyof typeof priorityWeight] || 0;
        
        if (aPriority !== bPriority) return bPriority - aPriority;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      
      setNotifications(allNotifications);
      
      // Count unread
      const unread = allNotifications.filter((n: Notification) => !n.read).length;
      setUnreadCount(unread);
      
      // Save back to localStorage
      localStorage.setItem('smart_notifications', JSON.stringify(allNotifications));
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  // Load on mount and refresh every 30 seconds
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mark notification as read
  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('smart_notifications', JSON.stringify(updated));
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  // Mark all as read
  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('smart_notifications', JSON.stringify(updated));
    setUnreadCount(0);
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('smart_notifications', JSON.stringify(updated));
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    localStorage.setItem('smart_notifications', JSON.stringify([]));
    setUnreadCount(0);
  };

  // Get icon for notification type
  const getIcon = (type: string) => {
    switch (type) {
      case 'money': return '💰';
      case 'growth': return '📈';
      case 'action': return '🎯';
      default: return '🔔';
    }
  };

  // Get color for notification type
  const getColor = (type: string) => {
    switch (type) {
      case 'money': return 'wealth';
      case 'growth': return 'primary';
      case 'action': return 'luxury';
      default: return 'slate';
    }
  };

  // Format time ago
  const timeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <>
      {/* Notification Bell Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-gradient-to-br from-luxury-600 to-luxury-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-20 right-4 w-96 max-h-[600px] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-luxury-600 to-luxury-800 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg">Smart Notifications</h3>
                  <p className="text-luxury-200 text-sm">AI-powered money & growth tips</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="p-3 bg-slate-800/50 border-b border-slate-700 flex gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="flex-1 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Mark All Read
                  </button>
                  <button
                    onClick={clearAll}
                    className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[450px] p-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔔</div>
                    <p className="text-slate-400 text-sm">No notifications yet</p>
                    <p className="text-slate-500 text-xs mt-2">Connect channels to get AI-powered suggestions</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        notif.read
                          ? 'bg-slate-800/30 border-slate-700/50'
                          : `bg-gradient-to-br from-${getColor(notif.type)}-900/20 to-${getColor(notif.type)}-800/20 border-${getColor(notif.type)}-600/50`
                      }`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      {/* Priority Indicator */}
                      {notif.priority === 'high' && !notif.read && (
                        <div className="absolute top-2 right-2">
                          <span className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          </span>
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{getIcon(notif.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm mb-1">{notif.channelName}</p>
                          <p className="text-slate-300 text-sm leading-relaxed">{notif.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-slate-500">{timeAgo(notif.timestamp)}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full bg-${getColor(notif.type)}-600/20 text-${getColor(notif.type)}-300`}>
                              {notif.type}
                            </span>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
