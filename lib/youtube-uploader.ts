/**
 * 🎬 Real YouTube Uploader with OAuth Integration
 * Uploads videos to user's connected YouTube channels
 */

export interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
  categoryId?: string;
  privacyStatus?: 'public' | 'unlisted' | 'private';
  thumbnail?: string;
}

export interface UploadResult {
  success: boolean;
  videoId?: string;
  url?: string;
  error?: string;
  message?: string;
}

export interface ConnectedChannel {
  id: string;
  name: string;
  accessToken?: string;
  refreshToken?: string;
  youtubeLinked?: boolean;
}

/**
 * Get connected channel credentials from localStorage
 */
function getChannelCredentials(channelId: string): ConnectedChannel | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
    return channels.find((ch: ConnectedChannel) => ch.id === channelId) || null;
  } catch {
    return null;
  }
}

/**
 * Update channel credentials in localStorage
 */
function updateChannelCredentials(channelId: string, updates: Partial<ConnectedChannel>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
    const idx = channels.findIndex((ch: ConnectedChannel) => ch.id === channelId);
    if (idx !== -1) {
      channels[idx] = { ...channels[idx], ...updates };
      localStorage.setItem('youtube_channels', JSON.stringify(channels));
    }
  } catch (error) {
    console.error('Failed to update channel credentials:', error);
  }
}

/**
 * Refresh access token if expired
 */
async function refreshAccessTokenIfNeeded(channel: ConnectedChannel): Promise<string | null> {
  if (!channel.refreshToken) {
    return channel.accessToken || null;
  }

  try {
    const response = await fetch('/api/youtube/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken: channel.refreshToken,
        channelId: channel.id,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      if (error.requiresReconnect) {
        console.warn('⚠️ Token expired, user needs to reconnect');
        return null;
      }
      return channel.accessToken || null;
    }

    const data = await response.json();
    
    // Update stored credentials with new token
    updateChannelCredentials(channel.id, {
      accessToken: data.accessToken,
      ...(data.refreshToken && { refreshToken: data.refreshToken }),
    });

    console.log('✅ Access token refreshed successfully');
    return data.accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return channel.accessToken || null;
  }
}

/**
 * Upload video to YouTube using the connected channel's OAuth tokens
 */
export async function uploadVideoToYouTube(
  channelId: string,
  videoData: string | Blob, // Base64 string or Blob
  metadata: VideoMetadata
): Promise<UploadResult> {
  try {
    const channel = getChannelCredentials(channelId);
    
    if (!channel) {
      return {
        success: false,
        error: 'Channel not found. Please connect your channel at /connect'
      };
    }

    if (!channel.youtubeLinked || !channel.accessToken) {
      return {
        success: false,
        error: 'Channel not authenticated. Please reconnect at /connect with YouTube OAuth'
      };
    }

    // Try to refresh token before upload
    const accessToken = await refreshAccessTokenIfNeeded(channel);
    if (!accessToken) {
      return {
        success: false,
        error: 'Access token expired. Please reconnect your channel at /connect'
      };
    }

    // Convert Blob to base64 if needed
    let base64Data: string;
    if (videoData instanceof Blob) {
      base64Data = await blobToBase64(videoData);
    } else {
      base64Data = videoData;
    }

    // Call the upload API
    const response = await fetch('/api/youtube/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: accessToken,
        refreshToken: channel.refreshToken,
        channelId: channel.id,
        title: metadata.title,
        description: metadata.description,
        tags: metadata.tags,
        categoryId: metadata.categoryId || '22',
        privacyStatus: metadata.privacyStatus || 'private',
        videoData: base64Data,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || result.message || 'Upload failed',
      };
    }

    console.log('✅ Video uploaded to YouTube:', result);
    
    return {
      success: true,
      videoId: result.videoId,
      url: result.url,
      message: result.message,
    };

  } catch (error) {
    console.error('❌ YouTube upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Convert Blob to base64 string
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      // Remove data URL prefix if present
      const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Batch upload multiple videos to YouTube
 */
export async function uploadBatchToYouTube(
  channelId: string,
  videos: Array<{ videoData: string | Blob; metadata: VideoMetadata }>
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];
  
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    console.log(`📤 Uploading video ${i + 1}/${videos.length}: ${video.metadata.title}`);
    
    const result = await uploadVideoToYouTube(channelId, video.videoData, video.metadata);
    results.push(result);
    
    // Add delay between uploads to respect rate limits
    if (i < videos.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  return results;
}

/**
 * Check if a channel is properly connected with upload permissions
 */
export function isChannelReadyForUpload(channelId: string): { ready: boolean; reason?: string } {
  const channel = getChannelCredentials(channelId);
  
  if (!channel) {
    return { ready: false, reason: 'Channel not found in connected channels' };
  }
  
  if (!channel.youtubeLinked) {
    return { ready: false, reason: 'Channel not linked via YouTube OAuth' };
  }
  
  if (!channel.accessToken) {
    return { ready: false, reason: 'Missing access token - please reconnect' };
  }
  
  return { ready: true };
}

// Legacy compatibility exports
export class YouTubeUploader {
  private channelId: string;

  constructor(apiKey: string, channelId: string) {
    this.channelId = channelId;
  }

  async uploadVideo(videoPath: string, metadata: VideoMetadata): Promise<UploadResult> {
    // For legacy compatibility - fetch video from path and upload
    console.warn('Legacy uploadVideo called - use uploadVideoToYouTube instead');
    return uploadVideoToYouTube(this.channelId, '', metadata);
  }

  async uploadBatch(videos: Array<{ path: string; metadata: VideoMetadata }>): Promise<UploadResult[]> {
    return uploadBatchToYouTube(
      this.channelId,
      videos.map(v => ({ videoData: '', metadata: v.metadata }))
    );
  }
}
