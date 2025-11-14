/**
 * INTELLIGENT AI ASSISTANT
 * Understands context, executes commands, generates content
 * Works like GitHub Copilot Chat - understands the whole app
 */

export interface AppContext {
  channels: any[];
  videos: any[];
  series: any[];
  revenue: number;
  subscribers: number;
  views: number;
  currentPage: string;
}

export interface AssistantResponse {
  message: string;
  action?: {
    type: 'navigate' | 'generate' | 'create' | 'execute' | 'show';
    target?: string;
    data?: any;
  };
  suggestions?: string[];
}

/**
 * Analyze user's question and app context to provide intelligent response
 */
export async function analyzeQuestion(
  question: string,
  context: AppContext
): Promise<AssistantResponse> {
  const q = question.toLowerCase();

  // ADVANCED CONTENT CREATION - Extract full description and requirements
  if (q.includes('create') || q.includes('generate') || q.includes('make') || q.includes('produce')) {
    const hasChannels = context.channels && context.channels.length > 0;
    
    if (!hasChannels) {
      return {
        message: "You need to create a channel first. Let me take you to the Dashboard (30 seconds setup).",
        action: {
          type: 'navigate',
          target: '/dashboard'
        }
      };
    }

    // Extract detailed requirements from the description
    const contentDetails = extractContentDetails(question);

    // Build intelligent response
    const response = `Perfect! I understand you want:\n\n📝 CONTENT: ${contentDetails.topic}\n🎨 STYLE: ${contentDetails.style}\n🎯 NICHE: ${contentDetails.niche}\n⏱️ LENGTH: ${contentDetails.duration}\n🗣️ VOICE: ${contentDetails.voiceType}\n\n✨ I'll create this with:\n• ${contentDetails.quality} quality visuals\n• ${contentDetails.voiceType} voiceover\n• Professional animations\n• Viral-optimized script\n• Perfect thumbnails\n\nTaking you to the creator now...`;

    // Store the detailed requirements for the video creator
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_content_request', JSON.stringify({
        fullDescription: question,
        topic: contentDetails.topic,
        niche: contentDetails.niche,
        style: contentDetails.style,
        duration: contentDetails.duration,
        voiceType: contentDetails.voiceType,
        quality: contentDetails.quality,
        specificRequirements: contentDetails.requirements,
        timestamp: Date.now()
      }));
    }

    return {
      message: response,
      action: {
        type: 'navigate',
        target: '/video-creator',
        data: contentDetails
      },
      suggestions: [
        'Adjust video length',
        'Change voice style',
        'Add more details'
      ]
    };
  }

  // CHANNEL MANAGEMENT
  if (q.includes('create channel') || q.includes('new channel') || q.includes('add channel')) {
    return {
      message: "I'll help you create a new channel! Opening the Dashboard where you can set up your channel in 30 seconds.",
      action: {
        type: 'navigate',
        target: '/dashboard'
      },
      suggestions: [
        'What niche should I choose?',
        'Generate my first video',
        'How do I monetize?'
      ]
    };
  }

  // VIDEO GENERATION
  if (q.includes('generate video') || q.includes('create video') || q.includes('make video') || q.includes('create a video about')) {
    const hasChannels = context.channels && context.channels.length > 0;
    
    if (!hasChannels) {
      return {
        message: "You need to create a channel first before generating videos. Let me take you to the Dashboard to set one up (takes 30 seconds).",
        action: {
          type: 'navigate',
          target: '/dashboard'
        }
      };
    }

    // Extract topic from question
    const topicMatch = q.match(/about (.+)/i);
    const topic = topicMatch ? topicMatch[1] : 'trending topic';

    return {
      message: `Perfect! I'll create a video about "${topic}" for your channel.\n\n✨ Taking you to the Video Generator where everything is ready to go...`,
      action: {
        type: 'navigate',
        target: '/video-creator',
        data: { topic, autoStart: true }
      },
      suggestions: [
        'Generate 5 videos at once',
        'Use autopilot mode',
        'Create a series instead'
      ]
    };
  }

  // SERIES CREATION
  if (q.includes('series') || q.includes('multiple episodes') || q.includes('story series') || q.includes('episode')) {
    return {
      message: "Great idea! Series content gets 3X more views because people binge-watch. Taking you to the Series Creator where you can generate 10 episodes at once with viral stories.",
      action: {
        type: 'navigate',
        target: '/series'
      },
      suggestions: [
        'What are the best story categories?',
        'How long should episodes be?',
        'How do I schedule uploads?'
      ]
    };
  }

  // SPECIFIC CONTENT TYPES - Recognize niche keywords
  const contentTypes: Record<string, { niche: string; examples: string[] }> = {
    'mystery|unsolved|investigation': {
      niche: 'Mystery',
      examples: ['The Vanishing of Flight MH370', '5 Mysteries That Scientists Can\'t Explain', 'The Truth Behind Area 51']
    },
    'crime|criminal|murder|killer': {
      niche: 'True Crime',
      examples: ['The Most Dangerous Serial Killer', 'Cold Case Finally Solved', 'How FBI Caught The Impossible Criminal']
    },
    'money|finance|wealth|rich|invest': {
      niche: 'Finance',
      examples: ['How I Made $10K in 30 Days', 'Passive Income Stream Everyone Should Start', 'Investment Strategy Billionaires Use']
    },
    'tech|technology|ai|software|app': {
      niche: 'Technology',
      examples: ['AI Tool That Will Change Everything', 'Tech Giant\'s Secret Project', 'Why Everyone Is Switching To This App']
    },
    'motivation|success|mindset|productivity': {
      niche: 'Self-Improvement',
      examples: ['How I Transformed My Life in 90 Days', '5 Habits of Highly Successful People', 'The Secret to Unstoppable Motivation']
    }
  };

  // Check if question matches any content type
  for (const [pattern, info] of Object.entries(contentTypes)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(q)) {
      return {
        message: `Perfect! I'll help you create a ${info.niche} video.\n\nHere are some viral ideas for ${info.niche}:\n• ${info.examples.join('\n• ')}\n\nTaking you to the Video Creator with ${info.niche} pre-selected...`,
        action: {
          type: 'navigate',
          target: '/video-creator',
          data: { niche: info.niche }
        },
        suggestions: info.examples.slice(0, 3)
      };
    }
  }

  // MONEY/REVENUE
  if (q.includes('make money') || q.includes('earn') || q.includes('revenue') || q.includes('monetize')) {
    const currentRevenue = context.revenue || 0;
    
    return {
      message: `Let me show you EXACTLY how to make money with your channel!\n\n💰 Current Revenue: $${currentRevenue}/month\n\nYou can earn from:\n1. YouTube Ad Revenue ($5-10 per 1K views)\n2. Affiliate Marketing ($50-200 per video)\n3. Sponsorships ($500-2,000 per video)\n4. Digital Products ($580-2,450/month passive)\n5. Patreon/Memberships ($300-1,500/month)\n\nOpening Multi-Income Streams tool...`,
      action: {
        type: 'navigate',
        target: '/revenue'
      },
      suggestions: [
        'Set up affiliate links',
        'Find sponsorships',
        'Create digital products'
      ]
    };
  }

  // AUTOPILOT
  if (q.includes('autopilot') || q.includes('automate') || q.includes('automatic')) {
    return {
      message: "Autopilot mode is your freedom machine! It will:\n\n1. Generate viral video ideas daily\n2. Write scripts automatically\n3. Create videos with AI\n4. Schedule posts across platforms\n5. Optimize titles & thumbnails\n6. Handle comments & engagement\n\nYou go from 40 hours/week to 2 hours/week. Taking you to Autopilot settings...",
      action: {
        type: 'navigate',
        target: '/strategy'
      },
      suggestions: [
        'Set posting frequency',
        'Choose content categories',
        'Enable cross-platform posting'
      ]
    };
  }

  // GROWTH/SUBSCRIBERS
  if (q.includes('subscribers') || q.includes('grow') || q.includes('more views') || q.includes('viral')) {
    const currentSubs = context.subscribers || 0;
    const currentViews = context.views || 0;

    return {
      message: `Let's grow your channel! 📈\n\nCurrent Stats:\n• Subscribers: ${currentSubs.toLocaleString()}\n• Total Views: ${currentViews.toLocaleString()}\n\nGrowth Strategy:\n1. Post 3-5 videos/week (consistency is key)\n2. Use proven viral niches (Mystery, Crime, Psychology)\n3. Perfect thumbnails (shocked faces work)\n4. Hook in first 10 seconds\n5. Cross-post to TikTok/Instagram\n\nTaking you to the Viral Growth tool...`,
      action: {
        type: 'navigate',
        target: '/strategy'
      },
      suggestions: [
        'Analyze my competitors',
        'Get trending topics',
        'Optimize my thumbnails'
      ]
    };
  }

  // ANALYTICS
  if (q.includes('stats') || q.includes('analytics') || q.includes('performance') || q.includes('how am i doing')) {
    const videoCount = context.videos?.length || 0;
    const channelCount = context.channels?.length || 0;

    return {
      message: `Here's your performance summary:\n\n📊 OVERVIEW:\n• Channels: ${channelCount}\n• Videos Created: ${videoCount}\n• Total Revenue: $${context.revenue || 0}\n• Subscribers: ${context.subscribers || 0}\n• Total Views: ${context.views || 0}\n\n${videoCount === 0 ? '💡 TIP: Create your first video to start earning!' : `🎯 NEXT STEPS: ${videoCount < 10 ? 'Keep posting consistently (goal: 10 videos)' : 'Focus on monetization strategies'}`}`,
      suggestions: [
        'Generate more videos',
        'Increase revenue',
        'Analyze top performers'
      ]
    };
  }

  // TROUBLESHOOTING
  if (q.includes('problem') || q.includes('error') || q.includes('not working') || q.includes('broken')) {
    return {
      message: "I'm here to help! Tell me what's not working:\n\n🔧 Common Issues:\n1. Can't create channel → Make sure all fields are filled\n2. Video generation stuck → Refresh the page and try again\n3. Data not saving → Check your internet connection\n4. Can't see my content → Look in Dashboard > My Channels\n\nWhat specific issue are you experiencing?",
      suggestions: [
        'I lost my channels',
        'Videos not generating',
        'Payment setup issues'
      ]
    };
  }

  // GETTING STARTED
  if (q.includes('how do i start') || q.includes('first time') || q.includes('beginner') || q.includes('new here')) {
    const hasChannels = context.channels && context.channels.length > 0;

    if (hasChannels) {
      return {
        message: `Welcome back! I see you already have ${context.channels.length} channel(s) set up.\n\n✅ Your next steps:\n1. Generate your first video (Video Creator)\n2. Or create a series (Series Creator)\n3. Set up monetization (Revenue tab)\n4. Enable autopilot mode (Strategy tab)\n\nWhat would you like to do?`,
        suggestions: [
          'Generate a video now',
          'Create a series',
          'Set up monetization'
        ]
      };
    }

    return {
      message: "Welcome! Let's get you earning in 3 steps:\n\n1️⃣ CREATE CHANNEL (30 seconds)\n   → Go to Dashboard\n   → Pick your niche (Mystery works best)\n   → Save channel\n\n2️⃣ GENERATE FIRST VIDEO (2 minutes)\n   → Go to Video Creator\n   → Enter topic\n   → AI creates everything\n\n3️⃣ START EARNING (24 hours)\n   → Upload to YouTube\n   → Add affiliate links\n   → Enable autopilot\n\nLet's start! Taking you to Dashboard...",
      action: {
        type: 'navigate',
        target: '/dashboard'
      },
      suggestions: [
        'What niche should I choose?',
        'How long until I make money?',
        'Show me examples'
      ]
    };
  }

  // SPECIFIC FEATURE QUESTIONS
  if (q.includes('how do i') || q.includes('how to')) {
    // Extract the action they want to do
    if (q.includes('add affiliate')) {
      return {
        message: "Adding affiliate links is the FASTEST way to make money:\n\n1. Sign up for Amazon Associates (FREE)\n2. Get your affiliate link\n3. Add to video descriptions\n4. Disclose properly\n5. Earn $50-200 per video\n\nOpening Revenue section where I'll show you the exact template...",
        action: {
          type: 'navigate',
          target: '/revenue'
        }
      };
    }

    if (q.includes('upload') || q.includes('publish')) {
      return {
        message: "To upload your videos:\n\n1. Generate video in Video Creator\n2. Download the MP4 file\n3. Go to YouTube Studio\n4. Upload video\n5. Or use Cross-Platform Empire to post to 9 platforms at once\n\nWant me to show you the Cross-Platform tool?",
        suggestions: [
          'Yes, show me Cross-Platform Empire',
          'How do I schedule posts?',
          'What time should I upload?'
        ]
      };
    }
  }

  // DEFAULT: SEARCH HELP DATABASE
  return {
    message: `I'm not sure I understand. Could you be more specific?\n\nI can help you with:\n\n📺 Content Creation:\n• Create channels\n• Generate videos\n• Create series\n• Schedule posts\n\n💰 Making Money:\n• Set up monetization\n• Add affiliate links\n• Find sponsorships\n• Create digital products\n\n📈 Growth:\n• Get more subscribers\n• Increase views\n• Viral strategies\n• Analytics\n\n🤖 Automation:\n• Enable autopilot\n• Cross-platform posting\n• AI clone workforce\n\nWhat would you like help with?`,
    suggestions: [
      'Create my first video',
      'How do I make money?',
      'Show me my stats',
      'Enable autopilot mode'
    ]
  };
}

