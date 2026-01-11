// Script Templates - Auto-learns and saves winning scripts
// Reuses proven structures automatically

export interface ScriptTemplate {
  id: string;
  name: string;
  niche: string;
  structure: ScriptSection[];
  performanceScore: number;
  usageCount: number;
  createdAt: string;
  lastUsed: string;
}

export interface ScriptSection {
  name: string;
  duration: string;
  content: string;
  tips: string[];
}

// Pre-built viral script templates by niche
const TEMPLATE_LIBRARY: Record<string, ScriptTemplate[]> = {
  tech: [
    {
      id: 'tech-review',
      name: 'Product Review',
      niche: 'tech',
      structure: [
        { name: 'Hook', duration: '0-15s', content: 'I\'ve been using [PRODUCT] for [TIME] and here\'s the truth nobody\'s telling you...', tips: ['Start with controversy or surprise', 'Show the product immediately'] },
        { name: 'Overview', duration: '15s-1m', content: 'Let me quickly show you what we\'re dealing with here. [PRODUCT] is [BRIEF DESCRIPTION]. It costs [PRICE] and promises [MAIN FEATURE].', tips: ['B-roll of product', 'Keep it snappy'] },
        { name: 'Pros', duration: '1-4m', content: 'First, what I LOVE about this. Number one: [PRO 1]. Number two: [PRO 2]. And the big one: [PRO 3].', tips: ['Show each feature', 'Be specific with examples'] },
        { name: 'Cons', duration: '4-6m', content: 'But here\'s where things get interesting. [CON 1] is a real problem because... And honestly, [CON 2] was disappointing.', tips: ['Be honest', 'Compare to alternatives'] },
        { name: 'Verdict', duration: '6-8m', content: 'So should YOU buy this? If you [USE CASE 1], absolutely yes. But if you [USE CASE 2], maybe look at [ALTERNATIVE] instead.', tips: ['Be specific about who it\'s for', 'Give clear recommendation'] },
        { name: 'CTA', duration: '8-10m', content: 'If this helped, smash that like button. And subscribe if you want more honest tech reviews. Links in the description!', tips: ['End strong', 'Simple CTA'] }
      ],
      performanceScore: 88,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    },
    {
      id: 'tech-comparison',
      name: 'Comparison Video',
      niche: 'tech',
      structure: [
        { name: 'Hook', duration: '0-15s', content: '[PRODUCT A] vs [PRODUCT B] - I bought both and tested them for [TIME]. The winner might surprise you.', tips: ['Show both products', 'Create anticipation'] },
        { name: 'Intro', duration: '15s-1m', content: 'Both of these [CATEGORY] claim to be the best. Let\'s see which one actually delivers.', tips: ['Quick specs comparison', 'Mention price difference'] },
        { name: 'Test 1', duration: '1-3m', content: 'First test: [CATEGORY]. And the winner here is clearly [PRODUCT] because...', tips: ['Show real results', 'Be objective'] },
        { name: 'Test 2', duration: '3-5m', content: 'Second test: [CATEGORY]. This one was close but [PRODUCT] edges ahead...', tips: ['Include metrics', 'Show proof'] },
        { name: 'Test 3', duration: '5-7m', content: 'Final test: [CATEGORY]. And honestly, I didn\'t expect this result...', tips: ['Save the surprising one for last', 'Build drama'] },
        { name: 'Verdict', duration: '7-9m', content: 'Overall winner: [PRODUCT]. But here\'s the thing - [PRODUCT B] is better if you [SPECIFIC USE CASE].', tips: ['Nuanced recommendation', 'Acknowledge both products'] },
        { name: 'CTA', duration: '9-10m', content: 'Which one would YOU choose? Comment below. And subscribe for more comparisons!', tips: ['Engage comments', 'Simple CTA'] }
      ],
      performanceScore: 85,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    }
  ],
  finance: [
    {
      id: 'finance-income',
      name: 'Income Reveal',
      niche: 'finance',
      structure: [
        { name: 'Hook', duration: '0-15s', content: 'I made $[AMOUNT] last month and I\'m going to show you exactly how - including every single income stream.', tips: ['Show proof immediately', 'Be specific with numbers'] },
        { name: 'Background', duration: '15s-1m', content: 'Quick background: I\'m [AGE], I started [X YEARS AGO], and it took me [TIME] to get here.', tips: ['Be relatable', 'Show the journey'] },
        { name: 'Income 1', duration: '1-3m', content: 'Income stream one: [SOURCE]. This brought in $[AMOUNT]. Here\'s exactly how it works...', tips: ['Break down the math', 'Show real numbers'] },
        { name: 'Income 2', duration: '3-5m', content: 'Income stream two: [SOURCE]. This is actually my favorite because...', tips: ['Share what you love about it', 'Be transparent about effort'] },
        { name: 'Income 3', duration: '5-7m', content: 'And the big one - income stream three: [SOURCE]. This alone generated $[AMOUNT].', tips: ['Build up to the biggest one', 'Give actionable advice'] },
        { name: 'How To Start', duration: '7-9m', content: 'If you want to do this yourself, here\'s exactly how to start. Step one...', tips: ['Make it actionable', 'Keep steps simple'] },
        { name: 'CTA', duration: '9-10m', content: 'I made a free guide with everything I know - link in description. Like this video if you want more income breakdowns!', tips: ['Lead magnet if possible', 'Simple CTA'] }
      ],
      performanceScore: 92,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    }
  ],
  motivation: [
    {
      id: 'motivation-speech',
      name: 'Motivational Speech',
      niche: 'motivation',
      structure: [
        { name: 'Power Opening', duration: '0-30s', content: 'Every single morning, you have a choice. You can stay in bed, stay comfortable, stay AVERAGE. Or you can GET UP and chase GREATNESS.', tips: ['Start with intensity', 'Dramatic music'] },
        { name: 'The Problem', duration: '30s-2m', content: 'Most people will never achieve their dreams. Not because they can\'t. But because they WON\'T. They won\'t put in the work. They won\'t sacrifice. They won\'t COMMIT.', tips: ['Call out the pain point', 'Build tension'] },
        { name: 'The Truth', duration: '2-4m', content: 'Here\'s what nobody tells you: Success isn\'t about talent. It\'s about showing up when you don\'t feel like it. It\'s about doing the work when nobody\'s watching.', tips: ['Drop the wisdom', 'Use pauses'] },
        { name: 'The Story', duration: '4-6m', content: '[PERSONAL STORY or FAMOUS EXAMPLE]. They failed [X] times. Everyone doubted them. But they kept going...', tips: ['Specific story', 'Relatable struggle'] },
        { name: 'The Call', duration: '6-8m', content: 'So what\'s YOUR excuse? What\'s stopping YOU? Because I promise you - the only thing standing between you and your dreams is the DECISION to start.', tips: ['Direct challenge', 'Build to climax'] },
        { name: 'Power Close', duration: '8-10m', content: 'Start TODAY. Not tomorrow. Not next week. TODAY. Your future self will thank you. Now GO. MAKE. IT. HAPPEN.', tips: ['Intense finish', 'Leave them fired up'] }
      ],
      performanceScore: 90,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    }
  ],
  education: [
    {
      id: 'education-explainer',
      name: 'Topic Explainer',
      niche: 'education',
      structure: [
        { name: 'Hook', duration: '0-15s', content: 'In the next [X] minutes, I\'m going to explain [TOPIC] in a way that finally makes sense.', tips: ['Promise clarity', 'Set expectations'] },
        { name: 'Why It Matters', duration: '15s-1m', content: 'Here\'s why you should care about [TOPIC]: [REASON]. This affects [REAL-WORLD IMPACT].', tips: ['Make it relevant', 'Connect to their life'] },
        { name: 'Foundation', duration: '1-3m', content: 'Let\'s start with the basics. [TOPIC] is essentially [SIMPLE EXPLANATION]. Think of it like [ANALOGY].', tips: ['Use analogies', 'Simple language'] },
        { name: 'Deep Dive', duration: '3-7m', content: 'Now let\'s go deeper. [DETAILED EXPLANATION]. And here\'s where it gets interesting...', tips: ['Build complexity gradually', 'Use visuals'] },
        { name: 'Real Examples', duration: '7-9m', content: 'Let me show you how this works in real life. [EXAMPLE 1]. [EXAMPLE 2].', tips: ['Concrete examples', 'Show don\'t tell'] },
        { name: 'Summary', duration: '9-10m', content: 'So to recap: [KEY POINT 1], [KEY POINT 2], [KEY POINT 3]. Now you understand [TOPIC]!', tips: ['Reinforce learning', 'Simple summary'] }
      ],
      performanceScore: 86,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    }
  ],
  gaming: [
    {
      id: 'gaming-challenge',
      name: 'Challenge Video',
      niche: 'gaming',
      structure: [
        { name: 'Hook', duration: '0-15s', content: 'I tried to beat [GAME] without [CONSTRAINT] and it nearly broke me.', tips: ['Show the challenge', 'Hint at struggle'] },
        { name: 'The Rules', duration: '15s-1m', content: 'The rules are simple: [RULE 1], [RULE 2], and [RULE 3]. If I break any of these, I have to start over.', tips: ['Clear rules', 'Build stakes'] },
        { name: 'Early Game', duration: '1-3m', content: 'The beginning was actually going well. [GAMEPLAY]. But then...', tips: ['Show the journey', 'Build confidence'] },
        { name: 'The Struggle', duration: '3-6m', content: 'This is where everything went wrong. [DIFFICULT MOMENT]. I died [X] times here alone.', tips: ['Show real failure', 'Make it dramatic'] },
        { name: 'The Breakthrough', duration: '6-8m', content: 'After [TIME/ATTEMPTS], I finally figured it out. [STRATEGY]. And then...', tips: ['Build to victory', 'Show the learning'] },
        { name: 'Victory/Conclusion', duration: '8-10m', content: '[VICTORY/ENDING]. After [TOTAL TIME], I finally did it. [REACTION].', tips: ['Satisfying conclusion', 'Real reaction'] }
      ],
      performanceScore: 88,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    }
  ],
  lifestyle: [
    {
      id: 'lifestyle-routine',
      name: 'Day/Routine Video',
      niche: 'lifestyle',
      structure: [
        { name: 'Morning Hook', duration: '0-15s', content: 'It\'s [TIME] and my productive day is about to begin. Let me show you exactly what that looks like.', tips: ['Aesthetic opening', 'Set the tone'] },
        { name: 'Morning Routine', duration: '15s-3m', content: 'First thing I do is [ACTIVITY]. This sets the tone for my entire day because [REASON].', tips: ['Show don\'t tell', 'Explain the why'] },
        { name: 'Main Activity', duration: '3-6m', content: 'The biggest part of my day is [ACTIVITY]. Here\'s how I approach it...', tips: ['Show the process', 'Add value'] },
        { name: 'Tips & Insights', duration: '6-8m', content: 'One thing I\'ve learned is [INSIGHT]. If you want to try this yourself, start with [TIP].', tips: ['Make it actionable', 'Share wisdom'] },
        { name: 'Evening Wind Down', duration: '8-9m', content: 'As the day ends, I like to [EVENING ROUTINE]. This helps me [BENEFIT].', tips: ['Complete the arc', 'Show balance'] },
        { name: 'Reflection', duration: '9-10m', content: 'Days like this remind me why I chose this lifestyle. If this inspired you, let me know in the comments.', tips: ['Emotional close', 'Engage audience'] }
      ],
      performanceScore: 84,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    }
  ],
  fitness: [
    {
      id: 'fitness-workout',
      name: 'Workout Guide',
      niche: 'fitness',
      structure: [
        { name: 'Hook', duration: '0-15s', content: 'This [BODY PART] workout changed everything for me. [X] exercises, [TIME] minutes, no equipment needed.', tips: ['Promise results', 'Show your physique'] },
        { name: 'Overview', duration: '15s-1m', content: 'We\'re doing [X] exercises, [X] sets each. This targets [MUSCLES]. Let\'s get into it.', tips: ['Quick overview', 'Set expectations'] },
        { name: 'Exercise 1', duration: '1-3m', content: 'Exercise one: [EXERCISE]. Watch my form here - [KEY POINTS]. Common mistake: [MISTAKE].', tips: ['Show proper form', 'Correct mistakes'] },
        { name: 'Exercise 2-3', duration: '3-6m', content: 'Next up: [EXERCISES]. These are key because [REASON]. Feel the burn in your [MUSCLE].', tips: ['Keep energy high', 'Encourage viewer'] },
        { name: 'Final Exercises', duration: '6-8m', content: 'Last ones - let\'s finish strong! [EXERCISES]. Push through, you\'ve got this!', tips: ['Motivate through fatigue', 'Show intensity'] },
        { name: 'Cooldown & CTA', duration: '8-10m', content: 'Great work! Stretch it out. Do this [FREQUENCY] and you\'ll see results in [TIMEFRAME]. Save this video and I\'ll see you next time!', tips: ['Celebrate completion', 'Set expectations for results'] }
      ],
      performanceScore: 87,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    }
  ]
};

