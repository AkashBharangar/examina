import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type FormFieldProps = {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

export function FormField({ label, helperText, error, required, className, children }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <div className="flex items-center gap-1.5">
          <span className="text-caption font-medium text-foreground">{label}</span>
          {required ? <span className="text-caption text-muted-foreground">*</span> : null}
        </div>
      ) : null}
      {children}
      {error ? <p className="text-caption text-destructive">{error}</p> : helperText ? <p className="text-caption text-muted-foreground">{helperText}</p> : null}
    </div>
  );
}
