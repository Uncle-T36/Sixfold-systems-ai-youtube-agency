import React from 'react';
import AppNavigation from '../components/AppNavigation';
import StrategicAdvisorDashboard from '../components/StrategicAdvisorDashboard';

export default function StrategyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AppNavigation title="Strategic AI Advisor" showBack={true} />
      
      {/* Add proper padding for sidebar */}
      <div className="sm:pl-20 lg:pl-64 pt-20 sm:pt-24">
      <div>
        <StrategicAdvisorDashboard />
      </div>
      </div>
    </div>
  );
}

