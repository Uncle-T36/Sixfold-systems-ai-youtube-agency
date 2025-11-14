/**
 * CROSS-PLATFORM EMPIRE BUILDER
 * Dominate YouTube, TikTok, Instagram, Twitter, LinkedIn, Pinterest
 * Cost: $0 - All platforms are FREE
 */

export interface PlatformConfig {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  monetizationEnabled: boolean;
  revenueShare: number; // 0-100%
  optimalFormat: {
    duration: string;
    aspectRatio: string;
    captions: boolean;
    thumbnailSize: string;
  };
  postingFrequency: string;
  bestTimes: string[];
  contentStrategy: string;
}

export interface CrossPlatformContent {
  masterVideo: {
    id: string;
    title: string;
    script: string;
    duration: number;
    niche: string;
  };
  platformVersions: {
    platform: string;
    title: string;
    description: string;
    format: string;
    duration: number;
    hooks: string[];
    hashtags: string[];
    optimalPostTime: Date;
    estimatedViews: number;
    estimatedRevenue: number;
  }[];
  totalReach: number;
  totalRevenue: number;
}

export interface PlatformMetrics {
  platform: string;
  followers: number;
  avgViews: number;
  engagement: number;
  monthlyRevenue: number;
  growthRate: number;
  viralProbability: number;
}

/**
 * All supported platforms (100% FREE)
 */
export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '🎥',
    enabled: true,
    monetizationEnabled: true,
    revenueShare: 55, // Creator's share
    optimalFormat: {
      duration: '8-15 minutes',
      aspectRatio: '16:9',
      captions: true,
      thumbnailSize: '1280x720'
    },
    postingFrequency: '3-5x per week',
    bestTimes: ['9:00 AM', '2:00 PM', '6:00 PM'],
    contentStrategy: 'Long-form storytelling, high-value content, SEO optimized'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    enabled: true,
    monetizationEnabled: true,
    revenueShare: 50, // Creator Fund
    optimalFormat: {
      duration: '30-60 seconds',
      aspectRatio: '9:16',
      captions: true,
      thumbnailSize: 'N/A'
    },
    postingFrequency: '3-5x per day',
    bestTimes: ['7:00 AM', '12:00 PM', '9:00 PM'],
    contentStrategy: 'Hook first 3 seconds, trending sounds, viral challenges'
  },
  {
    id: 'instagram_reels',
    name: 'Instagram Reels',
    icon: '📸',
    enabled: true,
    monetizationEnabled: true,
    revenueShare: 0, // Bonuses only
    optimalFormat: {
      duration: '30-90 seconds',
      aspectRatio: '9:16',
      captions: true,
      thumbnailSize: 'N/A'
    },
    postingFrequency: '2-3x per day',
    bestTimes: ['9:00 AM', '5:00 PM'],
    contentStrategy: 'Visual storytelling, trending audio, engaging hooks'
  },
  {
    id: 'youtube_shorts',
    name: 'YouTube Shorts',
    icon: '📱',
    enabled: true,
    monetizationEnabled: true,
    revenueShare: 45, // Ad revenue split
    optimalFormat: {
      duration: '15-60 seconds',
      aspectRatio: '9:16',
      captions: true,
      thumbnailSize: 'N/A'
    },
    postingFrequency: '3-5x per day',
    bestTimes: ['8:00 AM', '1:00 PM', '7:00 PM'],
    contentStrategy: 'Quick value, subscribe CTAs, drive to long-form'
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: '🐦',
    enabled: true,
    monetizationEnabled: true,
    revenueShare: 100, // Premium subscription revenue share
    optimalFormat: {
      duration: '2-5 minutes',
      aspectRatio: '16:9 or 1:1',
      captions: true,
      thumbnailSize: 'N/A'
    },
    postingFrequency: '5-10x per day',
    bestTimes: ['8:00 AM', '12:00 PM', '5:00 PM'],
    contentStrategy: 'Thread content, viral takes, community engagement'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    enabled: false, // Enable for B2B niches
    monetizationEnabled: false, // Indirect monetization
    revenueShare: 0,
    optimalFormat: {
      duration: '1-3 minutes',
      aspectRatio: '1:1 or 16:9',
      captions: true,
      thumbnailSize: 'N/A'
    },
    postingFrequency: '1x per day',
    bestTimes: ['8:00 AM', '12:00 PM', '5:00 PM'],
    contentStrategy: 'Professional insights, industry trends, thought leadership'
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: '📌',
    enabled: false, // Enable for visual niches
    monetizationEnabled: true,
    revenueShare: 0, // Affiliate commissions
    optimalFormat: {
      duration: 'Images/15 sec clips',
      aspectRatio: '2:3 vertical',
      captions: false,
      thumbnailSize: '1000x1500'
    },
    postingFrequency: '10-20x per day',
    bestTimes: ['2:00 PM', '8:00 PM', '10:00 PM'],
    contentStrategy: 'Keyword-rich pins, affiliate links, evergreen content'
  },
  {
    id: 'snapchat',
    name: 'Snapchat Spotlight',
    icon: '👻',
    enabled: false,
    monetizationEnabled: true,
    revenueShare: 100, // Spotlight payouts
    optimalFormat: {
      duration: '15-60 seconds',
      aspectRatio: '9:16',
      captions: true,
      thumbnailSize: 'N/A'
    },
    postingFrequency: '2-3x per day',
    bestTimes: ['3:00 PM', '6:00 PM', '9:00 PM'],
    contentStrategy: 'Viral-first content, trending topics, youth appeal'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    enabled: false, // Declining platform but still profitable
    monetizationEnabled: true,
    revenueShare: 55,
    optimalFormat: {
      duration: '3-5 minutes',
      aspectRatio: '1:1 or 16:9',
      captions: true,
      thumbnailSize: 'N/A'
    },
    postingFrequency: '1-2x per day',
    bestTimes: ['9:00 AM', '1:00 PM', '7:00 PM'],
    contentStrategy: 'Community building, shareable content, older demographics'
  }
];

