/**
 * Email API Endpoint
 * Send emails for various notifications
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { 
  sendWelcomeEmail, 
  sendSubscriptionEmail, 
  sendPaymentFailedEmail,
  sendVideoUploadedEmail,
  sendWeeklyReportEmail,
} from '../../lib/emailNotifications';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, email, data } = req.body;

    if (!type || !email) {
      return res.status(400).json({ error: 'type and email are required' });
    }

    let result;

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(email, data?.name || 'there');
        break;

      case 'subscription':
        result = await sendSubscriptionEmail(email, data?.name || 'there', data?.plan || 'Professional');
        break;

      case 'payment_failed':
        result = await sendPaymentFailedEmail(email, data?.name || 'there');
        break;

      case 'video_uploaded':
        result = await sendVideoUploadedEmail(
          email, 
          data?.channelName || 'Your Channel',
          data?.videoTitle || 'Your Video',
          data?.videoUrl || '#'
        );
        break;

      case 'weekly_report':
        result = await sendWeeklyReportEmail(email, data?.name || 'there', {
          views: data?.views || 0,
          subs: data?.subs || 0,
          revenue: data?.revenue || 0,
        });
        break;

      default:
        return res.status(400).json({ error: `Unknown email type: ${type}` });
    }

    if (result.success) {
      res.status(200).json({ success: true, emailId: result.id });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }

  } catch (error: any) {
    console.error('Email API error:', error);
    res.status(500).json({ error: error.message });
  }
}
