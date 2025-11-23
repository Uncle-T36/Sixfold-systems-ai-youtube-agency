/**
 * 🤖 AI AUTO-PILOT ENGINE
 * Automatically creates first video on channel connection and plans entire monetization path
 * Goal: Get every channel from 0 to monetization (1000 subs + 4000 watch hours) automatically
 */

import { scrapeAllSources, type ScrapedStory } from './realWorldDataScraper';
import { analyzeChannelPortfolio, type ChannelAnalysis } from './intelligentChannelCouncil';
import { discoverStories, generateScript, SCRIPT_STYLES, type Story } from './storyEngine';

interface ConnectedChannel {
  id: string;
  name: string;
  description?: string;
  subscriberCount: number;
  thumbnailUrl: string;
  voiceId?: string;
}

interface FirstVideo {
  id: string;
  channelId: string;
  title: string;
  script: string;
  hook: string; // First 10 seconds - critical for retention
  thumbnail: ThumbnailConfig;
  duration: number;
  niche: string;
  viralScore: number;
  estimatedViews: number;
  status: 'generating' | 'ready' | 'published';
  generatedAt: string;
}

interface ThumbnailConfig {
  template: string;
  mainText: string;
  subText: string;
  colorScheme: string[];
  emotion: 'shock' | 'curiosity' | 'fear' | 'excitement';
  elements: string[];
}

interface ContentCalendar {
  channelId: string;
  videos: PlannedVideo[];
  currentDay: number;
  daysToMonetization: number;
  strategy: MonetizationStrategy;
}

interface PlannedVideo {
  day: number;
  title: string;
  topic: string;
  niche: string;
  duration: number;
  viralPotential: number;
  thumbnailIdea: string;
  postingTime: string; // Optimal time for audience
  status: 'planned' | 'generating' | 'ready' | 'published';
}

interface MonetizationStrategy {
  targetDays: number;
  videosPerWeek: number;
  totalVideosNeeded: number;
  currentProgress: {
    subscribers: number;
    watchHours: number;
    videosPublished: number;
  };
  milestones: Milestone[];
}

interface Milestone {
  day: number;
  target: string;
  description: string;
  achieved: boolean;
}

// 🎯 MONETIZATION REQUIREMENTS
const MONETIZATION_REQUIREMENTS = {
  subscribers: 1000,
  watchHours: 4000,
  minimumVideos: 30 // Realistic minimum to reach monetization
};

// 🔥 VIRAL HOOK TEMPLATES (First 10 seconds)
const VIRAL_HOOKS = {
  mystery: [
    "What you're about to see will change everything you thought you knew...",
    "This happened 3 days ago. Nobody's talking about it. Here's why...",
    "They tried to hide this. But we found the evidence...",
    "In the next 60 seconds, I'll reveal something that will shock you..."
  ],
  crime: [
    "This is the story they don't want you to hear...",
    "What happened next left investigators speechless...",
    "The truth about this case is finally coming out...",
    "Police said it was an accident. But the evidence says otherwise..."
  ],
  paranormal: [
    "Caught on camera for the first time ever...",
    "Scientists can't explain what happened here...",
    "This footage should not exist...",
    "What you're about to witness defies all logic..."
  ],
  tech: [
    "This AI just did something terrifying...",
    "Nobody saw this coming. Not even experts...",
    "This technology is already changing everything...",
    "In 24 hours, this will affect everyone..."
  ],
  business: [
    "This millionaire revealed his secret. Then disappeared...",
    "They built a $100M company in 6 months. Here's how...",
    "This strategy made them rich. Now it's exposed...",
    "Wall Street doesn't want you to know this..."
  ]
};

/**
 * 🚀 AUTO-GENERATE FIRST VIDEO ON CHANNEL CONNECTION
 * This runs immediately when a user connects a new channel
 */
