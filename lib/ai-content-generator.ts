/**
 * 🤖 REAL AI CONTENT GENERATION
 * Production-ready AI integration with fallbacks
 * Supports: OpenAI GPT-4, Google Gemini, Anthropic Claude
 */

interface AIConfig {
  provider: 'openai' | 'gemini' | 'claude' | 'demo';
  apiKey: string | undefined;
  model: string;
}

interface ContentGenerationRequest {
  topic: string;
  style?: 'suspenseful' | 'dramatic' | 'investigative' | 'cinematic' | 'conversational' | 'educational';
  length?: 'short' | 'medium' | 'long'; // 5min, 10min, 15min+
  targetAudience?: string;
  niche?: string;
  additionalContext?: string;
}

interface GeneratedContent {
  script: string;
  title: string;
  description: string;
  tags: string[];
  thumbnailIdeas: string[];
  hooks: string[];
  callToAction: string;
  estimatedDuration: number;
  viralScore: number;
}

/**
 * Determine which AI provider to use
 */
function getAIConfig(): AIConfig {
  // Priority: OpenAI > Gemini > Claude > Demo
  if (process.env.OPENAI_API_KEY) {
    return {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4-turbo-preview'
    };
  }
  
  if (process.env.GOOGLE_GEMINI_API_KEY) {
    return {
      provider: 'gemini',
      apiKey: process.env.GOOGLE_GEMINI_API_KEY,
      model: 'gemini-pro'
    };
  }
  
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      provider: 'claude',
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-opus-20240229'
    };
  }

  console.warn('⚠️ No AI API key found - using demo mode');
  return {
    provider: 'demo',
    apiKey: undefined,
    model: 'demo'
  };
}

/**
 * Generate content using configured AI provider
 */
export async function generateContent(
  request: ContentGenerationRequest
): Promise<GeneratedContent> {
  const config = getAIConfig();

  try {
    switch (config.provider) {
      case 'openai':
        return await generateWithOpenAI(request, config);
      case 'gemini':
        return await generateWithGemini(request, config);
      case 'claude':
        return await generateWithClaude(request, config);
      default:
        return generateDemoContent(request);
    }
  } catch (error) {
    console.error('AI Generation Error:', error);
    return generateDemoContent(request);
  }
}

/**
 * OpenAI GPT-4 Integration
 */
async function generateWithOpenAI(
  request: ContentGenerationRequest,
  config: AIConfig
): Promise<GeneratedContent> {
  const prompt = buildPrompt(request);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert YouTube content creator who creates viral scripts.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return parseAIResponse(data.choices[0].message.content, request);
}

/**
 * Google Gemini Integration (FREE)
 */
async function generateWithGemini(
  request: ContentGenerationRequest,
  config: AIConfig
): Promise<GeneratedContent> {
  const prompt = buildPrompt(request);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2000
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  return parseAIResponse(text, request);
}

/**
 * Anthropic Claude Integration
 */
async function generateWithClaude(
  request: ContentGenerationRequest,
  config: AIConfig
): Promise<GeneratedContent> {
  const prompt = buildPrompt(request);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': config.apiKey!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  return parseAIResponse(data.content[0].text, request);
}

/**
 * Build AI prompt
 */
function buildPrompt(request: ContentGenerationRequest): string {
  const lengthMap = {
    short: '5 minutes',
    medium: '10 minutes',
    long: '15+ minutes'
  };

  const duration = lengthMap[request.length || 'medium'];

  return `Create a highly engaging YouTube video script about: "${request.topic}"

Style: ${request.style || 'engaging and entertaining'}
Duration: ${duration}
Target Audience: ${request.targetAudience || 'General audience 18-45'}
Niche: ${request.niche || 'Entertainment'}
${request.additionalContext ? `Additional Context: ${request.additionalContext}` : ''}

Please provide a complete response in this exact JSON format:
{
  "script": "Full video script with narration, including hooks, main content, and call-to-action",
  "title": "Attention-grabbing title (under 60 characters)",
  "description": "SEO-optimized description (150-200 words)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "thumbnailIdeas": ["idea1", "idea2", "idea3"],
  "hooks": ["hook1", "hook2", "hook3"],
  "callToAction": "Compelling CTA for end of video"
}

Requirements:
- Script should be conversational and engaging
- Include strong hooks in first 30 seconds
- Add emotional triggers and storytelling
- Include pattern interrupts every 2-3 minutes
- End with strong call-to-action
- Optimize for watch time and retention
- Make it viral-worthy`;
}

/**
 * Parse AI response into structured format
 */
