import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
  schema: './lib/db/schema/*',
  out: './lib/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;