import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Database,
  Github,
  LogOut,
  RotateCcw,
  ShieldAlert,
  Smartphone,
  Trash2,
  User,
} from 'lucide-react';
import { env } from '../lib/env';
import { profileService } from '../services/profileService';
import { useAuth } from '../features/auth/AuthContext';
import { useWorkspace } from '../features/workspace/WorkspaceContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { PWAInstallButton } from '../components/layout/PWAInstallButton';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import { useToast } from '../components/ui/ToastProvider';

const NOTIF_PREFS_KEY = 'projecthub-notification-prefs';

export const SettingsPage: React.FC = () => {
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
      theme_preference: 'light',
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

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b border-[var(--ph-border)] pb-5">
        <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--ph-text-primary)]">
          Settings
        </h2>
        <p className="mt-1 text-sm text-[var(--ph-text-secondary)]">
          Manage your profile, account status, GitHub integration, notifications, and workspace preferences.
        </p>
      </div>

      {/* 1. Profile Settings */}
      <Card>
        <CardHeader className="border-b border-[var(--ph-border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ph-lavender-soft)] text-[var(--ph-lavender-ink)]">
              <User className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Identity synced to <code className="font-mono text-[11px]">public.profiles</code> when authenticated.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
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

      {/* 2. Account & Supabase */}
      <Card>
        <CardHeader className="border-b border-[var(--ph-border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ph-sky-soft)] text-[var(--ph-sky-ink)]">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Supabase authentication session and environment readiness.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          {isSupabaseConfigured ? (
            <div className="flex items-start gap-2.5 rounded-xl bg-[var(--ph-mint-soft)] p-3.5 text-xs text-[var(--ph-mint-ink)]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">Supabase configured</p>
                <p className="mt-0.5 text-[var(--ph-text-secondary)]">
                  Active account: {displayName} ({displayEmail || 'no active session'})
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 rounded-xl bg-[var(--ph-warning-soft)] p-3.5 text-xs text-[var(--ph-text-secondary)]">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#9B6218]" />
              <div className="space-y-1">
                <p className="font-semibold text-[#9B6218]">
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

      {/* 3. GitHub Settings */}
      <Card>
        <CardHeader className="border-b border-[var(--ph-border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ph-peach-soft)] text-[var(--ph-peach-ink)]">
              <Github className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>GitHub Settings</CardTitle>
              <CardDescription>OAuth identity and repository linking status</CardDescription>
            </div>
          </div>
          <Badge variant={isGitHubConnected ? 'mint' : 'neutral'}>
            {isGitHubConnected ? `Connected · @${githubUsername ?? 'github'}` : 'Not connected'}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
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

      {/* 4. Notification Settings */}
      <Card>
        <CardHeader className="border-b border-[var(--ph-border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ph-mint-soft)] text-[var(--ph-mint-ink)]">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Choose which workspace reminders are highlighted</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-[var(--ph-border)] pt-2">
          <div className="flex items-center justify-between gap-4 py-3.5">
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

          <div className="flex items-center justify-between gap-4 py-3.5">
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

          <div className="flex items-center justify-between gap-4 py-3.5">
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

      {/* 5. Application Preferences */}
      <Card>
        <CardHeader className="border-b border-[var(--ph-border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ph-lavender-soft)] text-[var(--ph-lavender-ink)]">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>
                Progressive Web App installability and local workspace sample controls
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--ph-text-primary)]">
                Installable Web App (PWA)
              </p>
              <p className="text-xs text-[var(--ph-text-secondary)]">
                Network status:{' '}
                <span className={isOnline ? 'font-medium text-[var(--ph-mint-ink)]' : 'font-medium text-[#9B6218]'}>
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
                className="text-[#B53D3D]"
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
