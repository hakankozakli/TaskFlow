'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RegistrationStep } from '@/components/auth/onboarding/registration-step';
import { OrganizationStep } from '@/components/auth/onboarding/organization-step';
import { SubscriptionStep } from '@/components/auth/onboarding/subscription-step';
import { ONBOARDING_STEPS } from '@/lib/constants/onboarding';
import { ProgressWizard } from '@/components/auth/wizard/progress-wizard';

const steps = [
  {
    title: 'Create Account',
    description: 'Start by creating your account'
  },
  {
    title: 'Organization Details',
    description: 'Tell us about your organization'
  },
  {
    title: 'Choose Plan',
    description: 'Select the right plan for you'
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(ONBOARDING_STEPS.REGISTRATION);
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');

  const handleRegistrationComplete = () => {
    setCurrentStep(ONBOARDING_STEPS.ORGANIZATION);
  };

  const handleOrganizationComplete = () => {
    setCurrentStep(ONBOARDING_STEPS.SUBSCRIPTION);
  };

  const handleSubscriptionComplete = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-6">
          <ProgressWizard 
            steps={steps}
            currentStep={currentStep}
          />
        </CardHeader>
        <CardContent>
          {currentStep === ONBOARDING_STEPS.REGISTRATION && (
            <RegistrationStep onComplete={handleRegistrationComplete} />
          )}
          {currentStep === ONBOARDING_STEPS.ORGANIZATION && (
            <OrganizationStep onComplete={handleOrganizationComplete} />
          )}
          {currentStep === ONBOARDING_STEPS.SUBSCRIPTION && (
            <SubscriptionStep 
              onComplete={handleSubscriptionComplete}
              initialPlan={plan || undefined}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}