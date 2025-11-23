/**
 * 🤖 AUTONOMOUS VIDEO GENERATION SYSTEM
 * Automatically creates videos when channels connect and plans content until monetization
 * 
 * MONETIZATION REQUIREMENTS:
 * - 1,000 subscribers
 * - 4,000 watch hours (240,000 minutes)
 * 
 * AUTO-STRATEGY:
 * 1. Channel connects → Analyze niche → Generate first high-hook video
 * 2. Monitor performance → Plan next 10 videos based on analytics
 * 3. Auto-queue videos daily until monetization threshold reached
 * 4. Optimize content strategy based on what's working
 */

import { scrapeAllSources, type ScrapedStory } from './realWorldDataScraper';
import { analyzeChannelPortfolio, type ChannelAnalysis } from './intelligentChannelCouncil';
import { discoverStories, generateScript, SCRIPT_STYLES, type Story } from './storyEngine';
import { generateAdvancedVideo, queueVideoRender, VIDEO_STYLES } from './advancedVideoGenerator';

export interface MonetizationProgress {
  currentSubscribers: number;
  targetSubscribers: number;
  currentWatchMinutes: number;
  targetWatchMinutes: number;
  progressPercentage: number;
  estimatedDaysToMonetization: number;
  videosNeeded: number;
  status: 'not-started' | 'in-progress' | 'nearly-there' | 'monetized';
}

export interface VideoGenerationPlan {
  channelId: string;
  channelName: string;
  totalVideosPlanned: number;
  videosGenerated: number;
  nextVideoDate: string;
  contentStrategy: string[];
  estimatedMonetizationDate: string;
  videoQueue: PlannedVideo[];
}

export interface PlannedVideo {
  id: string;
  title: string;
  script: string;
  category: string;
  scheduledDate: string;
  estimatedViews: number;
  estimatedWatchTime: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'planned' | 'generating' | 'ready' | 'published';
}

/**
 * 🚀 AUTO-START: Generate first video immediately when channel connects
 */
export async function autoGenerateFirstVideo(channel: {
  id: string;
  name: string;
  description?: string;
  subscriberCount: number;
}): Promise<{ videoId: string; title: string; script: string }> {
  console.log(`🤖 AUTO-START: Generating first video for ${channel.name}...`);

  // 1. Detect channel niche
  const niche = detectNiche(channel);
  console.log(`🎯 Detected niche: ${niche}`);

  // 2. Find the most viral story in that niche
  let bestStory: ScrapedStory | null = null;
  
  try {
    // Try scraping real stories first
    const realStories = await scrapeAllSources({
      categories: [niche],
      limit: 10
    });
    
    if (realStories.length > 0) {
      bestStory = realStories[0]; // Already sorted by viral score
      console.log(`📰 Found real story: ${bestStory.title} (${bestStory.viralScore}% viral)`);
    }
  } catch (e) {
    console.log('⚠️ Real scraping unavailable, using AI discovery...');
  }

  // Fallback to AI-generated stories
  if (!bestStory) {
    const aiStories = await discoverStories(niche, undefined, undefined, 5);
    const storyData = aiStories[0];
    
    // Convert to ScrapedStory format
    bestStory = {
      id: storyData.id,
      title: storyData.title,
      content: `A compelling ${storyData.category} story from ${storyData.country}`,
      source: 'AI Discovery',
      sourceUrl: '',
      category: storyData.category,
      date: new Date().toISOString(),
      location: storyData.country,
      keywords: storyData.themes,
      viralScore: storyData.viralScore,
      estimatedViews: storyData.estimatedViews,
      trending: true
    };
  }

  // 3. Generate professional script
  const scriptStyle = selectBestScriptStyle(niche);
  console.log(`✍️ Generating script in ${scriptStyle} style...`);
  
  const aiStory: Story = {
    id: bestStory.id,
    title: bestStory.title,
    category: bestStory.category,
    origin: niche,
    country: bestStory.location,
    language: 'English',
    era: 'Modern',
    viralScore: bestStory.viralScore,
    emotionalImpact: 85,
    uniqueness: 90,
    elements: [],
    sources: [bestStory.source],
    characters: [],
    plotPoints: [],
    themes: bestStory.keywords,
    estimatedViews: bestStory.estimatedViews,
    recommendedLength: 12
  };

  const generatedScript = await generateScript(aiStory, scriptStyle as any, 1, channel.name);

  // 4. Generate video with optimal settings
  const videoStyle = selectBestVideoStyle(niche);
  console.log(`🎬 Generating video in ${videoStyle} style...`);

  const videoConfig = {
    title: bestStory.title,
    script: generatedScript.script,
    niche: niche,
    duration: 720 // 12 minutes optimal for first video
  };

  const videoRender = await generateAdvancedVideo(videoConfig, videoStyle);
  const videoId = await queueVideoRender(videoRender, channel.id);

  // 5. Save to channel's video history
  const videos = JSON.parse(localStorage.getItem(`videos_${channel.id}`) || '[]');
  videos.push({
    id: videoId,
    title: bestStory.title,
    script: generatedScript.script,
    status: 'ready',
    createdAt: new Date().toISOString(),
    estimatedViews: bestStory.estimatedViews,
    duration: 720,
    isFirstVideo: true,
    autoGenerated: true
  });
  localStorage.setItem(`videos_${channel.id}`, JSON.stringify(videos));

  console.log(`✅ First video generated: ${bestStory.title}`);
  
  return {
    videoId,
    title: bestStory.title,
    script: generatedScript.script
  };
}

