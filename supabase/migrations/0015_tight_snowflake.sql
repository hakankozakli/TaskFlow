-- Add created_by column if it doesn't exist
ALTER TABLE organizations 
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- Drop existing policies
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON organizations;
DROP POLICY IF EXISTS "Allow read own organizations" ON organizations;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users" ON organizations
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read for organization members" ON organizations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = id
      AND user_id = auth.uid()
    )
  );

-- Update owner function
CREATE OR REPLACE FUNCTION add_organization_owner()
RETURNS TRIGGER AS $$
BEGIN
  -- Set created_by
  NEW.created_by := auth.uid();
  
  -- Create owner membership
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (NEW.id, auth.uid(), 'owner');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_organization_created ON organizations;
CREATE TRIGGER on_organization_created
  BEFORE INSERT ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION add_organization_owner();