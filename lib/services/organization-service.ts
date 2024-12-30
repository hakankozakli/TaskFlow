'use client';

import { db } from '@/lib/db/client';
import { CreateOrganizationData } from '@/types/organization';

export async function createOrganization(data: CreateOrganizationData) {
  try {
    const { data: { session } } = await db.auth.getSession();
    
    if (!session?.user) {
      throw new Error('Authentication required');
    }

    // First ensure user exists in public.users
    const { error: userError } = await db
      .from('users')
      .upsert({
        id: session.user.id,
        email: session.user.email
      });

    if (userError) {
      console.error('User sync error:', userError);
      throw new Error('Failed to sync user data');
    }

    // Call the RPC function to create organization
    const { data: org, error } = await db.rpc('create_organization', {
      p_name: data.name.trim(),
      p_industry: data.industry || null,
      p_size: data.size || null,
      p_user_id: session.user.id
    });

    if (error) {
      console.error('Organization creation error:', error);
      throw new Error(error.message);
    }

    if (!org) {
      throw new Error('Failed to create organization');
    }

    // Refresh session to get updated organization info
    await db.auth.refreshSession();

    return org;
  } catch (error: any) {
    console.error('Organization creation error:', error);
    throw new Error(error.message || 'Failed to create organization');
  }
}

export async function getOrganizations() {
  try {
    const { data: { session } } = await db.auth.getSession();
    
    if (!session?.user) {
      throw new Error('Authentication required');
    }

    const { data, error } = await db
      .from('organizations')
      .select(`
        *,
        user_organizations!inner (
          role,
          is_primary
        )
      `)
      .eq('user_organizations.user_id', session.user.id);

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Failed to fetch organizations:', error);
    throw error;
  }
}