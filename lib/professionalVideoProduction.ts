/**
 * 🎬 PROFESSIONAL VIDEO PRODUCTION SYSTEM
 * HD/4K Quality | Character Voice Mapping | AI Subtitles | Professional Audio
 */

export interface VideoQualitySettings {
  resolution: '1080p' | '1440p' | '4K' | '8K';
  fps: 24 | 30 | 60 | 120;
  bitrate: number; // Mbps
  codec: 'H.264' | 'H.265' | 'VP9' | 'AV1';
  hdr: boolean;
  colorSpace: 'sRGB' | 'DCI-P3' | 'Rec.2020';
}

export interface VoiceProfile {
  characterId: string;
  characterName: string;
  voiceId: string;
  voiceName: string;
  gender: 'male' | 'female' | 'neutral' | 'child';
  age: 'child' | 'teen' | 'young-adult' | 'adult' | 'elderly';
  accent: string; // 'US', 'UK', 'Australian', 'Indian', 'Neutral'
  personality: string; // 'authoritative', 'friendly', 'mysterious', 'energetic'
  pitch: number; // -20 to +20
  speed: number; // 0.5 to 2.0
  emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'excited' | 'fearful' | 'dramatic';
  sampleAudio?: string;
}

export interface SubtitleConfig {
  enabled: boolean;
  language: string;
  style: 'minimal' | 'professional' | 'youtube' | 'cinematic' | 'gaming';
  font: string;
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  position: 'top' | 'center' | 'bottom';
  animation: 'none' | 'fade' | 'slide' | 'typewriter' | 'bounce';
  wordHighlight: boolean; // Highlight current word being spoken
  speakerLabels: boolean; // Show who's speaking
  timestamps: boolean;
}

export interface AudioMixing {
  dialogueVolume: number; // -60 to 0 dB
  musicVolume: number;
  sfxVolume: number;
  ambientVolume: number;
  normalization: boolean; // Auto-level audio
  compression: {
    enabled: boolean;
    threshold: number;
    ratio: number;
  };
  eqSettings: {
    bass: number;
    mid: number;
    treble: number;
  };
  spatialAudio: boolean; // 3D audio positioning
}

export interface CharacterVoiceMapping {
  characterId: string;
  characterName: string;
  description: string;
  voiceProfile: VoiceProfile;
  dialogueLines: {
    sceneId: string;
    lineNumber: number;
    text: string;
    emotion: string;
    timestamp: number;
  }[];
  voiceConsistency: number; // 0-100% match across episodes
}

