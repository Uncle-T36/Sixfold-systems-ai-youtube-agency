"""
AI YouTube Agency - Complete Automation System for 6 YouTube Channels

This system automates:
- Content creation with AI-generated scripts
- Video production with professional quality
- YouTube uploads with SEO optimization
- Analytics tracking for monetization
- Trend analysis for viral content

Built to get your channels monetized as fast as possible!
"""

import json
import os
import sys
from datetime import datetime
import time

# Import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from scripts.ai_script_generator import AIScriptGenerator
from video_generation.video_generator import VideoGenerator
from trend_analysis.trend_analyzer import TrendAnalyzer
from uploading.youtube_automator import YouTubeAutomator
from analytics.monetization_optimizer import MonetizationOptimizer

class AIYouTubeAgency:
    def __init__(self):
        print("🚀 Initializing AI YouTube Agency...")
        
        # Initialize all components
        self.script_generator = AIScriptGenerator()
        self.video_generator = VideoGenerator()
        self.trend_analyzer = TrendAnalyzer()
        self.youtube_automator = YouTubeAutomator()
        self.monetization_optimizer = MonetizationOptimizer()
        
        # Load configuration
        with open("config/channels_config.json", 'r') as f:
            self.config = json.load(f)
        
        print("✅ AI YouTube Agency ready for action!")
    
    def generate_daily_content_for_all_channels(self):
        """Generate and upload content for all 6 channels - Daily workflow"""
        
        print("\n🎬 Starting daily content generation for all channels...")
        
        all_results = {}
        
        for channel_id, channel_config in self.config['channels'].items():
            print(f"\n{'='*50}")
            print(f"📺 Processing {channel_config['name']}")
            print(f"   Niche: {channel_config['niche']}")
            print(f"   Target: {channel_config['target_age_group']}")
            print(f"{'='*50}")
            
            try:
                # Step 1: Analyze trends and get viral opportunities
                print("🔍 Analyzing trends and viral opportunities...")
                opportunities = self.trend_analyzer.get_viral_opportunities(channel_id)
                best_topic = opportunities[0]['topic'] if opportunities else None
                
                print(f"   🎯 Best opportunity: {best_topic}")
                print(f"   💰 Estimated revenue: ${self.trend_analyzer._estimate_revenue(opportunities[0], channel_config) if opportunities else 0}")
                
                # Step 2: Generate AI script
                print("✍️ Generating AI-powered script...")
                script_data = self.script_generator.generate_long_form_script(
                    channel_id, topic=best_topic
                )
                
                print(f"   📝 Title: {script_data['title']}")
                print(f"   ⏱️ Duration: {script_data['estimated_duration_minutes']} minutes")
                
                # Step 3: Create professional video
                print("🎥 Creating professional video...")
                video_info = self.video_generator.generate_video(script_data, channel_id)
                
                print(f"   🎬 Video created: {video_info['video_path']}")
                print(f"   🖼️ Thumbnail: {video_info['thumbnail_path']}")
                
                # Step 4: Upload with full optimization
                print("📤 Uploading with SEO optimization...")
                upload_result = self.youtube_automator.upload_video_optimized(video_info, channel_id)
                
                if upload_result.get('id'):
                    print(f"   ✅ Upload successful! Video ID: {upload_result['id']}")
                else:
                    print(f"   ⚠️ Upload simulation (add YouTube credentials for real uploads)")
                
                # Step 5: Track monetization progress
                print("📊 Analyzing monetization progress...")
                progress = self.monetization_optimizer.track_monetization_progress(channel_id)
                
                print(f"   📈 Subscriber progress: {progress['progress_percentages']['subscribers']:.1f}%")
                print(f"   ⏰ Est. time to monetization: {progress['estimated_time_remaining']['weeks_remaining']} weeks")
                
                # Store results
                all_results[channel_id] = {
                    'script': script_data,
                    'video': video_info,
                    'upload': upload_result,
                    'progress': progress,
                    'opportunities': opportunities[:3]  # Top 3 opportunities
                }
                
                print(f"✅ {channel_config['name']} content pipeline completed!")
                
            except Exception as e:
                print(f"❌ Error processing {channel_id}: {str(e)}")
                all_results[channel_id] = {'error': str(e)}
                continue
        
        # Generate daily summary report
        self._generate_daily_report(all_results)
        
        return all_results
    
    def analyze_all_channels_performance(self):
        """Analyze performance across all channels for optimization"""
        
        print("\n📊 Analyzing performance across all channels...")
        
        performance_summary = {}
        
        for channel_id, channel_config in self.config['channels'].items():
            print(f"\n🔍 Analyzing {channel_config['name']}...")
            
            # Get algorithm analysis
            algorithm_analysis = self.monetization_optimizer.analyze_algorithm_patterns(channel_id)
            
            # Get monetization progress
            monetization_progress = self.monetization_optimizer.track_monetization_progress(channel_id)
            
            # Get viral strategy
            viral_strategy = self.monetization_optimizer.generate_viral_content_strategy(channel_id)
            
            performance_summary[channel_id] = {
                'algorithm_insights': algorithm_analysis,
                'monetization_status': monetization_progress,
                'viral_opportunities': viral_strategy,
                'next_actions': algorithm_analysis['algorithm_recommendations'][:5]
            }
            
            # Print key insights
            print(f"   📈 Subscriber progress: {monetization_progress['progress_percentages']['subscribers']:.1f}%")
            print(f"   ⏰ Weeks to monetization: {monetization_progress['estimated_time_remaining']['weeks_remaining']}")
            print(f"   🎯 Priority action: {monetization_progress['next_actions'][0] if monetization_progress['next_actions'] else 'Keep creating content'}")
        
        return performance_summary
    
    def generate_weekly_content_calendar(self):
        """Generate optimized content calendar for all channels"""
        
        print("\n📅 Generating weekly content calendar...")
        
        weekly_calendar = {}
        
        for channel_id, channel_config in self.config['channels'].items():
            print(f"📋 Planning content for {channel_config['name']}...")
            
            # Generate 7-day calendar
            calendar = self.trend_analyzer.generate_content_calendar(channel_id, days=7)
            weekly_calendar[channel_id] = calendar
            
            print(f"   📺 {len(calendar)} videos planned")
            print(f"   💰 Est. weekly revenue: ${sum(entry['estimated_revenue'] for entry in calendar):.2f}")
        
        # Save calendar to file
        calendar_file = f"data/weekly_calendar_{datetime.now().strftime('%Y%m%d')}.json"
        os.makedirs("data", exist_ok=True)
        
        with open(calendar_file, 'w') as f:
            json.dump(weekly_calendar, f, indent=2)
        
        print(f"✅ Weekly calendar saved to {calendar_file}")
        
        return weekly_calendar
    
    def run_monetization_sprint(self, channel_id: str):
        """Intensive 7-day sprint to boost a specific channel toward monetization"""
        
        channel_config = self.config['channels'][channel_id]
        print(f"\n🏃‍♂️ Starting monetization sprint for {channel_config['name']}!")
        
        # Generate multiple videos for the sprint
        sprint_videos = []
        
        for day in range(7):
            print(f"\n📅 Day {day + 1} of sprint...")
            
            # Get trending topic for today
            opportunities = self.trend_analyzer.get_viral_opportunities(channel_id)
            topic = opportunities[day % len(opportunities)]['topic']
            
            # Generate script
            script = self.script_generator.generate_long_form_script(channel_id, topic=topic)
            
            # Create video
            video = self.video_generator.generate_video(script, channel_id)
            
            sprint_videos.append({
                'day': day + 1,
                'topic': topic,
                'script': script,
                'video': video
            })
            
            print(f"   ✅ Day {day + 1} content ready: {script['title']}")
        
        # Schedule optimal uploads
        scheduled_uploads = self.youtube_automator.schedule_optimal_uploads(
            [v['video'] for v in sprint_videos], channel_id
        )
        
        print(f"\n🚀 Sprint complete! {len(sprint_videos)} videos ready for upload")
        print("📅 Upload schedule:")
        
        for i, upload in enumerate(scheduled_uploads):
            print(f"   Day {i+1}: {upload['scheduled_time']}")
        
        return {
            'videos': sprint_videos,
            'schedule': scheduled_uploads,
            'estimated_boost': "Expected 3-5x subscriber growth during sprint week"
        }
    
    def _generate_daily_report(self, results: dict):
        """Generate daily performance report"""
        
        report_date = datetime.now().strftime('%Y-%m-%d')
        
        print(f"\n📋 DAILY REPORT - {report_date}")
        print("="*60)
        
        total_videos = len([r for r in results.values() if 'video' in r])
        total_errors = len([r for r in results.values() if 'error' in r])
        
        print(f"📊 SUMMARY:")
        print(f"   ✅ Videos created: {total_videos}")
        print(f"   ❌ Errors: {total_errors}")
        print(f"   🎯 Success rate: {(total_videos/(total_videos+total_errors)*100):.1f}%" if total_videos+total_errors > 0 else "   🎯 Success rate: 0%")
        
        print(f"\n📺 CHANNEL BREAKDOWN:")
        
        for channel_id, result in results.items():
            channel_name = self.config['channels'][channel_id]['name']
            
            if 'error' in result:
                print(f"   ❌ {channel_name}: Error - {result['error']}")
            else:
                progress = result.get('progress', {}).get('progress_percentages', {})
                print(f"   ✅ {channel_name}:")
                print(f"      📈 Subscriber progress: {progress.get('subscribers', 0):.1f}%")
                print(f"      ⏰ Est. monetization: {result.get('progress', {}).get('estimated_time_remaining', {}).get('weeks_remaining', 'N/A')} weeks")
        
        # Save report
        report_file = f"data/daily_report_{report_date}.json"
        with open(report_file, 'w') as f:
            json.dump({
                'date': report_date,
                'summary': {
                    'videos_created': total_videos,
                    'errors': total_errors,
                    'success_rate': (total_videos/(total_videos+total_errors)*100) if total_videos+total_errors > 0 else 0
                },
                'results': results
            }, f, indent=2)
        
        print(f"\n💾 Report saved to {report_file}")

