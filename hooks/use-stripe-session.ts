'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface CreateCheckoutSessionParams {
  priceId: string;
  userId: string;
  email: string;
}

export function useStripeSession() {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutSession = async ({
    priceId,
    userId,
    email,
  }: CreateCheckoutSessionParams) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          email,
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) throw new Error('Stripe failed to load');

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createCheckoutSession,
  };
}