// Professional Voice Library
export const VOICE_LIBRARY = {
  narrators: [
    {
      id: 'narrator-male-authoritative',
      name: 'David - Documentary Narrator',
      gender: 'male' as const,
      age: 'adult' as const,
      accent: 'US',
      personality: 'authoritative',
      description: 'Deep, commanding voice perfect for documentaries and true crime',
      bestFor: ['documentaries', 'true-crime', 'history', 'business']
    },
    {
      id: 'narrator-female-professional',
      name: 'Sarah - Professional Narrator',
      gender: 'female' as const,
      age: 'adult' as const,
      accent: 'UK',
      personality: 'professional',
      description: 'Clear, articulate voice ideal for educational content',
      bestFor: ['education', 'tutorials', 'explainers', 'corporate']
    },
    {
      id: 'narrator-male-mysterious',
      name: 'Vincent - Mystery Narrator',
      gender: 'male' as const,
      age: 'adult' as const,
      accent: 'US',
      personality: 'mysterious',
      description: 'Gravelly, suspenseful voice for mystery and thriller content',
      bestFor: ['mystery', 'thriller', 'paranormal', 'conspiracy']
    }
  ],
  characters: [
    {
      id: 'voice-young-male-energetic',
      name: 'Jake - Young Energetic Male',
      gender: 'male' as const,
      age: 'young-adult' as const,
      accent: 'US',
      personality: 'energetic',
      description: 'Enthusiastic, upbeat voice for main characters',
      emotions: ['happy', 'excited', 'neutral', 'dramatic']
    },
    {
      id: 'voice-young-female-friendly',
      name: 'Emma - Friendly Young Female',
      gender: 'female' as const,
      age: 'young-adult' as const,
      accent: 'US',
      personality: 'friendly',
      description: 'Warm, approachable voice for protagonists',
      emotions: ['happy', 'sad', 'excited', 'fearful', 'neutral']
    },
    {
      id: 'voice-adult-male-serious',
      name: 'Marcus - Serious Adult Male',
      gender: 'male' as const,
      age: 'adult' as const,
      accent: 'UK',
      personality: 'authoritative',
      description: 'Mature, commanding voice for authority figures',
      emotions: ['neutral', 'angry', 'dramatic', 'sad']
    },
    {
      id: 'voice-adult-female-wise',
      name: 'Diana - Wise Adult Female',
      gender: 'female' as const,
      age: 'adult' as const,
      accent: 'UK',
      personality: 'wise',
      description: 'Calm, intelligent voice for mentor characters',
      emotions: ['neutral', 'happy', 'sad', 'dramatic']
    },
    {
      id: 'voice-child-innocent',
      name: 'Lily - Innocent Child',
      gender: 'female' as const,
      age: 'child' as const,
      accent: 'US',
      personality: 'innocent',
      description: 'Sweet, youthful voice for child characters',
      emotions: ['happy', 'sad', 'fearful', 'excited']
    },
    {
      id: 'voice-elderly-male-gruff',
      name: 'Harold - Gruff Elderly Male',
      gender: 'male' as const,
      age: 'elderly' as const,
      accent: 'US',
      personality: 'gruff',
      description: 'Weathered, experienced voice for older characters',
      emotions: ['neutral', 'angry', 'sad', 'happy']
    },
    {
      id: 'voice-villain-menacing',
      name: 'Victor - Menacing Villain',
      gender: 'male' as const,
      age: 'adult' as const,
      accent: 'Neutral',
      personality: 'menacing',
      description: 'Dark, threatening voice for antagonists',
      emotions: ['angry', 'dramatic', 'neutral', 'excited']
    }
  ]
};

/**
 * Automatically assigns unique voices to characters based on their profiles
 */
export function assignVoicesToCharacters(characters: any[]): CharacterVoiceMapping[] {
  const voiceMappings: CharacterVoiceMapping[] = [];
  const usedVoices = new Set<string>();

  characters.forEach((char, index) => {
    // Determine best voice based on character attributes
    let selectedVoice;

    if (char.role === 'narrator') {
      // Assign narrator voice based on content type
      const narratorType = char.personality?.includes('authoritative') ? 0 : 
                          char.personality?.includes('professional') ? 1 : 2;
      selectedVoice = VOICE_LIBRARY.narrators[narratorType];
    } else {
      // Find best matching voice for character
      const availableVoices = VOICE_LIBRARY.characters.filter(v => !usedVoices.has(v.id));
      
      selectedVoice = availableVoices.find(v => {
        if (char.age === 'child' && v.age === 'child') return true;
        if (char.age === 'elderly' && v.age === 'elderly') return true;
        if (char.role === 'antagonist' && v.personality === 'menacing') return true;
        if (char.gender && v.gender === char.gender && v.age === 'young-adult') return true;
        return false;
      }) || availableVoices[0] || VOICE_LIBRARY.characters[index % VOICE_LIBRARY.characters.length];
    }

    usedVoices.add(selectedVoice.id);

    const voiceProfile: VoiceProfile = {
      characterId: char.id,
      characterName: char.name,
      voiceId: selectedVoice.id,
      voiceName: selectedVoice.name,
      gender: selectedVoice.gender,
      age: selectedVoice.age,
      accent: selectedVoice.accent,
      personality: selectedVoice.personality,
      pitch: char.pitch || 0,
      speed: char.speed || 1.0,
      emotion: 'neutral'
    };

    voiceMappings.push({
      characterId: char.id,
      characterName: char.name,
      description: char.description || '',
      voiceProfile,
      dialogueLines: [],
      voiceConsistency: 100
    });
  });

  return voiceMappings;
}

/**
 * Generates accurate subtitles with speaker identification
 */
