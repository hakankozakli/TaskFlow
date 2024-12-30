'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';

interface PricingPlansProps {
  selectedPlan: string | null;
  onSelectPlan: (plan: string) => void;
}

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    features: [
      'Up to 3 projects',
      'Basic task management',
      'Team collaboration',
    ],
  },
  {
    id: 'price_pro',
    name: 'Pro',
    price: '$29/month',
    features: [
      'Unlimited projects',
      'Advanced task management',
      'Priority support',
      'Custom workflows',
    ],
  },
  {
    id: 'price_enterprise',
    name: 'Enterprise',
    price: '$99/month',
    features: [
      'Everything in Pro',
      'Custom solutions',
      'Dedicated support',
      'SLA guarantees',
      'On-premise options',
    ],
  },
];

export function PricingPlans({ selectedPlan, onSelectPlan }: PricingPlansProps) {
  return (
    <RadioGroup
      value={selectedPlan || undefined}
      onValueChange={onSelectPlan}
      className="grid gap-4 md:grid-cols-3"
    >
      {plans.map((plan) => (
        <Label
          key={plan.id}
          className={`relative flex flex-col p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors ${
            selectedPlan === plan.id ? 'border-primary bg-primary/5' : ''
          }`}
        >
          <RadioGroupItem
            value={plan.id}
            id={plan.id}
            className="sr-only"
          />
          <div className="font-semibold">{plan.name}</div>
          <div className="text-xl font-bold mt-1">{plan.price}</div>
          <ul className="mt-4 space-y-2 text-sm">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          {selectedPlan === plan.id && (
            <div className="absolute -top-2 -right-2 h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <Check className="h-4 w-4" />
            </div>
          )}
        </Label>
      ))}
    </RadioGroup>
  );
}