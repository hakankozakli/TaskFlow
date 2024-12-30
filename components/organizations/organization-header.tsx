'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { OrganizationDialog } from './organization-dialog';

export function OrganizationHeader() {
  const [showNewOrg, setShowNewOrg] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Organizations</h2>
          <p className="text-muted-foreground">
            Manage your organizations and team access
          </p>
        </div>
        <Button onClick={() => setShowNewOrg(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Organization
        </Button>
      </div>

      <OrganizationDialog 
        open={showNewOrg} 
        onOpenChange={setShowNewOrg} 
      />
    </>
  );
}