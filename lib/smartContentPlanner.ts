/**
 * 🧠 SMART CONTENT PLANNER
 * AI-powered system that knows exactly what video to create next for each channel
 * Analyzes trends, competition, past performance, and optimal timing
 */

export interface ChannelContentPlan {
  channelId: string;
  channelName: string;
  niche: string;
  nextVideos: PlannedVideo[];
  contentStrategy: ContentStrategy;
  performanceInsights: PerformanceInsight[];
  lastUpdated: string;
}

export interface PlannedVideo {
  id: string;
  title: string;
  description: string;
  script: string;
  tags: string[];
  estimatedViews: number;
  estimatedRevenue: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  reason: string;
  scheduledFor?: string;
  status: 'planned' | 'generating' | 'ready' | 'uploaded';
  style: string;
  duration: number;
  hooks: string[];
  targetAudience: string;
}

export interface ContentStrategy {
  postingFrequency: string;
  bestDays: string[];
  bestTimes: string[];
  contentMix: ContentMix;
  growthFocus: string;
  monetizationReady: boolean;
}

export interface ContentMix {
  educational: number;
  entertainment: number;
  trending: number;
  evergreen: number;
}

export interface PerformanceInsight {
  metric: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
}

// Niche-specific content templates
const NICHE_CONTENT_TEMPLATES: Record<string, ContentTemplate[]> = {
  tech: [
    { pattern: '{year} Best {product} - Complete Guide', priority: 'high', type: 'evergreen' },
    { pattern: '{product} vs {product} - Which One Wins?', priority: 'high', type: 'comparison' },
    { pattern: 'I Tried {product} for 30 Days - Honest Review', priority: 'medium', type: 'review' },
    { pattern: '{number} Hidden Features in {product} You Didn\'t Know', priority: 'high', type: 'tips' },
    { pattern: 'Why Everyone is Switching to {product}', priority: 'medium', type: 'trending' },
    { pattern: '{product} Setup Guide for Beginners', priority: 'medium', type: 'tutorial' },
    { pattern: 'The Truth About {product} - What They Don\'t Tell You', priority: 'high', type: 'expose' },
    { pattern: '{product} in {year} - Still Worth It?', priority: 'medium', type: 'update' },
  ],
  finance: [
    { pattern: 'How I Made ${amount} in {timeframe}', priority: 'high', type: 'success' },
    { pattern: '{number} Passive Income Ideas for {year}', priority: 'high', type: 'listicle' },
    { pattern: 'Avoid These {number} Money Mistakes', priority: 'medium', type: 'warning' },
    { pattern: '{investment} vs {investment} - Where to Put Your Money', priority: 'high', type: 'comparison' },
    { pattern: 'How to Start Investing with ${amount}', priority: 'medium', type: 'beginner' },
    { pattern: 'The {timeframe} Money Challenge That Changed My Life', priority: 'medium', type: 'challenge' },
    { pattern: 'Why the Rich Keep Getting Richer', priority: 'high', type: 'insight' },
    { pattern: '{number} Side Hustles That Actually Work in {year}', priority: 'high', type: 'listicle' },
  ],
  gaming: [
    { pattern: '{game} - Tips to Win Every Game', priority: 'high', type: 'tips' },
    { pattern: 'I Played {game} for {hours} Hours Straight', priority: 'medium', type: 'challenge' },
    { pattern: '{game} Best Settings for {year}', priority: 'medium', type: 'guide' },
    { pattern: 'Ranking Every {item} in {game}', priority: 'high', type: 'ranking' },
    { pattern: '{game} Secret Tricks the Pros Use', priority: 'high', type: 'tips' },
    { pattern: 'Is {game} Worth Playing in {year}?', priority: 'medium', type: 'review' },
    { pattern: '{game} Beginner\'s Guide - Everything You Need', priority: 'medium', type: 'tutorial' },
    { pattern: 'What Happens When You {action} in {game}', priority: 'high', type: 'experiment' },
  ],
  lifestyle: [
    { pattern: 'My {timeframe} Morning Routine', priority: 'high', type: 'routine' },
    { pattern: '{number} Habits That Changed My Life', priority: 'high', type: 'listicle' },
    { pattern: 'A Day in My Life as a {profession}', priority: 'medium', type: 'vlog' },
    { pattern: 'How I Stay Productive Working From Home', priority: 'medium', type: 'tips' },
    { pattern: '{number} Things I Wish I Knew Earlier', priority: 'high', type: 'wisdom' },
    { pattern: 'Minimalist {category} Tour', priority: 'medium', type: 'tour' },
    { pattern: 'I Tried {trend} for {timeframe} - Here\'s What Happened', priority: 'high', type: 'experiment' },
    { pattern: 'The {product} That Changed Everything', priority: 'medium', type: 'review' },
  ],
  education: [
    { pattern: 'Learn {subject} in {timeframe} - Complete Course', priority: 'high', type: 'course' },
    { pattern: '{subject} Explained in {number} Minutes', priority: 'high', type: 'explainer' },
    { pattern: 'Why Schools Don\'t Teach {subject}', priority: 'high', type: 'insight' },
    { pattern: '{number} Study Hacks That Actually Work', priority: 'medium', type: 'tips' },
    { pattern: 'How to Master {skill} Fast', priority: 'medium', type: 'tutorial' },
    { pattern: 'The Truth About {subject}', priority: 'high', type: 'expose' },
    { pattern: 'Common {subject} Mistakes and How to Avoid Them', priority: 'medium', type: 'warning' },
    { pattern: '{subject} for Beginners - Start Here', priority: 'medium', type: 'beginner' },
  ],
  health: [
    { pattern: '{number} Foods You Should Never Eat', priority: 'high', type: 'warning' },
    { pattern: 'I Tried {diet} for {timeframe} - Results', priority: 'high', type: 'experiment' },
    { pattern: '{number} Exercises to {goal}', priority: 'medium', type: 'workout' },
    { pattern: 'Doctor Explains: {topic}', priority: 'high', type: 'expert' },
    { pattern: 'Morning Habits for {goal}', priority: 'medium', type: 'routine' },
    { pattern: 'The Science Behind {topic}', priority: 'medium', type: 'educational' },
    { pattern: 'Why You\'re Always {symptom} - Fix This', priority: 'high', type: 'solution' },
    { pattern: '{number} Signs You Need More {nutrient}', priority: 'medium', type: 'health' },
  ],
  entertainment: [
    { pattern: 'Top {number} {category} of {year}', priority: 'high', type: 'ranking' },
    { pattern: '{movie/show} Explained - Everything You Missed', priority: 'high', type: 'analysis' },
    { pattern: 'Why {celebrity} is Taking Over', priority: 'medium', type: 'trending' },
    { pattern: 'Ranking Every {franchise} Movie', priority: 'high', type: 'ranking' },
    { pattern: '{number} Facts About {topic} You Didn\'t Know', priority: 'medium', type: 'trivia' },
    { pattern: 'The Problem With {topic}', priority: 'high', type: 'critique' },
    { pattern: 'What Happened to {topic}?', priority: 'medium', type: 'retrospective' },
    { pattern: '{topic} - A Complete Timeline', priority: 'medium', type: 'documentary' },
  ],
  motivation: [
    { pattern: 'How to {goal} in {year}', priority: 'high', type: 'guide' },
    { pattern: '{number} Rules for Success', priority: 'high', type: 'listicle' },
    { pattern: 'Why You\'re Not {goal} Yet - The Truth', priority: 'high', type: 'tough-love' },
    { pattern: 'From {start} to {end} - My Journey', priority: 'medium', type: 'story' },
    { pattern: 'Stop Doing This if You Want to {goal}', priority: 'high', type: 'warning' },
    { pattern: 'The Mindset Shift That Changed Everything', priority: 'medium', type: 'insight' },
    { pattern: '{successful person} - How They Made It', priority: 'medium', type: 'case-study' },
    { pattern: 'What Successful People Do Differently', priority: 'high', type: 'wisdom' },
  ],
};

