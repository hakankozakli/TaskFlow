-- Drop existing function if it exists
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
  v_org_id UUID;
  v_org_record RECORD;
BEGIN
  -- Input validation
  IF p_name IS NULL OR LENGTH(TRIM(p_name)) = 0 THEN
    RAISE EXCEPTION 'Organization name is required';
  END IF;

  -- Start transaction
  BEGIN
    -- Generate slug
    v_org_record.slug := LOWER(REGEXP_REPLACE(TRIM(p_name), '[^a-zA-Z0-9]+', '-', 'g'));
    
    -- Create organization
    INSERT INTO organizations (
      name,
      slug,
      industry,
      size,
      created_by
    ) VALUES (
      TRIM(p_name),
      v_org_record.slug,
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

    -- Update user's primary organization
    UPDATE users
    SET 
      updated_at = now()
    WHERE id = p_user_id;

    -- Return created organization
    RETURN row_to_json(v_org_record);
  EXCEPTION 
    WHEN OTHERS THEN
      RAISE EXCEPTION 'Failed to create organization: %', SQLERRM;
  END;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_organization TO authenticated;

-- Create or replace helper function to check organization access
CREATE OR REPLACE FUNCTION check_organization_access(
  p_organization_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_organizations 
    WHERE organization_id = p_organization_id 
    AND user_id = p_user_id
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_organization_access TO authenticated;