import React from 'react';
import AppNavigation from '../components/AppNavigation';
import SeriesChannelCreator from '../components/SeriesChannelCreator';

export default function SeriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      <AppNavigation 
        title="Series Creator" 
        currentPage="Create viral story series with AI"
      />
      {/* Add left padding for desktop sidebar */}
      <div className="sm:pl-20 lg:pl-64 pt-4">
        <SeriesChannelCreator />
      </div>
    </div>
  );
}
