'use client';

import { useProjectStore } from '@/lib/stores/use-project-store';
import { TimelineTask } from './timeline-task';

export function TimelineView() {
  const { columns } = useProjectStore();
  const tasks = columns.flatMap(column => column.tasks);

  return (
    <div className="p-4 h-full overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[200px,1fr] gap-4">
          <div className="font-medium text-sm text-muted-foreground">Task</div>
          <div className="grid grid-cols-12 gap-2">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="text-center text-sm text-muted-foreground">
                {new Date(2024, i).toLocaleString('default', { month: 'short' })}
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          {tasks.map(task => (
            <TimelineTask key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}