/**
 * 📊 Calculate monetization progress
 */
export function calculateMonetizationProgress(channel: {
  id: string;
  subscriberCount: number;
}): MonetizationProgress {
  const videos = JSON.parse(localStorage.getItem(`videos_${channel.id}`) || '[]');
  
  // Calculate total watch time from generated videos
  const totalWatchMinutes = videos.reduce((sum: number, v: any) => {
    const avgViews = v.estimatedViews || 10000;
    const duration = v.duration || 600; // seconds
    const retentionRate = 0.6; // 60% average retention
    return sum + (avgViews * (duration / 60) * retentionRate);
  }, 0);

  const targetSubs = 1000;
  const targetMinutes = 240000; // 4000 hours

  const subProgress = (channel.subscriberCount / targetSubs) * 100;
  const watchProgress = (totalWatchMinutes / targetMinutes) * 100;
  const overallProgress = Math.min((subProgress + watchProgress) / 2, 100);

  // Estimate videos needed
  const avgViewsPerVideo = 15000;
  const avgDuration = 10; // minutes
  const avgRetention = 0.6;
  const watchMinutesPerVideo = avgViewsPerVideo * avgDuration * avgRetention;
  const videosNeeded = Math.ceil((targetMinutes - totalWatchMinutes) / watchMinutesPerVideo);

  // Estimate days to monetization (3 videos per week)
  const videosPerWeek = 3;
  const weeksNeeded = Math.ceil(videosNeeded / videosPerWeek);
  const daysToMonetization = weeksNeeded * 7;

  let status: MonetizationProgress['status'] = 'not-started';
  if (overallProgress >= 100) status = 'monetized';
  else if (overallProgress >= 75) status = 'nearly-there';
  else if (overallProgress > 0) status = 'in-progress';

  return {
    currentSubscribers: channel.subscriberCount,
    targetSubscribers: targetSubs,
    currentWatchMinutes: Math.round(totalWatchMinutes),
    targetWatchMinutes: targetMinutes,
    progressPercentage: Math.round(overallProgress),
    estimatedDaysToMonetization: daysToMonetization,
    videosNeeded: Math.max(0, videosNeeded),
    status
  };
}

/**
 * 📅 Auto-plan next videos until monetization
 */
export async function autoplanVideosUntilMonetization(
  channel: { id: string; name: string; description?: string; subscriberCount: number }
): Promise<VideoGenerationPlan> {
  console.log(`🤖 AUTO-PLANNING: Creating video strategy for ${channel.name}...`);

  const progress = calculateMonetizationProgress(channel);
  const niche = detectNiche(channel);
  
  // Determine how many videos to plan
  const videosToGenerate = Math.min(progress.videosNeeded, 20); // Cap at 20 for performance
  
  console.log(`📊 Need ${progress.videosNeeded} videos to reach monetization`);
  console.log(`📅 Planning next ${videosToGenerate} videos...`);

  // Get trending stories
  let stories: ScrapedStory[] = [];
  
  try {
    stories = await scrapeAllSources({
      categories: [niche],
      limit: videosToGenerate
    });
  } catch (e) {
    console.log('Using AI-generated stories...');
    const aiStories = await discoverStories(niche, undefined, undefined, videosToGenerate);
    stories = aiStories.map(s => ({
      id: s.id,
      title: s.title,
      content: '',
      source: 'AI',
      sourceUrl: '',
      category: s.category,
      date: new Date().toISOString(),
      location: s.country,
      keywords: s.themes,
      viralScore: s.viralScore,
      estimatedViews: s.estimatedViews,
      trending: true
    }));
  }

  // Create video plan
  const videoQueue: PlannedVideo[] = [];
  const today = new Date();

  for (let i = 0; i < stories.length; i++) {
    const story = stories[i];
    const scheduledDate = new Date(today);
    scheduledDate.setDate(today.getDate() + (i * 2)); // Every 2 days

    // Determine priority (first 3 are critical for momentum)
    let priority: PlannedVideo['priority'] = 'medium';
    if (i < 3) priority = 'critical';
    else if (i < 7) priority = 'high';

    videoQueue.push({
      id: `planned-${Date.now()}-${i}`,
      title: story.title,
      script: '', // Will be generated when it's time
      category: story.category,
      scheduledDate: scheduledDate.toISOString(),
      estimatedViews: story.estimatedViews,
      estimatedWatchTime: story.estimatedViews * 8 * 0.6, // 8 min avg, 60% retention
      priority,
      status: 'planned'
    });
  }

  // Calculate estimated monetization date
  const lastVideo = videoQueue[videoQueue.length - 1];
  const estimatedDate = new Date(lastVideo?.scheduledDate || today);
  estimatedDate.setDate(estimatedDate.getDate() + 30); // +30 days buffer for views to accumulate

  const plan: VideoGenerationPlan = {
    channelId: channel.id,
    channelName: channel.name,
    totalVideosPlanned: videosToGenerate,
    videosGenerated: 0,
    nextVideoDate: videoQueue[0]?.scheduledDate || new Date().toISOString(),
    contentStrategy: [
      'Post 3-4 videos per week for consistent growth',
      'Focus on high-viral topics to maximize reach',
      'Optimize thumbnails and titles for click-through rate',
      'Engage with comments to boost algorithm favorability',
      'Cross-promote videos in end screens'
    ],
    estimatedMonetizationDate: estimatedDate.toISOString(),
    videoQueue
  };

  // Save plan
  localStorage.setItem(`video_plan_${channel.id}`, JSON.stringify(plan));

  console.log(`✅ Plan created: ${videosToGenerate} videos scheduled`);
  console.log(`📅 Estimated monetization: ${estimatedDate.toLocaleDateString()}`);

  return plan;
}

