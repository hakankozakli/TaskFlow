'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserFormData } from '@/types/user';
import { useTeamStore } from './use-team-store';

interface UserState {
  users: User[];
  addUser: (data: UserFormData) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addUserToTeam: (userId: string, teamId: string) => void;
  removeUserFromTeam: (userId: string, teamId: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      
      addUser: (data) => {
        const user: User = {
          ...data,
          id: crypto.randomUUID(),
          status: 'active',
          teams: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          users: [...state.users, user],
        }));
        
        return user;
      },
      
      updateUser: (id, updates) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? { ...user, ...updates, updatedAt: new Date().toISOString() }
              : user
          ),
        })),
      
      deleteUser: (id) => {
        const user = get().users.find(u => u.id === id);
        if (user) {
          // Remove user from all teams
          user.teams.forEach(teamId => {
            useTeamStore.getState().removeMember(teamId, id);
          });
        }
        
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }));
      },
      
      addUserToTeam: (userId, teamId) => {
        const user = get().users.find(u => u.id === id);
        if (!user) return;
        
        // Add user to team in user store
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId
              ? { ...u, teams: [...u.teams, teamId] }
              : u
          ),
        }));
        
        // Add user as member in team store
        useTeamStore.getState().addMember(teamId, {
          id: userId,
          name: user.name,
          email: user.email,
          role: 'member',
          status: 'online',
          avatar: user.avatar,
        });
      },
      
      removeUserFromTeam: (userId, teamId) => {
        // Remove team from user's teams list
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId
              ? { ...u, teams: u.teams.filter(t => t !== teamId) }
              : u
          ),
        }));
        
        // Remove user from team members
        useTeamStore.getState().removeMember(teamId, userId);
      },
    }),
    {
      name: 'user-storage',
    }
  )
);