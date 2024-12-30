'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AICrewCard } from './ai-crew-card';
import { AICrewDialog } from './ai-crew-dialog';
import { useAICrewStore } from '@/lib/stores/use-ai-crew-store';

export function AICrewList() {
  const [showNewCrew, setShowNewCrew] = useState(false);
  const crews = useAICrewStore((state) => state.crews);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Crews</h2>
          <p className="text-muted-foreground">
            Manage your AI-powered development teams
          </p>
        </div>
        <Button onClick={() => setShowNewCrew(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New AI Crew
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crews.map((crew) => (
          <AICrewCard key={crew.id} crew={crew} />
        ))}
      </div>

      <AICrewDialog
        open={showNewCrew}
        onOpenChange={setShowNewCrew}
      />
    </>
  );
}