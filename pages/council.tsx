import React from 'react';
import PageLayout from '../components/PageLayout';
import IntelligentCouncilDashboard from '../components/IntelligentCouncilDashboard';

export default function IntelligentCouncilPage() {
  return (
    <PageLayout 
      title="Intelligent Council" 
      currentPage="AI system that analyzes channels & scrapes real stories"
    >
      <IntelligentCouncilDashboard />
    </PageLayout>
  );
}
