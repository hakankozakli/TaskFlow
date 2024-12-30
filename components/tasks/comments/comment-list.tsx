'use client';

import { useCommentsStore } from '@/lib/stores/use-comments-store';
import { CommentItem } from './comment-item';

interface CommentListProps {
  taskId: string;
}

export function CommentList({ taskId }: CommentListProps) {
  const comments = useCommentsStore((state) => state.getTaskComments(taskId));

  if (comments.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-8">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}