/**
 * 🤖 AUTO-PILOT CONTROL PANEL
 * Master control for the autonomous video generation system
 */

import { useEffect, useState } from 'react';
import { 
  startAutoScheduler, 
  stopAutoScheduler, 
  getSchedulerStatus, 
  requestNotificationPermission,
  generateAllDueVideos,
  getUpcomingGenerations
} from '../lib/autoScheduler';

export default function AutoPilotPanel() {
  const [status, setStatus] = useState<any>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  const loadStatus = () => {
    const schedulerStatus = getSchedulerStatus();
    setStatus(schedulerStatus);
    
    const upcomingVids = getUpcomingGenerations();
    setUpcoming(upcomingVids);
  };

  const handleToggle = () => {
    if (status?.isRunning) {
      stopAutoScheduler();
    } else {
      startAutoScheduler();
      requestNotificationPermission();
    }
    setTimeout(loadStatus, 500);
  };

  const handleGenerateNow = async () => {
    setGenerating(true);
    await generateAllDueVideos();
    setGenerating(false);
    loadStatus();
  };

  if (!status) return <div>Loading...</div>;

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-6 border-2 border-indigo-500/30 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full ${status.isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <div>
            <h3 className="text-xl font-bold text-white">🤖 Auto-Pilot</h3>
            <p className="text-sm text-indigo-200">
              {status.isRunning ? 'Active - Generating videos automatically' : 'Paused - Manual control only'}
            </p>
          </div>
        </div>
        
        {/* Toggle Switch */}
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
            status.isRunning ? 'bg-green-500' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-10 w-10 transform rounded-full bg-white transition-transform ${
              status.isRunning ? 'translate-x-12' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-sm text-indigo-200 mb-1">Last Check</div>
          <div className="text-lg font-bold text-white">
            {status.lastCheck ? formatRelativeTime(status.lastCheck) : 'Never'}
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-sm text-indigo-200 mb-1">Next Check</div>
          <div className="text-lg font-bold text-white">
            {status.nextCheck ? formatRelativeTime(status.nextCheck) : 'Paused'}
          </div>
        </div>
      </div>

      {/* Upcoming Generations */}
      {upcoming.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-white mb-3">📅 Upcoming Generations</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {upcoming.slice(0, 5).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm bg-black/20 rounded-lg p-2">
                <div className="flex-1">
                  <div className="text-white font-medium truncate">{item.videoTitle}</div>
                  <div className="text-indigo-300 text-xs">{item.channelName}</div>
                </div>
                <div className="text-xs text-indigo-200 text-right">
                  {formatRelativeTime(item.scheduledDate)}
                </div>
              </div>
            ))}
          </div>
          {upcoming.length > 5 && (
            <div className="text-xs text-center text-indigo-300 mt-2">
              +{upcoming.length - 5} more scheduled
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleGenerateNow}
          disabled={generating}
          className={`flex-1 py-3 rounded-xl font-semibold transition ${
            generating
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/50'
          }`}
        >
          {generating ? '⏳ Generating...' : '🚀 Generate All Due Now'}
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
        <p className="text-xs text-blue-200 leading-relaxed">
          💡 <strong>Auto-Pilot</strong> checks every hour for scheduled videos. When a video is due, it auto-generates 
          and saves to your channel. Keep this tab open for background generation, or click "Generate Now" to process all due videos immediately.
        </p>
      </div>

      {/* Browser Notification Status */}
      {typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default' && (
        <button
          onClick={requestNotificationPermission}
          className="mt-3 w-full py-2 bg-indigo-500/20 border border-indigo-500/40 rounded-lg text-sm text-indigo-200 hover:bg-indigo-500/30 transition"
        >
          🔔 Enable Desktop Notifications
        </button>
      )}
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const absDiff = Math.abs(diff);

  const minutes = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

  if (diff < 0) {
    // Past
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  } else {
    // Future
    if (minutes < 1) return 'Now';
    if (minutes < 60) return `in ${minutes}m`;
    if (hours < 24) return `in ${hours}h`;
    return `in ${days}d`;
  }
}
