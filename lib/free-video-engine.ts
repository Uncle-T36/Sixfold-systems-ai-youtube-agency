// 100% FREE VIDEO GENERATION ENGINE
// No paid APIs - Uses only free tools and services
// Works in browser and server-side

export interface VideoConfig {
  title: string;
  script: string;
  duration: number; // seconds
  style: 'slideshow' | 'text-animation' | 'canvas-animation' | 'kinetic-typography';
  voiceEnabled: boolean;
  musicEnabled: boolean;
}

export interface VideoAsset {
  type: 'image' | 'text' | 'animation';
  content: string;
  duration: number;
  transition?: string;
}

export class FreeVideoEngine {
  
  // ============================================
  // FREE TEXT-TO-SPEECH OPTIONS
  // ============================================
  
  async generateFreeVoiceover(text: string): Promise<{ audio: Blob | null; method: string }> {
    // Option 1: Web Speech API (FREE - built into browsers)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return this.generateWebSpeechAudio(text);
    }
    
    // Option 2: Return null - user can use their own microphone (FREE)
    // Option 3: Use silent video with captions (FREE - YouTube auto-generates captions)
    return { audio: null, method: 'captions-only' };
  }

  private async generateWebSpeechAudio(text: string): Promise<{ audio: Blob | null; method: string }> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve({ audio: null, method: 'web-speech-unavailable' });
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to find a good voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) utterance.voice = englishVoice;

      utterance.onend = () => {
        resolve({ audio: null, method: 'web-speech-api' });
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  // ============================================
  // FREE IMAGE SOURCES (No API keys required!)
  // ============================================
  
  async getFreeImages(keywords: string[], count: number = 5): Promise<string[]> {
    const images: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const keyword = keywords[i % keywords.length];
      
      // Method 1: Unsplash Source (FREE - no API key!)
      // Just use the URL directly: https://source.unsplash.com/1920x1080/?nature
      images.push(`https://source.unsplash.com/1920x1080/?${encodeURIComponent(keyword)}`);
      
      // Method 2: Picsum (FREE - random beautiful images)
      // images.push(`https://picsum.photos/1920/1080?random=${i}`);
      
      // Method 3: Placeholder.com (FREE - solid colors with text)
      // images.push(`https://via.placeholder.com/1920x1080/4A90E2/FFFFFF/?text=${keyword}`);
    }
    
    return images;
  }

  // ============================================
  // FREE BACKGROUND MUSIC
  // ============================================
  
  getFreeBackgroundMusic(mood: string = 'neutral'): string | null {
    // Option 1: No music (silent videos perform well!)
    return null;
    
    // Option 2: Use YouTube Audio Library (FREE - download and host yourself)
    // https://www.youtube.com/audiolibrary
    
    // Option 3: Free Music Archive (FREE - CC licensed)
    // https://freemusicarchive.org/
    
    // Option 4: Incompetech (FREE - CC licensed with attribution)
    // https://incompetech.com/music/royalty-free/music.html
  }

  // ============================================
  // FREE VIDEO GENERATION METHODS
  // ============================================
  
  async generateFreeVideo(config: VideoConfig): Promise<{ 
    html: string; 
    method: string; 
    exportInstructions: string;
    cost: number;
  }> {
    
    // Generate script segments
    const segments = this.splitScriptIntoSegments(config.script, config.duration);
    
    // Get free images
    const keywords = this.extractKeywords(config.script);
    const images = await this.getFreeImages(keywords, segments.length);
    
    // Generate HTML5 video presentation
    const html = this.generateHTML5VideoPresentation(segments, images, config);
    
    return {
      html,
      method: 'html5-canvas-animation',
      exportInstructions: this.getExportInstructions(),
      cost: 0 // COMPLETELY FREE!
    };
  }

  private splitScriptIntoSegments(script: string, totalDuration: number): string[] {
    const sentences = script.match(/[^.!?]+[.!?]+/g) || [script];
    return sentences.map(s => s.trim());
  }

  private extractKeywords(script: string): string[] {
    // Simple keyword extraction
    const words = script.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 4);
    
    // Remove common words
    const stopWords = ['there', 'their', 'would', 'could', 'should', 'about', 'which', 'these', 'those'];
    const keywords = words.filter(w => !stopWords.includes(w));
    
    // Return unique keywords
    return [...new Set(keywords)].slice(0, 10);
  }

  private generateHTML5VideoPresentation(
    segments: string[], 
    images: string[], 
    config: VideoConfig
  ): string {
    const segmentDuration = Math.floor(config.duration / segments.length);
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      background: #000;
      overflow: hidden;
      font-family: 'Arial', sans-serif;
    }
    
    #video-container {
      width: 1920px;
      height: 1080px;
      position: relative;
      overflow: hidden;
      background: #000;
    }
    
    .slide {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 1s ease-in-out;
    }
    
    .slide.active {
      opacity: 1;
    }
    
    .slide img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      animation: kenBurns ${segmentDuration}s ease-in-out;
    }
    
    @keyframes kenBurns {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1.05); }
    }
    
    .caption {
      position: absolute;
      bottom: 100px;
      left: 0;
      right: 0;
      text-align: center;
      color: white;
      font-size: 48px;
      font-weight: bold;
      text-shadow: 2px 2px 8px rgba(0,0,0,0.9);
      padding: 20px 100px;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      animation: fadeInUp 1s ease-out;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 5px;
      background: #ff0000;
      width: 0%;
      animation: progress ${config.duration}s linear;
    }
    
    @keyframes progress {
      to { width: 100%; }
    }
  </style>
