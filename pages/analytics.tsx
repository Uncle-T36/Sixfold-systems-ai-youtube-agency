// Analytics Dashboard - Visual insights that require ZERO input
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppNavigation from '../components/AppNavigation';
import { 
  getGlobalInsights, 
  getChannelAnalytics, 
  getAllPerformanceData,
  predictPerformance,
  autoLearnPatterns,
  type VideoPerformance,
  type ChannelAnalytics,
  type AnalyticsInsight
} from '../lib/analytics';
import { analyzeCompetition } from '../lib/competitorSpy';

export default function AnalyticsPage() {
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [channelAnalytics, setChannelAnalytics] = useState<ChannelAnalytics | null>(null);
  const [globalInsights, setGlobalInsights] = useState<AnalyticsInsight[]>([]);
  const [performanceData, setPerformanceData] = useState<VideoPerformance[]>([]);
  const [competitorData, setCompetitorData] = useState<any>(null);
  const [testTitle, setTestTitle] = useState('');
  const [prediction, setPrediction] = useState<any>(null);

  useEffect(() => {
    const savedChannels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
    setChannels(savedChannels);
    
    const insights = getGlobalInsights();
    setGlobalInsights(insights);
    
    const perfData = getAllPerformanceData();
    setPerformanceData(perfData);
    
    // Auto-learn patterns in background
    autoLearnPatterns();
  }, []);

  useEffect(() => {
    if (selectedChannel !== 'all') {
      const analytics = getChannelAnalytics(selectedChannel);
      setChannelAnalytics(analytics);
    } else {
      setChannelAnalytics(null);
    }
  }, [selectedChannel]);

  const handleTestTitle = () => {
    if (!testTitle) return;
    const niche = channels.find(c => c.id === selectedChannel)?.niche || 'tech';
    const result = predictPerformance(testTitle, niche);
    setPrediction(result);
  };

  const handleSpyCompetition = () => {
    const niche = channels.find(c => c.id === selectedChannel)?.niche || 'tech';
    const analysis = analyzeCompetition(niche);
    setCompetitorData(analysis);
  };

  // Calculate totals
  const totalViews = performanceData.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalRevenue = performanceData.reduce((sum, p) => sum + (p.estimatedRevenue || 0), 0);
  const avgScore = performanceData.length > 0 
    ? Math.round(performanceData.reduce((sum, p) => sum + p.performanceScore, 0) / performanceData.length)
    : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <AppNavigation title="Analytics Dashboard" showBack={true} />
      
      {/* Main content with proper spacing for fixed nav */}
      <div className="sm:pl-20 lg:pl-64 pt-24 sm:pt-28">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">📊 Analytics Dashboard</h1>
          <p className="text-gray-400">AI-powered insights • Zero input required • Auto-learns your patterns</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-4 border border-purple-500/30"
          >
            <div className="text-3xl mb-1">📹</div>
            <div className="text-2xl font-bold">{performanceData.length}</div>
            <div className="text-gray-400 text-sm">Total Videos</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-4 border border-blue-500/30"
          >
            <div className="text-3xl mb-1">👁️</div>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Total Views</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-xl p-4 border border-green-500/30"
          >
            <div className="text-3xl mb-1">💰</div>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <div className="text-gray-400 text-sm">Est. Revenue</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 rounded-xl p-4 border border-yellow-500/30"
          >
            <div className="text-3xl mb-1">⭐</div>
            <div className="text-2xl font-bold">{avgScore}/100</div>
            <div className="text-gray-400 text-sm">Avg Score</div>
          </motion.div>
        </div>

        {/* Channel Selector */}
        <div className="mb-6">
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="all">All Channels</option>
            {channels.map(channel => (
              <option key={channel.id} value={channel.id}>
                {channel.name || channel.id}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Insights */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900/50 rounded-xl p-6 border border-gray-800"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              🧠 AI Insights
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Auto-Generated</span>
            </h2>
            
            {globalInsights.length === 0 ? (
              <p className="text-gray-400">Generate some videos to unlock AI insights!</p>
            ) : (
              <div className="space-y-4">
                {globalInsights.map((insight, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{insight.title}</h3>
                      <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{insight.description}</p>
                    <p className="text-green-400 text-sm">💡 {insight.actionable}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Channel Analytics */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900/50 rounded-xl p-6 border border-gray-800"
          >
            <h2 className="text-xl font-bold mb-4">📈 Channel Performance</h2>
            
            {channelAnalytics ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Best Niche</div>
                    <div className="font-bold capitalize">{channelAnalytics.bestPerformingNiche}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Best Day</div>
                    <div className="font-bold">{channelAnalytics.bestDayOfWeek}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Best Time</div>
                    <div className="font-bold">{channelAnalytics.bestPostingTime}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Growth</div>
                    <div className={`font-bold ${
                      channelAnalytics.growthTrend === 'rising' ? 'text-green-400' :
                      channelAnalytics.growthTrend === 'declining' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {channelAnalytics.growthTrend === 'rising' ? '📈 Rising' :
                       channelAnalytics.growthTrend === 'declining' ? '📉 Declining' : '➡️ Stable'}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400 mb-2">Top Title Patterns</div>
                  <div className="flex flex-wrap gap-2">
                    {channelAnalytics.topTitlePatterns.map((pattern, i) => (
                      <span key={i} className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-sm">
                        {pattern.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Select a channel to see analytics</p>
            )}
          </motion.div>

          {/* Title Predictor */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/50 rounded-xl p-6 border border-gray-800"
          >
            <h2 className="text-xl font-bold mb-4">🎯 Title Predictor</h2>
            <p className="text-gray-400 text-sm mb-4">Test any title before you use it</p>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="Enter a title to test..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <button
                onClick={handleTestTitle}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold"
              >
                Predict
              </button>
            </div>
            
            {prediction && (
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-400">Predicted Score</div>
                    <div className="text-2xl font-bold">{prediction.predictedScore}/100</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Est. Views</div>
                    <div className="text-2xl font-bold">{prediction.predictedViews}</div>
                  </div>
                </div>
                
                {prediction.suggestions.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Suggestions:</div>
                    <ul className="space-y-1">
                      {prediction.suggestions.map((s: string, i: number) => (
                        <li key={i} className="text-yellow-400 text-sm">💡 {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Competitor Intelligence */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/50 rounded-xl p-6 border border-gray-800"
          >
            <h2 className="text-xl font-bold mb-4">👀 Competitor Spy</h2>
            <p className="text-gray-400 text-sm mb-4">Auto-analyze what works in your niche</p>
            
            <button
              onClick={handleSpyCompetition}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold mb-4"
            >
              🔍 Spy on Competition
            </button>
            
            {competitorData && (
              <div className="space-y-3">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400">Posting Frequency</div>
                  <div className="font-bold">{competitorData.postingFrequency}</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400">Optimal Length</div>
                  <div className="font-bold">{competitorData.optimalLength}</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400">Top Keywords</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {competitorData.topKeywords.slice(0, 6).map((kw: string, i: number) => (
                      <span key={i} className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Top Performers Table */}
        {performanceData.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-gray-900/50 rounded-xl p-6 border border-gray-800"
          >
            <h2 className="text-xl font-bold mb-4">🏆 Top Performers</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-800">
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Views</th>
                    <th className="pb-3">CTR</th>
                    <th className="pb-3">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {[...performanceData]
                    .sort((a, b) => b.performanceScore - a.performanceScore)
                    .slice(0, 5)
                    .map((video, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📹'}</span>
                            <span className="truncate max-w-xs">{video.title}</span>
                          </div>
                        </td>
                        <td className="py-3">{video.views.toLocaleString()}</td>
                        <td className="py-3">{video.ctr}%</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded ${
                            video.performanceScore >= 80 ? 'bg-green-500/20 text-green-400' :
                            video.performanceScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {video.performanceScore}/100
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
}
