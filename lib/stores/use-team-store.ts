'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Team, TeamMember } from '@/types/team';

interface TeamState {
  teams: Team[];
  addTeam: (team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  addMember: (teamId: string, member: Omit<TeamMember, 'id'>) => void;
  removeMember: (teamId: string, memberId: string) => void;
  updateMember: (teamId: string, memberId: string, updates: Partial<TeamMember>) => void;
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      teams: [],
      
      addTeam: (team) =>
        set((state) => ({
          teams: [
            ...state.teams,
            {
              ...team,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      
      updateTeam: (id, updates) =>
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === id
              ? { ...team, ...updates, updatedAt: new Date().toISOString() }
              : team
          ),
        })),
      
      deleteTeam: (id) =>
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== id),
        })),
      
      addMember: (teamId, member) =>
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId
              ? {
                  ...team,
                  members: [
                    ...team.members,
                    { ...member, id: crypto.randomUUID() },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : team
          ),
        })),
      
      removeMember: (teamId, memberId) =>
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId
              ? {
                  ...team,
                  members: team.members.filter((m) => m.id !== memberId),
                  updatedAt: new Date().toISOString(),
                }
              : team
          ),
        })),
      
      updateMember: (teamId, memberId, updates) =>
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId
              ? {
                  ...team,
                  members: team.members.map((member) =>
                    member.id === memberId
                      ? { ...member, ...updates }
                      : member
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : team
          ),
        })),
    }),
    {
      name: 'team-storage',
    }
  )
);