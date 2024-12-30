export interface Activity {
  id: string;
  taskId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  action: string;
  details?: string;
  timestamp: string;
}