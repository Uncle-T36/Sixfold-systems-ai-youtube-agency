"""
AI Script Generator - Creates long-form, engaging video scripts for monetization

This module generates high-quality, 10-25 minute video scripts optimized for:
- High watch time and retention
- Engagement and monetization
- SEO optimization
- Age-appropriate content for different channels
"""

import json
import requests
import random
from typing import Dict, List
import time

class AIScriptGenerator:
    def __init__(self, config_path: str = "config/channels_config.json"):
        with open(config_path, 'r') as f:
            self.config = json.load(f)
    
    def generate_long_form_script(self, channel_id: str, topic: str = None) -> Dict:
        """
        Generate a long-form script (10-25 minutes) optimized for monetization
        """
        channel = self.config['channels'][channel_id]
        target_length = channel['video_length_minutes']
        
        if not topic:
            topic = self._get_trending_topic(channel)
        
        script_structure = self._create_script_structure(channel, topic, target_length)
        full_script = self._generate_detailed_script(script_structure, channel)
        
        return {
            'title': self._generate_clickable_title(topic, channel),
            'description': self._generate_seo_description(topic, channel),
            'script': full_script,
            'tags': self._generate_tags(topic, channel),
            'thumbnail_prompt': self._generate_thumbnail_prompt(topic),
            'estimated_duration_minutes': target_length,
            'monetization_hooks': self._add_monetization_hooks(channel)
        }
    
    def _create_script_structure(self, channel: Dict, topic: str, target_length: int) -> Dict:
        """Create engaging script structure for long-form content"""
        
        # Calculate timing for maximum retention
        intro_time = 0.5  # 30 seconds
        hook_time = 1.0   # 1 minute
        main_content_time = target_length - 3  # Most of the video
        outro_time = 1.5  # 1.5 minutes
        
        structure = {
            'hook': {
                'duration_minutes': hook_time,
                'content': f"Start with a compelling question or shocking fact about {topic}"
            },
            'intro': {
                'duration_minutes': intro_time,
                'content': "Quick channel intro and video preview"
            },
            'main_sections': [],
            'outro': {
                'duration_minutes': outro_time,
                'content': "Call to action, subscribe reminder, next video tease"
            }
        }
        
        # Create main content sections
        num_sections = max(3, int(main_content_time / 3))  # 3-minute sections minimum
        section_duration = main_content_time / num_sections
        
        for i in range(num_sections):
            structure['main_sections'].append({
                'section_number': i + 1,
                'duration_minutes': section_duration,
                'content_type': self._get_section_type(channel['content_style'], i),
                'engagement_hook': f"Section {i+1} hook for {topic}"
            })
        
        return structure
    
    def _generate_detailed_script(self, structure: Dict, channel: Dict) -> str:
        """Generate detailed script content for each section"""
        
        script_parts = []
        
        # Hook section - CRITICAL for retention
        script_parts.append(f"""
[HOOK - 0:00-1:00]
🎯 ATTENTION GRABBER: 
"Did you know that [shocking fact about topic]? By the end of this video, you'll understand exactly how this works and how you can [benefit]. But first, let me show you something that will blow your mind..."

[Visual cue: Show intriguing preview clip]
[Music: Upbeat, attention-grabbing]
""")
        
        # Intro section
        script_parts.append(f"""
[INTRO - 1:00-1:30]
"Welcome back to {channel['name']}! I'm your host and today we're diving deep into [topic]. This is going to be a complete guide that covers everything you need to know."

[Visual: Channel logo animation]
[Call to action: "If you're new here, hit that subscribe button and ring the notification bell!"]
""")
        
        # Main content sections
        for i, section in enumerate(structure['main_sections']):
            section_content = self._generate_section_content(section, channel, i)
            script_parts.append(section_content)
        
        # Outro section
        script_parts.append(f"""
[OUTRO - Final 1:30]
"And that's a wrap on today's deep dive! I hope you found this valuable. Let me know in the comments what you thought and what you'd like to see next."

[Engagement hooks:]
- "Which part surprised you the most?"
- "Have you tried any of these techniques?"
- "What should I cover in the next video?"

[Subscribe reminder with benefit:]
"If you enjoyed this content, subscribe for more [channel niche] content. I post new videos every day with tips that can actually change your [relevant outcome]."

[End screen with suggested videos]
""")
        
        return '\n'.join(script_parts)
    
    def _generate_section_content(self, section: Dict, channel: Dict, section_index: int) -> str:
        """Generate content for each main section"""
        
        content_templates = {
            'educational': [
                "Let's break this down step by step...",
                "Here's what most people don't realize...",
                "The science behind this is fascinating...",
                "Let me show you the exact process..."
            ],
            'entertainment': [
                "You won't believe what happens next...",
                "This is where it gets really interesting...",
                "Hold on to your seats for this part...",
                "The plot twist nobody saw coming..."
            ],
            'tutorial': [
                "Now we're going to do this together...",
                "Follow along as I demonstrate...",
                "Here's the exact method I use...",
                "Let's see this in action..."
            ],
            'inspirational': [
                "This story will change your perspective...",
                "Here's what this teaches us about life...",
                "The lesson here is powerful...",
                "This principle changed everything for me..."
            ]
        }
        
        style = channel['content_style']
        template = random.choice(content_templates.get(style, content_templates['educational']))
        
        # Add retention hooks every few minutes
        retention_hooks = [
            "But wait, there's more...",
            "Stick around because the next part is even better...",
            "Don't click away yet, because what I'm about to show you...",
            "Keep watching because this next tip alone is worth the entire video..."
        ]
        
        section_content = f"""
[SECTION {section['section_number']} - {section['duration_minutes']:.1f} minutes]

{template}

[Content Body - Detailed explanation with examples]
[Visual cues: Show relevant images, charts, or demonstrations]
[Engagement: Ask questions to keep viewers active]

{random.choice(retention_hooks) if section_index % 2 == 0 else ""}

[Transition to next section]
"""
        
        return section_content
    
    def _generate_clickable_title(self, topic: str, channel: Dict) -> str:
        """Generate click-worthy titles optimized for CTR"""
        
        title_templates = {
            'technology': [
                f"🔥 {topic}: The Game-Changing Feature Nobody Talks About",
                f"I Tested {topic} for 30 Days - Here's What Happened",
                f"{topic} vs Reality: What They Don't Want You to Know"
            ],
            'education_kids': [
                f"🌟 Learn {topic} - Fun & Easy for Kids!",
                f"Amazing {topic} Facts That Will Surprise You!",
                f"The Best Way to Teach {topic} to Children"
            ],
            'lifestyle': [
                f"💡 {topic} Hacks That Actually Work (Tested!)",
                f"I Tried {topic} for a Week - Results Will Shock You",
                f"The Ultimate {topic} Guide (Save Time & Money)"
            ],
            'gaming': [
                f"🎮 {topic}: The Secret Strategy Pro Players Use",
                f"I Spent 100 Hours on {topic} - Here's Everything",
                f"{topic} Tips That Will Make You Unstoppable"
            ],
            'health': [
                f"🏃‍♂️ {topic}: What Doctors Don't Tell You",
                f"I Tried {topic} for 30 Days - Amazing Results",
                f"The Science Behind {topic} (You'll Be Surprised)"
            ],
            'motivation': [
                f"💪 How {topic} Changed My Life Forever",
                f"The {topic} Story That Will Inspire You",
                f"{topic}: The Success Secret Nobody Shares"
            ]
        }
        
        niche = channel['niche']
        templates = title_templates.get(niche, title_templates['lifestyle'])
        return random.choice(templates)
    
    def _generate_seo_description(self, topic: str, channel: Dict) -> str:
        """Generate SEO-optimized description for better discoverability"""
        
        keywords = ', '.join(channel['keywords'])
        
        description = f"""
In this comprehensive guide, we dive deep into {topic}. You'll learn everything you need to know about {topic}, including expert tips, real-world examples, and actionable strategies you can implement today.

🎯 What You'll Learn:
• [Key point 1 about {topic}]
• [Key point 2 about {topic}]
• [Key point 3 about {topic}]
• [Key point 4 about {topic}]

⏰ Timestamps:
00:00 - Introduction
01:00 - [Section 1]
03:00 - [Section 2]
[Add more timestamps based on content]

🔗 Helpful Resources:
[Add affiliate links and resources]

Keywords: {keywords}

Subscribe for more {channel['niche']} content! New videos daily.

#shorts #{topic.replace(' ', '')} #{channel['niche']}
"""
        return description
    
    def _generate_tags(self, topic: str, channel: Dict) -> List[str]:
        """Generate relevant tags for better discoverability"""
        
        base_tags = channel['keywords'].copy()
        topic_tags = [
            topic,
            f"{topic} guide",
            f"{topic} tutorial",
            f"{topic} tips",
            f"how to {topic}",
            f"{topic} explained"
        ]
        
        trending_tags = [
            "viral",
            "trending",
            "2025",
            "new",
            "latest",
            "best"
        ]
        
        all_tags = base_tags + topic_tags + trending_tags
        return list(set(all_tags))[:30]  # YouTube allows max 30 tags
    
    def _generate_thumbnail_prompt(self, topic: str) -> str:
        """Generate AI prompt for creating click-worthy thumbnails"""
        
        return f"""
Create a bright, high-contrast YouTube thumbnail for a video about '{topic}'.
Include:
- Bold, readable text overlay
- Vibrant colors (red, yellow, blue)
- Surprised or excited facial expression
- Arrow pointing to key element
- High contrast background
- Professional but eye-catching design
- 1280x720 resolution
- Text should be readable on mobile devices
"""
    
    def _add_monetization_hooks(self, channel: Dict) -> Dict:
        """Add monetization elements throughout the video"""
        
        strategy = channel['monetization_strategy']
        
        hooks = {
            'affiliate_placements': [
                "Speaking of tools, the one I personally use and recommend is...",
                "If you want to try this yourself, I've left links in the description...",
                "The exact product I showed you is linked below..."
            ],
            'subscribe_reminders': [
                "If this helped you, hit that subscribe button!",
                "Subscribe for more content like this!",
                "Don't forget to subscribe and ring that notification bell!"
            ],
            'engagement_boosters': [
                "Let me know in the comments if you've tried this...",
                "What's your experience with this? Comment below!",
                "Share this video if you found it helpful!"
            ],
            'watch_time_boosters': [
                "Stay tuned because in the next section...",
                "Don't click away yet, the best part is coming...",
                "Watch until the end for a special bonus tip..."
            ]
        }
        
        return hooks
    
    def _get_trending_topic(self, channel: Dict) -> str:
        """Get trending topic for the channel niche"""
        # This would integrate with Google Trends API or YouTube API
        # For now, return a sample topic
        sample_topics = {
            'technology': 'Latest AI Tools for 2025',
            'education_kids': 'Fun Math Games for Children',
            'lifestyle': 'Organization Hacks for Small Spaces',
            'gaming': 'Best Games Released This Month',
            'health': 'Morning Routine for Better Energy',
            'motivation': 'Success Habits of Millionaires'
        }
        
        return sample_topics.get(channel['niche'], 'Trending Topic')
    
    def _get_section_type(self, content_style: str, section_index: int) -> str:
        """Determine the type of content for each section"""
        
        section_types = {
            'educational': ['explanation', 'example', 'case_study', 'demonstration'],
            'entertainment': ['story', 'reaction', 'comparison', 'reveal'],
            'tutorial': ['step_by_step', 'demonstration', 'troubleshooting', 'tips'],
            'inspirational': ['story', 'lesson', 'application', 'reflection']
        }
        
        types = section_types.get(content_style, section_types['educational'])
        return types[section_index % len(types)]

# Example usage
if __name__ == "__main__":
    generator = AIScriptGenerator()
    
    # Generate script for each channel
    for channel_id in generator.config['channels'].keys():
        script = generator.generate_long_form_script(channel_id)
        print(f"\n=== {channel_id.upper()} ===")
        print(f"Title: {script['title']}")
        print(f"Duration: {script['estimated_duration_minutes']} minutes")
        print(f"Tags: {', '.join(script['tags'][:10])}")
        print(f"Script preview: {script['script'][:300]}...")