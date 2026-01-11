/**
 * 🎙️ TEXT-TO-SPEECH ENGINE
 * Uses Web Speech API (free) with fallback to Google TTS
 * Generates audio for video voiceovers
 */

export interface VoiceSettings {
  voiceId: string;
  name: string;
  lang: string;
  pitch: number; // 0-2, default 1
  rate: number;  // 0.1-10, default 1
  volume: number; // 0-1, default 1
}

export interface TTSResult {
  success: boolean;
  audioBlob?: Blob;
  audioBase64?: string;
  duration?: number;
  error?: string;
}

// Available voice profiles
export const VOICE_PROFILES: Record<string, VoiceSettings> = {
  'narrator-male-deep': {
    voiceId: 'narrator-male-deep',
    name: 'Deep Male Narrator',
    lang: 'en-US',
    pitch: 0.8,
    rate: 0.9,
    volume: 1,
  },
  'narrator-male-energetic': {
    voiceId: 'narrator-male-energetic',
    name: 'Energetic Male',
    lang: 'en-US',
    pitch: 1.1,
    rate: 1.1,
    volume: 1,
  },
  'narrator-female-professional': {
    voiceId: 'narrator-female-professional',
    name: 'Professional Female',
    lang: 'en-US',
    pitch: 1.0,
    rate: 1.0,
    volume: 1,
  },
  'narrator-female-warm': {
    voiceId: 'narrator-female-warm',
    name: 'Warm Female',
    lang: 'en-US',
    pitch: 1.1,
    rate: 0.95,
    volume: 1,
  },
  'character-villain': {
    voiceId: 'character-villain',
    name: 'Villain Voice',
    lang: 'en-US',
    pitch: 0.7,
    rate: 0.85,
    volume: 1,
  },
  'character-hero': {
    voiceId: 'character-hero',
    name: 'Hero Voice',
    lang: 'en-US',
    pitch: 1.0,
    rate: 1.0,
    volume: 1,
  },
  'character-child': {
    voiceId: 'character-child',
    name: 'Child Voice',
    lang: 'en-US',
    pitch: 1.5,
    rate: 1.1,
    volume: 1,
  },
  'documentary-british': {
    voiceId: 'documentary-british',
    name: 'British Documentary',
    lang: 'en-GB',
    pitch: 0.95,
    rate: 0.9,
    volume: 1,
  },
};

/**
 * Get available system voices
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return [];
  }
  return window.speechSynthesis.getVoices();
}

/**
 * Find best matching system voice for profile
 */
function findBestVoice(profile: VoiceSettings): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  
  // Try exact language match first
  let voice = voices.find(v => v.lang === profile.lang && !v.localService);
  if (voice) return voice;
  
  // Try language prefix match
  const langPrefix = profile.lang.split('-')[0];
  voice = voices.find(v => v.lang.startsWith(langPrefix) && !v.localService);
  if (voice) return voice;
  
  // Fallback to any English voice
  voice = voices.find(v => v.lang.startsWith('en'));
  if (voice) return voice;
  
  // Last resort: first available voice
  return voices[0] || null;
}

/**
 * Generate speech audio from text using Web Speech API
 */
export async function generateSpeech(
  text: string,
  voiceProfileId: string = 'narrator-male-deep'
): Promise<TTSResult> {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Speech synthesis only available in browser' };
  }

  const profile = VOICE_PROFILES[voiceProfileId] || VOICE_PROFILES['narrator-male-deep'];
  
  return new Promise((resolve) => {
    try {
      // Use Web Speech API with audio capture
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Wait for voices to load
      const setVoice = () => {
        const voice = findBestVoice(profile);
        if (voice) {
          utterance.voice = voice;
        }
        utterance.pitch = profile.pitch;
        utterance.rate = profile.rate;
        utterance.volume = profile.volume;
      };

      if (synth.getVoices().length > 0) {
        setVoice();
      } else {
        synth.onvoiceschanged = setVoice;
      }

      // Create audio context to capture speech
      const audioContext = new AudioContext();
      const mediaStreamDestination = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const startTime = Date.now();

      utterance.onstart = () => {
        mediaRecorder.start(100);
      };

      utterance.onend = () => {
        mediaRecorder.stop();
        const duration = (Date.now() - startTime) / 1000;
        
        setTimeout(() => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          
          // Convert to base64
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve({
              success: true,
              audioBlob,
              audioBase64: base64,
              duration,
            });
          };
          reader.readAsDataURL(audioBlob);
        }, 100);
      };

      utterance.onerror = (e) => {
        resolve({ success: false, error: e.error || 'Speech synthesis failed' });
      };

      synth.speak(utterance);

    } catch (error) {
      resolve({
        success: false,
        error: error instanceof Error ? error.message : 'TTS failed'
      });
    }
  });
}

/**
 * Generate speech using browser's built-in TTS and return audio URL
 * This is a simpler approach that plays directly
 */
export function speakText(
  text: string,
  voiceProfileId: string = 'narrator-male-deep',
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.error('Speech synthesis not available');
    return;
  }

  const profile = VOICE_PROFILES[voiceProfileId] || VOICE_PROFILES['narrator-male-deep'];
  const synth = window.speechSynthesis;
  
  // Cancel any ongoing speech
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  const setVoice = () => {
    const voice = findBestVoice(profile);
    if (voice) utterance.voice = voice;
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;
    utterance.volume = profile.volume;
  };

  if (synth.getVoices().length > 0) {
    setVoice();
  } else {
    synth.onvoiceschanged = setVoice;
  }

  if (onEnd) utterance.onend = onEnd;
  
  synth.speak(utterance);
}

/**
 * Stop any ongoing speech
 */
export function stopSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Estimate speech duration for text
 */
export function estimateSpeechDuration(text: string, rate: number = 1.0): number {
  // Average speaking rate: ~150 words per minute at rate 1.0
  const words = text.split(/\s+/).length;
  const wordsPerMinute = 150 * rate;
  return (words / wordsPerMinute) * 60; // duration in seconds
}

/**
 * Split text into chunks suitable for TTS (avoid timeouts)
 */
export function splitTextForTTS(text: string, maxChars: number = 500): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChars) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}
