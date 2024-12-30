'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Status {
  id: string;
  name: string;
  color: string;
  order: number;
}

interface StatusState {
  statuses: Status[];
  addStatus: (status: Omit<Status, 'id'>) => void;
  updateStatus: (id: string, updates: Partial<Status>) => void;
  deleteStatus: (id: string) => void;
  reorderStatuses: (startIndex: number, endIndex: number) => void;
}

const defaultStatuses: Status[] = [
  { id: 'todo', name: 'To Do', color: 'bg-slate-500', order: 0 },
  { id: 'in-progress', name: 'In Progress', color: 'bg-primary', order: 1 },
  { id: 'review', name: 'Review', color: 'bg-yellow-500', order: 2 },
  { id: 'done', name: 'Done', color: 'bg-green-500', order: 3 },
];

export const useStatusStore = create<StatusState>()(
  persist(
    (set) => ({
      statuses: defaultStatuses,
      
      addStatus: (status) =>
        set((state) => ({
          statuses: [
            ...state.statuses,
            { ...status, id: crypto.randomUUID() },
          ],
        })),
      
      updateStatus: (id, updates) =>
        set((state) => ({
          statuses: state.statuses.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),
      
      deleteStatus: (id) =>
        set((state) => ({
          statuses: state.statuses.filter((s) => s.id !== id),
        })),
      
      reorderStatuses: (startIndex, endIndex) =>
        set((state) => {
          const newStatuses = [...state.statuses];
          const [removed] = newStatuses.splice(startIndex, 1);
          newStatuses.splice(endIndex, 0, removed);
          
          return {
            statuses: newStatuses.map((status, index) => ({
              ...status,
              order: index,
            })),
          };
        }),
    }),
    {
      name: 'status-storage',
    }
  )
);