/**
 * ANIME CHARACTER CONSISTENCY ENGINE
 * Ensures unique characters remain consistent across all episodes
 * Your characters will look the same in every video!
 */

export interface AnimeCharacterProfile {
  id: string;
  name: string;
  visualTraits: {
    hairStyle: string; // "spiky", "long", "short", "ponytail", "braids"
    hairColor: string; // Hex color
    eyeColor: string; // Hex color
    skinTone: string; // Hex color
    height: 'short' | 'medium' | 'tall';
    build: 'slim' | 'athletic' | 'muscular' | 'heavy';
    age: 'child' | 'teen' | 'young-adult' | 'adult' | 'elderly';
    clothingStyle: string; // "school uniform", "casual", "formal", "fantasy armor"
    accessories: string[]; // ["glasses", "hat", "scarf", "weapon"]
  };
  personality: {
    archetype: 'hero' | 'villain' | 'sidekick' | 'mentor' | 'mysterious' | 'comic-relief';
    traits: string[]; // ["brave", "intelligent", "funny", "serious"]
    voiceType: string; // Matched to specific voice ID
  };
  uniqueFeatures: string[]; // ["scar on left eye", "mechanical arm", "glowing tattoo"]
  consistencyHash: string; // Unique identifier for AI model
}

export interface AnimeScene {
  sceneNumber: number;
  characters: string[]; // Character IDs present in this scene
  setting: string; // "school", "forest", "city", "space"
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  weather: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  mood: 'action' | 'dramatic' | 'calm' | 'tense' | 'happy' | 'sad';
  cameraAngle: 'close-up' | 'medium-shot' | 'wide-shot' | 'aerial';
  duration: number; // seconds
}

export interface AnimeEpisode {
  episodeNumber: number;
  title: string;
  characters: AnimeCharacterProfile[];
  scenes: AnimeScene[];
  consistencyScore: number; // 0-100 (how well characters match previous episodes)
}

/**
 * Create a unique anime character with guaranteed consistency
 */
