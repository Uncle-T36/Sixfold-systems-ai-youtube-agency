/**
 * 🤖 AUTONOMOUS COUNCIL SYSTEM
 * 
 * This system runs 24/7 and:
 * 1. Tracks trends for each connected channel
 * 2. Auto-generates videos based on trending topics
 * 3. Queues videos for upload
 * 4. Manages the upload schedule automatically
 * 
 * Works completely FREE - no paid APIs needed!
 */

import { getSafeChannels, setSafeChannels } from './dataProtection';
import { getNextVideoForChannel, generateChannelPlan, markVideoComplete } from './smartContentPlanner';

// ========================================
// TYPES
// ========================================

export interface TrendingTopic {
  id: string;
  title: string;
  category: string;
  searchVolume: number;
  growth: number; // percentage
  competition: 'low' | 'medium' | 'high';
  relevanceScore: number;
  detectedAt: string;
}

export interface ChannelTrendData {
  channelId: string;
  channelName: string;
  niche: string;
  lastUpdated: string;
  trends: TrendingTopic[];
  autoGenEnabled: boolean;
  autoUploadEnabled: boolean;
  videosGenerated: number;
  videosUploaded: number;
}

export interface QueuedVideo {
  id: string;
  channelId: string;
  channelName: string;
  title: string;
  description: string;
  script: string;
  tags: string[];
  thumbnail: string;
  trendSource: string;
  priority: number;
  status: 'queued' | 'generating' | 'ready' | 'uploading' | 'uploaded' | 'failed';
  createdAt: string;
  scheduledFor?: string;
  estimatedViews: number;
  estimatedRevenue: string;
}

export interface CouncilStatus {
  isActive: boolean;
  lastCheck: string;
  channelsMonitored: number;
  videosInQueue: number;
  videosGeneratedToday: number;
  videosUploadedToday: number;
  nextScheduledAction: string;
  alerts: { type: 'info' | 'warning' | 'success'; message: string; time: string }[];
}

// ========================================
// FREE TREND SOURCES (No API costs!)
// ========================================

const TREND_SOURCES = {
  // These are simulated but based on real trend patterns
  tech: [
    'AI tools nobody talks about', 'iPhone hidden features 2024', 'Free software better than paid',
    'ChatGPT alternatives', 'Automation secrets', 'Productivity apps', 'Best free VPN',
    'Windows tips and tricks', 'Mac vs Windows 2024', 'Best budget laptops'
  ],
  gaming: [
    'Secret Easter eggs', 'Best settings for FPS', 'Fastest leveling methods',
    'Hidden weapons locations', 'Pro player strategies', 'Game glitches still working',
    'Best free games 2024', 'Controller vs keyboard', 'Gaming setup under $500'
  ],
  finance: [
    'Passive income ideas 2024', 'Investing mistakes to avoid', 'Side hustle that pays',
    'Crypto for beginners', 'Budget tips that work', 'How to save money fast',
    'Credit score secrets', 'Tax deductions you miss', 'Retirement planning tips'
  ],
  motivation: [
    'Morning routines of billionaires', 'Habits that changed my life', 'Stoic wisdom for success',
    'How to overcome procrastination', 'Mindset shifts for wealth', 'Goal setting that works',
    'Discipline secrets', 'Self improvement tips', 'How to stay motivated'
  ],
  lifestyle: [
    'Life hacks you need', 'Minimalist living tips', 'Home organization ideas',
    'Cleaning hacks that work', 'Productivity at home', 'Self care routines',
    'Healthy habits daily', 'Time management tips', 'Work life balance'
  ],
  education: [
    'Study techniques that work', 'Memory improvement tips', 'Learn anything faster',
    'Best online courses free', 'Language learning hacks', 'Focus techniques',
    'Note taking methods', 'Speed reading tips', 'Exam preparation secrets'
  ],
  fitness: [
    'Home workout no equipment', 'Weight loss tips that work', 'Build muscle fast',
    'Best diet for beginners', 'Morning exercise routine', 'Flexibility training',
    'HIIT workouts at home', 'Protein sources natural', 'Recovery tips athletes'
  ]
};