/**
 * Convert 1 master video into platform-specific versions
 */
export async function createCrossPlatformContent(masterVideo: {
  title: string;
  script: string;
  duration: number;
  niche: string;
  keywords: string[];
}): Promise<CrossPlatformContent> {
  const platformVersions = [];
  let totalReach = 0;
  let totalRevenue = 0;

  // YouTube Long-form (original)
  platformVersions.push({
    platform: 'YouTube',
    title: masterVideo.title,
    description: generateDescription('youtube', masterVideo),
    format: '16:9 HD video',
    duration: masterVideo.duration,
    hooks: [masterVideo.script.substring(0, 100)],
    hashtags: generateHashtags('youtube', masterVideo.keywords),
    optimalPostTime: getOptimalPostTime('youtube'),
    estimatedViews: 50000,
    estimatedRevenue: 250 // $5 CPM
  });

  // YouTube Shorts (3 clips from master)
  for (let i = 0; i < 3; i++) {
    platformVersions.push({
      platform: 'YouTube Shorts',
      title: `${masterVideo.title} - Part ${i + 1}`,
      description: generateDescription('youtube_shorts', masterVideo),
      format: '9:16 vertical',
      duration: 45,
      hooks: generateShortsHooks(masterVideo.script, i),
      hashtags: generateHashtags('youtube_shorts', masterVideo.keywords),
      optimalPostTime: getOptimalPostTime('youtube_shorts', i),
      estimatedViews: 100000,
      estimatedRevenue: 50
    });
  }

  // TikTok (5 clips)
  for (let i = 0; i < 5; i++) {
    platformVersions.push({
      platform: 'TikTok',
      title: generateTikTokTitle(masterVideo.title, i),
      description: generateDescription('tiktok', masterVideo),
      format: '9:16 vertical',
      duration: 50,
      hooks: generateTikTokHooks(masterVideo.script, i),
      hashtags: generateHashtags('tiktok', masterVideo.keywords),
      optimalPostTime: getOptimalPostTime('tiktok', i),
      estimatedViews: 200000,
      estimatedRevenue: 100
    });
  }

  // Instagram Reels (3 clips)
  for (let i = 0; i < 3; i++) {
    platformVersions.push({
      platform: 'Instagram Reels',
      title: `${masterVideo.title} 🔥`,
      description: generateDescription('instagram_reels', masterVideo),
      format: '9:16 vertical',
      duration: 60,
      hooks: generateReelsHooks(masterVideo.script, i),
      hashtags: generateHashtags('instagram_reels', masterVideo.keywords),
      optimalPostTime: getOptimalPostTime('instagram_reels', i),
      estimatedViews: 150000,
      estimatedRevenue: 75
    });
  }

  // Twitter/X (1 teaser video + 5 thread tweets)
  platformVersions.push({
    platform: 'Twitter/X',
    title: `THREAD: ${masterVideo.title} 🧵`,
    description: generateThreadContent(masterVideo.script),
    format: '16:9 or 1:1',
    duration: 120,
    hooks: [masterVideo.script.substring(0, 280)],
    hashtags: generateHashtags('twitter', masterVideo.keywords),
    optimalPostTime: getOptimalPostTime('twitter'),
    estimatedViews: 50000,
    estimatedRevenue: 0 // Indirect revenue
  });

  // Calculate totals
  platformVersions.forEach(v => {
    totalReach += v.estimatedViews;
    totalRevenue += v.estimatedRevenue;
  });

  return {
    masterVideo: {
      id: `video_${Date.now()}`,
      ...masterVideo
    },
    platformVersions,
    totalReach,
    totalRevenue
  };
}