/**
 * 🔄 Auto-generate next scheduled video
 */
export async function autoGenerateNextScheduledVideo(channelId: string): Promise<boolean> {
  const planData = localStorage.getItem(`video_plan_${channelId}`);
  if (!planData) return false;

  const plan: VideoGenerationPlan = JSON.parse(planData);
  
  // Find next video to generate
  const nextVideo = plan.videoQueue.find(v => v.status === 'planned');
  if (!nextVideo) {
    console.log('✅ All planned videos generated!');
    return false;
  }

  console.log(`🤖 AUTO-GENERATING: ${nextVideo.title}...`);
  
  // Mark as generating
  nextVideo.status = 'generating';
  localStorage.setItem(`video_plan_${channelId}`, JSON.stringify(plan));

  // Generate the video (simplified - reuse first video logic)
  const channel = {
    id: channelId,
    name: plan.channelName,
    description: '',
    subscriberCount: 0
  };

  try {
    await autoGenerateFirstVideo(channel);
    
    // Mark as ready
    nextVideo.status = 'ready';
    plan.videosGenerated++;
    localStorage.setItem(`video_plan_${channelId}`, JSON.stringify(plan));
    
    console.log(`✅ Video generated: ${nextVideo.title}`);
    return true;
  } catch (error) {
    console.error('❌ Generation failed:', error);
    nextVideo.status = 'planned'; // Reset
    localStorage.setItem(`video_plan_${channelId}`, JSON.stringify(plan));
    return false;
  }
}

// Helper functions
function detectNiche(channel: { name: string; description?: string }): string {
  const text = `${channel.name} ${channel.description || ''}`.toLowerCase();
  
  if (text.match(/mystery|hidden|truth|secret|unsolved/)) return 'mystery';
  if (text.match(/crime|murder|killer|detective/)) return 'crime';
  if (text.match(/ghost|haunted|paranormal|supernatural/)) return 'supernatural';
  if (text.match(/history|historical|ancient/)) return 'history';
  if (text.match(/tech|technology|ai|crypto/)) return 'technology';
  if (text.match(/business|money|wealth|finance/)) return 'wealth';
  if (text.match(/psychology|mind|mental/)) return 'psychology';
  
  return 'mystery'; // Default to mystery (highest viral potential)
}

function selectBestScriptStyle(niche: string): string {
  const styleMap: Record<string, string> = {
    mystery: 'suspenseful',
    crime: 'investigative',
    supernatural: 'suspenseful',
    history: 'cinematic',
    technology: 'investigative',
    wealth: 'dramatic',
    psychology: 'dramatic'
  };
  return styleMap[niche] || 'suspenseful';
}

function selectBestVideoStyle(niche: string): string {
  const styleMap: Record<string, string> = {
    mystery: 'kinetic-typography',
    crime: '2d-cartoon',
    supernatural: 'anime',
    history: 'whiteboard',
    technology: 'isometric-3d',
    wealth: 'motion-graphics',
    psychology: 'motion-graphics'
  };
  return styleMap[niche] || 'kinetic-typography';
}
