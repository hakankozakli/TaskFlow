'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useProjectsStore } from '@/lib/stores/use-projects-store';
import { useTasksStore } from '@/lib/stores/use-tasks-store';

export function Search() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const projects = useProjectsStore((state) => state.projects);
  const tasks = useTasksStore((state) => state.tasks);

  const handleSelect = useCallback((value: string) => {
    setOpen(false);

    if (value.startsWith('project-')) {
      router.push(`/projects/${value.replace('project-', '')}`);
    } else if (value.startsWith('task-')) {
      const task = tasks.find(t => t.id === value.replace('task-', ''));
      if (task?.projectId) {
        router.push(`/projects/${task.projectId}`);
      }
    }
  }, [router, tasks]);

  return (
    <>
      <div className="relative w-96">
        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects and tasks..."
          className="pl-8"
          onClick={() => setOpen(true)}
          readOnly
        />
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search projects and tasks..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Projects">
            {projects.map((project) => (
              <CommandItem
                key={project.id}
                value={`project-${project.id}`}
                onSelect={handleSelect}
              >
                {project.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Tasks">
            {tasks.map((task) => (
              <CommandItem
                key={task.id}
                value={`task-${task.id}`}
                onSelect={handleSelect}
              >
                {task.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}