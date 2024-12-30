'use client';

import { Task } from '@/types/projects';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useTasksStore } from '@/lib/stores/use-tasks-store';

interface SubtaskItemProps {
  task: Task;
}

export function SubtaskItem({ task }: SubtaskItemProps) {
  const [title, setTitle] = useState(task.title);
  const { updateTask, deleteTask } = useTasksStore();

  const handleCheck = (checked: boolean) => {
    updateTask(task.id, { status: checked ? 'done' : 'todo' });
  };

  const handleTitleChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.trim();
    if (newTitle && newTitle !== task.title) {
      updateTask(task.id, { title: newTitle });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={task.status === 'done'}
        onCheckedChange={handleCheck}
      />
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleChange}
        className="h-8"
      />
    </div>
  );
}