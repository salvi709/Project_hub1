import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium whitespace-nowrap shrink-0',
  {
    variants: {
      variant: {
        neutral: 'bg-[var(--ph-bg-secondary)] text-[var(--ph-text-secondary)] border border-[var(--ph-border)]',
        accent: 'bg-[var(--ph-accent-soft)] text-[var(--ph-accent-text)]',
        success: 'bg-[var(--ph-success-soft)] text-[var(--ph-success)]',
        warning: 'bg-[var(--ph-warning-soft)] text-[var(--ph-warning)]',
        error: 'bg-[var(--ph-error-soft)] text-[var(--ph-error)]',
        info: 'bg-[var(--ph-info-soft)] text-[var(--ph-info)]',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge: React.FC<BadgeProps> = ({ className, variant, ...props }) => {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
};
