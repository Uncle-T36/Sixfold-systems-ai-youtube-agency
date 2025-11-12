import React from 'react';
import InteractiveDashboard from '../components/InteractiveDashboard';
import AppNavigation from '../components/AppNavigation';
import ActivityFeed from '../components/ActivityFeed';
import WealthAutopilot from '../components/WealthAutopilot';
import SupportInfo from '../components/SupportInfo';
import TycoonIntelligence from '../components/TycoonIntelligence';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
      <AppNavigation title="Dashboard" currentPage="AI Tycoon Command Center" showBack={false} />
      <div className="sm:ml-20 lg:ml-64">
        <div className="container mx-auto px-4 py-8">
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