// Get template for a niche (auto-selects best one)
export function getTemplateForNiche(niche: string): ScriptTemplate {
  const templates = TEMPLATE_LIBRARY[niche] || TEMPLATE_LIBRARY.tech;
  // Return highest performing template
  return [...templates].sort((a, b) => b.performanceScore - a.performanceScore)[0];
}

// Get all templates for a niche
export function getTemplatesForNiche(niche: string): ScriptTemplate[] {
  return TEMPLATE_LIBRARY[niche] || TEMPLATE_LIBRARY.tech;
}

// Get all available niches
export function getAvailableNiches(): string[] {
  return Object.keys(TEMPLATE_LIBRARY);
}

// Save a custom template (auto-learns from user's best scripts)
export function saveCustomTemplate(template: Omit<ScriptTemplate, 'id' | 'createdAt' | 'lastUsed'>): ScriptTemplate {
  const fullTemplate: ScriptTemplate = {
    ...template,
    id: `custom-${Date.now()}`,
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString()
  };
  
  if (typeof window !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem('custom_templates') || '[]');
    existing.push(fullTemplate);
    localStorage.setItem('custom_templates', JSON.stringify(existing));
  }
  
  return fullTemplate;
}

// Get custom templates
export function getCustomTemplates(): ScriptTemplate[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('custom_templates') || '[]');
}

