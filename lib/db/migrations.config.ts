import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema/*',
  out: './lib/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  },
} satisfies Config;