'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AICrew } from '@/types/ai-crew';

interface AICrewState {
  crews: AICrew[];
  addCrew: (crew: Omit<AICrew, 'id' | 'status' | 'tasksCompleted' | 'successRate'>) => void;
  updateCrew: (id: string, updates: Partial<AICrew>) => void;
  deleteCrew: (id: string) => void;
  toggleStatus: (id: string) => void;
}

export const useAICrewStore = create<AICrewState>()(
  persist(
    (set) => ({
      crews: [],
      addCrew: (crew) =>
        set((state) => ({
          crews: [
            ...state.crews,
            {
              ...crew,
              id: crypto.randomUUID(),
              status: 'inactive',
              tasksCompleted: 0,
              successRate: 0,
            },
          ],
        })),
      updateCrew: (id, updates) =>
        set((state) => ({
          crews: state.crews.map((crew) =>
            crew.id === id ? { ...crew, ...updates } : crew
          ),
        })),
      deleteCrew: (id) =>
        set((state) => ({
          crews: state.crews.filter((crew) => crew.id !== id),
        })),
      toggleStatus: (id) =>
        set((state) => ({
          crews: state.crews.map((crew) =>
            crew.id === id
              ? { ...crew, status: crew.status === 'active' ? 'inactive' : 'active' }
              : crew
          ),
        })),
    }),
    {
      name: 'ai-crews-storage',
    }
  )
);