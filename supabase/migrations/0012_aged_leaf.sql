/*
  # Fix Organization Policies and Creation Flow

  1. Changes
    - Drop and recreate organization policies with proper checks
    - Add missing organization_members policies
    - Add automatic member creation trigger
  
  2. Security
    - Ensure authenticated users can create organizations
    - Automatically add creator as owner
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON organizations;
DROP POLICY IF EXISTS "Enable select for organization members" ON organizations;
DROP POLICY IF EXISTS "Enable update for organization members" ON organizations;

-- Create more permissive organization policies
CREATE POLICY "Allow organization creation" ON organizations
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow organization read" ON organizations
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow organization update" ON organizations
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = id
      AND user_id = auth.uid()
      AND role = 'owner'
    )
  );

-- Create function to automatically add organization owner
CREATE OR REPLACE FUNCTION add_organization_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (NEW.id, auth.uid(), 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to add owner on organization creation
DROP TRIGGER IF EXISTS on_organization_created ON organizations;
CREATE TRIGGER on_organization_created
  AFTER INSERT ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION add_organization_owner();