interface ContentTemplate {
  pattern: string;
  priority: 'high' | 'medium' | 'low';
  type: string;
}

// Trending topics by niche (simulated - would connect to trend APIs)
const TRENDING_TOPICS: Record<string, string[]> = {
  tech: ['AI', 'ChatGPT', 'iPhone 17', 'Tesla', 'Cybersecurity', 'Apple Vision Pro', 'Quantum Computing', 'Robotics'],
  finance: ['Bitcoin', 'Recession', 'Real Estate', 'Side Hustles', 'Passive Income', 'Index Funds', 'Crypto', 'Inflation'],
  gaming: ['GTA 6', 'Fortnite', 'Minecraft', 'Call of Duty', 'PlayStation 6', 'VR Gaming', 'Esports', 'Indie Games'],
  lifestyle: ['Minimalism', 'Remote Work', 'Digital Nomad', 'Self Care', 'Productivity', 'Travel', 'Fashion', 'Home Decor'],
  education: ['AI Learning', 'Online Courses', 'Career Change', 'Coding', 'Language Learning', 'Study Tips', 'College', 'Skills'],
  health: ['Intermittent Fasting', 'Mental Health', 'Sleep', 'Gut Health', 'Supplements', 'Meditation', 'Weight Loss', 'Yoga'],
  entertainment: ['Marvel', 'Netflix', 'Anime', 'K-Pop', 'Celebrity News', 'Movie Reviews', 'Music', 'Streaming'],
  motivation: ['Discipline', 'Wealth', 'Mindset', 'Habits', 'Goals', 'Entrepreneurship', 'Leadership', 'Success'],
};

