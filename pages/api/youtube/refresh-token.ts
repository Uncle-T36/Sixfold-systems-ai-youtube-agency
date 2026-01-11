/**
 * YouTube Token Refresh API
 * Refreshes expired OAuth access tokens using the refresh token
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { refreshToken, channelId } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'refreshToken is required' });
    }

    // Check if OAuth is configured
    if (!process.env.YOUTUBE_CLIENT_ID || !process.env.YOUTUBE_CLIENT_SECRET) {
      return res.status(500).json({
        error: 'YouTube OAuth not configured',
        message: 'Add YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET to environment variables',
      });
    }

    // Set the refresh token
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    // Get new access token
    const { credentials } = await oauth2Client.refreshAccessToken();

    if (!credentials.access_token) {
      return res.status(401).json({
        error: 'Failed to refresh token',
        message: 'The refresh token may have been revoked. Please reconnect your channel.',
      });
    }

    console.log(`✅ Token refreshed for channel: ${channelId || 'unknown'}`);

    res.status(200).json({
      success: true,
      accessToken: credentials.access_token,
      expiryDate: credentials.expiry_date,
      // Only return new refresh token if one was issued
      refreshToken: credentials.refresh_token || undefined,
    });

  } catch (error: any) {
    console.error('Token refresh error:', error);

    // Check for specific OAuth errors
    if (error.message?.includes('invalid_grant')) {
      return res.status(401).json({
        error: 'Refresh token expired or revoked',
        message: 'Please reconnect your YouTube channel at /connect',
        requiresReconnect: true,
      });
    }

    res.status(500).json({
      error: 'Failed to refresh token',
      message: error.message,
    });
  }
}
