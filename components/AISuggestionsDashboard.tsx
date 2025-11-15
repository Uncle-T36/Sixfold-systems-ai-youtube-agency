/**
 * 🤖 AI SUGGESTIONS DASHBOARD
 * Shows ALL AI analysis, suggestions, and actionable recommendations in one place
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUrgentNotifications, getAllAnalyses } from '../lib/channelAnalyzer';

interface Suggestion {
  id: string;
  type: 'money' | 'growth' | 'urgent' | 'improvement' | 'warning';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  channelName?: string;
  timestamp: string;
}

export default function AISuggestionsDashboard() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [filter, setFilter] = useState<'all' | 'money' | 'growth' | 'urgent'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadAllSuggestions();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadAllSuggestions, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAllSuggestions = () => {
    const allSuggestions: Suggestion[] = [];

    // 1. Get channel analysis suggestions
    const analyses = getAllAnalyses();
    analyses.forEach((analysis: any) => {
      // Money-making opportunities
      analysis.analysis.moneyMakingOpportunities?.forEach((opp: string, idx: number) => {
        allSuggestions.push({
          id: `money-${analysis.channelId}-${idx}`,
          type: 'money',
          title: '💰 Money-Making Opportunity',
          description: opp,
          priority: 'high',
          channelName: analysis.channelName,
          timestamp: analysis.analyzedAt
        });
      });

      // Subscriber growth tips
      analysis.analysis.subscriberGrowthTips?.forEach((tip: string, idx: number) => {
        allSuggestions.push({
          id: `growth-${analysis.channelId}-${idx}`,
          type: 'growth',
          title: '📈 Growth Strategy',
          description: tip,
          priority: 'medium',
          channelName: analysis.channelName,
          timestamp: analysis.analyzedAt
        });
      });

      // Urgent actions
      analysis.analysis.urgentActions?.forEach((action: string, idx: number) => {
        allSuggestions.push({
          id: `urgent-${analysis.channelId}-${idx}`,
          type: 'urgent',
          title: '🚨 Urgent Action Required',
          description: action,
          action: 'Take action now',
          priority: 'high',
          channelName: analysis.channelName,
          timestamp: analysis.analyzedAt
        });
      });

      // Description improvements
      analysis.analysis.descriptionSuggestions?.forEach((sugg: string, idx: number) => {
        allSuggestions.push({
          id: `improve-${analysis.channelId}-${idx}`,
          type: 'improvement',
          title: '✍️ Description Improvement',
          description: sugg,
          priority: 'medium',
          channelName: analysis.channelName,
          timestamp: analysis.analyzedAt
        });
      });

      // Weaknesses to address
      analysis.analysis.weaknesses?.forEach((weak: string, idx: number) => {
        allSuggestions.push({
          id: `warning-${analysis.channelId}-${idx}`,
          type: 'warning',
          title: '⚠️ Area to Improve',
          description: weak,
          priority: 'low',
          channelName: analysis.channelName,
          timestamp: analysis.analyzedAt
        });
      });
    });

    // 2. Check for missing critical setup
    const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
    const bankAccount = localStorage.getItem('owner_bank_account');
    
    if (channels.length > 0 && !bankAccount) {
      allSuggestions.push({
        id: 'missing-bank',
        type: 'urgent',
        title: '🚨 Payment Setup Required',
        description: 'Add your bank account to receive payments from your channels',
        action: 'Set up payment',
        priority: 'high',
        timestamp: new Date().toISOString()
      });
    }

    // 3. Check for channels without videos
    channels.forEach((channel: any) => {
      const videos = JSON.parse(localStorage.getItem(`videos_${channel.id}`) || '[]');
      if (videos.length === 0) {
        allSuggestions.push({
          id: `no-videos-${channel.id}`,
          type: 'urgent',
          title: '📹 Generate First Video',
          description: `Channel "${channel.name}" has no videos yet. Generate your first video to start earning!`,
          action: 'Generate video',
          priority: 'high',
          channelName: channel.name,
          timestamp: new Date().toISOString()
        });
      }
    });

    // 4. Check autopilot status
    const autopilotEnabled = localStorage.getItem('autopilot_enabled') === 'true';
    if (channels.length > 0 && !autopilotEnabled) {
      allSuggestions.push({
        id: 'enable-autopilot',
        type: 'money',
        title: '🤖 Enable Autopilot Mode',
        description: 'Turn on 24/7 automation to generate videos, optimize thumbnails, and maximize revenue while you sleep',
        action: 'Enable autopilot',
        priority: 'high',
        timestamp: new Date().toISOString()
      });
    }

    // Sort by priority and timestamp
    allSuggestions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    setSuggestions(allSuggestions);
  };

  const filteredSuggestions = suggestions.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'money') return s.type === 'money';
    if (filter === 'growth') return s.type === 'growth';
    if (filter === 'urgent') return s.type === 'urgent';
    return true;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'money': return 'from-green-500 to-teal-500';
      case 'growth': return 'from-blue-500 to-cyan-500';
      case 'urgent': return 'from-red-500 to-orange-500';
      case 'improvement': return 'from-emerald-500 to-yellow-500';
      case 'warning': return 'from-yellow-500 to-orange-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'money': return '💰';
      case 'growth': return '📈';
      case 'urgent': return '🚨';
      case 'improvement': return '✍️';
      case 'warning': return '⚠️';
      default: return '💡';
    }
  };

  const handleAction = (suggestion: Suggestion) => {
    if (suggestion.id === 'missing-bank') {
      window.location.href = '/payment-setup';
    } else if (suggestion.id === 'enable-autopilot') {
      localStorage.setItem('autopilot_enabled', 'true');
      loadAllSuggestions();
    } else if (suggestion.id.startsWith('no-videos-')) {
      window.location.href = '/dashboard';
    }
  };

  if (suggestions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700 text-center"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-white mb-2">All Caught Up!</h3>
        <p className="text-slate-400">
          No new suggestions right now. Connect a channel with a description to get AI-powered recommendations.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">🤖 AI Suggestions</h2>
          <p className="text-slate-400">
            {suggestions.length} recommendation{suggestions.length !== 1 ? 's' : ''} to boost your revenue & growth
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: '📋 All', count: suggestions.length },
          { id: 'money', label: '💰 Money', count: suggestions.filter(s => s.type === 'money').length },
          { id: 'growth', label: '📈 Growth', count: suggestions.filter(s => s.type === 'growth').length },
          { id: 'urgent', label: '🚨 Urgent', count: suggestions.filter(s => s.type === 'urgent').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filter === tab.id
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredSuggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border-2 border-slate-700 hover:border-teal-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl cursor-pointer"
              onClick={() => setExpandedId(expandedId === suggestion.id ? null : suggestion.id)}
            >
              {/* Priority Badge */}
              {suggestion.priority === 'high' && (
                <div className="inline-flex items-center space-x-1 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-400 font-semibold mb-3">
                  <span>🔥</span>
                  <span>HIGH PRIORITY</span>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${getTypeColor(suggestion.type)} rounded-xl flex-shrink-0`}>
                  <span className="text-2xl">{getTypeIcon(suggestion.type)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-1">{suggestion.title}</h3>
                  {suggestion.channelName && (
                    <p className="text-xs text-slate-500">
                      📺 {suggestion.channelName}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {suggestion.description}
              </p>

              {/* Action Button */}
              {suggestion.action && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(suggestion);
                  }}
                  className={`w-full px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${getTypeColor(suggestion.type)} hover:shadow-lg transform hover:scale-[1.02] transition-all`}
                >
                  {suggestion.action}
                </button>
              )}

              {/* Timestamp */}
              <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-500">
                {new Date(suggestion.timestamp).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

