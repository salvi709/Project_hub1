import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    authService.getSession().then(({ session, error: sessionError }) => {
      if (!active) return;
      if (sessionError) {
        setError(sessionError);
        return;
      }
      if (session || !authService.isConfigured()) {
        navigate('/overview', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    });

    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--ph-bg-primary)] px-4">
      <div className="max-w-sm space-y-4 text-center">
        {error ? (
          <>
            <h1 className="text-lg font-semibold text-[var(--ph-error)]">
              Authentication Callback Error
            </h1>
            <p className="text-xs text-[var(--ph-text-secondary)]">{error}</p>
            <Button size="sm" variant="outline" onClick={() => navigate('/login')}>
              Return to Sign In
            </Button>
          </>
        ) : (
          <>
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[var(--ph-border)] border-t-[var(--ph-accent)]" />
            <p className="text-sm text-[var(--ph-text-secondary)]">
              Completing authentication redirect...
            </p>
          </>
        )}
      </div>
    </div>
  );
};
