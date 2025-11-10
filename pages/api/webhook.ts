// Stripe webhook handler for payment events
import { NextApiRequest, NextApiResponse } from 'next';
import RevenueManager from '../../lib/revenue-manager';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  const revenueManager = new RevenueManager();

  try {
    const handled = await revenueManager.handleWebhook(event);
    
    if (handled) {
      console.log(`✅ Webhook handled: ${event.type}`);
      res.status(200).json({ received: true });
    } else {
      console.error(`❌ Webhook handling failed: ${event.type}`);
      res.status(400).json({ error: 'Webhook handling failed' });
    }

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Important: Disable body parsing for Stripe webhooks
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}