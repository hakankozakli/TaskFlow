'use client';

import { Button } from '@/components/ui/button';
import { ViewType } from '@/types/projects';
import { Kanban, Table2, List, SquareGantt } from 'lucide-react';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  const views = [
    { type: 'kanban' as const, label: 'Kanban', Icon: Kanban },
    { type: 'list' as const, label: 'List', Icon: List },
    { type: 'timeline' as const, label: 'Timeline', Icon: SquareGantt },
    { type: 'table' as const, label: 'Table', Icon: Table2 },
  ];

  return (
    <div className="flex gap-2">
      {views.map(({ type, label, Icon }) => (
        <Button
          key={type}
          variant={currentView === type ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewChange(type)}
          className="gap-2"
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}