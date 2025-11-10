// Types for the connected free tools
export interface TrendItem {
  title: string;
  viral_score: number;
  source: string;
  views?: number;
  score?: number;
  comments?: number;
  traffic?: string;
}

export interface VideoClip {
  url: string;
  duration?: number;
  type: 'image' | 'video';
}

export interface AudioTrack {
  url: string;
  duration?: number;
  style: string;
}

export interface MediaAssets {
  images: string[];
  videos: string[];
  audio: string;
}