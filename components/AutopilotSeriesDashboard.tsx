/**
 * AUTOPILOT SERIES DASHBOARD
 * Set it once, let it run automatically - no daily management needed
 */

import { useState, useEffect } from 'react';
import {
  initializeAutoSeries,
  startAutopilotSeries,
  getAutopilotStatus,
  AutoSeriesConfig,
  StoryCategory,
  ScripterStyle
} from '../lib/autopilotSeriesIntegration';

export default function AutopilotSeriesDashboard({ userId, channelId }: { userId: string; channelId: string }) {
  const [config, setConfig] = useState<AutoSeriesConfig | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadConfig();
    loadStatus();
    
    // Auto-refresh status every 5 minutes
    const interval = setInterval(loadStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadConfig = () => {
    const stored = localStorage.getItem(`auto_series_config_${userId}`);
    if (stored) {
      setConfig(JSON.parse(stored));
    } else {
      const newConfig = initializeAutoSeries(userId, channelId);
      setConfig(newConfig);
    }
  };

  const loadStatus = () => {
    const currentStatus = getAutopilotStatus(userId);
    setStatus(currentStatus);
  };

  const handleStartAutopilot = async () => {
    if (!config) return;
    
    setIsStarting(true);
    try {
      const updatedConfig = { ...config, enabled: true };
      setConfig(updatedConfig);
      localStorage.setItem(`auto_series_config_${userId}`, JSON.stringify(updatedConfig));
      
      await startAutopilotSeries(updatedConfig);
      loadStatus();
      
      alert('🚀 Autopilot Series Generator started! Content will be generated and scheduled automatically.');
    } catch (error) {
      alert('Error starting autopilot: ' + error);
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopAutopilot = () => {
    if (!config) return;
    
    const updatedConfig = { ...config, enabled: false };
    setConfig(updatedConfig);
    localStorage.setItem(`auto_series_config_${userId}`, JSON.stringify(updatedConfig));
    loadStatus();
    
    alert('⏸️ Autopilot paused. Scheduled episodes will still publish, but no new content will be generated.');
  };

  const updateConfig = (updates: Partial<AutoSeriesConfig>) => {
    if (!config) return;
    
    const updatedConfig = { ...config, ...updates };
    setConfig(updatedConfig);
    localStorage.setItem(`auto_series_config_${userId}`, JSON.stringify(updatedConfig));
  };

  if (!config) return <div>Loading...</div>;

  const categories: { id: StoryCategory; name: string; viralPotential: number }[] = [
    { id: 'unsolved-mysteries', name: 'Unsolved Mysteries', viralPotential: 95 },
    { id: 'true-crime', name: 'True Crime', viralPotential: 98 },
    { id: 'supernatural', name: 'Supernatural & Paranormal', viralPotential: 92 },
    { id: 'hidden-history', name: 'Hidden History', viralPotential: 88 },
    { id: 'survival-stories', name: 'Survival Stories', viralPotential: 90 },
    { id: 'strange-science', name: 'Strange Science', viralPotential: 85 },
    { id: 'dark-psychology', name: 'Dark Psychology', viralPotential: 93 },
    { id: 'epic-adventures', name: 'Epic Adventures', viralPotential: 87 },
    { id: 'tech-mysteries', name: 'Tech Mysteries', viralPotential: 89 },
    { id: 'money-power', name: 'Money & Power', viralPotential: 91 }
  ];

  const scripterStyles: { id: ScripterStyle; name: string; description: string }[] = [
    { id: 'suspenseful-narrator', name: 'Suspenseful Narrator', description: 'Dark, mysterious, builds tension' },
    { id: 'dramatic-storyteller', name: 'Dramatic Storyteller', description: 'Emotional, intense, vivid' },
    { id: 'investigative-reporter', name: 'Investigative Reporter', description: 'Factual, compelling, credible' },
    { id: 'cinematic-director', name: 'Cinematic Director', description: 'Visual, immersive, cinematic' },
    { id: 'conversational-friend', name: 'Conversational Friend', description: 'Casual, relatable, friendly' },
    { id: 'educational-narrator', name: 'Educational Narrator', description: 'Clear, informative, teaching' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🤖 Autopilot Series Generator</h1>
            <p className="text-emerald-100">Set it once, let it run for months - no daily management needed</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{status?.isActive ? '🟢' : '⚫'}</div>
            <div className="text-sm mt-1">{status?.isActive ? 'ACTIVE' : 'STOPPED'}</div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      {status?.isActive && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-gray-500 text-sm mb-1">Episodes This Week</div>
            <div className="text-3xl font-bold text-emerald-600">{status.stats.episodesThisWeek}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-gray-500 text-sm mb-1">Avg Viral Score</div>
            <div className="text-3xl font-bold text-emerald-600">{status.stats.avgViralScore.toFixed(0)}%</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-gray-500 text-sm mb-1">Est. Total Views</div>
            <div className="text-3xl font-bold text-blue-600">{(status.stats.totalEstimatedViews / 1000000).toFixed(1)}M</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-gray-500 text-sm mb-1">Queue Status</div>
            <div className="text-3xl font-bold text-teal-600">{status.stats.daysUntilQueueEmpty}d</div>
          </div>
        </div>
      )}

      {/* Current Series Info */}
      {status?.currentSeries && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">📺 Current Series</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-gray-500 text-sm">Series Name</div>
              <div className="font-semibold">{status.currentSeries.name}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Progress</div>
              <div className="font-semibold">{status.currentSeries.publishedEpisodes} / {status.currentSeries.totalEpisodes} episodes</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Avg Performance</div>
              <div className="font-semibold">{status.currentSeries.avgViralScore.toFixed(0)}% viral score</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Autopilot Controls</h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            ⚙️ Settings
          </button>
        </div>

        {!showSettings ? (
          // Quick Start View
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-900 mb-2">✨ What Autopilot Does:</h3>
              <ul className="space-y-1 text-emerald-800 text-sm">
                <li>• Automatically generates {config.episodesPerWeek} episodes per week</li>
                <li>• Creates complete series with {config.seriesLength} episodes each</li>
                <li>• Schedules posts on your chosen days and times</li>
                <li>• Keeps {config.backupEpisodes} backup episodes ready</li>
                <li>• Starts new series when current one completes</li>
                <li>• Only approves content with {config.viralScoreMinimum}%+ viral potential</li>
              </ul>
            </div>

            <div className="flex gap-4">
              {!config.enabled ? (
                <button
                  onClick={handleStartAutopilot}
                  disabled={isStarting}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-lg font-bold text-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
                >
                  {isStarting ? '🔄 Starting...' : '🚀 START AUTOPILOT'}
                </button>
              ) : (
                <button
                  onClick={handleStopAutopilot}
                  className="flex-1 bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700"
                >
                  ⏸️ STOP AUTOPILOT
                </button>
              )}
            </div>

            {config.enabled && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">ℹ️</div>
                  <div className="text-sm text-blue-900">
                    <strong>Autopilot is running!</strong> New episodes are being generated and scheduled automatically. 
                    Check back anytime to see your queue status. You'll be notified when high viral potential content is ready.
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Settings View
          <div className="space-y-6">
            {/* Content Categories */}
            <div>
              <label className="block font-semibold mb-2">Content Categories (Select 1-3)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      const current = config.categories;
                      if (current.includes(cat.id)) {
                        updateConfig({ categories: current.filter(c => c !== cat.id) });
                      } else if (current.length < 3) {
                        updateConfig({ categories: [...current, cat.id] });
                      }
                    }}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      config.categories.includes(cat.id)
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="font-semibold text-sm">{cat.name}</div>
                    <div className="text-xs text-gray-500">Viral: {cat.viralPotential}%</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Scripter Style */}
            <div>
              <label className="block font-semibold mb-2">Narrator Style</label>
              <select
                value={config.scripterStyle}
                onChange={(e) => updateConfig({ scripterStyle: e.target.value as ScripterStyle })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                {scripterStyles.map(style => (
                  <option key={style.id} value={style.id}>
                    {style.name} - {style.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Posting Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-2">Episodes Per Week</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={config.episodesPerWeek}
                  onChange={(e) => updateConfig({ episodesPerWeek: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Episodes Per Series</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={config.seriesLength}
                  onChange={(e) => updateConfig({ seriesLength: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Posting Time</label>
                <input
                  type="text"
                  value={config.postingTime}
                  onChange={(e) => updateConfig({ postingTime: e.target.value })}
                  placeholder="6:00 PM"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Posting Days */}
            <div>
              <label className="block font-semibold mb-2">Posting Days</label>
              <div className="flex gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <button
                    key={day}
                    onClick={() => {
                      const current = config.postingDays;
                      if (current.includes(index)) {
                        updateConfig({ postingDays: current.filter(d => d !== index) });
                      } else {
                        updateConfig({ postingDays: [...current, index].sort() });
                      }
                    }}
                    className={`flex-1 py-2 rounded-lg font-semibold ${
                      config.postingDays.includes(index)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Min Viral Score</label>
                <input
                  type="number"
                  min="70"
                  max="100"
                  value={config.viralScoreMinimum}
                  onChange={(e) => updateConfig({ viralScoreMinimum: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <div className="text-xs text-gray-500 mt-1">Only approve content above this score</div>
              </div>
              <div>
                <label className="block font-semibold mb-2">Backup Episodes</label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={config.backupEpisodes}
                  onChange={(e) => updateConfig({ backupEpisodes: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <div className="text-xs text-gray-500 mt-1">Always keep this many episodes ready</div>
              </div>
            </div>

            {/* Auto-approve */}
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <input
                type="checkbox"
                id="autoApprove"
                checked={config.autoApprove}
                onChange={(e) => updateConfig({ autoApprove: e.target.checked })}
                className="w-5 h-5"
              />
              <label htmlFor="autoApprove" className="text-sm">
                <strong>Auto-approve generated content</strong> - Content will be scheduled automatically without manual review. 
                (Only content meeting your viral score minimum will be approved)
              </label>
            </div>

            {/* Save Button */}
            <button
              onClick={() => setShowSettings(false)}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700"
            >
              ✅ Save Settings
            </button>
          </div>
        )}
      </div>

      {/* Upcoming Episodes Queue */}
      {status?.queue?.upcomingEpisodes?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">📅 Upcoming Episodes</h2>
          <div className="space-y-3">
            {status.queue.upcomingEpisodes.slice(0, 5).map((episode: any) => (
              <div key={episode.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-semibold">{episode.title}</div>
                  <div className="text-sm text-gray-500">
                    Episode {episode.episodeNumber} • Viral Score: {episode.viralScore}% • 
                    Est. {(episode.estimatedViews / 1000000).toFixed(1)}M views
                  </div>
                </div>
                {episode.scheduledFor && (
                  <div className="text-sm text-gray-500">
                    {new Date(episode.scheduledFor).toLocaleDateString()} at {new Date(episode.scheduledFor).toLocaleTimeString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

