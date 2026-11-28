import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs text-[var(--ph-accent-text)]">404</p>
      <h2 className="mt-2 text-2xl font-semibold text-[var(--ph-text-primary)]">
        Page not found
      </h2>
      <p className="mt-2 max-w-md text-sm text-[var(--ph-text-secondary)]">
        The requested workspace route does not exist in ProjectHub.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button asChild variant="outline" size="sm">
          <Link to="/overview">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Overview</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link to="/">Home</Link>
        </Button>
      </div>
    </div>
  );
};