export function generateProfessionalSubtitles(
  dialogue: any[],
  voiceMappings: CharacterVoiceMapping[],
  config: SubtitleConfig
): any[] {
  const subtitles = dialogue.map((line, index) => {
    const voiceMapping = voiceMappings.find(vm => vm.characterId === line.characterId);
    const characterName = voiceMapping?.characterName || 'Speaker';

    return {
      id: index + 1,
      startTime: line.timestamp,
      endTime: line.timestamp + line.duration,
      text: line.text,
      speaker: config.speakerLabels ? characterName : null,
      style: config.style,
      position: config.position,
      animation: config.animation,
      wordTimings: generateWordTimings(line.text, line.duration),
      voiceId: voiceMapping?.voiceProfile.voiceId
    };
  });

  return subtitles;
}

/**
 * Generates word-level timing for subtitle highlighting
 */
function generateWordTimings(text: string, duration: number): any[] {
  const words = text.split(' ');
  const timePerWord = duration / words.length;
  
  return words.map((word, index) => ({
    word,
    startTime: index * timePerWord,
    endTime: (index + 1) * timePerWord
  }));
}

/**
 * Professional video rendering with HD quality
 */
export interface VideoRenderJob {
  id: string;
  title: string;
  script: string;
  quality: VideoQualitySettings;
  voiceMappings: CharacterVoiceMapping[];
  subtitles: SubtitleConfig;
  audioMixing: AudioMixing;
  scenes: any[];
  estimatedRenderTime: number; // minutes
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  outputUrl?: string;
  fileSize?: number; // MB
}

export const DEFAULT_VIDEO_QUALITY: VideoQualitySettings = {
  resolution: '1080p',
  fps: 30,
  bitrate: 8, // 8 Mbps for high quality
  codec: 'H.264',
  hdr: false,
  colorSpace: 'sRGB'
};

export const ULTRA_HD_QUALITY: VideoQualitySettings = {
  resolution: '4K',
  fps: 60,
  bitrate: 45, // 45 Mbps for 4K
  codec: 'H.265',
  hdr: true,
  colorSpace: 'DCI-P3'
};

export const DEFAULT_SUBTITLE_CONFIG: SubtitleConfig = {
  enabled: true,
  language: 'en',
  style: 'professional',
  font: 'Montserrat',
  fontSize: 48,
  fontColor: '#FFFFFF',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  position: 'bottom',
  animation: 'fade',
  wordHighlight: true,
  speakerLabels: true,
  timestamps: false
};

export const PROFESSIONAL_AUDIO_MIX: AudioMixing = {
  dialogueVolume: -6, // Clear dialogue
  musicVolume: -18, // Subtle background music
  sfxVolume: -12, // Present but not overwhelming
  ambientVolume: -20, // Very subtle ambience
  normalization: true,
  compression: {
    enabled: true,
    threshold: -20,
    ratio: 3
  },
  eqSettings: {
    bass: 0,
    mid: 2,
    treble: 1
  },
  spatialAudio: true
};

/**
 * Creates professional video with all features enabled
 */
export async function createProfessionalVideo(params: {
  title: string;
  script: string;
  characters: any[];
  scenes: any[];
  quality?: 'standard' | 'hd' | 'ultra-hd';
  enableSubtitles?: boolean;
  enableSpatialAudio?: boolean;
}): Promise<VideoRenderJob> {
  
  // Assign voices to characters
  const voiceMappings = assignVoicesToCharacters(params.characters);
  
  // Select quality preset
  const qualitySettings = params.quality === 'ultra-hd' ? ULTRA_HD_QUALITY :
                         params.quality === 'hd' ? { ...DEFAULT_VIDEO_QUALITY, bitrate: 12 } :
                         DEFAULT_VIDEO_QUALITY;
  
  // Configure subtitles
  const subtitleConfig = params.enableSubtitles !== false ? DEFAULT_SUBTITLE_CONFIG : {
    ...DEFAULT_SUBTITLE_CONFIG,
    enabled: false
  };
  
  // Configure audio
  const audioMixing = {
    ...PROFESSIONAL_AUDIO_MIX,
    spatialAudio: params.enableSpatialAudio !== false
  };
  
  // Calculate estimated render time
  const duration = params.scenes.reduce((sum, scene) => sum + (scene.duration || 0), 0);
  const complexityFactor = qualitySettings.resolution === '4K' ? 3 : 
                          qualitySettings.resolution === '1440p' ? 2 : 1;
  const estimatedRenderTime = Math.ceil((duration / 60) * complexityFactor * 5); // 5min per min of video for 1080p
  
  const renderJob: VideoRenderJob = {
    id: `render_${Date.now()}`,
    title: params.title,
    script: params.script,
    quality: qualitySettings,
    voiceMappings,
    subtitles: subtitleConfig,
    audioMixing,
    scenes: params.scenes,
    estimatedRenderTime,
    status: 'queued',
    progress: 0
  };
  
  // Save to localStorage (in production, this would go to a render queue)
  const existingJobs = JSON.parse(localStorage.getItem('render_queue') || '[]');
  existingJobs.push(renderJob);
  localStorage.setItem('render_queue', JSON.stringify(existingJobs));
  
  return renderJob;
}

