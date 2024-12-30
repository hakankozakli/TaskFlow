'use client';

import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';

interface TeamEmptyProps {
  onCreateTeam: () => void;
}

export function TeamEmpty({ onCreateTeam }: TeamEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Users className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">No teams yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Create your first team to start collaborating with others. Teams help you organize projects and manage access.
      </p>
      <Button onClick={onCreateTeam}>
        <Plus className="w-4 h-4 mr-2" />
        Create Team
      </Button>
    </div>
  );
}