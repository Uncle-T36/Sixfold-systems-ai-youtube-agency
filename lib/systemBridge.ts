/**
 * SYSTEM BRIDGE - Makes all components understand each other
 * Channels ↔ Videos ↔ Series ↔ Revenue ↔ Analytics
 */

export interface SystemState {
  channels: any[];
  videos: any[];
  series: any[];
  scripts: any[];
  revenue: number;
  subscribers: number;
  views: number;
  activeWorkflows: any[];
}

/**
 * Get complete system state
 */
export function getSystemState(): SystemState {
  if (typeof window === 'undefined') {
    return emptyState();
  }

  const channels = JSON.parse(localStorage.getItem('channels') || '[]');
  const videos = JSON.parse(localStorage.getItem('generated_videos') || '[]');
  const series = JSON.parse(localStorage.getItem('series_channels') || '[]');
  const scripts = JSON.parse(localStorage.getItem('generated_scripts') || '[]');
  const workflows = JSON.parse(localStorage.getItem('active_workflows') || '[]');

  // Calculate totals
  const totalSubs = channels.reduce((sum: number, ch: any) => sum + (ch.subscribers || 0), 0);
  const totalViews = channels.reduce((sum: number, ch: any) => sum + (ch.totalViews || 0), 0);
  const estimatedRevenue = totalViews * 0.005; // $5 per 1K views

  return {
    channels,
    videos,
    series,
    scripts,
    revenue: estimatedRevenue,
    subscribers: totalSubs,
    views: totalViews,
    activeWorkflows: workflows
  };
}

function emptyState(): SystemState {
  return {
    channels: [],
    videos: [],
    series: [],
    scripts: [],
    revenue: 0,
    subscribers: 0,
    views: 0,
    activeWorkflows: []
  };
}

/**
 * WORKFLOW: Series → Script → Video → Published
 */
export function createWorkflow(type: 'series' | 'single', data: any): string {
  const workflow = {
    id: `workflow-${Date.now()}`,
    type,
    status: 'in-progress',
    steps: [
      { name: 'Generate Script', status: 'completed', completedAt: new Date().toISOString() },
      { name: 'Create Video', status: 'in-progress', startedAt: new Date().toISOString() },
      { name: 'Add Voiceover', status: 'pending' },
      { name: 'Generate Thumbnail', status: 'pending' },
      { name: 'Optimize SEO', status: 'pending' },
      { name: 'Ready to Publish', status: 'pending' }
    ],
    data,
    createdAt: new Date().toISOString()
  };

  const workflows = JSON.parse(localStorage.getItem('active_workflows') || '[]');
  workflows.push(workflow);
  localStorage.setItem('active_workflows', JSON.stringify(workflows));

  return workflow.id;
}

/**
 * Update workflow step
 */
export function updateWorkflowStep(workflowId: string, stepName: string, status: 'completed' | 'failed'): void {
  const workflows = JSON.parse(localStorage.getItem('active_workflows') || '[]');
  const workflow = workflows.find((w: any) => w.id === workflowId);

  if (workflow) {
    const step = workflow.steps.find((s: any) => s.name === stepName);
    if (step) {
      step.status = status;
      step.completedAt = new Date().toISOString();

      // Auto-start next step
      const currentIndex = workflow.steps.indexOf(step);
      if (status === 'completed' && currentIndex < workflow.steps.length - 1) {
        workflow.steps[currentIndex + 1].status = 'in-progress';
        workflow.steps[currentIndex + 1].startedAt = new Date().toISOString();
      }

      // Check if all completed
      const allCompleted = workflow.steps.every((s: any) => s.status === 'completed');
      if (allCompleted) {
        workflow.status = 'completed';
        workflow.completedAt = new Date().toISOString();
      }

      localStorage.setItem('active_workflows', JSON.stringify(workflows));
    }
  }
}

/**
 * Link video to channel automatically
 */
export function linkVideoToChannel(videoId: string, channelId?: string): void {
  const videos = JSON.parse(localStorage.getItem('generated_videos') || '[]');
  const channels = JSON.parse(localStorage.getItem('channels') || '[]');

  const video = videos.find((v: any) => v.id === videoId);
  if (!video) return;

  // Auto-select channel if not specified
  if (!channelId && channels.length > 0) {
    channelId = channels[0].id;
  }

  if (channelId) {
    video.channelId = channelId;
    video.channelName = channels.find((c: any) => c.id === channelId)?.name;
    localStorage.setItem('generated_videos', JSON.stringify(videos));

    // Update channel video count
    const channel = channels.find((c: any) => c.id === channelId);
    if (channel) {
      channel.videoCount = (channel.videoCount || 0) + 1;
      localStorage.setItem('channels', JSON.stringify(channels));
    }
  }
}

/**
 * Track video performance and update channel stats
 */
export function updateVideoStats(videoId: string, views: number, likes: number, comments: number): void {
  const videos = JSON.parse(localStorage.getItem('generated_videos') || '[]');
  const video = videos.find((v: any) => v.id === videoId);

  if (video) {
    video.views = views;
    video.likes = likes;
    video.comments = comments;
    video.lastUpdated = new Date().toISOString();
    localStorage.setItem('generated_videos', JSON.stringify(videos));

    // Update channel stats
    if (video.channelId) {
      const channels = JSON.parse(localStorage.getItem('channels') || '[]');
      const channel = channels.find((c: any) => c.id === video.channelId);
      if (channel) {
        channel.totalViews = (channel.totalViews || 0) + views;
        channel.totalLikes = (channel.totalLikes || 0) + likes;
        localStorage.setItem('channels', JSON.stringify(channels));
      }
    }
  }
}

