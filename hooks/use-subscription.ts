'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { PRICING_PLANS } from '@/lib/config/pricing';

export function useSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const startSubscription = async (planId: string, email: string, password: string) => {
    setIsLoading(true);

    try {
      // 1. Create user account
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;

      // 2. For paid plans, redirect to Stripe
      const plan = PRICING_PLANS.find(p => p.id === planId);
      if (!plan) throw new Error('Invalid plan selected');

      if (plan.price > 0) {
        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId: plan.stripePriceId,
            userId: authData.user?.id,
            email,
          }),
        });

        const { sessionId, error } = await response.json();
        if (error) throw new Error(error);

        // Redirect to Stripe Checkout
        router.push(`/onboarding?session_id=${sessionId}`);
      } else {
        // Free plan - direct to onboarding
        router.push('/onboarding');
      }

      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    startSubscription,
  };
}