/**
 * Generate platform-specific descriptions
 */
function generateDescription(platform: string, video: any): string {
  const base = video.script.substring(0, 200) + '...';
  
  const platformDescriptions: Record<string, string> = {
    youtube: `${base}

🔔 SUBSCRIBE for more ${video.niche} content!
👍 LIKE if you found this valuable
💬 COMMENT your thoughts below

━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 RESOURCES
━━━━━━━━━━━━━━━━━━━━━━━━━━
[Affiliate links here]

#${video.keywords.join(' #')}`,
    
    youtube_shorts: `${video.title} 🔥

Part of our ${video.niche} series!
➡️ Watch full video on my channel

#Shorts #${video.keywords[0]}`,
    
    tiktok: `${base.substring(0, 150)}

Follow for more ${video.niche} content! 🔥
#fyp #foryou #viral`,
    
    instagram_reels: `${video.title} 🎬

${base.substring(0, 100)}

Follow @yourhandle for daily ${video.niche} content!`,
    
    twitter: `🧵 THREAD: ${video.title}

${base.substring(0, 250)}

Let me break this down...`
  };

  return platformDescriptions[platform] || base;
}

/**
 * Generate platform-specific hashtags
 */
function generateHashtags(platform: string, keywords: string[]): string[] {
  const baseHashtags = keywords.map(k => k.replace(/\s+/g, ''));
  
  const platformTags: Record<string, string[]> = {
    youtube: [...baseHashtags.slice(0, 3)],
    youtube_shorts: ['Shorts', 'Viral', ...baseHashtags.slice(0, 2)],
    tiktok: ['fyp', 'foryou', 'viral', 'trending', ...baseHashtags.slice(0, 3)],
    instagram_reels: ['reels', 'explore', 'viral', ...baseHashtags.slice(0, 5)],
    twitter: baseHashtags.slice(0, 2)
  };

  return platformTags[platform] || baseHashtags;
}

/**
 * Generate shorts hooks
 */
function generateShortsHooks(script: string, index: number): string[] {
  const hookPatterns = [
    `Wait until you hear this... ${script.substring(0, 50)}`,
    `This will blow your mind: ${script.substring(0, 50)}`,
    `Nobody talks about this: ${script.substring(0, 50)}`,
    `You won't believe what happened: ${script.substring(0, 50)}`,
    `This changes everything: ${script.substring(0, 50)}`
  ];
  
  return [hookPatterns[index % hookPatterns.length]];
}

/**
 * Generate TikTok hooks
 */
function generateTikTokHooks(script: string, index: number): string[] {
  const hooks = [
    `POV: You just discovered ${script.substring(20, 40)}`,
    `Wait for it... 👀`,
    `This is actually crazy`,
    `Not many people know this`,
    `Real talk:`
  ];
  
  return [hooks[index % hooks.length]];
}

/**
 * Generate Reels hooks
 */
function generateReelsHooks(script: string, index: number): string[] {
  const hooks = [
    `Here's what you need to know about ${script.substring(10, 30)}`,
    `The truth about ${script.substring(10, 30)}`,
    `Let me show you something crazy`
  ];
  return [hooks[index % 3]];
}

/**
 * Generate TikTok titles
 */
function generateTikTokTitle(baseTitle: string, index: number): string {
  const prefixes = ['', 'Part 2:', 'Watch this:', 'POV:', 'The Truth:'];
  return `${prefixes[index % prefixes.length]} ${baseTitle}`.substring(0, 100);
}

/**
 * Generate Twitter thread content
 */
function generateThreadContent(script: string): string {
  const sentences = script.split('. ').slice(0, 5);
  return sentences.map((s, i) => `${i + 1}/ ${s}.`).join('\n\n');
}

/**
 * Get optimal posting time for platform
 */
