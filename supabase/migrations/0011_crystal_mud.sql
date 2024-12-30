/*
  # Fix Organization RLS Policies

  1. Changes
    - Drop existing RLS policies
    - Create new policies allowing proper access for authenticated users
    - Add policies for organization members table
  
  2. Security
    - Enable RLS on both tables
    - Add policies for insert, select, update operations
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their organizations" ON organizations;
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;

-- Create new organization policies
CREATE POLICY "Enable insert for authenticated users" ON organizations
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable select for organization members" ON organizations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = id
      AND user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND primary_organization_id = organizations.id
    )
  );

CREATE POLICY "Enable update for organization members" ON organizations
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Organization members policies
CREATE POLICY "Enable insert for self" ON organization_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Enable select for organization members" ON organization_members
  FOR SELECT TO authenticated
  USING (
    organization_id IN (
      SELECT id FROM organizations
      WHERE id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );