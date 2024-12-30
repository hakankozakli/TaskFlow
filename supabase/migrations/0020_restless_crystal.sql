/*
  # Add Epics and Time Tracking Support

  1. New Tables
    - epics: For managing large initiatives/features
    - time_entries: For tracking time spent on tasks
    - time_estimates: For storing task time estimates

  2. Changes
    - Add epic_id to tasks table
    - Add time tracking fields to tasks

  3. Security
    - RLS policies for new tables
    - Organization-based access control
*/

-- Create epics table if it doesn't exist
CREATE TABLE IF NOT EXISTS epics (
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

-- Create time_entries table if it doesn't exist
CREATE TABLE IF NOT EXISTS time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  duration integer NOT NULL, -- Duration in minutes
  description text,
  started_at timestamptz NOT NULL,
  ended_at timestamptz,
  billable boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create time_estimates table if it doesn't exist
CREATE TABLE IF NOT EXISTS time_estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  estimated_hours numeric(10,2) NOT NULL,
  notes text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add epic_id and time tracking fields to tasks
DO $$ 
BEGIN
  -- Add epic_id if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'epic_id') THEN
    ALTER TABLE tasks ADD COLUMN epic_id uuid REFERENCES epics(id);
  END IF;

  -- Add time tracking columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'original_estimate') THEN
    ALTER TABLE tasks ADD COLUMN original_estimate numeric(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'remaining_estimate') THEN
    ALTER TABLE tasks ADD COLUMN remaining_estimate numeric(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'time_spent') THEN
    ALTER TABLE tasks ADD COLUMN time_spent numeric(10,2) DEFAULT 0;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE epics ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_estimates ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
DO $$ BEGIN
  -- Epics policies
  CREATE POLICY "Users can access organization epics" ON epics
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM projects p
        JOIN user_organizations uo ON uo.organization_id = p.organization_id
        WHERE p.id = epics.project_id
        AND uo.user_id = auth.uid()
      )
    );

  -- Time entries policies
  CREATE POLICY "Users can manage own time entries" ON time_entries
    FOR ALL USING (user_id = auth.uid());

  CREATE POLICY "Users can view team time entries" ON time_entries
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM tasks t
        JOIN projects p ON p.id = t.project_id
        JOIN user_organizations uo ON uo.organization_id = p.organization_id
        WHERE t.id = time_entries.task_id
        AND uo.user_id = auth.uid()
      )
    );

  -- Time estimates policies
  CREATE POLICY "Users can access organization time estimates" ON time_estimates
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM tasks t
        JOIN projects p ON p.id = t.project_id
        JOIN user_organizations uo ON uo.organization_id = p.organization_id
        WHERE t.id = time_estimates.task_id
        AND uo.user_id = auth.uid()
      )
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create functions for time tracking
CREATE OR REPLACE FUNCTION start_time_entry(
  p_task_id UUID,
  p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_entry_id UUID;
BEGIN
  -- Check if there's already an active time entry for this user
  IF EXISTS (
    SELECT 1 FROM time_entries 
    WHERE user_id = auth.uid()
    AND ended_at IS NULL
  ) THEN
    RAISE EXCEPTION 'There is already an active time entry';
  END IF;

  -- Create new time entry
  INSERT INTO time_entries (
    task_id,
    user_id,
    description,
    started_at,
    duration
  ) VALUES (
    p_task_id,
    auth.uid(),
    p_description,
    now(),
    0
  ) RETURNING id INTO v_entry_id;

  RETURN v_entry_id;
END;
$$;

CREATE OR REPLACE FUNCTION stop_time_entry(
  p_entry_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_duration INTEGER;
  v_entry RECORD;
BEGIN
  -- Update time entry
  UPDATE time_entries
  SET 
    ended_at = now(),
    duration = EXTRACT(EPOCH FROM (now() - started_at))/60,
    updated_at = now()
  WHERE id = p_entry_id
  AND user_id = auth.uid()
  AND ended_at IS NULL
  RETURNING * INTO v_entry;

  IF v_entry IS NULL THEN
    RAISE EXCEPTION 'Time entry not found or already stopped';
  END IF;

  -- Update task time spent
  UPDATE tasks
  SET 
    time_spent = COALESCE(time_spent, 0) + (v_entry.duration / 60),
    updated_at = now()
  WHERE id = v_entry.task_id;

  RETURN row_to_json(v_entry);
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION start_time_entry TO authenticated;
GRANT EXECUTE ON FUNCTION stop_time_entry TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_epics_project_id ON epics(project_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_estimates_task_id ON time_estimates(task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_epic_id ON tasks(epic_id);