const VIRAL_HOOKS = [
  "You won't believe", "The secret to", "Why nobody tells you about",
  "I tried this for 30 days", "The truth about", "Stop doing this immediately",
  "This changed everything", "The #1 mistake with", "How I discovered",
  "What they don't want you to know about"
];

const VIRAL_ENDINGS = [
  "...the results shocked me", "...and it actually works", "...here's what happened",
  "...you need to see this", "...my life changed forever", "...experts were wrong"
];

// ========================================
// TREND ANALYZER (FREE!)
// ========================================

function detectNiche(channelName: string, channelDescription: string = ''): string {
  const text = `${channelName} ${channelDescription}`.toLowerCase();
  
  if (text.includes('tech') || text.includes('software') || text.includes('app') || text.includes('ai')) return 'tech';
  if (text.includes('game') || text.includes('gaming') || text.includes('play')) return 'gaming';
  if (text.includes('money') || text.includes('finance') || text.includes('invest') || text.includes('crypto')) return 'finance';
  if (text.includes('motiv') || text.includes('success') || text.includes('mindset')) return 'motivation';
  if (text.includes('life') || text.includes('hack') || text.includes('home') || text.includes('diy')) return 'lifestyle';
  if (text.includes('learn') || text.includes('study') || text.includes('education') || text.includes('school')) return 'education';
  if (text.includes('fit') || text.includes('gym') || text.includes('workout') || text.includes('health')) return 'fitness';
  
  return 'motivation'; // Default to motivation - always works
}

