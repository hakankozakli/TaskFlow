'use client';

import { OrganizationOnboarding } from '@/components/auth/onboarding/organization/organization-onboarding';
import { useAuth } from '@/app/providers/auth-provider';
import { LoadingScreen } from '@/components/auth/loading-screen';
import { useRouter } from 'next/navigation';

export default function OrganizationOnboardingPage() {
  const { user, isLoading: loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return <OrganizationOnboarding />;
}