'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Comment } from '@/types/comments';

interface CommentsState {
  comments: Comment[];
  addComment: (taskId: string, data: { content: string; mentions: string[] }) => void;
  updateComment: (id: string, content: string) => void;
  deleteComment: (id: string) => void;
  getTaskComments: (taskId: string) => Comment[];
}

export const useCommentsStore = create<CommentsState>()(
  persist(
    (set, get) => ({
      comments: [],
      
      addComment: (taskId, data) => {
        const comment: Comment = {
          id: crypto.randomUUID(),
          taskId,
          userId: 'current-user', // In a real app, get from auth context
          content: data.content,
          mentions: data.mentions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          comments: [...state.comments, comment],
        }));
      },
      
      updateComment: (id, content) =>
        set((state) => ({
          comments: state.comments.map((comment) =>
            comment.id === id
              ? { ...comment, content, updatedAt: new Date().toISOString() }
              : comment
          ),
        })),
      
      deleteComment: (id) =>
        set((state) => ({
          comments: state.comments.filter((comment) => comment.id !== id),
        })),
      
      getTaskComments: (taskId) =>
        get().comments.filter((comment) => comment.taskId === taskId),
    }),
    {
      name: 'comments-storage',
    }
  )
);