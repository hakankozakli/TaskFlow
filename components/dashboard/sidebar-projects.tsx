'use client';

import { Button } from '@/components/ui/button';
import { Lock, Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProjectsStore } from '@/lib/stores/use-projects-store';
import { cn } from '@/lib/utils';

export function SidebarProjects() {
  const pathname = usePathname();
  const projects = useProjectsStore((state) => state.projects);
  
  return (
    <div className="space-y-1">
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`}>
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start text-sm font-normal',
              pathname === `/projects/${project.id}` && 'bg-primary/10'
            )}
          >
            <span className="truncate flex-1 text-left">{project.name}</span>
            {project.visibility === 'private' ? (
              <Lock className="h-3 w-3 ml-2 text-muted-foreground" />
            ) : (
              <Globe className="h-3 w-3 ml-2 text-muted-foreground" />
            )}
          </Button>
        </Link>
      ))}
    </div>
  );
}