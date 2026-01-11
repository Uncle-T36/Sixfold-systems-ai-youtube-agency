/**
 * 🤖 FULL AUTO-PILOT ENGINE
 * Complete automation that generates and uploads videos for all channels
 * Zero user input required - just enable and watch the empire grow
 */

import { generateChannelPlan, getNextVideoForChannel, markVideoComplete, type PlannedVideo, type ChannelContentPlan } from './smartContentPlanner';
import { generateRealVideo, type VideoGenerationOptions } from './realVideoGenerator';
import { uploadVideoToYouTube, isChannelReadyForUpload } from './youtube-uploader';
import { backupAllData } from './dataProtection';

export interface AutoPilotStatus {
  enabled: boolean;
  running: boolean;
  lastRun: string | null;
  nextRun: string | null;
  videosGenerated: number;
  videosUploaded: number;
  errors: string[];
  currentChannel: string | null;
  currentVideo: string | null;
  progress: number;
}

export interface AutoPilotConfig {
  enabled: boolean;
  videosPerDay: number;
  postTimes: string[]; // ["09:00", "14:00", "19:00"]
  autoUpload: boolean;
  privacyStatus: 'public' | 'unlisted' | 'private';
  notifyOnComplete: boolean;
  pauseOnError: boolean;
}

const DEFAULT_CONFIG: AutoPilotConfig = {
  enabled: false,
  videosPerDay: 3,
  postTimes: ['09:00', '14:00', '19:00'],
  autoUpload: true,
  privacyStatus: 'private', // Safe default
  notifyOnComplete: true,
  pauseOnError: false,
};

let autopilotInterval: NodeJS.Timeout | null = null;
let isProcessing = false;

/**
 * Get current auto-pilot status
 */
export function getAutoPilotStatus(): AutoPilotStatus {
  const statusStr = localStorage.getItem('autopilot_status');
  if (statusStr) {
    return JSON.parse(statusStr);
  }
  
  return {
    enabled: false,
    running: false,
    lastRun: null,
    nextRun: null,
    videosGenerated: 0,
    videosUploaded: 0,
    errors: [],
    currentChannel: null,
    currentVideo: null,
    progress: 0,
  };
}

/**
 * Save auto-pilot status
 */
function saveStatus(status: AutoPilotStatus): void {
  localStorage.setItem('autopilot_status', JSON.stringify(status));
}

/**
 * Get auto-pilot configuration
 */
export function getAutoPilotConfig(): AutoPilotConfig {
  const configStr = localStorage.getItem('autopilot_config');
  if (configStr) {
    return { ...DEFAULT_CONFIG, ...JSON.parse(configStr) };
  }
  return DEFAULT_CONFIG;
}

/**
 * Save auto-pilot configuration
 */
export function saveAutoPilotConfig(config: Partial<AutoPilotConfig>): void {
  const current = getAutoPilotConfig();
  const updated = { ...current, ...config };
  localStorage.setItem('autopilot_config', JSON.stringify(updated));
}

/**
 * Start the auto-pilot system
 */
export function startAutoPilot(): boolean {
  const config = getAutoPilotConfig();
  
  if (!config.enabled) {
    console.log('❌ Auto-pilot is not enabled in config');
    return false;
  }
  
  // Check if we have channels
  const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
  if (channels.length === 0) {
    console.log('❌ No channels connected. Add channels first.');
    return false;
  }
  
  // Update status
  const status = getAutoPilotStatus();
  status.enabled = true;
  status.running = true;
  status.errors = [];
  saveStatus(status);
  
  console.log('🚀 Auto-pilot ENGAGED! Starting automated content production...');
  
  // Run immediately
  runAutoPilotCycle();
  
  // Set up interval (check every 5 minutes)
  autopilotInterval = setInterval(() => {
    const currentConfig = getAutoPilotConfig();
    if (currentConfig.enabled) {
      checkAndRunScheduledContent();
    }
  }, 5 * 60 * 1000);
  
  return true;
}

/**
 * Stop the auto-pilot system
 */
export function stopAutoPilot(): void {
  if (autopilotInterval) {
    clearInterval(autopilotInterval);
    autopilotInterval = null;
  }
  
  const status = getAutoPilotStatus();
  status.enabled = false;
  status.running = false;
  status.currentChannel = null;
  status.currentVideo = null;
  status.progress = 0;
  saveStatus(status);
  
  console.log('⏹️ Auto-pilot DISENGAGED');
}

