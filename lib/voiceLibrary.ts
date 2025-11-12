/**
 * Professional Voice Library
 * High-quality AI voices for different content styles
 * Includes dark/mysterious voices like DarkWhisper channel
 */

export interface Voice {
  id: string;
  name: string;
  style: string;
  gender: 'male' | 'female' | 'neutral';
  description: string;
  bestFor: string[];
  preview?: string;
  provider: 'elevenlabs' | 'google' | 'azure' | 'amazon';
  voiceId: string;
  popular?: boolean;
  premium?: boolean;
}

export const voiceLibrary: Voice[] = [
  // Dark & Mysterious Voices (DarkWhisper Style)
  {
    id: 'dark-narrator-male',
    name: 'Dark Narrator',
    style: 'Dark & Mysterious',
    gender: 'male',
    description: 'Deep, mysterious voice perfect for horror, true crime, and dark storytelling. Similar to DarkWhisper channel.',
    bestFor: ['Horror Stories', 'True Crime', 'Mystery', 'Creepypasta', 'Dark History'],
    provider: 'elevenlabs',
    voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam - deep voice
    popular: true,
    premium: true,
  },
  {
    id: 'whisper-female',
    name: 'Dark Whisper',
    style: 'Whispered & Eerie',
    gender: 'female',
    description: 'Soft, whispered female voice that creates spine-chilling atmosphere. Perfect for psychological horror.',
    bestFor: ['Horror', 'ASMR Horror', 'Ghost Stories', 'Supernatural'],
    provider: 'elevenlabs',
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella - soft voice
    popular: true,
    premium: true,
  },

  // Motivational & Inspiring Voices
  {
    id: 'motivational-male',
    name: 'Power Speaker',
    style: 'Motivational & Energetic',
    gender: 'male',
    description: 'Strong, confident voice that inspires action. Perfect for motivation and success content.',
    bestFor: ['Motivation', 'Self-Help', 'Business', 'Success Stories', 'Fitness'],
    provider: 'elevenlabs',
    voiceId: 'ErXwobaYiN019PkySvjV', // Antoni - clear voice
    popular: true,
  },
  {
    id: 'calm-female-coach',
    name: 'Life Coach',
    style: 'Calm & Encouraging',
    gender: 'female',
    description: 'Warm, encouraging voice perfect for guided meditation and life advice.',
    bestFor: ['Meditation', 'Wellness', 'Life Advice', 'Mental Health'],
    provider: 'elevenlabs',
    voiceId: 'MF3mGyEYCl7XYWbV9V6O', // Elli - soft voice
  },

  // Educational & Professional Voices
  {
    id: 'professor-male',
    name: 'The Professor',
    style: 'Educational & Clear',
    gender: 'male',
    description: 'Clear, authoritative voice for educational content. Easy to understand and engaging.',
    bestFor: ['Education', 'Tutorials', 'Science', 'History', 'Documentaries'],
    provider: 'elevenlabs',
    voiceId: 'TxGEqnHWrfWFTfGW9XjX', // Josh - professional
    popular: true,
  },
  {
    id: 'narrator-female',
    name: 'Documentary Narrator',
    style: 'Professional & Smooth',
    gender: 'female',
    description: 'Smooth, professional female voice perfect for documentaries and explainer videos.',
    bestFor: ['Documentaries', 'News', 'Explainers', 'Business'],
    provider: 'elevenlabs',
    voiceId: 'ThT5KcBeYPX3keUQqHPh', // Dorothy - narrator
  },

  // Entertainment & Fun Voices
  {
    id: 'storyteller-male',
    name: 'Campfire Storyteller',
    style: 'Warm & Engaging',
    gender: 'male',
    description: 'Friendly, engaging voice that draws listeners in. Great for stories and entertainment.',
    bestFor: ['Storytelling', 'Fiction', 'Audiobooks', 'Entertainment'],
    provider: 'elevenlabs',
    voiceId: 'VR6AewLTigWG4xSOukaG', // Arnold - friendly
  },
  {
    id: 'energetic-female',
    name: 'Energetic Host',
    style: 'Upbeat & Fun',
    gender: 'female',
    description: 'High-energy, fun voice perfect for lifestyle and entertainment content.',
    bestFor: ['Lifestyle', 'Vlog', 'Travel', 'Food', 'Fashion'],
    provider: 'elevenlabs',
    voiceId: 'jsCqWAovK2LkecY7zXl4', // Freya - upbeat
  },

  // Gaming & Tech Voices
  {
    id: 'gamer-male',
    name: 'Gamer Pro',
    style: 'Excited & Dynamic',
    gender: 'male',
    description: 'Dynamic voice with gaming energy. Perfect for game commentary and tech reviews.',
    bestFor: ['Gaming', 'Tech Reviews', 'Esports', 'Game Guides'],
    provider: 'elevenlabs',
    voiceId: 'onwK4e9ZLuTAKqWW03F9', // Daniel - young voice
  },

  // ASMR & Relaxation Voices
  {
    id: 'asmr-female',
    name: 'ASMR Whisper',
    style: 'Soft & Relaxing',
    gender: 'female',
    description: 'Ultra-soft whispered voice designed for ASMR and sleep content.',
    bestFor: ['ASMR', 'Sleep Stories', 'Meditation', 'Relaxation'],
    provider: 'elevenlabs',
    voiceId: 'pFZP5JQG7iQjIQuC4Bku', // Lily - gentle
    premium: true,
  },

  // News & Serious Content
  {
    id: 'news-anchor-male',
    name: 'News Anchor',
    style: 'Authoritative & Clear',
    gender: 'male',
    description: 'Professional news anchor voice. Perfect for serious topics and breaking news.',
    bestFor: ['News', 'Politics', 'Finance', 'Current Events'],
    provider: 'elevenlabs',
    voiceId: 'yoZ06aMxZJJ28mfd3POQ', // Sam - narrator
  },

  // Kids & Family Voices
  {
    id: 'friendly-narrator-female',
    name: 'Story Time',
    style: 'Cheerful & Kind',
    gender: 'female',
    description: 'Warm, friendly voice perfect for children\'s content and family entertainment.',
    bestFor: ['Kids Content', 'Family', 'Education', 'Fairy Tales'],
    provider: 'elevenlabs',
    voiceId: 'jBpfuIE2acCO8z3wKNLl', // Gigi - cheerful
  },

  // Fallback Free Voices (Google TTS)
  {
    id: 'google-male-us',
    name: 'Standard Male (Free)',
    style: 'Clear & Natural',
    gender: 'male',
    description: 'Free high-quality male voice from Google. Good for all content types.',
    bestFor: ['All Content'],
    provider: 'google',
    voiceId: 'en-US-Neural2-D',
  },
  {
    id: 'google-female-us',
    name: 'Standard Female (Free)',
    style: 'Clear & Natural',
    gender: 'female',
    description: 'Free high-quality female voice from Google. Good for all content types.',
    bestFor: ['All Content'],
    provider: 'google',
    voiceId: 'en-US-Neural2-F',
  },
];

