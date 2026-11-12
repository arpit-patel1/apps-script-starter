import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva('rounded-md border px-4 py-3 text-sm font-medium', {
  variants: {
    variant: {
      default: 'border-border bg-muted/50 text-foreground',
      success: 'border-success/30 bg-success/10 text-success',
      destructive: 'border-destructive/30 bg-destructive/10 text-destructive',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export function Alert({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>) {
  return <div role="status" aria-live="polite" className={cn(alertVariants({ variant }), className)} {...props} />;
}
