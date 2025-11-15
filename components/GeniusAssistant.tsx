/**
 * 🧠 GENIUS AI ASSISTANT COMPONENT
 * Conversational AI interface with full app execution capabilities
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { geniusAnalyzeAndExecute, type GeniusContext, type GeniusResponse } from '@/lib/geniusAI';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  response?: GeniusResponse;
}

export default function GeniusAssistant() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [context, setContext] = useState<GeniusContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load app context on mount
  useEffect(() => {
    loadAppContext();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadAppContext = () => {
    if (typeof window === 'undefined') return;

    const channels = JSON.parse(localStorage.getItem('connected_channels') || '[]');
    const videos = JSON.parse(localStorage.getItem('render_queue') || '[]');
    const series = JSON.parse(localStorage.getItem('series_channels') || '[]');
    const automation = JSON.parse(localStorage.getItem('automation_tasks') || '[]');

    const totalRevenue = channels.reduce((sum: number, ch: any) => sum + (ch.estimatedRevenue || 0), 0);
    const totalSubscribers = channels.reduce((sum: number, ch: any) => sum + (ch.subscribers || 0), 0);
    const totalViews = channels.reduce((sum: number, ch: any) => sum + (ch.totalViews || 0), 0);

    setContext({
      channels,
      videos,
      series,
      automation,
      totalRevenue,
      totalSubscribers,
      totalViews,
      avgEngagement: 8.5,
      currentPage: window.location.pathname,
      goals: [],
      challenges: [],
      recentActions: [],
      conversationHistory: messages.map(m => ({ role: m.role, message: m.content }))
    });
  };

  const handleSend = async () => {
    if (!input.trim() || !context) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      // Update context with conversation history
      const updatedContext = {
        ...context,
        conversationHistory: [...messages, userMessage].map(m => ({ role: m.role, message: m.content }))
      };

      // Get AI response
      const response = await geniusAnalyzeAndExecute(input, updatedContext);

      const aiMessage: Message = {
        role: 'ai',
        content: response.message,
        timestamp: new Date(),
        response
      };

      setMessages(prev => [...prev, aiMessage]);

      // Execute auto-actions
      for (const action of response.actions) {
        if (action.autoExecute) {
          await executeAction(action);
        }
      }

      // Reload context after actions
      loadAppContext();
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: Message = {
        role: 'ai',
        content: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const executeAction = async (action: any) => {
    console.log('Executing action:', action);
    
    // Navigate
    if (action.type === 'navigate' && action.target) {
      setTimeout(() => {
        window.location.href = action.target;
      }, 1000);
    }

    // Generate content
    if (action.type === 'generate' && action.params) {
      localStorage.setItem('ai_content_request', JSON.stringify(action.params));
    }

    // Execute automation
    if (action.type === 'execute' && action.target === 'enable_full_automation') {
      localStorage.setItem('automation_enabled', 'true');
      localStorage.setItem('automation_config', JSON.stringify(action.params));
    }
  };

  const handleQuickAction = async (prompt: string) => {
    setInput(prompt);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      {/* Header */}
      <div className="p-6 border-b border-emerald-500/30 bg-black/40 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
            title="Go Back"
          >
            <span className="text-xl text-white">←</span>
          </button>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Genius AI Assistant</h2>
            <p className="text-emerald-300 text-sm">Your 24/7 YouTube money-making expert</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickAction('I want to make $10,000 this month')}
            className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/50 text-green-300 text-xs hover:bg-green-500/30 transition"
          >
            💰 Make $10K/month
          </button>
          <button
            onClick={() => handleQuickAction('Create a viral anime series with consistent characters')}
            className="px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-xs hover:bg-yellow-500/30 transition"
          >
            🎌 Viral Anime Series
          </button>
          <button
            onClick={() => handleQuickAction('Put everything on autopilot')}
            className="px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/50 text-blue-300 text-xs hover:bg-blue-500/30 transition"
          >
            🤖 Full Automation
          </button>
          <button
            onClick={() => handleQuickAction('Analyze my performance and optimize')}
            className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs hover:bg-emerald-500/30 transition"
          >
            📊 Optimize Everything
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-white mb-2">Ready to Make Money?</h3>
            <p className="text-emerald-300 mb-6">
              I'm your genius AI assistant with full access to your entire app.
              <br />
              I can create content, run automation, analyze performance, and more!
            </p>
            <div className="space-y-2 max-w-md mx-auto text-left">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-white font-semibold">💡 Try asking:</p>
                <p className="text-emerald-300 text-sm mt-1">
                  "I want to make $10,000 this month"
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-emerald-300 text-sm">
                  "Create a mystery anime series with 10 episodes"
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-emerald-300 text-sm">
                  "Automate everything so I can make money while I sleep"
                </p>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl ${msg.role === 'user' ? 'ml-12' : 'mr-12'}`}>
              {/* Message bubble */}
              <div
                className={`p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-green-500 to-yellow-500 text-white'
                    : 'bg-black/60 border border-emerald-500/30 text-white'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>

              {/* AI Response Details */}
              {msg.role === 'ai' && msg.response && (
                <div className="mt-3 space-y-2">
                  {/* Insights */}
                  {msg.response.insights && msg.response.insights.length > 0 && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <p className="text-emerald-300 font-semibold mb-2 flex items-center gap-2">
                        💡 Key Insights:
                      </p>
                      {msg.response.insights.map((insight, i) => (
                        <div key={i} className="ml-4 mb-2">
                          <p className="text-white text-sm">• {insight.insight}</p>
                          {insight.action && (
                            <p className="text-green-400 text-xs ml-4">→ {insight.action}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  {msg.response.actions && msg.response.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {msg.response.actions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => executeAction(action)}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-700 to-yellow-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-green-700/50 transition"
                        >
                          {action.description}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Predictions */}
                  {msg.response.predictions && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                      <p className="text-green-300 font-semibold mb-2">📈 Predictions:</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {msg.response.predictions.estimatedRevenue && (
                          <div>
                            <p className="text-green-200">Revenue:</p>
                            <p className="text-white font-bold">${msg.response.predictions.estimatedRevenue.toLocaleString()}</p>
                          </div>
                        )}
                        {msg.response.predictions.estimatedViews && (
                          <div>
                            <p className="text-green-200">Views:</p>
                            <p className="text-white font-bold">{msg.response.predictions.estimatedViews.toLocaleString()}</p>
                          </div>
                        )}
                        {msg.response.predictions.timeToGoal && (
                          <div>
                            <p className="text-green-200">Time to Goal:</p>
                            <p className="text-white font-bold">{msg.response.predictions.timeToGoal}</p>
                          </div>
                        )}
                        {msg.response.predictions.successProbability && (
                          <div>
                            <p className="text-green-200">Success Rate:</p>
                            <p className="text-white font-bold">{msg.response.predictions.successProbability}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-green-600 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="max-w-3xl mr-12">
              <div className="p-4 rounded-2xl bg-black/60 border border-green-700/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-700 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-green-700 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-green-700 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <span className="text-green-400 text-sm ml-2">Analyzing and executing...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-green-700/30 bg-black/40 backdrop-blur">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSend()}
            placeholder="Ask me anything... 'I want to make $10K' or 'Create a viral series'"
            className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-green-700/30 text-white placeholder-green-600 focus:outline-none focus:border-green-700"
            disabled={isProcessing}
          />
          <button
            onClick={handleSend}
            disabled={isProcessing || !input.trim()}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-700 to-yellow-500 text-white font-semibold hover:shadow-lg hover:shadow-green-700/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Send'}
          </button>
        </div>
        <p className="text-green-600 text-xs mt-2 text-center">
          💡 I have full access to your app and can execute commands automatically
        </p>
      </div>
    </div>
  );
}

