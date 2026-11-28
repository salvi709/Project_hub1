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
      'flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--ph-border-hover)] bg-[#FAF8FF] px-6 py-10 text-center',
      className
    )}
  >
    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--ph-lavender-soft)] text-[var(--ph-lavender-ink)]">
      {icon}
    </div>
    <h4 className="font-display text-sm font-semibold text-[var(--ph-text-primary)]">{title}</h4>
    <p className="mt-1.5 max-w-md text-xs leading-relaxed text-[var(--ph-text-secondary)]">
      {description}
    </p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);
