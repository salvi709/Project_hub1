import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { env } from '../../lib/env';
import { authService } from '../../services/authService';
import { profileService } from '../../services/profileService';
import type { Profile } from '../../types/database';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  /** True only when Supabase credentials are absent and user is exploring the UI preview */
  isPreviewMode: boolean;
  isAuthenticatedOrPreview: boolean;
  displayName: string;
  displayEmail: string;
  signOut: () => Promise<void>;
  enterPreviewMode: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const PREVIEW_SIGNED_OUT_KEY = 'projecthub-preview-signed-out';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(env.isSupabaseConfigured);
  const [previewSignedOut, setPreviewSignedOut] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem(PREVIEW_SIGNED_OUT_KEY) === 'true';
  });

  const isSupabaseConfigured = env.isSupabaseConfigured;
  const isPreviewMode = !isSupabaseConfigured && !previewSignedOut;

  const loadProfile = useCallback(async (userId: string) => {
    const { profile: fetched } = await profileService.getProfile(userId);
    setProfile(fetched);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    authService.getSession().then(({ session: activeSession }) => {
      if (!mounted) return;
      setSession(activeSession);
      setUser(activeSession?.user ?? null);
      if (activeSession?.user) {
        loadProfile(activeSession.user.id).finally(() => {
          if (mounted) setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    const { unsubscribe } = authService.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [isSupabaseConfigured, loadProfile]);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await authService.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
    } else {
      window.sessionStorage.setItem(PREVIEW_SIGNED_OUT_KEY, 'true');
      setPreviewSignedOut(true);
    }
  }, [isSupabaseConfigured]);

  const enterPreviewMode = useCallback(() => {
    window.sessionStorage.removeItem(PREVIEW_SIGNED_OUT_KEY);
    setPreviewSignedOut(false);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user.id);
    }
  }, [user, loadProfile]);

  const displayName =
    profile?.full_name ||
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    (isPreviewMode ? 'Workspace Preview' : 'User');

  const displayEmail =
    profile?.email ||
    user?.email ||
    (isPreviewMode ? 'Unconfigured · Local UI Preview' : '');

  const isAuthenticatedOrPreview = isSupabaseConfigured ? Boolean(session) : isPreviewMode;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      isLoading,
      isSupabaseConfigured,
      isPreviewMode,
      isAuthenticatedOrPreview,
      displayName,
      displayEmail,
      signOut,
      enterPreviewMode,
      refreshProfile,
    }),
    [
      user,
      session,
      profile,
      isLoading,
      isSupabaseConfigured,
      isPreviewMode,
      isAuthenticatedOrPreview,
      displayName,
      displayEmail,
      signOut,
      enterPreviewMode,
      refreshProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
