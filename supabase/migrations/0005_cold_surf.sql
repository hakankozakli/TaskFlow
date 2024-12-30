/*
  # Set up demo user with password

  1. Changes
    - Updates demo user with correct auth.users table structure
    - Ensures password is properly hashed
    - Maintains data consistency
*/

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set up demo user with password
DO $$ 
DECLARE
  demo_user_id uuid := 'd0d54aa8-6c4c-4cf3-9259-cc880b6c3bc5';
BEGIN
  -- Update existing demo user or insert if not exists
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin
  )
  VALUES (
    demo_user_id,
    '00000000-0000-0000-0000-000000000000',
    'demo@taskflow.com',
    crypt('demo1234', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Demo User"}',
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    updated_at = now(),
    raw_app_meta_data = EXCLUDED.raw_app_meta_data,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;

  -- Ensure user exists in public.users table
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (
    demo_user_id,
    'demo@taskflow.com',
    'Demo User',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    updated_at = now();
END $$;