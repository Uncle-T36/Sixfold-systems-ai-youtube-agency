/**
 * Channel Description Analyzer
 * Analyzes YouTube channel descriptions and provides money-making suggestions
 */

export interface AnalysisResult {
  score: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  moneyMakingOpportunities: string[];
  subscriberGrowthTips: string[];
  descriptionSuggestions: string[];
  urgentActions: string[];
}

export interface ChannelAnalysis {
  channelId: string;
  channelName: string;
  description: string;
  analyzedAt: string;
  analysis: AnalysisResult;
}

/**
 * Analyze channel description for money-making opportunities
 */
export async function analyzeChannelDescription(
  channelName: string,
  channelId: string,
  description: string
): Promise<ChannelAnalysis> {
  const prompt = `You are a YouTube monetization and growth expert. Analyze this channel description and provide actionable advice.

Channel: ${channelName}
Description: "${description || 'No description provided'}"

Analyze and provide:
1. MONETIZATION SCORE (0-100): How well positioned is this channel to make money?
2. STRENGTHS: What's working well? (2-3 points)
3. WEAKNESSES: What's missing or could be improved? (2-3 points)
4. MONEY-MAKING OPPORTUNITIES: Specific ways to increase revenue (3-5 actionable items)
5. SUBSCRIBER GROWTH TIPS: Tactics to grow the audience (3-5 actionable items)
6. DESCRIPTION IMPROVEMENTS: Better ways to write the description (2-3 specific rewrites)
7. URGENT ACTIONS: Top 3 things to do RIGHT NOW for maximum impact

Format your response as JSON:
{
  "score": 75,
  "strengths": ["Clear niche focus", "Professional tone"],
  "weaknesses": ["No call-to-action", "Missing contact info"],
  "moneyMakingOpportunities": ["Add affiliate links", "Mention Patreon", "Create course"],
  "subscriberGrowthTips": ["Add upload schedule", "Cross-promote social media", "Use keywords"],
  "descriptionSuggestions": ["Add: 'Subscribe for weekly tutorials'", "Include: Business email"],
  "urgentActions": ["Add affiliate disclosure", "Include Patreon link", "Add upload schedule"]
}

Be specific, actionable, and focus on MAKING MONEY and GROWING SUBSCRIBERS.`;

  try {
    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      console.warn('No Groq API key found, using fallback analysis');
      throw new Error('No API key available');
    }
    
    // Use Groq API for fast, free analysis
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '';
    
    // Extract JSON from response
    let analysisData: AnalysisResult;
    try {
      // Try to parse as JSON
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create structured data from text
        analysisData = parseTextAnalysis(aiResponse);
      }
    } catch (parseError) {
      console.error('Error parsing AI response, using text parser:', parseError);
      analysisData = parseTextAnalysis(aiResponse);
    }

    const analysis: ChannelAnalysis = {
      channelId,
      channelName,
      description,
      analyzedAt: new Date().toISOString(),
      analysis: analysisData
    };

    // Save analysis to localStorage
    saveAnalysis(analysis);

    return analysis;
  } catch (error) {
    console.error('Error analyzing channel:', error);
    
    // Return basic analysis if AI fails
    return {
      channelId,
      channelName,
      description,
      analyzedAt: new Date().toISOString(),
      analysis: {
        score: 50,
        strengths: ['Channel connected successfully'],
        weaknesses: ['Unable to perform deep analysis'],
        moneyMakingOpportunities: [
          'Add clear monetization links in description',
          'Include affiliate partnerships',
          'Mention paid products or services'
        ],
        subscriberGrowthTips: [
          'Add upload schedule to description',
          'Include social media links',
          'Use relevant keywords in description'
        ],
        descriptionSuggestions: [
          'Add a clear call-to-action',
          'Include contact information for business inquiries',
          'Highlight your unique value proposition'
        ],
        urgentActions: [
          'Review and update channel description',
          'Add monetization links',
          'Set consistent upload schedule'
        ]
      }
    };
  }
}

/**
 * Parse AI text response into structured analysis
 */
