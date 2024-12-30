import { stripe } from '@/lib/stripe/config';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Stripe } from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case 'checkout.session.completed':
      // Update user's subscription status
      const userId = session.subscription_data?.metadata?.userId;
      if (userId) {
        // Update user's subscription in your database
        // This is where you'd update the user's role/plan
      }
      break;
    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      break;
    case 'customer.subscription.updated':
      // Handle subscription updates
      break;
  }

  return NextResponse.json({ received: true });
}