-- Drop existing function
DROP FUNCTION IF EXISTS create_organization;

-- Create improved organization creation function
CREATE OR REPLACE FUNCTION create_organization(
  p_name TEXT,
  p_industry TEXT,
  p_size TEXT,
  p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_record organizations%ROWTYPE;
  v_user_exists BOOLEAN;
BEGIN
  -- Input validation
  IF p_name IS NULL OR LENGTH(TRIM(p_name)) = 0 THEN
    RAISE EXCEPTION 'Organization name is required';
  END IF;

  -- Check if user exists in auth.users
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE id = p_user_id
  ) INTO v_user_exists;

  IF NOT v_user_exists THEN
    RAISE EXCEPTION 'User does not exist';
  END IF;

  -- Ensure user exists in public.users
  INSERT INTO public.users (id, email)
  SELECT id, email FROM auth.users WHERE id = p_user_id
  ON CONFLICT (id) DO NOTHING;

  -- Start explicit transaction
  BEGIN
    -- Create organization
    INSERT INTO organizations (
      name,
      slug,
      industry,
      size,
      created_by
    ) VALUES (
      TRIM(p_name),
      LOWER(REGEXP_REPLACE(TRIM(p_name), '[^a-zA-Z0-9]+', '-', 'g')),
      p_industry,
      p_size,
      p_user_id
    )
    RETURNING * INTO v_org_record;

    -- Create organization membership
    INSERT INTO user_organizations (
      user_id,
      organization_id,
      is_primary,
      role
    ) VALUES (
      p_user_id,
      v_org_record.id,
      true,
      'owner'
    );

    -- Return created organization
    RETURN row_to_json(v_org_record);
  EXCEPTION 
    WHEN OTHERS THEN
      -- Roll back any changes
      RAISE EXCEPTION 'Failed to create organization: %', SQLERRM;
  END;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_organization TO authenticated;

-- Create trigger to sync auth.users with public.users
CREATE OR REPLACE FUNCTION sync_user_on_auth_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_on_auth_change();