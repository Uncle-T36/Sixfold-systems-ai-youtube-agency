import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import ErrorBoundary from '../components/ErrorBoundary'
import HelpWidget from '../components/HelpWidget'
import { useEffect } from 'react'
import { initializeDataProtection } from '../lib/dataProtection'
import { initializeCloudPersistence } from '../lib/cloudPersistence'
import { startAutoScheduler, getSchedulerStatus } from '../lib/autoScheduler'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // 🛡️ Initialize data protection system on app load
    // This ensures users NEVER lose their channels during updates
    if (typeof window !== 'undefined') {
      initializeDataProtection();
      
      // 🌐 Initialize cloud persistence (auto-restore from cloud)
      initializeCloudPersistence().then(() => {
        console.log('✅ Cloud persistence ready');
      });
      
      // 🤖 Start Auto-Scheduler if it was enabled
      const schedulerStatus = getSchedulerStatus();
      if (schedulerStatus.enabled) {
        startAutoScheduler();
        console.log('🤖 Auto-Scheduler resumed');
      }
      
      // 📱 Register service worker for PWA
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
              console.log('✅ Service Worker registered:', registration.scope);
            })
            .catch((error) => {
              console.log('❌ Service Worker registration failed:', error);
            });
        });
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
      <HelpWidget />
      <Analytics />
    </ErrorBoundary>
  )
}
