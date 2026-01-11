/**
 * 🎬 REAL VIDEO GENERATOR
 * Creates actual video files from scripts using canvas-based rendering
 * and browser media APIs. Works with connected YouTube channels for upload.
 */

import { generateSpeech, VOICE_PROFILES, estimateSpeechDuration } from './textToSpeech';

export interface VideoGenerationOptions {
  title: string;
  script: string;
  style: 'slideshow' | 'kinetic-text' | 'animated' | 'whiteboard' | 'neon' | 'cinematic' | 'minimal';
  voiceType?: string;
  backgroundMusic?: string;
  duration?: number; // seconds
  resolution?: '720p' | '1080p' | '1440p' | '4K';
  fps?: number;
  enableVoiceover?: boolean;
  colorScheme?: 'dark' | 'light' | 'neon' | 'warm' | 'cool';
}

export interface GeneratedVideo {
  id: string;
  title: string;
  blob: Blob;
  base64: string;
  duration: number;
  resolution: string;
  size: number; // bytes
  createdAt: string;
  thumbnailBase64?: string;
}

export interface GenerationProgress {
  stage: 'preparing' | 'rendering' | 'encoding' | 'finalizing';
  progress: number; // 0-100
  message: string;
}

type ProgressCallback = (progress: GenerationProgress) => void;

/**
 * Generate a real video from script content
 */
export async function generateRealVideo(
  options: VideoGenerationOptions,
  onProgress?: ProgressCallback
): Promise<GeneratedVideo> {
  const {
    title,
    script,
    style = 'kinetic-text',
    duration = 60,
    resolution = '1080p',
    fps = 30,
  } = options;

  const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  
  onProgress?.({ stage: 'preparing', progress: 0, message: 'Analyzing script...' });

  // Parse script into scenes
  const scenes = parseScriptToScenes(script, duration);
  
  onProgress?.({ stage: 'preparing', progress: 20, message: 'Creating video frames...' });

  // Get resolution dimensions
  const { width, height } = getResolutionDimensions(resolution);

  // Create canvas for rendering
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  onProgress?.({ stage: 'rendering', progress: 30, message: 'Rendering scenes...' });

  // Create video using MediaRecorder API
  const stream = canvas.captureStream(fps);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: getBitrate(resolution),
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  // Start recording
  mediaRecorder.start(100); // Collect data every 100ms

  // Render each scene
  const totalFrames = duration * fps;
  const framesPerScene = Math.floor(totalFrames / scenes.length);

  for (let sceneIndex = 0; sceneIndex < scenes.length; sceneIndex++) {
    const scene = scenes[sceneIndex];
    const progress = 30 + Math.floor((sceneIndex / scenes.length) * 50);
    onProgress?.({ 
      stage: 'rendering', 
      progress, 
      message: `Rendering scene ${sceneIndex + 1}/${scenes.length}...` 
    });

    // Render frames for this scene
    for (let frame = 0; frame < framesPerScene; frame++) {
      const frameProgress = frame / framesPerScene;
      renderFrame(ctx, scene, style, frameProgress, width, height, title);
      
      // Wait for next frame timing
      await new Promise(resolve => setTimeout(resolve, 1000 / fps));
    }
  }

  onProgress?.({ stage: 'encoding', progress: 85, message: 'Encoding video...' });

  // Stop recording and get the video blob
  return new Promise((resolve, reject) => {
    mediaRecorder.onstop = async () => {
      try {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        
        onProgress?.({ stage: 'finalizing', progress: 95, message: 'Generating thumbnail...' });
        
        // Generate thumbnail from first frame
        const thumbnailBase64 = await generateThumbnail(canvas);
        
        // Convert to base64 for upload
        const base64 = await blobToBase64(videoBlob);

        onProgress?.({ stage: 'finalizing', progress: 100, message: 'Video complete!' });

        resolve({
          id: videoId,
          title,
          blob: videoBlob,
          base64,
          duration,
          resolution,
          size: videoBlob.size,
          createdAt: new Date().toISOString(),
          thumbnailBase64,
        });
      } catch (error) {
        reject(error);
      }
    };

    mediaRecorder.onerror = (e) => reject(e);
    
    // Stop after duration
    setTimeout(() => mediaRecorder.stop(), duration * 1000);
  });
}

