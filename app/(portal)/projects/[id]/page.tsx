'use client';

import { useProjectsStore } from '@/lib/stores/use-projects-store';
import { ProjectLayout } from '@/components/projects/project-layout';
import { notFound } from 'next/navigation';
import { useEffect } from 'react';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = useProjectsStore((state) => 
    state.projects.find((p) => p.id === params.id)
  );

  // Redirect to 404 if project is not found
  useEffect(() => {
    if (!project) {
      notFound();
    }
  }, [project]);

  // Show loading state while checking project
  if (!project) {
    return null;
  }

  return <ProjectLayout project={project} />;
}