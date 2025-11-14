/**
 * SMART CONTENT GENERATOR - Analyzes channels and creates content effortlessly
 * One-click video generation based on channel history and style
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ConnectedChannel {
  id: string;
  name: string;
  description: string;
  subscribers: number;
  totalViews: number;
  videoCount: number;
  thumbnail: string;
  connectedAt: string;
}

export default function SmartContentGenerator() {
  const [channels, setChannels] = useState<ConnectedChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    // Load connected channels
    const loadedChannels = JSON.parse(localStorage.getItem('channels') || '[]');
    setChannels(loadedChannels);
    
    if (loadedChannels.length > 0 && !selectedChannel) {
      setSelectedChannel(loadedChannels[0].id);
    }
  }, []);

  const handleAnalyzeChannel = async () => {
    if (!selectedChannel) return;

    setIsAnalyzing(true);
    const channel = channels.find(ch => ch.id === selectedChannel);

    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        niche: detectNiche(channel?.description || ''),
        contentStyle: 'Educational & Entertaining',
        avgViews: channel?.totalViews || 0 / Math.max(channel?.videoCount || 1, 1),
        topTopics: [
          'Content Creation Strategies',
          'Social Media Growth',
          'Monetization Tips',
          'Viral Video Techniques',
          'YouTube Algorithm'
        ],
        recommendations: {
          nextVideos: [
            '5 Secrets to Get 1M Views on YouTube in 2025',
            'How I Made $50K in One Month (Full Breakdown)',
            'The Algorithm Change NOBODY is Talking About',
            'Why 99% of YouTubers Fail (And How to Avoid It)',
            'I Tested Every Growth Strategy - Here\'s What Actually Works'
          ],
          bestTimes: ['Tuesday 2PM EST', 'Thursday 4PM EST', 'Saturday 10AM EST'],
          keyTags: ['youtube growth', 'content creation', 'monetization', 'viral videos', 'algorithm']
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleGenerateVideo = async (videoIdea: string) => {
    setIsGenerating(true);

    const channel = channels.find(ch => ch.id === selectedChannel);

    // Create video data
    const videoData = {
      id: `video-${Date.now()}`,
      channelId: selectedChannel,
      channelName: channel?.name,
      title: videoIdea,
      script: generateScript(videoIdea, analysis?.contentStyle),
      description: generateDescription(videoIdea, analysis?.niche),
      tags: analysis?.recommendations.keyTags || [],
      status: 'ready',
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const videos = JSON.parse(localStorage.getItem('generated_videos') || '[]');
    videos.push(videoData);
    localStorage.setItem('generated_videos', JSON.stringify(videos));

    setIsGenerating(false);

    // Redirect to video creator
    localStorage.setItem('pending_video_creation', JSON.stringify(videoData));
    window.location.href = '/video-creator';
  };

  const detectNiche = (description: string): string => {
    const lower = description.toLowerCase();
    if (lower.includes('mystery')) return 'Mystery';
    if (lower.includes('crime')) return 'True Crime';
    if (lower.includes('tech')) return 'Technology';
    if (lower.includes('finance') || lower.includes('money')) return 'Finance';
    if (lower.includes('education')) return 'Education';
    return 'Entertainment';
  };

  const generateScript = (title: string, style: string): string => {
    return `[HOOK - First 10 seconds]
${title}

[INTRODUCTION - 0:00-0:45]
Hey everyone! In today's video, I'm going to show you something that will completely change how you think about this...

[MAIN CONTENT - 0:45-5:30]
Let me break this down for you step by step:

Point 1: The Secret Nobody Tells You
[Explain the first major point with examples]

Point 2: Why This Works So Well
[Provide evidence and case studies]

Point 3: How to Apply This Today
[Give actionable steps]

[ENGAGEMENT - 5:30-6:00]
If you're finding this valuable, hit that like button and subscribe for more content like this!

[CONCLUSION - 6:00-7:30]
So there you have it - everything you need to know about ${title}.

Remember, the key is to take action on what you've learned today.

[CALL TO ACTION]
Drop a comment below with your thoughts, and check out the resources I linked in the description!

See you in the next video!`;
  };

  const generateDescription = (title: string, niche: string): string => {
    return `${title}

🎯 In this video, I reveal exactly how to master this strategy step-by-step!

⏱️ TIMESTAMPS:
0:00 - Introduction
0:45 - Main Content
5:30 - Key Takeaways
7:00 - Conclusion

🔗 RESOURCES & TOOLS:
[Your affiliate links here]
[Free templates and guides]

💰 WANT TO MAKE MONEY LIKE THIS?
Check out my course: [Link]

📱 FOLLOW ME:
Instagram: @your channel
Twitter: @yourchannel
TikTok: @yourchannel

#${niche} #YouTube #ContentCreation #Viral #2025`;
  };

  if (channels.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">📺</div>
          <h2 className="text-3xl font-bold text-white mb-4">No Channels Connected</h2>
          <p className="text-slate-400 mb-8">
            Connect your YouTube channels first to start generating content automatically
          </p>
          <button
            onClick={() => window.location.href = '/connect'}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform"
          >
            🔌 Connect Channel Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
            🎬 Smart Content Generator
          </h1>
          <p className="text-slate-300 text-xl">
            Analyzes your channels and creates content effortlessly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Channel Selection */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-bold text-xl mb-4">📺 Your Channels</h3>
              
              <div className="space-y-3">
                {channels.map(channel => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedChannel === channel.id
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold text-white mb-1">{channel.name}</div>
                    <div className="text-sm text-slate-400">
                      {channel.subscribers?.toLocaleString() || 0} subscribers
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {channel.videoCount || 0} videos • {(channel.totalViews || 0).toLocaleString()} views
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleAnalyzeChannel}
                disabled={isAnalyzing || !selectedChannel}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isAnalyzing ? '🔄 Analyzing...' : '🔍 Analyze Channel'}
              </button>
            </div>
          </div>

          {/* Right: Analysis & Video Ideas */}
          <div className="lg:col-span-2">
            {!analysis ? (
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold text-white mb-3">Ready to Generate Content?</h3>
                <p className="text-slate-400 mb-6">
                  Click "Analyze Channel" to let AI study your channel's history, style, and performance.
                  <br />
                  Then generate viral videos with one click!
                </p>
                <div className="text-sm text-slate-500">
                  ⚡ Analysis takes 2-3 seconds • Generates 5 video ideas • Scripts included
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Analysis Results */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-white font-bold text-xl mb-4">📊 Channel Analysis</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-900/50 rounded-xl p-4">
                      <div className="text-slate-400 text-sm mb-1">Niche</div>
                      <div className="text-white font-bold">{analysis.niche}</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-4">
                      <div className="text-slate-400 text-sm mb-1">Style</div>
                      <div className="text-white font-bold text-sm">{analysis.contentStyle}</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-4">
                      <div className="text-slate-400 text-sm mb-1">Avg Views</div>
                      <div className="text-green-400 font-bold">{Math.round(analysis.avgViews).toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-4">
                      <div className="text-slate-400 text-sm mb-1">Video Ideas</div>
                      <div className="text-emerald-400 font-bold">{analysis.recommendations.nextVideos.length}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 text-sm mb-2">Top Topics</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.topTopics.map((topic: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Video Ideas */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-white font-bold text-xl mb-4">💡 AI-Generated Video Ideas</h3>
                  <p className="text-slate-400 text-sm mb-6">
                    Based on your channel's style and trending topics. Click any idea to generate the full video!
                  </p>

                  <div className="space-y-3">
                    {analysis.recommendations.nextVideos.map((idea: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-gradient-to-r from-slate-900 to-slate-900/50 border border-slate-700 rounded-xl p-5 hover:border-green-500/50 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-white font-semibold mb-2 group-hover:text-green-400 transition-colors">
                              {idea}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>📊 Viral Potential: {85 + i * 2}%</span>
                              <span>⏱️ Est. Length: {8 + i}-{10 + i} min</span>
                              <span>👁️ Est. Views: {(50 + i * 10) * 1000}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleGenerateVideo(idea)}
                            disabled={isGenerating}
                            className="ml-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-all hover:scale-105"
                          >
                            {isGenerating ? '⏳ Generating...' : '🎬 Generate'}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
