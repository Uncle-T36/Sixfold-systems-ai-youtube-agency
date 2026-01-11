import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * 🔐 YouTube OAuth Authorization Initiator
 * Redirects user to Google OAuth consent screen
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI || 
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/youtube/callback`;

  if (!clientId) {
    return res.status(500).json({ 
      error: 'YouTube OAuth not configured',
      message: 'Please add YOUTUBE_CLIENT_ID to your environment variables'
    });
  }

  // OAuth scopes for YouTube uploads
  const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.readonly',
  ].join(' ');

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  authUrl.searchParams.set('state', Date.now().toString());

  // Redirect to Google OAuth
  return res.redirect(authUrl.toString());
}
