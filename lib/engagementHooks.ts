// Engagement Hooks Database - Curated viral hooks auto-injected into all content
// Proven formulas that boost retention and engagement

export interface Hook {
  id: string;
  type: 'opener' | 'transition' | 'closer' | 'retention' | 'cta';
  text: string;
  whenToUse: string;
  retentionBoost: number; // percentage
  category: string;
}

// PROVEN OPENERS - First 5 seconds
export const VIRAL_OPENERS: Hook[] = [
  // Curiosity Gaps
  { id: 'o1', type: 'opener', text: 'What I\'m about to show you changed everything for me...', whenToUse: 'Tutorial/How-to videos', retentionBoost: 35, category: 'curiosity' },
  { id: 'o2', type: 'opener', text: 'Nobody\'s talking about this, but...', whenToUse: 'Any revelation content', retentionBoost: 42, category: 'curiosity' },
  { id: 'o3', type: 'opener', text: 'Here\'s something your [competitor/teacher/boss] doesn\'t want you to know...', whenToUse: 'Industry secrets', retentionBoost: 48, category: 'curiosity' },
  { id: 'o4', type: 'opener', text: 'I spent [X hours/days] testing this so you don\'t have to...', whenToUse: 'Reviews, comparisons', retentionBoost: 38, category: 'value' },
  { id: 'o5', type: 'opener', text: 'Stop scrolling. This is important...', whenToUse: 'Urgent/important info', retentionBoost: 32, category: 'pattern-interrupt' },
  
  // Story Hooks
  { id: 'o6', type: 'opener', text: 'Three months ago, I was [bad situation]. Now [good result]...', whenToUse: 'Transformation stories', retentionBoost: 45, category: 'story' },
  { id: 'o7', type: 'opener', text: 'This is the exact moment everything changed...', whenToUse: 'Personal stories', retentionBoost: 40, category: 'story' },
  { id: 'o8', type: 'opener', text: 'I made a huge mistake, and I don\'t want you to make the same one...', whenToUse: 'Mistake/lesson videos', retentionBoost: 43, category: 'story' },
  
  // Question Hooks
  { id: 'o9', type: 'opener', text: 'What if I told you [common belief] is completely wrong?', whenToUse: 'Myth-busting', retentionBoost: 41, category: 'question' },
  { id: 'o10', type: 'opener', text: 'Have you ever wondered why [phenomenon]?', whenToUse: 'Educational content', retentionBoost: 36, category: 'question' },
  
  // Bold Claims
  { id: 'o11', type: 'opener', text: 'This is the only [topic] video you\'ll ever need...', whenToUse: 'Comprehensive guides', retentionBoost: 38, category: 'bold' },
  { id: 'o12', type: 'opener', text: 'In the next [X] minutes, I\'m going to show you exactly how to [result]...', whenToUse: 'Tutorials', retentionBoost: 35, category: 'value' }
];

// RETENTION HOOKS - Keep them watching
export const RETENTION_HOOKS: Hook[] = [
  // Pattern Interrupts
  { id: 'r1', type: 'retention', text: 'But wait, it gets better...', whenToUse: 'Building to bigger point', retentionBoost: 25, category: 'transition' },
  { id: 'r2', type: 'retention', text: 'Now here\'s where it gets interesting...', whenToUse: 'Before key reveal', retentionBoost: 28, category: 'transition' },
  { id: 'r3', type: 'retention', text: 'I saved the best for last, so stick around...', whenToUse: 'Early in video', retentionBoost: 32, category: 'promise' },
  { id: 'r4', type: 'retention', text: 'What I\'m about to share next is crucial...', whenToUse: 'Mid-video boost', retentionBoost: 24, category: 'importance' },
  { id: 'r5', type: 'retention', text: 'Don\'t skip this part - it\'s the key to everything...', whenToUse: 'Before important section', retentionBoost: 30, category: 'importance' },
  
  // Questions
  { id: 'r6', type: 'retention', text: 'Can you guess what happened next?', whenToUse: 'Story moments', retentionBoost: 22, category: 'engagement' },
  { id: 'r7', type: 'retention', text: 'Let me know in the comments if this happened to you too...', whenToUse: 'Relatable moments', retentionBoost: 20, category: 'engagement' },
  
  // Open Loops
  { id: 'r8', type: 'retention', text: 'I\'ll explain why this matters in a second, but first...', whenToUse: 'Creating anticipation', retentionBoost: 35, category: 'open-loop' },
  { id: 'r9', type: 'retention', text: 'There\'s one more thing you need to know, and it\'s coming up...', whenToUse: 'Building to finale', retentionBoost: 33, category: 'open-loop' }
];

