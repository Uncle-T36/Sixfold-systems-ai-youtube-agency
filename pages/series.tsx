import React from 'react';
import PageLayout from '../components/PageLayout';
import SeriesChannelCreator from '../components/SeriesChannelCreator';

export default function SeriesPage() {
  return (
    <PageLayout 
      title="Series Creator" 
      currentPage="Create viral story series with AI"
    >
      <SeriesChannelCreator />
    </PageLayout>
  );
}
