'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth/session-provider';
import { db } from '@/lib/db';

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
        
        

        console.log(await db.user_organizations.findFirst({
          where: {
            user_id: session.user.id
          }
        }));
        // Check if user has any organization memberships
        const { data: memberships, error } = await supabase
          .from('user_organizations')
          .select('organization_id, is_primary')
          .eq('user_id', session.user.id)
          .limit(1);
        
        if (error) throw error;
        
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