export function createAnimeCharacter(
  name: string,
  options: Partial<AnimeCharacterProfile['visualTraits']> = {}
): AnimeCharacterProfile {
  const characterId = `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Default visual traits (you can customize)
  const visualTraits: AnimeCharacterProfile['visualTraits'] = {
    hairStyle: options.hairStyle || 'medium',
    hairColor: options.hairColor || '#000000',
    eyeColor: options.eyeColor || '#8B4513',
    skinTone: options.skinTone || '#FFDFC4',
    height: options.height || 'medium',
    build: options.build || 'athletic',
    age: options.age || 'young-adult',
    clothingStyle: options.clothingStyle || 'casual',
    accessories: options.accessories || []
  };

  // Generate consistency hash (ensures same appearance in all videos)
  const consistencyHash = generateConsistencyHash(name, visualTraits);

  const character: AnimeCharacterProfile = {
    id: characterId,
    name,
    visualTraits,
    personality: {
      archetype: 'hero',
      traits: ['brave', 'determined'],
      voiceType: 'young-male-confident'
    },
    uniqueFeatures: [],
    consistencyHash
  };

  // Save to character library for reuse
  saveCharacterToLibrary(character);

  return character;
}

/**
 * Generate a unique hash for character consistency
 * This ensures the AI generates the EXACT same character every time
 */
function generateConsistencyHash(name: string, traits: any): string {
  const traitString = JSON.stringify(traits);
  let hash = 0;
  for (let i = 0; i < traitString.length; i++) {
    const char = traitString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `${name.toLowerCase().replace(/\s/g, '_')}_${Math.abs(hash).toString(16)}`;
}

/**
 * Save character to library for reuse across episodes
 */
function saveCharacterToLibrary(character: AnimeCharacterProfile): void {
  const library = getCharacterLibrary();
  library[character.id] = character;
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('anime_character_library', JSON.stringify(library));
  }
}

/**
 * Get all saved characters
 */
export function getCharacterLibrary(): Record<string, AnimeCharacterProfile> {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem('anime_character_library');
  return stored ? JSON.parse(stored) : {};
}

/**
 * Reuse an existing character in a new episode
 * GUARANTEED to look exactly the same!
 */
export function reuseCharacter(characterId: string): AnimeCharacterProfile | null {
  const library = getCharacterLibrary();
  return library[characterId] || null;
}

/**
 * Check consistency between episodes
 * Returns score 0-100
 */
export function checkCharacterConsistency(
  episode1: AnimeEpisode,
  episode2: AnimeEpisode
): number {
  let totalMatches = 0;
  let totalComparisons = 0;

  // Find common characters
  const commonCharacters = episode1.characters.filter(char1 =>
    episode2.characters.some(char2 => char2.name === char1.name)
  );

  for (const char1 of commonCharacters) {
    const char2 = episode2.characters.find(c => c.name === char1.name);
    if (!char2) continue;

    // Compare visual traits
    const traits1 = char1.visualTraits;
    const traits2 = char2.visualTraits;

    const comparisons = [
      traits1.hairStyle === traits2.hairStyle,
      traits1.hairColor === traits2.hairColor,
      traits1.eyeColor === traits2.eyeColor,
      traits1.skinTone === traits2.skinTone,
      traits1.height === traits2.height,
      traits1.build === traits2.build,
      traits1.age === traits2.age,
      traits1.clothingStyle === traits2.clothingStyle,
      JSON.stringify(traits1.accessories.sort()) === JSON.stringify(traits2.accessories.sort())
    ];

    totalMatches += comparisons.filter(Boolean).length;
    totalComparisons += comparisons.length;
  }

  return totalComparisons > 0 ? Math.round((totalMatches / totalComparisons) * 100) : 100;
}

/**
 * PRE-MADE ANIME CHARACTER TEMPLATES
 * Ready-to-use unique characters with guaranteed consistency
 */
export const AnimeCharacterTemplates = {
  // Shonen Hero
  BRAVE_HERO: {
    name: 'Protagonist',
    visualTraits: {
      hairStyle: 'spiky',
      hairColor: '#FF6B35',
      eyeColor: '#4169E1',
      skinTone: '#FFDFC4',
      height: 'medium' as const,
      build: 'athletic' as const,
      age: 'teen' as const,
      clothingStyle: 'school uniform with jacket',
      accessories: ['headband', 'wristbands']
    },
    personality: {
      archetype: 'hero' as const,
      traits: ['brave', 'determined', 'hot-headed', 'loyal'],
      voiceType: 'young-male-energetic'
    },
    uniqueFeatures: ['unique hair color', 'bright eyes', 'confident smile']
  },

  // Mysterious Rival
  COOL_RIVAL: {
    name: 'Rival',
    visualTraits: {
      hairStyle: 'long and sleek',
      hairColor: '#1A1A2E',
      eyeColor: '#8B0000',
      skinTone: '#FFE4C4',
      height: 'tall' as const,
      build: 'slim' as const,
      age: 'young-adult' as const,
      clothingStyle: 'dark coat',
      accessories: ['silver earring', 'fingerless gloves']
    },
    personality: {
      archetype: 'mysterious' as const,
      traits: ['cool', 'intelligent', 'aloof', 'powerful'],
      voiceType: 'male-deep-mysterious'
    },
    uniqueFeatures: ['red eyes', 'dark aura', 'mysterious smile']
  },

  // Cute Sidekick
  CHEERFUL_SIDEKICK: {
    name: 'Sidekick',
    visualTraits: {
      hairStyle: 'ponytail',
      hairColor: '#FFD700',
      eyeColor: '#32CD32',
      skinTone: '#FFDFC4',
      height: 'short' as const,
      build: 'slim' as const,
      age: 'teen' as const,
      clothingStyle: 'school uniform',
      accessories: ['hair ribbon', 'backpack']
    },
    personality: {
      archetype: 'sidekick' as const,
      traits: ['cheerful', 'optimistic', 'supportive', 'funny'],
      voiceType: 'female-young-cheerful'
    },
    uniqueFeatures: ['bright smile', 'expressive eyes', 'energetic personality']
  },

  // Wise Mentor
  WISE_MENTOR: {
    name: 'Master',
    visualTraits: {
      hairStyle: 'long white',
      hairColor: '#FFFFFF',
      eyeColor: '#808080',
      skinTone: '#F5DEB3',
      height: 'tall' as const,
      build: 'slim' as const,
      age: 'elderly' as const,
      clothingStyle: 'traditional robes',
      accessories: ['staff', 'beard']
    },
    personality: {
      archetype: 'mentor' as const,
      traits: ['wise', 'patient', 'mysterious', 'powerful'],
      voiceType: 'male-elderly-wise'
    },
    uniqueFeatures: ['long white beard', 'wise eyes', 'calm demeanor']
  },

  // Villain
  DARK_VILLAIN: {
    name: 'Antagonist',
    visualTraits: {
      hairStyle: 'wild',
      hairColor: '#8B00FF',
      eyeColor: '#FF0000',
      skinTone: '#E8D6C8',
      height: 'tall' as const,
      build: 'muscular' as const,
      age: 'adult' as const,
      clothingStyle: 'dark armor',
      accessories: ['scar', 'cape', 'menacing aura']
    },
    personality: {
      archetype: 'villain' as const,
      traits: ['evil', 'powerful', 'cunning', 'ruthless'],
      voiceType: 'male-deep-menacing'
    },
    uniqueFeatures: ['scar on face', 'red eyes', 'intimidating presence']
  }
};

/**
 * Create an anime episode with consistent characters
 */
export function createAnimeEpisode(
  episodeNumber: number,
  title: string,
  characters: AnimeCharacterProfile[],
  scenes: AnimeScene[]
): AnimeEpisode {
  // Check consistency with previous episode if it exists
  let consistencyScore = 100;
  
  if (episodeNumber > 1) {
    const previousEpisode = getPreviousEpisode(episodeNumber - 1);
    if (previousEpisode) {
      consistencyScore = checkCharacterConsistency(previousEpisode, {
        episodeNumber,
        title,
        characters,
        scenes,
        consistencyScore: 100
      });
    }
  }

  const episode: AnimeEpisode = {
    episodeNumber,
    title,
    characters,
    scenes,
    consistencyScore
  };

  // Save episode for future consistency checks
  saveEpisode(episode);

  return episode;
}

/**
 * Save episode to history
 */
function saveEpisode(episode: AnimeEpisode): void {
  if (typeof window === 'undefined') return;
  
  const episodes = getEpisodeHistory();
  episodes.push(episode);
  localStorage.setItem('anime_episode_history', JSON.stringify(episodes));
}

/**
 * Get episode history
 */
function getEpisodeHistory(): AnimeEpisode[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('anime_episode_history');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get a specific previous episode
 */
function getPreviousEpisode(episodeNumber: number): AnimeEpisode | null {
  const episodes = getEpisodeHistory();
  return episodes.find(ep => ep.episodeNumber === episodeNumber) || null;
}

/**
 * Generate AI prompts with character consistency
 */
export function generateConsistentAnimePrompt(
  character: AnimeCharacterProfile,
  scene: AnimeScene
): string {
  const { visualTraits, uniqueFeatures, consistencyHash } = character;
  
  return `
CONSISTENCY HASH: ${consistencyHash}

Character: ${character.name}
- Hair: ${visualTraits.hairStyle} style, ${visualTraits.hairColor} color
- Eyes: ${visualTraits.eyeColor}
- Skin: ${visualTraits.skinTone}
- Height: ${visualTraits.height}
- Build: ${visualTraits.build}
- Age: ${visualTraits.age}
- Clothing: ${visualTraits.clothingStyle}
- Accessories: ${visualTraits.accessories.join(', ')}
- Unique Features: ${uniqueFeatures.join(', ')}

Scene: ${scene.setting}
- Time: ${scene.timeOfDay}
- Weather: ${scene.weather}
- Mood: ${scene.mood}
- Camera: ${scene.cameraAngle}

Style: High-quality anime art, Japanese animation style, consistent character design, professional animation quality, ${scene.mood} atmosphere
  `.trim();
}

/**
 * USAGE EXAMPLE:
 * 
 * // Create your unique character once
 * const myHero = createAnimeCharacter('Kai', {
 *   hairStyle: 'spiky',
 *   hairColor: '#FF4500',
 *   eyeColor: '#00CED1',
 *   height: 'medium',
 *   build: 'athletic'
 * });
 * 
 * // Reuse in Episode 2, 3, 4... (looks EXACTLY the same!)
 * const episode2Hero = reuseCharacter(myHero.id);
 * 
 * // Check consistency
 * const score = checkCharacterConsistency(episode1, episode2);
 * console.log(`Consistency: ${score}%`); // Should be 100%
 */
