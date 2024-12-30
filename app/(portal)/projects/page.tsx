'use client';

import { useState } from 'react';
import { ViewToggle } from '@/components/projects/view-toggle';
import { ProjectHeader } from '@/components/projects/project-header';
import { KanbanView } from '@/components/projects/views/kanban-view';
import { ListView } from '@/components/projects/views/list-view';
import { TimelineView } from '@/components/projects/views/timeline-view';
import { TableView } from '@/components/projects/views/table-view';
import { ProjectList } from '@/components/projects/project-list';
import { ViewType } from '@/types/projects';

export default function ProjectsPage() {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  if (!selectedProject) {
    return <ProjectList />;
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col gap-4">
        <ProjectHeader />
        <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
      </div>
      <div className="flex-1 min-h-0">
        {currentView === 'kanban' && <KanbanView />}
        {currentView === 'list' && <ListView />}
        {currentView === 'timeline' && <TimelineView />}
        {currentView === 'table' && <TableView />}
      </div>
    </div>
  );
}