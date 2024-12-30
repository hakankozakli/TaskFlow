'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InviteForm } from './invite-form';
import { InviteList } from './invite-list';

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
}

export function InviteDialog({ open, onOpenChange, teamId }: InviteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <InviteForm teamId={teamId} />
          <InviteList teamId={teamId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}