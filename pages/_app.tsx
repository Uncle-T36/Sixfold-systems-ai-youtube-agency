import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import ErrorBoundary from '../components/ErrorBoundary'
import HelpWidget from '../components/HelpWidget'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
      <HelpWidget />
      <Analytics />
    </ErrorBoundary>
  )
}