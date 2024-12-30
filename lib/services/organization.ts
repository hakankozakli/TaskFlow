import { supabase } from '@/utils/supabase/client';
import { CreateOrganizationData } from '@/types/organization';

export async function createOrganization(data: CreateOrganizationData) {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error('Authentication required');
    }

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: data.name,
        slug,
        industry: data.industry || null,
        size: data.size || null
      })
      .select()
      .single();

    if (orgError) {
      console.error('Organization creation error:', orgError);
      throw new Error('Failed to create organization');
    }

    // Update user's primary organization
    const { error: userError } = await supabase
      .from('users')
      .update({ primary_organization_id: org.id })
      .eq('id', session.user.id);

    if (userError) {
      console.error('User update error:', userError);
    }

    return org;
  } catch (error: any) {
    console.error('Organization creation error:', error);
    throw error;
  }
}