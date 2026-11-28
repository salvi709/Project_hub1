import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-md text-sm font-medium transition-all duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ph-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ph-bg-primary)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--ph-accent)] text-[var(--ph-accent-foreground)] hover:bg-[var(--ph-accent-hover)] font-medium shadow-[var(--ph-shadow-sm)]',
        secondary:
          'bg-[var(--ph-bg-secondary)] text-[var(--ph-text-primary)] border border-[var(--ph-border)] hover:border-[var(--ph-border-hover)] hover:bg-[var(--ph-bg-hover)]',
        outline:
          'border border-[var(--ph-border)] bg-[var(--ph-bg-card)] text-[var(--ph-text-primary)] hover:bg-[var(--ph-bg-hover)] hover:border-[var(--ph-border-hover)]',
        ghost:
          'bg-transparent text-[var(--ph-text-secondary)] hover:text-[var(--ph-text-primary)] hover:bg-[var(--ph-bg-secondary)]',
        subtle:
          'bg-[var(--ph-accent-soft)] text-[var(--ph-accent-text)] hover:opacity-90',
        destructive:
          'bg-[var(--ph-error)] text-white hover:opacity-90',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 py-2 text-sm',
        lg: 'h-10 px-5 text-sm',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
