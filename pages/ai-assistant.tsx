/**
 * 🧠 GENIUS AI ASSISTANT PAGE
 * Full-screen conversational AI with execution capabilities
 */

import GeniusAssistant from '@/components/GeniusAssistant';
import Head from 'next/head';

export default function GeniusAIPage() {
  return (
    <>
      <Head>
        <title>Genius AI Assistant | SixFold Studios</title>
        <meta name="description" content="Your 24/7 YouTube money-making expert with full app execution capabilities" />
      </Head>
      <div className="h-screen w-full overflow-hidden">
        <GeniusAssistant />
      </div>
    </>
  );
}