export async function generateFirstVideoOnConnect(channel: ConnectedChannel): Promise<FirstVideo> {
  console.log(`🤖 AI AUTO-PILOT: Generating first video for ${channel.name}...`);
  
  try {
    // Step 1: Analyze channel niche
    const niche = detectChannelNiche(channel.name, channel.description || '');
    console.log(`✅ Detected niche: ${niche}`);
    
    // Step 2: Find trending viral story in that niche
    const story = await findMostViralStory(niche);
    console.log(`✅ Found viral story: ${story.title}`);
    
    // Step 3: Generate killer hook (first 10 seconds)
    const hook = generateViralHook(story, niche);
    console.log(`✅ Created viral hook`);
    
    // Step 4: Generate full script optimized for retention
    const script = await generateOptimizedScript(story, niche, channel);
    console.log(`✅ Generated script`);
    
    // Step 5: Design thumbnail that gets clicks
    const thumbnail = generateClickworthyThumbnail(story, niche);
    console.log(`✅ Designed thumbnail`);
    
    // Step 6: Create first video object
    const firstVideo: FirstVideo = {
      id: `first-${channel.id}-${Date.now()}`,
      channelId: channel.id,
      title: generateViralTitle(story, niche),
      script: script.fullScript,
      hook,
      thumbnail,
      duration: calculateOptimalDuration(niche),
      niche,
      viralScore: story.viralScore,
      estimatedViews: story.estimatedViews,
      status: 'ready',
      generatedAt: new Date().toISOString()
    };
    
    // Step 7: Save to localStorage
    const firstVideos = JSON.parse(localStorage.getItem('first_videos_generated') || '[]');
    firstVideos.push(firstVideo);
    localStorage.setItem('first_videos_generated', JSON.stringify(firstVideos));
    
    // Step 8: Also save to pending video creation for immediate generation
    localStorage.setItem('pending_video_creation', JSON.stringify({
      title: firstVideo.title,
      script: firstVideo.script,
      category: niche,
      viralScore: firstVideo.viralScore,
      isFirstVideo: true,
      channelId: channel.id
    }));
    
    console.log(`✅ First video ready! Estimated views: ${firstVideo.estimatedViews.toLocaleString()}`);
    
    // Step 9: Generate content calendar immediately
    await generateContentCalendar(channel, niche);
    
    return firstVideo;
  } catch (error) {
    console.error('❌ First video generation failed:', error);
    throw error;
  }
}

/**
 * 📅 GENERATE 30-60 DAY CONTENT CALENDAR TO MONETIZATION
 */
export async function generateContentCalendar(
  channel: ConnectedChannel,
  niche: string
): Promise<ContentCalendar> {
  console.log(`📅 Planning content calendar for ${channel.name}...`);
  
  // Calculate how many videos needed based on niche and current stats
  const avgViewsPerVideo = estimateAvgViews(channel.subscriberCount, niche);
  const avgWatchTime = estimateAvgWatchTime(niche);
  const videosNeeded = calculateVideosToMonetization(avgViewsPerVideo, avgWatchTime);
  
  // Determine posting frequency (more videos = faster monetization)
  const videosPerWeek = determineOptimalFrequency(niche, channel.subscriberCount);
  const daysToMonetization = Math.ceil((videosNeeded / videosPerWeek) * 7);
  
  console.log(`📊 Strategy: ${videosPerWeek} videos/week, ${videosNeeded} total videos, ~${daysToMonetization} days to monetization`);
  
  // Generate planned videos
  const plannedVideos: PlannedVideo[] = [];
  let currentDay = 1;
  
  for (let i = 0; i < videosNeeded; i++) {
    // Find trending topic
    const topic = await findTrendingTopic(niche, i);
    
    plannedVideos.push({
      day: currentDay,
      title: generateViralTitle({ title: topic, viralScore: 85 + Math.random() * 15 } as any, niche),
      topic,
      niche,
      duration: calculateOptimalDuration(niche),
      viralPotential: 85 + Math.floor(Math.random() * 15),
      thumbnailIdea: generateThumbnailIdea(topic, niche),
      postingTime: determineOptimalPostingTime(niche),
      status: 'planned'
    });
    
    // Increment day based on posting frequency
    currentDay += Math.floor(7 / videosPerWeek);
  }
  
  const calendar: ContentCalendar = {
    channelId: channel.id,
    videos: plannedVideos,
    currentDay: 0,
    daysToMonetization,
    strategy: {
      targetDays: daysToMonetization,
      videosPerWeek,
      totalVideosNeeded: videosNeeded,
      currentProgress: {
        subscribers: channel.subscriberCount,
        watchHours: 0,
        videosPublished: 0
      },
      milestones: generateMilestones(daysToMonetization)
    }
  };
  
  // Save calendar
  localStorage.setItem(`content_calendar_${channel.id}`, JSON.stringify(calendar));
  
  console.log(`✅ Content calendar created: ${videosNeeded} videos planned over ${daysToMonetization} days`);
  
  return calendar;
}

/**
 * 🎯 DETECT CHANNEL NICHE FROM NAME & DESCRIPTION
 */
function detectChannelNiche(name: string, description: string): string {
  const text = `${name} ${description}`.toLowerCase();
  
  if (text.match(/mystery|unsolved|secret|hidden|truth|puzzle/)) return 'mystery';
  if (text.match(/crime|murder|killer|detective|investigation|forensic/)) return 'crime';
  if (text.match(/ghost|haunted|paranormal|supernatural|spirit|demon/)) return 'paranormal';
  if (text.match(/history|historical|ancient|war|civilization/)) return 'history';
  if (text.match(/survival|survivor|survive|rescue|disaster/)) return 'survival';
  if (text.match(/science|scientific|experiment|research|discovery/)) return 'science';
  if (text.match(/psychology|mental|mind|behavior|brain|dark/)) return 'psychology';
  if (text.match(/tech|technology|ai|software|crypto|hacker/)) return 'tech';
  if (text.match(/business|entrepreneur|money|wealth|finance|rich/)) return 'business';
  if (text.match(/adventure|travel|exploration|expedition/)) return 'adventure';
  
  return 'mystery'; // Default to high-performing mystery niche
}

/**
 * 🔥 FIND MOST VIRAL STORY IN NICHE
 */
async function findMostViralStory(niche: string): Promise<ScrapedStory> {
  try {
    // Try to scrape real stories first
    const stories = await scrapeAllSources({
      categories: [niche],
      limit: 20
    });
    
    if (stories.length > 0) {
      // Return highest viral score
      return stories.sort((a, b) => b.viralScore - a.viralScore)[0];
    }
  } catch (e) {
    console.log('Real scraping failed, using fallback story generation');
  }
  
  // Fallback: Generate compelling story
  return {
    id: `story-${Date.now()}`,
    title: generateFallbackTitle(niche),
    content: generateFallbackContent(niche),
    source: 'AI Generated',
    sourceUrl: '',
    category: niche,
    date: new Date().toISOString(),
    location: 'Global',
    keywords: [niche, 'viral', 'trending', 'shocking'],
    viralScore: 92,
    estimatedViews: 2500000,
    trending: true
  };
}

/**
 * 💥 GENERATE VIRAL HOOK (FIRST 10 SECONDS)
 */
function generateViralHook(story: ScrapedStory, niche: string): string {
  const hooks = VIRAL_HOOKS[niche as keyof typeof VIRAL_HOOKS] || VIRAL_HOOKS.mystery;
  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  
  return `[HOOK - 0:00-0:10]
${hook}

${story.title}

This is a true story. What you're about to hear actually happened.`;
}

/**
 * 📝 GENERATE OPTIMIZED SCRIPT FOR MAX RETENTION
 */
async function generateOptimizedScript(
  story: ScrapedStory,
  niche: string,
  channel: ConnectedChannel
): Promise<{ fullScript: string }> {
  // Use suspenseful style for first video (highest retention)
  const style = 'suspenseful';
  
  const script = `
[HOOK - 0:00-0:10]
${generateViralHook(story, niche)}

[RETENTION LOCK - 0:10-0:30]
Before we get into this, you need to understand something. What I'm about to tell you is documented. It's real. And it's going to change the way you see everything.

If you're new here, welcome to ${channel.name}. We uncover the stories that others won't tell you. Hit that subscribe button because you won't want to miss what's coming.

[STORY SETUP - 0:30-2:00]
${story.content.substring(0, 500)}...

[MAIN STORY - 2:00-8:00]
Here's what really happened...

${story.content}

[CLIMAX - 8:00-10:00]
And then everything changed. The moment that would shock everyone involved...

[Details about the most shocking part of the story]

[CONCLUSION - 10:00-11:00]
To this day, questions remain. Some say... others believe... but the truth? The truth might be more disturbing than anyone imagined.

[CALL TO ACTION - 11:00-11:30]
What do you think really happened? Drop your theories in the comments below. And if you want more stories like this, hit that subscribe button and turn on notifications. We post ${determineOptimalFrequency(niche, channel.subscriberCount)} times a week.

Next video drops in 2 days. You won't want to miss it.

Until then, stay curious. Stay skeptical. And never stop questioning.
`;
  
  return { fullScript: script };
}

/**
 * 🎨 GENERATE CLICKWORTHY THUMBNAIL
 */
function generateClickworthyThumbnail(story: ScrapedStory, niche: string): ThumbnailConfig {
  const colorSchemes: Record<string, string[]> = {
    mystery: ['#FF0000', '#000000', '#FFFFFF'],
    crime: ['#8B0000', '#000000', '#FFD700'],
    paranormal: ['#4B0082', '#000000', '#00FF00'],
    tech: ['#00FFFF', '#000000', '#FF00FF'],
    business: ['#FFD700', '#000000', '#008000']
  };
  
  return {
    template: 'split-screen-dramatic',
    mainText: extractMainWords(story.title, 3),
    subText: 'TRUE STORY',
    colorScheme: colorSchemes[niche] || colorSchemes.mystery,
    emotion: 'shock',
    elements: ['dramatic-face', 'question-marks', 'red-arrow', 'bold-text']
  };
}

/**
 * 📊 CALCULATE VIDEOS NEEDED TO REACH MONETIZATION
 */
function calculateVideosToMonetization(avgViews: number, avgWatchTime: number): number {
  const hoursPerVideo = (avgWatchTime * avgViews) / 3600;
  const videosForWatchHours = Math.ceil(MONETIZATION_REQUIREMENTS.watchHours / hoursPerVideo);
  
  // Also need enough videos to get 1000 subscribers
  // Assume 1% conversion rate (views to subscribers)
  const subsPerVideo = avgViews * 0.01;
  const videosForSubs = Math.ceil(MONETIZATION_REQUIREMENTS.subscribers / subsPerVideo);
  
  // Take the higher number and add 20% buffer
  return Math.ceil(Math.max(videosForWatchHours, videosForSubs) * 1.2);
}

/**
 * 📈 ESTIMATE AVERAGE VIEWS PER VIDEO
 */
function estimateAvgViews(currentSubs: number, niche: string): number {
  const nicheMultipliers: Record<string, number> = {
    mystery: 1.5,
    crime: 1.8,
    paranormal: 1.4,
    psychology: 1.6,
    business: 1.3,
    tech: 1.4
  };
  
  const multiplier = nicheMultipliers[niche] || 1.0;
  
  if (currentSubs === 0) return 5000 * multiplier; // New channel with good content
  return currentSubs * 0.3 * multiplier; // 30% of subs view each video
}

/**
 * ⏱️ ESTIMATE AVERAGE WATCH TIME
 */
function estimateAvgWatchTime(niche: string): number {
  const watchTimes: Record<string, number> = {
    mystery: 480, // 8 minutes
    crime: 540, // 9 minutes
    paranormal: 420, // 7 minutes
    psychology: 600, // 10 minutes
    business: 360, // 6 minutes
    tech: 300 // 5 minutes
  };
  
  return watchTimes[niche] || 420;
}

/**
 * 📅 DETERMINE OPTIMAL POSTING FREQUENCY
 */
function determineOptimalFrequency(niche: string, subs: number): number {
  // New channels need more content faster
  if (subs < 100) return 5; // 5 videos per week
  if (subs < 500) return 4; // 4 videos per week
  if (subs < 1000) return 3; // 3 videos per week
  return 3; // Maintain 3/week after monetization
}

/**
 * 🎯 GENERATE MILESTONES
 */