/**
 * Check if it's time to post and run if so
 */
function checkAndRunScheduledContent(): void {
  const config = getAutoPilotConfig();
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  // Check if current time matches any post time (within 5 minute window)
  const isScheduledTime = config.postTimes.some(time => {
    const [hour, minute] = time.split(':').map(Number);
    const scheduledMinutes = hour * 60 + minute;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return Math.abs(scheduledMinutes - currentMinutes) <= 5;
  });
  
  if (isScheduledTime && !isProcessing) {
    console.log(`⏰ Scheduled time reached (${currentTime}), running content cycle...`);
    runAutoPilotCycle();
  }
}

/**
 * Run a complete auto-pilot cycle
 */
export async function runAutoPilotCycle(): Promise<void> {
  if (isProcessing) {
    console.log('⏳ Already processing, skipping cycle');
    return;
  }
  
  isProcessing = true;
  const status = getAutoPilotStatus();
  const config = getAutoPilotConfig();
  
  try {
    const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
    
    if (channels.length === 0) {
      status.errors.push('No channels available');
      saveStatus(status);
      isProcessing = false;
      return;
    }
    
    console.log(`🎬 Auto-pilot cycle starting for ${channels.length} channels...`);
    
    // Process each channel
    for (const channel of channels) {
      status.currentChannel = channel.name;
      status.progress = 0;
      saveStatus(status);
      
      // Get next video for this channel
      const nextVideo = getNextVideoForChannel(channel.id);
      
      if (!nextVideo) {
        console.log(`📋 No planned videos for ${channel.name}, generating new plan...`);
        generateChannelPlan(channel.id, channel.name, channel.niche || 'tech', channel.subscriberCount || 0);
        continue;
      }
      
      status.currentVideo = nextVideo.title;
      status.progress = 10;
      saveStatus(status);
      
      console.log(`🎥 Generating: "${nextVideo.title}" for ${channel.name}`);
      
      // Generate the video
      const videoOptions: VideoGenerationOptions = {
        title: nextVideo.title,
        script: nextVideo.script,
        style: nextVideo.style as any || 'kinetic-text',
        duration: Math.min(nextVideo.duration, 120), // Cap at 2 min for testing
        resolution: '1080p',
        fps: 30,
      };
      
      status.progress = 30;
      saveStatus(status);
      
      const generatedVideo = await generateRealVideo(videoOptions, (progress) => {
        status.progress = 30 + (progress.progress * 0.4); // 30-70%
        saveStatus(status);
      });
      
      status.videosGenerated++;
      status.progress = 70;
      saveStatus(status);
      
      console.log(`✅ Video generated: ${generatedVideo.id}`);
      
      // Upload if enabled and channel is ready
      if (config.autoUpload) {
        const isReady = await isChannelReadyForUpload(channel.id);
        
        if (isReady) {
          status.progress = 80;
          saveStatus(status);
          
          console.log(`📤 Uploading to YouTube: ${channel.name}`);
          
          const uploadResult = await uploadVideoToYouTube(
            channel.id,
            generatedVideo.blob,
            {
              title: nextVideo.title,
              description: nextVideo.description,
              tags: nextVideo.tags,
              privacyStatus: config.privacyStatus,
            }
          );
          
          if (uploadResult.success) {
            status.videosUploaded++;
            console.log(`✅ Uploaded! URL: ${uploadResult.url}`);
            
            // Mark video as complete
            markVideoComplete(channel.id, nextVideo.id);
            
            // Save to generated videos list
            saveGeneratedVideo(channel.id, channel.name, nextVideo, generatedVideo, uploadResult);
          } else {
            console.error(`❌ Upload failed: ${uploadResult.error}`);
            status.errors.push(`Upload failed for "${nextVideo.title}": ${uploadResult.error}`);
          }
        } else {
          console.log(`⚠️ Channel ${channel.name} not ready for upload (no OAuth tokens)`);
          status.errors.push(`${channel.name} needs YouTube OAuth connection`);
        }
      }
      
      status.progress = 100;
      saveStatus(status);
      
      // Small delay between channels
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Update completion status
    status.lastRun = new Date().toISOString();
    status.currentChannel = null;
    status.currentVideo = null;
    status.progress = 0;
    
    // Calculate next run time
    const nextRunTime = calculateNextRunTime(config.postTimes);
    status.nextRun = nextRunTime.toISOString();
    
    saveStatus(status);
    backupAllData();
    
    console.log(`🎉 Auto-pilot cycle complete! Generated: ${status.videosGenerated}, Uploaded: ${status.videosUploaded}`);
    
  } catch (error: any) {
    console.error('❌ Auto-pilot error:', error);
    status.errors.push(error.message || 'Unknown error');
    status.running = config.pauseOnError ? false : true;
    saveStatus(status);
  } finally {
    isProcessing = false;
  }
}

/**
 * Calculate next scheduled run time
 */
function calculateNextRunTime(postTimes: string[]): Date {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  // Find next scheduled time today
  for (const time of postTimes.sort()) {
    const [hour, minute] = time.split(':').map(Number);
    const scheduledMinutes = hour * 60 + minute;
    
    if (scheduledMinutes > currentMinutes) {
      const next = new Date(now);
      next.setHours(hour, minute, 0, 0);
      return next;
    }
  }
  
  // If no more times today, use first time tomorrow
  const [hour, minute] = postTimes[0].split(':').map(Number);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(hour, minute, 0, 0);
  return tomorrow;
}

/**
 * Save generated video to tracking list
 */
function saveGeneratedVideo(
  channelId: string,
  channelName: string,
  plannedVideo: PlannedVideo,
  generatedVideo: any,
  uploadResult: any
): void {
  const videos = JSON.parse(localStorage.getItem('all_generated_videos') || '[]');
  
  videos.push({
    id: generatedVideo.id,
    channelId,
    channelName,
    title: plannedVideo.title,
    description: plannedVideo.description,
    script: plannedVideo.script,
    tags: plannedVideo.tags,
    status: uploadResult.success ? 'uploaded' : 'generated',
    uploadStatus: uploadResult.success ? 'uploaded' : 'pending',
    youtubeUrl: uploadResult.url || null,
    youtubeVideoId: uploadResult.videoId || null,
    estimatedViews: plannedVideo.estimatedViews,
    estimatedRevenue: plannedVideo.estimatedRevenue,
    createdAt: new Date().toISOString(),
    uploadedAt: uploadResult.success ? new Date().toISOString() : null,
    generatedBy: 'autopilot',
  });
  
  localStorage.setItem('all_generated_videos', JSON.stringify(videos));
}

/**
 * Get auto-pilot statistics
 */
export function getAutoPilotStats(): {
  totalVideosGenerated: number;
  totalVideosUploaded: number;
  channelsActive: number;
  videosToday: number;
  estimatedRevenueToday: number;
} {
  const videos = JSON.parse(localStorage.getItem('all_generated_videos') || '[]');
  const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
  
  const today = new Date().toISOString().split('T')[0];
  const todayVideos = videos.filter((v: any) => v.createdAt?.startsWith(today));
  
  return {
    totalVideosGenerated: videos.length,
    totalVideosUploaded: videos.filter((v: any) => v.uploadStatus === 'uploaded').length,
    channelsActive: channels.length,
    videosToday: todayVideos.length,
    estimatedRevenueToday: todayVideos.reduce((sum: number, v: any) => sum + (v.estimatedRevenue || 0), 0),
  };
}

/**
 * Generate content for a specific channel immediately
 */
export async function generateForChannel(channelId: string): Promise<{
  success: boolean;
  video?: PlannedVideo;
  error?: string;
}> {
  const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
  const channel = channels.find((ch: any) => ch.id === channelId);
  
  if (!channel) {
    return { success: false, error: 'Channel not found' };
  }
  
  const nextVideo = getNextVideoForChannel(channelId);
  
  if (!nextVideo) {
    // Generate new plan
    generateChannelPlan(channelId, channel.name, channel.niche || 'tech', channel.subscriberCount || 0);
    const newVideo = getNextVideoForChannel(channelId);
    return { success: true, video: newVideo || undefined };
  }
  
  return { success: true, video: nextVideo };
}

/**
 * Preview what auto-pilot will do next
 */
export function previewNextActions(): {
  channelId: string;
  channelName: string;
  nextVideo: PlannedVideo | null;
}[] {
  const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
  
  return channels.map((channel: any) => ({
    channelId: channel.id,
    channelName: channel.name,
    nextVideo: getNextVideoForChannel(channel.id),
  }));
}
