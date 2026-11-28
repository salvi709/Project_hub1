import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Database,
  Github,
  Laptop,
  LogOut,
  Moon,
  RotateCcw,
  ShieldAlert,
  Smartphone,
  Sun,
  Trash2,
} from 'lucide-react';
import { env } from '../lib/env';
import { profileService } from '../services/profileService';
import { useAuth } from '../features/auth/AuthContext';
import { useWorkspace } from '../features/workspace/WorkspaceContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';
import type { ThemePreference } from '../types/database';
import { PWAInstallButton } from '../components/layout/PWAInstallButton';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import { useToast } from '../components/ui/ToastProvider';

const NOTIF_PREFS_KEY = 'projecthub-notification-prefs';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const {
    user,
    profile,
    isSupabaseConfigured,
    isPreviewMode,
    displayName,
    displayEmail,
    refreshProfile,
    signOut,
  } = useAuth();
  const { hasSampleData, clearWorkspaceData, restoreSampleData } = useWorkspace();
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [roleTitle, setRoleTitle] = useState(profile?.role_title ?? 'Builder');
  const [saving, setSaving] = useState(false);

  const [dueReminders, setDueReminders] = useState(true);
  const [milestoneAlerts, setMilestoneAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setRoleTitle(profile.role_title ?? 'Builder');
    }
  }, [profile]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(NOTIF_PREFS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.dueReminders === 'boolean') setDueReminders(parsed.dueReminders);
        if (typeof parsed.milestoneAlerts === 'boolean') setMilestoneAlerts(parsed.milestoneAlerts);
        if (typeof parsed.weeklyDigest === 'boolean') setWeeklyDigest(parsed.weeklyDigest);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const updateNotifPref = (
    key: 'dueReminders' | 'milestoneAlerts' | 'weeklyDigest',
    value: boolean
  ) => {
    const next = {
      dueReminders,
      milestoneAlerts,
      weeklyDigest,
      [key]: value,
    };
    setDueReminders(next.dueReminders);
    setMilestoneAlerts(next.milestoneAlerts);
    setWeeklyDigest(next.weeklyDigest);
    try {
      window.localStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    toast({ title: 'Notification preference updated' });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isSupabaseConfigured) {
      toast({
        title: 'Supabase session required',
        description: 'Connect Supabase and sign in to persist profile changes.',
        variant: 'warning',
      });
      return;
    }
    setSaving(true);
    const { error } = await profileService.updateProfile(user.id, {
      full_name: fullName.trim() || null,
      role_title: roleTitle.trim() || null,
      theme_preference: theme,
    });
    setSaving(false);
    if (error) {
      toast({ title: 'Unable to save profile', description: error, variant: 'error' });
    } else {
      await refreshProfile();
      toast({ title: 'Profile updated in Supabase', variant: 'success' });
    }
  };

  const githubUsername =
    profile?.github_username ||
    (user?.user_metadata?.user_name as string | undefined) ||
    null;
  const isGitHubConnected =
    user?.app_metadata?.provider === 'github' || Boolean(githubUsername);

  const themeOptions: {
    value: ThemePreference;
    label: string;
    detail: string;
    icon: React.ReactNode;
  }[] = [
    { value: 'light', label: 'Light', detail: 'Calm #F8F7FC paper surface', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Dark', detail: 'Deep #15131C evening slate', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'System', detail: 'Match OS appearance', icon: <Laptop className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b border-[var(--ph-border)] pb-5">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--ph-text-primary)]">
          Settings
        </h2>
        <p className="mt-1 text-sm text-[var(--ph-text-secondary)]">
          Manage your profile, theme, account status, GitHub integration, notifications, and workspace preferences.
        </p>
      </div>

      {/* 1. Profile */}
      <Card>
        <CardHeader className="border-b border-[var(--ph-border)] pb-4">
          <div>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Identity synced to <code className="font-mono text-[11px]">public.profiles</code> when authenticated.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-[var(--ph-text-muted)]">
                {isSupabaseConfigured && user
                  ? 'Changes save directly to Supabase.'
                  : 'Connect Supabase and sign in to persist profile edits.'}
              </span>
              <Button
                type="submit"
                size="sm"
                variant="outline"
                disabled={!isSupabaseConfigured || !user || saving}
              >
                {saving ? 'Saving...' : 'Save profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2. Appearance */}
      <Card>
        <CardHeader className="border-b border-[var(--ph-border)] pb-4">
          <div>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Switch between Soft Lavender Light, Dark, or follow your system preference.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {themeOptions.map((option) => {
              const selected = theme === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border p-3.5 text-left transition-colors cursor-pointer',
                    selected
                      ? 'border-[var(--ph-accent)] bg-[var(--ph-accent-soft)]'
                      : 'border-[var(--ph-border)] bg-[var(--ph-bg-card)] hover:border-[var(--ph-border-hover)]'
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5',
                      selected ? 'text-[var(--ph-accent-text)]' : 'text-[var(--ph-text-secondary)]'
                    )}
                  >
                    {option.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[var(--ph-text-primary)]">
                      {option.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--ph-text-secondary)]">
                      {option.detail}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 3. Account & Supabase */}
      <Card>
        <CardHeader className="border-b border-[var(--ph-border)] pb-4">
          <div>
            <CardTitle>Account &amp; Supabase</CardTitle>
            <CardDescription>
              Session state and environment configuration (<code className="font-mono text-[11px]">VITE_SUPABASE_URL</code>).
            </CardDescription>
          </div>
          <Database className="h-4 w-4 text-[var(--ph-text-muted)]" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {isSupabaseConfigured ? (
            <div className="flex items-start gap-2.5 rounded-md border border-[var(--ph-border)] bg-[var(--ph-success-soft)] p-3.5 text-xs text-[var(--ph-success)]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">Supabase configured</p>
                <p className="mt-0.5 text-[var(--ph-text-secondary)]">
                  Active account: {displayName} ({displayEmail || 'no active session'})
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 rounded-md border border-[var(--ph-border)] bg-[var(--ph-warning-soft)] p-3.5 text-xs text-[var(--ph-text-secondary)]">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ph-warning)]" />
              <div className="space-y-1">
                <p className="font-semibold text-[var(--ph-warning)]">
                  Supabase Not Configured (Local Preview Mode)
                </p>
                <p>{env.validationIssues.join(' ')}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[var(--ph-text-secondary)]">
              {isPreviewMode ? 'Exploring local preview workspace' : `Signed in as ${displayEmail}`}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await signOut();
                navigate('/login');
              }}
            >
              <LogOut className="h-3.5 w-3.5" />
              {isPreviewMode ? 'Go to Sign In' : 'Sign out'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4. GitHub Integration */}
      <Card>
        <CardHeader className="border-b border-[var(--ph-border)] pb-4">
          <div>
            <CardTitle>GitHub Integration</CardTitle>
            <CardDescription>OAuth identity and repository linking status</CardDescription>
          </div>
          <Badge variant={isGitHubConnected ? 'success' : 'neutral'}>
            {isGitHubConnected ? `Connected · @${githubUsername ?? 'github'}` : 'Not connected'}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--ph-text-secondary)]">
            {isGitHubConnected
              ? 'GitHub provider linked to your Supabase user session.'
              : 'Connect GitHub via Supabase OAuth from the GitHub page or Sign In screen.'}
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate('/github')}>
            <Github className="h-3.5 w-3.5" />
            Open GitHub view
          </Button>
        </CardContent>
      </Card>

      {/* 5. Notifications */}
      <Card>
        <CardHeader className="border-b border-[var(--ph-border)] pb-4">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose which workspace reminders are highlighted</CardDescription>
          </div>
          <Bell className="h-4 w-4 text-[var(--ph-text-muted)]" />
        </CardHeader>
        <CardContent className="divide-y divide-[var(--ph-border)] pt-2">
          <div className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-medium text-[var(--ph-text-primary)]">
                Tasks due today reminders
              </p>
              <p className="text-xs text-[var(--ph-text-secondary)]">
                Highlight overdue and due-today tasks in Overview and header popover.
              </p>
            </div>
            <Switch
              checked={dueReminders}
              onCheckedChange={(v) => updateNotifPref('dueReminders', v)}
              aria-label="Toggle tasks due today reminders"
            />
          </div>

          <div className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-medium text-[var(--ph-text-primary)]">
                Project milestone alerts
              </p>
              <p className="text-xs text-[var(--ph-text-secondary)]">
                Surface approaching project target deadlines.
              </p>
            </div>
            <Switch
              checked={milestoneAlerts}
              onCheckedChange={(v) => updateNotifPref('milestoneAlerts', v)}
              aria-label="Toggle project milestone alerts"
            />
          </div>

          <div className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-medium text-[var(--ph-text-primary)]">
                Weekly summary digest
              </p>
              <p className="text-xs text-[var(--ph-text-secondary)]">
                Summarize completed tasks and open milestones at week end.
              </p>
            </div>
            <Switch
              checked={weeklyDigest}
              onCheckedChange={(v) => updateNotifPref('weeklyDigest', v)}
              aria-label="Toggle weekly summary digest"
            />
          </div>
        </CardContent>
      </Card>

      {/* 6. Application Preferences & Sample Data */}
      <Card>
        <CardHeader className="border-b border-[var(--ph-border)] pb-4">
          <div>
            <CardTitle>Application Preferences</CardTitle>
            <CardDescription>
              Progressive Web App installability and local workspace sample controls
            </CardDescription>
          </div>
          <Smartphone className="h-4 w-4 text-[var(--ph-text-muted)]" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--ph-text-primary)]">
                Installable Web App (PWA)
              </p>
              <p className="text-xs text-[var(--ph-text-secondary)]">
                Network status:{' '}
                <span className={isOnline ? 'text-[var(--ph-success)]' : 'text-[var(--ph-warning)]'}>
                  {isOnline ? 'Online' : 'Offline (shell cached)'}
                </span>
              </p>
            </div>
            <PWAInstallButton />
          </div>

          <div className="border-t border-[var(--ph-border)] pt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--ph-text-primary)]">
                Sample Starter Workspace
              </p>
              <p className="text-xs text-[var(--ph-text-secondary)]">
                {hasSampleData
                  ? 'Sample projects, tasks, and notes are loaded in browser storage.'
                  : 'Workspace is using your custom records or empty state.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  restoreSampleData();
                  toast({ title: 'Sample data restored', variant: 'success' });
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restore sample data
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearWorkspaceData();
                  toast({ title: 'Workspace cleared', description: 'Showing clean empty states.' });
                }}
                className="text-[var(--ph-error)]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear all data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
