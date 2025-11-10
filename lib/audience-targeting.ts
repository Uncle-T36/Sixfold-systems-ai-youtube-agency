// Intelligent Audience Targeting System
// Analyzes channel description to create perfectly targeted content

interface AudienceProfile {
  ageRange: string;
  interests: string[];
  language: string;
  tone: 'casual' | 'professional' | 'educational' | 'entertaining' | 'inspirational';
  contentStyle: string;
  keywords: string[];
  painPoints: string[];
  goals: string[];
}

interface ChannelAnalysis {
  audienceProfile: AudienceProfile;
  contentStrategy: {
    videoLength: number;
    postingFrequency: string;
    bestTimes: string[];
    viralPotential: string[];
  };
  scriptingGuidelines: {
    hookStyle: string;
    callToAction: string;
    engagement: string[];
  };
}

export class AudienceTargetingEngine {
  
  /**
   * Analyzes channel description and creates detailed audience profile
   */
  analyzeChannelDescription(description: string, channelName: string, niche: string): ChannelAnalysis {
    console.log(`🎯 Analyzing audience for: ${channelName}`);
    
    const lowerDesc = description.toLowerCase();
    const lowerName = channelName.toLowerCase();
    
    // Detect audience demographics
    const audienceProfile = this.detectAudience(lowerDesc, lowerName, niche);
    
    // Generate content strategy
    const contentStrategy = this.generateContentStrategy(audienceProfile, niche);
    
    // Create scripting guidelines
    const scriptingGuidelines = this.generateScriptingGuidelines(audienceProfile);
    
    return {
      audienceProfile,
      contentStrategy,
      scriptingGuidelines
    };
  }

  private detectAudience(desc: string, name: string, niche: string): AudienceProfile {
    const combined = `${desc} ${name} ${niche}`;
    
    // Age detection
    let ageRange = '18-35'; // default
    if (this.containsAny(combined, ['kids', 'children', 'toddler', 'baby', 'parent'])) {
      ageRange = 'kids-3-12';
    } else if (this.containsAny(combined, ['teen', 'student', 'school', 'college'])) {
      ageRange = 'teens-13-19';
    } else if (this.containsAny(combined, ['young adult', 'millennial', 'gen z'])) {
      ageRange = 'young-adults-20-35';
    } else if (this.containsAny(combined, ['professional', 'career', 'business', 'entrepreneur'])) {
      ageRange = 'adults-25-45';
    } else if (this.containsAny(combined, ['senior', 'retirement', 'elderly'])) {
      ageRange = 'seniors-55+';
    }

    // Interest detection
    const interests = this.extractInterests(combined, niche);
    
    // Tone detection
    let tone: AudienceProfile['tone'] = 'educational';
    if (this.containsAny(combined, ['fun', 'entertaining', 'funny', 'comedy', 'laugh'])) {
      tone = 'entertaining';
    } else if (this.containsAny(combined, ['professional', 'business', 'corporate'])) {
      tone = 'professional';
    } else if (this.containsAny(combined, ['learn', 'tutorial', 'how to', 'education', 'teach'])) {
      tone = 'educational';
    } else if (this.containsAny(combined, ['inspire', 'motivate', 'success', 'achieve'])) {
      tone = 'inspirational';
    } else if (this.containsAny(combined, ['casual', 'everyday', 'lifestyle', 'vlog'])) {
      tone = 'casual';
    }

    // Content style
    const contentStyle = this.detectContentStyle(combined);
    
    // Keywords
    const keywords = this.extractKeywords(desc, niche);
    
    // Pain points and goals
    const painPoints = this.detectPainPoints(combined, niche);
    const goals = this.detectGoals(combined, niche);

    return {
      ageRange,
      interests,
      language: 'en', // default, can be enhanced
      tone,
      contentStyle,
      keywords,
      painPoints,
      goals
    };
  }

