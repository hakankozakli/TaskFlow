/*
  # Authentication Setup

  1. Schema Changes
    - Enable pgcrypto for password hashing
    - Create demo user with password

  2. Security
    - Set up secure password for demo user
*/

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create demo user with hashed password
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'demo@taskflow.com'
  ) THEN
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
      is_super_admin,
      role_id
    )
    VALUES (
      'd0d54aa8-6c4c-4cf3-9259-cc880b6c3bc5',
      '00000000-0000-0000-0000-000000000000',
      'demo@taskflow.com',
      crypt('demo1234', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      false,
      (SELECT id FROM auth.roles WHERE name = 'authenticated')
    );
  END IF;
END $$;