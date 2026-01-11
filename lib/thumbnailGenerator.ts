// Thumbnail Generator - Auto-generates thumbnail concepts and text
// Requires ZERO input - analyzes title and generates everything

export interface ThumbnailConcept {
  id: string;
  type: 'face_reaction' | 'text_overlay' | 'before_after' | 'comparison' | 'dramatic' | 'minimalist' | 'tutorial';
  mainText: string;
  subText?: string;
  emoji?: string;
  colorScheme: {
    background: string;
    textColor: string;
    accent: string;
  };
  elements: string[];
  viralScore: number;
  instructions: string;
}

export interface ThumbnailPack {
  videoId: string;
  title: string;
  concepts: ThumbnailConcept[];
  recommended: ThumbnailConcept;
  createdAt: string;
}

// Color schemes that perform well
const VIRAL_COLORS = [
  { background: '#FF0000', textColor: '#FFFFFF', accent: '#FFFF00', name: 'YouTube Red' },
  { background: '#000000', textColor: '#FFFFFF', accent: '#FF0000', name: 'Dark Drama' },
  { background: '#1a1a2e', textColor: '#FFFFFF', accent: '#00FF00', name: 'Tech Dark' },
  { background: '#FFFFFF', textColor: '#000000', accent: '#FF6600', name: 'Clean White' },
  { background: '#0066FF', textColor: '#FFFFFF', accent: '#FFFF00', name: 'Trust Blue' },
  { background: '#8B00FF', textColor: '#FFFFFF', accent: '#00FFFF', name: 'Viral Purple' },
  { background: '#FF6B6B', textColor: '#FFFFFF', accent: '#4ECDC4', name: 'Trending Coral' },
  { background: '#2D3436', textColor: '#FFFFFF', accent: '#FDCB6E', name: 'Premium Dark' }
];

// Thumbnail text that converts
const POWER_OVERLAYS = {
  shock: ['WHAT?!', 'NO WAY', 'INSANE', 'WTF', 'OMG', 'EXPOSED'],
  money: ['$$$', 'FREE', 'PROFIT', 'RICH', 'WEALTH', '$10K+'],
  urgency: ['NOW', 'TODAY', '2025', 'NEW', 'BREAKING', 'URGENT'],
  emotion: ['😱', '🤯', '💀', '🔥', '💰', '🚀', '⚠️', '❌', '✅'],
  curiosity: ['SECRET', 'HIDDEN', 'TRUTH', 'REAL', 'REVEALED', 'LEAKED']
};

// Thumbnail types by niche
const NICHE_STYLES: Record<string, string[]> = {
  tech: ['comparison', 'minimalist', 'text_overlay'],
  gaming: ['face_reaction', 'dramatic', 'text_overlay'],
  finance: ['text_overlay', 'before_after', 'dramatic'],
  motivation: ['face_reaction', 'text_overlay', 'dramatic'],
  lifestyle: ['before_after', 'face_reaction', 'minimalist'],
  education: ['tutorial', 'text_overlay', 'comparison'],
  fitness: ['before_after', 'dramatic', 'face_reaction'],
  cooking: ['before_after', 'tutorial', 'face_reaction']
};

// Detect niche from title
function detectNiche(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (/tech|ai|code|programming|software|app|computer/i.test(title)) return 'tech';
  if (/game|gaming|play|stream|gamer/i.test(title)) return 'gaming';
  if (/money|invest|stock|crypto|rich|wealth|income/i.test(title)) return 'finance';
  if (/motivation|success|mindset|achieve|goal|dream/i.test(title)) return 'motivation';
  if (/life|travel|vlog|day|routine|style/i.test(title)) return 'lifestyle';
  if (/learn|course|tutorial|how to|guide|explain/i.test(title)) return 'education';
  if (/workout|fitness|gym|muscle|weight|health/i.test(title)) return 'fitness';
  if (/recipe|cook|food|meal|kitchen|eat/i.test(title)) return 'cooking';
  
  return 'tech';
}

// Extract key words for thumbnail
function extractKeywords(title: string): { main: string; sub: string } {
  // Remove common words and get impactful ones
  const stopWords = ['the', 'a', 'an', 'to', 'for', 'and', 'or', 'but', 'in', 'on', 'at', 'of', 'how', 'why', 'what', 'is', 'are', 'was', 'were', 'be', 'been', 'being'];
  const words = title.split(/\s+/).filter(w => 
    w.length > 2 && !stopWords.includes(w.toLowerCase())
  );
  
  // First 2-3 impactful words
  const main = words.slice(0, 2).join(' ').toUpperCase();
  const sub = words.slice(2, 4).join(' ');
  
  return { main: main || 'WATCH THIS', sub };
}

