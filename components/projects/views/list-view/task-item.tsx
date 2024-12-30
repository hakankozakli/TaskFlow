'use client';

import { Task } from '@/types/projects';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { TaskDialog } from '@/components/tasks/task-dialog';

interface TaskItemProps {
  task: Task;
  level: number;
}

export function TaskItem({ task, level }: TaskItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:border-primary/50 transition-colors cursor-pointer"
        style={{ marginLeft: `${level * 2}rem` }}
        onClick={() => setIsOpen(true)}
      >
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <div className="flex-1">
          <h4 className="font-medium">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {task.description.replace(/<[^>]*>/g, '').slice(0, 100)}
              {task.description.length > 100 ? '...' : ''}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {task.startDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {task.startDate}
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {task.dueDate}
            </div>
          )}
          {task.priority && (
            <Badge variant="secondary">
              {task.priority}
            </Badge>
          )}
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