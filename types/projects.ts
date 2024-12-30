export type ViewType = 'kanban' | 'list' | 'timeline' | 'table';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignee?: string;
  teamId?: string;
  startDate?: string;
  dueDate?: string;
  priority?: 'Low' | 'Medium' | 'High';
  status?: string;
  subtasks?: Task[];
  parentId?: string;
  progress?: number;
  tags?: Tag[];
  attachments?: FileAttachment[];
  createdAt?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  visibility: 'public' | 'private';
  members: number;
  dueDate?: string;
  tasks: number;
  completedTasks: number;
}

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: Task[];
}