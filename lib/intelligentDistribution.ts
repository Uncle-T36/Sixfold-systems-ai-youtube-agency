/**
 * INTELLIGENT DISTRIBUTION SYSTEM
 * Auto-distributes videos to best-performing platforms with viral marketing
 * Targets high-CPM regions, optimal posting times, and platform-specific optimization
 */

export interface Platform {
  id: string;
  name: string;
  icon: string;
  cpm: { min: number; max: number };
  optimalLength: { min: number; max: number }; // seconds
  bestPostingTimes: string[];
  audience: string;
  contentFormat: string;
  uploadAPI: string;
  status: 'active' | 'pending' | 'disabled';
}

export interface Region {
  id: string;
  name: string;
  countries: string[];
  avgCPM: number;
  languageCode: string;
  audience: string;
  marketPotential: number; // 1-10
  competition: 'low' | 'medium' | 'high';
}

export interface DistributionStrategy {
  videoId: string;
  videoTitle: string;
  platforms: PlatformStrategy[];
  targetRegions: string[];
  postingSchedule: PostingSchedule[];
  viralTactics: ViralTactic[];
  expectedReach: number;
  expectedRevenue: number;
  estimatedCPM: number;
}

export interface PlatformStrategy {
  platform: Platform;
  priority: number; // 1-10
  customization: {
    title: string;
    description: string;
    tags: string[];
    thumbnail: string;
    aspectRatio: string;
    length: number;
    captions: boolean;
    endScreen: string;
  };
  targetAudience: {
    age: string;
    interests: string[];
    regions: string[];
  };
  estimatedViews: number;
  estimatedRevenue: number;
}

export interface PostingSchedule {
  platform: string;
  dateTime: Date;
  timezone: string;
  reason: string;
  expectedEngagement: number;
}

export interface ViralTactic {
  id: string;
  type: 'free-marketing' | 'cross-promotion' | 'community' | 'seo' | 'trend-riding';
  name: string;
  description: string;
  platform: string;
  effort: 'low' | 'medium' | 'high';
  impact: number; // 1-10
  implementation: string;
  estimatedBoost: string;
  cost: number; // $0 for free tactics
}

export interface AutopilotSettings {
  enabled: boolean;
  maxVideosPerDay: number;
  platforms: string[];
  targetRegions: string[];
  postingStrategy: 'optimal-times' | 'consistent-schedule' | 'viral-windows';
  autoOptimize: boolean;
  backupContent: boolean;
  notifyOnPublish: boolean;
  pauseOnErrors: boolean;
}

