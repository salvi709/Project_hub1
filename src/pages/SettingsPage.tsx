import React, { useState } from 'react';
import { CheckCircle2, Database, Monitor, Moon, ShieldAlert, Smartphone, Sun } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { env } from '../lib/env';
import { profileService } from '../services/profileService';
import { cn } from '../lib/utils';
import type { ThemePreference } from '../types/database';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { PWAInstallButton } from '../components/layout/PWAInstallButton';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, profile, isSupabaseConfigured, displayName, displayEmail, refreshProfile } =
    useAuth();
  const isOnline = useOnlineStatus();

  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [roleTitle, setRoleTitle] = useState(profile?.role_title ?? 'Builder');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isSupabaseConfigured) {
      setSaveMessage('Connect Supabase and sign in to persist profile changes.');
      return;
    }
    setSaving(true);
    setSaveMessage(null);
    const { error } = await profileService.updateProfile(user.id, {
      full_name: fullName.trim() || null,
      role_title: roleTitle.trim() || null,
      theme_preference: theme,
    });
    setSaving(false);
    if (error) {
      setSaveMessage(`Unable to save profile: ${error}`);
    } else {
      await refreshProfile();
      setSaveMessage('Profile updated in Supabase.');
    }
  };

  const themeOptions: { value: ThemePreference; label: string; icon: React.ReactNode }[] = [
    { value: 'dark', label: 'Obsidian Dark', icon: <Moon className="h-3.5 w-3.5" /> },
    { value: 'light', label: 'Clean Light', icon: <Sun className="h-3.5 w-3.5" /> },
    { value: 'system', label: 'System', icon: <Monitor className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-[var(--ph-border)] pb-5">
        <h2 className="font-display text-xl font-semibold text-[var(--ph-text-primary)]">
          Workspace Settings
        </h2>
        <p className="mt-1 text-xs text-[var(--ph-text-secondary)]">
          Configure appearance, inspect Supabase environment readiness, and manage PWA installation.
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Appearance &amp; Theme</CardTitle>
            <CardDescription className="mt-0.5">
              Default theme is Obsidian Green (#050505). Theme tokens support dark and light modes.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer',
                  theme === option.value
                    ? 'border-[var(--ph-accent)] bg-[var(--ph-accent-soft)] text-[var(--ph-accent)]'
                    : 'border-[var(--ph-border)] bg-[var(--ph-bg-primary)] text-[var(--ph-text-secondary)] hover:border-[var(--ph-border-hover)] hover:text-[var(--ph-text-primary)]'
                )}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supabase Configuration & Auth Status */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Supabase &amp; Authentication Status</CardTitle>
            <CardDescription className="mt-0.5">
              Client-side environment verification using VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
            </CardDescription>
          </div>
          <Database className="h-4 w-4 text-[var(--ph-text-muted)]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {isSupabaseConfigured ? (
            <div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3.5 text-xs text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-medium">Supabase environment variables detected</p>
                <p className="mt-1 text-[var(--ph-text-secondary)]">
                  Signed in as {displayName} ({displayEmail || 'no active session'}).
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3.5 text-xs text-[var(--ph-text-secondary)]">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <div className="space-y-1">
                <p className="font-medium text-amber-300">
                  Supabase Not Configured (UI Preview Mode)
                </p>
                <ul className="list-disc pl-4 space-y-0.5">
                  {env.validationIssues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
                <p className="pt-1 text-[var(--ph-text-muted)]">
                  See README.md for SQL migration steps and GitHub OAuth setup instructions.
                </p>
              </div>
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
            <div className="space-y-1.5">
              <label htmlFor="profile-name" className="text-xs font-medium text-[var(--ph-text-secondary)]">
                Full Name
              </label>
              <Input
                id="profile-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={displayName}
                disabled={!isSupabaseConfigured || !user}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-role" className="text-xs font-medium text-[var(--ph-text-secondary)]">
                Role Title
              </label>
              <Input
                id="profile-role"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="Builder"
                disabled={!isSupabaseConfigured || !user}
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between gap-4">
              <span className="text-xs text-[var(--ph-text-muted)]">
                {saveMessage ??
                  (isSupabaseConfigured && user
                    ? 'Updates persist directly to public.profiles.'
                    : 'Profile persistence activates once authenticated with Supabase.')}
              </span>
              <Button
                type="submit"
                size="sm"
                variant="secondary"
                disabled={!isSupabaseConfigured || !user || saving}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* PWA & Offline Shell Status */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Progressive Web App (PWA)</CardTitle>
            <CardDescription className="mt-0.5">
              Application-shell caching and home screen installability via vite-plugin-pwa.
            </CardDescription>
          </div>
          <Smartphone className="h-4 w-4 text-[var(--ph-text-muted)]" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-xs text-[var(--ph-text-secondary)]">
            <p>
              Network status:{' '}
              <span className={isOnline ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                {isOnline ? 'Online' : 'Offline (cached shell active)'}
              </span>
            </p>
            <p className="text-[var(--ph-text-muted)]">
              Phase 1 caches static application shell assets. Full offline data synchronization is
              not implemented in Phase 1.
            </p>
          </div>
          <PWAInstallButton />
        </CardContent>
      </Card>
    </div>
  );
};
