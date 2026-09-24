import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function createServerClient(reqHeaders?: Record<string, string>): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  return createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        ...(reqHeaders?.authorization ? { Authorization: reqHeaders.authorization } : {}),
      },
    },
  });
}
