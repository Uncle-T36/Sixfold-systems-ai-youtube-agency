import React from 'react';
import InteractiveDashboard from '../components/InteractiveDashboard';
import AppNavigation from '../components/AppNavigation';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AppNavigation title="Dashboard" currentPage="Multi-Channel Command Center" showBack={false} />
      <div className="sm:ml-20 lg:ml-64">
        <InteractiveDashboard />
      </div>
    </div>
  );
}