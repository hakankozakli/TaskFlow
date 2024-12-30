import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { tasks } from './tasks';

export const labels = pgTable('labels', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const taskLabels = pgTable('task_labels', {
  taskId: uuid('task_id').references(() => tasks.id).notNull(),
  labelId: uuid('label_id').references(() => labels.id).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export type Label = typeof labels.$inferSelect;
export type NewLabel = typeof labels.$inferInsert;