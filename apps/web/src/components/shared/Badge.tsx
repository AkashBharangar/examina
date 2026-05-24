import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'outline';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-muted text-foreground',
  success: 'border border-emerald-100 bg-emerald-50 text-emerald-700',
  warning: 'border border-amber-100 bg-amber-50 text-amber-700',
  outline: 'border border-border bg-surface text-muted-foreground',
};

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center rounded-pill px-3 py-1 text-caption font-medium', variantStyles[variant], className)}
      {...props}
    />
  );
}
