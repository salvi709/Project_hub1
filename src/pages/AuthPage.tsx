import React from 'react';
import { Navigate } from 'react-router-dom';
import { BrandLogo } from '../components/ui/BrandLogo';
import { AuthForm } from '../features/auth/AuthForm';
import { useAuth } from '../features/auth/AuthContext';

export const AuthPage: React.FC = () => {
  const { session, isSupabaseConfigured } = useAuth();

  if (isSupabaseConfigured && session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--ph-bg-primary)] px-4 py-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <BrandLogo />
        <p className="mt-2 text-xs text-[var(--ph-text-muted)]">
          Centralized personal project &amp; productivity workspace
        </p>
      </div>

      <AuthForm />
    </div>
  );
};
