'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProject } from '@/components/providers/project-provider';
import { SidebarProjects } from './sidebar-projects';
import { mainRoutes } from '@/lib/config/routes';
import { useSidebarStore } from '@/lib/stores/use-sidebar-store';

export function DashboardNav() {
  const pathname = usePathname();
  const { openNewProject } = useProject();
  const { isCollapsed, toggle } = useSidebarStore();

  return (
    <div className={cn(
      "relative h-screen bg-gray-50 dark:bg-gray-900 border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-6 flex justify-between items-center">
        <h2 className={cn(
          "text-lg font-semibold transition-opacity",
          isCollapsed && "opacity-0"
        )}>
          TaskFlow
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-[-12px] top-6 h-6 w-6 rounded-full border bg-background"
          onClick={toggle}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)] px-4">
        <div className="space-y-4">
          <div className="space-y-1">
            {mainRoutes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={pathname === route.href ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-2',
                    pathname === route.href && 'bg-primary/10',
                    isCollapsed && 'justify-center px-2'
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {!isCollapsed && <span>{route.label}</span>}
                </Button>
              </Link>
            ))}
          </div>

          {!isCollapsed && <Separator />}

          {!isCollapsed && (
            <div>
              <div className="flex items-center justify-between py-2">
                <h3 className="text-sm font-medium">Projects</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={openNewProject}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <SidebarProjects />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}