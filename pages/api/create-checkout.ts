/**
 * Stripe Checkout API Route
 * Creates payment session - owner's banking details NEVER exposed to users
 * Revenue goes directly to owner's Stripe account
 */

import { NextApiRequest, NextApiResponse } from 'next';

// This will use Stripe SDK - banking details configured in Stripe dashboard only
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, customerEmail, successUrl, cancelUrl } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // NOTE: Install Stripe SDK first: npm install stripe
    // Then uncomment this code and add STRIPE_SECRET_KEY to environment variables
    
    /*
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        // Track which user subscribed (for your records only)
        customerEmail: customerEmail || 'guest',
      },
    });

    res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
    */

    // Temporary response until Stripe is configured
    res.status(200).json({
      message: 'Stripe integration pending setup',
      sessionId: 'demo_session',
      url: '/dashboard',
    });

  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message,
    });
  }
}
