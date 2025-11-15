/**
 * WEALTH AUTOPILOT - One-click wealth generation
 * Analyzes all channels, generates viral videos automatically, targets high-paying markets
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeChannelPortfolio, createWealthPlan, getTrendingTopics } from '../lib/wealthEngine';

interface Channel {
  id: string;
  name: string;
  description?: string;
  niche?: string;
}

export default function WealthAutopilot() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [wealthPlans, setWealthPlans] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' });

  // Load channels
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
    setChannels(stored);
  }, []);

  // Analyze portfolio
  const analyzePortfolio = async () => {
    if (channels.length === 0) {
      alert('⚠️ Connect at least one channel first!');
      return;
    }

    setAnalyzing(true);
    try {
      // Get portfolio analysis
      const portfolioAnalysis = analyzeChannelPortfolio(channels);
      
      // Get trending topics
      const trendingTopics = await getTrendingTopics();
      
      setAnalysis(portfolioAnalysis);
      setTrends(trendingTopics);
      
      // Save to localStorage
      localStorage.setItem('portfolio_analysis', JSON.stringify(portfolioAnalysis));
      localStorage.setItem('trending_topics', JSON.stringify(trendingTopics));
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Error analyzing portfolio. Check console.');
    }
    setAnalyzing(false);
  };

  // Generate all videos for all channels
  const generateAllVideos = async () => {
    if (channels.length === 0) {
      alert('⚠️ Connect channels first!');
      return;
    }

    if (!confirm(`🚀 Generate 6 viral videos for each of your ${channels.length} channels?\n\nThis will create ${channels.length * 6} videos total, optimized for maximum views and revenue.`)) {
      return;
    }

    setGenerating(true);
    setProgress({ current: 0, total: channels.length, status: 'Starting...' });

    const plans: any[] = [];

    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];
      setProgress({ 
        current: i + 1, 
        total: channels.length, 
        status: `Creating wealth plan for "${channel.name}"...` 
      });

      try {
        const plan = await createWealthPlan(channel);
        plans.push(plan);
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error creating plan for ${channel.name}:`, error);
      }
    }

    setWealthPlans(plans);
    localStorage.setItem('wealth_plans', JSON.stringify(plans));
    
    setProgress({ current: channels.length, total: channels.length, status: '✅ Complete!' });
    setTimeout(() => setGenerating(false), 2000);
  };

  // Calculate total revenue potential
  const totalRevenue = wealthPlans.reduce((sum, plan) => {
    return sum + (plan.estimatedRevenue?.realistic || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-wealth-900 via-luxury-900 to-slate-900 rounded-2xl p-8 border-2 border-wealth-600/30 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-wealth-400 to-luxury-400 mb-2">
              💎 Wealth Autopilot
            </h2>
            <p className="text-slate-300 text-lg mb-4">
              Genius-level AI that creates viral content while you sleep
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
                {channels.length} Channels Connected
              </span>
              {wealthPlans.length > 0 && (
                <span className="flex items-center gap-2 text-wealth-400 font-semibold">
                  💰 ${totalRevenue.toLocaleString()} Revenue Potential
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <motion.button
              onClick={analyzePortfolio}
              disabled={analyzing || channels.length === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {analyzing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                '🔍 Analyze Portfolio'
              )}
            </motion.button>

            <motion.button
              onClick={generateAllVideos}
              disabled={generating || channels.length === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-wealth-600 to-luxury-600 hover:from-wealth-700 hover:to-luxury-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Creating...
                </span>
              ) : (
                '🚀 Generate All Videos'
              )}
            </motion.button>
          </div>
        </div>

        {/* Progress Bar */}
        {generating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 pt-6 border-t border-slate-700"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 text-sm">{progress.status}</span>
              <span className="text-wealth-400 font-semibold">{progress.current}/{progress.total}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                className="h-full bg-gradient-to-r from-wealth-500 to-luxury-500 rounded-full"
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Portfolio Analysis */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            📊 Portfolio Analysis
          </h3>
          
          <pre className="text-slate-300 text-sm whitespace-pre-wrap bg-slate-950/50 p-4 rounded-xl border border-slate-800 font-mono">
            {analysis.analysis}
          </pre>

          {analysis.opportunities.length > 0 && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-wealth-400 mb-3">💰 Missing Profitable Niches:</h4>
              <div className="grid gap-3">
                {analysis.opportunities.slice(0, 3).map((opp: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gradient-to-r from-wealth-900/30 to-luxury-900/30 p-4 rounded-xl border border-wealth-600/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-bold text-white mb-1">{opp.niche}</h5>
                        <p className="text-slate-400 text-sm mb-2">{opp.reasoning}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-wealth-400 font-semibold">
                            CPM: ${opp.cpm.min}-${opp.cpm.max}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">Profit: {opp.profitPotential}/10</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">Competition: {opp.competition}</span>
                        </div>
                      </div>
                      <span className="text-2xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <p className="mt-4 text-slate-400 text-sm bg-primary-900/20 p-3 rounded-lg border border-primary-600/20">
            💡 {analysis.recommendation}
          </p>
        </motion.div>
      )}

      {/* Trending Topics */}
      {trends.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🔥 Trending Topics (High-Paying Markets)
          </h3>
          
          <div className="grid gap-3">
            {trends.map((trend, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 hover:border-wealth-600/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-semibold text-white mb-1">{trend.topic}</h5>
                    <p className="text-slate-400 text-sm mb-2">{trend.why}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-primary-400">{trend.searchVolume}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{trend.targetCountry}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-wealth-400 font-semibold">${trend.cpm} CPM</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: trend.viralPotential }).map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Wealth Plans */}
      {wealthPlans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-wealth-400 to-luxury-400 mb-4">
            💎 Your Wealth Plans ({wealthPlans.length} Channels)
          </h3>

          {wealthPlans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border-2 border-wealth-600/20 shadow-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">{plan.channelName}</h4>
                  <p className="text-slate-400">{plan.niche}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Realistic Revenue</p>
                  <p className="text-2xl font-bold text-wealth-400">
                    ${plan.estimatedRevenue.realistic.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Strategy */}
              <div className="mb-4">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap bg-slate-950/50 p-4 rounded-xl border border-slate-800 font-mono">
                  {plan.strategy}
                </pre>
              </div>

              {/* First 6 Videos */}
              <div>
                <h5 className="text-lg font-semibold text-white mb-3">🎬 First 6 Videos (Auto-Generated):</h5>
                <div className="grid gap-2">
                  {plan.firstSixVideos.map((video: any, j: number) => (
                    <div
                      key={j}
                      className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 hover:border-wealth-600/30 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm mb-1">{video.title}</p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-slate-400">{video.targetCountry}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-wealth-400">${video.estimatedCPM} CPM</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-yellow-400">
                              {Array.from({ length: Math.min(video.viralPotential, 5) }).map(() => '⭐').join('')}
                            </span>
                          </div>
                        </div>
                        <span className="text-slate-500 font-mono text-xs">#{j + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-400 mb-1">Conservative</p>
                  <p className="text-lg font-bold text-slate-300">
                    ${plan.estimatedRevenue.conservative.toLocaleString()}
                  </p>
                </div>
                <div className="bg-wealth-900/20 p-3 rounded-lg border border-wealth-600/30">
                  <p className="text-xs text-wealth-400 mb-1">Realistic</p>
                  <p className="text-lg font-bold text-wealth-400">
                    ${plan.estimatedRevenue.realistic.toLocaleString()}
                  </p>
                </div>
                <div className="bg-success-900/20 p-3 rounded-lg border border-success-600/30">
                  <p className="text-xs text-success-400 mb-1">Optimistic</p>
                  <p className="text-lg font-bold text-success-400">
                    ${plan.estimatedRevenue.optimistic.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Total Summary */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-wealth-900 via-luxury-900 to-slate-900 rounded-2xl p-8 border-2 border-wealth-600 shadow-2xl text-center"
          >
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-wealth-400 to-luxury-400 mb-2">
              Total Revenue Potential
            </h3>
            <p className="text-6xl font-black text-white mb-2">
              ${totalRevenue.toLocaleString()}
            </p>
            <p className="text-slate-400">
              From {wealthPlans.length} channels × 6 videos = {wealthPlans.length * 6} total videos
            </p>
            <p className="text-wealth-400 mt-4 text-lg">
              💎 All targeting high-paying markets (US, UK, CA, AU)
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Empty State */}
      {channels.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-2xl font-bold text-white mb-2">Ready to Generate Wealth?</h3>
          <p className="text-slate-400 mb-6">Connect your channels first, then let AI do the work</p>
          <a href="/connect">
            <button className="px-8 py-4 bg-gradient-to-r from-wealth-600 to-luxury-600 hover:from-wealth-700 hover:to-luxury-700 text-white font-bold rounded-xl shadow-lg transition-all">
              Connect Channels
            </button>
          </a>
        </motion.div>
      )}
    </div>
  );
}

