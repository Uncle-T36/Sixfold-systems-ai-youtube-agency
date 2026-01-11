/**
 * 🚀 AUTO MULTI-CHANNEL UPLOADER
 * Automatically uploads .webm videos to ALL connected YouTube channels
 * 
 * Features:
 * - Upload to multiple channels simultaneously
 * - Queue management for rate limiting
 * - Progress tracking per channel
 * - Automatic retry on failure
 * - Schedule uploads for optimal times
 */

import { uploadVideoToYouTube, VideoMetadata, UploadResult, ConnectedChannel } from './youtube-uploader';

// Re-export ConnectedChannel for use in other files
export type { ConnectedChannel };

export interface MultiChannelUploadJob {
  id: string;
  videoBlob: Blob;
  metadata: VideoMetadata;
  channels: string[]; // Channel IDs to upload to
  createdAt: Date;
  status: 'pending' | 'uploading' | 'completed' | 'partial' | 'failed';
  results: ChannelUploadResult[];
}

export interface ChannelUploadResult {
  channelId: string;
  channelName: string;
  status: 'pending' | 'uploading' | 'success' | 'failed';
  videoId?: string;
  videoUrl?: string;
  error?: string;
  uploadedAt?: Date;
}

export interface UploadProgress {
  totalChannels: number;
  completed: number;
  successful: number;
  failed: number;
  currentChannel?: string;
  overallProgress: number; // 0-100
}

/**
 * Get all connected YouTube channels from storage
 */
export function getAllConnectedChannels(): ConnectedChannel[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
    // Filter only channels that are properly connected with OAuth
    return channels.filter((ch: ConnectedChannel) => ch.youtubeLinked && ch.accessToken);
  } catch {
    return [];
  }
}

/**
 * Get all channels (connected or not) for display
 */
export function getAllChannels(): ConnectedChannel[] {
  if (typeof window === 'undefined') return [];
  
  try {
    return JSON.parse(localStorage.getItem('youtube_channels') || '[]');
  } catch {
    return [];
  }
}

/**
 * Check if we have any connected channels ready for upload
 */
export function hasConnectedChannels(): boolean {
  return getAllConnectedChannels().length > 0;
}

/**
 * 🎬 UPLOAD TO ALL CHANNELS
 * Main function to upload video to all connected channels
 */
