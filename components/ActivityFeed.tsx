import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Activity {
  id: string;
  type: 'success' | 'info' | 'warning' | 'processing';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Load activities from localStorage
    const loadActivities = () => {
      const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
      const newActivities: Activity[] = [];

      // Add channel connection activities
      channels.forEach((ch: any, index: number) => {
        newActivities.push({
          id: `channel-${ch.id}`,
          type: 'success',
          title: `Channel Connected`,
          description: `${ch.name} is ready for content generation`,
          timestamp: new Date(Date.now() - index * 60000), // Stagger timestamps
          icon: '✅'
        });
      });

      // Add system activities
      if (channels.length > 0) {
        newActivities.push({
          id: 'system-ready',
          type: 'info',
          title: 'System Ready',
          description: 'AI content generation system is active',
          timestamp: new Date(Date.now() - channels.length * 60000),
          icon: '🚀'
        });

        newActivities.push({
          id: 'next-action',
          type: 'processing',
          title: 'Next: Generate Content',
          description: 'Click "Generate Video" on any channel to start creating content',
          timestamp: new Date(),
          icon: '🎬'
        });
      } else {
        newActivities.push({
          id: 'no-channels',
          type: 'warning',
          title: 'No Channels Connected',
          description: 'Go to Connect page to add your YouTube channels',
          timestamp: new Date(),
          icon: '⚠️'
        });
      }

      setActivities(newActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    };

    loadActivities();
    const interval = setInterval(loadActivities, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-success-500/30 bg-success-500/10';
      case 'info': return 'border-primary-500/30 bg-primary-500/10';
      case 'warning': return 'border-warning-500/30 bg-warning-500/10';
      case 'processing': return 'border-luxury-500/30 bg-luxury-500/10';
      default: return 'border-slate-700/30 bg-slate-800/30';
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
      {/* Header */}
      <div
        className="px-4 sm:px-6 py-4 border-b border-slate-700/50 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
          <h3 className="text-white font-bold text-base sm:text-lg">Activity Feed</h3>
          <span className="text-xs sm:text-sm text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full">
            {activities.length}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>

      {/* Activities List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-h-96 overflow-y-auto"
          >
            <div className="p-4 space-y-3">
              {activities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400">No recent activity</p>
                </div>
              ) : (
                activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 sm:p-4 rounded-xl border ${getActivityColor(activity.type)} backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl flex-shrink-0">{activity.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-white font-semibold text-sm sm:text-base">{activity.title}</h4>
                          <span className="text-xs text-slate-500 flex-shrink-0">{getTimeAgo(activity.timestamp)}</span>
                        </div>
                        <p className="text-slate-400 text-xs sm:text-sm mt-1">{activity.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

