import React from 'react';
import TopNichesBrowser from '../components/TopNichesBrowser';
import PageLayout from '../components/PageLayout';
import { useRouter } from 'next/router';

export default function TopNichesPage() {
  const router = useRouter();

  const handleNicheSetup = (channelId: string) => {
    // Redirect to dashboard after setup
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <PageLayout title="💎 Top Niches">
      <TopNichesBrowser onNicheSetup={handleNicheSetup} />
    </PageLayout>
  );
}
