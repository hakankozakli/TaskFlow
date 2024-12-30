import { PricingPlan } from '@/types/subscription';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for individuals and small projects',
    price: 0,
    interval: 'month',
    stripePriceId: '',
    features: [
      { name: 'Up to 3 projects', description: 'Create and manage up to 3 projects', included: true },
      { name: 'Basic task management', description: 'Essential task tracking features', included: true },
      { name: 'Team collaboration', description: 'Work with up to 3 team members', included: true },
      { name: 'Basic integrations', description: 'Connect with essential tools', included: false },
      { name: 'Priority support', description: '24/7 priority customer support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Best for growing teams and businesses',
    price: 29,
    interval: 'month',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro',
    popular: true,
    features: [
      { name: 'Unlimited projects', description: 'Create and manage unlimited projects', included: true },
      { name: 'Advanced task management', description: 'Advanced tracking and reporting', included: true },
      { name: 'Team collaboration', description: 'Unlimited team members', included: true },
      { name: 'Advanced integrations', description: 'Connect with any tool', included: true },
      { name: 'Priority support', description: '24/7 priority customer support', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: 99,
    interval: 'month',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
    features: [
      { name: 'Everything in Pro', description: 'All Pro features included', included: true },
      { name: 'Custom solutions', description: 'Tailored to your needs', included: true },
      { name: 'Dedicated support', description: 'Personal account manager', included: true },
      { name: 'SLA guarantees', description: 'Enterprise-grade SLA', included: true },
      { name: 'On-premise options', description: 'Deploy on your infrastructure', included: true },
    ],
  },
];