'use client';

import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';
import { useState } from 'react';
import { OrganizationDialog } from './organization-dialog';

export function OrganizationEmpty() {
  const [showNewOrg, setShowNewOrg] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center border rounded-lg bg-card">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">No Organizations</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Create your first organization to start collaborating with your team.
        </p>
        <Button onClick={() => setShowNewOrg(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Organization
        </Button>
      </div>

      <OrganizationDialog
        open={showNewOrg}
        onOpenChange={setShowNewOrg}
      />
    </>
  );
}