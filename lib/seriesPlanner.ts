// Series Planner - Auto-generates connected video series
// Builds audience with linked content that viewers want to binge

import { getWinningTitle } from './abTesting';
import { generateThumbnailPack } from './thumbnailGenerator';
import { getHooksForNiche } from './engagementHooks';

export interface SeriesVideo {
  episodeNumber: number;
  title: string;
  description: string;
  hook: string;
  callbackToPrevious?: string;
  teaseNext?: string;
  thumbnailText: string;
  estimatedLength: string;
}

export interface VideoSeries {
  id: string;
  name: string;
  niche: string;
  channelId: string;
  type: 'numbered' | 'themed' | 'challenge' | 'story';
  totalEpisodes: number;
  videos: SeriesVideo[];
  postingSchedule: string;
  estimatedCompletion: string;
  createdAt: string;
}

// Series templates by type
const SERIES_TEMPLATES = {
  numbered: {
    titleFormat: '{topic} - Part {n}: {subtitle}',
    descriptionPrefix: '📺 Part {n} of {total} in our {topic} series.\n\n',
    prevCallbackTemplate: '👈 In the last episode, we covered {prev_topic}. Today we\'re taking it further...',
    nextTeaseTemplate: '👉 In the next episode, I\'ll show you {next_topic}. You don\'t want to miss it!'
  },
  themed: {
    titleFormat: '{theme}: {subtitle}',
    descriptionPrefix: '✨ This is part of my {theme} series.\n\n',
    prevCallbackTemplate: 'Building on what we discussed about {prev_topic}...',
    nextTeaseTemplate: 'Next time, we\'ll explore {next_topic}...'
  },
  challenge: {
    titleFormat: 'Day {n} of {total}: {subtitle}',
    descriptionPrefix: '🔥 Day {n} of my {topic} challenge!\n\n',
    prevCallbackTemplate: 'Yesterday was intense! We accomplished {prev_topic}. Today...',
    nextTeaseTemplate: 'Tomorrow is going to be even crazier - {next_topic}!'
  },
  story: {
    titleFormat: '{topic} - {subtitle} (Episode {n})',
    descriptionPrefix: '📖 Episode {n} of my {topic} journey.\n\n',
    prevCallbackTemplate: 'When we last left off, {prev_topic}. Now...',
    nextTeaseTemplate: 'Stay tuned for the next episode where {next_topic}...'
  }
};

