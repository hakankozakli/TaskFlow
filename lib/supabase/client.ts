import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
if (!supabaseKey) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Create a singleton instance
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);

// Export createClient for flexibility
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}