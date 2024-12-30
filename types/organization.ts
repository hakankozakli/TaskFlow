export interface Organization {
  id: string;
  name: string;
  slug: string;
  industry?: string;
  size?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  organization_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
}

export interface CreateOrganizationData {
  name: string;
  industry?: string;
  size?: string;
}