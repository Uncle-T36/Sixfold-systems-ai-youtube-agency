// API endpoint for dashboard statistics
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Mock data for demo - replace with real database queries
    const stats = {
      totalChannels: 6,
      totalSubscribers: 4750,
      totalWatchHours: 18420,
      totalRevenue: 1250,
      videosGenerated: 180,
      monetizedChannels: 2
    };

    res.status(200).json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
}