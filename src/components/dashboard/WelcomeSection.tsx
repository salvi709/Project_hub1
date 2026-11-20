import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Info } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { formatFullDate } from '../../utils/formatters';
import { Button } from '../ui/Button';

export const WelcomeSection: React.FC = () => {
  const { displayName, isSupabaseConfigured } = useAuth();
  const todayLabel = formatFullDate(new Date());

  return (
    <section className="flex flex-col gap-4 border-b border-[var(--ph-border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <p className="font-mono text-xs text-[var(--ph-text-muted)]">{todayLabel}</p>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--ph-text-primary)] sm:text-[28px]">
          Welcome back, {displayName}
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--ph-text-secondary)]">
          <Info className="h-3.5 w-3.5 shrink-0 text-[var(--ph-accent)]" />
          <span>
            Showing sample preview data for Phase 1 UI validation.
            {!isSupabaseConfigured && ' Connect Supabase credentials in .env to persist real workspace records.'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Button asChild variant="outline" size="sm">
          <Link to="/projects">
            <span>Browse Projects</span>
          </Link>
        </Button>
        <Button asChild variant="primary" size="sm">
          <Link to="/tasks">
            <span>Open Task Queue</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </section>
  );
};
