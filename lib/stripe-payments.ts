/**
 * Stripe Payment Integration
 * Handles subscription payments - owner's banking details stay in Stripe dashboard only
 */

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId?: string; // This will be set up in Stripe dashboard
  popular?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    interval: 'month',
    features: [
      'Up to 3 YouTube channels',
      '10 AI-generated videos per month',
      'Basic analytics',
      'Email support',
      'Standard video quality',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    interval: 'month',
    popular: true,
    features: [
      'Up to 10 YouTube channels',
      'Unlimited AI-generated videos',
      'Advanced analytics & insights',
      'Priority support (24/7)',
      'HD video quality',
      'Trend analysis & suggestions',
      'Revenue optimization',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    interval: 'month',
    features: [
      'Unlimited YouTube channels',
      'Unlimited AI-generated videos',
      'Real-time analytics dashboard',
      'Dedicated account manager',
      '4K video quality',
      'Custom AI training',
      'White-label options',
      'API access',
      'Multi-user team access',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
  },
];

/**
 * Create Stripe checkout session
 * User pays → Money goes to owner's Stripe account → Owner sees revenue in Stripe dashboard
 */
export async function createCheckoutSession(priceId: string, userEmail?: string) {
  try {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        customerEmail: userEmail,
        successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId, url } = await response.json();
    
    // Redirect to Stripe checkout
    window.location.href = url;
    
    return { sessionId, url };
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}

/**
 * Get user's subscription status
 * Does NOT expose owner's banking details - just subscription status
 */
export async function getUserSubscription() {
  try {
    const response = await fetch('/api/subscription-status');
    
    if (!response.ok) {
      return null;
    }

    const subscription = await response.json();
    return subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Cancel subscription error:', error);
    throw error;
  }
}
