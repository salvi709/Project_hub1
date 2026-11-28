import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'h-9 w-full appearance-none rounded-md border border-[var(--ph-border)] bg-[var(--ph-bg-card)] pl-3 pr-8 text-sm text-[var(--ph-text-primary)] transition-colors focus-visible:outline-none focus-visible:border-[var(--ph-accent)] focus-visible:ring-2 focus-visible:ring-[var(--ph-accent-soft)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ph-text-secondary)]" />
      </div>
    );
  }
);
Select.displayName = 'Select';
