'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Project, Task } from '@/types/projects';
import { useSession } from '@/lib/auth/session-provider';
import * as projectService from '@/lib/services/projects';
import * as taskService from '@/lib/services/tasks';

interface DataContextType {
  projects: Project[];
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  refreshProjects: () => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  projects: [],
  tasks: [],
  loading: true,
  error: null,
  refreshProjects: async () => {},
  refreshTasks: async () => {},
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { session } = useSession();

  const refreshProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (e) {
      setError(e as Error);
    }
  };

  const refreshTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (e) {
      setError(e as Error);
    }
  };

  useEffect(() => {
    if (!session) return;

    const supabase = createClient();

    // Initial data fetch
    Promise.all([refreshProjects(), refreshTasks()])
      .catch(e => setError(e as Error))
      .finally(() => setLoading(false));

    // Set up real-time subscriptions
    const projectsSubscription = supabase
      .channel('projects-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' },
        refreshProjects
      )
      .subscribe();

    const tasksSubscription = supabase
      .channel('tasks-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        refreshTasks
      )
      .subscribe();

    return () => {
      projectsSubscription.unsubscribe();
      tasksSubscription.unsubscribe();
    };
  }, [session]);

  return (
    <DataContext.Provider 
      value={{ 
        projects, 
        tasks, 
        loading, 
        error,
        refreshProjects,
        refreshTasks
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};