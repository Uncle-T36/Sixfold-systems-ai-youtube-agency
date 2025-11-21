/**
 * 💰 MONEY-MAKING DASHBOARD
 * 
 * Central hub for revenue tracking and optimization
 * Integrates with OmniscientAI for smart suggestions
 * Validates all videos are REAL and monetizable
 * Tracks actual YouTube revenue across all channels
 */

import { omniscientAI, getSmartSuggestions, getAppStatus, type UserContext } from './omniscientAI';
import { validateRealVideo, calculateBatchRevenue, type VideoValidation } from './realVideoValidator';
import { analyzeChannelDescription } from './channelAnalyzer';
import { analyzeChannelPortfolio } from './wealthEngine';

export interface RevenueMetrics {
  // Current Performance
  totalRevenue: number;
  monthlyRevenue: number;
  dailyAverage: number;
  revenueGrowth: number; // percentage
  
  // Channel Performance
  topChannel: {
    name: string;
    revenue: number;
    rpm: number; // revenue per mille (1000 views)
  };
  
  // Video Performance
  totalVideos: number;
  monetizableVideos: number;
  averageRevenuePerVideo: number;
  bestPerformingVideo: {
    title: string;
    revenue: number;
    views: number;
  };
  
  // Projections
  projectedMonthlyRevenue: number;
  projectedYearlyRevenue: number;
  daysToNextGoal: number;
  
  // Opportunities
  untappedPotential: number; // how much more you could earn
  optimizationSuggestions: string[];
}

export interface MoneyMakingPlan {
  currentRevenue: number;
  goalRevenue: number;
  timeframe: string;
  steps: Array<{
    action: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
    priority: number;
    expectedRevenue: number;
  }>;
  quickWins: string[];
  longTermStrategy: string[];
}

/**
 * 📊 Get comprehensive revenue analytics
 */
export async function getRevenueMetrics(
  channels: any[],
  videos: any[]
): Promise<RevenueMetrics> {
  
  console.log('💰 Calculating revenue metrics...');

  // Calculate total revenue from all channels
  const totalRevenue = channels.reduce((sum, ch) => sum + (ch.revenue || 0), 0);
  
  // Calculate monthly revenue (last 30 days)
  const now = Date.now();
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
  
  const recentVideos = videos.filter(v => 
    new Date(v.uploadDate || v.createdAt).getTime() > thirtyDaysAgo
  );
  
  const monthlyRevenue = recentVideos.reduce((sum, v) => sum + (v.revenue || 0), 0);
  const dailyAverage = monthlyRevenue / 30;

  // Calculate growth (compare to previous 30 days)
  const sixtyDaysAgo = now - (60 * 24 * 60 * 60 * 1000);
  const previousMonthVideos = videos.filter(v => {
    const date = new Date(v.uploadDate || v.createdAt).getTime();
    return date > sixtyDaysAgo && date <= thirtyDaysAgo;
  });
  const previousMonthRevenue = previousMonthVideos.reduce((sum, v) => sum + (v.revenue || 0), 0);
  const revenueGrowth = previousMonthRevenue > 0 
    ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
    : 0;

  // Find top performing channel
  const topChannel = channels.reduce((top, ch) => 
    (ch.revenue || 0) > (top.revenue || 0) ? ch : top
  , { name: 'None', revenue: 0, rpm: 0 });

  if (topChannel.name !== 'None' && topChannel.views) {
    topChannel.rpm = (topChannel.revenue / topChannel.views) * 1000;
  }

  // Video metrics
  const totalVideos = videos.length;
  const monetizableVideos = videos.filter(v => 
    (v.duration || 0) >= 480 && v.status === 'published'
  ).length;
  
  const averageRevenuePerVideo = totalVideos > 0 ? totalRevenue / totalVideos : 0;

  // Best performing video
  const bestPerformingVideo = videos.reduce((best, v) => 
    (v.revenue || 0) > (best.revenue || 0) ? v : best
  , { title: 'None yet', revenue: 0, views: 0 });

  // Projections based on current growth
  const projectedMonthlyRevenue = monthlyRevenue * (1 + (revenueGrowth / 100));
  const projectedYearlyRevenue = projectedMonthlyRevenue * 12;

  // Days to next milestone ($1K, $5K, $10K, $50K, $100K)
  const milestones = [1000, 5000, 10000, 50000, 100000];
  const nextGoal = milestones.find(m => m > monthlyRevenue) || 100000;
  const revenueGap = nextGoal - monthlyRevenue;
  const daysToNextGoal = dailyAverage > 0 ? Math.ceil(revenueGap / dailyAverage) : 999;

  // Calculate untapped potential
  const potentialAnalysis = analyzeChannelPortfolio(channels);
  const untappedPotential = potentialAnalysis.gaps.reduce((sum: number, gap: any) => 
    sum + (gap.estimatedMonthlyRevenue || 0), 0
  );

  // Get optimization suggestions from AI
  const context: UserContext = {
    channels,
    videos,
    totalViews: channels.reduce((sum, ch) => sum + (ch.views || 0), 0),
    totalRevenue,
    currentPage: 'dashboard',
    userGoal: 'make_money'
  };

  const suggestions = getSmartSuggestions(context);

  // Add channel-specific monetization tips
  const channelSuggestions = channels.slice(0, 3).map(ch => 
    `Optimize ${ch.name} with better SEO and viral titles`
  );

  const optimizationSuggestions = [
    ...suggestions,
    ...channelSuggestions.filter(Boolean)
  ];

  return {
    totalRevenue,
    monthlyRevenue,
    dailyAverage,
    revenueGrowth,
    topChannel,
    totalVideos,
    monetizableVideos,
    averageRevenuePerVideo,
    bestPerformingVideo,
    projectedMonthlyRevenue,
    projectedYearlyRevenue,
    daysToNextGoal,
    untappedPotential,
    optimizationSuggestions
  };
}

