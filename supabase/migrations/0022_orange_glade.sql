/*
  # Complete Database Reset and Recreation

  1. Drop all existing tables and functions
  2. Recreate core tables
    - Users and authentication
    - Organizations and teams
    - Projects and tasks
    - Time tracking and epics
    - Subscription and billing
  3. Set up security
    - RLS policies
    - Security functions
    - Audit logging
*/

-- Disable row level security temporarily for cleanup
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  -- Drop all RLS policies
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY;';
  END LOOP;
END $$;

-- Drop all existing tables
DROP TABLE IF EXISTS 
  admin_settings,
  audit_logs,
  organization_features,
  feature_flags,
  invoices,
  billing_details,
  subscriptions,
  subscription_plans,
  time_estimates,
  time_entries,
  task_labels,
  labels,
  comments,
  tasks,
  epics,
  sprints,
  projects,
  team_members,
  teams,
  user_organizations,
  organizations,
  users,
  sessions CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS 
  create_organization,
  handle_subscription_change,
  start_time_entry,
  stop_time_entry CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create core tables
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  avatar text,
  status text DEFAULT 'active',
  is_admin boolean DEFAULT false,
  last_active_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  industry text,
  size text,
  logo text,
  max_users integer,
  max_projects integer,
  max_storage_gb integer,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE user_organizations (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  is_primary boolean DEFAULT false,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, organization_id)
);

CREATE TABLE teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE team_members (
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active',
  visibility text NOT NULL DEFAULT 'private',
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  start_date timestamptz,
  due_date timestamptz,
  archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE epics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'in_progress',
  priority text NOT NULL DEFAULT 'medium',
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES users(id),
  start_date timestamptz,
  due_date timestamptz,
  progress integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo',
  priority text NOT NULL DEFAULT 'medium',
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  epic_id uuid REFERENCES epics(id),
  assignee_id uuid REFERENCES users(id),
  parent_id uuid REFERENCES tasks(id),
  "order" integer NOT NULL DEFAULT 0,
  start_date timestamptz,
  due_date timestamptz,
  original_estimate numeric(10,2),
  remaining_estimate numeric(10,2),
  time_spent numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  mentions jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE labels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE task_labels (
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  label_id uuid REFERENCES labels(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (task_id, label_id)
);

CREATE TABLE time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  duration integer NOT NULL,
  description text,
  started_at timestamptz NOT NULL,
  ended_at timestamptz,
  billable boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE time_estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  estimated_hours numeric(10,2) NOT NULL,
  notes text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscription and billing tables
CREATE TABLE subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  interval text NOT NULL DEFAULT 'month',
  stripe_price_id text UNIQUE,
  features jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES subscription_plans(id),
  status text NOT NULL DEFAULT 'inactive',
  stripe_subscription_id text UNIQUE,
  stripe_customer_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  canceled_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE billing_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  company_name text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text,
  vat_number text,
  billing_email text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id),
  stripe_invoice_id text UNIQUE,
  amount numeric(10,2) NOT NULL,
  status text NOT NULL,
  paid_at timestamptz,
  invoice_pdf_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create feature management tables
CREATE TABLE feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  enabled boolean DEFAULT false,
  rules jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE organization_features (
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  feature_id uuid REFERENCES feature_flags(id) ON DELETE CASCADE,
  enabled boolean DEFAULT false,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (organization_id, feature_id)
);

-- Create audit and admin tables
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  changes jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';
  END LOOP;
END $$;

-- Create RLS Policies
DO $$ BEGIN
  -- Users policies
  CREATE POLICY "Users can read own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

  -- Organizations policies
  CREATE POLICY "Users can read organizations they belong to"
    ON organizations FOR SELECT
    USING (EXISTS (
      SELECT 1 FROM user_organizations
      WHERE organization_id = id AND user_id = auth.uid()
    ));

  -- Projects policies
  CREATE POLICY "Users can access organization projects"
    ON projects FOR ALL
    USING (EXISTS (
      SELECT 1 FROM user_organizations
      WHERE organization_id = projects.organization_id
      AND user_id = auth.uid()
    ));

  -- Tasks policies
  CREATE POLICY "Users can access organization tasks"
    ON tasks FOR ALL
    USING (EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = tasks.project_id AND uo.user_id = auth.uid()
    ));

  -- Time entries policies
  CREATE POLICY "Users can manage own time entries"
    ON time_entries FOR ALL
    USING (user_id = auth.uid());

  -- Subscription policies
  CREATE POLICY "Organizations can view own subscriptions"
    ON subscriptions FOR SELECT
    USING (EXISTS (
      SELECT 1 FROM user_organizations
      WHERE organization_id = subscriptions.organization_id
      AND user_id = auth.uid()
    ));

EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create helper functions
CREATE OR REPLACE FUNCTION create_organization(
  p_name TEXT,
  p_industry TEXT,
  p_size TEXT,
  p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id UUID;
  v_org_record RECORD;
BEGIN
  -- Input validation
  IF p_name IS NULL OR LENGTH(TRIM(p_name)) = 0 THEN
    RAISE EXCEPTION 'Organization name is required';
  END IF;

  -- Generate slug
  v_org_record.slug := LOWER(REGEXP_REPLACE(TRIM(p_name), '[^a-zA-Z0-9]+', '-', 'g'));
  
  -- Create organization
  INSERT INTO organizations (
    name,
    slug,
    industry,
    size,
    created_by
  ) VALUES (
    TRIM(p_name),
    v_org_record.slug,
    p_industry,
    p_size,
    p_user_id
  )
  RETURNING id INTO v_org_id;

  -- Create organization membership
  INSERT INTO user_organizations (
    user_id,
    organization_id,
    is_primary,
    role
  ) VALUES (
    p_user_id,
    v_org_id,
    true,
    'owner'
  );

  -- Return created organization
  SELECT INTO v_org_record *
  FROM organizations
  WHERE id = v_org_id;

  RETURN row_to_json(v_org_record);

EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Failed to create organization: %', SQLERRM;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_orgs_user_id ON user_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_orgs_org_id ON user_organizations(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_org_id ON projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_epic_id ON tasks(epic_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION create_organization TO authenticated;