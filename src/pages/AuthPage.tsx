import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BrandLogo } from '../components/ui/BrandLogo';
import { AuthForm } from '../features/auth/AuthForm';
import { useAuth } from '../features/auth/AuthContext';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'signin' }) => {
  const { session, isSupabaseConfigured } = useAuth();

  if (isSupabaseConfigured && session) {
    return <Navigate to="/overview" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[linear-gradient(135deg,#EEE8FF_0%,#F7F5FF_52%,#FFE8DC_100%)] px-4 py-10">
      <div className="mb-6 flex flex-col items-center text-center">
        <Link to="/" className="focus-visible:outline-none">
          <BrandLogo />
        </Link>
        <p className="mt-2.5 text-xs font-medium text-[var(--ph-text-secondary)]">
          Centralized personal project &amp; productivity workspace
        </p>
      </div>

      <AuthForm initialMode={initialMode} />

      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ph-text-secondary)] transition-colors hover:text-[var(--ph-accent-hover)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to ProjectHub home</span>
      </Link>
    </div>
  );
};