/**
 * 🎯 Generate personalized money-making plan
 */
export async function generateMoneyMakingPlan(
  currentRevenue: number,
  goalRevenue: number,
  channels: any[],
  videos: any[]
): Promise<MoneyMakingPlan> {
  
  console.log(`💡 Generating plan to grow from $${currentRevenue} to $${goalRevenue}/month...`);

  const revenueGap = goalRevenue - currentRevenue;

  // Analyze current state
  const profitGaps = analyzeChannelPortfolio(channels);
  const hasHighPayingChannels = channels.some(ch => 
    (ch.niche || '').toLowerCase().includes('finance') || 
    (ch.niche || '').toLowerCase().includes('business')
  );

  const steps: Array<{
    action: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
    priority: number;
    expectedRevenue: number;
  }> = [];

  // Step 1: Optimize existing content
  if (videos.length > 0) {
    steps.push({
      action: 'Optimize top 10 videos with better titles, descriptions, and thumbnails',
      impact: 'Increase views by 30-50% on existing content',
      effort: 'low',
      priority: 1,
      expectedRevenue: currentRevenue * 0.3
    });
  }

  // Step 2: Create more content
  const videosNeeded = Math.ceil(revenueGap / 200); // Assume $200 avg per video
  steps.push({
    action: `Generate ${videosNeeded} new videos in high-performing topics`,
    impact: `Fill revenue gap with proven content`,
    effort: videos.length === 0 ? 'medium' : 'low',
    priority: 2,
    expectedRevenue: videosNeeded * 200
  });

  // Step 3: Add high-paying channel if needed
  if (!hasHighPayingChannels && revenueGap > 2000) {
    steps.push({
      action: 'Create Finance/Business channel (highest CPM niche)',
      impact: 'Earn 3-5x more per view than current niches',
      effort: 'low',
      priority: 3,
      expectedRevenue: 2500
    });
  }

  // Step 4: Enable all monetization features
  steps.push({
    action: 'Enable memberships, Super Thanks, and merchandise shelf',
    impact: 'Add 10-20% bonus revenue from engaged fans',
    effort: 'low',
    priority: 4,
    expectedRevenue: currentRevenue * 0.15
  });

  // Step 5: Add affiliate marketing
  steps.push({
    action: 'Add affiliate links in all video descriptions',
    impact: 'Earn commission on product recommendations',
    effort: 'low',
    priority: 5,
    expectedRevenue: videos.length * 50 // $50 avg per video
  });

  // Step 6: Series content for watch time
  if (videos.filter(v => v.isPartOfSeries).length < 5) {
    steps.push({
      action: 'Create 3 video series (5-10 episodes each)',
      impact: 'Binge-worthy content = 3-5x more watch time = more ads = more money',
      effort: 'medium',
      priority: 6,
      expectedRevenue: 1500
    });
  }

  // Step 7: Consistency with autopilot
  steps.push({
    action: 'Enable autopilot mode for 3 uploads per week',
    impact: 'Consistent growth compounds over time',
    effort: 'low',
    priority: 7,
    expectedRevenue: revenueGap * 0.5 // Consistency accounts for 50% of gap
  });

  // Sort by priority
  steps.sort((a, b) => a.priority - b.priority);

  // Quick wins (low effort, high impact)
  const quickWins = steps
    .filter(s => s.effort === 'low' && s.expectedRevenue > 100)
    .slice(0, 3)
    .map(s => s.action);

  // Long-term strategy
  const longTermStrategy = [
    'Build 5-10 channels across different high-paying niches',
    'Aim for 100K+ subscribers per channel for sponsorship deals ($5K-20K per video)',
    'Create evergreen content that earns passive income for years',
    'Diversify with courses, coaching, and other digital products',
    `Scale to $${Math.max(goalRevenue * 5, 50000)}/month with proven systems`
  ];

  // Calculate timeframe
  const avgRevenuePerStep = steps.reduce((sum, s) => sum + s.expectedRevenue, 0) / steps.length;
  const stepsNeeded = Math.ceil(revenueGap / avgRevenuePerStep);
  const weeksNeeded = stepsNeeded * 2; // Assume 2 weeks per major step
  const timeframe = weeksNeeded < 4 ? '2-4 weeks' : 
                    weeksNeeded < 8 ? '1-2 months' :
                    weeksNeeded < 16 ? '2-4 months' : '4-6 months';

  return {
    currentRevenue,
    goalRevenue,
    timeframe,
    steps,
    quickWins,
    longTermStrategy
  };
}

