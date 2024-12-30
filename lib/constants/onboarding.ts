export const ONBOARDING_STEPS = {
  REGISTRATION: 0,
  ORGANIZATION: 1,
  SUBSCRIPTION: 2,
} as const;

export type OnboardingStep = typeof ONBOARDING_STEPS[keyof typeof ONBOARDING_STEPS];

export const ORGANIZATION_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '500+',
] as const;

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Other',
] as const;

export type OrganizationSize = typeof ORGANIZATION_SIZES[number];
export type Industry = typeof INDUSTRIES[number];