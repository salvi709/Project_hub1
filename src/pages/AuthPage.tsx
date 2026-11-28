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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[linear-gradient(135deg,#EEE8FF_0%,#F7F5FF_52%,#FFE8DC_100%)] px-4 py-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <BrandLogo />
        <p className="mt-2.5 text-xs font-medium text-[var(--ph-text-secondary)]">
          Centralized personal project &amp; productivity workspace
        </p>
      </div>

      <AuthForm />
    </div>
  );
};
