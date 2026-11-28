import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Github, KeyRound, Mail } from 'lucide-react';
import { env } from '../../lib/env';
import { authService } from '../../services/authService';
import { useAuth } from './AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/Tabs';

interface AuthFormProps {
  initialMode?: 'signin' | 'signup';
}

export const AuthForm: React.FC<AuthFormProps> = ({ initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const { isSupabaseConfigured, enterPreviewMode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!isSupabaseConfigured) {
      setErrorMessage(
        'Live authentication is unavailable until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured.'
      );
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signin') {
        const result = await authService.signInWithEmail(email, password);
        if (result.error) {
          setErrorMessage(result.error);
        } else {
          navigate('/overview');
        }
      } else {
        const result = await authService.signUpWithEmail(email, password, fullName);
        if (result.error) {
          setErrorMessage(result.error);
        } else if (result.requiresEmailConfirmation) {
          setInfoMessage('Check your inbox for a confirmation link to activate your account.');
        } else {
          navigate('/overview');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGitHubAuth = async () => {
    setErrorMessage(null);
    setInfoMessage(null);
    if (!isSupabaseConfigured) {
      setErrorMessage(
        'GitHub OAuth requires valid Supabase credentials and GitHub provider configuration.'
      );
      return;
    }
    const result = await authService.signInWithGitHub();
    if (result.error) {
      setErrorMessage(result.error);
    }
  };

  const handleEnterPreview = () => {
    enterPreviewMode();
    navigate('/overview');
  };

  return (
    <Card className="w-full max-w-md p-6 sm:p-7">
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--ph-text-primary)]">
          {mode === 'signin' ? 'Sign in to ProjectHub' : 'Create your workspace'}
        </h2>
        <p className="mt-1 text-xs text-[var(--ph-text-secondary)]">
          Authenticate via Supabase Email or GitHub OAuth.
        </p>
      </div>

      {!isSupabaseConfigured ? (
        <div className="mb-5 rounded-md border border-[var(--ph-border)] bg-[var(--ph-warning-soft)] p-3.5 text-xs text-[var(--ph-text-secondary)]">
          <div className="flex items-start gap-2.5">
            <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ph-warning)]" />
            <div className="space-y-1">
              <p className="font-semibold text-[var(--ph-warning)]">
                Supabase credentials not configured
              </p>
              <p className="leading-relaxed">
                Authentication is prepared in code, but {env.validationIssues.join(' ')} Supply valid
                credentials in <code className="font-mono text-[11px]">.env</code> to enable live sign-in.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-5 flex items-center gap-2 rounded-md border border-[var(--ph-border)] bg-[var(--ph-success-soft)] px-3 py-2 text-xs text-[var(--ph-success)]">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>Supabase client configured · Ready for session verification</span>
        </div>
      )}

      <Tabs value={mode} onValueChange={(v) => setMode(v as 'signin' | 'signup')} className="mb-5">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Create Account</TabsTrigger>
        </TabsList>
      </Tabs>

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-md border border-[var(--ph-border)] bg-[var(--ph-error-soft)] px-3 py-2.5 text-xs text-[var(--ph-error)]"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {infoMessage && (
        <div
          role="status"
          className="mb-4 flex items-start gap-2 rounded-md border border-[var(--ph-border)] bg-[var(--ph-success-soft)] px-3 py-2.5 text-xs text-[var(--ph-success)]"
        >
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{infoMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div className="space-y-1.5">
            <label htmlFor="auth-fullname" className="block text-xs font-medium text-[var(--ph-text-secondary)]">
              Full name
            </label>
            <Input
              id="auth-fullname"
              type="text"
              placeholder="Sarthak Salvi"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="auth-email" className="block text-xs font-medium text-[var(--ph-text-secondary)]">
            Email address
          </label>
          <Input
            id="auth-email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="auth-password" className="block text-xs font-medium text-[var(--ph-text-secondary)]">
            Password
          </label>
          <Input
            id="auth-password"
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          <Mail className="h-4 w-4" />
          <span>
            {submitting
              ? 'Processing...'
              : mode === 'signin'
              ? 'Sign in with Email'
              : 'Create account with Email'}
          </span>
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--ph-border)]" />
        <span className="text-[11px] text-[var(--ph-text-muted)]">or continue with</span>
        <div className="h-px flex-1 bg-[var(--ph-border)]" />
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={handleGitHubAuth}>
        <Github className="h-4 w-4" />
        <span>Continue with GitHub</span>
      </Button>

      {!isSupabaseConfigured && (
        <div className="mt-5 border-t border-[var(--ph-border)] pt-4">
          <Button
            type="button"
            variant="subtle"
            className="w-full text-xs"
            onClick={handleEnterPreview}
          >
            Continue to Local UI Preview Workspace
          </Button>
        </div>
      )}
    </Card>
  );
};