// TRANSITIONS - Smooth flow
export const TRANSITION_HOOKS: Hook[] = [
  { id: 't1', type: 'transition', text: 'Now that you understand [X], let\'s talk about [Y]...', whenToUse: 'Topic shift', retentionBoost: 15, category: 'logical' },
  { id: 't2', type: 'transition', text: 'This brings me to my next point...', whenToUse: 'Section change', retentionBoost: 12, category: 'logical' },
  { id: 't3', type: 'transition', text: 'Speaking of which...', whenToUse: 'Related topic', retentionBoost: 10, category: 'natural' },
  { id: 't4', type: 'transition', text: 'But here\'s the thing...', whenToUse: 'Contrasting point', retentionBoost: 18, category: 'contrast' },
  { id: 't5', type: 'transition', text: 'And this is exactly why...', whenToUse: 'Cause-effect', retentionBoost: 14, category: 'logical' }
];

// CLOSERS - End strong
export const VIRAL_CLOSERS: Hook[] = [
  { id: 'c1', type: 'closer', text: 'If you made it this far, you\'re already ahead of 90% of people...', whenToUse: 'Reward loyal viewers', retentionBoost: 25, category: 'reward' },
  { id: 'c2', type: 'closer', text: 'Now you have everything you need. The only thing left is to take action...', whenToUse: 'Motivational close', retentionBoost: 22, category: 'action' },
  { id: 'c3', type: 'closer', text: 'But remember, knowing isn\'t enough - you have to DO it...', whenToUse: 'Tutorial close', retentionBoost: 20, category: 'action' },
  { id: 'c4', type: 'closer', text: 'I\'ll be making more videos about this, so subscribe if you want to learn more...', whenToUse: 'Series content', retentionBoost: 28, category: 'cta' },
  { id: 'c5', type: 'closer', text: 'Drop a comment with your biggest takeaway - I read every single one...', whenToUse: 'Engagement push', retentionBoost: 30, category: 'engagement' }
];

// CTA HOOKS - Drive action
export const CTA_HOOKS: Hook[] = [
  { id: 'cta1', type: 'cta', text: 'If this helped you, smash that like button - it really helps the channel...', whenToUse: 'After value delivery', retentionBoost: 15, category: 'like' },
  { id: 'cta2', type: 'cta', text: 'Subscribe and hit the bell so you never miss a video...', whenToUse: 'Standard CTA', retentionBoost: 18, category: 'subscribe' },
  { id: 'cta3', type: 'cta', text: 'Comment "[keyword]" if you want me to make a video about [topic]...', whenToUse: 'Engagement boost', retentionBoost: 25, category: 'comment' },
  { id: 'cta4', type: 'cta', text: 'Share this with someone who needs to see it...', whenToUse: 'Shareable content', retentionBoost: 20, category: 'share' },
  { id: 'cta5', type: 'cta', text: 'Links to everything mentioned are in the description...', whenToUse: 'Resource videos', retentionBoost: 12, category: 'description' }
];

// ALL HOOKS combined
export const ALL_HOOKS: Hook[] = [
  ...VIRAL_OPENERS,
  ...RETENTION_HOOKS,
  ...TRANSITION_HOOKS,
  ...VIRAL_CLOSERS,
  ...CTA_HOOKS
];

// Get random hook by type
export function getRandomHook(type: Hook['type']): Hook {
  const hooks = ALL_HOOKS.filter(h => h.type === type);
  return hooks[Math.floor(Math.random() * hooks.length)];
}

// Get viral opener for a topic
export function getViralHook(topic?: string): string {
  const opener = getRandomHook('opener');
  return opener.text.replace('[X]', '10').replace('[topic]', topic || 'this');
}

