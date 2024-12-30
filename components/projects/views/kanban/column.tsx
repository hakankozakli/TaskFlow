'use client';

import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { KanbanColumn as ColumnType } from '@/types/projects';
import { KanbanTask } from './task';
import { AddTaskButton } from './add-task-button';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { Task } from '@/types/projects';

interface KanbanColumnProps {
  column: ColumnType;
  projectId: string;
}

export function KanbanColumn({ column, projectId }: KanbanColumnProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  return (
    <div className="w-80 flex-shrink-0">
      <Card>
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{column.title}</h3>
            <span className="text-muted-foreground text-sm">
              {column.tasks.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="py-2">
          <Droppable droppableId={column.id}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {column.tasks.map((task, index) => (
                  <KanbanTask 
                    key={task.id} 
                    task={task} 
                    index={index}
                    onEdit={() => setEditingTask(task)}
                  />
                ))}
                {provided.placeholder}
                <AddTaskButton 
                  columnId={column.id} 
                  projectId={projectId}
                />
              </div>
            )}
          </Droppable>
        </CardContent>
      </Card>
      
      {editingTask && (
        <TaskDialog
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          task={editingTask}
          columnId={column.id}
          projectId={projectId}
        />
      )}
    </div>
  );
}