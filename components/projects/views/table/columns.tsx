'use client';

import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/projects';

export const columns = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }: { row: any }) => (
      <div className="font-medium">{row.getValue('name')}</div>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }: { row: any }) => (
      <Badge variant="outline">{row.getValue('status')}</Badge>
    ),
  },
  {
    header: 'Priority',
    accessorKey: 'priority',
    cell: ({ row }: { row: any }) => (
      <Badge variant="secondary">{row.getValue('priority')}</Badge>
    ),
  },
  {
    header: 'Due Date',
    accessorKey: 'dueDate',
  },
  {
    header: 'Assignee',
    accessorKey: 'assignee',
  },
] as const;