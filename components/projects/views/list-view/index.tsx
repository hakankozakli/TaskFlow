'use client';

import { Task } from '@/types/projects';
import { TaskItem } from './task-item';
import { useProjectStore } from '@/lib/stores/use-project-store';

export function ListView() {
  const { columns } = useProjectStore();
  const tasks = columns.flatMap(column => column.tasks);

  const renderTask = (task: Task, level = 0) => {
    return (
      <div key={task.id}>
        <TaskItem task={task} level={level} />
        {task.subtasks?.map(subtask => renderTask(subtask, level + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-2 p-4">
      {tasks.filter(task => !task.parentId).map(task => renderTask(task))}
    </div>
  );
}