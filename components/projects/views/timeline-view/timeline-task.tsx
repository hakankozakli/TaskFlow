'use client';

import { Task } from '@/types/projects';
import { useState } from 'react';
import { TaskDialog } from '@/components/tasks/task-dialog';

interface TimelineTaskProps {
  task: Task;
}

export function TimelineTask({ task }: TimelineTaskProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const getTaskPosition = () => {
    if (!task.startDate || !task.dueDate) return null;
    
    const start = new Date(task.startDate);
    const end = new Date(task.dueDate);
    const startMonth = start.getMonth();
    const endMonth = end.getMonth();
    const duration = endMonth - startMonth + 1;
    
    return {
      gridColumn: `${startMonth + 1} / span ${duration}`,
    };
  };

  const position = getTaskPosition();
  if (!position) return null;

  return (
    <>
      <div className="grid grid-cols-[200px,1fr] gap-4 items-center">
        <div className="font-medium truncate">{task.title}</div>
        <div className="grid grid-cols-12 gap-2 h-8">
          <div
            className="bg-primary/10 rounded-full px-2 py-1 text-xs font-medium cursor-pointer hover:bg-primary/20 transition-colors"
            style={position}
            onClick={() => setIsOpen(true)}
          >
            {task.title}
          </div>
        </div>
      </div>

      <TaskDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        task={task}
      />
    </>
  );
}