  private extractInterests(text: string, niche: string): string[] {
    const interestMap: Record<string, string[]> = {
      'technology': ['innovation', 'gadgets', 'software', 'AI', 'apps', 'tech news'],
      'kids-education': ['learning', 'creativity', 'fun activities', 'science', 'math', 'reading'],
      'lifestyle': ['wellness', 'productivity', 'home', 'fashion', 'travel', 'food'],
      'gaming': ['gameplay', 'strategies', 'reviews', 'streaming', 'esports'],
      'health': ['fitness', 'nutrition', 'mental health', 'wellness', 'exercise'],
      'motivation': ['success', 'personal growth', 'mindset', 'goals', 'inspiration']
    };

    const baseInterests = interestMap[niche.toLowerCase()] || ['general content'];
    
    // Add detected interests from text
    const detectedInterests: string[] = [];
    const interestKeywords = ['love', 'passionate', 'interested', 'focused', 'dedicated'];
    
    for (const keyword of interestKeywords) {
      if (text.includes(keyword)) {
        // Extract context around keyword
        const words = text.split(/\s+/);
        const index = words.findIndex(w => w.includes(keyword));
        if (index > 0) detectedInterests.push(words[index - 1]);
        if (index < words.length - 1) detectedInterests.push(words[index + 1]);
      }
    }

    return Array.from(new Set([...baseInterests, ...detectedInterests])).slice(0, 8);
  }

  private detectContentStyle(text: string): string {
    if (this.containsAny(text, ['quick', 'fast', 'short', 'bite-sized'])) {
      return 'short-form-snackable';
    } else if (this.containsAny(text, ['deep', 'detailed', 'comprehensive', 'in-depth'])) {
      return 'long-form-detailed';
    } else if (this.containsAny(text, ['list', 'top', 'best', 'worst'])) {
      return 'listicle-format';
    } else if (this.containsAny(text, ['story', 'narrative', 'journey'])) {
      return 'storytelling';
    } else if (this.containsAny(text, ['tutorial', 'how to', 'guide', 'step'])) {
      return 'tutorial-instructional';
    } else if (this.containsAny(text, ['review', 'compare', 'vs'])) {
      return 'review-comparison';
    }
    return 'mixed-format';
  }

  private extractKeywords(desc: string, niche: string): string[] {
    const words = desc.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3);
    
    // Remove common words
    const stopWords = ['this', 'that', 'with', 'from', 'have', 'been', 'your', 'their', 'about'];
    const filtered = words.filter(w => !stopWords.includes(w));
    
    // Add niche-specific keywords
    const nicheKeywords = [niche, ...niche.split('-')];
    
