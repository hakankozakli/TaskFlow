'use client';

import { useTeamStore } from '@/lib/stores/use-team-store';
import { TeamCard } from './team-card';
import { TeamEmpty } from './team-empty';
import { Button } from '@/components/ui/button';
import { Plus, Bot } from 'lucide-react';
import { useState } from 'react';
import { TeamDialog } from './team-dialog';
import { useRouter } from 'next/navigation';

export function TeamList() {
  const teams = useTeamStore((state) => state.teams);
  const [showNewTeam, setShowNewTeam] = useState(false);
  const router = useRouter();

  return (
    <div className="space-y-6">
      {teams.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Teams</h2>
              <p className="text-muted-foreground">
                Manage your teams and collaborators
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push('/team/ai-crews')}
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Crews
              </Button>
              <Button onClick={() => setShowNewTeam(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Team
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-card rounded-lg border">
          <TeamEmpty onCreateTeam={() => setShowNewTeam(true)} />
        </div>
      )}

      <TeamDialog
        open={showNewTeam}
        onOpenChange={setShowNewTeam}
      />
    </div>
  );
}