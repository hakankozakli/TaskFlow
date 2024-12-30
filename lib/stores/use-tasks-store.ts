'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from '@/types/projects';

interface TasksState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getProjectTasks: (projectId: string) => Task[];
  updateProjectTaskCount: (projectId: string) => void;
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: (task) => {
        set((state) => {
          const newTask = { 
            ...task, 
            id: crypto.randomUUID(),
            status: task.status || 'todo',
            createdAt: new Date().toISOString()
          };
          return { tasks: [...state.tasks, newTask] };
        });
        if (task.projectId) {
          get().updateProjectTaskCount(task.projectId);
        }
      },
      
      updateTask: (id, updates) => {
        set((state) => {
          const task = state.tasks.find(t => t.id === id);
          if (!task) return state;
          
          const updatedTasks = state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          );
          
          return { tasks: updatedTasks };
        });
        
        const task = get().tasks.find(t => t.id === id);
        if (task?.projectId) {
          get().updateProjectTaskCount(task.projectId);
        }
      },
      
      deleteTask: (id) => {
        const task = get().tasks.find(t => t.id === id);
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
        if (task?.projectId) {
          get().updateProjectTaskCount(task.projectId);
        }
      },
      
      getProjectTasks: (projectId) => 
        get().tasks.filter((task) => task.projectId === projectId),
      
      updateProjectTaskCount: (projectId) => {
        const projectTasks = get().getProjectTasks(projectId);
        const completedTasks = projectTasks.filter(t => t.status === 'done').length;
        
        // Update project stats in projects store
        const projectsStore = window.localStorage.getItem('projects-storage');
        if (projectsStore) {
          const { state } = JSON.parse(projectsStore);
          const updatedProjects = state.projects.map(p => 
            p.id === projectId 
              ? { 
                  ...p, 
                  tasks: projectTasks.length,
                  completedTasks: completedTasks
                }
              : p
          );
          
          window.localStorage.setItem('projects-storage', JSON.stringify({
            state: { ...state, projects: updatedProjects },
            version: 0
          }));
        }
      },
    }),
    {
      name: 'tasks-storage',
    }
  )
);