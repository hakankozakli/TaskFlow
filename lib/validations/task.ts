import * as z from 'zod';

const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().default(''),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  assignee: z.string().optional(),
  subtasks: z.array(z.lazy(() => taskSchema)).optional(),
  parentId: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  tags: z.array(tagSchema).optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;