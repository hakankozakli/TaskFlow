/*
  # Add Organizations Schema
  
  1. New Tables
    - organizations
      - id (uuid, primary key)
      - name (text, required)
      - slug (text, unique)
      - industry (text)
      - size (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - organization_members
      - organization_id (uuid, references organizations)
      - user_id (uuid, references auth.users)
      - role (text)
      - created_at (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for organization access
*/

-- Create organizations table
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  industry text,
  size text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create organization_members junction table
CREATE TABLE organization_members (
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (organization_id, user_id)
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = organizations.id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create organizations"
  ON organizations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Organization members can view membership"
  ON organization_members FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can join organizations"
  ON organization_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for organizations
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add organization_id to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS primary_organization_id uuid REFERENCES organizations(id);