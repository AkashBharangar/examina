import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  helperText?: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, label, helperText, error, id, children, ...props },
  ref,
) {
  const selectId = id ?? props.name;

  return (
    <FormField label={label} helperText={helperText} error={error}>
      <select
        ref={ref}
        id={selectId}
        aria-invalid={Boolean(error)}
        className={cn('field-base focus-ring pr-10', className)}
        {...props}
      >
        {children}
      </select>
    </FormField>
  );
});

