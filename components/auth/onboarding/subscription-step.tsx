'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PricingPlans } from '@/components/auth/pricing-plans';
import { useStripeSession } from '@/hooks/use-stripe-session';
import { toast } from 'sonner';

interface SubscriptionStepProps {
  onComplete: () => void;
  initialPlan?: string;
}

export function SubscriptionStep({ onComplete, initialPlan }: SubscriptionStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(initialPlan || 'free');
  const { createCheckoutSession } = useStripeSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedPlan === 'free') {
        onComplete();
      } else {
        await createCheckoutSession({
          priceId: selectedPlan,
          successUrl: '/dashboard',
          cancelUrl: '/onboarding',
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PricingPlans
        selectedPlan={selectedPlan}
        onSelectPlan={setSelectedPlan}
      />

      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading || !selectedPlan}
      >
        {isLoading ? 'Processing...' : 'Complete Setup'}
      </Button>
    </form>
  );
}