import React from 'react';
import AppNavigation from '../components/AppNavigation';
import CouncilDebateView from '../components/CouncilDebateView';

export default function DebatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
      <AppNavigation title="Council Debate" currentPage="Watch philosophers debate and reach consensus" />
      <div className="sm:pl-20 lg:pl-64 pt-20 sm:pt-24">
        <CouncilDebateView />
      </div>
    </div>
  );
}