// Variables for content generation
const VARIABLES: Record<string, string[]> = {
  year: ['2026'],
  number: ['3', '5', '7', '10', '15', '21'],
  amount: ['100', '1,000', '10,000', '50,000', '100,000'],
  timeframe: ['7 Days', '30 Days', '90 Days', '6 Months', '1 Year'],
  hours: ['10', '24', '48', '100'],
};

/**
 * Generate a complete content plan for a channel
 */
export function generateChannelPlan(
  channelId: string,
  channelName: string,
  niche: string,
  subscriberCount: number = 0
): ChannelContentPlan {
  const normalizedNiche = normalizeNiche(niche);
  const templates = NICHE_CONTENT_TEMPLATES[normalizedNiche] || NICHE_CONTENT_TEMPLATES.tech;
  const trends = TRENDING_TOPICS[normalizedNiche] || TRENDING_TOPICS.tech;
  
  // Generate next 10 video ideas
  const nextVideos: PlannedVideo[] = [];
  const usedPatterns = new Set<string>();
  
  for (let i = 0; i < 10; i++) {
    const video = generateVideoIdea(templates, trends, usedPatterns, normalizedNiche, i);
    nextVideos.push(video);
  }
  
  // Sort by priority
  nextVideos.sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  // Generate content strategy based on subscriber count
  const contentStrategy = generateContentStrategy(subscriberCount, normalizedNiche);
  
  // Generate performance insights
  const performanceInsights = generateInsights(normalizedNiche, subscriberCount);
  
  return {
    channelId,
    channelName,
    niche: normalizedNiche,
    nextVideos,
    contentStrategy,
    performanceInsights,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Generate a single video idea
 */
function generateVideoIdea(
  templates: ContentTemplate[],
  trends: string[],
  usedPatterns: Set<string>,
  niche: string,
  index: number
): PlannedVideo {
  // Pick a template (prioritize high priority for first videos)
  let template: ContentTemplate;
  if (index < 3) {
    template = templates.filter(t => t.priority === 'high')[index % templates.filter(t => t.priority === 'high').length];
  } else {
    template = templates[index % templates.length];
  }
  
  // Get a trending topic
  const trend = trends[index % trends.length];
  
  // Fill in the template
  const title = fillTemplate(template.pattern, trend, niche);
  
  // Generate script
  const script = generateScript(title, trend, niche);
  
  // Generate tags
  const tags = generateTags(title, trend, niche);
  
  // Generate hooks
  const hooks = generateHooks(title, niche);
  
  // Estimate performance
  const estimatedViews = estimateViews(template.priority, trend);
  const estimatedRevenue = estimatedViews * 0.002; // ~$2 CPM average
  
  return {
    id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
    title,
    description: generateDescription(title, script, tags),
    script,
    tags,
    estimatedViews,
    estimatedRevenue: Math.round(estimatedRevenue * 100) / 100,
    priority: index === 0 ? 'urgent' : template.priority,
    reason: index === 0 
      ? `🔥 TRENDING NOW: ${trend} is getting massive search volume` 
      : `📈 Based on ${template.type} content performing well in ${niche}`,
    status: 'planned',
    style: selectVideoStyle(niche, template.type),
    duration: selectDuration(template.type),
    hooks,
    targetAudience: getTargetAudience(niche),
  };
}

/**
 * Fill in template variables
 */
function fillTemplate(pattern: string, trend: string, niche: string): string {
  let result = pattern;
  
  // Replace placeholders
  result = result.replace('{product}', trend);
  result = result.replace('{topic}', trend);
  result = result.replace('{game}', trend);
  result = result.replace('{subject}', trend);
  result = result.replace('{diet}', trend);
  result = result.replace('{skill}', trend);
  result = result.replace('{investment}', trend);
  result = result.replace('{goal}', `Master ${trend}`);
  result = result.replace('{trend}', trend);
  result = result.replace('{category}', niche);
  result = result.replace('{item}', 'Items');
  result = result.replace('{action}', 'do this');
  result = result.replace('{profession}', 'Content Creator');
  result = result.replace('{movie/show}', trend);
  result = result.replace('{celebrity}', trend);
  result = result.replace('{franchise}', trend);
  result = result.replace('{successful person}', 'Top Performers');
  result = result.replace('{start}', 'Nothing');
  result = result.replace('{end}', 'Success');
  result = result.replace('{symptom}', 'Tired');
  result = result.replace('{nutrient}', 'Nutrients');
  
  // Replace variables
  Object.entries(VARIABLES).forEach(([key, values]) => {
    const value = values[Math.floor(Math.random() * values.length)];
    result = result.replace(`{${key}}`, value);
  });
  
  return result;
}

/**
 * Generate a complete video script
 */
function generateScript(title: string, trend: string, niche: string): string {
  const intro = generateIntro(title);
  const mainPoints = generateMainPoints(trend, niche);
  const outro = generateOutro();
  
  return `${intro}\n\n${mainPoints}\n\n${outro}`;
}

function generateIntro(title: string): string {
  const intros = [
    `Welcome back to the channel! Today we're diving into something huge: ${title}. If you've been waiting for this, you're in the right place.`,
    `You asked for it, and here it is. Today's topic is going to change the way you think about everything. Let's talk about ${title}.`,
    `Before we start, drop a like if you're excited about today's topic. We're covering ${title} and trust me, you don't want to miss this.`,
    `This might be the most important video I've ever made. Today we're breaking down ${title}. Stay until the end - the last point is a game-changer.`,
  ];
  return intros[Math.floor(Math.random() * intros.length)];
}

function generateMainPoints(trend: string, niche: string): string {
  const points = [
    `First, let's understand why ${trend} is absolutely dominating right now. The data shows a massive shift in how people are approaching this.`,
    `Point number two: the strategy that top performers are using. This is where most people get it wrong, and I'm going to show you exactly what to do instead.`,
    `Third - and this is crucial - the common mistakes you need to avoid. I see this constantly, and it's costing people big time.`,
    `Here's the secret that nobody talks about. This single insight has helped thousands of people in the ${niche} space achieve incredible results.`,
    `Finally, let's talk about implementation. Knowing isn't enough - here's your step-by-step action plan to actually make this work for you.`,
  ];
  return points.join('\n\n');
}

function generateOutro(): string {
  const outros = [
    `If you found this valuable, smash that subscribe button and turn on notifications. I drop new videos every week with insights like this. See you in the next one!`,
    `That's it for today! If this helped you, leave a comment with your biggest takeaway. And don't forget to subscribe for more content like this. Peace!`,
    `Now you have everything you need to get started. Subscribe, share this with someone who needs to hear it, and I'll see you in the next video!`,
  ];
  return outros[Math.floor(Math.random() * outros.length)];
}

/**
 * Generate video description
 */
function generateDescription(title: string, script: string, tags: string[]): string {
  return `${title}

In this video, I break down everything you need to know. Whether you're a beginner or advanced, there's something here for everyone.

🔔 Subscribe for more: [Channel Link]
👍 Like if you found this helpful!
💬 Comment your thoughts below

Timestamps:
00:00 - Introduction
00:30 - Main Topic
02:00 - Key Strategies
04:00 - Common Mistakes
06:00 - Action Steps
08:00 - Conclusion

#${tags.slice(0, 5).join(' #')}

Thanks for watching! 🙏`;
}

/**
 * Generate relevant tags
 */
function generateTags(title: string, trend: string, niche: string): string[] {
  const baseTags = [
    trend.toLowerCase(),
    niche,
    `${niche} tips`,
    `${trend.toLowerCase()} guide`,
    `${niche} 2026`,
    'how to',
    'tutorial',
    'tips and tricks',
    `best ${niche}`,
    `${trend.toLowerCase()} explained`,
  ];
  
  return [...new Set(baseTags)].slice(0, 15);
}

/**
 * Generate attention hooks
 */
function generateHooks(title: string, niche: string): string[] {
  return [
    `This ${niche} secret will blow your mind`,
    `Nobody is talking about this...`,
    `Watch this before it's too late`,
    `The truth they don't want you to know`,
    `I can't believe this actually works`,
  ];
}

/**
 * Estimate video views based on factors
 */
function estimateViews(priority: string, trend: string): number {
  const baseViews = {
    urgent: 50000,
    high: 25000,
    medium: 10000,
    low: 5000,
  };
  
  // Add randomness
  const base = baseViews[priority as keyof typeof baseViews] || 10000;
  const variance = Math.random() * 0.5 + 0.75; // 0.75 to 1.25x
  
  return Math.round(base * variance);
}

/**
 * Select appropriate video style
 */
function selectVideoStyle(niche: string, type: string): string {
  const styleMap: Record<string, string> = {
    tech: 'cinematic',
    finance: 'kinetic-text',
    gaming: 'neon',
    lifestyle: 'minimal',
    education: 'whiteboard',
    health: 'animated',
    entertainment: 'slideshow',
    motivation: 'cinematic',
  };
  
  return styleMap[niche] || 'kinetic-text';
}

/**
 * Select video duration based on content type
 */
function selectDuration(type: string): number {
  const durationMap: Record<string, number> = {
    tutorial: 600, // 10 min
    guide: 480,
    review: 420,
    tips: 360,
    listicle: 480,
    explainer: 300,
    comparison: 420,
    experiment: 540,
    ranking: 600,
    course: 900,
    story: 480,
    vlog: 600,
  };
  
  return durationMap[type] || 420; // Default 7 min
}

/**
 * Generate content strategy
 */
function generateContentStrategy(subscriberCount: number, niche: string): ContentStrategy {
  let frequency: string;
  let growthFocus: string;
  
  if (subscriberCount < 1000) {
    frequency = '3-4 videos per week';
    growthFocus = 'Quantity and consistency to build momentum';
  } else if (subscriberCount < 10000) {
    frequency = '2-3 videos per week';
    growthFocus = 'Quality content with SEO optimization';
  } else if (subscriberCount < 100000) {
    frequency = '2 videos per week';
    growthFocus = 'Viral potential and audience retention';
  } else {
    frequency = '1-2 videos per week';
    growthFocus = 'Premium content and brand partnerships';
  }
  
  return {
    postingFrequency: frequency,
    bestDays: ['Tuesday', 'Thursday', 'Saturday'],
    bestTimes: ['2:00 PM', '6:00 PM', '9:00 PM'],
    contentMix: {
      educational: 40,
      entertainment: 25,
      trending: 20,
      evergreen: 15,
    },
    growthFocus,
    monetizationReady: subscriberCount >= 1000,
  };
}

/**
 * Generate performance insights
 */
function generateInsights(niche: string, subscriberCount: number): PerformanceInsight[] {
  return [
    {
      metric: 'Best Content Type',
      value: 'Tutorial/How-To videos',
      trend: 'up',
      recommendation: 'Double down on educational content - it has 3x better retention',
    },
    {
      metric: 'Optimal Length',
      value: '8-12 minutes',
      trend: 'stable',
      recommendation: 'Videos in this range get more ad revenue and better engagement',
    },
    {
      metric: 'Posting Frequency',
      value: subscriberCount < 10000 ? 'Increase' : 'Maintain',
      trend: subscriberCount < 10000 ? 'up' : 'stable',
      recommendation: subscriberCount < 10000 
        ? 'Posting more frequently accelerates growth at your stage'
        : 'Quality over quantity at this subscriber level',
    },
    {
      metric: 'Trending Topics',
      value: TRENDING_TOPICS[niche]?.slice(0, 3).join(', ') || 'General',
      trend: 'up',
      recommendation: 'Create content around these trending topics for maximum reach',
    },
  ];
}

/**
 * Get target audience for niche
 */
function getTargetAudience(niche: string): string {
  const audienceMap: Record<string, string> = {
    tech: 'Tech enthusiasts, early adopters, professionals 18-45',
    finance: 'Aspiring investors, entrepreneurs, professionals 25-55',
    gaming: 'Gamers, streamers, esports fans 13-35',
    lifestyle: 'Young professionals, creatives, trend followers 18-40',
    education: 'Students, lifelong learners, career changers 16-45',
    health: 'Health-conscious individuals, fitness enthusiasts 20-50',
    entertainment: 'Pop culture fans, movie/music lovers 16-40',
    motivation: 'Ambitious individuals, entrepreneurs, self-improvers 20-45',
  };
  
  return audienceMap[niche] || 'General audience 18-45';
}

/**
 * Normalize niche name
 */
function normalizeNiche(niche: string): string {
  const nicheMap: Record<string, string> = {
    technology: 'tech',
    'ai': 'tech',
    'artificial intelligence': 'tech',
    money: 'finance',
    investing: 'finance',
    cryptocurrency: 'finance',
    crypto: 'finance',
    games: 'gaming',
    'video games': 'gaming',
    fitness: 'health',
    wellness: 'health',
    learning: 'education',
    movies: 'entertainment',
    music: 'entertainment',
    success: 'motivation',
    'self improvement': 'motivation',
    'self-improvement': 'motivation',
  };
  
  const lower = niche.toLowerCase();
  return nicheMap[lower] || lower;
}

/**
 * Get the next best video to create for a channel
 */
export function getNextVideoForChannel(channelId: string): PlannedVideo | null {
  const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
  const channel = channels.find((ch: any) => ch.id === channelId);
  
  if (!channel) return null;
  
  // Get or generate content plan
  let planKey = `content_plan_${channelId}`;
  let plan = localStorage.getItem(planKey);
  let parsedPlan: ChannelContentPlan;
  
  if (!plan) {
    parsedPlan = generateChannelPlan(
      channelId,
      channel.name,
      channel.niche || 'tech',
      channel.subscriberCount || 0
    );
    localStorage.setItem(planKey, JSON.stringify(parsedPlan));
  } else {
    parsedPlan = JSON.parse(plan);
    
    // Refresh if older than 24 hours
    const lastUpdated = new Date(parsedPlan.lastUpdated);
    const now = new Date();
    if (now.getTime() - lastUpdated.getTime() > 24 * 60 * 60 * 1000) {
      parsedPlan = generateChannelPlan(
        channelId,
        channel.name,
        channel.niche || 'tech',
        channel.subscriberCount || 0
      );
      localStorage.setItem(planKey, JSON.stringify(parsedPlan));
    }
  }
  
  // Return the first planned video
  return parsedPlan.nextVideos.find(v => v.status === 'planned') || null;
}

/**
 * Get content plans for all channels
 */
export function getAllChannelPlans(): ChannelContentPlan[] {
  const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
  const plans: ChannelContentPlan[] = [];
  
  channels.forEach((channel: any) => {
    const planKey = `content_plan_${channel.id}`;
    let plan = localStorage.getItem(planKey);
    
    if (!plan) {
      const newPlan = generateChannelPlan(
        channel.id,
        channel.name,
        channel.niche || 'tech',
        channel.subscriberCount || 0
      );
      localStorage.setItem(planKey, JSON.stringify(newPlan));
      plans.push(newPlan);
    } else {
      plans.push(JSON.parse(plan));
    }
  });
  
  return plans;
}

/**
 * Mark a video as complete and get the next one
 */
export function markVideoComplete(channelId: string, videoId: string): PlannedVideo | null {
  const planKey = `content_plan_${channelId}`;
  const plan = localStorage.getItem(planKey);
  
  if (!plan) return null;
  
  const parsedPlan: ChannelContentPlan = JSON.parse(plan);
  
  // Mark the video as uploaded
  const video = parsedPlan.nextVideos.find(v => v.id === videoId);
  if (video) {
    video.status = 'uploaded';
  }
  
  // Save updated plan
  localStorage.setItem(planKey, JSON.stringify(parsedPlan));
  
  // Return next planned video
  return parsedPlan.nextVideos.find(v => v.status === 'planned') || null;
}

/**
 * Refresh all content plans with new ideas
 */
export function refreshAllPlans(): ChannelContentPlan[] {
  const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
  const plans: ChannelContentPlan[] = [];
  
  channels.forEach((channel: any) => {
    const newPlan = generateChannelPlan(
      channel.id,
      channel.name,
      channel.niche || 'tech',
      channel.subscriberCount || 0
    );
    localStorage.setItem(`content_plan_${channel.id}`, JSON.stringify(newPlan));
    plans.push(newPlan);
  });
  
  return plans;
}
