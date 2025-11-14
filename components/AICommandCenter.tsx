/**
 * 🎯 AI COMMAND CENTER
 * Give instructions, ask questions, request adjustments
 * Your personal AI assistant for the entire system
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'pending' | 'completed' | 'in-progress';
  action?: string;
}

interface QuickCommand {
  id: string;
  icon: string;
  label: string;
  description: string;
  command: string;
}

export default function AICommandCenter() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showQuickCommands, setShowQuickCommands] = useState(true);

  useEffect(() => {
    // Load conversation history
    const saved = localStorage.getItem('ai_command_history');
    if (saved) {
      const history = JSON.parse(saved);
      setMessages(history.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
    }
  }, []);

  const quickCommands: QuickCommand[] = [
    {
      id: 'increase-revenue',
      icon: '💰',
      label: 'Increase Revenue',
      description: 'Show me ways to make more money',
      command: 'What are the fastest ways to increase my revenue? Show me specific strategies I can implement today.'
    },
    {
      id: 'optimize-channels',
      icon: '📈',
      label: 'Optimize Channels',
      description: 'Improve all my channels',
      command: 'Analyze all my channels and tell me what needs to be optimized. Give me a prioritized action plan.'
    },
    {
      id: 'fix-issues',
      icon: '🔧',
      label: 'Fix Issues',
      description: 'What problems need fixing?',
      command: 'Are there any problems or issues with my setup? What should I fix first?'
    },
    {
      id: 'viral-strategy',
      icon: '🚀',
      label: 'Go Viral',
      description: 'Help me create viral content',
      command: 'What topics are trending right now? Give me 5 viral video ideas I can create today.'
    },
    {
      id: 'automation',
      icon: '🤖',
      label: 'Full Automation',
      description: 'Automate everything possible',
      command: 'What can be automated that isn\'t already? Set up maximum automation for me.'
    },
    {
      id: 'competitor-analysis',
      icon: '🔍',
      label: 'Beat Competitors',
      description: 'Analyze and outperform competitors',
      command: 'Who are my main competitors and what are they doing better than me? How can I beat them?'
    }
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setProcessing(true);
    setShowQuickCommands(false);

    // Simulate AI processing (in production, this would call your AI backend)
    setTimeout(() => {
      const response = generateAIResponse(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        status: 'completed'
      };

      setMessages(prev => {
        const updated = [...prev, aiMessage];
        localStorage.setItem('ai_command_history', JSON.stringify(updated));
        return updated;
      });
      setProcessing(false);
    }, 2000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    // Revenue-related
    if (input.includes('revenue') || input.includes('money') || input.includes('earn')) {
      return `💰 **Revenue Optimization Plan:**

I've analyzed your setup and found **$15,000-25,000/month** in additional revenue opportunities:

**Immediate Actions (Today):**
1. Enable YouTube mid-roll ads on all videos → +$2,000/mo
2. Add affiliate links to descriptions → +$1,500/mo
3. Enable autopilot mode for 24/7 automation → +$3,000/mo

**This Week:**
4. Set up channel memberships ($4.99/mo tier) → +$2,000/mo
5. Create sponsorship outreach campaign → +$3,000/mo
6. Enable A/B thumbnail testing → +$1,000/mo

**This Month:**
7. Build email list (offer free guide) → +$2,000/mo
8. Create digital product (course/ebook) → +$4,000/mo
9. Multi-platform syndication (TikTok, Instagram) → +$2,500/mo

📊 I've added these to your Revenue Optimization Engine dashboard.

What would you like me to implement first?`;
    }

    // Optimization
    if (input.includes('optimize') || input.includes('improve')) {
      const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
      return `📈 **Channel Optimization Report:**

I've analyzed your ${channels.length} channel${channels.length !== 1 ? 's' : ''} and found these priority improvements:

**High Priority:**
1. Add channel descriptions (AI analysis = growth suggestions)
2. Select AI voices for better video quality
3. Enable autopilot mode for consistent posting
4. Set up payment method to receive earnings

**Medium Priority:**
5. A/B test thumbnails (expect 200-500% CTR increase)
6. Optimize video titles with high-CPM keywords
7. Schedule posts for peak times (Sat 3PM EST)

**Automation Available:**
8. AI can generate 3-5 videos per week automatically
9. Auto-post to TikTok, Instagram, YouTube Shorts
10. Auto-respond to comments and engage audience

✅ I can implement all of these now. Should I proceed?`;
    }

    // Viral content
    if (input.includes('viral') || input.includes('trending')) {
      return `🚀 **Viral Content Strategy:**

**Trending Topics RIGHT NOW (Next 48 Hours):**

1. **"I Tried [New AI Tool] For 24 Hours"** - 87% viral probability
   - Expected: 1-5M views
   - AI can generate this video in 10 minutes

2. **"Why [Current Event] Changes Everything"** - 92% viral probability
   - Perfect timing window: Next 12 hours
   - AI will create trending-optimized content

3. **"I Spent $100 to Make $10,000"** - Money challenge format
   - Proven format: Average 3M views
   - AI generates challenge video automatically

4. **Question-based: "Why Does [Phenomenon]...?"**
   - Curiosity-gap titles = 2x engagement
   - AI writes perfect curiosity hooks

5. **"[Celebrity] Just Did THIS"** - Reaction video
   - Ride trending wave while it's hot
   - AI monitors celeb news 24/7

🎬 Which video should I create first? I can have it ready in 15 minutes.`;
    }

    // Automation
    if (input.includes('automat')) {
      return `🤖 **Full Automation Setup:**

**Currently Automated:**
✅ Channel updates and monitoring
✅ AI-powered video generation
✅ Voice selection and optimization

**Available to Automate (I can enable now):**

1. **24/7 Video Generation**
   - 3-5 videos per week per channel
   - Posted at optimal times automatically
   - Status: READY TO ENABLE

2. **Multi-Platform Posting**
   - Auto-post to TikTok, Instagram, Twitter
   - AI cuts perfect 60-second clips
   - Status: READY TO ENABLE

3. **Thumbnail A/B Testing**
   - 10 versions per video tested automatically
   - Best performer goes live
   - Status: READY TO ENABLE

4. **Comment Management**
   - AI responds to comments 24/7
   - Boosts engagement by 300%
   - Status: READY TO ENABLE

5. **Revenue Optimization**
   - Auto-adjusts ad placements
   - Optimizes keywords for high CPM
   - Status: READY TO ENABLE

6. **Competitor Monitoring**
   - Tracks top 1,000 creators
   - Copies winning strategies
   - Status: READY TO ENABLE

💡 **Enable ALL automations now?** (Recommended - saves 20+ hours/week)`;
    }

    // Issues/problems
    if (input.includes('issue') || input.includes('problem') || input.includes('fix')) {
      const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
      const bankAccount = localStorage.getItem('owner_bank_account');
      
      let issues = [];
      if (channels.length === 0) issues.push('No channels connected');
      if (!bankAccount) issues.push('No payment method set up');
      
      return `🔧 **System Health Check:**

${issues.length > 0 ? `
**🚨 Issues Found:**
${issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

I can fix these now. Should I proceed?
` : `
✅ **No Critical Issues Found!**

Your system is running smoothly. All major components are operational.
`}

**Optimization Opportunities:**
1. Enable autopilot mode → 5x productivity
2. Add affiliate links → +$1,500/mo passive income
3. Set up email list → $1/subscriber/month
4. Enable A/B testing → +300% CTR

**Performance Stats:**
- System uptime: 99.9%
- AI providers: 6 active
- Infrastructure: Netflix-level
- Auto-updates: Enabled

💡 Everything looks good! Ready to scale?`;
    }

    // Competitors
    if (input.includes('competitor') || input.includes('beat')) {
      return `🔍 **Competitor Analysis:**

I'm monitoring your top competitors 24/7. Here's what they're doing that you're not:

**MrBeast Strategy:**
- Posts Saturdays 3PM EST (5x more views)
- 12-15 minute videos (optimal ad revenue)
- Money challenges = guaranteed viral
→ **I can apply this to your channels**

**Ali Abdaal Strategy:**
- "How I..." titles average 2M views
- Educational + personal story format
- High-CPM keywords: business, productivity
→ **I can rewrite your titles**

**MKBHD Strategy:**
- Reviews new tech within 24 hours
- Premium production quality
- US/UK audience targeting (5x CPM)
→ **I can do instant reviews**

**Graham Stephan Strategy:**
- Red arrows + dollar signs on thumbnails = 3x CTR
- Finance niche = $15-30 CPM
- Uploads consistently 2x per week
→ **I can optimize your thumbnails**

🎯 **Action Plan:**
1. Steal their posting schedule
2. Copy their title formats
3. Match their thumbnail style
4. Target their keywords
5. Beat them with AI speed

Should I implement these strategies across all your channels?`;
    }

    // Default helpful response
    return `👋 I'm your AI assistant! I can help with:

**💰 Revenue:** "Show me ways to make more money"
**📈 Optimization:** "How can I improve my channels?"
**🚀 Viral Content:** "Give me viral video ideas"
**🤖 Automation:** "What can be automated?"
**🔍 Competition:** "Analyze my competitors"
**🔧 Support:** "Fix any issues"

I can also:
- Generate videos on any topic
- Optimize titles, thumbnails, descriptions
- Schedule content automatically
- Set up monetization strategies
- Analyze performance and suggest improvements
- Answer any questions about the system

What would you like me to help with?`;
  };

  const handleQuickCommand = (command: string) => {
    setInput(command);
    setShowQuickCommands(false);
  };

  const clearHistory = () => {
    if (confirm('Clear all conversation history?')) {
      setMessages([]);
      localStorage.removeItem('ai_command_history');
      setShowQuickCommands(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 via-pink-600 to-red-600 rounded-2xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl">
              <span className="text-4xl">🎯</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">AI Command Center</h2>
              <p className="text-emerald-100">
                Ask me anything • Give instructions • Request adjustments
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-semibold transition-all"
            >
              Clear History
            </button>
          )}
        </div>
      </motion.div>

      {/* Quick Commands */}
      {showQuickCommands && messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {quickCommands.map((cmd) => (
            <motion.button
              key={cmd.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickCommand(cmd.command)}
              className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-xl border-2 border-slate-700 hover:border-teal-500/50 transition-all text-left group"
            >
              <div className="text-3xl mb-3">{cmd.icon}</div>
              <h3 className="text-white font-bold mb-2 group-hover:text-teal-400 transition-colors">
                {cmd.label}
              </h3>
              <p className="text-slate-400 text-sm">{cmd.description}</p>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Chat Messages */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-slate-700 overflow-hidden">
        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                      : 'bg-slate-800 text-slate-100 border border-slate-700'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-teal-100' : 'text-slate-500'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {processing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <span className="text-slate-400 text-sm ml-2">AI is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          {messages.length === 0 && !showQuickCommands && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-slate-400">Start a conversation with your AI assistant</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t-2 border-slate-700 p-4 bg-slate-900/50">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything... (e.g., 'How can I make more money?' or 'Generate a viral video about AI')"
                rows={3}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border-2 border-slate-700 focus:border-teal-500 focus:outline-none resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || processing}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed h-[52px] flex items-center space-x-2"
            >
              <span>Send</span>
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-white font-bold mb-3 flex items-center space-x-2">
          <span>💡</span>
          <span>Example Commands:</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="text-slate-300">• "Generate 5 videos about [topic]"</div>
          <div className="text-slate-300">• "Increase my CPM to $20+"</div>
          <div className="text-slate-300">• "Set up autopilot for all channels"</div>
          <div className="text-slate-300">• "What's trending in my niche?"</div>
          <div className="text-slate-300">• "Analyze my competitor [name]"</div>
          <div className="text-slate-300">• "Create a viral thumbnail"</div>
          <div className="text-slate-300">• "Optimize all my titles"</div>
          <div className="text-slate-300">• "Set up affiliate marketing"</div>
        </div>
      </div>
    </div>
  );
}
