'use client';

import { Team } from '@/types/team';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { InviteDialog } from './invite/invite-dialog';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{team.name}</CardTitle>
              <CardDescription>{team.description}</CardDescription>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowInvite(true)}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex -space-x-2">
              {team.members.slice(0, 5).map((member) => (
                <Avatar key={member.id} className="border-2 border-background">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {team.members.length > 5 && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm">
                  +{team.members.length - 5}
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Updated {formatDistanceToNow(new Date(team.updatedAt))} ago
            </div>
          </div>
        </CardContent>
      </Card>

      <InviteDialog
        open={showInvite}
        onOpenChange={setShowInvite}
        teamId={team.id}
      />
    </>
  );
}