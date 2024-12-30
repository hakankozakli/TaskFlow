import { create } from 'zustand';
import { Project } from '@/types/projects';
import { persist } from 'zustand/middleware';

interface ProjectsState {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: [],
      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            { 
              ...project, 
              id: crypto.randomUUID(),
              status: project.status || 'todo',
              tasks: project.tasks || 0,
              completedTasks: project.completedTasks || 0,
              members: project.members || 0
            },
          ],
        })),
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'projects-storage',
    }
  )
);