'use client';

import { User } from '@/types/user';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useTeamStore } from '@/lib/stores/use-team-store';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const teams = useTeamStore((state) => 
    state.teams.filter(team => user.teams.includes(team.id))
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>
            {user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg">{user.name}</CardTitle>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
              {user.role}
            </Badge>
            <Badge 
              variant={user.status === 'active' ? 'success' : 'secondary'}
              className="capitalize"
            >
              {user.status}
            </Badge>
          </div>
          
          {teams.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Teams</div>
              <div className="flex flex-wrap gap-2">
                {teams.map(team => (
                  <Badge key={team.id} variant="outline">
                    {team.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            Joined {formatDistanceToNow(new Date(user.createdAt))} ago
          </div>
        </div>
      </CardContent>
    </Card>
  );
}