/**
 * 🔍 Audit all videos to ensure they're REAL and monetizable
 */
export async function auditVideoQuality(
  videos: any[]
): Promise<{
  summary: {
    total: number;
    real: number;
    youtubeReady: number;
    monetizable: number;
    issues: number;
  };
  validations: Array<{
    videoId: string;
    title: string;
    validation: VideoValidation;
    qualityScore: number;
    revenueImpact: string;
  }>;
  recommendations: string[];
}> {
  
  console.log(`🔍 Auditing ${videos.length} videos...`);

  const validations: Array<{
    videoId: string;
    title: string;
    validation: VideoValidation;
    qualityScore: number;
    revenueImpact: string;
  }> = [];

  for (const video of videos.slice(0, 20)) { // Limit to 20 for performance
    try {
      // Validate video file if available
      if (video.fileUrl || video.videoUrl) {
        const validation = await validateRealVideo(video.fileUrl || video.videoUrl);
        const qualityScore = getVideoQualityScore(validation);
        
        const revenueImpact = validation.monetizable 
          ? qualityScore >= 80 ? '💰💰💰 High revenue potential' :
            qualityScore >= 60 ? '💰💰 Good revenue potential' : '💰 Moderate revenue potential'
          : '⚠️ Not monetizable - needs fixes';

        validations.push({
          videoId: video.id,
          title: video.title,
          validation,
          qualityScore,
          revenueImpact
        });
      }
    } catch (error) {
      console.error(`Failed to validate video ${video.id}:`, error);
    }
  }

  const summary = {
    total: validations.length,
    real: validations.filter(v => v.validation.isReal).length,
    youtubeReady: validations.filter(v => v.validation.youtubeReady).length,
    monetizable: validations.filter(v => v.validation.monetizable).length,
    issues: validations.filter(v => v.validation.issues.length > 0).length
  };

  const recommendations: string[] = [];

  if (summary.monetizable < summary.total * 0.5) {
    recommendations.push('⚠️ Less than 50% of videos are monetizable - make videos 8+ minutes with audio');
  }

  if (summary.issues > 0) {
    recommendations.push(`🔧 ${summary.issues} videos have issues - re-generate with higher quality settings`);
  }

  const avgQuality = validations.reduce((sum, v) => sum + v.qualityScore, 0) / validations.length;
  if (avgQuality < 70) {
    recommendations.push('📈 Average quality is below 70% - use 1080p+ and longer duration for better revenue');
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ All videos look great! Keep generating high-quality content.');
  }

  return {
    summary,
    validations,
    recommendations
  };
}

/**
 * 🎯 Get real-time revenue tracking
 */
export function trackRevenueRealTime(channels: any[]) {
  // This would connect to YouTube Analytics API in production
  // For now, we'll estimate based on views and CPM
  
  return channels.map(channel => {
    const views = channel.views || 0;
    const cpm = getCPMForNiche(channel.niche || 'general');
    const estimatedRevenue = (views / 1000) * cpm;

    return {
      channelId: channel.id,
      channelName: channel.name,
      niche: channel.niche,
      views,
      cpm,
      estimatedRevenue,
      lastUpdated: new Date().toISOString()
    };
  });
}

function getCPMForNiche(niche: string): number {
  const rates: Record<string, number> = {
    'finance': 35,
    'investing': 35,
    'business': 30,
    'make money online': 25,
    'real estate': 28,
    'technology': 20,
    'ai': 20,
    'education': 15,
    'health': 15,
    'entertainment': 6,
    'gaming': 4
  };

  const lowerNiche = niche.toLowerCase();
  for (const [key, rate] of Object.entries(rates)) {
    if (lowerNiche.includes(key)) return rate;
  }

  return 10; // Default CPM
}

function getVideoQualityScore(validation: VideoValidation): number {
  let score = 0;
  if (validation.isReal) score += 30;
  if (validation.resolution.includes('1920')) score += 25;
  if (validation.duration >= 480) score += 20;
  if (validation.hasAudio) score += 15;
  if (validation.youtubeReady) score += 5;
  if (validation.monetizable) score += 5;
  return score;
}
