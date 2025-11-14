/**
 * 📢 CONNECTED CHANNELS PERSISTENCE
 * Channels stay connected even after code changes
 * localStorage keeps your connections safe
 */

export interface ConnectedChannel {
  id: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'twitter';
  name: string;
  handle: string;
  subscribers: number;
  avatar: string;
  connectedAt: string;
  accessToken: string; // Encrypted in production
  refreshToken: string; // Encrypted in production
  tokenExpiry: string;
  isActive: boolean;
}

const STORAGE_KEY = 'connected_channels';

/**
 * Save connected channels (persists across sessions)
 */
export function saveConnectedChannels(channels: ConnectedChannel[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(channels));
    console.log('✅ Channels saved:', channels.length);
  } catch (error) {
    console.error('❌ Failed to save channels:', error);
  }
}

/**
 * Load connected channels (survives page refreshes & code updates)
 */
export function loadConnectedChannels(): ConnectedChannel[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const channels = JSON.parse(stored) as ConnectedChannel[];
    console.log('✅ Channels loaded:', channels.length);
    return channels.filter(ch => ch.isActive);
  } catch (error) {
    console.error('❌ Failed to load channels:', error);
    return [];
  }
}

/**
 * Add a new channel connection
 */
export function addChannel(channel: Omit<ConnectedChannel, 'id' | 'connectedAt' | 'isActive'>): ConnectedChannel {
  const newChannel: ConnectedChannel = {
    ...channel,
    id: `${channel.platform}_${Date.now()}`,
    connectedAt: new Date().toISOString(),
    isActive: true
  };
  
  const channels = loadConnectedChannels();
  channels.push(newChannel);
  saveConnectedChannels(channels);
  
  return newChannel;
}

/**
 * Remove a channel connection
 */
export function removeChannel(channelId: string): void {
  const channels = loadConnectedChannels();
  const updated = channels.filter(ch => ch.id !== channelId);
  saveConnectedChannels(updated);
}

/**
 * Update channel tokens (refresh when expired)
 */
export function updateChannelTokens(
  channelId: string, 
  accessToken: string, 
  refreshToken: string, 
  expiresIn: number
): void {
  const channels = loadConnectedChannels();
  const channel = channels.find(ch => ch.id === channelId);
  
  if (channel) {
    channel.accessToken = accessToken;
    channel.refreshToken = refreshToken;
    channel.tokenExpiry = new Date(Date.now() + expiresIn * 1000).toISOString();
    saveConnectedChannels(channels);
  }
}

/**
 * Check if any tokens need refresh
 */
export function getExpiredChannels(): ConnectedChannel[] {
  const channels = loadConnectedChannels();
  const now = new Date().getTime();
  
  return channels.filter(ch => {
    const expiry = new Date(ch.tokenExpiry).getTime();
    return expiry - now < 3600000; // Less than 1 hour until expiry
  });
}

/**
 * Get channels by platform
 */
export function getChannelsByPlatform(platform: string): ConnectedChannel[] {
  const channels = loadConnectedChannels();
  return channels.filter(ch => ch.platform === platform);
}

/**
 * Check if platform is connected
 */
export function isPlatformConnected(platform: string): boolean {
  return getChannelsByPlatform(platform).length > 0;
}

/**
 * Get total subscribers across all platforms
 */
export function getTotalSubscribers(): number {
  const channels = loadConnectedChannels();
  return channels.reduce((total, ch) => total + ch.subscribers, 0);
}

/**
 * Export all channel data (for backup)
 */
export function exportChannelData(): string {
  const channels = loadConnectedChannels();
  return JSON.stringify(channels, null, 2);
}

/**
 * Import channel data (from backup)
 */
export function importChannelData(jsonData: string): void {
  try {
    const channels = JSON.parse(jsonData) as ConnectedChannel[];
    saveConnectedChannels(channels);
    console.log('✅ Channels imported:', channels.length);
  } catch (error) {
    console.error('❌ Failed to import channels:', error);
  }
}

/**
 * Clear all connections (logout)
 */
export function clearAllChannels(): void {
  localStorage.removeItem(STORAGE_KEY);
  console.log('🗑️ All channels cleared');
}