function parseTextAnalysis(text: string): AnalysisResult {
  const scoreMatch = text.match(/score["\s:]*(\d+)/i);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;

  const extractList = (section: string): string[] => {
    const regex = new RegExp(`${section}[:\\s]*\\[([\\s\\S]*?)\\]`, 'i');
    const match = text.match(regex);
    if (match) {
      try {
        return JSON.parse(`[${match[1]}]`);
      } catch {
        // Fallback: split by comma
        return match[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
      }
    }
    return [];
  };

  return {
    score,
    strengths: extractList('strengths').slice(0, 3) || ['Analysis in progress'],
    weaknesses: extractList('weaknesses').slice(0, 3) || ['Needs review'],
    moneyMakingOpportunities: extractList('moneyMakingOpportunities').slice(0, 5) || [
      'Add affiliate links to description',
      'Create premium content or course',
      'Set up membership program'
    ],
    subscriberGrowthTips: extractList('subscriberGrowthTips').slice(0, 5) || [
      'Optimize channel description with keywords',
      'Add consistent upload schedule',
      'Cross-promote on social media'
    ],
    descriptionSuggestions: extractList('descriptionSuggestions').slice(0, 3) || [
      'Add clear value proposition',
      'Include call-to-action'
    ],
    urgentActions: extractList('urgentActions').slice(0, 3) || [
      'Update channel description',
      'Add monetization strategy'
    ]
  };
}

/**
 * Save analysis to localStorage
 */
function saveAnalysis(analysis: ChannelAnalysis): void {
  try {
    const existing = JSON.parse(localStorage.getItem('channel_analyses') || '[]');
    
    // Remove old analysis for same channel
    const filtered = existing.filter((a: ChannelAnalysis) => a.channelId !== analysis.channelId);
    
    // Add new analysis
    filtered.push(analysis);
    
    localStorage.setItem('channel_analyses', JSON.stringify(filtered));
  } catch (error) {
    console.error('Error saving analysis:', error);
  }
}

/**
 * Get all saved analyses
 */
export function getAllAnalyses(): ChannelAnalysis[] {
  try {
    return JSON.parse(localStorage.getItem('channel_analyses') || '[]');
  } catch {
    return [];
  }
}

/**
 * Get analysis for specific channel
 */
export function getChannelAnalysis(channelId: string): ChannelAnalysis | null {
  const analyses = getAllAnalyses();
  return analyses.find(a => a.channelId === channelId) || null;
}

/**
 * Get all urgent notifications from analyses
 */
export function getUrgentNotifications(): Array<{
  channelName: string;
  channelId: string;
  message: string;
  type: 'money' | 'growth' | 'action';
  priority: 'high' | 'medium' | 'low';
}> {
  const analyses = getAllAnalyses();
  const notifications: Array<any> = [];

  analyses.forEach(analysis => {
    // Low score = urgent action needed
    if (analysis.analysis.score < 60) {
      notifications.push({
        channelName: analysis.channelName,
        channelId: analysis.channelId,
        message: `⚠️ Monetization Score: ${analysis.analysis.score}/100 - Needs immediate attention!`,
        type: 'action',
        priority: 'high'
      });
    }

    // Urgent actions
    analysis.analysis.urgentActions.forEach(action => {
      notifications.push({
        channelName: analysis.channelName,
        channelId: analysis.channelId,
        message: `🎯 ${action}`,
        type: 'action',
        priority: 'high'
      });
    });

    // Top money-making opportunity
    if (analysis.analysis.moneyMakingOpportunities.length > 0) {
      notifications.push({
        channelName: analysis.channelName,
        channelId: analysis.channelId,
        message: `💰 ${analysis.analysis.moneyMakingOpportunities[0]}`,
        type: 'money',
        priority: 'high'
      });
    }

    // Top growth tip
    if (analysis.analysis.subscriberGrowthTips.length > 0) {
      notifications.push({
        channelName: analysis.channelName,
        channelId: analysis.channelId,
        message: `📈 ${analysis.analysis.subscriberGrowthTips[0]}`,
        type: 'growth',
        priority: 'medium'
      });
    }
  });

  return notifications;
}