// High-CPM platforms and regions
export const HIGH_CPM_PLATFORMS: Platform[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '🎥',
    cpm: { min: 2, max: 50 },
    optimalLength: { min: 480, max: 720 }, // 8-12 minutes
    bestPostingTimes: ['9:00 AM EST', '2:00 PM EST', '6:00 PM EST'],
    audience: 'Global, all demographics',
    contentFormat: '16:9, 1080p-4K',
    uploadAPI: 'youtube.videos.insert',
    status: 'active'
  },
  {
    id: 'youtube_shorts',
    name: 'YouTube Shorts',
    icon: '📱',
    cpm: { min: 0.5, max: 5 },
    optimalLength: { min: 15, max: 60 },
    bestPostingTimes: ['7:00 AM EST', '12:00 PM EST', '9:00 PM EST'],
    audience: 'Gen Z, Millennials',
    contentFormat: '9:16, 1080x1920',
    uploadAPI: 'youtube.videos.insert',
    status: 'active'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    cpm: { min: 1, max: 10 },
    optimalLength: { min: 21, max: 180 },
    bestPostingTimes: ['6:00 AM EST', '10:00 AM EST', '7:00 PM EST'],
    audience: 'Gen Z primarily',
    contentFormat: '9:16, 1080x1920',
    uploadAPI: 'tiktok.content.upload',
    status: 'active'
  },
  {
    id: 'instagram_reels',
    name: 'Instagram Reels',
    icon: '📸',
    cpm: { min: 1.5, max: 12 },
    optimalLength: { min: 15, max: 90 },
    bestPostingTimes: ['9:00 AM EST', '12:00 PM EST', '5:00 PM EST'],
    audience: 'Millennials, Gen Z',
    contentFormat: '9:16, 1080x1920',
    uploadAPI: 'instagram.media.publish',
    status: 'active'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '👥',
    cpm: { min: 1, max: 15 },
    optimalLength: { min: 60, max: 300 },
    bestPostingTimes: ['1:00 PM EST', '3:00 PM EST', '8:00 PM EST'],
    audience: 'Gen X, Boomers',
    contentFormat: '16:9 or 1:1',
    uploadAPI: 'facebook.pages.videos',
    status: 'active'
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: '🐦',
    cpm: { min: 2, max: 20 },
    optimalLength: { min: 30, max: 140 },
    bestPostingTimes: ['8:00 AM EST', '12:00 PM EST', '5:00 PM EST'],
    audience: 'News-focused, Tech-savvy',
    contentFormat: '16:9, 720p-1080p',
    uploadAPI: 'twitter.media.upload',
    status: 'active'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    cpm: { min: 5, max: 35 },
    optimalLength: { min: 60, max: 600 },
    bestPostingTimes: ['7:00 AM EST', '12:00 PM EST', '5:00 PM EST'],
    audience: 'Professionals, B2B',
    contentFormat: '16:9, 1080p',
    uploadAPI: 'linkedin.ugcPosts',
    status: 'active'
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: '📌',
    cpm: { min: 2, max: 18 },
    optimalLength: { min: 15, max: 60 },
    bestPostingTimes: ['8:00 PM EST', '9:00 PM EST', '2:00 AM EST'],
    audience: 'Women 25-54 primarily',
    contentFormat: '9:16, tutorials/how-to',
    uploadAPI: 'pinterest.pins.create',
    status: 'active'
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: '🤖',
    cpm: { min: 0.5, max: 8 },
    optimalLength: { min: 30, max: 300 },
    bestPostingTimes: ['10:00 AM EST', '2:00 PM EST', '8:00 PM EST'],
    audience: 'Tech-savvy, niche communities',
    contentFormat: 'Any, authentic content',
    uploadAPI: 'reddit.submit.video',
    status: 'active'
  },
  {
    id: 'snapchat',
    name: 'Snapchat Spotlight',
    icon: '👻',
    cpm: { min: 1, max: 8 },
    optimalLength: { min: 5, max: 60 },
    bestPostingTimes: ['6:00 AM EST', '3:00 PM EST', '9:00 PM EST'],
    audience: 'Gen Z 13-24',
    contentFormat: '9:16, fast-paced',
    uploadAPI: 'snapchat.spotlight.upload',
    status: 'active'
  }
];

// High-CPM regions
export const HIGH_CPM_REGIONS: Region[] = [
  {
    id: 'north_america_premium',
    name: 'North America Premium',
    countries: ['United States', 'Canada'],
    avgCPM: 28,
    languageCode: 'en',
    audience: 'High purchasing power, tech-savvy',
    marketPotential: 10,
    competition: 'high'
  },
  {
    id: 'nordic',
    name: 'Nordic Countries',
    countries: ['Norway', 'Sweden', 'Denmark', 'Finland', 'Iceland'],
    avgCPM: 42,
    languageCode: 'en',
    audience: 'Highest CPM globally, educated',
    marketPotential: 9,
    competition: 'low'
  },
  {
    id: 'oceania',
    name: 'Australia & New Zealand',
    countries: ['Australia', 'New Zealand'],
    avgCPM: 24,
    languageCode: 'en',
    audience: 'English-speaking, high engagement',
    marketPotential: 8,
    competition: 'medium'
  },
  {
    id: 'western_europe',
    name: 'Western Europe',
    countries: ['United Kingdom', 'Germany', 'France', 'Netherlands', 'Switzerland'],
    avgCPM: 18,
    languageCode: 'en',
    audience: 'Diverse, multilingual',
    marketPotential: 9,
    competition: 'high'
  },
  {
    id: 'gcc',
    name: 'Gulf Countries',
    countries: ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait'],
    avgCPM: 35,
    languageCode: 'ar',
    audience: 'Wealthy, young population',
    marketPotential: 8,
    competition: 'low'
  },
  {
    id: 'japan',
    name: 'Japan',
    countries: ['Japan'],
    avgCPM: 22,
    languageCode: 'ja',
    audience: 'Tech-focused, unique culture',
    marketPotential: 7,
    competition: 'medium'
  },
  {
    id: 'singapore',
    name: 'Singapore',
    countries: ['Singapore'],
    avgCPM: 26,
    languageCode: 'en',
    audience: 'Financial hub, educated',
    marketPotential: 7,
    competition: 'medium'
  }
];

