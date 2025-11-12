import React, { useEffect } from 'react';
import InteractiveDashboard from '../components/InteractiveDashboard';
import AppNavigation from '../components/AppNavigation';
import ActivityFeed from '../components/ActivityFeed';
import WealthAutopilot from '../components/WealthAutopilot';
import SupportInfo from '../components/SupportInfo';
import TycoonIntelligence from '../components/TycoonIntelligence';
import LiveMoneyCounter from '../components/LiveMoneyCounter';
import AutopilotMode from '../components/AutopilotMode';
import ViralPredictor from '../components/ViralPredictor';
import { generateFirstVideoForAllChannels } from '../lib/firstVideoGenerator';

export default function Dashboard() {
  useEffect(() => {
    // Auto-generate first videos for all channels on dashboard load
    const autoGenerate = async () => {
      const channels = JSON.parse(localStorage.getItem('youtube_channels') || '[]');
      
      if (channels.length > 0) {
        // Check if any channel needs first video
        let needsGeneration = false;
        for (const channel of channels) {
          const videos = JSON.parse(localStorage.getItem(`videos_${channel.id}`) || '[]');
          if (videos.length === 0) {
            needsGeneration = true;
            break;
          }
        }
        
        if (needsGeneration) {
          console.log('🎬 Auto-generating first videos for all channels...');
          await generateFirstVideoForAllChannels();
        }
      }
    };
    
    autoGenerate();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
      <AppNavigation title="Dashboard" currentPage="AI Tycoon Command Center" showBack={false} />
      <div className="sm:ml-20 lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          {/* Live Money Counter - Most important! */}
          <div className="mb-6">
            <LiveMoneyCounter />
          </div>

          {/* AI Autopilot Mode */}
          <div className="mb-6">
            <AutopilotMode />
          </div>

          {/* Viral Predictor */}
          <div className="mb-6">
            <ViralPredictor />
          </div>

          {/* AI Business Tycoon Intelligence - What AI is doing 24/7 */}
          <div className="mb-8">
            <TycoonIntelligence />
          </div>

          <div className="mb-6">
            <WealthAutopilot />
          </div>
          <div className="mb-6">
            <ActivityFeed />
          </div>
          <InteractiveDashboard />
          
          {/* Support Info */}
          <div className="mt-8">
            <SupportInfo />
          </div>
        </div>
      </div>
    </div>
  );
}