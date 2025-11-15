import React from 'react';
import PageLayout from '../components/PageLayout';
import AdvancedVideoCreator from '../components/AdvancedVideoCreator';

export default function VideoCreatorPage() {
  return (
    <PageLayout 
      title="Advanced Video Creator" 
      currentPage="Create animations, cartoons & motion graphics"
    >
      <AdvancedVideoCreator />
    </PageLayout>
  );
}

