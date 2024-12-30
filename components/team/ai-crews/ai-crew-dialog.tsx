'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AICrewForm } from './ai-crew-form';
import { AICrew } from '@/types/ai-crew';

interface AICrewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crew?: AICrew;
}

export function AICrewDialog({ open, onOpenChange, crew }: AICrewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{crew ? 'Edit AI Crew' : 'Create AI Crew'}</DialogTitle>
        </DialogHeader>
        <AICrewForm crew={crew} onComplete={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}