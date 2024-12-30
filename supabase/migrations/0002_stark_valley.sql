/*
  # Create project management schema and seed demo data

  1. New Tables
    - projects
      - id (text, primary key)
      - name (text)
      - description (text)
      - status (text)
      - visibility (text)
      - user_id (uuid, foreign key)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - tasks
      - id (text, primary key)
      - title (text)
      - description (text)
      - status (text)
      - priority (text)
      - project_id (text, foreign key)
      - user_id (uuid, foreign key)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - tags
      - id (text, primary key)
      - name (text)
      - color (text)
      - created_at (timestamptz)
    
    - tasks_tags
      - task_id (text, foreign key)
      - tag_id (text, foreign key)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
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

-- Insert demo user
INSERT INTO auth.users (id, email)
VALUES ('d0d54aa8-6c4c-4cf3-9259-cc880b6c3bc5', 'demo@taskflow.com')
ON CONFLICT (id) DO NOTHING;

-- Insert user profile
INSERT INTO public.users (id, email, name, created_at, updated_at)
VALUES (
  'd0d54aa8-6c4c-4cf3-9259-cc880b6c3bc5',
  'demo@taskflow.com',
  'Demo User',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Insert demo projects
INSERT INTO projects (id, name, description, status, visibility, user_id)
VALUES
  ('p1', 'Website Redesign', 'Complete overhaul of the company website', 'in_progress', 'public', 'd0d54aa8-6c4c-4cf3-9259-cc880b6c3bc5'),
  ('p2', 'Mobile App', 'Native mobile application development', 'planning', 'private', 'd0d54aa8-6c4c-4cf3-9259-cc880b6c3bc5')
ON CONFLICT (id) DO NOTHING;

-- Insert demo tasks
INSERT INTO tasks (id, title, description, status, priority, project_id, user_id)
VALUES
  ('t1', 'Design System', 'Create a comprehensive design system', 'todo', 'high', 'p1', 'd0d54aa8-6c4c-4cf3-9259-cc880b6c3bc5'),
  ('t2', 'User Research', 'Conduct user interviews', 'in_progress', 'medium', 'p1', 'd0d54aa8-6c4c-4cf3-9259-cc880b6c3bc5'),
  ('t3', 'API Design', 'Design RESTful API endpoints', 'todo', 'high', 'p2', 'd0d54aa8-6c4c-4cf3-9259-cc880b6c3bc5')
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