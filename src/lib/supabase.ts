import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

let supabaseInstance: SupabaseClient | null = null;

if (env.isSupabaseConfigured) {
  supabaseInstance = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'projecthub-auth-session',
    },
  });
}

export const supabase = supabaseInstance;

export function requireSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    throw new Error(
      'Supabase client is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.'
    );
  }
  return supabaseInstance;
}
