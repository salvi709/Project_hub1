import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading, isAuthenticatedOrPreview } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--ph-bg-primary)] text-[var(--ph-text-secondary)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-[var(--ph-border)] border-t-[var(--ph-accent)]" />
          <p className="text-sm">Verifying workspace session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticatedOrPreview) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