def main():
    """Main entry point for the AI YouTube Agency"""
    
    print("🎬 Welcome to AI YouTube Agency!")
    print("💰 Your automated path to YouTube monetization")
    print()
    
    # Initialize the agency
    agency = AIYouTubeAgency()
    
    print("\nChoose your action:")
    print("1. 🚀 Generate daily content for ALL channels")
    print("2. 📊 Analyze all channels performance")
    print("3. 📅 Generate weekly content calendar")
    print("4. 🏃‍♂️ Run monetization sprint (single channel)")
    print("5. 🎯 Quick demo (single channel)")
    
    try:
        choice = input("\nEnter your choice (1-5): ").strip()
        
        if choice == "1":
            print("\n🚀 Starting daily content generation...")
            results = agency.generate_daily_content_for_all_channels()
            print("\n✅ Daily content generation complete!")
            
        elif choice == "2":
            print("\n📊 Analyzing performance...")
            performance = agency.analyze_all_channels_performance()
            print("\n✅ Performance analysis complete!")
            
        elif choice == "3":
            print("\n📅 Generating content calendar...")
            calendar = agency.generate_weekly_content_calendar()
            print("\n✅ Content calendar ready!")
            
        elif choice == "4":
            print("\nSelect channel for sprint:")
            for i, (channel_id, config) in enumerate(agency.config['channels'].items(), 1):
                print(f"{i}. {config['name']} ({config['niche']})")
            
            channel_choice = input("Enter channel number: ").strip()
            try:
                channel_index = int(channel_choice) - 1
                channel_id = list(agency.config['channels'].keys())[channel_index]
                
                sprint_result = agency.run_monetization_sprint(channel_id)
                print("\n🏆 Monetization sprint complete!")
                
            except (ValueError, IndexError):
                print("❌ Invalid channel selection")
                
        elif choice == "5":
            print("\n🎯 Running quick demo with first channel...")
            channel_id = list(agency.config['channels'].keys())[0]
            
            # Quick demo workflow
            opportunities = agency.trend_analyzer.get_viral_opportunities(channel_id)
            script = agency.script_generator.generate_long_form_script(channel_id)
            progress = agency.monetization_optimizer.track_monetization_progress(channel_id)
            
            print(f"✅ Demo complete!")
            print(f"   🎯 Best opportunity: {opportunities[0]['topic'] if opportunities else 'Tech content'}")
            print(f"   📝 Script title: {script['title']}")
            print(f"   📈 Monetization progress: {progress['progress_percentages']['subscribers']:.1f}%")
            
        else:
            print("❌ Invalid choice")
            
    except KeyboardInterrupt:
        print("\n\n👋 Exiting AI YouTube Agency. See you next time!")
    except Exception as e:
        print(f"\n❌ An error occurred: {str(e)}")
        print("Check the logs and try again.")

if __name__ == "__main__":
    main()
