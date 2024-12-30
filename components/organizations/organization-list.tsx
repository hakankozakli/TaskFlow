'use client';

import { useEffect, useState } from 'react';
import { OrganizationCard } from './organization-card';
import { OrganizationEmpty } from './organization-empty';
import { getOrganizations } from '@/lib/services/organization-service';
import { Organization } from '@/types/organization';
import { toast } from 'sonner';

export function OrganizationList() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrganizations() {
      try {
        const data = await getOrganizations();
        setOrganizations(data);
      } catch (error: any) {
        toast.error('Failed to load organizations');
      } finally {
        setLoading(false);
      }
    }

    loadOrganizations();
  }, []);

  if (loading) {
    return <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-40 bg-muted rounded-lg animate-pulse" />
      ))}
    </div>;
  }

  if (organizations.length === 0) {
    return <OrganizationEmpty />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {organizations.map((org) => (
        <OrganizationCard key={org.id} organization={org} />
      ))}
    </div>
  );
}