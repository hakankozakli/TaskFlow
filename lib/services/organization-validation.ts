'use client';

import { z } from 'zod';
import { ORGANIZATION_SIZES, INDUSTRIES } from '@/lib/constants/onboarding';

export const organizationSchema = z.object({
  name: z.string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name cannot exceed 100 characters')
    .trim()
    .refine(val => /^[a-zA-Z0-9\s\-_]+$/.test(val), {
      message: 'Organization name can only contain letters, numbers, spaces, hyphens, and underscores'
    }),
  industry: z.enum(INDUSTRIES as [string, ...string[]]).optional(),
  size: z.enum(ORGANIZATION_SIZES as [string, ...string[]]).optional(),
});

export type ValidatedOrganizationData = z.infer<typeof organizationSchema>;

export function validateOrganizationData(data: unknown): ValidatedOrganizationData {
  return organizationSchema.parse(data);
}