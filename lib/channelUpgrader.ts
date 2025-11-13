/**
 * 🔄 AUTO-UPGRADE SYSTEM
 * Automatically upgrades existing channels with new features:
 * - AI-selected perfect voice
 * - First video generation
 * - Enhanced metadata
 */

import { selectPerfectVoice, getVoiceSelectionReason } from './voiceLibrary';
import { generateFirstVideoForAllChannels } from './firstVideoGenerator';

export async function upgradeExistingChannels() {
  const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
  
  if (channels.length === 0) {
    return { upgraded: 0, message: 'No channels to upgrade' };
  }

  let upgraded = 0;
  const upgradedChannels = channels.map((channel: any) => {
    let needsUpgrade = false;
    const upgradedChannel = { ...channel };

    // Add voice if missing
    if (!channel.voiceId) {
      const perfectVoice = selectPerfectVoice({
        niche: channel.niche || '',
        description: channel.description || '',
        targetAudience: 'General',
        targetCountry: 'US'
      });
      
      upgradedChannel.voiceId = perfectVoice.id;
      needsUpgrade = true;
      
      console.log(`✅ Added voice "${perfectVoice.name}" to channel "${channel.name}"`);
    }

    // Add default niche if missing
    if (!channel.niche) {
      upgradedChannel.niche = 'General Content';
      needsUpgrade = true;
    }

    // Add timestamp if missing
    if (!channel.createdAt) {
      upgradedChannel.createdAt = new Date().toISOString();
      needsUpgrade = true;
    }

    if (needsUpgrade) {
      upgraded++;
    }

    return upgradedChannel;
  });

  if (upgraded > 0) {
    // Save upgraded channels
    localStorage.setItem('youtube_channels', JSON.stringify(upgradedChannels));
    
    // Add notification
    const notification = {
      id: Date.now().toString(),
      type: 'success',
      message: `🎉 Upgraded ${upgraded} channel(s) with new AI features! Perfect voices selected automatically.`,
      timestamp: new Date()
    };
    
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify([notification, ...notifications]));

    // Generate first videos for channels that don't have any
    setTimeout(() => {
      generateFirstVideoForAllChannels();
    }, 2000);
  }

  return {
    upgraded,
    total: channels.length,
    message: upgraded > 0 
      ? `Successfully upgraded ${upgraded} of ${channels.length} channels with new features!`
      : 'All channels are already up to date!'
  };
}

/**
 * Check if upgrade is needed
 */
export function needsUpgrade(): boolean {
  const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
  
  return channels.some((channel: any) => 
    !channel.voiceId || !channel.niche || !channel.createdAt
  );
}

/**
 * Get upgrade status
 */
export function getUpgradeStatus() {
  const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
  
  const channelsNeedingVoice = channels.filter((ch: any) => !ch.voiceId).length;
  const channelsNeedingNiche = channels.filter((ch: any) => !ch.niche).length;
  const channelsNeedingVideo = channels.filter((ch: any) => {
    const videos = JSON.parse(localStorage.getItem(`videos_${ch.id}`) || '[]');
    return videos.length === 0;
  }).length;

  return {
    totalChannels: channels.length,
    needsVoiceUpgrade: channelsNeedingVoice,
    needsNicheUpgrade: channelsNeedingNiche,
    needsFirstVideo: channelsNeedingVideo,
    needsAnyUpgrade: channelsNeedingVoice > 0 || channelsNeedingNiche > 0
  };
}
