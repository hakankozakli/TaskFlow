'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStatusStore } from '@/lib/stores/use-status-store';
import { useMemo } from 'react';

interface StatusSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function StatusSelect({ value, onValueChange }: StatusSelectProps) {
  const statuses = useStatusStore((state) => state.statuses);
  
  const sortedStatuses = useMemo(() => {
    return [...statuses].sort((a, b) => a.order - b.order);
  }, [statuses]);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="min-w-[150px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {sortedStatuses.map((status) => (
          <SelectItem key={status.id} value={status.id}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status.color}`} />
              {status.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}