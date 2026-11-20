import { supabase } from '../lib/supabase';
import type { Profile, ThemePreference } from '../types/database';

export interface ProfileUpdateInput {
  full_name?: string | null;
  role_title?: string | null;
  github_username?: string | null;
  theme_preference?: ThemePreference;
  timezone?: string;
}

export const profileService = {
  async getProfile(userId: string): Promise<{ profile: Profile | null; error: string | null }> {
    if (!supabase) {
      return { profile: null, error: 'Supabase is not configured.' };
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      return { profile: null, error: error.message };
    }
    return { profile: data as Profile | null, error: null };
  },

  async updateProfile(
    userId: string,
    updates: ProfileUpdateInput
  ): Promise<{ profile: Profile | null; error: string | null }> {
    if (!supabase) {
      return { profile: null, error: 'Supabase is not configured.' };
    }
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      return { profile: null, error: error.message };
    }
    return { profile: data as Profile, error: null };
  },
};
