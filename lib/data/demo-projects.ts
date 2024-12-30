import { Project } from '@/types/projects';

export const demoProjects: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design and improved UX',
    status: 'In Progress',
    visibility: 'public',
    members: 5,
    dueDate: '2024-06-30',
    tasks: 4,
    completedTasks: 1,
  },
  {
    id: 'p2',
    name: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android platforms',
    status: 'Planning',
    visibility: 'private',
    members: 4,
    dueDate: '2024-08-15',
    tasks: 3,
    completedTasks: 0,
  },
  {
    id: 'p3',
    name: 'Marketing Campaign',
    description: 'Q2 digital marketing campaign for product launch',
    status: 'Active',
    visibility: 'public',
    members: 3,
    dueDate: '2024-05-30',
    tasks: 3,
    completedTasks: 1,
  },
];