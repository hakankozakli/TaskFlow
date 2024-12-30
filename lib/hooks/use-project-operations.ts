'use client';

import { useData } from '@/lib/providers/data-provider';
import { Project, Task } from '@/types/projects';
import * as projectService from '@/lib/services/projects';
import * as taskService from '@/lib/services/tasks';
import { toast } from 'sonner';

export function useProjectOperations() {
  const { refreshProjects, refreshTasks } = useData();

  const createProject = async (project: Omit<Project, 'id'>) => {
    try {
      await projectService.createProject(project);
      await refreshProjects();
      toast.success('Project created successfully');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      await projectService.updateProject(id, updates);
      await refreshProjects();
      toast.success('Project updated successfully');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectService.deleteProject(id);
      await refreshProjects();
      toast.success('Project deleted successfully');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const createTask = async (task: Omit<Task, 'id'>) => {
    try {
      await taskService.createTask(task);
      await refreshTasks();
      toast.success('Task created successfully');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      await taskService.updateTask(id, updates);
      await refreshTasks();
      toast.success('Task updated successfully');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      await refreshTasks();
      toast.success('Task deleted successfully');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  return {
    createProject,
    updateProject,
    deleteProject,
    createTask,
    updateTask,
    deleteTask,
  };
}