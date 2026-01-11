import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppNavigation from '../components/AppNavigation';
import {
  getCouncilStatus,
  getChannelTrends,
  getVideoQueue,
  refreshAllChannelTrends,
  autoGenerateVideo,
  autoGenerateForAllChannels,
  toggleAutoGen,
  toggleAutoUpload,
  activateCouncil,
  deactivateCouncil,
  getCouncilSummary,
  ChannelTrendData,
  QueuedVideo,
  CouncilStatus
} from '../lib/autonomousCouncil';

export default function AutoPilotPage() {
  const [status, setStatus] = useState<CouncilStatus | null>(null);
  const [trends, setTrends] = useState<ChannelTrendData[]>([]);
  const [queue, setQueue] = useState<QueuedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setStatus(getCouncilStatus());
    setTrends(getChannelTrends());
    setQueue(getVideoQueue());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleActivate = () => {
    const newStatus = activateCouncil();
    setStatus(newStatus);
    loadData();
  };

  const handleDeactivate = () => {
    const newStatus = deactivateCouncil();
    setStatus(newStatus);
  };

  const handleRefreshTrends = () => {
    setIsLoading(true);
    const updated = refreshAllChannelTrends();
    setTrends(updated);
    setStatus(getCouncilStatus());
    setIsLoading(false);
  };

  const handleGenerateVideo = async (channelId: string) => {
    setGenerating(channelId);
    await new Promise(r => setTimeout(r, 1500)); // Visual feedback
    autoGenerateVideo(channelId);
    loadData();
    setGenerating(null);
  };

  const handleGenerateAll = async () => {
    setGenerating('all');
    await new Promise(r => setTimeout(r, 2000));
    autoGenerateForAllChannels();
    loadData();
    setGenerating(null);
  };

  const handleToggleAutoGen = (channelId: string, enabled: boolean) => {
    toggleAutoGen(channelId, enabled);
    loadData();
  };

  const handleToggleAutoUpload = (channelId: string, enabled: boolean) => {
    toggleAutoUpload(channelId, enabled);
    loadData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
        <AppNavigation title="AutoPilot" currentPage="Autonomous Council Control" />
        <div className="sm:pl-20 lg:pl-64 pt-20 sm:pt-24 p-4 flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-lg">Initializing Autonomous Council...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
      <AppNavigation title="AutoPilot" currentPage="Autonomous Council Control" />
      
      <div className="sm:pl-20 lg:pl-64 pt-20 sm:pt-24 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  🤖 AutoPilot Mode
                  {status?.isActive && (
                    <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-full animate-pulse">
                      ACTIVE 24/7
                    </span>
                  )}
                </h1>
                <p className="text-slate-400">
                  The Council never sleeps. Auto-tracks trends, generates videos, and manages your empire.
                </p>
              </div>
              
              {/* Main Toggle */}
              <button
                onClick={status?.isActive ? handleDeactivate : handleActivate}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 ${
                  status?.isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                }`}
              >
                {status?.isActive ? '⏸️ Pause Council' : '🚀 Activate Council'}
              </button>
            </div>
          </motion.div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border ${
                status?.isActive 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-slate-800/50 border-slate-700'
              }`}
            >
              <div className={`text-3xl font-bold ${status?.isActive ? 'text-green-400' : 'text-slate-500'}`}>
                {status?.isActive ? '🟢' : '🔴'}
              </div>
              <div className="text-slate-400 text-sm mt-1">Council Status</div>
              <div className={`font-bold ${status?.isActive ? 'text-green-400' : 'text-red-400'}`}>
                {status?.isActive ? 'ACTIVE' : 'PAUSED'}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-purple-500/10 border border-purple-500/30 p-6 rounded-2xl"
            >
              <div className="text-3xl font-bold text-purple-400">{trends.length}</div>
              <div className="text-slate-400 text-sm mt-1">Channels Monitored</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-2xl"
            >
              <div className="text-3xl font-bold text-blue-400">
                {trends.reduce((acc, t) => acc + t.trends.length, 0)}
              </div>
              <div className="text-slate-400 text-sm mt-1">Trends Tracked</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-2xl"
            >
              <div className="text-3xl font-bold text-yellow-400">
                {queue.filter(v => v.status === 'ready').length}
              </div>
              <div className="text-slate-400 text-sm mt-1">Videos Ready</div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-4">⚡ Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleRefreshTrends}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                🔄 Refresh All Trends
              </button>
              <button
                onClick={handleGenerateAll}
                disabled={generating === 'all' || trends.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                {generating === 'all' ? (
                  <>⏳ Generating...</>
                ) : (
                  <>🚀 Generate Video for All Channels</>
                )}
              </button>
              <a
                href="/my-videos"
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all"
              >
                📹 View All Videos
              </a>
            </div>
          </motion.div>

          {/* Channel Control */}
          {trends.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-8 text-center"
            >
              <div className="text-5xl mb-4">📺</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Channels Connected</h3>
              <p className="text-slate-400 mb-4">Connect your YouTube channels to start the autonomous system.</p>
              <a
                href="/connect"
                className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition-all"
              >
                Connect Channels →
              </a>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">📺 Channel Control Center</h3>
              
              {trends.map((channel, index) => (
                <motion.div
                  key={channel.channelId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Channel Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-white">{channel.channelName}</h4>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-bold">
                          {channel.niche.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <span>📊 {channel.trends.length} trends available</span>
                        <span>🎬 {channel.videosGenerated} videos generated</span>
                        <span>📤 {channel.videosUploaded} uploaded</span>
                      </div>
                      
                      {/* Top Trends Preview */}
                      {channel.trends.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {channel.trends.slice(0, 3).map((trend, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                              🔥 {trend.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-3 lg:min-w-[280px]">
                      {/* Auto-Gen Toggle */}
                      <div className="flex items-center justify-between bg-slate-900/50 rounded-xl p-3">
                        <span className="text-sm text-slate-300">🤖 Auto-Generate</span>
                        <button
                          onClick={() => handleToggleAutoGen(channel.channelId, !channel.autoGenEnabled)}
                          className={`relative w-14 h-7 rounded-full transition-all ${
                            channel.autoGenEnabled ? 'bg-green-500' : 'bg-slate-600'
                          }`}
                        >
                          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                            channel.autoGenEnabled ? 'left-8' : 'left-1'
                          }`} />
                        </button>
                      </div>

                      {/* Auto-Upload Toggle */}
                      <div className="flex items-center justify-between bg-slate-900/50 rounded-xl p-3">
                        <span className="text-sm text-slate-300">📤 Auto-Upload</span>
                        <button
                          onClick={() => handleToggleAutoUpload(channel.channelId, !channel.autoUploadEnabled)}
                          className={`relative w-14 h-7 rounded-full transition-all ${
                            channel.autoUploadEnabled ? 'bg-green-500' : 'bg-slate-600'
                          }`}
                        >
                          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                            channel.autoUploadEnabled ? 'left-8' : 'left-1'
                          }`} />
                        </button>
                      </div>

                      {/* Generate Now Button */}
                      <button
                        onClick={() => handleGenerateVideo(channel.channelId)}
                        disabled={generating === channel.channelId || channel.trends.length === 0}
                        className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                      >
                        {generating === channel.channelId ? (
                          <>⏳ Generating...</>
                        ) : (
                          <>🎬 Generate Video Now</>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Activity Log */}
          {status?.alerts && status.alerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">📋 Activity Log</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {status.alerts.slice(0, 20).map((alert, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
                      alert.type === 'success' ? 'bg-green-500/10 text-green-400' :
                      alert.type === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-blue-500/10 text-blue-400'
                    }`}
                  >
                    <span>
                      {alert.type === 'success' ? '✅' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </span>
                    <span className="flex-1">{alert.message}</span>
                    <span className="text-xs opacity-60">
                      {new Date(alert.time).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Video Queue */}
          {queue.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">📹 Video Queue</h3>
                <a href="/my-videos" className="text-purple-400 hover:text-purple-300 text-sm">
                  View All →
                </a>
              </div>
              <div className="space-y-3">
                {queue.slice(0, 5).map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{video.title}</p>
                      <div className="flex gap-3 text-xs text-slate-400 mt-1">
                        <span>{video.channelName}</span>
                        <span className="text-green-400">{video.estimatedRevenue}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      video.status === 'ready' ? 'bg-green-500/20 text-green-400' :
                      video.status === 'uploaded' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {video.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-3">💡 How AutoPilot Works</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• 🔍 <strong>Trend Tracking:</strong> Analyzes trending topics for each channel's niche 24/7</li>
              <li>• 🤖 <strong>Auto-Generate:</strong> Creates viral video packages (title, script, description, tags) automatically</li>
              <li>• 📤 <strong>Auto-Upload:</strong> When enabled, queues videos for upload at optimal times</li>
              <li>• 💰 <strong>Revenue Estimation:</strong> Calculates potential earnings based on your subscriber count</li>
              <li>• 🔒 <strong>Data Safety:</strong> All your channels and videos are backed up in 3 locations</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