// Free viral marketing tactics
export const VIRAL_TACTICS: ViralTactic[] = [
  {
    id: 'reddit_community',
    type: 'free-marketing',
    name: 'Reddit Niche Posting',
    description: 'Post in relevant subreddits with high engagement',
    platform: 'Reddit',
    effort: 'low',
    impact: 9,
    implementation: 'Find 5-10 niche subreddits, post with value-first approach, engage in comments',
    estimatedBoost: '+300-500% organic reach',
    cost: 0
  },
  {
    id: 'twitter_thread',
    type: 'free-marketing',
    name: 'Twitter Thread Strategy',
    description: 'Create engaging thread about video topic, link in last tweet',
    platform: 'Twitter',
    effort: 'low',
    impact: 8,
    implementation: 'Write 5-7 tweet thread with hooks, stats, insights. Video link at end.',
    estimatedBoost: '+200-400% clicks',
    cost: 0
  },
  {
    id: 'youtube_community',
    type: 'community',
    name: 'YouTube Community Posts',
    description: 'Use community tab for teasers, polls, behind-the-scenes',
    platform: 'YouTube',
    effort: 'low',
    impact: 7,
    implementation: 'Post 2-3 times/week: polls, teasers, questions to build anticipation',
    estimatedBoost: '+150-250% pre-launch engagement',
    cost: 0
  },
  {
    id: 'cross_promote_shorts',
    type: 'cross-promotion',
    name: 'Shorts to Long-Form Pipeline',
    description: 'Create 3-5 Shorts from main video, drive traffic to full version',
    platform: 'YouTube',
    effort: 'medium',
    impact: 10,
    implementation: 'Extract best 30-60s clips, add "full video in description", post 1-2 days before main video',
    estimatedBoost: '+400-700% views on main video',
    cost: 0
  },
  {
    id: 'seo_optimization',
    type: 'seo',
    name: 'Google Search Optimization',
    description: 'Optimize titles/descriptions for search traffic',
    platform: 'All',
    effort: 'low',
    impact: 8,
    implementation: 'Research keywords with Ubersuggest, include in title, description, tags',
    estimatedBoost: '+200-350% search traffic',
    cost: 0
  },
  {
    id: 'trending_hashtags',
    type: 'trend-riding',
    name: 'Trend Hijacking',
    description: 'Use trending hashtags relevant to content',
    platform: 'TikTok/Instagram',
    effort: 'low',
    impact: 9,
    implementation: 'Monitor trending page, use 3-5 trending + 3-5 niche hashtags',
    estimatedBoost: '+350-600% impressions',
    cost: 0
  },
  {
    id: 'comment_engagement',
    type: 'community',
    name: 'Comment Section Engagement',
    description: 'Reply to ALL comments in first 24h to boost algorithm',
    platform: 'All',
    effort: 'medium',
    impact: 9,
    implementation: 'Set notifications, reply within 1h, ask follow-up questions',
    estimatedBoost: '+250-400% algorithm boost',
    cost: 0
  },
  {
    id: 'email_list',
    type: 'free-marketing',
    name: 'Email List Building',
    description: 'Capture emails with lead magnet, notify on new videos',
    platform: 'All',
    effort: 'medium',
    impact: 8,
    implementation: 'Use Mailchimp free tier, offer PDF/guide, send weekly video alerts',
    estimatedBoost: '+200-300% loyal viewership',
    cost: 0
  },
  {
    id: 'facebook_groups',
    type: 'community',
    name: 'Facebook Group Strategy',
    description: 'Join/create niche groups, share value-first content',
    platform: 'Facebook',
    effort: 'medium',
    impact: 7,
    implementation: 'Find 10-15 active groups, provide value, share videos contextually',
    estimatedBoost: '+150-250% targeted reach',
    cost: 0
  },
  {
    id: 'quora_answers',
    type: 'seo',
    name: 'Quora Traffic Funnel',
    description: 'Answer questions related to video topics, link to video',
    platform: 'Quora',
    effort: 'low',
    impact: 6,
    implementation: 'Answer 3-5 questions/week with detailed responses, video as "additional resource"',
    estimatedBoost: '+100-200% evergreen traffic',
    cost: 0
  },
  {
    id: 'linkedin_articles',
    type: 'free-marketing',
    name: 'LinkedIn Article Marketing',
    description: 'Write LinkedIn articles about video topics',
    platform: 'LinkedIn',
    effort: 'high',
    impact: 8,
    implementation: 'Write 800-1200 word article, embed video, use professional insights',
    estimatedBoost: '+200-400% professional audience',
    cost: 0
  },
  {
    id: 'pinterest_boards',
    type: 'seo',
    name: 'Pinterest Board Strategy',
    description: 'Create themed boards, pin video thumbnails as graphics',
    platform: 'Pinterest',
    effort: 'low',
    impact: 7,
    implementation: 'Create 5-10 boards, pin 10-15 times/day with keywords',
    estimatedBoost: '+150-300% long-term traffic',
    cost: 0
  }
];

