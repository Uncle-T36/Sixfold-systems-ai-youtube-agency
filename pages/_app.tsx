import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import ErrorBoundary from '../components/ErrorBoundary'
import HelpWidget from '../components/HelpWidget'
import { useEffect } from 'react'
import { initializeDataProtection } from '../lib/dataProtection'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // 🛡️ Initialize data protection system on app load
    // This ensures users NEVER lose their channels during updates
    if (typeof window !== 'undefined') {
      initializeDataProtection();
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
