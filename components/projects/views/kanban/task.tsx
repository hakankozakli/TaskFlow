'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Task } from '@/types/projects';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { TaskDialog } from '@/components/tasks/task-dialog';

interface KanbanTaskProps {
  task: Task;
  index: number;
}

export function KanbanTask({ task, index }: KanbanTaskProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="bg-card p-3 rounded-md shadow-sm border group hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <h4 className="font-medium">{task.title}</h4>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {task.description.replace(/<[^>]*>/g, '').slice(0, 100)}
                {task.description.length > 100 ? '...' : ''}
              </p>
            )}
            {(task.dueDate || task.priority) && (
              <div className="flex items-center gap-2 mt-2">
                {task.dueDate && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {task.dueDate}
                  </div>
                )}
                {task.priority && (
                  <Badge variant="secondary" className="text-xs">
                    {task.priority}
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}
      </Draggable>

      <TaskDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        task={task}
      />
    </>
  );
}