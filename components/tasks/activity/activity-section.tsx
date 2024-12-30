'use client';

import { useActivityStore } from '@/lib/stores/use-activity-store';
import { ActivityItem } from './activity-item';

interface ActivitySectionProps {
  taskId: string;
}

export function ActivitySection({ taskId }: ActivitySectionProps) {
  const activities = useActivityStore((state) => state.getTaskActivities(taskId));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Activity</h3>
        <p className="text-sm text-muted-foreground">
          Recent updates and changes
        </p>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-8">
          No activity yet
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}