function parseAIResponse(
  response: string,
  request: ContentGenerationRequest
): GeneratedContent {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        script: parsed.script || response,
        title: parsed.title || `Amazing ${request.topic} Story`,
        description: parsed.description || response.substring(0, 200),
        tags: parsed.tags || [request.topic, request.niche || 'viral', 'story'],
        thumbnailIdeas: parsed.thumbnailIdeas || ['Bold text with face', 'Mystery thumbnail'],
        hooks: parsed.hooks || ['Did you know...', 'You won\'t believe...'],
        callToAction: parsed.callToAction || 'Like and subscribe for more!',
        estimatedDuration: calculateDuration(parsed.script || response),
        viralScore: calculateViralScore(parsed.script || response)
      };
    }
    
    // Fallback if no JSON found
    return {
      script: response,
      title: `${request.topic} - You Won't Believe This!`,
      description: response.substring(0, 200) + '...',
      tags: [request.topic, request.niche || 'viral', 'amazing', 'story', 'trending'],
      thumbnailIdeas: [
        'Bold text overlay with contrasting colors',
        'Close-up face showing emotion',
        'Mystery/intrigue visual'
      ],
      hooks: [
        'Wait until you hear this...',
        'This will blow your mind...',
        'Nobody talks about this...'
      ],
      callToAction: 'If you enjoyed this, hit that like button and subscribe for more amazing content!',
      estimatedDuration: calculateDuration(response),
      viralScore: calculateViralScore(response)
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return generateDemoContent(request);
  }
}

/**
 * Calculate estimated video duration from script
 */
function calculateDuration(script: string): number {
  // Average speaking rate: 150 words per minute
  const words = script.split(/\s+/).length;
  return Math.ceil(words / 150);
}

/**
 * Calculate viral potential score
 */
function calculateViralScore(script: string): number {
  let score = 70; // Base score

  // Check for viral triggers
  const viralWords = ['amazing', 'shocking', 'incredible', 'unbelievable', 'secret', 'truth', 'revealed'];
  const lowerScript = script.toLowerCase();
  
  viralWords.forEach(word => {
    if (lowerScript.includes(word)) score += 3;
  });

  // Check for questions (engagement)
  const questions = (script.match(/\?/g) || []).length;
  score += Math.min(questions * 2, 10);

  // Check for emotional words
  const emotionalWords = ['love', 'hate', 'fear', 'hope', 'dream', 'nightmare'];
  emotionalWords.forEach(word => {
    if (lowerScript.includes(word)) score += 2;
  });

  return Math.min(score, 98); // Cap at 98
}

/**
 * Demo content generator (fallback)
 */
function generateDemoContent(request: ContentGenerationRequest): GeneratedContent {
  return {
    script: `[DEMO MODE - Set API key for real content]

**INTRO (0:00-0:30)**
Hey everyone! Today we're diving into ${request.topic}, and trust me, you won't believe what I discovered. But first, make sure to hit that like button and subscribe!

**HOOK (0:30-1:00)**
Did you know that ${request.topic} has been keeping a huge secret? I spent weeks researching this, and what I found will shock you.

**MAIN CONTENT (1:00-8:00)**
Let me break this down for you step by step...

[This is demo content. To generate real, high-quality AI scripts:
1. Get an API key from OpenAI, Google Gemini (FREE), or Anthropic
2. Add it to your .env.local file
3. Restart the app]

**CONCLUSION (8:00-10:00)**
So there you have it! If you found this valuable, smash that like button, subscribe, and turn on notifications. See you in the next video!`,
    
    title: `The ${request.topic} Secret They Don't Want You to Know!`,
    
    description: `In this video, we uncover the truth about ${request.topic}. This is something that most people don't know, and it could change everything. Watch until the end for the biggest revelation!

🔔 Subscribe for more amazing content
👍 Like if you enjoyed
💬 Comment your thoughts below

#${request.topic.replace(/\s+/g, '')} #Viral #MustWatch #Trending

⚠️ Note: This is demo content. Add your AI API key to generate real, unique scripts.`,
    
    tags: [
      request.topic,
      request.niche || 'entertainment',
      'viral',
      'trending',
      '2024',
      'must watch',
      'shocking',
      'amazing'
    ],
    
    thumbnailIdeas: [
      'Bold text: "THE TRUTH ABOUT [TOPIC]" with shocked face',
      'Split screen: Before/After or vs comparison',
      'Mystery silhouette with question marks'
    ],
    
    hooks: [
      `What if I told you that ${request.topic} is not what you think?`,
      'This one trick changed everything...',
      'Nobody talks about this, but they should...'
    ],
    
    callToAction: 'If this opened your eyes, hit like and subscribe. Drop a comment below with your thoughts!',
    
    estimatedDuration: 10,
    viralScore: 75
  };
}

/**
 * Check if AI is configured
 */
export function isAIConfigured(): boolean {
  return !!(
    process.env.OPENAI_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY ||
    process.env.ANTHROPIC_API_KEY
  );
}

/**
 * Get current AI provider
 */
export function getCurrentAIProvider(): string {
  const config = getAIConfig();
  return config.provider.toUpperCase();
}

/**
 * Generate video title only (faster)
 */
export async function generateTitle(topic: string): Promise<string> {
  const config = getAIConfig();
  
  if (config.provider === 'demo') {
    return `The ${topic} Secret Nobody Tells You!`;
  }

  try {
    // Quick title generation
    const prompt = `Generate a viral YouTube title (under 60 chars) for: ${topic}`;
    
    if (config.provider === 'gemini') {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
      const data = await response.json();
      return data.candidates[0].content.parts[0].text.replace(/"/g, '').trim();
    }
  } catch (error) {
    console.error('Title generation error:', error);
  }

  return `${topic} - This Will Change Everything!`;
}
