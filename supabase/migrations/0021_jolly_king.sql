/*
  # Add SaaS and Admin Features

  1. New Tables
    - subscriptions: For managing subscription plans and billing
    - subscription_features: For feature flags and limits
    - billing_details: For storing billing information
    - audit_logs: For tracking system changes
    - admin_settings: For global system configuration
    - feature_flags: For managing feature availability

  2. Changes
    - Add subscription-related fields to organizations
    - Add billing fields to users

  3. Security
    - RLS policies for all new tables
    - Admin-only access controls
*/

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  interval text NOT NULL DEFAULT 'month',
  stripe_price_id text UNIQUE,
  features jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES subscription_plans(id),
  status text NOT NULL DEFAULT 'inactive',
  stripe_subscription_id text UNIQUE,
  stripe_customer_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  canceled_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create billing details table
CREATE TABLE IF NOT EXISTS billing_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  company_name text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text,
  vat_number text,
  billing_email text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id),
  stripe_invoice_id text UNIQUE,
  amount numeric(10,2) NOT NULL,
  status text NOT NULL,
  paid_at timestamptz,
  invoice_pdf_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create feature flags table
CREATE TABLE IF NOT EXISTS feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  enabled boolean DEFAULT false,
  rules jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create organization feature flags table
CREATE TABLE IF NOT EXISTS organization_features (
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  feature_id uuid REFERENCES feature_flags(id) ON DELETE CASCADE,
  enabled boolean DEFAULT false,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (organization_id, feature_id)
);

-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  changes jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add subscription-related fields to organizations
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS max_users integer,
ADD COLUMN IF NOT EXISTS max_projects integer,
ADD COLUMN IF NOT EXISTS max_storage_gb integer;

-- Add billing fields to users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS last_active_at timestamptz;

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
DO $$ BEGIN
  -- Subscription plans policies
  CREATE POLICY "Everyone can view active plans"
    ON subscription_plans FOR SELECT
    USING (is_active = true);

  CREATE POLICY "Only admins can manage plans"
    ON subscription_plans FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND is_admin = true
      )
    );

  -- Subscriptions policies
  CREATE POLICY "Organizations can view own subscriptions"
    ON subscriptions FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM user_organizations
        WHERE organization_id = subscriptions.organization_id
        AND user_id = auth.uid()
      )
    );

  -- Billing details policies
  CREATE POLICY "Organizations can manage own billing details"
    ON billing_details FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM user_organizations
        WHERE organization_id = billing_details.organization_id
        AND user_id = auth.uid()
      )
    );

  -- Invoices policies
  CREATE POLICY "Organizations can view own invoices"
    ON invoices FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM user_organizations
        WHERE organization_id = invoices.organization_id
        AND user_id = auth.uid()
      )
    );

  -- Feature flags policies
  CREATE POLICY "Only admins can manage feature flags"
    ON feature_flags FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND is_admin = true
      )
    );

  -- Organization features policies
  CREATE POLICY "Organizations can view own features"
    ON organization_features FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM user_organizations
        WHERE organization_id = organization_features.organization_id
        AND user_id = auth.uid()
      )
    );

  -- Audit logs policies
  CREATE POLICY "Organizations can view own audit logs"
    ON audit_logs FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM user_organizations
        WHERE organization_id = audit_logs.organization_id
        AND user_id = auth.uid()
      )
    );

  -- Admin settings policies
  CREATE POLICY "Only admins can manage settings"
    ON admin_settings FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND is_admin = true
      )
    );

EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create function to handle subscription changes
CREATE OR REPLACE FUNCTION handle_subscription_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update organization limits based on plan
  UPDATE organizations
  SET
    max_users = (NEW.plan_id::jsonb->>'max_users')::integer,
    max_projects = (NEW.plan_id::jsonb->>'max_projects')::integer,
    max_storage_gb = (NEW.plan_id::jsonb->>'max_storage_gb')::integer,
    updated_at = now()
  WHERE id = NEW.organization_id;

  -- Log the change
  INSERT INTO audit_logs (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    changes
  ) VALUES (
    NEW.organization_id,
    auth.uid(),
    CASE
      WHEN TG_OP = 'INSERT' THEN 'subscription_created'
      WHEN TG_OP = 'UPDATE' THEN 'subscription_updated'
      ELSE TG_OP
    END,
    'subscription',
    NEW.id::text,
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  );

  RETURN NEW;
END;
$$;

-- Create trigger for subscription changes
CREATE TRIGGER on_subscription_change
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION handle_subscription_change();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_org_id ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_billing_details_org_id ON billing_details(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_org_id ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_org_features_org_id ON organization_features(organization_id);