/**
 * INTELLIGENT CONTENT EXTRACTOR
 * Extracts all details from user's description
 */
function extractContentDetails(description: string): {
  topic: string;
  niche: string;
  style: string;
  duration: string;
  voiceType: string;
  quality: string;
  requirements: string[];
} {
  const lower = description.toLowerCase();
  
  // Extract topic (the main subject)
  let topic = description;
  const aboutMatch = description.match(/(?:about|on|regarding)\s+(.+?)(?:\.|$|with|using|in|for)/i);
  if (aboutMatch) {
    topic = aboutMatch[1].trim();
  }

  // Detect niche from keywords
  let niche = 'General';
  if (/mystery|unsolved|investigation|detective|secret/i.test(lower)) niche = 'Mystery';
  else if (/crime|murder|killer|serial|fbi|police/i.test(lower)) niche = 'True Crime';
  else if (/money|wealth|finance|invest|business|entrepreneur/i.test(lower)) niche = 'Finance';
  else if (/tech|ai|software|coding|programming|app/i.test(lower)) niche = 'Technology';
  else if (/motivation|success|productivity|mindset|growth/i.test(lower)) niche = 'Self-Improvement';
  else if (/history|ancient|civilization|war|empire/i.test(lower)) niche = 'History';
  else if (/science|physics|biology|chemistry|space/i.test(lower)) niche = 'Science';
  else if (/game|gaming|esports|minecraft|fortnite/i.test(lower)) niche = 'Gaming';
  else if (/food|cooking|recipe|restaurant|chef/i.test(lower)) niche = 'Food';
  else if (/travel|adventure|explore|destination|vacation/i.test(lower)) niche = 'Travel';

  // Detect video style
  let style = 'Cinematic';
  if (/cartoon|animated|animation|anime/i.test(lower)) style = 'Animated';
  else if (/documentary|factual|informative|educational/i.test(lower)) style = 'Documentary';
  else if (/vlog|personal|casual|behind.the.scenes/i.test(lower)) style = 'Vlog';
  else if (/tutorial|how.to|step.by.step|guide/i.test(lower)) style = 'Tutorial';
  else if (/cinematic|epic|dramatic|storytelling/i.test(lower)) style = 'Cinematic';
  else if (/motion.graphics|infographic|data|stats/i.test(lower)) style = 'Motion Graphics';

  // Detect duration
  let duration = '8-10 minutes';
  const durationMatch = description.match(/(\d+)\s*(?:min|minute|second|sec|hour)/i);
  if (durationMatch) {
    duration = durationMatch[0];
  } else if (/short|quick|brief/i.test(lower)) {
    duration = '3-5 minutes';
  } else if (/long|detailed|deep.dive|comprehensive/i.test(lower)) {
    duration = '15-20 minutes';
  }

  // Detect voice type
  let voiceType = 'Professional Male (David)';
  if (/female|woman|girl/i.test(lower)) voiceType = 'Professional Female (Emma)';
  else if (/british|uk|english.accent/i.test(lower)) voiceType = 'British Male (James)';
  else if (/dramatic|intense|serious/i.test(lower)) voiceType = 'Dramatic Male (Marcus)';
  else if (/friendly|casual|conversational/i.test(lower)) voiceType = 'Friendly Male (Alex)';
  else if (/narrator|storyteller|documentary/i.test(lower)) voiceType = 'Documentary Narrator (Morgan)';

  // Detect quality requirements
  let quality = 'Ultra HD';
  if (/4k|ultra|highest|best|premium/i.test(lower)) quality = 'Ultra HD (4K)';
  else if (/hd|high.quality|professional/i.test(lower)) quality = 'Full HD (1080p)';
  else if (/standard|normal|regular/i.test(lower)) quality = 'HD (720p)';

  // Extract specific requirements
  const requirements: string[] = [];
  if (/subtitle|caption|text/i.test(lower)) requirements.push('Subtitles enabled');
  if (/background.music|music|soundtrack/i.test(lower)) requirements.push('Background music');
  if (/thumbnail/i.test(lower)) requirements.push('Custom thumbnail');
  if (/viral|trending|popular/i.test(lower)) requirements.push('Viral optimization');
  if (/seo|tags|keywords/i.test(lower)) requirements.push('SEO optimized');
  if (/multiple|series|episodes/i.test(lower)) requirements.push('Series format');

  return {
    topic,
    niche,
    style,
    duration,
    voiceType,
    quality,
    requirements: requirements.length > 0 ? requirements : ['Standard features']
  };
}

