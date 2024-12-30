'use client';

import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { DEMO_CREDENTIALS } from '@/lib/constants/auth';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();

        // If no session, try demo login
        if (!session) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: DEMO_CREDENTIALS.email,
            password: DEMO_CREDENTIALS.password,
          });

          if (!error) {
            setSession(data.session);
            setUser(data.user);
          }
        } else {
          setSession(session);
          setUser(session.user);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return {
    session,
    user,
    loading,
  };
}