/*
  # Create Schema and Seed Data

  1. Schema Changes
    - Create projects table
    - Create tasks table
    - Create tags table
    - Create tasks_tags junction table
    - Enable RLS on all tables
    - Create security policies

  2. Seed Data
    - Insert demo user
    - Insert demo projects
    - Insert demo tasks
    - Insert demo tags
    - Create task-tag associations
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  status text NOT NULL,
  visibility text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  status text NOT NULL,
  priority text NOT NULL,
  project_id text REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id text PRIMARY KEY,
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tasks_tags junction table
CREATE TABLE IF NOT EXISTS tasks_tags (
  task_id text REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id text REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (task_id, tag_id)
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ BEGIN
  -- Projects policies
  CREATE POLICY "Users can read own projects"
    ON projects FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert own projects"
    ON projects FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update own projects"
    ON projects FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

  -- Tasks policies
  CREATE POLICY "Users can read own tasks"
    ON tasks FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert own tasks"
    ON tasks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update own tasks"
    ON tasks FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Insert demo data
DO $$ 
DECLARE
  demo_user_id uuid := 'd0d54aa8-6c4c-4cf3-9259-cc880b6c3bc5';
BEGIN
  -- Insert demo user if not exists
  INSERT INTO auth.users (id, email)
  VALUES (demo_user_id, 'demo@taskflow.com')
  ON CONFLICT (id) DO NOTHING;

  -- Insert user profile
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (
    demo_user_id,
    'demo@taskflow.com',
    'Demo User',
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert demo projects
  INSERT INTO projects (id, name, description, status, visibility, user_id)
  VALUES
    ('p1', 'Website Redesign', 'Complete overhaul of the company website', 'in_progress', 'public', demo_user_id),
    ('p2', 'Mobile App', 'Native mobile application development', 'planning', 'private', demo_user_id)
  ON CONFLICT (id) DO NOTHING;

  -- Insert demo tasks
  INSERT INTO tasks (id, title, description, status, priority, project_id, user_id)
  VALUES
    ('t1', 'Design System', 'Create a comprehensive design system', 'todo', 'high', 'p1', demo_user_id),
    ('t2', 'User Research', 'Conduct user interviews', 'in_progress', 'medium', 'p1', demo_user_id),
    ('t3', 'API Design', 'Design RESTful API endpoints', 'todo', 'high', 'p2', demo_user_id)
  ON CONFLICT (id) DO NOTHING;

  -- Insert demo tags
  INSERT INTO tags (id, name, color)
  VALUES
    ('tag1', 'Frontend', 'bg-blue-500'),
    ('tag2', 'Backend', 'bg-green-500'),
    ('tag3', 'Design', 'bg-purple-500')
  ON CONFLICT (id) DO NOTHING;

  -- Associate tags with tasks
  INSERT INTO tasks_tags (task_id, tag_id)
  VALUES
    ('t1', 'tag1'),
    ('t1', 'tag3'),
    ('t2', 'tag3'),
    ('t3', 'tag2')
  ON CONFLICT (task_id, tag_id) DO NOTHING;
END $$;