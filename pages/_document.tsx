import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* PWA Configuration */}
        <meta name="application-name" content="SixFold AI YouTube Agency" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SixFold AI" />
        <meta name="description" content="AI-powered YouTube automation platform - Create viral videos, manage channels, and maximize revenue on autopilot" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#006B3D" />

        {/* PWA Icons */}
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" sizes="16x16" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Additional Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SixFold AI YouTube Agency" />
        <meta name="twitter:description" content="AI-powered YouTube automation platform" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SixFold AI YouTube Agency" />
        <meta property="og:description" content="AI-powered YouTube automation platform" />
        <meta property="og:site_name" content="SixFold AI" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
