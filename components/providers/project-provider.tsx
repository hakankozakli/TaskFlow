'use client';

import { createContext, useContext, useState } from 'react';
import { ProjectDialog } from '@/components/projects/project-dialog';

interface ProjectContextType {
  openNewProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [showNewProject, setShowNewProject] = useState(false);

  const openNewProject = () => setShowNewProject(true);

  return (
    <ProjectContext.Provider value={{ openNewProject }}>
      {children}
      <ProjectDialog 
        open={showNewProject} 
        onOpenChange={setShowNewProject}
      />
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
}