-- Add organization fields to users table if they don't exist
DO $$ 
BEGIN
  -- Add primary_organization_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'primary_organization_id'
  ) THEN
    ALTER TABLE users ADD COLUMN primary_organization_id uuid REFERENCES organizations(id);
  END IF;

  -- Add is_primary to user_organizations if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_organizations' AND column_name = 'is_primary'
  ) THEN
    ALTER TABLE user_organizations ADD COLUMN is_primary boolean DEFAULT false;
  END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_primary_org ON users(primary_organization_id);
CREATE INDEX IF NOT EXISTS idx_user_orgs_is_primary ON user_organizations(user_id, is_primary);

-- Update RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  -- Users can read their own data
  CREATE POLICY "Users can read own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

  -- Users can update their own data
  CREATE POLICY "Users can update own data"
    ON users FOR UPDATE
    USING (auth.uid() = id);

EXCEPTION
  WHEN duplicate_object THEN null;
END $$;