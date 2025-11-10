// Revenue Collection System - Subscription Management
// This handles all payment processing and user subscriptions

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  channels: number;
  videosPerDay: number;
  features: string[];
  stripePriceId: string;
  popular?: boolean;
}

export interface UserSubscription {
  userId: string;
  tierId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trial';
  stripeSubscriptionId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  channelsUsed: number;
  videosGenerated: number;
  monthlyQuota: number;
}

// Subscription Tiers for Revenue Collection
export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    interval: 'month',
    channels: 2,
    videosPerDay: 5,
    features: [
      '2 YouTube channels',
      '5 videos per day',
      'Basic AI scripts',
      'Free stock media',
      'Standard support'
    ],
    stripePriceId: 'price_starter_monthly'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    interval: 'month',
    channels: 6,
    videosPerDay: 15,
    features: [
      '6 YouTube channels',
      '15 videos per day',
      'Enhanced AI with Copilot',
      'Premium stock media',
      'Trend analysis',
      'Priority support'
    ],
    stripePriceId: 'price_professional_monthly',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    interval: 'month',
    channels: 20,
    videosPerDay: 50,
    features: [
      '20 YouTube channels',
      '50 videos per day',
      'Custom AI training',
      'Unlimited stock media',
      'Advanced analytics',
      'White-label option',
      'Dedicated support'
    ],
    stripePriceId: 'price_enterprise_monthly'
  },
  {
    id: 'professional_yearly',
    name: 'Professional (Yearly)',
    price: 790, // 2 months free
    interval: 'year',
    channels: 6,
    videosPerDay: 15,
    features: [
      '6 YouTube channels',
      '15 videos per day',
      'Enhanced AI with Copilot',
      'Premium stock media',
      'Trend analysis',
      '2 months FREE',
      'Priority support'
    ],
    stripePriceId: 'price_professional_yearly'
  }
];

export class RevenueManager {
  private stripe: any;
  
  constructor() {
    // Initialize Stripe with your secret key
    this.stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }

  // Create a new subscription for a user
  async createSubscription(userId: string, tierId: string, paymentMethodId: string): Promise<{
    success: boolean;
    subscriptionId?: string;
    clientSecret?: string;
    error?: string;
  }> {
    try {
      const tier = SUBSCRIPTION_TIERS.find(t => t.id === tierId);
      if (!tier) {
        throw new Error('Invalid subscription tier');
      }

      // Create customer in Stripe
      const customer = await this.stripe.customers.create({
        metadata: { userId }
      });

      // Attach payment method to customer
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id
      });