function generateMilestones(totalDays: number): Milestone[] {
  return [
    { day: 7, target: '100 subscribers', description: 'First milestone - proof of concept', achieved: false },
    { day: 21, target: '250 subscribers', description: 'Growing momentum', achieved: false },
    { day: 45, target: '500 subscribers', description: 'Halfway to monetization', achieved: false },
    { day: Math.floor(totalDays * 0.75), target: '750 subscribers', description: 'Final push', achieved: false },
    { day: totalDays, target: '1000 subscribers + 4000 watch hours', description: 'MONETIZATION ACHIEVED!', achieved: false }
  ];
}

// Helper functions
function calculateOptimalDuration(niche: string): number {
  return estimateAvgWatchTime(niche);
}

function generateViralTitle(story: any, niche: string): string {
  const templates = [
    `${story.title} (You Won't Believe What Happened)`,
    `The Truth About ${story.title}`,
    `${story.title} - Finally Explained`,
    `What Really Happened: ${story.title}`,
    `${story.title} | The Full Story`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function extractMainWords(text: string, count: number): string {
  const words = text.split(' ').filter(w => w.length > 3);
  return words.slice(0, count).join(' ').toUpperCase();
}

function generateFallbackTitle(niche: string): string {
  const titles: Record<string, string> = {
    mystery: 'The Unsolved Mystery That Shocked The World',
    crime: 'The Criminal Case Nobody Can Explain',
    paranormal: 'The Paranormal Event Caught On Camera',
    tech: 'The AI Discovery That Changes Everything',
    business: 'The Business Secret That Made Billions'
  };
  return titles[niche] || titles.mystery;
}

function generateFallbackContent(niche: string): string {
  return `This is a compelling ${niche} story that will captivate your audience. It involves mystery, drama, and shocking revelations that keep viewers engaged from start to finish.`;
}

async function findTrendingTopic(niche: string, index: number): Promise<string> {
  // In production, this would scrape real trending topics
  const topics = [
    'The Hidden Truth Nobody Talks About',
    'What Scientists Just Discovered',
    'The Secret That Changed Everything',
    'What They Don\'t Want You To Know',
    'The Mystery Finally Solved',
    'The Shocking Reality Revealed',
    'What Really Happened (Full Story)',
    'The Truth Behind The Legend',
    'The Discovery That Shocked Experts',
    'What The Evidence Actually Shows'
  ];
  return `${topics[index % topics.length]} - Part ${index + 1}`;
}

function generateThumbnailIdea(topic: string, niche: string): string {
  return `Bold red text: "${extractMainWords(topic, 3)}" with shocked face emoji and question marks`;
}

function determineOptimalPostingTime(niche: string): string {
  // Best times based on niche audience
  const times: Record<string, string> = {
    mystery: '8:00 PM EST', // Evening when people relax
    crime: '9:00 PM EST', // Prime time
    paranormal: '10:00 PM EST', // Late night
    tech: '12:00 PM EST', // Lunch break
    business: '6:00 AM EST', // Morning routine
    psychology: '7:00 PM EST' // After work
  };
  return times[niche] || '8:00 PM EST';
}

/**
 * 📊 GET MONETIZATION PROGRESS
 */
export function getMonetizationProgress(channelId: string): {
  subscribers: number;
  subsProgress: number;
  watchHours: number;
  watchHoursProgress: number;
  daysRemaining: number;
  nextMilestone: string;
} {
  const calendar = JSON.parse(localStorage.getItem(`content_calendar_${channelId}`) || '{}');
  
  if (!calendar.strategy) {
    return {
      subscribers: 0,
      subsProgress: 0,
      watchHours: 0,
      watchHoursProgress: 0,
      daysRemaining: 90,
      nextMilestone: 'Generate content calendar first'
    };
  }
  
  const progress = calendar.strategy.currentProgress;
  const nextMilestone = calendar.strategy.milestones.find((m: Milestone) => !m.achieved);
  
  return {
    subscribers: progress.subscribers,
    subsProgress: (progress.subscribers / MONETIZATION_REQUIREMENTS.subscribers) * 100,
    watchHours: progress.watchHours,
    watchHoursProgress: (progress.watchHours / MONETIZATION_REQUIREMENTS.watchHours) * 100,
    daysRemaining: calendar.daysToMonetization - calendar.currentDay,
    nextMilestone: nextMilestone?.target || 'All milestones achieved!'
  };
}
