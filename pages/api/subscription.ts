// Subscription API endpoints for revenue collection
import { NextApiRequest, NextApiResponse } from 'next';
import RevenueManager, { SUBSCRIPTION_TIERS } from '../../lib/revenue-manager';

interface CreateSubscriptionRequest {
  userId: string;
  tierId: string;
  paymentMethodId: string;
}

interface CreateSubscriptionResponse {
  success: boolean;
  subscriptionId?: string;
  clientSecret?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateSubscriptionResponse>
) {
  const revenueManager = new RevenueManager();

  switch (req.method) {
    case 'POST':
      return await createSubscription(req, res, revenueManager);
    
    case 'GET':
      return await getSubscriptionTiers(req, res);
    
    case 'DELETE':
      return await cancelSubscription(req, res, revenueManager);
    
    default:
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
  }
}

// Create a new subscription
async function createSubscription(
  req: NextApiRequest,
  res: NextApiResponse<CreateSubscriptionResponse>,
  revenueManager: RevenueManager
) {
  try {
    const { userId, tierId, paymentMethodId }: CreateSubscriptionRequest = req.body;

    if (!userId || !tierId || !paymentMethodId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, tierId, paymentMethodId'
      });
    }

    // Validate tier exists
    const tier = SUBSCRIPTION_TIERS.find(t => t.id === tierId);
    if (!tier) {
      return res.status(400).json({
        success: false,
        error: 'Invalid subscription tier'
      });
    }

    // Create subscription
    const result = await revenueManager.createSubscription(userId, tierId, paymentMethodId);

    if (result.success) {
      console.log(`✅ Subscription created: ${userId} -> ${tier.name} ($${tier.price}/${tier.interval})`);
      
      res.status(200).json({
        success: true,
        subscriptionId: result.subscriptionId,
        clientSecret: result.clientSecret
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Get available subscription tiers
async function getSubscriptionTiers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Add pricing calculations
    const tiersWithSavings = SUBSCRIPTION_TIERS.map(tier => {
      let savings = 0;
      let savingsText = '';

      if (tier.interval === 'year') {
        const monthlyEquivalent = SUBSCRIPTION_TIERS.find(t => 
          t.name.includes(tier.name.split(' ')[0]) && t.interval === 'month'
        );
        
        if (monthlyEquivalent) {
          const yearlyTotal = monthlyEquivalent.price * 12;
          savings = yearlyTotal - tier.price;
          savingsText = `Save $${savings}/year`;
        }
      }

      return {
        ...tier,
        savings,
        savingsText,
        pricePerChannel: Math.round(tier.price / tier.channels),
        pricePerVideo: Math.round(tier.price / (tier.videosPerDay * 30))
      };
    });

    res.status(200).json({
      success: true,
      tiers: tiersWithSavings
    });

  } catch (error) {
    console.error('Error fetching subscription tiers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscription tiers'
    });
  }
}

// Cancel subscription
async function cancelSubscription(
  req: NextApiRequest,
  res: NextApiResponse<CreateSubscriptionResponse>,
  revenueManager: RevenueManager
) {
  try {
    const { userId } = req.query;
    const { cancelAtPeriodEnd = true } = req.body;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing userId parameter'
      });
    }

    const result = await revenueManager.cancelSubscription(userId, cancelAtPeriodEnd);

    if (result.success) {
      console.log(`✅ Subscription canceled: ${userId} (at period end: ${cancelAtPeriodEnd})`);
      
      res.status(200).json({
        success: true
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}