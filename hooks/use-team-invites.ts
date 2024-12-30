'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TeamInvite {
  id: string;
  teamId: string;
  email: string;
  status: 'pending' | 'accepted' | 'cancelled';
  createdAt: string;
}

interface TeamInvitesState {
  invites: TeamInvite[];
  sendInvite: (teamId: string, email: string) => Promise<void>;
  cancelInvite: (inviteId: string) => void;
  acceptInvite: (inviteId: string) => void;
}

const useTeamInvitesStore = create<TeamInvitesState>()(
  persist(
    (set) => ({
      invites: [],
      sendInvite: async (teamId, email) => {
        const invite: TeamInvite = {
          id: crypto.randomUUID(),
          teamId,
          email,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          invites: [...state.invites, invite],
        }));
      },
      cancelInvite: (inviteId) =>
        set((state) => ({
          invites: state.invites.filter((invite) => invite.id !== inviteId),
        })),
      acceptInvite: (inviteId) =>
        set((state) => ({
          invites: state.invites.map((invite) =>
            invite.id === inviteId
              ? { ...invite, status: 'accepted' }
              : invite
          ),
        })),
    }),
    {
      name: 'team-invites-storage',
    }
  )
);

export function useTeamInvites() {
  const store = useTeamInvitesStore();
  return store;
}