// Generate script from template (fully automated)
export function generateScriptFromTemplate(
  template: ScriptTemplate,
  variables: Record<string, string>
): string {
  let script = '';
  
  template.structure.forEach(section => {
    script += `\n## ${section.name} (${section.duration})\n\n`;
    
    // Replace variables in content
    let content = section.content;
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`\\[${key}\\]`, 'gi'), value);
    });
    
    script += content + '\n';
    
    // Add tips as comments
    script += `\n*Tips: ${section.tips.join(' | ')}*\n`;
  });
  
  return script;
}

// Auto-fill template with topic (zero config)
export function autoFillTemplate(niche: string, topic: string): string {
  const template = getTemplateForNiche(niche);
  
  const variables: Record<string, string> = {
    'PRODUCT': topic,
    'TOPIC': topic,
    'GAME': topic,
    'CATEGORY': topic,
    'BODY PART': topic,
    'TIME': '30 days',
    'AMOUNT': '10,000',
    'X': '7',
    'ACTIVITY': topic,
    'EXERCISE': topic,
    'CONSTRAINT': 'taking damage'
  };
  
  // Update usage
  template.usageCount++;
  template.lastUsed = new Date().toISOString();
  
  return generateScriptFromTemplate(template, variables);
}

// Get template stats
export function getTemplateStats(): {
  totalTemplates: number;
  mostUsed: string;
  topPerforming: string;
} {
  const allTemplates = Object.values(TEMPLATE_LIBRARY).flat();
  const customTemplates = getCustomTemplates();
  const all = [...allTemplates, ...customTemplates];
  
  const mostUsed = [...all].sort((a, b) => b.usageCount - a.usageCount)[0];
  const topPerforming = [...all].sort((a, b) => b.performanceScore - a.performanceScore)[0];
  
  return {
    totalTemplates: all.length,
    mostUsed: mostUsed?.name || 'None',
    topPerforming: topPerforming?.name || 'None'
  };
}
