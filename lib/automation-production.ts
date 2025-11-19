/**
 * 🤖 PRODUCTION AUTOMATION ENGINE
 * Integrates real YouTube + AI APIs
 */

import { generateContent, isAIConfigured } from './ai-content-generator';
import { fetchChannelData, isYouTubeAPIConfigured } from './youtube-api-real';

/**
 * Generate video content with AI
 */
export async function generateVideoContent(
  topic: string,
  channelId?: string,
  options: {
    style?: string;
    length?: 'short' | 'medium' | 'long';
    niche?: string;
  } = {}
) {
  console.log(`🤖 Starting content generation for: ${topic}`);
  
  // Check API status
  if (!isAIConfigured()) {
    console.warn('⚠️ AI API not configured - using demo content');
    console.warn('Add OPENAI_API_KEY or GOOGLE_GEMINI_API_KEY to .env.local for real AI generation');
  }

  // Get channel context if available
  let channelContext = null;
  if (channelId && isYouTubeAPIConfigured()) {
    channelContext = await fetchChannelData(channelId);
    console.log(`📊 Channel data loaded: ${channelContext?.title || 'Unknown'}`);
  }

  // Generate content
  const content = await generateContent({
    topic,
    style: options.style as any,
    length: options.length,
    niche: options.niche,
    targetAudience: channelContext ? `Subscribers: ${channelContext.statistics.subscriberCount}` : undefined
  });

  console.log(`✅ Content generated: ${content.title}`);
  console.log(`📝 Script length: ${content.estimatedDuration} minutes`);
  console.log(`🔥 Viral score: ${content.viralScore}/100`);

  return content;
}

/**
 * Analyze channel performance
 */
export async function analyzeChannel(channelId: string) {
  console.log(`📊 Analyzing channel: ${channelId}`);

  if (!isYouTubeAPIConfigured()) {
    throw new Error('YouTube API not configured. Add YOUTUBE_API_KEY to .env.local');
  }

  const channelData = await fetchChannelData(channelId);
  if (!channelData) {
    throw new Error('Channel not found');
  }

  // Calculate metrics
  const avgViewsPerVideo = Math.floor(
    channelData.statistics.viewCount / Math.max(channelData.statistics.videoCount, 1)
  );

  const subscriberEngagement = Math.floor(
    (avgViewsPerVideo / Math.max(channelData.statistics.subscriberCount, 1)) * 100
  );

  // Estimate revenue ($3-5 CPM)
  const monthlyViews = channelData.statistics.viewCount / 12;
  const estimatedRevenue = (monthlyViews / 1000) * 4;

  const analysis = {
    channel: {
      name: channelData.title,
      subscribers: channelData.statistics.subscriberCount.toLocaleString(),
      totalViews: channelData.statistics.viewCount.toLocaleString(),
      videoCount: channelData.statistics.videoCount
    },
    metrics: {
      avgViewsPerVideo: avgViewsPerVideo.toLocaleString(),
      subscriberEngagement: `${subscriberEngagement}%`,
      estimatedMonthlyRevenue: `$${estimatedRevenue.toFixed(2)}`
    },
    recommendations: generateRecommendations(channelData, subscriberEngagement)
  };

  console.log(`✅ Analysis complete for: ${channelData.title}`);
  return analysis;
}

/**
 * Generate recommendations
 */
function generateRecommendations(channelData: any, engagement: number): string[] {
  const recommendations = [];

  if (channelData.statistics.videoCount < 50) {
    recommendations.push('📹 Increase posting frequency - aim for 2-3 videos per week');
  }

  if (engagement < 10) {
    recommendations.push('📈 Improve thumbnails and titles to boost click-through rate');
  }

  if (channelData.statistics.subscriberCount < 1000) {
    recommendations.push('🎯 Focus on niche content to reach monetization threshold');
  } else if (channelData.statistics.subscriberCount < 10000) {
    recommendations.push('🚀 Scale content production - you\'re ready for growth');
  }

  recommendations.push('✨ Use AI to generate optimized titles and descriptions');
  recommendations.push('⏰ Post during peak hours (6-9 PM in your timezone)');
  recommendations.push('💡 Create series to increase watch time and retention');

  return recommendations;
}

