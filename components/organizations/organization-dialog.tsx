'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { OrganizationForm } from './organization-form';

interface OrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: Organization;
}

export function OrganizationDialog({ 
  open, 
  onOpenChange, 
  organization 
}: OrganizationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {organization ? 'Edit Organization' : 'Create Organization'}
          </DialogTitle>
        </DialogHeader>
        <OrganizationForm 
          organization={organization}
          onComplete={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}