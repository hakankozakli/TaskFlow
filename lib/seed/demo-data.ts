import { supabaseAdmin } from '@/lib/db/admin';

export async function seedDemoData() {
  const demoUser = {
    email: 'demo@taskflow.com',
    password: 'demo1234',
  };

  try {
    // Create demo user with admin client
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: demoUser.email,
      password: demoUser.password,
      email_confirm: true,
    });

    if (userError) {
      throw userError;
    }

    console.log('✅ Demo user created successfully');
    
    return {
      email: demoUser.email,
      password: demoUser.password,
    };
  } catch (error: any) {
    console.error('Error seeding demo data:', error.message);
    throw error;
  }
}