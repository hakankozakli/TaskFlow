import { supabaseAdmin } from './supabase-admin';
import { DEMO_CREDENTIALS } from '../constants/auth';

export async function resetDemoUser() {
  try {
    // Delete existing demo user if exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(
      DEMO_CREDENTIALS.email
    );

    if (existingUser?.user) {
      await supabaseAdmin.auth.admin.deleteUser(existingUser.user.id);
    }

    // Create fresh demo user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
      email_confirm: true,
      user_metadata: {
        name: 'Demo User'
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to reset demo user:', error);
    throw error;
  }
}