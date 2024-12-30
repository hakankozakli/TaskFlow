'use client';

import { Badge } from '@/components/ui/badge';
import { useStatusStore } from '@/lib/stores/use-status-store';

interface StatusBadgeProps {
  statusId: string;
}

export function StatusBadge({ statusId }: StatusBadgeProps) {
  const status = useStatusStore(
    (state) => state.statuses.find((s) => s.id === statusId)
  );

  if (!status) return null;

  return (
    <Badge className={`${status.color} text-white`}>
      {status.name}
    </Badge>
  );
}