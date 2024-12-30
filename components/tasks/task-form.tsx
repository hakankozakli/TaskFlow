'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '@/lib/validations/task';
import { Button } from '@/components/ui/button';
import { Editor } from './editor';
import { DatePicker } from './date-picker';
import { TagPicker } from './tag-picker';
import { FileUpload } from './file-upload';
import { SubtaskList } from './subtask/subtask-list';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTasksStore } from '@/lib/stores/use-tasks-store';
import { Task } from '@/types/projects';
import { toast } from 'sonner';
import { useEffect } from 'react';

const teams = [
  { id: 'team1', name: 'Development Team' },
  { id: 'team2', name: 'Design Team' },
  { id: 'team3', name: 'Marketing Team' },
];

const users = [
  { id: 'user1', name: 'John Doe' },
  { id: 'user2', name: 'Jane Smith' },
  { id: 'user3', name: 'Mike Johnson' },
];

interface TaskFormProps {
  task?: Task;
  columnId?: string;
  projectId: string;
  onComplete: () => void;
  title: string;
  onTitleChange: (title: string) => void;
}

export function TaskForm({ 
  task, 
  columnId, 
  projectId,
  onComplete, 
  title, 
  onTitleChange 
}: TaskFormProps) {
  const { addTask, updateTask, tasks } = useTasksStore();
  const subtasks = tasks.filter(t => t.parentId === task?.id);
  
  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      ...task,
      title: title,
      tags: task?.tags || [],
      attachments: task?.attachments || [],
    } || {
      title: title,
      description: '',
      priority: 'Medium',
      startDate: '',
      dueDate: '',
      tags: [],
      attachments: [],
    },
  });

  useEffect(() => {
    form.setValue('title', title);
  }, [title, form]);

  const onSubmit = (data: Task) => {
    const taskData = { 
      ...data, 
      title,
      projectId,
      status: columnId || 'todo'
    };

    if (task) {
      updateTask(task.id, taskData);
      toast.success('Task updated successfully');
    } else {
      addTask(taskData);
      toast.success('Task created successfully');
    }
    onComplete();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="assignee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignee</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagPicker
                    tags={field.value || []}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {task && <SubtaskList taskId={task.id} subtasks={subtasks} />}
          
          <FormField
            control={form.control}
            name="attachments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attachments</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit">
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Form>
  );
}