/**
 * Parse script into visual scenes
 */
function parseScriptToScenes(script: string, totalDuration: number): Scene[] {
  const paragraphs = script
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const sceneDuration = totalDuration / Math.max(paragraphs.length, 1);

  return paragraphs.map((text, index) => ({
    id: `scene_${index}`,
    text: cleanText(text),
    duration: sceneDuration,
    timestamp: index * sceneDuration,
    type: detectSceneType(text),
  }));
}

interface Scene {
  id: string;
  text: string;
  duration: number;
  timestamp: number;
  type: 'title' | 'content' | 'callToAction' | 'transition';
}

function cleanText(text: string): string {
  // Remove markdown and script markers
  return text
    .replace(/^\[.*?\]\s*/gm, '') // Remove [HOOK], [INTRO] etc.
    .replace(/^#+\s*/gm, '') // Remove markdown headers
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/\*/g, '') // Remove italic markers
    .trim();
}

function detectSceneType(text: string): Scene['type'] {
  const lower = text.toLowerCase();
  if (lower.includes('subscribe') || lower.includes('like') || lower.includes('comment')) {
    return 'callToAction';
  }
  if (lower.includes('introduction') || lower.includes('welcome')) {
    return 'title';
  }
  return 'content';
}

/**
 * Render a single video frame
 */
function renderFrame(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  style: string,
  progress: number,
  width: number,
  height: number,
  videoTitle: string
): void {
  // Clear canvas with gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0a0a0a');
  gradient.addColorStop(0.5, '#1a1a2e');
  gradient.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add subtle animated particles/stars effect
  renderBackgroundEffects(ctx, width, height, progress);

  // Render content based on style
  switch (style) {
    case 'kinetic-text':
      renderKineticText(ctx, scene, progress, width, height);
      break;
    case 'slideshow':
      renderSlideshow(ctx, scene, progress, width, height);
      break;
    case 'whiteboard':
      renderWhiteboard(ctx, scene, progress, width, height);
      break;
    default:
      renderAnimated(ctx, scene, progress, width, height);
  }

  // Add watermark/branding
  renderBranding(ctx, width, height, videoTitle);
}

