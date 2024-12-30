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

-- Create epics table
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

-- Create time_entries table
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

-- Create time_estimates table
CREATE TABLE IF NOT EXISTS time_estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  estimated_hours numeric(10,2) NOT NULL,
  notes text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add epic_id to tasks
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS epic_id uuid REFERENCES epics(id),
ADD COLUMN IF NOT EXISTS original_estimate numeric(10,2),
ADD COLUMN IF NOT EXISTS remaining_estimate numeric(10,2),
ADD COLUMN IF NOT EXISTS time_spent numeric(10,2) DEFAULT 0;

-- Enable RLS
ALTER TABLE epics ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_estimates ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for epics
CREATE POLICY "Users can access organization epics" ON epics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN user_organizations uo ON uo.organization_id = p.organization_id
      WHERE p.id = epics.project_id
      AND uo.user_id = auth.uid()
    )
  );

-- Create RLS Policies for time entries
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

-- Create RLS Policies for time estimates
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

-- Create functions for time tracking
CREATE OR REPLACE FUNCTION start_time_entry(
  p_task_id UUID,
  p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
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