/**
 * Analyzes video and generates intelligent distribution strategy
 */
export function generateDistributionStrategy(video: {
  id: string;
  title: string;
  duration: number;
  niche: string;
  style: string;
  targetAudience: string;
}): DistributionStrategy {
  const platforms: PlatformStrategy[] = [];
  
  // YouTube long-form (primary monetization)
  if (video.duration >= 480) {
    const youtube = HIGH_CPM_PLATFORMS.find(p => p.id === 'youtube')!;
    platforms.push({
      platform: youtube,
      priority: 10,
      customization: {
        title: video.title,
        description: generateDescription(video, 'youtube'),
        tags: generateTags(video.niche),
        thumbnail: 'high-ctr-design',
        aspectRatio: '16:9',
        length: video.duration,
        captions: true,
        endScreen: 'playlist-subscribe'
      },
      targetAudience: {
        age: '18-45',
        interests: [video.niche, 'storytelling', 'education'],
        regions: HIGH_CPM_REGIONS.filter(r => r.avgCPM > 20).map(r => r.id)
      },
      estimatedViews: 50000,
      estimatedRevenue: 1200
    });
  }

  // YouTube Shorts (viral potential)
  platforms.push({
    platform: HIGH_CPM_PLATFORMS.find(p => p.id === 'youtube_shorts')!,
    priority: 9,
    customization: {
      title: `${video.title.slice(0, 60)} #Shorts`,
      description: generateDescription(video, 'shorts'),
      tags: generateTags(video.niche),
      thumbnail: 'auto-generated',
      aspectRatio: '9:16',
      length: 60,
      captions: true,
      endScreen: 'full-video-link'
    },
    targetAudience: {
      age: '16-35',
      interests: [video.niche, 'short-form'],
      regions: ['north_america_premium', 'western_europe']
    },
    estimatedViews: 150000,
    estimatedRevenue: 450
  });

  // TikTok (viral reach)
  platforms.push({
    platform: HIGH_CPM_PLATFORMS.find(p => p.id === 'tiktok')!,
    priority: 8,
    customization: {
      title: video.title.slice(0, 100),
      description: generateDescription(video, 'tiktok'),
      tags: ['fyp', 'viral', video.niche.toLowerCase()],
      thumbnail: 'auto-generated',
      aspectRatio: '9:16',
      length: 90,
      captions: true,
      endScreen: 'link-in-bio'
    },
    targetAudience: {
      age: '16-30',
      interests: [video.niche, 'entertainment'],
      regions: ['north_america_premium']
    },
    estimatedViews: 200000,
    estimatedRevenue: 1000
  });

  // Instagram Reels
  platforms.push({
    platform: HIGH_CPM_PLATFORMS.find(p => p.id === 'instagram_reels')!,
    priority: 7,
    customization: {
      title: video.title.slice(0, 75),
      description: generateDescription(video, 'instagram'),
      tags: generateHashtags(video.niche),
      thumbnail: 'auto-generated',
      aspectRatio: '9:16',
      length: 60,
      captions: true,
      endScreen: 'profile-link'
    },
    targetAudience: {
      age: '18-40',
      interests: [video.niche, 'lifestyle'],
      regions: ['north_america_premium', 'western_europe']
    },
    estimatedViews: 80000,
    estimatedRevenue: 600
  });

  // Generate posting schedule
  const postingSchedule = generateOptimalSchedule(platforms);

  // Select viral tactics
  const viralTactics = selectViralTactics(video.niche, platforms.length);

  // Calculate totals
  const expectedReach = platforms.reduce((sum, p) => sum + p.estimatedViews, 0);
  const expectedRevenue = platforms.reduce((sum, p) => sum + p.estimatedRevenue, 0);

  return {
    videoId: video.id,
    videoTitle: video.title,
    platforms,
    targetRegions: HIGH_CPM_REGIONS.filter(r => r.avgCPM > 20).map(r => r.id),
    postingSchedule,
    viralTactics,
    expectedReach,
    expectedRevenue,
    estimatedCPM: expectedRevenue / (expectedReach / 1000)
  };
}

