import * as React from 'react';
import { cn } from '../../lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[88px] w-full rounded-md border border-[var(--ph-border)] bg-[var(--ph-bg-card)] px-3 py-2 text-sm text-[var(--ph-text-primary)] placeholder:text-[var(--ph-text-muted)] transition-colors focus-visible:outline-none focus-visible:border-[var(--ph-accent)] focus-visible:ring-2 focus-visible:ring-[var(--ph-accent-soft)] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
