'use client';

import { Project } from '@/types/projects';
import { Button } from '@/components/ui/button';
import { StatusSelect } from './status/status-select';
import { useProjectsStore } from '@/lib/stores/use-projects-store';
import { Settings, Share2 } from 'lucide-react';
import { useCallback } from 'react';

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const updateProject = useProjectsStore((state) => state.updateProject);

  const handleStatusChange = useCallback((status: string) => {
    if (!project?.id) return;
    updateProject(project.id, { status });
  }, [project?.id, updateProject]);

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="text-sm text-muted-foreground">{project.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <StatusSelect
          value={project.status || 'todo'}
          onValueChange={handleStatusChange}
        />
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}