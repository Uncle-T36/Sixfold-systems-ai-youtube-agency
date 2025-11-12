import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '👋 Hi! I\'m your AI assistant. Ask me anything about:\n\n• Connecting YouTube channels\n• Generating content\n• Understanding the dashboard\n• Getting started\n\nHow can I help you today?',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickReplies = [
    { text: 'How do I connect a channel?', icon: '🔌' },
    { text: 'How to generate videos?', icon: '🎬' },
    { text: 'How do I disconnect a channel?', icon: '❌' },
    { text: 'What happens after I connect?', icon: '🤔' },
  ];

  const getAIResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('connect') && msg.includes('channel')) {
      return '📺 To connect a channel:\n\n1. Click "Connect" in the sidebar\n2. Paste your YouTube channel URL (e.g., youtube.com/@YourChannel)\n3. Give it a name\n4. Click "Connect Channel"\n\nYour channel will appear in the dashboard immediately! ✅';
    }

    if (msg.includes('disconnect') || msg.includes('remove') || msg.includes('delete')) {
      return '🗑️ To disconnect a channel:\n\n1. Go to the "Connect" page\n2. Scroll to "Connected Channels"\n3. Click the red trash icon on the channel you want to remove\n4. Confirm deletion\n\nThe channel will be removed instantly!';
    }

    if (msg.includes('generate') || msg.includes('video') || msg.includes('content')) {
      return '🎬 To generate videos:\n\n1. Go to Dashboard\n2. Find your channel card\n3. Click "Generate Video" button\n4. Wait for AI to create your content\n\nThe AI will:\n• Analyze trending topics\n• Write a script\n• Generate visuals\n• Create the video\n\nUsually takes 3-10 minutes! 🚀';
    }

    if (msg.includes('dashboard') || msg.includes('see') || msg.includes('status')) {
      return '📊 Dashboard shows:\n\n• All your connected channels\n• Subscriber counts\n• Watch hours\n• Video generation status\n• Activity feed\n\nEach channel card has buttons to:\n• Generate videos\n• Pause/resume automation\n• View analytics';
    }

    if (msg.includes('after') || msg.includes('next') || msg.includes('what happens')) {
      return '🎯 After connecting:\n\n1. Channel appears on dashboard ✅\n2. AI analyzes your niche\n3. Click "Generate Video" anytime\n4. AI creates content automatically\n5. Videos appear in your dashboard\n\nYou\'ll get notifications for:\n• Content being generated\n• Videos ready\n• Any issues';
    }

    if (msg.includes('duplicate') || msg.includes('twice') || msg.includes('again')) {
      return '⚠️ Duplicate channels:\n\nThe system now prevents duplicates! If you try to connect the same channel twice, you\'ll see an error message.\n\nIf you have duplicates:\n1. Go to Connect page\n2. Click trash icon to remove duplicates\n3. Keep only one instance\n\nFixed! 🎉';
    }

    // Default response
    return `I can help you with:\n\n🔌 Connecting channels\n🎬 Generating videos\n📊 Using the dashboard\n🗑️ Managing channels\n\nPlease ask a specific question, or try one of the quick replies below!`;
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setMessage('');

    // Get AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getAIResponse(message),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 500);
  };

  const handleQuickReply = (text: string) => {
    setMessage(text);
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-luxury-600 to-primary-600 shadow-2xl hover:shadow-luxury-500/50 flex items-center justify-center text-white text-2xl sm:text-3xl hover:scale-110 active:scale-95 transition-all duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Need help?"
      >
        {isOpen ? '✕' : '💬'}
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-luxury-600/20 to-primary-600/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-luxury-600 to-primary-600 flex items-center justify-center text-xl">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">AI Assistant</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-slate-400">Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 sm:h-96 overflow-y-auto p-4 space-y-3 bg-slate-950/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-luxury-600 to-primary-600 text-white'
                        : 'bg-slate-800/80 text-slate-200 border border-slate-700/50'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-900/50">
                <p className="text-xs text-slate-400 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply.text)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-primary-500/50 transition-all duration-200"
                    >
                      {reply.icon} {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-slate-700/50 bg-slate-900/50">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask anything..."
                  className="flex-1 bg-slate-800 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-luxury-500 focus:outline-none text-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-luxury-600 to-primary-600 hover:from-luxury-700 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
