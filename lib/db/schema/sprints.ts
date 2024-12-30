import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { projects } from './projects';

export const sprints = pgTable('sprints', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').notNull().default('planned'),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export type Sprint = typeof sprints.$inferSelect;
export type NewSprint = typeof sprints.$inferInsert;