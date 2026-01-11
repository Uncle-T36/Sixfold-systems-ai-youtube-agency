// 🔐 YouTube OAuth Callback - Full Integration
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`/connect?youtube_error=${encodeURIComponent(error as string)}`);
  }

  if (!code) {
    return res.redirect('/connect?youtube_error=no_code');
  }

  try {
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const redirectUri = process.env.YOUTUBE_REDIRECT_URI || 
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/youtube/callback`;

    if (!clientId || !clientSecret) {
      return res.redirect('/connect?youtube_error=not_configured');
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code as string,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || 'Failed to get access token');
    }

    // Fetch connected channels
    const channelsResponse = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
      {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`
        }
      }
    );

    const channelsData = await channelsResponse.json();
    
    // Prepare channel and token data for frontend
    const channels = channelsData.items?.map((channel: any) => ({
      id: channel.id,
      name: channel.snippet.title,
      description: channel.snippet.description || '',
      thumbnailUrl: channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.default?.url || '',
      subscriberCount: parseInt(channel.statistics?.subscriberCount || '0'),
      viewCount: parseInt(channel.statistics?.viewCount || '0'),
      videoCount: parseInt(channel.statistics?.videoCount || '0'),
      oauthConnected: true,
    })) || [];

    const tokenData = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      expiresAt: Date.now() + (tokens.expires_in * 1000),
    };

    // Encode data for URL
    const encodedTokens = Buffer.from(JSON.stringify(tokenData)).toString('base64');
    const encodedChannels = Buffer.from(JSON.stringify(channels)).toString('base64');
    
    // Redirect to connect page with OAuth success
    res.redirect(`/connect?youtube_auth=success&tokens=${encodedTokens}&yt_channels=${encodedChannels}`);

  } catch (error: any) {
    console.error('OAuth callback error:', error);
    res.redirect(`/connect?youtube_error=${encodeURIComponent(error.message || 'auth_failed')}`);
  }
}
