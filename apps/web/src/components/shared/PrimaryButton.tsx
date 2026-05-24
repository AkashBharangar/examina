import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({ className, type = 'button', ...props }: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={cn('pill-button focus-ring bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.99]', className)}
      {...props}
    />
  );
}