</head>
<body>
  <div id="video-container">
    ${segments.map((segment, i) => `
      <div class="slide ${i === 0 ? 'active' : ''}" data-index="${i}">
        <img src="${images[i % images.length]}" alt="Scene ${i + 1}" />
        <div class="caption">${this.escapeHtml(segment)}</div>
      </div>
    `).join('')}
    <div class="progress-bar"></div>
  </div>

  <script>
    const slides = document.querySelectorAll('.slide');
    const segmentDuration = ${segmentDuration * 1000}; // milliseconds
    let currentIndex = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
      
      if (currentIndex === 0) {
        // Video ended, stop or loop
        console.log('Video presentation complete');
      }
    }

    // Auto-advance slides
    setInterval(nextSlide, segmentDuration);
    
    // Optional: Web Speech API narration
    ${config.voiceEnabled ? `
    const utterances = [
      ${segments.map(s => `"${this.escapeHtml(s)}"`).join(',\n      ')}
    ];
    
    let speechIndex = 0;
    function speak() {
      if (speechIndex < utterances.length && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(utterances[speechIndex]);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
        speechIndex++;
        setTimeout(speak, segmentDuration);
      }
    }
    
    // Start narration
    speak();
    ` : ''}
  </script>
</body>
</html>
    `.trim();
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private getExportInstructions(): string {
    return `
FREE VIDEO EXPORT OPTIONS:

1. **Screen Recording (100% FREE)**
   - Windows: Win + G (Xbox Game Bar - built-in)
   - Mac: Cmd + Shift + 5 (built-in)
   - Chrome: Open HTML file, record with OBS Studio (free)
   
2. **OBS Studio (FREE - Professional Quality)**
   - Download: https://obsproject.com/
   - Add Browser Source with your HTML file
   - Record at 1920x1080, 60fps
   - Export as MP4
   
3. **FFmpeg (FREE - Command Line)**
   - Automated screen capture
   - Batch processing
   - Professional video encoding
   
4. **Browser Extensions (FREE)**
   - Loom (free tier: unlimited videos)
   - Screencastify (free tier: limited)
   - Nimbus Screenshot (free)

RECOMMENDED: OBS Studio
- Professional quality
- No watermarks
- No time limits
- Easy to use
- Works with HTML5 animations
    `.trim();
  }

  // ============================================
  // ALTERNATIVE: CANVAS-BASED VIDEO GENERATION
  // ============================================
  
  async generateCanvasVideo(config: VideoConfig): Promise<{
    frames: string[]; // Base64 encoded frames
    fps: number;
    instructions: string;
  }> {
    // This generates individual frames that can be compiled with FFmpeg
    const fps = 30;
    const totalFrames = config.duration * fps;
    const frames: string[] = [];
    
    // In a real implementation, you'd generate each frame
    // For now, return instructions
    
    return {
      frames: [],
      fps,
      instructions: `
CANVAS VIDEO GENERATION (100% FREE):

1. Generate frames (browser-side or Node.js)
2. Use FFmpeg to compile frames into video:
   
   ffmpeg -framerate 30 -i frame_%04d.png -c:v libx264 -pix_fmt yuv420p output.mp4

3. Add audio (if available):
   
   ffmpeg -i video.mp4 -i audio.mp3 -c:v copy -c:a aac final.mp4

4. Add captions (FREE):
   
   ffmpeg -i video.mp4 -vf subtitles=captions.srt output.mp4

FFmpeg is FREE and open-source: https://ffmpeg.org/
      `.trim()
    };
  }

  // ============================================
  // CAPTION GENERATION (FREE)
  // ============================================
  
  generateSRTCaptions(segments: string[], segmentDuration: number): string {
    let srt = '';
    let index = 1;
    let startTime = 0;
    
    segments.forEach(segment => {
      const endTime = startTime + segmentDuration;
      
      srt += `${index}\n`;
      srt += `${this.formatSRTTime(startTime)} --> ${this.formatSRTTime(endTime)}\n`;
      srt += `${segment}\n\n`;
      
      index++;
      startTime = endTime;
    });
    
    return srt;
  }

  private formatSRTTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
  }
}

// ============================================
// USAGE EXAMPLE
// ============================================

export async function createFreeVideo(title: string, script: string, duration: number = 60) {
  const engine = new FreeVideoEngine();
  
  const config: VideoConfig = {
    title,
    script,
    duration,
    style: 'slideshow',
    voiceEnabled: true,
    musicEnabled: false
  };
  
  const result = await engine.generateFreeVideo(config);
  
  console.log('✅ FREE VIDEO GENERATED!');
  console.log('💰 Cost: $0.00');
  console.log('📊 Method:', result.method);
  console.log('\n📝 Export Instructions:\n', result.exportInstructions);
  
  return result;
}

// NO PAID APIs USED:
// ❌ No Synthesia ($30/video)
// ❌ No D-ID ($10/video)
// ❌ No Runway ($0.05/second)
// ❌ No ElevenLabs TTS
// ❌ No AWS Polly
// ✅ 100% FREE TOOLS ONLY!
