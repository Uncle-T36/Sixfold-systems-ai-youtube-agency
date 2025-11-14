/**
 * 🧠 STRATEGIC AI ADVISOR COMPONENT
 * Interactive strategic advisor that asks questions and provides Machiavellian insights
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  analyzeStrategicPosition,
  generateStrategicQuestions,
  getMarketIntelligence,
  generateStrategicAdvice,
  getQuickAdvice,
  type StrategicOpportunity,
  type StrategicQuestion,
  type UserProfile
} from '../lib/strategicAdvisor';
import {
  predictViralTrends,
  getTrendSignals,
  generateContentRecommendations,
  detectAlgorithmChanges,
  findUntappedNiches,
  type PredictedTrend
} from '../lib/trendPredictor';

type ViewMode = 'onboarding' | 'opportunities' | 'questions' | 'intelligence' | 'advice' | 'trends';

export default function StrategicAdvisorDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('opportunities');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [opportunities, setOpportunities] = useState<StrategicOpportunity[]>([]);
  const [questions, setQuestions] = useState<StrategicQuestion[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<StrategicOpportunity | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    // Load from localStorage
    const channelsData = localStorage.getItem('channels');
    const channels = channelsData ? JSON.parse(channelsData) : [];
    
    const totalRevenue = channels.reduce((sum: number, ch: any) => sum + (ch.totalRevenue || 0), 0);
    const monthlyViews = channels.reduce((sum: number, ch: any) => {
      const videos = ch.videos || [];
      return sum + videos.reduce((vSum: number, v: any) => vSum + (v.views || 0), 0);
    }, 0);

    const niches = [...new Set(channels.map((ch: any) => ch.niche).filter(Boolean))] as string[];

    const userProfile: UserProfile = {
      channels,
      totalRevenue,
      monthlyViews,
      niches,
      resources: {
        budget: 0,
        timePerWeek: 0,
        team: 1,
        skills: []
      },
      goals: {
        monthlyRevenue: totalRevenue * 3 || 10000,
        timeframe: 3,
        priority: 'revenue'
      }
    };

    setProfile(userProfile);
    
    // Generate strategic analysis
    const opps = analyzeStrategicPosition(userProfile);
    setOpportunities(opps);
    
    const qs = generateStrategicQuestions(userProfile);
    setQuestions(qs);
  };

  const handleAnswerQuestion = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Strategic AI Advisor</h1>
            <p className="text-slate-400 text-sm">Machiavellian intelligence for maximum profitability</p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={() => setViewMode('opportunities')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              viewMode === 'opportunities'
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            💎 Opportunities
          </button>
          <button
            onClick={() => setViewMode('trends')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              viewMode === 'trends'
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            🔮 Viral Trends
          </button>
          <button
            onClick={() => setViewMode('questions')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              viewMode === 'questions'
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            ❓ Strategic Questions
          </button>
          <button
            onClick={() => setViewMode('intelligence')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              viewMode === 'intelligence'
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            🔍 Market Intelligence
          </button>
          <button
            onClick={() => setViewMode('advice')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              viewMode === 'advice'
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            🎯 Get Advice
          </button>
        </div>
      </div>

      {/* Current State Summary */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-green-600/20">
            <p className="text-green-400 text-sm mb-1">Current Revenue</p>
            <p className="text-2xl font-bold text-white">${profile.totalRevenue.toLocaleString()}/mo</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-yellow-600/20">
            <p className="text-yellow-400 text-sm mb-1">Goal</p>
            <p className="text-2xl font-bold text-white">${profile.goals.monthlyRevenue.toLocaleString()}/mo</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-orange-600/20">
            <p className="text-orange-400 text-sm mb-1">Gap to Close</p>
            <p className="text-2xl font-bold text-white">${(profile.goals.monthlyRevenue - profile.totalRevenue).toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-red-600/20">
            <p className="text-red-400 text-sm mb-1">Timeline</p>
            <p className="text-2xl font-bold text-white">{profile.goals.timeframe} months</p>
          </div>
        </div>
      )}

      {/* OPPORTUNITIES VIEW */}
      {viewMode === 'opportunities' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-xl p-4">
            <p className="text-yellow-400 font-bold mb-2">🎯 Strategic Analysis Complete</p>
            <p className="text-slate-300 text-sm">
              I've analyzed {opportunities.length} potential strategies based on market intelligence, competitive positioning, 
              and your current resources. These are ranked by urgency, success probability, and potential ROI.
            </p>
          </div>

          {opportunities.map((opp, idx) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-yellow-600/50 transition-all cursor-pointer"
              onClick={() => setSelectedOpportunity(opp)}
            >
              {/* Urgency Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '💡'}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{opp.title}</h3>
                    <p className="text-slate-400 text-sm">{opp.category}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  opp.urgency === 'critical' ? 'bg-red-600/20 text-red-400' :
                  opp.urgency === 'high' ? 'bg-orange-600/20 text-orange-400' :
                  opp.urgency === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
                  'bg-green-600/20 text-green-400'
                }`}>
                  {opp.urgency.toUpperCase()}
                </div>
              </div>

              <p className="text-slate-300 mb-4">{opp.description}</p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Potential Revenue</p>
                  <p className="text-green-400 font-bold">+${opp.potentialRevenue.toLocaleString()}/mo</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Time to Profit</p>
                  <p className="text-yellow-400 font-bold">{opp.timeToProfit} days</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Success Rate</p>
                  <p className="text-blue-400 font-bold">{opp.successProbability}%</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Moat Strength</p>
                  <p className="text-emerald-400 font-bold">{opp.moatStrength}/10</p>
                </div>
              </div>

              {/* Competitive Advantage */}
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mb-3">
                <p className="text-yellow-400 font-bold text-sm mb-1">⚡ Competitive Advantage:</p>
                <p className="text-slate-300 text-sm">{opp.competitiveAdvantage}</p>
              </div>

              {/* Reasoning */}
              <div className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm mb-1">🧠 <strong>Why This Works:</strong></p>
                <p className="text-slate-300 text-sm">{opp.reasoning}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* VIRAL TRENDS VIEW */}
      {viewMode === 'trends' && <ViralTrendsView />}

      {/* STRATEGIC QUESTIONS VIEW */}
      {viewMode === 'questions' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-900/20 to-emerald-900/20 border border-blue-600/30 rounded-xl p-4">
            <p className="text-blue-400 font-bold mb-2">❓ Strategic Questions</p>
            <p className="text-slate-300 text-sm">
              To provide optimal strategic advice, I need to understand your situation deeply. 
              Answer these questions honestly - they determine which opportunities you should pursue.
            </p>
          </div>

          {questions.map((q, idx) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl">
                  {q.category === 'resources' ? '💼' :
                   q.category === 'goals' ? '🎯' :
                   q.category === 'market' ? '📊' :
                   q.category === 'competition' ? '⚔️' :
                   q.category === 'timing' ? '⏱️' : '🎲'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold">{q.question}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-600/20 text-yellow-400">
                      Priority: {q.priority}/10
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">🤔 Why This Matters:</p>
                      <p className="text-slate-300 text-sm">{q.why}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">💡 What This Unlocks:</p>
                      <p className="text-slate-300 text-sm">{q.impact}</p>
                    </div>
                  </div>

                  <textarea
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswerQuestion(q.id, e.target.value)}
                    placeholder="Your honest answer..."
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-600 transition-colors"
                    rows={3}
                  />
                </div>
              </div>
            </motion.div>
          ))}

          <button
            onClick={() => setViewMode('advice')}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
          >
            Generate Personalized Strategy →
          </button>
        </div>
      )}

      {/* MARKET INTELLIGENCE VIEW */}
      {viewMode === 'intelligence' && <MarketIntelligenceView />}

      {/* STRATEGIC ADVICE VIEW */}
      {viewMode === 'advice' && profile && (
        <StrategicAdviceView profile={profile} opportunities={opportunities} />
      )}

      {/* OPPORTUNITY DETAIL MODAL */}
      <AnimatePresence>
        {selectedOpportunity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedOpportunity(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 rounded-2xl p-8 max-w-4xl max-h-[90vh] overflow-y-auto border border-yellow-600/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedOpportunity.title}</h2>
                  <p className="text-slate-400">{selectedOpportunity.category}</p>
                </div>
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-green-600/20">
                    <p className="text-green-400 text-sm mb-1">Revenue Potential</p>
                    <p className="text-2xl font-bold text-white">+${selectedOpportunity.potentialRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-yellow-600/20">
                    <p className="text-yellow-400 text-sm mb-1">Time to Profit</p>
                    <p className="text-2xl font-bold text-white">{selectedOpportunity.timeToProfit} days</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-600/20">
                    <p className="text-blue-400 text-sm mb-1">Success Rate</p>
                    <p className="text-2xl font-bold text-white">{selectedOpportunity.successProbability}%</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-emerald-600/20">
                    <p className="text-emerald-400 text-sm mb-1">Moat Strength</p>
                    <p className="text-2xl font-bold text-white">{selectedOpportunity.moatStrength}/10</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-orange-600/20">
                    <p className="text-orange-400 text-sm mb-1">Capital Required</p>
                    <p className="text-2xl font-bold text-white">${selectedOpportunity.capitalRequired.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-red-600/20">
                    <p className="text-red-400 text-sm mb-1">Market Size</p>
                    <p className="text-xl font-bold text-white">{selectedOpportunity.marketSize}</p>
                  </div>
                </div>

                {/* Description & Reasoning */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-white font-bold text-lg mb-3">📋 Overview</h3>
                  <p className="text-slate-300 mb-4">{selectedOpportunity.description}</p>
                  <h4 className="text-yellow-400 font-bold mb-2">🧠 Strategic Reasoning:</h4>
                  <p className="text-slate-300">{selectedOpportunity.reasoning}</p>
                </div>

                {/* Competitive Advantage */}
                <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-xl p-6">
                  <h3 className="text-yellow-400 font-bold text-lg mb-3">⚡ Your Competitive Advantage</h3>
                  <p className="text-slate-300">{selectedOpportunity.competitiveAdvantage}</p>
                </div>

                {/* Action Plan */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-white font-bold text-lg mb-4">🎯 Step-by-Step Action Plan</h3>
                  <div className="space-y-3">
                    {selectedOpportunity.actions.map((action, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">{idx + 1}</span>
                        </div>
                        <p className="text-slate-300 pt-1">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KPIs */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-white font-bold text-lg mb-4">📊 Success Metrics (KPIs)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedOpportunity.kpis.map((kpi, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-3">
                        <span className="text-green-400">✓</span>
                        <span className="text-slate-300 text-sm">{kpi}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risks */}
                <div className="bg-red-900/20 border border-red-600/30 rounded-xl p-6">
                  <h3 className="text-red-400 font-bold text-lg mb-4">⚠️ Risks & Challenges</h3>
                  <div className="space-y-2">
                    {selectedOpportunity.risks.map((risk, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span className="text-slate-300 text-sm">{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitors */}
                {selectedOpportunity.competitors.length > 0 && (
                  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-white font-bold text-lg mb-4">🔍 Key Competitors</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedOpportunity.competitors.map((comp, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-900/50 rounded-full text-slate-300 text-sm">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    // Save to action plan
                    alert('This opportunity has been added to your action plan!');
                    setSelectedOpportunity(null);
                  }}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl transition-all"
                >
                  Add to Action Plan →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Market Intelligence Sub-Component
function MarketIntelligenceView() {
  const intelligence = getMarketIntelligence();

  return (
    <div className="space-y-6">
      {/* Emerging Trends */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">🚀 Emerging Trends (First-Mover Opportunities)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intelligence.emergingTrends.map((trend, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-bold text-lg">{trend.trend}</h3>
                <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-bold">
                  +{trend.growthRate}%
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <p className="text-slate-400 text-xs">Time to Saturation</p>
                  <p className="text-white font-bold">{trend.timeToSaturation} days</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <p className="text-slate-400 text-xs">Current Players</p>
                  <p className="text-white font-bold">{trend.currentPlayers}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <p className="text-slate-400 text-xs">Entry Difficulty</p>
                  <p className="text-white font-bold">{trend.entryDifficulty}/10</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <p className="text-slate-400 text-xs">Profitability</p>
                  <p className="text-yellow-400 font-bold">{trend.profitability}/10</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Gaps */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">🎯 Untapped Market Gaps</h2>
        <div className="space-y-4">
          {intelligence.marketGaps.map((gap, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-yellow-600/30">
              <h3 className="text-yellow-400 font-bold text-lg mb-2">{gap.gap}</h3>
              <p className="text-slate-300 mb-4">{gap.reasoning}</p>
              
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs">Audience</p>
                  <p className="text-white font-bold text-sm">{gap.audience}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs">Demand</p>
                  <p className="text-green-400 font-bold">{gap.estimatedDemand.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs">Competition</p>
                  <p className="text-yellow-400 font-bold">{gap.competition} players</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs">CPM</p>
                  <p className="text-green-400 font-bold">${gap.cpm}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Changes */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">📱 Platform Changes & Opportunities</h2>
        <div className="space-y-3">
          {intelligence.platformChanges.map((change, idx) => (
            <div key={idx} className={`rounded-xl p-4 border ${
              change.impact === 'positive' ? 'bg-green-900/20 border-green-600/30' :
              change.impact === 'negative' ? 'bg-red-900/20 border-red-600/30' :
              'bg-slate-800/50 border-slate-700'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-white">{change.platform}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      change.impact === 'positive' ? 'bg-green-600/20 text-green-400' :
                      change.impact === 'negative' ? 'bg-red-600/20 text-red-400' :
                      'bg-slate-600/20 text-slate-400'
                    }`}>
                      {change.impact}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{change.change}</p>
                  <p className="text-yellow-400 text-sm"><strong>Strategy:</strong> {change.strategy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Threats */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">⚔️ Competitive Threats & Counter-Strategies</h2>
        <div className="space-y-3">
          {intelligence.competitiveThreats.map((threat, idx) => (
            <div key={idx} className="bg-red-900/20 border border-red-600/30 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-red-400 font-bold">{threat.competitor}</h3>
                <span className="text-slate-400 text-sm">{threat.timing}</span>
              </div>
              <p className="text-slate-300 text-sm mb-2">{threat.threat}</p>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-green-400 text-sm"><strong>Counter-Strategy:</strong> {threat.counterStrategy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Strategic Advice Sub-Component
function StrategicAdviceView({ profile, opportunities }: { profile: UserProfile; opportunities: StrategicOpportunity[] }) {
  const advice = generateStrategicAdvice(profile, opportunities);
  
  return (
    <div className="bg-slate-800/50 rounded-xl p-8 border border-yellow-600/30">
      <div className="prose prose-invert max-w-none">
        <div className="whitespace-pre-wrap text-slate-300" style={{ lineHeight: '1.8' }}>
          {advice.split('\n').map((line, idx) => {
            if (line.startsWith('##')) {
              return <h2 key={idx} className="text-2xl font-bold text-white mt-6 mb-4">{line.replace('##', '')}</h2>;
            }
            if (line.startsWith('###')) {
              return <h3 key={idx} className="text-xl font-bold text-yellow-400 mt-4 mb-3">{line.replace('###', '')}</h3>;
            }
            if (line.startsWith('####')) {
              return <h4 key={idx} className="text-lg font-bold text-white mt-3 mb-2">{line.replace('####', '')}</h4>;
            }
            if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={idx} className="font-bold text-white my-2">{line.replace(/\*\*/g, '')}</p>;
            }
            if (line.trim().startsWith('-') || line.trim().match(/^\d+\./)) {
              return <li key={idx} className="text-slate-300 ml-4">{line.replace(/^[-\d.]+\s*/, '')}</li>;
            }
            if (line.trim()) {
              return <p key={idx} className="text-slate-300 my-2">{line}</p>;
            }
            return <br key={idx} />;
          })}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-700">
        <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl transition-all">
          Download Full Strategic Plan (PDF)
        </button>
      </div>
    </div>
  );
}

// Viral Trends View Component
function ViralTrendsView() {
  const trends = predictViralTrends();
  const signals = getTrendSignals();
  const algorithmChanges = detectAlgorithmChanges();
  const untappedNiches = findUntappedNiches();
  const [selectedTrend, setSelectedTrend] = useState<PredictedTrend | null>(null);

  return (
    <div className="space-y-6">
      {/* Trend Signals */}
      <div className="bg-gradient-to-r from-emerald-900/20 to-pink-900/20 border border-emerald-600/30 rounded-xl p-4">
        <h3 className="text-emerald-400 font-bold text-lg mb-3">📡 Live Trend Signals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {signals.map((signal, idx) => (
            <div key={idx} className="bg-slate-900/50 rounded-lg p-3 flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  signal.strength >= 8 ? 'bg-red-500 animate-pulse' :
                  signal.strength >= 6 ? 'bg-orange-500' :
                  'bg-yellow-500'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-slate-400 text-xs mb-1">{signal.source}</p>
                <p className="text-white text-sm font-semibold">{signal.signal}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-emerald-600 to-pink-600 h-1.5 rounded-full"
                      style={{ width: `${signal.strength * 10}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{signal.strength}/10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predicted Viral Trends */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">🔮 Predicted Viral Trends (48-72 Hour Window)</h2>
        <div className="space-y-4">
          {trends.map((trend, idx) => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-emerald-600/50 transition-all cursor-pointer"
              onClick={() => setSelectedTrend(trend)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-bold text-lg">{trend.topic}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      trend.urgency === 'critical' ? 'bg-red-600/20 text-red-400 animate-pulse' :
                      trend.urgency === 'high' ? 'bg-orange-600/20 text-orange-400' :
                      'bg-yellow-600/20 text-yellow-400'
                    }`}>
                      {trend.urgency.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                    <span>📊 {trend.category}</span>
                    <span>⏰ {trend.hoursUntilPeak}h until peak</span>
                    <span>🎯 {trend.competitionLevel} competition</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-pink-400">
                    {trend.viralProbability}%
                  </div>
                  <p className="text-slate-400 text-xs">Viral Probability</p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs">Est. Views</p>
                  <p className="text-green-400 font-bold">{(trend.estimatedViews / 1000).toFixed(0)}K</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs">Est. Revenue</p>
                  <p className="text-green-400 font-bold">${(trend.estimatedRevenue / 1000).toFixed(0)}K</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs">Growth Rate</p>
                  <p className="text-emerald-400 font-bold">+{trend.growthRate}%</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs">First-Mover</p>
                  <p className="text-yellow-400 font-bold">{trend.firstMoverAdvantage}/10</p>
                </div>
              </div>

              {/* Reasoning */}
              <div className="bg-emerald-900/20 border border-emerald-600/30 rounded-lg p-3 mb-3">
                <p className="text-emerald-400 font-bold text-sm mb-1">🧠 Why This Will Go Viral:</p>
                <p className="text-slate-300 text-sm">{trend.reasoning}</p>
              </div>

              {/* Content Angles Preview */}
              <div>
                <p className="text-slate-400 text-sm mb-2">📝 Content Angle Ideas:</p>
                <div className="flex flex-wrap gap-2">
                  {trend.contentAngles.slice(0, 2).map((angle, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-900/50 rounded-full text-slate-300 text-xs">
                      {angle}
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-emerald-600/20 rounded-full text-emerald-400 text-xs font-bold">
                    +{trend.contentAngles.length - 2} more
                  </span>
                </div>
              </div>

              {/* Stage indicator */}
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 bg-slate-900/50 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      trend.currentStage === 'emerging' ? 'bg-gradient-to-r from-green-600 to-yellow-600 w-1/4' :
                      trend.currentStage === 'rising' ? 'bg-gradient-to-r from-yellow-600 to-orange-600 w-1/2' :
                      trend.currentStage === 'peaking' ? 'bg-gradient-to-r from-orange-600 to-red-600 w-3/4' :
                      'bg-red-600 w-full'
                    }`}
                  />
                </div>
                <span className="text-xs text-slate-400 capitalize">{trend.currentStage}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Algorithm Changes */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">⚙️ Recent Algorithm Changes</h2>
        <div className="space-y-3">
          {algorithmChanges.map((change, idx) => (
            <div key={idx} className={`rounded-xl p-4 border ${
              change.impact === 'high' ? 'bg-red-900/20 border-red-600/30' : 'bg-yellow-900/20 border-yellow-600/30'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-white font-bold">{change.platform}</h3>
                  <p className="text-slate-300 text-sm">{change.change}</p>
                </div>
                <span className="text-xs text-slate-400">{change.detected}</span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 mt-3">
                <p className="text-green-400 text-sm"><strong>Action:</strong> {change.action}</p>
                <p className="text-emerald-400 text-sm mt-1"><strong>Expected Boost:</strong> {change.expectedBoost}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Untapped Niches */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">💎 Untapped Niche Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {untappedNiches.map((niche, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-green-600/30">
              <h3 className="text-green-400 font-bold text-lg mb-2">{niche.niche}</h3>
              <p className="text-slate-300 text-sm mb-4">{niche.whyUntapped}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <p className="text-slate-400 text-xs">Audience Size</p>
                  <p className="text-white font-bold text-sm">{niche.size}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <p className="text-slate-400 text-xs">Competition</p>
                  <p className="text-green-400 font-bold text-sm">{niche.competition}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <p className="text-slate-400 text-xs">CPM</p>
                  <p className="text-yellow-400 font-bold text-sm">${niche.cpm}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2">
                  <p className="text-slate-400 text-xs">Est. Revenue</p>
                  <p className="text-green-400 font-bold text-sm">${(niche.estimatedRevenue / 1000).toFixed(0)}K/mo</p>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-xs mb-2">Content Ideas:</p>
                <div className="space-y-1">
                  {niche.contentIdeas.map((idea, i) => (
                    <p key={i} className="text-slate-300 text-sm">• {idea}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Detail Modal */}
      <AnimatePresence>
        {selectedTrend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedTrend(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 rounded-2xl p-8 max-w-4xl max-h-[90vh] overflow-y-auto border border-emerald-600/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedTrend.topic}</h2>
                  <p className="text-slate-400">{selectedTrend.category}</p>
                </div>
                <button
                  onClick={() => setSelectedTrend(null)}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Full Content Recommendations */}
              <div className="space-y-6">
                <div className="bg-emerald-900/20 border border-emerald-600/30 rounded-xl p-6">
                  <h3 className="text-emerald-400 font-bold text-lg mb-4">📹 Video Ideas</h3>
                  {generateContentRecommendations(selectedTrend).videoIdeas.map((video, idx) => (
                    <div key={idx} className="bg-slate-900/50 rounded-lg p-4 mb-3">
                      <h4 className="text-white font-bold mb-2">{video.title}</h4>
                      <p className="text-green-400 text-sm mb-2">🎯 Hook: "{video.hook}"</p>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>⏱️ {video.duration}</span>
                        <span>📊 ~{(video.estimatedViews / 1000).toFixed(0)}K views</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          video.difficulty === 'easy' ? 'bg-green-600/20 text-green-400' :
                          video.difficulty === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-red-600/20 text-red-400'
                        }`}>
                          {video.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Keywords */}
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-3">🔑 Keywords to Target</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrend.keywords.map((keyword, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-600/20 rounded-full text-emerald-400 text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Platform Strategy */}
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">📱 Platform Strategy</h3>
                  <div className="space-y-3">
                    {selectedTrend.platforms.map((platform, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
                        <div>
                          <p className="text-white font-semibold">{platform.platform}</p>
                          <p className="text-slate-400 text-sm">{platform.bestFormat}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 font-bold">{platform.trendScore}/10</p>
                          <p className="text-slate-400 text-xs">Trend Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert('Trend added to content calendar!');
                    setSelectedTrend(null);
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-pink-600 hover:from-emerald-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl transition-all"
                >
                  Add to Content Calendar →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