function generateDescription(video: any, platform: string): string {
  const base = `${video.title}\n\n`;
  
  switch (platform) {
    case 'youtube':
      return base + `🔔 Subscribe for more ${video.niche} content!\n\n` +
        `In this video, we explore ${video.title.toLowerCase()}...\n\n` +
        `🎯 Timestamps:\n0:00 - Introduction\n2:00 - Main Story\n7:00 - Analysis\n9:00 - Conclusion\n\n` +
        `💬 What did you think? Comment below!\n\n` +
        `📱 Follow us:\nInstagram: @yourhandle\nTwitter: @yourhandle\nTikTok: @yourhandle`;
    
    case 'shorts':
      return `${video.title} 🔥\n\n👉 Watch full video: [link]\n\n#Shorts #${video.niche}`;
    
    case 'tiktok':
      return `${video.title} 🎬\n\nFollow for more! 🔥`;
    
    case 'instagram':
      return `${video.title}\n\n✨ Follow @yourhandle for more!\n\n${generateHashtags(video.niche).slice(0, 15).join(' ')}`;
    
    default:
      return base;
  }
}

function generateTags(niche: string): string[] {
  const baseKeywords = [niche.toLowerCase()];
  const nicheKeywords: Record<string, string[]> = {
    mystery: ['unsolved mystery', 'true mystery', 'mystery stories', 'strange mysteries'],
    crime: ['true crime', 'crime documentary', 'criminal cases', 'crime stories'],
    paranormal: ['paranormal stories', 'supernatural', 'ghost stories', 'unexplained'],
    history: ['history documentary', 'historical events', 'forgotten history'],
    science: ['science explained', 'strange science', 'science mysteries'],
    psychology: ['dark psychology', 'psychology facts', 'human behavior']
  };

  const keywords = nicheKeywords[niche.toLowerCase()] || [];
  return [...baseKeywords, ...keywords, 'storytelling', 'educational', 'documentary'];
}

function generateHashtags(niche: string): string[] {
  return [
    `#${niche}`,
    '#viral',
    '#foryou',
    '#fyp',
    '#trending',
    '#storytelling',
    '#storytime',
    '#documentary',
    '#educational',
    '#interesting'
  ];
}

function generateOptimalSchedule(platforms: PlatformStrategy[]): PostingSchedule[] {
  const schedule: PostingSchedule[] = [];
  const baseDate = new Date();

  platforms.forEach((strategy, index) => {
    const platform = strategy.platform;
    const optimalTime = platform.bestPostingTimes[0];
    const [time, meridiem, zone] = optimalTime.split(' ');
    
    // Schedule with 1-hour gaps between platforms
    const postDate = new Date(baseDate);
    postDate.setHours(parseInt(time) + index, 0, 0, 0);

    schedule.push({
      platform: platform.name,
      dateTime: postDate,
      timezone: 'EST',
      reason: `Peak engagement time for ${platform.audience}`,
      expectedEngagement: strategy.priority * 10
    });
  });

  return schedule.sort((a, b) => b.expectedEngagement - a.expectedEngagement);
}

function selectViralTactics(niche: string, platformCount: number): ViralTactic[] {
  // Select top tactics based on impact and platform coverage
  return VIRAL_TACTICS
    .filter(tactic => tactic.impact >= 7)
    .sort((a, b) => b.impact - a.impact)
    .slice(0, Math.min(6, platformCount * 2));
}

/**
 * Calculates optimal posting strategy for maximum revenue
 */