function getOptimalPostTime(platform: string, index: number = 0): Date {
  const optimalTimes: Record<string, string[]> = {
    youtube: ['09:00', '14:00', '18:00'],
    youtube_shorts: ['08:00', '13:00', '19:00'],
    tiktok: ['07:00', '12:00', '21:00'],
    instagram_reels: ['09:00', '17:00'],
    twitter: ['08:00', '12:00', '17:00']
  };

  const times = optimalTimes[platform] || ['12:00'];
  const [hours, minutes] = times[index % times.length].split(':');
  
  const postTime = new Date();
  postTime.setHours(parseInt(hours), parseInt(minutes), 0);
  postTime.setDate(postTime.getDate() + Math.floor(index / times.length));

  return postTime;
}

/**
 * Calculate platform-specific revenue potential
 */
export function calculatePlatformRevenue(metrics: PlatformMetrics[]): {
  totalMonthly: number;
  breakdown: Record<string, number>;
  projections: { month: number; total: number }[];
} {
  const breakdown: Record<string, number> = {};
  let totalMonthly = 0;

  metrics.forEach(metric => {
    const monthly = metric.monthlyRevenue;
    breakdown[metric.platform] = monthly;
    totalMonthly += monthly;
  });

  // 12-month projections with platform-specific growth
  const projections = [];
  for (let i = 1; i <= 12; i++) {
    let projected = 0;
    metrics.forEach(metric => {
      // Compound growth per platform
      projected += metric.monthlyRevenue * Math.pow(1 + metric.growthRate / 100, i);
    });
    projections.push({ month: i, total: Math.round(projected) });
  }

  return {
    totalMonthly,
    breakdown,
    projections
  };
}

/**
 * Generate posting schedule across all platforms
 */
export function generateCrossPlatformSchedule(days: number = 30): {
  date: Date;
  platform: string;
  contentType: string;
  time: string;
}[] {
  const schedule = [];
  const startDate = new Date();

  for (let day = 0; day < days; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);

    // YouTube: 3x per week (Mon, Wed, Fri)
    if ([1, 3, 5].includes(date.getDay())) {
      schedule.push({
        date: new Date(date.setHours(18, 0, 0)),
        platform: 'YouTube',
        contentType: 'Long-form video',
        time: '6:00 PM'
      });
    }

    // YouTube Shorts: Daily at 3 different times
    [8, 13, 19].forEach(hour => {
      schedule.push({
        date: new Date(date.setHours(hour, 0, 0)),
        platform: 'YouTube Shorts',
        contentType: 'Short clip',
        time: `${hour}:00`
      });
    });

    // TikTok: 5x per day
    [7, 10, 14, 18, 21].forEach(hour => {
      schedule.push({
        date: new Date(date.setHours(hour, 0, 0)),
        platform: 'TikTok',
        contentType: 'Viral clip',
        time: `${hour}:00`
      });
    });

    // Instagram Reels: 3x per day
    [9, 15, 20].forEach(hour => {
      schedule.push({
        date: new Date(date.setHours(hour, 0, 0)),
        platform: 'Instagram Reels',
        contentType: 'Reel',
        time: `${hour}:00`
      });
    });

    // Twitter/X: 5x per day
    [8, 11, 14, 17, 20].forEach(hour => {
      schedule.push({
        date: new Date(date.setHours(hour, 0, 0)),
        platform: 'Twitter/X',
        contentType: 'Tweet/Thread',
        time: `${hour}:00`
      });
    });
  }

  return schedule.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Track empire growth
 */
export function trackEmpireGrowth(userId: string): {
  totalFollowers: number;
  totalMonthlyViews: number;
  totalMonthlyRevenue: number;
  platformBreakdown: PlatformMetrics[];
  growthRate: number;
  projectedAnnualRevenue: number;
} {
  const platforms: PlatformMetrics[] = JSON.parse(
    localStorage.getItem(`platform_metrics_${userId}`) || '[]'
  );

  const totalFollowers = platforms.reduce((sum, p) => sum + p.followers, 0);
  const totalMonthlyViews = platforms.reduce((sum, p) => sum + p.avgViews * 30, 0);
  const totalMonthlyRevenue = platforms.reduce((sum, p) => sum + p.monthlyRevenue, 0);
  const avgGrowth = platforms.reduce((sum, p) => sum + p.growthRate, 0) / platforms.length;

  return {
    totalFollowers,
    totalMonthlyViews,
    totalMonthlyRevenue,
    platformBreakdown: platforms,
    growthRate: avgGrowth,
    projectedAnnualRevenue: totalMonthlyRevenue * 12 * (1 + avgGrowth / 100)
  };
}
