'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskDialog } from '@/components/tasks/task-dialog';

interface AddTaskButtonProps {
  columnId: string;
  projectId: string;
}

export function AddTaskButton({ columnId, projectId }: AddTaskButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        className="w-full justify-start text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
      <TaskDialog
        open={open}
        onOpenChange={setOpen}
        columnId={columnId}
        projectId={projectId}
      />
    </>
  );
}