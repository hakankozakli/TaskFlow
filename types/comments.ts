export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  mentions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CommentFormData {
  content: string;
  mentions: string[];
}