'use client';

import { useTeamInvites } from '@/hooks/use-team-invites';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface InviteListProps {
  teamId: string;
}

export function InviteList({ teamId }: InviteListProps) {
  const { invites, cancelInvite } = useTeamInvites();
  const teamInvites = invites.filter(invite => invite.teamId === teamId);

  if (teamInvites.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Pending Invitations</h3>
      <div className="space-y-2">
        {teamInvites.map((invite) => (
          <div
            key={invite.id}
            className="flex items-center justify-between p-2 text-sm border rounded-md"
          >
            <div>
              <p className="font-medium">{invite.email}</p>
              <p className="text-xs text-muted-foreground">
                Sent {formatDistanceToNow(new Date(invite.createdAt))} ago
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => cancelInvite(invite.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}