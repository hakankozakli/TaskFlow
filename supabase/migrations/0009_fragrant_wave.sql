-- Add metadata columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS company text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS team_size text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS goals text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Add subscription status to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_period_end timestamptz;

-- Create subscription_changes table for audit
CREATE TABLE IF NOT EXISTS subscription_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  old_status text,
  new_status text,
  changed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscription_changes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own subscription changes"
  ON subscription_changes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);