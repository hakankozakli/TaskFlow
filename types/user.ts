export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar?: string;
  status: 'active' | 'inactive';
  teams: string[]; // Array of team IDs
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar?: string;
}

export interface UserOrganization {
  id: string
  user_id: string
  organization_id: string
  role: 'owner' | 'admin' | 'member'
  created_at: string
}