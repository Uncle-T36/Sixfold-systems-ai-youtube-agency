import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Channel {
  id: string;
  name: string;
  niche: string;
  subscribers: number;
  watchHours: number;
  videosUploaded: number;
  isMonetized: boolean;
  monthlyRevenue: number;
  status: 'active' | 'paused' | 'setup';
  lastVideoDate: string;
  thumbnailUrl: string;
}

interface DashboardStats {
  totalChannels: number;
  totalSubscribers: number;
  totalWatchHours: number;
  totalRevenue: number;
  videosGenerated: number;
  monetizedChannels: number;
}

export default function InteractiveDashboard() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
  }>>([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Try API first
      const [channelsRes, statsRes] = await Promise.all([
        fetch('/api/channels'),
        fetch('/api/dashboard-stats')
      ]);
      
      if (channelsRes.ok) {
        const channelsData = await channelsRes.json();
        setChannels(channelsData.channels || []);
      } else {
        // Fallback to localStorage
        const localChannels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
        if (localChannels.length > 0) {
          // Transform to dashboard format
          const formattedChannels = localChannels.map((ch: any) => ({
            id: ch.id,
            name: ch.name,
            niche: 'general',
            subscribers: ch.subscriberCount || 0,
            watchHours: 0,
            videosUploaded: 0,
            isMonetized: false,
            monthlyRevenue: 0,
            status: 'active',
            lastVideoDate: new Date().toISOString(),
            thumbnailUrl: ch.thumbnailUrl
          }));
          setChannels(formattedChannels);
        }
      }
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      } else {
        // Calculate from local channels
        const localChannels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
        setStats({
          totalChannels: localChannels.length,
          totalSubscribers: 0,
          totalWatchHours: 0,
          totalRevenue: 0,
          videosGenerated: 0,
          monetizedChannels: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Load from localStorage as fallback
      try {
        const localChannels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
        if (localChannels.length > 0) {
          const formattedChannels = localChannels.map((ch: any) => ({
            id: ch.id,
            name: ch.name,
            niche: 'general',
            subscribers: ch.subscriberCount || 0,
            watchHours: 0,
            videosUploaded: 0,
            isMonetized: false,
            monthlyRevenue: 0,
            status: 'active',
            lastVideoDate: new Date().toISOString(),
            thumbnailUrl: ch.thumbnailUrl
          }));
          setChannels(formattedChannels);
          setStats({
            totalChannels: localChannels.length,
            totalSubscribers: 0,
            totalWatchHours: 0,
            totalRevenue: 0,
            videosGenerated: 0,
            monetizedChannels: 0
          });
        }
      } catch (localError) {
        addNotification('error', 'Failed to load channels');
      }
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const generateVideo = async (channelId: string) => {
    setIsGeneratingVideo(channelId);
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId })
      });

      const result = await response.json();
      if (result.success) {
        addNotification('success', `Video generated successfully for ${result.channelName}`);
        fetchDashboardData(); // Refresh data
      } else {
        addNotification('error', result.error || 'Failed to generate video');
      }
    } catch (error) {
      console.error('Video generation error:', error);
      addNotification('error', 'Failed to generate video');
    } finally {
      setIsGeneratingVideo(null);
    }
  };

  const pauseChannel = async (channelId: string) => {
    try {
      const response = await fetch('/api/channels/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId })
      });

      if (response.ok) {
        addNotification('info', 'Channel paused successfully');
        fetchDashboardData();
      }
    } catch (error) {
      addNotification('error', 'Failed to pause channel');
    }
  };

  const resumeChannel = async (channelId: string) => {
    try {
      const response = await fetch('/api/channels/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId })
      });

      if (response.ok) {
        addNotification('success', 'Channel resumed successfully');
        fetchDashboardData();
      }
    } catch (error) {
      addNotification('error', 'Failed to resume channel');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className={`p-4 rounded-lg shadow-lg backdrop-blur-md ${
                notification.type === 'success' ? 'bg-green-500/20 border border-green-500/50' :
                notification.type === 'error' ? 'bg-red-500/20 border border-red-500/50' :
                'bg-blue-500/20 border border-blue-500/50'
              }`}
            >
              <p className="text-white text-sm">{notification.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-luxury-400 via-primary-400 to-luxury-300 mb-2">
                AI YouTube Empire
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">Multi-Channel Command Center</p>
            </div>
            <a 
              href="/connect"
              className="btn-luxury text-sm sm:text-base whitespace-nowrap"
            >
              + Add Channel
            </a>
          </div>
          <p className="text-xl text-gray-300 mb-6">
            Manage your automated YouTube channels with AI-powered content creation
          </p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {[
              {
                title: 'Total Channels',
                value: stats.totalChannels,
                icon: '📺',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Total Subscribers',
                value: stats.totalSubscribers.toLocaleString(),
                icon: '👥',
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Watch Hours',
                value: `${Math.round(stats.totalWatchHours).toLocaleString()}h`,
                icon: '⏱️',
                color: 'from-purple-500 to-violet-500'
              },
              {
                title: 'Monthly Revenue',
                value: `$${stats.totalRevenue.toLocaleString()}`,
                icon: '💰',
                color: 'from-yellow-500 to-orange-500'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${stat.color} backdrop-blur-md shadow-xl`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className="text-4xl opacity-80">{stat.icon}</div>
                </div>
                
                {/* 3D Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Channels Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {channels.map((channel, index) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, rotateY: 5 }}
              className="relative group"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                {/* Channel Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {channel.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{channel.name}</h3>
                      <p className="text-gray-400 text-sm capitalize">{channel.niche}</p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    channel.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                    channel.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                  }`}>
                    {channel.status}
                  </div>
                </div>

                {/* Channel Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-2xl font-bold text-white">{channel.subscribers.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs">Subscribers</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-2xl font-bold text-white">{Math.round(channel.watchHours)}</p>
                    <p className="text-gray-400 text-xs">Watch Hours</p>
                  </div>
                </div>

                {/* Monetization Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Monetization Progress</span>
                    <span className="text-white text-sm font-medium">
                      {channel.isMonetized ? '✅ Monetized' : `${Math.round((channel.subscribers / 1000) * 100)}%`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: channel.isMonetized ? '100%' : `${Math.min((channel.subscribers / 1000) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span>1K subs</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => generateVideo(channel.id)}
                    disabled={isGeneratingVideo === channel.id || channel.status !== 'active'}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingVideo === channel.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      '🎬 Generate Video'
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => channel.status === 'active' ? pauseChannel(channel.id) : resumeChannel(channel.id)}
                    className={`py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                      channel.status === 'active' 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 hover:bg-yellow-500/30' 
                        : 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30'
                    }`}
                  >
                    {channel.status === 'active' ? '⏸️' : '▶️'}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedChannel(channel)}
                    className="py-2 px-4 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg font-medium text-sm hover:bg-blue-500/30 transition-all duration-300"
                  >
                    📊
                  </motion.button>
                </div>

                {/* 3D Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Add New Channel Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <span>➕</span>
            <span>Add New Channel</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Channel Details Modal */}
      <AnimatePresence>
        {selectedChannel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedChannel(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedChannel.name} Analytics</h2>
                <button
                  onClick={() => setSelectedChannel(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Detailed Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm">Videos Uploaded</p>
                    <p className="text-2xl font-bold text-white">{selectedChannel.videosUploaded}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-green-400">${selectedChannel.monthlyRevenue}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Last Video</p>
                  <p className="text-white">{selectedChannel.lastVideoDate}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}