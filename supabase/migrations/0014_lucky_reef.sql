/*
  # Fix Organizations Schema and Policies

  1. Schema Changes
    - Add created_by column to organizations table
    - Update organizations table constraints
  
  2. Security
    - Reset and recreate RLS policies
    - Add secure trigger for owner assignment
*/

-- First add the created_by column if it doesn't exist
DO $$ BEGIN
  ALTER TABLE organizations 
    ADD COLUMN created_by uuid REFERENCES auth.users(id);
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "organizations_policy" ON organizations;
DROP POLICY IF EXISTS "organization_members_policy" ON organization_members;

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Create organization policies
CREATE POLICY "Allow insert for authenticated users" ON organizations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow read own organizations" ON organizations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = id
      AND user_id = auth.uid()
    )
  );

-- Create organization members policies
CREATE POLICY "Allow read own memberships" ON organization_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow insert own memberships" ON organization_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create or replace the owner assignment function
CREATE OR REPLACE FUNCTION add_organization_owner()
RETURNS TRIGGER AS $$
BEGIN
  -- Set the created_by field
  NEW.created_by := auth.uid();
  
  -- Insert the owner membership record
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (NEW.id, auth.uid(), 'owner');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_organization_created ON organizations;

-- Create trigger for automatic owner assignment
CREATE TRIGGER on_organization_created
  BEFORE INSERT ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION add_organization_owner();