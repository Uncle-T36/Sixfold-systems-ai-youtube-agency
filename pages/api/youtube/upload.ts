import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { Readable } from 'stream';

/**
 * 📤 YouTube Video Upload API
 * Uploads videos directly to user's YouTube channel using OAuth2
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      accessToken,
      refreshToken,
      title,
      description,
      tags = [],
      categoryId = '22', // Default: People & Blogs
      privacyStatus = 'private', // Start as private for safety
      videoData, // Base64 encoded video data
      channelId,
    } = req.body;

    if (!accessToken) {
      return res.status(401).json({ 
        error: 'Not authenticated',
        message: 'Please connect your YouTube channel first at /connect'
      });
    }

    if (!title) {
      return res.status(400).json({ error: 'Video title is required' });
    }

    if (!videoData) {
      return res.status(400).json({ error: 'Video data is required' });
    }

    // Set up OAuth2 client with user's tokens
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Initialize YouTube API
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    // Convert base64 video data to a readable stream
    const videoBuffer = Buffer.from(videoData, 'base64');
    const videoStream = Readable.from(videoBuffer);

    console.log('📤 Starting YouTube upload:', {
      title,
      channelId,
      size: `${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`,
      privacyStatus,
    });

    // Upload the video using resumable upload
    const uploadResponse = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: title.substring(0, 100), // YouTube max title length
          description: description?.substring(0, 5000) || '', // YouTube max description
          tags: tags.slice(0, 500), // YouTube max tags
          categoryId: categoryId,
        },
        status: {
          privacyStatus: privacyStatus,
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: videoStream,
      },
    });

    const videoId = uploadResponse.data.id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    console.log('✅ YouTube upload successful:', {
      videoId,
      title,
      url: videoUrl,
    });

    return res.status(200).json({
      success: true,
      videoId,
      title,
      url: videoUrl,
      status: 'uploaded',
      message: '✅ Video uploaded successfully to YouTube!',
      youtubeStudioUrl: `https://studio.youtube.com/video/${videoId}/edit`,
    });

  } catch (error: any) {
    console.error('❌ YouTube upload error:', error);
    
    // Handle specific Google API errors
    if (error.code === 401 || error.message?.includes('invalid_token')) {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Please re-connect your YouTube channel at /connect'
      });
    }

    if (error.code === 403) {
      return res.status(403).json({ 
        error: 'Permission denied',
        message: 'YouTube upload permission required. Please reconnect with upload permissions.'
      });
    }

    if (error.errors?.[0]?.reason === 'quotaExceeded') {
      return res.status(429).json({ 
        error: 'Quota exceeded',
        message: 'YouTube API daily quota exceeded. Try again tomorrow.'
      });
    }

    return res.status(500).json({ 
      error: 'Upload failed',
      message: error.message || 'Unknown error occurred',
      details: error.errors || null,
    });
  }
}
