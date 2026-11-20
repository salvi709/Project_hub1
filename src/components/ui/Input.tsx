import * as React from 'react';
import { cn } from '../../lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-9 w-full rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-primary)] px-3 py-1.5 text-sm text-[var(--ph-text-primary)] placeholder:text-[var(--ph-text-muted)] transition-colors focus-visible:outline-none focus-visible:border-[var(--ph-accent)] focus-visible:ring-1 focus-visible:ring-[var(--ph-accent)] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
