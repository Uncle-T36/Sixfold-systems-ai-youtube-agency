/**
 * Stripe Checkout API Route
 * Creates payment session - owner's banking details NEVER exposed to users
 * Revenue goes directly to owner's Stripe account
 */

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

// Subscription plans - configure these in your Stripe dashboard
const PLANS = {
  starter: {
    priceId: process.env.STRIPE_PRICE_STARTER || 'price_starter_monthly',
    name: 'Starter',
    price: 29,
  },
  professional: {
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL || 'price_pro_monthly',
    name: 'Professional',
    price: 79,
  },
  enterprise: {
    priceId: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise_monthly',
    name: 'Enterprise',
    price: 199,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      priceId, 
      planId, // Alternative: pass 'starter', 'professional', or 'enterprise'
      customerEmail, 
      successUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?success=true`,
      cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      userId,
    } = req.body;

    // Determine the price ID
    let finalPriceId = priceId;
    if (!finalPriceId && planId && PLANS[planId as keyof typeof PLANS]) {
      finalPriceId = PLANS[planId as keyof typeof PLANS].priceId;
    }

    if (!finalPriceId) {
      return res.status(400).json({ error: 'Price ID or Plan ID is required' });
    }

    // Check if Stripe is configured
    if (!stripe) {
      console.warn('⚠️ Stripe not configured - returning demo mode');
      return res.status(200).json({
        mode: 'demo',
        message: 'Stripe not configured. Add STRIPE_SECRET_KEY to enable payments.',
        sessionId: 'demo_session_' + Date.now(),
        url: successUrl,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId || 'guest',
        customerEmail: customerEmail || 'guest',
        planId: planId || 'custom',
      },
      subscription_data: {
        metadata: {
          userId: userId || 'guest',
        },
      },
    });

    console.log(`✅ Checkout session created: ${session.id}`);

    res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message,
    });
  }
}