export function getTrendingTopics(niche: string): TrendingTopic[] {
  const nicheTrends = TREND_SOURCES[niche as keyof typeof TREND_SOURCES] || TREND_SOURCES.motivation;
  
  // Generate trending topics with realistic metrics
  return nicheTrends.map((topic, index) => ({
    id: `trend_${Date.now()}_${index}`,
    title: topic,
    category: niche,
    searchVolume: Math.floor(10000 + Math.random() * 90000),
    growth: Math.floor(10 + Math.random() * 150),
    competition: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
    relevanceScore: 70 + Math.floor(Math.random() * 30),
    detectedAt: new Date().toISOString()
  })).sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// ========================================
// VIDEO GENERATION (FREE!)
// ========================================

function generateViralTitle(topic: string): string {
  const hook = VIRAL_HOOKS[Math.floor(Math.random() * VIRAL_HOOKS.length)];
  const ending = VIRAL_ENDINGS[Math.floor(Math.random() * VIRAL_ENDINGS.length)];
  return `${hook} ${topic} ${ending}`;
}

function generateScript(title: string, topic: string, niche: string): string {
  return `[HOOK - 0:00-0:15]
${title}

Stay until the end - I'm revealing something that took me years to figure out.

[INTRO - 0:15-0:45]
What's going on everyone! Today we're diving deep into ${topic}.

This is something that's been absolutely game-changing, and I had to share it with you.

[MAIN CONTENT - 0:45-5:00]

PART 1: THE PROBLEM
Most people approach ${topic} completely wrong. They think it's about working harder, but it's actually about working smarter.

Let me break down exactly what I mean...

PART 2: THE SOLUTION
Here's the exact framework that changed everything for me:

Step 1: Identify your biggest obstacle with ${topic}
Step 2: Apply the 80/20 rule - focus on what actually moves the needle
Step 3: Automate or eliminate everything that doesn't serve your goal

PART 3: THE SECRET
This is what separates the top 1% from everyone else. They understand that ${topic} is really about consistency over intensity.

Small daily actions compound into massive results.

[EXAMPLES - 5:00-6:00]
Let me show you exactly how this works in practice...

[CALL TO ACTION - 6:00-6:30]
If this video helped you, smash that like button - it helps the algorithm show this to more people who need it.

Subscribe if you want more content like this, and drop a comment telling me what topic you want me to cover next.

[OUTRO - 6:30-7:00]
Thanks for watching! See you in the next one.

Remember: Knowledge without action is useless. Go apply what you learned TODAY.`;
}

function generateDescription(title: string, topic: string, tags: string[]): string {
  return `${title}

In this video, I break down exactly how to master ${topic}. This is the same strategy that helped me achieve incredible results, and I'm sharing it all with you for free.

🔔 SUBSCRIBE for more videos like this!
👍 LIKE if this was helpful
💬 COMMENT your thoughts below

📌 TIMESTAMPS:
0:00 - Hook
0:15 - Introduction  
0:45 - Part 1: The Problem
2:30 - Part 2: The Solution
4:15 - Part 3: The Secret
5:00 - Real Examples
6:00 - Call to Action
6:30 - Outro

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 RELATED VIDEOS:
▶️ More ${topic} content coming soon!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

#${tags.join(' #')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ DISCLAIMER: This video is for educational purposes only. Individual results may vary based on effort and circumstances.`;
}

function generateTags(topic: string, niche: string): string[] {
  const baseTags = [niche, '2024', 'viral', 'trending', 'mustwatch'];
  const topicTags = topic.toLowerCase().split(' ').filter(t => t.length > 3);
  return [...baseTags, ...topicTags].slice(0, 15);
}

// ========================================
// AUTONOMOUS COUNCIL CORE
// ========================================

const COUNCIL_STATUS_KEY = 'autonomous_council_status';
const CHANNEL_TRENDS_KEY = 'channel_trends';
const VIDEO_QUEUE_KEY = 'video_queue';

export function getCouncilStatus(): CouncilStatus {
  try {
    const stored = localStorage.getItem(COUNCIL_STATUS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  
  return {
    isActive: false,
    lastCheck: new Date().toISOString(),
    channelsMonitored: 0,
    videosInQueue: 0,
    videosGeneratedToday: 0,
    videosUploadedToday: 0,
    nextScheduledAction: 'Waiting for activation...',
    alerts: []
  };
}

function saveCouncilStatus(status: CouncilStatus): void {
  localStorage.setItem(COUNCIL_STATUS_KEY, JSON.stringify(status));
}

export function getChannelTrends(): ChannelTrendData[] {
  try {
    const stored = localStorage.getItem(CHANNEL_TRENDS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return [];
}

function saveChannelTrends(trends: ChannelTrendData[]): void {
  localStorage.setItem(CHANNEL_TRENDS_KEY, JSON.stringify(trends));
}

export function getVideoQueue(): QueuedVideo[] {
  try {
    const stored = localStorage.getItem(VIDEO_QUEUE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return [];
}

function saveVideoQueue(queue: QueuedVideo[]): void {
  localStorage.setItem(VIDEO_QUEUE_KEY, JSON.stringify(queue));
}

// ========================================
// MAIN COUNCIL FUNCTIONS
// ========================================

/**
 * Initialize or refresh trend tracking for all channels
 */
export function refreshAllChannelTrends(): ChannelTrendData[] {
  const channels = getSafeChannels();
  const existingTrends = getChannelTrends();
  
  const updatedTrends: ChannelTrendData[] = channels.map((channel: any) => {
    const existing = existingTrends.find(t => t.channelId === channel.id);
    const niche = detectNiche(channel.name, channel.description);
    const trends = getTrendingTopics(niche);
    
    return {
      channelId: channel.id,
      channelName: channel.name,
      niche,
      lastUpdated: new Date().toISOString(),
      trends,
      autoGenEnabled: existing?.autoGenEnabled ?? true,
      autoUploadEnabled: existing?.autoUploadEnabled ?? false, // Default off for safety
      videosGenerated: existing?.videosGenerated ?? 0,
      videosUploaded: existing?.videosUploaded ?? 0
    };
  });
  
  saveChannelTrends(updatedTrends);
  
  // Update council status
  const status = getCouncilStatus();
  status.channelsMonitored = updatedTrends.length;
  status.lastCheck = new Date().toISOString();
  status.alerts.unshift({
    type: 'success',
    message: `Trends refreshed for ${updatedTrends.length} channels`,
    time: new Date().toISOString()
  });
  status.alerts = status.alerts.slice(0, 50); // Keep last 50 alerts
  saveCouncilStatus(status);
  
  return updatedTrends;
}

/**
 * Auto-generate a video based on top trend for a channel
 * Now uses Smart Content Planner for optimal titles
 */
export function autoGenerateVideo(channelId: string): QueuedVideo | null {
  const trends = getChannelTrends();
  const channelTrend = trends.find(t => t.channelId === channelId);
  
  // Try Smart Content Planner first for better titles
  const smartVideo = getNextVideoForChannel(channelId);
  
  if (smartVideo) {
    // Use the smart planner's pre-generated content
    const channels = getSafeChannels();
    const channel = channels.find((c: any) => c.id === channelId);
    
    const video: QueuedVideo = {
      id: smartVideo.id,
      channelId,
      channelName: channel?.name || channelTrend?.channelName || 'Channel',
      title: smartVideo.title,
      description: smartVideo.description,
      script: smartVideo.script,
      tags: smartVideo.tags,
      thumbnail: `https://via.placeholder.com/1280x720/667eea/ffffff?text=${encodeURIComponent(smartVideo.title.substring(0, 15))}`,
      trendSource: 'Smart Content Planner',
      priority: smartVideo.priority === 'urgent' ? 100 : smartVideo.priority === 'high' ? 80 : 50,
      status: 'ready',
      createdAt: new Date().toISOString(),
      estimatedViews: smartVideo.estimatedViews,
      estimatedRevenue: `$${smartVideo.estimatedRevenue.toFixed(0)} - $${(smartVideo.estimatedRevenue * 2).toFixed(0)}`
    };
    
    // Add to queue
    const queue = getVideoQueue();
    queue.unshift(video);
    saveVideoQueue(queue);
    
    // Mark as used in smart planner
    markVideoComplete(channelId, smartVideo.id);
    
    // Update channel trend data
    if (channelTrend) {
      channelTrend.videosGenerated++;
      saveChannelTrends(trends);
    }
    
    // Also save to all_generated_videos for My Videos page
    const allVideos = JSON.parse(localStorage.getItem('all_generated_videos') || '[]');
    allVideos.unshift(video);
    localStorage.setItem('all_generated_videos', JSON.stringify(allVideos));
    
    // Update council status
    const status = getCouncilStatus();
    status.videosInQueue = queue.length;
    status.videosGeneratedToday++;
    status.alerts.unshift({
      type: 'success',
      message: `🧠 Smart Generated: "${video.title.substring(0, 40)}..."`,
      time: new Date().toISOString()
    });
    saveCouncilStatus(status);
    
    console.log(`🧠 Smart Content Planner generated: ${video.title}`);
    return video;
  }
  
  // Fallback to trend-based generation
  if (!channelTrend || !channelTrend.trends.length) {
    console.log('No trends found for channel');
    return null;
  }
  
  // Pick top trend
  const topTrend = channelTrend.trends[0];
  const title = generateViralTitle(topTrend.title);
  const script = generateScript(title, topTrend.title, channelTrend.niche);
  const tags = generateTags(topTrend.title, channelTrend.niche);
  const description = generateDescription(title, topTrend.title, tags);
  
  // Calculate estimates
  const channels = getSafeChannels();
  const channel = channels.find((c: any) => c.id === channelId);
  const baseViews = Math.max(100, (channel?.subscriberCount || 1000) * 0.15);
  const estimatedViews = Math.round(baseViews * (0.8 + Math.random() * 0.4));
  const cpm = 3 + Math.random() * 4;
  const minRev = (estimatedViews / 1000) * cpm;
  const maxRev = minRev * 2.5;
  
  const video: QueuedVideo = {
    id: `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    channelId,
    channelName: channelTrend.channelName,
    title,
    description,
    script,
    tags,
    thumbnail: `https://via.placeholder.com/1280x720/667eea/ffffff?text=${encodeURIComponent(topTrend.title.substring(0, 15))}`,
    trendSource: topTrend.title,
    priority: topTrend.relevanceScore,
    status: 'ready',
    createdAt: new Date().toISOString(),
    estimatedViews,
    estimatedRevenue: `$${minRev.toFixed(0)} - $${maxRev.toFixed(0)}`
  };
  
  // Add to queue
  const queue = getVideoQueue();
  queue.unshift(video);
  saveVideoQueue(queue);
  
  // Update channel trend data
  channelTrend.videosGenerated++;
  channelTrend.trends = channelTrend.trends.slice(1); // Remove used trend
  saveChannelTrends(trends);
  
  // Also save to all_generated_videos for My Videos page
  const allVideos = JSON.parse(localStorage.getItem('all_generated_videos') || '[]');
  allVideos.unshift(video);
  localStorage.setItem('all_generated_videos', JSON.stringify(allVideos));
  
  // Update council status
  const status = getCouncilStatus();
  status.videosInQueue = queue.length;
  status.videosGeneratedToday++;
  status.alerts.unshift({
    type: 'success',
    message: `Auto-generated: "${title.substring(0, 40)}..."`,
    time: new Date().toISOString()
  });
  saveCouncilStatus(status);
  
  return video;
}

/**
 * Auto-generate videos for ALL channels that have auto-gen enabled
 */
export function autoGenerateForAllChannels(): QueuedVideo[] {
  const trends = getChannelTrends();
  const generated: QueuedVideo[] = [];
  
  trends.forEach(channelTrend => {
    if (channelTrend.autoGenEnabled && channelTrend.trends.length > 0) {
      const video = autoGenerateVideo(channelTrend.channelId);
      if (video) generated.push(video);
    }
  });
  
  return generated;
}

/**
 * Toggle auto-generation for a channel
 */
export function toggleAutoGen(channelId: string, enabled: boolean): void {
  const trends = getChannelTrends();
  const trend = trends.find(t => t.channelId === channelId);
  if (trend) {
    trend.autoGenEnabled = enabled;
    saveChannelTrends(trends);
  }
}

/**
 * Toggle auto-upload for a channel
 */
export function toggleAutoUpload(channelId: string, enabled: boolean): void {
  const trends = getChannelTrends();
  const trend = trends.find(t => t.channelId === channelId);
  if (trend) {
    trend.autoUploadEnabled = enabled;
    saveChannelTrends(trends);
  }
}

/**
 * Activate the Autonomous Council
 */
export function activateCouncil(): CouncilStatus {
  const status = getCouncilStatus();
  status.isActive = true;
  status.lastCheck = new Date().toISOString();
  status.nextScheduledAction = 'Trend analysis in 1 hour';
  status.alerts.unshift({
    type: 'success',
    message: '🤖 Autonomous Council ACTIVATED - Running 24/7',
    time: new Date().toISOString()
  });
  saveCouncilStatus(status);
  
  // Initial trend refresh
  refreshAllChannelTrends();
  
  return status;
}

/**
 * Deactivate the Autonomous Council
 */
export function deactivateCouncil(): CouncilStatus {
  const status = getCouncilStatus();
  status.isActive = false;
  status.nextScheduledAction = 'Council is paused';
  status.alerts.unshift({
    type: 'warning',
    message: '⏸️ Autonomous Council PAUSED',
    time: new Date().toISOString()
  });
  saveCouncilStatus(status);
  return status;
}

/**
 * Get summary for dashboard
 */
export function getCouncilSummary() {
  const status = getCouncilStatus();
  const trends = getChannelTrends();
  const queue = getVideoQueue();
  
  return {
    status,
    totalChannels: trends.length,
    totalTrends: trends.reduce((acc, t) => acc + t.trends.length, 0),
    queuedVideos: queue.filter(v => v.status === 'queued' || v.status === 'ready').length,
    uploadedVideos: queue.filter(v => v.status === 'uploaded').length,
    channels: trends.map(t => ({
      id: t.channelId,
      name: t.channelName,
      niche: t.niche,
      trendsAvailable: t.trends.length,
      autoGenEnabled: t.autoGenEnabled,
      autoUploadEnabled: t.autoUploadEnabled,
      videosGenerated: t.videosGenerated
    }))
  };
}
