import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium whitespace-nowrap shrink-0',
  {
    variants: {
      variant: {
        neutral:
          'bg-[var(--ph-bg-secondary)] text-[var(--ph-text-secondary)]',
        accent:
          'bg-[var(--ph-lavender-soft)] text-[var(--ph-lavender-ink)]',
        peach:
          'bg-[var(--ph-peach-soft)] text-[var(--ph-peach-ink)]',
        mint:
          'bg-[var(--ph-mint-soft)] text-[var(--ph-mint-ink)]',
        sky:
          'bg-[var(--ph-sky-soft)] text-[var(--ph-sky-ink)]',
        success:
          'bg-[var(--ph-success-soft)] text-[var(--ph-mint-ink)]',
        warning:
          'bg-[var(--ph-warning-soft)] text-[#9B6218]',
        error:
          'bg-[var(--ph-error-soft)] text-[#B53D3D]',
        info:
          'bg-[var(--ph-info-soft)] text-[var(--ph-sky-ink)]',
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