// Get viral ending
export function getViralEnding(): string {
  const closer = getRandomHook('closer');
  const cta = getRandomHook('cta');
  return `${closer.text}\n\n${cta.text}`;
}

// Get retention hooks for a script (auto-inject)
export function getRetentionHooks(count: number = 3): Hook[] {
  const shuffled = [...RETENTION_HOOKS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Auto-enhance script with hooks
export function enhanceScriptWithHooks(script: string): string {
  const opener = getRandomHook('opener');
  const retention1 = getRandomHook('retention');
  const retention2 = getRandomHook('retention');
  const closer = getRandomHook('closer');
  const cta = getRandomHook('cta');
  
  // Split script into sections
  const lines = script.split('\n\n');
  const totalSections = lines.length;
  
  if (totalSections < 3) {
    return `${opener.text}\n\n${script}\n\n${closer.text}\n\n${cta.text}`;
  }
  
  // Inject at strategic points
  const section1 = Math.floor(totalSections * 0.25);
  const section2 = Math.floor(totalSections * 0.6);
  
  lines.splice(section2, 0, `\n**[RETENTION HOOK]** ${retention2.text}\n`);
  lines.splice(section1, 0, `\n**[RETENTION HOOK]** ${retention1.text}\n`);
  lines.unshift(`**[OPENER]** ${opener.text}\n`);
  lines.push(`\n**[CLOSER]** ${closer.text}\n\n**[CTA]** ${cta.text}`);
  
  return lines.join('\n\n');
}

// Get hooks optimized for a specific niche
export function getHooksForNiche(niche: string): {
  opener: Hook;
  retentionHooks: Hook[];
  closer: Hook;
  cta: Hook;
} {
  // Map niches to preferred hook categories
  const nichePreferences: Record<string, string[]> = {
    tech: ['value', 'curiosity', 'logical'],
    gaming: ['story', 'engagement', 'pattern-interrupt'],
    finance: ['value', 'bold', 'action'],
    motivation: ['story', 'bold', 'action'],
    lifestyle: ['story', 'natural', 'engagement'],
    education: ['curiosity', 'logical', 'value'],
    fitness: ['bold', 'action', 'reward']
  };
  
  const preferred = nichePreferences[niche] || nichePreferences.tech;
  
  // Find hooks matching preferences
  const preferredOpeners = VIRAL_OPENERS.filter(h => preferred.includes(h.category));
  const preferredRetention = RETENTION_HOOKS.filter(h => preferred.includes(h.category));
  const preferredClosers = VIRAL_CLOSERS.filter(h => preferred.includes(h.category));
  
  return {
    opener: preferredOpeners[Math.floor(Math.random() * preferredOpeners.length)] || getRandomHook('opener'),
    retentionHooks: preferredRetention.slice(0, 2),
    closer: preferredClosers[Math.floor(Math.random() * preferredClosers.length)] || getRandomHook('closer'),
    cta: getRandomHook('cta')
  };
}

// Generate complete hook package for a video
export function generateHookPackage(title: string, niche: string): {
  opener: string;
  midRolls: string[];
  closer: string;
  fullScript: string;
} {
  const hooks = getHooksForNiche(niche);
  
  const opener = hooks.opener.text;
  const midRolls = hooks.retentionHooks.map(h => h.text);
  const closer = `${hooks.closer.text}\n\n${hooks.cta.text}`;
  
  const fullScript = `
## Opening Hook (0-10 seconds)
${opener}

## Intro
Today we're covering ${title}. Let's dive in...

## Mid-Video Hook 1 (25% mark)
${midRolls[0]}

## Main Content
[Your main content here]

## Mid-Video Hook 2 (60% mark)
${midRolls[1] || 'Now here\'s where it gets really interesting...'}

## Conclusion
[Wrap up your main points]

## Closing + CTA
${closer}
  `.trim();
  
  return { opener, midRolls, closer, fullScript };
}

// Calculate estimated retention boost
export function calculateRetentionBoost(hooks: Hook[]): number {
  const totalBoost = hooks.reduce((sum, h) => sum + h.retentionBoost, 0);
  // Diminishing returns after 3 hooks
  const effectiveBoost = Math.min(totalBoost, 100) * 0.8;
  return Math.round(effectiveBoost);
}
