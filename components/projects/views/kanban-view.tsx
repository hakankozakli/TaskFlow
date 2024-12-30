'use client';

import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './kanban/column';
import { useProjectStore } from '@/lib/stores/use-project-store';
import { useEffect } from 'react';

interface KanbanViewProps {
  projectId: string;
}

export function KanbanView({ projectId }: KanbanViewProps) {
  const { columns, moveTask, initializeProject } = useProjectStore();

  useEffect(() => {
    initializeProject(projectId);
  }, [projectId, initializeProject]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    if (!destination) return;
    
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    moveTask(
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 h-full overflow-x-auto pb-4 px-4 min-h-[calc(100vh-20rem)]">
        {columns.map((column) => (
          <KanbanColumn 
            key={column.id} 
            column={column} 
            projectId={projectId}
          />
        ))}
      </div>
    </DragDropContext>
  );
}