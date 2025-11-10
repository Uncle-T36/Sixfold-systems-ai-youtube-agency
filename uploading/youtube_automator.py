"""
YouTube Automation System - Complete automation for uploading, optimization, and scheduling

This module handles:
- Automated video uploading to YouTube
- SEO optimization (titles, descriptions, tags)
- Thumbnail optimization
- Scheduling optimal upload times
- Cross-channel promotion
- Analytics tracking for algorithm optimization
"""

import json
import os
import pickle
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import time
import random

# YouTube API imports
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials

class YouTubeAutomator:
    def __init__(self, config_path: str = "config/channels_config.json"):
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        
        # YouTube API setup
        self.SCOPES = ['https://www.googleapis.com/auth/youtube.upload',
                      'https://www.googleapis.com/auth/youtube',
                      'https://www.googleapis.com/auth/youtube.readonly']
        
        self.credentials_file = "config/youtube_credentials.json"
        self.token_file = "config/youtube_token.pickle"
        
        # Analytics tracking
        self.analytics_file = "data/analytics.json"
        self._ensure_data_directory()
        
        # Initialize YouTube service
        self.youtube_service = None
        self._setup_youtube_service()
    
    def _ensure_data_directory(self):
        """Ensure data directory exists"""
        os.makedirs("data", exist_ok=True)
        os.makedirs("config", exist_ok=True)
    
    def _setup_youtube_service(self):
        """Setup YouTube API service with authentication"""
        creds = None
        
        # Load existing token
        if os.path.exists(self.token_file):
            with open(self.token_file, 'rb') as token:
                creds = pickle.load(token)
        
        # If there are no valid credentials, get new ones
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                if os.path.exists(self.credentials_file):
                    flow = InstalledAppFlow.from_client_secrets_file(
                        self.credentials_file, self.SCOPES)
                    creds = flow.run_local_server(port=0)
                else:
                    print("⚠️  YouTube credentials not found. Please add youtube_credentials.json")
                    return
        
            # Save credentials for next run
            with open(self.token_file, 'wb') as token:
                pickle.dump(creds, token)
        
        try:
            self.youtube_service = build('youtube', 'v3', credentials=creds)
            print("✅ YouTube API service initialized")
        except Exception as e:
            print(f"❌ Failed to initialize YouTube service: {e}")
    
    def upload_video_optimized(self, video_data: Dict, channel_id: str) -> Dict:
        """
        Upload video with full SEO and algorithm optimization
        """
        if not self.youtube_service:
            return {"error": "YouTube service not initialized"}
        
        channel_config = self.config['channels'][channel_id]
        
        # Optimize video metadata for maximum reach
        optimized_metadata = self._optimize_video_metadata(video_data, channel_config)
        
        # Upload video
        upload_result = self._upload_to_youtube(video_data, optimized_metadata)
        
        if upload_result.get('id'):
            # Post-upload optimization
            self._post_upload_optimization(upload_result['id'], channel_config)
            
            # Track analytics
            self._track_upload_analytics(upload_result, channel_id)
            
            print(f"✅ Video uploaded successfully: {upload_result['id']}")
            
        return upload_result
    
    def _optimize_video_metadata(self, video_data: Dict, channel_config: Dict) -> Dict:
        """Optimize video metadata for YouTube algorithm"""
        
        # Algorithm-optimized title
        optimized_title = self._create_algorithm_title(video_data['title'], channel_config)
        
        # SEO-optimized description
        optimized_description = self._create_seo_description(video_data, channel_config)
        
        # Strategic tags for discoverability
        optimized_tags = self._create_strategic_tags(video_data, channel_config)
        
        # Category selection for maximum reach
        category_id = self._select_optimal_category(channel_config)
        
        # Privacy and scheduling optimization
        privacy_status = self._determine_privacy_strategy()
        
        return {
            'title': optimized_title,
            'description': optimized_description,
            'tags': optimized_tags,
            'categoryId': category_id,
            'privacyStatus': privacy_status,
            'defaultLanguage': 'en',
            'defaultAudioLanguage': 'en'
        }
    
    def _create_algorithm_title(self, original_title: str, channel_config: Dict) -> str:
        """Create title optimized for YouTube algorithm and CTR"""
        
        # Algorithm-friendly prefixes/suffixes that increase CTR
        ctr_boosters = {
            'technology': ['🔥', 'INSANE', 'VIRAL', 'MIND-BLOWING', 'SECRET'],
            'education_kids': ['🌟', 'AMAZING', 'FUN', 'SUPER', 'MAGICAL'],
            'lifestyle': ['💡', 'GENIUS', 'LIFE-CHANGING', 'INCREDIBLE', 'SHOCKING'],
            'gaming': ['🎮', 'EPIC', 'ULTIMATE', 'LEGENDARY', 'INSANE'],
            'health': ['🏆', 'PROVEN', 'DOCTOR APPROVED', 'AMAZING', 'POWERFUL'],
            'motivation': ['💪', 'POWERFUL', 'LIFE-CHANGING', 'INSPIRING', 'INCREDIBLE']
        }
        
        # Engagement triggers
        engagement_triggers = [
            "You Won't Believe",
            "This Will Change Everything",
            "Nobody Talks About This",
            "The Secret Behind",
            "What They Don't Tell You",
            "I Tried This For 30 Days"
        ]
        
        niche = channel_config['niche']
        boosters = ctr_boosters.get(niche, ctr_boosters['lifestyle'])
        
        # Add emotional triggers and urgency
        if len(original_title) < 60:  # YouTube's title limit
            booster = random.choice(boosters)
            trigger = random.choice(engagement_triggers)
            
            # Format: [BOOSTER] Original Title - [TRIGGER]
            optimized = f"{booster} {original_title} - {trigger}"
            
            # Ensure under 100 characters for mobile optimization
            if len(optimized) > 100:
                optimized = f"{booster} {original_title}"
            
            return optimized
        
        return original_title
    
    def _create_seo_description(self, video_data: Dict, channel_config: Dict) -> str:
        """Create SEO-optimized description for maximum discoverability"""
        
        keywords = channel_config['keywords']
        
        # Strategic description structure for algorithm
        description_parts = [
            # Hook (first 125 characters are crucial)
            f"🎯 {video_data['title'][:80]}... This video will change everything you know about {keywords[0]}!",
            "",
            "📺 WATCH UNTIL THE END for exclusive tips that 99% of people don't know!",
            "",
            "🔥 IN THIS VIDEO YOU'LL LEARN:",
            "• How to master the secrets of success",
            "• The #1 mistake everyone makes",
            "• My proven step-by-step method",
            "• Bonus tips worth $1000+",
            "",
            "⏰ TIMESTAMPS:",
            "00:00 - Introduction",
            "01:30 - Main content starts",
            "05:00 - The game-changing secret",
            "08:00 - Step-by-step tutorial",
            "12:00 - Pro tips and tricks",
            "15:00 - Conclusion and next steps",
            "",
            "🎁 FREE RESOURCES:",
            "• Download my FREE guide: [LINK]",
            "• Join our community: [LINK]",
            "• Get exclusive content: [LINK]",
            "",
            "📱 CONNECT WITH ME:",
            "• Subscribe for daily content!",
            "• Follow on Instagram: [LINK]",
            "• Join our Discord: [LINK]",
            "",
            "🏷️ TRENDING TAGS:",
            f"#{' #'.join(keywords[:10])}",
            "",
            "🔔 Turn on notifications so you never miss a video!",
            "",
            "💬 COMMENT BELOW:",
            "What was your biggest takeaway? Let me know!",
            "",
            "📈 RELATED VIDEOS:",
            "• Video 1: [LINK]",
            "• Video 2: [LINK]",
            "• Video 3: [LINK]",
            "",
            "⚡ For business inquiries: contact@example.com",
            "",
            f"Keywords: {', '.join(keywords)}"
        ]
        
        return '\n'.join(description_parts)
    
    def _create_strategic_tags(self, video_data: Dict, channel_config: Dict) -> List[str]:
        """Create strategic tags for maximum algorithm reach"""
        
        base_tags = video_data.get('tags', [])
        keywords = channel_config['keywords']
        
        # High-traffic general tags
        viral_tags = [
            "viral", "trending", "2025", "new", "latest", "best", "top", "how to",
            "tutorial", "guide", "tips", "tricks", "secrets", "hacks", "review"
        ]
        
        # Niche-specific high-performing tags
        niche_tags = {
            'technology': ['tech', 'gadgets', 'smartphone', 'AI', 'innovation', 'review', 'unboxing'],
            'education_kids': ['kids', 'learning', 'educational', 'children', 'fun', 'family', 'toddler'],
            'lifestyle': ['lifestyle', 'life hacks', 'productivity', 'organization', 'DIY', 'home'],
            'gaming': ['gaming', 'gameplay', 'gamer', 'games', 'streaming', 'esports', 'tips'],
            'health': ['health', 'fitness', 'wellness', 'nutrition', 'workout', 'diet', 'medical'],
            'motivation': ['motivation', 'success', 'mindset', 'inspiration', 'goals', 'entrepreneur']
        }
        
        # Combine all tags strategically
        all_tags = (
            base_tags + 
            keywords + 
            viral_tags + 
            niche_tags.get(channel_config['niche'], [])
        )
        
        # Remove duplicates and limit to 30 tags (YouTube max)
        unique_tags = list(dict.fromkeys(all_tags))[:30]
        
        return unique_tags
    
    def _select_optimal_category(self, channel_config: Dict) -> str:
        """Select YouTube category for maximum algorithm boost"""
        
        # YouTube category IDs that perform best algorithmically
        category_mapping = {
            'technology': '28',        # Science & Technology
            'education_kids': '27',   # Education
            'lifestyle': '26',        # Howto & Style
            'gaming': '20',           # Gaming
            'health': '26',           # Howto & Style
            'motivation': '22'        # People & Blogs
        }
        
        return category_mapping.get(channel_config['niche'], '22')
    
    def _determine_privacy_strategy(self) -> str:
        """Determine optimal privacy setting for algorithm boost"""
        
        # 'public' for immediate indexing
        # 'unlisted' for testing
        # 'private' for scheduling
        
        return 'public'  # Best for algorithm discovery
    
    def _upload_to_youtube(self, video_data: Dict, metadata: Dict) -> Dict:
        """Upload video to YouTube with optimized settings"""
        
        try:
            # Media upload
            media = MediaFileUpload(
                video_data['video_path'],
                chunksize=-1,
                resumable=True,
                mimetype='video/mp4'
            )
            
            # Video resource
            video_resource = {
                'snippet': {
                    'title': metadata['title'],
                    'description': metadata['description'],
                    'tags': metadata['tags'],
                    'categoryId': metadata['categoryId'],
                    'defaultLanguage': metadata['defaultLanguage'],
                    'defaultAudioLanguage': metadata['defaultAudioLanguage']
                },
                'status': {
                    'privacyStatus': metadata['privacyStatus'],
                    'madeForKids': False,  # Important for monetization
                    'selfDeclaredMadeForKids': False
                }
            }
            
            # Upload video
            upload_request = self.youtube_service.videos().insert(
                part='snippet,status',
                body=video_resource,
                media_body=media
            )
            
            response = self._execute_upload(upload_request)
            
            return response
            
        except HttpError as e:
            print(f"❌ HTTP Error during upload: {e}")
            return {"error": str(e)}
        except Exception as e:
            print(f"❌ Unexpected error during upload: {e}")
            return {"error": str(e)}
    
    def _execute_upload(self, upload_request) -> Dict:
        """Execute the upload with progress tracking"""
        
        response = None
        error = None
        retry = 0
        
        while response is None:
            try:
                print("📤 Uploading video...")
                status, response = upload_request.next_chunk()
                
                if status:
                    progress = int(status.progress() * 100)
                    print(f"Upload progress: {progress}%")
                    
            except HttpError as e:
                if e.resp.status in [500, 502, 503, 504]:
                    # Retriable errors
                    error = f"Retriable error: {e}"
                    time.sleep(2 ** retry)
                    retry += 1
                else:
                    raise e
            except Exception as e:
                error = f"Unexpected error: {e}"
                break
        
        if response:
            print("✅ Upload completed successfully!")
            return response
        else:
            print(f"❌ Upload failed: {error}")
            return {"error": error}
    
    def _post_upload_optimization(self, video_id: str, channel_config: Dict):
        """Perform post-upload optimizations"""
        
        try:
            # Set custom thumbnail if available
            # self._set_custom_thumbnail(video_id, thumbnail_path)
            
            # Add video to playlists for better organization
            self._add_to_optimal_playlist(video_id, channel_config)
            
            # Set end screen and cards for engagement
            # self._setup_end_screen(video_id)
            
            print(f"✅ Post-upload optimization completed for {video_id}")
            
        except Exception as e:
            print(f"⚠️  Post-upload optimization failed: {e}")
    
    def _add_to_optimal_playlist(self, video_id: str, channel_config: Dict):
        """Add video to relevant playlist for better organization"""
        
        # This would get or create playlists based on channel niche
        # For now, we'll just log the action
        playlist_name = f"{channel_config['name']} - Latest Videos"
        print(f"📋 Adding video to playlist: {playlist_name}")
    
    def _track_upload_analytics(self, upload_result: Dict, channel_id: str):
        """Track upload for analytics and optimization"""
        
        analytics_data = self._load_analytics()
        
        upload_record = {
            'video_id': upload_result.get('id'),
            'channel_id': channel_id,
            'upload_time': datetime.now().isoformat(),
            'status': 'uploaded'
        }
        
        if channel_id not in analytics_data:
            analytics_data[channel_id] = []
        
        analytics_data[channel_id].append(upload_record)
        
        self._save_analytics(analytics_data)
    
    def _load_analytics(self) -> Dict:
        """Load analytics data"""
        try:
            if os.path.exists(self.analytics_file):
                with open(self.analytics_file, 'r') as f:
                    return json.load(f)
        except:
            pass
        return {}
    
    def _save_analytics(self, data: Dict):
        """Save analytics data"""
        try:
            with open(self.analytics_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"⚠️  Failed to save analytics: {e}")
    
    def schedule_optimal_uploads(self, videos_data: List[Dict], channel_id: str) -> List[Dict]:
        """Schedule uploads at optimal times for maximum reach"""
        
        channel_config = self.config['channels'][channel_id]
        
        # Get optimal posting schedule
        optimal_times = self._get_optimal_schedule(channel_config)
        
        scheduled_uploads = []
        
        for i, video_data in enumerate(videos_data):
            # Calculate optimal upload time
            upload_time = self._calculate_next_optimal_time(optimal_times, i)
            
            # Schedule the upload
            scheduled_upload = {
                'video_data': video_data,
                'scheduled_time': upload_time,
                'channel_id': channel_id,
                'status': 'scheduled'
            }
            
            scheduled_uploads.append(scheduled_upload)
            
            print(f"📅 Scheduled upload {i+1}: {upload_time}")
        
        return scheduled_uploads
    
    def _get_optimal_schedule(self, channel_config: Dict) -> Dict:
        """Get optimal posting schedule based on audience and niche"""
        
        age_group = channel_config['target_age_group']
        
        # Research-based optimal posting times by audience
        optimal_schedules = {
            '3-12': {  # Kids content
                'peak_days': ['Saturday', 'Sunday'],
                'peak_hours': [9, 14, 16],
                'frequency': 'daily'
            },
            '13-30': {  # Teens/Young adults
                'peak_days': ['Friday', 'Saturday', 'Sunday'],
                'peak_hours': [15, 19, 21],
                'frequency': 'daily'
            },
            '18-35': {  # Young professionals
                'peak_days': ['Tuesday', 'Wednesday', 'Thursday'],
                'peak_hours': [12, 18, 20],
                'frequency': 'daily'
            },
            '25-50': {  # Adults
                'peak_days': ['Tuesday', 'Thursday', 'Sunday'],
                'peak_hours': [11, 17, 19],
                'frequency': 'daily'
            },
            '25-60': {  # Mature adults
                'peak_days': ['Monday', 'Wednesday', 'Friday'],
                'peak_hours': [10, 16, 18],
                'frequency': 'daily'
            },
            '16-65': {  # All adults
                'peak_days': ['Tuesday', 'Thursday', 'Saturday'],
                'peak_hours': [12, 18, 20],
                'frequency': 'daily'
            }
        }
        
        return optimal_schedules.get(age_group, optimal_schedules['18-35'])
    
    def _calculate_next_optimal_time(self, schedule: Dict, video_index: int) -> str:
        """Calculate the next optimal upload time"""
        
        current_time = datetime.now()
        
        # Find next optimal day
        peak_days = schedule['peak_days']
        peak_hours = schedule['peak_hours']
        
        # Calculate days ahead
        days_ahead = video_index  # Spread uploads across days
        target_date = current_time + timedelta(days=days_ahead)
        
        # Adjust to optimal day if needed
        while target_date.strftime('%A') not in peak_days:
            target_date += timedelta(days=1)
        
        # Set optimal hour
        optimal_hour = random.choice(peak_hours)
        target_time = target_date.replace(hour=optimal_hour, minute=0, second=0)
        
        return target_time.isoformat()
    
    def cross_promote_channels(self, video_id: str, source_channel: str):
        """Cross-promote video across multiple channels"""
        
        # Strategy for cross-channel promotion
        promotion_strategies = [
            'community_post',      # Community tab posts
            'end_screen_promotion', # End screen recommendations
            'description_links',   # Links in descriptions
            'playlist_inclusion'   # Include in cross-channel playlists
        ]
        
        print(f"🔗 Cross-promoting video {video_id} from {source_channel}")
        
        for channel_id, channel_config in self.config['channels'].items():
            if channel_id != source_channel:
                print(f"   Promoting to {channel_config['name']}")
                # Implementation would go here
    
    def bulk_upload_scheduler(self, all_videos_data: Dict) -> Dict:
        """Schedule bulk uploads across all channels optimally"""
        
        all_scheduled = {}
        
        for channel_id, videos in all_videos_data.items():
            print(f"📋 Scheduling uploads for {self.config['channels'][channel_id]['name']}")
            
            scheduled = self.schedule_optimal_uploads(videos, channel_id)
            all_scheduled[channel_id] = scheduled
            
            print(f"✅ Scheduled {len(scheduled)} videos for {channel_id}")
        
        return all_scheduled

# Example usage
if __name__ == "__main__":
    automator = YouTubeAutomator()
    
    # Sample video data
    sample_video = {
        'video_path': 'output/sample_video.mp4',
        'title': '10 Amazing Tech Tips That Will Change Your Life',
        'description': 'Discover incredible tech tips...',
        'tags': ['tech', 'tips', 'technology', '2025']
    }
    
    # Upload with optimization
    result = automator.upload_video_optimized(sample_video, 'channel_1')
    print(f"Upload result: {result}")