/**
 * Connect series to video generation
 */
export function seriesEpisodeToVideo(seriesId: string, episodeIndex: number): void {
  const series = JSON.parse(localStorage.getItem('series_channels') || '[]');
  const targetSeries = series.find((s: any) => s.id === seriesId);

  if (targetSeries && targetSeries.episodes && targetSeries.episodes[episodeIndex]) {
    const episode = targetSeries.episodes[episodeIndex];

    // Create video from episode
    const videoData = {
      id: `video-${Date.now()}`,
      seriesId,
      seriesName: targetSeries.name,
      episodeNumber: episodeIndex + 1,
      title: episode.title,
      script: episode.script,
      description: episode.description || '',
      tags: episode.keywords || [],
      status: 'ready',
      createdAt: new Date().toISOString()
    };

    const videos = JSON.parse(localStorage.getItem('generated_videos') || '[]');
    videos.push(videoData);
    localStorage.setItem('generated_videos', JSON.stringify(videos));

    // Create workflow
    createWorkflow('series', videoData);
  }
}

/**
 * Get recommendations based on system state
 */
export function getSystemRecommendations(): string[] {
  const state = getSystemState();
  const recommendations: string[] = [];

  if (state.channels.length === 0) {
    recommendations.push('🔌 Connect your first YouTube channel to get started');
  }

  if (state.videos.length === 0 && state.channels.length > 0) {
    recommendations.push('🎬 Create your first video - AI will analyze your channel style');
  }

  if (state.videos.length > 0 && state.videos.length < 5) {
    recommendations.push('📈 Post 3-5 videos per week for fastest growth');
  }

  if (state.series.length === 0 && state.videos.length >= 3) {
    recommendations.push('📺 Create a series - Gets 3X more views than single videos');
  }

  if (state.subscribers < 1000) {
    recommendations.push('🎯 Focus on getting 1,000 subscribers for monetization');
  }

  if (state.views > 10000 && state.revenue === 0) {
    recommendations.push('💰 Set up monetization - You\'re leaving money on the table!');
  }

  if (state.activeWorkflows.length === 0 && state.videos.length > 0) {
    recommendations.push('🤖 Enable Autopilot mode to 10X your productivity');
  }

  return recommendations;
}

/**
 * Sync data between components
 */
export function syncSystem(): void {
  // Ensure all videos are linked to channels
  const videos = JSON.parse(localStorage.getItem('generated_videos') || '[]');
  const channels = JSON.parse(localStorage.getItem('channels') || '[]');

  videos.forEach((video: any) => {
    if (!video.channelId && channels.length > 0) {
      linkVideoToChannel(video.id, channels[0].id);
    }
  });

  // Update workflow statuses
  const workflows = JSON.parse(localStorage.getItem('active_workflows') || '[]');
  workflows.forEach((workflow: any) => {
    if (workflow.status === 'in-progress') {
      // Check if related video is completed
      const video = videos.find((v: any) => v.id === workflow.data.id);
      if (video && video.status === 'completed') {
        workflow.status = 'completed';
        workflow.completedAt = new Date().toISOString();
      }
    }
  });
  localStorage.setItem('active_workflows', JSON.stringify(workflows));
}

/**
 * Broadcast system event to all components
 */
export function broadcastEvent(eventType: string, data: any): void {
  const event = {
    type: eventType,
    data,
    timestamp: new Date().toISOString()
  };

  // Store in system events
  const events = JSON.parse(localStorage.getItem('system_events') || '[]');
  events.push(event);
  
  // Keep only last 100 events
  if (events.length > 100) {
    events.shift();
  }
  
  localStorage.setItem('system_events', JSON.stringify(events));

  // Dispatch custom event for real-time updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('system-update', { detail: event }));
  }
}

/**
 * Get system health status
 */
export function getSystemHealth(): {
  status: 'excellent' | 'good' | 'needs-attention' | 'critical';
  score: number;
  issues: string[];
} {
  const state = getSystemState();
  let score = 100;
  const issues: string[] = [];

  // Check channels
  if (state.channels.length === 0) {
    score -= 30;
    issues.push('No channels connected');
  }

  // Check content production
  if (state.videos.length === 0) {
    score -= 20;
    issues.push('No videos created yet');
  }

  // Check monetization
  if (state.views > 10000 && state.revenue === 0) {
    score -= 15;
    issues.push('High views but no monetization setup');
  }

  // Check workflow activity
  if (state.activeWorkflows.length === 0 && state.videos.length > 0) {
    score -= 10;
    issues.push('No active workflows - consider enabling autopilot');
  }

  // Determine status
  let status: 'excellent' | 'good' | 'needs-attention' | 'critical';
  if (score >= 90) status = 'excellent';
  else if (score >= 70) status = 'good';
  else if (score >= 50) status = 'needs-attention';
  else status = 'critical';

  return { status, score, issues };
}
