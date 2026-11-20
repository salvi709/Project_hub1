import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { env } from '../lib/env';
import { supabase } from '../lib/supabase';

export interface AuthResult {
  error: string | null;
  user?: User | null;
  session?: Session | null;
  requiresEmailConfirmation?: boolean;
}

const NOT_CONFIGURED_MESSAGE =
  'Supabase is not configured. Supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to test live authentication.';

export const authService = {
  isConfigured(): boolean {
    return env.isSupabaseConfigured && supabase !== null;
  },

  async getSession(): Promise<{ session: Session | null; error: string | null }> {
    if (!supabase) {
      return { session: null, error: null };
    }
    const { data, error } = await supabase.auth.getSession();
    return {
      session: data.session,
      error: error ? error.message : null,
    };
  },

  async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    if (!supabase) {
      return { error: NOT_CONFIGURED_MESSAGE };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      return { error: error.message };
    }
    return { error: null, user: data.user, session: data.session };
  },

  async signUpWithEmail(email: string, password: string, fullName?: string): Promise<AuthResult> {
    if (!supabase) {
      return { error: NOT_CONFIGURED_MESSAGE };
    }
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: fullName?.trim() ? { full_name: fullName.trim() } : undefined,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      return { error: error.message };
    }
    return {
      error: null,
      user: data.user,
      session: data.session,
      requiresEmailConfirmation: !data.session,
    };
  },

  async signInWithGitHub(): Promise<AuthResult> {
    if (!supabase) {
      return { error: NOT_CONFIGURED_MESSAGE };
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'read:user user:email',
      },
    });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  },

  async signOut(): Promise<{ error: string | null }> {
    if (!supabase) {
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    return { error: error ? error.message : null };
  },

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    if (!supabase) {
      return { unsubscribe: () => {} };
    }
    const { data } = supabase.auth.onAuthStateChange(callback);
    return {
      unsubscribe: () => data.subscription.unsubscribe(),
    };
  },
};
