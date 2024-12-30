import { supabase } from '@/lib/supabase/client';

export async function getUserFromRequest(req: any) {
  const token = req.headers.get("authorization")?.split(' ')[1];
  if (!token) return null;

  const { data: user, error } = await supabase.auth.getUser(token);
  if (error) return null;

  return user;
}
