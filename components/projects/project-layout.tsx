'use client';

import { Project } from '@/types/projects';
import { ProjectHeader } from './project-header';
import { ProjectStats } from './project-stats';
import { ProjectContent } from './project-content';

interface ProjectLayoutProps {
  project: Project;
}

export function ProjectLayout({ project }: ProjectLayoutProps) {
  if (!project?.id) return null;

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <ProjectStats project={project} />
      <ProjectContent projectId={project.id} />
    </div>
  );
}