      // Set as default payment method
      await this.stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });

      // Create subscription
      const subscription = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: tier.stripePriceId }],
        payment_settings: {
          payment_method_options: {
            card: {
              request_three_d_secure: 'if_required'
            }
          },
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription'
        },
        expand: ['latest_invoice.payment_intent'],
        trial_period_days: 7 // 7-day free trial
      });

      // Save subscription to database
      await this.saveUserSubscription({
        userId,
        tierId,
        status: subscription.status as any,
        stripeSubscriptionId: subscription.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: false,
        channelsUsed: 0,
        videosGenerated: 0,
        monthlyQuota: tier.videosPerDay * 30
      });

      return {
        success: true,
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret
      };

    } catch (error) {
      console.error('Subscription creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Check if user can generate more videos
  async checkUsageLimit(userId: string): Promise<{
    canGenerate: boolean;
    videosRemaining: number;
    channelsRemaining: number;
    subscription: UserSubscription | null;
  }> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription || subscription.status !== 'active') {
        return {
          canGenerate: false,
          videosRemaining: 0,
          channelsRemaining: 0,
          subscription: null
        };
      }

      const tier = SUBSCRIPTION_TIERS.find(t => t.id === subscription.tierId);
      if (!tier) {
        throw new Error('Invalid subscription tier');
      }

      const videosRemaining = subscription.monthlyQuota - subscription.videosGenerated;
      const channelsRemaining = tier.channels - subscription.channelsUsed;

      return {
        canGenerate: videosRemaining > 0 && channelsRemaining >= 0,
        videosRemaining: Math.max(0, videosRemaining),
        channelsRemaining: Math.max(0, channelsRemaining),
        subscription
      };

    } catch (error) {
      console.error('Usage check failed:', error);
      return {
        canGenerate: false,
        videosRemaining: 0,
        channelsRemaining: 0,
        subscription: null
      };
    }
  }

  // Update usage when videos are generated
  async incrementUsage(userId: string, videosGenerated: number = 1): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) return false;

      const updated = await this.updateUserSubscription(userId, {
        videosGenerated: subscription.videosGenerated + videosGenerated
      });

      return updated;

    } catch (error) {
      console.error('Usage increment failed:', error);
      return false;
    }
  }

  // Cancel subscription
  async cancelSubscription(userId: string, cancelAtPeriodEnd: boolean = true): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) {
        throw new Error('No active subscription found');
      }

      if (cancelAtPeriodEnd) {
        // Cancel at period end (user keeps access until billing cycle ends)
        await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true
        });

        await this.updateUserSubscription(userId, {
          cancelAtPeriodEnd: true
        });
      } else {
        // Cancel immediately
        await this.stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

        await this.updateUserSubscription(userId, {
          status: 'canceled',
          cancelAtPeriodEnd: true
        });
      }

      return { success: true };

    } catch (error) {
      console.error('Subscription cancellation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Handle Stripe webhooks for subscription events
  async handleWebhook(event: any): Promise<boolean> {
    try {
      switch (event.type) {
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;

        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return true;

    } catch (error) {
      console.error('Webhook handling failed:', error);
      return false;
    }
  }

  // Calculate revenue metrics
  async getRevenueMetrics(): Promise<{
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    activeSubscriptions: number;
    churnRate: number;
    averageRevenuePerUser: number;
    growthRate: number;
  }> {
    try {
      // This would typically query your database
      // For now, returning mock data structure
      const subscriptions = await this.getAllActiveSubscriptions();
      
      const monthlyRevenue = subscriptions.reduce((total, sub) => {
        const tier = SUBSCRIPTION_TIERS.find(t => t.id === sub.tierId);
        if (!tier) return total;
        
        const monthlyAmount = tier.interval === 'year' ? tier.price / 12 : tier.price;
        return total + monthlyAmount;
      }, 0);

      return {
        totalRevenue: monthlyRevenue * 12, // Annualized
        monthlyRecurringRevenue: monthlyRevenue,
        activeSubscriptions: subscriptions.length,
        churnRate: 0.05, // 5% monthly churn (would calculate from data)
        averageRevenuePerUser: subscriptions.length > 0 ? monthlyRevenue / subscriptions.length : 0,
        growthRate: 0.15 // 15% monthly growth (would calculate from data)
      };

    } catch (error) {
      console.error('Revenue metrics calculation failed:', error);
      return {
        totalRevenue: 0,
        monthlyRecurringRevenue: 0,
        activeSubscriptions: 0,
        churnRate: 0,
        averageRevenuePerUser: 0,
        growthRate: 0
      };
    }
  }

  // Private helper methods (these would integrate with your database)
  private async saveUserSubscription(subscription: UserSubscription): Promise<boolean> {
    // TODO: Integrate with your database (PostgreSQL, MongoDB, etc.)
    console.log('Saving subscription:', subscription);
    return true;
  }

  private async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    // TODO: Integrate with your database
    console.log('Getting subscription for user:', userId);
    return null; // Would return actual subscription from database
  }

  private async updateUserSubscription(userId: string, updates: Partial<UserSubscription>): Promise<boolean> {
    // TODO: Integrate with your database
    console.log('Updating subscription:', userId, updates);
    return true;
  }

  private async getAllActiveSubscriptions(): Promise<UserSubscription[]> {
    // TODO: Integrate with your database
    console.log('Getting all active subscriptions');
    return []; // Would return actual subscriptions from database
  }

  private async handlePaymentSucceeded(invoice: any): Promise<void> {
    console.log('Payment succeeded:', invoice.id);
    // Reset monthly usage counters, extend subscription period, etc.
  }

  private async handlePaymentFailed(invoice: any): Promise<void> {
    console.log('Payment failed:', invoice.id);
    // Send email notification, update subscription status, etc.
  }

  private async handleSubscriptionUpdated(subscription: any): Promise<void> {
    console.log('Subscription updated:', subscription.id);
    // Update local database with subscription changes
  }

  private async handleSubscriptionDeleted(subscription: any): Promise<void> {
    console.log('Subscription deleted:', subscription.id);
    // Update local database, clean up user data if needed
  }
}

export default RevenueManager;