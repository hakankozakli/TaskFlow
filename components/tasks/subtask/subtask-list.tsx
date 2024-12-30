'use client';

import { Task } from '@/types/projects';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SubtaskItem } from './subtask-item';
import { useState } from 'react';
import { useTasksStore } from '@/lib/stores/use-tasks-store';

interface SubtaskListProps {
  taskId: string;
  subtasks: Task[];
}

export function SubtaskList({ taskId, subtasks }: SubtaskListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addTask } = useTasksStore();

  const handleAddSubtask = () => {
    const newSubtask: Partial<Task> = {
      title: 'New Subtask',
      parentId: taskId,
      projectId: subtasks[0]?.projectId || '',
      status: 'todo',
    };
    addTask(newSubtask);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Subtasks</h3>
        <Button variant="ghost" size="sm" onClick={handleAddSubtask}>
          <Plus className="h-4 w-4 mr-2" />
          Add Subtask
        </Button>
      </div>
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <SubtaskItem key={subtask.id} task={subtask} />
        ))}
      </div>
    </div>
  );
}