/**
 * Batch generate content
 */
export async function batchGenerateContent(
  topics: string[],
  channelId?: string,
  options: any = {}
) {
  const results = [];

  for (const topic of topics) {
    console.log(`\n🎬 Generating content ${results.length + 1}/${topics.length}: ${topic}`);
    
    const content = await generateVideoContent(topic, channelId, options);
    results.push(content);

    // Rate limit delay
    if (results.length < topics.length) {
      console.log('⏳ Waiting 2s to avoid rate limits...');
      await delay(2000);
    }
  }

  console.log(`\n✅ Batch complete: ${results.length} pieces of content generated`);
  return results;
}

/**
 * Check system readiness
 */
export function checkSystemStatus() {
  const status = {
    ai: {
      configured: isAIConfigured(),
      provider: process.env.OPENAI_API_KEY ? 'OpenAI' : 
                process.env.GOOGLE_GEMINI_API_KEY ? 'Google Gemini' : 
                process.env.ANTHROPIC_API_KEY ? 'Anthropic Claude' : 'None',
      status: isAIConfigured() ? '✅ Ready' : '❌ Not configured'
    },
    youtube: {
      configured: isYouTubeAPIConfigured(),
      status: isYouTubeAPIConfigured() ? '✅ Ready' : '❌ Not configured'
    },
    supabase: {
      configured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      status: (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ? '✅ Ready' : '❌ Not configured'
    }
  };

  const allReady = status.ai.configured && status.youtube.configured && status.supabase.configured;

  return {
    ...status,
    overall: allReady ? '✅ System Ready' : '⚠️ Configuration Needed',
    readyForProduction: allReady
  };
}

/**
 * Get setup instructions
 */
export function getSetupInstructions() {
  const status = checkSystemStatus();
  const instructions = [];

  if (!status.ai.configured) {
    instructions.push({
      step: 1,
      title: '🤖 Setup AI API (Required)',
      description: 'Choose one AI provider for content generation',
      options: [
        {
          name: 'Google Gemini (FREE, Recommended)',
          url: 'https://makersuite.google.com/app/apikey',
          env: 'GOOGLE_GEMINI_API_KEY',
          cost: 'FREE - 60 requests/min'
        },
        {
          name: 'OpenAI GPT-4',
          url: 'https://platform.openai.com/api-keys',
          env: 'OPENAI_API_KEY',
          cost: '$20/month'
        }
      ]
    });
  }

  if (!status.youtube.configured) {
    instructions.push({
      step: 2,
      title: '📹 Setup YouTube API (Required)',
      description: 'Get channel data and analytics',
      steps: [
        'Go to: https://console.cloud.google.com',
        'Create new project or select existing',
        'Enable "YouTube Data API v3"',
        'Create credentials → API key',
        'Add to .env.local: YOUTUBE_API_KEY=your_key_here'
      ],
      cost: 'FREE - 10,000 units/day'
    });
  }

  if (!status.supabase.configured) {
    instructions.push({
      step: 3,
      title: '🗄️ Setup Supabase Database (Required)',
      description: 'Store channels, videos, and analytics',
      steps: [
        'Go to: https://supabase.com/dashboard',
        'Create new project',
        'Copy URL and anon key',
        'Run supabase/schema.sql in SQL Editor',
        'Add to .env.local:',
        '  NEXT_PUBLIC_SUPABASE_URL=your_url',
        '  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key'
      ],
      cost: 'FREE - 500MB database'
    });
  }

  return {
    status,
    instructions,
    estimatedCost: '$0/month with free tiers',
    setupTime: '10-15 minutes'
  };
}

/**
 * Utility: Delay
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
