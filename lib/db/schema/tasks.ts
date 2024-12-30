import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { projects } from './projects';
import { sprints } from './sprints';
import { users } from './users';

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull().default('todo'),
  priority: text('priority').notNull().default('medium'),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  sprintId: uuid('sprint_id').references(() => sprints.id),
  assigneeId: uuid('assignee_id').references(() => users.id),
  parentId: uuid('parent_id').references(() => tasks.id),
  order: integer('order').notNull().default(0),
  startDate: timestamp('start_date'),
  dueDate: timestamp('due_date'),
  estimatedHours: integer('estimated_hours'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;