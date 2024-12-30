import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface AuthError {
  message: string;
}

export async function signIn(email: string, password: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    const authError = error as AuthError;
    toast.error(authError.message);
    return { data: null, error };
  }
}

export async function signOut() {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    const authError = error as AuthError;
    toast.error(authError.message);
    return { error };
  }
}

export async function getSession() {
  try {
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    return { session: null, error };
  }
}