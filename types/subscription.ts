export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export interface PlanFeature {
  name: string;
  description: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: PlanFeature[];
  stripePriceId: string;
  popular?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  currentPeriodEnd: string;
  cancelAt?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}