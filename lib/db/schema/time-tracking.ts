import { pgTable, uuid, text, timestamp, integer, numeric, boolean } from 'drizzle-orm/pg-core';
import { tasks } from './tasks';
import { users } from './users';

export const timeEntries = pgTable('time_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').references(() => tasks.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  duration: integer('duration').notNull(), // Duration in minutes
  description: text('description'),
  startedAt: timestamp('started_at').notNull(),
  endedAt: timestamp('ended_at'),
  billable: boolean('billable').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const timeEstimates = pgTable('time_estimates', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').references(() => tasks.id).notNull(),
  estimatedHours: numeric('estimated_hours', { precision: 10, scale: 2 }).notNull(),
  notes: text('notes'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Add time tracking fields to tasks schema
export const taskTimeTracking = {
  epicId: uuid('epic_id').references(() => epics.id),
  originalEstimate: numeric('original_estimate', { precision: 10, scale: 2 }),
  remainingEstimate: numeric('remaining_estimate', { precision: 10, scale: 2 }),
  timeSpent: numeric('time_spent', { precision: 10, scale: 2 }).default('0')
};

export type TimeEntry = typeof timeEntries.$inferSelect;
export type NewTimeEntry = typeof timeEntries.$inferInsert;
export type TimeEstimate = typeof timeEstimates.$inferSelect;
export type NewTimeEstimate = typeof timeEstimates.$inferInsert;