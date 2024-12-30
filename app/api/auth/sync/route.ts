import { createServerSupabaseClient } from '@/lib/auth/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerSupabaseClient();
    const { event, session } = await request.json();

    if (event === 'SIGNED_IN') {
      // Update user's last active timestamp
      await supabase
        .from('users')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', session.user.id);

      // Set auth cookie
      const response = NextResponse.json({ success: true });
      const { data: { session: newSession } } = await supabase.auth.getSession();
      
      if (newSession) {
        response.cookies.set('sb-access-token', newSession.access_token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
      }

      return response;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session sync error:', error);
    return NextResponse.json({ error: 'Failed to sync session' }, { status: 500 });
  }
}