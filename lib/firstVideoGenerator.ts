/**
 * 🎬 FIRST VIDEO GENERATOR
 * Automatically creates the first video for every connected channel
 */

import { MultiAIGenerator } from './multi-ai-generator';

export async function generateFirstVideoForAllChannels() {
  const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
  
  if (channels.length === 0) {
    console.log('No channels connected yet');
    return { success: false, message: 'No channels to generate videos for' };
  }

  const results = [];
  
  for (const channel of channels) {
    try {
      // Check if channel already has a video
      const existingVideos = JSON.parse(localStorage.getItem(`videos_${channel.id}`) || '[]');
      
      if (existingVideos.length > 0) {
        console.log(`Channel ${channel.name} already has videos, skipping...`);
        results.push({
          channelId: channel.id,
          channelName: channel.name,
          status: 'skipped',
          reason: 'Already has videos'
        });
        continue;
      }

      console.log(`Generating first video for ${channel.name}...`);
      
      // Generate video using the channel's description and niche
      const niche = channel.niche || 'General Content';
      const voiceId = channel.voiceId || 'dark-narrator-male';
      
      // Create compelling first video topic based on niche
      const firstVideoTopics: Record<string, string> = {
        'Tech Reviews': 'Top 5 Must-Have Tech Gadgets in 2025',
        'Gaming': 'Best Games You NEED to Play Right Now',
        'Finance': 'How to Make $1000/Month Passive Income (Beginner Friendly)',
        'Education': 'Master This Skill in 30 Days - Complete Roadmap',
        'Entertainment': 'Shocking Facts You Didn\'t Know About [Topic]',
        'Health & Fitness': '30-Day Transformation Challenge - Day 1',
        'Business': 'How I Built a 6-Figure Business from Scratch',
        'Lifestyle': 'My Morning Routine for Maximum Productivity',
        'Cooking': 'Ultimate Guide to Cooking Like a Pro',
        'Travel': 'Hidden Gems You Must Visit in 2025'
      };
      
      const topic = firstVideoTopics[niche] || `The Ultimate ${niche} Guide for Beginners`;
      
      // Generate the video
      const generator = new MultiAIGenerator();
      const script = await generator.generateScript(topic, niche);
      
      const video = {
        id: Date.now().toString() + Math.random(),
        channelId: channel.id,
        title: script.title,
        description: script.description,
        script: script.script,
        tags: script.tags,
        status: 'completed',
        voiceId: voiceId,
        targetCountry: 'US',
        estimatedCPM: 45,
        createdAt: new Date().toISOString(),
        thumbnailUrl: `https://via.placeholder.com/1280x720/667eea/ffffff?text=${encodeURIComponent(script.title.substring(0, 30))}`
      };
      
      // Save video
      const videos = [video];
      localStorage.setItem(`videos_${channel.id}`, JSON.stringify(videos));
      
      // Add to activity feed
      const activity = {
        id: Date.now().toString() + Math.random(),
        type: 'video_generated',
        channelName: channel.name,
        message: `First video created: "${topic}"`,
        timestamp: new Date().toISOString()
      };
      
      const activities = JSON.parse(localStorage.getItem('activity_feed') || '[]');
      localStorage.setItem('activity_feed', JSON.stringify([activity, ...activities]));
      
      results.push({
        channelId: channel.id,
        channelName: channel.name,
        status: 'success',
        videoTopic: topic,
        videoId: video.id
      });
      
      console.log(`✅ First video created for ${channel.name}`);
      
    } catch (error) {
      console.error(`Error generating video for ${channel.name}:`, error);
      results.push({
        channelId: channel.id,
        channelName: channel.name,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  // Save generation log
  const log = {
    timestamp: new Date().toISOString(),
    totalChannels: channels.length,
    successful: results.filter(r => r.status === 'success').length,
    skipped: results.filter(r => r.status === 'skipped').length,
    failed: results.filter(r => r.status === 'error').length,
    results: results
  };
  
  localStorage.setItem('first_video_generation_log', JSON.stringify(log));
  
  return {
    success: true,
    ...log
  };
}

export function getFirstVideoGenerationStatus() {
  const log = localStorage.getItem('first_video_generation_log');
  if (!log) return null;
  
  return JSON.parse(log);
}

// Auto-generate first videos when channels are connected
export function enableAutoFirstVideoGeneration() {
  // Check every 30 seconds if there are channels without videos
  setInterval(async () => {
    const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
    
    for (const channel of channels) {
      const videos = JSON.parse(localStorage.getItem(`videos_${channel.id}`) || '[]');
      
      if (videos.length === 0) {
        console.log(`Auto-generating first video for ${channel.name}...`);
        
        try {
          await generateFirstVideoForAllChannels();
        } catch (error) {
          console.error('Auto-generation error:', error);
        }
        
        break; // Process one channel at a time
      }
    }
  }, 30000); // Check every 30 seconds
}