export function calculateOptimalStrategy(contentType: string, targetRevenue: number): {
  platforms: string[];
  postsPerWeek: number;
  expectedMonthlyRevenue: number;
  timeToTarget: number; // days
} {
  const strategies = {
    'long-form': {
      platforms: ['youtube', 'facebook'],
      revenuePerVideo: 800,
      postsPerWeek: 3
    },
    'short-form': {
      platforms: ['youtube_shorts', 'tiktok', 'instagram_reels'],
      revenuePerVideo: 300,
      postsPerWeek: 14
    },
    'mixed': {
      platforms: ['youtube', 'youtube_shorts', 'tiktok', 'instagram_reels'],
      revenuePerVideo: 550,
      postsPerWeek: 7
    }
  };

  const strategy = strategies[contentType as keyof typeof strategies] || strategies.mixed;
  const monthlyRevenue = strategy.revenuePerVideo * strategy.postsPerWeek * 4;
  const timeToTarget = Math.ceil((targetRevenue / monthlyRevenue) * 30);

  return {
    platforms: strategy.platforms,
    postsPerWeek: strategy.postsPerWeek,
    expectedMonthlyRevenue: monthlyRevenue,
    timeToTarget
  };
}

/**
 * Generates 30-day autopilot content calendar
 */
export function generateAutopilotCalendar(settings: AutopilotSettings): any[] {
  const calendar = [];
  const startDate = new Date();

  for (let day = 0; day < 30; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);

    // Calculate videos for this day
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Post more on weekdays
    const videosToday = isWeekend ? 
      Math.floor(settings.maxVideosPerDay * 0.6) : 
      settings.maxVideosPerDay;

    for (let i = 0; i < videosToday; i++) {
      calendar.push({
        date: date.toISOString().split('T')[0],
        time: getOptimalTime(i, settings.platforms),
        platforms: settings.platforms,
        status: 'scheduled',
        autoGenerate: true,
        backupReady: settings.backupContent
      });
    }
  }

  return calendar;
}

function getOptimalTime(index: number, platforms: string[]): string {
  const times = ['9:00 AM', '2:00 PM', '6:00 PM', '8:00 PM'];
  return times[index % times.length];
}

/**
 * Tracks distribution performance
 */
export function trackDistributionPerformance(videoId: string): {
  totalViews: number;
  totalRevenue: number;
  bestPlatform: string;
  bestRegion: string;
  cpm: number;
  engagement: number;
} {
  // ✅ REAL-TIME DATA: Fetch from actual connected channels
  const channels = getConnectedChannels();
  
  if (channels.length === 0) {
    // No channels connected yet - return empty state
    return {
      totalViews: 0,
      totalRevenue: 0,
      bestPlatform: 'Not yet determined',
      bestRegion: 'Global',
      cpm: 0,
      engagement: 0
    };
  }

  // Calculate real metrics from connected channels
  let totalViews = 0;
  let totalRevenue = 0;
  let totalEngagement = 0;
  const platformData: Record<string, { views: number; revenue: number; engagement: number }> = {};

  channels.forEach((channel: any) => {
    const platform = channel.platform || 'youtube';
    const views = channel.totalViews || 0;
    const revenue = channel.estimatedRevenue || 0;
    const engagement = channel.engagementRate || 0;

    if (!platformData[platform]) {
      platformData[platform] = { views: 0, revenue: 0, engagement: 0 };
    }

    platformData[platform].views += views;
    platformData[platform].revenue += revenue;
    platformData[platform].engagement += engagement;

    totalViews += views;
    totalRevenue += revenue;
    totalEngagement += engagement;
  });

  const avgEngagement = channels.length > 0 ? totalEngagement / channels.length : 0;

  // Find best performing platform
  const bestPlatform = Object.entries(platformData).length > 0
    ? Object.entries(platformData).sort(([, a], [, b]) => b.revenue - a.revenue)[0][0]
    : 'YouTube';

  return {
    totalViews,
    totalRevenue,
    bestPlatform,
    bestRegion: 'Global', // Can be enhanced with geo-analytics
    cpm: totalViews > 0 ? totalRevenue / (totalViews / 1000) : 0,
    engagement: avgEngagement
  };
}

// Helper function to get connected channels
function getConnectedChannels() {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('connected_channels');
  return stored ? JSON.parse(stored) : [];
}
