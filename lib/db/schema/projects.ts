import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').notNull().default('active'),
  visibility: text('visibility').notNull().default('private'),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  startDate: timestamp('start_date'),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  archived: boolean('archived').default(false)
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;