// Easy YouTube Channel Connection - One-Click Setup
import { NextApiRequest, NextApiResponse } from 'next';

export interface ChannelConnectionResponse {
  success: boolean;
  message: string;
  authUrl?: string;
  channels?: Array<{
    id: string;
    name: string;
    thumbnailUrl: string;
    subscriberCount: number;
  }>;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChannelConnectionResponse>
) {
  if (req.method === 'GET') {
    // Step 1: Generate OAuth URL for easy connection
    return handleGenerateAuthUrl(req, res);
  } else if (req.method === 'POST') {
    // Step 2: Manual connection with API key
    return handleManualConnection(req, res);
  } else {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
}

async function handleGenerateAuthUrl(
  req: NextApiRequest,
  res: NextApiResponse<ChannelConnectionResponse>
) {
  try {
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const redirectUri = process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/api/auth/youtube/callback';
    
    if (!clientId) {
      // Fallback to manual connection
      return res.status(200).json({
        success: true,
        message: 'Use manual connection with API key',
        authUrl: undefined
      });
    }

    // Build OAuth URL for easy one-click connection
    const scopes = [
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly'
    ];

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent'
    })}`;

    res.status(200).json({
      success: true,
      message: 'Click the link to connect your YouTube channels',
      authUrl: authUrl
    });

  } catch (error) {
    console.error('Auth URL generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate authentication URL',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleManualConnection(
  req: NextApiRequest,
  res: NextApiResponse<ChannelConnectionResponse>
) {
  try {
    const { apiKey, channelIds } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'API key is required',
        error: 'Missing API key'
      });
    }

    // Validate API key and fetch channel data
    const channels = await fetchChannelData(apiKey, channelIds);

    if (channels.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No channels found with this API key',
        error: 'Invalid API key or no channels'
      });
    }

    // Store connection (in production, save to database)
    console.log(`✅ Connected ${channels.length} channels successfully!`);

    res.status(200).json({
      success: true,
      message: `Successfully connected ${channels.length} YouTube channel(s)!`,
      channels: channels
    });

  } catch (error) {
    console.error('Manual connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect channels',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function fetchChannelData(apiKey: string, channelIds?: string[]) {
  try {
    // Fetch authenticated user's channels
    const url = channelIds && channelIds.length > 0
      ? `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds.join(',')}&key=${apiKey}`
      : `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true&key=${apiKey}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();

    return (data.items || []).map((item: any) => ({
      id: item.id,
      name: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.default.url,
      subscriberCount: parseInt(item.statistics.subscriberCount || '0')
    }));

  } catch (error) {
    console.error('Error fetching channel data:', error);
    return [];
  }
}
