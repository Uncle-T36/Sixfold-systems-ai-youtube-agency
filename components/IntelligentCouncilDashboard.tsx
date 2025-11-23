import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeChannelPortfolio, type CouncilInsights } from '../lib/intelligentChannelCouncil';
import { scrapeAllSources, type ScrapedStory } from '../lib/realWorldDataScraper';

export default function IntelligentCouncilDashboard() {
  const [analyzing, setAnalyzing] = useState(false);
  const [insights, setInsights] = useState<CouncilInsights | null>(null);
  const [scrapedStories, setScrapedStories] = useState<ScrapedStory[]>([]);
  const [newsApiKey, setNewsApiKey] = useState('');
  const [scraping, setScraping] = useState(false);

  // Run analysis on component mount
  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const result = await analyzeChannelPortfolio(newsApiKey || undefined);
      setInsights(result);
      
      setTimeout(() => {
        alert(`🧠 INTELLIGENT COUNCIL ANALYSIS COMPLETE!\n\n📊 Portfolio Health: ${result.portfolioHealth}%\n💰 Total Estimated Revenue: $${result.totalEstimatedRevenue.toLocaleString()}/month\n📺 ${result.totalChannels} channels analyzed\n\n${result.actionItems.slice(0, 3).join('\n')}`);
      }, 500);
    } catch (error: any) {
      alert(error.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const scrapeRealStories = async () => {
    setScraping(true);
    try {
      const stories = await scrapeAllSources({
        newsApiKey: newsApiKey || undefined,
        categories: ['mystery', 'crime', 'paranormal', 'history', 'tech'],
        limit: 50
      });
      
      setScrapedStories(stories);
      
      // Save to localStorage
      localStorage.setItem('scraped_real_stories', JSON.stringify(stories));
      
      alert(`✅ REAL STORIES SCRAPED!\n\n📰 ${stories.length} true stories found\n🔥 From Reddit, Wikipedia, HackerNews\n⭐ Top viral score: ${Math.max(...stories.map(s => s.viralScore))}%\n\nStories are ready to generate videos!`);
    } catch (error) {
      console.error('Scraping error:', error);
      alert('Story scraping failed. Check console for details.');
    } finally {
      setScraping(false);
    }
  };

  const createVideoFromStory = (story: ScrapedStory) => {
    // Save story to pending video creation
    localStorage.setItem('pending_video_creation', JSON.stringify({
      title: story.title,
      script: `${story.content}\n\nSource: ${story.source}\n${story.sourceUrl}`,
      category: story.category,
      viralScore: story.viralScore
    }));
    
    // Redirect to video creator
    window.location.href = '/video-creator';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            🧠 Intelligent Channel Council
          </h1>
          <p className="text-slate-300 text-xl mb-6">
            AI-powered system that analyzes all your channels and scrapes real world stories
          </p>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 transition-all"
            >
              {analyzing ? '🔄 Analyzing...' : '🧠 Analyze All Channels'}
            </button>
            
            <button
              onClick={scrapeRealStories}
              disabled={scraping}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 transition-all"
            >
              {scraping ? '🔄 Scraping...' : '🌍 Scrape Real Stories'}
            </button>
          </div>
        </motion.div>

        {/* Portfolio Overview */}
        {insights && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-2 border-purple-500/30 rounded-2xl">
              <div className="text-purple-400 text-sm font-semibold mb-2">PORTFOLIO HEALTH</div>
              <div className="text-white text-4xl font-bold mb-2">{insights.portfolioHealth}%</div>
              <div className="text-purple-300 text-xs">
                {insights.portfolioHealth >= 80 ? 'Excellent' : insights.portfolioHealth >= 60 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-500/30 rounded-2xl">
              <div className="text-green-400 text-sm font-semibold mb-2">MONTHLY REVENUE</div>
              <div className="text-white text-3xl font-bold mb-2">${insights.totalEstimatedRevenue.toLocaleString()}</div>
              <div className="text-green-300 text-xs">{insights.totalChannels} channels</div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500/30 rounded-2xl">
              <div className="text-blue-400 text-sm font-semibold mb-2">TOTAL SUBSCRIBERS</div>
              <div className="text-white text-3xl font-bold mb-2">{insights.totalSubcribers.toLocaleString()}</div>
              <div className="text-blue-300 text-xs">Across all channels</div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500/30 rounded-2xl">
              <div className="text-yellow-400 text-sm font-semibold mb-2">TOP NICHE</div>
              <div className="text-white text-2xl font-bold mb-2 capitalize">{insights.topPerformingNiche}</div>
              <div className="text-yellow-300 text-xs">Highest performing</div>
            </div>
          </motion.div>
        )}

        {/* Action Items */}
        {insights && insights.actionItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 rounded-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              🎯 Priority Action Items
            </h2>
            <div className="space-y-3">
              {insights.actionItems.map((action, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl">
                  <span className="text-2xl">{i === 0 ? '🔥' : i === 1 ? '⚡' : '💡'}</span>
                  <div>
                    <div className="text-white font-semibold">{action}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Channel Analyses */}
        {insights && insights.channelAnalyses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">📺 Channel Deep Dive</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insights.channelAnalyses.map((analysis, i) => (
                <div key={i} className="p-6 bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={analysis.channel.thumbnailUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(analysis.channel.name)}&size=64`}
                      alt={analysis.channel.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{analysis.channel.name}</h3>
                      <div className="text-slate-400 text-sm">{analysis.channel.subscriberCount.toLocaleString()} subscribers</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                      <div className="text-purple-400 text-xs font-semibold mb-1">NICHE</div>
                      <div className="text-white text-sm font-bold capitalize">{analysis.detectedNiche}</div>
                    </div>
                    <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <div className="text-green-400 text-xs font-semibold mb-1">REVENUE/MONTH</div>
                      <div className="text-white text-sm font-bold">${analysis.estimatedMonthlyRevenue.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <div className="text-blue-400 text-xs font-semibold mb-1">GROWTH</div>
                      <div className="text-white text-sm font-bold">{analysis.growthPotential}%</div>
                    </div>
                    <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                      <div className="text-yellow-400 text-xs font-semibold mb-1">VIDEO LENGTH</div>
                      <div className="text-white text-sm font-bold">{Math.floor(analysis.optimalVideoLength / 60)} min</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {analysis.suggestions.slice(0, 3).map((suggestion, j) => (
                      <div key={j} className="text-sm text-slate-300 flex items-start gap-2">
                        <span>💡</span>
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* New Channel Suggestions */}
        {insights && insights.newChannelSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">🆕 Profitable Channel Ideas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insights.newChannelSuggestions.map((suggestion, i) => (
                <div key={i} className="p-6 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-2 border-emerald-500/30 rounded-2xl">
                  <h3 className="text-2xl font-bold text-white mb-2">{suggestion.name}</h3>
                  <div className="text-emerald-400 font-semibold mb-4 capitalize">{suggestion.niche}</div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="text-sm text-slate-300">{suggestion.description}</div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">💰</span>
                      <span className="text-white font-semibold">${suggestion.estimatedMonthlyRevenue.toLocaleString()}/mo</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">🔥</span>
                      <span className="text-white font-semibold">{suggestion.viralPotential}% Viral Rate</span>
                    </div>
                    
                    <div className="text-xs text-slate-400">{suggestion.whyProfitable}</div>
                  </div>
                  
                  <button className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition">
                    Create This Channel
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Scraped Real Stories */}
        {scrapedStories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">🌍 Real World Stories (Scraped Live)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scrapedStories.slice(0, 12).map((story, i) => (
                <div key={i} className="p-5 bg-slate-800/50 border-2 border-slate-700/50 rounded-xl hover:border-cyan-500/50 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 text-xs font-semibold capitalize">
                      {story.category}
                    </div>
                    <div className="text-yellow-400 font-bold text-sm">{story.viralScore}% 🔥</div>
                  </div>
                  
                  <h3 className="text-white font-bold mb-2 line-clamp-2 group-hover:text-cyan-400 transition">
                    {story.title}
                  </h3>
                  
                  <div className="text-slate-400 text-sm mb-3 line-clamp-3">
                    {story.content}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>📰 {story.source}</span>
                    <span>👁️ {(story.estimatedViews / 1000).toFixed(0)}K views</span>
                  </div>
                  
                  <button
                    onClick={() => createVideoFromStory(story)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg transition"
                  >
                    🎬 Create Video
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Market Trends */}
        {insights && insights.marketTrends.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">📈 Market Trends</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insights.marketTrends.map((trend, i) => (
                <div key={i} className="p-6 bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white capitalize">{trend.niche}</h3>
                    <span className="text-2xl">{trend.trendingUp ? '📈' : '📉'}</span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Profitability</span>
                      <span className="text-green-400 font-bold">{trend.profitability}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Competition</span>
                      <span className="text-yellow-400 font-bold">{trend.competitionLevel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Monthly Searches</span>
                      <span className="text-blue-400 font-bold">{(trend.monthlySearchVolume / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-300">{trend.reasoning}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
