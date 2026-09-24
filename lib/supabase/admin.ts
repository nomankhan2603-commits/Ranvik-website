import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Server-only elevated client with Service Role Key
// CRITICAL: Never import this into frontend / client code!
let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (typeof window !== 'undefined') {
    throw new Error('FATAL: Attempted to invoke Supabase Service Role client in the browser!');
  }

  if (!adminClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.warn('[Supabase Admin] SUPABASE_SERVICE_ROLE_KEY or URL not defined in environment.');
      return null;
    }

    adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return adminClient;
}
