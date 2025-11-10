// Easy YouTube OAuth Callback Handler
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`/dashboard?error=${error}`);
  }

  if (!code) {
    return res.redirect('/dashboard?error=no_code');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code,
        client_id: process.env.YOUTUBE_CLIENT_ID,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET,
        redirect_uri: process.env.YOUTUBE_REDIRECT_URI,
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
    
    // Store tokens securely (in production, save to database)
    // For now, redirect with success message
    const channelCount = channelsData.items?.length || 0;
    
    res.redirect(`/dashboard?success=true&channels=${channelCount}`);

  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`/dashboard?error=auth_failed`);
  }
}
