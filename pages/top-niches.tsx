import React from 'react';
import PageLayout from '../components/PageLayout';
import TopNichesBrowser from '../components/TopNichesBrowser';
import { useRouter } from 'next/router';

/**
 * 💎 TOP NICHES PAGE
 * Browse and setup high-CPM YouTube niches
 */
export default function TopNichesPage() {
  const router = useRouter();

  const handleNicheSetup = (channelId: string) => {
    // Redirect to dashboard after successful setup
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <PageLayout title="💎 Top Niches" currentPage="High-CPM niches with one-click setup">
      <TopNichesBrowser onNicheSetup={handleNicheSetup} />
    </PageLayout>
  );
}
