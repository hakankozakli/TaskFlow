-- Create a function to handle organization creation with proper error handling
CREATE OR REPLACE FUNCTION create_organization(
  p_name TEXT,
  p_industry TEXT,
  p_size TEXT,
  p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_org_id UUID;
  v_org_record RECORD;
BEGIN
  -- Input validation
  IF p_name IS NULL OR LENGTH(TRIM(p_name)) = 0 THEN
    RAISE EXCEPTION 'Organization name is required';
  END IF;

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
  RETURNING id INTO v_org_id;

  -- Create organization membership
  INSERT INTO user_organizations (
    user_id,
    organization_id,
    is_primary
  ) VALUES (
    p_user_id,
    v_org_id,
    true
  );

  -- Update user's primary organization
  UPDATE users
  SET 
    primary_organization_id = v_org_id,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Return created organization
  SELECT INTO v_org_record *
  FROM organizations
  WHERE id = v_org_id;

  RETURN row_to_json(v_org_record);

EXCEPTION WHEN OTHERS THEN
  -- Roll back any changes
  RAISE EXCEPTION 'Failed to create organization: %', SQLERRM;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_organization TO authenticated;