function renderBackgroundEffects(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
): void {
  // Animated particles
  const particleCount = 50;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  
  for (let i = 0; i < particleCount; i++) {
    const x = (Math.sin(progress * 2 + i) * 0.5 + 0.5) * width;
    const y = ((i / particleCount + progress * 0.1) % 1) * height;
    const size = Math.sin(progress * 3 + i) * 2 + 3;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderKineticText(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  progress: number,
  width: number,
  height: number
): void {
  const words = scene.text.split(' ');
  const wordsToShow = Math.floor(words.length * Math.min(progress * 2, 1));
  const visibleText = words.slice(0, Math.max(wordsToShow, 1)).join(' ');

  // Main text with animation
  ctx.save();
  
  // Text shadow for depth
  ctx.shadowColor = 'rgba(0, 255, 200, 0.5)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Dynamic font size based on text length
  const maxWidth = width * 0.8;
  let fontSize = 72;
  ctx.font = `bold ${fontSize}px 'Segoe UI', Arial, sans-serif`;
  
  while (ctx.measureText(visibleText).width > maxWidth && fontSize > 24) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px 'Segoe UI', Arial, sans-serif`;
  }

  // Center text with word wrap
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = wrapText(ctx, visibleText, maxWidth);
  const lineHeight = fontSize * 1.3;
  const startY = height / 2 - (lines.length - 1) * lineHeight / 2;

  lines.forEach((line, i) => {
    const y = startY + i * lineHeight;
    // Animate each line
    const lineProgress = Math.min((progress * 3 - i * 0.1), 1);
    const alpha = Math.max(0, Math.min(lineProgress, 1));
    const offsetY = (1 - alpha) * 30;
    
    ctx.globalAlpha = alpha;
    ctx.fillText(line, width / 2, y + offsetY);
  });

  ctx.restore();
}

function renderSlideshow(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  progress: number,
  width: number,
  height: number
): void {
  // Slide-style presentation
  const padding = 60;
  
  // Content box
  ctx.fillStyle = 'rgba(30, 30, 50, 0.9)';
  roundRect(ctx, padding, padding, width - padding * 2, height - padding * 2, 20);
  ctx.fill();
  
  // Border
  ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
  ctx.lineWidth = 2;
  roundRect(ctx, padding, padding, width - padding * 2, height - padding * 2, 20);
  ctx.stroke();

  // Text content
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  
  const lines = wrapText(ctx, scene.text, width - padding * 4);
  const lineHeight = 60;
  const startY = height / 2 - (lines.length - 1) * lineHeight / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight);
  });
}

function renderWhiteboard(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  progress: number,
  width: number,
  height: number
): void {
  // Whiteboard background
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(50, 50, width - 100, height - 100);
  
  // Hand-drawn effect text
  ctx.fillStyle = '#333333';
  ctx.font = '36px "Comic Sans MS", cursive';
  ctx.textAlign = 'left';
  
  const maxChars = Math.floor(scene.text.length * progress);
  const visibleText = scene.text.substring(0, maxChars);
  
  const lines = wrapText(ctx, visibleText, width - 200);
  lines.forEach((line, i) => {
    ctx.fillText(line, 100, 150 + i * 50);
  });
}

function renderAnimated(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  progress: number,
  width: number,
  height: number
): void {
  // Default animated style
  renderKineticText(ctx, scene, progress, width, height);
}

function renderBranding(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  title: string
): void {
  // Bottom right branding
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = '#888888';
  ctx.font = '18px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('Created with SixFold Studios', width - 30, height - 30);
  ctx.restore();
}

/**
 * Helper: Word wrap text
 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Helper: Draw rounded rectangle
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Get dimensions for resolution
 */
function getResolutionDimensions(resolution: string): { width: number; height: number } {
  const resolutions: Record<string, { width: number; height: number }> = {
    '720p': { width: 1280, height: 720 },
    '1080p': { width: 1920, height: 1080 },
    '1440p': { width: 2560, height: 1440 },
    '4K': { width: 3840, height: 2160 },
  };
  return resolutions[resolution] || resolutions['1080p'];
}

/**
 * Get bitrate for resolution
 */
function getBitrate(resolution: string): number {
  const bitrates: Record<string, number> = {
    '720p': 5000000,  // 5 Mbps
    '1080p': 10000000, // 10 Mbps
    '1440p': 16000000, // 16 Mbps
    '4K': 35000000,    // 35 Mbps
  };
  return bitrates[resolution] || bitrates['1080p'];
}

/**
 * Generate thumbnail from canvas
 */
async function generateThumbnail(canvas: HTMLCanvasElement): Promise<string> {
  // Create thumbnail canvas
  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = 1280;
  thumbCanvas.height = 720;
  const thumbCtx = thumbCanvas.getContext('2d')!;
  
  // Scale down the current canvas content
  thumbCtx.drawImage(canvas, 0, 0, 1280, 720);
  
  return thumbCanvas.toDataURL('image/jpeg', 0.85);
}

/**
 * Convert blob to base64
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      // Remove data URL prefix
      const base64Data = base64.split(',')[1] || base64;
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Save generated video to localStorage for later upload
 */
export function saveGeneratedVideo(video: GeneratedVideo, channelId: string): void {
  const videos = JSON.parse(localStorage.getItem('pending_uploads') || '[]');
  videos.push({
    ...video,
    channelId,
    blob: undefined, // Can't store Blob in localStorage
  });
  localStorage.setItem('pending_uploads', JSON.stringify(videos));
  
  // Also save to all_generated_videos for display
  const allVideos = JSON.parse(localStorage.getItem('all_generated_videos') || '[]');
  allVideos.push({
    id: video.id,
    title: video.title,
    channelId,
    duration: video.duration,
    resolution: video.resolution,
    size: video.size,
    createdAt: video.createdAt,
    status: 'ready_to_upload',
    thumbnailBase64: video.thumbnailBase64,
  });
  localStorage.setItem('all_generated_videos', JSON.stringify(allVideos));
}

/**
 * Download video file locally
 */
export function downloadVideo(video: GeneratedVideo): void {
  const url = URL.createObjectURL(video.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${video.title.replace(/[^a-zA-Z0-9]/g, '_')}.webm`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
