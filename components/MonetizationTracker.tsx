/**
 * 📊 MONETIZATION TRACKER
 * Real-time dashboard showing progress toward YouTube Partner Program
 */

import { useEffect, useState } from 'react';
import { calculateMonetizationProgress, type MonetizationProgress, type VideoGenerationPlan } from '../lib/autonomousVideoSystem';

interface MonetizationTrackerProps {
  channelId: string;
  channelName: string;
  subscriberCount: number;
}

export default function MonetizationTracker({ channelId, channelName, subscriberCount }: MonetizationTrackerProps) {
  const [progress, setProgress] = useState<MonetizationProgress | null>(null);
  const [plan, setPlan] = useState<VideoGenerationPlan | null>(null);

  useEffect(() => {
    loadProgress();
    const interval = setInterval(loadProgress, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [channelId, subscriberCount]);

  const loadProgress = () => {
    const progressData = calculateMonetizationProgress({
      id: channelId,
      subscriberCount
    });
    setProgress(progressData);

    // Load video plan
    const planData = localStorage.getItem(`video_plan_${channelId}`);
    if (planData) {
      setPlan(JSON.parse(planData));
    }
  };

  if (!progress) return <div>Loading monetization status...</div>;

  const { status } = progress;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">💰 Monetization Progress</h2>
          <p className="text-gray-600">{channelName}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Overall Progress */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-indigo-600">{progress.progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(progress.progressPercentage)}`}
            style={{ width: `${progress.progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subscribers */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">👥 Subscribers</span>
            <span className="text-xs text-blue-600">
              {((progress.currentSubscribers / progress.targetSubscribers) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {progress.currentSubscribers.toLocaleString()} / {progress.targetSubscribers.toLocaleString()}
          </div>
          <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-full rounded-full"
              style={{ width: `${Math.min((progress.currentSubscribers / progress.targetSubscribers) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Watch Hours */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">⏱️ Watch Hours</span>
            <span className="text-xs text-green-600">
              {((progress.currentWatchMinutes / progress.targetWatchMinutes) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {Math.round(progress.currentWatchMinutes / 60).toLocaleString()} / {Math.round(progress.targetWatchMinutes / 60).toLocaleString()}
          </div>
          <div className="mt-2 w-full bg-green-200 rounded-full h-2">
            <div
              className="bg-green-600 h-full rounded-full"
              style={{ width: `${Math.min((progress.currentWatchMinutes / progress.targetWatchMinutes) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Estimation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
          <div className="text-sm text-purple-600 mb-1">📅 Days Until Monetization</div>
          <div className="text-3xl font-bold text-purple-900">{progress.estimatedDaysToMonetization}</div>
          <div className="text-xs text-purple-500 mt-1">
            ~{Math.ceil(progress.estimatedDaysToMonetization / 7)} weeks
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
          <div className="text-sm text-orange-600 mb-1">🎬 Videos Needed</div>
          <div className="text-3xl font-bold text-orange-900">{progress.videosNeeded}</div>
          <div className="text-xs text-orange-500 mt-1">
            {plan ? `${plan.videosGenerated} generated, ${plan.videoQueue.filter(v => v.status === 'planned').length} planned` : 'Calculating...'}
          </div>
        </div>
      </div>

      {/* Video Plan Timeline */}
      {plan && plan.videoQueue.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3">📋 Video Generation Schedule</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {plan.videoQueue.slice(0, 10).map((video, idx) => (
              <div
                key={video.id}
                className={`flex items-center justify-between p-2 rounded ${
                  video.status === 'ready' ? 'bg-green-100' :
                  video.status === 'generating' ? 'bg-yellow-100' :
                  'bg-white'
                }`}
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs font-mono text-gray-500">#{idx + 1}</span>
                  <span className="text-sm font-medium text-gray-700 truncate">{video.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{new Date(video.scheduledDate).toLocaleDateString()}</span>
                  <StatusDot status={video.status} />
                </div>
              </div>
            ))}
            {plan.videoQueue.length > 10 && (
              <div className="text-xs text-gray-500 text-center pt-2">
                +{plan.videoQueue.length - 10} more videos planned
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Strategy */}
      {plan && (
        <div className="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-200">
          <h3 className="font-semibold text-indigo-900 mb-2">🎯 Auto-Optimization Strategy</h3>
          <ul className="space-y-1">
            {plan.contentStrategy.map((item, idx) => (
              <li key={idx} className="text-sm text-indigo-700 flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Monetization Achieved */}
      {status === 'monetized' && (
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 rounded-lg text-white text-center">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-2xl font-bold mb-2">Monetization Achieved!</div>
          <div className="text-sm opacity-90">
            Your channel meets all YouTube Partner Program requirements. Apply now to start earning!
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: MonetizationProgress['status'] }) {
  const config = {
    'not-started': { label: 'Not Started', color: 'bg-gray-100 text-gray-700', emoji: '⚪' },
    'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700', emoji: '🔵' },
    'nearly-there': { label: 'Nearly There!', color: 'bg-orange-100 text-orange-700', emoji: '🟠' },
    'monetized': { label: 'Monetized', color: 'bg-green-100 text-green-700', emoji: '🟢' },
  }[status];

  return (
    <div className={`px-4 py-2 rounded-full font-semibold ${config.color}`}>
      {config.emoji} {config.label}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const config = {
    'planned': { color: 'bg-gray-400', label: 'Planned' },
    'generating': { color: 'bg-yellow-400 animate-pulse', label: 'Generating' },
    'ready': { color: 'bg-green-400', label: 'Ready' },
    'published': { color: 'bg-blue-400', label: 'Published' },
  }[status] || { color: 'bg-gray-300', label: 'Unknown' };

  return (
    <div className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      <span className="text-xs text-gray-600">{config.label}</span>
    </div>
  );
}

function getProgressColor(percentage: number): string {
  if (percentage >= 100) return 'bg-green-500';
  if (percentage >= 75) return 'bg-orange-500';
  if (percentage >= 50) return 'bg-yellow-500';
  if (percentage >= 25) return 'bg-blue-500';
  return 'bg-indigo-500';
}
