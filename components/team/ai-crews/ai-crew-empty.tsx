'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Plus } from 'lucide-react';
import { AICrewDialog } from './ai-crew-dialog';

export function AICrewEmpty() {
  const [showNewCrew, setShowNewCrew] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center border rounded-lg bg-card">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Bot className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">No AI Crews</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Create your first AI crew to automate development tasks and boost productivity.
        </p>
        <Button onClick={() => setShowNewCrew(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create AI Crew
        </Button>
      </div>

      <AICrewDialog
        open={showNewCrew}
        onOpenChange={setShowNewCrew}
      />
    </>
  );
}