import {
  LayoutDashboard,
  KanbanSquare,
  Settings,
  Users,
} from 'lucide-react';

export const mainRoutes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Projects',
    icon: KanbanSquare,
    href: '/projects',
  },
  {
    label: 'Team',
    icon: Users,
    href: '/team',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];