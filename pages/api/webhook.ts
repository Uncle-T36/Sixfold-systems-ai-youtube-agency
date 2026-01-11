// Stripe webhook handler for payment events
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Disable body parsing - Stripe needs raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!stripe) {
    console.error('Stripe not configured');
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  let event: Stripe.Event;

  try {
    // Get raw body as buffer
    const rawBody = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;

    if (!endpointSecret) {
      console.warn('⚠️ Webhook secret not configured - skipping signature verification');
      event = JSON.parse(rawBody.toString()) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`✅ Checkout completed: ${session.id}`);
        console.log(`   Customer: ${session.customer_email}`);
        console.log(`   Amount: $${(session.amount_total || 0) / 100}`);
        
        // TODO: Update user's subscription in database
        // await updateUserSubscription(session.customer_email, session.subscription);
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`✅ Subscription created: ${subscription.id}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`🔄 Subscription updated: ${subscription.id} - Status: ${subscription.status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`❌ Subscription canceled: ${subscription.id}`);
        
        // TODO: Downgrade user's access
        // await downgradeUser(subscription.metadata.userId);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`💰 Invoice paid: ${invoice.id} - $${(invoice.amount_paid || 0) / 100}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`⚠️ Payment failed: ${invoice.id}`);
        
        // TODO: Send email to user about failed payment
        // await sendPaymentFailedEmail(invoice.customer_email);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}