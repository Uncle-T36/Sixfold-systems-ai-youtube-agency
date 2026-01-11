/**
 * Subscription Status API
 * Get current user's subscription status
 */

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

interface SubscriptionStatus {
  isActive: boolean;
  plan: string | null;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  customerId: string | null;
  subscriptionId: string | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, email } = req.query;

    if (!userId && !email) {
      return res.status(400).json({ error: 'userId or email is required' });
    }

    // Check localStorage fallback for demo mode
    if (!stripe) {
      // Demo mode - check localStorage on client side
      return res.status(200).json({
        mode: 'demo',
        isActive: true,
        plan: 'demo',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
        customerId: null,
        subscriptionId: null,
        message: 'Demo mode - Stripe not configured',
      });
    }

    // Find customer by email
    let customerId: string | null = null;
    
    if (email) {
      const customers = await stripe.customers.list({
        email: email as string,
        limit: 1,
      });
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    if (!customerId) {
      return res.status(200).json({
        isActive: false,
        plan: null,
        status: 'no_subscription',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        customerId: null,
        subscriptionId: null,
      });
    }

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      // Check for canceled but still active subscriptions
      const allSubs = await stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
      });

      if (allSubs.data.length > 0) {
        const sub = allSubs.data[0];
        return res.status(200).json({
          isActive: sub.status === 'active' || sub.status === 'trialing',
          plan: sub.items.data[0]?.price?.nickname || sub.items.data[0]?.price?.id || 'unknown',
          status: sub.status,
          currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          customerId,
          subscriptionId: sub.id,
        });
      }

      return res.status(200).json({
        isActive: false,
        plan: null,
        status: 'canceled',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        customerId,
        subscriptionId: null,
      });
    }

    const subscription = subscriptions.data[0];
    const planName = subscription.items.data[0]?.price?.nickname 
      || subscription.items.data[0]?.price?.id 
      || 'subscription';

    res.status(200).json({
      isActive: true,
      plan: planName,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      customerId,
      subscriptionId: subscription.id,
    });

  } catch (error: any) {
    console.error('Subscription status error:', error);
    res.status(500).json({
      error: 'Failed to get subscription status',
      message: error.message,
    });
  }
}
