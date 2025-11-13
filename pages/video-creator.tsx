import React from 'react';
import AppNavigation from '../components/AppNavigation';
import AdvancedVideoCreator from '../components/AdvancedVideoCreator';

export default function VideoCreatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      <AppNavigation 
        title="Advanced Video Creator" 
        currentPage="Create animations, cartoons & motion graphics"
      />
      <AdvancedVideoCreator />
    </div>
  );
}
