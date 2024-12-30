'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Bell, Plus } from 'lucide-react';
import { Search } from './search';
import { useState } from 'react';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { useProjectsStore } from '@/lib/stores/use-projects-store';
import { LanguageSelector } from '@/components/language/language-selector';

export function MainHeader() {
  const [showNewTask, setShowNewTask] = useState(false);
  const projects = useProjectsStore((state) => state.projects);

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex-1 flex gap-4 items-center">
          <Search />
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowNewTask(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
          <ModeToggle />
        </div>
      </div>

      <TaskDialog
        open={showNewTask}
        onOpenChange={setShowNewTask}
        projectId={projects[0]?.id}
      />
    </header>
  );
}