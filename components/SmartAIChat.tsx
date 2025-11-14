/**
 * SMART AI CHAT - Like GitHub Copilot Chat
 * Understands context, executes commands, provides real help
 */

import { useState, useEffect, useRef } from 'react';
import { analyzeQuestion, getAppContext, executeAction, type AssistantResponse } from '../lib/intelligentAssistant';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  action?: AssistantResponse['action'];
  suggestions?: string[];
  timestamp: Date;
}

export default function SmartAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const context = getAppContext();
      const welcomeMsg: ChatMessage = {
        id: 'welcome',
        type: 'assistant',
        content: context.channels.length === 0
          ? "👋 Hey! I'm your AI assistant. I can help you:\n\n• Create channels & videos\n• Make money with your content\n• Automate everything\n• Grow your audience\n\nWhat would you like to do first?"
          : `👋 Welcome back! You have ${context.channels.length} channel(s) and ${context.videos.length} video(s).\n\nWhat can I help you with today?`,
        suggestions: [
          'Create a video',
          'How do I make money?',
          'Show me my stats',
          'Enable autopilot'
        ],
        timestamp: new Date()
      };
      setMessages([welcomeMsg]);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsThinking(true);

    // Get AI response
    try {
      const context = getAppContext();
      const response = await analyzeQuestion(userInput, context);

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: response.message,
        action: response.action,
        suggestions: response.suggestions,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Execute action if provided
      if (response.action) {
        setTimeout(() => {
          executeAction(response.action);
        }, 1000);
      }
    } catch (error) {
      console.error('Assistant error:', error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: "Sorry, I had trouble understanding that. Could you rephrase your question?",
        timestamp: new Date()
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setUserInput(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex items-center justify-center text-2xl animate-pulse"
        title="AI Assistant - Click to chat"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[600px] h-[700px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-green-500/30 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  🤖 AI Assistant
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">SMART MODE</span>
                </h2>
                <p className="text-xs text-green-100">Context-aware • Understands your app • Executes commands</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : 'bg-slate-800 border border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {msg.content}
                  </div>

                  {/* Action Button */}
                  {msg.action && (
                    <button
                      onClick={() => executeAction(msg.action)}
                      className="mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors w-full"
                    >
                      {msg.action.type === 'navigate' ? '🚀 Take Me There' : '✨ Execute Action'}
                    </button>
                  )}

                  {/* Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                        >
                          💡 {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={`text-[10px] mt-2 ${msg.type === 'user' ? 'text-green-100' : 'text-slate-500'}`}>
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {/* Thinking Indicator */}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-700 p-4 bg-slate-900/50">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your detailed content description... (e.g., 'Create a 15-minute cinematic documentary about AI with dramatic British narrator, 4K quality, and background music')"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isThinking && handleSendMessage()}
                disabled={isThinking}
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-green-500 focus:outline-none text-sm disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={isThinking || !userInput.trim()}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isThinking ? '⏳' : '→'}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 mt-3">
              <div className="text-xs text-slate-500 mb-1">💡 Try these examples:</div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Create a 10-min mystery video with dramatic voice, 4K quality',
                  'Make an animated finance video about investing for beginners',
                  'Generate a cinematic crime documentary with British narrator'
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => { setUserInput(example); setTimeout(handleSendMessage, 100); }}
                    disabled={isThinking}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700 transition-colors disabled:opacity-50 text-left"
                  >
                    {example.substring(0, 50)}...
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
