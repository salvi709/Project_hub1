import React from 'react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--ph-border)] bg-[var(--ph-bg-surface)] px-6 py-12 text-center',
      className
    )}
  >
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-elevated)] text-[var(--ph-text-secondary)]">
      {icon}
    </div>
    <h4 className="font-display text-sm font-semibold text-[var(--ph-text-primary)]">{title}</h4>
    <p className="mt-1.5 max-w-md text-xs leading-relaxed text-[var(--ph-text-secondary)]">
      {description}
    </p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);