    return Array.from(new Set([...nicheKeywords, ...filtered])).slice(0, 15);
  }

  private detectPainPoints(text: string, niche: string): string[] {
    const painPointMap: Record<string, string[]> = {
      'technology': ['confusion with new tech', 'device compatibility', 'learning curve', 'staying updated'],
      'kids-education': ['keeping kids engaged', 'making learning fun', 'educational screen time', 'skill development'],
      'lifestyle': ['time management', 'organization', 'stress', 'work-life balance', 'productivity'],
      'gaming': ['improving skills', 'finding time to play', 'staying competitive', 'discovering new games'],
      'health': ['lack of motivation', 'time constraints', 'confusion about methods', 'consistency'],
      'motivation': ['procrastination', 'self-doubt', 'lack of direction', 'fear of failure', 'low energy']
    };

    return painPointMap[niche.toLowerCase()] || ['information overload', 'time constraints', 'uncertainty'];
  }

  private detectGoals(text: string, niche: string): string[] {
    const goalMap: Record<string, string[]> = {
      'technology': ['stay updated', 'master new tools', 'be more efficient', 'understand tech trends'],
      'kids-education': ['child development', 'academic success', 'creative growth', 'confident learners'],
      'lifestyle': ['better organization', 'improved productivity', 'healthier habits', 'happier life'],
      'gaming': ['level up skills', 'win more games', 'enjoy gaming more', 'build community'],
      'health': ['get fit', 'feel energized', 'build strength', 'improve wellness', 'healthy lifestyle'],
      'motivation': ['achieve goals', 'build confidence', 'success mindset', 'personal growth', 'overcome obstacles']
    };

    return goalMap[niche.toLowerCase()] || ['gain knowledge', 'improve skills', 'achieve success'];
  }

  private generateContentStrategy(profile: AudienceProfile, niche: string): ChannelAnalysis['contentStrategy'] {
    // Video length based on audience and content type
    let videoLength = 10; // default 10 minutes (good watch time)
    
    if (profile.ageRange === 'kids-3-12') {
      // Kids content - make it like a mini-movie to keep them engaged!
      if (profile.contentStyle === 'long-form-detailed' || niche.toLowerCase().includes('story') || niche.toLowerCase().includes('movie') || niche.toLowerCase().includes('adventure')) {
        videoLength = 45; // Full mini-movie for kids (like YouTube Kids shows)
      } else if (niche.toLowerCase().includes('cartoon') || niche.toLowerCase().includes('animation')) {
        videoLength = 30; // Episode-length cartoons
      } else {
        videoLength = 15; // Standard kids content
      }
    } else if (profile.tone === 'professional') {
      videoLength = 20; // longer for professional content
    } else if (profile.contentStyle === 'short-form-snackable') {
      videoLength = 5; // quick content
    } else if (profile.contentStyle === 'long-form-detailed') {
      videoLength = 40; // deep dives, tutorials, documentaries
    } else if (niche.toLowerCase().includes('tutorial') || niche.toLowerCase().includes('course')) {
      videoLength = 35; // Educational long-form
    }

    // Posting frequency
    const postingFrequency = profile.ageRange === 'kids-3-12' ? '2-3 videos/day' : '2-4 videos/day';

    // Best posting times
    const bestTimes = this.getBestPostingTimes(profile.ageRange);

    // Viral potential topics
    const viralPotential = this.getViralTopics(niche, profile);

    return {
      videoLength,
      postingFrequency,
      bestTimes,
      viralPotential
    };
  }

  private getBestPostingTimes(ageRange: string): string[] {
    const timeMap: Record<string, string[]> = {
      'kids-3-12': ['3-5 PM (after school)', '7-9 AM (before school)', '12-1 PM (lunch)'],
      'teens-13-19': ['3-6 PM (after school)', '8-11 PM (evening)', '12-2 PM (lunch)'],
      'young-adults-20-35': ['7-9 AM (commute)', '12-1 PM (lunch)', '6-10 PM (evening)'],
      'adults-25-45': ['6-8 AM (morning)', '12-1 PM (lunch break)', '8-10 PM (evening)'],
      'seniors-55+': ['9-11 AM (morning)', '2-4 PM (afternoon)', '7-9 PM (evening)']
    };

    return timeMap[ageRange] || timeMap['young-adults-20-35'];
  }

  private getViralTopics(niche: string, profile: AudienceProfile): string[] {
    // Combine niche trends with audience interests
    const base = [
      `${niche} trends that are going viral`,
      `surprising ${niche} facts that blow minds`,
      `common ${niche} mistakes everyone makes`,
      `${niche} secrets that pros don't share`,
      `fastest way to master ${niche}`
    ];

    // Add audience-specific topics
    if (profile.tone === 'entertaining') {
      base.push(`funny ${niche} moments`, `${niche} fails and wins`);
    } else if (profile.tone === 'educational') {
      base.push(`beginner's guide to ${niche}`, `${niche} explained simply`);
    } else if (profile.tone === 'inspirational') {
      base.push(`${niche} success stories`, `life-changing ${niche} journey`);
    }

    return base.slice(0, 10);
  }

  private generateScriptingGuidelines(profile: AudienceProfile): ChannelAnalysis['scriptingGuidelines'] {
    // Hook style based on tone
    const hookStyles: Record<string, string> = {
      'casual': 'Hey! You won\'t believe what I just discovered...',
      'professional': 'Today we\'re diving into a critical topic that will transform...',
      'educational': 'Have you ever wondered why... Let me explain...',
      'entertaining': 'Wait, this is absolutely insane! Check this out...',
      'inspirational': 'Imagine waking up tomorrow and finally achieving...'
    };

    const hookStyle = hookStyles[profile.tone] || hookStyles['educational'];

    // Call to action based on goals
    const ctaMap: Record<string, string> = {
      'casual': 'If you enjoyed this, hit that like button and subscribe for more!',
      'professional': 'For more insights like this, subscribe and join our professional community.',
      'educational': 'Want to learn more? Subscribe and I\'ll teach you everything you need to know!',
      'entertaining': 'That was wild, right? Smash that subscribe button for more crazy content!',
      'inspirational': 'Start your journey today - subscribe for daily motivation and success tips!'
    };

    const callToAction = ctaMap[profile.tone] || ctaMap['educational'];

    // Engagement strategies
    const engagementStrategies = [
      'Ask questions throughout the video',
      `Use ${profile.tone} language that resonates with ${profile.ageRange} audience`,
      'Include relatable examples from their daily life',
      'Address their pain points: ' + profile.painPoints[0],
      'Show how to achieve their goal: ' + profile.goals[0],
      'Use power words: ' + this.getPowerWords(profile.tone).join(', ')
    ];

    return {
      hookStyle,
      callToAction,
      engagement: engagementStrategies
    };
  }

  private getPowerWords(tone: string): string[] {
    const powerWordsMap: Record<string, string[]> = {
      'casual': ['amazing', 'awesome', 'cool', 'easy', 'fun', 'simple'],
      'professional': ['proven', 'effective', 'strategic', 'critical', 'essential', 'innovative'],
      'educational': ['learn', 'discover', 'understand', 'master', 'expert', 'guide'],
      'entertaining': ['crazy', 'insane', 'wild', 'hilarious', 'shocking', 'unbelievable'],
      'inspirational': ['transform', 'achieve', 'success', 'powerful', 'breakthrough', 'dream']
    };

    return powerWordsMap[tone] || powerWordsMap['educational'];
  }

  /**
   * Generate targeted video prompt for AI based on audience analysis
   */
  generateTargetedPrompt(channelAnalysis: ChannelAnalysis, topic: string, channelName: string): string {
    const { audienceProfile, contentStrategy, scriptingGuidelines } = channelAnalysis;

    return `Create a ${contentStrategy.videoLength}-minute YouTube video script for "${channelName}".

TARGET AUDIENCE:
- Age Range: ${audienceProfile.ageRange}
- Interests: ${audienceProfile.interests.join(', ')}
- Tone: ${audienceProfile.tone}
- Content Style: ${audienceProfile.contentStyle}

AUDIENCE PAIN POINTS:
${audienceProfile.painPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

AUDIENCE GOALS:
${audienceProfile.goals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

VIDEO TOPIC: ${topic}

SCRIPT REQUIREMENTS:
1. HOOK (First 15 seconds): ${scriptingGuidelines.hookStyle}
   - Must immediately address their pain point or desire
   - Use power words: ${this.getPowerWords(audienceProfile.tone).slice(0, 3).join(', ')}

2. MAIN CONTENT:
   - Speak in ${audienceProfile.tone} tone
   - Use examples relevant to ${audienceProfile.ageRange} audience
   - Address pain points: ${audienceProfile.painPoints.slice(0, 2).join(', ')}
   - Show path to goals: ${audienceProfile.goals.slice(0, 2).join(', ')}
   - Keep ${audienceProfile.contentStyle} format

3. ENGAGEMENT:
${scriptingGuidelines.engagement.map((e, i) => `   ${i + 1}. ${e}`).join('\n')}

4. CALL TO ACTION: ${scriptingGuidelines.callToAction}

5. SEO KEYWORDS: ${audienceProfile.keywords.slice(0, 8).join(', ')}

IMPORTANT:
- Every word should resonate with ${audienceProfile.ageRange} viewers
- Match the ${audienceProfile.tone} tone perfectly
- Address their specific interests: ${audienceProfile.interests.slice(0, 3).join(', ')}
- Make it ${contentStrategy.videoLength} minutes long (exactly)

Generate a complete script that will keep ${audienceProfile.ageRange} audience engaged for ${contentStrategy.videoLength} minutes and make them want to subscribe!`;
  }

  private containsAny(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }
}

export default AudienceTargetingEngine;
