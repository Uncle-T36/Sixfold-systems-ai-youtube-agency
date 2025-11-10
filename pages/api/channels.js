// API endpoint for channels management
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Mock channels data - replace with real database
    const channels = [
      {
        id: 'tech-channel-1',
        name: 'Tech Innovations Hub',
        niche: 'technology',
        subscribers: 1250,
        watchHours: 4200,
        videosUploaded: 45,
        isMonetized: true,
        monthlyRevenue: 450,
        status: 'active',
        lastVideoDate: '2025-10-23',
        thumbnailUrl: 'https://via.placeholder.com/120x120/6366f1/ffffff?text=TI'
      },
      {
        id: 'kids-channel-1',
        name: 'Fun Learning Kids',
        niche: 'education_kids',
        subscribers: 890,
        watchHours: 3100,
        videosUploaded: 32,
        isMonetized: false,
        monthlyRevenue: 0,
        status: 'active',
        lastVideoDate: '2025-10-22',
        thumbnailUrl: 'https://via.placeholder.com/120x120/f59e0b/ffffff?text=FK'
      },
      {
        id: 'lifestyle-channel-1',
        name: 'Life Hacks Pro',
        niche: 'lifestyle',
        subscribers: 675,
        watchHours: 2800,
        videosUploaded: 28,
        isMonetized: false,
        monthlyRevenue: 0,
        status: 'active',
        lastVideoDate: '2025-10-21',
        thumbnailUrl: 'https://via.placeholder.com/120x120/10b981/ffffff?text=LH'
      },
      {
        id: 'gaming-channel-1',
        name: 'Gaming Mastery',
        niche: 'gaming',
        subscribers: 1120,
        watchHours: 5200,
        videosUploaded: 38,
        isMonetized: true,
        monthlyRevenue: 320,
        status: 'active',
        lastVideoDate: '2025-10-24',
        thumbnailUrl: 'https://via.placeholder.com/120x120/ef4444/ffffff?text=GM'
      },
      {
        id: 'health-channel-1',
        name: 'Wellness Journey',
        niche: 'health',
        subscribers: 520,
        watchHours: 1900,
        videosUploaded: 22,
        isMonetized: false,
        monthlyRevenue: 0,
        status: 'paused',
        lastVideoDate: '2025-10-18',
        thumbnailUrl: 'https://via.placeholder.com/120x120/8b5cf6/ffffff?text=WJ'
      },
      {
        id: 'motivation-channel-1',
        name: 'Success Mindset',
        niche: 'motivation',
        subscribers: 295,
        watchHours: 1320,
        videosUploaded: 15,
        isMonetized: false,
        monthlyRevenue: 0,
        status: 'setup',
        lastVideoDate: '2025-10-15',
        thumbnailUrl: 'https://via.placeholder.com/120x120/06b6d4/ffffff?text=SM'
      }
    ];

    res.status(200).json({
      success: true,
      channels
    });

  } catch (error) {
    console.error('Channels fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch channels'
    });
  }
}