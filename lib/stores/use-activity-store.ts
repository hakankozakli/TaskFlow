'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Activity } from '@/types/activity';

interface ActivityState {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  getTaskActivities: (taskId: string) => Activity[];
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: [],
      
      addActivity: (activity) => {
        const newActivity: Activity = {
          ...activity,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };
        
        set((state) => ({
          activities: [newActivity, ...state.activities],
        }));
      },
      
      getTaskActivities: (taskId) =>
        get().activities
          .filter((activity) => activity.taskId === taskId)
          .sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ),
    }),
    {
      name: 'activity-storage',
    }
  )
);