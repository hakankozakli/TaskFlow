'use client';

import { useState } from 'react';
import { ViewType } from '@/types/projects';
import { KanbanView } from './views/kanban-view';
import { ListView } from './views/list-view';
import { TimelineView } from './views/timeline-view';
import { TableView } from './views/table-view';
import { ViewToggle } from './view-toggle';

interface ProjectContentProps {
  projectId: string;
}

export function ProjectContent({ projectId }: ProjectContentProps) {
  const [currentView, setCurrentView] = useState<ViewType>('kanban');

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col gap-4">
        <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
      </div>
      <div className="flex-1 min-h-0">
        {currentView === 'kanban' && <KanbanView projectId={projectId} />}
        {currentView === 'list' && <ListView projectId={projectId} />}
        {currentView === 'timeline' && <TimelineView projectId={projectId} />}
        {currentView === 'table' && <TableView projectId={projectId} />}
      </div>
    </div>
  );
}