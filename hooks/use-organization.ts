'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth/session-provider';
import { Api } from '@/lib/api';

export function useOrganization() {
  const [loading, setLoading] = useState(true);
  const [hasOrganization, setHasOrganization] = useState(false);
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function checkOrganization() {
      if (!session?.user) {
        setLoading(false);
        return;
      }
      
      try {
        
        const api = new Api('resource', session.access_token); 
        const memberships = await api.get('user_organizations', { page: 1, limit: 10 });

        if (!memberships?.length) {
          router.push('/onboarding/organization');
          setHasOrganization(false);
        } else {
          setHasOrganization(true);
        }
      } catch (error) {
        console.error('Error checking organization:', error);
        setHasOrganization(false);
      } finally {
        setLoading(false);
      }
    }

    checkOrganization();
  }, [session, router]);

  return { loading, hasOrganization };
}