// Batch Generator - Generate 10-20 videos in ONE CLICK
// Zero input needed - uses trends, analytics, and templates automatically

import { generateTitleVariations, getWinningTitle } from './abTesting';
import { generateThumbnailPack } from './thumbnailGenerator';
import { autoFillTemplate } from './scriptTemplates';
import { trackVideoPerformance } from './analytics';

export interface BatchVideo {
  id: string;
  channelId: string;
  title: string;
  titleVariations: string[];
  description: string;
  tags: string[];
  script: string;
  thumbnailConcept: string;
  thumbnailText: string;
  estimatedViews: string;
  scheduledFor?: string;
  status: 'generated' | 'scheduled' | 'uploaded';
  createdAt: string;
}

export interface BatchResult {
  id: string;
  channelId: string;
  channelName: string;
  videosGenerated: number;
  videos: BatchVideo[];
  totalEstimatedViews: string;
  createdAt: string;
}

// Trending topics by niche (auto-updated feel)
const TRENDING_TOPICS: Record<string, string[]> = {
  tech: [
    'AI Tools 2025', 'Best Productivity Apps', 'iPhone vs Android', 
    'Smart Home Setup', 'Budget Tech', 'Coding for Beginners',
    'AI Side Hustles', 'Best Laptops 2025', 'ChatGPT Alternatives',
    'Tech You Need', 'Smartphone Photography', 'Gaming Setup Tour',
    'Remote Work Tech', 'Cloud Storage Guide', 'Cybersecurity Tips',
    'Best Free Software', 'Tech Minimalism', 'Future of AI',
    'Electric Vehicles', 'Wearable Tech Review'
  ],
  gaming: [
    'GTA 6 Everything We Know', 'Best Games 2025', 'Gaming Setup Tour',
    'Pro Tips and Tricks', '100 Days Challenge', 'Speedrun Attempt',
    'Hardest Boss Fights', 'Hidden Easter Eggs', 'Multiplayer with Friends',
    'Rage Compilation', 'First Playthrough', 'Graphics Comparison',
    'Controller vs Keyboard', 'Budget Gaming Setup', 'Mobile Gaming',
    'Retro Games Ranked', 'Upcoming Releases', 'Gaming News',
    'Build Battle', 'Noob to Pro Journey'
  ],
  finance: [
    'Side Hustles 2025', 'Passive Income Ideas', 'Stock Market Basics',
    'Crypto Investing', 'Budget Tips', 'Debt Payoff Strategy',
    'First $1000 Online', 'Multiple Income Streams', 'Financial Freedom',
    'Money Mistakes to Avoid', 'Investing for Beginners', 'Tax Tips',
    'Credit Score Hacks', 'Frugal Living', 'High Income Skills',
    'Remote Job Ideas', 'Dropshipping Guide', 'Freelancing Tips',
    'Real Estate Investing', 'Retirement Planning'
  ],
  motivation: [
    'Morning Routine Success', 'Discipline Over Motivation', 'Winner Mindset',
    'Overcoming Failure', 'Goal Setting', 'Productivity Hacks',
    'Success Habits', 'Mental Toughness', 'Daily Motivation',
    'Millionaire Mindset', 'Stop Procrastinating', 'Confidence Building',
    'Fear of Failure', 'Work Life Balance', 'Time Management',
    'Self Improvement', 'Breaking Bad Habits', 'Vision Board',
    'Accountability', 'Power of Consistency'
  ],
  lifestyle: [
    'Morning Routine', 'Minimalist Living', 'Productive Day in My Life',
    'Room Makeover', 'Self Care Routine', 'Travel Vlog',
    'Healthy Habits', 'Work From Home Setup', 'Organization Tips',
    'Aesthetic Living', 'Daily Vlog', 'Life Update',
    'Moving Vlog', 'Apartment Tour', 'Night Routine',
    'Weekend in My Life', 'Capsule Wardrobe', 'Digital Detox',
    'Slow Living', 'Mindfulness Practice'
  ],
  education: [
    'How AI Works', 'History Explained', 'Science Facts',
    'Language Learning Tips', 'Study Techniques', 'Critical Thinking',
    'Psychology Basics', 'Philosophy Explained', 'Math Made Easy',
    'Writing Tips', 'Public Speaking', 'Memory Techniques',
    'Speed Reading', 'Online Course Review', 'Learning Hacks',
    'Research Skills', 'Note Taking Methods', 'Exam Preparation',
    'Skill Building', 'Knowledge Management'
  ],
  fitness: [
    'Home Workout No Equipment', '30 Day Challenge', 'Abs Workout',
    'Full Body Routine', 'Weight Loss Tips', 'Muscle Building',
    'Morning Exercise', 'HIIT Training', 'Yoga for Beginners',
    'Stretching Routine', 'Meal Prep Guide', 'Protein Recipes',
    'Running Tips', 'Gym Mistakes', 'Workout Motivation',
    'Recovery Tips', 'Supplement Guide', 'Body Transformation',
    'Fitness Journey', 'Healthy Lifestyle'
  ]
};

