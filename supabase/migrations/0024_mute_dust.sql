-- Drop existing function
DROP FUNCTION IF EXISTS create_organization;

-- Create improved organization creation function with better transaction handling
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
BEGIN
  -- Input validation
  IF p_name IS NULL OR LENGTH(TRIM(p_name)) = 0 THEN
    RAISE EXCEPTION 'Organization name is required';
  END IF;

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