'use client';

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Task } from '@/types/projects';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { CommentSection } from './comments/comment-section';
import { ActivitySection } from './activity/activity-section';
import { Editor } from './editor';
import { useTasksStore } from '@/lib/stores/use-tasks-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskForm } from './task-form';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  columnId?: string;
  projectId: string;
}

export function TaskDialog({ 
  open, 
  onOpenChange, 
  task, 
  columnId,
  projectId 
}: TaskDialogProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const { updateTask } = useTasksStore();

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (task) {
      updateTask(task.id, { description: value });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-screen p-0 m-0">
        <div className="h-full flex flex-col">
          <DialogHeader className="flex-shrink-0 p-6 border-b">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-0 p-0 text-xl font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  placeholder="Task title"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-4 w-4" />
                  <VisuallyHidden>Close</VisuallyHidden>
                </Button>
              </div>
              <Editor 
                value={description}
                onChange={handleDescriptionChange}
              />
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                  <Tabs defaultValue="comments" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="comments">Comments</TabsTrigger>
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>
                    <TabsContent value="comments">
                      <CommentSection taskId={task?.id || ''} />
                    </TabsContent>
                    <TabsContent value="activity">
                      <ActivitySection taskId={task?.id || ''} />
                    </TabsContent>
                  </Tabs>
                </div>
                <div>
                  <TaskForm
                    task={task}
                    columnId={columnId}
                    projectId={projectId}
                    onComplete={() => onOpenChange(false)}
                    title={title}
                    onTitleChange={setTitle}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}