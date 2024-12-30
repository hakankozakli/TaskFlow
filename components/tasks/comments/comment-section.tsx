'use client';

import { CommentList } from './comment-list';
import { CommentForm } from './comment-form';
import { Separator } from '@/components/ui/separator';

interface CommentSectionProps {
  taskId: string;
}

export function CommentSection({ taskId }: CommentSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Comments</h3>
        <p className="text-sm text-muted-foreground">
          Discuss this task with your team
        </p>
      </div>
      <CommentForm taskId={taskId} />
      <Separator />
      <CommentList taskId={taskId} />
    </div>
  );
}