/**
 * Get current app context from localStorage
 */
export function getAppContext(): AppContext {
  if (typeof window === 'undefined') {
    return {
      channels: [],
      videos: [],
      series: [],
      revenue: 0,
      subscribers: 0,
      views: 0,
      currentPage: '/'
    };
  }

  const channels = JSON.parse(localStorage.getItem('channels') || '[]');
  const videos = JSON.parse(localStorage.getItem('generated_videos') || '[]');
  const series = JSON.parse(localStorage.getItem('series_channels') || '[]');

  // Calculate total stats
  const totalSubs = channels.reduce((sum: number, ch: any) => sum + (ch.subscribers || 0), 0);
  const totalViews = channels.reduce((sum: number, ch: any) => sum + (ch.totalViews || 0), 0);
  const estimatedRevenue = totalViews * 0.005; // $5 per 1K views average

  return {
    channels,
    videos,
    series,
    revenue: estimatedRevenue,
    subscribers: totalSubs,
    views: totalViews,
    currentPage: window.location.pathname
  };
}

/**
 * Execute assistant action
 */
export function executeAction(action: AssistantResponse['action']): void {
  if (!action) return;

  switch (action.type) {
    case 'navigate':
      if (action.target) {
        window.location.href = action.target;
      }
      break;

    case 'generate':
      // Trigger generation workflow
      console.log('Generate:', action.data);
      break;

    case 'create':
      // Trigger creation workflow
      console.log('Create:', action.data);
      break;

    case 'execute':
      // Execute custom command
      console.log('Execute:', action.data);
      break;

    case 'show':
      // Show specific UI element
      console.log('Show:', action.target);
      break;
  }
}