// Generate a single thumbnail concept
function generateConcept(
  title: string,
  type: ThumbnailConcept['type'],
  keywords: { main: string; sub: string },
  index: number
): ThumbnailConcept {
  const colorScheme = VIRAL_COLORS[index % VIRAL_COLORS.length];
  const emoji = POWER_OVERLAYS.emotion[Math.floor(Math.random() * POWER_OVERLAYS.emotion.length)];
  
  let mainText = keywords.main;
  let subText = keywords.sub;
  let elements: string[] = [];
  let instructions = '';
  
  switch (type) {
    case 'face_reaction':
      mainText = POWER_OVERLAYS.shock[Math.floor(Math.random() * POWER_OVERLAYS.shock.length)];
      elements = ['Shocked face expression', 'Pointing at text', 'Mouth open'];
      instructions = 'Use a surprised/shocked face photo. Add big text overlay. Arrow pointing to subject.';
      break;
      
    case 'text_overlay':
      mainText = keywords.main.substring(0, 15);
      subText = POWER_OVERLAYS.urgency[Math.floor(Math.random() * POWER_OVERLAYS.urgency.length)];
      elements = ['Bold text', 'Contrasting background', 'Simple focus'];
      instructions = 'Large bold text (3-4 words max). High contrast. Add emoji for pop.';
      break;
      
    case 'before_after':
      mainText = 'BEFORE → AFTER';
      subText = keywords.main;
      elements = ['Split screen', 'Clear transformation', 'Arrow between sides'];
      instructions = 'Split image 50/50. Left = before (dull). Right = after (vibrant). Arrow in middle.';
      break;
      
    case 'comparison':
      mainText = 'VS';
      subText = keywords.main;
      elements = ['Two subjects side by side', 'VS in center', 'Winner indicator'];
      instructions = 'Two items/options on each side. Big "VS" in center. One side slightly better lit.';
      break;
      
    case 'dramatic':
      mainText = POWER_OVERLAYS.curiosity[Math.floor(Math.random() * POWER_OVERLAYS.curiosity.length)];
      subText = keywords.main;
      elements = ['Dark background', 'Spotlight effect', 'Intense imagery'];
      instructions = 'Dark moody background. Subject lit dramatically. Red/orange accents. Mysterious vibe.';
      break;
      
    case 'minimalist':
      mainText = keywords.main.split(' ')[0] || 'CLICK';
      elements = ['Single subject', 'Lots of white space', 'One accent color'];
      instructions = 'Clean white/light background. One main subject centered. Single bold text element.';
      break;
      
    case 'tutorial':
      mainText = 'HOW TO';
      subText = keywords.main;
      elements = ['Step indicators', 'Clean layout', 'Result preview'];
      instructions = 'Show end result. "HOW TO" text. Clean professional look. Maybe numbered steps visual.';
      break;
  }
  
  // Calculate viral score based on elements
  let viralScore = 50;
  if (emoji) viralScore += 10;
  if (mainText.length <= 10) viralScore += 15;
  if (type === 'face_reaction') viralScore += 20;
  if (/shock|secret|reveal/i.test(mainText)) viralScore += 15;
  viralScore = Math.min(100, viralScore);
  
  return {
    id: `thumb-${Date.now()}-${index}`,
    type,
    mainText,
    subText,
    emoji,
    colorScheme,
    elements,
    viralScore,
    instructions
  };
}

// Generate full thumbnail pack (fully automated)
export function generateThumbnailPack(title: string, videoId?: string): ThumbnailPack {
  const niche = detectNiche(title);
  const keywords = extractKeywords(title);
  const preferredTypes = NICHE_STYLES[niche] || NICHE_STYLES.tech;
  
  // Generate 4 concepts
  const allTypes: ThumbnailConcept['type'][] = [
    'face_reaction', 'text_overlay', 'before_after', 'comparison', 'dramatic', 'minimalist', 'tutorial'
  ];
  
  const selectedTypes = [
    ...preferredTypes,
    ...allTypes.filter(t => !preferredTypes.includes(t))
  ].slice(0, 4) as ThumbnailConcept['type'][];
  
  const concepts = selectedTypes.map((type, index) => 
    generateConcept(title, type, keywords, index)
  );
  
  // Pick recommended (highest viral score)
  const recommended = [...concepts].sort((a, b) => b.viralScore - a.viralScore)[0];
  
  const pack: ThumbnailPack = {
    videoId: videoId || `vid-${Date.now()}`,
    title,
    concepts,
    recommended,
    createdAt: new Date().toISOString()
  };
  
  // Auto-save
  saveThumbnailPack(pack);
  
  return pack;
}

// Save thumbnail pack
function saveThumbnailPack(pack: ThumbnailPack): void {
  if (typeof window === 'undefined') return;
  
  const existing = JSON.parse(localStorage.getItem('thumbnail_packs') || '[]');
  existing.push(pack);
  localStorage.setItem('thumbnail_packs', JSON.stringify(existing));
}

// Get all thumbnail packs
export function getAllThumbnailPacks(): ThumbnailPack[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('thumbnail_packs') || '[]');
}

// Get quick thumbnail suggestion (one-liner)
export function quickThumbnailSuggestion(title: string): {
  text: string;
  emoji: string;
  style: string;
  colorTip: string;
} {
  const pack = generateThumbnailPack(title);
  const rec = pack.recommended;
  
  return {
    text: rec.mainText,
    emoji: rec.emoji || '🔥',
    style: rec.type.replace('_', ' '),
    colorTip: `${rec.colorScheme.textColor} text on ${rec.colorScheme.background} background`
  };
}

// Generate thumbnail text variants
export function generateThumbnailTexts(topic: string): string[] {
  return [
    topic.toUpperCase().split(' ').slice(0, 2).join(' '),
    POWER_OVERLAYS.shock[Math.floor(Math.random() * POWER_OVERLAYS.shock.length)],
    `${POWER_OVERLAYS.money[Math.floor(Math.random() * POWER_OVERLAYS.money.length)]} ${topic.split(' ')[0]}`,
    POWER_OVERLAYS.curiosity[Math.floor(Math.random() * POWER_OVERLAYS.curiosity.length)],
    `${POWER_OVERLAYS.urgency[Math.floor(Math.random() * POWER_OVERLAYS.urgency.length)]}`
  ];
}

// CSS gradient suggestions for thumbnails
export function getThumbnailGradient(niche: string): string {
  const gradients: Record<string, string> = {
    tech: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gaming: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    finance: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    motivation: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    lifestyle: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    education: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
    fitness: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    cooking: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  };
  
  return gradients[niche] || gradients.tech;
}
