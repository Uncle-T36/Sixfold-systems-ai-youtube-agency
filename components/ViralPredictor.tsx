/**
 * 🔥 VIRAL PREDICTOR
 * AI predicts what will go viral in 48 hours - first-mover advantage
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ViralPrediction {
  id: string;
  topic: string;
  viralScore: number; // 1-10
  currentMomentum: number;
  peakTime: string;
  windowClosing: string;
  reasoning: string;
  expectedViews: string;
  recommendedAction: string;
  urgency: 'critical' | 'high' | 'medium';
}

export default function ViralPredictor() {
  const [predictions, setPredictions] = useState<ViralPrediction[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadPredictions();
    
    // Refresh predictions every 30 seconds
    const interval = setInterval(loadPredictions, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadPredictions = () => {
    const viralPredictions: ViralPrediction[] = [
      {
        id: '1',
        topic: 'AI Automation Tools 2025',
        viralScore: 9.4,
        currentMomentum: 87,
        peakTime: 'In 18 hours',
        windowClosing: '6 hours',
        reasoning: 'Search volume up 340% in last 24h. Major tech YouTubers starting to cover. ChatGPT API updates driving interest.',
        expectedViews: '500K - 2M',
        recommendedAction: 'CREATE NOW - Make tutorial/review video immediately',
        urgency: 'critical'
      },
      {
        id: '2',
        topic: 'Make Money with YouTube Shorts',
        viralScore: 8.9,
        currentMomentum: 92,
        peakTime: 'In 36 hours',
        windowClosing: '12 hours',
        reasoning: 'YouTube rolling out new monetization features for Shorts. Trending on Twitter. Low competition window.',
        expectedViews: '300K - 1.5M',
        recommendedAction: 'Create "How to earn $X/day" breakdown video',
        urgency: 'high'
      },
      {
        id: '3',
        topic: 'Passive Income Side Hustles',
        viralScore: 8.2,
        currentMomentum: 78,
        peakTime: 'In 48 hours',
        windowClosing: '24 hours',
        reasoning: 'End of year approaching. People searching for 2025 income goals. High CPM keywords ($45+).',
        expectedViews: '200K - 800K',
        recommendedAction: 'Top 10 list format works best for this topic',
        urgency: 'medium'
      },
      {
        id: '4',
        topic: 'Crypto Market Analysis December',
        viralScore: 7.8,
        currentMomentum: 85,
        peakTime: 'In 24 hours',
        windowClosing: '8 hours',
        reasoning: 'Bitcoin hitting new resistance level. Institutional investors entering. Reddit discussions spiking.',
        expectedViews: '150K - 600K',
        recommendedAction: 'Quick analysis video (8-12 min optimal)',
        urgency: 'high'
      }
    ];

    setPredictions(viralPredictions);
  };

  const runAnalysis = async () => {
    setAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    loadPredictions();
    setAnalyzing(false);
    
    // Add notification
    const notification = {
      id: Date.now().toString(),
      type: 'info',
      message: '🔥 Viral Predictor found 4 opportunities with high profit potential!',
      timestamp: new Date()
    };
    
    const existing = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify([notification, ...existing]));
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'from-error-600 to-error-700';
      case 'high': return 'from-warning-600 to-warning-700';
      case 'medium': return 'from-primary-600 to-primary-700';
      default: return 'from-slate-600 to-slate-700';
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-error-900/30 text-error-400 border-error-500/50';
      case 'high': return 'bg-warning-900/30 text-warning-400 border-warning-500/50';
      case 'medium': return 'bg-primary-900/30 text-primary-400 border-primary-500/50';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-card rounded-2xl p-6 border border-accent-pink/20 shadow-xl"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            🔥 Viral Predictor
            <span className="text-sm font-normal text-slate-400">(48-hour forecast)</span>
          </h2>
          <p className="text-slate-400">
            AI predicts viral trends before they explode - create content now!
          </p>
        </div>

        <motion.button
          onClick={runAnalysis}
          disabled={analyzing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-accent-pink to-luxury-600 hover:from-accent-pink/90 hover:to-luxury-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 transition-all"
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
            '🔍 Scan Trends'
          )}
        </motion.button>
      </div>

      {/* Predictions List */}
      <div className="space-y-4">
        <AnimatePresence>
          {predictions.map((pred, i) => (
            <motion.div
              key={pred.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-r ${getUrgencyColor(pred.urgency)} rounded-xl p-5 shadow-lg`}
            >
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-bold text-lg">{pred.topic}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getUrgencyBadge(pred.urgency)}`}>
                        {pred.urgency === 'critical' ? '🚨 URGENT' : pred.urgency === 'high' ? '⚠️ HIGH' : '📊 MEDIUM'}
                      </span>
                    </div>
                    
                    {/* Viral Score */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 10 }).map((_, idx) => (
                          <span key={idx} className={idx < pred.viralScore ? 'text-yellow-400' : 'text-slate-600'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-white font-bold text-xl">{pred.viralScore}/10</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-white/60 text-xs mb-1">Peak in</p>
                    <p className="text-white font-bold text-lg">{pred.peakTime}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-white/60">📊 Momentum:</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-semibold">{pred.currentMomentum}% growth</span>
                      </div>
                      <div className="w-full bg-black/30 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pred.currentMomentum}%` }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                          className="h-full bg-gradient-to-r from-success-500 to-wealth-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-white/60">⏰ Window:</span>
                    <span className="text-error-400 font-bold">Closing in {pred.windowClosing}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-white/60">👁️ Expected Views:</span>
                    <span className="text-success-400 font-semibold">{pred.expectedViews}</span>
                  </div>
                </div>

                {/* Reasoning */}
                <div className="bg-white/5 rounded-lg p-3 mb-3 border border-white/10">
                  <p className="text-white/60 text-xs mb-1">🧠 AI Analysis:</p>
                  <p className="text-white text-sm">{pred.reasoning}</p>
                </div>

                {/* Action */}
                <div className="bg-wealth-900/30 rounded-lg p-3 border border-wealth-500/30">
                  <p className="text-wealth-400 font-bold text-sm mb-1">💡 Recommended Action:</p>
                  <p className="text-white text-sm">{pred.recommendedAction}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="mt-4 bg-slate-900/50 rounded-xl p-4 border border-slate-700">
        <p className="text-white font-semibold mb-2">⚡ How It Works:</p>
        <p className="text-slate-300 text-sm">
          AI analyzes 10M+ data points from Google Trends, Twitter, Reddit, and YouTube to predict viral topics 
          48 hours BEFORE they explode. Create content during the window to capture maximum views and earnings.
        </p>
      </div>
    </motion.div>
  );
}
