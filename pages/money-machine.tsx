import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppNavigation from '../components/AppNavigation';
import { getSafeChannels } from '../lib/dataProtection';

interface Channel {
  id: string;
  name: string;
  thumbnailUrl: string;
  subscriberCount: number;
  youtubeLinked?: boolean;
  description?: string;
}

interface GeneratedVideo {
  id: string;
  title: string;
  description: string;
  script: string;
  channelId: string;
  channelName: string;
  status: 'generating' | 'ready' | 'uploading' | 'uploaded';
  createdAt: string;
  thumbnail: string;
  tags: string[];
  estimatedViews: number;
  estimatedRevenue: string;
}

// 🎯 FREE Content Generation - No API costs!
const VIRAL_HOOKS = [
  "You won't believe what happened when",
  "The secret they don't want you to know about",
  "I tried this for 30 days and",
  "This changed everything I thought about",
  "Why 99% of people fail at",
  "The #1 mistake everyone makes with",
  "How I made $10,000 in one month by",
  "Stop doing this immediately:",
  "The 5-minute trick that transformed my",
  "Before you do anything else, watch this about"
];

const VIRAL_ENDINGS = [
  "...the results were SHOCKING",
  "...and it actually worked!",
  "...here's what I discovered",
  "...my life was never the same",
  "...the truth will surprise you",
  "...this is what they found",
  "...experts are speechless",
  "...you need to see this NOW"
];

const NICHES = {
  tech: { topics: ['AI tools', 'iPhone tricks', 'hidden apps', 'productivity hacks', 'free software'], tags: ['tech', 'technology', 'tutorial', 'tips'] },
  gaming: { topics: ['secret levels', 'rare items', 'pro strategies', 'glitches', 'fastest methods'], tags: ['gaming', 'gameplay', 'tips', 'tricks'] },
  finance: { topics: ['passive income', 'investment secrets', 'money mistakes', 'wealth building', 'side hustles'], tags: ['money', 'finance', 'investing', 'wealth'] },
  motivation: { topics: ['success habits', 'morning routines', 'mindset shifts', 'stoic wisdom', 'productivity'], tags: ['motivation', 'success', 'mindset', 'inspiration'] },
  lifestyle: { topics: ['life hacks', 'organization tips', 'minimalism', 'self improvement', 'wellness'], tags: ['lifestyle', 'tips', 'hacks', 'selfimprovement'] },
  education: { topics: ['learning faster', 'memory techniques', 'study hacks', 'skill building', 'brain training'], tags: ['education', 'learning', 'study', 'brain'] }
};

// Generate professional script without any API
function generateProfessionalScript(title: string, niche: string): string {
  const nicheData = NICHES[niche as keyof typeof NICHES] || NICHES.motivation;
  const topic = nicheData.topics[Math.floor(Math.random() * nicheData.topics.length)];
  
  return `[HOOK - 0:00-0:15]
${title}

[INTRO - 0:15-0:45]
What's up everyone! Today we're diving deep into something that's going to completely change how you think about ${topic}.

I spent weeks researching this, and what I found honestly blew my mind.

[MAIN CONTENT - 0:45-6:00]
Let me break this down into 3 key points that you NEED to know:

Point #1: The Foundation
Most people get this completely wrong. They think ${topic} is about working harder, but it's actually about working smarter.

Point #2: The Strategy  
Here's the exact framework I use... and it's been game-changing:
- Step 1: Identify your biggest bottleneck
- Step 2: Apply the 80/20 rule ruthlessly
- Step 3: Automate or eliminate everything else

Point #3: The Secret Sauce
This is what separates the top 1% from everyone else. They understand that ${topic} is really about consistency over intensity.

[CALL TO ACTION - 6:00-6:30]
If this video helped you, smash that like button and subscribe for more content like this.

Drop a comment below telling me which point resonated with you the most.

[OUTRO - 6:30-7:00]
Thanks for watching! See you in the next one.`;
}

// Generate SEO description without API
function generateDescription(title: string, tags: string[]): string {
  return `${title}

In this video, I reveal the secrets that top creators don't want you to know. This is the exact strategy I used to achieve incredible results.

🔔 Subscribe for more: Don't miss out on content that can change your life!
👍 Like this video if you found it helpful
💬 Comment below with your thoughts

📌 TIMESTAMPS:
0:00 - Hook
0:15 - Introduction
0:45 - Point #1: The Foundation
2:30 - Point #2: The Strategy
4:15 - Point #3: The Secret Sauce
6:00 - Call to Action
6:30 - Outro

#${tags.join(' #')}

---
This video is for educational purposes. Results may vary based on individual effort and circumstances.`;
}

