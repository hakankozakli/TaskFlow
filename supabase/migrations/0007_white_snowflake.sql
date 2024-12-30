/*
  # Fix Supabase Authentication

  1. Changes
    - Update existing demo user instead of deleting
    - Ensure all required auth fields are present
    - Maintain referential integrity with projects table
*/

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set up demo user with password
DO $$ 
DECLARE
  demo_user_id uuid := 'd0d54aa8-6c4c-4cf3-9259-cc880b6c3bc5';
BEGIN
  -- Update existing user or insert if not exists
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
    recovery_token,
    email_change_token_current,
    email_change_token_new,
    confirmation_sent_at
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
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Demo User"}'::jsonb,
    false,
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex'),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    last_sign_in_at = EXCLUDED.last_sign_in_at,
    raw_app_meta_data = EXCLUDED.raw_app_meta_data,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = now(),
    confirmation_token = EXCLUDED.confirmation_token,
    recovery_token = EXCLUDED.recovery_token,
    email_change_token_current = EXCLUDED.email_change_token_current,
    email_change_token_new = EXCLUDED.email_change_token_new;

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