// Pre-built series blueprints by niche
const SERIES_BLUEPRINTS: Record<string, { name: string; episodes: string[] }[]> = {
  tech: [
    {
      name: 'Complete Beginner to Pro',
      episodes: ['Understanding the Basics', 'Setting Up Your Environment', 'First Project', 'Common Mistakes', 'Advanced Techniques', 'Real-World Application', 'Pro Tips & Tricks']
    },
    {
      name: 'Tech Review Deep Dive',
      episodes: ['Unboxing & First Impressions', 'Design & Build Quality', 'Performance Testing', 'Camera/Features Deep Dive', 'Daily Use Experience', 'Final Verdict & Who Should Buy']
    },
    {
      name: 'Build Along Series',
      episodes: ['Planning the Project', 'Gathering Components', 'Assembly Part 1', 'Assembly Part 2', 'Testing & Troubleshooting', 'Final Results & Performance']
    }
  ],
  gaming: [
    {
      name: '100 Days Challenge',
      episodes: ['Day 1: Starting From Nothing', 'Day 25: First Major Milestone', 'Day 50: Everything Changed', 'Day 75: The Struggle', 'Day 100: Final Results']
    },
    {
      name: 'Noob to Pro Journey',
      episodes: ['My First Game Ever', 'Learning the Basics', 'First Win', 'Developing Strategy', 'Climbing the Ranks', 'Finally Got Good']
    },
    {
      name: 'Complete Playthrough',
      episodes: ['Beginning the Adventure', 'First Boss Fight', 'Major Plot Twist', 'Hardest Section', 'The Final Battle', 'Ending + Review']
    }
  ],
  finance: [
    {
      name: 'Financial Freedom Blueprint',
      episodes: ['Where to Start', 'Emergency Fund', 'Eliminating Debt', 'First Investments', 'Multiple Income Streams', 'Wealth Building', 'Achieving Freedom']
    },
    {
      name: 'Side Hustle Series',
      episodes: ['Finding Your Hustle', 'Getting Started', 'First Dollar Earned', 'Scaling Up', 'Automating', 'Full Results Breakdown']
    },
    {
      name: 'Investing Deep Dive',
      episodes: ['Investing 101', 'Types of Investments', 'Building a Portfolio', 'Risk Management', 'Tax Strategies', 'Long-Term Wealth']
    }
  ],
  motivation: [
    {
      name: 'Transformation Series',
      episodes: ['The Wake-Up Call', 'Building New Habits', 'Overcoming Resistance', 'First Breakthrough', 'Maintaining Momentum', 'The New Me']
    },
    {
      name: 'Success Mindset',
      episodes: ['Why Mindset Matters', 'Eliminating Limiting Beliefs', 'Goal Setting', 'Taking Action', 'Handling Failure', 'Achieving Success']
    },
    {
      name: 'Daily Disciplines',
      episodes: ['Morning Routine', 'Exercise & Health', 'Learning & Growth', 'Work & Productivity', 'Evening Routine', 'Putting It All Together']
    }
  ],
  lifestyle: [
    {
      name: 'Life Transformation',
      episodes: ['Why I\'m Changing', 'Decluttering My Life', 'New Routines', 'Mindset Shift', '30 Days Later', 'My New Life']
    },
    {
      name: 'Room/Home Makeover',
      episodes: ['The Current Mess', 'Planning the Design', 'Shopping & Prep', 'The Makeover Process', 'Final Reveal', 'Living In It']
    },
    {
      name: 'Habit Building',
      episodes: ['Choosing My Habits', 'Week 1 Struggles', 'Week 2 Progress', 'Week 3 Breakthrough', 'Week 4 Results', 'Life After 30 Days']
    }
  ],
  education: [
    {
      name: 'Complete Course',
      episodes: ['Introduction & Overview', 'Fundamentals', 'Core Concepts', 'Intermediate Topics', 'Advanced Material', 'Practical Application', 'Final Project']
    },
    {
      name: 'Deep Dive Explained',
      episodes: ['The Basics', 'How It Works', 'Why It Matters', 'Real Examples', 'Common Misconceptions', 'Expert Insights']
    },
    {
      name: 'Learning Journey',
      episodes: ['Starting From Zero', 'First Week Progress', 'Breaking Through', 'The Aha Moment', 'Mastery Begins', 'What I Learned']
    }
  ],
  fitness: [
    {
      name: 'Transformation Challenge',
      episodes: ['Starting Point', 'Week 1-2', 'Week 3-4', 'Week 5-6', 'Week 7-8', 'Final Results']
    },
    {
      name: 'Complete Training Program',
      episodes: ['Program Overview', 'Push Day', 'Pull Day', 'Legs Day', 'Cardio & Core', 'Recovery & Nutrition', 'Progress Check']
    },
    {
      name: 'Fitness Journey',
      episodes: ['Why I Started', 'First Month Struggles', 'Building Consistency', 'Seeing Results', '6 Months Later', 'Lifestyle Change']
    }
  ]
};

// Generate a video series (fully automated)
export function generateSeries(
  channelId: string,
  niche: string,
  topic: string,
  type: VideoSeries['type'] = 'numbered',
  episodeCount?: number
): VideoSeries {
  // Get blueprint for this niche
  const blueprints = SERIES_BLUEPRINTS[niche] || SERIES_BLUEPRINTS.tech;
  const blueprint = blueprints[Math.floor(Math.random() * blueprints.length)];
  
  const template = SERIES_TEMPLATES[type];
  const episodes = blueprint.episodes.slice(0, episodeCount || blueprint.episodes.length);
  const hooks = getHooksForNiche(niche);
  
  const videos: SeriesVideo[] = episodes.map((episodeTitle, index) => {
    const n = index + 1;
    const total = episodes.length;
    
    // Build title
    let title = template.titleFormat
      .replace('{topic}', topic)
      .replace('{theme}', topic)
      .replace('{n}', String(n))
      .replace('{total}', String(total))
      .replace('{subtitle}', episodeTitle);
    
    title = getWinningTitle(title);
    
    // Build description
    let description = template.descriptionPrefix
      .replace('{n}', String(n))
      .replace('{total}', String(total))
      .replace('{topic}', topic)
      .replace('{theme}', topic);
    
    description += `In this episode: ${episodeTitle}\n\n`;
    description += `🔔 Subscribe for the full series!\n\n`;
    description += `#${topic.replace(/\s+/g, '')} #Series #Part${n}`;
    
    // Callbacks and teases
    let callbackToPrevious: string | undefined;
    let teaseNext: string | undefined;
    
    if (index > 0) {
      callbackToPrevious = template.prevCallbackTemplate
        .replace('{prev_topic}', episodes[index - 1]);
    }
    
    if (index < episodes.length - 1) {
      teaseNext = template.nextTeaseTemplate
        .replace('{next_topic}', episodes[index + 1]);
    }
    
    // Thumbnail
    const thumbPack = generateThumbnailPack(title);
    
    return {
      episodeNumber: n,
      title,
      description,
      hook: hooks.opener.text,
      callbackToPrevious,
      teaseNext,
      thumbnailText: `PART ${n}`,
      estimatedLength: '10-15 min'
    };
  });
  
  // Calculate posting schedule
  const now = new Date();
  const completionDate = new Date(now.getTime() + (videos.length * 2 * 24 * 60 * 60 * 1000));
  
  const series: VideoSeries = {
    id: `series-${Date.now()}`,
    name: `${topic}: ${blueprint.name}`,
    niche,
    channelId,
    type,
    totalEpisodes: videos.length,
    videos,
    postingSchedule: 'Every 2 days',
    estimatedCompletion: completionDate.toLocaleDateString(),
    createdAt: new Date().toISOString()
  };
  
  // Auto-save
  saveSeries(series);
  
  return series;
}

