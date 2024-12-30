'use client';

import { OrganizationOnboarding } from '@/components/auth/onboarding/organization/organization-onboarding';
import { useSession } from '@/lib/auth/session-provider';
import { LoadingScreen } from '@/components/auth/loading-screen';
import { useRouter } from 'next/navigation';

export default function OrganizationOnboardingPage() {
  const { session, loading } = useSession();
  const router = useRouter();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  return <OrganizationOnboarding />;
}