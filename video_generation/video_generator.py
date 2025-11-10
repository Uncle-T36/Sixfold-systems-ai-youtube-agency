"""
Video Generation Pipeline - Creates professional, long-form videos automatically

This module:
- Converts scripts to engaging videos
- Uses text-to-speech for narration
- Adds stock footage, images, and music
- Creates professional transitions and effects
- Optimizes for high watch time and engagement
"""

import json
import os
import requests
from moviepy.editor import (
    VideoFileClip, ImageClip, TextClip, ColorClip, CompositeVideoClip, 
    AudioFileClip, CompositeAudioClip, concatenate_videoclips, AudioClip
)
from moviepy.video.VideoClip import VideoClip
import pyttsx3
from PIL import Image, ImageDraw, ImageFont
import random
from typing import Dict, List, Tuple
import time

class VideoGenerator:
    def __init__(self, config_path: str = "config/channels_config.json"):
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        
        # Initialize text-to-speech engine
        self.tts_engine = pyttsx3.init()
        self.setup_tts_voices()
        
        # Directories for assets
        self.assets_dir = "assets"
        self.temp_dir = "temp"
        self.output_dir = "output"
        
        self._ensure_directories()
    
    def _ensure_directories(self):
        """Create necessary directories"""
        for directory in [self.assets_dir, self.temp_dir, self.output_dir]:
            os.makedirs(directory, exist_ok=True)
            
        # Create subdirectories for assets
        asset_subdirs = ['images', 'music', 'footage', 'fonts']
        for subdir in asset_subdirs:
            os.makedirs(os.path.join(self.assets_dir, subdir), exist_ok=True)
    
    def setup_tts_voices(self):
        """Setup different voices for different channel types"""
        voices = self.tts_engine.getProperty('voices')
        
        # Voice mapping for different channel types
        self.voice_config = {
            'technology': {'rate': 180, 'voice_index': 0},  # Professional male
            'education_kids': {'rate': 150, 'voice_index': 1},  # Friendly female
            'lifestyle': {'rate': 170, 'voice_index': 1},  # Warm female
            'gaming': {'rate': 190, 'voice_index': 0},  # Energetic male
            'health': {'rate': 160, 'voice_index': 1},  # Calm female
            'motivation': {'rate': 175, 'voice_index': 0}  # Powerful male
        }
    
    def generate_video(self, script_data: Dict, channel_id: str) -> str:
        """
        Generate a complete video from script data
        Returns path to generated video file
        """
        channel = self.config['channels'][channel_id]
        video_id = f"{channel_id}_{int(time.time())}"
        
        print(f"🎬 Generating video for {channel['name']}...")
        
        # Step 1: Generate audio narration
        audio_path = self._generate_narration(script_data['script'], channel, video_id)
        
        # Step 2: Create visual content
        visual_clips = self._create_visual_content(script_data, channel, video_id)
        
        # Step 3: Add background music
        music_path = self._select_background_music(channel)
        
        # Step 4: Create thumbnail
        thumbnail_path = self._generate_thumbnail(script_data, channel, video_id)
        
        # Step 5: Compile final video
        final_video_path = self._compile_video(
            visual_clips, audio_path, music_path, channel, video_id
        )
        
        print(f"✅ Video generated: {final_video_path}")
        
        return {
            'video_path': final_video_path,
            'thumbnail_path': thumbnail_path,
            'duration': self._get_video_duration(final_video_path),
            'title': script_data['title'],
            'description': script_data['description'],
            'tags': script_data['tags']
        }
    
    def _generate_narration(self, script: str, channel: Dict, video_id: str) -> str:
        """Generate high-quality narration from script"""
        
        # Configure voice for channel type
        voice_config = self.voice_config.get(channel['niche'], self.voice_config['lifestyle'])
        
        # Set voice properties
        self.tts_engine.setProperty('rate', voice_config['rate'])
        voices = self.tts_engine.getProperty('voices')
        if voices and len(voices) > voice_config['voice_index']:
            self.tts_engine.setProperty('voice', voices[voice_config['voice_index']].id)
        
        # Clean script for TTS
        clean_script = self._clean_script_for_tts(script)
        
        # Generate audio file
        audio_path = os.path.join(self.temp_dir, f"{video_id}_narration.wav")
        self.tts_engine.save_to_file(clean_script, audio_path)
        self.tts_engine.runAndWait()
        
        return audio_path
    
    def _clean_script_for_tts(self, script: str) -> str:
        """Clean script for better TTS output"""
        
        # Remove stage directions and formatting
        lines = script.split('\n')
        clean_lines = []
        
        for line in lines:
            line = line.strip()
            
            # Skip stage directions and formatting
            if line.startswith('[') or line.startswith('🎯') or line.startswith('#'):
                continue
            
            # Remove timestamps
            if ':' in line and line.count(':') == 2:
                continue
            
            # Clean up formatting
            line = line.replace('🎯', '').replace('🔥', '').replace('💡', '')
            line = line.replace('🌟', '').replace('🎮', '').replace('🏃‍♂️', '')
            line = line.replace('💪', '')
            
            if line and len(line) > 3:
                clean_lines.append(line)
        
        return ' '.join(clean_lines)
    
    def _create_visual_content(self, script_data: Dict, channel: Dict, video_id: str) -> List:
        """Create visual content clips for the video"""
        
        visual_clips = []
        target_duration = channel['video_length_minutes'] * 60
        
        # Introduction clip with channel branding
        intro_clip = self._create_intro_clip(channel, 3)  # 3 seconds
        visual_clips.append(intro_clip)
        
        # Main content clips
        remaining_duration = target_duration - 3 - 5  # Minus intro and outro
        num_segments = max(5, int(remaining_duration / 30))  # 30-second segments
        segment_duration = remaining_duration / num_segments
        
        for i in range(num_segments):
            # Create diverse visual content
            if i % 3 == 0:
                clip = self._create_text_overlay_clip(script_data, channel, segment_duration)
            elif i % 3 == 1:
                clip = self._create_stock_footage_clip(script_data, channel, segment_duration)
            else:
                clip = self._create_animated_image_clip(script_data, channel, segment_duration)
            
            visual_clips.append(clip)
        
        # Outro clip with subscribe reminder
        outro_clip = self._create_outro_clip(channel, 5)  # 5 seconds
        visual_clips.append(outro_clip)
        
        return visual_clips
    
    def _create_intro_clip(self, channel: Dict, duration: int) -> VideoFileClip:
        """Create engaging intro clip"""
        
        # Create intro image with channel branding
        intro_img = self._create_intro_image(channel)
        intro_path = os.path.join(self.temp_dir, f"intro_{channel['name']}.png")
        intro_img.save(intro_path)
        
        # Create video clip from image
        intro_clip = ImageClip(intro_path, duration=duration)
        
        # Add fade in/out effects
        intro_clip = intro_clip.fadeout(0.5)
        
        return intro_clip
    
    def _create_intro_image(self, channel: Dict) -> Image.Image:
        """Create intro image with channel branding"""
        
        # Create base image
        img = Image.new('RGB', (1920, 1080), color=self._get_channel_color(channel))
        draw = ImageDraw.Draw(img)
        
        # Try to load font, fallback to default if not available
        try:
            title_font = ImageFont.truetype("arial.ttf", 80)
            subtitle_font = ImageFont.truetype("arial.ttf", 40)
        except:
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()
        
        # Add channel name
        title_text = channel['name']
        title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
        title_width = title_bbox[2] - title_bbox[0]
        title_height = title_bbox[3] - title_bbox[1]
        title_x = (1920 - title_width) // 2
        title_y = 400
        
        draw.text((title_x, title_y), title_text, fill='white', font=title_font)
        
        # Add tagline
        taglines = {
            'technology': 'Latest Tech Reviews & Tips',
            'education_kids': 'Fun Learning for Kids',
            'lifestyle': 'Life Hacks & DIY Tips',
            'gaming': 'Gaming Tips & Reviews',
            'health': 'Health & Wellness Tips',
            'motivation': 'Daily Motivation & Success'
        }
        
        tagline = taglines.get(channel['niche'], 'Quality Content Daily')
        tagline_bbox = draw.textbbox((0, 0), tagline, font=subtitle_font)
        tagline_width = tagline_bbox[2] - tagline_bbox[0]
        tagline_x = (1920 - tagline_width) // 2
        tagline_y = title_y + title_height + 20
        
        draw.text((tagline_x, tagline_y), tagline, fill='lightgray', font=subtitle_font)
        
        return img
    
    def _get_channel_color(self, channel: Dict) -> Tuple[int, int, int]:
        """Get brand color for channel"""
        
        colors = {
            'technology': (25, 118, 210),    # Blue
            'education_kids': (76, 175, 80), # Green
            'lifestyle': (156, 39, 176),     # Purple
            'gaming': (244, 67, 54),         # Red
            'health': (0, 150, 136),         # Teal
            'motivation': (255, 152, 0)      # Orange
        }
        
        return colors.get(channel['niche'], (33, 33, 33))
    
    def _create_text_overlay_clip(self, script_data: Dict, channel: Dict, duration: float) -> CompositeVideoClip:
        """Create clip with text overlays and background"""
        
        # Create background color clip
        bg_color = self._get_channel_color(channel)
        background = ColorClip(size=(1920, 1080), color=bg_color, duration=duration)
        
        # Extract key points from script for text overlay
        key_points = self._extract_key_points(script_data['script'])
        if not key_points:
            key_points = [script_data['title']]
        
        text_clips = []
        
        # Main title
        title_clip = TextClip(
            key_points[0][:50],  # Limit length
            fontsize=60,
            color='white',
            font='Arial-Bold'
        ).set_position('center').set_duration(duration)
        
        text_clips.append(title_clip)
        
        # Add bullet points if available
        if len(key_points) > 1:
            for i, point in enumerate(key_points[1:4]):  # Max 3 additional points
                bullet_clip = TextClip(
                    f"• {point[:40]}",
                    fontsize=40,
                    color='lightgray',
                    font='Arial'
                ).set_position(('center', 600 + i * 80)).set_duration(duration)
                
                text_clips.append(bullet_clip)
        
        # Composite all text clips
        final_clip = CompositeVideoClip([background] + text_clips)
        
        return final_clip
    
    def _extract_key_points(self, script: str) -> List[str]:
        """Extract key points from script for visual display"""
        
        lines = script.split('\n')
        key_points = []
        
        for line in lines:
            line = line.strip()
            
            # Look for bullet points or important statements
            if line.startswith('•') or line.startswith('-'):
                key_points.append(line[1:].strip())
            elif ':' in line and len(line) < 100:
                key_points.append(line.strip())
            elif line.isupper() and len(line) < 80:
                key_points.append(line.strip())
        
        return key_points[:5]  # Return max 5 points
    
    def _create_stock_footage_clip(self, script_data: Dict, channel: Dict, duration: float) -> VideoFileClip:
        """Create clip using stock footage or generated content"""
        
        # For now, create a simple animated background
        # In production, you'd use actual stock footage APIs like Pexels, Unsplash
        
        # Create animated gradient background
        return self._create_animated_background(channel, duration)
    
    def _create_animated_background(self, channel: Dict, duration: float) -> CompositeVideoClip:
        """Create animated background when stock footage isn't available"""
        
        # Create base background
        bg_color = self._get_channel_color(channel)
        background = ColorClip(size=(1920, 1080), color=bg_color, duration=duration)
        
        # Add moving shapes for visual interest
        shapes = []
        
        for i in range(3):
            # Create moving circle
            circle_clip = self._create_moving_shape('circle', channel, duration, i)
            shapes.append(circle_clip)
        
        return CompositeVideoClip([background] + shapes)
    
    def _create_moving_shape(self, shape_type: str, channel: Dict, duration: float, index: int) -> VideoClip:
        """Create a moving shape for background animation"""
        
        # Create a simple colored circle
        size = 200 + index * 50
        color = [c + 30 for c in self._get_channel_color(channel)]  # Lighter shade
        
        # Create shape image
        shape_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(shape_img)
        draw.ellipse([0, 0, size, size], fill=tuple(color + [100]))  # Semi-transparent
        
        shape_path = os.path.join(self.temp_dir, f"shape_{index}.png")
        shape_img.save(shape_path)
        
        # Create moving clip
        shape_clip = ImageClip(shape_path, duration=duration, transparent=True)
        
        # Add movement
        def position_func(t):
            x = 100 + (t * 50 + index * 200) % 1920
            y = 200 + index * 250
            return (x, y)
        
        shape_clip = shape_clip.set_position(position_func)
        
        return shape_clip
    
    def _create_animated_image_clip(self, script_data: Dict, channel: Dict, duration: float) -> CompositeVideoClip:
        """Create clip with animated images and text"""
        
        # Create background
        bg_color = self._get_channel_color(channel)
        background = ColorClip(size=(1920, 1080), color=bg_color, duration=duration)
        
        # Add animated text
        animated_text = TextClip(
            "💡 Key Insight",
            fontsize=50,
            color='white',
            font='Arial-Bold'
        ).set_position('center').set_duration(duration)
        
        # Add zoom effect
        animated_text = animated_text.resize(lambda t: 1 + 0.1 * (t % 2))
        
        return CompositeVideoClip([background, animated_text])
    
    def _create_outro_clip(self, channel: Dict, duration: int) -> CompositeVideoClip:
        """Create engaging outro with subscribe reminder"""
        
        # Create outro background
        bg_color = self._get_channel_color(channel)
        background = ColorClip(size=(1920, 1080), color=bg_color, duration=duration)
        
        # Subscribe reminder text
        subscribe_text = TextClip(
            "👍 LIKE & SUBSCRIBE for more!",
            fontsize=60,
            color='white',
            font='Arial-Bold'
        ).set_position('center').set_duration(duration)
        
        # Channel name
        channel_text = TextClip(
            channel['name'],
            fontsize=40,
            color='lightgray',
            font='Arial'
        ).set_position(('center', 700)).set_duration(duration)
        
        return CompositeVideoClip([background, subscribe_text, channel_text])
    
    def _select_background_music(self, channel: Dict) -> str:
        """Select appropriate background music for channel type"""
        
        # Music preferences by channel type
        music_styles = {
            'technology': 'upbeat_electronic',
            'education_kids': 'playful_upbeat',
            'lifestyle': 'calm_inspiring',
            'gaming': 'energetic_electronic',
            'health': 'peaceful_motivating',
            'motivation': 'inspiring_powerful'
        }
        
        # In production, you'd have a library of royalty-free music
        # For now, return a placeholder path
        music_dir = os.path.join(self.assets_dir, 'music')
        style = music_styles.get(channel['niche'], 'calm_inspiring')
        
        # Create a silent audio file as placeholder
        placeholder_music = os.path.join(music_dir, f"{style}.wav")
        
        if not os.path.exists(placeholder_music):
            # Create 5 seconds of silence as placeholder
            silent_audio = AudioClip(lambda t: 0, duration=5)
            silent_audio.write_audiofile(placeholder_music, verbose=False, logger=None)
        
        return placeholder_music
    
    def _generate_thumbnail(self, script_data: Dict, channel: Dict, video_id: str) -> str:
        """Generate eye-catching thumbnail"""
        
        # Create thumbnail image
        img = Image.new('RGB', (1280, 720), color=self._get_channel_color(channel))
        draw = ImageDraw.Draw(img)
        
        # Try to load font
        try:
            title_font = ImageFont.truetype("arial.ttf", 60)
        except:
            title_font = ImageFont.load_default()
        
        # Add title text (shortened for thumbnail)
        title = script_data['title'][:40] + "..." if len(script_data['title']) > 40 else script_data['title']
        
        # Add background for text readability
        text_bg = Image.new('RGBA', (1280, 200), (0, 0, 0, 128))
        img.paste(text_bg, (0, 260), text_bg)
        
        # Add title text
        title_bbox = draw.textbbox((0, 0), title, font=title_font)
        title_width = title_bbox[2] - title_bbox[0]
        title_x = (1280 - title_width) // 2
        
        draw.text((title_x, 300), title, fill='white', font=title_font)
        
        # Add click indicators
        draw.text((50, 50), "🔥 VIRAL", fill='red', font=title_font)
        draw.text((1000, 50), "NEW!", fill='yellow', font=title_font)
        
        # Save thumbnail
        thumbnail_path = os.path.join(self.output_dir, f"{video_id}_thumbnail.jpg")
        img.save(thumbnail_path, 'JPEG', quality=95)
        
        return thumbnail_path
    
    def _compile_video(self, visual_clips: List, audio_path: str, music_path: str, 
                      channel: Dict, video_id: str) -> str:
        """Compile all elements into final video"""
        
        # Combine visual clips
        main_video = concatenate_videoclips(visual_clips)
        
        # Load narration audio
        narration = AudioFileClip(audio_path)
        
        # Load background music
        background_music = AudioFileClip(music_path)
        
        # Loop background music to match video duration
        if background_music.duration < main_video.duration:
            background_music = background_music.loop(duration=main_video.duration)
        else:
            background_music = background_music.subclip(0, main_video.duration)
        
        # Mix audio (narration + background music at low volume)
        background_music = background_music.volumex(0.2)  # 20% volume for background
        final_audio = CompositeAudioClip([narration, background_music])
        
        # Set audio to video
        final_video = main_video.set_audio(final_audio)
        
        # Export final video
        output_path = os.path.join(self.output_dir, f"{video_id}_final.mp4")
        
        final_video.write_videofile(
            output_path,
            fps=30,
            codec='libx264',
            audio_codec='aac',
            temp_audiofile='temp-audio.m4a',
            remove_temp=True,
            verbose=False,
            logger=None
        )
        
        return output_path
    
    def _get_video_duration(self, video_path: str) -> float:
        """Get duration of generated video"""
        try:
            clip = VideoFileClip(video_path)
            duration = clip.duration
            clip.close()
            return duration
        except:
            return 0.0
    
    def batch_generate_videos(self, scripts_list: List[Dict], channel_id: str) -> List[Dict]:
        """Generate multiple videos in batch"""
        
        generated_videos = []
        
        for i, script_data in enumerate(scripts_list):
            print(f"Generating video {i+1}/{len(scripts_list)}...")
            
            try:
                video_info = self.generate_video(script_data, channel_id)
                generated_videos.append(video_info)
                
                print(f"✅ Video {i+1} completed: {video_info['title']}")
                
            except Exception as e:
                print(f"❌ Error generating video {i+1}: {str(e)}")
                continue
        
        return generated_videos

# Example usage
if __name__ == "__main__":
    generator = VideoGenerator()
    
    # Sample script data
    sample_script = {
        'title': '10 Tech Tips That Will Change Your Life in 2025',
        'description': 'Discover amazing tech tips...',
        'script': '''
        Welcome to today's video about amazing tech tips!
        
        Tip number one will absolutely blow your mind.
        
        Let's start with smartphone productivity hacks.
        
        And here's the secret that tech companies don't want you to know.
        
        Don't forget to subscribe for more tech content!
        ''',
        'tags': ['tech', 'tips', '2025', 'productivity']
    }
    
    # Generate video
    video_info = generator.generate_video(sample_script, 'channel_1')
    print(f"Generated: {video_info['video_path']}")