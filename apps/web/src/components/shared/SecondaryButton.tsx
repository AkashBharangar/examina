import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type SecondaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function SecondaryButton({ className, type = 'button', ...props }: SecondaryButtonProps) {
  return (
    <button
      type={type}
      className={cn('pill-button focus-ring border border-border bg-surface text-foreground hover:bg-muted/60 active:scale-[0.99]', className)}
      {...props}
    />
  );
}