export async function uploadToAllChannels(
  videoBlob: Blob,
  metadata: VideoMetadata,
  onProgress?: (progress: UploadProgress) => void,
  specificChannels?: string[] // Optional: only upload to specific channels
): Promise<MultiChannelUploadJob> {
  const channels = specificChannels 
    ? getAllConnectedChannels().filter(ch => specificChannels.includes(ch.id))
    : getAllConnectedChannels();

  if (channels.length === 0) {
    throw new Error('No connected channels found. Please connect your YouTube channels at /connect first.');
  }

  // Create upload job
  const job: MultiChannelUploadJob = {
    id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    videoBlob,
    metadata,
    channels: channels.map(ch => ch.id),
    createdAt: new Date(),
    status: 'uploading',
    results: channels.map(ch => ({
      channelId: ch.id,
      channelName: ch.name,
      status: 'pending' as const
    }))
  };

  // Track progress
  const progress: UploadProgress = {
    totalChannels: channels.length,
    completed: 0,
    successful: 0,
    failed: 0,
    overallProgress: 0
  };

  // Upload to each channel sequentially (to avoid rate limits)
  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    const resultIndex = job.results.findIndex(r => r.channelId === channel.id);
    
    // Update progress
    progress.currentChannel = channel.name;
    progress.overallProgress = Math.round((i / channels.length) * 100);
    onProgress?.(progress);
    
    // Mark as uploading
    job.results[resultIndex].status = 'uploading';
    
    try {
      // Upload to this channel
      const result = await uploadVideoToYouTube(channel.id, videoBlob, metadata);
      
      if (result.success) {
        job.results[resultIndex] = {
          ...job.results[resultIndex],
          status: 'success',
          videoId: result.videoId,
          videoUrl: result.url,
          uploadedAt: new Date()
        };
        progress.successful++;
      } else {
        job.results[resultIndex] = {
          ...job.results[resultIndex],
          status: 'failed',
          error: result.error || 'Upload failed'
        };
        progress.failed++;
      }
    } catch (error) {
      job.results[resultIndex] = {
        ...job.results[resultIndex],
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      progress.failed++;
    }
    
    progress.completed++;
    
    // Small delay between uploads to respect rate limits
    if (i < channels.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Update final status
  progress.overallProgress = 100;
  progress.currentChannel = undefined;
  onProgress?.(progress);
  
  // Determine overall job status
  if (progress.successful === progress.totalChannels) {
    job.status = 'completed';
  } else if (progress.successful > 0) {
    job.status = 'partial';
  } else {
    job.status = 'failed';
  }

  // Save upload history
  saveUploadHistory(job);
  
  return job;
}

/**
 * 🔄 UPLOAD WITH AUTO-RETRY
 * Uploads with automatic retry for failed channels
 */
export async function uploadWithRetry(
  videoBlob: Blob,
  metadata: VideoMetadata,
  maxRetries: number = 3,
  onProgress?: (progress: UploadProgress) => void
): Promise<MultiChannelUploadJob> {
  let job = await uploadToAllChannels(videoBlob, metadata, onProgress);
  let retryCount = 0;
  
  // Retry failed channels
  while (retryCount < maxRetries && job.results.some(r => r.status === 'failed')) {
    retryCount++;
    const failedChannels = job.results
      .filter(r => r.status === 'failed')
      .map(r => r.channelId);
    
    if (failedChannels.length === 0) break;
    
    console.log(`🔄 Retry ${retryCount}/${maxRetries} for ${failedChannels.length} failed channels`);
    
    // Wait before retry (exponential backoff)
    await new Promise(resolve => setTimeout(resolve, 5000 * retryCount));
    
    // Retry only failed channels
    const retryJob = await uploadToAllChannels(
      videoBlob, 
      metadata, 
      onProgress, 
      failedChannels
    );
    
    // Update results for retried channels
    for (const result of retryJob.results) {
      const idx = job.results.findIndex(r => r.channelId === result.channelId);
      if (idx !== -1) {
        job.results[idx] = result;
      }
    }
    
    // Update job status
    const successful = job.results.filter(r => r.status === 'success').length;
    if (successful === job.channels.length) {
      job.status = 'completed';
      break;
    } else if (successful > 0) {
      job.status = 'partial';
    }
  }
  
  return job;
}

/**
 * 📅 SCHEDULE UPLOAD FOR OPTIMAL TIME
 * Schedule video upload for the best time across all channels
 */
export interface ScheduledUpload {
  id: string;
  videoBlob: Blob;
  metadata: VideoMetadata;
  scheduledTime: Date;
  channels: string[];
  status: 'scheduled' | 'uploading' | 'completed' | 'cancelled';
}

const scheduledUploads: Map<string, ScheduledUpload> = new Map();

export function scheduleUploadForOptimalTime(
  videoBlob: Blob,
  metadata: VideoMetadata,
  preferredHour?: number // 0-23, optional
): ScheduledUpload {
  // Calculate optimal upload time (typically 2-3 PM local time for engagement)
  const now = new Date();
  const optimalHour = preferredHour ?? 14; // 2 PM default
  
  let scheduledTime = new Date(now);
  scheduledTime.setHours(optimalHour, 0, 0, 0);
  
  // If the time has passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const scheduled: ScheduledUpload = {
    id: `scheduled_${Date.now()}`,
    videoBlob,
    metadata,
    scheduledTime,
    channels: getAllConnectedChannels().map(ch => ch.id),
    status: 'scheduled'
  };
  
  scheduledUploads.set(scheduled.id, scheduled);
  
  // Set timer to upload at scheduled time
  const delay = scheduledTime.getTime() - now.getTime();
  setTimeout(async () => {
    const upload = scheduledUploads.get(scheduled.id);
    if (upload && upload.status === 'scheduled') {
      upload.status = 'uploading';
      await uploadToAllChannels(upload.videoBlob, upload.metadata);
      upload.status = 'completed';
    }
  }, delay);
  
  return scheduled;
}

export function cancelScheduledUpload(uploadId: string): boolean {
  const upload = scheduledUploads.get(uploadId);
  if (upload && upload.status === 'scheduled') {
    upload.status = 'cancelled';
    scheduledUploads.delete(uploadId);
    return true;
  }
  return false;
}

export function getScheduledUploads(): ScheduledUpload[] {
  return Array.from(scheduledUploads.values()).filter(u => u.status === 'scheduled');
}

/**
 * 📊 UPLOAD HISTORY
 * Track all uploads for analytics
 */
export interface UploadHistoryEntry {
  id: string;
  title: string;
  uploadedAt: Date;
  channels: {
    id: string;
    name: string;
    videoId?: string;
    success: boolean;
  }[];
  totalChannels: number;
  successfulUploads: number;
}

export function saveUploadHistory(job: MultiChannelUploadJob): void {
  if (typeof window === 'undefined') return;
  
  try {
    const history: UploadHistoryEntry[] = JSON.parse(
      localStorage.getItem('upload_history') || '[]'
    );
    
    const entry: UploadHistoryEntry = {
      id: job.id,
      title: job.metadata.title,
      uploadedAt: new Date(),
      channels: job.results.map(r => ({
        id: r.channelId,
        name: r.channelName,
        videoId: r.videoId,
        success: r.status === 'success'
      })),
      totalChannels: job.channels.length,
      successfulUploads: job.results.filter(r => r.status === 'success').length
    };
    
    history.unshift(entry);
    
    // Keep last 100 entries
    if (history.length > 100) {
      history.splice(100);
    }
    
    localStorage.setItem('upload_history', JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save upload history:', error);
  }
}

export function getUploadHistory(): UploadHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  
  try {
    return JSON.parse(localStorage.getItem('upload_history') || '[]');
  } catch {
    return [];
  }
}

/**
 * 🎯 QUICK UPLOAD HELPERS
 */

// Upload the generated video immediately to all channels
export async function quickUploadToAllChannels(
  videoBlob: Blob,
  title: string,
  description: string,
  tags: string[] = [],
  onProgress?: (progress: UploadProgress) => void
): Promise<MultiChannelUploadJob> {
  const metadata: VideoMetadata = {
    title,
    description,
    tags,
    categoryId: '22', // People & Blogs (good for general content)
    privacyStatus: 'public' // Make it public immediately
  };
  
  return uploadToAllChannels(videoBlob, metadata, onProgress);
}

// Check connection status summary
export function getConnectionSummary(): {
  totalChannels: number;
  connectedChannels: number;
  needsConnection: number;
  channelNames: string[];
} {
  const all = getAllChannels();
  const connected = getAllConnectedChannels();
  
  return {
    totalChannels: all.length,
    connectedChannels: connected.length,
    needsConnection: all.length - connected.length,
    channelNames: connected.map(ch => ch.name)
  };
}

/**
 * 🔗 DEMO: Add test channels for development
 */
export function addDemoChannels(): void {
  if (typeof window === 'undefined') return;
  
  const demoChannels: ConnectedChannel[] = [
    {
      id: 'UC_demo_channel_1',
      name: 'Main Channel',
      youtubeLinked: true,
      accessToken: 'demo_token_1'
    },
    {
      id: 'UC_demo_channel_2', 
      name: 'Second Channel',
      youtubeLinked: true,
      accessToken: 'demo_token_2'
    },
    {
      id: 'UC_demo_channel_3',
      name: 'Clips Channel',
      youtubeLinked: true,
      accessToken: 'demo_token_3'
    }
  ];
  
  localStorage.setItem('youtube_channels', JSON.stringify(demoChannels));
  console.log('✅ Demo channels added for testing');
}
