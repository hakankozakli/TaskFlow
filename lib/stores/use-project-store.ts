'use client';

import { create } from 'zustand';
import { KanbanColumn, Task } from '@/types/projects';
import { useTasksStore } from './use-tasks-store';

interface ProjectState {
  columns: KanbanColumn[];
  currentProjectId: string | null;
  initializeProject: (projectId: string) => void;
  moveTask: (sourceColId: string, destColId: string, sourceIndex: number, destIndex: number) => void;
  addTask: (columnId: string, task: Task) => void;
  updateTask: (columnId: string, taskId: string, updates: Partial<Task>) => void;
}

const defaultColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', tasks: [] },
  { id: 'in-progress', title: 'In Progress', tasks: [] },
  { id: 'review', title: 'Review', tasks: [] },
  { id: 'done', title: 'Done', tasks: [] },
];

export const useProjectStore = create<ProjectState>((set, get) => ({
  columns: defaultColumns,
  currentProjectId: null,

  initializeProject: (projectId) => {
    const tasks = useTasksStore.getState().getProjectTasks(projectId);
    const columns = defaultColumns.map(col => ({
      ...col,
      tasks: tasks.filter(task => task.status === col.id),
    }));
    set({ columns, currentProjectId: projectId });
  },
  
  moveTask: (sourceColId, destColId, sourceIndex, destIndex) => {
    set((state) => {
      const newColumns = [...state.columns];
      const sourceCol = newColumns.find((col) => col.id === sourceColId);
      const destCol = newColumns.find((col) => col.id === destColId);
      
      if (!sourceCol || !destCol) return state;
      
      const [movedTask] = sourceCol.tasks.splice(sourceIndex, 1);
      destCol.tasks.splice(destIndex, 0, movedTask);

      // Update task status in tasks store
      if (state.currentProjectId) {
        useTasksStore.getState().updateTask(movedTask.id, {
          status: destColId,
        });
      }
      
      return { columns: newColumns };
    });
  },
  
  addTask: (columnId, task) => {
    set((state) => {
      const newColumns = [...state.columns];
      const column = newColumns.find((col) => col.id === columnId);
      if (!column) return state;
      
      column.tasks.push(task);
      return { columns: newColumns };
    });
  },
  
  updateTask: (columnId, taskId, updates) => {
    set((state) => {
      const newColumns = [...state.columns];
      const column = newColumns.find((col) => col.id === columnId);
      if (!column) return state;
      
      const task = column.tasks.find((t) => t.id === taskId);
      if (!task) return state;
      
      Object.assign(task, updates);
      return { columns: newColumns };
    });
  },
}));