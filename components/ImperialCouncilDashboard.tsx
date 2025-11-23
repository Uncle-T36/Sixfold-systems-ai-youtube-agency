/**
 * 👑 IMPERIAL COUNCIL DASHBOARD
 * Ancient philosophical AI that executes Machiavellian strategies
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  generateImperialStrategy, 
  executeImperialStrategy,
  type EmpireGrowthPlan,
  type PhilosophicalStrategy,
  type ImperialDecision
} from '../lib/imperialCouncil';

export default function ImperialCouncilDashboard() {
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [plan, setPlan] = useState<EmpireGrowthPlan | null>(null);

  useEffect(() => {
    loadStrategy();
  }, []);

  const loadStrategy = async () => {
    setLoading(true);
    try {
      const strategy = await generateImperialStrategy();
      setPlan(strategy);
    } catch (error) {
      console.error('Strategy generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeStrategy = async () => {
    if (!plan) return;
    
    if (!confirm('👑 EXECUTE IMPERIAL STRATEGY?\n\nThis will:\n✅ Create new high-CPM channels\n✅ Generate hundreds of videos\n✅ Setup auto-schedulers\n✅ Deploy competitive intelligence\n\nThe AI will take full control. Continue?')) {
      return;
    }

    setExecuting(true);
    try {
      await executeImperialStrategy(plan);
      alert('✅ IMPERIAL STRATEGY EXECUTED!\n\nYour empire is now in growth mode. Check your channels.');
      await loadStrategy(); // Refresh
    } catch (error: any) {
      alert(`❌ Execution failed: ${error.message}`);
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">👑</div>
          <div className="text-white text-2xl font-bold">The Council Convenes...</div>
          <div className="text-purple-300 mt-2">Analyzing empire state with ancient wisdom</div>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-7xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            👑 IMPERIAL COUNCIL
          </h1>
          <p className="text-purple-200 text-xl mb-6">
            Strategic AI powered by Machiavelli, Marcus Aurelius, Sun Tzu, Seneca & Carnegie
          </p>
          
          <button
            onClick={executeStrategy}
            disabled={executing}
            className="px-12 py-5 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-700 hover:via-orange-700 hover:to-red-700 text-white text-xl font-bold rounded-xl shadow-2xl disabled:opacity-50 transition-all transform hover:scale-105"
          >
            {executing ? '⚔️ EXECUTING STRATEGY...' : '👑 EXECUTE IMPERIAL STRATEGY'}
          </button>
        </motion.div>

        {/* Current vs Target State */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {/* Current State */}
          <div className="p-8 bg-gradient-to-br from-red-900/30 to-gray-900/30 border-2 border-red-500/30 rounded-2xl">
            <h2 className="text-3xl font-bold text-red-400 mb-6 flex items-center gap-2">
              ⚔️ CURRENT EMPIRE
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Channels:</span>
                <span className="text-white text-2xl font-bold">{plan.currentState.channels}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Subscribers:</span>
                <span className="text-white text-2xl font-bold">{plan.currentState.totalSubscribers.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Monthly Revenue:</span>
                <span className="text-green-400 text-2xl font-bold">${plan.currentState.monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Videos Created:</span>
                <span className="text-white text-2xl font-bold">{plan.currentState.contentOutput}</span>
              </div>
            </div>
          </div>

          {/* Target State */}
          <div className="p-8 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-2 border-green-500/30 rounded-2xl">
            <h2 className="text-3xl font-bold text-green-400 mb-6 flex items-center gap-2">
              🎯 TARGET EMPIRE ({plan.targetState.timeframe})
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Channels:</span>
                <span className="text-white text-2xl font-bold">{plan.targetState.channels}</span>
                <span className="text-green-400 text-sm">+{plan.targetState.channels - plan.currentState.channels}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Subscribers:</span>
                <span className="text-white text-2xl font-bold">{plan.targetState.totalSubscribers.toLocaleString()}</span>
                <span className="text-green-400 text-sm">+{((plan.targetState.totalSubscribers / (plan.currentState.totalSubscribers || 1) - 1) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Monthly Revenue:</span>
                <span className="text-green-400 text-2xl font-bold">${plan.targetState.monthlyRevenue.toLocaleString()}</span>
                <span className="text-green-400 text-sm">+{((plan.targetState.monthlyRevenue / (plan.currentState.monthlyRevenue || 1) - 1) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Videos Created:</span>
                <span className="text-white text-2xl font-bold">{plan.targetState.contentOutput}</span>
                <span className="text-green-400 text-sm">+{plan.targetState.contentOutput - plan.currentState.contentOutput}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Philosophical Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 p-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-2 border-purple-500/30 rounded-2xl"
        >
          <h2 className="text-3xl font-bold text-purple-300 mb-4">📜 The Sages Speak</h2>
          <div className="text-purple-100 whitespace-pre-wrap leading-relaxed">
            {plan.philosophicalAnalysis}
          </div>
        </motion.div>

        {/* Strategic Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-6">⚡ Strategic Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plan.strategicPillars.map((strategy, i) => (
              <div
                key={i}
                className={`p-6 bg-gradient-to-br rounded-2xl border-2 ${getPriorityStyle(strategy.priority)}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-gray-400">{strategy.philosopher.toUpperCase()}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(strategy.priority)}`}>
                    {strategy.priority.toUpperCase()}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{strategy.principle}</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="text-sm text-gray-300">
                    <span className="font-semibold text-yellow-400">Action:</span>
                    <p className="mt-1">{strategy.actionItem}</p>
                  </div>
                  
                  <div className="text-sm text-green-300">
                    <span className="font-semibold">Impact:</span> {strategy.expectedImpact}
                  </div>
                  
                  <div className="text-sm text-blue-300">
                    <span className="font-semibold">Timeline:</span> {strategy.timeframe}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Imperial Decisions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-6">🎯 Imperial Decisions</h2>
          <div className="space-y-6">
            {plan.decisions.map((decision, i) => (
              <div
                key={i}
                className="p-8 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-2 border-yellow-500/30 rounded-2xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-yellow-300">{decision.decision}</h3>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full font-bold ${getRiskBadge(decision.riskLevel)}`}>
                      {decision.riskLevel.toUpperCase()} RISK
                    </span>
                    <span className="px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 font-bold">
                      +${decision.expectedRevenue.toLocaleString()}/mo
                    </span>
                  </div>
                </div>

                <div className="mb-4 p-4 bg-purple-900/20 border border-purple-500/20 rounded-xl">
                  <div className="text-purple-300 font-semibold mb-2">📜 Philosophical Rationale:</div>
                  <div className="text-purple-100">{decision.rationale}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-yellow-400 font-bold mb-3">🎯 Implementation Steps:</div>
                    <ul className="space-y-2">
                      {decision.implementationSteps.map((step, j) => (
                        <li key={j} className="flex items-start gap-2 text-gray-300">
                          <span className="text-yellow-500 mt-1">▸</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-green-400 font-bold mb-3">✅ Success Metrics:</div>
                    <ul className="space-y-2">
                      {decision.successMetrics.map((metric, j) => (
                        <li key={j} className="flex items-start gap-2 text-gray-300">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Philosophical Basis: {decision.philosophicalBasis.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Warning from the Sages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-gradient-to-r from-red-900/30 to-orange-900/30 border-2 border-red-500/30 rounded-2xl"
        >
          <h2 className="text-3xl font-bold text-red-400 mb-4">⚠️ Warning from the Sages</h2>
          <div className="text-red-100 whitespace-pre-wrap leading-relaxed">
            {plan.warningFromTheSages}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function getPriorityStyle(priority: string): string {
  const styles = {
    critical: 'from-red-900/30 to-red-800/30 border-red-500/50',
    high: 'from-orange-900/30 to-orange-800/30 border-orange-500/50',
    medium: 'from-yellow-900/30 to-yellow-800/30 border-yellow-500/50',
    low: 'from-gray-800/30 to-gray-700/30 border-gray-500/50'
  };
  return styles[priority as keyof typeof styles] || styles.medium;
}

function getPriorityBadge(priority: string): string {
  const badges = {
    critical: 'bg-red-900/50 border border-red-500 text-red-300',
    high: 'bg-orange-900/50 border border-orange-500 text-orange-300',
    medium: 'bg-yellow-900/50 border border-yellow-500 text-yellow-300',
    low: 'bg-gray-800/50 border border-gray-500 text-gray-300'
  };
  return badges[priority as keyof typeof badges] || badges.medium;
}

function getRiskBadge(risk: string): string {
  const badges = {
    low: 'bg-green-900/30 border border-green-500/30 text-green-400',
    medium: 'bg-yellow-900/30 border border-yellow-500/30 text-yellow-400',
    high: 'bg-red-900/30 border border-red-500/30 text-red-400'
  };
  return badges[risk as keyof typeof badges] || badges.medium;
}
