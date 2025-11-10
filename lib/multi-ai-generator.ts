// Multi-AI Provider System - Best Free & Paid AI Models
// Automatically uses the best available AI with fallbacks

import OpenAI from 'openai';

interface AIProvider {
  name: string;
  model: string;
  cost: string;
  quality: number;
  speed: number;
  available: boolean;
}

interface VideoScript {
  title: string;
  description: string;
  script: string;
  tags: string[];
  duration: number;
  thumbnailPrompt: string;
  hooks: string[];
}

export class MultiAIGenerator {
  private providers: Map<string, any> = new Map();
  private availableProviders: AIProvider[] = [];

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // 1. OpenAI GPT-4 (Most Powerful - Use if you have credits)
    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      this.providers.set('openai-gpt4', openai);
      this.availableProviders.push({
        name: 'OpenAI GPT-4 Turbo',
        model: 'gpt-4-turbo-preview',
        cost: '$0.01 per 1K tokens (if you have credits)',
        quality: 10,
        speed: 8,
        available: true
      });
    }

    // 2. GitHub Copilot (Leverages your existing $10/month subscription!)
    if (process.env.GITHUB_COPILOT_TOKEN) {
      const copilot = new OpenAI({
        apiKey: process.env.GITHUB_COPILOT_TOKEN,
        baseURL: 'https://api.githubcopilot.com'
      });
      this.providers.set('github-copilot', copilot);
      this.availableProviders.push({
        name: 'GitHub Copilot',
        model: 'gpt-4',
        cost: 'FREE (using your existing subscription)',
        quality: 10,
        speed: 9,
        available: true
      });
    }

    // 3. Anthropic Claude (Excellent for creative content)
    if (process.env.ANTHROPIC_API_KEY) {
      this.availableProviders.push({
        name: 'Claude 3 Opus',
        model: 'claude-3-opus-20240229',
        cost: '$0.015 per 1K tokens',
        quality: 10,
        speed: 8,
        available: true
      });
    }

    // 4. Groq (ULTRA FAST & FREE - 30 req/min)
    if (process.env.GROQ_API_KEY) {
      const groq = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1'
      });
      this.providers.set('groq', groq);
      this.availableProviders.push({
        name: 'Groq Mixtral',
        model: 'mixtral-8x7b-32768',
        cost: 'FREE (30 requests/min)',
        quality: 8,
        speed: 10,
        available: true
      });
    }

    // 5. Together.ai (Fast & Affordable)
    if (process.env.TOGETHER_API_KEY) {
      const together = new OpenAI({
        apiKey: process.env.TOGETHER_API_KEY,
        baseURL: 'https://api.together.xyz/v1'
      });
      this.providers.set('together', together);
      this.availableProviders.push({
        name: 'Together Llama 3',
        model: 'meta-llama/Llama-3-70b-chat-hf',
        cost: '$0.0009 per 1K tokens',
        quality: 8,
        speed: 9,
        available: true
      });
    }

    // 6. Local Fallback (100% FREE - No API needed)
    this.availableProviders.push({
      name: 'Local Template Generator',
      model: 'template-based',
      cost: 'FREE (always available)',
      quality: 6,
      speed: 10,
      available: true
    });

    console.log(`✅ Initialized ${this.availableProviders.length} AI providers`);
  }

  async generateScript(channelConfig: any, topic?: string): Promise<VideoScript> {
    console.log(`🤖 Generating script with best available AI...`);

    // Import audience targeting engine
    const { AudienceTargetingEngine } = await import('./audience-targeting');
    const audienceEngine = new AudienceTargetingEngine();
    
    // Analyze channel description for targeted content
    const channelAnalysis = audienceEngine.analyzeChannelDescription(
      channelConfig.description || '',
      channelConfig.name || 'Channel',
      channelConfig.niche || 'general'
    );

    console.log(`🎯 Target Audience: ${channelAnalysis.audienceProfile.ageRange}`);
    console.log(`🎨 Content Tone: ${channelAnalysis.audienceProfile.tone}`);
    console.log(`⏱️  Video Length: ${channelAnalysis.contentStrategy.videoLength} minutes`);

    // Try providers in order of quality
    const sortedProviders = [...this.availableProviders]
      .filter(p => p.available)
      .sort((a, b) => b.quality - a.quality);

    for (const provider of sortedProviders) {
      try {
        console.log(`   Trying ${provider.name} (Quality: ${provider.quality}/10)...`);
        
        if (provider.model === 'template-based') {
          return this.generateLocalScript(channelConfig, topic, channelAnalysis);
        }

        const script = await this.generateWithProvider(
          provider.name.toLowerCase().replace(/\s+/g, '-'),
          provider.model,
          channelConfig,
          topic,
          channelAnalysis,
          audienceEngine
        );

        console.log(`✅ Success with ${provider.name}!`);
        return script;

      } catch (error) {
        console.log(`   ⚠️ ${provider.name} failed, trying next...`);
        continue;
      }
    }

    // Ultimate fallback
    return this.generateLocalScript(channelConfig, topic, channelAnalysis);
  }

  private async generateWithProvider(
    providerKey: string,
    model: string,
    channelConfig: any,
    topic?: string,
    channelAnalysis?: any,
    audienceEngine?: any
  ): Promise<VideoScript> {
    const provider = this.providers.get(providerKey);
    if (!provider) throw new Error('Provider not available');

    // Use targeted prompt if audience analysis available
    let prompt: string;
    if (channelAnalysis && audienceEngine) {
      const actualTopic = topic || this.generateTrendingTopic(channelConfig.niche || 'general');
      prompt = audienceEngine.generateTargetedPrompt(
        channelAnalysis,
        actualTopic,
        channelConfig.name || 'Channel'
      );
      console.log(`   🎯 Using targeted prompt for ${channelAnalysis.audienceProfile.ageRange} audience`);
    } else {
      prompt = this.buildPrompt(channelConfig, topic);
    }

    const completion = await provider.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: `You are an expert YouTube content creator. Create viral, engaging scripts that maximize watch time and subscriber conversion. Focus on hooks, storytelling, and calls-to-action.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 3000
    });

    const response = completion.choices[0]?.message?.content || '';
    return this.parseResponse(response, channelConfig);
  }

  private buildPrompt(channelConfig: any, topic?: string): string {
    const niche = channelConfig.niche || 'general';
    const duration = channelConfig.video_length_minutes || 5;
    const actualTopic = topic || this.generateTrendingTopic(niche);

    return `Create a ${duration}-minute YouTube script for a ${niche} channel.

TOPIC: ${actualTopic}

REQUIREMENTS:
1. VIRAL HOOK (First 15 seconds) - Must grab attention instantly
2. Main content with storytelling and examples
3. Multiple engagement points (questions, surprises, revelations)
4. Strong CTA at the end (subscribe, like, comment)
5. SEO-optimized title and description
6. 10-15 relevant tags

FORMAT YOUR RESPONSE AS:
TITLE: [Catchy, SEO-optimized title]
DESCRIPTION: [Full YouTube description with keywords]
TAGS: [tag1, tag2, tag3, etc.]

SCRIPT:
[Full script with timestamps]

THUMBNAIL_PROMPT: [Description for thumbnail image]`;
  }

  private generateTrendingTopic(niche: string): string {
    const topics: Record<string, string[]> = {
      technology: [
        'Latest AI Breakthrough That Will Change Everything',
        'Hidden Phone Features You Didn\'t Know Existed',
        'Tech Gadgets Under $50 That Are Mind-Blowing'
      ],
      'kids-education': [
        'Fun Science Experiments Kids Can Do At Home',
        'Learn Math Through Games and Stories',
        'Amazing Facts About Space and Planets'
      ],
      lifestyle: [
        '10 Life Hacks That Actually Work',
        'Morning Routines of Successful People',
        'Budget-Friendly Home Organization Tips'
      ],
      gaming: [
        'Secret Game Strategies Pro Players Use',
        'Hidden Easter Eggs Nobody Talks About',
        'Best Free Games You Need to Play in 2025'
      ],
      health: [
        '5-Minute Exercises That Transform Your Body',
        'Foods That Boost Your Energy Instantly',
        'Sleep Hacks Backed By Science'
      ],
      motivation: [
        'Overcome Any Obstacle With This Mindset',
        'Daily Habits of Highly Successful People',
        'Turn Failure Into Your Biggest Asset'
      ]
    };

    const nicheTopics = topics[niche.toLowerCase()] || topics['lifestyle'];
    return nicheTopics[Math.floor(Math.random() * nicheTopics.length)];
  }

  private parseResponse(response: string, channelConfig: any): VideoScript {
    // Extract structured data from AI response
    const titleMatch = response.match(/TITLE:\s*(.+)/i);
    const descMatch = response.match(/DESCRIPTION:\s*([\s\S]+?)(?=TAGS:|SCRIPT:|$)/i);
    const tagsMatch = response.match(/TAGS:\s*([\s\S]+?)(?=SCRIPT:|$)/i);
    const scriptMatch = response.match(/SCRIPT:\s*([\s\S]+?)(?=THUMBNAIL_PROMPT:|$)/i);
    const thumbnailMatch = response.match(/THUMBNAIL_PROMPT:\s*([\s\S]+)/i);

    return {
      title: titleMatch?.[1]?.trim() || this.generateTrendingTopic(channelConfig.niche),
      description: descMatch?.[1]?.trim() || 'AI-generated content for your channel',
      script: scriptMatch?.[1]?.trim() || response,
      tags: this.extractTags(tagsMatch?.[1] || ''),
      duration: channelConfig.video_length_minutes || 5,
      thumbnailPrompt: thumbnailMatch?.[1]?.trim() || 'Vibrant, eye-catching thumbnail',
      hooks: this.extractHooks(scriptMatch?.[1] || response)
    };
  }

  private generateLocalScript(channelConfig: any, topic?: string, channelAnalysis?: any): VideoScript {
    const niche = channelConfig.niche || 'general';
    const actualTopic = topic || this.generateTrendingTopic(niche);
    
    // Use targeted duration if available
    const duration = channelAnalysis?.contentStrategy?.videoLength || channelConfig.video_length_minutes || 5;

    // Use targeted description if available
    let description = `Learn about ${actualTopic}! In this video, we cover everything you need to know. Subscribe for more!`;
    if (channelAnalysis) {
      const profile = channelAnalysis.audienceProfile;
      description = `Perfect for ${profile.ageRange} audience! ${actualTopic} explained in ${profile.tone} style. ${profile.goals[0] || 'Achieve your goals'}! Subscribe for more ${profile.interests[0]} content!`;
    }

    // Use targeted hooks if available
    let hooks = [
      `Did you know that ${actualTopic.toLowerCase()}?`,
      `This will change everything you thought you knew!`,
      `You won't believe what happens next!`
    ];
    if (channelAnalysis?.scriptingGuidelines) {
      hooks = [channelAnalysis.scriptingGuidelines.hookStyle];
    }

    return {
      title: actualTopic,
      description: description,
      script: this.buildTemplateScript(actualTopic, duration, channelAnalysis),
      tags: this.generateTags(niche, actualTopic),
      duration: duration,
      thumbnailPrompt: `Bold text "${actualTopic}" with vibrant background and excited expression`,
      hooks: hooks
    };
  }

  private buildTemplateScript(topic: string, duration: number, channelAnalysis?: any): string {
    const sections = Math.floor(duration / 2) + 1;
    
    // Use targeted hook if available
    let hook = `Hey everyone! Today we're diving into something incredible - ${topic}!`;
    if (channelAnalysis?.scriptingGuidelines?.hookStyle) {
      hook = channelAnalysis.scriptingGuidelines.hookStyle.replace(/\.\.\./g, topic);
    }
    
    let script = `[0:00] HOOK: ${hook}\n\n`;
    script += `[0:15] If you stick around until the end, I'll share a secret tip that most people don't know!\n\n`;
    
    // Add pain point if available
    if (channelAnalysis?.audienceProfile?.painPoints?.[0]) {
      script += `[0:30] I know you've struggled with ${channelAnalysis.audienceProfile.painPoints[0]}, and today I'm showing you exactly how to overcome it!\n\n`;
    }
    
    for (let i = 1; i <= sections; i++) {
      const timestamp = `[${i * 2}:00]`;
      script += `${timestamp} Point ${i}: [Key insight about ${topic}]\n\n`;
    }
    
    // Use targeted CTA if available
    let cta = `Thanks for watching! If you found this helpful, smash that like button and subscribe for more content like this. Drop a comment below with your thoughts!`;
    if (channelAnalysis?.scriptingGuidelines?.callToAction) {
      cta = channelAnalysis.scriptingGuidelines.callToAction;
    }
    
    script += `[${duration - 1}:00] OUTRO: ${cta}\n`;
    
    return script;
  }

  private extractTags(tagsText: string): string[] {
    const tags = tagsText
      .split(/[,\n]/)
      .map(t => t.trim())
      .filter(t => t.length > 0 && t.length < 50);
    
    return tags.length > 0 ? tags : ['youtube', 'viral', 'trending', 'education'];
  }

  private generateTags(niche: string, topic: string): string[] {
    const words = topic.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    return [
      niche,
      ...words.slice(0, 5),
      'viral',
      'trending',
      '2025',
      'tutorial',
      'howto'
    ].slice(0, 15);
  }

  private extractHooks(script: string): string[] {
    const lines = script.split('\n');
    const hooks: string[] = [];
    
    for (const line of lines.slice(0, 10)) {
      if (line.includes('?') || line.includes('!') || line.toLowerCase().includes('hook')) {
        hooks.push(line.trim());
      }
    }
    
    return hooks.length > 0 ? hooks : [
      'This will blow your mind!',
      'You need to see this!',
      'Everything is about to change!'
    ];
  }

  getAvailableProviders(): AIProvider[] {
    return this.availableProviders.filter(p => p.available);
  }

  getBestProvider(): AIProvider {
    return this.availableProviders
      .filter(p => p.available)
      .sort((a, b) => b.quality - a.quality)[0];
  }
}

export default MultiAIGenerator;