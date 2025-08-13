import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  (process.env.NEXT_PUBLIC_SUPABASE_URL as string);

const SUPABASE_SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE ??
  (process.env.SUPABASE_SERVICE_ROLE_KEY as string);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.warn('[Supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE env vars.');
}

/** Server-side admin client. NEVER import into `use client` components. */
export const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE!, {
  auth: { persistSession: false }
});