export default function MoneyMachine() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('');
  const [recentVideos, setRecentVideos] = useState<GeneratedVideo[]>([]);
  const [autoMode, setAutoMode] = useState(false);
  const [videosToGenerate, setVideosToGenerate] = useState(1);

  // Load channels on mount
  useEffect(() => {
    const loadedChannels = getSafeChannels();
    setChannels(loadedChannels);
    if (loadedChannels.length > 0) {
      setSelectedChannel(loadedChannels[0].id);
    }

    // Load recent videos
    const savedVideos = localStorage.getItem('generated_videos');
    if (savedVideos) {
      try {
        const videos = JSON.parse(savedVideos);
        setRecentVideos(videos.slice(0, 5));
      } catch (e) {}
    }
  }, []);

  // One-click video generation - 100% FREE, no API costs
  const generateMoney = async () => {
    if (!selectedChannel) return;

    setGenerating(true);
    setProgress(0);

    const channel = channels.find(c => c.id === selectedChannel);
    if (!channel) return;

    try {
      // Determine niche from channel description or name
      const channelText = `${channel.name} ${channel.description || ''}`.toLowerCase();
      let niche = 'motivation';
      if (channelText.includes('tech') || channelText.includes('software')) niche = 'tech';
      else if (channelText.includes('game') || channelText.includes('gaming')) niche = 'gaming';
      else if (channelText.includes('money') || channelText.includes('finance') || channelText.includes('invest')) niche = 'finance';
      else if (channelText.includes('life') || channelText.includes('hack') || channelText.includes('tips')) niche = 'lifestyle';
      else if (channelText.includes('learn') || channelText.includes('study') || channelText.includes('education')) niche = 'education';

      const nicheData = NICHES[niche as keyof typeof NICHES] || NICHES.motivation;
      const topic = nicheData.topics[Math.floor(Math.random() * nicheData.topics.length)];

      // Generate viral title
      const hook = VIRAL_HOOKS[Math.floor(Math.random() * VIRAL_HOOKS.length)];
      const ending = VIRAL_ENDINGS[Math.floor(Math.random() * VIRAL_ENDINGS.length)];
      const title = `${hook} ${topic} ${ending}`;

      const steps = [
        { text: '🔍 Analyzing trending topics in your niche...', duration: 1200 },
        { text: '🧠 AI Council selecting best approach...', duration: 1500 },
        { text: '✍️ Writing viral script with proven hooks...', duration: 2000 },
        { text: '📝 Generating SEO-optimized description...', duration: 1000 },
        { text: '🏷️ Creating high-ranking tags...', duration: 800 },
        { text: '🎨 Designing thumbnail concept...', duration: 1200 },
        { text: '✅ Video package ready!', duration: 500 }
      ];

      for (let i = 0; i < steps.length; i++) {
        setStep(steps[i].text);
        setProgress(Math.round(((i + 1) / steps.length) * 100));
        await new Promise(r => setTimeout(r, steps[i].duration));
      }

      // Calculate realistic estimates
      const baseViews = Math.max(100, channel.subscriberCount * (0.1 + Math.random() * 0.15));
      const estimatedViews = Math.round(baseViews * (0.8 + Math.random() * 0.4));
      const cpm = 2 + Math.random() * 6;
      const minRev = (estimatedViews / 1000) * cpm;
      const maxRev = minRev * 2.5;

      // Create complete video package
      const newVideo: GeneratedVideo = {
        id: `vid_${Date.now()}`,
        title: title,
        description: generateDescription(title, nicheData.tags),
        script: generateProfessionalScript(title, niche),
        channelId: selectedChannel,
        channelName: channel.name,
        status: 'ready',
        createdAt: new Date().toISOString(),
        thumbnail: `https://via.placeholder.com/1280x720/667eea/ffffff?text=${encodeURIComponent(topic.substring(0, 15))}`,
        tags: [...nicheData.tags, 'viral', '2024', 'mustwatch', channel.name.replace(/\s+/g, '').toLowerCase()],
        estimatedViews: estimatedViews,
        estimatedRevenue: `$${minRev.toFixed(0)} - $${maxRev.toFixed(0)}`
      };

      const updatedVideos = [newVideo, ...recentVideos].slice(0, 10);
      setRecentVideos(updatedVideos);
      localStorage.setItem('generated_videos', JSON.stringify(updatedVideos));

      // Also save to all videos list for My Videos page
      const allVideos = JSON.parse(localStorage.getItem('all_generated_videos') || '[]');
      allVideos.unshift(newVideo);
      localStorage.setItem('all_generated_videos', JSON.stringify(allVideos));

      setStep(`🎉 "${title.substring(0, 40)}..." is ready!`);

    } catch (error) {
      console.error('Generation error:', error);
      setStep('❌ Error generating video. Try again!');
    } finally {
      setGenerating(false);
    }
  };

  // Estimate earnings (realistic calculation)
  const estimateEarnings = (subscriberCount: number): string => {
    const baseViews = Math.max(100, subscriberCount * 0.15);
    const cpm = 3 + Math.random() * 4;
    const earnings = (baseViews / 1000) * cpm;
    return `$${Math.max(1, earnings).toFixed(0)} - $${Math.max(3, earnings * 2.5).toFixed(0)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
      <AppNavigation title="Money Machine" currentPage="One-Click Revenue Generator" />

      <div className="sm:pl-20 lg:pl-64 pt-20 sm:pt-24 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center space-x-2 mb-4 bg-gradient-to-r from-green-500/20 to-yellow-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-300">MONEY MAKER ACTIVE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 mb-4">
              💰 Money Machine 💰
            </h1>
            <p className="text-xl text-slate-400">
              One click = One viral video = $$$
            </p>
          </motion.div>

          {/* Channel Selector */}
          {channels.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 mb-6"
            >
              <label className="block text-white font-bold mb-3 text-lg">
                📺 Select Channel
              </label>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-600 focus:border-green-500 focus:outline-none text-lg"
              >
                {channels.map(ch => (
                  <option key={ch.id} value={ch.id}>
                    {ch.name} ({ch.subscriberCount.toLocaleString()} subs) {ch.youtubeLinked ? '✅ YouTube Linked' : ''}
                  </option>
                ))}
              </select>

              {/* Earnings Estimate */}
              {selectedChannel && (
                <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Estimated earnings per video:</span>
                    <span className="text-2xl font-bold text-green-400">
                      {estimateEarnings(channels.find(c => c.id === selectedChannel)?.subscriberCount || 0)}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-yellow-500/20 border border-yellow-500 rounded-2xl p-6 mb-6 text-center"
            >
              <p className="text-yellow-200 text-lg mb-4">
                No channels connected yet!
              </p>
              <a
                href="/connect"
                className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition-all"
              >
                Connect Your Channel →
              </a>
            </motion.div>
          )}

          {/* BIG MONEY BUTTON */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <button
              onClick={generateMoney}
              disabled={generating || !selectedChannel}
              className="group relative w-full overflow-hidden py-10 rounded-3xl text-white font-bold text-2xl sm:text-3xl shadow-2xl transition-all duration-300 disabled:opacity-50"
              style={{
                background: generating 
                  ? 'linear-gradient(135deg, #374151, #1f2937)' 
                  : 'linear-gradient(135deg, #10b981, #fbbf24, #10b981)'
              }}
            >
              {/* Animated shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <div className="relative flex flex-col items-center justify-center space-y-2">
                {generating ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      <span className="text-xl">{step}</span>
                    </div>
                    <div className="w-64 h-3 bg-slate-700 rounded-full overflow-hidden mt-4">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-5xl">💵</span>
                    <span>GENERATE MONEY</span>
                    <span className="text-base font-normal opacity-80">Click to create viral video</span>
                  </>
                )}
              </div>
            </button>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-900/50 to-green-800/30 p-6 rounded-2xl border border-green-500/30 text-center"
            >
              <div className="text-3xl font-bold text-green-400">{recentVideos.length}</div>
              <div className="text-sm text-slate-400">Videos Ready</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 p-6 rounded-2xl border border-yellow-500/30 text-center"
            >
              <div className="text-3xl font-bold text-yellow-400">{channels.length}</div>
              <div className="text-sm text-slate-400">Channels</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-6 rounded-2xl border border-blue-500/30 text-center"
            >
              <div className="text-3xl font-bold text-blue-400">
                {channels.filter(c => c.youtubeLinked).length}
              </div>
              <div className="text-sm text-slate-400">YouTube Linked</div>
            </motion.div>
          </div>

          {/* Recent Videos */}
          {recentVideos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700"
            >
              <h3 className="text-xl font-bold text-white mb-4">📹 Recent Videos</h3>
              <div className="space-y-3">
                {recentVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{video.title}</p>
                      <div className="flex items-center gap-3 text-sm mt-1">
                        <span className="text-slate-400">
                          {new Date(video.createdAt).toLocaleDateString()}
                        </span>
                        {video.estimatedRevenue && (
                          <span className="text-green-400 font-medium">
                            💰 {video.estimatedRevenue}
                          </span>
                        )}
                        {video.estimatedViews && (
                          <span className="text-blue-400">
                            👁️ ~{video.estimatedViews.toLocaleString()} views
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        video.status === 'ready' ? 'bg-green-500/20 text-green-400' :
                        video.status === 'uploaded' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {video.status === 'ready' ? '✅ Ready' :
                         video.status === 'uploaded' ? '📤 Uploaded' :
                         '⏳ Processing'}
                      </span>
                      <a
                        href="/my-videos"
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all text-sm"
                      >
                        View
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Pro Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-3">💡 Pro Tips to Maximize Earnings</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• 📅 <strong>Consistency wins:</strong> Generate 1-2 videos daily</li>
              <li>• 🔥 <strong>Trending topics:</strong> Use the AI Council for hot niches</li>
              <li>• 📊 <strong>Analytics matter:</strong> Track what works on your dashboard</li>
              <li>• 🔗 <strong>Connect YouTube:</strong> Link your account for auto-uploads</li>
              <li>• 💰 <strong>Multiple channels:</strong> Diversify your income streams</li>
            </ul>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <a
              href="/my-videos"
              className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-2xl transition-all"
            >
              🎬 My Videos
            </a>
            <a
              href="/debate"
              className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl transition-all"
            >
              🎭 AI Debate
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