/**
 * Voice consistency tracking across episodes
 */
export function trackVoiceConsistency(
  currentEpisodeVoices: CharacterVoiceMapping[],
  previousEpisodeVoices: CharacterVoiceMapping[]
): { character: string; consistency: number }[] {
  
  return currentEpisodeVoices.map(current => {
    const previous = previousEpisodeVoices.find(p => p.characterName === current.characterName);
    
    if (!previous) {
      return { character: current.characterName, consistency: 100 };
    }
    
    // Check if voice profile matches
    const voiceMatch = current.voiceProfile.voiceId === previous.voiceProfile.voiceId;
    const pitchMatch = Math.abs(current.voiceProfile.pitch - previous.voiceProfile.pitch) < 3;
    const speedMatch = Math.abs(current.voiceProfile.speed - previous.voiceProfile.speed) < 0.2;
    
    const consistency = (
      (voiceMatch ? 70 : 0) +
      (pitchMatch ? 15 : 0) +
      (speedMatch ? 15 : 0)
    );
    
    return { character: current.characterName, consistency };
  });
}

/**
 * Generate voice preview for character
 */
export function generateVoicePreview(voiceProfile: VoiceProfile, sampleText?: string): string {
  const text = sampleText || `Hello, I'm ${voiceProfile.characterName}. This is how I sound.`;
  
  // In production, this would call a TTS API
  return `Voice preview: ${voiceProfile.voiceName} (${voiceProfile.gender}, ${voiceProfile.age}, ${voiceProfile.accent}) - "${text}"`;
}

/**
 * Quality presets for easy selection
 */
export const QUALITY_PRESETS = {
  youtube_standard: {
    name: 'YouTube Standard (1080p)',
    ...DEFAULT_VIDEO_QUALITY,
    description: 'Perfect for YouTube uploads, good quality, reasonable file size'
  },
  youtube_premium: {
    name: 'YouTube Premium (1440p)',
    resolution: '1440p' as const,
    fps: 60,
    bitrate: 20,
    codec: 'H.265' as const,
    hdr: false,
    colorSpace: 'sRGB' as const,
    description: 'High quality for YouTube premium content'
  },
  cinema_quality: {
    name: 'Cinema Quality (4K HDR)',
    ...ULTRA_HD_QUALITY,
    description: 'Maximum quality for professional productions'
  },
  social_media: {
    name: 'Social Media (1080p)',
    resolution: '1080p' as const,
    fps: 30,
    bitrate: 6,
    codec: 'H.264' as const,
    hdr: false,
    colorSpace: 'sRGB' as const,
    description: 'Optimized for Instagram, TikTok, Facebook'
  }
};

/**
 * Subtitle style presets
 */
export const SUBTITLE_STYLES = {
  youtube: {
    name: 'YouTube Style',
    font: 'Roboto',
    fontSize: 48,
    fontColor: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'bottom' as const,
    animation: 'fade' as const,
    wordHighlight: true
  },
  netflix: {
    name: 'Netflix Style',
    font: 'Netflix Sans',
    fontSize: 52,
    fontColor: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'bottom' as const,
    animation: 'none' as const,
    wordHighlight: false
  },
  tiktok: {
    name: 'TikTok Style',
    font: 'Proxima Nova',
    fontSize: 56,
    fontColor: '#FFFFFF',
    backgroundColor: 'transparent',
    position: 'center' as const,
    animation: 'bounce' as const,
    wordHighlight: true
  },
  minimal: {
    name: 'Minimal',
    font: 'Inter',
    fontSize: 44,
    fontColor: '#FFFFFF',
    backgroundColor: 'transparent',
    position: 'bottom' as const,
    animation: 'none' as const,
    wordHighlight: false
  }
};