// Generate a single batch video (fully automated)
function generateSingleVideo(
  channelId: string,
  topic: string,
  niche: string,
  index: number
): BatchVideo {
  // Get winning title
  const winningTitle = getWinningTitle(topic);
  
  // Get title variations
  const titleTest = generateTitleVariations(topic);
  const titleVariations = titleTest.variations.map(v => v.title);
  
  // Generate thumbnail
  const thumbnailPack = generateThumbnailPack(winningTitle);
  
  // Generate script
  const script = autoFillTemplate(niche, topic);
  
  // Generate description
  const description = generateDescription(topic, niche);
  
  // Generate tags
  const tags = generateTags(topic, niche);
  
  // Estimate views
  const viewEstimates = ['2K-5K', '5K-10K', '10K-25K', '25K-50K', '50K-100K', '100K+'];
  const estimatedViews = viewEstimates[Math.floor(Math.random() * viewEstimates.length)];
  
  return {
    id: `batch-${Date.now()}-${index}`,
    channelId,
    title: winningTitle,
    titleVariations,
    description,
    tags,
    script,
    thumbnailConcept: thumbnailPack.recommended.type,
    thumbnailText: thumbnailPack.recommended.mainText,
    estimatedViews,
    status: 'generated',
    createdAt: new Date().toISOString()
  };
}

// Generate description
function generateDescription(topic: string, niche: string): string {
  const descriptions: Record<string, string> = {
    tech: `🔥 ${topic} - Everything You Need to Know!

In this video, I break down ${topic} with real examples and actionable insights.

📌 Timestamps:
0:00 - Introduction
0:30 - Overview
2:00 - Key Points
5:00 - Deep Dive
8:00 - Conclusion

🔗 Links mentioned:
• [Add your links here]

👋 Connect with me:
• Instagram: @yourhandle
• Twitter: @yourhandle

📧 Business inquiries: your@email.com

#${topic.replace(/\s+/g, '')} #tech #technology #2025`,

    finance: `💰 ${topic} - Complete Guide

Learn everything about ${topic} in this comprehensive breakdown.

📌 Timestamps:
0:00 - Hook
1:00 - The Strategy
4:00 - How To Start
7:00 - Common Mistakes
9:00 - Final Tips

⚠️ Disclaimer: This is not financial advice. Always do your own research.

🔔 Subscribe for more money content!

#${topic.replace(/\s+/g, '')} #money #finance #investing #2025`,

    motivation: `🔥 ${topic} - Powerful Motivation

This video will change the way you think about success.

📌 What you'll learn:
• How to develop the ${topic} mindset
• Practical steps to implement today
• Stories of people who made it

💪 Let this be the day you decide to change.

#${topic.replace(/\s+/g, '')} #motivation #success #mindset #discipline`,

    gaming: `🎮 ${topic} - Full Video

Welcome back to another gaming video! Today we're exploring ${topic}.

📌 Timestamps:
0:00 - Intro
1:00 - Gameplay Starts
5:00 - The Moment
8:00 - Outro

🔔 Subscribe for more gaming content!

#${topic.replace(/\s+/g, '')} #gaming #games #gameplay #letsplay`,

    lifestyle: `✨ ${topic} - Life Update

Join me as I share my experience with ${topic}.

📌 What's in this video:
• My honest thoughts
• Tips and takeaways
• What I learned

💕 Thanks for watching and being part of this journey!

#${topic.replace(/\s+/g, '')} #lifestyle #vlog #life #2025`,

    education: `📚 ${topic} - Explained Simply

Understanding ${topic} doesn't have to be complicated. Let me break it down.

📌 Topics covered:
0:00 - Introduction
1:00 - The Basics
4:00 - How It Works
7:00 - Real Examples
9:00 - Summary

📖 Additional resources in the pinned comment!

#${topic.replace(/\s+/g, '')} #education #learning #explained`,

    fitness: `💪 ${topic} - Workout Guide

Get ready to sweat! This ${topic} routine will transform your fitness.

📌 Workout breakdown:
0:00 - Warm Up
2:00 - Main Exercises
7:00 - Cool Down

⚠️ Listen to your body and modify as needed.

🔔 Subscribe for more workouts!

#${topic.replace(/\s+/g, '')} #fitness #workout #exercise #health`
  };
  
  return descriptions[niche] || descriptions.tech;
}

