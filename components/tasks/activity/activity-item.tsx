'use client';

import { Activity } from '@/types/activity';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="flex gap-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src={activity.user.avatar} />
        <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="text-sm">
          <span className="font-medium">{activity.user.name}</span>{' '}
          {activity.action}{' '}
          <span className="text-muted-foreground">
            {formatDistanceToNow(new Date(activity.timestamp))} ago
          </span>
        </p>
        {activity.details && (
          <p className="text-sm text-muted-foreground">{activity.details}</p>
        )}
      </div>
    </div>
  );
}