import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* SEO Meta Tags */}
        <meta name="description" content="AI YouTube automation platform - Create viral videos, manage multiple channels, generate scripts with AI, analyze performance, and maximize revenue. Free AI content generator for YouTube creators." />
        <meta name="keywords" content="YouTube automation, AI video creator, YouTube channel management, viral video generator, AI script writer, YouTube analytics, content automation, YouTube agency, video marketing, social media automation, AI content creator, YouTube tools, video production, channel growth, monetization tools" />
        <meta name="author" content="SixFold Systems" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://aiyoutubeagency.vercel.app" />

        {/* PWA Configuration */}
        <meta name="application-name" content="SixFold AI YouTube Agency" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SixFold AI" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#006B3D" />

        {/* PWA Icons */}
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" sizes="16x16" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiyoutubeagency.vercel.app" />
        <meta property="og:title" content="SixFold AI YouTube Agency - Free AI YouTube Automation Platform" />
        <meta property="og:description" content="Create viral YouTube videos with AI. Automate content creation, script writing, channel management & analytics. Free YouTube automation tools for creators." />
        <meta property="og:site_name" content="SixFold AI YouTube Agency" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://aiyoutubeagency.vercel.app" />
        <meta name="twitter:title" content="SixFold AI YouTube Agency - Free AI YouTube Automation" />
        <meta name="twitter:description" content="Create viral YouTube videos with AI. Automate content creation, script writing, channel management & analytics." />
        <meta name="twitter:creator" content="@SixFoldSystems" />

        {/* Additional SEO */}
        <meta name="rating" content="General" />
        <meta name="distribution" content="global" />
        <meta name="revisit-after" content="7 days" />
        <meta httpEquiv="content-language" content="en" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
