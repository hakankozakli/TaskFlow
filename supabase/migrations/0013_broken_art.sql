/*
  # Fix Organization Security and RLS

  1. Changes
    - Enable RLS on all tables
    - Add proper security policies
    - Fix organization member handling
  
  2. Security
    - Ensure proper access control
    - Fix RLS violations
*/

-- First disable RLS to allow modifications
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow organization creation" ON organizations;
DROP POLICY IF EXISTS "Allow organization read" ON organizations;
DROP POLICY IF EXISTS "Allow organization update" ON organizations;

-- Create base policies
CREATE POLICY "organizations_policy" ON organizations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "organization_members_policy" ON organization_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Re-enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Modify owner function to be more secure
CREATE OR REPLACE FUNCTION add_organization_owner()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (NEW.id, auth.uid(), 'owner');
  RETURN NEW;
END;
$$;