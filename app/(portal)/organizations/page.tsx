'use client';

import { OrganizationList } from '@/components/organizations/organization-list';
import { OrganizationHeader } from '@/components/organizations/organization-header';

export default function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <OrganizationHeader />
      <OrganizationList />
    </div>
  );
}