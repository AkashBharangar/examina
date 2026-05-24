import { forwardRef, type ReactNode } from 'react';
import type { InputHTMLAttributes } from 'react';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  leadingIcon?: ReactNode;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, helperText, id, leadingIcon, error, ...props },
  ref,
) {
  const inputId = id ?? props.name;

  return (
    <FormField label={label} helperText={helperText} error={error}>
      <span className="relative block">
        {leadingIcon ? <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground">{leadingIcon}</span> : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          className={cn('field-base focus-ring', leadingIcon && 'pl-11', className)}
          {...props}
        />
      </span>
    </FormField>
  );
});

