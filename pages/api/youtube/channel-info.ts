import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Fetch YouTube channel information
 * Returns subscriber count and other metadata
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { channelId } = req.query;

  if (!channelId || typeof channelId !== 'string') {
    return res.status(400).json({ error: 'Channel ID required' });
  }

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      // Return default data if no API key (app still works)
      console.log('ℹ️ YouTube API key not set - using default data');
      return res.status(200).json({
        channelId,
        subscriberCount: 0,
        viewCount: 0,
        videoCount: 0,
        title: 'Channel',
        description: '',
        thumbnailUrl: '',
        customUrl: '',
        usingMockData: true,
      });
    }

    // Fetch real data from YouTube API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const channel = data.items[0];
    const statistics = channel.statistics;
    const snippet = channel.snippet;

    return res.status(200).json({
      channelId: channel.id,
      subscriberCount: parseInt(statistics.subscriberCount || '0'),
      viewCount: parseInt(statistics.viewCount || '0'),
      videoCount: parseInt(statistics.videoCount || '0'),
      title: snippet.title,
      description: snippet.description,
      thumbnailUrl: snippet.thumbnails?.high?.url || '',
      customUrl: snippet.customUrl || '',
      publishedAt: snippet.publishedAt,
      usingMockData: false,
    });
  } catch (error: any) {
    console.error('YouTube API error:', error);
    
    // Return graceful fallback data
    return res.status(200).json({
      channelId,
      subscriberCount: 0,
      viewCount: 0,
      videoCount: 0,
      title: 'Channel',
      description: '',
      thumbnailUrl: '',
      customUrl: '',
      usingMockData: true,
      error: 'API unavailable - using default data',
    });
  }
}
