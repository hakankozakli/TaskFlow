export interface AICrew {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  status: 'active' | 'inactive';
  tasksCompleted: number;
  successRate: number;
}