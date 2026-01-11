/**
 * Cancel Subscription API
 * Allows users to cancel their subscription
 */

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscriptionId, cancelImmediately = false } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'subscriptionId is required' });
    }

    // Demo mode
    if (!stripe) {
      return res.status(200).json({
        mode: 'demo',
        success: true,
        message: 'Demo mode - subscription would be canceled',
        canceledAt: new Date().toISOString(),
      });
    }

    let canceledSubscription;

    if (cancelImmediately) {
      // Cancel immediately - no more access
      canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);
    } else {
      // Cancel at period end - user keeps access until billing period ends
      canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }

    console.log(`✅ Subscription ${cancelImmediately ? 'canceled' : 'scheduled for cancellation'}: ${subscriptionId}`);

    res.status(200).json({
      success: true,
      subscriptionId: canceledSubscription.id,
      status: canceledSubscription.status,
      cancelAtPeriodEnd: canceledSubscription.cancel_at_period_end,
      currentPeriodEnd: new Date(canceledSubscription.current_period_end * 1000).toISOString(),
      message: cancelImmediately 
        ? 'Subscription canceled immediately' 
        : 'Subscription will cancel at end of billing period',
    });

  } catch (error: any) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      error: 'Failed to cancel subscription',
      message: error.message,
    });
  }
}
