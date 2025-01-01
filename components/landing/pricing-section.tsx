'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-provider';
import { CheckCircle2 } from 'lucide-react';

export function PricingSection() {
  const router = useRouter();
  const { session } = useAuth();

  const handlePricingClick = (plan: 'free' | 'pro' | 'enterprise') => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push(`/onboarding?plan=${plan}`);
    }
  };

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold">Free</h3>
            <div className="mt-4 text-3xl font-bold">$0</div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Perfect for individuals</p>
            <ul className="mt-6 space-y-4">
              {['Up to 10 projects', 'Basic task management', 'Team collaboration'].map((feature) => (
                <li key={feature} className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button 
              className="mt-6"
              onClick={() => handlePricingClick('free')}
            >
              {session ? 'Go to Dashboard' : 'Get Started'}
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="flex flex-col p-6 bg-primary text-primary-foreground rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold">Pro</h3>
            <div className="mt-4 text-3xl font-bold">$29</div>
            <p className="mt-2 opacity-90">For growing teams</p>
            <ul className="mt-6 space-y-4">
              {[
                'Unlimited projects',
                'Advanced task management',
                'Priority support',
                'Custom workflows',
              ].map((feature) => (
                <li key={feature} className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button 
              variant="secondary" 
              className="mt-6"
              onClick={() => handlePricingClick('pro')}
            >
              {session ? 'Go to Dashboard' : 'Get Started'}
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold">Enterprise</h3>
            <div className="mt-4 text-3xl font-bold">Custom</div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">For large organizations</p>
            <ul className="mt-6 space-y-4">
              {[
                'Custom solutions',
                'Dedicated support',
                'SLA guarantees',
                'On-premise options',
              ].map((feature) => (
                <li key={feature} className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button 
              className="mt-6"
              onClick={() => handlePricingClick('enterprise')}
            >
              {session ? 'Go to Dashboard' : 'Contact Sales'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}