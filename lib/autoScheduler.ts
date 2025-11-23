/**
 * ⏰ AUTO-SCHEDULER - Background Job System
 * Automatically generates videos on schedule without user intervention
 * 
 * FEATURES:
 * - Runs in background (browser tab open)
 * - Checks every hour for scheduled videos
 * - Auto-generates when due
 * - Persists across page refreshes
 * - Stops when monetization achieved
 */

import { autoGenerateNextScheduledVideo, calculateMonetizationProgress, type VideoGenerationPlan } from './autonomousVideoSystem';
import { getSafeChannels } from './dataProtection';

let schedulerInterval: NodeJS.Timeout | null = null;
let isSchedulerRunning = false;

/**
 * 🚀 START AUTO-SCHEDULER
 * Call this on app startup to enable background video generation
 */
export function startAutoScheduler() {
  if (isSchedulerRunning) {
    console.log('⚠️ Scheduler already running');
    return;
  }

  console.log('🚀 Starting Auto-Scheduler...');
  isSchedulerRunning = true;

  // Check every hour for scheduled videos
  schedulerInterval = setInterval(async () => {
    await checkAndGenerateScheduledVideos();
  }, 60 * 60 * 1000); // 1 hour

  // Also check immediately on start
  checkAndGenerateScheduledVideos();

  // Save scheduler state
  localStorage.setItem('scheduler_enabled', 'true');
  localStorage.setItem('scheduler_last_start', new Date().toISOString());
}

/**
 * 🛑 STOP AUTO-SCHEDULER
 */
export function stopAutoScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
  isSchedulerRunning = false;
  localStorage.setItem('scheduler_enabled', 'false');
  console.log('🛑 Auto-Scheduler stopped');
}

/**
 * 🔍 CHECK AND GENERATE SCHEDULED VIDEOS
 */
async function checkAndGenerateScheduledVideos() {
  console.log('🔍 Checking for scheduled videos...');
  
  const channels = getSafeChannels();
  const now = new Date();

  for (const channel of channels) {
    try {
      // Check monetization status
      const progress = calculateMonetizationProgress({
        id: channel.id,
        subscriberCount: channel.subscriberCount || 0
      });

      // Skip if already monetized
      if (progress.status === 'monetized') {
        console.log(`✅ ${channel.name} already monetized - skipping`);
        continue;
      }

      // Get video plan
      const planData = localStorage.getItem(`video_plan_${channel.id}`);
      if (!planData) continue;

      const plan: VideoGenerationPlan = JSON.parse(planData);

      // Find next scheduled video that's due
      const dueVideos = plan.videoQueue.filter(v => {
        if (v.status !== 'planned') return false;
        const scheduledDate = new Date(v.scheduledDate);
        return scheduledDate <= now;
      });

      if (dueVideos.length > 0) {
        console.log(`🎬 Found ${dueVideos.length} videos due for ${channel.name}`);
        
        // Generate the highest priority video
        const success = await autoGenerateNextScheduledVideo(channel.id);
        
        if (success) {
          console.log(`✅ Auto-generated video for ${channel.name}`);
          
          // Send notification
          showNotification(`🎬 New video generated for ${channel.name}!`, 'success');
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${channel.name}:`, error);
    }
  }

  // Update last check time
  localStorage.setItem('scheduler_last_check', new Date().toISOString());
}

/**
 * 📊 GET SCHEDULER STATUS
 */
export function getSchedulerStatus() {
  const enabled = localStorage.getItem('scheduler_enabled') === 'true';
  const lastStart = localStorage.getItem('scheduler_last_start');
  const lastCheck = localStorage.getItem('scheduler_last_check');

  return {
    isRunning: isSchedulerRunning,
    enabled,
    lastStart: lastStart ? new Date(lastStart) : null,
    lastCheck: lastCheck ? new Date(lastCheck) : null,
    nextCheck: isSchedulerRunning ? new Date(Date.now() + 60 * 60 * 1000) : null
  };
}

/**
 * 🔔 SHOW NOTIFICATION
 */
function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
  // Browser notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('AI YouTube Agency', {
      body: message,
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    });
  }

  // In-app notification (localStorage for other tabs to read)
  const notifications = JSON.parse(localStorage.getItem('app_notifications') || '[]');
  notifications.push({
    id: Date.now(),
    message,
    type,
    timestamp: new Date().toISOString(),
    read: false
  });
  
  // Keep only last 50 notifications
  if (notifications.length > 50) {
    notifications.shift();
  }
  
  localStorage.setItem('app_notifications', JSON.stringify(notifications));
}

/**
 * 🔔 REQUEST NOTIFICATION PERMISSION
 */
export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('✅ Notification permission granted');
        showNotification('Auto-scheduler notifications enabled!', 'success');
      }
    });
  }
}

/**
 * 🔄 MANUAL TRIGGER - Generate all due videos now
 */
export async function generateAllDueVideos() {
  console.log('🔄 Manually triggering all due videos...');
  await checkAndGenerateScheduledVideos();
  return true;
}

/**
 * 📅 GET NEXT SCHEDULED GENERATION TIMES
 */
export function getUpcomingGenerations() {
  const channels = getSafeChannels();
  const upcoming: Array<{
    channelName: string;
    videoTitle: string;
    scheduledDate: Date;
    priority: string;
  }> = [];

  for (const channel of channels) {
    const planData = localStorage.getItem(`video_plan_${channel.id}`);
    if (!planData) continue;

    const plan: VideoGenerationPlan = JSON.parse(planData);
    const plannedVideos = plan.videoQueue.filter(v => v.status === 'planned');

    for (const video of plannedVideos.slice(0, 5)) { // Next 5 per channel
      upcoming.push({
        channelName: channel.name,
        videoTitle: video.title,
        scheduledDate: new Date(video.scheduledDate),
        priority: video.priority
      });
    }
  }

  // Sort by date
  upcoming.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());

  return upcoming.slice(0, 20); // Return next 20 total
}