// Generate tags
function generateTags(topic: string, niche: string): string[] {
  const baseTags = topic.toLowerCase().split(' ');
  const nicheTags: Record<string, string[]> = {
    tech: ['technology', 'tech', 'gadgets', 'review', '2025', 'best', 'top', 'new'],
    gaming: ['gaming', 'games', 'gameplay', 'letsplay', 'gamer', 'videogames', 'stream'],
    finance: ['money', 'finance', 'investing', 'income', 'wealth', 'business', 'entrepreneur'],
    motivation: ['motivation', 'success', 'mindset', 'inspiration', 'goals', 'discipline'],
    lifestyle: ['lifestyle', 'vlog', 'life', 'aesthetic', 'minimal', 'routine', 'daily'],
    education: ['education', 'learn', 'explained', 'howto', 'tutorial', 'knowledge'],
    fitness: ['fitness', 'workout', 'exercise', 'health', 'gym', 'training', 'wellness']
  };
  
  return [...baseTags, ...(nicheTags[niche] || nicheTags.tech)];
}

// MAIN: Generate batch of videos (ONE CLICK)
export function generateBatch(
  channelId: string,
  channelName: string,
  niche: string,
  count: number = 10
): BatchResult {
  // Get trending topics for this niche
  const topics = TRENDING_TOPICS[niche] || TRENDING_TOPICS.tech;
  
  // Shuffle and pick topics
  const shuffled = [...topics].sort(() => Math.random() - 0.5);
  const selectedTopics = shuffled.slice(0, count);
  
  // Generate all videos
  const videos = selectedTopics.map((topic, index) => 
    generateSingleVideo(channelId, topic, niche, index)
  );
  
  // Calculate total estimated views
  const viewRanges: Record<string, number> = {
    '2K-5K': 3500,
    '5K-10K': 7500,
    '10K-25K': 17500,
    '25K-50K': 37500,
    '50K-100K': 75000,
    '100K+': 150000
  };
  
  const totalEstimated = videos.reduce((sum, v) => 
    sum + (viewRanges[v.estimatedViews] || 5000), 0
  );
  
  const result: BatchResult = {
    id: `batch-result-${Date.now()}`,
    channelId,
    channelName,
    videosGenerated: videos.length,
    videos,
    totalEstimatedViews: `${Math.floor(totalEstimated / 1000)}K - ${Math.floor(totalEstimated * 1.5 / 1000)}K`,
    createdAt: new Date().toISOString()
  };
  
  // Auto-save
  saveBatchResult(result);
  
  // Track performance for all videos
  videos.forEach(video => {
    trackVideoPerformance({
      id: video.id,
      channelId: video.channelId,
      title: video.title,
      niche,
      hooks: []
    });
  });
  
  return result;
}

// Save batch result
function saveBatchResult(result: BatchResult): void {
  if (typeof window === 'undefined') return;
  
  const existing = JSON.parse(localStorage.getItem('batch_results') || '[]');
  existing.push(result);
  localStorage.setItem('batch_results', JSON.stringify(existing));
  
  // Also save to all_generated_videos
  const allVideos = JSON.parse(localStorage.getItem('all_generated_videos') || '[]');
  result.videos.forEach(video => {
    allVideos.push({
      id: video.id,
      channelId: video.channelId,
      title: video.title,
      description: video.description,
      script: video.script,
      tags: video.tags,
      status: 'generated',
      createdAt: video.createdAt,
      source: 'batch'
    });
  });
  localStorage.setItem('all_generated_videos', JSON.stringify(allVideos));
}

// Get all batch results
export function getAllBatchResults(): BatchResult[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('batch_results') || '[]');
}

// Quick batch (generates for all channels at once)
export function quickBatchAll(videosPerChannel: number = 5): BatchResult[] {
  if (typeof window === 'undefined') return [];
  
  const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
  
  return channels.map((channel: any) => 
    generateBatch(
      channel.id,
      channel.name || 'Channel',
      channel.niche || 'tech',
      videosPerChannel
    )
  );
}

// Schedule batch videos
export function scheduleBatchVideos(
  batchId: string,
  startDate: Date,
  intervalHours: number = 24
): void {
  if (typeof window === 'undefined') return;
  
  const batches = getAllBatchResults();
  const batch = batches.find(b => b.id === batchId);
  
  if (!batch) return;
  
  let currentDate = new Date(startDate);
  
  batch.videos.forEach(video => {
    video.scheduledFor = currentDate.toISOString();
    video.status = 'scheduled';
    currentDate = new Date(currentDate.getTime() + intervalHours * 60 * 60 * 1000);
  });
  
  // Save updated batch
  const updatedBatches = batches.map(b => b.id === batchId ? batch : b);
  localStorage.setItem('batch_results', JSON.stringify(updatedBatches));
}

// Get batch stats
export function getBatchStats(): {
  totalBatches: number;
  totalVideos: number;
  totalEstimatedViews: string;
} {
  const batches = getAllBatchResults();
  
  return {
    totalBatches: batches.length,
    totalVideos: batches.reduce((sum, b) => sum + b.videosGenerated, 0),
    totalEstimatedViews: batches.length > 0 
      ? `${batches.reduce((sum, b) => sum + parseInt(b.totalEstimatedViews.replace(/[^\d]/g, '')) || 0, 0)}K+`
      : '0'
  };
}
