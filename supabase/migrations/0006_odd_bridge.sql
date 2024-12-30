/*
  # Fix authentication setup

  1. Changes
    - Properly configure auth.users table
    - Set up demo user with correct authentication fields
    - Ensure password is properly hashed
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
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  )
  VALUES (
    demo_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo@taskflow.com',
    crypt('demo1234', gen_salt('bf')),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Demo User"}',
    false,
    now(),
    now(),
    '',
    ''
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    raw_app_meta_data = EXCLUDED.raw_app_meta_data,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = now();

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