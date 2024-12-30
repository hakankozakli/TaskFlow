import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { projects } from './projects';
import { users } from './users';

export const epics = pgTable('epics', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull().default('in_progress'),
  priority: text('priority').notNull().default('medium'),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  ownerId: uuid('owner_id').references(() => users.id),
  startDate: timestamp('start_date'),
  dueDate: timestamp('due_date'),
  progress: integer('progress').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export type Epic = typeof epics.$inferSelect;
export type NewEpic = typeof epics.$inferInsert;