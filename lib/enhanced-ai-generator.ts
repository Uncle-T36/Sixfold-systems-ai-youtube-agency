// Enhanced AI Script Generator with GitHub Copilot Integration
// Leverages your existing GitHub Copilot subscription for superior content generation

import { OpenAI } from 'openai';

interface CopilotConfig {
  githubToken: string;
  copilotModel: string;
}

interface VideoScript {
  title: string;
  description: string;
  script: string;
  tags: string[];
  duration: number;
  monetizationHooks: string[];
  thumbnailPrompt: string;
}

export class EnhancedAIScriptGenerator {
  private openai: OpenAI;
  private copilotConfig: CopilotConfig;
  
  constructor() {
    // Initialize OpenAI with GitHub Copilot token for enhanced capabilities
    this.openai = new OpenAI({
      apiKey: process.env.GITHUB_COPILOT_TOKEN || process.env.OPENAI_API_KEY,
      baseURL: process.env.GITHUB_COPILOT_BASE_URL || 'https://api.openai.com/v1'
    });
    
    this.copilotConfig = {
      githubToken: process.env.GITHUB_COPILOT_TOKEN || '',
      copilotModel: 'gpt-4-turbo-preview' // Use latest model via Copilot
    };
  }

  async generateViralScript(channelConfig: any, topic?: string): Promise<VideoScript> {
    console.log(`🤖 Using GitHub Copilot AI to generate viral script for ${channelConfig.name}...`);

    const systemPrompt = this.buildSystemPrompt(channelConfig);
    const userPrompt = this.buildUserPrompt(channelConfig, topic);

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.copilotConfig.copilotModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 4000,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      });

      const response = completion.choices[0]?.message?.content || '';
      return this.parseAIResponse(response, channelConfig);

    } catch (error) {
      console.error('❌ Error with GitHub Copilot API:', error);
      // Fallback to local generation
      return this.generateFallbackScript(channelConfig, topic);
    }
  }

  private buildSystemPrompt(channelConfig: any): string {
    return `You are an expert YouTube content creator and monetization specialist with access to GitHub Copilot's enhanced capabilities. Your mission is to create viral, monetizable content that gets channels to 1000 subscribers and 4000 watch hours as fast as possible.

CHANNEL DETAILS:
- Name: ${channelConfig.name}
- Niche: ${channelConfig.niche}
- Target Age: ${channelConfig.target_age_group}
- Content Style: ${channelConfig.content_style}
- Target Duration: ${channelConfig.video_length_minutes} minutes
- Monetization Strategy: ${channelConfig.monetization_strategy}

VIRAL OPTIMIZATION REQUIREMENTS:
1. HOOK: Create an irresistible first 15 seconds that guarantees viewer retention
2. ALGORITHM GAMING: Use proven viral patterns and psychological triggers
3. MONETIZATION FOCUS: Include natural product placements and affiliate opportunities
4. ENGAGEMENT LOOPS: Build in subscription triggers and comment baits
5. WATCH TIME: Structure for maximum retention and session duration
6. SEO OPTIMIZATION: Include trending keywords and searchable phrases

MANDATORY ELEMENTS:
- Start with a shocking question or statement
- Promise a specific benefit or transformation
- Use pattern interrupts every 30-60 seconds
- Include social proof and authority building
- End with strong call-to-action for subscription
- Embed monetization hooks naturally throughout

Generate content that would realistically get 100K+ views and drive rapid subscriber growth.`;
  }

  private buildUserPrompt(channelConfig: any, topic?: string): string {
    const topicPrompt = topic ? `about "${topic}"` : `that would be trending right now in the ${channelConfig.niche} niche`;
    
    return `Create a high-converting ${channelConfig.video_length_minutes}-minute YouTube video script ${topicPrompt}.

REQUIREMENTS:
- Title: Click-worthy, under 60 characters, includes emotional trigger
- Hook: Irresistible opening that stops scrolling
- Structure: Intro (30s) → Main Content (${channelConfig.video_length_minutes - 2}min) → Outro (90s)
- Monetization: Natural product mentions for affiliate revenue
- Engagement: Built-in comment triggers and subscription calls
- Retention: Pattern interrupts and "coming up next" teasers

TARGET METRICS:
- Click-through rate: 12%+
- Average view duration: 70%+
- Engagement rate: 8%+
- Subscriber conversion: 3%+

Format your response as JSON with these fields:
{
  "title": "Viral title with emotional trigger",
  "hook": "Irresistible 15-second opener",
  "mainScript": "Full detailed script with timestamps",
  "monetizationHooks": ["Natural product placements"],
  "engagementTriggers": ["Comment baits and interaction prompts"],
  "tags": ["SEO optimized tags array"],
  "thumbnailPrompt": "Eye-catching thumbnail description",
  "description": "SEO optimized description with keywords"
}

Make this content so compelling that viewers can't click away!`;
  }

  private parseAIResponse(response: string, channelConfig: any): VideoScript {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : response;
      const parsed = JSON.parse(jsonContent);

      return {
        title: parsed.title || `${channelConfig.niche} Content That Changes Everything`,
        description: parsed.description || this.generateFallbackDescription(channelConfig),
        script: this.formatScript(parsed.hook, parsed.mainScript),
        tags: parsed.tags || this.generateFallbackTags(channelConfig),
        duration: channelConfig.video_length_minutes,
        monetizationHooks: parsed.monetizationHooks || [],
        thumbnailPrompt: parsed.thumbnailPrompt || this.generateThumbnailPrompt(channelConfig)
      };
    } catch (error) {
      console.warn('⚠️ Could not parse AI response, using fallback');
      return this.generateFallbackScript(channelConfig);
    }
  }

  private formatScript(hook: string, mainScript: string): string {
    const timestamp = new Date().toISOString();
    
    return `
[GENERATED BY GITHUB COPILOT AI - ${timestamp}]

=== VIRAL HOOK (0:00-0:15) ===
${hook}

[Visual: Attention-grabbing opener]
[Music: High-energy intro]

=== MAIN CONTENT ===
${mainScript}

=== ENGAGEMENT OUTRO (Final 90 seconds) ===
"If this video helped you, smash that like button and subscribe for more content like this! 

What was your biggest takeaway? Drop a comment below - I read every single one and respond personally!

And don't forget to hit that notification bell so you never miss my latest uploads. 

Coming up next, I've got an even more incredible video about [NEXT TOPIC] that you absolutely need to see. 

Until next time, keep [CHANNEL SPECIFIC SIGN-OFF]!"

[End screen: Subscribe button + suggested videos]
[Music: Outro theme]

=== SCRIPT OPTIMIZATION NOTES ===
- Pattern interrupts every 30-60 seconds
- Monetization hooks integrated naturally
- Comment triggers throughout
- Watch time optimization built-in
- Algorithm-friendly structure
`;
  }

  private generateFallbackScript(channelConfig: any, topic?: string): VideoScript {
    const defaultTopic = topic || this.getDefaultTopic(channelConfig.niche);
    
    return {
      title: `🔥 ${defaultTopic} - This Will Change Everything You Know!`,
      description: this.generateFallbackDescription(channelConfig),
      script: this.generateFallbackContent(channelConfig, defaultTopic),
      tags: this.generateFallbackTags(channelConfig),
      duration: channelConfig.video_length_minutes,
      monetizationHooks: this.generateMonetizationHooks(channelConfig),
      thumbnailPrompt: this.generateThumbnailPrompt(channelConfig)
    };
  }

  private generateFallbackDescription(channelConfig: any): string {
    return `🎯 In this ${channelConfig.video_length_minutes}-minute deep dive, discover the secrets that will transform your understanding of ${channelConfig.niche}!

🔥 What You'll Learn:
• Game-changing insights most people never discover
• Step-by-step methods that actually work
• Pro tips that save you time and money
• The #1 mistake everyone makes (and how to avoid it)

⏰ Timestamps:
00:00 - Mind-blowing introduction
01:30 - The secret method revealed
05:00 - Real-world examples
10:00 - Advanced techniques
15:00 - Conclusion and next steps

🎁 FREE Resources:
Links to everything mentioned in this video are in the comments below!

🔔 Subscribe for more ${channelConfig.niche} content that actually works!

#${channelConfig.niche} #viral #trending2025 #${channelConfig.target_age_group.replace('-', 'to')}`;
  }

  private generateFallbackTags(channelConfig: any): string[] {
    const baseKeywords = channelConfig.keywords || [];
    const viralTags = ['viral', 'trending', '2025', 'new', 'best', 'how to', 'tips', 'secrets'];
    
    return [...baseKeywords, ...viralTags].slice(0, 30);
  }

  private generateMonetizationHooks(channelConfig: any): string[] {
    const strategy = channelConfig.monetization_strategy;
    
    const hooks = [
      "Speaking of tools that actually work, the one I personally use is...",
      "If you want to try this yourself, I've left my recommended resources below...",
      "The exact method I showed you is available in my detailed guide...",
      "For those serious about results, here's what I recommend..."
    ];

    if (strategy.includes('affiliate')) {
      hooks.push("I only recommend products I personally use and love...");
    }
    
    if (strategy.includes('courses')) {
      hooks.push("Want the complete system? Check out my comprehensive course...");
    }

    return hooks;
  }

  private generateThumbnailPrompt(channelConfig: any): string {
    return `Create a high-CTR YouTube thumbnail:
- Bright, contrasting colors (reds, yellows, blues)
- Surprised or excited facial expression
- Large, bold text overlay (readable on mobile)
- Arrow pointing to key element
- High contrast background
- ${channelConfig.niche}-specific visual elements
- 1280x720 resolution, optimized for mobile viewing`;
  }

  private getDefaultTopic(niche: string): string {
    const topics = {
      'technology': 'AI Tools That Will Blow Your Mind',
      'education_kids': 'Fun Learning Games Kids Love',
      'lifestyle': 'Life Hacks That Actually Work',
      'gaming': 'Secret Gaming Tips Pros Use',
      'health': 'Health Tricks Doctors Recommend',
      'motivation': 'Success Habits of Millionaires'
    };
    
    return topics[niche as keyof typeof topics] || 'Amazing Content You Need to See';
  }

  private generateFallbackContent(channelConfig: any, topic: string): string {
    return `
=== VIRAL HOOK (0:00-0:15) ===
"Hold up! Before you scroll past this video, I'm about to show you something about ${topic} that will completely change your perspective. Stick around because what I'm about to reveal in the next ${channelConfig.video_length_minutes} minutes could transform everything you thought you knew!"

=== MAIN CONTENT ===
Welcome back to ${channelConfig.name}! If you're new here, I create content about ${channelConfig.niche} that actually gets results.

Today, we're diving deep into ${topic}, and I promise you - by the end of this video, you'll have a completely new understanding that most people never discover.

[Pattern interrupt - 2 minutes in]
But before we continue, let me ask you this: Have you ever wondered why some people seem to have all the luck when it comes to ${channelConfig.niche}? The answer might surprise you...

[Continue with detailed content, building value and maintaining engagement]

The secret that changed everything for me was this simple realization... [reveal key insight]

[Monetization hook - 8 minutes in]
Speaking of tools that actually work, I have to mention the one resource that completely transformed my approach to this...

[Continue building value and maintaining retention through to outro]

=== ENGAGEMENT OUTRO ===
[Standard outro with strong CTA as formatted above]
`;
  }

  // Batch generation for multiple channels
  async generateDailyContent(allChannelConfigs: any[]): Promise<{[key: string]: VideoScript}> {
    console.log('🚀 Generating daily content for all channels using GitHub Copilot...');
    
    const results: {[key: string]: VideoScript} = {};
    
    // Process channels in parallel for efficiency
    const promises = allChannelConfigs.map(async (config, index) => {
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, index * 1000));
      
      const script = await this.generateViralScript(config);
      return { channelId: config.id, script };
    });

    const completed = await Promise.allSettled(promises);
    
    completed.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results[result.value.channelId] = result.value.script;
      } else {
        console.error(`❌ Failed to generate content for channel ${index}:`, result.reason);
      }
    });

    console.log(`✅ Generated content for ${Object.keys(results).length} channels`);
    return results;
  }
}