/**
 * Get voices by category
 */
export function getVoicesByStyle(style: string): Voice[] {
  return voiceLibrary.filter(voice => 
    voice.style.toLowerCase().includes(style.toLowerCase())
  );
}

/**
 * Get voices by content type
 */
export function getVoicesByContent(contentType: string): Voice[] {
  return voiceLibrary.filter(voice =>
    voice.bestFor.some(type => 
      type.toLowerCase().includes(contentType.toLowerCase())
    )
  );
}

/**
 * Get popular voices
 */
export function getPopularVoices(): Voice[] {
  return voiceLibrary.filter(voice => voice.popular);
}

/**
 * Get free voices
 */
export function getFreeVoices(): Voice[] {
  return voiceLibrary.filter(voice => !voice.premium);
}

/**
 * Get voice by ID
 */
export function getVoiceById(id: string): Voice | undefined {
  return voiceLibrary.find(voice => voice.id === id);
}

/**
 * Voice recommendations based on channel niche
 */
export function recommendVoices(niche: string): Voice[] {
  const nicheMap: Record<string, string[]> = {
    horror: ['dark-narrator-male', 'whisper-female', 'asmr-female'],
    'true crime': ['dark-narrator-male', 'news-anchor-male', 'narrator-female'],
    motivation: ['motivational-male', 'calm-female-coach', 'power-speaker'],
    gaming: ['gamer-male', 'energetic-female', 'storyteller-male'],
    education: ['professor-male', 'narrator-female', 'news-anchor-male'],
    lifestyle: ['energetic-female', 'friendly-narrator-female', 'storyteller-male'],
    tech: ['gamer-male', 'professor-male', 'news-anchor-male'],
    finance: ['news-anchor-male', 'professor-male', 'narrator-female'],
    kids: ['friendly-narrator-female', 'storyteller-male', 'energetic-female'],
  };

  const voiceIds = nicheMap[niche.toLowerCase()] || ['professor-male', 'narrator-female'];
  return voiceIds.map(id => getVoiceById(id)).filter(Boolean) as Voice[];
}