// Save series
function saveSeries(series: VideoSeries): void {
  if (typeof window === 'undefined') return;
  
  const existing = JSON.parse(localStorage.getItem('video_series') || '[]');
  existing.push(series);
  localStorage.setItem('video_series', JSON.stringify(existing));
  
  // Also add individual videos to all_generated_videos
  const allVideos = JSON.parse(localStorage.getItem('all_generated_videos') || '[]');
  series.videos.forEach(video => {
    allVideos.push({
      id: `${series.id}-ep${video.episodeNumber}`,
      channelId: series.channelId,
      title: video.title,
      description: video.description,
      script: video.hook + '\n\n[Main content]\n\n' + (video.teaseNext || ''),
      tags: [series.name.replace(/\s+/g, ''), `Part${video.episodeNumber}`, series.niche],
      status: 'generated',
      createdAt: new Date().toISOString(),
      source: 'series',
      seriesId: series.id,
      episodeNumber: video.episodeNumber
    });
  });
  localStorage.setItem('all_generated_videos', JSON.stringify(allVideos));
}

// Get all series
export function getAllSeries(): VideoSeries[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('video_series') || '[]');
}

// Get series for a channel
export function getSeriesForChannel(channelId: string): VideoSeries[] {
  return getAllSeries().filter(s => s.channelId === channelId);
}

// Quick series generation (one function)
export function quickSeries(channelId: string, niche: string, topic: string): VideoSeries {
  return generateSeries(channelId, niche, topic, 'numbered');
}

// Get series ideas for a niche
export function getSeriesIdeas(niche: string): string[] {
  const blueprints = SERIES_BLUEPRINTS[niche] || SERIES_BLUEPRINTS.tech;
  return blueprints.map(b => b.name);
}

// Generate series script template
export function generateSeriesScriptTemplate(series: VideoSeries, episodeNumber: number): string {
  const video = series.videos.find(v => v.episodeNumber === episodeNumber);
  if (!video) return '';
  
  let script = `# ${video.title}\n\n`;
  
  // Opening
  script += `## Opening (0-30 seconds)\n\n`;
  script += `${video.hook}\n\n`;
  
  if (video.callbackToPrevious) {
    script += `${video.callbackToPrevious}\n\n`;
  }
  
  script += `Today in Part ${episodeNumber}, we're covering...\n\n`;
  
  // Main content
  script += `## Main Content\n\n`;
  script += `[Your main content here]\n\n`;
  
  // Mid-roll retention
  script += `## Mid-Video Hook\n\n`;
  script += `But here's where it gets really interesting...\n\n`;
  
  // Conclusion
  script += `## Conclusion\n\n`;
  script += `So to recap what we learned in Part ${episodeNumber}...\n\n`;
  
  // Next episode tease
  if (video.teaseNext) {
    script += `## Next Episode Tease\n\n`;
    script += `${video.teaseNext}\n\n`;
  }
  
  // CTA
  script += `## Call to Action\n\n`;
  script += `If you're enjoying this series, hit subscribe and the bell so you don't miss Part ${episodeNumber + 1}!\n`;
  script += `Like this video if it was helpful, and drop a comment with your biggest takeaway.\n`;
  
  return script;
}

// Get series stats
export function getSeriesStats(): {
  totalSeries: number;
  totalEpisodes: number;
  avgEpisodesPerSeries: number;
} {
  const allSeries = getAllSeries();
  
  return {
    totalSeries: allSeries.length,
    totalEpisodes: allSeries.reduce((sum, s) => sum + s.totalEpisodes, 0),
    avgEpisodesPerSeries: allSeries.length > 0 
      ? Math.round(allSeries.reduce((sum, s) => sum + s.totalEpisodes, 0) / allSeries.length)
      : 0
  };
}
