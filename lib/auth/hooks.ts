'use client';

import { useSession } from './session-provider';
import { getSupabaseClient } from './client';

export function useAuth() {
  const { session, loading, error } = useSession();
  const supabase = getSupabaseClient();

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  return {
    user: session?.user || null,
    session,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!session?.user
  };
}