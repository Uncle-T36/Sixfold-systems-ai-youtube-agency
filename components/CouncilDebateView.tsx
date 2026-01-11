/**
 * 👑 IMPERIAL COUNCIL DEBATE UI
 * Live debate visualization - TARS-style AI decision making
 * Watch 5 philosophers debate, critique, and reach consensus
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DebateStatement {
  philosopherId: string;
  philosopher: string;
  emoji: string;
  type: 'opinion' | 'critique' | 'rebuttal' | 'agreement' | 'final';
  targetPhilosopher?: string;
  statement: string;
  score: number;
  timestamp: number;
}

interface DebateRound {
  round: number;
  topic: string;
  statements: DebateStatement[];
}

interface CouncilDebateResult {
  topic: string;
  debateRounds: DebateRound[];
  critiques: { from: string; to: string; critique: string }[];
  agreements: { philosophers: string[]; point: string }[];
  finalConsensus: {
    decision: string;
    confidence: number;
    reasoning: string;
    actionItems: string[];
    dissent?: { philosopher: string; reason: string };
  };
  votingResult: {
    approve: string[];
    reject: string[];
    revise: string[];
    unanimous: boolean;
  };
  totalDebateTime: number;
}

const PHILOSOPHER_COLORS: Record<string, string> = {
  machiavelli: 'from-red-600 to-orange-600',
  seneca: 'from-blue-600 to-cyan-600',
  sun_tzu: 'from-purple-600 to-indigo-600',
  carnegie: 'from-green-600 to-emerald-600',
  aurelius: 'from-yellow-600 to-amber-600'
};

const PHILOSOPHER_BG: Record<string, string> = {
  machiavelli: 'bg-red-500/20 border-red-500/50',
  seneca: 'bg-blue-500/20 border-blue-500/50',
  sun_tzu: 'bg-purple-500/20 border-purple-500/50',
  carnegie: 'bg-green-500/20 border-green-500/50',
  aurelius: 'bg-yellow-500/20 border-yellow-500/50'
};

interface Props {
  topic?: string;
  onDebateComplete?: (result: CouncilDebateResult) => void;
  autoStart?: boolean;
}

export default function CouncilDebateView({ topic, onDebateComplete, autoStart = false }: Props) {
  const [debateTopic, setDebateTopic] = useState(topic || '');
  const [isDebating, setIsDebating] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [visibleStatements, setVisibleStatements] = useState<DebateStatement[]>([]);
  const [debateResult, setDebateResult] = useState<CouncilDebateResult | null>(null);
  const [showingConsensus, setShowingConsensus] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleStatements]);

  const startDebate = async () => {
    if (!debateTopic.trim()) {
      alert('Please enter a topic for the Council to debate');
      return;
    }

    setIsDebating(true);
    setCurrentRound(0);
    setVisibleStatements([]);
    setDebateResult(null);
    setShowingConsensus(false);

    try {
      // Import and run the debate
      const { runCouncilDebate } = await import('../lib/councilDebate');
      const result = await runCouncilDebate(debateTopic);
      setDebateResult(result);

      // Animate the statements appearing one by one
      let delay = 0;
      for (const round of result.debateRounds) {
        setCurrentRound(round.round);
        for (const statement of round.statements) {
          await new Promise(resolve => setTimeout(resolve, 800));
          setVisibleStatements(prev => [...prev, statement]);
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Show consensus after debate
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowingConsensus(true);
      
      onDebateComplete?.(result);
    } catch (error) {
      console.error('Debate error:', error);
      alert('Council debate failed. Please try again.');
    } finally {
      setIsDebating(false);
    }
  };

  useEffect(() => {
    if (autoStart && topic) {
      startDebate();
    }
  }, [autoStart, topic]);

  const getStatementStyle = (statement: DebateStatement) => {
    const baseClasses = PHILOSOPHER_BG[statement.philosopherId] || 'bg-slate-700/50 border-slate-600/50';
    
    if (statement.type === 'critique') {
      return baseClasses + ' border-l-4 border-l-red-500';
    }
    if (statement.type === 'agreement') {
      return baseClasses + ' border-l-4 border-l-green-500';
    }
    return baseClasses;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 mb-4">
            👑 Imperial Council Debate
          </h1>
          <p className="text-slate-400 text-lg">
            Watch 5 legendary philosophers debate, critique each other, and reach consensus
          </p>
        </motion.div>

        {/* Topic Input */}
        {!isDebating && !debateResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mb-8"
          >
            <label className="block text-white font-bold mb-3">Enter Topic for Council Debate:</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={debateTopic}
                onChange={(e) => setDebateTopic(e.target.value)}
                placeholder="e.g., 'How to Go Viral on YouTube in 2025' or paste your video title..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
              />
              <button
                onClick={startDebate}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold rounded-xl transition-all hover:scale-105"
              >
                🎭 Convene Council
              </button>
            </div>
          </motion.div>
        )}

        {/* Philosophers Row */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {['machiavelli', 'seneca', 'sun_tzu', 'carnegie', 'aurelius'].map((id, i) => {
            const names = ['Machiavelli', 'Seneca', 'Sun Tzu', 'Carnegie', 'Aurelius'];
            const emojis = ['🦁', '🏛️', '⚔️', '🤝', '👑'];
            const isActive = visibleStatements.some(s => s.philosopherId === id);
            
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`text-center p-3 rounded-xl border-2 transition-all ${
                  isActive 
                    ? `bg-gradient-to-br ${PHILOSOPHER_COLORS[id]} border-white/30 shadow-lg`
                    : 'bg-slate-800/50 border-slate-700 opacity-50'
                }`}
              >
                <div className="text-3xl mb-1">{emojis[i]}</div>
                <div className="text-xs font-bold text-white">{names[i]}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Debate Status */}
        {isDebating && (
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-yellow-400 font-semibold">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              Round {currentRound} - {currentRound === 1 ? 'Initial Opinions' : currentRound === 2 ? 'Critiques' : 'Building Consensus'}
            </span>
          </div>
        )}

        {/* Debate Chat */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-700 p-4 min-h-[400px] max-h-[500px] overflow-y-auto mb-6">
          <AnimatePresence>
            {visibleStatements.map((statement, index) => (
              <motion.div
                key={`${statement.philosopherId}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-4 p-4 rounded-xl border ${getStatementStyle(statement)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{statement.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">{statement.philosopher}</span>
                      {statement.type === 'critique' && statement.targetPhilosopher && (
                        <span className="text-xs text-red-400">
                          ⚔️ Critiquing {statement.targetPhilosopher}
                        </span>
                      )}
                      {statement.type === 'agreement' && statement.targetPhilosopher && (
                        <span className="text-xs text-green-400">
                          🤝 Supporting {statement.targetPhilosopher}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 ml-auto">
                        Score: {statement.score}/100
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{statement.statement}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {visibleStatements.length === 0 && !isDebating && (
            <div className="flex items-center justify-center h-full text-slate-500">
              Enter a topic and click "Convene Council" to start the debate
            </div>
          )}

          {isDebating && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-yellow-400">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                <span className="ml-2">Philosophers deliberating...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Final Consensus */}
        <AnimatePresence>
          {showingConsensus && debateResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-2xl border-2 border-yellow-500/50 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">⚖️</span>
                <div>
                  <h3 className="text-2xl font-bold text-yellow-400">Council Verdict</h3>
                  <p className="text-slate-400">Debate concluded in {debateResult.totalDebateTime}ms</p>
                </div>
                <div className="ml-auto">
                  <span className={`text-4xl font-bold ${
                    debateResult.finalConsensus.confidence >= 80 ? 'text-green-400' :
                    debateResult.finalConsensus.confidence >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {debateResult.finalConsensus.confidence}%
                  </span>
                  <span className="text-slate-400 text-sm block">Confidence</span>
                </div>
              </div>

              {/* Decision */}
              <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
                <h4 className="text-lg font-bold text-white mb-2">📜 Decision:</h4>
                <p className="text-yellow-300 text-lg">{debateResult.finalConsensus.decision}</p>
              </div>

              {/* Reasoning */}
              <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
                <h4 className="text-lg font-bold text-white mb-2">💡 Reasoning:</h4>
                <p className="text-slate-300">{debateResult.finalConsensus.reasoning}</p>
              </div>

              {/* Action Items */}
              <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
                <h4 className="text-lg font-bold text-white mb-2">✅ Action Items:</h4>
                <ul className="space-y-2">
                  {debateResult.finalConsensus.actionItems.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <span className="text-green-400 mt-1">→</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Voting Result */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-green-500/20 rounded-xl p-3 border border-green-500/30">
                  <div className="text-green-400 font-bold text-sm mb-1">✅ Approve</div>
                  <div className="text-white text-sm">
                    {debateResult.votingResult.approve.join(', ') || 'None'}
                  </div>
                </div>
                <div className="bg-yellow-500/20 rounded-xl p-3 border border-yellow-500/30">
                  <div className="text-yellow-400 font-bold text-sm mb-1">⚠️ Revise</div>
                  <div className="text-white text-sm">
                    {debateResult.votingResult.revise.join(', ') || 'None'}
                  </div>
                </div>
                <div className="bg-red-500/20 rounded-xl p-3 border border-red-500/30">
                  <div className="text-red-400 font-bold text-sm mb-1">❌ Reject</div>
                  <div className="text-white text-sm">
                    {debateResult.votingResult.reject.join(', ') || 'None'}
                  </div>
                </div>
              </div>

              {/* Dissent */}
              {debateResult.finalConsensus.dissent && (
                <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
                  <h4 className="text-red-400 font-bold text-sm mb-1">⚠️ Dissent from {debateResult.finalConsensus.dissent.philosopher}:</h4>
                  <p className="text-red-300 text-sm">{debateResult.finalConsensus.dissent.reason}</p>
                </div>
              )}

              {/* New Debate Button */}
              <button
                onClick={() => {
                  setDebateResult(null);
                  setVisibleStatements([]);
                  setShowingConsensus(false);
                  setDebateTopic('');
                }}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-bold rounded-xl transition-all"
              >
                🎭 Start New Debate
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
